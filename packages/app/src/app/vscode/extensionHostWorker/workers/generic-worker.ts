// This is the default worker that will be called if no worker is specified.
// It's function is to execute the code of the path that's given to it.

import { default as Module } from 'node-services/lib/module';
import resolve from 'resolve';
import { basename } from 'path';
import _debug from 'common/lib/utils/debug';
import { commonPostMessage } from 'common/lib/utils/global';

import { initializeBrowserFS } from '../common/fs';

export function start({
  syncSandbox = true,
  syncTypes = true,
  extraMounts = {},
} = {}) {
  const DEBUG_NAME = `cs:cp-bootstrap-worker`;
  let debug = _debug(DEBUG_NAME);

  debug('Starting Worker');

  const ctx = self as any;

  const pendingMessages = [];
  let initialized = false;

  const log = console.log;

  function processMessage(data) {
    const process = ctx.BrowserFS.BFSRequire('process');
    const { $data, $type } = data;

    if (!data.$broadcast) {
      debug('message', data);
    }

    if ($type === 'message') {
      process.emit('message', JSON.parse($data), undefined);
    } else if ($data && $data.$type) {
      process.stdin.emit('data', $data.$data);
    } else if ($type === 'input-write') {
      process.stdin.emit('data', $data);
    } else {
      if (
        data.browserfsMessage ||
        (data.$data && data.$data.browserfsMessage)
      ) {
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

      debug('process.send', m);

      commonPostMessage(m);

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

        debug('process.stdout.write', m);

        commonPostMessage(m);

        if (callback) {
          callback(null, null);
        }
      },
    };

    process.env = data.data.env || {};
    process.env.HOME = '/home';
    process.cwd = () => data.data.cwd || '/sandbox';
    process.argv = ['node', data.data.entry, ...data.data.argv] || [];
  };

  self.addEventListener('message', async e => {
    const { data } = e;

    if (data.$type === 'worker-manager') {
      if (data.$event === 'init') {
        debug = _debug(`${DEBUG_NAME}:${basename(data.data.entry)}`);
        debug('Initializing BrowserFS');
        await initializeBrowserFS({ syncSandbox, syncTypes, extraMounts });
        debug('Initialized BrowserFS', data);

        const process = ctx.BrowserFS.BFSRequire('process');
        initializeProcess(process, data);

        if (data.data.entry) {
          const resolvedPath = resolve.sync(data.data.entry, {
            basedir: '/',
          });

          try {
            debug('Loading module...', resolvedPath);
            const module = new Module(resolvedPath);
            module.load(resolvedPath);

            initialized = true;

            // Sometimes the module overwrites console.log for the VSCode output channel, we don't want this with
            // debugging
            console.log = log;

            debug(
              'Loaded module, now evaluating remaining messages',
              pendingMessages
            );

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
}

commonPostMessage({ $type: 'ready' });
