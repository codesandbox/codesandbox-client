import { PackageJSON } from '@codesandbox/common/lib/types';

export const packageFilter = (isFile: (p: string) => boolean = () => true) => (
  p: PackageJSON,
  pkgLocation: string
) => {
  if (p.module) {
    p.main = p.module;
  }

  return p;
};
