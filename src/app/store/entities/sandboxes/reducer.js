// @flow
import type { Sandbox } from 'common/types';
import { mapValues } from 'lodash';

import {
  SET_NPM_DEPENDENCIES,
  SET_EXTERNAL_RESOURCES,
  SET_CURRENT_MODULE,
  SET_SANDBOX_INFO,
  SET_PROJECT_VIEW,
  SET_VIEW_MODE,
  DELETE_SANDBOX_API_ACTIONS,
  LIKE_SANDBOX_ACTIONS,
  UNLIKE_SANDBOX_ACTIONS,
  SET_TAGS,
  SET_SANDBOX_PRIVACY,
  FORCE_RENDER,
} from './actions';

import {
  ADD_MODULE_TO_SANDBOX,
  ADD_DIRECTORY_TO_SANDBOX,
  REMOVE_MODULE_FROM_SANDBOX,
  REMOVE_DIRECTORY_FROM_SANDBOX,
  SAVE_MODULE_CODE_API_ACTIONS,
  MASS_UPDATE_MODULE_API_ACTIONS,
} from './actions/files';

import { FETCH_GIT_CHANGES_API_ACTIONS, SET_ORIGINAL_GIT } from './actions/git';
import { RENAME_MODULE, MOVE_MODULE } from './modules/actions';

import { RENAME_DIRECTORY, MOVE_DIRECTORY } from './directories/actions';

import { SET_CURRENT_USER, SIGN_OUT } from '../../user/actions';

const initialState = {};

type Action = {
  [key: string]: any,
  type: string,
};

function singleSandboxReducer(sandbox: Sandbox, action: Action): Sandbox {
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
      return {
        ...sandbox,
        modules: [...sandbox.modules, action.moduleId],
        originalGitChanges: null,
      };
    case ADD_DIRECTORY_TO_SANDBOX:
      return {
        ...sandbox,
        directories: [...sandbox.directories, action.directoryId],
        originalGitChanges: null,
      };
    case REMOVE_MODULE_FROM_SANDBOX: {
      const currentModule = sandbox.currentModule;
      const resetCurrentModule = currentModule === action.moduleId;

      return {
        ...sandbox,
        currentModule: resetCurrentModule ? undefined : sandbox.currentModule,
        modules: sandbox.modules.filter(m => m !== action.moduleId),
        originalGitChanges: null,
      };
    }
    case REMOVE_DIRECTORY_FROM_SANDBOX:
      return {
        ...sandbox,
        directories: sandbox.directories.filter(d => d !== action.directoryId),
        originalGitChanges: null,
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
    case SET_SANDBOX_INFO:
      return {
        ...sandbox,
        title: action.title,
        description: action.description,
      };
    case LIKE_SANDBOX_ACTIONS.REQUEST:
      if (sandbox.userLiked) return sandbox;

      return {
        ...sandbox,
        likeCount: sandbox.likeCount + 1,
        userLiked: true,
      };
    case LIKE_SANDBOX_ACTIONS.SUCCESS:
      return {
        ...sandbox,
        likeCount: action.data.count,
      };
    case LIKE_SANDBOX_ACTIONS.FAILURE:
      return {
        ...sandbox,
        likeCount: sandbox.likeCount - 1,
        userLiked: false,
      };
    case UNLIKE_SANDBOX_ACTIONS.SUCCESS:
      return {
        ...sandbox,
        userLiked: false,
        likeCount: action.data.count,
      };
    case UNLIKE_SANDBOX_ACTIONS.FAILURE:
      return {
        ...sandbox,
        userLiked: true,
        likeCount: sandbox.likeCount + 1,
      };
    case UNLIKE_SANDBOX_ACTIONS.REQUEST:
      if (!sandbox.userLiked) return sandbox;

      return {
        ...sandbox,
        userLiked: false,
        likeCount: sandbox.likeCount - 1,
      };
    case FETCH_GIT_CHANGES_API_ACTIONS.SUCCESS:
      return {
        ...sandbox,
        originalGitChanges: action.data,
      };
    case FETCH_GIT_CHANGES_API_ACTIONS.FAILURE:
    case FETCH_GIT_CHANGES_API_ACTIONS.REQUEST:
      return {
        ...sandbox,
        originalGitChanges: null,
      };
    case SET_ORIGINAL_GIT:
      return {
        ...sandbox,
        originalGit: action.originalGit,
        originalGitCommitSha: action.originalGitCommitSha,
        originalGitChanges: null,
      };
    case SET_TAGS:
      return {
        ...sandbox,
        tags: action.tags,
      };
    case SET_SANDBOX_PRIVACY:
      return {
        ...sandbox,
        privacy: action.privacy,
      };
    case FORCE_RENDER:
      return {
        ...sandbox,
        forcedRenders: sandbox.forcedRenders + 1,
      };
    default:
      return sandbox;
  }
}

export default function reducer(
  state = initialState,
  action: Action
): { [id: string]: Sandbox } {
  switch (action.type) {
    case ADD_MODULE_TO_SANDBOX:
    case ADD_DIRECTORY_TO_SANDBOX:
    case REMOVE_MODULE_FROM_SANDBOX:
    case REMOVE_DIRECTORY_FROM_SANDBOX:
    case SET_NPM_DEPENDENCIES:
    case SET_EXTERNAL_RESOURCES:
    case SET_CURRENT_MODULE:
    case SET_SANDBOX_INFO:
    case SET_PROJECT_VIEW:
    case SET_VIEW_MODE:
    case SET_TAGS:
    case LIKE_SANDBOX_ACTIONS.REQUEST:
    case LIKE_SANDBOX_ACTIONS.SUCCESS:
    case LIKE_SANDBOX_ACTIONS.FAILURE:
    case UNLIKE_SANDBOX_ACTIONS.REQUEST:
    case UNLIKE_SANDBOX_ACTIONS.FAILURE:
    case UNLIKE_SANDBOX_ACTIONS.SUCCESS:
    case FETCH_GIT_CHANGES_API_ACTIONS.SUCCESS:
    case FETCH_GIT_CHANGES_API_ACTIONS.REQUEST:
    case FETCH_GIT_CHANGES_API_ACTIONS.FAILURE:
    case SET_SANDBOX_PRIVACY:
    case SET_ORIGINAL_GIT:
    case FORCE_RENDER: {
      const id = action.id || (action.meta ? action.meta.id : undefined);
      if (state[id]) {
        return {
          ...state,
          [id]: singleSandboxReducer(state[id], action),
        };
      }

      return state;
      // The user has changed, we need to mark all sandboxes as owned if the author
      // id corresponds with the new user id
    }
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
    case DELETE_SANDBOX_API_ACTIONS.SUCCESS:
      return {
        ...state,
        [action.meta.id]: null,
      };

    // Git changes
    case RENAME_MODULE:
    case MOVE_MODULE:
    case RENAME_DIRECTORY:
    case MOVE_DIRECTORY:
    case SAVE_MODULE_CODE_API_ACTIONS.REQUEST:
    case MASS_UPDATE_MODULE_API_ACTIONS.REQUEST:
      return mapValues(state, s => {
        if (!s.originalGitChanges) {
          return s;
        }

        return {
          ...s,
          originalGitChanges: null,
        };
      });
    default:
      return state;
  }
}
