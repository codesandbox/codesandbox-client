// @flow

import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'vue-cli',
  'Vue',
  'https://github.com/vuejs/vue-cli',
  'vue',
  decorateSelector(() => '#41B883'),
  { showOnHomePage: true, distDir: 'dist' }
);
