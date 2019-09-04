// @flow

import * as React from 'react';
import { sortBy } from 'lodash-es';

import type {
  Module,
  Directory as DirectoryType,
} from '@codesandbox/common/lib/types';

import { isMainModule } from '@codesandbox/common/lib/sandbox/modules';
// eslint-disable-next-line import/extensions
import getType from 'app/utils/get-type.ts';

import File from '../File';

import { Container } from './elements';

type Props = {
  modules: Module[],
  directories: DirectoryType[],
  directoryId: ?string,
  depth?: number,
  currentModule: string,
  setCurrentModule: (id: string) => void,
  template: string,
  entry: string,
};

function Files({
  modules,
  directories,
  directoryId,
  depth = 0,
  currentModule,
  setCurrentModule,
  template,
  entry,
}: Props) {
  const childrenModules = modules.filter(
    m => m.directoryShortid === directoryId
  );

  const childrenDirectories = directories.filter(
    d => d.directoryShortid === directoryId
  );

  return (
    <Container>
      {sortBy(childrenDirectories, directory => directory.title).map(
        directory => (
          <Directory
            key={directory.shortid}
            directory={directory}
            currentModuleId={currentModule}
            setCurrentModule={setCurrentModule}
            template={template}
            entry={entry}
            modules={modules}
            directories={directories}
            depth={depth}
          />
        )
      )}
      {sortBy(childrenModules, m => m.title).map(m => (
        <File
          id={m.id}
          shortid={m.shortid}
          title={m.title}
          key={m.shortid}
          type={getType(m.title)}
          depth={depth}
          active={m.id === currentModule}
          alternative={isMainModule(m, modules, directories, entry)}
          onClick={() => setCurrentModule(m.id)}
        />
      ))}
    </Container>
  );
}

/** Utils to help identify module tree */

const getCurrentModule = (modules, currentModuleId) =>
  modules.find(module => module.id === currentModuleId);

const getParentDirectory = (directories, child) =>
  directories.find(directory => directory.shortid === child.directoryShortid);

const getCurrentModuleTree = (directories, currentModule) => {
  const currentModuleTree = [currentModule];

  let parentDirectory = getParentDirectory(directories, currentModule);

  while (parentDirectory) {
    currentModuleTree.push(parentDirectory);
    // get parent directory of the parent directory
    parentDirectory = getParentDirectory(directories, parentDirectory);
  }

  return currentModuleTree;
};

function Directory({
  directory,
  currentModuleId,
  setCurrentModule,
  template,
  entry,
  modules,
  directories,
  depth,
}) {
  /** directory should be open by default if currentModule is inside it */
  const [open, setOpen] = React.useState(function() {
    const currentModule = getCurrentModule(modules, currentModuleId);
    const currentModuleTree = getCurrentModuleTree(directories, currentModule);

    let openByDefault = false;
    if (currentModuleTree.find(module => module.id === directory.id)) {
      openByDefault = true;
    }
    return openByDefault;
  });

  return (
    <div>
      <File
        id={directory.id}
        shortid={directory.shortid}
        title={directory.title}
        type={open ? 'directory-open' : 'directory'}
        depth={depth}
        onClick={() => {
          setOpen(!open);
        }}
      />
      {open ? (
        <Files
          modules={modules}
          directories={directories}
          directoryId={directory.shortid}
          depth={depth + 1}
          currentModule={currentModuleId}
          setCurrentModule={setCurrentModule}
          template={template}
          entry={entry}
        />
      ) : null}
    </div>
  );
}

export default Files;
