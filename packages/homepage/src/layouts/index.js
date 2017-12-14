import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from 'common/theme';
import '../css/typography.css';
import '../css/global.css';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const TemplateWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div>
      <div style={{ position: 'absolute', left: 0, right: 0, zIndex: 20 }}>
        <Navigation />
      </div>
      <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>{children()}</div>
      <Footer />
    </div>
  </ThemeProvider>
);

export default TemplateWrapper;
