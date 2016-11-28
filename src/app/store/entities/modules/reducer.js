// @flow
import type { Module } from './';

import findType from '../../../utils/find-type';

import { CHANGE_CODE, RENAME_MODULE } from './actions';

type State = {
  [id: string]: Module;
};

const initialState: State = {};

const moduleReducer = (state: Module, action: Object): Module => {
  switch (action.type) {
    case CHANGE_CODE:
      return {
        ...state,
        code: action.code,
        type: findType(action.code),
      };
    case RENAME_MODULE:
      return {
        ...state,
        title: action.title,
      };
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case CHANGE_CODE:
    case RENAME_MODULE:
      return {
        ...state,
        [action.id]: moduleReducer(state[action.id], action),
      };
    default:
      return state;
  }
};
