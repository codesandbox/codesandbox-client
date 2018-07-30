// @flow
import type { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'tsconfig.prod.json',
  type: 'typescript',
  description: 'Configuration for how TypeScript transpiles.',
  moreInfoUrl: 'http://www.typescriptlang.org/docs/handbook/tsconfig-json.html',

  getDefaultCode: (template: string) => {
    if (template === 'create-react-app-typescript') {
      return JSON.stringify(
        {
          extends: './tsconfig.json'
        },
        null,
        2
      );
    }

    if (template === 'parcel') {
      return JSON.stringify({
        extends: './tsconfig.json'
      });
    }

    return JSON.stringify(
      {
        extends: './tsconfig.json'
      },
      null,
      2
    );
  },

  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/tsconfig.json',

  partialSupportDisclaimer: `Only \`compilerOptions\` field is supported.`,
};

export default config;
