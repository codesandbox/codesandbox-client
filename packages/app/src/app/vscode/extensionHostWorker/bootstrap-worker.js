// This is the sub worker that runs code for the extension host
// This means that all workers spawned by the worker will be done by the sub-worker

import { default as Module } from 'node-services/lib/module';
import resolve from 'resolve';
import _debug from 'common/utils/debug';

import { initializeBrowserFS } from './common/fs';

const debug = _debug('cs:cp-bootstrap-worker');

debug('Starting Worker');

const pendingMessages = [];
let initialized = false;

function processMessage(data) {
  const process = BrowserFS.BFSRequire('process');
  const { $data, $type } = data;

  if ($type === 'message') {
    process.emit('message', JSON.parse($data));
  } else if ($data && $data.$type) {
    process.stdin.emit('data', $data.$data);
  } else if ($type === 'input-write') {
    process.stdin.emit('data', $data);
  } else {
    if (data.browserfsMessage || (data.$data && data.$data.browserfsMessage)) {
      return;
    }
  }
}

const initializeProcess = (process, data) => {
  process.send = (message, _a, _b, callback) => {
    const m = {
      $type: 'message',
      $data: JSON.stringify(message),
    };

    self.postMessage(m);

    if (typeof _a === 'function') {
      _a(null);
    } else if (typeof _b === 'function') {
      _b(null);
    } else if (typeof callback === 'function') {
      callback(null);
    }
  };

  process.stdout = {
    write: (message, callback) => {
      const m = {
        $type: 'stdout',
        $data: message,
      };

      // TODO look into wildcard
      self.postMessage(m);

      if (callback) {
        callback(null, null);
      }
    },
  };

  process.env = data.data.env || {};
  process.env.HOME = '/home';
  process.cwd = () => data.data.cwd || '/';
  process.argv = ['node', data.data.entry, ...data.data.argv] || [];
};

self.addEventListener('message', async e => {
  const { data } = e;

  if (data.$type === 'worker-manager') {
    if (data.$event === 'init') {
      debug('Initializing BrowserFS');
      const process = BrowserFS.BFSRequire('process');
      await initializeBrowserFS({ syncSandbox: true });
      debug('Initialized BrowserFS', data);

      initializeProcess(process, data);

      if (data.data.entry) {
        const resolvedPath = resolve.sync(data.data.entry);

        try {
          const module = new Module(resolvedPath);
          module.load(resolvedPath);

          initialized = true;

          pendingMessages.forEach(processMessage);
        } catch (e) {
          console.error(e);
        }
      }
    }
  } else if (!initialized) {
    pendingMessages.push(data);
  } else {
    processMessage(data);
  }
});
