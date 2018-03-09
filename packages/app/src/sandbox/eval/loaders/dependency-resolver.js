import DependencyNotFoundError from '../../errors/dependency-not-found-error';

/**
 * Converts a dependency string to an actual dependency
 *
 * @param {string} dependencyPath
 * @param {Object} externals
 * @returns
 */
export default function getDependency(dependencyPath: string) {
  // This polyfill is included by default in the sandbox, no external dependency needed.
  // This is also included in CRA by default, so we keep compatability with
  // CRA.
  if (dependencyPath.startsWith('babel-runtime')) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`./babel-runtime${dependencyPath.replace(
      'babel-runtime',
      ''
    )}`);
  }

  if (dependencyPath === 'codesandbox-api') {
    return require('codesandbox-api');
  }

  throw new DependencyNotFoundError(dependencyPath);
}
