import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'quasar-framework',
  'Quasar',
  'https://quasar-framework.org/',
  'github/quasarframework/quasar-codesandbox',
  decorateSelector(() => '#43A4F2'),
  {
    isServer: true,
    mainFile: ['/src/pages/Index.vue'],
    showOnHomePage: true,
    netlify: false
  }
);