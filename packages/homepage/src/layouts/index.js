import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';

import theme from 'common/theme';

import Navigation from '../components/Navigation';

import './index.css';

const Absolute = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 20;
`;

const Header = () => (
  <Absolute>
    <Navigation />
  </Absolute>
);

const TemplateWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div>
      <Header />
      <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>{children()}</div>
    </div>
  </ThemeProvider>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
