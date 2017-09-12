import Transpiler from './';
import { parseWorkerError } from './utils/worker-error-handler';
import { type LoaderContext } from '../transpiled-module';

type Task = {
  message: any,
  callback: (err: ?any, data: ?any) => void,
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
  tasks: Array<Task>;
  initialized: boolean;

  runningTasks: {
    [id: string]: (error: Error, message: Object) => void,
  };

  constructor(
    name: string,
    Worker: Worker,
    workerCount = navigator.hardwareConcurrency
  ) {
    super(name);

    this.workerCount = workerCount;
    this.Worker = Worker;
    this.workers = [];
    this.idleWorkers = [];
    this.tasks = [];
    this.initialized = false;
  }

  initialize() {
    if (this.workers.length === 0) {
      for (let i = 0; i < this.workerCount; i += 1) {
        const worker = new this.Worker();

        worker.onmessage = message => {
          if (message && message.data === 'ready') {
            this.idleWorkers.push(worker);

            this.executeRemainingTasks();
          }
        };

        this.workers.push(worker);
      }
    }
  }

  dispose() {
    this.workers.forEach(w => w.terminate());
    this.idleWorkers.length = 0;
  }

  executeRemainingTasks() {
    while (this.idleWorkers.length && this.tasks.length) {
      const task = this.tasks.shift();
      const worker = this.idleWorkers.shift();
      this.executeTask(task, worker);
    }
  }

  executeTask({ message, loaderContext, callback }: Task, worker: Worker) {
    worker.onmessage = newMessage => {
      const { data } = newMessage;

      if (data) {
        if (data.type === 'error') {
          const reconstructedError = parseWorkerError(data.error);

          callback(reconstructedError);
        }

        if (data.type === 'warning') {
          loaderContext.emitWarning(data.warning);
          return;
        }

        if (data.type === 'add-dependency') {
          // Dynamic import
          if (data.isGlob) {
            loaderContext.addDependenciesInDirectory(data.path, {
              isAbsolute: data.isAbsolute,
            });
          } else {
            loaderContext.addDependency(data.path, {
              isAbsolute: data.isAbsolute,
            });
          }
          return;
        }

        if (data.type === 'add-transpilation-dependency') {
          loaderContext.addTranspilationDependency(data.path, {
            isAbsolute: data.isAbsolute,
          });
          return;
        }

        // Means the transpile task has been completed
        if (data.type === 'compiled') {
          callback(null, data);
        }

        if (data.type === 'error' || data.type === 'compiled') {
          this.idleWorkers.push(worker);
          this.executeRemainingTasks();
        }
      }
    };
    worker.postMessage(message);
  }

  queueTask(
    message: any,
    loaderContext: LoaderContext,
    callback: (err: Error, message: Object) => void
  ) {
    if (!this.initialized) {
      this.initialize();
    }
    this.tasks.push({ message, loaderContext, callback });

    this.executeRemainingTasks();
  }
}
