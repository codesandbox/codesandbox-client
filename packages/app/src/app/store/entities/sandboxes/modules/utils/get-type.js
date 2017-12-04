/* @flow */
import isImage from 'common/utils/is-image';

const reactRegex = /import.*from\s['|"]react['|"]/;
export function hasReact(code: string) {
  return reactRegex.test(code);
}

const cssRegex = /\.css$/;
const jsonRegex = /\.json$/;
const htmlRegex = /\.html$/;
const mdRegex = /\.md$/;
const vueRegex = /\.vue$/;
const svgRegex = /\.svg$/;

export function getMode(title: string) {
  if (title === 'favicon.ico') {
    return 'favicon';
  }

  if (title === 'yarn.lock') {
    return 'yarn';
  }

  if (title === 'package.json') {
    return 'npm';
  }

  if (cssRegex.test(title)) return 'css';
  if (jsonRegex.test(title)) return 'json';
  if (htmlRegex.test(title)) return 'html';
  if (mdRegex.test(title)) return 'md';
  if (vueRegex.test(title)) return 'vue';
  if (svgRegex.test(title)) return 'svg';
  if (!title.includes('.')) return 'raw';

  if (isImage(title)) {
    return 'image';
  }

  return '';
}

const jsRegex = /\.jsx?$/;
const tsRegex = /\.tsx?$/;
function isJS(title: string) {
  if (jsRegex.test(title)) return 'js';
  if (tsRegex.test(title)) return 'ts';
  return undefined;
}

export default function getType(title: string, code: string) {
  const isJSType = isJS(title);
  if (isJSType) {
    if (hasReact(code || '')) return 'react';
    return isJSType;
  }

  return getMode(title);
}
