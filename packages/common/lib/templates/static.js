'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
exports.default = new template_1.default(
  'static',
  'Static',
  'https://developer.mozilla.org/en-US/docs/Learn/HTML',
  'github/codesandbox-app/static-template',
  theme_1.decorateSelector(() => '#3AA855'),
  {
    showOnHomePage: true,
    main: false,
    mainFile: ['/index.html'],
  }
);
