export default (id, title) => {
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
