// @flow
import { flattenDeep, uniq, values, isEqual } from 'lodash';
import resolve from 'browser-resolve';
import localforage from 'localforage';

import VERSION from 'common/version';

import * as pathUtils from 'common/utils/path';
import _debug from 'app/utils/debug';

import type { Module } from './entities/module';
import TranspiledModule from './transpiled-module';
import type { SerializedTranspiledModule } from './transpiled-module';
import Preset from './presets';
import fetchModule, {
  getCombinedMetas,
  setCombinedMetas,
} from './npm/fetch-npm-module';
import coreLibraries from './npm/get-core-libraries';
import getDependencyName from './utils/get-dependency-name';
import DependencyNotFoundError from '../errors/dependency-not-found-error';
import ModuleNotFoundError from '../errors/module-not-found-error';
import TestRunner from './tests/jest-lite';
import dependenciesToQuery from '../npm/dependencies-to-query';
import isESModule from './utils/is-es-module';

type Externals = {
  [name: string]: string,
};

type ModuleObject = {
  [path: string]: Module,
};

type Configurations = {
  [type: string]: Object,
};

export type Manifest = {
  contents: {
    [path: string]: { content: string, requires: Array<string> },
  },
  dependencies: Array<{ name: string, version: string }>,
  dependencyDependencies: {
    [name: string]: {
      semver: string,
      resolved: string,
      parents: string[],
    },
  },
  dependencyAliases: {
    [name: string]: {
      [depName: string]: string,
    },
  },
};

const NODE_LIBS = ['dgram', 'net', 'tls', 'fs', 'module', 'child_process'];
const debug = _debug('cs:compiler:manager');

localforage.config({
  name: 'CodeSandboxApp',
  storeName: 'sandboxes', // Should be alphanumeric, with underscores.
  description:
    'Cached transpilations of the sandboxes, for faster initialization time.',
});

// Prewarm store
localforage.keys();

export default class Manager {
  id: string;
  transpiledModules: {
    [path: string]: {
      module: Module,
      tModules: {
        [query: string]: TranspiledModule,
      },
    },
  };
  envVariables: { [envName: string]: string } = {};
  preset: Preset;
  externals: Externals;
  modules: ModuleObject;
  manifest: Manifest;
  dependencies: Object;
  webpackHMR: boolean;
  hardReload: boolean;
  hmrStatus: 'idle' | 'check' | 'apply' | 'fail' | 'dispose' = 'idle';
  testRunner: TestRunner;

  // List of modules that are being transpiled, to prevent duplicate jobs.
  transpileJobs: { [transpiledModuleId: string]: true };
  transpiledModulesByHash: { [hash: string]: TranspiledModule };

  // All paths are resolved at least twice: during transpilation and evaluation.
  // We can improve performance by almost 2x in this scenario if we cache the lookups
  cachedPaths: { [path: string]: string };

  configurations: Configurations;

  constructor(id: string, preset: Preset, modules: { [path: string]: Module }) {
    this.id = id;
    this.preset = preset;
    this.transpiledModules = {};
    this.cachedPaths = {};
    this.transpileJobs = {};
    this.webpackHMR = false;
    this.hardReload = false;
    this.hmrStatus = 'idle';
    this.isFirstLoad = true;
    this.transpiledModulesByHash = {};
    this.configurations = {};

    this.modules = modules;
    Object.keys(modules).forEach(k => this.addModule(modules[k]));
    this.testRunner = new TestRunner(this);

    window.manager = this;
    if (process.env.NODE_ENV === 'development') {
      console.log(this);
    }

    BrowserFS.configure(
      {
        fs: 'CodeSandboxFS',
        options: {
          manager: this.bfsWrapper,
        },
      },
      () => {}
    );
  }

  bfsWrapper = {
    getTranspiledModules: () => this.transpiledModules,
    addModule: (module: Module) => {
      this.addModule(module);
    },
    removeModule: (module: Module) => {
      this.removeModule(module);
    },
    moveModule: (module: Module, newPath: string) => {
      this.moveModule(module, newPath);
    },
    updateModule: (module: Module) => {
      this.updateModule(module);
    },
  };

  resetAllModules() {
    this.getTranspiledModules().forEach(t => {
      t.resetTranspilation();
      t.resetCompilation();
    });
  }

  // Hoist these 2 functions to the top, since they get executed A LOT
  isFile = (p: string) =>
    !!this.transpiledModules[p] || !!getCombinedMetas()[p];

