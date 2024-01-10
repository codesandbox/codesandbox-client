// @ts-ignore
import DependencyNotFoundError from 'sandbox-hooks/errors/dependency-not-found-error';

/**
 * Converts a dependency string to an actual dependency
 *
 * @param {string} dependencyPath
 * @param {Object} externals
 * @returns
 */
export default function getDependency(dependencyPath: string) {
  if (dependencyPath === 'codesandbox-api') {
    // eslint-disable-next-line
    return require('codesandbox-api');
  }

  throw new DependencyNotFoundError(dependencyPath);
}
