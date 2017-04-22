import { mapValues } from 'lodash';
import {
  RENAME_MODULE,
  MOVE_MODULE,
  SET_CODE,
  SET_MODULE_SYNCED,
  SET_MODULE_ERROR,
  CLEAR_ERRORS,
} from './actions';

function moduleReducer(module, action) {
  switch (action.type) {
    case RENAME_MODULE:
      return { ...module, title: action.title };
    case MOVE_MODULE:
      return { ...module, directoryShortid: action.directoryShortid };
    case SET_CODE:
      return { ...module, code: action.code, isNotSynced: true };
    case SET_MODULE_SYNCED:
      return { ...module, isNotSynced: false };
    case SET_MODULE_ERROR:
      // Don't let errors overwrite eachother, because the first error is probably the cause for the second one'
      return module.error ? module : { ...module, error: action.error };
    default:
      return module;
  }
}

function shouldUpdate(module, action) {
  switch (action.type) {
    case SET_MODULE_ERROR:
      return (
        (action.error == null && module.error) ||
        (action.error != null && module.error == null) ||
        (action.error != null &&
          module.error != null &&
          (action.error.line !== module.error.line ||
            action.error.title !== module.error.title ||
            action.error.column !== module.error.column ||
            action.error.message !== module.error.message ||
            action.error.type !== module.error.type))
      );

    default:
      return true;
  }
}

export default function reducer(state: {}, action) {
  switch (action.type) {
    case RENAME_MODULE:
    case MOVE_MODULE:
    case SET_CODE:
    case SET_MODULE_SYNCED:
    case SET_MODULE_ERROR: {
      const module = state[action.id];
      if (module && shouldUpdate(module, action)) {
        return {
          ...state,
          [action.id]: moduleReducer(module, action),
        };
      }
      return state;
    }
    case CLEAR_ERRORS:
      // if there are errors
      if (Object.keys(state).some(id => state[id].error)) {
        return mapValues(state, m => ({ ...m, error: null }));
      }
      return state;
    default:
      return state;
  }
}
