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
  sourceId: string;
  directoryId: ?string;
  type: string;
  error?: ?{
    message: string;
    line: number;
    column: number;
    title: string;
    moduleId: ?string;
  };
  isNotSynced?: boolean;
};

const actions = createActions(schema);

export function isMainModule(module) {
  return module.directoryId == null && module.title === 'index.js';
}

export default createEntity(schema, {
  actions,
  reducer,
});
