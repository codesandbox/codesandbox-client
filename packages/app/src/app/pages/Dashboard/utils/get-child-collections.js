import getDirectChildren from './get-direct-children';

export default function getChildCollections(folders, path = '/') {
  const foldersByPath = folders.reduce(
    (pathedFolders, folder) => ({
      ...pathedFolders,
      [folder.path]: folder,
    }),
    {}
  );

  return {
    children: getDirectChildren(path, folders),
    folders,
    foldersByPath,
  };
}
