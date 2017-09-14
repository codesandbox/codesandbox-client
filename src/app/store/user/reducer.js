// @flow
import type { CurrentUser } from 'common/types';
import getJwt from './utils/jwt';
import {
  SIGN_IN_SUCCESFULL,
  SIGN_OUT,
  SET_CURRENT_USER,
  SET_USER_SANDBOXES,
  CREATE_SUBSCRIPTION_API,
  UPDATE_SUBSCRIPTION_API,
  CANCEL_SUBSCRIPTION_API,
  SET_BADGE_VISIBILITY,
  SET_ZEIT_USER_INFO,
  SIGN_OUT_ZEIT,
  SIGN_IN_ZEIT,
} from './actions';

const initialState: CurrentUser = {
  id: null,
  email: null,
  name: null,
  username: null,
  avatarUrl: null,
  jwt: getJwt(),
  subscription: null,
  badges: [],
  integrations: {},
};

export default (state: CurrentUser = initialState, action: Object) => {
  switch (action.type) {
    case SIGN_IN_SUCCESFULL:
      return {
        ...state,
        jwt: action.jwt,
      };
    case SIGN_OUT:
      return {
        ...initialState,
        jwt: null,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        ...action.data,

        integrations: action.data.integrations,
      };
    case SET_USER_SANDBOXES:
      return {
        ...state,
        sandboxes: action.data,
      };
    case SET_BADGE_VISIBILITY:
      return {
        ...state,
        badges: state.badges.map(b => ({
          ...b,
          visible: b.id === action.id ? action.visible : b.visible,
        })),
      };
    case SIGN_OUT_ZEIT.SUCCESS: {
      return {
        ...state,
        integrations: {
          ...state.integrations,
          zeit: null,
        },
      };
    }
    case SIGN_IN_ZEIT.SUCCESS: {
      return {
        ...state,
        ...action.data.data,
      };
    }
    case SET_ZEIT_USER_INFO:
      return {
        ...state,
        integrations: {
          ...state.integrations,
          zeit: {
            ...state.integrations.zeit,
            ...action.data,
          },
        },
      };
    case CREATE_SUBSCRIPTION_API.SUCCESS:
    case UPDATE_SUBSCRIPTION_API.SUCCESS:
    case CANCEL_SUBSCRIPTION_API.SUCCESS: {
      return {
        ...state,
        ...action.data.data,
      };
    }
    default: {
      return state;
    }
  }
};
