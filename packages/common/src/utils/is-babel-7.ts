import semver from 'semver';
import { Dependencies } from '../templates/template';

function isCRAVersion2(
  dependencies: Dependencies,
  devDependencies: Dependencies
) {
  const reactScriptsVersion =
    dependencies['react-scripts'] || devDependencies['react-scripts'];
  if (reactScriptsVersion) {
    return (
      /^[a-z]/.test(reactScriptsVersion) ||
      semver.intersects(reactScriptsVersion, '^2.0.0') ||
      semver.intersects(reactScriptsVersion, '^3.0.0') ||
      semver.intersects(reactScriptsVersion, '^4.0.0')
    );
  }

  return false;
}

export function isBabel7(
  dependencies: Dependencies = {},
  devDependencies: Dependencies = {}
) {
  if (
    dependencies['@vue/cli-plugin-babel'] ||
    devDependencies['@vue/cli-plugin-babel']
  ) {
    return true;
  }

  if (devDependencies['@babel/core'] || dependencies['@babel/core']) {
    return true;
  }

  if (dependencies.svelte || devDependencies.svelte) {
    const ver = dependencies.svelte || devDependencies.svelte;
    const [maj] = ver.split('.');

    if (maj) {
      return +maj > 2;
    }

    return false;
  }

  if ('typescript' in devDependencies && !dependencies['@angular/core']) {
    return true;
  }

  if (isCRAVersion2(dependencies, devDependencies)) {
    return true;
  }

  return false;
}
