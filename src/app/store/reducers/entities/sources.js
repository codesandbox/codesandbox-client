// @flow
import { omit } from 'lodash';

import type { Source } from './';
import * as actions from './actions';


type State = {
  [id: string]: Source;
};

const initialState: State = {};

const sourceReducer = (state: Source, action: Object): ?Source => {
  switch (action.type) {
    case actions.FETCH_SOURCE_BUNDLE:
      return {
        ...state,
        bundle: {
          processing: true,
        },
      };
    case actions.FETCH_SOURCE_BUNDLE_SUCCESS:
      return {
        ...state,
        bundle: {
          processing: false,
          manifest: action.manifest,
          hash: action.hash,
          url: action.url,
        },
      };
    case actions.FETCH_SOURCE_BUNDLE_FAILURE:
      return {
        ...state,
        bundle: {
          processing: false,
          error: action.error || 'Unknown error',
        },
      };
    case actions.ADD_NPM_DEPENDENCY:
      return {
        ...state,
        bundle: {},
        npmDependencies: {
          ...state.npmDependencies,
          [action.name]: action.version,
        },
      };
    case actions.REMOVE_NPM_DEPENDENCY: {
      return {
        ...state,
        bundle: {},
        npmDependencies: omit(state.npmDependencies, action.name),
      };
    }
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case actions.FETCH_SOURCE_BUNDLE:
    case actions.FETCH_SOURCE_BUNDLE_SUCCESS:
    case actions.FETCH_SOURCE_BUNDLE_FAILURE:
    case actions.ADD_NPM_DEPENDENCY:
    case actions.REMOVE_NPM_DEPENDENCY:
      return {
        ...state,
        [action.id]: sourceReducer(state[action.id], action),
      };
    default:
      return state;
  }
};
