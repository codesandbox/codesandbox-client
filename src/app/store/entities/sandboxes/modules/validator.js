// @flow
import type { Module, Directory } from 'common/types';

export const validateTitle = (
  id: string,
  title: string,
  siblings: Array<Module | Directory>, // eslint-disable-line
) => {
  if (title.length === 0) return 'Title cannot be empty';
  if (/^[09azAZ_.]+$/.test(title)) {
    // It has whitespaces
    return 'Title cannot have whitespaces or special characters';
  }

  if (title.length > 32) {
    return "The title can't be more than 32 characters long";
  }

  return null;
};
