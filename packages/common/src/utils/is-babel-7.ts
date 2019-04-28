import semver from 'semver';

function isCRAVersion2(dependencies: object, devDependencies: object) {
  const reactScriptsVersion =
    dependencies['react-scripts'] || devDependencies['react-scripts'];
  if (reactScriptsVersion) {
    return (
      /^[a-z]/.test(reactScriptsVersion) ||
      semver.intersects(reactScriptsVersion, '^2.0.0')
    );
  }

  return false;
}

export function isBabel7(dependencies = {}, devDependencies = {}) {
  if (devDependencies['@vue/cli-plugin-babel']) {
    return true;
  }

  if (devDependencies['@babel/core']) {
    return true;
  }

  if (dependencies['svelte'] || devDependencies['svelte']) {
    const ver = dependencies['svelte'] || devDependencies['svelte'];
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
