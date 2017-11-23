import * as pathUtils from 'common/utils/path';

type PathObject = {
  [path: string]: any,
};

export default function nodeResolvePath(
  path: string,
  pathObject: PathObject,
  defaultExtensions: Array<string> = ['js', 'jsx', 'json']
): ?string {
  if (pathObject[path]) {
    return path;
  }

  const indexFiles = defaultExtensions.map(ext =>
    pathUtils.join(path, `./index.${ext}`)
  );
  const moduleFiles = defaultExtensions.map(ext => `${path}.${ext}`);

  const foundPath = [...moduleFiles, ...indexFiles].find(p => pathObject[p]);

  if (foundPath) {
    return foundPath;
  }

  return null;
}
