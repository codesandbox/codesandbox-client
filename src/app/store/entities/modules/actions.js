import { singleModuleSelector } from './selector';
import createEntityActions from '../../actions/entities';

export const CHANGE_CODE = 'CHANGE_CODE';
export const SET_ERROR = 'SET_ERROR';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
    setError: (id: string, error: ?{ message: string; line: number }) => (
      { type: SET_ERROR, id, error }
    ),
    renameModule: (id: string, title: string) => (dispatch, getState) => {
      const state = getState();
      const module = singleModuleSelector(state, { id });
      if (module == null) return;

      dispatch(entityActions.updateById(id, { title: module.title }, { title }));
    },
  };
  return { ...entityActions, ...customActions };
};
