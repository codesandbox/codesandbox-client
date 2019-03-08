import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from 'common/lib/theme';
import Navigation from 'common/lib/components/Navigation';
import Footer from 'common/lib/components/Footer';

import '../css/typography.css';
import '../css/global.css';

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
