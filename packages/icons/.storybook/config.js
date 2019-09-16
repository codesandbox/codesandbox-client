import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(require.context('../', true, /\.stories\.js$/), module);

// add icon.stories.js for gallery
configure(require.context('./', true, /\.stories\.js$/), module);
