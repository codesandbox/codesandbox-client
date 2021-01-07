import React from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { getFileName } from './utils';

export interface FileTabsProps {
  style?: Object;
}

const Container = styled('div', {
  backgroundColor: '$mainBackground',
  padding: '0 $4',
  border: '1px solid $inactive',
  margin: -1,
  height: 40,
});

const TabButton = styled('button', {
  background: 'transparent',
  appearance: 'none',
  fontSize: 'inherit',
  height: 39,
  padding: '0 $2',
  color: '$defaultText',

  border: 0,
  borderBottom: '1px solid transparent',
  transition: 'border 0.15s ease-out',

  '&[data-active="true"]': {
    color: '$highlightText',
    borderBottom: '1px solid $accent',
  },

  '&:hover': {
    color: '$highlightText',
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
