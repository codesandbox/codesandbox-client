import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'jsconfig.json',
  type: 'jsconfig',
  description:
    'Configuration for how the editor (and sometimes the bundler) reads and parses JavaScript.',
  moreInfoUrl: 'https://code.visualstudio.com/docs/languages/jsconfig',

  getDefaultCode: (
    template: string,
    resolveModule: (path: string) => { code: string } | undefined
  ) => JSON.stringify({ compilerOptions: { baseUrl: '.' } }, null, 2),

  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/jsconfig.json',

  partialSupportDisclaimer: `Only \`compilerOptions.baseUrl\` field is supported.`,
};

export default config;
