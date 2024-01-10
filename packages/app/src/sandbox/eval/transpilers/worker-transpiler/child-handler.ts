import {
  buildWorkerError,
  parseWorkerError,
} from '../../../../../../sandpack-core/lib/transpiler/utils/worker-error-handler';

type ChildFunc = (data: any) => Promise<any>;
type FSInitializerFunc = () => void | Promise<void>;

interface ChildCall {
  method: string;
  data: any;
  resolve: (result: Promise<any> | any) => void;
  reject: (error: any) => void;
}

export class ChildHandler {
  name: string;
  functions: Map<string, ChildFunc> = new Map();
  pendingCalls: Map<number, ChildCall> = new Map();
  callId: number = 0;
  isReady: boolean = false;
  initializeFS: FSInitializerFunc;
  queuedMessages: Array<any> = [];

  constructor(name: string) {
    this.name = name;
    self.addEventListener('message', evt => {
      this.handleMessage(evt.data).catch(console.error);
    });
    self.postMessage({
      type: 'worker_started',
      codesandbox: true,
    });
  }

  registerFunction(method: string, fn: ChildFunc) {
    this.functions.set(method, fn);
  }

  registerFSInitializer(newInitializeFS: FSInitializerFunc) {
    this.initializeFS = newInitializeFS;
  }

  async handleMessage(msg: any) {
    if (typeof msg !== 'object' || !msg.codesandbox) {
      if (!msg.browserfsMessage) {
        console.warn(`Invalid message from main thread to ${this.name}`, msg);
      }
      return;
    }

    if (!this.isReady) {
      this.queuedMessages.push(msg);
      return;
    }

    switch (msg.type) {
      case 'ping':
        if (this.isReady) {
          await this.emitReady();
        }
        break;
      case 'request':
        await this.handleCallRequest(msg);
        break;
      case 'response':
        await this.handleCallResponse(msg);
        break;
      case 'initialize-fs':
        if (!this.initializeFS) {
          throw new Error(`initializeFS is undefined for ${this.name}`);
        }
        await this.initializeFS();
        break;
    }
  }

  handleCallResponse(msg: any) {
    const foundCall = this.pendingCalls.get(msg.idx);
    if (foundCall) {
      if (!msg.isError) {
        foundCall.resolve(msg.data);
      } else {
        foundCall.reject(parseWorkerError(msg.data));
      }
    }
  }

  async handleCallRequest(msg: any) {
    try {
      const fn = this.functions.get(msg.method);
      if (!fn) {
        throw new Error(
          `Could not find registered child function for call ${this.name}#${msg.method}`
        );
      }
      const result = await fn(msg.data);
      self.postMessage({
        type: 'response',
        codesandbox: true,
        idx: msg.idx,
        data: result,
      });
    } catch (err) {
      console.error(err);
      self.postMessage({
        type: 'response',
        codesandbox: true,
        idx: msg.idx,
        isError: true,
        data: buildWorkerError(err),
      });
    }
  }

  callFn({ method, data }: { method: string; data: any }): Promise<any> {
    const idx = this.callId++;
    const message = {
      type: 'request',
      codesandbox: true,
      idx,
      method,
      data,
    };

    return new Promise((resolve, reject) => {
      this.pendingCalls.set(idx, {
        method,
        data,
        resolve,
        reject,
      });

      self.postMessage(message);
    });
  }

  emitReady() {
    this.isReady = true;
    this.queuedMessages.forEach(msg => {
      console.warn('Run queued message', msg);
      this.handleMessage(msg).catch(console.error);
    });

    self.postMessage({
      type: 'ready',
      codesandbox: true,
    });
  }
}
