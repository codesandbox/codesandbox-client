import {
  IForkHandler,
  IForkHandlerCallback,
} from 'node-services/lib/child_process';

export class WebsocketLSP implements IForkHandler {
  ws: WebSocket;
  listeners = new Map<
    IForkHandlerCallback,
    EventListenerOrEventListenerObject
  >();

  messagesQueue: any[];

  constructor(endpoint: string) {
    this.ws = new WebSocket(endpoint);
    this.ws.onopen = () => {
      this.messagesQueue.forEach(message => {
        this.postMessage(message);
      });
    };
  }

  postMessage(message) {
    if (this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messagesQueue.push(message);
    }
  }

  addEventListener(eventName: string, callback: IForkHandlerCallback) {
    const listener = event => {
      if ('data' in event) {
        callback(event);
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
