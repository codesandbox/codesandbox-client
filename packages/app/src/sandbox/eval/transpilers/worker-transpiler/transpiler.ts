import { LoaderContext, Transpiler, Manager } from 'sandpack-core';
import { WorkerManager, WorkerManagerOptions } from './worker-manager';

// A transpiler that uses web workers for concurrent transpilation on multiple threads
export default abstract class WorkerTranspiler extends Transpiler {
  workerManager: WorkerManager;

  constructor(
    name: string,
    workerFactory: () => Worker,
    options: WorkerManagerOptions
  ) {
    super(name);
    this.workerManager = new WorkerManager(name, workerFactory, options);
    this.workerManager.registerFunction('resolve-fs', (data, loaderContext) =>
      loaderContext.getModules()
    );
    this.workerManager.registerFunction(
      'resolve-async-transpiled-module',
      async (data, loaderContext) => {
        try {
          const tModule = await loaderContext.resolveTranspiledModuleAsync(
            data.path,
            data.options
          );
          return {
            found: true,
            path: tModule.module.path,
            code: tModule.module.code,
          };
        } catch (err) {
          return {
            found: false,
          };
        }
      }
    );
    this.workerManager.registerFunction(
      'add-dependency',
      async (data, loaderContext) => {
        if (data.isGlob) {
          loaderContext.addDependenciesInDirectory(data.path, {
            isAbsolute: data.isAbsolute,
            isEntry: data.isEntry,
          });
        } else {
          await loaderContext.addDependency(data.path, {
            isAbsolute: data.isAbsolute,
            isEntry: data.isEntry,
          });
        }
      }
    );
  }

  getWorker(): Promise<Worker> {
    // @ts-ignore
    return Promise.resolve(new this.Worker());
  }

  initialize() {
    this.workerManager.initialize();
  }

  dispose() {
    this.workerManager.dispose();
  }

  async runTask(data: any, loaderContext: LoaderContext) {
    const loaderContextId = this.workerManager.registerLoaderContext(
      loaderContext
    );

    const result = await this.workerManager.callFn({
      method: 'compile',
      data,
      loaderContextId,
    });
    this.workerManager.cleanupLoaderContext(loaderContextId);
    return result;
  }

  async getTranspilerContext(manager: Manager) {
    return super.getTranspilerContext(manager).then(x => ({
      ...x,
      worker: true,
      // TODO: Actually see where this is used and update where applicable...
      hasFS: this.workerManager.hasFS,
      workerCount: this.workerManager.workerCount,
      initialized: Boolean(this.workerManager.workers.size),
    }));
  }
}
