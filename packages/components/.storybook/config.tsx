import React from 'react';
import isChromatic from 'storybook-chromatic/isChromatic';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
// @ts-ignore
import global from '@codesandbox/common/lib/global.css';
import { makeTheme, getThemes } from '../src/components/ThemeProvider';
import { withThemesProvider } from './storybook-addon-styled-component-theme';

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
  ${global};
  html body {
    font-family: 'Inter', sans-serif;
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
  theme => theme.name === 'CodeSandbox Black'
);

if (!isChromatic()) {
  const withGlobal = (cb: any) => (
    <>
      <GlobalStyle />
      {cb()}
    </>
  );

  const rest = vsCodeThemes.filter(theme => theme.name !== 'CodeSandbox Black');
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
