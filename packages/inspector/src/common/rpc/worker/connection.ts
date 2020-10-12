/// <reference lib="webworker" />
import { IConnection } from '../connection';
import { Disposable } from '../disposable';
import { Emitter } from '../event';

export class WorkerConnection extends Disposable implements IConnection {
  emitter = new Emitter();
  onReceive = this.emitter.event;

  constructor() {
    super();

    self.addEventListener('message', event => {
      if (typeof event.data === 'string') {
        this.emitter.fire(event.data);
      }
    });
  }

  send(message: any): void {
    self.postMessage(message);
  }
}
