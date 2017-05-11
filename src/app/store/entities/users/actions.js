// @flow
import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';

import userEntity from './entity';

export const FETCH_USER_ACTIONS = createAPIActions('USERS', 'FETCH');
export const UPDATE_USER_ACTIONS = createAPIActions('USERS', 'UPDATE');

const fetchUser = (username: string) => async (dispatch: Function) => {
  const { data } = await dispatch(
    doRequest(FETCH_USER_ACTIONS, `users/${username}`),
  );

  await dispatch(normalizeResult(userEntity, data));
};

const updateUser = (username: string, user: Object) => async (
  dispatch: Function,
) => {
  const { data } = await dispatch(
    doRequest(UPDATE_USER_ACTIONS, `users/${username}`, {
      method: 'PATCH',
      body: {
        user,
      },
    }),
  );

  await dispatch(normalizeResult(userEntity, data));
};

const setShowcasedSandboxId = (username: string, showcasedSandboxId: string) =>
  updateUser(username, { showcasedSandboxShortid: showcasedSandboxId });

export default {
  fetchUser,
  updateUser,
  setShowcasedSandboxId,
};
