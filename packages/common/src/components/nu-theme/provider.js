import React from 'react';
import { ThemeProvider as ContextProvider } from 'react-ui/primitives';

import theme from './';

export const ThemeProvider = props => (
  <ContextProvider theme={theme} {...props} />
);
