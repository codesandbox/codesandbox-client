import { isUrl } from '@codesandbox/common/lib/utils/is-url';

export function getModuleUrl(path: string): string {
  if (isUrl(path)) {
    return path;
  }
  return new URL(path, window.location.href).href;
}
