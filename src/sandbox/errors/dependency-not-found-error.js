export default class DependencyNotFoundError extends Error {
  constructor(dependencyName: string) {
    super();
    this.payload = {
      dependency: dependencyName,
    };
  }
  type = 'dependency-not-found';
  severity = 'error';
  line = -1;
}
