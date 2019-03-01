'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
exports.default = new template_1.default(
  'reason',
  'Reason',
  'https://reasonml.github.io/reason-react/en/',
  'reason',
  theme_1.decorateSelector(() => '#CB5747'),
  {
    showOnHomePage: true,
    main: false,
    mainFile: ['/src/Main.re', 'App.re', 'Index.re'],
  }
);
