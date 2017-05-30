// @flow
import {
  RENAME_MODULE,
  MOVE_MODULE,
  SET_CODE,
  SET_MODULE_SYNCED,
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
    default:
      return module;
  }
}

export default function reducer(
  state: {},
  action: { type: string, id: string, [key: string]: any },
) {
  switch (action.type) {
    case RENAME_MODULE:
    case MOVE_MODULE:
    case SET_CODE:
    case SET_MODULE_SYNCED: {
      const module = state[action.id];
      if (module) {
        return {
          ...state,
          [action.id]: moduleReducer(module, action),
        };
      }
      return state;
    }
    default:
      return state;
  }
}
