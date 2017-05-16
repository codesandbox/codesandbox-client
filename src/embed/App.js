// @flow
import React from 'react';
import styled from 'styled-components';
import { camelizeKeys } from 'humps';
import 'whatwg-fetch';

import type { Sandbox } from 'common/types';
import Centered from 'app/components/flex/Centered';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';

import Header from './components/Header';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
import { getSandboxOptions } from '../common/url';

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
  sandbox: Sandbox,
  showEditor: boolean,
  showPreview: boolean,
  isInProjectView: boolean,
  currentModule: ?string,
  sidebarOpen: boolean,
};

export default class App extends React.PureComponent {
  state: State;

  constructor() {
    super();

    const {
      currentModule,
      isPreviewScreen,
      isEditorScreen,
    } = getSandboxOptions();

    this.state = {
      notFound: false,
      sandbox: null,
      showEditor: !isPreviewScreen,
      showPreview: !isEditorScreen,
      isInProjectView: !currentModule,
      currentModule,
      sidebarOpen: false,
    };
  }

  getId = () => {
    const matches = location.pathname.match(/^\/embed\/(.*?)(\/|$)/);

    if (matches && matches.length > 1) {
      return matches[1];
    }
    return null;
  };

  getAppOrigin = () => {
    return location.origin.replace('embed.', '');
  };

  fetchSandbox = async (id: string) => {
    try {
      const response = await fetch(
        `${this.getAppOrigin()}/api/v1/sandboxes/${id}`,
      )
        .then(res => res.json())
        .then(camelizeKeys);

      this.setState({
        sandbox: response.data,
        currentModule: this.state.currentModule ||
          response.data.modules.find(
            m => m.title === 'index.js' && m.directoryShortid == null,
          ).shortid,
      });
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

    const { showEditor, showPreview, isInProjectView } = this.state;

    return (
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
          currentModule={this.state.currentModule}
        />
      </Container>
    );
  };

  render() {
    return (
      <Fullscreen sidebarOpen={this.state.sidebarOpen}>
        {this.state.sandbox &&
          <Sidebar
            setCurrentModule={this.setCurrentModule}
            currentModule={this.state.currentModule}
            sandbox={this.state.sandbox}
          />}
        <Moving sidebarOpen={this.state.sidebarOpen}>
          {this.content()}
        </Moving>
      </Fullscreen>
    );
  }
}
