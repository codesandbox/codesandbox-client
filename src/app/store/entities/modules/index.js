// @flow
import { Schema } from 'normalizr';

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
  mainModule: boolean;
  type: string;
  error?: ?{
    message: string;
    line: number;
    column: number;
    title: string;
    moduleId: ?string;
  };
  isTreeOpen: boolean;
};

const actions = createActions(schema);

export default createEntity(schema, {
  actions,
  reducer,
  afterReceiveReducer: module => ({
    ...module,
    mainModule: module.parentModuleId === null,
    isTreeOpen: true,
  }),
});
