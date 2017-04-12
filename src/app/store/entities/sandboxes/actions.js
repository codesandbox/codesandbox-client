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

export const FETCH_BUNDLE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'FETCH_BUNDLE'
);
export const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
export const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
export const UPDATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'UPDATE');
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
export const MASS_UPDATE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'MASS_UPDATE_MODULE'
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
export const ADD_EXTERNAL_RESOURCE_ACTIONS = createAPIActions(
  'SANDBOX',
  'ADD_EXTERNAL_RESOURCE'
);
export const DELETE_EXTERNAL_RESOURCE_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_EXTERNAL_RESOURCE'
);

export const REMOVE_MODULE_FROM_SANDBOX = 'REMOVE_MODULE_FROM_SANDBOX';
export const SET_SANDBOX_INFO = 'SET_SANDBOX_INFO';
export const REMOVE_DIRECTORY_FROM_SANDBOX = 'REMOVE_DIRECTORY_FROM_SANDBOX';
export const ADD_MODULE_TO_SANDBOX = 'ADD_MODULE_TO_SANDBOX';
export const ADD_DIRECTORY_TO_SANDBOX = 'ADD_DIRECTORY_TO_SANDBOX';
export const SET_NPM_DEPENDENCIES = 'SET_NPM_DEPENDENCIES';
export const SET_EXTERNAL_RESOURCES = 'SET_EXTERNAL_RESOURCES';
export const SET_CURRENT_MODULE = 'SET_CURRENT_MODULE';
export const SET_BUNDLE = 'SET_BUNDLE';
export const SET_PROJECT_VIEW = 'SET_PROJECT_VIEW';
export const SET_VIEW_MODE = 'SET_VIEW_MODE';
export const CREATE_ZIP = 'CREATE_ZIP';

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
const addDirectoryToSandbox = (id, directoryShortid) => ({
  type: ADD_DIRECTORY_TO_SANDBOX,
  id,
  directoryShortid,
});
const removeDirectoryFromSandbox = (id, directoryShortid) => ({
  type: REMOVE_DIRECTORY_FROM_SANDBOX,
  id,
  directoryShortid,
});

const forkSandbox = (id: string) => async (
  dispatch: Function,
  getState: Function
) => {
  const { data } = await dispatch(
    doRequest(FORK_SANDBOX_API_ACTIONS, `sandboxes/${id}/fork`, {
      method: 'POST',
    })
  );

  const currentSandbox = singleSandboxSelector(getState(), { id });
  if (currentSandbox) {
    data.currentModule = currentSandbox.currentModule;
  }
  data.forked = true;
  await dispatch(normalizeResult(entity, data));

  dispatch(push(sandboxUrl(data)));

  dispatch(notificationActions.addNotification('Forked sandbox!', 'success'));

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

  return forkedSandbox.id;
};

