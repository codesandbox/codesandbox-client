import createEntityActions, { getEntity } from '../../actions/entities';

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
  };
  return { ...customActions, ...entityActions };
};
