// @flow
import React from 'react';
import styled from 'styled-components';
import { transform } from 'babel-standalone';

import type { Module } from '../store/entities/modules/';

const MAX_DEPTH = 20;

const dependencies = new Map([
  ['react', React],
  ['styled-components', styled],
]);

const compileCode = (code: string = '') => (
  transform(code, {
    presets: ['es2015', 'react', 'stage-0'],
  }).code
);

const evalModule = (code: string, modules: Array<Module>, depth: number = 0) => {
  const exports = { default: {} };
  /* eslint-disable */
  const window = {}; // TODO check security on this
  const document = {}; // TODO check security on this
  const self = {}; // TODO check security on this

  new Function("console.log(document.cookie)")()
  /* eslint-enable */
  const require = function require(path) { // eslint-disable-line no-unused-vars
    const dependency = dependencies.get(path);

    if (dependency) return dependency;

    const module = modules.find(m => m.name === path);
    if (!module) throw new Error(`Cannot find module ${path}`);

    if (depth > MAX_DEPTH) {
      throw new Error(`Exceeded the maximum require depth of ${MAX_DEPTH}.`);
    }
    return evalModule(module.code, modules, depth + 1);
  };

  const compiledCode = compileCode(code);
  // don't use Function() here since it changes source locations
  eval(compiledCode); // eslint-disable-line no-eval
  return exports;
};

export default evalModule;
