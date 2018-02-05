// @flow
import { flattenDeep, uniq, values } from 'lodash';
import resolve from 'browser-resolve';
import localforage from 'localforage';
import preval from 'babel-plugin-preval/macro';

import * as pathUtils from 'common/utils/path';
import _debug from 'app/utils/debug';

import type { Module } from './entities/module';
import TranspiledModule from './transpiled-module';
import type { SerializedTranspiledModule } from './transpiled-module';
import Preset from './presets';
import fetchModule, { getCombinedMetas } from './npm/fetch-npm-module';
import coreLibraries from './npm/get-core-libraries';
import getDependencyName from './utils/get-dependency-name';
import DependencyNotFoundError from '../errors/dependency-not-found-error';
import ModuleNotFoundError from '../errors/module-not-found-error';
import TestRunner from './tests/jest-lite';

type Externals = {
  [name: string]: string,
};

type ModuleObject = {
  [path: string]: Module,
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

const NODE_LIBS = ['dgram', 'fs', 'net', 'tls', 'child_process'];
const VERSION = preval`module.exports = Date.now()`;
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
  webpackHMR: boolean = false;
  hardReload: boolean = false;
  hmrStatus: 'idle' | 'check' | 'apply' | 'fail' = 'idle';
  testRunner: TestRunner;

  // List of modules that are being transpiled, to prevent duplicate jobs.
  transpileJobs: { [transpiledModuleId: string]: true };

  transpiledModulesByHash = {};

  constructor(id: string, preset: Preset, modules: Array<Module>) {
    this.id = id;
    this.preset = preset;
    this.transpiledModules = {};
    this.cachedPaths = {};
    this.transpileJobs = {};
    modules.forEach(m => this.addModule(m));
    this.testRunner = new TestRunner(this);

    if (process.env.NODE_ENV === 'development') {
      window.manager = this;
      console.log(this);
    }
  }

  // Hoist these 2 functions to the top, since they get executed A LOT
  isFile = (p: string) =>
    !!this.transpiledModules[p] || !!getCombinedMetas()[p];

  readFileSync = (p: string) => {
    if (this.transpiledModules[p]) {
      return this.transpiledModules[p].module.code;
    }

    const err = new Error('Could not find ' + p);
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
      if (!/^(import|export)\s/gm.test(module.code)) {
        module.requires = this.manifest.contents[path].requires;
      }

      this.addModule(module);
    });
    debug(`Loaded manifest.`);
  }

  evaluateModule(module: Module) {
    if (this.hardReload) {
      // Do a hard reload
      document.location.reload();
      return;
    }

    this.hmrStatus = 'apply';

    // Evaluate the *changed* HMR modules first
    this.getTranspiledModules()
      .filter(t => t.hmrConfig && t.hmrConfig.isDirty())
      .forEach(t => t.evaluate(this));

    const transpiledModule = this.getTranspiledModule(module);

    const exports = this.evaluateTranspiledModule(transpiledModule);

    // Run post evaluate
    this.getTranspiledModules().forEach(t => t.postEvaluate(this));

    this.hmrStatus = 'idle';

    return exports;
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

  // All paths are resolved at least twice: during transpilation and evaluation.
  // We can improve performance by almost 2x in this scenario if we cache the lookups
  cachedPaths: {
    [path: string]: string,
  } = {};

  resolveModule(
    path: string,
    currentPath: string,
    defaultExtensions: Array<string> = ['js', 'jsx', 'json']
  ): Module {
    const aliasedPath = this.getAliasedDependencyPath(path, currentPath);
    const shimmedPath = coreLibraries[aliasedPath] || aliasedPath;

    const pathId = path + currentPath;
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
          moduleDirectory: ['node_modules', this.envVariables.NODE_PATH].filter(
            x => x
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

  async downloadDependency(
    path: string,
    currentPath: string
  ): Promise<TranspiledModule> {
    return fetchModule(
      path,
      currentPath,
      this,
      this.preset.ignoredExtensions
    ).then(module => this.getTranspiledModule(module));
  }

  /**
   * Resolve the transpiled module from the path, note that the path can actually
   * include loaders. That's why we're focussing on first extracting this query
   * @param {*} path
   * @param {*} currentPath
   */
  resolveTranspiledModule(path: string, currentPath: string): TranspiledModule {
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
      this.preset.ignoredExtensions
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

  /**
   * Find all changed, added and deleted modules. Update trees and
   * delete caches accordingly
   */
  updateData(modules: Array<Module>) {
    this.transpileJobs = {};
    this.hardReload = false;

    const addedModules = [];
    const updatedModules = [];

    modules.forEach(module => {
      const mirrorModule = this.transpiledModules[module.path];

      if (!mirrorModule) {
        // File structure changed, reset cached paths
        this.cachedPaths = {};
        addedModules.push(module);
        this.addTranspiledModule(module);
      } else if (mirrorModule.module.code !== module.code) {
        // File structure changed, reset cached paths
        this.cachedPaths = {};
        updatedModules.push(module);
      }
    });

    this.getModules().forEach(m => {
      if (
        !m.path.startsWith('/node_modules') &&
        !modules.find(m2 => m2.path === m.path) &&
        !m.parent // not an emitted module
      ) {
        this.removeModule(m);
      }
    });

    const modulesToUpdate = uniq([...addedModules, ...updatedModules]);

    // We eagerly transpile changed files,
    // this way we don't have to traverse the whole
    // dependency graph each time a file changes

    const tModulesToUpdate = modulesToUpdate.map(m =>
      this.getTranspiledModulesByModule(m).map(tModule => {
        this.transpiledModules[m.path].module = m;
        tModule.update(m);

        return tModule;
      })
    );

    const transpiledModulesToUpdate = uniq(
      flattenDeep([
        tModulesToUpdate,
        // All modules with errors
        this.getTranspiledModules().filter(t => t.errors.length > 0),
      ])
    );

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

  /**
   * Generate a JSON structure out of this manager that can be used to load
   * the manager later on. This is useful for faster initial loading.
   */
  async save() {
    try {
      const serializedTModules = {};

      Object.keys(this.transpiledModules).forEach(path => {
        Object.keys(this.transpiledModules[path].tModules).forEach(query => {
          const tModule = this.transpiledModules[path].tModules[query];
          serializedTModules[tModule.getId()] = tModule.serialize();
        });
      });

      await localforage.setItem(this.id, {
        transpiledModules: serializedTModules,
        cachedPaths: this.cachedPaths,
        version: VERSION,
      });
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
        }: {
          transpiledModules: { [id: string]: SerializedTranspiledModule },
          cachedPaths: { [path: string]: string },
          version: string,
        } = data;

        // Only use the cache if the cached version was cached with the same
        // version of the compiler
        if (version === VERSION) {
          this.cachedPaths = cachedPaths || {};

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

  clearCache() {
    try {
      localforage.clear();
    } catch (ex) {
      if (process.env.NODE_ENV === 'development') {
        console.error(ex);
      }
    }
  }
}
