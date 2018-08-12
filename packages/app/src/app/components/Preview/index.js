// @flow
// TODO REMOVE
/* eslint-disable no-console, react/no-array-index-key */
import * as React from 'react';
import type { Sandbox, Module, Preferences } from 'common/types';
import { listen, dispatch, registerFrame } from 'codesandbox-api';
import { debounce } from 'lodash-es';
import io from 'socket.io-client';

import { frameUrl, host } from 'common/utils/url-generator';
import { getModulePath } from 'common/sandbox/modules';
import getTemplate from 'common/templates';

import { generateFileFromSandbox } from 'common/templates/configuration/package-json';

import Navigator from './Navigator';
import { Container, StyledFrame } from './elements';

type Props = {
  onInitialized: (preview: BasePreview) => void, // eslint-disable-line no-use-before-define
  sandbox: Sandbox,
  extraModules: { [path: string]: { code: string, path: string } },
  currentModule: Module,
  settings: Preferences,
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
};

type State = {
  frameInitialized: boolean,
  history: Array<string>,
  historyPosition: number,
  urlInAddressBar: string,
  url: ?string,
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

async function retrieveSSEToken() {
  const jwt = localStorage.getItem('jwt');

  if (jwt) {
    const parsedJWT = JSON.parse(jwt);
    const existingKey = localStorage.getItem('sse');
    const currentTime = new Date().getTime();

    if (existingKey) {
      const parsedKey = JSON.parse(existingKey);
      if (currentTime - parsedKey.timestamp > 24 * 60 * 60 * 1000) {
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
  constructor(props: Props) {
    super(props);
    this.IS_SERVER = getTemplate(props.sandbox.template).isServer;

    this.state = {
      frameInitialized: false,
      history: [],
      historyPosition: -1,
      urlInAddressBar: this.IS_SERVER
        ? getSSEUrl(props.sandbox.id)
        : frameUrl(props.sandbox.id, props.initialPath || ''),
      url: null,
    };

    // we need a value that doesn't change when receiving `initialPath`
    // from the query params, or the iframe will continue to be re-rendered
    // when the user navigates the iframe app, which shows the loading screen
    this.initialPath = props.initialPath;

    this.lastSent = {
      sandboxId: props.sandbox.id,
      modules: this.getModulesToSend(),
    };

    if (this.IS_SERVER) {
      this.setupSSESockets(props.sandbox.id);
    }
    this.listener = listen(this.handleMessage);

    if (props.delay) {
      this.executeCode = debounce(this.executeCode, 800);
    }
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.frameInitialized !== this.state.frameInitialized) {
      this.handleRefresh();
    }
  }

  setupSSESockets = async (id: string) => {
    const hasInitialized = !!this.$socket;

    if (hasInitialized) {
      this.started = false;
      this.setState({
        frameInitialized: false,
      });
      this.$socket.removeListener('connect', this.connectHandler);
      this.$socket.close();
    } else {
      this.$socket = io(getSSEUrl(), {
        autoConnect: false,
      });

      this.$socket.on('sandbox:start', () => {
        dispatch({
          type: 'terminal:message',
          data: '> CodeSandbox: sandbox started\n\r',
        });

        this.started = true;
        if (!this.state.frameInitialized && this.props.onInitialized) {
          this.disposeInitializer = this.props.onInitialized(this);
        }
        this.handleRefresh();
        this.setState({
          frameInitialized: true,
        });
      });

      this.$socket.on('sandbox:stop', () => {
        this.started = false;
        this.setState({
          frameInitialized: false,
          stopped: true,
        });
        this.stopped = true;
      });

      this.$socket.on('sandbox:log', ({ chan, data }) => {
        dispatch({
          type: 'terminal:message',
          chan,
          data,
        });
      });
    }

    const token = await retrieveSSEToken();

    this.connectHandler = () => {
      this.$socket.emit('sandbox', { id, token });

      dispatch({
        type: 'terminal:message',
        data: '> CodeSandbox: connected! Initializing container...\n\r',
      });

      if (!this.started) {
        this.start();
      }
    };

    this.$socket.on('connect', this.connectHandler);

    this.$socket.open();
  };

  start() {
    this.$socket.emit('sandbox:start');
  }

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
    this.IS_SERVER = getTemplate(this.props.sandbox.template).isServer;

    const url = this.IS_SERVER
      ? getSSEUrl(newId)
      : frameUrl(newId, this.props.initialPath || '');

    this.setupSSESockets(newId);
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
        registerFrame(source);

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

    if (settings.clearConsoleEnabled && !this.IS_SERVER) {
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
      if (this.IS_SERVER) {
        const diff = getDiff(this.lastSent.modules, modulesToSend);

        this.lastSent.modules = modulesToSend;

        if (Object.keys(diff).length > 0) {
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
        (this.IS_SERVER
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

  restartServer = () => {
    this.$socket.emit('sandbox:restart');
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

    const { historyPosition, history, urlInAddressBar } = this.state;
    const url =
      urlInAddressBar ||
      (this.IS_SERVER ? getSSEUrl(sandbox.id) : frameUrl(sandbox.id));

    if (noPreview) {
      // Means that preview is open in another tab definitely
      return null;
    }

    return (
      <Container style={{ flex: 1, display: hide ? 'none' : undefined }}>
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
            restartServer={this.restartServer}
          />
        )}

        <StyledFrame
          sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
          src={
            this.IS_SERVER
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
