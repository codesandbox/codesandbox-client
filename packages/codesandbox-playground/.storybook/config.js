import { configure } from '@storybook/react';

const req = require.context('../stories', true);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
