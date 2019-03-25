// @flow
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@codesandbox/common/lib/theme';
import App from './components/App';

export default (props: any) => (
  <ThemeProvider theme={theme}>
    <App {...props} />
  </ThemeProvider>
);
