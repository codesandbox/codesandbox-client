// @flow

import createEntityActions, { getEntity } from '../../actions/entities';

import notificationActions from '../../actions/notifications';

export const REQUEST_VERSIONS_BY_SANDBOX = 'REQUEST_VERSIONS_BY_SANDBOX';
export const REQUEST_VERSIONS_BY_SANDBOX_SUCCESS = 'REQUEST_VERSIONS_BY_SANDBOX_SUCCESS';
export const REQUEST_VERSIONS_BY_SANDBOX_FAILURE = 'REQUEST_VERSIONS_BY_SANDBOX_FAILURE';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    getVersionsBySandbox: ({ sandboxId }) => (dispatch) => {
      const url = `sandboxes/${sandboxId}/versions`;
      dispatch({ type: REQUEST_VERSIONS_BY_SANDBOX, sandboxId });

      try {
        getEntity(url, schema);
        dispatch({ type: REQUEST_VERSIONS_BY_SANDBOX_SUCCESS, sandboxId });
      } catch (e) {
        dispatch({ type: REQUEST_VERSIONS_BY_SANDBOX_FAILURE, sandboxId });
      }
    },

    publishVersion: (sandboxId, version) => async (dispatch) => {
      const url = `sandboxes/${sandboxId}/versions`;

      try {
        await dispatch(entityActions.create({ version }, url));
      } catch (e) {
        if (e.response && e.response.data && e.response.data.errors
          && e.response.data.errors.version) {
          const errorMessage = e.response.data.errors.version;
          dispatch(notificationActions.addNotification('Error while creating version', errorMessage, 'error'));
        } else {
          dispatch(notificationActions.addNotification('Error while creating version', e.message, 'error'));
        }
      }
    },
  };
  return { ...customActions, ...entityActions };
};
