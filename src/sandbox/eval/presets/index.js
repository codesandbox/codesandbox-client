// @flow
import type { Module } from 'common/types';

import Transpiler from '../transpilers';

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
export default class Preset {
  transpilers: Array<{
    test: (module: Module) => boolean,
    transpilers: Array<Transpiler>,
  }>;
  name: string;
  ignoredExtensions: Array<string>;

  constructor(name: string, ignoredExtensions: ?Array<string>) {
    this.loaders = {};
    this.transpilers = [];
    this.name = name;

    this.ignoredExtensions = ignoredExtensions || ['js', 'jsx', 'json'];
  }

  registerTranspiler(
    test: (module: Module) => boolean,
    transpilers: Array<Transpiler>,
  ) {
    this.transpilers.push({
      test,
      transpilers,
    });

    return transpilers;
  }

  getTranspilers(module: Module) {
    const transpiler = this.transpilers.find(t => t.test(module));

    if (transpiler == null) {
      throw new Error(`No transpiler found for ${module.title}`);
    }

    return transpiler.transpilers;
  }
}
