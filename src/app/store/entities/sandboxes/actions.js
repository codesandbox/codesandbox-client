// @flow
import { push } from 'react-router-redux';
import type { Module, Directory } from 'common/types';
import { values } from 'lodash';

import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';
import notificationActions from '../../notifications/actions';
import entity from './entity';
import fetchBundle from './bundler';
import moduleEntity from './modules/entity';
import moduleActions from './modules/actions';
import directoryEntity from './directories/entity';
import directoryActions from './directories/actions';
import { singleSandboxSelector } from './selectors';
import { modulesSelector } from './modules/selectors';
import { directoriesSelector } from './directories/selectors';
import { sandboxUrl, newSandboxUrl } from '../../../utils/url-generator';
import errorActions from './errors/actions';

export const FETCH_BUNDLE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'FETCH_BUNDLE',
);
export const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
export const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
export const DELETE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'DELETE');
export const UPDATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'UPDATE');
export const FORK_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'FORK');
export const CREATE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'CREATE_MODULE',
);
export const SAVE_MODULE_CODE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'SAVE_MODULE_CODE',
);
export const UPDATE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_MODULE',
);
export const MASS_UPDATE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'MASS_UPDATE_MODULE',
);
export const DELETE_MODULE_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_MODULE',
);
export const CREATE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'CREATE_DIRECTORY',
);
export const UPDATE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_DIRECTORY',
);
export const DELETE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_DIRECTORY',
);
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

export const REMOVE_MODULE_FROM_SANDBOX = 'REMOVE_MODULE_FROM_SANDBOX';
export const SET_SANDBOX_INFO = 'SET_SANDBOX_INFO';
export const REMOVE_DIRECTORY_FROM_SANDBOX = 'REMOVE_DIRECTORY_FROM_SANDBOX';
export const ADD_MODULE_TO_SANDBOX = 'ADD_MODULE_TO_SANDBOX';
export const ADD_DIRECTORY_TO_SANDBOX = 'ADD_DIRECTORY_TO_SANDBOX';
export const SET_NPM_DEPENDENCIES = 'SET_NPM_DEPENDENCIES';
export const SET_EXTERNAL_RESOURCES = 'SET_EXTERNAL_RESOURCES';
export const SET_CURRENT_MODULE = 'SET_CURRENT_MODULE';
export const SET_BUNDLE = 'SET_BUNDLE';
export const CANCEL_BUNDLE = 'CANCEL_BUNDLE';
export const SET_PROJECT_VIEW = 'SET_PROJECT_VIEW';
export const SET_VIEW_MODE = 'SET_VIEW_MODE';
export const CREATE_ZIP = 'CREATE_ZIP';

/**
 * When you fork you get a 'copy' of the modules, these modules have the shortid
 * in common, so if we want to get the module that is equivalent we want to use
 * this
 */
const getEquivalentModule = (module, getState) => {
  const modules = modulesSelector(getState());

  const newModule = values(modules).find(
    m => m.id !== module.id && m.shortid === module.shortid,
  );

  if (!newModule) return module;

  return newModule;
};

/**
 * When you fork you get a 'copy' of the directories, these directories have the shortid
 * in common, so if we want to get the directory that is equivalent we want to use
 * this
 */
const getEquivalentDirectory = (directory, getState) => {
  const directories = directoriesSelector(getState());

  const newDirectory = values(directories).find(
    d => d.id !== directory.id && d.shortid === directory.shortid,
  );

  if (!newDirectory) return directory;

  return newDirectory;
};

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

const forkSandbox = (id: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  const { data } = await dispatch(
    doRequest(FORK_SANDBOX_API_ACTIONS, `sandboxes/${id}/fork`, {
      method: 'POST',
    }),
  );

  const currentSandbox = singleSandboxSelector(getState(), { id });
  if (currentSandbox) {
    data.currentModule = currentSandbox.currentModule;
  }
  data.forked = true;

  // Save the unsaved modules
  const oldModules = currentSandbox.modules.map(
    x => modulesSelector(getState())[x],
  );
  await dispatch(normalizeResult(entity, data));

  // Set the code for the new modules from the old modules
  oldModules.filter(m => m.isNotSynced).forEach(m => {
    // Mark old modules as synced so there is no confirm when moving to new url
    dispatch(moduleActions.setModuleSynced(m.id));

    const newModule = getEquivalentModule(m, getState);
    dispatch(moduleActions.setCode(newModule.id, m.code));
  });

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
  getState: Function,
) => {
  const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
  if (sandbox.owned) {
    // We own the sandbox, so return the id and don't fork
    return sandbox.id;
  }

  const forkedSandbox = await dispatch(forkSandbox(sandbox.id));

  return forkedSandbox.id;
};

