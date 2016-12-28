import { singleModuleSelector, modulesBySandboxSelector } from './selector';
import createEntityActions from '../../actions/entities';
import notificationActions from '../../actions/notifications';

export const CHANGE_CODE = 'CHANGE_CODE';
export const SAVE_CODE = 'SAVE_CODE';
export const SET_ERROR = 'SET_ERROR';
export const SAVE_ALL_MODULES = 'SAVE_ALL_MODULES';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
    setError: (id: string, error: ?{ message: string; line: number }) => (
      { type: SET_ERROR, id, error }
    ),
    createModule: (title: string, sourceId: string, directoryId?: string) =>
    async (dispatch) => {
      try {
        await dispatch(entityActions.create({ title, directoryId, sourceId }));
      } catch (e) {
        if (e.response) {
          const maxModuleError = e.response.data.errors.source_id;
          if (maxModuleError) {
            dispatch(notificationActions.addNotification('Error while creating module', maxModuleError[0], 'error'));
          }
        }
      }
    },
    renameModule: (id: string, title: string) => async (dispatch, getState) => {
      const module = singleModuleSelector(getState(), { id });
      if (module.title !== title) {
        try {
          await dispatch(entityActions.updateById(id, { title: module.title }, { title }));
        } catch (e) {
          if (e.response && e.response.data.errors.title) {
            const errorMessage = e.response.data.errors.title;
            dispatch(notificationActions.addNotification('Error while renaming', errorMessage, 'error'));
          } else {
            dispatch(notificationActions.addNotification('Error while renaming', 'Could not connect', 'error'));
          }
        }
      }
    },
    moveToDirectory: (id: string, directoryId: string) => async (dispatch, getState) => {
      const module = singleModuleSelector(getState(), { id });
      if (module.directoryId !== directoryId) {
        try {
          const oldData = { directoryId: module.directoryId };
          const newData = { directoryId };
          await dispatch(entityActions.updateById(id, oldData, newData));
        } catch (e) {
          if (e.response && e.response.data.errors.title) {
            const errorMessage = e.response.data.errors.title;
            dispatch(notificationActions.addNotification('Error while moving to directory', errorMessage, 'error'));
          }
        }
      }
    },
    saveCode: (id: string) => async (dispatch, getState) => {
      const module = singleModuleSelector(getState(), { id });
      if (module.isNotSynced) {
        dispatch({ type: SAVE_CODE, id });

        const revertData = { isNotSynced: module.isNotSynced };
        const newData = { code: module.code, type: module.type };
        try {
          await dispatch(entityActions.updateById(id, revertData, newData));
        } catch (e) {
          const errorMessage = 'There was an error while saving your code, please try again later.';
          dispatch(notificationActions.addNotification('Error while saving', errorMessage, 'error'));
        }
      }
    },
    saveAllModules: (sandboxId: string) => async (dispatch, getState) => {
      const modules = modulesBySandboxSelector(getState(), { id: sandboxId });
      dispatch({ type: SAVE_ALL_MODULES, sandboxId });

      modules.filter(m => m.isNotSynced).forEach(m => dispatch(customActions.saveCode(m.id)));
    },
    deleteModule: (id: string) => async (dispatch) => {
      try {
        await dispatch(entityActions.delete(id));
        dispatch(notificationActions.addNotification('Success', 'Succesfully deleted the module', 'notice'));
      } catch (e) {
        const errorMessage = 'There was an error while deleting the module, please try again later.';
        dispatch(notificationActions.addNotification('Error while deleting', errorMessage, 'error'));
      }
    },
  };
  return { ...entityActions, ...customActions };
};