  readFileSync = (p: string) => {
    if (this.transpiledModules[p]) {
      return this.transpiledModules[p].module.code;
    }

    const err = new Error('Could not find ' + p);
    // $FlowIssue
    err.code = 'ENOENT';

    throw err;
  };

  setManifest(manifest: ?Manifest) {
    this.manifest = manifest || {
      contents: {},
      dependencies: [],
      dependencyDependencies: {},
      dependencyAliases: {},
    };

    Object.keys(this.manifest.contents).forEach(path => {
      const module: Module = {
        path,
        code: this.manifest.contents[path].content,
      };

      // Check if module syntax, only transpile when that's NOT the case
      // TODO move this check to the packager
      if (!isESModule(module.code)) {
        module.requires = this.manifest.contents[path].requires;
      }

      this.addModule(module);
    });
    debug(`Loaded manifest.`);
  }

  evaluateModule(module: Module, force: boolean = false) {
    if (this.hardReload && !this.isFirstLoad) {
      // Do a hard reload
      document.location.reload();
      return {};
    }

    // Evaluate the *changed* HMR modules first
    this.getTranspiledModules()
      .filter(t => t.hmrConfig && t.hmrConfig.isDirty())
      .forEach(t => t.evaluate(this));

    const transpiledModule = this.getTranspiledModule(module);

    if (force && transpiledModule.compilation) {
      transpiledModule.compilation = null;
    }

    try {
      const exports = this.evaluateTranspiledModule(transpiledModule);

      this.hmrStatus = 'idle';

      return exports;
    } catch (e) {
      throw e;
    } finally {
      // Run post evaluate
      this.getTranspiledModules().forEach(t => t.postEvaluate(this));
    }
  }

  evaluateTranspiledModule(transpiledModule: TranspiledModule) {
    return transpiledModule.evaluate(this);
  }

  addModule(module: Module) {
    this.transpiledModules[module.path] = this.transpiledModules[
      module.path
    ] || { module, tModules: {} };
  }

  addTranspiledModule(module: Module, query: string = ''): TranspiledModule {
    if (!this.transpiledModules[module.path]) {
      this.addModule(module);
    }
    this.transpiledModules[module.path].module = module;

    const transpiledModule = new TranspiledModule(module, query);
    this.transpiledModules[module.path].tModules[query] = transpiledModule;
    this.transpiledModulesByHash[transpiledModule.hash] = transpiledModule;

    return transpiledModule;
  }

  getTranspiledModuleByHash(hash: string) {
    return this.transpiledModulesByHash[hash];
  }

  /**
   * Get Transpiled Module from the registry, if there is no transpiled module
   * in the registry it will create a new one.
   *
   * @param {Module} module
   * @param {string} query A webpack like syntax (!url-loader)
   */
  getTranspiledModule(module: Module, query: string = ''): TranspiledModule {
    const moduleObject = this.transpiledModules[module.path];
    if (!moduleObject) {
      this.addModule(module);
    }

    let transpiledModule = this.transpiledModules[module.path].tModules[query];

    if (!transpiledModule) {
      transpiledModule = this.addTranspiledModule(module, query);
    }

    return transpiledModule;
  }

  /**
   * One module can have multiple transpiled modules, because modules can be
   * required in different ways. For example, require(`babel-loader!./Test.vue`) isn't
   * the same as require(`./Test.vue`).
   *
   * This will return all transpiled modules, with different configurations associated one module.
   * @param {*} module
   */
  getTranspiledModulesByModule(module: Module): Array<TranspiledModule> {
    return this.transpiledModules[module.path]
      ? values(this.transpiledModules[module.path].tModules)
      : [];
  }

  getTranspiledModules() {
    return values(this.transpiledModulesByHash);
  }

  removeTranspiledModule(tModule: TranspiledModule) {
    delete this.transpiledModulesByHash[tModule.hash];
    delete this.transpiledModules[tModule.module.path].tModules[tModule.query];
  }

  removeModule(module: Module) {
    // Reset all cached paths because file structure changed
    this.cachedPaths = {};

    const existingModule = this.transpiledModules[module.path];

    values(existingModule.tModules).forEach(m => {
      m.dispose(this);
      this.removeTranspiledModule(m);
    });

    delete this.transpiledModules[module.path];
  }

  moveModule(module: Module, newPath: string) {
    this.removeModule(module);
    this.addModule({ ...module, path: newPath });
  }

