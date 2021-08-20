import { PackageJSON } from '@codesandbox/common/lib/types';

export const packageFilter = () => (p: PackageJSON) => {
  if (p.module) {
    p.main = p.module;
  }

  return p;
};
