// @flow
import { normalize } from 'normalizr';
import type { Entity } from '../entities';

import callApi from '../services/api';

const processEntity = (schema: typeof Schema, result: { entities: Object }) => {
  const normalizedResult = normalize(result, schema);
  return normalizedResult;
};

export default (schema: typeof Schema) => {
  const key = schema.getKey();
  const KEY = key.toUpperCase();

  return {
    getById: (id: string, body: ?Object = null) => async (dispatch: Function) => {
      dispatch({ type: `REQUEST_SINGLE_${KEY}`, id });

      const result = await callApi(`${key}/${id}`, { body });
      const normalizedResult = processEntity(schema, result);

      dispatch({ type: `REQUEST_SINGLE_${KEY}_SUCCESS`, id, ...normalizedResult });
    },

    // create: params => async (dispatch: Function) => {
    //   dispatch({ type: `CREATE_SINGLE_${KEY}`, id });
    // },

    updateById: (id: string, newData: Object) => async (dispatch: Function) => {
      dispatch({ type: `UPDATE_SINGLE_${KEY}`, id, newData });

      await callApi(`${key}/${id}`, {
        method: 'PATCH',
        body: { data: newData },
      });

      dispatch({ type: `UPDATE_SINGLE_${KEY}_SUCCESS`, id, newData });
    },
  };
};
