// @flow
import * as React from 'react';
import type { Sandbox, Module } from 'common/types';
import { listen, dispatch, registerFrame, resetState } from 'codesandbox-api';
import { debounce } from 'lodash-es';
import io from 'socket.io-client';

import { frameUrl, host } from 'common/utils/url-generator';
import { getModulePath } from 'common/sandbox/modules';
import getTemplate from 'common/templates';

import { generateFileFromSandbox } from 'common/templates/configuration/package-json';

import Navigator from './Navigator';
import { Container, StyledFrame, Loading } from './elements';
import type { Settings } from '../CodeEditor/types';

type Props = {
  onInitialized: (preview: BasePreview) => void, // eslint-disable-line no-use-before-define
  sandbox: Sandbox,
  extraModules: { [path: string]: { code: string, path: string } },
  currentModule: Module,
  settings: Settings,
  initialPath: string,
  isInProjectView: boolean,
  onClearErrors: () => void,
  onAction: (action: Object) => void,
  onOpenNewWindow: () => void,
  onToggleProjectView: () => void,
  isResizing: boolean,
  alignRight: () => void,
  alignBottom: () => void,
  onResize?: (height: number) => void,
  showNavigation?: boolean,
  inactive?: boolean,
  dragging?: boolean,
  hide: boolean,
  noPreview: boolean,
  alignDirection?: 'right' | 'bottom',
  delay?: number,
  setServerStatus?: (status: string) => void,
  syncSandbox?: (updates: any) => void,
};

type State = {
  frameInitialized: boolean,
  history: Array<string>,
  historyPosition: number,
  urlInAddressBar: string,
  url: ?string,
  overlayMessage: ?string,
  hibernated: boolean,
  sseError: boolean,
};

const getSSEUrl = (id?: string) =>
  `https://${id ? id + '.' : ''}sse.${
    process.env.NODE_ENV === 'development' ? 'codesandbox.io' : host()
  }`;

const getDiff = (a, b) => {
  const diff = {};

  Object.keys(b)
    .filter(p => {
      if (a[p]) {
        if (a[p].code !== b[p].code) {
          return true;
        }
      } else {
        return true;
      }

      return false;
    })
    .forEach(p => {
      diff[p] = {
        code: b[p].code,
        path: p,
        isBinary: b[p].isBinary,
      };
    });

  Object.keys(a).forEach(p => {
    if (!b[p]) {
      diff[p] = {
        path: p,
        code: null,
      };
    }
  });

  return diff;
};

const MAX_SSE_AGE = 24 * 60 * 60 * 1000; // 1 day
async function retrieveSSEToken() {
  const jwt = localStorage.getItem('jwt');

  if (jwt) {
    const parsedJWT = JSON.parse(jwt);
    const existingKey = localStorage.getItem('sse');
    const currentTime = new Date().getTime();

    if (existingKey) {
      const parsedKey = JSON.parse(existingKey);
      if (parsedKey.key && currentTime - parsedKey.timestamp < MAX_SSE_AGE) {
        return parsedKey.key;
      }
    }

    return fetch('/api/v1/users/current_user/sse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parsedJWT}`,
      },
    })
      .then(x => x.json())
      .then(result => result.jwt)
      .then(token => {
        localStorage.setItem(
          'sse',
          JSON.stringify({
            key: token,
            timestamp: currentTime,
          })
        );

        return token;
      })
      .catch(() => null);
  }

  return null;
}

function sseTerminalMessage(msg) {
  dispatch({
    type: 'terminal:message',
    data: `> Sandbox Container: ${msg}\n\r`,
  });
}

class BasePreview extends React.Component<Props, State> {
  serverPreview: boolean;
  lastSent: {
    sandboxId: string,
    modules: {
      [path: string]: any,
    },
    ignoreNextUpdate: boolean,
  };
  // TODO: Find typedefs for this
  $socket: ?any;
  connectTimeout: ?number;
  // indicates if the socket closing is initiated by us
  localClose: boolean;

