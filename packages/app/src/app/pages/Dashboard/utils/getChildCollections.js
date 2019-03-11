import getDirectChildren from './get-direct-children';

export default (folders, path = '/') => {
  const foldersByPath = {};

  folders.forEach(collection => {
    foldersByPath[collection.path] = collection;
  });

  return {
    children: getDirectChildren(path, folders),
    folders,
    foldersByPath,
  };
};
