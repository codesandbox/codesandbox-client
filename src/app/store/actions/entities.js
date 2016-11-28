// @flow
import { normalize } from 'normalizr';
import type { Entity } from '../entities';

import callApi from '../services/api';

const processEntity = (schema: typeof Schema, result: { entities: Object }) => {
  const normalizedResult = normalize(result, schema);
  return normalizedResult;
};

export const getKeys = (schema: Schema) => {
  const KEY = schema.getKey().toUpperCase();
  const keys = {
    get: `REQUEST_SINGLE_${KEY}`,
    update: `UPDATE_SINGLE_${KEY}`,
  };

  return Object.keys(keys).reduce((prev, next) => ({
    ...prev,
    [next]: {
      request: keys[next],
      failure: `${keys[next]}_FAILURE`,
      success: `${keys[next]}_SUCCESS`,
    },
  }), {});
};

export default (schema: typeof Schema) => {
  const key = schema.getKey();
  const actionKeys = getKeys(schema);
  return {
    getById: (id: string, body: ?Object = null) => async (dispatch: Function) => {
      const keys = actionKeys.get;
      dispatch({ type: keys.request, id });

      const result = await callApi(`${key}/${id}`, { body });
      const normalizedResult = processEntity(schema, result);

      dispatch({ type: keys.success, id, ...normalizedResult });
    },

    // create: params => async (dispatch: Function) => {
    //   dispatch({ type: `CREATE_SINGLE_${KEY}`, id });
    // },

    updateById: (id: string, oldData: Object, newData: Object) => async (dispatch: Function) => {
      const keys = actionKeys.update;
      dispatch({ type: keys.request, id, newData });

      try {
        await callApi(`${key}/${id}`, {
          method: 'PATCH',
          body: { data: newData },
        });

        dispatch({ type: keys.success, id, newData });
      } catch (e) {
        dispatch({ type: keys.failure, id, oldData });
      }
    },
  };
};
