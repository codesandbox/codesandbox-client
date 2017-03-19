// @flow
import { push } from 'react-router-redux';

import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';
import notificationActions from '../../notifications/actions';
import entity from './entity';
import fetchBundle from './bundle-loader';
import type { Module } from './modules/entity';
import moduleEntity from './modules/entity';
import moduleActions from './modules/actions';
import type { Directory } from './directories/entity';
import directoryEntity from './directories/entity';
import directoryActions from './directories/actions';
import { singleSandboxSelector } from './selectors';
import { modulesSelector } from './modules/selectors';
import { directoriesSelector } from './directories/selectors';
import { sandboxUrl } from '../../../utils/url-generator';
import {version} from 'babel-standalone';

export const FETCH_BUNDLE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'FETCH_BUNDLE'
);
export const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
export const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
export const FORK_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'FORK');
export const CREATE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'CREATE_MODULE'
);
export const SAVE_MODULE_CODE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'SAVE_MODULE_CODE'
);
export const UPDATE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_MODULE'
);
export const DELETE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_MODULE'
);
export const CREATE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'CREATE_DIRECTORY'
);
export const UPDATE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_DIRECTORY'
);
export const DELETE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_DIRECTORY'
);
export const UPDATE_NPM_DEPENDENCY_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_NPM_DEPENDENCY'
);
export const DELETE_NPM_DEPENDENCY_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_NPM_DEPENDENCY'
);

export const REMOVE_MODULE_FROM_SANDBOX = 'REMOVE_MODULE_FROM_SANDBOX';
export const REMOVE_DIRECTORY_FROM_SANDBOX = 'REMOVE_DIRECTORY_FROM_SANDBOX';
export const ADD_MODULE_TO_SANDBOX = 'ADD_MODULE_TO_SANDBOX';
export const ADD_DIRECTORY_TO_SANDBOX = 'ADD_DIRECTORY_TO_SANDBOX';
export const SET_NPM_DEPENDENCIES = 'SET_NPM_DEPENDENCIES';
export const SET_CURRENT_MODULE = 'SET_CURRENT_MODULE';
export const SET_BUNDLE = 'SET_BUNDLE';

const addModuleToSandbox = (id, moduleId) => ({
  type: ADD_MODULE_TO_SANDBOX,
  id,
  moduleId,
});
const removeModuleFromSandbox = (id, moduleId) => ({
  type: REMOVE_MODULE_FROM_SANDBOX,
  id,
  moduleId,
});
const addDirectoryToSandbox = (id, directoryId) => ({
  type: ADD_DIRECTORY_TO_SANDBOX,
  id,
  directoryId,
});
const removeDirectoryFromSandbox = (id, directoryId) => ({
  type: REMOVE_DIRECTORY_FROM_SANDBOX,
  id,
  directoryId,
});

const forkSandbox = (id: string) => async (dispatch: Function) => {
  const { data } = await dispatch(
    doRequest(FORK_SANDBOX_API_ACTIONS, `sandboxes/${id}/fork`, {
      method: 'POST',
    })
  );

  await dispatch(normalizeResult(entity, data));

  return data;
};

/**
 * Will fork the sandbox if the sandbox is not owned
 * @param {string} sandboxId
 */
const maybeForkSandbox = sandboxId => async (
  dispatch: Function,
  getState: Function
) => {
  const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
  if (sandbox.owned) {
    return sandbox.id;
  }

  const forkedSandbox = await dispatch(forkSandbox(sandbox.id));

  dispatch(push(sandboxUrl(forkedSandbox)));

  return forkedSandbox.id;
};

const removeChildrenOfDirectory = (
  directoryId,
  sandboxId: string,
  modules: Array<Module>,
  directories: Array<Directory>
) => dispatch => {
    modules
      .filter(m => m.directoryId === directoryId)
      .forEach(m => dispatch(removeModuleFromSandbox(sandboxId, m.id)));
    directories.filter(d => d.directoryId === directoryId).forEach(d => {
      dispatch(removeDirectoryFromSandbox(sandboxId, d.id));
      dispatch(
        removeChildrenOfDirectory(d.id, sandboxId, modules, directories)
      );
    });
  };

