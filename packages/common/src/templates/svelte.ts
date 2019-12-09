import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'svelte',
  'Svelte',
  'https://svelte.dev',
  'svelte',
  decorateSelector(() => '#FF3E00'),
  {
    showOnHomePage: true,
    showCube: false,
    distDir: 'public',
    mainFile: ['/app.svelte'],
  }
);
