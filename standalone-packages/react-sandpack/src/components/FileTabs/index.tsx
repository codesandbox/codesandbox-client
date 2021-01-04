import React from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { getFileName } from './utils';

export interface FileTabsProps {
  style?: Object;
}

const Container = styled('div', {
  backgroundColor: '$neutral900',
  borderBottom: '1px solid $neutral800',
});

const TabButton = styled('button', {
  background: 'transparent',
  appearance: 'none',
  fontSize: 'inherit',
  padding: '$1',
  marginLeft: '$1',
  border: 0,
  borderBottom: '1px solid transparent',

  '&[data-active="false"]:hover': {
    borderBottom: '1px solid $neutral700',
  },

  '&[data-active="true"]': {
    borderBottom: '1px solid $accent500',
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
