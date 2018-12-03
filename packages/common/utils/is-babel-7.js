import semver from 'semver';

function isCRAVersion2(dependencies) {
  const usedDeps = dependencies || {};
  if (usedDeps['react-scripts']) {
    const reactScriptsVersion = usedDeps['react-scripts'];

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

  if (isCRAVersion2(dependencies)) {
    return true;
  }

  return false;
}
