export function getParentPath(path: string) {
  if (path === '/' || path === '') {
    return '/';
  }

  const split = path.split('/');
  split.pop();

  return split.join('/');
}

export function normalizePath(path: string) {
  if (!path.startsWith('/')) {
    return '/' + path;
  }
  return path;
}
