import React, { Fragment } from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';

import { ThemeDecorator } from '../src/stories/decorators';

import { createGlobalStyle } from 'styled-components';

import global from '../src/global.css';

const GlobalStyle = createGlobalStyle`
  ${global}
`;

export const withGlobal = cb => (
  <Fragment>
    <GlobalStyle />

    {cb()}
  </Fragment>
);

addDecorator(withKnobs);
addDecorator(withGlobal);
addDecorator(ThemeDecorator);

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
