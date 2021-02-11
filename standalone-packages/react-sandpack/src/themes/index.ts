import {
  SandpackTheme,
  SandpackPredefinedTheme,
  SandpackPartialTheme,
} from '../types';

export const sandpackLightTheme: SandpackTheme = {
  palette: {
    highlightText: '#1f2933',
    defaultText: '#999999',
    inactive: '#e4e7eb',
    mainBackground: '#f8f9fb',
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
    highlightText: '#FFFFFF',
    defaultText: '#999999',
    inactive: '#343434',
    mainBackground: '#040404',
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
    highlightText: 'rgb(197, 228, 253)',
    defaultText: 'rgb(95, 126, 151)',
    inactive: 'rgb(58, 62, 77)',
    mainBackground: 'rgb(1, 22, 39)',
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
