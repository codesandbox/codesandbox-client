// @flow
import { schema } from 'normalizr';
import moduleEntity from './modules/entity';
import type { Module } from './modules/entity';
import directoryEntity from './directories/entity';
import type { Directory } from './directories/entity';
import userEntity from './users/entity';
import type { User } from './users/entity';

export type Sandbox = {
  id: string,
  title: ?string,
  description: string,
  modules: Array<Module>,
  currentModule: ?Module,
  directories: Array<Directory>,
  npmDependencies: {
    [dep: string]: string,
  },
  externalResources: Array<string>,
  isInProjectView: ?boolean,
  dependencyBundle: ?{
    manifest?: Object,
    hash?: string,
    url?: string,
    error?: string,
    processing?: boolean,
  },
  author: User,
  forkedFromSandbox: ?{ title: string, id: string },
};

export default new schema.Entity(
  'sandboxes',
  {
    modules: [moduleEntity],
    directories: [directoryEntity],
    currentModule: moduleEntity,
    author: userEntity,
  },
  {
    processStrategy: value => ({
      ...value,
      isInProjectView: true,
    }),
  }
);
