import { singleModuleSelector } from './selector';
import createEntityActions from '../../actions/entities';

export const CHANGE_CODE = 'CHANGE_CODE';
export const SET_ERROR = 'SET_ERROR';
export const TOGGLE_MODULE_TREE_OPEN = 'TOGGLE_MODULE_TREE_OPEN';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
    setError: (id: string, error: ?{ message: string; line: number }) => (
      { type: SET_ERROR, id, error }
    ),
    createModule: (parentModuleId: string, title: string) => (dispatch, getState) => {
      const parentModule = singleModuleSelector(getState(), { id: parentModuleId });
      const { sandboxId } = parentModule;

      dispatch(entityActions.create({ title, parentModuleId, sandboxId }));
    },
    renameModule: (id: string, title: string) => (dispatch, getState) => {
      const module = singleModuleSelector(getState(), { id });
      dispatch(entityActions.updateById(id, { title: module.title }, { title }));
    },
    addChild: (id: string, childId: string) => (dispatch, getState) => {
      const module = singleModuleSelector(getState(), { id: childId });
      const oldData = { parentModuleId: module.parentModuleId };
      const newData = { parentModuleId: id };
      dispatch(entityActions.updateById(childId, oldData, newData));
    },
    toggleTreeOpen: (id: string) => ({ type: TOGGLE_MODULE_TREE_OPEN, id }),
  };
  return { ...entityActions, ...customActions };
};
