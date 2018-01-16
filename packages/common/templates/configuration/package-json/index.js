// @flow

import type { Sandbox } from 'common/types';
import ui from './ui';

export function generateFileFromSandbox(sandbox: Sandbox) {
  const jsonFile = {};

  jsonFile.name = sandbox.title || sandbox.id;
  jsonFile.version = '1.0.0';
  jsonFile.description = sandbox.description;
  jsonFile.keywords = sandbox.tags;
  jsonFile.homepage = `https://codesandbox.io/s/${sandbox.id}`;
  jsonFile.main = sandbox.entry;
  jsonFile.dependencies = sandbox.npmDependencies;

  return JSON.stringify(jsonFile, null, 2);
}

export default {
  title: 'package.json',
  description:
    "This file describes the overall configuration of your project. It's mainly used by npm to build a dependency tree, but it's also used by developers to quickly scan what your project contains.",
  moreInfoUrl: 'https://docs.npmjs.com/files/package.json',

  ui,
  generateFileFromSandbox,
};