const removeChildrenOfDirectory = (
  directoryShortid,
  sandboxId: string,
  modules: Array<Module>,
  directories: Array<Directory>
) => dispatch => {
    modules
      .filter(m => m.directoryShortid === directoryShortid)
      .forEach(m => dispatch(removeModuleFromSandbox(sandboxId, m.id)));
    directories
      .filter(d => d.directoryShortid === directoryShortid)
      .forEach(d => {
        dispatch(removeDirectoryFromSandbox(sandboxId, d.id));
        dispatch(
          removeChildrenOfDirectory(d.id, sandboxId, modules, directories)
        );
      });
  };

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

  createModule: (id: string, title: string, directoryShortid: ?string) =>
    async (dispatch: Function) => {
      const sandboxId = await dispatch(maybeForkSandbox(id));

      const { data } = await dispatch(
        doRequest(CREATE_MODULE_API_ACTIONS, `sandboxes/${sandboxId}/modules`, {
          method: 'POST',
          body: { module: { title, directoryShortid } },
        })
      );

      dispatch(normalizeResult(moduleEntity, data));
      dispatch(addModuleToSandbox(sandboxId, data.id));
    },

  saveModuleCode: (id: string, moduleId: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const module = modulesSelector(getState())[moduleId];
    const sandboxId = await dispatch(maybeForkSandbox(id));
    dispatch(moduleActions.setCode(module.id, module.code));

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

  moveModuleToDirectory: (
    id: string,
    moduleId: string,
    directoryShortid: string
  ) => async (dispatch: Function, getState: Function) => {
      const sandboxId = await dispatch(maybeForkSandbox(id));
      // Eager move it
      const olddirectoryShortid = modulesSelector(getState())[
        moduleId
      ].directoryShortid;
      dispatch(moduleActions.moveModule(moduleId, directoryShortid));

      try {
        await dispatch(
          doRequest(
            UPDATE_MODULE_API_ACTIONS,
            `sandboxes/${sandboxId}/modules/${moduleId}`,
            {
              method: 'PUT',
              body: { module: { directoryShortid } },
            }
          )
        );
      } catch (e) {
        dispatch(moduleActions.moveModule(moduleId, olddirectoryShortid));
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

  createDirectory: (id: string, title: string, directoryShortid: ?string) =>
    async (dispatch: Function) => {
      const sandboxId = await dispatch(maybeForkSandbox(id));
      const { data } = await dispatch(
        doRequest(
          CREATE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories`,
          {
            method: 'POST',
            body: { directory: { title, directoryShortid } },
          }
        )
      );

      dispatch(normalizeResult(directoryEntity, data));
      dispatch(addDirectoryToSandbox(sandboxId, data.id));
    },

  renameDirectory: (id: string, directoryShortid: string, title: string) =>
    async (dispatch: Function, getState: Function) => {
      const sandboxId = await dispatch(maybeForkSandbox(id));
      // Eager rename, just undo it when something goes wrong
      const oldTitle = directoriesSelector(getState())[directoryShortid].title;
      dispatch(directoryActions.renameDirectory(directoryShortid, title));

      try {
        await dispatch(
          doRequest(
            UPDATE_DIRECTORY_API_ACTIONS,
            `sandboxes/${sandboxId}/directories/${directoryShortid}`,
            {
              method: 'PUT',
              body: { directory: { title } },
            }
          )
        );
      } catch (e) {
        dispatch(directoryActions.renameDirectory(directoryShortid, oldTitle));
      }
    },

  moveDirectoryToDirectory: (
    id: string,
    directoryShortid: string,
    parentId: string
  ) => async (dispatch: Function, getState: Function) => {
      const sandboxId = await dispatch(maybeForkSandbox(id));
      // Eager move it
      const olddirectoryShortid = directoriesSelector(getState())[
        directoryShortid
      ].parentId;
      dispatch(directoryActions.moveDirectory(directoryShortid, parentId));

      try {
        await dispatch(
          doRequest(
            UPDATE_DIRECTORY_API_ACTIONS,
            `sandboxes/${sandboxId}/directories/${directoryShortid}`,
            {
              method: 'PUT',
              body: { directory: { directoryShortid: parentId } },
            }
          )
        );
      } catch (e) {
        dispatch(
          directoryActions.moveDirectory(directoryShortid, olddirectoryShortid)
        );
      }
    },

  deleteDirectory: (id: string, directoryShortid: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));
    dispatch(removeDirectoryFromSandbox(sandboxId, directoryShortid));

    try {
      await dispatch(
        doRequest(
          DELETE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories/${directoryShortid}`,
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
        removeChildrenOfDirectory(
          directoryShortid,
          sandboxId,
          modules,
          directories
        )
      );

      dispatch(
        notificationActions.addNotification('Deleted directory', 'success')
      );
    } catch (e) {
      // It failed, add it back
      dispatch(addDirectoryToSandbox(sandboxId, directoryShortid));
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

  fetchDependenciesBundle: (sandboxId: string) => async (
    dispatch: Function
  ) => {
    try {
      dispatch(
        notificationActions.addNotification(
          'Fetching dependencies...',
          'notice'
        )
      );
      const result = await dispatch(
        fetchBundle(FETCH_BUNDLE_API_ACTIONS, sandboxId)
      );

      dispatch({
        type: SET_BUNDLE,
        id: sandboxId,
        bundle: result,
      });

      dispatch(
        notificationActions.addNotification('Dependencies loaded!', 'success')
      );
    } catch (e) {
      dispatch(
        notificationActions.addNotification(
          'Could not fetch dependencies',
          'error'
        )
      );
    }
  },

  /**
   * Updates all modules in a sandbox at once (only the code)
   */
  massUpdateModules: (id: string) => async (
    dispatch: Function,
    getState: Function
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
    const modules = modulesSelector(getState());

    const modulesInSandbox = sandbox.modules.map(mid => modules[mid]);
    const modulesNotInSyncInSandbox = modulesInSandbox.filter(
      m => m.isNotSynced
    );

    await dispatch(
      doRequest(
        MASS_UPDATE_MODULE_API_ACTIONS,
        `sandboxes/${sandboxId}/modules/mupdate`,
        {
          method: 'PUT',
          body: {
            modules: modulesNotInSyncInSandbox,
          },
        }
      )
    );

    modulesNotInSyncInSandbox.forEach(m =>
      dispatch(moduleActions.setModuleSynced(m.id)));
  },

  createZip: (id: string) => async (dispatch: Function, getState: Function) => {
    dispatch({
      type: CREATE_ZIP,
      id,
    });
    const modules = modulesSelector(getState());
    const directories = directoriesSelector(getState());
    const sandbox = singleSandboxSelector(getState(), { id });

    const createZip = await System.import('./utils/create-zip');

    createZip.default(
      sandbox,
      sandbox.modules.map(x => modules[x]),
      sandbox.directories.map(x => directories[x])
    );
  },
};
