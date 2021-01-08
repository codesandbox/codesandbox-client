import * as React from 'react';

import { ModuleList } from './ModuleList';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';

export interface FileExplorerProps {
  style?: React.CSSProperties;
}

const Container = styled('div', {
  backgroundColor: '$mainBackground',
  paddingTop: '$1',
  paddingBottom: '$1',
  border: '1px solid $inactive',
  margin: -1,
});

export const FileExplorer: React.FC<FileExplorerProps> = props => {
  const { sandpack } = useSandpack();

  return (
    <Container style={props.style}>
      <ModuleList
        selectFile={sandpack.openFile}
        files={sandpack.files}
        prefixedPath="/"
        activePath={sandpack.activePath}
      />
    </Container>
  );
};
