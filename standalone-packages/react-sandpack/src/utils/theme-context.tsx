import * as React from 'react';
import { sandpackLightTheme } from '../themes';
import { SandpackTheme } from '../types';

const ThemeContext = React.createContext<SandpackTheme>(sandpackLightTheme);

const ThemeConsumer = ThemeContext.Consumer;
const ThemeProvider = ThemeContext.Provider;

export { ThemeProvider, ThemeConsumer, ThemeContext };
