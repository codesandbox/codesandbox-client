// @flow
import { schema } from 'normalizr';
import moduleEntity from './modules/entity';
import type { Module } from './modules/entity';
import directoryEntity from './directories/entity';
import type { Directory } from './directories/entity';

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
  isInProjectView: ?boolean,
  dependencyBundle: ?{
    manifest?: Object,
    hash?: string,
    url?: string,
    error?: string,
    processing?: boolean,
  },
  showEditor: ?boolean,
  showPreview: ?boolean,
};

export default new schema.Entity(
  'sandboxes',
  {
    modules: [moduleEntity],
    directories: [directoryEntity],
    currentModule: moduleEntity,
  },
  {
    processStrategy: value => ({
      ...value,
      isInProjectView: true,
      showEditor: true,
      showPreview: true,
    }),
  }
);
