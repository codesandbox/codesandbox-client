import { Sandbox } from '../../../types';
import slugify from '../../../utils/slugify';
import { ConfigurationFile } from '../types';

export function generateFileFromSandbox(sandbox: Sandbox) {
  const jsonFile: {
    name: string;
    version: string;
    description: string;
    main: string;
    dependencies: object;
    keywords: string[];
  } = {
    name: slugify(sandbox.title || sandbox.id),
    version: '1.0.0',
    description: sandbox.description || '',
    keywords: sandbox.tags,
    main: sandbox.entry,
    dependencies: sandbox.npmDependencies,
  };

  return JSON.stringify(jsonFile, null, 2);
}

const config: ConfigurationFile = {
  title: 'package.json',
  type: 'package',
  description: 'Describes the overall configuration of your project.',
  moreInfoUrl: 'https://docs.npmjs.com/files/package.json',

  generateFileFromSandbox,
  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/package.json',
};

export default config;
