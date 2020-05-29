import theme from '@codesandbox/common/es/theme';
// @flow
import React from 'react';
import { ThemeProvider } from 'styled-components';

import App from './components/App';

export default (props: any) => (
  <ThemeProvider theme={theme}>
    <App {...props} />
  </ThemeProvider>
);
