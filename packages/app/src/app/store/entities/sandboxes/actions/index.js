// @flow
import { push } from 'react-router-redux';

import { newSandboxUrl } from 'common/utils/url-generator';

import { createAPIActions, doRequest } from '../../../api/actions';
import { normalizeResult } from '../../actions';
import notificationActions from '../../../notifications/actions';
import entity from '../entity';
import { singleSandboxSelector } from '../selectors';
import { modulesSelector } from '../modules/selectors';
import { directoriesSelector } from '../directories/selectors';

import { maybeForkSandbox, forkSandbox } from './fork';
import fileActions from './files';
import gitActions from './git';
import { currentUserSelector } from '../../../user/selectors';

export const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
export const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
export const DELETE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'DELETE');
export const UPDATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'UPDATE');

export const UPDATE_NPM_DEPENDENCY_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_NPM_DEPENDENCY'
);
export const DELETE_NPM_DEPENDENCY_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_NPM_DEPENDENCY'
);
export const ADD_EXTERNAL_RESOURCE_ACTIONS = createAPIActions(
  'SANDBOX',
  'ADD_EXTERNAL_RESOURCE'
);
export const DELETE_EXTERNAL_RESOURCE_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_EXTERNAL_RESOURCE'
);
export const SET_SANDBOX_PRIVACY_ACTIONS = createAPIActions(
  'SANDBOX',
  'PRIVACY'
);
export const ADD_TAG_ACTIONS = createAPIActions('SANDBOX', 'ADD_TAG');
export const REMOVE_TAG_ACTIONS = createAPIActions('SANDBOX', 'REMOVE_TAG');
export const LIKE_SANDBOX_ACTIONS = createAPIActions('SANDBOX', 'LIKE');
export const UNLIKE_SANDBOX_ACTIONS = createAPIActions('SANDBOX', 'UNLIKE');
export const SET_SANDBOX_INFO = 'SET_SANDBOX_INFO';
export const SET_NPM_DEPENDENCIES = 'SET_NPM_DEPENDENCIES';
export const SET_EXTERNAL_RESOURCES = 'SET_EXTERNAL_RESOURCES';
export const SET_TAGS = 'SET_TAGS';
export const SET_CURRENT_MODULE = 'SET_CURRENT_MODULE';
export const CLOSE_TAB = 'CLOSE_TAB';
export const MOVE_TAB = 'MOVE_TAB';
export const MARK_TABS_NOT_DIRTY = 'MARK_TABS_NOT_DIRTY';
export const SET_PROJECT_VIEW = 'SET_PROJECT_VIEW';
export const SET_VIEW_MODE = 'SET_VIEW_MODE';
export const CREATE_ZIP = 'CREATE_ZIP';
export const DEPLOY_SANDBOX = 'DEPLOY_SANDBOX';
export const SET_SANDBOX_PRIVACY = 'SET_SANDBOX_PRIVACY';
export const FORCE_RENDER = 'FORCE_RENDER';

