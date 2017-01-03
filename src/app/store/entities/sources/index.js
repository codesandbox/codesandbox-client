// @flow
import { Schema, arrayOf } from 'normalizr';
import { decamelizeKeys } from 'humps';

import moduleEntity from '../modules/';
import directoryEntity from '../directories/';

import createEntity from '../create-entity';
import actions from './actions';
import reducer from './reducer';

const schema = new Schema('sources');
schema.define({
  modules: arrayOf(moduleEntity.schema),
  directories: arrayOf(directoryEntity.schema),
});

const afterReceiveReducer = (source) => {
  const newSource = {
    ...source,
    npmDependencies: decamelizeKeys(source.npmDependencies, { separator: '-' }),
  };

  return newSource;
};

export type Source = {
  id: string;
  title: string;
  modules: Array<string>;
  directories: Array<string>;
  npmDependencies: { [key: string]: string };
  bundle: ?{
    manifest?: Object;
    hash?: string;
    url?: string;
    error?: string;
    processing: boolean;
  }
};

export default createEntity(schema, { actions, reducer, afterReceiveReducer });
