// @ts-ignore
import global from '@codesandbox/common/lib/global.css';
import { DecoratorFunction } from '@storybook/addons';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';
import isChromatic from 'storybook-chromatic/isChromatic';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { withThemesProvider } from './storybook-addon-styled-component-theme';

import { makeTheme, getThemes } from '../src/components/ThemeProvider';

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
const blackCodeSandbox = vsCodeThemes.find(
  ({ name }) => name === 'CodeSandbox Black'
);
if (isChromatic()) {
  const withGlobal: DecoratorFunction = story => (
    <ThemeProvider theme={makeTheme(blackCodeSandbox, 'default')}>
      <GlobalStyle />

      {story()}
    </ThemeProvider>
  );

  addDecorator(withGlobal);
} else {
  const withGlobal: DecoratorFunction = story => (
    <>
      <GlobalStyle />

      {story()}
    </>
  );

  const rest = vsCodeThemes.filter(({ name }) => name !== 'CodeSandbox Black');
  addDecorator(withGlobal);
  addDecorator(withThemesProvider([blackCodeSandbox, ...rest]));
}
addDecorator(withA11y);
addDecorator(withKnobs);

addParameters({ viewport: { viewports } });
addParameters({ options: { theme: themes.dark } });

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.tsx$/), module);
