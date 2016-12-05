/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { singleSandboxBySlugSelector } from '../../store/entities/sandboxes/selector';
import type { Sandbox } from '../../store/entities/sandboxes/';
import sandboxEntity from '../../store/entities/sandboxes';
import moduleEntity from '../../store/entities/modules';
import { modulesBySandboxSlugSelector } from '../../store/entities/modules/selector';
import type { Module } from '../../store/entities/modules/';
import { editModuleUrl } from '../../utils/url-generator';

import Editor from './Editor';
import Sidebar from './Sidebar';

type Props = {
  sandbox: ?Sandbox,
  modules: Array<Module>,
  params: {
    sandbox: string,
    module: string, // eslint-disable-line react/no-unused-prop-types
  },
  sandboxActions: typeof sandboxEntity.actions;
  moduleActions: typeof moduleEntity.actions;
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex: auto;
`;

const mapStateToProps = (state, props: Props) => ({
  sandbox: singleSandboxBySlugSelector(state, { slug: props.params.sandbox }),
  modules: modulesBySandboxSlugSelector(state, { slug: props.params.sandbox }),
});
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
});
class SandboxEditor extends React.PureComponent {
  componentDidMount() {
    const sandboxId = this.props.params.sandbox;
    this.props.sandboxActions.getById(sandboxId);
  }

  getCurrentModuleId = () => {
    const { modules } = this.props;
    const module = modules.find(m => m.mainModule);

    if (module) return module.id;
    if (modules.length) return modules[0].id;

    return '';
  }

  props: Props;
  render() {
    const { params, sandbox, modules, moduleActions } = this.props;
    const moduleId = params.module === 'undefined' ? this.getCurrentModuleId() : params.module;
    return (
      <Container>
        <Sidebar
          sandbox={sandbox}
          url={module => editModuleUrl(sandbox, module)}
          deleteModule={moduleActions.deleteModule}
        />
        <Editor
          module={modules.find(m => m.id === moduleId)}
          loading={!sandbox}
          modules={modules}
          changeCode={moduleActions.changeCode}
          setError={moduleActions.setError}
          saveCode={moduleActions.saveCode}
        />
      </Container>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxEditor);
