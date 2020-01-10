import {
  IForkHandler,
  IForkHandlerCallback,
} from 'node-services/lib/child_process';

// This PID should later be created in a way that makes it 100%
// consistent across clients
let pid = 0;

export class WebsocketLSP implements IForkHandler {
  ws: WebSocket;
  listeners = new Map<
    IForkHandlerCallback,
    EventListenerOrEventListenerObject
  >();

  messagesQueue: any[] = [];

  constructor(endpoint: string) {
    this.ws = new WebSocket(endpoint + `?pid=${pid++}`);
    this.ws.onopen = () => {
      this.messagesQueue.forEach(message => {
        this.postMessage(message);
      });
    };
  }

  postMessage(message) {
    if (this.ws.readyState === 1 && message.$data) {
      // console.log('REQUEST', message.$data);
      this.ws.send(message.$data);
    } else if (message.$data) {
      this.messagesQueue.push(message);
    }
  }

  addEventListener(eventName: string, callback: IForkHandlerCallback) {
    const listener = event => {
      if ('data' in event) {
        // console.log('RESPONSE', event.data);
        callback({
          data: {
            $data: event.data,
            $type: 'stdout',
          },
        });
      }
    };
    this.ws.addEventListener(eventName, listener);
    this.listeners.set(callback, listener);
  }

  removeEventListener(eventName: string, callback: IForkHandlerCallback) {
    const listener = this.listeners.get(callback);

    this.ws.removeEventListener(eventName, listener);
  }

  terminate() {
    this.ws.close();
  }
}
