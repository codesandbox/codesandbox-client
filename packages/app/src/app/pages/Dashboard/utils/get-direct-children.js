function addSlash(path: string) {
  if (path.endsWith('/')) {
    return path;
  }

  return path + '/';
}

export default function getDirectChildren(
  currentPath: string,
  children: Array<{ path: string }>
): Set<string> {
  const usedChildren = new Set();

  children.forEach(c => {
    const { path } = c;

    const normalizedPath = addSlash(path);
    const normalizedCurrentPath = addSlash(currentPath);
    const basePath = normalizedPath.replace(normalizedCurrentPath, '');

    if (basePath === normalizedPath) {
      return undefined;
    }
    const normalizedBasePath = addSlash(basePath);

    const directChildPart = normalizedBasePath.match(/(.*?)\//);

    if (directChildPart && directChildPart[1]) {
      usedChildren.add(directChildPart[1]);
    }

    return undefined;
  });

  return usedChildren;
}
