// @flow
import { Schema } from 'normalizr';

import createEntity from '../create-entity';

const schema = new Schema('users');

export type User = {
  id: number;
  name: string;
  username: string;
};

export default createEntity(schema);