export default {
  updateSandboxInfo: (id: string, title: string, description: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const {
      title: oldTitle,
      description: oldDescription,
    } = singleSandboxSelector(getState(), { id: sandboxId });

    dispatch({
      type: SET_SANDBOX_INFO,
      id: sandboxId,
      title,
      description,
    });
    try {
      await dispatch(
        doRequest(UPDATE_SANDBOX_API_ACTIONS, `sandboxes/${sandboxId}`, {
          body: {
            sandbox: { title, description },
          },
          method: 'PUT',
        })
      );
    } catch (e) {
      dispatch({
        type: SET_SANDBOX_INFO,
        id: sandboxId,
        title: oldTitle,
        description: oldDescription,
      });
    }
  },

  setViewMode: (id: string, showEditor: boolean, showPreview: boolean) => ({
    type: SET_VIEW_MODE,
    id,
    showEditor,
    showPreview,
  }),

  setProjectView: (id: string, isInProjectView: boolean) => ({
    type: SET_PROJECT_VIEW,
    id,
    isInProjectView,
  }),

  setCurrentModule: (id: string, moduleId: string, lineNumber?: number) => ({
    type: SET_CURRENT_MODULE,
    id,
    moduleId,
    lineNumber,
  }),

  closeTab: (id: string, position: number) => ({
    type: CLOSE_TAB,
    id,
    position,
  }),

  moveTab: (id: string, oldPosition: number, position: number) => ({
    type: MOVE_TAB,
    id,
    oldPosition,
    position,
  }),

  markTabsNotDirty: (id: string) => ({
    type: MARK_TABS_NOT_DIRTY,
    id,
  }),

  getById: (id: string) => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(SINGLE_SANDBOX_API_ACTIONS, `sandboxes/${id}`)
    );

    dispatch(normalizeResult(entity, data));

    return data;
  },

  createSandbox: () => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(CREATE_SANDBOX_API_ACTIONS, `sandboxes`, {
        method: 'POST',
        body: { sandbox: {} },
      })
    );

    await dispatch(normalizeResult(entity, data));

    return data;
  },

  forkSandbox,

  addTag: (id: string, tag: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const sandbox = singleSandboxSelector(getState(), { id: sandboxId });

    // Already do change
    dispatch({
      type: SET_TAGS,
      id: sandboxId,
      tags: [...sandbox.tags, tag],
    });

    try {
      const result = await dispatch(
        doRequest(ADD_TAG_ACTIONS, `sandboxes/${sandboxId}/tags`, {
          method: 'POST',
          body: {
            tag,
          },
        })
      );
      dispatch({
        type: SET_TAGS,
        id: sandboxId,
        tags: result.data,
      });
    } catch (e) {
      dispatch({
        type: SET_TAGS,
        id: sandboxId,
        tags: sandbox.tags,
      });
      throw e;
    }
  },

  removeTag: (id: string, tag: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const sandbox = singleSandboxSelector(getState(), { id: sandboxId });

    // Already do change
    dispatch({
      type: SET_TAGS,
      id: sandboxId,
      tags: sandbox.tags.filter(t => t !== tag),
    });

    try {
      const result = await dispatch(
        doRequest(REMOVE_TAG_ACTIONS, `sandboxes/${sandboxId}/tags/${tag}`, {
          method: 'DELETE',
        })
      );
      dispatch({
        type: SET_TAGS,
        id: sandboxId,
        tags: result.data,
      });
    } catch (e) {
      dispatch({
        type: SET_TAGS,
        id: sandboxId,
        tags: sandbox.tags,
      });
      throw e;
    }
  },

  addNPMDependency: (id: string, dependency: string, version: string) => async (
    dispatch: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const realVersion = version || 'latest';
    const realName = dependency.toLowerCase();

    const result = await dispatch(
      doRequest(
        UPDATE_NPM_DEPENDENCY_ACTIONS,
        `sandboxes/${sandboxId}/dependencies`,
        {
          method: 'POST',
          shouldCamelize: false,
          body: {
            dependency: {
              name: realName,
              version: realVersion,
            },
          },
        }
      )
    );

    dispatch({
      type: SET_NPM_DEPENDENCIES,
      id: sandboxId,
      dependencies: result.data,
    });
  },

  removeNPMDependency: (id: string, dependency: string) => async (
    dispatch: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const result = await dispatch(
      doRequest(
        DELETE_NPM_DEPENDENCY_ACTIONS,
        `sandboxes/${sandboxId}/dependencies/${dependency}`,
        {
          method: 'DELETE',
        }
      )
    );

    dispatch({
      type: SET_NPM_DEPENDENCIES,
      id: sandboxId,
      dependencies: result.data,
    });
  },

  addExternalResource: (id: string, resource: string) => async (
    dispatch: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const result = await dispatch(
      doRequest(
        ADD_EXTERNAL_RESOURCE_ACTIONS,
        `sandboxes/${sandboxId}/resources`,
        {
          method: 'POST',
          body: {
            external_resource: resource,
          },
        }
      )
    );

    dispatch({
      type: SET_EXTERNAL_RESOURCES,
      id: sandboxId,
      externalResources: result.data,
    });
  },

  removeExternalResource: (id: string, resource: string) => async (
    dispatch: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const result = await dispatch(
      doRequest(
        DELETE_EXTERNAL_RESOURCE_ACTIONS,
        `sandboxes/${sandboxId}/resources/`,
        {
          method: 'DELETE',
          body: {
            id: resource,
          },
        }
      )
    );

    dispatch({
      type: SET_EXTERNAL_RESOURCES,
      id: sandboxId,
      externalResources: result.data,
    });
  },

  createZip: (id: string) => async (dispatch: Function, getState: Function) => {
    dispatch({
      type: CREATE_ZIP,
      id,
    });
    const modules = modulesSelector(getState());
    const directories = directoriesSelector(getState());
    const sandbox = singleSandboxSelector(getState(), { id });

    const createZip = await import(/* webpackChunkName: 'create-zip' */ '../utils/create-zip');

    createZip.default(
      sandbox,
      sandbox.modules.map(x => modules[x]),
      sandbox.directories.map(x => directories[x])
    );
  },

  deploy: (id: string) => async (dispatch: Function, getState: Function) => {
    dispatch({
      type: DEPLOY_SANDBOX,
      id,
    });
    const modules = modulesSelector(getState());
    const directories = directoriesSelector(getState());
    const sandbox = singleSandboxSelector(getState(), { id });

    const deploy = await import(/* webpackChunkName: 'deploy' */ '../utils/deploy');

    const apiData = await deploy.default(
      sandbox,
      sandbox.modules.map(x => modules[x]),
      sandbox.directories.map(x => directories[x])
    );

    const user = currentUserSelector(getState());
    const token = user.integrations.zeit.token;

    let res;
    try {
      res = await fetch('https://api.zeit.co/now/deployments', {
        method: 'POST',
        body: JSON.stringify(apiData),
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
    } catch (e) {
      dispatch(
        notificationActions.addNotification(
          'An unknown error occured when connecting to ZEIT',
          'error'
        )
      );

      throw e;
    }

    const data = await res.json();

    if (!res.ok) {
      dispatch(notificationActions.addNotification(data.err.message, 'error'));
      throw new Error(data.err.message);
    }

    return data.host && `https://${data.host}`;
  },

  deleteSandbox: (id: string) => async (dispatch: Function) => {
    await dispatch(
      doRequest(DELETE_SANDBOX_API_ACTIONS, `sandboxes/${id}`, {
        method: 'DELETE',
        body: {
          id,
        },
      })
    );

    dispatch(notificationActions.addNotification('Deleted Sandbox', 'success'));
  },

  newSandboxUrl: () => async (dispatch: Function) => {
    dispatch(push(newSandboxUrl()));
  },

  likeSandbox: (id: string) => async (dispatch: Function) => {
    await dispatch(
      doRequest(LIKE_SANDBOX_ACTIONS, `sandboxes/${id}/likes`, {
        method: 'POST',
        body: {
          id,
        },
      })
    );
  },

  unLikeSandbox: (id: string) => async (dispatch: Function) => {
    await dispatch(
      doRequest(UNLIKE_SANDBOX_ACTIONS, `sandboxes/${id}/likes`, {
        method: 'DELETE',
        body: {
          id,
        },
      })
    );
  },

  setSandboxPrivacy: (id: string, privacy: number) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const oldPrivacy = singleSandboxSelector(getState(), { id });
    dispatch({
      type: SET_SANDBOX_PRIVACY,
      id,
      privacy,
    });

    try {
      const result = await dispatch(
        doRequest(SET_SANDBOX_PRIVACY_ACTIONS, `sandboxes/${id}/privacy`, {
          method: 'PATCH',
          body: {
            sandbox: {
              privacy,
            },
          },
        })
      );
      return result;
    } catch (e) {
      dispatch({ type: SET_SANDBOX_PRIVACY, id, privacy: oldPrivacy });

      throw e;
    }
  },

  forceRender: (id: string) => ({
    type: FORCE_RENDER,
    id,
  }),

  ...fileActions,
  ...gitActions,
};
