import { NPMDependencies } from '.';

export default (dependencies: NPMDependencies) =>
  Object.keys(dependencies)
    .sort()
    .map(name => encodeURIComponent(`${name}@${dependencies[name]}`))
    .join('+');
