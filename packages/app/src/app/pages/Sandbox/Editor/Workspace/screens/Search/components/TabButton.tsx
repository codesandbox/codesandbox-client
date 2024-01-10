import React from 'react';
import { Text } from '@codesandbox/components';
import css from '@styled-system/css';

export const TabButton = ({ children, onClick, active }) => (
  <Text
    variant="muted"
    align="center"
    paddingY={1}
    block
    css={css({
      cursor: 'pointer',
      backgroundColor: active ? 'input.background' : 'transparent',
      border: 'none',
      color: active ? 'sideBar.foreground' : 'mutedForeground',
      borderRadius: 'small',
      width: '100%',

      ':hover': {
        color: 'sideBar.foreground',
        backgroundColor: 'input.background',
      },
    })}
    as="button"
    onClick={onClick}
  >
    {children}
  </Text>
);
