import * as resolve from 'browser-resolve';
import { packageFilter } from 'sandbox/eval/utils/resolve-utils';

/**
 * Patch 'resolve' to configure it to resolve esmodules by default. babel-plugin-macros goes
 * for the commonjs version, which we don't download anymore by default.
 */
export function patchedResolve() {
  const handler = {
    get(target, prop) {
      if (prop === 'sync') {
        return (p, options) =>
          target.sync(p, { ...options, packageFilter: packageFilter() });
      }

      return target[prop];
    },
  };
  return new Proxy(resolve, handler);
}
