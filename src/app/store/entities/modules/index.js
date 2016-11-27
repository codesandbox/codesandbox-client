// @flow
import { Schema } from 'normalizr';

import type { Entity } from '../';
import reducer, { actions } from './reducer';
import createEntityActions from '../../actions/entities';

const schema = new Schema('modules');

export type Module = {
  id: string,
  name: string;
  code: string;
  sandboxId: string;
  type: string;
};

const entity: Entity = {
  schema,
  reducer,
};

console.log(createEntityActions(entity));
entity.actions = { ...actions, ...createEntityActions(entity) };

export default entity;
