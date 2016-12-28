import { singleDirectoryByIdSelector } from './selector';
import createEntityActions from '../../actions/entities';
import notificationActions from '../../actions/notifications';

export const SET_DIRECTORY_OPEN = 'SET_DIRECTORY_OPEN';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    setOpen: (id: string, open: boolean) => ({ type: SET_DIRECTORY_OPEN, id, open }),
    createDirectory: (title: string, sourceId: string, directoryId?: string) =>
    async (dispatch) => {
      try {
        await dispatch(entityActions.create({ title, directoryId, sourceId }));
      } catch (e) {
        if (e.response) {
          const maxModuleError = e.response.data.errors.sandbox_id;
          if (maxModuleError) {
            dispatch(notificationActions.addNotification('Error while creating directory', maxModuleError[0], 'error'));
          }
        }
      }
    },
    renameDirectory: (id: string, title: string) => async (dispatch, getState) => {
      const module = singleDirectoryByIdSelector(getState(), { id });
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
    deleteDirectory: (id: string) => async (dispatch) => {
      try {
        await dispatch(entityActions.delete(id));
        dispatch(notificationActions.addNotification('Success', 'Succesfully deleted the directory', 'notice'));
      } catch (e) {
        const errorMessage = 'There was an error while deleting the directory, please try again later.';
        dispatch(notificationActions.addNotification('Error while deleting', errorMessage, 'error'));
      }
    },
    moveToDirectory: (id: string, directoryId: string) => async (dispatch, getState) => {
      const directory = singleDirectoryByIdSelector(getState(), { id });
      if (directory.directoryId !== directoryId) {
        try {
          const oldData = { directoryId: directory.directoryId };
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
  };
  return { ...customActions, ...entityActions };
};
