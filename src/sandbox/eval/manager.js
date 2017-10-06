// @flow
import { flattenDeep, uniq, values } from 'lodash';

import * as pathUtils from 'common/utils/path';

import type { Module } from './entities/module';
import TranspiledModule from './transpiled-module';
import Preset from './presets';
import nodeResolvePath from './utils/node-resolve-path';

type Externals = {
  [name: string]: string,
};

type Manifest = {
  aliases: {
    [path: string]: string | false,
  },
  contents: {
    [path: string]: { content: string, requires: Array<string> },
  },
  dependencies: Array<{ name: string, version: string }>,
  dependencyDependencies: {
    [name: string]: string,
  },
};

export default class Manager {
  id: string;
  transpiledModules: {
    [id: string]: TranspiledModule,
  };
  preset: Preset;
  externals: Externals;
  modules: Array<Module>;

  manifest: Manifest;
  experimentalPackager: boolean;

  constructor(
    id: string,
    modules: Array<Module>,
    preset: Preset,
    options: Object = {}
  ) {
    this.id = id;
    this.modules = modules;
    this.preset = preset;
    this.transpiledModules = {};

    this.experimentalPackager = options.experimentalPackager || false;

    if (process.env.NODE_ENV === 'development') {
      console.log(this);
    }
  }

  setExternals(externals: Externals) {
    this.externals = externals;
  }

  setManifest(manifest: Manifest) {
    this.manifest = manifest;
  }

  evaluateModule(module: Module) {
    const transpiledModule = this.getTranspiledModule(module);

    // Run post evaluate first
    const exports = this.evaluateTranspiledModule(transpiledModule, []);

    this.getTranspiledModules().forEach(t => t.postEvaluate(this));

    return exports;
  }

  evaluateTranspiledModule(
    transpiledModule: TranspiledModule,
    parentModules: Array<TranspiledModule>
  ) {
    return transpiledModule.evaluate(this, parentModules);
  }

  addModule(module: Module, query: string = ''): TranspiledModule {
    const transpiledModule = new TranspiledModule(module, query);

    this.transpiledModules[transpiledModule.getId()] = transpiledModule;
    return transpiledModule;
  }

