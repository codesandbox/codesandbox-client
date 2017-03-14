// @flow
import { createAPIActions, doRequest } from '../../api/actions';
import { normalizeResult } from '../actions';
import entity from './entity';
import moduleEntity from './modules/entity';
import directoryEntity from './directories/entity';
import { sandboxUrl } from '../../../utils/url-generator';

const SINGLE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'SINGLE');
const CREATE_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE');
const FORK_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'FORK');
const CREATE_MODULE_API_ACTIONS = createAPIActions('SANDBOX', 'CREATE_MODULE');
const DELETE_MODULE_API_ACTIONS = createAPIActions('SANDBOX', 'DELETE_MODULE');
const CREATE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'CREATE_DIRECTORY',
);
const DELETE_DIRECTORY_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'DELETE_DIRECTORY',
);

export const REMOVE_MODULE_FROM_SANDBOX = 'REMOVE_MODULE_FROM_SANDBOX';
export const REMOVE_DIRECTORY_FROM_SANDBOX = 'REMOVE_DIRECTORY_FROM_SANDBOX';
export const REMOVE_DIRECTORY_FROM_SANDBOX_RECURSIVELY = 'REMOVE_DIRECTORY_FROM_SANDBOX_RECURSIVELY';
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
const removeDirectoryFromSandboxRecursively = (id, directoryId) => ({
  type: REMOVE_DIRECTORY_FROM_SANDBOX_RECURSIVELY,
  id,
  directoryId,
});

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

    dispatch(normalizeResult(entity, data));
    dispatch(addDirectoryToSandbox(id, data.id));
  },
  deleteDirectory: (sandboxId: string, directoryId: string) => async (
    dispatch: Function,
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

      // Delete all modules and directories that are a child of this directory
      dispatch(removeDirectoryFromSandboxRecursively(sandboxId, directoryId));
    } catch (e) {
      // It failed, add it back
      dispatch(addDirectoryToSandbox(sandboxId, directoryId));
    }
  },
};
