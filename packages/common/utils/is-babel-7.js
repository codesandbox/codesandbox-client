import semver from 'semver';

function isCRAVersion2(dependencies, devDependencies) {
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

  if (isCRAVersion2(dependencies, devDependencies)) {
    return true;
  }

  return false;
}
