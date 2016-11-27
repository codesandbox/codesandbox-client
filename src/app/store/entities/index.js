// @flow
import { Schema } from 'normalizr';

import modules from './modules/';
import sandboxes from './sandboxes/';

export type Entity = {
  schema: typeof Schema;
  reducer?: (state: Object, action: Object) => Object;
  actions: { [name: string]: Function };
  initialState?: Object;
}


export default {
  modules,
  sandboxes,
};
