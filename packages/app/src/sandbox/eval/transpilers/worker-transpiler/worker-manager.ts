import _debug from '@codesandbox/common/lib/utils/debug';
import {
  buildWorkerError,
  parseWorkerError,
} from '../../../../../../sandpack-core/lib/transpiler/utils/worker-error-handler';

const debug = _debug('cs:compiler:worker-manager');

enum WorkerStatus {
  Initializing,
  Ready,
}

type WorkerFactoryType = () => Worker | Promise<Worker>;
type RegisteredFunc = (data: any) => any | Promise<any>;

interface WorkerCall {
  method: string;
  data: any;
  workerId?: number;
  resolve: (result: Promise<any> | any) => void;
  reject: (error: any) => void;
}

interface WorkerData {
  workerId: number;
  worker: Worker;
  status: WorkerStatus;
  activeCalls: number;
  startedAt: number;
}

export interface WorkerManagerOptions {
  hasFS?: boolean;
  preload?: boolean;
  maxConcurrency?: number;
  maxWorkerCount?: number;
}

export class WorkerManager {
  pendingCalls: Array<WorkerCall> = [];
  activeCalls: Map<number, WorkerCall> = new Map();
  callId: number = 0;
  functions: Map<string, RegisteredFunc> = new Map();

  // Options
  name: string;
  workerFactory: WorkerFactoryType;
  maxWorkerCount: number;
  hasFS: boolean;
  maxConcurrency: number;

  // Worker farm state
  workerCount: number = 0;
  workers: Map<number, WorkerData> = new Map();

  constructor(
    name: string,
    workerFactory: WorkerFactoryType,
    options: WorkerManagerOptions = {}
  ) {
    const {
      hasFS = false,
      preload = false,
      maxConcurrency = 25,
      maxWorkerCount = navigator.hardwareConcurrency,
    } = options;

    this.name = name;
    this.maxWorkerCount = maxWorkerCount;
    this.workerFactory = workerFactory;
    this.maxConcurrency = maxConcurrency;
    this.hasFS = hasFS;

    if (preload) {
      this.initialize();
    }
  }

  initialize() {
    for (let i = this.workerCount; i < this.maxWorkerCount; i++) {
      this.loadWorker().catch(console.error);
    }
  }

  dispose() {
    this.workers.forEach(w => w.worker.terminate());
    this.workers = new Map();
    this.workerCount = 0;
  }

  handleWorkerReady(workerData: WorkerData) {
    debug(
      `Loaded '${this.name}' worker in ${Date.now() - workerData.startedAt}ms`
    );
    workerData.status = WorkerStatus.Ready;
    this.executeRemainingTasks();
  }

  handleMessage(workerData: WorkerData, msg: any): void {
    if (typeof msg !== 'object' || !msg.codesandbox) {
      if (!msg.browserfsMessage) {
        console.warn(
          `Invalid message from worker ${this.name}#${workerData.workerId}`,
          msg
        );
      }
      return;
    }

    switch (msg.type) {
      case 'ready':
        this.handleWorkerReady(workerData);
        break;
      case 'request':
        this.handleCallRequest(workerData.worker, msg);
        break;
      case 'response':
        this.handleCallResponse(msg);
        break;
    }
  }

  async loadWorker() {
    if (this.workerCount >= this.maxWorkerCount) {
      return;
    }

    const workerId = this.workerCount++;
    const startedAt = Date.now();
    const worker = await this.workerFactory();
    const workerdata: WorkerData = {
      workerId,
      status: WorkerStatus.Initializing,
      startedAt,
      activeCalls: 0,
      worker,
    };
    this.workers.set(workerId, workerdata);
    worker.addEventListener('message', evt => {
      this.handleMessage(workerdata, evt.data);
    });

    // TODO: Move this to onReady, now sure why that doesn't work...
    if (this.hasFS) {
      // Register file system that syncs with filesystem in manager
      // @ts-ignore
      BrowserFS.FileSystem.WorkerFS.attachRemoteListener(workerdata.worker);
      workerdata.worker.postMessage({
        type: 'initialize-fs',
        codesandbox: true,
      });
    }

    worker.postMessage({ type: 'ping', codesandbox: true });
  }

  executeRemainingTasks() {
    if (!this.pendingCalls.length) {
      return;
    }

    this.initialize();

    for (const [workerId, worker] of this.workers) {
      if (worker.status === WorkerStatus.Ready) {
        while (worker.activeCalls < this.maxConcurrency) {
          const pendingCall = this.pendingCalls.shift();
          if (!pendingCall) {
            break;
          }

          const idx = this.callId++;
          const message = {
            type: 'request',
            codesandbox: true,
            idx,
            method: pendingCall.method,
            data: pendingCall.data,
          };

          this.activeCalls.set(idx, { ...pendingCall, workerId });
          worker.activeCalls += 1;

          worker.worker.postMessage(message);
        }
      }
    }
  }

  registerFunction(method: string, fn: RegisteredFunc) {
    this.functions.set(method, fn);
  }

  handleCallResponse(msg: any) {
    const foundCall = this.activeCalls.get(msg.idx);
    if (foundCall) {
      if (!msg.isError) {
        foundCall.resolve(msg.data);
      } else {
        foundCall.reject(parseWorkerError(msg.data));
      }

      if (foundCall.workerId != null) {
        const foundWorker = this.workers.get(foundCall.workerId);
        if (!foundWorker) {
          console.warn('Worker not found for call:', foundCall);
        } else {
          foundWorker.activeCalls -= 1;
        }

        this.executeRemainingTasks();
      }
    } else {
      console.warn('Could not find call for:', msg);
    }
  }

  async handleCallRequest(worker: Worker, msg: any) {
    try {
      const fn = this.functions.get(msg.method);
      if (!fn) {
        throw new Error(
          `Could not find registered child function for call "${msg.method}"`
        );
      }
      const result = await fn(msg.data);
      worker.postMessage({
        type: 'response',
        codesandbox: true,
        idx: msg.idx,
        data: result,
      });
    } catch (err) {
      worker.postMessage({
        type: 'response',
        codesandbox: true,
        idx: msg.idx,
        isError: true,
        data: buildWorkerError(err),
      });
    }
  }

  callFn({ method, data }: { method: string; data: any }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pendingCalls.push({
        method,
        data,
        resolve,
        reject,
      });

      this.executeRemainingTasks();
    });
  }
}
