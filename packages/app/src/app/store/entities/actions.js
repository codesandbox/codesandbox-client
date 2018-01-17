// @flow

import { schema, normalize } from 'normalizr';

export const ADD_ENTITIES = 'ADD_ENTITIES';

export function normalizeResult(entity: schema.Entity, result: Object) {
  return async (dispatch: Function) => {
    const normalizedResult = normalize(result, entity);

    dispatch({
      type: ADD_ENTITIES,
      ...normalizedResult,
    });
  };
}
