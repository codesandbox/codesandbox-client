/* @flow */
import type { Module } from 'common/types';
import type { ModuleCacheModule } from './';
import {
  hasReact,
  getMode,
} from 'app/store/entities/sandboxes/modules/utils/get-type';

import RawReactComponentError from '../../errors/raw-react-component-error';

/**
 * This error happens when a user tries to use a React component that's imported
 * from a raw file. In that case the React component will be a string and thus
 * invalid
 */
function buildRawReactComponentError(
  error: Error,
  module: Module,
  modules: Array<Module>,
  moduleCache: Map<string, ModuleCacheModule>,
  requires: Array<string>,
) {
  const requiredModules = requires
    .map(id => modules.find(m => m.id === id))
    .filter(x => x != null)
    .filter(m => hasReact(m.code || ''));

  const rawModuleUsingReact = requiredModules.find(m => getMode(m) === 'raw');

  // Cannot find a raw module, but a child react component could render a raw
  // component, let's find out!
  if (!rawModuleUsingReact) {
    const childRawModuleError = requiredModules
      .map(m => moduleCache.get(m.id))
      .filter(x => x != null)
      .map(
        m =>
          m &&
          buildRawReactComponentError(
            error,
            m.module,
            modules,
            moduleCache,
            m.requires,
          ),
      )
      .find(m => m);

    if (childRawModuleError) return childRawModuleError;
  } else {
    return new RawReactComponentError(module, rawModuleUsingReact);
  }
}

/**
 * This function checks if the error is a known error, as in, it's an error
 * where we can show the user a better error message based on context.
 *
 * @export
 * @param {Error} error
 */
export default function transformError(
  error: Error,
  module: Module,
  modules: Array<Module>,
  moduleCache: Map<string, ModuleCacheModule>,
  requires: Array<string>,
) {
  if (error.message.startsWith('Invalid tag: import React')) {
    const newError =
      buildRawReactComponentError(
        error,
        module,
        modules,
        moduleCache,
        requires,
      ) || error;
    newError.message = error.message;
    return newError;
  }

  return error;
}
