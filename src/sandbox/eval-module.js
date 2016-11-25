// @flow
import React from 'react';
import styled from 'styled-components';
import * as reactRouter from 'react-router';
import { transform } from 'babel-standalone';

const MAX_DEPTH = 20;

const dependencies = new Map([
  ['react', React],
  ['styled-components', styled],
  ['react-router', reactRouter],
]);

const moduleCache = new Map();

const compileCode = (code: string = '') => (
  transform(code, {
    presets: ['es2015', 'react', 'stage-0'],
  }).code
);

const evalModule = (mainModule: string, modules, depth: number = 0) => {
  const exports = {};
  const require = function require(path) { // eslint-disable-line no-unused-vars
    if (depth > MAX_DEPTH) {
      throw new Error(`Exceeded the maximum require depth of ${MAX_DEPTH}.`);
    }

    if (path === 'react') {
      exports.__mode__ = 'react';
    }

    const dependency = dependencies.get(path);
    if (dependency) return dependency;

    const module = modules.find(m => m.name === path);
    if (!module) throw new Error(`Cannot find module ${path}`);

    // Check if this module has ben evaluated before
    const cachedModule = moduleCache.get(module.id);
    if (cachedModule) return cachedModule;

    const compiledModule = evalModule(module, modules, depth + 1);
    moduleCache.set(module.id, compiledModule);
    return compiledModule;
  };
  const compiledCode = compileCode(mainModule.code);
  // don't use Function() here since it changes source locations
  eval(compiledCode); // eslint-disable-line no-eval

  // Always set a new cache for this module, because we know this changed
  moduleCache.set(mainModule.id, exports);
  return exports;
};

export default evalModule;
