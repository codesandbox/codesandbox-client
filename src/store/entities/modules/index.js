// @flow
import { Schema } from 'normalizr';

import reducer, { actions } from './reducer';

const schema = new Schema('modules');

export type Module = {
  id: number,
  name: string;
  code: string;
  sandboxId: number;
  error: ?Error;
};


export default {
  schema,
  reducer,
  actions,
};
