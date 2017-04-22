const parseDependencyName = (dependency: string) => {
  const match = dependency.match(/(.*?)\//);

  if (match) return match[1];
  return dependency;
};

export default class DependencyNotFoundError extends Error {
  constructor(dependencyName: string) {
    super();
    this.payload = {
      dependency: parseDependencyName(dependencyName),
      path: dependencyName,
    };
  }
  type = 'dependency-not-found';
  severity = 'error';
}
