// @flow
import { Schema } from 'normalizr';

import userEntity from '../users/';
import sourceEntity from '../sources/';

import createEntity from '../create-entity';
import createActions from './actions';

const schema = new Schema('sandboxes');
schema.define({
  source: sourceEntity.schema,
  author: userEntity.schema,
});

export type Sandbox = {
  id: string;
  title: string;
  slug: string;
  description: string;
  modules: Array<string>;
  directories: Array<string>;
  source: string;
  author: ?string;
};

const actions = createActions(schema);

export default createEntity(schema, { actions });
