import { commonPostMessage } from '@codesandbox/common/lib/utils/global';
import {
  IForkHandler,
  IForkHandlerCallback,
} from 'node-services/lib/child_process';

// We want to make sure that our pids are consistent.
// By counting pids based on endpoint we should consistently
// pass the correct pid number related to the language server,
// though it does require VSCode to always fire up the language
// servers in the same order. The pid count decreases as
// the WebsocketLSP is disposed
const pidCountByEndpoint: {
  [endpoint: string]: number;
} = {};

export class WebsocketLSP implements IForkHandler {
  ws: WebSocket;
  listeners = new Set<IForkHandlerCallback>();
  messagesQueue: any[] = [];
  endpoint: string;

  constructor() {
    const instance = this;
    self.addEventListener('message', function listener(message) {
      if (message.data.$type === 'respond_lsp_endpoint') {
        self.removeEventListener('message', listener);
        instance.connect(message.data.$data);
      }
    });
    commonPostMessage({
      $type: 'request_lsp_endpoint',
    });
  }

  private connect(endpoint: string) {
    if (!(endpoint in pidCountByEndpoint)) {
      pidCountByEndpoint[endpoint] = 0;
    }

    this.endpoint = endpoint;
    this.ws = new WebSocket(
      endpoint + `?pid=${pidCountByEndpoint[endpoint]++}`
    );
    this.ws.onopen = () => {
      this.messagesQueue.forEach(message => {
        this.postMessage(message);
      });
    };
    this.ws.addEventListener('message', event => {
      if ('data' in event) {
        /*
        const json = event.data.split('\n').find(line => line[0] === '{');
        console.log('OUT', JSON.stringify(JSON.parse(json), null, 2));
        */
        this.listeners.forEach(listener => {
          listener({
            data: {
              $data: event.data,
              $type: 'stdout',
            },
          });
        });
      }
    });
  }

  postMessage(message) {
    if (message.$type === 'input-write') {
      if (this.ws.readyState === 1 && message.$data) {
        /*
        console.log('IN', JSON.stringify(JSON.parse(message.$data), null, 2));
        */
        this.ws.send(message.$data);
      } else if (message.$data) {
        this.messagesQueue.push(message);
      }
    }
  }

  // Since setting up the connection is ASYNC, we rather create a list
  // of listeners. They all use "message" event anyways
  addEventListener(_: string, callback: IForkHandlerCallback) {
    this.listeners.add(callback);
  }

  removeEventListener(_: string, callback: IForkHandlerCallback) {
    this.listeners.delete(callback);
  }

  terminate() {
    pidCountByEndpoint[this.endpoint]--;
    this.ws.close();
  }
}
