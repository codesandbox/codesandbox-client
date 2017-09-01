// @flow
import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';

import userEntity from './entity';

export const FETCH_USER_ACTIONS = createAPIActions('USERS', 'FETCH');
export const FETCH_USER_SANDBOXES_ACTIONS = createAPIActions(
  'USERS_SANDBOXES',
  'FETCH'
);
export const FETCH_USER_LIKED_SANDBOXES_ACTIONS = createAPIActions(
  'USERS_LIKED_SANDBOXES',
  'FETCH'
);
export const UPDATE_USER_ACTIONS = createAPIActions('USERS', 'UPDATE');

const fetchUser = (username: string) => async (dispatch: Function) => {
  const { data } = await dispatch(
    doRequest(FETCH_USER_ACTIONS, `users/${username}`)
  );

  await dispatch(normalizeResult(userEntity, data));
};

const updateUser = (username: string, user: Object) => async (
  dispatch: Function
) => {
  const { data } = await dispatch(
    doRequest(UPDATE_USER_ACTIONS, `users/${username}`, {
      method: 'PATCH',
      body: {
        user,
      },
    })
  );

  await dispatch(normalizeResult(userEntity, data));
};

const fetchAllSandboxes = (username: string, page: number = 1) => async (
  dispatch: Function
) => {
  await dispatch(
    doRequest(FETCH_USER_SANDBOXES_ACTIONS, `users/${username}/sandboxes`, {
      body: {
        username,
        page,
      },
    })
  );
};

const fetchLikedSandboxes = (username: string, page: number = 1) => async (
  dispatch: Function
) => {
  await dispatch(
    doRequest(
      FETCH_USER_LIKED_SANDBOXES_ACTIONS,
      `users/${username}/sandboxes/liked`,
      {
        body: {
          username,
          page,
        },
      }
    )
  );
};

const setShowcasedSandboxId = (username: string, showcasedSandboxId: string) =>
  updateUser(username, { showcasedSandboxShortid: showcasedSandboxId });

export default {
  fetchUser,
  updateUser,
  fetchAllSandboxes,
  setShowcasedSandboxId,
  fetchLikedSandboxes,
};
