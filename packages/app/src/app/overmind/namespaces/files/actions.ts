import * as internalActions from './internalActions';
import { Action, AsyncAction } from 'app/overmind';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { Directory, Sandbox } from '@codesandbox/common/lib/types';
import { json } from 'overmind';
import denormalize from 'codesandbox-import-utils/lib/utils/files/denormalize';

export const internal = internalActions;

export const moduleRenamed = internalActions.renameModule;

export const directoryCreated: AsyncAction<{
  title: string;
}> = async ({ state, effects, actions }, { title }) => {
  actions.editor.internal.ensureOwnedEditable();
  const optimisticDirectory = actions.files.internal.createOptimisticDirectory({
    title,
  });
  state.editor.sandboxes[state.editor.currentId].directories.push(
    optimisticDirectory
  );
  const sandboxId = state.editor.currentId;

  try {
    const newDirectory = await effects.api.post<Directory>(
      `/sandboxes/${sandboxId}/directories`,
      {
        directory: {
          title: title,
          directoryShortid: optimisticDirectory.directoryShortid,
        },
      }
    );
    actions.files.internal.updateOptimisticDirectory({
      optimisticDirectory,
      newDirectory,
    });
    actions.live.internal.sendModuleInfo({
      event: 'directory:created',
      type: 'directory',
      directoryShortid: newDirectory.directoryShortid,
    });
  } catch (error) {
    const sandbox = state.editor.currentSandbox;
    const optimisticDirectoryndex = sandbox.directories.findIndex(
      directory => directory.shortid === optimisticDirectory.shortid
    );

    state.editor.sandboxes[sandboxId].directories.splice(
      optimisticDirectoryndex,
      1
    );
    effects.notificationToast.add({
      message: 'Unable to save new directory',
      status: NotificationStatus.ERROR,
    });
  }
};

export const moduleMovedToDirectory: AsyncAction<{
  moduleShortid: string;
  directoryShortid: string;
}> = async (
  { state, effects, actions },
  { moduleShortid, directoryShortid }
) => {
  await actions.editor.internal.ensureOwnedEditable();

  const sandbox = state.editor.currentSandbox;
  const moduleIndex = sandbox.modules.findIndex(
    module => module.shortid === moduleShortid
  );
  const currentDirectoryShortid =
    state.editor.sandboxes[sandbox.id].modules[moduleIndex].directoryShortid;

  state.editor.sandboxes[sandbox.id].modules[
    moduleIndex
  ].directoryShortid = directoryShortid;

  try {
    await effects.api.put(`/sandboxes/${sandbox.id}/modules/${moduleShortid}`, {
      module: { directoryShortid },
    });
    actions.live.internal.sendModuleInfo({
      event: 'module:updated',
      type: 'module',
      moduleShortid,
    });
  } catch (error) {
    const moduleIndex = sandbox.modules.findIndex(
      module => module.shortid === moduleShortid
    );

    state.editor.sandboxes[sandbox.id].modules[
      moduleIndex
    ].directoryShortid = currentDirectoryShortid;

    effects.notificationToast.add({
      message: 'Could not save new module location',
      status: NotificationStatus.ERROR,
    });
  }
};

export const directoryMovedToDirectory: AsyncAction<{
  fromDirectoryShortid: string;
  toDirectoryShortid: string;
}> = async (
  { state, effects, actions },
  { fromDirectoryShortid, toDirectoryShortid }
) => {
  await actions.editor.internal.ensureOwnedEditable();

  const sandbox = state.editor.currentSandbox;
  const directoryIndex = sandbox.directories.findIndex(
    directory => directory.shortid === fromDirectoryShortid
  );

  state.editor.sandboxes[sandbox.id].directories[
    directoryIndex
  ].directoryShortid = toDirectoryShortid;

  try {
    await effects.api.put(
      `/sandboxes/${sandbox.id}/directories/${fromDirectoryShortid}`,
      {
        directory: { directoryShortid: toDirectoryShortid },
      }
    );
    actions.live.internal.sendModuleInfo({
      event: 'directory:updated',
      type: 'directory',
      directoryShortid: toDirectoryShortid,
    });
  } catch (error) {
    state.editor.sandboxes[sandbox.id].directories[
      directoryIndex
    ].directoryShortid = fromDirectoryShortid;
    effects.notificationToast.add({
      message: 'Could not save new directory location',
      status: NotificationStatus.ERROR,
    });
  }
};

