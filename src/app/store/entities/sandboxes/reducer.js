import { mapValues } from 'lodash';

import {
  ADD_MODULE_TO_SANDBOX,
  ADD_DIRECTORY_TO_SANDBOX,
  REMOVE_MODULE_FROM_SANDBOX,
  REMOVE_DIRECTORY_FROM_SANDBOX,
  SET_NPM_DEPENDENCIES,
  SET_EXTERNAL_RESOURCES,
  SET_CURRENT_MODULE,
  SET_BUNDLE,
  FETCH_BUNDLE_API_ACTIONS,
  SET_SANDBOX_INFO,
  SET_PROJECT_VIEW,
  SET_VIEW_MODE,
} from './actions';

import { SET_CURRENT_USER, SIGN_OUT } from '../../user/actions';

const initialState = {};

type Action = {
  [key: string]: any,
  type: string,
};

function singleSandboxReducer(sandbox, action: Action) {
  switch (action.type) {
    case SET_VIEW_MODE:
      return {
        ...sandbox,
        showEditor: action.showEditor,
        showPreview: action.showPreview,
      };
    case SET_PROJECT_VIEW:
      return { ...sandbox, isInProjectView: action.isInProjectView };
    case SET_CURRENT_MODULE:
      return { ...sandbox, currentModule: action.moduleId };
    case ADD_MODULE_TO_SANDBOX:
      return { ...sandbox, modules: [...sandbox.modules, action.moduleId] };
    case ADD_DIRECTORY_TO_SANDBOX:
      return {
        ...sandbox,
        directories: [...sandbox.directories, action.directoryShortid],
      };
    case REMOVE_MODULE_FROM_SANDBOX: {
      const currentModule = sandbox.currentModule;
      const resetCurrentModule = currentModule === action.moduleId;

      return {
        ...sandbox,
        currentModule: resetCurrentModule ? undefined : sandbox.currentModule,
        modules: sandbox.modules.filter(m => m !== action.moduleId),
      };
    }
    case REMOVE_DIRECTORY_FROM_SANDBOX:
      return {
        ...sandbox,
        directories: sandbox.directories.filter(
          d => d !== action.directoryShortid,
        ),
      };
    case SET_NPM_DEPENDENCIES:
      return {
        ...sandbox,
        npmDependencies: action.dependencies,
        dependencyBundle: {}, // So we can fetch dependencies later on again
      };
    case SET_EXTERNAL_RESOURCES:
      return {
        ...sandbox,
        externalResources: action.externalResources,
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
    case SET_SANDBOX_INFO:
      return {
        ...sandbox,
        title: action.title,
        description: action.description,
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
    case SET_EXTERNAL_RESOURCES:
    case SET_CURRENT_MODULE:
    case FETCH_BUNDLE_API_ACTIONS.REQUEST:
    case SET_BUNDLE:
    case SET_SANDBOX_INFO:
    case SET_PROJECT_VIEW:
    case SET_VIEW_MODE:
      if (state[action.id]) {
        return {
          ...state,
          [action.id]: singleSandboxReducer(state[action.id], action),
        };
      }

      return state;
    // The user has changed, we need to mark all sandboxes as owned if the author
    // id corresponds with the new user id
    case SET_CURRENT_USER:
      return mapValues(state, s => ({
        ...s,
        owned: s.owned || s.author === action.data.id,
      }));
    case SIGN_OUT:
      return mapValues(state, s => ({
        ...s,
        owned: false,
      }));
    default:
      return state;
  }
}
