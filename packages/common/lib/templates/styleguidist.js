'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
exports.default = new template_1.default(
  'styleguidist',
  'Styleguidist',
  'https://react-styleguidist.js.org/',
  'github/styleguidist/example',
  theme_1.decorateSelector(() => '#25d8fc'),
  {
    extraConfigurations: {
      '/.babelrc': configuration_1.default.babelrc,
    },
    isServer: true,
    mainFile: [],
    showOnHomePage: true,
  }
);
