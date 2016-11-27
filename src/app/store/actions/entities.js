// @flow
import { normalize } from 'normalizr';
import type { Entity } from '../entities';

import callApi from '../services/api';

const processEntity = (entity: Entity, result: { entities: Object }) => {
  const normalizedResult = normalize(result, entity.schema);
  return normalizedResult;
};

export default (entity: Entity) => {
  const key = entity.schema.getKey();
  const KEY = key.toUpperCase();

  return {
    getById: (id: string) => async (dispatch: Function) => {
      dispatch({ type: `REQUEST_SINGLE_${KEY}`, id });

      const result = await callApi(`${key}/${id}`);
      const normalizedResult = processEntity(entity, result);

      dispatch({ type: `REQUEST_SINGLE_${KEY}_SUCCESS`, id, ...normalizedResult });
    },
  };
};
