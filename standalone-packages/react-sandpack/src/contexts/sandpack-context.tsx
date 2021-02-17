import * as React from 'react';
import {
  Manager,
  generatePackageJSON,
  IManagerState,
  IModuleError,
  IFiles,
} from 'smooshpack';

import {
  SandpackContext,
  SandboxEnviornment,
  SandpackListener,
  SandpackState,
  FileResolver,
  SandpackStatus,
  EditorState,
} from '../types';

const Sandpack = React.createContext<SandpackContext | null>(null);

export interface State {
  files: IFiles;
  activePath: string;
  openPaths: string[];
  bundlerState: IManagerState | undefined;
  error: Partial<IModuleError> | null;
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
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
  };

  manager: Manager | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  loadingDivRef: React.RefObject<HTMLDivElement>;
  unsubscribe?: Function;
  debounceHook?: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      files: generatePackageJSON(props.files, props.dependencies, props.entry),
      openPaths: props.openPaths || [props.entry],
      activePath: props.activePath || props.openPaths?.[0] || props.entry,
      bundlerState: undefined,
      error: null,
      sandpackStatus: 'idle',
      editorState: 'pristine',
    };

    this.manager = null;
    this.iframeRef = React.createRef<HTMLIFrameElement>();
    this.loadingDivRef = React.createRef<HTMLDivElement>();
  }

  handleMessage = (m: any) => {
    if (m.type === 'state') {
      this.setState({ bundlerState: m.state });
    } else if (m.type === 'done' && !m.compilatonError) {
      this.setState({ error: null });
    } else if (m.type === 'action' && m.action === 'show-error') {
      const { title, path, message, line, column } = m;
      this.setState({
        error: { title, path, message, line, column },
      });
    } else if (
      m.type === 'action' &&
      m.action === 'notification' &&
      m.notificationType === 'error'
    ) {
      this.setState({
        error: { message: m.title },
      });
    }
  };

  updateCurrentFile = (newCode: string) => {
    if (newCode === this.state.files[this.state.activePath]?.code) {
      return;
    }

    const { files, activePath, sandpackStatus } = this.state;
    const { recompileMode, recompileDelay } = this.props;

    const newFiles = {
      ...files,
      [activePath]: { code: newCode },
    };

    this.setState({ files: newFiles });

    if (sandpackStatus !== 'running') {
      return;
    }

    if (recompileMode === 'immediate') {
      if (!this.manager) {
        return;
      }

      this.manager.updatePreview({
        files: newFiles,
        showOpenInCodeSandbox: false,
      });
    }

    if (recompileMode === 'delayed') {
      window.clearTimeout(this.debounceHook);
      this.debounceHook = window.setTimeout(() => {
        if (!this.manager) {
          return;
        }

        this.manager.updatePreview({
          files: this.state.files,
          showOpenInCodeSandbox: false,
        });
      }, recompileDelay);
    }
  };

  componentDidMount() {
    if (this.props.autorun) {
      const options = {
        rootMargin: '600px 0px',
        threshold: 1.0,
      };

      const observer = new IntersectionObserver(entries => {
        if (
          entries[0]?.intersectionRatio === 1 &&
          this.state.sandpackStatus === 'idle'
        ) {
          this.runSandpack();
        }
      }, options);
      observer.observe(this.loadingDivRef.current!);
    } else {
      this.setState({ sandpackStatus: 'idle' });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      JSON.stringify(prevProps.files) !== JSON.stringify(this.props.files) ||
      prevProps.dependencies !== this.props.dependencies ||
      prevProps.entry !== this.props.entry ||
      prevProps.environment !== this.props.environment
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
        files: newFiles,
        template: this.props.environment,
        showOpenInCodeSandbox: false,
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
        showOpenInCodeSandbox: false,
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
    this.setState({ activePath: path, editorState: 'dirty' });
  };

  openFile = (path: string) => {
    this.setState(({ openPaths }) => {
      const newPaths = openPaths.includes(path)
        ? openPaths
        : [...openPaths, path];

      return {
        activePath: path,
        openPaths: newPaths,
        editorState: 'dirty',
      };
    });
  };

  dispatchMessage = (message: any) => {
    if (this.manager === null) {
      console.warn('dispatch cannot be called while in idle mode');
      return;
    }

    this.manager.dispatch(message);
  };

  addListener = (listener: SandpackListener) => {
    if (this.manager === null) {
      console.warn('sandpack listener cannot be attached while in idle mode');
      return () => {};
    }

    return this.manager.listen(listener);
  };

  _getSandpackState = (): SandpackContext => {
    const {
      files,
      activePath,
      openPaths,
      bundlerState,
      editorState,
      error,
      sandpackStatus,
    } = this.state;

    return {
      files,
      openPaths,
      activePath,
      error,
      bundlerState,
      status: sandpackStatus,
      editorState,
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
        <div id="loading-frame" ref={this.loadingDivRef}>
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
            listen={listen}
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
