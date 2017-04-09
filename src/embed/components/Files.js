// @flow
import React from 'react';
import styled from 'styled-components';
import { sortBy } from 'lodash';

import type { Module, Directory } from 'common/types';

import File from './File';

const Container = styled.div`
  line-height: 1;
`;

type Props = {
  modules: Array<Module>,
  directories: Array<Directory>,
  directoryId: string,
  depth: number,
  currentModule: string,
  setCurrentModule: (id: string) => void,
};

const Files = (
  {
    modules,
    directories,
    directoryId,
    depth = 0,
    currentModule,
    setCurrentModule,
  }: Props
) => {
  const childrenModules = modules.filter(
    m => m.directoryShortid === directoryId
  );

  const childrenDirectories = directories.filter(
    d => d.directoryShortid === directoryId
  );

  return (
    <Container>
      {sortBy(childrenDirectories, d => d.title).map(d => (
        <div key={d.id}>
          <File
            id={d.id}
            title={d.title}
            type="directory"
            depth={depth}
            setCurrentModule={setCurrentModule}
          />
          <Files
            modules={modules}
            directories={directories}
            directoryId={d.id}
            depth={depth + 1}
            setCurrentModule={setCurrentModule}
            currentModule={currentModule}
          />
        </div>
      ))}
      {sortBy(childrenModules, m => m.title).map(m => (
        <File
          id={m.id}
          title={m.title}
          key={m.id}
          type="module"
          depth={depth}
          setCurrentModule={setCurrentModule}
          active={m.id === currentModule}
          alternative={m.title === 'index.js' && m.directoryShortid == null}
        />
      ))}
    </Container>
  );
};

export default Files;
