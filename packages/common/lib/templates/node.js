'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
exports.default = new template_1.default(
  'node',
  'Node',
  'https://codesandbox.io/docs/sse',
  'node',
  theme_1.decorateSelector(() => '#66cc33'),
  {
    isServer: true,
    showOnHomePage: true,
    main: true,
    mainFile: ['/pages/index.vue', '/pages/index.js', '/src/pages/index.js'],
  }
);
