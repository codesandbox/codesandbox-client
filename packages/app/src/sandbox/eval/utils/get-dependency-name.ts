export default function getDependencyName(path: string) {
  const dependencyParts = path.split('/');
  let dependencyName = dependencyParts.shift();

  if (path.startsWith('@')) {
    dependencyName += `/${dependencyParts.shift()}`;
  }
  if (dependencyParts[0] && /^\d+\.\d+\.\d+.*$/.test(dependencyParts[0])) {
    // Make sure to include the aliased version if it's part of it
    dependencyName += `/${dependencyParts.shift()}`;
  }

  return dependencyName;
}
