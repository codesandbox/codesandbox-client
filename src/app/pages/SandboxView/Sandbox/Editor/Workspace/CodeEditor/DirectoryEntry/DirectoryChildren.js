// @flow
import React from 'react';

import Entry from './Entry';
import DirectoryEntry from './';
import type { Module } from '../../../../../../store/entities/modules';
import type { Directory } from '../../../../../../store/entities/directories';
import { validateTitle } from '../../../../../../store/entities/modules/validator';
import { isMainModule } from '../../../../../../store/entities/modules/index';

type Props = {
  depth: number;
  renameModule: (id: string, title: string) => boolean;
  directories: Array<Directory>;
  modules: Array<Module>;
  openMenu: (event: Event) => void;
  sandboxId: string;
  sourceId: string;
  deleteEntry: (id: string) => void;
  openModuleTab: (id: string) => void;
  currentModuleId: ?string;
};

export default class DirectoryChildren extends React.PureComponent {
  props: Props;

  validateTitle = (id: string, title: string) => {
    const { directories, modules } = this.props;
    return validateTitle(id, title, [...directories, ...modules]);
  }

  render() {
    const {
      depth = 0, renameModule, openMenu, sourceId, openModuleTab,
      directories, sandboxId, modules, deleteEntry, currentModuleId,
    } = this.props;

    return (
      <div>
        {directories.map(dir => (
          <DirectoryEntry
            key={dir.id}
            siblings={[...directories, ...modules]}
            depth={depth + 1}
            id={dir.id}
            title={dir.title}
            open={dir.open}
            sourceId={sourceId}
            sandboxId={sandboxId}
            currentModuleId={currentModuleId}
          />
        ))}
        {modules.map((m) => {
          const isActive = m.id === currentModuleId;
          const mainModule = isMainModule(m);
          return (
            <Entry
              key={m.id}
              id={m.id}
              title={m.title}
              depth={depth + 1}
              active={isActive}
              type={m.type}
              rename={renameModule}
              openMenu={openMenu}
              deleteEntry={deleteEntry}
              isNotSynced={m.isNotSynced}
              renameValidator={this.validateTitle}
              openModuleTab={openModuleTab}
              isMainModule={mainModule}
            />
          );
        })}
      </div>
    );
  }
}
