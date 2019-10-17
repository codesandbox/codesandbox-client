import { inject, observer } from 'app/componentConnectors';
// eslint-disable-next-line import/extensions
import getType from 'app/utils/get-type.ts';
import React from 'react';

import Entry from '../Entry';

const ModuleEntry = ({
  store,
  module,
  setCurrentModule,
  markTabsNotDirty,
  depth,
  renameModule,
  deleteEntry,
  discardModuleChanges,
  getModulePath,
  renameValidator,
}) => {
  const { currentModuleShortid } = store.editor;
  const mainModuleId = store.editor.mainModule.id;

  const isActive = module.shortid === currentModuleShortid;
  const isMainModule = module.id === mainModuleId;
  const type = getType(module.title);
  const hasError = module.errors.length;

  const liveUsers = store.live.liveUsersByModule[module.shortid] || [];

  const isNotSynced = module.savedCode && module.code !== module.savedCode;

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
      renameValidator={renameValidator}
      setCurrentModule={setCurrentModule}
      isMainModule={isMainModule}
      moduleHasError={hasError}
      markTabsNotDirty={markTabsNotDirty}
      discardModuleChanges={discardModuleChanges}
      getModulePath={getModulePath}
    />
  );
};

export default inject('store')(observer(ModuleEntry));
