// @flow
import type { Schema } from 'normalizr';

import createEntityActions, { getEntity } from '../../actions/entities';

export const GET_SANDBOX_BY_USERNAME_AND_SLUG = 'GET_SANDBOX_BY_USERNAME_AND_SLUG';
export const GET_SANDBOX_BY_USERNAME_AND_SLUG_SUCCESS = 'GET_SANDBOX_BY_USERNAME_AND_SLUG_SUCCESS';
export const GET_SANDBOX_BY_USERNAME_AND_SLUG_FAILURE = 'GET_SANDBOX_BY_USERNAME_AND_SLUG_FAILURE';

export default (schema: Schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    getByUserAndSlug: (username: string, slug: string) => async (dispatch) => {
      dispatch({
        type: GET_SANDBOX_BY_USERNAME_AND_SLUG,
        username,
        slug,
      });
      const url = `users/${username}/sandbox/${slug}`;
      const normalizedResult = await getEntity(url, schema);
      dispatch({
        type: GET_SANDBOX_BY_USERNAME_AND_SLUG_SUCCESS,
        username,
        slug,
        ...normalizedResult,
      });
    },
  };
  return { ...entityActions, ...customActions };
};
