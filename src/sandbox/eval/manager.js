// @flow
import type { Module, Directory } from 'common/types';
import { flattenDeep, uniq, values } from 'lodash';

import TranspiledModule from './transpiled-module';
import Preset from './presets';
import resolveModule, {
  getModulesInDirectory,
} from '../../common/sandbox/resolve-module';

type Externals = {
  [name: string]: string,
};

export default class Manager {
  id: string;
  transpiledModules: {
    [id: string]: TranspiledModule,
  };
  preset: Preset;
  externals: Externals;
  modules: Array<Module>;
  directories: Array<Directory>;

  constructor(
    id: string,
    modules: Array<Module>,
    directories: Array<Directory>,
    preset: Preset,
  ) {
    this.id = id;
    this.modules = modules;
    this.directories = directories;
    this.preset = preset;
    this.transpiledModules = {};

    console.log(this);
  }

  setExternals(externals: Externals) {
    this.externals = externals;
  }

  initialize() {}

  evaluateModule(module: Module) {
    const transpiledModule = this.getTranspiledModule(module);

    // Run post evaluate first
    const exports = this.evaluateTranspiledModule(transpiledModule, []);

    this.getTranspiledModules().forEach(t => t.postEvaluate(this));

    return exports;
  }

  evaluateTranspiledModule(
    transpiledModule: TranspiledModule,
    parentModules: Array<TranspiledModule>,
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
    let transpiledModule = this.transpiledModules[`${module.id}:${query}`];

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
    return this.getTranspiledModules().filter(t => t.module.id === module.id);
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
  transpileModules(entry: Module): Promise<TranspiledModule> {
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
        [next.id]: next,
      }),
      {},
    );
    const transpiledModules = this.getTranspiledModules().reduce(
      (prev, next) => ({
        ...prev,
        [next.module.id]: next.module,
      }),
      {},
    );

    return values({ ...sandboxModules, ...transpiledModules });
  }

  getDirectories() {
    return this.directories;
  }

  /**
   * Resolve the transpiled module from the path, note that the path can actually
   * include loaders. That's why we're focussing on first extracting this query
   * @param {*} path
   * @param {*} startdirectoryShortid
   * @param {*} string
   */
  resolveTranspiledModule(
    path: string,
    startdirectoryShortid: ?string,
  ): TranspiledModule {
    const queryPath = path.split('!');
    // pop() mutates queryPath, queryPath is now just the loaders
    const modulePath = queryPath.pop();

    const module = resolveModule(
      this.preset.getAliasedPath(modulePath),
      this.getModules(),
      this.getDirectories(),
      startdirectoryShortid,
      this.preset.ignoredExtensions,
    );

    return this.getTranspiledModule(module, queryPath.join('!'));
  }

  resolveTranspiledModulesInDirectory(
    path: string,
    startdirectoryShortid: ?string,
  ): Array<TranspiledModule> {
    const queryPath = path.split('!');
    // pop() mutates queryPath, queryPath is now just the loaders
    const modulesPath = queryPath.pop();

    const { modules } = getModulesInDirectory(
      modulesPath,
      this.getModules(),
      this.getDirectories(),
      startdirectoryShortid,
    );

    return modules.map(module =>
      this.getTranspiledModule(module, queryPath.join('!')),
    );
  }

  /**
   * Find all changed, added and deleted modules. Update trees and
   * delete caches accordingly
   */
  updateData(modules: Array<Module>, directories: Array<Directory>) {
    // Create an object with mapping from modules
    const moduleObject = this.modules.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next,
      }),
      {},
    );

    const addedModules = [];
    const updatedModules = [];
    const deletedModules = [];

    modules.forEach(module => {
      const mirrorModule = moduleObject[module.id];

      if (!mirrorModule) {
        addedModules.push(module);
      } else if (
        mirrorModule.code !== module.code ||
        mirrorModule.title !== module.title ||
        mirrorModule.directoryShortid !== module.directoryShortid
      ) {
        updatedModules.push(module);
      }
    });

    this.modules.forEach(module => {
      const mirrorModule = modules.find(m => m.id === module.id);

      if (!mirrorModule) {
        deletedModules.push(module);
      }
    });

    this.modules = modules;
    this.directories = directories;

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
      ]),
    );

    return Promise.all(
      transpiledModulesToUpdate.map(tModule => tModule.transpile(this)),
    );
  }
}
