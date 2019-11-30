import {
  getDirectoryPath,
  getModulePath,
  getModulesAndDirectoriesInDirectory,
} from '@codesandbox/common/lib/sandbox/modules';
import getDefinition from '@codesandbox/common/lib/templates';
import { Directory, Module } from '@codesandbox/common/lib/types';
import { AsyncAction } from 'app/overmind';
import { withOwnedSandbox } from 'app/overmind/factories';
import { createOptimisticModule } from 'app/overmind/utils/common';
import { INormalizedModules } from 'codesandbox-import-util-types';
import denormalize from 'codesandbox-import-utils/lib/utils/files/denormalize';

import {
  resolveDirectoryWrapped,
  resolveModuleWrapped,
} from '../../utils/resolve-module-wrapped';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const moduleRenamed: AsyncAction<{
  title: string;
  moduleShortid: string;
}> = withOwnedSandbox(
  async ({ state, actions, effects }, { title, moduleShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const module = sandbox.modules.find(
      moduleItem => moduleItem.shortid === moduleShortid
    );

    if (!module) {
      return;
    }

    const oldTitle = module.title;
    const oldPath = module.path;

    module.title = title;
    module.path = getModulePath(
      sandbox.modules,
      sandbox.directories,
      module.id
    );

    effects.vscode.sandboxFsSync.rename(
      state.editor.modulesByPath,
      oldPath,
      module.path
    );

    await effects.vscode.updateTabsPath(oldPath, module.path);

    if (state.editor.currentModuleShortid === module.shortid) {
      effects.vscode.openModule(module);
    }

    actions.editor.internal.updatePreviewCode();
    try {
      await effects.api.saveModuleTitle(sandbox.id, moduleShortid, title);

      if (state.live.isCurrentEditor) {
        effects.live.sendModuleUpdate(module);
      }
    } catch (error) {
      module.title = oldTitle;
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);

      if (state.editor.currentModuleShortid === module.shortid) {
        effects.vscode.openModule(module);
      }

      actions.editor.internal.updatePreviewCode();
      effects.notificationToast.error('Could not rename file');
    }
  }
);

export const directoryCreated: AsyncAction<{
  title: string;
  directoryShortid: string;
}> = withOwnedSandbox(
  async ({ state, effects }, { title, directoryShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const optimisticId = effects.utils.createOptimisticId();
    const optimisticDirectory = {
      id: optimisticId,
      title,
      directoryShortid,
      shortid: effects.utils.createOptimisticId(),
      sourceId: state.editor.currentSandbox.sourceId,
      insertedAt: new Date().toString(),
      updatedAt: new Date().toString(),
      type: 'directory' as 'directory',
      path: null,
    };

    sandbox.directories.push(optimisticDirectory as Directory);
    optimisticDirectory.path = getDirectoryPath(
      sandbox.modules,
      sandbox.directories,
      optimisticId
    );

    effects.vscode.sandboxFsSync.mkdir(
      state.editor.modulesByPath,
      optimisticDirectory
    );

    try {
      const newDirectory = await effects.api.createDirectory(
        sandbox.id,
        directoryShortid,
        title
      );
      const directory = state.editor.currentSandbox.directories.find(
        directoryItem => directoryItem.shortid === optimisticDirectory.shortid
      );

      Object.assign(directory, {
        id: newDirectory.id,
        shortid: newDirectory.shortid,
      });

      effects.live.sendDirectoryCreated(directory);
    } catch (error) {
      const directoryIndex = state.editor.currentSandbox.directories.findIndex(
        directoryItem => directoryItem.shortid === optimisticDirectory.shortid
      );

      sandbox.directories.splice(directoryIndex, 1);
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);
      effects.notificationToast.error('Unable to save new directory');
    }
  }
);

export const moduleMovedToDirectory: AsyncAction<{
  moduleShortid: string;
  directoryShortid: string;
}> = withOwnedSandbox(
  async ({ state, actions, effects }, { moduleShortid, directoryShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const module = sandbox.modules.find(
      moduleItem => moduleItem.shortid === moduleShortid
    );

    if (!module) {
      return;
    }

    const currentDirectoryShortid = module.directoryShortid;
    const oldPath = module.path;

    module.directoryShortid = directoryShortid;
    module.path = getModulePath(
      sandbox.modules,
      sandbox.directories,
      module.id
    );

    effects.vscode.sandboxFsSync.rename(
      state.editor.modulesByPath,
      oldPath,
      module.path
    );
    effects.vscode.openModule(module);
    actions.editor.internal.updatePreviewCode();
    try {
      await effects.api.saveModuleDirectory(
        sandbox.id,
        moduleShortid,
        directoryShortid
      );
      effects.live.sendModuleUpdate(module);
    } catch (error) {
      module.directoryShortid = currentDirectoryShortid;
      module.path = oldPath;
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);
      effects.notificationToast.error('Could not save new module location');
    }
  }
);

