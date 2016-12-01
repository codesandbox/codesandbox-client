// @flow
import type { Module } from './';

import findType from '../../../utils/find-type';

import {
  CHANGE_CODE,
  SET_ERROR,
  TOGGLE_MODULE_TREE_OPEN,
} from './actions';

type State = {
  [id: string]: Module;
};

const initialState: State = {};

const moduleReducer = (state: Module, action: Object): ?Module => {
  switch (action.type) {
    case CHANGE_CODE:
      return {
        ...state,
        code: action.code,
        type: findType(action.code),
      };
    case SET_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }
    case TOGGLE_MODULE_TREE_OPEN: {
      return {
        ...state,
        isTreeOpen: !state.isTreeOpen,
      };
    }
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case CHANGE_CODE:
    case TOGGLE_MODULE_TREE_OPEN:
    case SET_ERROR:
      return {
        ...state,
        [action.id]: moduleReducer(state[action.id], action),
      };
    default:
      return state;
  }
};
