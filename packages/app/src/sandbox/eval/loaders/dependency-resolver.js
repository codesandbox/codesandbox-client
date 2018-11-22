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
    return require('codesandbox-api');
  }

  if (dependencyPath === '@mdx-js/mdx') {
    return require('@mdx-js/mdx');
  }

  if (dependencyPath === '@mdx-js/tag') {
    return require('@mdx-js/tag');
  }

  throw new DependencyNotFoundError(dependencyPath);
}
