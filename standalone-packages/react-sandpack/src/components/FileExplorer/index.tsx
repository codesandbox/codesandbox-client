import * as React from 'react';

import { ModuleList } from './ModuleList';

import { styled } from '../../stitches.config';
import { SandpackContext } from '../../utils/sandpack-context';

export interface Props {
  style?: Object;
}

const Container = styled('div', {
  backgroundColor: '#24282a',
  color: 'white',
  paddingTop: '0.5em',
});

export const FileExplorer: React.FC<Props> = props => {
  const sandpack = React.useContext(SandpackContext);
  if (!sandpack) {
    return null;
  }

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
