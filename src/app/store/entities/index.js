// @flow
import { Schema } from 'normalizr';

import directories from './directories/';
import modules from './modules/';
import sandboxes from './sandboxes/';
import users from './users';

export type Entity = {
  schema: typeof Schema;
  reducer?: (state: Object, action: Object) => Object;
  actions: { [name: string]: Function };
  initialState?: Object;
}


export default {
  directories,
  modules,
  sandboxes,
  users,
};
