'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const prettify_default_config_1 = require('../../../prettify-default-config');
const config = {
  title: '.prettierrc',
  type: 'prettier',
  description: 'Defines how all files will be prettified by Prettier.',
  moreInfoUrl: 'https://prettier.io/docs/en/configuration.html',
  generateFileFromState: state =>
    JSON.stringify(
      Object.assign(
        {},
        prettify_default_config_1.default,
        state.get('preferences.settings.prettierConfig') || {}
      ),
      null,
      2
    ),
  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/prettierrc.json',
};
exports.default = config;
