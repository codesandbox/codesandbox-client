import {
  SandpackTheme,
  SandpackPredefinedTheme,
  SandpackPartialTheme,
} from '../types';
import { hexToCSSRGBa } from '../utils/string-utils';

export const sandpackLightTheme: SandpackTheme = {
  palette: {
    activeText: '#1f2933',
    defaultText: '#999999',
    inactiveText: '#e4e7eb',
    activeBackground: '#e4e7eb',
    defaultBackground: '#f8f9fb',
    inputBackground: '#ffffff',
    accent: '#6caedd',
    errorBackground: '#ffcdca',
    errorForeground: '#811e18',
  },

  syntax: {
    plain: '#1F2933',
    disabled: '#A7B6C2',
    keyword: '#1A56DB',
    tag: '#1A56DB',
    punctuation: '#394b59',
    definition: '#A23DAD',
    property: '#14919B',
    static: '#1992D4',
  },
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: '14px',
  },
};

export const sandpackDarkTheme: SandpackTheme = {
  palette: {
    activeText: '#FFFFFF',
    defaultText: '#999999',
    inactiveText: '#343434',
    activeBackground: '#343434',
    defaultBackground: '#040404',
    inputBackground: '#242424',
    accent: '#6caedd',
    errorBackground: '#ffcdca',
    errorForeground: '#811e18',
  },
  syntax: {
    plain: '#FFFFFF',
    disabled: '#757575',
    keyword: '#64D2FF',
    tag: '#86D9CA',
    punctuation: '#ffffff',
    definition: '#DFAB5C',
    property: '86D9CA',
    static: '#A8A5F3',
  },
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: '14px',
  },
};

export const nightOwlTheme: SandpackTheme = {
  palette: {
    activeText: 'rgb(197, 228, 253)',
    defaultText: 'rgb(95, 126, 151)',
    inactiveText: 'rgb(58, 62, 77)',
    activeBackground: 'rgb(58, 62, 77)',
    defaultBackground: 'rgb(1, 22, 39)',
    inputBackground: 'rgb(11, 41, 66)',
    accent: '#7fdbca',
    errorBackground: '#ffcdca',
    errorForeground: '#811e18',
  },
  syntax: {
    plain: '#d6deeb',
    disabled: '#999999',
    keyword: '#c792ea',
    tag: '#7fdbca',
    punctuation: '#d6deeb',
    definition: '#A23DAD',
    property: '#addb67',
    static: '#ecc48d',
  },
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: '14px',
  },
};

export const SANDPACK_THEMES: Record<SandpackPredefinedTheme, SandpackTheme> = {
  'sp-light': sandpackLightTheme,
  'sp-dark': sandpackDarkTheme,
  'night-owl': nightOwlTheme,
};

export const createThemeObject = (
  inputTheme?: SandpackPredefinedTheme | SandpackPartialTheme
) => {
  const defaultTheme = sandpackLightTheme;
  const defaultThemeKey = 'sp-light';

  if (inputTheme === undefined) {
    return {
      theme: defaultTheme,
      id: defaultThemeKey,
    };
  }

  if (typeof inputTheme === 'string') {
    return {
      theme: SANDPACK_THEMES[inputTheme] ?? defaultTheme,
      id: inputTheme ?? defaultThemeKey,
    };
  }

  const theme = {
    palette: { ...defaultTheme.palette, ...inputTheme?.palette },
    syntax: { ...defaultTheme.syntax, ...inputTheme?.syntax },
    typography: {
      ...defaultTheme.typography,
      ...inputTheme?.typography,
    },
  };

  const id = simpleHashFunction(JSON.stringify(theme));

  return {
    theme,
    id: `sp-${id}`,
  };
};

const simpleHashFunction = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; hash &= hash) {
    hash = 31 * hash + str.charCodeAt(i++);
  }
  return Math.abs(hash);
};

// inactive fg and active bg are interchangable to limit the number of colors in the theme
// bg-default-overlay is determined by adjusting the alpha channel on the default bg to 80%
export const getThemeStyleSheet = (theme: SandpackTheme, themeId: string) => `
.sp-wrapper.${themeId} {
  --sp-colors-fg-active: ${theme.palette.activeText};
  --sp-colors-fg-default: ${theme.palette.defaultText};
  --sp-colors-fg-inactive: ${
    theme.palette.inactiveText || theme.palette.activeBackground
  };
  --sp-colors-bg-active: ${
    theme.palette.activeBackground || theme.palette.inactiveText
  };
  --sp-colors-bg-default: ${theme.palette.defaultBackground};
  --sp-colors-bg-default-overlay: ${hexToCSSRGBa(
    theme.palette.defaultBackground,
    0.8
  )};
  --sp-colors-bg-input: ${theme.palette.inputBackground};
  --sp-colors-accent: ${theme.palette.accent};
  --sp-colors-bg-error: ${theme.palette.errorBackground};
  --sp-colors-fg-error: ${theme.palette.errorForeground};
  --sp-font-size: ${theme.typography.fontSize};
  --sp-font-body: ${theme.typography.bodyFont};
  --sp-font-mono: ${theme.typography.monoFont};
`;
