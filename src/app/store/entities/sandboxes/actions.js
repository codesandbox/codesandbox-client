// @flow
import type { Schema } from 'normalizr';
import { decamelizeKeys } from 'humps';

import createEntityActions, { getEntity } from '../../actions/entities';
import notificationActions from '../../actions/notifications';
import { singleSandboxSelector } from './selector';
import { singleSourceSelector } from '../sources/selector';

export const GET_SANDBOX_BY_USERNAME_AND_SLUG = 'GET_SANDBOX_BY_USERNAME_AND_SLUG';
export const GET_SANDBOX_BY_USERNAME_AND_SLUG_SUCCESS = 'GET_SANDBOX_BY_USERNAME_AND_SLUG_SUCCESS';
export const GET_SANDBOX_BY_USERNAME_AND_SLUG_FAILURE = 'GET_SANDBOX_BY_USERNAME_AND_SLUG_FAILURE';

export const FORK_SANDBOX = 'FORK_SANDBOX';
export const FORK_SANDBOX_SUCCESS = 'FORK_SANDBOX_SUCCESS';
export const FORK_SANDBOX_FAILURE = 'FORK_SANDBOX_FAILURE';


export const CLEAR_SOURCE_DEPENDENCIES = 'CLEAR_SOURCE_DEPENDENCIES';

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

    renameSandbox: (id: string, title: string) => async (dispatch, getState) => {
      const sandbox = singleSandboxSelector(getState(), { id });

      if (sandbox && sandbox.title !== title) {
        const reverseData = { title: sandbox.title };
        const newData = { title };

        dispatch(entityActions.updateById(id, reverseData, newData));
      }
    },

    createSandbox: (title: string, preset: string = '') => async (dispatch) => {
      try {
        const result = await dispatch(entityActions.create({ title, fork_id: preset || null }));
        return result;
      } catch (e) {
        dispatch(notificationActions.addNotification('There was a problem creating the sandbox', 'Please try again', 'error'));
        return e;
      }
    },

    forkSandbox: (id: string) => async (dispatch) => {
      try {
        dispatch({
          type: FORK_SANDBOX,
          id,
        });

        const url = `sandboxes/${id}/fork`;
        const normalizedResult = await getEntity(url, schema, null, { method: 'POST' });

        dispatch({ type: FORK_SANDBOX_SUCCESS, ...normalizedResult });
        return normalizedResult;
      } catch (e) {
        dispatch(notificationActions.addNotification('There was a problem forking the sandbox', 'Please try again', 'error'));
        dispatch({ type: FORK_SANDBOX_FAILURE });
        return e;
      }
    },

    commitDependencies: (id: string) => async (dispatch, getState) => {
      try {
        const sourceId = singleSandboxSelector(getState(), { id }).source;
        const source = singleSourceSelector(getState(), { id: sourceId });
        const dependencies = decamelizeKeys(source.npmDependencies, { separator: '-' });

        const oldData = { npmDependencies: dependencies };
        const newData = { npmDependencies: dependencies };
        await dispatch(entityActions.updateById(id, oldData, newData, [], `sandboxes/${id}/set_dependencies`));

        dispatch({ type: CLEAR_SOURCE_DEPENDENCIES, id: sourceId });
      } catch (e) {
        console.error(e);
        dispatch(notificationActions.addNotification('Could not commit dependencies', 'Please try again', 'error'));
      }
    },
  };
  return { ...entityActions, ...customActions };
};
