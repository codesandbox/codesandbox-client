import { EventEmitter } from 'events';

let DefaultWorker: () => Worker;
let workerMap: Map<string, () => Worker> = new Map();

function addDefaultForkHandler(worker: () => Worker) {
  DefaultWorker = worker;
}
function addForkHandler(path: string, worker: () => Worker) {
  workerMap.set(path, worker);
}

interface IProcessOpts {
  silent?: boolean;
  detached?: boolean;
  execArgv?: string;
  env?: {
    [key: string]: any;
  };
}

class Stream extends EventEmitter {
  private encoding;

  setEncoding(encoding: string) {
    this.encoding = encoding;
  }
}

class ChildProcess extends EventEmitter {
  public stdout = new Stream();
  public stderr = new Stream();
  public stdin = new Stream();
}

function fork(path: string, extensions: string[], processOpts: IProcessOpts) {
  let WorkerConstructor = workerMap.get(path);

  if (!WorkerConstructor) {
    WorkerConstructor = DefaultWorker;
    if (WorkerConstructor == null) {
      throw new Error('No worker set for path: ' + path);
    }
  }

  const worker = WorkerConstructor();

  self.addEventListener('message', e => {
    const { data } = e;
    if (!data.$sang) {
      const newData = {
        $sang: true,
        $data: data,
      };

      worker.postMessage(newData);
    }
  });

  worker.addEventListener('message', e => {
    const { data } = e;
    if (!data.$sang) {
      const newData = {
        $sang: true,
        $data: data,
      };

      self.postMessage(newData, '*');
    }
  });

  // Register file system that syncs with filesystem in manager
  BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker);
  worker.postMessage({
    $type: 'worker-manager',
    $event: 'init',
    data: {
      env: processOpts.env,
    },
  });

  return new ChildProcess();
}

export { addForkHandler, addDefaultForkHandler, fork };
