// @flow
import { Schema } from 'normalizr';

import boilerplates from './boilerplates';
import directories from './directories/';
import modules from './modules/';
import sandboxes from './sandboxes/';
import sources from './sources';
import users from './users';
import versions from './versions';

export type Entity = {
  schema: typeof Schema;
  reducer?: (state: Object, action: Object) => Object;
  actions: { [name: string]: Function };
  initialState?: Object;
}

export default {
  boilerplates,
  directories,
  modules,
  sandboxes,
  sources,
  users,
  versions,
};
