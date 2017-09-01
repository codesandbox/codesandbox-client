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
  const dependencyModule =
    externals[dependencyPath] || externals[`${dependencyPath}.js`];
  if (dependencyModule) {
    const idMatch = dependencyModule.match(/dll_bundle\((\d+)\)/);
    if (idMatch && idMatch[1]) {
      try {
        return window.dll_bundle(idMatch[1]);
      } catch (e) {
        // Delete the cache of the throwing dependency
        delete window.dll_bundle.c[idMatch[1]];
        throw e;
      }
    }
  }
  throw new DependencyNotFoundError(dependencyPath);
}
