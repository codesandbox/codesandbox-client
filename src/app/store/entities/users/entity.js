// @flow
import { schema } from 'normalizr';

export default new schema.Entity(
  'users',
  {},
  {
    idAttribute: u => u.username,
  }
);
