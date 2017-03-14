// @flow

import apiRequest from '../services/api';
import type { BodyType } from '../services/api';

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

export function doRequest(
  actions: APIActions,
  endpoint: string,
  body?: BodyType,
) {
  return async (dispatch: Function) => {
    dispatch({
      type: actions.REQUEST,
      endpoint,
      body,
    });

    try {
      const data = await apiRequest(endpoint, body);

      dispatch({
        type: actions.SUCCESS,
        data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: actions.FAILURE,
        error,
      });

      throw error;
    }
  };
}
