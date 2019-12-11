import { orderBy } from 'lodash-es';
import querystring from 'querystring';
import { Module } from '../entities/module';

import Manager from '../manager';
import Transpiler from '../transpilers';
import TranspiledModule from '../transpiled-module';

type TranspilerDefinition = {
  transpiler: Transpiler;
  options?: Object;
};

type SetupFunction = (manager: Manager) => void | Promise<any>;

type LifeCycleFunction = (
  manager: Manager,
  updatedModules: TranspiledModule[]
) => void | Promise<any>;

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
    test: (module: Module) => boolean;
    transpilers: Array<TranspilerDefinition>;
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
   * Code to run before evaluating and transpiling entry
   */
  setup: SetupFunction;
  /**
   * Code to run after done
   */
  teardown: LifeCycleFunction;

  /**
   * Code to run before evaluation
   */
  preEvaluate: LifeCycleFunction;

  constructor(
    name: string,
    ignoredExtensions?: Array<string>,
    alias?: { [path: string]: string },
    {
      hasDotEnv,
      setup,
      teardown,
      htmlDisabled,
      preEvaluate,
    }: {
      hasDotEnv?: boolean;
      setup?: SetupFunction;
      preEvaluate?: LifeCycleFunction;
      teardown?: LifeCycleFunction;
      htmlDisabled?: boolean;
    } = {}
  ) {
    this.loaders = [];
    this.transpilers = new Set();
    this.name = name;

    this.hasDotEnv = hasDotEnv || false;
    this.alias = alias || {};
    this.aliasedPathCache = {};
    this.defaultAliases = alias || {};
    this.ignoredExtensions = ignoredExtensions || ['js', 'jsx', 'json'];

    const noop = () => {};
    this.setup = setup || noop;
    this.teardown = teardown || noop;
    this.preEvaluate = preEvaluate || noop;
    this.htmlDisabled = htmlDisabled || false;
  }

  setAdditionalAliases = (aliases: { [path: string]: string }) => {
    this.alias = { ...this.defaultAliases, ...aliases };
    this.aliasedPathCache = {};
  };

  reset = () => {
    this.loaders = [];
  };

  resetTranspilers = () => {
    this.transpilers.clear();
    this.loaders.length = 0;
  };

  aliasedPathCache = {};

  /**
   * Checks if there is an alias given for the path, if there is it will return
   * the altered path, otherwise it will just return the known path.
   */
  getAliasedPath(path: string): string {
    if (this.aliasedPathCache[path] === null) {
      return path;
    }
    if (this.aliasedPathCache[path]) {
      return this.aliasedPathCache[path];
    }

    const aliases = Object.keys(this.alias);

    const exactAliases = aliases.filter(a => a.endsWith('$'));
    const exactFoundAlias = exactAliases.find(a => {
      const alias = a.slice(0, -1);

      if (path === alias) {
        return true;
      }

      return false;
    });

    if (exactFoundAlias) {
      this.aliasedPathCache[path] = this.alias[exactFoundAlias];
      return this.alias[exactFoundAlias];
    }

    const pathParts = path.split('/');

    // Find matching aliases
    const foundAlias = orderBy(aliases, a => -a.split('/').length).find(a => {
      const parts = a.split('/');
      return parts.every((p, i) => pathParts[i] === p);
    });

    if (foundAlias) {
      const replacedPath = path.replace(foundAlias, this.alias[foundAlias]);
      this.aliasedPathCache[path] = replacedPath;
      // if an alias is found we will replace the path with the alias
      return replacedPath;
    }

    this.aliasedPathCache[path] = null;

    return path;
  }

  registerTranspiler(
    test: (module: Module) => boolean,
    transpilers: Array<TranspilerDefinition>,
    prepend: boolean = false
  ) {
    const transpilerObject = {
      test,
      transpilers,
    };
    if (prepend) {
      this.loaders.unshift(transpilerObject);
    } else {
      this.loaders.push(transpilerObject);
    }

    transpilers.forEach(t => this.transpilers.add(t.transpiler));

    return this.loaders;
  }

  /**
   * Get transpilers from the given query, the query is webpack like:
   * eg. !babel-loader!./test.js
   */
  getLoaders(module: Module, query: string = ''): Array<TranspilerDefinition> {
    const loader = this.loaders.find(t => t.test(module));

    // Starting !, drop all transpilers
    const transpilers = query.startsWith('!') // eslint-disable-line no-nested-ternary
      ? []
      : loader
      ? loader.transpilers
      : [];

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

  parseOptions = (options?: string) => {
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
