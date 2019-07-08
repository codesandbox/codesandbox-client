import { AsyncAction, Action } from 'app/overmind';
import { Module, Directory, Sandbox } from '@codesandbox/common/lib/types';
import { json } from 'overmind';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import getDefinition from '@codesandbox/common/lib/templates';
import { chunk } from 'lodash-es';
import { MAX_FILE_SIZE } from 'codesandbox-import-utils/lib/is-text';
import denormalize from 'codesandbox-import-utils/lib/utils/files/denormalize';
import {
  resolveModuleWrapped,
  resolveDirectoryWrapped,
} from '../../utils/resolve-module-wrapped';

export const recoverFiles: Action = ({ effects, actions, state }) => {
  const sandbox = state.editor.currentSandbox;

  const recoverList = effects.moduleRecover.getRecoverList(
    sandbox.id,
    sandbox.modules
  );
  effects.moduleRecover.clearSandbox(sandbox.id);

  const recoveredList = recoverList
    .map(({ recoverData, module }) => {
      if (module.code === recoverData.savedCode) {
        const titleA = `saved '${module.title}'`;
        const titleB = `recovered '${module.title}'`;
        state.editor.tabs.push({
          type: 'DIFF',
          codeA: module.code || '',
          codeB: recoverData.code || '',
          titleA,
          titleB,
          fileTitle: module.title,
          id: `${titleA} - ${titleB}`,
        });

        actions.editor.codeChanged({
          code: recoverData.code,
          moduleShortid: module.shortid,
        });

        return true;
      }

      return false;
    })
    .filter(Boolean);

  if (recoveredList.length > 0) {
    effects.analytics.track('Files Recovered', {
      fileCount: recoveredList.length,
    });

    effects.notificationToast.add({
      message: `We recovered ${recoveredList.length} unsaved files from a previous session`,
      status: NotificationStatus.NOTICE,
    });
  }
};

export const updateOptimisticDirectory: Action<{
  optimisticDirectory: Directory;
  newDirectory: Directory;
}> = ({ state }, { optimisticDirectory, newDirectory }) => {
  const sandbox = state.editor.currentSandbox;
  const optimisticDirectoryIndex = sandbox.directories.findIndex(
    directory => directory.shortid === optimisticDirectory.shortid
  );

  Object.assign(
    state.editor.sandboxes[sandbox.id].directories[optimisticDirectoryIndex],
    {
      id: newDirectory.id,
      shortid: newDirectory.shortid,
    }
  );
};

export const createOptimisticDirectory: Action<
  {
    title: string;
    directoryShortid?: string;
  },
  Directory
> = ({ state, effects }, { title, directoryShortid }) => {
  const optimisticDirectory = {
    id: effects.utils.createOptimisticId(),
    title,
    directoryShortid: directoryShortid || null,
    shortid: effects.utils.createOptimisticId(),
    sourceId: state.editor.currentSandbox.sourceId,
    insertedAt: new Date().toString(),
    updatedAt: new Date().toString(),
  };

  return optimisticDirectory;
};

export const createOptimisticModule: Action<
  {
    title: string;
    code?: string;
    directoryShortid?: string;
    isBinary?: boolean;
  },
  Module
> = ({ state, effects }, { title, directoryShortid, isBinary, code }) => {
  return {
    id: effects.utils.createOptimisticId(),
    title: title,
    directoryShortid: directoryShortid || null,
    code: code || '',
    savedCode: null,
    shortid: effects.utils.createOptimisticId(),
    isBinary: isBinary === undefined ? false : isBinary,
    sourceId: state.editor.currentSandbox.sourceId,
    insertedAt: new Date().toString(),
    updatedAt: new Date().toString(),
    isNotSynced: true,
  };
};

export const renameDirectory: Action<
  {
    title: string;
    directoryShortid: string;
  },
  string
> = ({ state }, { title, directoryShortid }) => {
  const sandbox = state.editor.currentSandbox;
  const directoryIndex = sandbox.directories.findIndex(
    directoryEntry => directoryEntry.shortid === directoryShortid
  );
  const oldTitle =
    state.editor.sandboxes[sandbox.id].directories[directoryIndex].title;

  state.editor.sandboxes[sandbox.id].directories[directoryIndex].title = title;

  return oldTitle;
};

export const renameModule: Action<
  {
    title: string;
    moduleShortid: string;
  },
  string
