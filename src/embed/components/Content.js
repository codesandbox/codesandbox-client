// @flow

import React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import type { Sandbox, Module } from 'common/types';
import fetchBundle from 'app/store/entities/sandboxes/bundler';

const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme.background2};
  height: calc(100% - 3rem);
`;

const Split = styled.div`
  position: relative;
  width: ${props => (props.show ? '50%' : '0px')};
  max-width: ${props => (props.only ? '100%' : '50%')};
  min-width: ${props => (props.only ? '100%' : '50%')};
  height: calc(100% + 3rem);
`;

type Props = {
  sandbox: Sandbox,
  currentModule: string,
  showEditor: boolean,
  showPreview: boolean,
  isInProjectView: boolean,
  hideNavigation: boolean,
  autoResize: boolean,
};

type State = {
  bundle: Object,
  isInProjectView: boolean,
};

export default class Content extends React.Component {
  state: State = {
    bundle: { processing: true },
  };

  componentDidMount() {
    this.fetchBundle();
  }

  fetchBundle = () => {
    fetchBundle(
      { SUCCESS: 'SUCCESS' },
      this.props.sandbox.id,
      this.props.sandbox.npmDependencies,
    )(({ type, result }) => {
      if (type === 'SUCCESS') {
        this.setState({ bundle: { ...result, processing: false } });
      }
    });
  };

  setProjectView = (id: string, view: boolean) => {
    this.setState({ isInProjectView: view });
  };

  handleResize = (height: number) => {
    if (this.props.autoResize) {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: Math.min(height, 500), // pixels
        }),
        '*',
      );
    } else {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: 500, // pixels
        }),
        '*',
      );
    }
  };

  props: Props;
  state: State;
  render() {
    const {
      sandbox,
      showEditor,
      showPreview,
      isInProjectView,
      currentModule,
      hideNavigation,
    } = this.props;

    const preferences = { livePreviewEnabled: true };
    // $FlowIssue
    const mainModule: Module =
      sandbox.modules.find((m: Module) => m.shortid === currentModule) ||
      sandbox.modules.find(
        (m: Module) => m.title === 'index.js' && m.directoryShortid == null,
      );

    if (!mainModule) throw new Error('Cannot find main module');

    return (
      <Container>
        {showEditor &&
          <Split show={showEditor} only={showEditor && !showPreview}>
            <CodeEditor
              code={mainModule.code}
              id={mainModule.id}
              title={mainModule.title}
              modulePath={getModulePath(
                sandbox.modules,
                sandbox.directories,
                mainModule.id,
              )}
              preferences={preferences}
              onlyViewMode
            />
          </Split>}

        {showPreview &&
          <Split show={showPreview} only={showPreview && !showEditor}>
            <Preview
              sandboxId={sandbox.id}
              isInProjectView={isInProjectView}
              modules={sandbox.modules}
              directories={sandbox.directories}
              bundle={this.state.bundle}
              externalResources={sandbox.externalResources}
              module={mainModule}
              fetchBundle={this.fetchBundle}
              addError={() => {}}
              clearErrors={() => {}}
              preferences={preferences}
              setProjectView={this.props.setProjectView}
              hideNavigation={hideNavigation}
              noDelay
              setFrameHeight={this.handleResize}
            />
          </Split>}
      </Container>
    );
  }
}
