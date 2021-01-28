import semver from 'semver';
import { Dependencies } from '../templates/template';

export function supportsNewReactTransform(
  dependencies: Dependencies = {},
  devDependencies: Dependencies = {}
) {
  try {
    const reactScriptsVersion =
      dependencies['react-scripts'] || devDependencies['react-scripts'];
    const reactVersion = dependencies.react;
    const reactDomVersion = dependencies['react-dom'];
    if (reactScriptsVersion && reactVersion && reactDomVersion) {
      // tests if react scripts has a version above 4
      // and react/react-dom are 17 or they are something like 0.0.0-testname since the react team uses that to test

      const isPrerelease = semver.prerelease(reactVersion).length > 0;

      return (
        /^[a-z]/.test(reactScriptsVersion) ||
        (semver.intersects(reactScriptsVersion, '^4.0.0') &&
          (isPrerelease || semver.intersects(reactVersion, '^17.0.0')))
      );
    }
  } catch {
    return false;
  }

  return false;
}
