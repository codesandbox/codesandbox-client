import semver from 'semver';
import { Dependencies } from '../templates/template';

export function supportsNewReactTransform(
  dependencies: Dependencies = {},
  devDependencies: Dependencies = {}
) {
  const reactScriptsVersion =
    dependencies['react-scripts'] || devDependencies['react-scripts'];
  const reactVersion = dependencies.react;
  const reactDomVersion = dependencies['react-dom'];
  if (reactScriptsVersion && reactVersion && reactDomVersion) {
    // tests if react scripts has a version above 4
    // and react/react-dom are 17 or they are something like 0.0.0-testname since the react team uses that to test
    return (
      /^[a-z]/.test(reactScriptsVersion) ||
      (semver.intersects(reactScriptsVersion, '^4.0.0') &&
        (semver.lt(reactVersion, '0.0.1') ||
          semver.intersects(reactVersion, '^17.0.0')) &&
        (semver.lt(reactDomVersion, '0.0.1') ||
          semver.intersects(reactDomVersion, '^17.0.0')))
    );
  }

  return false;
}
