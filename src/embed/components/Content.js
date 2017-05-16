// @flow

import React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import type { Sandbox } from 'common/types';
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
};

type State = {
  bundle: Object,
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

  setProjectView = (id: string, view) => {
    this.setState({ isInProjectView: view });
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
    } = this.props;

    const preferences = { livePreviewEnabled: true };
    const mainModule =
      sandbox.modules.find(m => m.shortid === currentModule) ||
      sandbox.modules.find(
        m => m.title === 'index.js' && m.directoryShortid == null,
      );

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
              noDelay
            />
          </Split>}
      </Container>
    );
  }
}
