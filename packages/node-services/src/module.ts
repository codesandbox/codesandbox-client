import * as resolve from 'resolve';
import * as path from 'path';
import { getCaller, getCallSites } from './stubs/resolve-caller';

function getConstants() {
  const constants = require('constants-browserify');
  constants.FS = BrowserFS.BFSRequire('fs');

  return constants;
}

function updateChildren(
  parent: Module | undefined,
  child: Module,
  scan: boolean
) {
  const children = parent && parent.children;
  if (children && !(scan && children.includes(child))) children.push(child);
}

export default class Module {
  id: string;
  exports: any;
  parent: Module | undefined;
  children: Module[];
  filename: string | null;
  loaded: boolean;
  static _extensions: {
    [ext: string]: (module: Module, filename: string) => void;
  } = {
    '.js': function(module: Module, filename: string) {
      const fs = BrowserFS.BFSRequire('fs');
      const content = fs.readFileSync(filename, 'utf8');

      module._compile(content, filename);
    },
    '.json': function(module: Module, filename: string) {
      const fs = BrowserFS.BFSRequire('fs');
      const content = fs.readFileSync(filename, 'utf8');

      try {
        module.exports = JSON.parse(content);
      } catch (err: any) {
        err.message = filename + ': ' + err.message;
        throw err;
      }
    },
  };

  static globalPaths = [];

  static _cache: {
    [filename: string]: Module;
  } = {};

  constructor(id: string, parent?: Module) {
    this.id = id;
    this.exports = {};
    this.parent = parent;
    updateChildren(parent, this, false);

    this.filename = null;
    this.loaded = false;
    this.children = [];
  }

  load(filename: string) {
    if (this.loaded) {
      throw new Error('Loaded already');
    }

    this.filename = filename;

    let extension = path.extname(filename) || '.js';
    if (!Module._extensions[extension]) extension = '.js';

    Module._extensions[extension](this, filename);

    this.loaded = true;
  }

  require(path: string) {
    return Module._load(path, this);
  }

  _compile(content: string, filename: string) {
    const _self = this;
    // remove shebang
    content = content.replace(/^\#\!.*/, '');

    function require(path: string) {
      return _self.require(path);
    }

    require.cache = Module._cache;

    require.resolve = function(request: string) {
      return Module._resolveFilename(request, _self);
    };

    const global: any = {
      require,
      exports: _self.exports,
      __filename: filename,
      __dirname: path.dirname(filename),
      module: _self,
    };
    global.global = self;

    Module.evaluate(
      global,
      [content, `//# sourceURL=${location.origin}${filename}`].join('\n')
    );
  }

  static evaluate(global: any, content: string) {
    // Don't let the module think that we're in an AMD env.
    const oldamd = (self as any).define;
    (self as any).define = null;

    const globalParams = Object.keys(global).join(', ');
    const newCode = [`(function(${globalParams}) {`, content, `})`].join('\n');

    const result = (0, eval)(newCode).apply(
      this,
      Object.keys(global).map(m => global[m])
    );

    (self as any).define = oldamd;
    return result;
  }

  static _resolveFilename(request: string, parent: Module): string {
    return resolve.sync(request, {
      basedir: parent.filename ? path.dirname(parent.filename) : undefined,
      extensions: ['.js', '.json'],
    });
  }

  static createRequire(fromPath: string) {
    const module = new Module(fromPath);
    module.filename = fromPath;

    return module._createRequire();
  }

  _createRequire() {
    const require = (p: string) => this.require(p);

    require.resolve = (request: string) => {
      return Module._resolveFilename(request, this);
    };

    return require;
  }

  static _load(request: string, parent: Module, isMain?: boolean) {
    if (request === 'module') {
      return Module;
    }

    if (request === 'child_process') {
      return require('./child_process');
    }

    if (request === 'net') {
      return require('./net');
    }

    if (request === 'assert') {
      return require('assert');
    }

    if (request === 'string_decoder') {
      return require('string_decoder');
    }

    if (request === 'diagnostics') {
      return require('debug');
    }

    if (request === '/vscode/node_modules.asar/vscode-textmate') {
      return require('vscode-textmate/out/main');
    }

    if (request === 'zlib') {
      return require('browserify-zlib');
    }

    if (request === 'punycode') {
      return require('punycode');
    }

    if (request === 'execa') {
      return {};
    }

    if (request === 'tty') {
      return { isatty: () => false };
    }

    if (request === 'stream') {
      return require('stream-browserify');
    }

    if (request === 'http') {
      // @ts-ignore Trick the module in thinking that it's on window, it's an outdated check
      self.window = self;
      return require('http-browserify');
    }

    if (request === 'https') {
      // @ts-ignore Trick the module in thinking that it's on window, it's an outdated check
      self.window = self;
      return require('https-browserify');
    }

    if (request === 'constants') {
      return getConstants();
    }

    if (request.startsWith('vscode-extension-telemetry')) {
      return {
        default: class TelemetryService {
          constructor(
            extensionId: string,
            extensionVersion: string,
            key: string
          ) {}

          sendTelemetryEvent(
            eventName: string,
            properties?: {
              [key: string]: string;
            },
            measurements?: {
              [key: string]: number;
            }
          ) {}

          dispose() {}
        },
      };
    }

    if (request === 'url') {
      return require('url');
    }

    if (request === 'crypto') {
      return require('crypto');
    }

    if (request === 'util') {
      // Direct import to get the right version for VIM extensions
      return require('../node_modules/util');
    }

    if (request === 'os') {
      return require('os');
    }

    if (request === 'events') {
      return require('events');
    }

    if (request === 'readline') {
      return require('./readline');
    }

    if (request === 'stream') {
      return require('stream');
    }

    if (request === 'https-proxy-agent') {
      return {};
    }

    if (request === 'http-proxy-agent') {
      return {};
    }

    if (request === 'tls') {
      return {};
    }

    if (request === 'fs' || request === 'graceful-fs') {
      const fs = BrowserFS.BFSRequire('fs');
      fs.constants = getConstants();

      // VIM Mode needs this just to check if there are permissions, we know that all files can be accessed
      // so this way we force it to work.
      fs.accessSync = (_path: any, _type: any) => {
        if (fs.existsSync(_path)) {
          return true;
        }
        throw new Error('File not found');
      };
      fs.access = (_path: any, cb1: any, cb: (err?: Error) => void) => {
        const callback = cb || cb1;

        // TODO: make this async
        if (fs.existsSync(_path)) {
          return callback();
        }
        callback(new Error('File not found'));
      };

      return fs;
    }

    // NativeModule override
    if (BrowserFS.BFSRequire(request)) {
      return BrowserFS.BFSRequire(request);
    }

    const filename = Module._resolveFilename(request, parent);
    const cachedModule = Module._cache[filename];
    if (cachedModule) {
      updateChildren(parent, cachedModule, true);
      return cachedModule.exports;
    }

    if (filename === 'callsites') {
      return getCallSites;
    }

    if (filename.endsWith('resolve/lib/caller.js')) {
      return getCaller;
    }

    const module = new Module(filename, parent);

    if (isMain) {
      // @ts-ignore
      process.mainModule = module;
      module.id = '.';
    }

    Module._cache[filename] = module;

    let threw = true;
    try {
      module.load(filename);
      threw = false;
    } finally {
      if (threw) {
        delete Module._cache[filename];
        console.error(module, 'had trouble loading...');
      }
    }

    return module.exports;
  }
}
