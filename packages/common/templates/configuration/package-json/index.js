// @flow

import type { Sandbox } from 'common/types';
import slugify from 'common/utils/slugify';
import type { ConfigurationFile } from '../types';

export function generateFileFromSandbox(sandbox: Sandbox) {
  const jsonFile = {};

  jsonFile.name = slugify(sandbox.title || sandbox.id);
  jsonFile.version = '1.0.0';
  jsonFile.description = sandbox.description || '';
  jsonFile.keywords = sandbox.tags;
  jsonFile.main = sandbox.entry;
  jsonFile.dependencies = sandbox.npmDependencies;

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
