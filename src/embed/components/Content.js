// @flow

import React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import fetchBundle from './bundle-fetcher';

const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme.background2};
  height: calc(100% - 3rem);
`;

const Split = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

type Props = {
  sandbox: Sandbox,
};

type State = {
  bundle: Object,
  codes: { [moduleId: string]: string },
};

export default class Content extends React.Component {
  state = {
    bundle: { processing: true },
    codes: {},
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

  updateModuleCode = (id, code) => {
    this.setState({ codes: { ...this.state.codes, [id]: code } });
  };

  props: Props;
  render() {
    const { sandbox } = this.props;
    const { codes } = this.state;

    const preferences = { livePreviewEnabled: true };

    let mainModule = sandbox.modules.find(
      m => m.title === 'index.js' && m.directoryShortid == null
    );

    if (codes[mainModule.id]) {
      mainModule = { ...mainModule, code: codes[mainModule.id] };
    }

    return (
      <Container>
        <Split>
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
            changeCode={this.updateModuleCode}
            onlyViewMode
          />
        </Split>
        <Split>
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
