import { errorToObj } from './utils';

type ChildFunc = (data: any, loaderContextId: number) => Promise<any>;

interface ChildCall {
  method: string;
  data: any;
  loaderContextId: number;
  resolve: (result: Promise<any> | any) => void;
  reject: (error: any) => void;
}

export class ChildHandler {
  pendingCalls: Map<number, ChildCall>;
  callId: number = 0;
  functions: Map<string, ChildFunc>;

  registerFunction(method: string, fn: ChildFunc) {
    this.functions.set(method, fn);
  }

  handleMessage(msg: any) {
    switch (msg.type) {
      case 'request':
        this.handleCallRequest(msg);
        break;
      case 'response':
        this.handleCallResponse(msg);
        break;
    }
  }

  handleCallResponse(msg: any) {
    const foundCall = this.pendingCalls.get(msg.idx);
    if (foundCall) {
      if (!msg.isError) {
        foundCall.resolve(msg.data);
      } else {
        foundCall.reject(msg.data);
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
      const result = await fn(msg.data, msg.loaderContextId);
      self.postMessage({
        type: 'response',
        codesandbox: true,
        idx: msg.idx,
        loaderContextId: msg.loaderContextId,
        data: result,
      });
    } catch (err) {
      self.postMessage({
        type: 'response',
        codesandbox: true,
        idx: msg.idx,
        loaderContextId: msg.loaderContextId,
        isError: true,
        data: errorToObj(err),
      });
    }
  }

  callFn({
    method,
    data,
    loaderContextId,
  }: {
    method: string;
    data: any;
    loaderContextId: number;
  }): Promise<any> {
    const idx = this.callId++;
    const message = {
      type: 'request',
      codesandbox: true,
      idx,
      method,
      data,
      loaderContextId,
    };

    return new Promise((resolve, reject) => {
      this.pendingCalls.set(idx, {
        method,
        data,
        loaderContextId,
        resolve,
        reject,
      });

      self.postMessage(message);
    });
  }
}
