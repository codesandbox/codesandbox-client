/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { values } from 'lodash';
import { editModuleUrl } from '../../../utils/url-generator';

import ModuleList from './ModuleList';

import moduleEntity from '../../../store/entities/modules';
import { modulesBySandboxSelector } from '../../../store/entities/modules/selector';
import { singleUserSelector } from '../../../store/entities/users/selector';
import type { Module } from '../../../store/entities/modules/';
import type { Sandbox } from '../../../store/entities/sandboxes/';
import type { User } from '../../../store/entities/users/';

type Props = {
  sandbox: Sandbox;
  user: ?User;
  modules: Array<Module>,
  moduleActions: typeof moduleEntity.actions;
};

const mapStateToProps = (state, props: Props) => ({
  modules: values(modulesBySandboxSelector(state, { id: props.sandbox.id })),
  user: singleUserSelector(state, { userId: props.sandbox.author }),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
});

const ModuleListContainer = ({ modules, moduleActions, sandbox, user }: Props) => {
  const mainModule = modules.find(x => x.mainModule);
  return (
    <ModuleList
      module={mainModule}
      modules={modules}
      createModule={moduleActions.createModule}
      renameModule={moduleActions.renameModule}
      addChild={moduleActions.addChild}
      toggleTreeOpen={moduleActions.toggleTreeOpen}
      url={editModuleUrl(sandbox, user)}
      depth={0}
    />
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(ModuleListContainer);
