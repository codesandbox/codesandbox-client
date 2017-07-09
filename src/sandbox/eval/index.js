// @flow
import type { Module, Directory } from 'common/types';

import evalJS, { deleteCache as deleteJSCache } from './js';
import evalRaw from './raw';
import evalCSS from './css';
import evalJson from './json';

const MAX_DEPTH = 20;

function doEval(
  mainModule: Module,
  modules: Array<Module>,
  directories: Array<Directory>,
  externals: Object,
  depth: ?number,
  parentModule: ?Module,
) {
  const html = /\.html$/;
  const css = /\.css$/;
  const json = /\.json$/;
  const js = /\.js$/;

  if (html.test(mainModule.title)) {
    return evalRaw(
      mainModule,
      modules,
      directories,
      externals,
      depth,
      parentModule,
    );
  }

  if (css.test(mainModule.title)) {
    return evalCSS(
      mainModule,
      modules,
      directories,
      externals,
      depth,
      parentModule,
    );
  }

  if (json.test(mainModule.title) || mainModule.title === '.babelrc') {
    return evalJson(
      mainModule,
      modules,
      directories,
      externals,
      depth,
      parentModule,
    );
  }

  if (js.test(mainModule.title)) {
    return evalJS(
      mainModule,
      modules,
      directories,
      externals,
      depth,
      parentModule,
    );
  }

  return evalRaw(
    mainModule,
    modules,
    directories,
    externals,
    depth,
    parentModule,
  );
}

export function deleteCache(module: Module) {
  deleteJSCache(module);
}

const evalModule = (
  mainModule: Module,
  modules: Array<Module>,
  directories: Array<Directory>,
  externals: Object,
  depth: number = 0,
  parentModule: Array<Module> = [],
) => {
  if (depth > MAX_DEPTH) {
    throw new Error(
      `Exceeded the maximum require depth of ${MAX_DEPTH}, there are probably two files depending on eachother.`,
    );
  }
  try {
    return doEval(
      mainModule,
      modules,
      directories,
      externals,
      depth,
      parentModule,
    );
  } catch (e) {
    e.module = e.module || mainModule;
    throw e;
  }
};

export default evalModule;
