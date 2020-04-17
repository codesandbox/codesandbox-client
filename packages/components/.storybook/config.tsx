import React from 'react';
import isChromatic from 'storybook-chromatic/isChromatic';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';
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
  html,
  body {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: auto;
    -moz-font-smoothing: auto;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: auto;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    min-height: 100%;
    -webkit-text-size-adjust: 100%;
    height: 100%;
    background: #1c2022;
    color: #cccccc;
    font-size: 16px !important;

    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  input {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  input:focus {
    outline: -webkit-focus-ring-color auto 0px;
    outline-offset: 0;
  }

  #root {
  }

  a {
    color: #40a9f3;
  }

  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }

  ::-webkit-scrollbar-thumb {
    transition: 0.3s ease all;
    border-color: transparent;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 40;
  }

  ::-webkit-scrollbar-thumb:hover {
    transition: 0.3s ease all;
    background-color: rgba(255, 255, 255, 0.15);
  }

  .react-console::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .react-console::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }

  body * {
    box-sizing: initial;
    -webkit-font-smoothing: antialiased;
  }


  body #vscode-editor * {
    -webkit-font-smoothing: auto;
  }

  html body {
    font-family: 'Inter', sans-serif;
    width: 400px;
    margin: 0;
    background-color: ${props =>
      // @ts-ignore
      props.theme.colors.sideBar.background} !important;
    color: ${props =>
      // @ts-ignore
      props.theme.colors.sideBar.foreground} !important;
    * {
      box-sizing: border-box;
    }

  }
`;
const allThemes = getThemes();
const vsCodeThemes = allThemes.map(b => makeTheme(b, b.name));

const blackCodesandbox = vsCodeThemes.find(
  (theme: Theme) => theme.name === 'CodeSandbox Black'
);

if (!isChromatic()) {
  const withGlobal = (cb: any) => (
    <>
      <GlobalStyle />
      {cb()}
    </>
  );

  const rest = vsCodeThemes.filter(
    (theme: Theme) => theme.name !== 'CodeSandbox Black'
  );
  addDecorator(withGlobal);
  addDecorator(withThemesProvider([blackCodesandbox, ...rest]));
} else {
  const withGlobal = (cb: any) => (
    <ThemeProvider theme={makeTheme(blackCodesandbox, 'default')}>
      <GlobalStyle />
      {cb()}
    </ThemeProvider>
  );

  addDecorator(withGlobal);
}
addDecorator(withA11y);
addDecorator(withKnobs);
addParameters({ viewport: { viewports } });

// Option defaults.
addParameters({ options: { theme: themes.dark } });

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.tsx$/), module);
