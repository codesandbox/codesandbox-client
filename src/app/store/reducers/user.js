// @flow
import { REQUEST_USER_SUCCESS } from '../actions/user';

export type User = {
  id: ?string;
  name: ?string;
  username: ?string;
  email: ?string;
};

type State = User;

const initialState: State = {
  id: null,
  name: null,
  username: null,
  email: null,
};

export default (state: State = initialState, action) => {
  switch (action.type) {
    case REQUEST_USER_SUCCESS:
      return action.data;
    default:
      return state;
  }
};
