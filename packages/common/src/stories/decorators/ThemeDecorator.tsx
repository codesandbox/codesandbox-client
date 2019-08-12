import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../../theme';

export const ThemeDecorator = (fn: () => JSX.Element) => (
  <ThemeProvider theme={theme}>{fn()}</ThemeProvider>
);
