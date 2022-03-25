import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

export default new Template(
  'nuxt',
  'Nuxt 3',
  'https://v3.nuxtjs.org/',
  'github/nuxt/starter/tree/v3-codesandbox',
  decorateSelector(() => '#00DC82'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    distDir: 'dist',
    popular: true,
    mainFile: ['/app.vue'],
    showOnHomePage: true,
    main: true,
    showCube: false,
  }
);