> = ({ state }, { title, moduleShortid }) => {
  const sandbox = state.editor.currentSandbox;
  const moduleIndex = sandbox.modules.findIndex(
    moduleEntry => moduleEntry.shortid === moduleShortid
  );
  const oldTitle =
    state.editor.sandboxes[sandbox.id].modules[moduleIndex].title;

  state.editor.sandboxes[sandbox.id].modules[moduleIndex].title = title;

  return oldTitle;
};

export const revertModuleName: Action<{
  title: string;
  moduleShortid: string;
}> = ({ state }, { title, moduleShortid }) => {
  const sandbox = state.editor.currentSandbox;
  const moduleIndex = sandbox.modules.findIndex(
    moduleEntry => moduleEntry.shortid === moduleShortid
  );

  state.editor.sandboxes[sandbox.id].modules[moduleIndex].title = title;
};

export const setDefaultNewCode: Action<Module, string> = (
  { state },
  optimisticModule
) => {
  const sandbox = state.editor.currentSandbox;

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
      return config.generateFileFromState(state);
    } else if (config.generateFileFromSandbox) {
      return config.generateFileFromSandbox(sandbox);
    } else {
      const resolveModule = resolveModuleWrapped(sandbox);

      return config.getDefaultCode(sandbox.template, resolveModule);
    }
  }

  return optimisticModule.code;
};

export const uploadFiles: AsyncAction<
  {
    files: any[];
    directoryShortid: string;
  },
  {
    modules: any;
    directories: any;
  }
> = async ({ effects }, { files, directoryShortid }) => {
  const parsedFiles = {};
  // We first create chunks so we don't overload the server with 100 multiple
  // upload requests
  const filePaths = Object.keys(files);
  const chunkedFilePaths = chunk(filePaths, 5);

  // We traverse all files and upload them when necessary, then add them to the
  // parsedFiles object
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const filePathsChunk of chunkedFilePaths) {
    await Promise.all(
      filePathsChunk.map(async filePath => {
        const file = files[filePath];
        const dataURI = file.dataURI;

        if (
          (/\.(j|t)sx?$/.test(filePath) ||
            /\.coffee$/.test(filePath) ||
            /\.json$/.test(filePath) ||
            /\.html$/.test(filePath) ||
            /\.vue$/.test(filePath) ||
            /\.styl$/.test(filePath) ||
            /\.(le|sc|sa)ss$/.test(filePath) ||
            /\.haml$/.test(filePath) ||
            /\.pug$/.test(filePath) ||
            /\.svg$/.test(filePath) ||
            file.type.startsWith('text/') ||
            file.type === 'application/json') &&
          dataURI.length < MAX_FILE_SIZE
        ) {
          const text = atob(dataURI.replace(/^.*base64,/, ''));
          parsedFiles[filePath] = {
            content: text,
            isBinary: false,
          };
        } else {
          await effects.api
            .post<any>('/users/current_user/uploads', {
              content: dataURI,
              name: filePath,
            })
            .then(data => {
              parsedFiles[filePath] = {
                content: data.url,
                isBinary: true,
              };
            })
            .catch(e => {
              e.message = `Error uploading ${filePath}: ${e.message}`;

              throw e;
            });
        }
      })
    );
  }
  /* eslint-enable */

  // We create a module format that CodeSandbox understands
  const { modules, directories } = denormalize(parsedFiles);

  // If the directory was dropped in a subdirectory we need to shift all
  // the root directories to that directory
  const relativeDirectories = directories.map(dir => {
    if (dir.directoryShortid == null) {
      return {
        ...dir,
        directoryShortid: directoryShortid,
      };
    }

    return dir;
  });

  const relativeModules = modules.map(m => {
    if (m.directoryShortid == null) {
      return {
        ...m,
        directoryShortid: directoryShortid,
      };
    }

    return m;
  });

  // Proceed to give the data for `massCreateModules`
  return {
    modules: relativeModules,
    directories: relativeDirectories,
  };
};

export const processSSEUpdates: Action<{
  updates: any[];
  newSandbox: Sandbox;
}> = ({ state, actions }, { updates, newSandbox }) => {
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
        actions.files.internal.removeModule(oldModule.shortid);
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

        actions.files.internal.removeDirectory(oldDirectory.shortid);
      }
    }
  });
};

export const removeDirectory: Action<string, Directory> = (
  { state },
  directoryShortid
) => {
  const sandbox = state.editor.currentSandbox;
  const directoryIndex = sandbox.directories.findIndex(
    directoryEntry => directoryEntry.shortid === directoryShortid
  );
  const removedDirectory = json(sandbox.directories[directoryIndex]);

  state.editor.sandboxes[sandbox.id].directories.splice(directoryIndex, 1);

  return removedDirectory;
};
