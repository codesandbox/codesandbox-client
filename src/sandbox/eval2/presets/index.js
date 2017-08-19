// @flow

import { sortBy } from 'lodash';
import type { Sandbox, Module } from 'common/types';

import Transpiler from '../transpilers';

export type Loader = {
  evaluate: (sandbox: Sandbox, module: Module) => any,
  test: (sandbox: Sandbox, module: Module) => boolean,
  specifity: 0 | 1 | 2,
};

export type TranspiledModule = Module & {
  transpiledCode: string,
};

/**
 * This is essentially where it all comes together. The manager is responsible for
 * doing evaluation and transpilation using the Transpiler and Loader classes.
 *
 * You can build presets with this, for example the create-react-app template
 * could create a new instance of this and register all desired loaders.
 *
 * Note that this manager should never have state besides the transpilers and
 * the loaders, the only responsibility is to activate the right transpilers
 * and loaders.
 */
export default class LoaderManager {
  loaders: {
    [loaderName: string]: Loader,
  };
  transpilers: Array<{
    test: (module: Module) => boolean,
    transpiler: Transpiler,
  }>;
  name: string;

  constructor(name: string) {
    this.loaders = {};
    this.transpilers = [];
    this.name = name;
  }

  registerLoader(name: string, loader: Loader) {
    if (this.loaders[name]) {
      throw new Error(`Loader '${name}' has already been added as loader.`);
    }

    this.loaders[name] = loader;
  }

  registerTranspiler(
    test: (module: Module) => boolean,
    transpiler: Transpiler,
  ) {
    this.transpilers.push({
      test,
      transpiler,
    });

    return transpiler;
  }

  getTranspilers(module: Module) {
    const transpiler = this.transpilers.find(t => t.test(module));

    // Force 1 transpiler for now
    return [transpiler.transpiler];
  }

  evaluateModule(sandbox: Sandbox, module: Module) {
    const applicableLoaders = Object.keys(this.loaders).filter(loaderName =>
      this.loaders[loaderName].test(sandbox, module),
    );

    const sortedLoaders = sortBy(
      applicableLoaders,
      name => this.loaders[name].specifity,
    );

    const loader = this.loaders[sortedLoaders[0]];

    if (!loader) {
      throw new Error(`No loader found for ${module.title}`);
    }

    return loader.evaluate(sandbox, module, this);
  }
}
