import React from 'react';
import { Sandbox, Module } from '../../types';
import {
  listen,
  dispatch,
  actions,
  registerFrame,
  resetState,
} from 'codesandbox-api';
import debounce from 'lodash/debounce';

import { frameUrl, host } from '../../utils/url-generator';
import { getModulePath } from '../../sandbox/modules';
import getTemplate from '../../templates';

import { Spring } from 'react-spring/renderprops.cjs';

import { generateFileFromSandbox } from '../../templates/configuration/package-json';

import { getSandboxName } from '../../utils/get-sandbox-name';
import track from '../../utils/analytics';

import Navigator from './Navigator';
import { Container, StyledFrame, Loading } from './elements';
import { Settings } from './types';

export type Props = {
  sandbox: Sandbox;
  settings: Settings;
  onInitialized?: (preview: BasePreview) => () => void; // eslint-disable-line no-use-before-define
  extraModules?: { [path: string]: { code: string; path: string } };
  currentModule?: Module;
  initialPath?: string;
  url?: string;
  isInProjectView?: boolean;
  onClearErrors?: () => void;
  onAction?: (action: Object) => void;
  onOpenNewWindow?: () => void;
  onToggleProjectView?: () => void;
  isResizing?: boolean;
  onResize?: (height: number) => void;
  showNavigation?: boolean;
  inactive?: boolean;
  dragging?: boolean;
  hide?: boolean;
  noPreview?: boolean;
  alignDirection?: 'right' | 'bottom';
  delay?: number;
  className?: string;
  overlayMessage?: string;
};

type State = {
  frameInitialized: boolean;
  url: string;
  urlInAddressBar: string;
  back: boolean;
  forward: boolean;
  showScreenshot: boolean;
  useFallbackDomain: boolean;
};

const getSSEUrl = (sandbox?: Sandbox, initialPath: string = '') =>
  `https://${sandbox ? `${sandbox.id}.` : ''}sse.${
    process.env.NODE_ENV === 'development' || process.env.STAGING
      ? 'codesandbox.io'
      : host()
  }${initialPath}`;

interface IModulesByPath {
  [path: string]: { path: string; code: null | string; isBinary?: boolean };
}

class BasePreview extends React.Component<Props, State> {
  serverPreview: boolean;
  element: HTMLIFrameElement;

