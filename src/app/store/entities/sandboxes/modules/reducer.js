import { RENAME_MODULE, MOVE_MODULE } from './actions';

function moduleReducer(module, action) {
  switch (action.type) {
    case RENAME_MODULE:
      return { ...module, title: action.title };
    case MOVE_MODULE:
      return { ...module, directoryId: action.directoryId };
    default:
      return module;
  }
}

export default function reducer(state: {}, action) {
  switch (action.type) {
    case RENAME_MODULE:
    case MOVE_MODULE:
      if (state[action.id]) {
        return {
          ...state,
          [action.id]: moduleReducer(state[action.id], action),
        };
      }
      return state;
    default:
      return state;
  }
}
