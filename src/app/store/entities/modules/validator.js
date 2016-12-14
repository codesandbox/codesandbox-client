import type { Module } from './';
import type { Sandbox } from '../sandboxes/';

export const validateTitle = (
  id: string,
  title: string,
  siblings: Array<Module | Sandbox>,
) => {
  if (title.length === 0) return 'title cannot be empty';
  if (!/^[0-9a-zA-Z]+$/.test(title)) {
    // It has whitespaces
    return 'Title cannot have whitespaces or special characters';
  }
  const siblingTitles: Array<string> = siblings
                          .filter(x => x != null)
                          .filter(m => m.id !== id)
                          .map(m => m.title);
  if (siblingTitles.indexOf(title) > -1) {
    return 'There is already a module with the same title in this scope';
  }

  if (title.length > 32) {
    return "The title can't be more than 32 characters long";
  }

  return null;
};
