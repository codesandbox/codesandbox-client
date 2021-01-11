import * as React from 'react';
import { css } from '../stitches.config';
import { SandpackLightTheme } from '../themes';
import { SandpackTheme } from '../types';

const ThemeContext = React.createContext<SandpackTheme>(SandpackLightTheme);

const ThemeConsumer = ThemeContext.Consumer;
const ThemeProvider = ThemeContext.Provider;

const compileStitchesTheme = (theme: SandpackTheme): string =>
  css.theme({
    colors: {
      $highlightText: theme.palette.highlightText,
      $defaultText: theme.palette.defaultText,
      $inactive: theme.palette.inactive,
      $mainBackground: theme.palette.mainBackground,
      $inputBackground: theme.palette.inputBackground,
      $accent: theme.palette.accent,
    },
  });

export { ThemeProvider, ThemeConsumer, ThemeContext, compileStitchesTheme };
