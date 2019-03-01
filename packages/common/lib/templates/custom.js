'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
exports.default = new template_1.default(
  'custom',
  'Custom',
  'https://codesandbox.io',
  'custom',
  theme_1.decorateSelector(() => '#F5DA55'),
  {
    extraConfigurations: {
      '/.codesandbox/template.json': configuration_1.default.customCodeSandbox,
    },
  }
);
