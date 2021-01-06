import React from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { getFileName } from './utils';

export interface FileTabsProps {
  style?: Object;
}

const Container = styled('div', {
  backgroundColor: '$neutral900',
  padding: '0 $4',
  borderBottom: '1px solid $neutral800',
  height: 40,
});

const TabButton = styled('button', {
  background: 'transparent',
  appearance: 'none',
  fontSize: 'inherit',
  height: 40,
  padding: '0 $2',
  color: '$neutral500',

  border: 0,
  borderBottom: '1px solid transparent',
  transition: 'border 0.15s ease-out',

  '&[data-active="true"]': {
    color: '$neutral100',
    // borderBottom: '1px solid $accent500',
  },

  // '&:hover': {
  //   color: '$neutral100',
  // },
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
