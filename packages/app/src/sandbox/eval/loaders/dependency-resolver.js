import DependencyNotFoundError from 'sandbox-hooks/errors/dependency-not-found-error';

/**
 * We don't have fancy resolving for @babel/runtime because of optimalization,
 * so we try to alter it the best way we can.
 */
function alterBabelRuntimeDependencyPath(path: string) {
  if (path === '@babel/runtime/regenerator') {
    return '@babel/runtime/regenerator/index';
  }

  return path;
}

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
    return require('./@babel-runtime.no-webpack')(
      alterBabelRuntimeDependencyPath(dependencyPath)
    );
  }

  if (dependencyPath === 'codesandbox-api') {
    return require('codesandbox-api');
  }

  throw new DependencyNotFoundError(dependencyPath);
}
