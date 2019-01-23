// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'node',
  'Node',
  'https://codesandbox.io/docs/sse',
  'node',
  decorateSelector(() => '#66cc33'),
  {
    isServer: true,
    showOnHomePage: true,
    main: true,
    mainFile: ['/pages/index.vue', '/pages/index.js', '/src/pages/index.js'],
  }
);
