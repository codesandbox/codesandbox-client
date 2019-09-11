import React from 'react';
import { ThemeProvider as ContextProvider } from 'styled-components';

import theme from './';

export const ThemeProvider = props => (
  <ContextProvider theme={theme} {...props} />
);
