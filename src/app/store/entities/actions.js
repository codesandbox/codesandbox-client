// @flow

import { schema, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';

export const ADD_ENTITIES = 'ADD_ENTITIES';

export function normalizeResult(entity: schema.Entity, result: Object) {
  return async (dispatch: Function) => {
    const normalizedResult = normalize(camelizeKeys(result), entity);

    dispatch({
      type: ADD_ENTITIES,
      ...normalizedResult,
    });
  };
}
