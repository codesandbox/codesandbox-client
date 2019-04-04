import { EventEmitter } from 'events';
import { commonPostMessage } from '@codesandbox/common/lib/utils/global';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

const SOCKET_IDENTIFIER = 'node-socket';

export class Socket extends EventEmitter {
  public destroyed = false;
  // @ts-ignore
  private encoding: string;

  constructor(
    private target: Window | MessageEventSource,
    private channel: string,
    private isWorker: boolean
  ) {
    super();

    this.emit('connect');

    this.startListening();
  }

  setEncoding(encoding: string) {
    this.encoding = encoding;
  }

  defaultListener(e: Event) {
    const evt = e as MessageEvent;
    if ((evt.source || self) !== this.target) {
      return;
    }

    const data = evt.data.$data;

    if (!data) {
      return;
    }

    if (data.$type === SOCKET_IDENTIFIER && data.$channel === this.channel) {
      this.emit('data', Buffer.from(JSON.parse(data.data)));
    }
  }

  startListening() {
    self.addEventListener('message', this.defaultListener.bind(this));
  }

  end() {
    self.removeEventListener('message', this.defaultListener.bind(this));
    this.destroyed = true;

    // @ts-ignore
    if (typeof this.target.terminate !== 'undefined') {
      // @ts-ignore
      this.target.terminate();
    }
  }

  unref() {}

  write(buffer: Buffer) {
    if (this.destroyed) {
      return;
    }

    const message = {
      $type: SOCKET_IDENTIFIER,
      $channel: this.channel,
      data: JSON.stringify(buffer),
    };

    if (this.isWorker) {
      ((this.target as unknown) as Worker).postMessage(message);
    } else {
      (this.target as Window).postMessage(message, protocolAndHost());
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

        this.socket = new Socket(e.source || self, listenPath, false);
        this.emit('connection', this.socket);
      }
    };

    this.listenerFunctions.push(listenerFunction);
    self.addEventListener('message', listenerFunction as EventListener);

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

function blobToBuffer(
  blob: Blob,
  cb: (err: any | undefined | null, result?: Buffer) => void
) {
  if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
    throw new Error('first argument must be a Blob');
  }
  if (typeof cb !== 'function') {
    throw new Error('second argument must be a function');
  }

  const reader = new FileReader();

  function onLoadEnd(e: any) {
    reader.removeEventListener('loadend', onLoadEnd, false);
    if (e.error) {
      cb(e.error);
    } else {
      // @ts-ignore
      cb(null, Buffer.from(reader.result));
    }
  }

  reader.addEventListener('loadend', onLoadEnd, false);
  reader.readAsArrayBuffer(blob);
}

export class WebSocketServer extends EventEmitter {
  public connected = false;
  public closed = false;
  private socket: WebSocket | null = null;
  private listenerFunctions: Array<(e: MessageEvent) => void> = [];

  constructor(public url: string) {
    super();
  }

  listen(listenPath: string, listenCallback?: Function) {
    this.socket = new WebSocket(this.url);

    this.socket.onmessage = message => {
      blobToBuffer(message.data, (err, r) => {
        this.emit('data', r);
      });
    };

    this.socket.onclose = () => {
      this.emit('close');
    };

    if (listenCallback) {
      listenCallback();
    }

    this.socket.onopen = () => {
      this.connected = true;
      this.emit('connection', this);
    };
  }

  public write(buffer: Buffer) {
    this.socket!.send(buffer);
  }

  public end() {
    this.socket!.close();
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

let socketUrl: string = '';
function setSocketURL(url: string) {
  socketUrl = url;
}

function createServerWS() {
  return new WebSocketServer(socketUrl);
}

function createServerLocal() {
  return new Server();
}

function createServer(...args: any[]) {
  if (socketUrl) {
    return createServerWS();
  } else {
    return createServerLocal();
  }
}

function createConnection(pipeName: string, cb?: Function) {
  commonPostMessage({
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

const connect = createConnection;

export { setSocketURL, createServer, createConnection, connect };