export const directoryDeleted: AsyncAction<string> = async (
  { state, effects, actions },
  directoryShortid
) => {
  await actions.editor.internal.ensureOwnedEditable();

  state.editor.currentModuleShortid = state.editor.mainModule.shortid;

  const removedDirectory = actions.files.internal.removeDirectory(
    directoryShortid
  );

  try {
    await effects.api.delete(
      `/sandboxes/${state.editor.currentId}/directories/${removedDirectory.shortid}`
    );
    actions.live.internal.sendModuleInfo(
      {
        event: 'directory:deleted',
        type: 'directory',
        directoryShortid,
      },
      { sendModule: false }
    );
  } catch (error) {
    state.editor.sandboxes[state.editor.currentId].directories.push(
      removedDirectory
    );
    effects.notificationToast.add({
      message: 'Could not delete directory',
      status: NotificationStatus.ERROR,
    });
  }
};

export const directoryRenamed: AsyncAction<{
  title: string;
  directoryShortid: string;
}> = async ({ actions, effects, state }, { title, directoryShortid }) => {
  await actions.editor.internal.ensureOwnedEditable();

  const oldTitle = actions.files.internal.renameDirectory({
    title,
    directoryShortid,
  });

  const sandbox = state.editor.currentSandbox;

  try {
    const sandboxId = state.editor.currentId;

    const directory = sandbox.directories.find(
      directoryEntry => directoryEntry.shortid === directoryShortid
    );

    await effects.api.put(
      `/sandboxes/${sandboxId}/directories/${directory.shortid}`,
      {
        directory: { title },
      }
    );
    actions.live.internal.sendModuleInfo({
      event: 'directory:updated',
      type: 'directory',
      directoryShortid,
    });
  } catch (error) {
    const directoryIndex = sandbox.directories.findIndex(
      directory => directory.shortid === directoryShortid
    );

    state.editor.sandboxes[sandbox.id].directories[
      directoryIndex
    ].title = oldTitle;
    effects.notificationToast.add({
      message: 'Could not rename file',
      status: NotificationStatus.ERROR,
    });
  }
};

export const gotUploadedFiles: AsyncAction<{
  message: string;
}> = async ({ state, effects }, { message }) => {
  const modal = 'storageManagement';
  effects.analytics.track('Open Modal', { modal });
  state.currentModalMessage = message;
  state.currentModal = modal;

  try {
    const uploadedFilesInfo = await effects.api.get<any>(
      '/users/current_user/uploads'
    );

    state.uploadedFiles = uploadedFilesInfo.uploads;
    state.maxStorage = uploadedFilesInfo.maxSize;
    state.usedStorage = uploadedFilesInfo.currentSize;
  } catch (error) {
    effects.notificationToast.add({
      message: 'Unable to get uploaded files information',
      status: NotificationStatus.ERROR,
    });
  }
};

export const addedFileToSandbox: Action<{
  url: string;
  name: string;
}> = ({ state, actions }, { url, name }) => {
  actions.internal.closeModals(false);
  actions.files.moduleCreated({
    title: name,
  });
};

export const deletedUploadedFile: AsyncAction<string> = async (
  { state, actions, effects },
  id
) => {
  try {
    await effects.api.delete(`/users/current_user/uploads/${id}`);
    state.uploadedFiles = null;
    // Why are we opening it again?  And what is the message?
    // actions.files.gotUploadedFiles()
  } catch (error) {
    effects.notificationToast.add({
      message: 'Unable to delete uploaded file',
      status: NotificationStatus.ERROR,
    });
  }
};

export const filesUploaded: AsyncAction<{
  files: any[];
  directoryShortid: string;
}> = async ({ state, effects, actions }, { files, directoryShortid }) => {
  const modal = 'uploading';
  effects.analytics.track('Open Modal', { modal });
  // What message?
  // state.currentModalMessage = message;
  state.currentModal = modal;

  try {
    const { modules, directories } = await actions.files.internal.uploadFiles({
      files,
      directoryShortid,
    });
    state.uploadedFiles = null;

    actions.files.massCreateModules();
  } catch (error) {
    console.error(error);
    if (error.message.indexOf('413') !== -1) {
      return;
    }
    effects.notificationToast.add({
      message: error.message,
      status: NotificationStatus.ERROR,
    });
  }

  actions.internal.closeModals(false);
};

