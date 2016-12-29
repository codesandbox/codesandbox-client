// @flow
import { Schema, arrayOf } from 'normalizr';

import moduleEntity from '../modules/';
import directoryEntity from '../directories/';

import createEntity from '../create-entity';

const schema = new Schema('sources');
schema.define({
  modules: arrayOf(moduleEntity.schema),
  directories: arrayOf(directoryEntity.schema),
});

export type Source = {
  id: string;
  title: string;
  modules: Array<string>;
  directories: Array<string>;
  npmDependencies: { [key: string]: string };
};

export default createEntity(schema);
