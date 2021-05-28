import { isUrl } from '@codesandbox/common/lib/utils/is-url';

// TODO: Figure out node_modules, ie read pkg.json from ESModule file tree, would need some major refactoring...
export function getESModuleUrl(parent: string, path: string): string | null {
  if (isUrl(path)) {
    return path;
  }

  if (path.startsWith('/node_modules/')) {
    return null;
  }

  if (isUrl(parent) && (path[0] === '.' || path[0] === '/')) {
    return new URL(path, parent).href;
  }

  return null;
}
