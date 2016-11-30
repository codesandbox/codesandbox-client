import { combineReducers } from 'redux';
import { mapValues } from 'lodash';

import * as entities from '../entities';
import { getKeys } from '../actions/entities';
import _debug from '../../utils/debug';

const d = _debug('cs:store:reducers:entities');

/**
 * Generates a reducer which will handle all entity requests.
 * @param  {Entity} entity    Entity which should be handled
 * @return {state}            New state
 */
const createEntityReducer = entity =>
  (state = entity.initialState, action) => {
    const entityKeys = getKeys(entity.schema.getKey());
    // If there is no reducer we should use a placeholder
    const reducer = entity.reducer || ((_state = entity.initialState || {}) => _state);

    let newState = state;
    if (action.entities) {
      const data = action.entities[entity.schema.getKey()];

      if (!data) return reducer(state, action);

      const intermediateState = { ...state, ...data };
      const newEntities = mapValues(data, (obj) => {
        if (entity.afterReceiveReducer) {
          return entity.afterReceiveReducer(obj, intermediateState);
        }
        return obj;
      });
      newState = { ...state, ...newEntities };
    }

    if (action.type === entityKeys.update.request) {
      const updatedInfo = action.newData;

      newState = { ...newState, [action.id]: { ...newState[action.id], ...updatedInfo } };
    }

    if (action.type === entityKeys.update.failure) {
      const oldData = action.oldData;

      newState = { ...newState, [action.id]: { ...newState[action.id], ...oldData } };
    }

    if (action.type === entityKeys.create.success) {
      const { entity: newEntity } = action;
      newState = { ...newState, [newEntity.id]: newEntity };
    }

    return reducer(newState, action);
  };

d(`Generating entity reducers for these entities: ${Object.keys(entities.default)}`);
const reducers = Object.keys(entities.default).reduce((total, next) => {
  const entity = entities.default[next];
  return {
    ...total,
    [entity.schema.getKey()]: createEntityReducer(entity),
  };
}, {});
d('Generated entity reducers');
export default combineReducers(reducers);
