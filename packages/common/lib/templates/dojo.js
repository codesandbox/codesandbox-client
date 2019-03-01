'use strict';
// @flow
Object.defineProperty(exports, '__esModule', { value: true });
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
class DojoTemplate extends template_1.default {
  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles) {
    return ['/src/index.html'];
  }
  getEntries(configurationFiles) {
    const entries = super.getEntries(configurationFiles);
    entries.push('/src/main.ts');
    return entries;
  }
}
exports.DojoTemplate = DojoTemplate;
exports.default = new DojoTemplate(
  '@dojo/cli-create-app',
  'Dojo',
  'https://github.com/dojo/cli-create-app',
  'github/dojo/dojo-codesandbox-template',
  theme_1.decorateSelector(() => '#D3471C'),
  {
    showOnHomePage: true,
    showCube: false,
    isTypescript: true,
    extraConfigurations: {
      '/tsconfig.json': configuration_1.default.tsconfig,
    },
  }
);
