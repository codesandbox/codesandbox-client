const parseDependencyName = (dependency: string) => {
  const match = dependency.match(/(.*?)\//);

  if (match) return match[1];
  return dependency;
};

export default class DependencyNotFoundError extends Error {
  constructor(dependencyName: string) {
    super();

    const parsedName = parseDependencyName(dependencyName);
    this.payload = {
      dependency: parsedName,
      path: dependencyName,
    };
    this.message = `Could not find dependency: '${parsedName}'`;
  }
  type = 'dependency-not-found';
  severity = 'error';
}
