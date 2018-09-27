// @flow
import * as React from 'react';
import type { Sandbox, Module } from 'common/types';
import { listen, dispatch, registerFrame } from 'codesandbox-api';
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
};

type State = {
  frameInitialized: boolean,
  history: Array<string>,
  historyPosition: number,
  urlInAddressBar: string,
  url: ?string,
  overlayMessage: ?string,
};

const getSSEUrl = (id?: string) =>
  `https://${id ? id + '.' : ''}sse.${
    process.env.NODE_ENV === 'development' ? 'codesandbox.stream' : host()
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

class BasePreview extends React.Component<Props, State> {
  serverPreview: boolean;
  lastSent: {
    sandboxId: string,
    modules: {
      [path: string]: any,
    },
  };
  // TODO: Find typedefs for this
  $socket: ?any;

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
    };

    // we need a value that doesn't change when receiving `initialPath`
    // from the query params, or the iframe will continue to be re-rendered
    // when the user navigates the iframe app, which shows the loading screen
    this.initialPath = props.initialPath;

    this.lastSent = {
      sandboxId: props.sandbox.id,
      modules: this.getModulesToSend(),
    };

    if (this.serverPreview) {
      this.setupSSESockets();
    }
    this.listener = listen(this.handleMessage);

    if (props.delay) {
      this.executeCode = debounce(this.executeCode, 800);
    }
  }

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

    if (hasInitialized) {
      this.setState({
        frameInitialized: false,
      });
      if (this.$socket) {
        this.$socket.close();
        setTimeout(() => {
          if (this.$socket) {
            this.$socket.open();
          }
        }, 0);
      }
    } else {
      const socket = io(getSSEUrl(), {
        autoConnect: false,
      });
      this.$socket = socket;
      if (process.env.NODE_ENV === 'development') {
        window.$socket = socket;
      }

      socket.on('disconnect', () => {
        if (this.props.setServerStatus) {
          this.props.setServerStatus('disconnected');
          dispatch({ type: 'codesandbox:sse:disconnect' });
        }
      });

      socket.on('connect', async () => {
        if (this.props.setServerStatus) {
          this.props.setServerStatus('connected');
        }

        const { id } = this.props.sandbox;
        const token = await retrieveSSEToken();

        socket.emit('sandbox', { id, token });

        dispatch({
          type: 'terminal:message',
          data: `> CodeSandbox SSE: connected! Starting sandbox ${id}...\n\r`,
        });

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

      socket.on('sandbox:start', () => {
        const { id } = this.props.sandbox;

        dispatch({
          type: 'terminal:message',
          data: `> CodeSandbox SSE: sandbox ${id} started\n\r`,
        });

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
        this.setState({
          frameInitialized: false,
          overlayMessage:
            'The sandbox is hibernating, refresh to start the sandbox',
        });

        this.$socket.close();
      });

      socket.on('sandbox:stop', () => {
        this.setState({
          frameInitialized: false,
          overlayMessage: 'Restarting the sandbox...',
        });
      });

      socket.on('sandbox:log', ({ chan, data }) => {
        dispatch({
          type: 'terminal:message',
          chan,
          data,
        });
      });

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

    const url = this.serverPreview
      ? getSSEUrl(newId)
      : frameUrl(newId, this.props.initialPath || '');

    if (this.serverPreview) {
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
        registerFrame(source, frameUrl(this.props.sandbox.id));

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
            this.commitUrl(data.url);
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
        };
      }
    });

    const extraModules = this.props.extraModules || {};
    const modulesToSend = { ...extraModules, ...modulesObject };

    if (!modulesToSend['/package.json']) {
      modulesToSend['/package.json'] = {
        code: generateFileFromSandbox(sandbox),
        path: '/package.json',
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

        if (Object.keys(diff).length > 0 && this.$socket) {
          this.$socket.emit('sandbox:update', diff);
        }
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

    const { historyPosition, history } = this.state;
    this.setState({
      historyPosition: this.state.historyPosition - 1,
      urlInAddressBar: history[historyPosition - 1],
    });
  };

  handleForward = () => {
    dispatch({
      type: 'urlforward',
    });

    const { historyPosition, history } = this.state;
    this.setState({
      historyPosition: this.state.historyPosition + 1,
      urlInAddressBar: history[historyPosition + 1],
    });
  };

  commitUrl = (url: string) => {
    const { history, historyPosition } = this.state;

    const currentHistory = history[historyPosition] || '';
    if (currentHistory !== url) {
      history.length = historyPosition + 1;
      this.setState({
        history: [...history, url],
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
