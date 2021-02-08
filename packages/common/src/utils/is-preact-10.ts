import semver from 'semver';
import { Dependencies } from '../templates/template';

export function isPreact10(
  dependencies: Dependencies,
  devDependencies: Dependencies
) {
  const preactVersion =
    (dependencies || {}).preact || (devDependencies || {}).preact;
  if (preactVersion) {
    return (
      /^[a-z]/.test(preactVersion) ||
      semver.intersects(preactVersion, '>=10.0.0')
    );
  }

  return false;
}
