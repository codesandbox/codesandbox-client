'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
exports.default = new template_1.default(
  'apollo',
  'Apollo',
  'https://www.apollographql.com/docs/apollo-server/',
  'apollo-server',
  theme_1.decorateSelector(() => '#c4198b'),
  {
    isServer: true,
    mainFile: ['/src/index.js'],
    showOnHomePage: true,
  }
);
