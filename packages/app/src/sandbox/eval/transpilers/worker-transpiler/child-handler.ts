import {
  buildWorkerError,
  parseWorkerError,
} from '../../../../../../sandpack-core/lib/transpiler/utils/worker-error-handler';

type ChildFunc = (data: any) => Promise<any>;

interface ChildCall {
  method: string;
  data: any;
  resolve: (result: Promise<any> | any) => void;
  reject: (error: any) => void;
}

export class ChildHandler {
  functions: Map<string, ChildFunc> = new Map();
  pendingCalls: Map<number, ChildCall> = new Map();
  callId: number = 0;
  isReady: boolean = false;

  constructor() {
    self.addEventListener('message', evt => {
      this.handleMessage(evt.data).catch(console.error);
    });
  }

  registerFunction(method: string, fn: ChildFunc) {
    this.functions.set(method, fn);
  }

  async handleMessage(msg: any) {
    if (typeof msg !== 'object' || !msg.codesandbox) {
      console.warn(`Invalid worker message for ${msg}`);
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
          `Could not find registered child function for call ${msg.method}`
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

    self.postMessage({
      type: 'ready',
      codesandbox: true,
    });
  }
}
