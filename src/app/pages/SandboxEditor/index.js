/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { singleSandboxSelector } from '../../store/entities/sandboxes/selector';
import type { Sandbox } from '../../store/entities/sandboxes/';
import sandboxEntity from '../../store/entities/sandboxes';
import moduleEntity from '../../store/entities/modules';
import { modulesBySandboxSelector } from '../../store/entities/modules/selector';
import type { Module } from '../../store/entities/modules/';

import resolveModule from '../../../sandbox/utils/resolve-module';

import Editor from './Editor';
import Sidebar from './Sidebar';

type Props = {
  id: ?string,
  sandbox: ?Sandbox,
  modules: Array<Module>,
  params: {
    id: string,
    username: ?string;
    slug: ?string;
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

const mapStateToProps = (state, props: Props) => {
  const paramsWithId = { id: props.id, ...props.params };
  return {
    sandbox: singleSandboxSelector(state, paramsWithId),
    modules: modulesBySandboxSelector(state, paramsWithId),
  };
};
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
});
class SandboxEditor extends React.PureComponent {
  componentDidMount() {
    const id = this.props.id;
    const { username, slug } = this.props.params;
    if (id) {
      this.props.sandboxActions.getById(id);
    } else {
      this.props.sandboxActions.getByUserAndSlug(username, slug);
    }
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

    const modulePath = (!params.module || params.module === 'undefined') ? './' : params.module;
    const mainModule = modules.find(m => !m.parentModuleId);
    let curModule;
    try {
      curModule = resolveModule(mainModule, modulePath, modules);
    } catch (e) {
      curModule = mainModule;
    }

    return (
      <Container>
        <Sidebar
          sandbox={sandbox}
          deleteModule={moduleActions.deleteModule}
        />
        <Editor
          module={curModule}
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
