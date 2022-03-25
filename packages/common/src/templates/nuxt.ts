import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

export default new Template(
  'nuxt',
  'Nuxt 2',
  'https://nuxtjs.org/',
  'github/nuxt/codesandbox-nuxt',
  decorateSelector(() => '#00DC82'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    distDir: 'dist',
    popular: true,
    mainFile: ['/pages/index.vue'],
    showOnHomePage: true,
    main: true,
    showCube: false,
  }
);
