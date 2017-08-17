// @flow

import type { Sandbox, Module } from 'common/types';

type Loader = {
  execute: (sandbox: Sandbox, module: Module) => any,
  test: (sandbox: Sandbox, module: Module) => boolean,
};

export default class LoaderManager {
  loaders: {
    [loaderName: string]: Loader,
  };

  constructor() {
    this.loaders = {};
  }

  registerLoader(name: string, loader: Loader) {
    if (this.loaders[name]) {
      throw new Error(`Loader '${name}' has already been added as loader.`);
    }

    this.loaders[name] = loader;
  }
}
