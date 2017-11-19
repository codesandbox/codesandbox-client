// @flow
import type { Directory } from 'common/types';
import { RENAME_DIRECTORY, MOVE_DIRECTORY } from './actions';

function directoryReducer(directory: Directory, action) {
  switch (action.type) {
    case RENAME_DIRECTORY:
      return { ...directory, title: action.title };
    case MOVE_DIRECTORY:
      return { ...directory, directoryShortid: action.directoryShortid };
    default:
      return directory;
  }
}

type State = {
  [id: string]: Directory,
};

export default function reducer(
  state: State,
  action: { type: string, [key: string]: any }
): State {
  switch (action.type) {
    case RENAME_DIRECTORY:
    case MOVE_DIRECTORY:
      if (state[action.id]) {
        return {
          ...state,
          [action.id]: directoryReducer(state[action.id], action),
        };
      }
      return state;
    default:
      return state;
  }
}
