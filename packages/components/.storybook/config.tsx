import React, { Fragment } from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';
import { ThemeDecorator } from './decorators';
import { createGlobalStyle } from 'styled-components';
import global from '@codesandbox/common/lib/global.css';
import theme from './theme';

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

console.log(theme);

// new globals based on theme?
// using sidebar as the styles for body for now 🤷
const GlobalStyle = createGlobalStyle`
  ${global};
  body {
    font-family: 'Inter', sans-serif;
    background-color: ${theme.colors.sideBar.background};
    color: ${theme.colors.sideBar.foreground};
  }
`;

export const withGlobal = cb => (
  <Fragment>
    <GlobalStyle />
    {cb()}
  </Fragment>
);

addDecorator(withA11y);
addDecorator(withKnobs);
addDecorator(withGlobal);
addDecorator(ThemeDecorator);
addParameters({ viewport: { viewports } });

// Option defaults.
addParameters({ options: { theme: themes.dark } });

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.tsx$/), module);
