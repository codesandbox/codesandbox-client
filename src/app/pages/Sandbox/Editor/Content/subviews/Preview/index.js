/* @flow */
import React from 'react';
import styled from 'styled-components';

import { debounce } from 'lodash';

import type { Preferences } from 'app/store/preferences/reducer';

import type { Module } from 'app/store/entities/sandboxes/modules/entity';
import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import type {
  Directory,
} from 'app/store/entities/sandboxes/directories/entity';
import { frameUrl } from 'app/utils/url-generator';
import { isMainModule } from 'app/store/entities/sandboxes/modules/validator';
import defaultBoilerplates
  from 'app/store/entities/sandboxes/boilerplates/default-boilerplates';

import Navigator from './Navigator';
import Message from './Message';

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
`;

const StyledFrame = styled.iframe`
  border-width: 0px;
  height: calc(100% - 6rem);
  width: 100%;
`;

type Props = {
  sandboxId: string,
  isInProjectView: boolean,
  modules: Array<Module>,
  directories: Array<Directory>,
  bundle: Sandbox.dependencyBundle,
  externalResources: typeof Sandbox.externalResources,
  preferences: Preferences,
  fetchBundle: (id: string) => Object,
  setProjectView: (id: string, isInProjectView: boolean) => void,
  module: Module,
  setError: (id: string, error: ?{ message: string, line: number }) => void,
};

type State = {
  frameInitialized: boolean,
  url: ?string,
  history: Array<string>,
  historyPosition: number,
  urlInAddressBar: string,
};

export default class Preview extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      frameInitialized: false,
      history: [],
      historyPosition: 0,
      urlInAddressBar: '',
      url: null,
    };

    this.executeCode = debounce(this.executeCode, 400);
  }

  fetchBundle = () => {
    const { sandboxId, fetchBundle } = this.props;
    fetchBundle(sandboxId);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isInProjectView !== this.props.isInProjectView) {
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
        this.executeCode();
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
    document
      .getElementById('sandbox')
      .contentWindow.postMessage(message, frameUrl());
  };

  handleMessage = (e: Object) => {
    if (e.data === 'Ready!') {
      this.setState({
        frameInitialized: true,
      });
      this.executeCode();
    } else {
      const { type } = e.data;
      if (type === 'error') {
        const { error } = e.data;
        this.setError(error);
      } else if (type === 'success') {
        this.setError(null);
      } else if (type === 'urlchange') {
        const url = e.data.url.replace('/', '');
        this.commitUrl(url);
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
    return isInProjectView ? modules.find(isMainModule) : module;
  };

  executeCodeImmediately = () => {
    const {
      modules,
      directories,
      bundle = {},
      module,
      sandboxId,
      externalResources,
    } = this.props;

    if (bundle.manifest == null) {
      if (!bundle.processing && !bundle.error) {
        this.fetchBundle();
      }
      return;
    }

    const renderedModule = this.getRenderedModule();
    this.sendMessage({
      type: 'compile',
      boilerplates: defaultBoilerplates,
      module: renderedModule,
      changedModule: module,
      sandboxId,
      modules,
      directories,
      manifest: bundle.manifest,
      url: bundle.url,
      externalResources,
    });
  };

  setError = (e: ?{ moduleId: string, message: string, line: number }) => {
    this.props.setError(this.getRenderedModule().id, e);
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
    const { sandboxId, bundle = {}, isInProjectView } = this.props;
    const {
      historyPosition,
      history,
      urlInAddressBar,
    } = this.state;

    const renderedModule = this.getRenderedModule();

    const url = urlInAddressBar || '';

    return (
      <Container>
        <Navigator
          url={decodeURIComponent(url)}
          onChange={this.updateUrl}
          onConfirm={this.sendUrl}
          onBack={historyPosition > 0 && this.handleBack}
          onForward={historyPosition < history.length - 1 && this.handleForward}
          onRefresh={this.handleRefresh}
          isProjectView={isInProjectView}
          toggleProjectView={this.toggleProjectView}
        />

        {!bundle.processing &&
          renderedModule.error &&
          <Message error={renderedModule.error} sandboxId={sandboxId} />}
        {bundle.processing
          ? <Message message="Loading the dependencies..." />
          : <StyledFrame
              sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups"
              src={frameUrl()}
              id="sandbox"
            />}
      </Container>
    );
  }
}
