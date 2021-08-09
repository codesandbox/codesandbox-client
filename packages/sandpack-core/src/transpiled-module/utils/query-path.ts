import { isUrl } from '@codesandbox/common/lib/utils/is-url';

export const splitQueryFromPath = (
  path: string
): { queryPath: string; modulePath: string } => {
  if (path.includes('!') && !/^\.?\/.*/.test(path) && !isUrl(path)) {
    const queryPath = path.split('!');
    const modulePath = queryPath.pop()!;

    return {
      queryPath: queryPath.join('!'),
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
