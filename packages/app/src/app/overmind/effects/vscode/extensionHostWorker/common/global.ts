/* eslint-disable global-require */
import { EventEmitter } from 'events';

import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';

const ctx: any = self as any;
declare const __DEV__: boolean;

if (typeof Worker === 'undefined') {
  ctx.importScripts('https://unpkg.com/subworkers@1.0.1/subworkers.js');
}

export const initializePolyfills = () => {
  return requirePolyfills();
};

export const loadBrowserFS = () => {
  ctx.importScripts(
    `${process.env.CODESANDBOX_HOST}/static/browserfs12/browserfs.min.js`
  );
};

export const initializeGlobals = () => {
  // We need to initialize some node environment stubs
  ctx.process = ctx.BrowserFS.BFSRequire('process');
  ctx.process.platform = 'linux';
  ctx.process.stdin = new EventEmitter();
  ctx.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';
  ctx.Buffer = ctx.BrowserFS.BFSRequire('buffer').Buffer;
  ctx.setTimeout = setTimeout.bind(ctx);
  ctx.clearTimeout = clearTimeout.bind(ctx);
  ctx.setImmediate = (func, delay) => setTimeout(func, delay);
  ctx.clearImmediate = id => ctx.clearTimeout(id);
};

export function initializeAll() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async resolve => {
    await initializePolyfills();
    loadBrowserFS();
    initializeGlobals();

    resolve();
  });
}
