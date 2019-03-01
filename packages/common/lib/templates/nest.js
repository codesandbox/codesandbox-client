'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
exports.default = new template_1.default(
  'nest',
  'Nest',
  'https://nestjs.com/',
  'github/nestjs/typescript-starter',
  theme_1.decorateSelector(() => '#ed2945'),
  {
    extraConfigurations: {
      '/tsconfig.json': configuration_1.default.tsconfig,
    },
    isServer: true,
    mainFile: ['/src/main.ts'],
    showOnHomePage: true,
  }
);
