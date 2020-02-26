/**
 * There are 3 layers to our component styles.
 *
 * design language - spacing, fontsizes, radii, etc.
 * vscode theme - color tokens
 * polyfill - color tokens missing from vscode
 */
import deepmerge from 'deepmerge';
import React, { ComponentProps, FunctionComponent } from 'react';
import {
  createGlobalStyle,
  ThemeProvider as BaseThemeProvider,
} from 'styled-components';

import designLanguage from '../design-language';
import VSCodeThemes from '../themes';
import polyfillTheme from '../utils/polyfill-theme';

export const getThemes = () =>
  VSCodeThemes.map(({ content, name }) => ({
    name,
    ...content,
  }));

export const makeTheme = (VSCodeTheme = {}, name?: string) => {
  // Our interface does not map 1-1 with vscode.
  // To add styles that remain themeable, we add
  // some polyfills to the theme tokens.
  const polyfilledVSCodeColors = polyfillTheme(VSCodeTheme);

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

type Props = Pick<ComponentProps<typeof BaseThemeProvider>, 'theme'>;
export const ThemeProvider: FunctionComponent<Props> = ({
  children,
  theme,
}) => {
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
