'use strict';
// @flow
Object.defineProperty(exports, '__esModule', { value: true });
const configuration_1 = require('./configuration');
const template_1 = require('./template');
const theme_1 = require('../theme');
exports.default = new template_1.default(
  'create-react-app-typescript',
  'React + TS',
  'https://github.com/wmonk/create-react-app-typescript',
  'react-ts',
  theme_1.decorateSelector(() => '#009fff'),
  {
    isTypescript: true,
    showOnHomePage: false,
    extraConfigurations: {
      '/tsconfig.json': configuration_1.default.tsconfig,
    },
  }
);
