// @flow
import type { Module } from 'app/store/entities/sandboxes/modules/entity';

import type {
  Directory,
} from 'app/store/entities/sandboxes/directories/entity';

import evalJS, { deleteCache as deleteJSCache } from './js';
import evalHTML from './html';
import evalCSS from './css';

const MAX_DEPTH = 20;

function doEval(mainModule, modules, directories, manifest, depth) {
  const html = /\.html$/;
  const css = /\.css$/;

  if (html.test(mainModule.title)) {
    return evalHTML(mainModule, modules, directories, manifest, depth);
  }

  if (css.test(mainModule.title)) {
    return evalCSS(mainModule, modules, directories, manifest, depth);
  }

  return evalJS(mainModule, modules, directories, manifest, depth);
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
  manifest: Object,
  depth: number = 0
) => {
  if (depth > MAX_DEPTH) {
    throw new Error(`Exceeded the maximum require depth of ${MAX_DEPTH}.`);
  }
  try {
    return doEval(mainModule, modules, directories, manifest, depth);
  } catch (e) {
    e.module = e.module || mainModule;
    throw e;
  }
};

export default evalModule;
