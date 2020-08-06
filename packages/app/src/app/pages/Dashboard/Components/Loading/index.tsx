import React from 'react';
import css from '@styled-system/css';
import { Element, Text } from '@codesandbox/components';

export const Loading = () => (
  <Element
    css={css({
      width: '100%',
      height: '100%',
      backgroundColor: 'sideBar.background',
      color: 'sideBar.foreground',
      position: 'absolute',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })}
  >
    <Text>Loading</Text>
  </Element>
);
