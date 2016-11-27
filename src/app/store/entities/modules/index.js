// @flow
import { Schema } from 'normalizr';
import { values } from 'lodash';

import createEntity from '../create-entity';
import reducer, { actions } from './reducer';

const schema = new Schema('modules');

export type Module = {
  id: string,
  title: string;
  code: string;
  sandboxId: string;
  parentModuleId: string;
  children: Array<string>; // Gets built by afterReceiveReducer
  mainModule: boolean;
  type: string;
};

export default createEntity(schema, {
  actions,
  reducer,
  afterReceiveReducer: (module, state) => {
    // Used to build the tree of children of a module, this is not done
    // on the server
    // Also to mark the main module
    const modules = values(state);

    const children = modules.filter(m => m.parentModuleId === module.id).map(m => m.id);
    return { ...module, children, mainModule: module.parentModuleId === null };
  },
});