export const massCreateModules: AsyncAction<{
  modules: any;
  directories: any;
  directoryShortid: string;
}> = async (
  { state, effects, actions },
  { modules, directories, directoryShortid }
) => {
  await actions.editor.internal.ensureOwnedEditable();
  const sandboxId = state.editor.currentId;

  try {
    const data = await effects.api.post<any>(
      `/sandboxes/${sandboxId}/modules/mcreate`,
      {
        directoryShortid,
        modules,
        directories,
      }
    );

    state.editor.currentSandbox.modules = state.editor.currentSandbox.modules.concat(
      data.modules
    );
    state.editor.currentSandbox.directories = state.editor.currentSandbox.directories.concat(
      data.directories
    );

    if (state.live.isCurrentEditor) {
      effects.live.send('module:mass-created', {
        directories: data.directories,
        modules: data.modules,
      });
    }
    // Where is the id?
    // effects.vscode.callCallback()
  } catch (error) {
    // Where is the id and message?
    // effects.vscode.callCallbackError()
    effects.notificationToast.add({
      message: 'Unable to create new files',
      status: NotificationStatus.ERROR,
    });
  }
};

export const moduleCreated: AsyncAction<{
  title: string;
}> = async ({ state, actions, effects }, { title }) => {
  await actions.editor.internal.ensureOwnedEditable();

  const optimisticModule = actions.files.internal.createOptimisticModule({
    title,
  });

  optimisticModule.code = actions.files.internal.setDefaultNewCode(
    optimisticModule
  );
  state.editor.sandboxes[state.editor.currentId].modules.push(optimisticModule);

  try {
    const updatedModule = await actions.files.internal.saveNewModule({
      module: optimisticModule,
    });
    actions.files.internal.updateOptimisticModule({
      optimisticModule,
      updatedModule,
    });
    actions.live.internal.sendModuleInfo({
      event: 'module:created',
      type: 'module',
      moduleShortid: updatedModule.shortid,
    });
  } catch (error) {
    actions.files.internal.removeModule(optimisticModule.shortid);
    actions.editor.internal.setCurrentModule(state.editor.mainModule.shortid);
    effects.notificationToast.add({
      message: 'Unable to save new file',
      status: NotificationStatus.ERROR,
    });
  }
};

export const moduleDeleted: AsyncAction<string> = async (
  { state, effects, actions },
  moduleShortid
) => {
  const removedModule = actions.files.internal.removeModule(moduleShortid);

  try {
    const sandboxId = state.editor.currentId;

    await effects.api.delete(
      `/sandboxes/${sandboxId}/modules/${removedModule.shortid}`
    );
    actions.live.internal.sendModuleInfo(
      {
        event: 'module:deleted',
        type: 'module',
        moduleShortid,
      },
      { sendModule: false }
    );
  } catch (error) {
    state.editor.sandboxes[state.editor.currentId].modules.push(removedModule);

    effects.notificationToast.add({
      message: 'Could not delete file',
      status: NotificationStatus.ERROR,
    });
  }
};

export const createModulesByPath: AsyncAction<any[]> = async (
  { state, actions },
  files
) => {
  const sandbox = state.editor.currentSandbox;

  const { modules, directories } = denormalize(files, sandbox.directories);

  await actions.files.massCreateModules({
    modules,
    directories,
  });
};

export const syncSandbox: AsyncAction<any[]> = async (
  { state, effects, actions },
  updates
) => {
  const id = state.editor.currentId;

  try {
    const newSandbox = await effects.api.get<Sandbox>(`/sandboxes/${id}`);

    actions.files.internal.processSSEUpdates({
      newSandbox,
      updates,
    });
  } catch (error) {
    if (error.response.status === 404) {
      return;
    }
    effects.notificationToast.add({
      message:
        "We weren't able to retrieve the latest files of the sandbox, please refresh",
      status: NotificationStatus.ERROR,
    });
  }
};

export const removeModule: AsyncAction<string> = async (
  { state, effects, actions },
  moduleShortid
) => {
  await actions.editor.internal.ensureOwnedEditable();

  if (state.editor.currentModule.shortid === moduleShortid) {
    actions.editor.internal.setCurrentModule(state.editor.mainModule.id);
  }

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(
    moduleEntry => moduleEntry.shortid === moduleShortid
  );
  const tabs = state.editor.tabs;
  const tabIndex = module
    ? tabs.findIndex(tab => tab.moduleShortid === module.shortid)
    : -1;

  if (tabIndex >= 0) {
    actions.internal.closeTabByIndex(tabIndex);
  }

  actions.files.internal.removeModule(moduleShortid);
};

export const removeDirectory: AsyncAction<string> = async (
  { state, actions },
  directoryShortid
) => {
  state.editor.currentModuleShortid = state.editor.mainModule.shortid;
  actions.files.internal.removeDirectory(directoryShortid);
};
