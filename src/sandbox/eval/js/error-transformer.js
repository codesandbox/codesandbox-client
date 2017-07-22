/* @flow */
import type { Module } from 'common/types';
import RawReactComponentError from '../../errors/raw-react-component-error';

import {
  hasReact,
  getMode,
} from 'app/store/entities/sandboxes/modules/utils/get-type';

const getModule = (modules: Array<Module>, id: string): ?Module =>
  modules.find(m => m.id === id);

const reactRegex = /import.*from\s['|"]react['|"]/;
/**
 * This error happens when a user tries to use a React component that's imported
 * from a raw file. In that case the React component will be a string and thus
 * invalid
 */
function buildRawReactComponentError(
  error: Error,
  module: Module,
  modules: Array<Module>,
  requires: Array<string>,
) {
  const rawModuleUsingReact = requires
    .map(id => getModule(modules, id))
    .filter(x => x)
    .filter(m => hasReact(m.code || ''))
    .find(m => getMode(m) === 'raw');

  if (!rawModuleUsingReact) return error;

  return new RawReactComponentError(rawModuleUsingReact);
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
  requires: Array<string>,
) {
  if (error.message.startsWith('Invalid tag: import React')) {
    const newError = buildRawReactComponentError(
      error,
      module,
      modules,
      requires,
    );
    newError.message = error.message;
    return newError;
  }

  return error;
}