  setEnvironmentVariables() {
    if (this.transpiledModules['/.env'] && this.preset.hasDotEnv) {
      const envCode = this.transpiledModules['/.env'].module.code;

      this.envVariables = {};
      try {
        envCode.split('\n').forEach(envLine => {
          const [name, ...val] = envLine.split('=');

          this.envVariables[name] = val.join('=');
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Will transpile this module and all eventual children (requires) that go with it
   * @param {*} entry
   */
  async transpileModules(entry: Module, isTestFile: boolean = false) {
    this.hmrStatus = 'check';
    this.setEnvironmentVariables();
    const transpiledModule = this.getTranspiledModule(entry);

    transpiledModule.setIsEntry(true);
    transpiledModule.setIsTestFile(isTestFile);

    const result = await transpiledModule.transpile(this);
    this.getTranspiledModules().forEach(t => t.postTranspile(this));

    return result;
  }

  clearCompiledCache() {
    this.getTranspiledModules().map(tModule => tModule.resetCompilation());
  }

  getModules(): Array<Module> {
    return values(this.transpiledModules).map(t => t.module);
  }

  /**
   * The packager returns a list of dependencies that require a different path
   * of their subdependencies.
   *
   * An example:
   * if react requires lodash v3, and react-dom requires lodash v4. We add them
   * both to the bundle, and rewrite paths for lodash v3 to `lodash/3.0.0/`. Then
   * we specify that when react resolves `lodash` it should resolve `lodash/3.0.0`.
   *
   * @param {string} path
   * @param {string} currentPath
   * @returns
   * @memberof Manager
   */
  getAliasedDependencyPath(path: string, currentPath: string) {
    const isDependency = /^(\w|@\w)/.test(path);

    if (!isDependency) {
      return path;
    }

    const isCurrentPathDependency = currentPath.startsWith('/node_modules');
    if (!isCurrentPathDependency) {
      return path;
    }

    const dependencyName = getDependencyName(path);
    const previousDependencyName = getDependencyName(
      currentPath.replace('/node_modules/', '')
    );

    if (
      this.manifest.dependencyAliases[previousDependencyName] &&
      this.manifest.dependencyAliases[previousDependencyName][dependencyName]
    ) {
      const aliasedDependencyName = this.manifest.dependencyAliases[
        previousDependencyName
      ][dependencyName];

      return path.replace(dependencyName, aliasedDependencyName);
    }

    return path;
  }

  /**
   * Set the manager to use Webpack HMR, this changes how modules are hot reloaded
   * and how the manager cleans up the website.
   *
   * @memberof Manager
   */
  enableWebpackHMR() {
    this.webpackHMR = true;
  }

  resolveModule(
    path: string,
    currentPath: string,
    defaultExtensions: Array<string> = ['js', 'jsx', 'json']
  ): Module {
    const aliasedPath = this.getAliasedDependencyPath(path, currentPath);
    const shimmedPath = coreLibraries[aliasedPath] || aliasedPath;

    const pathId = shimmedPath + currentPath;
    const cachedPath = this.cachedPaths[pathId];
    try {
      let resolvedPath;

      if (cachedPath) {
        resolvedPath = cachedPath;
      } else {
        resolvedPath = resolve.sync(shimmedPath, {
          filename: currentPath,
          extensions: defaultExtensions.map(ext => '.' + ext),
          isFile: this.isFile,
          readFileSync: this.readFileSync,
          packageFilter: p => {
            if (!p.main && p.module) {
              // eslint-disable-next-line
              p.main = p.module;
            }

            return p;
          },
          moduleDirectory: ['node_modules', this.envVariables.NODE_PATH].filter(
            Boolean
          ),
        });

        this.cachedPaths[pathId] = resolvedPath;
      }

      if (NODE_LIBS.includes(shimmedPath) || resolvedPath === '//empty.js') {
        return {
          path: pathUtils.join('/node_modules', 'empty', 'index.js'),
          code: `// empty`,
          requires: [],
        };
      }

      return this.transpiledModules[resolvedPath].module;
    } catch (e) {
      delete this.cachedPaths[pathId];

      let connectedPath = /^(\w|@\w)/.test(shimmedPath)
        ? pathUtils.join('/node_modules', shimmedPath)
        : pathUtils.join(pathUtils.dirname(currentPath), shimmedPath);

      const isDependency = connectedPath.includes('/node_modules/');

      connectedPath = connectedPath.replace('/node_modules/', '');

      if (!isDependency) {
        throw new ModuleNotFoundError(shimmedPath, false);
      }

      const dependencyName = getDependencyName(connectedPath);

      if (
        this.manifest.dependencies.find(d => d.name === dependencyName) ||
        this.manifest.dependencyDependencies[dependencyName]
      ) {
        throw new ModuleNotFoundError(connectedPath, true);
      } else {
        throw new DependencyNotFoundError(connectedPath);
      }
    }
  }

  downloadDependency(
    path: string,
    currentPath: string,
    ignoredExtensions: Array<string> = this.preset.ignoredExtensions
  ): Promise<TranspiledModule> {
    return fetchModule(path, currentPath, this, ignoredExtensions).then(
      module => this.getTranspiledModule(module)
    );
  }

  updateModule(m: Module) {
    this.transpiledModules[m.path].module = m;
    return this.getTranspiledModulesByModule(m).map(tModule => {
      tModule.update(m);

      return tModule;
    });
  }

  resolveTranspiledModuleAsync = (
    path: string,
    currentPath: string,
    ignoredExtensions?: Array<string>
  ): Promise<TranspiledModule> => {
    try {
      return Promise.resolve(
        this.resolveTranspiledModule(path, currentPath, ignoredExtensions)
      );
    } catch (e) {
      if (e.type === 'module-not-found' && e.isDependency) {
        return this.downloadDependency(e.path, currentPath, ignoredExtensions);
      }

      throw e;
    }
  };

  /**
   * Resolve the transpiled module from the path, note that the path can actually
   * include loaders. That's why we're focussing on first extracting this query
   * @param {*} path
   * @param {*} currentPath
   */
  resolveTranspiledModule(
    path: string,
    currentPath: string,
    ignoredExtensions?: Array<string>
  ): TranspiledModule {
    if (path.startsWith('webpack:')) {
      throw new Error('Cannot resolve webpack path');
    }

    const queryPath = path.split('!');
    // pop() mutates queryPath, queryPath is now just the loaders
    const modulePath = queryPath.pop();

    const newPath = this.preset
      .getAliasedPath(modulePath)
      .replace(/.*\{\{sandboxRoot\}\}/, '');

    const module = this.resolveModule(
      newPath,
      currentPath,
      ignoredExtensions || this.preset.ignoredExtensions
    );

    return this.getTranspiledModule(module, queryPath.join('!'));
  }

  resolveTranspiledModulesInDirectory(
    path: string,
    currentPath: string
  ): Array<TranspiledModule> {
    const queryPath = path.split('!');
    // pop() mutates queryPath, queryPath is now just the loaders
    const modulesPath = queryPath.pop();

    const joinedPath = pathUtils.join(
      pathUtils.dirname(currentPath),
      modulesPath
    );

    return Object.keys(this.transpiledModules)
      .filter(p => p.startsWith(joinedPath))
      .map(m =>
        this.getTranspiledModule(
          this.transpiledModules[m].module,
          queryPath.join('!')
        )
      );
  }

  updateConfigurations(configurations: Configurations) {
    const configsUpdated = this.configurations
      ? !isEqual(configurations, this.configurations)
      : false;

    if (configsUpdated) {
      this.resetAllModules();
    }

    this.configurations = configurations;
  }

  /**
   * Find all changed, added and deleted modules. Update trees and
   * delete caches accordingly
   */
  updateData(modules: { [path: string]: Module }) {
    this.transpileJobs = {};
    this.hardReload = false;
    this.isFirstLoad = false;

    this.modules = modules;

    const addedModules: Array<Module> = [];
    const updatedModules: Array<Module> = [];

    Object.keys(modules).forEach(k => {
      const module: Module = modules[k];
      const mirrorModule = this.transpiledModules[k];

      if (!mirrorModule) {
        // File structure changed, reset cached paths
        this.cachedPaths = {};
        addedModules.push(module);
      } else if (mirrorModule.module.code !== module.code) {
        // File structure changed, reset cached paths
        this.cachedPaths = {};
        updatedModules.push(module);
      }
    });

    this.getModules().forEach(m => {
      if (
        !m.path.startsWith('/node_modules') &&
        !modules[m.path] &&
        !m.parent // not an emitted module
      ) {
        this.removeModule(m);
      }
    });

    addedModules.forEach(m => {
      this.addTranspiledModule(m);
    });

    const modulesToUpdate: Array<Module> = uniq([
      ...addedModules,
      ...updatedModules,
    ]);

    // We eagerly transpile changed files,
    // this way we don't have to traverse the whole
    // dependency graph each time a file changes
    const tModulesToUpdate = modulesToUpdate.map(m => this.updateModule(m));

    if (tModulesToUpdate.length > 0 && this.configurations.sandbox) {
      this.hardReload = this.configurations.sandbox.parsed.hardReloadOnChange;
    }

    const allModulesToUpdate = uniq(
      flattenDeep([
        tModulesToUpdate,
        // All modules with errors
        this.getTranspiledModules().filter(t => {
          if (t.hasMissingDependencies) {
            t.resetTranspilation();
          }
          return t.errors.length > 0 || t.hasMissingDependencies;
        }),
      ])
    );
    const transpiledModulesToUpdate = allModulesToUpdate.filter(
      m => !TestRunner.isTest(m.module.path)
    );
    // Reset test files, but don't transpile. We want to do that in the test runner
    // so we can catch any errors
    allModulesToUpdate
      .filter(m => TestRunner.isTest(m.module.path))
      .forEach(m => m.resetTranspilation());

    debug(
      `Generated update diff, updating ${
        transpiledModulesToUpdate.length
      } modules.`
    );

    return Promise.all(
      transpiledModulesToUpdate.map(tModule => tModule.transpile(this))
    );
  }

  /**
   * Mark that the next evaluation should first have a location.reload() before
   * continuing
   */
  markHardReload() {
    this.hmrStatus = 'fail';
    this.hardReload = true;
  }

  serialize() {
    const serializedTModules = {};

    Object.keys(this.transpiledModules).forEach(path => {
      Object.keys(this.transpiledModules[path].tModules).forEach(query => {
        const tModule = this.transpiledModules[path].tModules[query];
        serializedTModules[tModule.getId()] = tModule.serialize();
      });
    });

    const dependenciesQuery = this.getDependencyQuery();

    return {
      transpiledModules: serializedTModules,
      cachedPaths: this.cachedPaths,
      version: VERSION,
      configurations: this.configurations,
      meta: getCombinedMetas(),
      dependenciesQuery,
    };
  }

  getDependencyQuery() {
    if (!this.manifest || !this.manifest.dependencies) {
      return '';
    }

    const normalizedDependencies = {};

    this.manifest.dependencies.forEach(dep => {
      normalizedDependencies[dep.name] = dep.version;
    });

    return dependenciesToQuery(normalizedDependencies);
  }

  /**
   * Generate a JSON structure out of this manager that can be used to load
   * the manager later on. This is useful for faster initial loading.
   */
  async save() {
    try {
      const serialized = this.serialize();
      if (process.env.NODE_ENV === 'development') {
        debug(
          'Saving cache of ' +
            (JSON.stringify(serialized).length / 1024).toFixed(2) +
            ' kb'
        );
      }
      await localforage.setItem(this.id, serialized);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error(e);
      }
      this.clearCache();
    }
  }

  async load() {
    try {
      const data = await localforage.getItem(this.id);
      if (data) {
        this.clearCache();
        const {
          transpiledModules: serializedTModules,
          cachedPaths,
          version,
          configurations,
          dependenciesQuery,
          meta,
        }: {
          transpiledModules: { [id: string]: SerializedTranspiledModule },
          cachedPaths: { [path: string]: string },
          version: string,
          configurations: Object,
          dependenciesQuery: string,
          meta: any,
        } = data;

        // Only use the cache if the cached version was cached with the same
        // version of the compiler and dependencies haven't changed
        if (
          version === VERSION &&
          dependenciesQuery === this.getDependencyQuery()
        ) {
          setCombinedMetas(meta);

          this.cachedPaths = cachedPaths;
          this.configurations = configurations;

          const tModules: { [id: string]: TranspiledModule } = {};
          // First create tModules for all the saved modules, so we have references
          Object.keys(serializedTModules).forEach(id => {
            const sTModule = serializedTModules[id];

            const tModule = this.addTranspiledModule(
              sTModule.module,
              sTModule.query
            );
            tModules[id] = tModule;
          });

          Object.keys(tModules).forEach(id => {
            const tModule = tModules[id];

            tModule.load(serializedTModules[id], tModules);
          });
          debug(`Loaded cache.`);
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error(e);
      }
    }
    this.clearCache();
  }

  dispose() {
    if (this.preset) {
      this.preset.transpilers.forEach(t => {
        t.dispose();
      });
    }
  }

  clearCache() {
    try {
      localforage.clear();
    } catch (ex) {
      if (process.env.NODE_ENV === 'development') {
        console.error(ex);
      }
    }
  }

  /**
   * Get information about all transpilers currently registered for this manager
   */
  async getTranspilerContext() {
    const info = {};

    const data = await Promise.all(
      Array.from(this.preset.transpilers).map(t =>
        t
          .getTranspilerContext(this)
          .then(context => ({ name: t.name, data: context }))
      )
    );

    data.forEach(t => {
      info[t.name] = t.data;
    });

    return info;
  }
}
