import React from 'react';
import theme from '../theme';
import { ThemeProvider } from 'styled-components';

export const ThemeDecorator = (fn: () => JSX.Element) => (
  <ThemeProvider theme={theme}>{fn()}</ThemeProvider>
);
