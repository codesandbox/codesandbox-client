import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { Action, AsyncAction } from 'app/overmind';
import { MAX_FILE_SIZE } from 'codesandbox-import-utils/lib/is-text';
import denormalize from 'codesandbox-import-utils/lib/utils/files/denormalize';
import { chunk } from 'lodash-es';

export const recoverFiles: Action = ({ effects, actions, state }) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  const recoverList = effects.moduleRecover.getRecoverList(
    sandbox.id,
    sandbox.modules
  );

  const recoveredList = recoverList.reduce((aggr, item) => {
    if (!item) {
      return aggr;
    }
    const { recoverData, module } = item;

    if (module.code !== recoverData.code) {
      return aggr.concat(item);
    }

    return aggr;
  }, [] as typeof recoverList);

  if (recoveredList.length > 0) {
    effects.notificationToast.add({
      sticky: true,
      message: `We recovered ${recoveredList.length} unsaved ${
        recoveredList.length > 1 ? 'files' : 'file'
      } from a previous session, what do you want to do?`,
      actions: {
        primary: [
          {
            label: 'Apply changes',
            run: () => actions.files.applyRecover(recoveredList),
          },
        ],
        secondary: [
          {
            label: 'Compare',
            hideOnClick: true,
            run: () => actions.files.createRecoverDiffs(recoveredList),
          },
          {
            label: 'Discard',
            hideOnClick: true,
            run: () => actions.files.discardRecover(),
          },
        ],
      },
      status: NotificationStatus.NOTICE,
    });
  }
};

export const uploadFiles: AsyncAction<
  {
    files: { [k: string]: { dataURI: string; type: string } };
    directoryShortid: string;
  },
  {
    modules: any;
    directories: any;
  }
> = async ({ effects }, { files, directoryShortid }) => {
  const parsedFiles: {
    [key: string]: { isBinary: boolean; content: string };
  } = {};
  // We first create chunks so we don't overload the server with 100 multiple
  // upload requests
  const filePaths = Object.keys(files);
  const chunkedFilePaths = chunk(filePaths, 5);

  const textExtensions = (await import('textextensions/source/index.json'))
    .default;

  // We traverse all files and upload them when necessary, then add them to the
  // parsedFiles object
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const filePathsChunk of chunkedFilePaths) {
    await Promise.all(
      filePathsChunk.map(async filePath => {
        const file = files[filePath];
        const { dataURI } = file;

        const extension = filePath.split('.').pop();

        if (
          ((extension && textExtensions.includes(extension)) ||
            file.type.startsWith('text/') ||
            file.type === 'application/json') &&
          dataURI.length < MAX_FILE_SIZE
        ) {
          const text =
            dataURI !== 'data:' ? atob(dataURI.replace(/^.*base64,/, '')) : '';
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
