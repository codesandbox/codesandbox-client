import React from 'react';
import deepmerge from 'deepmerge';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router';
import { configure, addDecorator } from '@storybook/react';

import csbBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import designLanguage from '@codesandbox/components/lib/design-language/theme';
import polyfillTheme from '@codesandbox/components/src/utils/polyfill-theme';

const withThemeProvider = story => {
  const polyfilled = polyfillTheme(csbBlack);
  const merged = deepmerge(designLanguage, { colors: polyfilled });

  return (
    <ThemeProvider theme={merged}>
      <GlobalStyle />
      {story()}
    </ThemeProvider>
  );
};

const withRouter = story => {
  return <MemoryRouter>{story()}</MemoryRouter>;
};

// Automatically import all files ending in *.stories.tsx
const req = require.context('../src/app', true, /.stories.tsx$/);

const loadStories = () => {
  req.keys().forEach(req);
};

addDecorator(withThemeProvider);
addDecorator(withRouter);
configure(loadStories, module);

const GlobalStyle = createGlobalStyle`
  html body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: auto;
    -moz-font-smoothing: auto;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    min-height: 100%;
    height: 100%;
    font-size: 16px;
    width: 400px;
    margin: 0;
    background-color: ${({ theme }: { theme }) => {
      console.log('theme', theme);
      return theme.colors.sideBar.background;
    }};
    color: ${({ theme }: { theme }) => theme.colors.sideBar.foreground};

    * {
      box-sizing: border-box;
    }

    a {
      color: #fff;
    }
  }
`;
