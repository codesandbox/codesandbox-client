/* @flow */
import type { Module } from 'common/types';

const reactRegex = /import.*from\s['|"]react['|"]/;
export function hasReact(code: string) {
  return reactRegex.test(code);
}

const cssRegex = /\.css$/;
const jsonRegex = /\.json$/;
const htmlRegex = /\.html$/;

export function getMode(module: Module) {
  if (cssRegex.test(module.title)) return 'css';
  if (jsonRegex.test(module.title)) return 'json';
  if (htmlRegex.test(module.title)) return 'html';
  if (!module.title.includes('.')) return 'raw';

  return '';
}

const jsRegex = /\.jsx?$/;
const tsRegex = /\.tsx?$/;
function isJS(module: Module) {
  if (jsRegex.test(module.title)) return 'js';
  if (tsRegex.test(module.title)) return 'ts';
  return undefined;
}

export default function getType(module: Module) {
  const isJSType = isJS(module);
  if (isJSType) {
    if (hasReact(module.code || '')) return 'react';
    return isJSType;
  }

  return getMode(module);
}
