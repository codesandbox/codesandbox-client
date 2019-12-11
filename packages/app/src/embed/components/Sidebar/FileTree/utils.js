export function sortingFunction(a, b) {
  // directories come first, sorted alphabetically
  // then files, also sorted alphabetically
  let first;

  if (a.type === b.type) {
    if (a.title < b.title) first = a;
    else first = b;
  } else if (a.type === 'directory') {
    first = a;
  } else {
    first = b;
  }

  // js be weird
  if (first === a) return -1;
  return 1;
}

export function isRootLevel(files, file) {
  // find out if parent directory is in sub-tree

  const parentId = file.directory;
  if (!parentId) return true;

  const parent = files.find(f => f.id === parentId);
  if (!parent) return true;
  return false;
}

export function getParentDirectory(allFiles, file) {
  if (!file.directory) return null;

  return allFiles.find(parent => parent.id === file.directory);
}

export function getDepth(allFiles, file) {
  let depth = 0;

  let parent = getParentDirectory(allFiles, file);

  while (parent) {
    depth++;
    parent = getParentDirectory(allFiles, parent);
  }

  return depth;
}

export function getFilesInSubTree(allFiles, selectedFile) {
  const currentModuleTree = [selectedFile];

  let parentDirectory = getParentDirectory(allFiles, selectedFile);

  while (parentDirectory) {
    currentModuleTree.push(parentDirectory);
    // get parent directory of the parent directory
    parentDirectory = getParentDirectory(allFiles, parentDirectory);
  }

  return currentModuleTree;
}

export function isChildSelected({ allFiles, directory, selectedFile }) {
  const filesInCurrentSubTree = getFilesInSubTree(allFiles, selectedFile);

  return filesInCurrentSubTree.find(file => file.id === directory.id);
}
