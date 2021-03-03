import { Directory, Module } from '@codesandbox/common/lib/types';
import { useAppState } from 'app/overmind';
import { getType } from 'app/utils/get-type';
import React from 'react';

import { Entry } from '../Entry';

interface IModuleEntryProps {
  module: Module;
  setCurrentModule?: (id: string) => void;
  store?: any;
  signals?: any;
  markTabsNotDirty?: () => void;
  depth?: number;
  renameModule?: (title: string, moduleShortid: string) => void;
  deleteEntry?: (shortid: string, title: string) => void;
  discardModuleChanges?: (shortid: string, title: string) => void;
  getModulePath?: (
    modules: Module[],
    directories: Directory[],
    id: string
  ) => string;
  renameValidator?: (id: string, title: string) => string | false | null;
}

export const ModuleEntry: React.FC<IModuleEntryProps> = ({
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
  const {
    editor: { mainModule, currentModuleShortid },
    live,
  } = useAppState();
  const isActive = module.shortid === currentModuleShortid;
  const isMainModule = module.id === mainModule.id;
  const type = getType(module.title);
  const hasError = module.errors.length > 0;
  const liveUsers = live.liveUsersByModule[module.shortid] || [];

  const isNotSynced = module.savedCode && module.code !== module.savedCode;

  return (
    // @ts-ignore
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
