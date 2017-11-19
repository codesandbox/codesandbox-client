import DependencyNotFoundError from '../../errors/dependency-not-found-error';

/**
 * Converts a dependency string to an actual dependency
 *
 * @param {string} dependencyPath
 * @param {Object} externals
 * @returns
 */
export default function getDependency(
  dependencyPath: string,
  externals: { [key: string]: string }
) {
  // This polyfill is included by default in the sandbox, no external dependency needed.
  // This is also included in CRA by default, so we keep compatability with
  // CRA.
  if (dependencyPath.startsWith('babel-runtime')) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`../../../../../node_modules/babel-runtime${dependencyPath.replace(
      'babel-runtime',
      ''
    )}`);
  }

  if (dependencyPath === 'codesandbox-api') {
    return require('codesandbox-api');
  }
  const dependencyModule =
    externals[dependencyPath] || externals[`${dependencyPath}.js`];
  if (dependencyModule) {
    const idMatch = dependencyModule.match(/dll_bundle\((\d+)\)/);
    if (idMatch && idMatch[1]) {
      try {
        return window.dll_bundle(idMatch[1]);
      } catch (e) {
        if (window.dll_bundle) {
          // Delete the cache of the throwing dependency
          delete window.dll_bundle.c[idMatch[1]];
        }
        throw e;
      }
    }
  }
  throw new DependencyNotFoundError(dependencyPath);
}
