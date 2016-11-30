import type { Module } from './';
import { getModuleChildren } from './selector';

const validateTitle = (name: string, module: Module, modules: { [id: string]: Module }) => {
  if (!/^[0-9a-zA-Z]+$/.test(name)) {
    // It has whitespaces
    return 'Title cannot have whitespaces or special characters';
  }

  if (module.parentModuleId) {
    // Check if there are other modules with the same name
    const parentModule = modules[module.parentModuleId];
    if (parentModule != null) {
      const children = getModuleChildren(module, modules);
      const siblingNames: Array<string> = children
                              .filter(x => x != null)
                              .filter(m => m.id !== module.id)
                              .map(m => m.title);
      if (siblingNames.indexOf(name) > -1) {
        return 'There is already a module with the same name in this scope';
      }
    }
  }

  if (name.length > 32) {
    return "The name can't be more than 32 characters long";
  }

  return null;
};

export default (edits, module: Module, wholeState) =>
  validateTitle(edits.title, module, wholeState);
