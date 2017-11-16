import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
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
      <Helmet
        title="CodeSandbox: Online Editor Tailored for Web Application Development"
        meta={[
          {
            name: 'description',
            content:
              'CodeSandbox is an online editor with a focus on creating and sharing web application projects',
          },
          {
            name: 'keywords',
            content:
              'react, codesandbox, editor, code, javascript, playground, sharing, spa, single, page, application, web, application, frontend, front, end',
          },
        ]}
      />

      <Header />
      <div style={{ maxWidth: '100vw', overflowX: 'hidden' }}>{children()}</div>
    </div>
  </ThemeProvider>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
