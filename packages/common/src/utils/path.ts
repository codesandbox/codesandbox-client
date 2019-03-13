export function absolute(path: string) {
  if (path.startsWith('/')) {
    return path;
  }

  if (path.startsWith('./')) {
    return path.replace('./', '/');
  }

  return '/' + path;
}
