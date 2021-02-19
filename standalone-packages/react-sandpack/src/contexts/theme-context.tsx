import * as React from 'react';
import { createThemeObject, sandpackLightTheme } from '../themes';
import {
  SandpackPartialTheme,
  SandpackPredefinedTheme,
  SandpackTheme,
} from '../types';
import { injectThemeStyleSheet } from '../utils/dom-utils';

const ThemeContext = React.createContext<{ theme: SandpackTheme; id: string }>({
  theme: sandpackLightTheme,
  id: 'sp-light',
});

const ThemeProvider: React.FC<{
  theme?: SandpackPredefinedTheme | SandpackPartialTheme;
}> = props => {
  const { theme, id } = createThemeObject(props.theme);
  injectThemeStyleSheet(theme, id);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        id,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

const ThemeConsumer = ThemeContext.Consumer;

export { ThemeProvider, ThemeConsumer, ThemeContext };
