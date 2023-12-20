import React from 'react';
import { Element, Stack, ThemeProvider } from '@codesandbox/components';

export const WorkspaceFlowLayout: React.FC = ({ children }) => {
  return (
    <ThemeProvider>
      <Element
        css={{
          backgroundColor: '#0E0E0E',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Stack
          css={{
            width: '100vw',
            height: '100%',
            padding: '64px 16px',
            scrollBehavior: 'smooth',

            '@media (prefers-reduced-motion)': {
              scrollBehavior: 'auto',
            },
          }}
          align="center"
          justify="center"
        >
          {children}
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
