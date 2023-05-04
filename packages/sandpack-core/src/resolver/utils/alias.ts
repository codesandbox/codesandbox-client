import * as pathUtils from '@codesandbox/common/lib/utils/path';

export function normalizeAliasFilePath(
  specifier: string,
  pkgRoot: string,
  // This can be set to false to fallback to returning the specifier in case it can be a node_module
  isFilePath: boolean = true
): string {
  if (specifier[0] === '/') {
    return specifier;
  }
  if (specifier[0] === '.' || isFilePath) {
    return pathUtils.join(pkgRoot, specifier);
  }
  return specifier;
}