export const directoryMovedToDirectory: AsyncAction<{
  shortid: string;
  directoryShortid: string;
}> = withOwnedSandbox(
  async ({ state, actions, effects }, { shortid, directoryShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const directoryToMove = sandbox.directories.find(
      directoryItem => directoryItem.shortid === shortid
    );

    if (!directoryToMove) {
      return;
    }

    const oldPath = directoryToMove.path;

    directoryToMove.directoryShortid = directoryShortid;
    directoryToMove.path = getDirectoryPath(
      sandbox.modules,
      sandbox.directories,
      directoryToMove.id
    );

    // We have to recreate the whole thing as many files and folders
    // might have changed their path
    state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);
    actions.editor.internal.updatePreviewCode();
    try {
      await effects.api.saveDirectoryDirectory(
        sandbox.id,
        shortid,
        directoryShortid
      );
      effects.live.sendDirectoryUpdate(directoryToMove);
    } catch (error) {
      directoryToMove.directoryShortid = shortid;
      directoryToMove.path = oldPath;
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);
      effects.notificationToast.error('Could not save new directory location');
    }
  }
);

export const directoryDeleted: AsyncAction<{
  directoryShortid;
}> = withOwnedSandbox(
  async ({ state, actions, effects }, { directoryShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const directory = sandbox.directories.find(
      directoryItem => directoryItem.shortid === directoryShortid
    );

    if (!directory) {
      return;
    }

    const removedDirectory = sandbox.directories.splice(
      sandbox.directories.indexOf(directory),
      1
    )[0];
    const {
      removedModules,
      removedDirectories,
    } = getModulesAndDirectoriesInDirectory(
      removedDirectory,
      sandbox.modules,
      sandbox.directories
    );

    removedModules.forEach(removedModule => {
      effects.vscode.sandboxFsSync.unlink(
        state.editor.modulesByPath,
        removedModule
      );
      sandbox.modules.splice(sandbox.modules.indexOf(removedModule), 1);
    });

    removedDirectories.forEach(removedDirectoryItem => {
      sandbox.directories.splice(
        sandbox.directories.indexOf(removedDirectoryItem),
        1
      );
    });

    // We open the main module as we do not really know if you had opened
    // any nested file of this directory. It would require complex logic
    // to figure that out. This concept is soon removed anyways
    effects.vscode.openModule(state.editor.mainModule);
    actions.editor.internal.updatePreviewCode();
    try {
      await effects.api.deleteDirectory(sandbox.id, directoryShortid);
      effects.live.sendDirectoryDeleted(directoryShortid);
    } catch (error) {
      sandbox.directories.push(removedDirectory);
      removedModules.forEach(removedModule => {
        sandbox.modules.push(removedModule);
      });
      removedDirectories.forEach(removedDirectoryItem => {
        sandbox.directories.push(removedDirectoryItem);
      });
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);
      effects.notificationToast.error('Could not delete directory');
    }
  }
);

export const directoryRenamed: AsyncAction<{
  title: string;
  directoryShortid: string;
}> = withOwnedSandbox(
  async ({ effects, actions, state }, { title, directoryShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const directory = sandbox.directories.find(
      directoryEntry => directoryEntry.shortid === directoryShortid
    );

    if (!directory) {
      return;
    }

    const oldTitle = directory.title;
    const oldPath = directory.path;

    directory.title = title;
    directory.path = getDirectoryPath(
      sandbox.modules,
      sandbox.directories,
      directory.id
    );

    effects.vscode.sandboxFsSync.rename(
      state.editor.modulesByPath,
      oldPath,
      directory.path
    );
    actions.editor.internal.updatePreviewCode();
    try {
      await effects.api.saveDirectoryTitle(sandbox.id, directoryShortid, title);

      if (state.live.isCurrentEditor) {
        effects.live.sendDirectoryUpdate(directory);
      }
    } catch (error) {
      directory.title = oldTitle;
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);
      effects.notificationToast.error('Could not rename directory');
    }
  }
);

