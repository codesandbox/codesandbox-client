import { dispatch, listen } from 'codesandbox-api';
import { Event, Emitter } from './event';
import { Disposable } from './disposable';
import { Deferred } from './deferred';

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
  private workerInstance: Worker;
  private emitter = new Emitter();
  private readyDeferred = new Deferred<void>();
  public onReceive = this.emitter.event;

  constructor(workerClass: () => Worker) {
    super();

    this.workerInstance = workerClass();
    this.workerInstance.addEventListener('message', this.onMessage);
    window.addEventListener('message', this.onBroadcastMessage);
  }

  /**
   * For the FS Sync we sometimes need to send messages emitted by the window back to the worker
   */
  onBroadcastMessage = (message: MessageEvent<any>) => {
    if (message.data.$broadcast) {
      this.workerInstance.postMessage(message.data);
    }
  };

  onMessage = (message: MessageEvent<unknown>) => {
    if (typeof message.data === 'string') {
      if (message.data === 'ready') {
        this.readyDeferred.resolve();
      } else {
        this.emitter.fire(message.data);
      }
    } else {
      self.postMessage(message.data);
    }
  };

  send(message: any): void {
    if (this.isDisposed) {
      return;
    }

    this.readyDeferred.promise.then(() => {
      this.workerInstance.postMessage(message);
    });
  }

  dispose() {
    super.dispose();
    window.removeEventListener('message', this.onBroadcastMessage);
    this.workerInstance.removeEventListener('message', this.onMessage);
  }
}
