import stripJsonComments from 'strip-json-comments';
import * as pathUtils from '@codesandbox/common/lib/utils/path';

export interface ProcessedTSConfig {
  baseUrl: string;
  paths: Record<string, string>;
}

export function processTSConfig(content: string): ProcessedTSConfig | null {
  const parsed = JSON.parse(stripJsonComments(content))?.compilerOptions || {};
  if (parsed.baseUrl) {
    const paths: ProcessedTSConfig['paths'] = {};
    if (parsed.paths) {
      for (const p of Object.keys(parsed.paths)) {
        paths[p] = parsed.paths[p].map((val: string) => {
          return pathUtils.join('/', parsed.baseUrl, val).replace(/\*/g, '');
        });
      }
    }

    return {
      baseUrl: pathUtils.join('/', parsed.baseUrl),
      paths,
    };
  }
  return null;
}

export function getPotentialPathsFromTSConfig(
  moduleSpecifier: string,
  config: ProcessedTSConfig
): string[] {
  const res = [];
  for (const p of Object.keys(config.paths)) {
    if (p.endsWith('*')) {
      const prefix = p.substring(0, p.length - 1);
      if (moduleSpecifier.startsWith(prefix)) {
        const suffix = moduleSpecifier.substr(prefix.length);
        for (const alias of config.paths[p]) {
          res.push(alias + suffix);
        }
      }
    } else if (moduleSpecifier === p) {
      res.push(...config.paths[p]);
    }
  }
  res.push(pathUtils.join(config.baseUrl, moduleSpecifier));
  return res;
}
