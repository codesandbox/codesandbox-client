import * as internalActions from './internalActions';
import { Action, AsyncAction } from 'app/overmind';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import getDefinition from '@codesandbox/common/lib/templates';
import {
  resolveModuleWrapped,
  resolveDirectoryWrapped,
} from '../../utils/resolve-module-wrapped';
import denormalize from 'codesandbox-import-utils/lib/utils/files/denormalize';
import { INormalizedModules } from 'codesandbox-import-util-types';
import { ModuleTab } from '@codesandbox/common/lib/types';
import { createOptimisticModule } from 'app/overmind/utils/common';

export const internal = internalActions;

export const moduleRenamed: AsyncAction<{
  title: string;
  shortid: string;
}> = async ({ state, effects, actions }, { title, shortid }) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(module => module.shortid === shortid);
  const oldTitle = module.title;

  module.title = title;

  try {
    await effects.api.saveModuleTitle(sandbox.id, shortid, title);

    if (state.live.isCurrentEditor) {
      effects.live.sendModuleUpdate(shortid, module);
    }
  } catch (error) {
    module.title = oldTitle;
    effects.notificationToast.error('Could not rename file');
  }
};

export const directoryCreated: AsyncAction<{
  title: string;
}> = async ({ state, effects, actions }, { title }) => {
  actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const optimisticDirectory = {
    id: effects.utils.createOptimisticId(),
    title,
    directoryShortid: null,
    shortid: effects.utils.createOptimisticId(),
    sourceId: state.editor.currentSandbox.sourceId,
    insertedAt: new Date().toString(),
    updatedAt: new Date().toString(),
  };

  sandbox.directories.push(optimisticDirectory);

  try {
    const newDirectory = await effects.api.createDirectory(sandbox.id, title);
    const directory = state.editor.currentSandbox.directories.find(
      directory => directory.shortid === optimisticDirectory.shortid
    );

    Object.assign(directory, {
      id: newDirectory.id,
      shortid: newDirectory.shortid,
    });

    effects.live.sendDirectoryCreated(newDirectory.directoryShortid);
  } catch (error) {
    const directoryIndex = state.editor.currentSandbox.directories.findIndex(
      directory => directory.shortid === optimisticDirectory.shortid
    );

    sandbox.directories.splice(directoryIndex, 1);
    effects.notificationToast.error('Unable to save new directory');
  }
};

export const moduleMovedToDirectory: AsyncAction<{
  moduleShortid: string;
  directoryShortid: string;
}> = async (
  { state, effects, actions },
  { moduleShortid, directoryShortid }
) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );
  const currentDirectoryShortid = module.directoryShortid;

  module.directoryShortid = directoryShortid;

  try {
    await effects.api.saveModuleDirectory(
      sandbox.id,
      moduleShortid,
      directoryShortid
    );
    effects.live.sendModuleUpdate(moduleShortid);
  } catch (error) {
    module.directoryShortid = currentDirectoryShortid;

    effects.notificationToast.error('Could not save new module location');
  }
};

export const directoryMovedToDirectory: AsyncAction<{
  fromDirectoryShortid: string;
  toDirectoryShortid: string;
}> = async (
  { state, effects, actions },
  { fromDirectoryShortid, toDirectoryShortid }
) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const fromDirectory = sandbox.directories.find(
    directory => directory.shortid === fromDirectoryShortid
  );

  fromDirectory.directoryShortid = toDirectoryShortid;

  try {
    await effects.api.saveDirectoryDirectory(
      sandbox.id,
      fromDirectoryShortid,
      toDirectoryShortid
    );
    effects.live.sendDirectoryUpdate(toDirectoryShortid);
  } catch (error) {
    fromDirectory.directoryShortid = fromDirectoryShortid;
    effects.notificationToast.error('Could not save new directory location');
  }
};

export const directoryDeleted: AsyncAction<string> = async (
  { state, effects, actions },
  directoryShortid
) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const directory = sandbox.directories.find(
    directory => directory.shortid === directoryShortid
  );
  const removedDirectory = sandbox.directories.splice(
    sandbox.directories.indexOf(directory),
    1
  )[0];

  state.editor.currentModuleShortid = state.editor.mainModule.shortid;

  try {
    await effects.api.deleteDirectory(state.editor.currentId, directoryShortid);
    effects.live.sendDirectoryDeleted(directoryShortid);
  } catch (error) {
    sandbox.directories.push(removedDirectory);
    effects.notificationToast.error('Could not delete directory');
  }
};

