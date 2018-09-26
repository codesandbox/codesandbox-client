// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'node',
  'Custom',
  'https://codesandbox.io/docs/sse',
  'node',
  decorateSelector(() => '#40A9F3'),
  {
    isServer: true,
    main: true,
    mainFile: ['/pages/index.vue', '/pages/index.js', '/src/pages/index.js'],
  }
);
