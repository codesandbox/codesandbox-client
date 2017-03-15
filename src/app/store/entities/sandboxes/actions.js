// @flow
import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';
import entity from './entity';
import type { Module } from './modules/entity';
import moduleEntity from './modules/entity';
import moduleActions from './modules/actions';
import type { Directory } from './directories/entity';
import directoryEntity from './directories/entity';
import directoryActions from './directories/actions';
import { sandboxUrl } from '../../../utils/url-generator';
import { singleSandboxSelector } from './selectors';
import { modulesSelector } from './modules/selectors';
import { directoriesSelector } from './directories/selectors';

const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
const FORK_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'FORK');
const CREATE_MODULE_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE_MODULE');
const UPDATE_MODULE_API_ACTIONS = createAPIActions('SANDBOX', 'UPDATE_MODULE');
const DELETE_MODULE_API_ACTIONS = createAPIActions('SANDBOX', 'DELETE_MODULE');
const CREATE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'CREATE_DIRECTORY',
);
const UPDATE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'UPDATE_DIRECTORY',
);
const DELETE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_DIRECTORY',
);

export const REMOVE_MODULE_FROM_SANDBOX = 'REMOVE_MODULE_FROM_SANDBOX';
export const REMOVE_DIRECTORY_FROM_SANDBOX = 'REMOVE_DIRECTORY_FROM_SANDBOX';
export const ADD_MODULE_TO_SANDBOX = 'ADD_MODULE_TO_SANDBOX';
export const ADD_DIRECTORY_TO_SANDBOX = 'ADD_DIRECTORY_TO_SANDBOX';

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
  directoryId,
  sandboxId: string,
  modules: Array<Module>,
  directories: Array<Directory>,
) => dispatch => {
    modules
      .filter(m => m.directoryId === directoryId)
      .forEach(m => dispatch(removeModuleFromSandbox(sandboxId, m.id)));
    directories.filter(d => d.directoryId === directoryId).forEach(d => {
      dispatch(removeDirectoryFromSandbox(sandboxId, d.id));
      dispatch(
        removeChildrenOfDirectory(d.id, sandboxId, modules, directories),
      );
    });
  };

export default {
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

    return sandboxUrl(data);
  },
  forkSandbox: (id: string) => async (dispatch: Function) => {
    const { data } = await dispatch(
      doRequest(FORK_SANDBOX_API_ACTIONS, `sandboxes/${id}/fork`, {
        method: 'POST',
      }),
    );

    await dispatch(normalizeResult(entity, data));

    return sandboxUrl(data);
  },
  createModule: (id: string, title: string, directoryId: ?string) => async (
    dispatch: Function,
  ) => {
    const { data } = await dispatch(
      doRequest(CREATE_MODULE_API_ACTIONS, `sandboxes/${id}/modules`, {
        method: 'POST',
        body: { module: { title, directoryId } },
      }),
    );

    dispatch(normalizeResult(moduleEntity, data));
    dispatch(addModuleToSandbox(id, data.id));
  },
  renameModule: (id: string, moduleId: string, title: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    // Eager rename, just undo it when something goes wrong
    const oldTitle = modulesSelector(getState())[moduleId].title;
    dispatch(moduleActions.renameModule(moduleId, title));

    try {
      await dispatch(
        doRequest(
          UPDATE_MODULE_API_ACTIONS,
          `sandboxes/${id}/modules/${moduleId}`,
          {
            method: 'PUT',
            body: { module: { title } },
          },
        ),
      );
    } catch (e) {
      dispatch(moduleActions.renameModule(moduleId, oldTitle));
    }
  },
  moveModuleToDirectory: (
    sandboxId: string,
    moduleId: string,
    directoryId: string,
  ) => async (dispatch: Function, getState: Function) => {
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
            },
          ),
        );
      } catch (e) {
        dispatch(moduleActions.moveModule(moduleId, oldDirectoryId));
      }
    },
  deleteModule: (sandboxId: string, moduleId: string) => async (
    dispatch: Function,
  ) => {
    // Eager remove it
    dispatch(removeModuleFromSandbox(sandboxId, moduleId));

    try {
      await dispatch(
        doRequest(
          DELETE_MODULE_API_ACTIONS,
          `sandboxes/${sandboxId}/modules/${moduleId}`,
          {
            method: 'DELETE',
          },
        ),
      );
    } catch (e) {
      // It failed, just add it back
      dispatch(addModuleToSandbox(sandboxId, moduleId));
    }
  },
  createDirectory: (id: string, title: string, directoryId: ?string) => async (
    dispatch: Function,
  ) => {
    const { data } = await dispatch(
      doRequest(CREATE_DIRECTORY_API_ACTIONS, `sandboxes/${id}/directories`, {
        method: 'POST',
        body: { directory: { title, directoryId } },
      }),
    );

    dispatch(normalizeResult(directoryEntity, data));
    dispatch(addDirectoryToSandbox(id, data.id));
  },
  renameDirectory: (id: string, directoryId: string, title: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    // Eager rename, just undo it when something goes wrong
    const oldTitle = directoriesSelector(getState())[directoryId].title;
    dispatch(directoryActions.renameDirectory(directoryId, title));

    try {
      await dispatch(
        doRequest(
          UPDATE_DIRECTORY_API_ACTIONS,
          `sandboxes/${id}/directories/${directoryId}`,
          {
            method: 'PUT',
            body: { directory: { title } },
          },
        ),
      );
    } catch (e) {
      dispatch(directoryActions.renameDirectory(directoryId, oldTitle));
    }
  },
  moveDirectoryToDirectory: (
    sandboxId: string,
    directoryId: string,
    parentId: string,
  ) => async (dispatch: Function, getState: Function) => {
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
            },
          ),
        );
      } catch (e) {
        dispatch(directoryActions.moveDirectory(directoryId, oldDirectoryId));
      }
    },
  deleteDirectory: (sandboxId: string, directoryId: string) => async (
    dispatch: Function,
    getState: Function,
  ) => {
    dispatch(removeDirectoryFromSandbox(sandboxId, directoryId));

    try {
      await dispatch(
        doRequest(
          DELETE_DIRECTORY_API_ACTIONS,
          `sandboxes/${sandboxId}/directories/${directoryId}`,
          {
            method: 'DELETE',
          },
        ),
      );

      const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
      const allModules = modulesSelector(getState());
      const allDirectories = directoriesSelector(getState());
      const modules = sandbox.modules.map(id => allModules[id]);
      const directories = sandbox.directories.map(id => allDirectories[id]);

      // Recursively delete all children
      dispatch(
        removeChildrenOfDirectory(directoryId, sandboxId, modules, directories),
      );
    } catch (e) {
      // It failed, add it back
      dispatch(addDirectoryToSandbox(sandboxId, directoryId));
    }
  },
};
