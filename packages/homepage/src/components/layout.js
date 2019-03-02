import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from 'common/theme';
import '../css/typography.css';
import '../css/global.css';

import Navigation from './Navigation';
import Footer from './Footer';

// eslint-disable-next-line
export default class TemplateWrapper extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <div>
          <div style={{ position: 'absolute', left: 0, right: 0, zIndex: 20 }}>
            <Navigation />
          </div>
          <main style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
            {children}
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }
}
