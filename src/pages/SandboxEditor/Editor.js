/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { values } from 'lodash';
import styled from 'styled-components';
import 'normalize.css';

import CodeEditor from '../../components/CodeEditor';
import Preview from '../../components/Preview';
import { actions as actionCreators } from '../../store/entities/modules/reducer';
import { modulesSelector, singleModuleSelector } from '../../store/entities/modules/selector';

import type { Module } from '../../store/entities/modules';

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const Column = styled.div`
  width: 50%;
`;

type Props = {
  modules: Array<Module>;
  module: Module;
  moduleId: number;
  changeCode: typeof actionCreators.changeCode;
  setError: typeof actionCreators.setError;
};

const mapStateToProps = (state, props: Props) => ({
  modules: values(modulesSelector(state)),
  module: singleModuleSelector(state, { id: props.moduleId }),
});
const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);
class Editor extends React.Component {
  props: Props;
  onChange = (code: string = '') => {
    if (this.props.module.code !== code) {
      try {
        this.props.changeCode(this.props.moduleId, code);
      } catch (e) {
        this.handleError(e);
      }
    }
  }

  handleError = (error: Error) => {
    this.props.setError(this.props.moduleId, error);
  }

  render() {
    const { module, modules } = this.props;
    return (
      <Container>
        <Column>
          <CodeEditor onChange={this.onChange} code={module.code} />
        </Column>
        <Column>
          <Preview
            setError={this.handleError}
            code={module.code}
            error={module.error}
            modules={modules}
          />
        </Column>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
