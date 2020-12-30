import React, {
  createContext,
  createRef,
  useContext,
  PureComponent,
} from 'react';
import { Manager, generatePackageJSON } from 'smooshpack';
import { listen } from 'codesandbox-api';

import {
  IFiles,
  IManagerState,
  ISandpackContext,
  IModuleError,
  IFile,
  SandboxEnvironment,
} from '../types';

const SandpackContext = createContext<ISandpackContext | null>(null);

export interface State {
  files: IFiles;
  activePath: string;
  openPaths: string[];
  managerState: IManagerState | undefined;
  errors: Array<IModuleError>;
}

export interface Props {
  showOpenInCodeSandbox?: boolean;
  files: IFiles;
  activePath?: string;
  entry: string;
  openPaths?: string[];
  dependencies?: Record<string, string>;
  bundlerURL?: string;
  skipEval?: boolean;
  template?: SandboxEnvironment;
  fileResolver?: {
    isFile: (path: string) => Promise<boolean>;
    readFile: (path: string) => Promise<string>;
  };
}

class SandpackProvider extends PureComponent<Props, State> {
  static defaultProps = {
    skipEval: false,
  };

  manager?: Manager;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  unsubscribe: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      files: generatePackageJSON(props.files, props.dependencies, props.entry),
      openPaths: props.openPaths || [props.entry],
      activePath: props.activePath || props.openPaths?.[0] || props.entry,
      managerState: undefined,
      errors: [],
    };

    this.iframeRef = createRef<HTMLIFrameElement>();
    this.unsubscribe = listen(this.handleMessage);
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

  getOptions = () => ({
    bundlerURL: this.props.bundlerURL,
    fileResolver: this.props.fileResolver,
    skipEval: this.props.skipEval,
  });

  updateCurrentFile = (file: IFile) => {
    if (file.code !== this.state.files[this.state.activePath]?.code) {
      this.updateFiles({
        ...this.state.files,
        [this.state.activePath]: file,
      });
    }
  };

  updateFiles = (files: IFiles) => {
    this.setState({ files });

    if (this.manager) {
      this.manager.updatePreview({
        showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
        files,
        template: this.props.template,
      });
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
        template: this.props.template,
        showOpenInCodeSandbox: this.props.showOpenInCodeSandbox,
      },
      this.getOptions()
    );
  }

  componentDidUpdate(props: Props) {
    if (
      props.files !== this.props.files ||
      props.dependencies !== this.props.dependencies ||
      props.entry !== this.props.entry ||
      props.template !== this.props.template
    ) {
      const newFiles = generatePackageJSON(
        this.props.files,
        this.props.dependencies,
        this.props.entry
      );

      this.updateFiles(newFiles);
    }

    if (this.manager && this.props.skipEval !== props.skipEval) {
      this.manager.updateOptions(this.getOptions());
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
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

  dispatchMessage = (message: any) => this.manager?.dispatch(message);

  _getSandpackState = (): ISandpackContext => {
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
      updateFiles: this.updateFiles,
      updateCurrentFile: this.updateCurrentFile,
      dispatch: this.dispatchMessage,
    };
  };

  render() {
    const { children } = this.props;

    // TODO: remove div after iframe is moved to Preview
    return (
      <SandpackContext.Provider value={this._getSandpackState()}>
        <div>
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
          {children}
        </div>
      </SandpackContext.Provider>
    );
  }
}

const SandpackConsumer = SandpackContext.Consumer;

function getDisplayName(
  WrappedComponent: React.ComponentClass<any> | React.FC<any>
) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function useSandpack() {
  const sandpack = useContext(SandpackContext);

  if (sandpack === null) {
    throw new Error(
      `useSandpack can only be used inside components wrapped by 'SandpackProvider'`
    );
  }

  const { dispatch, ...rest } = sandpack;

  return {
    sandpack: { ...rest },
    dispatch:
      dispatch ??
      (() => {
        throw new Error('dispatch was called before sandpack could initialize');
      }),
    listen,
  };
}

function withSandpack(Component: React.ComponentClass<any> | React.FC<any>) {
  const WrappedComponent = (props: any) => (
    <SandpackConsumer>
      {sandpack => <Component {...props} sandpack={sandpack} />}
    </SandpackConsumer>
  );

  WrappedComponent.displayName = `WithSandpack(${getDisplayName(Component)})`;

  return WrappedComponent;
}

export {
  SandpackProvider,
  SandpackConsumer,
  SandpackContext,
  withSandpack,
  useSandpack,
};
