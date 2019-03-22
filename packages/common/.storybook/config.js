import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withA11y } from '@storybook/addon-a11y';
import { ThemeProvider } from 'styled-components';
import theme from '../src/theme.ts';
import storybookTheme from './theme';

addParameters({
  options: {
    theme: storybookTheme,
  },
});

addParameters({ viewport: INITIAL_VIEWPORTS });

// automatically import all files ending in *.stories.js
const req = require.context('../src/components/', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);

configure(loadStories, module);
addDecorator(withKnobs);
addDecorator(withA11y);
