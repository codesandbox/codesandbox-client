import type BrowserFS from 'codesandbox-browserfs';
import _debug from 'app/utils/debug';

import Transpiler from './';
import { parseWorkerError } from './utils/worker-error-handler';
import { type LoaderContext } from '../transpiled-module';

const debug = _debug('cs:compiler:worker-transpiler');

type Task = {
  message: any,
  callbacks: Array<(err: ?any, data: ?any) => void>,
  loaderContext: LoaderContext,
};

/**
 * A transpiler that handles worker messaging for you! Magic
 */
export default class WorkerTranspiler extends Transpiler {
  Worker: Worker;
  workers: Array<Worker>;
  idleWorkers: Array<Worker>;
  workerCount: number;
  tasks: {
    [id: string]: Task,
  };
  initialized: boolean;
  runningTasks: {
    [id: string]: (error: Error, message: Object) => void,
  };
  hasFS: boolean;

  constructor(
    name: string,
    Worker: Worker,
    workerCount = navigator.hardwareConcurrency,
    options: { hasFS: boolean } = {}
  ) {
    super(name);

    this.workerCount = workerCount;
    this.Worker = Worker;
    this.workers = [];
    this.idleWorkers = [];
    this.tasks = {};
    this.initialized = false;
    this.hasFS = options.hasFS || false;
  }

  getWorker() {
    return Promise.resolve(new this.Worker());
  }

  loadWorker() {
    return new Promise(async resolve => {
      const t = Date.now();
      const worker = await this.getWorker();

      if (this.hasFS) {
        // Register file system that syncs with filesystem in manager
        BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker);
        worker.postMessage({ type: 'initialize-fs', codesandbox: true });
      }

      debug(`Loaded '${this.name}' worker in ${Date.now() - t}ms`);
      this.idleWorkers.push(worker);

      this.executeRemainingTasks();

      resolve();

      this.workers.push(worker);
    });
  }

  async initialize() {
    this.initialized = true;
    if (this.workers.length === 0) {
      await Promise.all(
        Array.from({ length: this.workerCount }, () => this.loadWorker())
      );
    }
  }

  dispose() {
    this.workers.forEach(w => w.terminate());
    this.initialized = false;
    this.tasks = {};
    this.workers.length = 0;
    this.idleWorkers.length = 0;
  }

  executeRemainingTasks() {
    const taskIds = Object.keys(this.tasks);
    while (this.idleWorkers.length && taskIds.length) {
      const taskId = taskIds.shift();

      const task = this.tasks[taskId];
      delete this.tasks[taskId];

      const worker = this.idleWorkers.shift();
      this.executeTask(task, worker);
    }
  }

  runCallbacks(callbacks: Array<Function>, err, data) {
    callbacks.forEach(c => c(err, data));
  }

  executeTask({ message, loaderContext, callbacks }: Task, worker: Worker) {
    worker.onmessage = async newMessage => {
      const { data } = newMessage;

      if (data) {
        if (data.type === 'error') {
          const reconstructedError = parseWorkerError(data.error);

          this.runCallbacks(callbacks, reconstructedError);
        }

        if (data.type === 'warning') {
          loaderContext.emitWarning(data.warning);
          return;
        }

        if (data.type === 'resolve-async-transpiled-module') {
          // This one is to add an asynchronous transpiled module

          const { id, path, options } = data;

          try {
            const tModule = await loaderContext.resolveTranspiledModuleAsync(
              path,
              options
            );
            worker.postMessage({
              type: 'resolve-async-transpiled-module-response',
              id,
              found: true,
              path: tModule.module.path,
            });
          } catch (e) {
            worker.postMessage({
              type: 'resolve-async-transpiled-module-response',
              id,
              found: false,
            });
          }
        }

        if (data.type === 'add-dependency') {
          // Dynamic import
          if (data.isGlob) {
            loaderContext.addDependenciesInDirectory(data.path, {
              isAbsolute: data.isAbsolute,
              isEntry: data.isEntry,
            });
          } else {
            loaderContext.addDependency(data.path, {
              isAbsolute: data.isAbsolute,
              isEntry: data.isEntry,
            });
          }
          return;
        }

        if (data.type === 'add-transpilation-dependency') {
          loaderContext.addTranspilationDependency(data.path, {
            isAbsolute: data.isAbsolute,
            isEntry: data.isEntry,
          });
          return;
        }

        // Means the transpile task has been completed
        if (data.type === 'result') {
          this.runCallbacks(callbacks, null, data);
        }

        if (data.type === 'error' || data.type === 'result') {
          this.idleWorkers.push(worker);
          this.executeRemainingTasks();
        }
      }
    };
    worker.postMessage({ type: 'compile', codesandbox: true, ...message });
  }

  async queueTask(
    message: any,
    id: string,
    loaderContext: LoaderContext,
    callback: (err: Error, message: Object) => void
  ) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.tasks[id]) {
      this.tasks[id] = {
        message,
        loaderContext,
        callbacks: [],
      };
    }

    this.tasks[id].callbacks.push(callback);

    this.executeRemainingTasks();
  }

  async getTranspilerContext() {
    return super.getTranspilerContext().then(x => ({
      ...x,
      worker: true,
      hasFS: this.hasFS,
      workerCount: this.workerCount,
      initialized: !!this.initialized,
    }));
  }
}
