import { SandpackTheme } from '../types';

export const SandpackLightTheme: SandpackTheme = {
  palette: {
    highlightText: '#5B6776',
    defaultText: '#999999',
    inactive: '#E5E7EB',
    mainBackground: '#f8f9fb',
    inputBackground: '#ffffff',
    accent: '#6caedd',
  },
  syntax: {
    plain: '#1F2933',
    disabled: '#A7B6C2',
    keyword: '#1A56DB',
    definition: '#A23DAD',
    property: '#14919B',
    static: '#1992D4',
  },
};

export const SandpackDarkTheme: SandpackTheme = {
  palette: {
    highlightText: '#FFFFFF',
    defaultText: '#999999',
    inactive: '#343434',
    mainBackground: '#040404',
    inputBackground: '#242424',
    accent: '#6caedd',
  },
  syntax: {
    plain: '#FFFFFF',
    disabled: '#999999',
    keyword: '#76D0FB',
    definition: '#A23DAD',
    property: '#14919B',
    static: '#C78DF0',
  },
};
