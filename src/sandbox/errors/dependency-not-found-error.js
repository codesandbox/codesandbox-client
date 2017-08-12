export default class DependencyNotFoundError extends Error {
  constructor(dependencyName: string) {
    super();

    const [root, second] = dependencyName.split('/');

    // If the package starts with a @ it's scoped, we should add the second
    // part of the name in that case
    const parsedName = root.startsWith('@') ? `${root}/${second}` : root;

    this.payload = {
      dependency: parsedName,
      path: dependencyName,
    };
    this.message = `Could not find dependency: '${dependencyName}'`;
  }
  type = 'dependency-not-found';
  severity = 'error';
}
