import ts from 'typescript';
import { resolve, join } from 'path';
import * as fs from 'fs';

const writeFile = (path: string, data: string) => {};
const readFile = (path: string, encoding?: string) => {
  let buffer;
  try {
    buffer = fs.readFileSync(path);
  } catch (e) {
    return undefined;
  }
  let len = buffer.length;
  if (len >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    // Big endian UTF-16 byte order mark detected. Since big endian is not supported by node.js,
    // flip all byte pairs and treat as little endian.
    len &= ~1; // Round down to a multiple of 2
    for (let i = 0; i < len; i += 2) {
      const temp = buffer[i];
      buffer[i] = buffer[i + 1];
      buffer[i + 1] = temp;
    }
    return buffer.toString('utf16le', 2);
  }
  if (len >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    // Little endian UTF-16 byte order mark detected
    return buffer.toString('utf16le', 2);
  }
  if (
    len >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    // UTF-8 byte order mark detected
    return buffer.toString('utf8', 3);
  }
  // Default is UTF-8 with no byte order mark
  return buffer.toString('utf8');
};

function fileExists(path: string) {
  try {
    const stat = fs.statSync(path);
    return stat.isFile();
  } catch (e) {
    return false;
  }
}

function directoryExists(path: string) {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

const emptyFileSystemEntries = {
  files: [],
  directories: [],
};

function getAccessibleFileSystemEntries(path: string) {
  try {
    const entries = fs.readdirSync(path || '.', { withFileTypes: true });
    const files = [];
    const directories = [];
    for (let _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      const dirent = entries_1[_i];
      // withFileTypes is not supported before Node 10.10.
      const entry = typeof dirent === 'string' ? dirent : dirent.name;
      // This is necessary because on some file system node fails to exclude
      // "." and "..". See https://github.com/nodejs/node/issues/4002
      if (entry === '.' || entry === '..') {
        continue;
      }
      let stat: fs.Stats | fs.Dirent | undefined = void 0;
      if (typeof dirent === 'string' || dirent.isSymbolicLink()) {
        const name = join(path, entry);
        try {
          stat = fs.statSync(name);
        } catch (e) {
          continue;
        }
      } else {
        stat = dirent;
      }
      if (stat.isFile()) {
        files.push(entry);
      } else if (stat.isDirectory()) {
        directories.push(entry);
      }
    }
    files.sort();
    directories.sort();
    return { files: files, directories: directories };
  } catch (e) {
    return emptyFileSystemEntries;
  }
}

export const createSystem = (): ts.System => {
  return {
    args: [],
    newLine: '\n',
    useCaseSensitiveFileNames: true,
    write: () => {},
    writeFile,
    readFile,
    resolvePath: path => resolve(path),
    fileExists,
    directoryExists,
    createDirectory: () => {},
    getExecutingFilePath() {
      return '/extensions/node_modules/typescript/lib/tsserver.js';
    },
    getCurrentDirectory() {
      return '/sandbox';
    },
    getDirectories(path) {
      return getAccessibleFileSystemEntries(path).directories.slice();
    },
    readDirectory(path, extensions, excludes, includes, depth) {
      // @ts-expect-error Not explicitly mentioned in types
      return ts.matchFiles(
        path,
        extensions,
        excludes,
        includes,
        true,
        this.getCurrentDirectory(),
        depth,
        getAccessibleFileSystemEntries,
        fs.realpath
      );
    },
    exit(exitCode) {
      throw new Error('Exit called with code ' + exitCode);
    },
  };
};
