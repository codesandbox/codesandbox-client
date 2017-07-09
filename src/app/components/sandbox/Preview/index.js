/* @flow */
import React from 'react';
import styled from 'styled-components';

import { debounce } from 'lodash';

import type { Preferences } from 'app/store/preferences/reducer';
import type { Module, Sandbox, Directory, ModuleError } from 'common/types';

import { frameUrl } from 'app/utils/url-generator';
import { findMainModule } from 'app/store/entities/sandboxes/modules/selectors';
import defaultBoilerplates from 'app/store/entities/sandboxes/boilerplates/default-boilerplates';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import Navigator from './Navigator';
import Message from './Message';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
`;

const StyledFrame = styled.iframe`
  border-width: 0px;
  height: calc(100% - ${props => (props.hideNavigation ? 3 : 6)}rem);
  width: 100%;
`;

type Props = {
  sandboxId: string,
  isInProjectView: boolean,
  modules: Array<Module>,
  directories: Array<Directory>,
  bundle: typeof Sandbox.dependencyBundle,
  externalResources: typeof Sandbox.externalResources,
  preferences: Preferences,
  fetchBundle: (id: string) => Object,
  setProjectView: (id: string, isInProjectView: boolean) => any,
  module: Module,
  addError: (sandboxId: string, error: ModuleError) => any,
  clearErrors: (sandboxId: string) => any,
  sandboxActions: typeof sandboxActionCreators,
  noDelay?: boolean,
  errors: ?Array<ModuleError>,
  hideNavigation?: boolean,
  setFrameHeight: ?(height: number) => any,
};

type State = {
  frameInitialized: boolean,
  url: ?string,
  history: Array<string>,
  historyPosition: number,
  urlInAddressBar: string,
};

export default class Preview extends React.PureComponent {
  constructor(props: Props) {
    super(props);

    this.state = {
      frameInitialized: false,
      history: [],
      historyPosition: 0,
      urlInAddressBar: '',
      url: null,
    };

    if (!props.noDelay) {
      this.executeCode = debounce(this.executeCode, 800);
    }
  }

  static defaultProps = {
    hideNavigation: false,
    noDelay: false,
  };

  fetchBundle = () => {
    const { sandboxId, fetchBundle } = this.props;
    fetchBundle(sandboxId);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isInProjectView !== this.props.isInProjectView) {
      this.executeCodeImmediately();
      return;
    }

    if (prevProps.sandboxId !== this.props.sandboxId) {
      this.executeCodeImmediately();
      return;
    }

    if (
      prevProps.bundle &&
      this.props.bundle &&
      prevProps.bundle.processing &&
      !this.props.bundle.processing
    ) {
      // Just got the deps! Update immediately
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

    if (
      (prevProps.module.code !== this.props.module.code ||
        prevProps.modules !== this.props.modules ||
        prevProps.directories !== this.props.directories) &&
      this.state.frameInitialized
    ) {
      if (this.props.preferences.livePreviewEnabled) {
        if (
          this.props.bundle === prevProps.bundle || // So we don't trigger after every dep change
          this.props.sandboxId !== prevProps.sandboxId
        ) {
          if (this.props.preferences.instantPreviewEnabled) {
            this.executeCodeImmediately();
          } else {
            this.executeCode();
          }
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

  sendMessage = (message: Object) => {
    const element = document.getElementById('sandbox');

    if (element) {
      element.contentWindow.postMessage(message, frameUrl());
    }
  };

  handleMessage = (e: Object) => {
    if (e.data === 'Ready!') {
      this.setState({
        frameInitialized: true,
      });
      this.executeCodeImmediately();
    } else {
      const { type } = e.data;
      if (type === 'error') {
        const { error } = e.data;
        this.addError(error);
      } else if (type === 'urlchange') {
        const url = e.data.url.replace('/', '');
        this.commitUrl(url);
      } else if (type === 'resize') {
        if (this.props.setFrameHeight) {
          this.props.setFrameHeight(e.data.height);
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
      bundle = {},
      module,
      externalResources,
      preferences,
    } = this.props;
    if (preferences.clearConsoleEnabled) {
      console.clear();
    }
    if (bundle.externals == null) {
      if (!bundle.processing && !bundle.error) {
        this.fetchBundle();
      }
      return;
    }
    // Do it here so we can see the dependency fetching screen if needed
    this.clearErrors();
    const renderedModule = this.getRenderedModule();
    this.sendMessage({
      type: 'compile',
      boilerplates: defaultBoilerplates,
      module: renderedModule,
      changedModule: module,
      modules,
      directories,
      externals: bundle.externals,
      url: bundle.url,
      externalResources,
    });
  };

  addError = (e: ModuleError) => {
    this.props.addError(this.props.sandboxId, e);
  };

  clearErrors = () => {
    this.props.clearErrors(this.props.sandboxId);
  };

  updateUrl = (url: string) => {
    this.setState({ urlInAddressBar: url });
  };

  sendUrl = () => {
    const { urlInAddressBar } = this.state;

    document.getElementById('sandbox').src = frameUrl(urlInAddressBar);
    this.commitUrl(urlInAddressBar);
  };

  handleRefresh = () => {
    const { history, historyPosition } = this.state;

    document.getElementById('sandbox').src = frameUrl(history[historyPosition]);
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
    history.length = historyPosition + 1;
    this.setState({
      history: [...history, url],
      historyPosition: historyPosition + 1,
      urlInAddressBar: url,
    });
  };

  toggleProjectView = () => {
    const { setProjectView, isInProjectView, sandboxId } = this.props;
    setProjectView(sandboxId, !isInProjectView);
  };

  props: Props;
  state: State;
  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    const {
      sandboxId,
      bundle = {},
      modules,
      sandboxActions,
      isInProjectView,
      setProjectView,
      errors,
      hideNavigation,
    } = this.props;
    const { historyPosition, history, urlInAddressBar } = this.state;

    const url = urlInAddressBar || '';

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
          />}

        {!bundle.processing &&
          errors &&
          errors.length > 0 &&
          <Message
            modules={modules}
            sandboxActions={sandboxActions}
            error={errors[0]}
            sandboxId={sandboxId}
          />}
        {bundle.processing &&
          <Message
            modules={modules}
            sandboxActions={sandboxActions}
            message="Loading the dependencies..."
          />}
        <StyledFrame
          sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
          src={frameUrl()}
          id="sandbox"
          hideNavigation={hideNavigation}
        />
      </Container>
    );
  }
}
