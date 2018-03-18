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
    } = this.props;
    const currentModuleShortid = store.editor.currentModuleShortid;
    const mainModuleId = store.editor.mainModule.id;

    const isActive = module.shortid === currentModuleShortid;
    const isMainModule = module.id === mainModuleId;
    const type = getType(module.title, module.code);

    const hasError = store.editor.errors.filter(
      error => error.moduleId === module.id
    ).length;

    return (
      <Entry
        id={module.id}
        shortid={module.shortid}
        title={module.title}
        depth={depth + 1}
        active={isActive}
        type={type || 'function'}
        rename={isMainModule ? undefined : renameModule}
        deleteEntry={isMainModule ? undefined : deleteEntry}
        isNotSynced={!store.editor.isModuleSynced(module.shortid)}
        renameValidator={this.validateTitle}
        setCurrentModule={setCurrentModule}
        isMainModule={isMainModule}
        moduleHasError={hasError}
        markTabsNotDirty={markTabsNotDirty}
      />
    );
  }
}

export default inject('store')(observer(ModuleEntry));
