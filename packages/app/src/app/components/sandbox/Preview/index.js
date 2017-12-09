/* @flow */
import * as React from 'react';
import styled from 'styled-components';
import { listen, dispatch } from 'codesandbox-api';

import { debounce } from 'lodash';

import type { Module, Sandbox, Preferences, Directory } from 'common/types';

import { frameUrl } from 'common/utils/url-generator';
import { findMainModule } from 'app/store/entities/sandboxes/modules/selectors';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
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

type Props = {
  sandboxId: string,
  template: string,
  initialPath: ?string,
  isInProjectView: boolean,
  modules: Array<Module>,
  directories: Array<Directory>,
  externalResources: typeof Sandbox.externalResources,
  preferences: Preferences,
  setProjectView: (id: string, isInProjectView: boolean) => any,
  module: Module,
  clearErrors: ?(sandboxId: string) => any,
  sandboxActions: typeof sandboxActionCreators,
  noDelay?: boolean,
  hideNavigation?: boolean,
  setFrameHeight: ?(height: number) => any,
  dependencies: Object,
  runActionFromPreview: (arg: Object) => any,
  forcedRenders: ?number,
  inactive: ?boolean,
  shouldExpandDevTools: ?boolean,
  entry: string,
  devToolsOpen: ?boolean,
  setDevToolsOpen: ?(open: boolean) => void,
};

type State = {
  frameInitialized: boolean,
  url: ?string,
  history: Array<string>,
  historyPosition: number,
  urlInAddressBar: string,
  dragging: boolean,
};

export default class Preview extends React.PureComponent<Props, State> {
  initialPath: string;
  frames: Array<HTMLIFrameElement>;

  constructor(props: Props) {
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

    // we need a value that doesn't change when receiving `initialPath`
    // from the query params, or the iframe will continue to be re-rendered
    // when the user navigates the iframe app, which shows the loading screen
    this.initialPath = props.initialPath;
    this.frames = [];
  }

  static defaultProps = {
    hideNavigation: false,
    noDelay: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      const url = frameUrl(nextProps.sandboxId, this.initialPath);
      this.setState({
        history: [url],
        historyPosition: 0,
        urlInAddressBar: url,
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isInProjectView !== this.props.isInProjectView) {
      this.executeCodeImmediately();
      return;
    }

    if (prevProps.forcedRenders !== this.props.forcedRenders) {
      this.executeCodeImmediately();
      return;
    }

    if (prevProps.externalResources !== this.props.externalResources) {
      // Changed external resources
      this.executeCodeImmediately();
      return;
    }

    if (prevProps.module.id !== this.props.module.id) {
      if (prevProps.isInProjectView && this.props.isInProjectView) {
        // If user only navigated while watching project
        return;
      }
      this.executeCodeImmediately();
      return;
    }

    if (prevProps.module.isNotSynced && !this.props.module.isNotSynced) {
      // After save
      this.executeCodeImmediately();
      return;
    }

    // If the strucutre (filenames etc) changed
    const structureChanged = shouldUpdate(
      prevProps.modules,
      prevProps.directories,
      this.props.modules,
      this.props.directories
    );
    if (
      (prevProps.module.code !== this.props.module.code || structureChanged) &&
      this.state.frameInitialized
    ) {
      if (this.props.preferences.livePreviewEnabled) {
        if (
          this.props.preferences.instantPreviewEnabled ||
          prevProps.module.code === this.props.module.code
        ) {
          this.executeCodeImmediately();
        } else {
          this.executeCode();
        }
      }
    }
  }

  listener: Function;

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
  }

  openNewWindow = () => {
    if (this.props.sandboxActions) {
      this.props.sandboxActions.setViewMode(this.props.sandboxId, true, false);
    }
    window.open(this.state.urlInAddressBar, '_blank');
  };

  sendMessage = (message: Object) => {
    this.frames.forEach(frame => {
      frame.postMessage(
        { ...message, codesandbox: true },
        frameUrl(this.props.sandboxId)
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
            if (this.props.runActionFromPreview) {
              this.props.runActionFromPreview({
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
    const { modules, module, directories, entry, isInProjectView } = this.props;
    return isInProjectView
      ? findMainModule(modules, directories, entry)
      : module;
  };

  executeCodeImmediately = (initialRender: boolean = false) => {
    const {
      modules,
      directories,
      module,
      externalResources,
      preferences,
      dependencies,
      sandboxId,
      isInProjectView,
      runActionFromPreview,
      template,
    } = this.props;
    if (preferences.clearConsoleEnabled) {
      console.clear(); // eslint-disable-line no-console
      dispatch({ type: 'clear-console' });
    }

    // Do it here so we can see the dependency fetching screen if needed
    this.clearErrors();
    if (preferences.forceRefresh && !initialRender) {
      this.handleRefresh();
    } else {
      const renderedModule = this.getRenderedModule();

      if (!isInProjectView) {
        this.evaluateInSandbox(`history.pushState({}, null, '/')`);
      }

      this.sendMessage({
        type: 'compile',
        module: renderedModule,
        changedModule: module,
        dependencies,
        modules,
        directories,
        sandboxId,
        externalResources,
        template,
        hasActions: !!runActionFromPreview,
        isModuleView: !isInProjectView,
      });
    }
  };

  clearErrors = () => {
    if (this.props.clearErrors) {
      this.props.clearErrors(this.props.sandboxId);
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
    const { setProjectView, isInProjectView, sandboxId } = this.props;
    setProjectView(sandboxId, !isInProjectView);
  };

  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    const {
      sandboxId,
      isInProjectView,
      setProjectView,
      hideNavigation,
      inactive,
      shouldExpandDevTools,
    } = this.props;
    const { historyPosition, history, dragging, urlInAddressBar } = this.state;

    const url = urlInAddressBar || frameUrl(sandboxId);

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
            isProjectView={isInProjectView}
            toggleProjectView={setProjectView && this.toggleProjectView}
            openNewWindow={this.openNewWindow}
            zenMode={this.props.preferences.zenMode}
          />
        )}

        <StyledFrame
          sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
          src={frameUrl(sandboxId, this.initialPath)}
          id="sandbox"
          title={sandboxId}
          hideNavigation={hideNavigation}
          style={{ pointerEvents: dragging || inactive ? 'none' : 'initial' }}
        />
        <DevTools
          setDragging={this.setDragging}
          evaluateCommand={this.evaluateInSandbox}
          sandboxId={sandboxId}
          shouldExpandDevTools={shouldExpandDevTools}
          zenMode={this.props.preferences.zenMode}
          devToolsOpen={this.props.devToolsOpen}
          setDevToolsOpen={this.props.setDevToolsOpen}
        />
      </Container>
    );
  }
}
