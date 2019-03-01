'use strict';
// @flow
Object.defineProperty(exports, '__esModule', { value: true });
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
class CxJSTemplate extends template_1.default {
  getEntries() {
    return ['/app/index.js', '/src/index.js', '/index.html'];
  }
  getHTMLEntries() {
    return ['/app/index.html', '/src/index.html', '/index.html'];
  }
}
exports.default = new CxJSTemplate(
  'cxjs',
  'CxJS',
  'https://cxjs.io/',
  'github/codaxy/cxjs-codesandbox-template',
  theme_1.decorateSelector(() => '#11689f'),
  {
    showOnHomePage: true,
    showCube: false,
    extraConfigurations: {
      '/.babelrc': configuration_1.default.babelrc,
      '/tsconfig.json': configuration_1.default.tsconfig,
    },
    externalResourcesEnabled: false,
    distDir: 'dist',
  }
);