  /**
   * Get Transpiled Module from the registry, if there is no transpiled module
   * in the registry it will create a new one
   * @param {*} module
   * @param {*} query A webpack like syntax (!url-loader)
   * @param {*} string
   */
  getTranspiledModule(module: Module, query: string = ''): TranspiledModule {
    let transpiledModule = this.transpiledModules[`${module.path}:${query}`];

    if (!transpiledModule) {
      transpiledModule = this.addModule(module, query);
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
    return this.getTranspiledModules().filter(
      t => t.module.path === module.path
    );
  }

  getTranspiledModules() {
    const transpiledModuleValues = values(this.transpiledModules);

    return flattenDeep([
      transpiledModuleValues,
      ...transpiledModuleValues.map(m => m.getChildTranspiledModules()),
    ]);
  }

  removeTranspiledModule(tModule: TranspiledModule) {
    delete this.transpiledModules[tModule.getId()];
  }

  /**
   * Will transpile this module and all eventual children (requires) that go with it
   * @param {*} entry
   */
  transpileModules(entry: Module) {
    const transpiledModule = this.getTranspiledModule(entry);

    transpiledModule.setIsEntry(true);
    return transpiledModule.transpile(this);
  }

  clearCompiledCache() {
    this.getTranspiledModules().map(tModule => tModule.resetCompilation());
  }

  getModules(): Array<Module> {
    const sandboxModules = this.modules.reduce(
      (prev, next) => ({
        ...prev,
        [next.path]: next,
      }),
      {}
    );
    const transpiledModules = this.getTranspiledModules().reduce(
      (prev, next) => ({
        ...prev,
        [next.module.path]: next.module,
      }),
      {}
    );

    return values({ ...sandboxModules, ...transpiledModules });
  }

  resolveModule(
    path: string,
    defaultExtensions: Array<string> = ['js', 'jsx', 'json']
  ): Module {
    const moduleObject = this.getModuleObject();
    const foundPath = nodeResolvePath(path, moduleObject, defaultExtensions);

    if (foundPath && moduleObject[foundPath]) {
      return moduleObject[foundPath];
    }

    throw new Error(`Cannot find module in ${path}`);
  }

  resolveDependency(
    path: string,
    defaultExtensions: Array<string> = ['js', 'jsx', 'json']
  ): { code: string, path: string, requires: Array<string> } {
    let depPath = path.replace('/node_modules/', '');

    const aliasedPath = nodeResolvePath(
      depPath,
      this.manifest.aliases,
      defaultExtensions
    );

    depPath = aliasedPath == null ? depPath : aliasedPath;

    const alias = this.manifest.aliases[depPath];
    // So aliased to not be included in the bundle, decided by browser object on pkg
    if (alias === false) {
      return {
        path: pathUtils.join('/node_modules', depPath),
        code: 'module.exports = null;',
        requires: [],
      };
    }

    depPath = nodeResolvePath(
      alias || depPath,
      this.manifest.contents,
      defaultExtensions
    );
    if (depPath && this.manifest.contents[depPath]) {
      return {
        path: pathUtils.join('/node_modules', depPath),
        code: this.manifest.contents[depPath].content,
        requires: this.manifest.contents[depPath].requires,
      };
    }

    throw new Error(`Cannot find dependency in ${path}`);
  }

  /**
   * Resolve the transpiled module from the path, note that the path can actually
   * include loaders. That's why we're focussing on first extracting this query
   * @param {*} path
   * @param {*} currentPath
   * @param {*} string
   */
  resolveTranspiledModule(path: string, currentPath: string): TranspiledModule {
    if (path.startsWith('webpack:')) {
      throw new Error('Cannot resolve webpack path');
    }

    const queryPath = path.split('!');
    // pop() mutates queryPath, queryPath is now just the loaders
    const modulePath = queryPath.pop();

    let module;

    let newPath = pathUtils
      .join(
        pathUtils.dirname(currentPath),
        this.preset.getAliasedPath(modulePath)
      )
      .replace(/.*\{\{sandboxRoot\}\}/, '');

    if (/^(\w|@\w)/.test(modulePath) && !modulePath.includes('!')) {
      // Prepend node_modules and go to root if it is a dependency
      newPath = pathUtils.join('/node_modules', modulePath);
    }

    // TODO DRY
    if (newPath.startsWith('/node_modules')) {
      if (this.experimentalPackager) {
        module = this.resolveDependency(newPath, this.preset.ignoredExtensions);
      } else {
        return;
      }
    } else {
      module = this.resolveModule(newPath, this.preset.ignoredExtensions);
    }

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

    const modules = this.getModules().filter(m =>
      m.path.startsWith(joinedPath)
    );

    return modules.map(module =>
      this.getTranspiledModule(module, queryPath.join('!'))
    );
  }

  getModuleObject = () =>
    this.getModules().reduce(
      (prev, next) => ({
        ...prev,
        [next.path]: next,
      }),
      {}
    );

  /**
   * Find all changed, added and deleted modules. Update trees and
   * delete caches accordingly
   */
  updateData(modules: Array<Module>) {
    // Create an object with mapping from modules
    const moduleObject = this.getModuleObject();

    const addedModules = [];
    const updatedModules = [];
    const deletedModules = [];

    modules.forEach(module => {
      const mirrorModule = moduleObject[module.path];

      if (!mirrorModule) {
        addedModules.push(module);
      } else if (mirrorModule.code !== module.code) {
        updatedModules.push(module);
      }
    });

    this.modules.forEach(module => {
      const mirrorModule = modules.find(m => m.path === module.path);

      if (!mirrorModule) {
        deletedModules.push(module);
      }
    });

    deletedModules.forEach(m => {
      const transpiledModules = this.getTranspiledModulesByModule(m);

      transpiledModules.forEach(tModule => {
        tModule.dispose();
        delete this.transpiledModules[tModule.getId()];
      });
    });

    const modulesToUpdate = uniq([...addedModules, ...updatedModules]);

    modulesToUpdate.forEach(m => {
      this.getTranspiledModulesByModule(m).forEach(tModule => {
        tModule.update(m);
      });
    });

    const transpiledModulesToUpdate = uniq(
      flattenDeep([
        modulesToUpdate.map(m => this.getTranspiledModulesByModule(m)),
        // All modules with errors
        this.getTranspiledModules().filter(t => t.errors.length > 0),
      ])
    );

    this.modules = modules;

    return Promise.all(
      transpiledModulesToUpdate.map(tModule => tModule.transpile(this))
    );
  }
}
