// @flow

import SvelteIcon from 'common/components/logos/Svelte';
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'svelte',
  'Svelte',
  'https://github.com/sveltejs/svelte',
  'svelte',
  SvelteIcon,
  decorateSelector(() => '#AA1E1E'),
  { showOnHomePage: true, distDir: 'public' }
);
