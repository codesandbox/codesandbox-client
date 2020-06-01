import { PackageJSON } from '@codesandbox/common/lib/types';

export function packageFilter(p: PackageJSON) {
  if (p.module) {
    // eslint-disable-next-line
    p.main = p.module;
  }

  return p;
}
