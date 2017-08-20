import Transpiler from './';
import { parseWorkerError } from './utils/worker-error-handler';

/**
 * A transpiler that handles worker messaging for you! Magic
 */
export default class WorkerTranspiler extends Transpiler {
  Worker: Worker;
  workers: Array<Worker>;
  idleWorkers: Array<Worker>;
  workerCount: number;
  tasks: Array<any>;
  initialized: boolean;

  runningTasks: {
    [id: string]: (error: Error, message: Object) => void,
  };

  constructor(Worker: Worker, workerCount = navigator.hardwareConcurrency) {
    super();

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

  executeTask({ message, callback }, worker: Worker) {
    worker.onmessage = newMessage => {
      const { data } = newMessage;

      if (data) {
        if (data.type === 'error') {
          const reconstructedError = parseWorkerError(data.error);

          callback(reconstructedError);
        }

        callback.bind(worker)(null, data);

        // Means the transpile task has been completed
        if (data.type === 'compiled' || data.type === 'error') {
          this.idleWorkers.push(worker);

          this.executeRemainingTasks();
        }
      }
    };
    worker.postMessage(message);
  }

  queueTask(message: any, callback: (err: Error, message: Object) => void) {
    if (!this.initialized) {
      this.initialize();
    }
    this.tasks.push({ message, callback });

    this.executeRemainingTasks();
  }
}
