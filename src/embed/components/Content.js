// @flow

import React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import type { Sandbox } from 'common/types';
import fetchBundle from './bundle-fetcher';

const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme.background2};
  height: calc(100% - 3rem);
`;

const Split = styled.div`
  position: relative;
  width: ${props => props.show ? '50%' : '0px'};
  max-width: ${props => props.only ? '100%' : '50%'};
  min-width: ${props => props.only ? '100%' : '50%'};
  height: ${props => props.editor ? 'calc(100% + 3rem)' : '100%'};
`;

type Props = {
  sandbox: Sandbox,
  currentModule: string,
  showEditor: boolean,
  showPreview: boolean,
};

type State = {
  bundle: Object,
  isInProjectView: boolean,
};

export default class Content extends React.Component {
  state = {
    bundle: { processing: true },
    isInProjectView: false,
  };

  componentDidMount() {
    this.fetchBundle();
  }

  fetchBundle = () => {
    fetchBundle({ SUCCESS: 'SUCCESS' }, this.props.sandbox.id)(({
      type,
      result,
    }) => {
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
    const { sandbox, showEditor, showPreview, currentModule } = this.props;

    const preferences = { livePreviewEnabled: true };
    const mainModule = sandbox.modules.find(m => m.id === currentModule) ||
      sandbox.modules.find(
        m => m.title === 'index.js' && m.directoryShortid == null
      );

    return (
      <Container>
        {showEditor &&
          <Split editor show={showEditor} only={showEditor && !showPreview}>
            <CodeEditor
              code={mainModule.code}
              error={null}
              id={mainModule.id}
              title={mainModule.title}
              modulePath={getModulePath(
                sandbox.modules,
                sandbox.directories,
                mainModule.id
              )}
              preferences={preferences}
              onlyViewMode
            />
          </Split>}

        {showPreview &&
          <Split show={showPreview} only={showPreview && !showEditor}>
            <Preview
              sandboxId={sandbox.id}
              isInProjectView={this.state.isInProjectView}
              modules={sandbox.modules}
              directories={sandbox.directories}
              bundle={this.state.bundle}
              externalResources={sandbox.externalResources}
              module={mainModule}
              fetchBundle={this.fetchBundle}
              setError={() => {}}
              preferences={preferences}
              setProjectView={this.setProjectView}
            />
          </Split>}
      </Container>
    );
  }
}
