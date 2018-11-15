import { EventEmitter } from 'events';

const SOCKET_IDENTIFIER = 'node-socket';

export class Socket extends EventEmitter {
  public destroyed = false;

  constructor(
    private target: Window,
    private channel: string,
    private isWorker: boolean
  ) {
    super();

    this.emit('connect');

    this.startListening();
  }

  startListening() {
    self.addEventListener('message', e => {
      if ((e.source || self) !== this.target) {
        return;
      }

      const data = e.data.$data

      if (!data) {
        return;
      }

      if (data.$type === SOCKET_IDENTIFIER && data.$channel === this.channel) {
        this.emit('data', Buffer.from(JSON.parse(data.data)));
        // this.emit('end');
      }
    });
  }

  write(buffer: Buffer) {
    const message = {
      $type: SOCKET_IDENTIFIER,
      $channel: this.channel,
      data: JSON.stringify(buffer),
    };

    if (this.isWorker) {
      this.target.postMessage(message);
    } else {
      this.target.postMessage(message, '*');
    }
  }
}

export class Server extends EventEmitter {
  public connected = false;
  public closed = false;
  private socket: Socket | null = null;
  private listenerFunctions: Array<(e: MessageEvent) => void> = [];

  listen(listenPath: string, listenCallback?: Function) {
    const listenerFunction = (e: MessageEvent) => {
      const data = e.data.$data || e.data;

      if (this.closed) {
        return;
      }

      if (
        data.$type === 'node-server' &&
        data.$channel === listenPath &&
        data.$event === 'init'
      ) {
        this.connected = true;

        this.socket = new Socket(e.source || self, listenPath);
        this.emit('connection', this.socket);
      }
    };

    this.listenerFunctions.push(listenerFunction);
    self.addEventListener('message', listenerFunction);

    if (listenCallback) {
      listenCallback();
    }
  }

  close(cb?: Function) {
    this.closed = true;
    this.removeAllListeners();

    // This is not according to spec, but we do this anyways for clean cleanup
    this.listenerFunctions.forEach(func => {
      self.removeEventListener('message', func);
    });

    if (cb) {
      cb();
    }
  }
}

function createServer() {
  return new Server();
}

function createConnection(pipeName: string, cb?: Function) {
  self.postMessage({
    $type: 'node-server',
    $channel: pipeName,
    $event: 'init',
  });

  const socket = new Socket(self, pipeName, true);

  setTimeout(() => {
    if (cb) {
      cb();
    }
  }, 0);

  // TODO: Fix this to initialize properly
  return socket;
}

export { createServer, createConnection };
