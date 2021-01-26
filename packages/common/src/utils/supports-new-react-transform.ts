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
    return (
      /^[a-z]/.test(reactScriptsVersion) ||
      semver.intersects(reactScriptsVersion, '^4.0.0')
    );
  }

  return false;
}
