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
  SandpackStatus,
} from '../types';

const Sandpack = React.createContext<SandpackContext | null>(null);

export interface State {
  files: IFiles;
  activePath: string;
  openPaths: string[];
  bundlerState: IManagerState | undefined;
  errors: Array<IModuleError>;
  sandpackStatus: SandpackStatus;
}

export interface Props {
  // setup/input
  files: IFiles;
  activePath?: string;
  entry: string;
  openPaths?: string[];
  dependencies?: Record<string, string>;
  environment?: SandboxEnviornment;

  // execution and recompile
  recompileMode?: 'immediate' | 'delayed'; // | 'onCommand'; TODO: implement run on command
  recompileDelay?: number;
  autorun?: boolean;

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
    recompileMode: 'delayed',
    recompileDelay: 500,
    autorun: true,
    showOpenInCodeSandbox: false,
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
      bundlerState: undefined,
      errors: [],
      sandpackStatus: 'idle',
    };

    this.iframeRef = React.createRef<HTMLIFrameElement>();
  }

  handleMessage = (m: any) => {
    if (m.type === 'state') {
      this.setState({ bundlerState: m.state });
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
    const { recompileMode, recompileDelay } = this.props;

    this.setState({ files });

    if (this.state.sandpackStatus !== 'running') {
      return;
    }

    if (recompileMode === 'immediate') {
      if (!this.manager) {
        return;
      }

      this.manager.updatePreview({
        showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
        files,
        template: this.props.environment,
      });
    }

    if (recompileMode === 'delayed') {
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
      }, recompileDelay);
    }
  };

  componentDidMount() {
    if (this.props.autorun) {
      this.runSandpack();
    } else {
      this.setState({ sandpackStatus: 'idle' });
    }
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

      /* eslint-disable react/no-did-update-set-state */
      this.setState({ files: newFiles });

      if (this.state.sandpackStatus !== 'running' || !this.manager) {
        return;
      }

      this.manager.updatePreview({
        showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
        files: newFiles,
        template: this.props.environment,
      });
    }
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  runSandpack = () => {
    if (!this.iframeRef.current) {
      throw new Error(
        'Sandpack iframe was not initialized. Check the render function of <SandpackProvider>'
      );
    }

    this.manager = new Manager(
      this.iframeRef.current,
      {
        files: this.state.files,
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
    this.setState({ sandpackStatus: 'running' });
  };

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
    if (this.state.sandpackStatus !== 'running') {
      console.warn('dispatch cannot be called while in idle mode');
      return;
    }

    this.manager!.dispatch(message);
  };

  addListener = (listener: SandpackListener) => {
    if (this.state.sandpackStatus !== 'running') {
      console.warn('sandpack listener cannot be attached while in idle mode');
      return () => {};
    }

    return this.manager!.listen(listener);
  };

  _getSandpackState = (): SandpackContext => {
    const {
      files,
      activePath,
      openPaths,
      bundlerState,
      errors,
      sandpackStatus,
    } = this.state;

    return {
      files,
      openPaths,
      activePath,
      errors,
      bundlerState,
      status: sandpackStatus,
      changeActiveFile: this.changeActiveFile,
      openFile: this.openFile,
      browserFrame: this.iframeRef.current,
      updateCurrentFile: this.updateCurrentFile,
      runSandpack: this.runSandpack,
      dispatch: this.dispatchMessage,
      listen: this.addListener,
    };
  };

  render() {
    const { children } = this.props;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        <div id="loading-frame">
          <iframe
            ref={this.iframeRef}
            title="Sandpack Preview"
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
        {children}
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
