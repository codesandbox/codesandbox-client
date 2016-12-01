import type { Module } from './';
import { getModuleChildren } from './selector';

export const validateTitle = (
  name: string,
  module: Module,
  parentModule: Module,
  modules: { [id: string]: Module } | Array<Module>,
) => {
  if (name.length === 0) return 'Name cannot be empty';
  if (!/^[0-9a-zA-Z]+$/.test(name)) {
    // It has whitespaces
    return 'Title cannot have whitespaces or special characters';
  }
  if (parentModule != null) {
    // Check if there are other modules with the same name
    const children = getModuleChildren(parentModule, modules);
    const siblingNames: Array<string> = children
                            .filter(x => x != null)
                            .filter(m => m.id !== module.id)
                            .map(m => m.title);
    if (siblingNames.indexOf(name) > -1) {
      return 'There is already a module with the same name in this scope';
    }
  }

  if (name.length > 32) {
    return "The name can't be more than 32 characters long";
  }

  return null;
};

export const isChildOfModule = (
  firstModuleId: string,
  secondModuleId: string,
  modules: Array<Module>,
) => {
  const findModule = id => modules.find(m => m.id === id);
  let secondModule = findModule(secondModuleId);

  while (secondModule.parentModuleId != null) {
    if (secondModule.parentModuleId === firstModuleId) return true;

    secondModule = findModule(secondModule.parentModuleId);
  }

  return false;
};

export default (edits, module: Module, wholeState) => {
  const parentModule = wholeState[module.parentModuleId];
  return validateTitle(edits.title, module, parentModule, wholeState);
};
