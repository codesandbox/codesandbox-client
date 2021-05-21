import path from 'path';
import fs from 'fs-extra';

import { IFileSystem } from './resolver';

type FileDict = { [filename: string]: string };

class FixtureFileSystem {
  files: FileDict;

  constructor(files: FileDict) {
    this.files = files;
  }

  isFile(filepath: string): Promise<boolean> {
    return Promise.resolve(filepath in this.files);
  }

  async readFile(filepath: string): Promise<string> {
    const fileExists = this.isFile(filepath);
    if (!fileExists) {
      throw new Error('File not found');
    }
    return this.files[filepath];
  }
}

export async function collectFileTree(
  dir: string,
  fileDict: FileDict,
  rootDir: string
): Promise<FileDict> {
  const entries = await fs.readdir(dir);
  await Promise.all(
    entries.map(async entry => {
      const filepath = await fs.realpath(path.join(dir, entry));
      const stats = await fs.stat(filepath);
      const relativeFilePath = `/${path.relative(rootDir, filepath)}`;
      if (stats.isFile()) {
        fileDict[relativeFilePath] = await fs.readFile(filepath, 'utf-8');
      } else if (stats.isDirectory()) {
        await collectFileTree(filepath, fileDict, rootDir);
      }
    })
  );
  return fileDict;
}

export async function setupTestFS(fixtureRoot: string): Promise<IFileSystem> {
  const fileTree = await collectFileTree(fixtureRoot, {}, fixtureRoot);
  return new FixtureFileSystem(fileTree);
}
