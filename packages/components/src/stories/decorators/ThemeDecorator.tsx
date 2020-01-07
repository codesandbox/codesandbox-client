import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@codesandbox/common/lib/theme';

export const ThemeDecorator = (fn: () => JSX.Element) => (
  <ThemeProvider theme={theme}>{fn()}</ThemeProvider>
);
