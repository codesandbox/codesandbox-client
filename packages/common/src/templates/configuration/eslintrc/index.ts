import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: '.eslintrc',
  type: 'eslint',
  description: 'Configuration for the linter.',
  moreInfoUrl: 'https://eslint.org/docs/user-guide/configuring',

  getDefaultCode: () => '{}',

  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/eslintrc.json',

  partialSupportDisclaimer: `We can only read preinstalled rules (all from eslint, react, prettier, import and vue plugins).`,
};

export default config;
