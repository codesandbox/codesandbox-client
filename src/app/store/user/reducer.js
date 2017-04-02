import getJwt from './utils/jwt';
import { SIGN_IN_SUCCESFULL, SIGN_OUT, SET_CURRENT_USER } from './actions';

export type User = {
  id: ?string,
  email: ?string,
  name: ?string,
  username: ?string,
  avatar_url: ?string,
  jwt: ?string,
};

const initialState: User = {
  id: null,
  email: null,
  name: null,
  username: null,
  avatarUrl: null,
  jwt: getJwt(),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_SUCCESFULL:
      return {
        ...state,
        jwt: action.jwt,
      };
    case SIGN_OUT:
      return {
        ...state,
        jwt: null,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        ...action.data,
      };
    default: {
      return state;
    }
  }
};
