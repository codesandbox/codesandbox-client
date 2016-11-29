// @flow
import React from 'react';
import * as styled from 'styled-components';
import * as reactRouter from 'react-router';
import { transform } from 'babel-standalone';

import type { Module } from '../../app/store/entities/modules/';

import resolveModule from './resolve-module';

const MAX_DEPTH = 20;

const dependencies = new Map([
  ['react', React],
  ['styled-components', styled],
  ['react-router', reactRouter],
]);

const moduleCache = new Map();

const compileCode = (code: string = '', moduleName: string = 'unknown') => {
  try {
    return transform(code, {
      presets: ['es2015', 'react', 'stage-0'],
      retainLines: true,
    }).code;
  } catch (e) {
    e.message = e.message.split('\n')[0].replace('unknown', moduleName);
    throw new Error(e);
  }
};

const evalModule = (mainModule: Module, modules: Array<Module>, depth: number = 0) => {
  const exports = {};
  const require = function require(path) { // eslint-disable-line no-unused-vars
    if (depth > MAX_DEPTH) {
      throw new Error(`Exceeded the maximum require depth of ${MAX_DEPTH}.`);
    }

    const dependency = dependencies.get(path);
    if (dependency) return dependency;

    const module = resolveModule(mainModule, path, modules);
    if (!module) throw new Error(`Cannot find module in path: ${path}`);

    // Check if this module has been evaluated before, if so return that
    return moduleCache.get(module.id) || evalModule(module, modules, depth + 1);
  };
  try {
    const compiledCode = compileCode(mainModule.code, mainModule.title);
    // don't use Function() here since it changes source locations
    eval(compiledCode); // eslint-disable-line no-eval
  } catch (e) {
    // Remove cache
    moduleCache.delete(mainModule.id);
    throw e;
  }

  // Always set a (if no error) new cache for this module, because we know this changed
  moduleCache.set(mainModule.id, exports);
  return exports;
};

export default evalModule;