export const gotUploadedFiles: AsyncAction<string> = async (
  { state, effects },
  message
) => {
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

export const addedFileToSandbox: AsyncAction<{
  url: string;
  name: string;
}> = withOwnedSandbox(async ({ actions }, { name, url }) => {
  actions.internal.closeModals(false);
  await actions.files.moduleCreated({
    title: name,
    directoryShortid: null,
    code: url,
    isBinary: true,
  });
});

export const deletedUploadedFile: AsyncAction<{
  id: string;
}> = withOwnedSandbox(async ({ state, effects }, { id }) => {
  const index = state.uploadedFiles.findIndex(file => file.id === id);
  const removedFiles = state.uploadedFiles.splice(index, 1);

  try {
    await effects.api.deleteUploadedFile(id);
  } catch (error) {
    state.uploadedFiles.splice(index, 0, ...removedFiles);
    effects.notificationToast.error('Unable to delete uploaded file');
  }
});

export const filesUploaded: AsyncAction<{
  files: any[];
  directoryShortid: string;
}> = withOwnedSandbox(
  async ({ state, effects, actions }, { files, directoryShortid }) => {
    const modal = 'uploading';
    effects.analytics.track('Open Modal', { modal });
    // What message?
    // state.currentModalMessage = message;
    state.currentModal = modal;

    try {
      const { modules, directories } = await actions.files.internal.uploadFiles(
        {
          files,
          directoryShortid,
        }
      );

      actions.files.massCreateModules({
        modules,
        directories,
        directoryShortid,
      });
    } catch (error) {
      if (error.message.indexOf('413') !== -1) {
        return;
      }
      effects.notificationToast.error(error.message);
    }

    actions.internal.closeModals(false);
  }
);

export const massCreateModules: AsyncAction<{
  modules: any;
  directories: any;
  directoryShortid: string | null;
  cbID?: string;
}> = withOwnedSandbox(
  async (
    { state, actions, effects },
    { modules, directories, directoryShortid, cbID }
  ) => {
    const sandboxId = state.editor.currentSandbox.id;

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

      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(
        state.editor.currentSandbox
      );

      actions.editor.internal.updatePreviewCode();

      // This can happen if you have selected a deleted file in VSCode and try to save it,
      // we want to select it again
      if (!state.editor.currentModuleShortid) {
        const lastAddedModule =
          state.editor.currentSandbox.modules[
            state.editor.currentSandbox.modules.length - 1
          ];

        actions.editor.internal.setCurrentModule(lastAddedModule);
      }

      if (state.live.isCurrentEditor) {
        effects.live.sendMassCreatedModules(data.modules, data.directories);
      }

      if (cbID) {
        effects.vscode.callCallback(cbID);
      }
    } catch (error) {
      if (cbID) {
        effects.vscode.callCallbackError(cbID, error.message);
      }

      effects.notificationToast.error('Unable to create new files');
    }
  }
);

export const moduleCreated: AsyncAction<{
  title: string;
  directoryShortid: string | null;
  code?: string;
  isBinary?: boolean;
}> = withOwnedSandbox(
  async (
    { state, actions, effects },
    { title, directoryShortid, code, isBinary }
  ) => {
    const sandbox = state.editor.currentSandbox;
    const optimisticId = effects.utils.createOptimisticId();
    const optimisticModule = createOptimisticModule({
      id: optimisticId,
      title,
      directoryShortid: directoryShortid || null,
      shortid: effects.utils.createOptimisticId(),
      sourceId: sandbox.sourceId,
      isNotSynced: true,
      ...(code ? { code } : {}),
      ...(typeof isBinary === 'boolean' ? { isBinary } : {}),
    });

    // We have to push the module to the array before we can figure out its path,
    // this is all changing soon
    sandbox.modules.push(optimisticModule as Module);
    optimisticModule.path = getModulePath(
      sandbox.modules,
      sandbox.directories,
      optimisticId
    );

    // We grab the module from the state to continue working with it (proxy)
    const module = sandbox.modules[sandbox.modules.length - 1];

    const template = getDefinition(sandbox.template);
    const config = template.configurationFiles[module.path];

    if (
      config &&
      (config.generateFileFromSandbox ||
        config.getDefaultCode ||
        config.generateFileFromState)
    ) {
      if (config.generateFileFromState) {
        module.code = config.generateFileFromState(
          state.preferences.settings.prettierConfig
        );
      } else if (config.generateFileFromSandbox) {
        module.code = config.generateFileFromSandbox(sandbox);
      } else if (config.getDefaultCode) {
        const resolveModule = resolveModuleWrapped(sandbox);

        module.code = config.getDefaultCode(sandbox.template, resolveModule);
      }
    }

    effects.vscode.sandboxFsSync.appendFile(state.editor.modulesByPath, module);
    actions.editor.internal.setCurrentModule(module);

    try {
      const updatedModule = await effects.api.createModule(sandbox.id, module);

      module.id = updatedModule.id;
      module.shortid = updatedModule.shortid;

      effects.vscode.sandboxFsSync.writeFile(
        state.editor.modulesByPath,
        module
      );
      state.editor.currentModuleShortid = module.shortid;

      if (state.live.isCurrentEditor) {
        effects.live.sendModuleCreated(module);
      }
    } catch (error) {
      sandbox.modules.splice(sandbox.modules.indexOf(module), 1);
      actions.editor.internal.setCurrentModule(state.editor.mainModule);
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);

      effects.notificationToast.error('Unable to save new file');
    }
  }
);

