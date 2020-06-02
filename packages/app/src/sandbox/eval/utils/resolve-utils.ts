import { join } from 'path';
import Cache from 'lru-cache';
import { PackageJSON } from '@codesandbox/common/lib/types';

const pkgCache = new Cache<string, PackageJSON>(10000);

function replaceModuleField(
  isFile: (p: string) => boolean,
  p: PackageJSON,
  pkgLocation: string
): PackageJSON {
  const checks = [
    [pkgLocation, p.module],
    [pkgLocation, p.module, 'index.js'],
    [pkgLocation, p.module, 'index.mjs'],
  ];
  if (p.module) {
    const foundFile = checks.find(pathSegments => {
      const path = join(...pathSegments);
      return isFile(path);
    });

    if (foundFile) {
      // eslint-disable-next-line
      p.main = p.module;
    }
  }

  return p;
}

export const packageFilter = (isFile: (p: string) => boolean) => (
  p: PackageJSON,
  pkgLocation: string
) => {
  const id = p.name + p.version;
  const cache = pkgCache.get(id);

  if (cache) {
    return cache;
  }

  // measure('replace-module-field');
  const result = replaceModuleField(isFile, p, pkgLocation);
  // endMeasure('replace-module-field');
  pkgCache.set(id, result);

  return result;
};
