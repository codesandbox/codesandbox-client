import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { camelizeKeys } from 'humps';

import getTemplateDefinition from 'common/templates';
import Centered from 'common/components/flex/Centered';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import { getSandboxOptions } from 'common/url';

import { findCurrentModule, findMainModule } from 'common/sandbox/modules';

import Header from '../Header';
import Content from '../Content';
import Sidebar from '../Sidebar';

import { Container, Fullscreen, Moving } from './elements';

// Okay, this looks veeeery strange, we need this because Webpack has a bug currently
// that makes it think we have core-js/es6/map available in embed, but we don't.
// So we explicitly make sure that we have `core-js/es6/map` available by declaring
// new Map.
// eslint-disable-next-line
new Map();

export default class App extends React.PureComponent {
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

  fetchSandbox = async id => {
    try {
      const response = await fetch(
        `${this.getAppOrigin()}/api/v1/sandboxes/${id}`
      )
        .then(res => res.json())
        .then(camelizeKeys);

      document.title = `${response.data.title ||
        response.data.id} - CodeSandbox`;

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

  setCurrentModule = id => this.setState({ currentModule: id });

  toggleSidebar = () => this.setState({ sidebarOpen: !this.state.sidebarOpen });

  setProjectView = (sandboxId, isOpen, cb) =>
    this.setState({ isInProjectView: isOpen }, cb);

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
            currentModule={this.getCurrentModuleFromPath()}
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
