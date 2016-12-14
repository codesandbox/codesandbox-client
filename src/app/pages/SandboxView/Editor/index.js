/* @flow */
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CodeEditor from './CodeEditor';
import Preview from './Preview';
import moduleEntity from '../../../store/entities/modules/';
import { modulesBySandboxSelector, moduleByPathSelector } from '../../../store/entities/modules/selector';
import Workspace from './Workspace';

import type { Module } from '../../../store/entities/modules';
import type { Sandbox } from '../../../store/entities/sandboxes';
import type { Directory } from '../../../store/entities/directories/index';
import { directoriesBySandboxSelector } from '../../../store/entities/directories/selector';

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const CodeEditorContainer = styled.div`
  width: 50%;
`;

const PreviewContainer = styled.div`
  position: relative;
  margin: 8px;
  width: 50%;
  z-index: 20;

  box-shadow: -4px 8px 8px rgba(0, 0, 0, 0.4);
`;

const LoadingText = styled.div`
  position: absolute;
  color: ${props => props.theme.background.lighten(3.5)};
  text-align: center;
  vertical-align: middle;
  font-size: 4rem;
  flex: auto;
  top: 50%; bottom: 0; left: 0; right: 0;
  margin: auto;
`;

type Props = {
  sandbox: Sandbox;
  modules: Array<Module>;
  directories: Array<Directory>;
  module: Module;
  moduleActions: typeof moduleEntity.actions;
  params: {
    module: string;
  };
};

const mapStateToProps = (state, props) => ({
  directories: directoriesBySandboxSelector(state, { id: props.sandbox.id }),
  modules: modulesBySandboxSelector(state, { id: props.sandbox.id }),
  module: moduleByPathSelector(state, {
    id: props.sandbox.id,
    modulePath: (!props.params.module || props.params.module === 'undefined') ? './' : `./${props.params.module}`,
  }),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
});
class Editor extends React.PureComponent {
  props: Props;
  onChange = (code: string = '') => {
    const { moduleActions, module } = this.props;
    if (this.props.module.code !== code) {
      moduleActions.changeCode(module.id, code);
    }
  };

  setError = (error: ?{ message: string; line: number }) => {
    const { module } = this.props;
    this.props.moduleActions.setError(module.id, error);
  }

  render() {
    const { modules, directories, module, moduleActions, sandbox } = this.props;

    if (!module) {
      return <Container><LoadingText>Could not find module</LoadingText></Container>;
    }

    return (
      <Container>
        <Workspace sandbox={sandbox} />
        <CodeEditorContainer>
          <CodeEditor
            onChange={this.onChange}
            id={module.id}
            error={module.error}
            code={module.code}
            saveCode={moduleActions.saveCode}
          />
        </CodeEditorContainer>
        <PreviewContainer>
          <Preview
            module={module}
            modules={modules}
            directories={directories}
            setError={this.setError}
          />
        </PreviewContainer>
      </Container>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Editor);

