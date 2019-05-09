/**
 * This files serves as a temporary file, it calls the fs api calls so the watches are triggered
 * We will remove this as soon as we moved to fs completely
 */
import fs from 'fs';
import { dirname, join } from 'path';
import {
  getModulePath,
  getDirectoryPath,
} from '@codesandbox/common/lib/sandbox/modules';

const noop = () => {};

export function getCreatePath({ props, state }) {
  const sandbox = state.get('editor.currentSandbox');
  const foundDir = props.directoryShortid
    ? state
        .get('editor.currentSandbox.directories')
        .find(dir => dir.shortid === props.directoryShortid)
    : {};

  if (!foundDir) {
    return undefined;
  }

  const dirPath = getDirectoryPath(
    sandbox.modules,
    sandbox.directories,
    foundDir.id
  );

  if (dirPath !== undefined) {
    return '/sandbox/' + dirPath + (dirPath ? '/' : '') + props.title;
  }

  return undefined;
}

/**
 * Do create file so the watcher of fs is called
 */
export function fsCreateFile({ props, state }) {
  try {
    const foundPath = getCreatePath({ props, state });
    if (foundPath) {
      fs.writeFile(foundPath, props.newCode || '', noop);
    }
  } catch (e) {
    console.error(e);
  }
}

export function fsRemoveFile(id: string, { state }) {
  try {
    const sandbox = state.get('editor.currentSandbox');
    const foundPath = getModulePath(sandbox.modules, sandbox.directories, id);
    if (foundPath) {
      fs.unlink('/sandbox' + foundPath, noop);
    }
  } catch (e) {
    console.error(e);
  }
}

export function fsMoveFile(id: string, oldTitle: string, { state }) {
  try {
    const sandbox = state.get('editor.currentSandbox');
    const foundPath = getModulePath(sandbox.modules, sandbox.directories, id);
    const withPrefix = '/sandbox' + foundPath;
    if (foundPath) {
      fs.rename(join(dirname(withPrefix), oldTitle), withPrefix, noop);
    }
  } catch (e) {
    console.error(e);
  }
}

export function fsMoveDir(id: string, oldTitle: string, { state }) {
  try {
    const sandbox = state.get('editor.currentSandbox');
    const foundPath = getDirectoryPath(
      sandbox.modules,
      sandbox.directories,
      id
    );
    const withPrefix = '/sandbox' + foundPath;
    if (foundPath) {
      fs.rename(join(dirname(withPrefix), oldTitle), withPrefix, noop);
    }
  } catch (e) {
    console.error(e);
  }
}

export function fsCreateDir({ props, state }) {
  try {
    const foundPath = getCreatePath({ props, state });
    if (foundPath) {
      fs.mkdir(foundPath, noop);
    }
  } catch (e) {
    console.error(e);
  }
}

export function fsRemoveDir(id: string, { state }) {
  try {
    const sandbox = state.get('editor.currentSandbox');
    const foundPath = getDirectoryPath(
      sandbox.modules,
      sandbox.directories,
      id
    );
    if (foundPath) {
      fs.rmdir('/sandbox' + foundPath, noop);
    }
  } catch (e) {
    console.error(e);
  }
}