export const directoryRenamed: AsyncAction<{
  title: string;
  directoryShortid: string;
}> = async ({ actions, effects, state }, { title, directoryShortid }) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const directory = sandbox.directories.find(
    directoryEntry => directoryEntry.shortid === directoryShortid
  );
  const oldTitle = directory.title;

  directory.title = title;

  try {
    await effects.api.saveDirectoryTitle(sandbox.id, directoryShortid, title);

    if (state.live.isCurrentEditor) {
      effects.live.sendDirectoryUpdate(directoryShortid);
    }
  } catch (error) {
    directory.title = oldTitle;
    effects.notificationToast.error('Could not rename directory');
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
    const uploadedFilesInfo = await effects.api.getUploads();

    state.uploadedFiles = uploadedFilesInfo.uploads;
    state.maxStorage = uploadedFilesInfo.maxSize;
    state.usedStorage = uploadedFilesInfo.currentSize;
  } catch (error) {
    effects.notificationToast.error('Unable to get uploaded files information');
  }
};

export const addedFileToSandbox: Action<{
  url: string;
  name: string;
}> = ({ actions }, { name }) => {
  actions.internal.closeModals(false);
  actions.files.moduleCreated({
    title: name,
  });
};

export const deletedUploadedFile: AsyncAction<string> = async (
  { state, effects },
  id
) => {
  try {
    await effects.api.deleteUploadedFile(id);
    state.uploadedFiles = null;
    // Why are we opening it again?  And what is the message?
    // actions.files.gotUploadedFiles()
  } catch (error) {
    effects.notificationToast.error('Unable to delete uploaded file');
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

    actions.files.massCreateModules({
      modules,
      directories,
      directoryShortid,
    });
  } catch (error) {
    console.error(error);
    if (error.message.indexOf('413') !== -1) {
      return;
    }
    effects.notificationToast.error(error.message);
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
  await actions.editor.internal.ensureSandboxIsOwned();
  const sandboxId = state.editor.currentId;

  try {
    const data = await effects.api.massCreateModules(
      sandboxId,
      directoryShortid,
      modules,
      directories
    );

    state.editor.currentSandbox.modules = state.editor.currentSandbox.modules.concat(
      data.modules
    );
    state.editor.currentSandbox.directories = state.editor.currentSandbox.directories.concat(
      data.directories
    );

    if (state.live.isCurrentEditor) {
      effects.live.sendMassCreatedModules(data.modules, data.directories);
    }
    // Where is the id?
    // effects.vscode.callCallback()
  } catch (error) {
    // Where is the id and message?
    // effects.vscode.callCallbackError()
    effects.notificationToast.error('Unable to create new files');
  }
};

export const moduleCreated: AsyncAction<{
  title: string;
}> = async ({ state, actions, effects }, { title }) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  const sandbox = state.editor.currentSandbox;
  const optimisticModule = createOptimisticModule({
    id: effects.utils.createOptimisticId(),
    title,
    shortid: effects.utils.createOptimisticId(),
    sourceId: sandbox.sourceId,
    isNotSynced: true,
  });
  const path = getModulePath(
    sandbox.modules,
    sandbox.directories,
    optimisticModule.id
  );
  const template = getDefinition(sandbox.template);
  const config = template.configurationFiles[path];

  if (
    config &&
    (config.generateFileFromSandbox ||
      config.getDefaultCode ||
      config.generateFileFromState)
  ) {
    if (config.generateFileFromState) {
      optimisticModule.code = config.generateFileFromState(state);
    } else if (config.generateFileFromSandbox) {
      optimisticModule.code = config.generateFileFromSandbox(sandbox);
    } else {
      const resolveModule = resolveModuleWrapped(sandbox);

      optimisticModule.code = config.getDefaultCode(
        sandbox.template,
        resolveModule
      );
    }
  }

  state.editor.sandboxes[state.editor.currentId].modules.push(optimisticModule);

  try {
    const updatedModule = await effects.api.createModule(
      sandbox.id,
      optimisticModule
    );

    if (state.editor.currentModuleShortid === optimisticModule.shortid) {
      state.editor.currentModuleShortid = optimisticModule.shortid;
    }

    optimisticModule.id = updatedModule.id;
    optimisticModule.shortid = updatedModule.shortid;

    if (state.live.isCurrentEditor) {
      effects.live.sendModuleCreated(optimisticModule.shortid);
    }
  } catch (error) {
    sandbox.modules.splice(sandbox.modules.indexOf(optimisticModule), 1);
    actions.editor.internal.setCurrentModule(state.editor.mainModule);
    effects.notificationToast.error('Unable to save new file');
  }
};

