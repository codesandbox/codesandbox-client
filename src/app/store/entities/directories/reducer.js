// @flow
import { omitBy } from 'lodash';
import { SET_DIRECTORY_OPEN, DELETE_ALL_DIRECTORIES_IN_DIRECTORY } from './actions';

import type { Directory } from './';

type State = {
  [id: string]: Directory;
};

const initialState: State = {};

const directoryReducer = (state: Directory, action: Object): ?Directory => {
  switch (action.type) {
    case SET_DIRECTORY_OPEN: {
      return {
        ...state,
        open: action.open,
      };
    }
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case SET_DIRECTORY_OPEN:
      return {
        ...state,
        [action.id]: directoryReducer(state[action.id], action),
      };
    case DELETE_ALL_DIRECTORIES_IN_DIRECTORY:
      return omitBy(state, dir => dir.directoryId === action.id);
    default:
      return state;
  }
};
