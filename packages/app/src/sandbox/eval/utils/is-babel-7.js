import { isVersion2 } from '../presets/create-react-app';

export function isBabel7(dependencies = {}, devDependencies = {}) {
  if (devDependencies['@vue/cli-plugin-babel']) {
    return true;
  }

  if (devDependencies['@babel/core']) {
    return true;
  }

  if (isVersion2(dependencies)) {
    return true;
  }

  return false;
}
