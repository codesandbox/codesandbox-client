/**
 * There are 3 layers to our component styles.
 *
 * design language - spacing, fontsizes, radii, etc.
 * vscode theme - color tokens
 * polyfill - color tokens missing from vscode
 */
import React from 'react';
import deepmerge from 'deepmerge';
import {
  ThemeProvider as BaseThemeProvider,
  createGlobalStyle,
} from 'styled-components';
import designLanguage from '../../design-language';
import VSCodeThemes from '../../themes';
import polyfillTheme from '../../utils/polyfill-theme';

export const getThemes = () => {
  const results = VSCodeThemes.map(theme => ({
    name: theme.name,
    ...theme.content,
  }));

  return results.filter(a => a);
};
export const makeTheme = (vsCodeTheme = {}, name?: string) => {
  // Our interface does not map 1-1 with vscode.
  // To add styles that remain themeable, we add
  // some polyfills to the theme tokens.
  const polyfilledVSCodeColors = polyfillTheme(vsCodeTheme);

  // merge the design language and vscode theme
  const theme = deepmerge(designLanguage, {
    colors: polyfilledVSCodeColors,
  });

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

  // the resizer lives outside the sidebar
  // to apply the right color to the resizer
  // we create a global style to be applied to it
  const ExternalStyles = createGlobalStyle`
    .Resizer {
      background-color: ${usableTheme.colors.sideBar.border} !important;
    }
  `;

  return (
    <>
      <ExternalStyles />
      <BaseThemeProvider theme={usableTheme}>{children}</BaseThemeProvider>
    </>
  );
};
