// @flow
import type { Module } from 'common/types';
import { isEqual, mapValues } from 'lodash';

import {
  RENAME_MODULE,
  MOVE_MODULE,
  SET_CODE,
  SET_MODULE_SYNCED,
  SET_MODULE_ERROR,
  CLEAR_MODULE_ERRORS,
} from './actions';

function moduleReducer(module: Module, action): Module {
  switch (action.type) {
    case RENAME_MODULE:
      return { ...module, title: action.title };
    case MOVE_MODULE:
      return { ...module, directoryShortid: action.directoryShortid };
    case SET_CODE:
      return { ...module, code: action.code, isNotSynced: true };
    case SET_MODULE_SYNCED:
      return { ...module, isNotSynced: false };
    case SET_MODULE_ERROR: {
      if (!isEqual(action.error, module.errors[0])) {
        return { ...module, errors: [...module.errors, action.error] };
      }

      return module;
    }
    default:
      return module;
  }
}

type State = {
  [id: string]: Module,
};

export default function reducer(
  state: State,
  action: { type: string, id: string, [key: string]: any },
): State {
  switch (action.type) {
    case RENAME_MODULE:
    case MOVE_MODULE:
    case SET_CODE:
    case SET_MODULE_SYNCED:
    case SET_MODULE_ERROR: {
      const module = state[action.id];
      if (module) {
        return {
          ...state,
          [action.id]: moduleReducer(module, action),
        };
      }
      return state;
    }
    case CLEAR_MODULE_ERRORS: {
      return mapValues(state, m => ({ ...m, errors: [] }));
    }
    default:
      return state;
  }
}
