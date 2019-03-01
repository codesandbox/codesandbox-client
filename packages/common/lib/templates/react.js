'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
exports.default = new template_1.default(
  'create-react-app',
  'React',
  'https://github.com/facebookincubator/create-react-app',
  'new',
  theme_1.decorateSelector(() => '#61DAFB'),
  {
    showOnHomePage: true,
    main: true,
    mainFile: ['/src/index.js', '/src/index.tsx', '/src/index.ts'],
  }
);
