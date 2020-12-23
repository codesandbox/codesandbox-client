import React from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { getFileName } from './utils';

export interface FileTabsProps {
  style?: Object;
}

const Container = styled('div', {
  backgroundColor: 'rgb(248, 249, 251)',
  borderBottom: '1px solid #eee',
  marginBottom: -1,
});

const TabButton = styled('button', {
  background: '#efefef',
  appearance: 'none',
  padding: 4,
  marginRight: 4,
  border: 0,
  borderRadius: '4px 4px 0 0',

  '&:hover': {
    background: '#dedede',
  },

  '&[data-active="true"]': {
    background: 'rgb(248, 249, 251)',
  },
});

export const FileTabs: React.FC<FileTabsProps> = props => {
  const { sandpack } = useSandpack();

  const { activePath, openPaths, changeActiveFile } = sandpack;

  return (
    <Container style={props.style}>
      {openPaths.map(filePath => (
        <TabButton
          type="button"
          key={filePath}
          data-active={filePath === activePath}
          onClick={() => changeActiveFile(filePath)}
        >
          {getFileName(filePath)}
        </TabButton>
      ))}
    </Container>
  );
};
