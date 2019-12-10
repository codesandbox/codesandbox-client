import { getModulePath as getModulePathBase } from '@codesandbox/common/lib/sandbox/modules';
import { Module } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import getType from 'app/utils/get-type';

import Entry from '../Entry';

type Props = {
  deleteEntry: (shortid: string, title: string) => void;
  depth: number;
  discardModuleChanges: (shortid: string) => void;
  module: Module;
  renameValidator: (id: string, title: string) => string;
};
export const ModuleEntry: FunctionComponent<Props> = ({
  deleteEntry,
  depth,
  discardModuleChanges,
  module,
  renameValidator,
}) => {
  const {
    actions: {
      editor: { moduleDoubleClicked, moduleSelected },
      files: { moduleRenamed },
    },
    state: {
      editor: {
        currentModuleShortid,
        currentSandbox: { directories, modules },
        mainModule,
      },
      live: { liveUsersByModule },
    },
  } = useOvermind();

  const getModulePath = (moduleId: string) =>
    getModulePathBase(modules, directories, moduleId);
  const markTabsNotDirty = () => moduleDoubleClicked();
  const renameModule = (moduleShortid: string, title: string) =>
    moduleRenamed({ moduleShortid, title });
  const setCurrentModule = () => moduleSelected({ id: module.shortid });

  const isActive = module.shortid === currentModuleShortid;
  const isMainModule = module.id === mainModule.id;
  const type = getType(module.title);
  const hasError = module.errors.length > 0;

  const liveUsers = liveUsersByModule[module.shortid] || [];

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
