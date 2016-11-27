// @flow
import type { Module } from '../../app/store/entities/modules/';

const getInitialModuleId = (module) => {
  if (module.children.length === 0) {
    if (module.parentModuleId == null) return module.id;
    return module.parentModuleId;
  }
  return module.id;
};

export default (module: Module, path: string, modules: Array<Module>) => {
  const splitPath = path.replace(/^.\//, '').split('/');

  const initialModuleId = getInitialModuleId(module);
  const initialModule = modules.find(m => m.id === initialModuleId);

  if (!initialModule) throw new Error(`Cannot find module in path ${path}`);
  const resolvedModule = splitPath.reduce((prev, moduleName) => {
    if (moduleName === '') return prev;

    const isParent = moduleName === '..';
    let foundModule = null;
    if (isParent) {
      foundModule = modules.find(x => x.id === prev.parentModuleId);
    } else {
      const children = prev.children.map(id => modules.find(m => m.id === id));
      foundModule = children.find(m => m != null && m.title === moduleName);
    }

    if (!foundModule) throw Error(`Cannot find module in path ${path}`);

    return foundModule;
  }, initialModule);

  if (resolvedModule === module) throw new Error(`${module.title} is importing itself`);
  return resolvedModule;
};
