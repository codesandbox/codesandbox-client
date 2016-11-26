// @flow
import { Schema, arrayOf } from 'normalizr';
import moduleEntity from '../modules/';

const schema = new Schema('sandboxes');
schema.define({
  modules: arrayOf(moduleEntity.schema),
});

export type Sandbox = {
  id: number,
  title: string;
  description: string;
  modules: Array<string>;
  mainModule: string;
  sandboxes: Array<string>;
};

export default {
  schema,
  initialState: {
    1: {
      id: '1',
      title: 'Beautiful Project',
      description: 'Stub project',
      modules: ['2', '3'],
      mainModule: '1',
      sandboxes: ['2', '3'],
    },
    2: {
      id: '2',
      title: 'Dependency Project',
      description: 'Stub project',
      modules: ['6'],
      mainModule: '5',
      sandboxes: [],
    },
    3: {
      id: '3',
      title: 'Dependency Project 2',
      description: 'Stub project',
      modules: ['7'],
      mainModule: '4',
      sandboxes: [],
    },
  },
};
