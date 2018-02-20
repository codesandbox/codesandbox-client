// @flow
import type { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: '.eslintrc',
  type: 'eslint',
  description: 'Configuration for the linter.',
  moreInfoUrl: 'https://eslint.org/docs/user-guide/configuring',

  getDefaultCode: (template: string) => {
    return '{}';
  },

  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/babelrc.json',
};

export default config;
