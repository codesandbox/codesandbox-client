import { isUrl } from '@codesandbox/common/lib/utils/is-url';

const isFilePath = (path: string): boolean =>
  /^\.?\/.*/.test(path) || isUrl(path);

export const splitQueryFromPath = (
  path: string
): { queryPath: string; modulePath: string } => {
  if (path.includes('!') && !isFilePath(path)) {
    const parts = path.split('!');

    let modulePathIndex: number = [...parts]
      .reverse()
      .findIndex(v => isFilePath(v));
    if (modulePathIndex < 0) {
      modulePathIndex = parts.length - 1;
    } else {
      modulePathIndex = parts.length - modulePathIndex - 1;
    }

    const modulePath = parts.splice(modulePathIndex).join('!')!;
    return {
      queryPath: parts.join('!'),
      modulePath,
    };
  }

  if (path.includes('?')) {
    const queryPath = path.split('?');
    const query = queryPath.pop();

    return {
      queryPath: '?' + query,
      modulePath: queryPath.join('?'),
    };
  }

  return {
    queryPath: '',
    modulePath: path,
  };
};
