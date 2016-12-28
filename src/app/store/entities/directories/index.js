// @flow
import { Schema } from 'normalizr';

import reducer from './reducer';

import createActions from './actions';

const schema = new Schema('directories');

export type Directory = {
  id: string,
  title: string;
  directoryId: string;
  sourceId: string;
  open: boolean;
};

const actions = createActions(schema);

export default {
  schema,
  actions,
  reducer,
};