const removeChildrenOfDirectory = (
  directoryShortid,
  sandboxId: string,
  modules: Array<Module>,
  directories: Array<Directory>,
) => dispatch => {
  modules
    .filter(m => m.directoryShortid === directoryShortid)
    .forEach(m => dispatch(removeModuleFromSandbox(sandboxId, m.id)));
  directories
    .filter(d => d.directoryShortid === directoryShortid)
    .forEach(d => {
      dispatch(removeDirectoryFromSandbox(sandboxId, d.id));
      dispatch(
        removeChildrenOfDirectory(d.id, sandboxId, modules, directories),
      );
    });
};

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

  createModule: (
    id: string,
    title: string,
    directoryShortid: ?string,
  ) => async (dispatch: Function) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const { data } = await dispatch(
      doRequest(CREATE_MODULE_API_ACTIONS, `sandboxes/${sandboxId}/modules`, {
        method: 'POST',
        body: { module: { title, directoryShortid } },
      }),
    );

    dispatch(normalizeResult(moduleEntity, data));
    dispatch(addModuleToSandbox(sandboxId, data.id));
  },

  saveModuleCode: (id: string, moduleId: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    const module = modulesSelector(getState())[moduleId];
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const isForked = sandboxId !== id;

    const newModule = isForked ? getEquivalentModule(module, getState) : module;
    dispatch(moduleActions.setCode(newModule.id, module.code));

    await dispatch(
      doRequest(
        SAVE_MODULE_CODE_API_ACTIONS,
        `sandboxes/${sandboxId}/modules/${module.shortid}`,
        {
          method: 'PUT',
          body: { module: { code: module.code } },
        },
      ),
    );

    dispatch(moduleActions.setModuleSynced(newModule.id));
  },

  renameModule: (id: string, moduleId: string, title: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    const module = modulesSelector(getState())[moduleId];
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const isForked = sandboxId !== id;

    const newModule = isForked ? getEquivalentModule(module, getState) : module;
    // Eager rename, just undo it when something goes wrong
    const oldTitle = module.title;
    dispatch(moduleActions.renameModule(newModule.id, title));

    try {
      await dispatch(
        doRequest(
          UPDATE_MODULE_API_ACTIONS,
          `sandboxes/${sandboxId}/modules/${module.shortid}`,
          {
            method: 'PUT',
            body: { module: { title } },
          },
        ),
      );
    } catch (e) {
      dispatch(moduleActions.renameModule(newModule.id, oldTitle));
    }
  },

  moveModuleToDirectory: (
    id: string,
    moduleId: string,
    directoryShortid: string,
  ) => async (dispatch: Function, getState: Function) => {
    const module = modulesSelector(getState())[moduleId];
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const isForked = sandboxId !== id;

    const newModule = isForked ? getEquivalentModule(module, getState) : module;
    // Eager move it
    const olddirectoryShortid = module.directoryShortid;
    dispatch(moduleActions.moveModule(newModule.id, directoryShortid));

    try {
      await dispatch(
        doRequest(
          UPDATE_MODULE_API_ACTIONS,
          `sandboxes/${sandboxId}/modules/${newModule.shortid}`,
          {
            method: 'PUT',
            body: { module: { directoryShortid } },
          },
        ),
      );
    } catch (e) {
      dispatch(moduleActions.moveModule(newModule.id, olddirectoryShortid));
    }
  },

  deleteModule: (id: string, moduleId: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    const module = modulesSelector(getState())[moduleId];
    const sandboxId = await dispatch(maybeForkSandbox(id));
    const isForked = sandboxId !== id;

    const newModule = isForked ? getEquivalentModule(module, getState) : module;
    // Eager remove it
    dispatch(removeModuleFromSandbox(sandboxId, newModule.id));

    try {
      await dispatch(
        doRequest(
          DELETE_MODULE_API_ACTIONS,
          `sandboxes/${sandboxId}/modules/${newModule.shortid}`,
          {
            method: 'DELETE',
          },
        ),
      );
    } catch (e) {
      // It failed, just add it back
      dispatch(addModuleToSandbox(sandboxId, newModule.id));
    }
  },

  createDirectory: (
    id: string,
    title: string,
    directoryShortid: ?string,
  ) => async (dispatch: Function) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const { data } = await dispatch(
      doRequest(
        CREATE_DIRECTORY_API_ACTIONS,
        `sandboxes/${sandboxId}/directories`,
        {
          method: 'POST',
          body: { directory: { title, directoryShortid } },
        },
      ),
    );

    dispatch(normalizeResult(directoryEntity, data));
    dispatch(addDirectoryToSandbox(sandboxId, data.id));
  },

  renameDirectory: (id: string, directoryId: string, title: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    const directory = directoriesSelector(getState())[directoryId];
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const isForked = id !== sandboxId;

    const newDirectory = isForked
      ? getEquivalentDirectory(directory, getState)
      : directory;
    // Eager rename, just undo it when something goes wrong
    const oldTitle = directory.title;
    dispatch(directoryActions.renameDirectory(newDirectory.id, title));

    try {
      await dispatch(
        doRequest(
          UPDATE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories/${newDirectory.shortid}`,
          {
            method: 'PUT',
            body: { directory: { title } },
          },
        ),
      );
    } catch (e) {
      dispatch(directoryActions.renameDirectory(newDirectory.id, oldTitle));
    }
  },

  moveDirectoryToDirectory: (
    id: string,
    directoryId: string,
    parentId: string,
  ) => async (dispatch: Function, getState: Function) => {
    const directory = directoriesSelector(getState())[directoryId];
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const isForked = id !== sandboxId;

    const newDirectory = isForked
      ? getEquivalentDirectory(directory, getState)
      : directory;
    // Eager move it
    const oldDirectoryShortid = directory.directoryShortid;
    dispatch(directoryActions.moveDirectory(newDirectory.id, parentId));

    try {
      await dispatch(
        doRequest(
          UPDATE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories/${newDirectory.shortid}`,
          {
            method: 'PUT',
            body: { directory: { directoryShortid: parentId } },
          },
        ),
      );
    } catch (e) {
      dispatch(
        directoryActions.moveDirectory(newDirectory.id, oldDirectoryShortid),
      );
    }
  },

  deleteDirectory: (id: string, directoryId: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    const directory = directoriesSelector(getState())[directoryId];
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const isForked = id !== sandboxId;

    const newDirectory = isForked
      ? getEquivalentDirectory(directory, getState)
      : directory;

    dispatch(removeDirectoryFromSandbox(sandboxId, newDirectory.id));

    try {
      await dispatch(
        doRequest(
          DELETE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories/${newDirectory.shortid}`,
          {
            method: 'DELETE',
          },
        ),
      );

      const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
      const allModules = modulesSelector(getState());
      const allDirectories = directoriesSelector(getState());
      const modules = sandbox.modules.map(mid => allModules[mid]);
      const directories = sandbox.directories.map(did => allDirectories[did]);

      // Recursively delete all children
      dispatch(
        removeChildrenOfDirectory(
          newDirectory.id,
          sandboxId,
          modules,
          directories,
        ),
      );

      dispatch(
        notificationActions.addNotification('Deleted directory', 'success'),
      );
    } catch (e) {
      // It failed, add it back
      dispatch(addDirectoryToSandbox(sandboxId, newDirectory.id));
    }
  },

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

  /**
   * Updates all modules in a sandbox at once (only the code)
   */
  massUpdateModules: (id: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    const sandboxId = await dispatch(maybeForkSandbox(id));

    const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
    const modules = modulesSelector(getState());

    const modulesInSandbox = sandbox.modules.map(mid => modules[mid]);
    const modulesNotInSyncInSandbox = modulesInSandbox.filter(
      m => m.isNotSynced,
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
        },
      ),
    );

    modulesNotInSyncInSandbox.forEach(m =>
      dispatch(moduleActions.setModuleSynced(m.id)),
    );
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
};
