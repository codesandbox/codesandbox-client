/**
 * There are 3 layers to our component styles.
 *
 * design language - spacing, fontsizes, radii, etc.
 * vscode theme - color tokens
 * polyfill - color tokens missing from vscode
 */
import React from 'react';
import dot from 'dot-object';
import deepmerge from 'deepmerge';
import css from '@styled-system/css';
import styled, { ThemeProvider as StyledProvider } from 'styled-components';
import designLanguage from '@codesandbox/common/lib/design-language';
import polyfillTheme from '../../utils/polyfill-theme';

const ThemeBoundary = styled.div(
  css({
    fontFamily: 'Inter, sans-serif',
    'input, textarea, button': {
      fontFamily: 'Inter, sans-serif',
    },
  })
);

export const ThemeProvider = ({ vsCodeTheme = { colors: {} }, children }) => {
  // black is the default, it would be helpful to use storybook-addon-themes
  // to test our components across multiple themes
  // convert vscode colors to dot notation so that we can use them in tokens
  const vsCodeColors = dot.object({ ...vsCodeTheme.colors });

  // Our interface does not map 1-1 with vscode.
  // To add styles that remain themeable, we add
  // some polyfills to the theme tokens.
  const polyfilledVSCodeColors = polyfillTheme(vsCodeColors);

  // merge the design language and vscode theme
  const theme = deepmerge(designLanguage, { colors: polyfilledVSCodeColors });

  return (
    <StyledProvider theme={theme}>
      <ThemeBoundary>{children}</ThemeBoundary>
    </StyledProvider>
  );
};
