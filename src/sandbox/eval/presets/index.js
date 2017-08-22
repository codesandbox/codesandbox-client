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
  loaders: Array<{
    test: (module: Module) => boolean,
    transpilers: Array<{
      transpiler: Transpiler,
      options: Object,
    }>,
  }>;
  transpilers: Set<Transpiler>;
  name: string;
  ignoredExtensions: Array<string>;

  constructor(name: string, ignoredExtensions: ?Array<string>) {
    this.loaders = [];
    this.transpilers = new Set();
    this.name = name;

    this.ignoredExtensions = ignoredExtensions || ['js', 'jsx', 'json'];
  }

  registerTranspiler(
    test: (module: Module) => boolean,
    transpilers: Array<Transpiler>,
  ) {
    this.loaders.push({
      test,
      transpilers,
    });

    transpilers.forEach(t => this.transpilers.add(t));

    return this.loaders;
  }

  /**
   * Get transpilers from the given query, the query is webpack like:
   * eg. !babel-loader!./test.js
   */
  getLoaders(module: Module, query: string = '') {
    const loader = this.loaders.find(t => t.test(module));

    // Starting !, drop all transpilers
    const transpilers = query.startsWith('!') // eslint-disable-line no-nested-ternary
      ? []
      : loader ? loader.transpilers : [];

    // Remove "" values
    const transpilerNames = query.split('!').filter(x => x);

    const extraTranspilers = transpilerNames
      .map(loaderName => {
        const [name, options] = loaderName.split('?');

        const transpiler = Array.from(this.transpilers).find(
          t => t.name === name,
        );

        if (!transpiler) {
          throw new Error(`Loader '${name}' could not be found.`);
        }

        const parsedOptions = options ? JSON.parse(options) : {};

        return { transpiler, options: parsedOptions };
      })
      .reverse(); // Reverse, because webpack is also in reverse order

    const finalTranspilers = [...transpilers, ...extraTranspilers];

    if (finalTranspilers.length === 0) {
      throw new Error(`No transpilers found for ${module.title}`);
    }

    return finalTranspilers;
  }
}
