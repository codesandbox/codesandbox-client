import * as React from 'react';
import { ThemeContext } from '../contexts/theme-context';

export const useTheme = () => {
  const { theme, id } = React.useContext(ThemeContext);
  return { theme, themeId: id };
};