  constructor(props: Props) {
    super(props);
    // We have new behaviour in the preview for server templates, which are
    // templates that are executed in a docker container.
    this.serverPreview = getTemplate(props.sandbox.template).isServer;

    const initialUrl = this.currentUrl();

    this.state = {
      frameInitialized: false,
      urlInAddressBar: initialUrl,
      url: initialUrl,
      forward: false,
      back: false,
      showScreenshot: true,
      useFallbackDomain: false,
    };

    // we need a value that doesn't change when receiving `initialPath`
    // from the query params, or the iframe will continue to be re-rendered
    // when the user navigates the iframe app, which shows the loading screen
    this.initialPath = props.initialPath;

    if (this.serverPreview) {
      setTimeout(() => {
        // Remove screenshot after specific time, so the loading container spinner can still show
        this.setState({ showScreenshot: false });
      }, 100);
    }
    this.listener = listen(this.handleMessage);

    if (props.delay) {
      this.executeCode = debounce(this.executeCode, 800);
    }

    (window as any).openNewWindow = this.openNewWindow;

    this.testFallbackDomainIfNeeded();

    setTimeout(() => {
      if (this.state.showScreenshot) {
        this.setState({ showScreenshot: false });
      }
    }, 800);
  }

  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    if (
      nextState.frameInitialized !== this.state.frameInitialized &&
      nextState.frameInitialized
    ) {
      this.handleRefresh();
    }
  }

  /**
   * We have a different domain for the preview (currently :id.csb.app), some corporate
   * firewalls block calls to these domains. Which is why we ping the domain here, if it
   * returns a bad response we fall back to using our main domain (:id.codesandbox.io).
   *
   * We use a different domain for the preview, since Chrome runs iframes from a different root
   * domain in a different process, which means for us that we have a snappier editor
   */
  testFallbackDomainIfNeeded = () => {
    const TRACKING_NAME = 'Preview - Fallback URL';
    const normalUrl = frameUrl(
      this.props.sandbox,
      this.props.initialPath || ''
    );
    const fallbackUrl = frameUrl(
      this.props.sandbox,
      this.props.initialPath || '',
      true
    );

    const setFallbackDomain = () => {
      this.setState(
        {
          useFallbackDomain: true,
          urlInAddressBar: frameUrl(
            this.props.sandbox,
            this.props.initialPath || '',
            true
          ),
        },
        () => {
          requestAnimationFrame(() => {
            this.sendUrl();
          });
        }
      );
    };

    if (!this.props.url && normalUrl !== fallbackUrl) {
      fetch(normalUrl, { mode: 'no-cors' })
        .then(() => {
          // Succeeded
          track(TRACKING_NAME, { needed: false });
        })
        .catch(() => {
          // Failed, use fallback
          track(TRACKING_NAME, { needed: true });

          setFallbackDomain();
        });
    }
  };

  currentUrl = () =>
    this.props.url ||
    (this.serverPreview
      ? getSSEUrl(this.props.sandbox, this.props.initialPath)
      : frameUrl(
          this.props.sandbox,
          this.props.initialPath || '',
          this.state && this.state.useFallbackDomain
        ));

  static defaultProps = {
    showNavigation: true,
    delay: true,
  };

  listener: () => void;
  disposeInitializer: () => void;
  initialPath: string;

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
    if (this.disposeInitializer) {
      this.disposeInitializer();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.sandbox &&
      this.props.sandbox &&
      prevProps.sandbox.id !== this.props.sandbox.id
    ) {
      this.handleSandboxChange(this.props.sandbox);
    }
  }

  openNewWindow = () => {
    if (this.props.onOpenNewWindow) {
      this.props.onOpenNewWindow();
    }

    window.open(this.state.urlInAddressBar, '_blank');
  };

  handleSandboxChange = (sandbox: Sandbox) => {
    this.serverPreview = getTemplate(sandbox.template).isServer;

    resetState();

    const url = this.currentUrl();

    if (this.serverPreview) {
      setTimeout(() => {
        // Remove screenshot after specific time, so the loading container spinner can still show
        this.setState({ showScreenshot: false });
      }, 800);
    }

    this.setState(
      {
        urlInAddressBar: url,
        url,
        showScreenshot: true,
      },
      () => this.handleRefresh()
    );
  };

  handleDependenciesChange = () => {
    this.handleRefresh();
  };

  handleMessage = (data: any, source: any) => {
    if (data && data.codesandbox) {
      if (data.type === 'initialized' && source) {
        registerFrame(source, this.currentUrl());

        if (!this.state.frameInitialized && this.props.onInitialized) {
          this.disposeInitializer = this.props.onInitialized(this);
        }

        setTimeout(
          () => {
            // We show a screenshot of the sandbox (if available) on top of the preview if the frame
            // hasn't loaded yet
            this.setState({ showScreenshot: false });
          },
          this.serverPreview ? 0 : 600
        );

        this.executeCodeImmediately(true);
      } else {
        const { type } = data;

        switch (type) {
          case 'render': {
            this.executeCodeImmediately();
            break;
          }
          case 'urlchange': {
            this.commitUrl(data.url, data.back, data.forward);
            break;
          }
          case 'resize': {
            if (this.props.onResize) {
              this.props.onResize(data.height);
            }
            break;
          }
          case 'action': {
            if (this.props.onAction) {
              this.props.onAction({
                ...data,
                sandboxId: this.props.sandbox.id,
              });
            }

            break;
          }
          case 'done': {
            this.setState({ showScreenshot: false });
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  };

  executeCode = () => {
    requestAnimationFrame(() => {
      this.executeCodeImmediately();
    });
  };

  getRenderedModule = () => {
    const { sandbox, currentModule, isInProjectView } = this.props;

    return isInProjectView
      ? '/' + sandbox.entry
      : getModulePath(sandbox.modules, sandbox.directories, currentModule.id);
  };

  getModulesToSend = (): IModulesByPath => {
    const modulesObject: IModulesByPath = {};
    const sandbox = this.props.sandbox;

    sandbox.modules.forEach(m => {
      const path = getModulePath(sandbox.modules, sandbox.directories, m.id);
      if (path) {
        modulesObject[path] = {
          path,
          code: m.code,
          isBinary: m.isBinary,
        };
      }
    });

    const extraModules = this.props.extraModules || {};
    const modulesToSend = { ...extraModules, ...modulesObject };

    if (!modulesToSend['/package.json']) {
      modulesToSend['/package.json'] = {
        code: generateFileFromSandbox(sandbox),
        path: '/package.json',
        isBinary: false,
      };
    }

    return modulesToSend;
  };

  executeCodeImmediately = (initialRender: boolean = false) => {
    const settings = this.props.settings;
    const sandbox = this.props.sandbox;

    if (settings.clearConsoleEnabled && !this.serverPreview) {
      // @ts-ignore Chrome behaviour
      console.clear('__internal__'); // eslint-disable-line no-console
      dispatch({ type: 'clear-console' });
    }

    // Do it here so we can see the dependency fetching screen if needed
    this.clearErrors();
    if (settings.forceRefresh && !initialRender) {
      this.handleRefresh();
    } else {
      if (!this.props.isInProjectView) {
        dispatch({
          type: 'evaluate',
          command: `history.pushState({}, null, '/')`,
        });
      }

      const modulesToSend = this.getModulesToSend();
      if (!this.serverPreview) {
        dispatch({
          type: 'compile',
          version: 3,
          entry: this.getRenderedModule(),
          modules: modulesToSend,
          sandboxId: sandbox.id,
          externalResources: sandbox.externalResources,
          isModuleView: !this.props.isInProjectView,
          template: sandbox.template,
          hasActions: Boolean(this.props.onAction),
        });
      }
    }
  };

  setIframeElement = (el: HTMLIFrameElement) => {
    if (el) {
      this.element = el;
    }
  };

  clearErrors = () => {
    // @ts-ignore
    dispatch(actions.error.clear('*', 'browser'));
    if (this.props.onClearErrors) {
      this.props.onClearErrors();
    }
  };

  updateUrl = (url: string) => {
    this.setState({ urlInAddressBar: url });
  };

  sendUrl = () => {
    const { urlInAddressBar } = this.state;

    if (this.element) {
      this.element.src = urlInAddressBar;

      this.setState({
        url: urlInAddressBar,
        back: false,
        forward: false,
      });
    }
  };

  handleRefresh = () => {
    const { urlInAddressBar, url } = this.state;
    const urlToSet = url || urlInAddressBar;

    if (this.element) {
      this.element.src = urlToSet || this.currentUrl();
    }

    this.setState({
      urlInAddressBar: urlToSet,
      back: false,
      forward: false,
    });
  };

  handleBack = () => {
    dispatch({
      type: 'urlback',
    });
  };

  handleForward = () => {
    dispatch({
      type: 'urlforward',
    });
  };

  commitUrl = (url: string, back: boolean, forward: boolean) => {
    this.setState({
      urlInAddressBar: url,
      url,
      back,
      forward,
    });
  };

  toggleProjectView = () => {
    if (this.props.onToggleProjectView) {
      this.props.onToggleProjectView();
    }
  };

  render() {
    const {
      showNavigation,
      inactive,
      sandbox,
      settings,
      isInProjectView,
      dragging,
      hide,
      noPreview,
      className,
      overlayMessage,
    } = this.props;

    const { urlInAddressBar, back, forward } = this.state;

    const url = urlInAddressBar || this.currentUrl();

    if (noPreview) {
      // Means that preview is open in another tab definitely
      return null;
    }

    // Weird TS typing bug
    const AnySpring = Spring as any;

    return (
      <Container
        className={className}
        style={{
          position: 'relative',
          flex: 1,
          display: hide ? 'none' : undefined,
        }}
      >
        {showNavigation && (
          <Navigator
            url={url}
            onChange={this.updateUrl}
            onConfirm={this.sendUrl}
            onBack={back ? this.handleBack : null}
            onForward={forward ? this.handleForward : null}
            onRefresh={this.handleRefresh}
            isProjectView={isInProjectView}
            toggleProjectView={
              this.props.onToggleProjectView && this.toggleProjectView
            }
            openNewWindow={this.openNewWindow}
            zenMode={settings.zenMode}
          />
        )}
        {overlayMessage && <Loading>{overlayMessage}</Loading>}

        <AnySpring
          from={{ opacity: 0 }}
          to={{
            opacity: this.state.showScreenshot ? 0 : 1,
          }}
        >
          {(style: { opacity: number }) => (
            <React.Fragment>
              <StyledFrame
                sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
                allow="geolocation; microphone; camera;midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
                src={this.currentUrl()}
                ref={this.setIframeElement}
                title={getSandboxName(sandbox)}
                id="sandbox-preview"
                style={{
                  ...style,
                  zIndex: 1,
                  backgroundColor: 'white',
                  pointerEvents:
                    dragging || inactive || this.props.isResizing
                      ? 'none'
                      : 'initial',
                }}
              />

              {this.props.sandbox.screenshotUrl && style.opacity !== 1 && (
                <div
                  style={{
                    overflow: 'hidden',
                    width: '100%',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 35,
                    zIndex: 0,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      filter: `blur(2px)`,
                      transform: 'scale(1.025, 1.025)',
                      backgroundImage: `url("${
                        this.props.sandbox.screenshotUrl
                      }")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPositionX: 'center',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          )}
        </AnySpring>
      </Container>
    );
  }
}

export default BasePreview;
