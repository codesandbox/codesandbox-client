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
import designLanguage from '@codesandbox/common/lib/design-language';
import { ThemeProvider as BaseThemeProvider } from 'styled-components';
import VSCodeThemes from '../../themes';
import polyfillTheme from '../../utils/polyfill-theme';

export const getThemes = () => {
  const results = VSCodeThemes.map(theme => ({
    name: theme.name,
    ...theme.content,
  }));

  return results.filter(a => a);
};
export const makeTheme = (vsCodeTheme = { colors: {} }, name?: string) => {
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

  if (name) {
    return {
      name,
      ...theme,
    };
  }
  return theme;
};

export const ThemeProvider = ({ theme, children }) => {
  const usableTheme = makeTheme(theme);

  return <BaseThemeProvider theme={usableTheme}>{children}</BaseThemeProvider>;
};
