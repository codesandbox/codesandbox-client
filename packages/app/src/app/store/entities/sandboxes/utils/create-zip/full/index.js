import type { Sandbox, Module, Directory } from 'common/types';
import { createFile, createDirectoryWithFiles } from '../';

export default async function createZip(
  zip,
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  await Promise.all(
    modules
      .filter(x => x.directoryShortid == null)
      .filter(x => x.title !== 'yarn.lock' && x.title !== 'package-lock.json')
      .map(x => createFile(x, zip))
  );

  await Promise.all(
    directories
      .filter(x => x.directoryShortid == null)
      .map(x => createDirectoryWithFiles(modules, directories, x, zip))
  );

  return zip;
}
