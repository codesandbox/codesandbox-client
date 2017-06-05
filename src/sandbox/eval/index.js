// @flow
import type { Module, Directory } from 'common/types';

import evalJS, { deleteCache as deleteJSCache } from './js';
import evalHTML from './html';
import evalCSS from './css';
import evalJson from './json';

const MAX_DEPTH = 20;

function doEval(mainModule, modules, directories, externals, depth) {
  const html = /\.html$/;
  const css = /\.css$/;
  const json = /\.json$/;

  if (html.test(mainModule.title)) {
    return evalHTML(mainModule, modules, directories, externals, depth);
  }

  if (css.test(mainModule.title)) {
    return evalCSS(mainModule, modules, directories, externals, depth);
  }

  if (json.test(mainModule.title)) {
    return evalJson(mainModule, modules, directories, externals, depth);
  }

  return evalJS(mainModule, modules, directories, externals, depth);
}

export function deleteCache(module: Module) {
  if (module.title.includes('.js')) {
    deleteJSCache(module);
  }
}

const evalModule = (
  mainModule: Module,
  modules: Array<Module>,
  directories: Array<Directory>,
  externals: Object,
  depth: number = 0,
) => {
  if (depth > MAX_DEPTH) {
    throw new Error(`Exceeded the maximum require depth of ${MAX_DEPTH}.`);
  }
  try {
    return doEval(mainModule, modules, directories, externals, depth);
  } catch (e) {
    e.module = e.module || mainModule;
    throw e;
  }
};

export default evalModule;
