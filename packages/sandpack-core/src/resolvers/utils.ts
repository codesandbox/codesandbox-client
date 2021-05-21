/* eslint-disable no-restricted-syntax */
import * as pathUtils from '@codesandbox/common/lib/utils/path';
import { IFileSystem } from './resolver';

export async function findAncestorFile(
  fs: IFileSystem,
  filenames: Array<string>,
  cwd: string,
  rootDir: string = '/'
): Promise<string | null> {
  let currentDirectory = cwd;
  while (currentDirectory.length >= rootDir.length) {
    for (const filename of filenames) {
      const filepath = pathUtils.join(currentDirectory, filename);
      // eslint-disable-next-line no-await-in-loop
      const fileExists = await fs.isFile(filepath);
      if (fileExists) {
        return filepath;
      }
    }

    const parentDir = pathUtils.dirname(currentDirectory);
    if (parentDir === currentDirectory) {
      return null;
    }

    currentDirectory = parentDir;
  }
  return null;
}

export function findAncestorFileSync(
  fs: IFileSystem,
  filenames: Array<string>,
  cwd: string,
  rootDir: string = '/'
): string | null {
  let currentDirectory = cwd;
  while (currentDirectory.length >= rootDir.length) {
    for (const filename of filenames) {
      const filepath = pathUtils.join(currentDirectory, filename);
      const fileExists = fs.isFileSync(filepath);
      if (fileExists) {
        return filepath;
      }
    }

    const parentDir = pathUtils.dirname(currentDirectory);
    if (parentDir === currentDirectory) {
      return null;
    }

    currentDirectory = parentDir;
  }
  return null;
}

export async function findFirstFile(
  fs: IFileSystem,
  filenames: Array<string>
): Promise<string | null> {
  for (const filename of filenames) {
    // eslint-disable-next-line no-await-in-loop
    if (await fs.isFile(filename)) {
      return filename;
    }
  }
  return null;
}

export async function findFirstFileSync(
  fs: IFileSystem,
  filenames: Array<string>
): Promise<string | null> {
  for (const filename of filenames) {
    if (fs.isFileSync(filename)) {
      return filename;
    }
  }
  return null;
}
