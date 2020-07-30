import getDirectChildren from './get-direct-children';

export default function getChildCollections(
  folders: Array<{ path: string } | null>,
  path = '/'
) {
  const foldersByPath: { [path: string]: { path: string } } = {};

  folders.forEach(collection => {
    foldersByPath[collection?.path] = collection;
  });

  return {
    children: getDirectChildren(path, folders),
    folders,
    foldersByPath,
  };
}
