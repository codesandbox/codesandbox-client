// @flow
import { schema } from 'normalizr';

export default new schema.Entity(
  'modules',
  {},
  {
    processStrategy: module => ({
      ...module,
      errors: [],
    }),
  }
);
