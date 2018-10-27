// @flow
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'gatsby',
  'Gatsby',
  'https://www.gatsbyjs.org/',
  'github/gatsbyjs/gatsby-starter-default',
  decorateSelector(() => '#8C65B3'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    isServer: true,
    mainFile: ['/src/pages/index.js'],
    showOnHomePage: true,
    main: true,
  }
);
