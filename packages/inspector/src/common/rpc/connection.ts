import { dispatch, listen } from 'codesandbox-api';
import { Event, Emitter } from './event';
import { Disposable } from './disposable';

export interface IConnection {
  send(message: any): void;
  onReceive: Event<any>;
}

export class CodeSandboxAPIConnection extends Disposable
  implements IConnection {
  emitter = new Emitter();
  onReceive = this.emitter.event;

  sender = Math.random() * 100000;

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
