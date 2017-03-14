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
  directories: Array<Directory>,
  npmDependencies: {
    [dep: string]: string,
  },
};

export default new schema.Entity('sandboxes', {
  modules: [moduleEntity],
  directories: [directoryEntity],
});
