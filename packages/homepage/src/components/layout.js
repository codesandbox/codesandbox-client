import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@codesandbox/common/lib/theme';
import { VisuallyHidden } from './style';
import '../css/typography.css';
import '../css/global.css';
import Navigation from './Navigation/index';
import Footer from './Footer';

const homepageTheme = {
  ...theme,
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  homepage: {
    appleFont:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue'",
    white: '#fff',
    primary: '#0971f1',
    grey: '#242424',
    muted: '#999',
  },
};

const TemplateWrapper = ({ children }) => (
  <ThemeProvider theme={homepageTheme}>
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
      <Footer />
    </div>
  </ThemeProvider>
);

export default TemplateWrapper;
