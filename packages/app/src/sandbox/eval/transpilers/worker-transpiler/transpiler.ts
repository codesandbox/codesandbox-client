import { LoaderContext, Transpiler, Manager } from 'sandpack-core';
import { dispatch, actions } from 'codesandbox-api';

import { WorkerManager, WorkerManagerOptions } from './worker-manager';

// A transpiler that uses web workers for concurrent transpilation on multiple threads
export abstract class WorkerTranspiler extends Transpiler {
  public workerManager: WorkerManager;

  loaderContextId: number = 0;
  loaderContexts: Map<number, LoaderContext> = new Map();

  constructor(
    name: string,
    workerFactory: () => Worker,
    options: WorkerManagerOptions
  ) {
    super(name);
    this.workerManager = new WorkerManager(name, workerFactory, options);
    this.workerManager.registerFunction('resolve-fs', data => {
      const loaderContext = this.loaderContexts.get(data.loaderContextId);
      if (!loaderContext) {
        console.warn('Could not find loader context for resolve-fs', data);
        throw new Error('Could not find loader context');
      }

      const modules = loaderContext.getModules();
      return { modules };
    });
    this.workerManager.registerFunction(
      'resolve-async-transpiled-module',
      async data => {
        const loaderContext = this.loaderContexts.get(data.loaderContextId);
        if (!loaderContext) {
          console.warn(
            'Could not find loader context for resolve-async-transpiled-module',
            data
          );
          throw new Error('Could not find loader context');
        }

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
    this.workerManager.registerFunction('add-dependency', async data => {
      const loaderContext = this.loaderContexts.get(data.loaderContextId);
      if (!loaderContext) {
        console.warn('Could not find loader context for add-dependency', data);
        throw new Error('Could not find loader context');
      }

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
    });
    this.workerManager.registerFunction(
      'add-transpilation-dependency',
      async data => {
        const loaderContext = this.loaderContexts.get(data.loaderContextId);
        if (!loaderContext) {
          console.warn(
            'Could not find loader context for add-transpilation-dependency',
            data
          );
          throw new Error('Could not find loader context');
        }

        await loaderContext.addTranspilationDependency(data.path, {
          isAbsolute: data.isAbsolute,
          isEntry: data.isEntry,
        });
      }
    );
    this.workerManager.registerFunction('clear-warnings', data => {
      dispatch(actions.correction.clear(data.path, data.source));
    });
    this.workerManager.registerFunction('warning', data => {
      const loaderContext = this.loaderContexts.get(data.loaderContextId);
      if (!loaderContext) {
        console.warn('Could not find loader context for warning', data);
        throw new Error('Could not find loader context');
      }
      loaderContext.emitWarning(data.warning);
    });
  }

  initialize() {
    this.workerManager.initialize();
  }

  dispose() {
    this.workerManager.dispose();
  }

  registerLoaderContext(loaderContext: LoaderContext): number {
    const cid = this.loaderContextId++;
    this.loaderContexts.set(cid, loaderContext);
    return cid;
  }

  cleanupLoaderContext(loaderContextId: number): void {
    this.loaderContexts.delete(loaderContextId);
  }

  async queueCompileFn(data: any, loaderContext: LoaderContext) {
    const loaderContextId = this.registerLoaderContext(loaderContext);
    const result = await this.workerManager.callFn({
      method: 'compile',
      data: {
        ...data,
        loaderContextId,
      },
    });
    this.cleanupLoaderContext(loaderContextId);
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

export default WorkerTranspiler;
