'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
exports.default = new template_1.default(
  'nuxt',
  'Nuxt.js',
  'https://nuxtjs.org/',
  'github/nuxt/codesandbox-nuxt',
  theme_1.decorateSelector(() => '#3B8070'),
  {
    extraConfigurations: {
      '/.babelrc': configuration_1.default.babelrc,
    },
    isServer: true,
    mainFile: ['/pages/index.vue'],
    showOnHomePage: true,
    main: true,
  }
);
