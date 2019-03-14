import { EventEmitter } from 'events';
import { protocolAndHost } from 'common/lib/utils/url-generator';
import { commonPostMessage } from 'common/lib/utils/global';
import _debug from 'common/lib/utils/debug';

const debug = _debug('cs:node:child_process');

let DefaultWorker: false | (() => Worker);
let workerMap: Map<string, false | (() => Worker)> = new Map();

function addDefaultForkHandler(worker: false | (() => Worker)) {
  DefaultWorker = worker;
}
function addForkHandler(path: string, worker: false | (() => Worker)) {
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
  constructor(private worker: Worker) {
    super();
  }

  setEncoding(encoding: string) {}

  write(message: string, encoding: string) {
    this.worker.postMessage({ $type: 'input-write', $data: message });
  }
}

class NullStream extends EventEmitter {
  setEncoding(encoding: string) {}
}

class NullChildProcess extends EventEmitter {
  public stdout: NullStream = new NullStream();
  public stderr: NullStream = new NullStream();
  public stdin: NullStream = new NullStream();

  public kill() {}
}

class ChildProcess extends EventEmitter {
  public stdout: Stream;
  public stderr: Stream;
  public stdin: Stream;

  private destroyed = false;

  constructor(private worker: Worker) {
    super();
    this.stdout = new Stream(worker);
    this.stderr = new Stream(worker);
    this.stdin = new Stream(worker);

    this.listen();
  }

  public send(message: any, _a: any, _b: any, callback: Function) {
    if (this.destroyed) {
      callback(new Error('This connection has been killed'));
      return;
    }

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

  public kill() {
    this.destroyed = true;
    this.worker.removeEventListener('message', this.listener.bind(this));

    this.worker.terminate();
  }

  private listener(message: MessageEvent) {
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
  }

  private listen() {
    this.worker.addEventListener('message', this.listener.bind(this));
  }
}

const cachedWorkers: { [path: string]: Array<Worker | false> } = {};
const cachedDefaultWorkers: Array<Worker | false> = [];

function getWorker(path: string) {
  let WorkerConstructor = workerMap.get(path);

  if (!WorkerConstructor) {
    WorkerConstructor = DefaultWorker;

    // Explicitly ignore
    if (WorkerConstructor === false) {
      return false;
    }

    if (WorkerConstructor == null) {
      throw new Error('No worker set for path: ' + path);
    }
  }

  const worker = WorkerConstructor();

  // Register file system that syncs with filesystem in manager
  BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker);

  return worker;
}

function getWorkerFromCache(path: string, isDefaultWorker: boolean) {
  if (isDefaultWorker) {
    const cachedDefaultWorker = cachedDefaultWorkers.pop();

    if (cachedDefaultWorker) {
      return cachedDefaultWorker;
    }
  } else {
    if (cachedWorkers[path]) {
      const worker = cachedWorkers[path].pop();

      return worker;
    }
  }

  return undefined;
}

let sentBroadcasts: Map<string, Array<number>> = new Map();
/**
 * Broadcasts a message if it hasn't been sent by this worker/window before
 */
function handleBroadcast(
  path: string,
  target: Worker | Window,
  data: {
    $id?: number;
    $data: object;
    $type: string;
  }
) {
  const sentBroadcastsForPath = sentBroadcasts.get(path) || [];

  if (data.$id && sentBroadcastsForPath.indexOf(data.$id) > -1) {
    return;
  }

  data.$id = data.$id || Math.random() * 1000000;

  if (sentBroadcastsForPath.length > 100) {
    sentBroadcastsForPath.shift();
  }
  sentBroadcastsForPath.push(data.$id);
  if (
    target.constructor.name === 'Worker' ||
    // @ts-ignore Unknown to TS
    (typeof DedicatedWorkerGlobalScope !== 'undefined' &&
      // @ts-ignore Unknown to TS
      target instanceof DedicatedWorkerGlobalScope)
  ) {
    // @ts-ignore
    target.postMessage(data);
  } else {
    (target as Window).postMessage(data, protocolAndHost());
  }

  sentBroadcasts.set(path, sentBroadcastsForPath);
}

function fork(path: string, argv?: string[], processOpts?: IProcessOpts) {
  const WorkerConstructor = workerMap.get(path);
  const isDefaultWorker = !WorkerConstructor;

  const worker = getWorkerFromCache(path, isDefaultWorker) || getWorker(path);

  if (worker === false) {
    return new NullChildProcess();
  }

  debug('Forking', path);

  const WORKER_ID = path + '-' + Math.floor(Math.random() * 100000);

  self.addEventListener('message', ((e: MessageEvent) => {
    const { data } = e;

    if (data.$broadcast) {
      handleBroadcast(WORKER_ID, worker, data);
      return;
    }

    if (!data.$sang && data.$type) {
      const newData = {
        $sang: true,
        $data: data,
      };

      worker.postMessage(newData);
    }
  }) as EventListener);

  worker.addEventListener('message', e => {
    const { data } = e;

    if (data.$broadcast) {
      handleBroadcast(WORKER_ID, self, data);
      return;
    }

    if (!data.$sang && data.$type) {
      const newData = {
        $sang: true,
        $data: data,
      };

      commonPostMessage(newData);
    }
  });

  const data: any = {
    entry: path,
    argv: argv || [],
  };

  if (processOpts) {
    data.env = processOpts.env;
    data.cwd = processOpts.cwd;
    data.execArgv = processOpts.execArgv;
  }

  worker.postMessage({
    $type: 'worker-manager',
    $event: 'init',
    data,
  });

  return new ChildProcess(worker);
}

function preloadWorker(path: string) {
  const WorkerConstructor = workerMap.get(path);
  const isDefaultWorker = !WorkerConstructor;

  const worker = getWorker(path);

  if (isDefaultWorker) {
    cachedDefaultWorkers.push(worker);
  } else {
    cachedWorkers[path] = cachedWorkers[path] || [];
    cachedWorkers[path].push(worker);
  }
}

function execFileSync(path: string) {
  if (process.env.NODE_ENV === 'development') {
    debug('EXEC_FILE_SYNC', path);
  }
}

function execSync(path: string) {
  if (process.env.NODE_ENV === 'development') {
    debug('EXEC_SYNC', path);
  }
}

export {
  addForkHandler,
  addDefaultForkHandler,
  preloadWorker,
  fork,
  execSync,
  execFileSync,
};
