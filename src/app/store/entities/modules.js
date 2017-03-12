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

export const validateTitle = (
  id: string,
  title: string,
  siblings: Array<Module | Sandbox>,
) => {
  if (title.length === 0) return 'title cannot be empty';
  if (!/^[0-9a-zA-Z\-_.]+$/.test(title)) {
    // It has whitespaces
    return 'Title cannot have whitespaces or special characters';
  }
  const siblingTitles: Array<string> = siblings
                          .filter(x => x != null)
                          .filter(m => m.id !== id)
                          .map(m => m.title);
  if (siblingTitles.indexOf(title) > -1) {
    return 'There is already a module with the same title in this scope';
  }

  if (title.length > 32) {
    return "The title can't be more than 32 characters long";
  }

  return null;
};
