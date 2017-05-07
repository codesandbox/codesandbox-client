// @flow
import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';

import userEntity from './entity';

const FETCH_USER_ACTIONS = createAPIActions('USERS', 'FETCH');

const fetchUser = (username: string) => async (dispatch: Function) => {
  const { data } = await dispatch(
    doRequest(FETCH_USER_ACTIONS, `users/${username}`),
  );

  await dispatch(normalizeResult(userEntity, data));
};

export default {
  fetchUser,
};
