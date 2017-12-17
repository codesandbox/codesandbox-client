import { configure } from '@storybook/react';

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
