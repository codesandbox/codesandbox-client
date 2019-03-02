// @flow
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'styleguidist',
  'Styleguidist',
  'https://react-styleguidist.js.org/',
  'github/styleguidist/example',
  decorateSelector(() => '#25d8fc'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    isServer: true,
    mainFile: [], //'/src/components/Button.js'
    showOnHomePage: true,
  }
);
