import { AsyncAction, Action } from 'app/overmind';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';

import { chunk } from 'lodash-es';
import { MAX_FILE_SIZE } from 'codesandbox-import-utils/lib/is-text';
import denormalize from 'codesandbox-import-utils/lib/utils/files/denormalize';
import { DiffTab, TabType } from '@codesandbox/common/lib/types';

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
        const tab: DiffTab = {
          type: TabType.DIFF,
          codeA: module.code || '',
          codeB: recoverData.code || '',
          titleA,
          titleB,
          fileTitle: module.title,
          id: `${titleA} - ${titleB}`,
        };
        state.editor.tabs.push(tab);

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
      message: `We recovered ${
        recoveredList.length
      } unsaved files from a previous session`,
      status: NotificationStatus.NOTICE,
    });
  }
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
        const { dataURI } = file;

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
            /\.md$/.test(filePath) ||
            /\.svelte$/.test(filePath) ||
            file.type.startsWith('text/') ||
            file.type === 'application/json') &&
          dataURI.length < MAX_FILE_SIZE
        ) {
          const text = dataURI ? atob(dataURI.replace(/^.*base64,/, '')) : '';
          parsedFiles[filePath] = {
            content: text,
            isBinary: false,
          };
        } else {
          try {
            const data = await effects.api.createUpload(filePath, dataURI);
            parsedFiles[filePath] = {
              content: data.url,
              isBinary: true,
            };
          } catch (error) {
            error.message = `Error uploading ${filePath}: ${error.message}`;

            throw error;
          }
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
        directoryShortid,
      };
    }

    return dir;
  });

  const relativeModules = modules.map(m => {
    if (m.directoryShortid == null) {
      return {
        ...m,
        directoryShortid,
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
