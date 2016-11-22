import { combineReducers } from 'redux';
import { mapValues } from 'lodash';

import * as entities from '../entities';
import _debug from '../../utils/debug';

const d = _debug('store:reducers:entities');

/**
 * Generates a reducer which will handle all entity requests.
 * @param  {Entity} entity    Entity which should be handled
 * @return {state}            New state
 */
const createEntityReducer = entity =>
  (state = entity.initialState, action) => {
    // If there is no reducer we should use a placeholder
    const reducer = entity.reducer || ((_state = entity.initialState || {}) => _state);

    let newState = state;
    if (action.entities) {
      const data = action.entities[entity.schema.getKey()];

      if (!data) return reducer(state, action);

      const recordData = mapValues(data, (obj) => {
        const object = new entity.Record(obj);
        if (entity.afterReceiveReducer) {
          return entity.afterReceiveReducer(object, state);
        }
        return object;
      });
      newState = state.mergeWith((prev, next) => (
        entity.shouldOverwrite ? entity.shouldOverwrite(prev, next) : next
      ), recordData);
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
