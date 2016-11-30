import { singleModuleSelector } from './selector';
import createEntityActions from '../../actions/entities';

export const CHANGE_CODE = 'CHANGE_CODE';
export const SET_ERROR = 'SET_ERROR';
export const CREATE_MODULE = 'CREATE_MODULE';
export const EDIT_MODULE = 'EDIT_MODULE';
export const CANCEL_EDIT_MODULE = 'CANCEL_EDIT_MODULE';
export const COMMIT_EDIT_MODULE = 'COMMIT_EDIT_MODULE';
export const TOGGLE_MODULE_TREE_OPEN = 'TOGGLE_MODULE_TREE_OPEN';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
    setError: (id: string, error: ?{ message: string; line: number }) => (
      { type: SET_ERROR, id, error }
    ),
    createModule: (id: string) => ({ type: CREATE_MODULE, parentModuleId: id }),
    editModule: (id: string, edits = {}) => ({ type: EDIT_MODULE, id, edits }),
    cancelEditModule: (id: string) => ({ type: CANCEL_EDIT_MODULE, id }),
    commitEditModule: (id: string) => (dispatch, getState) => {
      const module = singleModuleSelector(getState(), { id });
      if (module == null || module.edits.error) return;

      const edits = { ...module.edits };
      delete edits.error;

      if (module.id === 'new') {
        // A new module!

        dispatch(entityActions.create(module.edits));
      } else {
        dispatch(entityActions.updateById(id, module, edits));

        dispatch(({ type: COMMIT_EDIT_MODULE, id }));
      }
    },
    toggleTreeOpen: (id: string) => ({ type: TOGGLE_MODULE_TREE_OPEN, id }),
  };
  return { ...entityActions, ...customActions };
};
