import { EventEmitter } from 'events';

const ctx: any = self as any;
declare var __DEV__: boolean;

export const initializePolyfills = () => {
  require('core-js/fn/string/starts-with');
  require('core-js/fn/string/ends-with');
  require('core-js/fn/array/find');
  require('core-js/fn/promise');
};

export const loadBrowserFS = () => {
  ctx.importScripts(
    `${process.env.CODESANDBOX_HOST}/static/browserfs3/browserfs.js`
  );
};

export const initializeGlobals = () => {
  // We need to initialize some node environment stubs
  ctx.BrowserFS = ctx.BrowserFS;
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
  return new Promise(resolve => {
    initializePolyfills();
    loadBrowserFS();
    initializeGlobals();
    resolve();
  });
}