  constructor(props: Props) {
    super(props);
    // We have new behaviour in the preview for server templates, which are
    // templates that are executed in a docker container.
    this.serverPreview = getTemplate(props.sandbox.template).isServer;

    this.state = {
      frameInitialized: false,
      history: [],
      historyPosition: -1,
      urlInAddressBar: this.serverPreview
        ? getSSEUrl(props.sandbox.id)
        : frameUrl(props.sandbox.id, props.initialPath || ''),
      url: null,
      overlayMessage: null,
      hibernated: false,
      sseError: false,
    };

    // we need a value that doesn't change when receiving `initialPath`
    // from the query params, or the iframe will continue to be re-rendered
    // when the user navigates the iframe app, which shows the loading screen
    this.initialPath = props.initialPath;

    this.initializeLastSent();

    if (this.serverPreview) {
      this.connectTimeout = null;
      this.localClose = false;
      this.setupSSESockets();
    }
    this.listener = listen(this.handleMessage);

    if (props.delay) {
      this.executeCode = debounce(this.executeCode, 800);
    }

    window.openNewWindow = this.openNewWindow;
  }

  initializeLastSent = () => {
    this.lastSent = {
      sandboxId: this.props.sandbox.id,
      modules: this.getModulesToSend(),
      ignoreNextUpdate: false,
    };
  };

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (
      nextState.frameInitialized !== this.state.frameInitialized &&
      nextState.frameInitialized
    ) {
      this.handleRefresh();
    }
  }

  setupSSESockets = async () => {
    const hasInitialized = !!this.$socket;

    function onTimeout(comp) {
      comp.connectTimeout = null;
      if (comp.props.setServerStatus) {
        comp.props.setServerStatus('disconnected');
      }
    }

    if (hasInitialized) {
      this.setState({
        frameInitialized: false,
      });
      if (this.$socket) {
        this.localClose = true;
        this.$socket.close();
        // we need this setTimeout() for socket open() to work immediately after close()
        setTimeout(() => {
          this.connectTimeout = setTimeout(() => onTimeout(this), 3000);
          this.$socket.open();
        }, 0);
      }
    } else {
      const socket = io(getSSEUrl(), {
        autoConnect: false,
        transports: ['websocket', 'polling'],
      });
      this.$socket = socket;
      if (process.env.NODE_ENV === 'development') {
        window.$socket = socket;
      }

      socket.on('disconnect', () => {
        if (this.localClose) {
          this.localClose = false;
          return;
        }

        if (this.props.setServerStatus) {
          let status = 'disconnected';
          if (this.state.hibernated) {
            status = 'hibernated';
          } else if (this.state.sseError) {
            status = 'error';
          }
          this.props.setServerStatus(status);
          dispatch({ type: 'codesandbox:sse:disconnect' });
        }
      });

      socket.on('connect', async () => {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = null;
        }

        if (this.props.setServerStatus) {
          this.props.setServerStatus('connected');
        }

        const { id } = this.props.sandbox;
        const token = await retrieveSSEToken();

        socket.emit('sandbox', { id, token });

        sseTerminalMessage(`connected, starting sandbox ${id}...`);

        socket.emit('sandbox:start');
      });

      socket.on('shell:out', ({ data, id }) => {
        dispatch({
          type: 'shell:out',
          data,
          id,
        });
      });

      socket.on('shell:exit', ({ id, code, signal }) => {
        dispatch({
          type: 'shell:exit',
          code,
          signal,
          id,
        });
      });

      socket.on('sandbox:update', message => {
        this.lastSent.ignoreNextUpdate = true;

        if (this.props.syncSandbox) {
          this.props.syncSandbox({ updates: message.updates });
        }
      });

      socket.on('sandbox:start', () => {
        sseTerminalMessage(`sandbox ${this.props.sandbox.id} started.`);

        if (!this.state.frameInitialized && this.props.onInitialized) {
          this.disposeInitializer = this.props.onInitialized(this);
        }
        this.handleRefresh();
        this.setState({
          frameInitialized: true,
          overlayMessage: null,
        });
      });

      socket.on('sandbox:hibernate', () => {
        sseTerminalMessage(`sandbox ${this.props.sandbox.id} hibernated.`);

        this.setState(
          {
            frameInitialized: false,
            overlayMessage:
              'The sandbox was hibernated because of inactivity. Refresh the page to restart it.',
            hibernated: true,
          },
          () => this.$socket.close()
        );
      });

      socket.on('sandbox:stop', () => {
        sseTerminalMessage(`sandbox ${this.props.sandbox.id} restarting...`);

        this.setState({
          frameInitialized: false,
          overlayMessage: 'Restarting the sandbox...',
        });
      });

      socket.on('sandbox:log', ({ data }) => {
        dispatch({
          type: 'terminal:message',
          data,
        });
      });

      socket.on('sandbox:error', ({ message, unrecoverable }) => {
        sseTerminalMessage(
          `sandbox ${this.props.sandbox.id} ${
            unrecoverable ? 'unrecoverable ' : ''
          }error "${message}"`
        );
        if (unrecoverable) {
          this.setState(
            {
              frameInitialized: false,
              overlayMessage:
                'An unrecoverable sandbox error occurred. :-( Try refreshing the page.',
              sseError: true,
            },
            () => this.$socket.close()
          );
        } else {
          window.showNotification(`Sandbox Container: ${message}`, 'error');
        }
      });

      this.connectTimeout = setTimeout(() => onTimeout(this), 3000);
      socket.open();
    }
  };

  static defaultProps = {
    showNavigation: true,
    delay: true,
  };

  listener: ?Function;
  disposeInitializer: ?Function;
  initialPath: string;

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
    if (this.disposeInitializer) {
      this.disposeInitializer();
    }

    if (this.$socket) {
      this.localClose = true;
      this.$socket.close();
    }
  }

  openNewWindow = () => {
    if (this.props.onOpenNewWindow) {
      this.props.onOpenNewWindow();
    }

    window.open(this.state.urlInAddressBar, '_blank');
  };

  handleSandboxChange = (newId: string) => {
    this.serverPreview = getTemplate(this.props.sandbox.template).isServer;

    resetState();

    const url = this.serverPreview
      ? getSSEUrl(newId)
      : frameUrl(newId, this.props.initialPath || '');

    if (this.serverPreview) {
      this.initializeLastSent();
      this.setupSSESockets();
    }
    this.setState(
      {
        history: [url],
        historyPosition: 0,
        urlInAddressBar: url,
      },
      () => this.handleRefresh()
    );
  };

  handleDependenciesChange = () => {
    this.handleRefresh();
  };

  handleMessage = (data: Object, source: any) => {
    if (data && data.codesandbox) {
      if (data.type === 'initialized' && source) {
        registerFrame(
          source,
          this.serverPreview
            ? getSSEUrl(this.props.sandbox.id)
            : frameUrl(this.props.sandbox.id)
        );

        if (!this.state.frameInitialized && this.props.onInitialized) {
          this.disposeInitializer = this.props.onInitialized(this);
        }
        this.setState({
          frameInitialized: true,
        });
        this.executeCodeImmediately(true);
      } else {
        const { type } = data;

        switch (type) {
          case 'render': {
            this.executeCodeImmediately();
            break;
          }
          case 'urlchange': {
            this.commitUrl(data.url, data.action, data.diff);
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
          case 'socket:message': {
            if (this.$socket) {
              const { channel, type: _t, codesandbox: _c, ...message } = data;
              this.$socket.emit(channel, message);
            }

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

  getModulesToSend = () => {
    const modulesObject = {};
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
      // $FlowIssue: Chrome behaviour
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
      if (this.serverPreview) {
        const diff = getDiff(this.lastSent.modules, modulesToSend);

        this.lastSent.modules = modulesToSend;

        const ignoreUpdate = this.lastSent.ignoreNextUpdate;
        if (!ignoreUpdate && Object.keys(diff).length > 0 && this.$socket) {
          this.$socket.emit('sandbox:update', diff);
        }
        this.lastSent.ignoreNextUpdate = false;
      } else {
        dispatch({
          type: 'compile',
          version: 3,
          entry: this.getRenderedModule(),
          modules: modulesToSend,
          sandboxId: sandbox.id,
          externalResources: sandbox.externalResources,
          isModuleView: !this.props.isInProjectView,
          template: sandbox.template,
          hasActions: !!this.props.onAction,
        });
      }
    }
  };

  clearErrors = () => {
    if (this.props.onClearErrors) {
      this.props.onClearErrors();
    }
  };

  updateUrl = (url: string) => {
    this.setState({ urlInAddressBar: url });
  };

  sendUrl = () => {
    const { urlInAddressBar } = this.state;

    if (document.getElementById('sandbox')) {
      // $FlowIssue
      document.getElementById('sandbox').src = urlInAddressBar;

      this.setState({
        history: [urlInAddressBar],
        historyPosition: 0,
        urlInAddressBar,
      });
    }
  };

  handleRefresh = () => {
    const { history, historyPosition, urlInAddressBar } = this.state;
    const url = history[historyPosition] || urlInAddressBar;

    if (document.getElementById('sandbox')) {
      // $FlowIssue
      document.getElementById('sandbox').src =
        url ||
        (this.serverPreview
          ? getSSEUrl(this.props.sandbox.id)
          : frameUrl(this.props.sandbox.id));
    }

    this.setState({
      history: [url],
      historyPosition: 0,
      urlInAddressBar: url,
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

  commitUrl = (url: string, action: string, diff: number) => {
    const { history, historyPosition } = this.state;

    switch (action) {
      case 'POP':
        this.setState(prevState => {
          const newPosition = prevState.historyPosition + diff;
          return {
            historyPosition: newPosition,
            urlInAddressBar: url,
          };
        });
        break;
      case 'REPLACE':
        this.setState(prevState => ({
          history: [
            ...prevState.history.slice(0, historyPosition),
            url,
            ...prevState.history.slice(historyPosition + 1),
          ],
          urlInAddressBar: url,
        }));
        break;
      default:
        this.setState({
          history: [...history.slice(0, historyPosition + 1), url],
          historyPosition: historyPosition + 1,
          urlInAddressBar: url,
        });
    }
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
    } = this.props;

    const {
      historyPosition,
      history,
      urlInAddressBar,
      overlayMessage,
    } = this.state;
    const url =
      urlInAddressBar ||
      (this.serverPreview ? getSSEUrl(sandbox.id) : frameUrl(sandbox.id));

    if (noPreview) {
      // Means that preview is open in another tab definitely
      return null;
    }

    return (
      <Container
        style={{
          position: 'relative',
          flex: 1,
          display: hide ? 'none' : undefined,
        }}
      >
        {showNavigation && (
          <Navigator
            url={decodeURIComponent(url)}
            onChange={this.updateUrl}
            onConfirm={this.sendUrl}
            onBack={historyPosition > 0 ? this.handleBack : null}
            onForward={
              historyPosition < history.length - 1 ? this.handleForward : null
            }
            onRefresh={this.handleRefresh}
            isProjectView={isInProjectView}
            toggleProjectView={
              this.props.onToggleProjectView && this.toggleProjectView
            }
            openNewWindow={this.openNewWindow}
            zenMode={settings.zenMode}
            alignRight={this.props.alignRight}
            alignBottom={this.props.alignBottom}
            alignDirection={this.props.alignDirection}
            isServer={this.serverPreview}
            owned={sandbox.owned}
          />
        )}
        {overlayMessage && <Loading>{overlayMessage}</Loading>}
        <StyledFrame
          sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
          src={
            this.serverPreview
              ? getSSEUrl(sandbox.id)
              : frameUrl(sandbox.id, this.initialPath)
          }
          id="sandbox"
          title={sandbox.id}
          hideNavigation={!showNavigation}
          style={{
            pointerEvents:
              dragging || inactive || this.props.isResizing
                ? 'none'
                : 'initial',
          }}
        />
      </Container>
    );
  }
}

export default BasePreview;
