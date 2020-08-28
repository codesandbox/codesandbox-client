import React from 'react';
import { Text } from '@codesandbox/components';
import css from '@styled-system/css';

export const TabButton = ({ children, onClick, active }) => (
  <Text
    variant="muted"
    align="center"
    css={css({
      paddingTop: ' 4px !important',
      paddingBottom: ' 4px !important',
      cursor: 'pointer',
      backgroundColor: active ? 'input.background' : 'transparent',
      border: 'none',
      color: active ? 'sideBar.foreground' : 'mutedForeground',
      display: 'block',
      borderRadius: 'small',
      width: '100%',
    })}
    as="button"
    onClick={onClick}
  >
    {children}
  </Text>
);
