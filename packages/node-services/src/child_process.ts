// eslint-disable-next-line max-classes-per-file
import { EventEmitter } from 'events';

import _debug from '@codesandbox/common/lib/utils/debug';
import { commonPostMessage } from '@codesandbox/common/lib/utils/global';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

const debug = _debug('cs:node:child_process');

const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export interface IForkHandlerData {
  data: any;
}

export interface IForkHandlerCallback {
  (message: IForkHandlerData): void;
}

export interface IForkHandler {
  // protocolAndHost is only used when ForkHandler is window
  postMessage(message: any, protocolAndHost?: string): void;
  addEventListener(event: string, callback: IForkHandlerCallback): void;
  removeEventListener(event: string, callback: IForkHandlerCallback): void;
  terminate(): void;
}

let DefaultForkHandler: false | (() => IForkHandler);
const forkHandlerMap: Map<string, false | (() => IForkHandler)> = new Map();

function addDefaultForkHandler(forkHandler: false | (() => IForkHandler)) {
  DefaultForkHandler = forkHandler;
}
function addForkHandler(
  path: string,
  forkHandler: false | (() => IForkHandler)
) {
  forkHandlerMap.set(path, forkHandler);
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
  constructor(private forkHandler: IForkHandler) {
    super();
  }

  setEncoding() {}

  write(message: string) {
    this.forkHandler.postMessage({ $type: 'input-write', $data: message });
  }
}

class NullStream extends EventEmitter {
  setEncoding() {}
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

  constructor(private forkHandler: IForkHandler) {
    super();
    this.stdout = new Stream(forkHandler);
    this.stderr = new Stream(forkHandler);
    this.stdin = new Stream(forkHandler);

    this.listen();
  }

  public send(message: any, _a: any, _b: any, callback: (arg: any) => void) {
    if (this.destroyed) {
      callback(new Error('This connection has been killed'));
      return;
    }

    const m = {
      $type: 'message',
      $data: JSON.stringify(message),
    };
    this.forkHandler.postMessage(m);

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
    this.forkHandler.removeEventListener('message', this.listener.bind(this));

    this.forkHandler.terminate();
  }

  private listener(message: IForkHandlerData) {
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
    this.forkHandler.addEventListener('message', this.listener.bind(this));
  }
}

const cachedForkHandlers: { [path: string]: Array<IForkHandler | false> } = {};
const cachedDefaultForkHandlers: Array<IForkHandler | false> = [];

function getForkHandler(path: string) {
  let ForkHandlerConstructor = forkHandlerMap.get(path);

  if (!ForkHandlerConstructor) {
    ForkHandlerConstructor = DefaultForkHandler;

    // Explicitly ignore
    if (ForkHandlerConstructor === false) {
      return false;
    }

    if (ForkHandlerConstructor == null) {
      throw new Error('No worker set for path: ' + path);
    }
  }

  return ForkHandlerConstructor();
}

function getForkHandlerFromCache(path: string, isDefaultForkHandler: boolean) {
  if (isDefaultForkHandler) {
    const cachedDefaultForkHandler = cachedDefaultForkHandlers.pop();

    if (cachedDefaultForkHandler) {
      return cachedDefaultForkHandler;
    }
  } else if (cachedForkHandlers[path]) {
    return cachedForkHandlers[path].pop();
  }

  return undefined;
}

const sentBroadcasts: Map<string, number[]> = new Map();
/**
 * Broadcasts a message if it hasn't been sent by this worker/window before
 */
function handleBroadcast(
  path: string,
  target: IForkHandler,
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

  data.$id = data.$id || Math.floor(Math.random() * 100000000);

  if (sentBroadcastsForPath.length > 100) {
    sentBroadcastsForPath.shift();
  }
  sentBroadcastsForPath.push(data.$id);

  if (typeof Window !== 'undefined' && target instanceof Window) {
    target.postMessage(data, protocolAndHost());
  } else {
    target.postMessage(data);
  }

  sentBroadcasts.set(path, sentBroadcastsForPath);
}

function fork(path: string, argv?: string[], processOpts?: IProcessOpts) {
  const ForkHandlerConstructor = forkHandlerMap.get(path);
  const isDefaultForkHandler = !ForkHandlerConstructor;

  const forkHandler =
    getForkHandlerFromCache(path, isDefaultForkHandler) || getForkHandler(path);

  if (forkHandler === false) {
    return new NullChildProcess();
  }

  debug('Forking', path);

  const FORK_HANDLER_ID = path + '-' + Math.floor(Math.random() * 100000);

  self.addEventListener('message', ((e: MessageEvent) => {
    const { data } = e;

    if (data.$broadcast) {
      handleBroadcast(FORK_HANDLER_ID, forkHandler, data);
      return;
    }

    if (!data.$sang && data.$type) {
      const newData = {
        $sang: true,
        $data: data,
      };

      if (data.$data) {
        // console.log('IN', JSON.stringify(JSON.parse(data.$data), null, 2));
      }

      forkHandler.postMessage(newData);
    }
  }) as EventListener);

  forkHandler.addEventListener('message', e => {
    const { data } = e;

    if (data.$broadcast) {
      handleBroadcast(FORK_HANDLER_ID, (self as unknown) as IForkHandler, data);
      return;
    }

    if (!data.$sang && data.$type) {
      const newData = {
        $sang: true,
        $data: data,
      };

      if (data.$data && data.$data) {
        /*
        try {
          const output =
            typeof data.$data === 'string'
              ? data.$data
              : new TextDecoder('utf-8').decode(data.$data) || '';
          const json = output.split('\n').find(line => line[0] === '{');
          console.log('OUT', JSON.stringify(JSON.parse(json || '{}'), null, 2));
        } catch (error) {
          try {
            console.log(
              'OUT NO CONTENT LENGTH',
              JSON.stringify(JSON.parse(data.$data), null, 2)
            );
          } catch (error) {
            console.log('OUT ERROR', data.$data);
          }
        }
        */
      }

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

  if (isSafari) {
    // For Safari it takes a while until the worker started, so we listen for ready message
    // and send a message anyway if a second passes

    let sentReady = false;
    const timeout = setTimeout(() => {
      if (!sentReady) {
        forkHandler.postMessage({
          $type: 'worker-manager',
          $event: 'init',
          data,
        });
        sentReady = true;
      }
    }, 1500);

    forkHandler.addEventListener('message', e => {
      if (!sentReady && e.data && e.data.$type === 'ready') {
        forkHandler.postMessage({
          $type: 'worker-manager',
          $event: 'init',
          data,
        });
        clearTimeout(timeout);
        sentReady = true;
      }
    });
  } else {
    forkHandler.postMessage({
      $type: 'worker-manager',
      $event: 'init',
      data,
    });
  }

  return new ChildProcess(forkHandler);
}

function preloadForkHandler(path: string) {
  const ForkHandlerConstructor = forkHandlerMap.get(path);
  const isDefaultForkHandler = !ForkHandlerConstructor;

  const worker = getForkHandler(path);

  if (isDefaultForkHandler) {
    cachedDefaultForkHandlers.push(worker);
  } else {
    cachedForkHandlers[path] = cachedForkHandlers[path] || [];
    cachedForkHandlers[path].push(worker);
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
  preloadForkHandler,
  fork,
  execSync,
  execFileSync,
};
