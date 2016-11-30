// @flow
import { Schema } from 'normalizr';
import { values, sortBy } from 'lodash';

import createEntity from '../create-entity';
import createActions from './actions';
import reducer from './reducer';

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
  error?: ?{
    message: string;
    line: number;
    column: number;
    title: string;
    moduleId: ?string;
  };
  edits?: ?{
    error: ?string;
    title: string;
    validationErrors: Array<String>;
  };
  isTreeOpen: boolean;
};

const actions = createActions(schema);

export default createEntity(schema, {
  actions,
  reducer,
  afterReceiveReducer: (module, state) => {
    // Used to build the tree of children of a module, this is not done
    // on the server
    // Also to mark the main module
    const modules = values(state);

    const children = modules.filter(m => m.parentModuleId === module.id);
    const orderedChildren = sortBy(children, m => m.title);
    return {
      ...module,
      children: orderedChildren.map(m => m.id),
      mainModule: module.parentModuleId === null,
      isTreeOpen: true,
    };
  },
});
