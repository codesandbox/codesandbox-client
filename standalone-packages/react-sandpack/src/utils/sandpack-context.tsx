import * as React from 'react';
import {
  Manager,
  generatePackageJSON,
  IManagerState,
  IModuleError,
  IFiles,
  IFile,
} from 'smooshpack';

import {
  SandpackContext,
  SandboxEnviornment,
  SandpackListener,
  SandpackState,
  FileResolver,
} from '../types';

const Sandpack = React.createContext<SandpackContext | null>(null);

export interface State {
  files: IFiles;
  activePath: string;
  openPaths: string[];
  managerState: IManagerState | undefined;
  errors: Array<IModuleError>;
  initialized: boolean;
}

export interface Props {
  // setup
  files: IFiles;
  activePath?: string;
  entry: string;
  openPaths?: string[];
  dependencies?: Record<string, string>;
  environment?: SandboxEnviornment;

  // execution options
  compileMode?: 'immediate' | 'delayed'; // | 'onCommand'; TODO: implement run on command
  compileDelay?: number;

  // legacy: will be moved to Preview
  showOpenInCodeSandbox?: boolean;

  // bundler options
  bundlerURL?: string;
  skipEval?: boolean;
  fileResolver?: FileResolver;
}

class SandpackProvider extends React.PureComponent<Props, State> {
  static defaultProps = {
    skipEval: false,
    compileMode: 'delayed',
    compileDelay: 500,
  };

  manager?: Manager;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  unsubscribe?: Function;
  debounceHook?: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      files: generatePackageJSON(props.files, props.dependencies, props.entry),
      openPaths: props.openPaths || [props.entry],
      activePath: props.activePath || props.openPaths?.[0] || props.entry,
      managerState: undefined,
      errors: [],
      initialized: false,
    };

    this.iframeRef = React.createRef<HTMLIFrameElement>();
  }

  handleMessage = (m: any) => {
    if (m.type === 'state') {
      this.setState({ managerState: m.state });
    } else if (m.type === 'start') {
      this.setState({ errors: [] });
    } else if (m.type === 'action' && m.action === 'show-error') {
      const { title, path, message, line, column } = m;
      this.setState(state => ({
        errors: [...state.errors, { title, path, message, line, column }],
      }));
    }
  };

  updateCurrentFile = (file: IFile) => {
    if (file.code === this.state.files[this.state.activePath]?.code) {
      return;
    }

    this.commitFiles({
      ...this.state.files,
      [this.state.activePath]: file,
    });
  };

  commitFiles = (files: IFiles) => {
    const { compileMode, compileDelay } = this.props;

    this.setState({ files });

    if (compileMode === 'immediate') {
      if (!this.manager) {
        return;
      }

      this.manager.updatePreview({
        showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
        files,
        template: this.props.environment,
      });
    }

    if (compileMode === 'delayed') {
      window.clearTimeout(this.debounceHook);
      this.debounceHook = window.setTimeout(() => {
        if (!this.manager) {
          return;
        }

        this.manager.updatePreview({
          showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
          files: this.state.files,
          template: this.props.environment,
        });
      }, compileDelay);
    }
  };

  componentDidMount() {
    if (!this.iframeRef.current) {
      throw new Error(
        'Sandpack iframe was not initialized. Check the render function of <SandpackProvider>'
      );
    }

    this.manager = new Manager(
      this.iframeRef.current,
      {
        files: generatePackageJSON(
          this.props.files,
          this.props.dependencies,
          this.props.entry
        ),
        template: this.props.environment,
        showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
      },
      {
        bundlerURL: this.props.bundlerURL,
        fileResolver: this.props.fileResolver,
        skipEval: this.props.skipEval,
      }
    );

    this.unsubscribe = this.manager.listen(this.handleMessage);
    this.setState({ initialized: true });
  }

  componentDidUpdate(props: Props) {
    if (
      JSON.stringify(props.files) !== JSON.stringify(this.props.files) ||
      props.dependencies !== this.props.dependencies ||
      props.entry !== this.props.entry ||
      props.environment !== this.props.environment
    ) {
      const newFiles = generatePackageJSON(
        this.props.files,
        this.props.dependencies,
        this.props.entry
      );

      this.commitFiles(newFiles);
    }

    if (this.manager && this.props.skipEval !== props.skipEval) {
      this.manager.updateOptions({
        skipEval: this.props.skipEval,
      });
    }
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  changeActiveFile = (path: string) => {
    this.setState({ activePath: path });
  };

  openFile = (path: string) => {
    this.setState(({ openPaths }) => {
      const newPaths = openPaths.includes(path)
        ? openPaths
        : [...openPaths, path];

      return {
        activePath: path,
        openPaths: newPaths,
      };
    });
  };

  dispatchMessage = (message: any) => {
    if (!this.manager) {
      throw new Error('dispatch was called before sandpack initialized');
    }

    return this.manager.dispatch(message);
  };

  addListener = (listener: SandpackListener) => {
    if (!this.manager) {
      throw new Error('listen was called before sandpack initialized');
    }

    return this.manager.listen(listener);
  };

  _getSandpackState = (): SandpackContext => {
    const { files, activePath, openPaths, managerState, errors } = this.state;

    return {
      files,
      openPaths,
      activePath,
      errors,
      managerState,
      changeActiveFile: this.changeActiveFile,
      openFile: this.openFile,
      browserFrame: this.iframeRef.current,
      updateCurrentFile: this.updateCurrentFile,
      dispatch: this.dispatchMessage,
      listen: this.addListener,
    };
  };

  render() {
    const { children } = this.props;
    const { initialized } = this.state;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        <div id="loading-frame">
          <iframe
            ref={this.iframeRef}
            title="sandpack-sandbox"
            style={{
              width: 0,
              height: 0,
              border: 0,
              outline: 0,
              position: 'absolute',
              visibility: 'hidden',
            }}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            src={this.props.bundlerURL}
          />
        </div>
        {/* children are rendered only after the iframe is mounted */}
        {initialized && children}
      </Sandpack.Provider>
    );
  }
}

const SandpackConsumer = Sandpack.Consumer;

function getDisplayName(
  WrappedComponent: React.ComponentClass<any> | React.FC<any>
) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function useSandpack() {
  const sandpack = React.useContext(Sandpack);

  if (sandpack === null) {
    throw new Error(
      `useSandpack can only be used inside components wrapped by 'SandpackProvider'`
    );
  }

  const { dispatch, listen, ...rest } = sandpack;

  return {
    sandpack: { ...rest } as SandpackState,
    dispatch,
    listen,
  };
}

function withSandpack(Component: React.ComponentClass<any> | React.FC<any>) {
  const WrappedComponent = (props: any) => (
    <SandpackConsumer>
      {sandpack => {
        if (sandpack === null) {
          throw new Error(
            `withSandpack can only be used inside components wrapped by 'SandpackProvider'`
          );
        }

        const { dispatch, listen, ...rest } = sandpack;

        return (
          <Component
            {...props}
            dispatch={dispatch}
            listen={dispatch}
            sandpack={rest}
          />
        );
      }}
    </SandpackConsumer>
  );

  WrappedComponent.displayName = `WithSandpack(${getDisplayName(Component)})`;

  return WrappedComponent;
}

export { SandpackProvider, SandpackConsumer, withSandpack, useSandpack };
