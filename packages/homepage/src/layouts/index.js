import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import theme from 'common/theme';
import '../css/typography.css';
import '../css/global.css';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Absolute = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 20;
`;

const TemplateWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div>
      <Absolute>
        <Navigation />
      </Absolute>
      <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>{children()}</div>
      <Footer />
    </div>
  </ThemeProvider>
);

export default TemplateWrapper;
