import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';

import global from '../src/global.css';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  ${global}
`;

const withGlobal = cb => (
  <React.Fragment>
    <GlobalStyle />
    {cb()}
  </React.Fragment>
);

// Option defaults.
addParameters({
  options: {
    theme: themes.dark,
  },
});

// automatically import all files ending in *.stories.tsx
const req = require.context('../src', true, /.stories.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
addDecorator(withGlobal);
