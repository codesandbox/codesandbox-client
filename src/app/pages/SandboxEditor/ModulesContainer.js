/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { values } from 'lodash';

import ModuleList from './ModuleList';

import moduleEntity from '../../store/entities/modules';
import { modulesSelector } from '../../store/entities/modules/selector';
import type { Module } from '../../store/entities/modules/';

type Props = {
  modules: Array<Module>,
  moduleActions: typeof moduleEntity.actions;
  url: (module: Module) => string;
};

const mapStateToProps = state => ({
  modules: values(modulesSelector(state)),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
});

const ModuleListContainer = ({ modules, moduleActions, url }: Props) => (
  <ModuleList
    module={modules.find(x => x.mainModule)}
    modules={modules}
    createModule={moduleActions.createModule}
    renameModule={moduleActions.renameModule}
    addChild={moduleActions.addChild}
    toggleTreeOpen={moduleActions.toggleTreeOpen}
    url={url}
    depth={0}
  />
);
export default connect(mapStateToProps, mapDispatchToProps)(ModuleListContainer);