export default {
  setCurrentModule: (id: string, moduleId: string) => ({
    type: SET_CURRENT_MODULE,
    id,
    moduleId,
  }),

  getById: (id: string) => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(SINGLE_SANDBOX_API_ACTIONS, `sandboxes/${id}`)
    );

    dispatch(normalizeResult(entity, data));
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

  createModule: (id: string, title: string, directoryId: ?string) => async (
    dispatch: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const { data } = await dispatch(
      doRequest(CREATE_MODULE_API_ACTIONS, `sandboxes/${sandboxId}/modules`, {
        method: 'POST',
        body: { module: { title, directoryId } },
      })
    );

    dispatch(normalizeResult(moduleEntity, data));
    dispatch(addModuleToSandbox(sandboxId, data.id));
  },

  saveModuleCode: (id: string, moduleId: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const module = modulesSelector(getState())[moduleId];

    await dispatch(
      doRequest(
        SAVE_MODULE_CODE_API_ACTIONS,
        `sandboxes/${sandboxId}/modules/${moduleId}`,
        {
          method: 'PUT',
          body: { module: { code: module.code } },
        }
      )
    );

    dispatch(moduleActions.setModuleSynced(moduleId));
  },

  renameModule: (id: string, moduleId: string, title: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    // Eager rename, just undo it when something goes wrong
    const oldTitle = modulesSelector(getState())[moduleId].title;
    dispatch(moduleActions.renameModule(moduleId, title));

    try {
      await dispatch(
        doRequest(
          UPDATE_MODULE_API_ACTIONS,
          `sandboxes/${sandboxId}/modules/${moduleId}`,
          {
            method: 'PUT',
            body: { module: { title } },
          }
        )
      );
    } catch (e) {
      dispatch(moduleActions.renameModule(moduleId, oldTitle));
    }
  },

  moveModuleToDirectory: (id: string, moduleId: string, directoryId: string) =>
    async (dispatch: Function, getState: Function) => {
      const sandboxId = await dispatch(maybeForkSandbox(id));
      // Eager move it
      const oldDirectoryId = modulesSelector(getState())[moduleId].directoryId;
      dispatch(moduleActions.moveModule(moduleId, directoryId));

      try {
        await dispatch(
          doRequest(
            UPDATE_MODULE_API_ACTIONS,
            `sandboxes/${sandboxId}/modules/${moduleId}`,
            {
              method: 'PUT',
              body: { module: { directoryId } },
            }
          )
        );
      } catch (e) {
        dispatch(moduleActions.moveModule(moduleId, oldDirectoryId));
      }
    },

  deleteModule: (id: string, moduleId: string) => async (
    dispatch: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    // Eager remove it
    dispatch(removeModuleFromSandbox(sandboxId, moduleId));

    try {
      await dispatch(
        doRequest(
          DELETE_MODULE_API_ACTIONS,
          `sandboxes/${sandboxId}/modules/${moduleId}`,
          {
            method: 'DELETE',
          }
        )
      );
    } catch (e) {
      // It failed, just add it back
      dispatch(addModuleToSandbox(sandboxId, moduleId));
    }
  },

  createDirectory: (id: string, title: string, directoryId: ?string) => async (
    dispatch: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const { data } = await dispatch(
      doRequest(
        CREATE_DIRECTORY_API_ACTIONS,
        `sandboxes/${sandboxId}/directories`,
        {
          method: 'POST',
          body: { directory: { title, directoryId } },
        }
      )
    );

    dispatch(normalizeResult(directoryEntity, data));
    dispatch(addDirectoryToSandbox(sandboxId, data.id));
  },

  renameDirectory: (id: string, directoryId: string, title: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    // Eager rename, just undo it when something goes wrong
    const oldTitle = directoriesSelector(getState())[directoryId].title;
    dispatch(directoryActions.renameDirectory(directoryId, title));

    try {
      await dispatch(
        doRequest(
          UPDATE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories/${directoryId}`,
          {
            method: 'PUT',
            body: { directory: { title } },
          }
        )
      );
    } catch (e) {
      dispatch(directoryActions.renameDirectory(directoryId, oldTitle));
    }
  },

  moveDirectoryToDirectory: (
    id: string,
    directoryId: string,
    parentId: string
  ) => async (dispatch: Function, getState: Function) => {
      const sandboxId = await dispatch(maybeForkSandbox(id));
      // Eager move it
      const oldDirectoryId = directoriesSelector(getState())[
        directoryId
      ].parentId;
      dispatch(directoryActions.moveDirectory(directoryId, parentId));

      try {
        await dispatch(
          doRequest(
            UPDATE_DIRECTORY_API_ACTIONS,
            `sandboxes/${sandboxId}/directories/${directoryId}`,
            {
              method: 'PUT',
              body: { directory: { directoryId: parentId } },
            }
          )
        );
      } catch (e) {
        dispatch(directoryActions.moveDirectory(directoryId, oldDirectoryId));
      }
    },

  deleteDirectory: (id: string, directoryId: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    dispatch(removeDirectoryFromSandbox(sandboxId, directoryId));

    try {
      await dispatch(
        doRequest(
          DELETE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories/${directoryId}`,
          {
            method: 'DELETE',
          }
        )
      );

      const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
      const allModules = modulesSelector(getState());
      const allDirectories = directoriesSelector(getState());
      const modules = sandbox.modules.map(mid => allModules[mid]);
      const directories = sandbox.directories.map(did => allDirectories[did]);

      // Recursively delete all children
      dispatch(
        removeChildrenOfDirectory(directoryId, sandboxId, modules, directories)
      );
    } catch (e) {
      // It failed, add it back
      dispatch(addDirectoryToSandbox(sandboxId, directoryId));
    }
  },

  addNPMDependency: (id: string, dependency: string, version: string) => async (
    dispatch: Function
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

  fetchDependenciesBundle: (sandboxId: string) => async (
    dispatch: Function
  ) => {
    try {
      const result = await dispatch(
        fetchBundle(FETCH_BUNDLE_API_ACTIONS, sandboxId)
      );

      dispatch({
        type: SET_BUNDLE,
        id: sandboxId,
        bundle: result,
      });
    } catch (e) {
      dispatch(
        notificationActions.addNotification(
          'Could not fetch dependencies',
          'Please try again later',
          'error'
        )
      );
    }
  },
};
