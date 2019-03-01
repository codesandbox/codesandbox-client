'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
exports.default = new template_1.default(
  'gatsby',
  'Gatsby',
  'https://www.gatsbyjs.org/',
  'github/gatsbyjs/gatsby-starter-default',
  theme_1.decorateSelector(() => '#8C65B3'),
  {
    extraConfigurations: {
      '/.babelrc': configuration_1.default.babelrc,
    },
    isServer: true,
    mainFile: ['/src/pages/index.js'],
    showOnHomePage: true,
    main: true,
  }
);
