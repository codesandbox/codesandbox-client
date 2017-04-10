// @flow

import React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import Title from 'app/components/text/Title';
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
  width: ${props => props.show ? '100%' : '0px'};
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
};

export default class Content extends React.Component {
  state = {
    bundle: { processing: true },
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
        <Split editor show={showEditor}>
          {showEditor &&
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
            />}
        </Split>

        <Split show={showPreview}>
          <Preview
            sandboxId={sandbox.id}
            isInProjectView={false}
            modules={sandbox.modules}
            directories={sandbox.directories}
            bundle={this.state.bundle}
            externalResources={sandbox.externalResources}
            module={mainModule}
            fetchBundle={this.fetchBundle}
            setError={() => {}}
            preferences={preferences}
          />
        </Split>
      </Container>
    );
  }
}
