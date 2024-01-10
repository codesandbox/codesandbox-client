import { Context } from 'app/overmind';
import { MAX_FILE_SIZE } from 'codesandbox-import-utils/lib/is-text';
import denormalize from 'codesandbox-import-utils/lib/utils/files/denormalize';
import { chunk } from 'lodash-es';
import { Directory, Sandbox } from '@codesandbox/common/lib/types';
import { getDirectoryPath } from '@codesandbox/common/lib/sandbox/modules';

function b64DecodeUnicode(file: string) {
  // Adding this fixes uploading JSON files with non UTF8-characters
  // https://stackoverflow.com/a/30106551
  return decodeURIComponent(
    atob(file)
      .split('')
      .map(char => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export const recoverFiles = ({ effects, state }: Context) => {
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
    state.editor.recoveredFiles = recoveredList;
    state.currentModal = 'recoveredFiles';
  }
};

export const uploadFiles = async (
  { effects }: Context,
  {
    files,
    directoryShortid,
  }: {
    files: { [k: string]: { dataURI: string; type: string } };
    directoryShortid: string;
  }
) => {
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
            dataURI !== 'data:'
              ? b64DecodeUnicode(dataURI.replace(/^.*base64,/, ''))
              : '';
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

export const renameDirectoryInState = (
  { state, effects }: Context,
  {
    title,
    directory,
    sandbox,
  }: {
    title: string;
    directory: Directory;
    sandbox: Sandbox;
  }
) => {
  const oldPath = directory.path;
  directory.title = title;
  const newPath = getDirectoryPath(
    sandbox.modules,
    sandbox.directories,
    directory.id
  );
  directory.path = newPath;

  effects.vscode.sandboxFsSync.rename(
    state.editor.modulesByPath,
    oldPath!,
    directory.path
  );

  if (oldPath) {
    sandbox.modules.forEach(m => {
      if (m.path && m.path.startsWith(oldPath + '/')) {
        m.path = m.path.replace(oldPath, newPath);
      }
    });
    sandbox.directories.forEach(d => {
      if (d.path && d.path.startsWith(oldPath + '/')) {
        d.path = d.path.replace(oldPath, newPath);
      }
    });
  }
};
