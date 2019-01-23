import React from 'react';
import { inject, observer } from 'mobx-react';
import getType from 'app/utils/get-type';
import validateTitle from '../validateTitle';
import Entry from '../Entry';

class ModuleEntry extends React.Component {
  validateTitle = (id, title) => {
    const { directories, modules } = this.props.store.editor.currentSandbox;
    return !!validateTitle(id, title, [...directories, ...modules]);
  };

  render() {
    const {
      store,
      module,
      setCurrentModule,
      markTabsNotDirty,
      depth,
      renameModule,
      deleteEntry,
      discardModuleChanges,
      getModulePath,
    } = this.props;
    const currentModuleShortid = store.editor.currentModuleShortid;
    const mainModuleId = store.editor.mainModule.id;

    const isActive = module.shortid === currentModuleShortid;
    const isMainModule = module.id === mainModuleId;
    const type = getType(module.title);

    const hasError = store.editor.errors.filter(
      error => error.moduleId === module.id
    ).length;

    const liveUsers = store.live.liveUsersByModule[module.shortid] || [];

    const isNotSynced = !store.editor.isModuleSynced(module.shortid);

    return (
      <Entry
        id={module.id}
        shortid={module.shortid}
        title={module.title}
        rightColors={liveUsers.map(([a, b, c]) => `rgb(${a}, ${b}, ${c})`)}
        depth={depth + 1}
        active={isActive}
        type={type || 'function'}
        rename={renameModule}
        deleteEntry={deleteEntry}
        isNotSynced={isNotSynced}
        renameValidator={this.validateTitle}
        setCurrentModule={setCurrentModule}
        isMainModule={isMainModule}
        moduleHasError={hasError}
        markTabsNotDirty={markTabsNotDirty}
        discardModuleChanges={discardModuleChanges}
        getModulePath={getModulePath}
      />
    );
  }
}

export default inject('store')(observer(ModuleEntry));
