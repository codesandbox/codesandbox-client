// @flow
import * as React from 'react';
import { signInUrl } from 'app/utils/url-generator';
import { identify } from 'app/utils/analytics';

import SignOutNotice from 'app/containers/modals/SignOutNotice';

import { createAPIActions, doRequest } from '../api/actions';
import notifActions from '../notifications/actions';
import modalActions from '../modal/actions';

import openPopup from './utils/popup';
import { resetJwt, setJwt } from './utils/jwt';
import { jwtSelector, badgesSelector } from './selectors';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_SUCCESFULL = 'SIGN_IN_SUCCESFULL';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_USER_SANDBOXES = 'SET_USER_SANDBOXES';
export const SET_BADGE_VISIBILITY = 'SET_BADGE_VISIBILITY';

export const SIGN_OUT_API = createAPIActions('SIGN_OUT_API', 'DELETE');
export const GET_CURRENT_USER_API = createAPIActions('CURRENT_USER', 'FETCH');
export const UPDATE_CURRENT_USER_API = createAPIActions(
  'CURRENT_USER',
  'UPDATE'
);
export const LOAD_USER_SANDBOXES = createAPIActions(
  'CURRENT_USER',
  'FETCH_SANDBOXES'
);
export const SEND_FEEDBACK_API = createAPIActions('FEEDBACK', 'SEND');
export const GET_AUTH_TOKEN_API = createAPIActions('AUTH_TOKEN', 'FETCH');

export const CREATE_SUBSCRIPTION_API = createAPIActions(
  'SUBSCRIPTION',
  'CREATE'
);
export const UPDATE_SUBSCRIPTION_API = createAPIActions(
  'SUBSCRIPTION',
  'UPDATE'
);
export const CANCEL_SUBSCRIPTION_API = createAPIActions(
  'SUBSCRIPTION',
  'CANCEL'
);
export const FETCH_PAYMENT_DETAILS = createAPIActions(
  'PAYMENT_DETAILS',
  'FETCH'
);
export const UPDATE_PAYMENT_DETAILS = createAPIActions(
  'PAYMENT_DETAILS',
  'UPDATE'
);
export const UPDATE_BADGE_INFO = createAPIActions('BADGE', 'UPDATE');

const signOut = (apiRequest = true) => async (dispatch: Function) => {
  if (apiRequest) {
    await dispatch(
      doRequest(SIGN_OUT_API, 'users/signout', {
        method: 'DELETE',
      })
    );
  }

  await resetJwt();

  dispatch({
    type: SIGN_OUT,
  });
};

// eslint-disable-next-line consistent-return
const getCurrentUser = () => async (dispatch: Function, getState: Function) => {
  const jwt = jwtSelector(getState());
  if (jwt) {
    try {
      const { data } = await dispatch(
        doRequest(GET_CURRENT_USER_API, `users/current`)
      );

      identify(data);

      dispatch({ type: SET_CURRENT_USER, data });
      return data;
    } catch (e) {
      if (e.response.status === 401) {
        dispatch(
          modalActions.openModal({ Body: <SignOutNotice />, width: 500 })
        );
        await dispatch(signOut(false));
      }
      return null;
    }
  }
};

const signIn = () => (dispatch: Function) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SIGN_IN,
    });
    const popup = openPopup(signInUrl(), 'sign in');

    window.addEventListener('message', function onMessage(e) {
      if (e.data.type === 'signin') {
        const jwt = e.data.data.jwt;
        setJwt(jwt);
        window.removeEventListener('message', this);
        popup.close();

        if (jwt) {
          dispatch({
            type: SIGN_IN_SUCCESFULL,
            jwt,
          });
          resolve(dispatch(getCurrentUser()));
        } else {
          reject();
        }
      }
    });
  });

const getAuthToken = () => async (dispatch: Function): string => {
  const { data } = await dispatch(
    doRequest(GET_AUTH_TOKEN_API, 'auth/auth-token')
  );

  return data.token;
};

const loadUserSandboxes = () => async (dispatch: Function) => {
  const { data } = await dispatch(doRequest(LOAD_USER_SANDBOXES, `sandboxes`));

  dispatch({
    type: SET_USER_SANDBOXES,
    data,
  });
};

const sendFeedback = (message: string) => async (dispatch: Function) => {
  await dispatch(
    doRequest(SEND_FEEDBACK_API, 'feedbacks', {
      method: 'POST',
      body: {
        feedback: {
          feedback: message,
          url: window.location.href,
        },
      },
    })
  );

  dispatch(
    notifActions.addNotification('Thanks a lot for your feedback!', 'success')
  );
};

const createSubscription = (token: string, amount: number) => async (
  dispatch: Function
) => {
  await dispatch(
    doRequest(CREATE_SUBSCRIPTION_API, 'users/current_user/subscription', {
      method: 'POST',
      body: {
        subscription: {
          amount,
          token,
        },
      },
    })
  );

  dispatch(
    notifActions.addNotification(
      'Thank you very much for your support!',
      'success'
    )
  );
};

const updateSubscription = (amount: number) => async (dispatch: Function) => {
  await dispatch(
    doRequest(UPDATE_SUBSCRIPTION_API, 'users/current_user/subscription', {
      method: 'PATCH',
      body: {
        subscription: {
          amount,
        },
      },
    })
  );

  dispatch(
    notifActions.addNotification('Succesfully updated subscription', 'success')
  );
};

const cancelSubscription = () => async (dispatch: Function) => {
  await dispatch(
    doRequest(CANCEL_SUBSCRIPTION_API, 'users/current_user/subscription', {
      method: 'DELETE',
    })
  );
};

const getPaymentDetails = () => async (dispatch: Function) =>
  dispatch(
    doRequest(FETCH_PAYMENT_DETAILS, 'users/current_user/payment_details')
  );

const updatePaymentDetails = (token: string) => async (dispatch: Function) =>
  dispatch(
    doRequest(UPDATE_PAYMENT_DETAILS, 'users/current_user/payment_details', {
      method: 'PATCH',
      body: {
        paymentDetails: {
          token,
        },
      },
    })
  );

const setBadgeVisibility = (badgeId: string, visible: boolean) => async (
  dispatch: Function,
  getState: Function
) => {
  const oldVisibility = badgesSelector(getState()).find(b => b.id === badgeId)
    .visible;
  dispatch({
    type: SET_BADGE_VISIBILITY,
    id: badgeId,
    visible,
  });
  try {
    const result = await dispatch(
      doRequest(UPDATE_BADGE_INFO, `users/current_user/badges/${badgeId}`, {
        method: 'PATCH',
        body: {
          badge: {
            visible,
          },
        },
      })
    );
    return result;
  } catch (e) {
    console.error(e);
    dispatch({
      type: SET_BADGE_VISIBILITY,
      id: badgeId,
      visibility: oldVisibility,
    });
    return null;
  }
};

export default {
  createSubscription,
  updateSubscription,
  cancelSubscription,
  getPaymentDetails,
  updatePaymentDetails,
  getAuthToken,
  signOut,
  signIn,
  getCurrentUser,
  loadUserSandboxes,
  sendFeedback,
  setBadgeVisibility,
};
