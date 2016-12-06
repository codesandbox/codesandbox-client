// @flow
import type { Module } from '../../app/store/entities/modules/';

import { getModuleChildren } from '../../app/store/entities/modules/selector';

/**
 * Convert the module path to a module
 */
export default (module: ?Module, path: string, modules: Array<Module>) => {
  if (module == null) return null;
  // Split path
  const splitPath = path.replace(/^.\//, '').split('/');

  const resolvedModule = splitPath.reduce((prev, moduleName) => {
    if (moduleName === '') return prev;
    const isParent = moduleName === '..';
    let foundModule = null;
    // Go up if the found module is a parent
    if (isParent) {
      foundModule = modules.find(x => x.id === prev.parentModuleId);
    } else {
      foundModule = getModuleChildren(prev, modules).find(m => m != null && m.title === moduleName);
    }
    if (!foundModule) throw Error(`Cannot find module in path ${path}`);

    return foundModule;
  }, module);

  return resolvedModule;
};
