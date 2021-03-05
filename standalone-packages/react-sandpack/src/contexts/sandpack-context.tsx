import * as React from 'react';
import { Manager, IManagerState, IModuleError, IFiles } from 'smooshpack';

import {
  SandpackContext,
  SandboxEnvironment,
  SandpackListener,
  FileResolver,
  SandpackStatus,
  EditorState,
  SandpackPredefinedTemplate,
  SandpackSetup,
} from '../types';
import { getSandpackStateFromProps } from '../utils/sandpack-utils';
import { generateRandomId } from '../utils/string-utils';

const Sandpack = React.createContext<SandpackContext | null>(null);

export interface SandpackProviderState {
  files: IFiles;
  environment?: SandboxEnvironment;
  activePath: string;
  openPaths: string[];
  bundlerState: IManagerState | undefined;
  error: Partial<IModuleError> | null;
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
  renderHiddenIframe: boolean;
}

export interface SandpackProviderProps {
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;

  // editor state (override values)
  activePath?: string;
  openPaths?: string[];

  // execution and recompile
  recompileMode?: 'immediate' | 'delayed';
  recompileDelay?: number;
  autorun?: boolean;

  // bundler options
  bundlerURL?: string;
  skipEval?: boolean;
  fileResolver?: FileResolver;
}

class SandpackProvider extends React.PureComponent<
  SandpackProviderProps,
  SandpackProviderState
> {
  static defaultProps = {
    skipEval: false,
    recompileMode: 'delayed',
    recompileDelay: 500,
    autorun: true,
  };

  manager: Manager | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  lazyAnchorRef: React.RefObject<HTMLDivElement>;

  errorScreenRegistered: React.MutableRefObject<boolean>;
  openInCSBRegistered: React.MutableRefObject<boolean>;
  loadingScreenRegistered: React.MutableRefObject<boolean>;

  intersectionObserver?: IntersectionObserver;
  queuedListeners: Record<string, SandpackListener>;
  unsubscribeQueuedListeners: Record<string, Function>;
  unsubscribe?: Function;
  debounceHook?: number;

  constructor(props: SandpackProviderProps) {
    super(props);

    const {
      activePath,
      openPaths,
      files,
      environment,
    } = getSandpackStateFromProps(props);

    this.state = {
      files,
      environment,
      openPaths,
      activePath,
      bundlerState: undefined,
      error: null,
      sandpackStatus: this.props.autorun ? 'initial' : 'idle',
      editorState: 'pristine',
      renderHiddenIframe: false,
    };

    this.manager = null;
    this.queuedListeners = {};
    this.unsubscribeQueuedListeners = {};
    this.iframeRef = React.createRef<HTMLIFrameElement>();
    this.lazyAnchorRef = React.createRef<HTMLDivElement>();
    this.errorScreenRegistered = React.createRef<
      boolean
    >() as React.MutableRefObject<boolean>;
    this.openInCSBRegistered = React.createRef<
      boolean
    >() as React.MutableRefObject<boolean>;
    this.loadingScreenRegistered = React.createRef<
      boolean
    >() as React.MutableRefObject<boolean>;
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
        });
      }, recompileDelay);
    }
  };

  componentDidMount() {
    if (!this.props.autorun) {
      return;
    }

    if (this.lazyAnchorRef.current) {
      // If any component registerd a lazy anchor ref component, use that for the intersection observer
      const options = {
        rootMargin: '600px 0px',
        threshold: 0,
      };

      this.intersectionObserver = new IntersectionObserver(entries => {
        if (
          entries[0]?.intersectionRatio > 0 &&
          this.state.sandpackStatus === 'initial'
        ) {
          // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
          setTimeout(() => this.runSandpack());
        }
      }, options);

      this.intersectionObserver.observe(this.lazyAnchorRef.current);
    } else {
      // else run the sandpack on the spot
      setTimeout(() => this.runSandpack());
    }
  }

  componentDidUpdate(prevProps: SandpackProviderProps) {
    if (
      prevProps.template !== this.props.template ||
      prevProps.activePath !== this.props.activePath ||
      JSON.stringify(prevProps.openPaths) !==
        JSON.stringify(this.props.openPaths) ||
      JSON.stringify(prevProps.customSetup) !==
        JSON.stringify(this.props.customSetup)
    ) {
      const {
        activePath,
        openPaths,
        files,
        environment,
      } = getSandpackStateFromProps(this.props);

      /* eslint-disable react/no-did-update-set-state */
      this.setState({ activePath, openPaths, files, environment });

      if (this.state.sandpackStatus !== 'running' || !this.manager) {
        return;
      }

      this.manager.updatePreview({
        files,
        template: environment,
      });
    }
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  runSandpack = () => {
    const iframe = this.iframeRef.current;
    if (!iframe) {
      // If no component mounts an iframe, the context will render a hidden one, mount it and run sandpack on it
      this.setState({ renderHiddenIframe: true }, this.runSandpack);

      return;
    }

    this.manager = new Manager(
      iframe,
      {
        files: this.state.files,
        template: this.state.environment,
      },
      {
        bundlerURL: this.props.bundlerURL,
        fileResolver: this.props.fileResolver,
        skipEval: this.props.skipEval,
        showOpenInCodeSandbox: !this.openInCSBRegistered.current,
        showErrorScreen: !this.errorScreenRegistered.current,
        showLoadingScreen: !this.loadingScreenRegistered.current,
      }
    );

    this.unsubscribe = this.manager.listen(this.handleMessage);

    // Register any potential listeners that subscribed before sandpack ran
    Object.keys(this.queuedListeners).forEach(listenerId => {
      const listener = this.queuedListeners[listenerId];
      const unsubscribe = this.manager!.listen(listener);
      this.unsubscribeQueuedListeners[listenerId] = unsubscribe;
    });

    // Clear the queued listeners after they were registered
    this.queuedListeners = {};
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
      // When listeners are added before the manager is instantiated, they are stored with an unique id
      // When the manager is eventually instantiated, the listeners are registered on the spot
      // Their unsubscribe functions are stored in unsubscribeQueuedListeners for future cleanup
      const listenerId = generateRandomId();
      this.queuedListeners[listenerId] = listener;
      return () => {
        if (this.queuedListeners[listenerId]) {
          // unsubscribe was called before the manager was instantiated
          // common example - a component with autorun=false that unmounted
          delete this.queuedListeners[listenerId];
        } else if (this.unsubscribeQueuedListeners[listenerId]) {
          // unsubscribe was called for a listener that got added before the manager was instantiated
          // call the unsubscribe function and remove it from memory
          this.unsubscribeQueuedListeners[listenerId]();
          delete this.unsubscribeQueuedListeners[listenerId];
        }
      };
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
      updateCurrentFile: this.updateCurrentFile,
      runSandpack: this.runSandpack,
      dispatch: this.dispatchMessage,
      listen: this.addListener,
      iframeRef: this.iframeRef,
      lazyAnchorRef: this.lazyAnchorRef,
      errorScreenRegisteredRef: this.errorScreenRegistered,
      openInCSBRegisteredRef: this.openInCSBRegistered,
      loadingScreenRegisteredRef: this.loadingScreenRegistered,
    };
  };

  render() {
    const { children } = this.props;
    const { renderHiddenIframe } = this.state;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        {renderHiddenIframe && (
          <iframe
            title="Sandpack"
            ref={this.iframeRef}
            style={{ display: 'none' }}
          />
        )}
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

export {
  SandpackProvider,
  SandpackConsumer,
  withSandpack,
  Sandpack as SandpackReactContext,
};
