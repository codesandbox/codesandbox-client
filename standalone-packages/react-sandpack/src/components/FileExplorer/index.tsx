import React from 'react';

import { ModuleList } from './ModuleList';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';

export interface FileExplorerProps {
  style?: Object;
}

const Container = styled('div', {
  backgroundColor: '#24282a',
  color: 'white',
  paddingTop: '0.5em',
});

export const FileExplorer: React.FC<FileExplorerProps> = props => {
  const { sandpack } = useSandpack();

  return (
    <Container style={props.style}>
      <ModuleList
        selectFile={sandpack.openFile}
        files={sandpack.files}
        prefixedPath="/"
        openedPath={sandpack.openedPath}
      />
    </Container>
  );
};
