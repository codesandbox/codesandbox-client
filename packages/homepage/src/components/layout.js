import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@codesandbox/common/lib/theme';
import Navigation from '@codesandbox/common/lib/components/Navigation';
import Footer from '@codesandbox/common/lib/components/Footer';
import { VisuallyHidden } from './style';
import '../css/typography.css';
import '../css/global.css';

const TemplateWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div>
      <div style={{ position: 'absolute', left: 0, right: 0, zIndex: 10 }}>
        <VisuallyHidden as="a" href="#main">
          Skip to main content
        </VisuallyHidden>
        <Navigation />
      </div>

      <main
        style={{ maxWidth: '100vw', overflowX: 'hidden' }}
        id="main"
        aria-label="main content"
      >
        {children}
      </main>

      <Footer />
    </div>
  </ThemeProvider>
);

export default TemplateWrapper;
