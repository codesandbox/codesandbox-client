import { Sandbox, Module, Directory } from '@codesandbox/common/lib/types';
import { createFile, createDirectoryWithFiles } from '..';

export default async function createZip(
  zip,
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>,
  downloadBlobs: boolean
) {
  await Promise.all(
    modules
      .filter(x => x.directoryShortid == null)
      .map(x => createFile(x, zip, downloadBlobs))
  );

  await Promise.all(
    directories
      .filter(x => x.directoryShortid == null)
      .map(x =>
        createDirectoryWithFiles(modules, directories, x, zip, downloadBlobs)
      )
  );

  return zip;
}
