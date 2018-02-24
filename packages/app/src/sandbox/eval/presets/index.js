// @flow
import { orderBy } from 'lodash';
import querystring from 'querystring';
import type { Module } from '../entities/module';

import type Manager from '../manager';
import Transpiler from '../transpilers';

export type TranspiledModule = Module & {
  transpiledCode: string,
};

type TranspilerDefinition = {
  transpiler: Transpiler,
  options: ?Object,
};

type LifeCycleFunction = (manager: Manager) => void | Promise<*>;

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
    transpilers: Array<TranspilerDefinition>,
  }>;
  transpilers: Set<Transpiler>;
  name: string;
  ignoredExtensions: Array<string>;
  htmlDisabled: boolean;
  defaultAliases: { [path: string]: string };
  alias: { [path: string]: string };
  // Whether this preset supports .env files
  hasDotEnv: boolean;

  /**
   * Code to run before evaluating entry
   */
  setup: LifeCycleFunction;
  /**
   * Code to run after done
   */
  teardown: LifeCycleFunction;

  constructor(
    name: string,
    ignoredExtensions: ?Array<string>,
    alias: { [path: string]: string },
    {
      hasDotEnv,
      setup,
      teardown,
      htmlDisabled,
    }: {
      hasDotEnv?: boolean,
      setup?: LifeCycleFunction,
      teardown?: LifeCycleFunction,
      htmlDisabled?: boolean,
    } = {}
  ) {
    this.loaders = [];
    this.transpilers = new Set();
    this.name = name;

    this.hasDotEnv = hasDotEnv || false;
    this.alias = alias || {};
    this.defaultAliases = alias || {};
    this.ignoredExtensions = ignoredExtensions || ['js', 'jsx', 'json'];

    const noop = () => {};
    this.setup = setup || noop;
    this.teardown = teardown || noop;
    this.htmlDisabled = htmlDisabled || false;
  }

  setAdditionalAliases = (aliases: Object) => {
    this.alias = { ...this.defaultAliases, ...aliases };
  };

  /**
   * Checks if there is an alias given for the path, if there is it will return
   * the altered path, otherwise it will just return the known path.
   */
  getAliasedPath(path: string): string {
    const aliases = Object.keys(this.alias);

    const exactAliases = aliases.filter(a => a.endsWith('$'));
    const exactFoundAlias = exactAliases.find(a => {
      const alias = a.slice(0, -1);

      if (path === alias) {
        return alias;
      }

      return false;
    });

    if (exactFoundAlias) {
      return this.alias[exactFoundAlias];
    }

    const pathParts = path.split('/'); // eslint-disable-line prefer-const

    // Find matching aliases
    const foundAlias = orderBy(aliases, a => -a.split('/').length).find(a => {
      const parts = a.split('/');
      return parts.every((p, i) => pathParts[i] === p);
    });

    if (foundAlias) {
      // if an alias is found we will replace the path with the alias
      return path.replace(foundAlias, this.alias[foundAlias]);
    }

    return path;
  }

  registerTranspiler(
    test: (module: Module) => boolean,
    transpilers: Array<TranspilerDefinition>
  ) {
    this.loaders.push({
      test,
      transpilers,
    });

    transpilers.forEach(t => this.transpilers.add(t.transpiler));

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
          t => t.name === name
        );

        if (!transpiler) {
          throw new Error(`Loader '${name}' could not be found.`);
        }

        const parsedOptions = this.parseOptions(options);

        return { transpiler, options: parsedOptions };
      })
      .reverse(); // Reverse, because webpack is also in reverse order

    const finalTranspilers = [...transpilers, ...extraTranspilers];

    return finalTranspilers;
  }

  parseOptions = (options: ?string) => {
    if (options == null) {
      return {};
    }

    try {
      return JSON.parse(options);
    } catch (e) {
      return querystring.parse(options);
    }
  };

  /**
   * Get the query syntax of the module
   */
  getQuery(module: Module, query: string = '') {
    const loaders = this.getLoaders(module, query);

    return `!${loaders.map(t => t.transpiler.name).join('!')}`;
  }
}
