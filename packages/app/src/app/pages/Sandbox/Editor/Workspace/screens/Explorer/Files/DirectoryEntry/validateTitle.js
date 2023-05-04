export const validateTitle = (id, title, siblings = []) => {
  if (title.length === 0) return 'Title cannot be empty';
  if (title.includes(' ')) {
    // It has whitespaces
    return 'Title cannot have whitespaces';
  }
  if (/[<>^:;,?"*|]/g.test(title)) {
    return 'Title cannot have special characters';
  }

  if (title.length > 192) {
    return "The title can't be more than 192 characters long";
  }

  if (title.includes('/') || title.includes('\\')) {
    return "The title can't include slash or backslash";
  }

  if (siblings.find(sibling => sibling.title === title && sibling.id !== id)) {
    return `A file or folder ${title} already exists at this location`;
  }

  return null;
};
