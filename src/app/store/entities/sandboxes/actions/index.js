// @flow
import { push } from 'react-router-redux';

import { newSandboxUrl } from 'app/utils/url-generator';

import { createAPIActions, doRequest } from '../../../api/actions';
import { normalizeResult } from '../../actions';
import notificationActions from '../../../notifications/actions';
import entity from '../entity';
import fetchBundle from '../bundler';
import { singleSandboxSelector } from '../selectors';
import { modulesSelector } from '../modules/selectors';
import { directoriesSelector } from '../directories/selectors';
import errorActions from '../errors/actions';

import { maybeForkSandbox, forkSandbox } from './fork';
import fileActions from './files';

export const FETCH_BUNDLE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'FETCH_BUNDLE',
);
export const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
export const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
export const DELETE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'DELETE');
export const UPDATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'UPDATE');

export const UPDATE_NPM_DEPENDENCY_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_NPM_DEPENDENCY',
);
export const DELETE_NPM_DEPENDENCY_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_NPM_DEPENDENCY',
);
export const ADD_EXTERNAL_RESOURCE_ACTIONS = createAPIActions(
  'SANDBOX',
  'ADD_EXTERNAL_RESOURCE',
);
export const DELETE_EXTERNAL_RESOURCE_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_EXTERNAL_RESOURCE',
);
export const LIKE_SANDBOX_ACTIONS = createAPIActions('SANDBOX', 'LIKE');
export const UNLIKE_SANDBOX_ACTIONS = createAPIActions('SANDBOX', 'UNLIKE');
export const SET_SANDBOX_INFO = 'SET_SANDBOX_INFO';
export const SET_NPM_DEPENDENCIES = 'SET_NPM_DEPENDENCIES';
export const SET_EXTERNAL_RESOURCES = 'SET_EXTERNAL_RESOURCES';
export const SET_CURRENT_MODULE = 'SET_CURRENT_MODULE';
export const SET_BUNDLE = 'SET_BUNDLE';
export const CANCEL_BUNDLE = 'CANCEL_BUNDLE';
export const SET_PROJECT_VIEW = 'SET_PROJECT_VIEW';
export const SET_VIEW_MODE = 'SET_VIEW_MODE';
export const CREATE_ZIP = 'CREATE_ZIP';

export default {
  updateSandboxInfo: (id: string, title: string, description: string) => async (
    dispatch: Function,
    getState: Function,
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
        }),
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

  setCurrentModule: (id: string, moduleId: string) => ({
    type: SET_CURRENT_MODULE,
    id,
    moduleId,
  }),

  getById: (id: string) => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(SINGLE_SANDBOX_API_ACTIONS, `sandboxes/${id}`),
    );

    dispatch(normalizeResult(entity, data));
  },

  createSandbox: () => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(CREATE_SANDBOX_API_ACTIONS, `sandboxes`, {
        method: 'POST',
        body: { sandbox: {} },
      }),
    );

    await dispatch(normalizeResult(entity, data));

    return data;
  },

  forkSandbox,

  addNPMDependency: (id: string, dependency: string, version: string) => async (
    dispatch: Function,
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const result = await dispatch(
      doRequest(
        UPDATE_NPM_DEPENDENCY_ACTIONS,
        `sandboxes/${sandboxId}/dependencies`,
        {
          method: 'POST',
          body: {
            dependency: {
              name: dependency,
              version,
            },
          },
        },
      ),
    );

    dispatch({
      type: SET_NPM_DEPENDENCIES,
      id: sandboxId,
      dependencies: result.data,
    });
  },

  removeNPMDependency: (id: string, dependency: string) => async (
    dispatch: Function,
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const result = await dispatch(
      doRequest(
        DELETE_NPM_DEPENDENCY_ACTIONS,
        `sandboxes/${sandboxId}/dependencies/${dependency}`,
        {
          method: 'DELETE',
        },
      ),
    );

    dispatch({
      type: SET_NPM_DEPENDENCIES,
      id: sandboxId,
      dependencies: result.data,
    });
  },

  addExternalResource: (id: string, resource: string) => async (
    dispatch: Function,
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
        },
      ),
    );

    dispatch({
      type: SET_EXTERNAL_RESOURCES,
      id: sandboxId,
      externalResources: result.data,
    });
  },

  removeExternalResource: (id: string, resource: string) => async (
    dispatch: Function,
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
        },
      ),
    );

    dispatch({
      type: SET_EXTERNAL_RESOURCES,
      id: sandboxId,
      externalResources: result.data,
    });
  },

  fetchDependenciesBundle: (sandboxId: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    try {
      dispatch(
        notificationActions.addNotification(
          'Fetching dependencies...',
          'notice',
        ),
      );

      const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
      const result = await dispatch(
        fetchBundle(
          FETCH_BUNDLE_API_ACTIONS,
          sandboxId,
          sandbox.npmDependencies,
        ),
      );

      const bundle = {
        externals: result.externals,
        url: result.url,
      };

      dispatch({
        type: SET_BUNDLE,
        id: sandboxId,
        bundle,
      });

      dispatch(
        notificationActions.addNotification('Dependencies loaded!', 'success'),
      );
    } catch (e) {
      dispatch(
        notificationActions.addNotification(
          'Could not fetch dependencies',
          'error',
        ),
      );

      dispatch({
        type: CANCEL_BUNDLE,
        id: sandboxId,
      });
    }
  },

  createZip: (id: string) => async (dispatch: Function, getState: Function) => {
    dispatch({
      type: CREATE_ZIP,
      id,
    });
    const modules = modulesSelector(getState());
    const directories = directoriesSelector(getState());
    const sandbox = singleSandboxSelector(getState(), { id });

    const createZip = await import('../utils/create-zip');

    createZip.default(
      sandbox,
      sandbox.modules.map(x => modules[x]),
      sandbox.directories.map(x => directories[x]),
    );
  },

  deleteSandbox: (id: string) => async (dispatch: Function) => {
    await dispatch(
      doRequest(DELETE_SANDBOX_API_ACTIONS, `sandboxes/${id}`, {
        method: 'DELETE',
        body: {
          id,
        },
      }),
    );

    dispatch(notificationActions.addNotification('Deleted Sandbox', 'success'));
    dispatch(push(newSandboxUrl()));
  },

  likeSandbox: (id: string) => async (dispatch: Function) => {
    await dispatch(
      doRequest(LIKE_SANDBOX_ACTIONS, `sandboxes/${id}/likes`, {
        method: 'POST',
        body: {
          id,
        },
      }),
    );
  },

  unLikeSandbox: (id: string) => async (dispatch: Function) => {
    await dispatch(
      doRequest(UNLIKE_SANDBOX_ACTIONS, `sandboxes/${id}/likes`, {
        method: 'DELETE',
        body: {
          id,
        },
      }),
    );
  },

  ...errorActions,
  ...fileActions,
};
