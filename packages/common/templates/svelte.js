// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'svelte',
  'Svelte',
  'https://github.com/sveltejs/svelte',
  'svelte',
  decorateSelector(() => '#AA1E1E'),
  { showOnHomePage: true, distDir: 'public' }
);
