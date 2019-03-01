'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
exports.default = new template_1.default(
  'svelte',
  'Svelte',
  'https://github.com/sveltejs/svelte',
  'svelte',
  theme_1.decorateSelector(() => '#AA1E1E'),
  { showOnHomePage: true, showCube: false, distDir: 'public' }
);
