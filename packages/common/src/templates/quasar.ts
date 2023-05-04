import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'quasar',
  'Quasar',
  'https://quasar.dev/',
  'github/quasarframework/quasar-codesandbox',
  decorateSelector(() => '#43A4F2'),
  {
    mainFile: ['/src/pages/Index.vue'],
    showOnHomePage: true,
    staticDeployment: false,
  }
);
