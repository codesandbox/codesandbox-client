import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'gridsome',
  'Gridsome',
  'https://gridsome.org/',
  'github/SaraVieira/gridsome-starter-codesandbox',
  decorateSelector(() => '#00a672'),
  {
    distDir: 'dist',
    isServer: true,
    mainFile: ['/src/pages/Index.vue'],
    showOnHomePage: true,
    main: true,
  }
);
