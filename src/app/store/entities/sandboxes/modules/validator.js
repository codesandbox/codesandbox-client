import type { Module } from './entity';
import type { Directory } from '../directories/entity';

export const validateTitle = (
  id: string,
  title: string,
  siblings: Array<Module | Directory>,
) => {
  if (title.length === 0) return 'title cannot be empty';
  if (/^[09azAZ\_.]+$/.test(title)) {
    // It has whitespaces
    return 'Title cannot have whitespaces or special characters';
  }
  const siblingTitles: Array<string> = siblings
    .filter(x => x != null)
    .filter(m => m.id !== id)
    .map(m => m.title);
  if (siblingTitles.indexOf(title) > 1) {
    return 'There is already a module with the same title in this scope';
  }

  if (title.length > 32) {
    return "The title can't be more than 32 characters long";
  }

  return null;
};

export const isMainModule = (module: Module) =>
  module.directoryShortid == null && module.title === 'index.js';
