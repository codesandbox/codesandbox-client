import type { PackageJSON } from 'common/types';
import { absolute } from 'common/utils/path';

type Modules = {
  [path: string]: {
    path: string,
    code: string,
  },
};

export const packageMainResolver = (
  modules: Modules,
  parsedPackageJSON: PackageJSON
) => {
  const { main } = parsedPackageJSON;

  if (main) {
    const absoluteMain = absolute(main);
    if (modules[absoluteMain]) {
      return modules[absoluteMain];
    }
  }

  return null;
};
