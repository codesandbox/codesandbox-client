import Transpiler from './';

type WorkerError = {
  name: string,
  message: string,
  fileName: ?string,
  lineNumber: ?number,
  columnNumber: ?number,
};

export function buildWorkerError(error: Error): WorkerError {
  return {
    name: error.name,
    message: error.message,
    fileName: error.fileName,
    lineNumber: error.lineNumber,
    columnNumber: error.columnNumber,
  };
}

export function parseWorkerError(error: WorkerError) {
  const reconstructedError = new Error(error.message);
  reconstructedError.name = error.name;
  reconstructedError.columnNumber = error.columnNumber;
  reconstructedError.fileName = error.columnNumber;
  reconstructedError.lineNumber = error.lineNumber;

  return reconstructedError;
}

/**
 * A transpiler that handles worker messaging for you! Magic
 */
export default class WorkerTranspiler extends Transpiler {
  Worker: Worker;
  worker: Worker;

  runningTasks: {
    [id: string]: (error: Error, message: Object) => void,
  };
  runningTasks = {};

  constructor(Worker: Worker) {
    super();

    this.Worker = Worker;
  }

  initialize() {
    if (!this.worker) {
      this.worker = new this.Worker();

      this.worker.addEventListener('message', this.handleEvent.bind(this));
    }
  }

  dispose() {
    if (this.worker) this.worker.terminate();
  }

  handleEvent(event) {
    const message = event.data;

    if (message) {
      const callback = this.runningTasks[message.id];
      if (callback) {
        if (message.type === 'error') {
          const reconstructedError = parseWorkerError(message);

          callback(reconstructedError);
        }

        callback(null, message);

        delete this.runningTasks[message.id];
      }
    }
  }

  executeTask(message: any, callback: (err: Error, message: Object) => void) {
    const id = (Date.now() + Math.floor(Math.random() * 20)).toString();

    this.runningTasks[id] = callback;

    const finalMessage = { id, ...message };
    this.worker.postMessage(finalMessage);
  }
}
