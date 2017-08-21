/* @flow */
import * as React from 'react';
import styled from 'styled-components';

import { debounce } from 'lodash';

import type { Preferences } from 'app/store/preferences/reducer';
import type { Module, Sandbox, Directory } from 'common/types';

import { frameUrl } from 'app/utils/url-generator';
import { findMainModule } from 'app/store/entities/sandboxes/modules/selectors';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import shouldUpdate from './utils/should-update';

import Navigator from './Navigator';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
`;

const StyledFrame = styled.iframe`
  border-width: 0px;
  height: calc(100% - ${props => (props.hideNavigation ? 3 : 6)}rem);
  width: 100%;
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
};

type State = {
  frameInitialized: boolean,
  url: ?string,
  history: Array<string>,
  historyPosition: number,
  urlInAddressBar: string,
};

export default class Preview extends React.PureComponent<Props, State> {
  initialPath: string;
  frames: Array<HTMLFrameElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      frameInitialized: false,
      history: [],
      historyPosition: 0,
      urlInAddressBar: frameUrl(props.sandboxId, props.initialPath || ''),
      url: null,
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

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isInProjectView !== this.props.isInProjectView) {
      this.executeCodeImmediately();
      return;
    }

    if (prevProps.sandboxId !== this.props.sandboxId) {
      this.executeCodeImmediately();
      return;
    } else if (prevProps.forcedRenders !== this.props.forcedRenders) {
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
      this.props.directories,
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

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  openNewWindow = () => {
    if (this.props.sandboxActions) {
      this.props.sandboxActions.setViewMode(this.props.sandboxId, true, false);
    }
    window.open(this.state.urlInAddressBar, '_blank');
  };

  sendMessage = (message: Object) => {
    this.frames.forEach(frame => {
      frame.postMessage(message, frameUrl(this.props.sandboxId));
    });
  };

  handleMessage = (e: MessageEvent | { data: Object | string }) => {
    if (e.data === 'Ready!') {
      this.frames.push(e.source);
      this.setState({
        frameInitialized: true,
      });
      this.executeCodeImmediately();
    } else {
      const { type } = e.data;

      switch (type) {
        case 'render': {
          this.executeCodeImmediately();
          break;
        }
        case 'urlchange': {
          this.commitUrl(e.data.url);
          break;
        }
        case 'resize': {
          if (this.props.setFrameHeight) {
            this.props.setFrameHeight(e.data.height);
          }
          break;
        }
        case 'action': {
          if (this.props.runActionFromPreview) {
            this.props.runActionFromPreview({
              ...e.data,
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
  };

  executeCode = () => {
    requestAnimationFrame(() => {
      this.executeCodeImmediately();
    });
  };

  getRenderedModule = () => {
    const { modules, module, isInProjectView } = this.props;
    return isInProjectView ? findMainModule(modules) : module;
  };

  executeCodeImmediately = () => {
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
      console.clear();
    }

    // Do it here so we can see the dependency fetching screen if needed
    this.clearErrors();
    const renderedModule = this.getRenderedModule();
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

    this.commitUrl(urlInAddressBar);
  };

  handleRefresh = () => {
    const { history, historyPosition } = this.state;

    document.getElementById('sandbox').src = '';

    setTimeout(() => {
      document.getElementById('sandbox').src = history[historyPosition];
    }, 100);

    this.setState({
      urlInAddressBar: history[historyPosition],
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
    } = this.props;
    const { historyPosition, history, urlInAddressBar } = this.state;

    const url = urlInAddressBar || frameUrl(sandboxId);

    return (
      <Container>
        {!hideNavigation &&
          <Navigator
            url={decodeURIComponent(url)}
            onChange={this.updateUrl}
            onConfirm={this.sendUrl}
            onBack={historyPosition > 0 && this.handleBack}
            onForward={
              historyPosition < history.length - 1 && this.handleForward
            }
            onRefresh={this.handleRefresh}
            isProjectView={isInProjectView}
            toggleProjectView={setProjectView && this.toggleProjectView}
            openNewWindow={this.openNewWindow}
          />}

        <StyledFrame
          sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
          src={frameUrl(sandboxId, this.initialPath)}
          id="sandbox"
          hideNavigation={hideNavigation}
        />
      </Container>
    );
  }
}
