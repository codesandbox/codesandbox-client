import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@codesandbox/common/lib/theme';
import { VisuallyHidden } from './style';
import '../css/typography.css';
import '../css/global.css';
import Navigation from './Navigation/index';

const TemplateWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div>
      <div style={{ position: 'absolute', left: 0, right: 0, zIndex: 10 }}>
        <VisuallyHidden as="a" href="#main">
          Skip to main content
        </VisuallyHidden>
      </div>
      <Navigation />

      <main
        style={{
          maxWidth: '80%',
          width: '1200px',
          margin: 'auto',
        }}
        id="main"
        aria-label="main content"
      >
        {children}
      </main>
    </div>
  </ThemeProvider>
);

export default TemplateWrapper;
