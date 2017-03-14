import {
  ADD_MODULE_TO_SANDBOX,
  ADD_DIRECTORY_TO_SANDBOX,
  REMOVE_MODULE_FROM_SANDBOX,
  REMOVE_DIRECTORY_FROM_SANDBOX,
  REMOVE_DIRECTORY_FROM_SANDBOX_RECURSIVELY,
} from './actions';

const initialState = {};

type Action = {
  [key: string]: any,
  type: string,
};

function singleSandboxReducer(sandbox, action: Action) {
  switch (action.type) {
    case ADD_MODULE_TO_SANDBOX:
      return { ...sandbox, modules: [...sandbox.modules, action.moduleId] };
    case ADD_DIRECTORY_TO_SANDBOX:
      return {
        ...sandbox,
        directories: [...sandbox.modules, action.directoryId],
      };
    case REMOVE_MODULE_FROM_SANDBOX:
      return {
        ...sandbox,
        modules: sandbox.modules.filter(m => m.id !== action.moduleId),
      };
    case REMOVE_DIRECTORY_FROM_SANDBOX:
      return {
        ...sandbox,
        directories: sandbox.directories.filter(
          d => d.id !== action.directoryId,
        ),
      };
    case REMOVE_DIRECTORY_FROM_SANDBOX_RECURSIVELY:
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
    case REMOVE_DIRECTORY_FROM_SANDBOX_RECURSIVELY:
      if (state[action.id]) {
        return {
          ...state,
          [action.id]: singleSandboxReducer(state[action.id]),
        };
      }

      return state;
    default:
      return state;
  }
}
