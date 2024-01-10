import orderBy from 'lodash-es/orderBy';
import querystring from 'querystring';
import { NPMDependencies } from '../npm';
import { Module } from '../types/module';

import Manager from '../manager';
import { Transpiler } from '../transpiler';
import { TranspiledModule } from '../transpiled-module';
import { WebpackTranspiler } from '../transpiler/transpilers/webpack';
import { IEvaluator } from '../evaluator';

export type TranspilerDefinition = {
  transpiler: Transpiler;
  options?: Object;
};

type SetupFunction = (manager: Manager) => void | Promise<any>;
type ProcessDependenciesFunction = (
  dependencies: NPMDependencies
) => Promise<NPMDependencies>;

type LifeCycleFunction = (
  manager: Manager,
  updatedModules: TranspiledModule[]
) => void | Promise<any>;

type LoaderDefinition = {
  test: (module: Module) => boolean;
  transpilers: Array<TranspilerDefinition>;
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
export class Preset {
  public experimentalEsmSupport = false;
  private _transpilers: Map<string, Transpiler>;

  loaders: Array<LoaderDefinition>;

  name: string;
  ignoredExtensions: Array<string>;
  htmlDisabled: boolean;
  defaultAliases: { [path: string]: string };
  alias: { [path: string]: string };
  // Whether this preset supports .env files
  hasDotEnv: boolean;

  /**
   * Add or remove dependencies to the existing list (or just look at them for some config changes)
   */
  processDependencies: ProcessDependenciesFunction;
  /**
   * Code to run before evaluating and transpiling entry
   */
  setup: SetupFunction;
  /**
   * Code to run after evaluation and transpilation
   */
  teardown: LifeCycleFunction;
  /**
   * Code to run before evaluation
   */
  preEvaluate: LifeCycleFunction;

  preTranspilers: TranspilerDefinition[] = [];

  postTranspilers: TranspilerDefinition[] = [
    // { transpiler: csbDynamicImportTranspiler },
  ];

  constructor(
    name: string,
    ignoredExtensions?: Array<string>,
    alias?: { [path: string]: string },
    {
      hasDotEnv,
      processDependencies,
      setup,
      teardown,
      htmlDisabled,
      preEvaluate,
    }: {
      hasDotEnv?: boolean;
      processDependencies?: ProcessDependenciesFunction;
      setup?: SetupFunction;
      preEvaluate?: LifeCycleFunction;
      teardown?: LifeCycleFunction;
      htmlDisabled?: boolean;
    } = {}
  ) {
    this.loaders = [];
    this._transpilers = new Map();
    this.name = name;

    this.hasDotEnv = hasDotEnv || false;
    this.alias = alias || {};
    this.aliasedPathCache = {};
    this.defaultAliases = alias || {};
    this.ignoredExtensions = ignoredExtensions || ['js', 'jsx', 'json', 'mjs'];

    const noop = () => {};
    this.processDependencies = processDependencies || (async deps => deps);
    this.setup = setup || noop;
    this.teardown = teardown || noop;
    this.preEvaluate = preEvaluate || noop;
    this.htmlDisabled = htmlDisabled || false;

    this.postTranspilers.forEach(transpiler => {
      this.addTranspiler(transpiler.transpiler);
    });
  }

  addTranspiler(t: Transpiler) {
    // TODO: Should this overwrite or skip?
    if (this._transpilers.has(t.name)) return;

    this._transpilers.set(t.name, t);
  }

  getTranspiler(name: string): Transpiler | undefined {
    return this._transpilers.get(name);
  }

  getTranspilers(): Transpiler[] {
    return Array.from(this._transpilers.values());
  }

  setAdditionalAliases = (aliases: { [path: string]: string }) => {
    this.alias = { ...this.defaultAliases, ...aliases };
    this.aliasedPathCache = {};
  };

  reset = () => {
    this.loaders = [];
  };

  resetTranspilers = () => {
    this._transpilers.clear();
    this.loaders.length = 0;
  };

  aliasedPathCache: { [path: string]: string | null } = {};

  /**
   * Checks if there is an alias given for the path, if there is it will return
   * the altered path, otherwise it will just return the known path.
   */
  getAliasedPath(path: string): string {
    const aliasCache = this.aliasedPathCache[path];
    if (aliasCache === null) {
      return path;
    }
    if (aliasCache) {
      return aliasCache;
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

    transpilers.forEach(t => this.addTranspiler(t.transpiler));

    return this.loaders;
  }

  /**
   * Get transpilers from the given query, the query is webpack like:
   * eg. !babel-loader!./test.js
   */
  getLoaders(
    module: Module,
    evaluator: IEvaluator,
    query: string = ''
  ): Array<TranspilerDefinition> {
    const loader = this.loaders.find(t => t.test(module));

    // Starting !, drop all transpilers
    const transpilers = query.startsWith('!') // eslint-disable-line no-nested-ternary
      ? []
      : loader
      ? loader.transpilers
      : [];

    // Remove "" values
    const transpilerNames = query.split('!').filter(Boolean);

    const extraTranspilers = transpilerNames
      .map(loaderName => loaderName.split('?'))
      .filter(([name]) => !!name)
      .map(([name, options]) => {
        let transpiler = this.getTranspiler(name);

        if (!transpiler) {
          const webpackLoader = new WebpackTranspiler(name, evaluator);
          // If the loader is not installed, we try to run the webpack loader.
          this.addTranspiler(webpackLoader);
          transpiler = webpackLoader;
        }

        const parsedOptions = this.parseOptions(options);

        return { transpiler, options: parsedOptions };
      })
      .reverse(); // Reverse, because webpack is also in reverse order

    const finalTranspilers = [
      ...this.preTranspilers,
      ...transpilers,
      ...extraTranspilers,
      ...this.postTranspilers,
    ];

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
  getQuery(module: Module, evaluator: IEvaluator, query: string = '') {
    const loaders = this.getLoaders(module, evaluator, query).reverse();

    return `!${loaders
      .map(t => {
        const configStringified = querystring.encode(t.options as any);
        const loaderQuery = configStringified ? '?' + configStringified : '';

        return t.transpiler.name + loaderQuery;
      })
      .join('!')}`;
  }
}
