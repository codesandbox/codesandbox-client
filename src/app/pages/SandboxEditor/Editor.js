/* @flow */
import React from 'react';
import styled from 'styled-components';
import 'normalize.css';

import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import moduleEntity from '../../store/entities/modules/';

import type { Module } from '../../store/entities/modules';

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  background-color: ${props => props.theme.background2};
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
  modules: Array<Module>;
  module: Module;
  changeCode: typeof moduleEntity.actions.changeCode;
  loading: boolean;
  setError: typeof moduleEntity.actions.setError;
};

export default class Editor extends React.Component {
  props: Props;
  onChange = (code: string = '') => {
    if (this.props.module.code !== code) {
      this.props.changeCode(this.props.module.id, code);
    }
  };

  setError = (error: ?{ message: string; line: number }) => {
    this.props.setError(this.props.module.id, error);
  }

  render() {
    const { loading, module, modules } = this.props;
    if (loading) {
      return <Container><LoadingText>Loading...</LoadingText></Container>;
    }
    if (!module) {
      return <Container><LoadingText>Could not find module</LoadingText></Container>;
    }

    return (
      <Container>
        <CodeEditorContainer>
          <CodeEditor onChange={this.onChange} module={module} />
        </CodeEditorContainer>
        <PreviewContainer>
          <Preview
            module={module}
            modules={modules}
            setError={this.setError}
          />
        </PreviewContainer>
      </Container>
    );
  }
}
