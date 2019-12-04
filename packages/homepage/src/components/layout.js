import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@codesandbox/common/lib/theme';
import { VisuallyHidden } from './style';
import '../css/typography.css';
import '../css/global.css';
import Navigation from './Navigation/index';
import Footer from './Footer';

const text = number => `@media only screen and (max-width: ${number}px)`;

const homepageTheme = {
  ...theme,
  breakpoints: {
    sm: text(576),
    md: text(768),
    lg: text(1024),
    xl: text(1200),
  },
  homepage: {
    appleFont:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue'",
    white: '#fff',
    whiteDark: '#e6e6e6',
    primary: '#0971f1',
    greyLight: '#757575',
    grey: '#242424',
    greyDark: '#040404',
    muted: '#999',
    blue: '#0971F1',
    black: '#000',
  },
};

export const WRAPPER_STYLING = {
  maxWidth: '80%',
  width: '1200px',
  margin: 'auto',
};

export const useTheme = () => homepageTheme;

const TemplateWrapper = ({ children, noWrapperStyling }) => (
  <ThemeProvider theme={homepageTheme}>
    <div>
      <div style={{ position: 'absolute', left: 0, right: 0, zIndex: 10 }}>
        <VisuallyHidden as="a" href="#main">
          Skip to main content
        </VisuallyHidden>
      </div>
      <Navigation />

      <main
        style={noWrapperStyling ? {} : WRAPPER_STYLING}
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
