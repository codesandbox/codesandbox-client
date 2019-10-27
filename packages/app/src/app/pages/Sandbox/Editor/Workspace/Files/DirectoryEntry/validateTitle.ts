import { Directory, Module } from '@codesandbox/common/lib/types';

const validateTitle = (
  id: string,
  title: string,
  siblings: Array<Directory | Module> = []
) => {
  if (title.length === 0) return 'Title cannot be empty';

  if (/^[09azAZ_.]+$/.test(title)) {
    // It has whitespaces
    return 'Title cannot have whitespaces or special characters';
  }

  if (title.startsWith('/') || title.startsWith('\\')) {
    return "The title can't start with slash or backslash";
  }

  if (!title.includes('/') && title.length > 32) {
    return "The title can't be more than 32 characters long";
  }

  if (title.includes('/')) {
    const directories = title.split('/');
    const file = directories.pop();
    const validationDirectory = validateTitle(id, directories[0], siblings);
    const validationTitle = validateTitle(null, file, []);

    return validationDirectory || validationTitle;
  }

  if (siblings.find(sibling => sibling.title === title && sibling.id !== id)) {
    return `A file or folder ${title} already exists at this location`;
  }

  return null;
};

export default validateTitle;
