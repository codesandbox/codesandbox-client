import React from 'react';
import { Element, ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { css } from '@styled-system/css';

export const Wrapper = ({ children }) => (
  <ThemeProvider theme={codesandboxBlack}>
    <Element
      css={css({
        width: 670,
        height: 400,
        backgroundColor: 'white',
        border: 1,
        borderStyle: 'solid',
        borderColor: 'grays.500',
        boxSizing: 'border-box',
        boxShadow: '2',
        borderRadius: 8,
        boxSixing: 'border-box',
        color: 'grays.800',
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        overflow: 'hidden',

        '@media screen and (max-width: 779px)': {
          gridTemplateColumns: '1fr',
        },
      })}
    >
      {children}
    </Element>
  </ThemeProvider>
);
