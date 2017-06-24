// @flow
import { values } from 'lodash';

import type { Module, Directory } from 'common/types';

import { createAPIActions, doRequest } from '../../../api/actions';
import moduleEntity from '../modules/entity';
import directoryEntity from '../directories/entity';
import directoryActions from '../directories/actions';
import { modulesSelector } from '../modules/selectors';
import { directoriesSelector } from '../directories/selectors';
import moduleActions from '../modules/actions';
import { singleSandboxSelector } from '../selectors';
import { normalizeResult } from '../../actions';
import notificationActions from '../../../notifications/actions';

import {
  getEquivalentModule,
  getEquivalentDirectory,
  maybeForkSandbox,
} from './fork';

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
        removeChildrenOfDirectory(d.shortid, sandboxId, modules, directories),
      );
    });
};

const renameModule = (id: string, moduleId: string, title: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  let modules = modulesSelector(getState());
  const module = modules[moduleId];
  const sandboxId = await dispatch(maybeForkSandbox(id));
  const isForked = sandboxId !== id;

  // Modules have updated after fork
  modules = modulesSelector(getState());

  const newModule = isForked
    ? getEquivalentModule(module, values(modules)) || module
    : module;
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
};

const renameDirectory = (
  id: string,
  directoryId: string,
  title: string,
) => async (dispatch: Function, getState: Function) => {
  let directories = directoriesSelector(getState());
  const directory = directories[directoryId];
  const sandboxId = await dispatch(maybeForkSandbox(id));
  const isForked = id !== sandboxId;

  // Directories have updated after fork
  directories = directoriesSelector(getState());

  const newDirectory = isForked
    ? getEquivalentDirectory(directory, values(directories)) || directory
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
};

const moveModuleToDirectory = (
  id: string,
  moduleId: string,
  directoryShortid: string,
) => async (dispatch: Function, getState: Function) => {
  let modules = modulesSelector(getState());
  const module = modules[moduleId];
  const sandboxId = await dispatch(maybeForkSandbox(id));
  const isForked = sandboxId !== id;

  // Modules have updated after fork
  modules = modulesSelector(getState());

  const newModule = isForked
    ? getEquivalentModule(module, values(modules)) || module
    : module;
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
};

const moveDirectoryToDirectory = (
  id: string,
  directoryId: string,
  parentId: string,
) => async (dispatch: Function, getState: Function) => {
  let directories = directoriesSelector(getState());
  const directory = directories[directoryId];
  const sandboxId = await dispatch(maybeForkSandbox(id));
  const isForked = id !== sandboxId;

  // Directories have updated after fork
  directories = directoriesSelector(getState());

  const newDirectory = isForked
    ? getEquivalentDirectory(directory, values(directories)) || directory
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
};

const deleteModule = (id: string, moduleId: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  let modules = modulesSelector(getState());
  const module = modules[moduleId];
  const sandboxId = await dispatch(maybeForkSandbox(id));
  const isForked = sandboxId !== id;

  // Modules have updated after fork
  modules = modulesSelector(getState());

  const newModule = isForked
    ? getEquivalentModule(module, values(modules)) || module
    : module;
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
};

const deleteDirectory = (id: string, directoryId: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  let directories = directoriesSelector(getState());
  const directory = directories[directoryId];
  const sandboxId = await dispatch(maybeForkSandbox(id));
  const isForked = id !== sandboxId;

  // Directories have updated after fork
  directories = directoriesSelector(getState());

  const newDirectory = isForked
    ? getEquivalentDirectory(directory, values(directories)) || directory
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
    const sandboxDirectories = sandbox.directories.map(
      did => allDirectories[did],
    );

    // Recursively delete all children
    dispatch(
      removeChildrenOfDirectory(
        newDirectory.shortid,
        sandboxId,
        modules,
        sandboxDirectories,
      ),
    );

    dispatch(
      notificationActions.addNotification('Deleted directory', 'success'),
    );
  } catch (e) {
    // It failed, add it back
    dispatch(addDirectoryToSandbox(sandboxId, newDirectory.id));
  }
};

const createModule = (
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
};

const createDirectory = (
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
};

const saveModuleCode = (id: string, moduleId: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  let modules = modulesSelector(getState());
  const module = modules[moduleId];
  const sandboxId = await dispatch(maybeForkSandbox(id));
  const isForked = sandboxId !== id;

  // Modules have updated after fork
  modules = modulesSelector(getState());

  const newModule = isForked
    ? getEquivalentModule(module, values(modules)) || module
    : module;
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
};
/**
   * Updates all modules in a sandbox at once (only the code)
   */
const massUpdateModules = (id: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  const sandboxId = await dispatch(maybeForkSandbox(id));

  const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
  const modules = modulesSelector(getState());

  const modulesInSandbox = sandbox.modules.map(mid => modules[mid]);
  const modulesNotInSyncInSandbox = modulesInSandbox.filter(m => m.isNotSynced);

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
