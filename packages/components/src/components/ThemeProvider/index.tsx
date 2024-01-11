import deepmerge from 'deepmerge';
/**
 * There are 3 layers to our component styles.
 *
 * design language - spacing, fontsizes, radii, etc.
 * vscode theme - color tokens
 * polyfill - color tokens missing from vscode
 */
import React from 'react';
import {
  ThemeProvider as BaseThemeProvider,
  createGlobalStyle,
} from 'styled-components';
import designLanguage from '../../design-language/theme';
import VSCodeThemes from '../../themes';
import polyfillTheme from '../../utils/polyfill-theme';
import codesandboxBlack from '../../themes/codesandbox-black';
import { TooltipStyles } from '../Tooltip';
import { MenuStyles } from '../Menu';
import { SkipNavStyles } from '../SkipNav';

export const getThemes = () => {
  const results = VSCodeThemes.map(theme => ({
    name: theme.name,
    ...theme.content,
  }));

  return results.filter(a => a);
};

const guessType = theme => {
  if (theme.type) return theme.type;

  if (theme.name && theme.name.toLowerCase().includes('light')) return 'light';

  return 'dark';
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

  const type = guessType(vsCodeTheme);

  if (name) {
    return {
      name,
      type,
      ...theme,
    };
  }
  return theme;
};

const GlobalStyles = createGlobalStyle`
:root {
  --reach-menu-button: 1;
  --reach-tooltip: 1;
  --reach-skip-nav: 1;
  scroll-behavior: smooth;

  @media(prefers-reduced-motion) {
    scroll-behavior: auto;
  }
}
`;

export const ThemeProvider = ({
  theme = codesandboxBlack,
  children,
}: {
  theme?: any;
  children: any;
}) => {
  const usableTheme = React.useMemo(() => makeTheme(theme), [theme]);

  // the resizer lives outside the sidebar
  // to apply the right color to the resizer
  // we create a global style to be applied to it
  const ThemedStyles = createGlobalStyle`
    .Resizer {
      background-color: ${usableTheme.colors.sideBar.border} !important;
    }

    .editor-comments-highlight {
      background-color: ${usableTheme.colors.button.background};
      opacity: 0.2
    }
  `;

  return (
    <>
      <GlobalStyles />
      <ThemedStyles />
      <BaseThemeProvider theme={usableTheme}>
        <TooltipStyles />
        <MenuStyles />
        <SkipNavStyles />
        {children}
      </BaseThemeProvider>
    </>
  );
};
