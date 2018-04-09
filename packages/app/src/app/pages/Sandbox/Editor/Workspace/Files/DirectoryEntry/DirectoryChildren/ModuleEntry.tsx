import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import { Module } from 'app/store/modules/editor/types';
import getType from 'app/utils/get-type';
import validateTitle from '../validateTitle';
import Entry from '../Entry';

export type ExternalProps = {
  module: Module;
  setCurrentModule: (moduleId: string) => void;
  markTabsNotDirty: () => void;
  depth: number;
  renameModule: (moduleId: string, title: string) => void;
  deleteEntry: (id: string, title: string) => void;
};

export type Props = ExternalProps & WithCerebral;

const ModuleEntry: React.SFC<Props> = ({
  store,
  module,
  setCurrentModule,
  markTabsNotDirty,
  depth,
  renameModule,
  deleteEntry,
}) => {
  const { currentModuleShortid } = store.editor;
  const mainModuleId = store.editor.mainModule.id;

  const isActive = module.shortid === currentModuleShortid;
  const isMainModule = module.id === mainModuleId;
  const type = getType(module.title);

  const hasError = store.editor.errors.filter(
    error => error.moduleId === module.id
  ).length;

  const liveUsers = store.live.liveUsersByModule.get()[module.shortid] || [];

  return (
    <Entry
      id={module.id}
      shortid={module.shortid}
      title={module.title}
      rightColors={liveUsers.map(([a, b, c]) => `rgb(${a}, ${b}, ${c})`)}
      depth={depth + 1}
      active={isActive}
      type={type || 'function'}
      rename={isMainModule ? undefined : renameModule}
      deleteEntry={isMainModule ? undefined : deleteEntry}
      isNotSynced={
        store.editor.changedModuleShortids.indexOf(module.shortid) >= 0
      }
      renameValidator={validateTitle}
      setCurrentModule={setCurrentModule}
      isMainModule={isMainModule}
      moduleHasError={hasError}
      markTabsNotDirty={markTabsNotDirty}
    />
  );
};

export default connect<ExternalProps>()(ModuleEntry);
