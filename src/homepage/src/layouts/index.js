import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import styled, { ThemeProvider } from 'styled-components';

import Logo from 'common/components/Logo';

import theme from 'common/theme';

import 'common/global.css';

const RightNavigation = styled.div`
  float: right;
`;

const Header = () => (
  <div>
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1rem 1.0875rem',
      }}
    >
      <Logo width={48} height={48} />
      <RightNavigation>Hai mom</RightNavigation>
    </div>
  </div>
);

const TemplateWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div>
      <Helmet
        title="CodeSandbox"
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

      <div>{children()}</div>
    </div>
  </ThemeProvider>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
