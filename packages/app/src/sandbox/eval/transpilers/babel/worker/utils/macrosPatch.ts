import * as macrosPlugin from 'babel-plugin-macros';
import { patchedResolve } from './resolvePatch';

// eslint-disable-next-line
let finalExports = function m(babel, options) {
  return macrosPlugin(babel, {
    ...options,
    resolvePath(source, basePath) {
      return patchedResolve().sync(source, {
        basePath,
      });
    },
  });
};

finalExports = Object.assign(finalExports, {
  createMacro: macrosPlugin.createMacro,
  MacroError: macrosPlugin.MacroError,
});

export default finalExports;
