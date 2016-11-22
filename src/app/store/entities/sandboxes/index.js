// @flow
import { Schema, arrayOf } from 'normalizr';
import moduleEntity from '../modules/';

const schema = new Schema('sandboxes');
schema.define({
  modules: arrayOf(moduleEntity.schema),
});

export type Sandbox = {
  id: number,
  name: string;
  description: string;
  modules: Array<string>;
};

export default {
  schema,
  initialState: {
    1: { // $FlowIssue not used
      id: 1,
      name: 'Test',
      description: 'Stub project',
      modules: [1, 2, 3],
    },
  },
};
