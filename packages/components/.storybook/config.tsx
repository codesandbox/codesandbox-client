import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';
import isChromatic from 'chromatic/isChromatic';
import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { makeTheme, getThemes } from '../src/components/ThemeProvider';

import { withThemesProvider } from './storybook-addon-styled-component-theme';

type Theme = {
  colors: any;
  name: string;
};

const viewports = {
  mobile: {
    name: 'Mobile',
    styles: { width: '375px', height: '667px' },
  },
  tablet: {
    name: 'Tablet',
    styles: { width: '768px', height: '1024px' },
  },
  laptop: {
    name: 'Laptop',
    styles: { width: '1366px', height: '768px' },
  },
  desktop: {
    name: 'Desktop',
    styles: { width: '1920px', height: '1080px' },
  },
};

// new globals based on theme?
// using sidebar as the styles for body for now 🤷
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
    margin: 0;
    background-color: ${({ theme }: { theme: Theme }) =>
      theme.colors.sideBar.background};
    color: ${({ theme }: { theme: Theme }) => theme.colors.sideBar.foreground};

    * {
      box-sizing: border-box;
    }

    a {
      color: #fff;
    }
  }
`;
const allThemes: Theme[] = getThemes();
const vsCodeThemes: Theme[] = allThemes.map(b => makeTheme(b, b.name));

const CodeSandboxBlack = vsCodeThemes.find(
  ({ name }) => name === 'CodeSandbox Black'
);

if (isChromatic()) {
  const withGlobal = (story: any) => (
    <ThemeProvider theme={makeTheme(CodeSandboxBlack, 'default')}>
      <GlobalStyle />

      {story()}
    </ThemeProvider>
  );

  addDecorator(withGlobal);
} else {
  const withGlobal = (story: any) => (
    <>
      <GlobalStyle />

      {story()}
    </>
  );

  const rest = vsCodeThemes.filter(({ name }) => name !== 'CodeSandbox Black');
  addDecorator(withGlobal);
  addDecorator(withThemesProvider([CodeSandboxBlack, ...rest]));
}
addDecorator(withA11y);
addDecorator(withKnobs);

addParameters({ viewport: { viewports } });
addParameters({ options: { theme: themes.dark } });

// automatically import all files ending in *.stories.tsx
configure(require.context('../src', true, /\.stories\.tsx$/), module);
