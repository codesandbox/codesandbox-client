import _debug from '@codesandbox/common/lib/utils/debug';
import { dispatch, actions } from 'codesandbox-api';

import Transpiler, { TranspilerResult } from '.';
import { parseWorkerError } from './utils/worker-error-handler';
import { LoaderContext } from '../transpiled-module';
import Manager from '../manager';

const debug = _debug('cs:compiler:worker-transpiler');

type TranspilerCallback = (
  err: any | undefined,
  data: TranspilerResult | undefined
) => void;

type Task = {
  message: any;
  callbacks: TranspilerCallback[];
  loaderContext: LoaderContext;
};

/**
 * A transpiler that handles worker messaging for you! Magic
 */
export default abstract class WorkerTranspiler extends Transpiler {
  Worker: () => Worker;
  workers: Array<Worker>;
  idleWorkers: Array<Worker>;
  loadingWorkers: number;
  workerCount: number;
  tasks: {
    [id: string]: Task;
  };

  initialized: boolean;
  runningTasks: {
    [id: string]: (error: Error, message: Object) => void;
  };

  hasFS: boolean;

  constructor(
    name: string,
    Worker: () => Worker,
    workerCount = navigator.hardwareConcurrency,
    options: { hasFS?: boolean; preload?: boolean } = {}
  ) {
    super(name);

    this.workerCount = workerCount;
    this.Worker = Worker;
    this.workers = [];
    this.idleWorkers = [];
    this.tasks = {};
    this.initialized = false;
    this.hasFS = options.hasFS || false;
    this.loadingWorkers = 0;

    if (options.preload) {
      if (this.workers.length === 0) {
        Promise.all(
          Array.from({ length: this.workerCount }, () => this.loadWorker())
        );
      }
    }
  }

  getWorker(): Promise<Worker> {
    // @ts-ignore
    return Promise.resolve(new this.Worker());
  }

  async loadWorker() {
    this.loadingWorkers++;
    const t = Date.now();
    const worker = await this.getWorker();
    const readyListener = e => {
      if (e.data === 'ready') {
        debug(`Loaded '${this.name}' worker in ${Date.now() - t}ms`);
        worker.removeEventListener('message', readyListener);
      }
    };
    worker.addEventListener('message', readyListener);

    if (this.hasFS) {
      // Register file system that syncs with filesystem in manager
      // @ts-ignore
      BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker); // eslint-disable-line
      worker.postMessage({ type: 'initialize-fs', codesandbox: true });
    }

    this.idleWorkers.push(worker);

    this.executeRemainingTasks();

    this.workers.push(worker);
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
    this.loadingWorkers = 0;
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

  runCallbacks(
    callbacks: Array<TranspilerCallback>,
    err: Error | undefined,
    data?: TranspilerResult
  ) {
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

        if (data.type === 'clear-warnings') {
          dispatch(actions.correction.clear(data.path, data.source));
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
              code: tModule.module.code,
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
          // Unshift instead of push, we want to prepend the worker because
          // this worker is warm now.
          this.idleWorkers.unshift(worker);
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
    callback: (err: Error, message: TranspilerResult) => void
  ) {
    this.initialized = true;
    if (
      this.idleWorkers.length === 0 &&
      this.loadingWorkers < this.workerCount
    ) {
      // Load new worker if needed
      await this.loadWorker();
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

  async getTranspilerContext(manager: Manager) {
    return super.getTranspilerContext(manager).then(x => ({
      ...x,
      worker: true,
      hasFS: this.hasFS,
      workerCount: this.workerCount,
      initialized: Boolean(this.initialized),
    }));
  }
}
