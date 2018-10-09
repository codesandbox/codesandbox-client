import DependencyNotFoundError from 'sandbox-hooks/errors/dependency-not-found-error';

/**
 * Converts a dependency string to an actual dependency
 *
 * @param {string} dependencyPath
 * @param {Object} externals
 * @returns
 */
export default function getDependency(dependencyPath: string) {
  if (dependencyPath.startsWith('@babel/runtime/')) {
    // We have a precomputed bundle for this, since it's small anyway
    return require('./@babel-runtime.no-webpack')(dependencyPath);
  }

  if (dependencyPath === 'codesandbox-api') {
    return require('codesandbox-api');
  }

  throw new DependencyNotFoundError(dependencyPath);
}
