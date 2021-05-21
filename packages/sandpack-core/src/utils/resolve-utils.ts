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

export const isUrl = (filepath: string) => {
  try {
    const parsedUrl = new URL(filepath);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (err) {
    // do nothing
  }
  return false;
};
