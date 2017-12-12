/* @flow */
import * as React from 'react';
import styled from 'styled-components';
import { listen, dispatch } from 'codesandbox-api';
import { inject, observer } from 'mobx-react';
import { observe, reaction } from 'mobx';
import { debounce } from 'lodash';

import { frameUrl } from 'common/utils/url-generator';
import shouldUpdate from './utils/should-update';

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

class Preview extends React.Component {
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

    if (!props.noDelay) {
      this.executeCode = debounce(this.executeCode, 800);
    }

    this.frames = [];
  }

  static defaultProps = {
    hideNavigation: false,
    noDelay: false,
  };

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
    this.disposeHandleSandboxChange();
    this.disposeHandleProjectViewChange();
    this.disposeHandleForcedRenders();
    this.disposeHandleExternalResources();
    this.disposeHandleModuleChange();
    this.disposeHandleModuleSyncedChange();
    this.disposeHandleCodeChange();
    this.disposeHandleStructureChange();
  }

  componentDidMount() {
    this.listener = listen(this.handleMessage);
    this.disposeHandleSandboxChange = observe(
      this.props.store.editor,
      'currentSandbox',
      this.handleSandboxChange
    );
    this.disposeHandleProjectViewChange = observe(
      this.props.store.editor,
      'isInProjectView',
      this.handleExecuteCode
    );
    this.disposeHandleForcedRenders = observe(
      this.props.store.editor,
      'forceRender',
      this.handleExecuteCode
    );
    this.disposeHandleExternalResources = observe(
      this.props.store.editor.currentSandbox,
      'externalResources',
      this.handleExecuteCode
    );
    this.disposeHandleModuleChange = observe(
      this.props.store.editor,
      'currentModule',
      this.handleExecuteCode
    );
    this.disposeHandleModuleSyncedChange = observe(
      this.props.store.editor,
      'isAllModulesSynced',
      this.handleModuleSyncedChange
    );
    this.disposeHandleCodeChange = observe(
      this.props.store.editor.currentModule,
      'code',
      this.handleCodeOrStructureChange
    );
    this.disposeHandleStructureChange = reaction(
      this.detectStructureChange,
      this.handleCodeOrStructureChange
    );
  }

  detectStructureChange = () => {
    const sandbox = this.props.store.editor.currentSandbox;

    return sandbox.modules
      .map(module => module.directoryShortid)
      .concat(sandbox.directories.map(directory => directory.directoryShortid));
  };

  handleCodeOrStructureChange = () => {
    const settings = this.props.store.editor.preferences.settings;
    if (this.state.frameInitialized && settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        this.executeCodeImmediately();
      } else {
        this.executeCode();
      }
    }
  };

  handleModuleSyncedChange = change => {
    if (!change.oldValue && change.newValue) {
      this.executeCodeImmediately();
    }
  };

  handleExecuteCode = () => {
    this.executeCodeImmediately();
  };

  handleSandboxChange = change => {
    const url = frameUrl(
      change.newValue.id,
      this.props.store.editor.initialPath
    );
    this.setState({
      history: [url],
      historyPosition: 0,
      urlInAddressBar: url,
    });
  };

  listener: Function;

  openNewWindow = () => {
    this.props.signals.editor.preferences.viewModeChanged({
      showEditor: true,
      showPreview: false,
    });

    window.open(this.state.urlInAddressBar, '_blank');
  };

  sendMessage = (message: Object) => {
    const rawMessage = JSON.parse(JSON.stringify(message));
    this.frames.forEach(frame => {
      frame.postMessage(
        { ...rawMessage, codesandbox: true },
        frameUrl(this.props.store.editor.currentId)
      );
    });
  };

  handleMessage = (data: Object, source: HTMLIFrameElement) => {
    if (source) {
      if (data.type === 'initialized') {
        if (this.frames.indexOf(source) === -1) {
          this.frames.push(source);
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
            if (this.props.setFrameHeight) {
              this.props.setFrameHeight(data.height);
            }
            break;
          }
          case 'action': {
            this.props.signals.editor.previewActionReceived({
              action: {
                ...data,
                sandboxId: this.props.sandboxId,
              },
            });
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

  executeCodeImmediately = (initialRender: boolean = false) => {
    const settings = this.props.store.editor.preferences.settings;
    const sandbox = this.props.store.editor.currentSandbox;

    if (settings.clearConsoleEnabled) {
      console.clear(); // eslint-disable-line no-console
      dispatch({ type: 'clear-console' });
    }

    // Do it here so we can see the dependency fetching screen if needed
    this.clearErrors();
    if (settings.forceRefresh && !initialRender) {
      this.handleRefresh();
    } else {
      const renderedModule = this.props.store.editor.currentModule;

      if (!this.props.store.editor.isInProjectView) {
        this.evaluateInSandbox(`history.pushState({}, null, '/')`);
      }

      this.sendMessage({
        type: 'compile',
        module: renderedModule,
        changedModule: renderedModule,
        dependencies: sandbox.npmDependencies,
        modules: sandbox.modules,
        directories: sandbox.directories,
        sandboxId: sandbox.id,
        externalResources: sandbox.externalResources,
        template: sandbox.template,
        hasActions: !!this.props.runActionFromPreview,
        isModuleView: !this.props.store.editor.isInProjectView,
      });
    }
  };

  clearErrors = () => {
    this.props.signals.editor.errorsCleared();
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
    this.props.signals.editor.projectViewToggled();
  };

  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    const { hideNavigation, store, inactive, signals } = this.props;
    const sandbox = store.editor.currentSandbox;
    const { historyPosition, history, dragging, urlInAddressBar } = this.state;
    const preferences = store.editor.preferences;
    const url = urlInAddressBar || frameUrl(sandbox.id);

    return (
      <Container>
        {!hideNavigation && (
          <Navigator
            url={decodeURIComponent(url)}
            onChange={this.updateUrl}
            onConfirm={this.sendUrl}
            onBack={historyPosition > 0 ? this.handleBack : null}
            onForward={
              historyPosition < history.length - 1 ? this.handleForward : null
            }
            onRefresh={this.handleRefresh}
            isProjectView={store.editor.isInProjectView}
            toggleProjectView={this.toggleProjectView}
            openNewWindow={this.openNewWindow}
            zenMode={preferences.settings.zenMode}
          />
        )}

        <StyledFrame
          sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
          src={frameUrl(sandbox.id, this.initialPath)}
          id="sandbox"
          title={sandbox.id}
          hideNavigation={hideNavigation}
          style={{ pointerEvents: dragging || inactive ? 'none' : 'initial' }}
        />
        <DevTools
          setDragging={this.setDragging}
          evaluateCommand={this.evaluateInSandbox}
          sandboxId={sandbox.id}
          shouldExpandDevTools={preferences.showDevtools}
          zenMode={preferences.zenMode}
          devToolsOpen={isOpen => {
            signals.editor.preferences.devtoolsOpened({ isOpen });
          }}
          setDevToolsOpen={this.props.setDevToolsOpen}
        />
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(Preview));
