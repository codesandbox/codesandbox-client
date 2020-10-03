import { dispatch, listen } from 'codesandbox-api';
import { Event, Emitter } from './event';
import { Disposable } from './disposable';

export interface IConnection {
  send(message: any): void;
  onReceive: Event<any>;
}

export class CodeSandboxAPIConnection
  extends Disposable
  implements IConnection {
  emitter = new Emitter();
  onReceive = this.emitter.event;

  sender = Math.floor(Math.random() * 100000000);

  constructor() {
    super();

    const listener = listen((message: any) => {
      if (message.$type === 'rpc' && message.$sender !== this.sender) {
        this.emitter.fire(message.$data);
      }
    });

    this.toDispose.push(
      Disposable.create(() => {
        listener();
      })
    );
  }

  send(message: any) {
    dispatch({ $type: 'rpc', $sender: this.sender, $data: message });
  }
}

export class MainWorkerConnection extends Disposable implements IConnection {
  workerInstance: Worker;
  emitter = new Emitter();
  onReceive = this.emitter.event;

  constructor(workerClass: () => Worker) {
    super();

    this.workerInstance = workerClass();
    this.workerInstance.addEventListener('message', this.onMessage);
  }

  onMessage = (message: MessageEvent<unknown>) => {
    this.emitter.fire(message.data);
  };

  send(message: any): void {
    if (this.isDisposed) {
      return;
    }

    this.workerInstance.postMessage(message);
  }

  dispose() {
    super.dispose();
    this.workerInstance.removeEventListener('message', this.onMessage);
  }
}
