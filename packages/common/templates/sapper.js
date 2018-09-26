// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'sapper',
  'Sapper',
  'https://sapper.svelte.technology/',
  'sapper',
  decorateSelector(() => '#105E10'),
  {
    isServer: true,
    mainFile: ['/src/routes/index.html'],
    showOnHomePage: true,
  }
);
