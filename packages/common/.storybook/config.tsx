import React, { Fragment } from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';

import { ThemeDecorator } from '../src/stories/decorators';

import { createGlobalStyle } from 'styled-components';

import global from '../src/global.css';

const viewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  laptop: {
    name: 'Laptop',
    styles: {
      width: '1366px',
      height: '768px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
};

const GlobalStyle = createGlobalStyle`
  ${global}
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
addParameters({
  viewport: {
    viewports,
  },
});

// Option defaults.
addParameters({
  options: {
    theme: themes.dark,
  },
});

// automatically import all files ending in *.stories.tsx
const req = require.context('../src', true, /.stories.tsx$/);

const loadStories = () => {
  req.keys().forEach(req);
};

configure(loadStories, module);
