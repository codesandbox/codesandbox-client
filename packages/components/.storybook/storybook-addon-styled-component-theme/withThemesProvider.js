import { List } from 'immutable';
import * as React from 'react';
import { ThemesProvider } from './ThemesProvider';

export const withThemesProvider = (themes, CustomThemeProvider) => story => {
  return (
    <ThemesProvider
      themes={List(themes)}
      CustomThemeProvider={CustomThemeProvider}
    >
      {story()}
    </ThemesProvider>
  );
};
