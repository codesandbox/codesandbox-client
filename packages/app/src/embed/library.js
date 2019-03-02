// @flow
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from 'common/libtheme';
import App from './components/App';

export default (props: any) => (
  <ThemeProvider theme={theme}>
    <App {...props} />
  </ThemeProvider>
);
