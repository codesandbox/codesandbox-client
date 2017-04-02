// @flow
import { signInUrl } from 'app/utils/url-generator';

import { createAPIActions, doRequest } from '../api/actions';

import openPopup from './utils/popup';
import { jwtSelector } from './selectors';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_SUCCESFULL = 'SIGN_IN_SUCCESFULL';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const SIGN_OUT = 'SIGN_OUT';

export const GET_CURRENT_USER_API = createAPIActions('CURRENT_USER', 'FETCH');

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

const signOut = () => async (dispatch: Function) => {
  deleteCookie('jwt');

  dispatch({
    type: SIGN_OUT,
  });
};

const getCurrentUser = () => async (dispatch: Function, getState: Function) => {
  const jwt = jwtSelector(getState());
  if (jwt) {
    try {
      const { data } = await dispatch(
        doRequest(GET_CURRENT_USER_API, `users/current`)
      );

      dispatch({ type: SET_CURRENT_USER, data });
    } catch (e) {
      dispatch(signOut());
    }
  }
};

const signIn = () => async (dispatch: Function) => {
  dispatch({
    type: SIGN_IN,
  });
  const popup = openPopup(signInUrl(), 'sign in');

  window.addEventListener('message', function(e) {
    if (e.data.type === 'signin') {
      const jwt = e.data.data.jwt;
      window.removeEventListener('message', this);
      popup.close();

      if (jwt) {
        dispatch({
          type: SIGN_IN_SUCCESFULL,
          jwt,
        });

        dispatch(getCurrentUser());
      }
    }
  });
};

export default {
  signOut,
  signIn,
  getCurrentUser,
};