export const moduleDeleted: AsyncAction<string> = async (
  { state, effects },
  moduleShortid
) => {
  const sandbox = state.editor.currentSandbox;
  const moduleToDeleteIndex = sandbox.modules.findIndex(
    module => module.shortid === moduleShortid
  );
  const removedModule = sandbox.modules.splice(moduleToDeleteIndex, 1)[0];

  try {
    await effects.api.deleteModule(sandbox.id, moduleShortid);

    if (state.live.isCurrentEditor) {
      effects.live.sendModuleDeleted(moduleShortid);
    }
  } catch (error) {
    sandbox.modules.push(removedModule);
    effects.notificationToast.error('Could not delete file');
  }
};

export const createModulesByPath: AsyncAction<INormalizedModules> = async (
  { state, actions },
  files
) => {
  const sandbox = state.editor.currentSandbox;

  const { modules, directories } = denormalize(files, sandbox.directories);

  await actions.files.massCreateModules({
    modules,
    directories,
    directoryShortid: null,
  });
};

export const syncSandbox: AsyncAction<any[]> = async (
  { state, effects, actions },
  updates
) => {
  const id = state.editor.currentId;

  try {
    const newSandbox = await effects.api.getSandbox(id);
    const oldSandbox = state.editor.currentSandbox;

    updates.forEach(update => {
      const { op, path, type } = update;

      if (type === 'file') {
        const resolveModuleOld = resolveModuleWrapped(oldSandbox);
        const resolveModuleNew = resolveModuleWrapped(newSandbox);
        const oldModule = resolveModuleOld(path);
        if (op === 'update') {
          const newModule = resolveModuleNew(path);

          if (oldModule) {
            const modulePos = oldSandbox.modules.indexOf(oldModule);
            Object.assign(
              state.editor.sandboxes[oldSandbox.id].modules[modulePos],
              newModule
            );
          } else {
            state.editor.sandboxes[oldSandbox.id].modules.push(newModule);
          }
        } else if (op === 'delete') {
          const oldModule = oldSandbox.modules.find(
            module => module.shortid === oldModule.shortid
          );
          oldSandbox.modules.splice(oldSandbox.modules.indexOf(oldModule), 1);
        }
      } else {
        const resolveDirectoryOld = resolveDirectoryWrapped(oldSandbox);
        const resolveDirectoryNew = resolveDirectoryWrapped(newSandbox);

        if (op === 'update') {
          // Create
          const newDirectory = resolveDirectoryNew(path);
          state.editor.sandboxes[oldSandbox.id].directories.push(newDirectory);
        } else {
          const oldDirectory = resolveDirectoryOld(path);
          const directory = oldSandbox.directories.find(
            directory => directory.shortid === oldDirectory.shortid
          );
          oldSandbox.directories.splice(
            oldSandbox.directories.indexOf(directory),
            1
          );
        }
      }
    });
  } catch (error) {
    if (error.response.status === 404) {
      return;
    }
    effects.notificationToast.error(
      "We weren't able to retrieve the latest files of the sandbox, please refresh"
    );
  }
};

export const removeModule: AsyncAction<string> = async (
  { state, effects, actions },
  moduleShortid
) => {
  await actions.editor.internal.ensureSandboxIsOwned();

  if (state.editor.currentModule.shortid === moduleShortid) {
    actions.editor.internal.setCurrentModule(state.editor.mainModule);
  }

  const sandbox = state.editor.currentSandbox;
  const module = sandbox.modules.find(
    moduleEntry => moduleEntry.shortid === moduleShortid
  );
  const tabs = state.editor.tabs as ModuleTab[];
  const tabIndex = module
    ? tabs.findIndex(tab => tab.moduleShortid === module.shortid)
    : -1;

  if (tabIndex >= 0) {
    actions.internal.closeTabByIndex(tabIndex);
  }

  sandbox.modules.splice(sandbox.modules.indexOf(module), 1);
};

export const removeDirectory: AsyncAction<string> = async (
  { state },
  directoryShortid
) => {
  const sandbox = state.editor.currentSandbox;
  state.editor.currentModuleShortid = state.editor.mainModule.shortid;
  const directory = sandbox.directories.find(
    directory => directory.shortid === directoryShortid
  );
  sandbox.directories.splice(sandbox.directories.indexOf(directory), 1);
};
