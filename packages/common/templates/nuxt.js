// @flow
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'nuxt',
  'Nuxt.js',
  'https://nuxtjs.org/',
  'github/nuxt/codesandbox-nuxt',
  decorateSelector(() => '#3B8070'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    isServer: true,
    mainFile: ['/pages/index.vue'],
    showOnHomePage: true,
  }
);
