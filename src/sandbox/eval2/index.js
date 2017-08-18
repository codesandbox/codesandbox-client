// @flow
import type { Sandbox, Module } from 'common/types';
import resolveModule from 'common/sandbox/resolve-module';

import babelTranspiler from './transpilers/babel';
import typescriptTranspiler from './transpilers/typescript';
import getDependency from './loaders/dependency-resolver';

import PresetManager from './presets';

// Create React App loader
// CSS -> PostCSS => CSS Loader
// JS -> Babel Loader
// HTML -> Raw loader
// Images -> URL loader
// Other -> File loader (for us raw loader for now)

const createReactAppPreset = new PresetManager('create-react-app');

createReactAppPreset.registerTranspiler(
  module => /\.jsx?/.test(module.title),
  babelTranspiler,
);
createReactAppPreset.registerTranspiler(
  module => /\.tsx?/.test(module.title),
  typescriptTranspiler,
);

function evaluatePath(
  presetManager: PresetManager,
  sandbox: Sandbox,
  externals: Array<string>,
  path: string,
  currentDirectoryShortid: ?string = null,
  parentModules: Array<Module> = [],
) {
  if (/^(\w|@)/.test(path)) {
    return getDependency(path);
  }

  const module = resolveModule(
    path,
    sandbox.modules,
    sandbox.directories,
    currentDirectoryShortid,
  );

  if (!module) {
    throw new Error(`Module '${path}' not found.`);
  }

  function require(requirePath: string) {
    return evaluatePath(
      presetManager,
      sandbox,
      externals,
      requirePath,
      currentDirectoryShortid,
      [...parentModules, module],
    );
  }

  return presetManager.evaluateModule(sandbox, module);
}

export default function evaluate(
  template: string,
  sandbox: Sandbox,
  externals: Array<string>,
  path: string,
  currentDirectoryShortid: ?string = null,
) {
  evaluatePath(
    createReactAppPreset,
    sandbox,
    externals,
    path,
    currentDirectoryShortid,
  );
}
