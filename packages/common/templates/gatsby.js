// @flow
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'gatsby',
  'Gatsby',
  'https://www.gatsbyjs.org/',
  'gatsby',
  decorateSelector(() => '#9D7CBF'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    isServer: true,
  }
);
