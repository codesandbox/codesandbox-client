// @flow
import type { Module, Directory } from 'common/types';
import logError from 'app/utils/error';

import { createAPIActions, doRequest } from '../../../api/actions';
import moduleEntity from '../modules/entity';
import directoryEntity from '../directories/entity';
import directoryActions from '../directories/actions';
import { modulesSelector, singleModuleSelector } from '../modules/selectors';
import {
  directoriesSelector,
  singleDirectorySelector,
} from '../directories/selectors';
import moduleActions from '../modules/actions';
import { singleSandboxSelector } from '../selectors';
import { normalizeResult } from '../../actions';
import notificationActions from '../../../notifications/actions';
import { preferencesSelector } from '../../../preferences/selectors';

import { maybeForkSandbox } from './fork';

import sandboxActions from './index';

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

export const REMOVE_DIRECTORY_FROM_SANDBOX = 'REMOVE_DIRECTORY_FROM_SANDBOX';
export const ADD_MODULE_TO_SANDBOX = 'ADD_MODULE_TO_SANDBOX';
export const ADD_DIRECTORY_TO_SANDBOX = 'ADD_DIRECTORY_TO_SANDBOX';
export const REMOVE_MODULE_FROM_SANDBOX = 'REMOVE_MODULE_FROM_SANDBOX';

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
        removeChildrenOfDirectory(d.shortid, sandboxId, modules, directories)
      );
    });
};

const renameModule = (id: string, moduleId: string, title: string) => async (
  dispatch: Function,
  getState: Function
) => {
  const module = singleModuleSelector(getState(), { id: moduleId });
  const sandboxId = await dispatch(maybeForkSandbox(id));

  // Get eventual new source id from forked sandbox
  const { sourceId } = singleSandboxSelector(getState(), { id: sandboxId });

  // Maybe get new module of forked sandbox
  const newModule = singleModuleSelector(getState(), {
    sourceId,
    shortid: module.shortid,
  });
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
        }
      )
    );
  } catch (e) {
    dispatch(moduleActions.renameModule(newModule.id, oldTitle));
  }
};

const renameDirectory = (
  id: string,
  directoryId: string,
  title: string
) => async (dispatch: Function, getState: Function) => {
  const directory = singleDirectorySelector(getState(), { id: directoryId });
  const sandboxId = await dispatch(maybeForkSandbox(id));

  const { sourceId } = singleSandboxSelector(getState(), { id: sandboxId });
  // Get the new directory in case sandbox is forked
  const newDirectory = singleDirectorySelector(getState(), {
    sourceId,
    shortid: directory.shortid,
  });
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
        }
      )
    );
  } catch (e) {
    dispatch(directoryActions.renameDirectory(newDirectory.id, oldTitle));
  }
};

const moveModuleToDirectory = (
  id: string,
  moduleId: string,
  directoryShortid: string
) => async (dispatch: Function, getState: Function) => {
  const module = singleModuleSelector(getState(), { id: moduleId });
  const sandboxId = await dispatch(maybeForkSandbox(id));

  // Get eventual new source id from forked sandbox
  const { sourceId } = singleSandboxSelector(getState(), { id: sandboxId });

  // Maybe get new module of forked sandbox
  const newModule = singleModuleSelector(getState(), {
    sourceId,
    shortid: module.shortid,
  });
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
        }
      )
    );
  } catch (e) {
    dispatch(moduleActions.moveModule(newModule.id, olddirectoryShortid));
  }
};

const moveDirectoryToDirectory = (
  id: string,
  directoryId: string,
  parentId: string
) => async (dispatch: Function, getState: Function) => {
  const directory = singleDirectorySelector(getState(), { id: directoryId });
  const sandboxId = await dispatch(maybeForkSandbox(id));

  const { sourceId } = singleSandboxSelector(getState(), { id: sandboxId });
  // Get the new directory in case sandbox is forked
  const newDirectory = singleDirectorySelector(getState(), {
    sourceId,
    shortid: directory.shortid,
  });
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
        }
      )
    );
  } catch (e) {
    dispatch(
      directoryActions.moveDirectory(newDirectory.id, oldDirectoryShortid)
    );
  }
};

const deleteModule = (id: string, moduleId: string) => async (
  dispatch: Function,
  getState: Function
) => {
  const module = singleModuleSelector(getState(), { id: moduleId });
  const sandboxId = await dispatch(maybeForkSandbox(id));

  // Get eventual new source id from forked sandbox
  const { sourceId } = singleSandboxSelector(getState(), { id: sandboxId });

  // Maybe get new module of forked sandbox
  const newModule = singleModuleSelector(getState(), {
    sourceId,
    shortid: module.shortid,
  });
  // Eager remove it
  dispatch(removeModuleFromSandbox(sandboxId, newModule.id));

  try {
    await dispatch(
      doRequest(
        DELETE_MODULE_API_ACTIONS,
        `sandboxes/${sandboxId}/modules/${newModule.shortid}`,
        {
          method: 'DELETE',
        }
      )
    );
  } catch (e) {
    // It failed, just add it back
    dispatch(addModuleToSandbox(sandboxId, newModule.id));
  }
};

