import { Gensync } from 'gensync';
import { EMPTY_SHIM } from './constants';

export type FnIsFile = Gensync<(filepath: string) => boolean>;
export type FnReadFile = Gensync<(filepath: string) => string>;

export function* isFile(
  filepath: string,
  isFileFn: FnIsFile
): Generator<any, boolean, any> {
  if (filepath === EMPTY_SHIM) {
    return true;
  }
  return yield* isFileFn(filepath);
}

export function getParentDirectories(
  filepath: string,
  rootDir: string = '/'
): string[] {
  const parts = filepath.split('/');
  const directories = [];
  while (parts.length > 0) {
    const directory = parts.join('/') || '/';
    // Test /foo vs /foo-something - /foo-something is not in rootDir
    if (directory.length < rootDir.length || !directory.startsWith(rootDir)) {
      break;
    }
    directories.push(directory);
    parts.pop();
  }
  return directories;
}
