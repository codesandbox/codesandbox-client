import * as React from 'react';
import { SandpackThemeContext } from '../contexts/theme-context';

export const useSandpackTheme = () => {
  const { theme, id } = React.useContext(SandpackThemeContext);
  return { theme, themeId: id };
};
