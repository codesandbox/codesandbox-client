/* @flow */
import isImage from 'common/utils/is-image';

const mdRegex = /\.md$/;
const yamlRegex = /\.yml$/;
const svgRegex = /\.svg$/;
const jsxRegex = /\.jsx$/;

export function getMode(title: string = '') {
  const removeIgnoreTitle = title.split('ignore')[0];

  if (removeIgnoreTitle === 'favicon.ico') {
    return 'favicon';
  }

  if (removeIgnoreTitle === 'yarn.lock') {
    return 'yarn';
  }

  if (removeIgnoreTitle === '.travis.yml') {
    return 'travis';
  }

  if (removeIgnoreTitle === 'package.json') {
    return 'npm';
  }

  if (removeIgnoreTitle === 'sandbox.config.json') {
    return 'codesandbox';
  }

  if (mdRegex.test(removeIgnoreTitle)) return 'markdown';
  if (yamlRegex.test(removeIgnoreTitle)) return 'yaml';
  if (jsxRegex.test(removeIgnoreTitle)) return 'reactjs';
  if (!removeIgnoreTitle.includes('.')) return 'raw';
  if (removeIgnoreTitle.includes('webpack')) return 'webpack';

  if (isImage(removeIgnoreTitle) && !svgRegex.test(removeIgnoreTitle)) {
    return 'image';
  }

  const titleArr = removeIgnoreTitle.split('.');

  if (removeIgnoreTitle.endsWith('rc')) {
    return titleArr.join('').split('rc')[0];
  }

  return titleArr[titleArr.length - 1];
}

const tsRegex = /\.tsx?$/;
function isJS(title: string) {
  if (
    tsRegex.test(title) ||
    title === 'tsconfig.json' ||
    title === 'tslint.json'
  )
    return 'typescript';
  return undefined;
}

export default function getType(title: string) {
  const isJSType = isJS(title);
  if (isJSType) {
    return isJSType;
  }

  return getMode(title);
}
