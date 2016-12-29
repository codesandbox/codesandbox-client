// @flow
import { Schema } from 'normalizr';

import createEntity from '../create-entity';
import createActions from './actions';

const schema = new Schema('versions');

export type Version = {
  id: string;
  version: string;
  insertedAt: string;
};

const actions = createActions(schema);

export default createEntity(schema, { actions });
