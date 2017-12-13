// @flow
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { camelizeKeys } from 'humps';

import type { Sandbox } from 'common/types';
import getTemplateDefinition from 'common/templates';
import Centered from 'common/components/flex/Centered';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import { getSandboxOptions } from 'common/url';

import {
  findCurrentModule,
  findMainModule,
} from 'app/store/entities/sandboxes/modules/selectors';

import Header from './components/Header';
import Content from './components/Content';
import Sidebar from './components/Sidebar';

// Okay, this looks veeeery strange, we need this because Webpack has a bug currently
// that makes it think we have core-js/es6/map available in embed, but we don't.
// So we explicitly make sure that we have `core-js/es6/map` available by declaring
// new Map.
// eslint-disable-next-line
new Map();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: white;
`;

const Fullscreen = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Moving = styled.div`
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateX(${props => (props.sidebarOpen ? 250 : 0)}px);
  box-shadow: -3px 3px 3px rgba(0, 0, 0, 0.5);
`;

type State = {
  notFound: boolean,
  sandbox: ?Sandbox,
  showEditor: boolean,
  showPreview: boolean,
  isInProjectView: boolean,
  currentModule: ?string,
  sidebarOpen: boolean,
  autoResize: boolean,
  hideNavigation: boolean,
  fontSize: number,
  enableEslint: boolean,
  useCodeMirror: boolean,
  editorSize: number,
  forceRefresh: boolean,
  expandDevTools: boolean,
  runOnClick: boolean,
  highlightedLines: Array<string>,
};

export default class App extends React.PureComponent<{}, State> {
  constructor() {
    super();

    const {
      currentModule,
      initialPath,
      isInProjectView,
      isPreviewScreen,
      isEditorScreen,
      autoResize,
      hideNavigation,
      fontSize,
      enableEslint,
      useCodeMirror,
      editorSize,
      highlightedLines,
      forceRefresh,
      expandDevTools,
      runOnClick,
    } = getSandboxOptions(document.location.href);

    this.state = {
      notFound: false,
      sandbox: null,
      fontSize: fontSize || 16,
      showEditor: !isPreviewScreen,
      showPreview: !isEditorScreen,
      isInProjectView,
      currentModule,
      initialPath,
      sidebarOpen: false,
      autoResize,
      hideNavigation,
      enableEslint,
      useCodeMirror,
      editorSize,
      forceRefresh,
      expandDevTools,
      runOnClick,
      highlightedLines: highlightedLines || [],
    };
  }

  getId = () => {
    const matches = location.pathname.match(/^\/embed\/(.*?)$/);

    if (matches && matches.length > 1) {
      return matches[1];
    }
    return null;
  };

  getAppOrigin = () => location.origin.replace('embed.', '');

  fetchSandbox = async (id: string) => {
    try {
      const response = await fetch(
        `${this.getAppOrigin()}/api/v1/sandboxes/${id}`
      )
        .then(res => res.json())
        .then(camelizeKeys);

      document.title = response.data.title
        ? `${response.data.title} - CodeSandbox`
        : 'Embed - CodeSandbox';
      this.setState({ sandbox: response.data });
    } catch (e) {
      this.setState({ notFound: true });
    }
  };

  componentWillMount() {
    const id = this.getId();

    if (!id) {
      this.setState({ notFound: true });
      return;
    }

    this.fetchSandbox(id);
  }

  setEditorView = () => this.setState({ showEditor: true, showPreview: false });
  setPreviewView = () =>
    this.setState({ showEditor: false, showPreview: true });
  setMixedView = () => this.setState({ showEditor: true, showPreview: true });

  setCurrentModule = (id: string) => this.setState({ currentModule: id });

  toggleSidebar = () => this.setState({ sidebarOpen: !this.state.sidebarOpen });

  setProjectView = (sandboxId: string, isOpen: boolean) =>
    this.setState({ isInProjectView: isOpen });

  getCurrentModuleFromPath = () => {
    const { sandbox, currentModule: currentModulePath } = this.state;
    if (!sandbox) return null;

    return findCurrentModule(
      sandbox.modules,
      sandbox.directories,
      currentModulePath,
      findMainModule(sandbox.modules, sandbox.directories, sandbox.entry)
    );
  };

  content = () => {
    if (this.state.notFound) {
      return (
        <Centered vertical horizontal>
          <Title delay={0.1}>Not Found</Title>
          <SubTitle delay={0.05}>
            We could not find the sandbox you{"'"}re looking for.
          </SubTitle>
        </Centered>
      );
    }

    if (!this.state.sandbox) {
      return (
        <Centered vertical horizontal>
          <Title delay={0.3}>Loading Sandbox...</Title>
        </Centered>
      );
    }

    const { showEditor, showPreview, isInProjectView, runOnClick } = this.state;

    return (
      <ThemeProvider
        theme={{
          templateColor: getTemplateDefinition(this.state.sandbox.template)
            .color,
        }}
      >
        <Container>
          <Header
            showEditor={showEditor}
            showPreview={showPreview}
            setEditorView={this.setEditorView}
            setPreviewView={this.setPreviewView}
            setMixedView={this.setMixedView}
            sandbox={this.state.sandbox}
            toggleSidebar={this.toggleSidebar}
          />
          <Content
            showEditor={showEditor}
            showPreview={showPreview}
            isInProjectView={isInProjectView}
            setProjectView={this.setProjectView}
            sandbox={this.state.sandbox}
            currentModule={this.getCurrentModuleFromPath().id}
            hideNavigation={this.state.hideNavigation}
            autoResize={this.state.autoResize}
            fontSize={this.state.fontSize}
            initialPath={this.state.initialPath}
            setCurrentModule={this.setCurrentModule}
            useCodeMirror={this.state.useCodeMirror}
            enableEslint={this.state.enableEslint}
            editorSize={this.state.editorSize}
            highlightedLines={this.state.highlightedLines}
            forceRefresh={this.state.forceRefresh}
            expandDevTools={this.state.expandDevTools}
            runOnClick={runOnClick}
          />
        </Container>
      </ThemeProvider>
    );
  };

  render() {
    return (
      <Fullscreen sidebarOpen={this.state.sidebarOpen}>
        {this.state.sandbox && (
          <Sidebar
            setCurrentModule={this.setCurrentModule}
            currentModule={this.getCurrentModuleFromPath().id}
            sandbox={this.state.sandbox}
          />
        )}
        <Moving sidebarOpen={this.state.sidebarOpen}>{this.content()}</Moving>
      </Fullscreen>
    );
  }
}
