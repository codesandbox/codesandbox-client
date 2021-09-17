import { resolve } from './resolve';

function transformOptions(opts: any): any {
  return {
    ...opts,
    filename: opts.basePath ? opts.basePath + '/index.js' : '/index.js',
  };
}

/**
 * Patch 'resolve' to configure it to resolve esmodules by default. babel-plugin-macros goes
 * for the commonjs version, which we don't download anymore by default.
 */
export function patchedResolve() {
  const handler = {
    get(target, prop) {
      if (prop === 'sync') {
        return (p, options) => {
          resolve(p, transformOptions(options));
        };
      }

      // Useful for logging if somethings sync or not...
      return (p, options) => {
        resolve(p, transformOptions(options));
      };
    },
  };
  return new Proxy({}, handler);
}
