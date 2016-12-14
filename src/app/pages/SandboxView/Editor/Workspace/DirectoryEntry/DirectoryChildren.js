// @flow
import React from 'react';
import { Link } from 'react-router';

import Entry from './Entry';
import DirectoryEntry from './';
import type { Module } from '../../../../../store/entities/modules';
import type { Directory } from '../../../../../store/entities/directories';
import { validateTitle } from '../../../../../store/entities/modules/validator';

type Props = {
  depth: number;
  renameModule: (id: string, title: string) => boolean;
  directories: Array<Directory>;
  modules: Array<Module>;
  url: string;
  openMenu: (event: Event) => void;
  sandboxId: string;
  deleteEntry: (id: string) => void;
};

export default ({
  depth = 0, url, renameModule, openMenu,
  directories, sandboxId, modules, deleteEntry,
}: Props) => (
  <div>
    {directories.map(dir => (
      <DirectoryEntry
        key={dir.id}
        siblings={[...directories, ...modules]}
        depth={depth + 1}
        id={dir.id}
        title={dir.title}
        open={dir.open}
        url={`${url}/${dir.title}`}
        sandboxId={sandboxId}
      />
    ))}
    {modules.map((m) => {
      const moduleUrl = `${url}/${m.title}`;
      return (
        <Link key={m.id} to={moduleUrl}>{
          ({ isActive }) => (
            <Link style={{ textDecoration: 'none' }} to={moduleUrl}>
              <Entry
                id={m.id}
                title={m.title}
                depth={depth + 1}
                active={isActive}
                type={m.type}
                rename={renameModule}
                openMenu={openMenu}
                deleteEntry={deleteEntry}
                isNotSynced={m.isNotSynced}
                renameValidator={title => validateTitle(m.id, title, [...directories, ...modules])}
              />
            </Link>
          )
        }</Link>
      );
    })}
  </div>
);
