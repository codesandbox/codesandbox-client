import { combineReducers } from 'redux';

import * as entities from './';
import { ADD_ENTITIES } from './actions';
import _debug from '../../utils/debug';

import sandboxReducer from './sandboxes/reducer';
import moduleReducer from './sandboxes/modules/reducer';
import directoryReducer from './sandboxes/directories/reducer';

const d = _debug('cw:app:store:reducers:entities');

const entityReducers = {
  sandboxes: sandboxReducer,
  modules: moduleReducer,
  directories: directoryReducer,
};

/**
 * Generates a reducer which will handle all entity requests.
 * @param  {Entity} entity    Entity which should be handled
 * @return {state}            New state
 */
const createEntityReducer = key => (state = {}, action) => {
  const entityReducer = entityReducers[key];
  // If there is no reducer we should use a placeholder
  const reducer = entityReducer || ((_state = {} || {}) => _state);

  let newState = state;
  if (action.type === ADD_ENTITIES) {
    const data = action.entities[key];

    if (!data) return reducer(state, action);
    newState = { ...state, ...data };
  }

  return reducer(newState, action);
};

d(
  `Generating entity reducers for these entities: ${Object.keys(entities.default)}`,
);
const reducers = Object.keys(entities.default).reduce((total, next) => {
  const entity = entities.default[next];
  return {
    ...total,
    [next]: createEntityReducer(next, entity),
  };
}, {});
d('Generated entity reducers');
export default combineReducers(reducers);