const deleteDirectory = (id: string, directoryId: string) => async (
  dispatch: Function,
  getState: Function
) => {
  const directory = singleDirectorySelector(getState(), { id: directoryId });
  const sandboxId = await dispatch(maybeForkSandbox(id));

  const { sourceId } = singleSandboxSelector(getState(), { id: sandboxId });
  // Get the new directory in case sandbox is forked
  const newDirectory = singleDirectorySelector(getState(), {
    sourceId,
    shortid: directory.shortid,
  });

  dispatch(removeDirectoryFromSandbox(sandboxId, newDirectory.id));

  try {
    await dispatch(
      doRequest(
        DELETE_DIRECTORY_API_ACTIONS,
        `sandboxes/${sandboxId}/directories/${newDirectory.shortid}`,
        {
          method: 'DELETE',
        }
      )
    );

    const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
    const allModules = modulesSelector(getState());
    const allDirectories = directoriesSelector(getState());
    const modules = sandbox.modules.map(mid => allModules[mid]);
    const sandboxDirectories = sandbox.directories.map(
      did => allDirectories[did]
    );

    // Recursively delete all children
    dispatch(
      removeChildrenOfDirectory(
        newDirectory.shortid,
        sandboxId,
        modules,
        sandboxDirectories
      )
    );

    dispatch(
      notificationActions.addNotification('Deleted directory', 'success')
    );
  } catch (e) {
    // It failed, add it back
    dispatch(addDirectoryToSandbox(sandboxId, newDirectory.id));
  }
};

const createModule = (
  id: string,
  title: string,
  directoryShortid: ?string
) => async (dispatch: Function) => {
  const sandboxId = await dispatch(maybeForkSandbox(id));

  const { data } = await dispatch(
    doRequest(CREATE_MODULE_API_ACTIONS, `sandboxes/${sandboxId}/modules`, {
      method: 'POST',
      body: { module: { title, directoryShortid } },
    })
  );

  dispatch(normalizeResult(moduleEntity, data));
  dispatch(addModuleToSandbox(sandboxId, data.id));
  dispatch(sandboxActions.setCurrentModule(sandboxId, data.id));
};

const createDirectory = (
  id: string,
  title: string,
  directoryShortid: ?string
) => async (dispatch: Function) => {
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
};

const saveModuleCode = (id: string, moduleId: string) => async (
  dispatch: Function,
  getState: Function
) => {
  const module = singleModuleSelector(getState(), { id: moduleId });
  const sandboxId = await dispatch(maybeForkSandbox(id));

  // Get eventual new source id from forked sandbox
  const { sourceId } = singleSandboxSelector(getState(), { id: sandboxId });

  // Maybe get new module of forked sandbox
  let newModule = singleModuleSelector(getState(), {
    sourceId,
    shortid: module.shortid,
  });
  dispatch(moduleActions.setCode(newModule.id, module.code));

  const preferences = preferencesSelector(getState());
  if (preferences.prettifyOnSaveEnabled) {
    await dispatch(moduleActions.prettifyModule(newModule.id));
  }
  // For refresh of code we refetch the module
  newModule = singleModuleSelector(getState(), {
    sourceId,
    shortid: module.shortid,
  });

  try {
    const { data } = await dispatch(
      doRequest(
        SAVE_MODULE_CODE_API_ACTIONS,
        `sandboxes/${sandboxId}/modules/${newModule.shortid}`,
        {
          method: 'PUT',
          body: { module: { code: newModule.code } },
        }
      )
    );

    if ((data.code || '') !== (newModule.code || '')) {
      dispatch(
        notificationActions.addNotification(
          'Something went wrong while saving the module, please try again.',
          'error'
        )
      );

      logError(
        new Error(
          `Saving module went wrong, mismatch:\n\n${data.code}\n\nvs\n\n ${
            newModule.code
          }`
        )
      );
    } else {
      dispatch(moduleActions.setModuleSynced(newModule.id));
    }
    return data;
  } catch (e) {
    dispatch(
      notificationActions.addNotification(
        'Could not save the module, please try again.',
        'error'
      )
    );
    e.message = `Could not save module: ${e.message}`;
    logError(e);
  }
  return false;
};
/**
 * Updates all modules in a sandbox at once (only the code)
 */
const massUpdateModules = (id: string) => async (
  dispatch: Function,
  getState: Function
) => {
  // First get the modules that changed, that way we make sure that we don't get
  // the non-updated modules from the forked sandbox to send. The server handles
  // everything by shortid, which means that we can send the old modules to the
  // server since shortids are preserved between forks
  const modules = modulesSelector(getState());
  const sandbox = singleSandboxSelector(getState(), { id });

  const modulesInSandbox = sandbox.modules.map(mid => modules[mid]);
  const modulesNotInSyncInSandbox = modulesInSandbox.filter(m => m.isNotSynced);

  const sandboxId = await dispatch(maybeForkSandbox(id));

  try {
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
    const newSandbox = singleSandboxSelector(getState(), { id: sandboxId });
    modulesNotInSyncInSandbox.forEach(m => {
      const newModule = singleModuleSelector(getState(), {
        shortid: m.shortid,
        sourceId: newSandbox.sourceId,
      });
      // Now we get the equivalent modules of the forked sandbox, if the sandbox is forked
      dispatch(moduleActions.setModuleSynced(newModule.id));
    });
  } catch (e) {
    dispatch(
      notificationActions.addNotification(
        'Could not save the modules, please try again.',
        'error'
      )
    );
  }
};

export default {
  renameModule,
  renameDirectory,
  moveModuleToDirectory,
  moveDirectoryToDirectory,
  deleteModule,
  deleteDirectory,
  createModule,
  createDirectory,
  saveModuleCode,
  massUpdateModules,
};
