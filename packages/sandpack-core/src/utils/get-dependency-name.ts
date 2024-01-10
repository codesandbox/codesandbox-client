export function getDependencyName(path: string): string {
  const dependencyParts = path.split('/');
  let dependencyName = dependencyParts.shift();

  if (path.startsWith('@')) {
    dependencyName += `/${dependencyParts.shift()}`;
  }
  if (dependencyParts[0] && /^\d+\.\d+\.\d+.*$/.test(dependencyParts[0])) {
    // Make sure to include the aliased version if it's part of it
    dependencyName += `/${dependencyParts.shift()}`;
  }

  return dependencyName!;
}

export function getAliasVersion(path: string): string | null {
  const name = getDependencyName(path);
  const split = name.split('/');
  const expectedSplitLength = name.startsWith('@') ? 3 : 2;

  if (split.length !== expectedSplitLength) {
    return null;
  }

  const version = split.pop()!;
  return version;
}
