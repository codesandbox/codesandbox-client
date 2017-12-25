import * as React from 'react';
import styled from 'styled-components';
import { listen, dispatch } from 'codesandbox-api';
import { debounce } from 'lodash';

import { frameUrl } from 'common/utils/url-generator';
import { getModulePath } from 'app/utils/modules';

import DevTools from './DevTools';
import Navigator from './Navigator';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-color: white;

  display: flex;
  flex-direction: column;
`;

const StyledFrame = styled.iframe`
  border-width: 0px;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
`;

class BasePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frameInitialized: false,
      history: [],
      historyPosition: -1,
      urlInAddressBar: frameUrl(props.sandboxId, props.initialPath || ''),
      url: null,
      dragging: false,
    };

    if (props.delay) {
      this.executeCode = debounce(this.executeCode, 800);
    }

    this.frames = [];
  }

  static defaultProps = {
    showNavigation: true,
    delay: true,
  };

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
    if (this.diposeInitialize) {
      this.diposeInitialize();
    }
  }

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  openNewWindow = () => {
    if (this.props.onOpenNewWindow) {
      this.props.onOpenNewWindow();
    }

    window.open(this.state.urlInAddressBar, '_blank');
  };

  sendMessage = (message: Object) => {
    const rawMessage = JSON.parse(JSON.stringify(message));
    this.frames.forEach(frame => {
      frame.postMessage(
        { ...rawMessage, codesandbox: true },
        frameUrl(this.props.sandbox.id)
      );
    });
  };

  handleSandboxChange = () => {
    const url = frameUrl(this.props.sandbox.id, this.props.initialPath);
    this.setState(
      {
        history: [url],
        historyPosition: 0,
        urlInAddressBar: url,
      },
      () => this.handleRefresh()
    );
  };

  handleMessage = (data: Object, source: HTMLIFrameElement) => {
    if (source) {
      if (data.type === 'initialized') {
        if (this.frames.indexOf(source) === -1) {
          this.frames.push(source);
        }

        if (!this.state.frameInitialized && this.props.onInitialized) {
          this.diposeInitialize = this.props.onInitialized(this);
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
                sandboxId: this.props.sandboxId,
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

  setDragging = (dragging: boolean) => {
    this.setState({ dragging });
  };

  getRenderedModule = () => {
    const { sandbox, currentModule, isInProjectView } = this.props;

    return isInProjectView
      ? '/' + sandbox.entry
      : getModulePath(sandbox.modules, sandbox.directories, currentModule.id);
  };

  executeCodeImmediately = (initialRender: boolean = false) => {
    const settings = this.props.settings;
    const sandbox = this.props.sandbox;

    if (settings.clearConsoleEnabled) {
      console.clear(); // eslint-disable-line no-console
      dispatch({ type: 'clear-console' });
    }

    // Do it here so we can see the dependency fetching screen if needed
    this.clearErrors();
    if (settings.forceRefresh && !initialRender) {
      this.handleRefresh();
    } else {
      if (!this.props.isInProjectView) {
        this.evaluateInSandbox(`history.pushState({}, null, '/')`);
      }

      const normalizedModules = sandbox.modules.map(m => ({
        path: getModulePath(sandbox.modules, sandbox.directories, m.id),
        code: m.code,
      }));

      this.sendMessage({
        type: 'compile',
        version: 2,
        entry: this.getRenderedModule(),
        dependencies: sandbox.npmDependencies,
        modules: normalizedModules,
        sandboxId: sandbox.id,
        externalResources: sandbox.externalResources,
        template: sandbox.template,
        hasActions: !!this.props.onAction,
      });
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

    document.getElementById('sandbox').src = urlInAddressBar;

    this.setState({
      history: [urlInAddressBar],
      historyPosition: 0,
      urlInAddressBar,
    });
  };

  handleRefresh = () => {
    const { history, historyPosition } = this.state;
    const url = history[historyPosition];

    document.getElementById('sandbox').src = url;

    this.setState({
      history: [url],
      historyPosition: 0,
      urlInAddressBar: url,
    });
  };

  handleBack = () => {
    this.sendMessage({
      type: 'urlback',
    });

    const { historyPosition, history } = this.state;
    this.setState({
      historyPosition: this.state.historyPosition - 1,
      urlInAddressBar: history[historyPosition - 1],
    });
  };

  handleForward = () => {
    this.sendMessage({
      type: 'urlforward',
    });

    const { historyPosition, history } = this.state;
    this.setState({
      historyPosition: this.state.historyPosition + 1,
      urlInAddressBar: history[historyPosition + 1],
    });
  };

  evaluateInSandbox = (command: string) => {
    this.sendMessage({
      type: 'evaluate',
      command,
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
      showDevtools,
    } = this.props;
    const { historyPosition, history, dragging, urlInAddressBar } = this.state;
    const url = urlInAddressBar || frameUrl(sandbox.id);

    return (
      <Container>
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
            toggleProjectView={this.toggleProjectView}
            openNewWindow={this.openNewWindow}
            zenMode={settings.zenMode}
          />
        )}

        <StyledFrame
          sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
          src={frameUrl(sandbox.id, this.initialPath)}
          id="sandbox"
          title={sandbox.id}
          hideNavigation={!showNavigation}
          style={{ pointerEvents: dragging || inactive ? 'none' : 'initial' }}
        />
        <DevTools
          setDragging={this.setDragging}
          evaluateCommand={this.evaluateInSandbox}
          sandboxId={sandbox.id}
          shouldExpandDevTools={showDevtools}
          zenMode={settings.zenMode}
          devToolsOpen={this.props.onDevtoolsOpen}
          setDevToolsOpen={this.props.setDevToolsOpen}
        />
      </Container>
    );
  }
}

export default BasePreview;
