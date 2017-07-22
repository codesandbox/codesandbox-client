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
function isJS(module: Module) {
  if (jsRegex.test(module.title)) return 'js';
}

export default function getType(module: Module) {
  if (isJS(module)) {
    if (hasReact(module.code || '')) return 'react';
    return 'js';
  }

  return getMode(module);
}
