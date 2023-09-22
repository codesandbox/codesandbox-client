import {
  actions,
  dispatch,
  listen,
  registerFrame,
  resetState,
} from 'codesandbox-api';
import debounce from 'lodash/debounce';
import React from 'react';
import { Spring } from 'react-spring/renderprops.cjs';

import { getModulePath } from '../../sandbox/modules';
import getTemplate from '../../templates';
import { generateFileFromSandbox } from '../../templates/configuration/package-json';
import { Module, NpmRegistry, Sandbox } from '../../types';
import track, { trackWithCooldown } from '../../utils/analytics';
import { getSandboxName } from '../../utils/get-sandbox-name';
import { frameUrl, host } from '../../utils/url-generator';
import { Container, Loading, StyledFrame } from './elements';
import Navigator from './Navigator';
import { Settings } from './types';

const DefaultWrapper = ({ children }) => children;

export type Props = {
  sandbox: Sandbox;
  privacy?: number;
  /**
   * We only use preview secrets for private sandboxes (I think it is to identify the user in the
   * preview, because that lives on csb.app and therefore doesn’t have the regular user cookie).
   */
  previewSecret?: string;
  settings: Settings;
  customNpmRegistries: NpmRegistry[];
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
  onMount?: (preview: BasePreview) => () => void;
  overlayMessage?: string;
  Wrapper?: React.FC<{ children: any }>;
  isResponsiveModeActive?: boolean;
  isResponsivePreviewResizing?: boolean;
  isPreviewCommentModeActive?: boolean;
  toggleResponsiveMode?: () => void;
  createPreviewComment?: () => void;
  isScreenshotLoading?: boolean;
  /**
   * Whether to show a screenshot in the preview as a "placeholder" while loading
   * to reduce perceived loading time
   */
  showScreenshotOverlay?: boolean;
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

const sseDomain = process.env.STAGING_API
  ? 'codesandbox.stream'
  : 'codesandbox.io';

const getSSEUrl = (sandbox?: Sandbox, initialPath: string = '') => {
  // @ts-ignore
  const usesStaticPreviewURL = window._env_?.USE_STATIC_PREVIEW === 'true';
  // @ts-ignore
  const previewDomain = window._env_?.PREVIEW_DOMAIN;

  if (usesStaticPreviewURL && previewDomain) {
    return `${location.protocol}//${previewDomain}/${initialPath}`;
  }

  return `https://${sandbox ? `${sandbox.id}.` : ''}sse.${
    process.env.NODE_ENV === 'development' || process.env.STAGING
      ? sseDomain
      : host()
  }${initialPath}`;
};

interface IModulesByPath {
  [path: string]: { path: string; code: null | string; isBinary?: boolean };
}

class BasePreview extends React.PureComponent<Props, State> {
  serverPreview: boolean;
  element: HTMLIFrameElement;
  onUnmount: () => void;

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
      showScreenshot: props.showScreenshotOverlay,
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
    } else {
      setTimeout(() => {
        if (this.state.showScreenshot) {
          this.setState({ showScreenshot: false });
        }
      }, 800);
    }

    this.listener = listen(this.handleMessage);

    if (props.delay) {
      this.executeCode = debounce(this.executeCode, 800);
    }

    (window as any).openNewWindow = this.openNewWindow;

    this.testFallbackDomainIfNeeded();
  }

  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    if (
      nextState.frameInitialized !== this.state.frameInitialized &&
      nextState.frameInitialized
    ) {
      this.handleRefresh();
    }
  }

  componentDidMount() {
    if (this.props.onMount) {
      this.onUnmount = this.props.onMount(this);
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
      { useFallbackDomain: true }
    );

    const setFallbackDomain = () => {
      this.setState(
        {
          useFallbackDomain: true,
          urlInAddressBar: frameUrl(
            this.props.sandbox,
            this.props.initialPath || '',
            { useFallbackDomain: true }
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
          // Succeeded, don't send anything
        })
        .catch(() => {
          // Failed, use fallback
          track(TRACKING_NAME, { needed: true });

          setFallbackDomain();
        });
    }
  };

  currentUrl = () => {
    const { url, sandbox } = this.props;
    if (url && !url.startsWith('/')) {
      // An absolute url is given, just return that
      return url;
    }

    // url may be a relative path (/test), so start with that
    const initialPath = url || this.props.initialPath || '';

    return this.serverPreview
      ? getSSEUrl(sandbox, initialPath)
      : frameUrl(sandbox, initialPath, {
          useFallbackDomain: this.state && this.state.useFallbackDomain,
        });
  };

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
    if (this.onUnmount) {
      this.onUnmount();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.privacy !== this.props.privacy) {
      this.handlePrivacyChange();
    }
    if (prevProps.sandbox.id !== this.props.sandbox.id) {
      this.handleSandboxChange();
    }
  }

  openNewWindow = () => {
    if (this.props.onOpenNewWindow) {
      this.props.onOpenNewWindow();
    }

    window.open(this.state.urlInAddressBar, '_blank');
  };

  sendPreviewSecret = () => {
    dispatch({
      $type: 'preview-secret',
      previewSecret: this.props.previewSecret,
    });
  };

  handlePrivacyChange = () => {
    this.sendPreviewSecret();
  };

  handleSandboxChange = () => {
    this.serverPreview = getTemplate(this.props.sandbox.template).isServer;

    resetState();

    const url = this.currentUrl();
    dispatch({ type: 'clear-console' });

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

  updateAddressbarUrl() {
    const url = this.currentUrl();

    this.setState({
      urlInAddressBar: url,
    });
  }

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

        this.sendPreviewSecret();

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
          case 'document-focus': {
            trackWithCooldown('Preview focus', 30_000);
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
    const { sandbox } = this.props;

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

  executeCodeImmediately = (
    initialRender: boolean = false,
    showScreen = true
  ) => {
    // We cancel the existing calls with executeCode to prevent concurrent calls,
    // the only reason we do this is because executeCodeImmediately can be called
    // directly as well
    // @ts-ignore
    this.executeCode.cancel();
    const { settings } = this.props;
    const { sandbox } = this.props;

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
          customNpmRegistries: this.props.customNpmRegistries,
          modules: modulesToSend,
          sandboxId: sandbox.id,
          externalResources: sandbox.externalResources,
          isModuleView: !this.props.isInProjectView,
          template: sandbox.template,
          hasActions: Boolean(this.props.onAction),
          previewSecret: sandbox.previewSecret,
          showScreen,
          clearConsoleDisabled: !settings.clearConsoleEnabled,
          reactDevTools: 'legacy',
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

      this.refreshHashedUrl(urlInAddressBar);
    }
  };

  handleRefresh = () => {
    // Changed this from prioritizing URL. This is to make "smooth forking" work,
    // but would expect the addressbar url to decide what is refreshed anyways?
    const { urlInAddressBar, url } = this.state;
    const urlToSet = urlInAddressBar || url;

    if (this.element) {
      const iframeSRC = urlToSet || this.currentUrl();
      this.element.src = iframeSRC;

      this.refreshHashedUrl(iframeSRC);
    }

    this.setState({
      urlInAddressBar: urlToSet,
      back: false,
      forward: false,
    });
  };

  refreshHashedUrl = url => {
    if (!url.includes('#')) {
      return;
    }

    dispatch({ type: 'refresh' });
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
      Wrapper = DefaultWrapper,
      isResponsiveModeActive,
      toggleResponsiveMode,
      createPreviewComment,
      isScreenshotLoading,
      isPreviewCommentModeActive,
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
        id="sandbox-preview-container"
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
            isScreenshotLoading={isScreenshotLoading}
            onChange={this.updateUrl}
            onConfirm={this.sendUrl}
            onBack={back ? this.handleBack : null}
            onForward={forward ? this.handleForward : null}
            onRefresh={this.handleRefresh}
            isProjectView={isInProjectView}
            toggleProjectView={
              this.props.onToggleProjectView && this.toggleProjectView
            }
            toggleResponsiveView={toggleResponsiveMode}
            isInResponsivePreview={isResponsiveModeActive}
            isPreviewCommentModeActive={isPreviewCommentModeActive}
            openNewWindow={this.openNewWindow}
            createPreviewComment={createPreviewComment}
            zenMode={settings.zenMode}
            sandbox={sandbox}
          />
        )}
        {overlayMessage && <Loading>{overlayMessage}</Loading>}
        <Wrapper>
          <AnySpring
            key="preview"
            from={{ opacity: this.props.showScreenshotOverlay ? 0 : 1 }}
            to={{
              opacity: this.state.showScreenshot ? 0 : 1,
            }}
          >
            {(style: { opacity: number }) => (
              <>
                <StyledFrame
                  key="PREVIEW"
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads allow-pointer-lock"
                  src={this.state.url}
                  ref={this.setIframeElement}
                  title={getSandboxName(sandbox)}
                  id="sandbox-preview"
                  style={{
                    ...style,
                    zIndex: 1,
                    backgroundColor: 'white',
                    userSelect: this.props.isResponsivePreviewResizing
                      ? 'none'
                      : 'initial',
                    pointerEvents:
                      dragging ||
                      inactive ||
                      this.props.isResizing ||
                      this.props.isResponsivePreviewResizing
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
                      top: showNavigation ? 35 : 0,
                      zIndex: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        filter: `blur(2px)`,
                        transform: 'scale(1.025, 1.025)',
                        backgroundImage: `url("${this.props.sandbox.screenshotUrl}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPositionX: 'center',
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </AnySpring>
        </Wrapper>
      </Container>
    );
  }
}

export default BasePreview;
