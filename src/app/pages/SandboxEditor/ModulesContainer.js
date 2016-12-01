/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { values } from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import ModuleList from './ModuleList';

import moduleEntity from '../../store/entities/modules';
import { modulesSelector } from '../../store/entities/modules/selector';
import type { Module } from '../../store/entities/modules/';


type Props = {
  modules: Array<Module>,
  moduleActions: typeof moduleEntity.actions;
  activeModuleId: string;
  url: (module: Module) => string;
};

const mapStateToProps = state => ({
  modules: values(modulesSelector(state)),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
});
// Class because draggable uses refs
class ModuleListContainer extends React.PureComponent { // eslint-disable-line
  props: Props;
  render() {
    const { modules, moduleActions, url, activeModuleId } = this.props;

    return (
      <ModuleList
        module={modules.find(x => x.mainModule)}
        modules={modules}
        activeModuleId={activeModuleId}
        createModule={moduleActions.createModule}
        renameModule={moduleActions.renameModule}
        toggleTreeOpen={moduleActions.toggleTreeOpen}
        url={url}
        depth={0}
      />
    );
  }
}
export default
  connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(ModuleListContainer));