export const moduleDeleted: AsyncAction<{
  moduleShortid: string;
}> = withOwnedSandbox(
  async ({ state, effects, actions }, { moduleShortid }) => {
    const sandbox = state.editor.currentSandbox;
    const moduleToDeleteIndex = sandbox.modules.findIndex(
      module => module.shortid === moduleShortid
    );
    const removedModule = sandbox.modules.splice(moduleToDeleteIndex, 1)[0];
    const wasCurrentModule =
      state.editor.currentModuleShortid === moduleShortid;

    effects.vscode.sandboxFsSync.unlink(
      state.editor.modulesByPath,
      removedModule
    );

    if (wasCurrentModule) {
      actions.editor.internal.setCurrentModule(state.editor.mainModule);
    }

    actions.editor.internal.updatePreviewCode();

    try {
      await effects.api.deleteModule(sandbox.id, moduleShortid);

      if (state.live.isCurrentEditor) {
        effects.live.sendModuleDeleted(moduleShortid);
      }
    } catch (error) {
      sandbox.modules.push(removedModule);
      state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);
      effects.notificationToast.error('Could not delete file');
    }
  }
);

export const createModulesByPath: AsyncAction<{
  cbID: string;
  files: INormalizedModules;
}> = async ({ state, actions }, { files, cbID }) => {
  const sandbox = state.editor.currentSandbox;

  const { modules, directories } = denormalize(files, sandbox.directories);

  await actions.files.massCreateModules({
    modules,
    directories,
    directoryShortid: null,
    cbID,
  });
};

export const syncSandbox: AsyncAction<any[]> = async (
  { state, effects },
  updates
) => {
  const { id } = state.editor.currentSandbox;

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

          if (newModule) {
            if (oldModule) {
              const modulePos = oldSandbox.modules.indexOf(oldModule);
              Object.assign(
                state.editor.sandboxes[oldSandbox.id].modules[modulePos],
                newModule
              );
            } else {
              state.editor.sandboxes[oldSandbox.id].modules.push(newModule);
            }
          }
        } else if (op === 'delete' && oldModule) {
          oldSandbox.modules.splice(oldSandbox.modules.indexOf(oldModule), 1);
        }
      } else {
        const resolveDirectoryOld = resolveDirectoryWrapped(oldSandbox);
        const resolveDirectoryNew = resolveDirectoryWrapped(newSandbox);

        if (op === 'update') {
          // Create
          const newDirectory = resolveDirectoryNew(path);
          if (newDirectory) {
            state.editor.sandboxes[oldSandbox.id].directories.push(
              newDirectory
            );
          }
        } else {
          const oldDirectory = resolveDirectoryOld(path);
          if (oldDirectory) {
            const directory = oldSandbox.directories.find(
              directoryItem => directoryItem.shortid === oldDirectory.shortid
            );
            if (directory) {
              oldSandbox.directories.splice(
                oldSandbox.directories.indexOf(directory),
                1
              );
            }
          }
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

  // No matter if error or not we resync the whole shabang!
  state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(
    state.editor.currentSandbox
  );
};
