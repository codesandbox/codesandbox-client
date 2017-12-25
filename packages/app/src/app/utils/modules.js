export const getModulePath = (modules, directories, id) => {
  const module = modules.find(moduleEntry => moduleEntry.id === id);

  if (!module) return '';

  let directory = directories.find(
    directoryEntry => directoryEntry.shortid === module.directoryShortid
  );
  let path = '/';
  while (directory != null) {
    path = `/${directory.title}${path}`;
    directory = directories.find(
      directoryEntry => directoryEntry.shortid === directory.directoryShortid
    ); // eslint-disable-line
  }
  return `${path}${module.title}`;
};
