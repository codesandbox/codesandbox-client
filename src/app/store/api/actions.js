// @flow
import { values } from 'lodash';

import sendError from 'app/utils/error';
import notificationActions from '../notifications/actions';
import apiRequest from '../services/api';
import type { BodyType } from '../services/api';
import { jwtSelector } from '../user/selectors';

type APIActions = {
  REQUEST: string,
  SUCCESS: string,
  FAILURE: string,
};

export function createAPIActions(prefix: string, suffix: string): APIActions {
  const PREFIX = prefix.toUpperCase();
  const SUFFIX = suffix.toUpperCase();
  return {
    REQUEST: `${PREFIX}/${SUFFIX}_REQUEST`,
    SUCCESS: `${PREFIX}/${SUFFIX}_SUCCESS`,
    FAILURE: `${PREFIX}/${SUFFIX}_FAILURE`,
  };
}

const getMessage = (error: Error & { response: ?Object }) => {
  const response = error.response;

  if (!response || response.status >= 500) {
    sendError(error);
  }

  if (response && response.data && response.data.errors) {
    const errors = values(response.data.errors)[0];
    if (Array.isArray(errors)) {
      if (errors[0]) {
        return errors[0];
      }
    } else {
      return errors;
    }
  }

  return error.message;
};

const showError = error => dispatch => {
  dispatch(notificationActions.addNotification(getMessage(error), 'error'));
};

export function doRequest(
  actions: APIActions,
  endpoint: string,
  body?: BodyType,
) {
  return async (dispatch: Function, getState: Function) => {
    const jwt = jwtSelector(getState());
    dispatch({
      type: actions.REQUEST,
      endpoint,
      body,
      jwt,
      meta: body ? body.body : null,
    });

    try {
      const data = await apiRequest(endpoint, jwt, body);

      dispatch({
        type: actions.SUCCESS,
        data,
        meta: body ? body.body : null,
      });

      return data;
    } catch (error) {
      dispatch({
        type: actions.FAILURE,
        error,
        meta: body ? body.body : null,
      });

      dispatch(showError(error));

      throw error;
    }
  };
}
