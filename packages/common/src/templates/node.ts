import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'node',
  'Node',
  'https://codesandbox.io/docs/learn/environment/vm',
  'node',
  decorateSelector(() => '#66cc33'),
  {
    showOnHomePage: true,
    main: true,
    staticDeployment: false,
    popular: true,
    mainFile: ['/pages/index.vue', '/pages/index.js', '/src/pages/index.js'],
  }
);
