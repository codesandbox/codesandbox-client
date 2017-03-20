import {
  ADD_MODULE_TO_SANDBOX,
  ADD_DIRECTORY_TO_SANDBOX,
  REMOVE_MODULE_FROM_SANDBOX,
  REMOVE_DIRECTORY_FROM_SANDBOX,
  SET_NPM_DEPENDENCIES,
  SET_CURRENT_MODULE,
  SET_BUNDLE,
  FETCH_BUNDLE_API_ACTIONS,
} from './actions';

const initialState = {};

type Action = {
  [key: string]: any,
  type: string,
};

function singleSandboxReducer(sandbox, action: Action) {
  switch (action.type) {
    case SET_CURRENT_MODULE:
      return { ...sandbox, currentModule: action.moduleId };
    case ADD_MODULE_TO_SANDBOX:
      return { ...sandbox, modules: [...sandbox.modules, action.moduleId] };
    case ADD_DIRECTORY_TO_SANDBOX:
      return {
        ...sandbox,
        directories: [...sandbox.directories, action.directoryShortid],
      };
    case REMOVE_MODULE_FROM_SANDBOX:
      return {
        ...sandbox,
        modules: sandbox.modules.filter(m => m !== action.moduleId),
      };
    case REMOVE_DIRECTORY_FROM_SANDBOX:
      return {
        ...sandbox,
        directories: sandbox.directories.filter(d => d !== action.directoryShortid),
      };
    case SET_NPM_DEPENDENCIES:
      return {
        ...sandbox,
        npmDependencies: action.dependencies,
        dependencyBundle: {}, // So we can fetch dependencies later on again
      };
    case FETCH_BUNDLE_API_ACTIONS.REQUEST:
      return {
        ...sandbox,
        dependencyBundle: { processing: true },
      };
    case SET_BUNDLE:
      return {
        ...sandbox,
        dependencyBundle: action.bundle,
      };
    default:
      return sandbox;
  }
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case ADD_MODULE_TO_SANDBOX:
    case ADD_DIRECTORY_TO_SANDBOX:
    case REMOVE_MODULE_FROM_SANDBOX:
    case REMOVE_DIRECTORY_FROM_SANDBOX:
    case SET_NPM_DEPENDENCIES:
    case SET_CURRENT_MODULE:
    case FETCH_BUNDLE_API_ACTIONS.REQUEST:
    case SET_BUNDLE:
      if (state[action.id]) {
        return {
          ...state,
          [action.id]: singleSandboxReducer(state[action.id], action),
        };
      }

      return state;
    default:
      return state;
  }
}
