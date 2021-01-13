import * as React from 'react';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';
import { getFileName } from './utils';

export interface FileTabsProps {
  customStyle?: React.CSSProperties;
}

const Container = styled('div', {
  backgroundColor: '$mainBackground',
  border: '1px solid $inactive',
  margin: -1,
});

const ScrollableContainer = styled('div', {
  padding: '0 $4',
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'stretch',
  height: 40,
  marginBottom: -1,
  marginTop: -1,
});

const TabButton = styled('button', {
  display: 'block',
  background: 'transparent',
  appearance: 'none',
  fontSize: 'inherit',
  padding: '0 $2',
  color: '$defaultText',
  outline: 'none',
  height: 40, // safari fix

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

  '&:focus-visible': {
    outline: 'auto',
  },
});

export const FileTabs: React.FC<FileTabsProps> = props => {
  const { sandpack } = useSandpack();

  const { activePath, openPaths, changeActiveFile } = sandpack;

  return (
    <Container style={props.customStyle}>
      <ScrollableContainer>
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
      </ScrollableContainer>
    </Container>
  );
};
