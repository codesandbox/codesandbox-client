import { EventEmitter } from 'events';

let DefaultWorker: () => Worker;
let workerMap: Map<string, false | (() => Worker)> = new Map();

function addDefaultForkHandler(worker: () => Worker) {
  DefaultWorker = worker;
}
function addForkHandler(path: string, worker: () => Worker) {
  workerMap.set(path, worker);
}

interface IProcessOpts {
  silent?: boolean;
  detached?: boolean;
  execArgv?: string[];
  cwd?: string;
  env?: {
    [key: string]: any;
  };
}

class Stream extends EventEmitter {
  private encoding;

  constructor(private worker: Worker) {
    super();
  }

  setEncoding(encoding: string) {
    this.encoding = encoding;
  }

  write(message: string, encoding: string) {
    this.worker.postMessage({ $type: 'input-write', $data: message });
  }
}

class NullChildProcess extends EventEmitter {
  public stdout: EventEmitter = new EventEmitter();
  public stderr: EventEmitter = new EventEmitter();
  public stdin: EventEmitter = new EventEmitter();
}

class ChildProcess extends EventEmitter {
  public stdout: Stream;
  public stderr: Stream;
  public stdin: Stream;

  constructor(private worker: Worker) {
    super();
    this.stdout = new Stream(worker);
    this.stderr = new Stream(worker);
    this.stdin = new Stream(worker);

    this.listen();
  }

  public send(message: any, _a: any, _b: any, callback: Function) {
    const m = {
      $type: 'message',
      $data: JSON.stringify(message),
    };
    this.worker.postMessage(m);

    if (typeof _a === 'function') {
      _a(null);
    } else if (typeof _b === 'function') {
      _b(null);
    } else if (typeof callback === 'function') {
      callback(null);
    }
  }

  private listen() {
    this.worker.addEventListener('message', message => {
      const data = message.data.$data;

      if (data) {
        switch (message.data.$type) {
          case 'stdout':
            this.stdout.emit('data', data);
            break;
          case 'message':
            this.emit('message', JSON.parse(data));
            break;
          default:
            break;
        }
      }
    });
  }
}

function fork(path: string, argv: string[], processOpts: IProcessOpts) {
  let WorkerConstructor = workerMap.get(path);
  let isDefaultWorker = false;

  if (!WorkerConstructor) {
    WorkerConstructor = DefaultWorker;
    isDefaultWorker = true;

    // Explicitly ignore
    if (WorkerConstructor === false) {
      return new NullChildProcess();
    }

    if (WorkerConstructor == null) {
      throw new Error('No worker set for path: ' + path);
    }
  }

  const worker: Worker = WorkerConstructor();

  self.addEventListener('message', e => {
    const { data } = e;

    if (!data.$sang && data.$type !== 'message') {
      const newData = {
        $sang: true,
        $data: data,
      };

      worker.postMessage(newData);
    }
  });

  worker.addEventListener('message', e => {
    const { data } = e;

    if (!data.$sang && data.$type !== 'message') {
      const newData = {
        $sang: true,
        $data: data,
      };

      self.postMessage(newData);
    }
  });

  // Register file system that syncs with filesystem in manager
  BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker);
  worker.postMessage({
    $type: 'worker-manager',
    $event: 'init',
    data: {
      env: processOpts.env,
      entry: isDefaultWorker ? path : undefined,
      cwd: processOpts.cwd,
      execArgv: processOpts.execArgv,
      argv,
    },
  });

  return new ChildProcess(worker);
}

export { addForkHandler, addDefaultForkHandler, fork };
