import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'gridsome',
  'Gridsome',
  'https://gridsome.org/',
  'github/SaraVieira/gridsome-starter-codesandbox',
  decorateSelector(() => '#5ED3A2'),
  {
    distDir: 'dist',
    isServer: true,
    mainFile: ['/src/pages/index.vue'],
    showOnHomePage: true,
    main: true,
  }
);
