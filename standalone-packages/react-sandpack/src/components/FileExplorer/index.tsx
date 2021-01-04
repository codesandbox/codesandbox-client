import React from 'react';

import { ModuleList } from './ModuleList';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';

export interface FileExplorerProps {
  style?: Object;
}

const Container = styled('div', {
  backgroundColor: '$neutral900',
  paddingTop: '$1',
  paddingBottom: '$1',
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
