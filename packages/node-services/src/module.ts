import resolve from 'resolve';
import * as fs from 'fs';
import * as path from 'path';

function getConstants() {
  const constants = require('constants-browserify');
  constants.FS = BrowserFS.BFSRequire('fs');

  return constants;
}

export default class Module {
  id: string;
  exports: any;
  parent: Module;
  children: Module[];
  filename: string | null;
  loaded: boolean;
  static _extensions: {
    [ext: string]: Function;
  } = {
    ['.js']: function(module: Module, filename: string) {
      var content = fs.readFileSync(filename, 'utf8');
      module._compile(content, filename);
    },
    ['.json']: function(module: Module, filename: string) {
      var content = fs.readFileSync(filename, 'utf8');
      try {
        module.exports = JSON.parse(content);
      } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
      }
    },
  };

  static globalPaths = [];

  static _cache: {
    [filename: string]: Module;
  } = {};

  constructor(id: string, parent: Module) {
    this.id = id;
    this.exports = {};
    this.parent = parent;
    if (parent && parent.children) {
      parent.children.push(this);
    }

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
    var _self = this;
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
      require: require,
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
    const oldamd = self.define;
    (self as any).define = null;

    const globalParams = Object.keys(global).join(', ');
    const newCode = [`(function(${globalParams}) {`, content, `})`].join('\n');

    const result = (0, eval)(newCode).apply(
      this,
      Object.keys(global).map(m => global[m])
    );

    self.define = oldamd;
    return result;
  }

  static _resolveFilename(request: string, parent: Module) {
    return resolve.sync(request, {
      basedir: parent.filename ? path.dirname(parent.filename) : undefined,
      extensions: ['.js', '.json'],
    });
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

    if (request === 'diagnostics') {
      return require('debug');
    }

    if (request === 'zlib') {
      return {};
    }

    if (request === 'tty') {
      return { isatty: () => false };
    }

    if (request === 'http') {
      return {
        Agent: class Agent {},
      };
    }

    if (request === 'https') {
      return {
        Agent: class Agent {},
      };
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
      return require('util');
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
        return true;
      };

      return fs;
    }

    // NativeModule override
    if (BrowserFS.BFSRequire(request)) {
      return BrowserFS.BFSRequire(request);
    }

    var filename = Module._resolveFilename(request, parent);

    var cachedModule = Module._cache[filename];
    if (cachedModule) {
      return cachedModule.exports;
    }

    var module = new Module(filename, parent);

    if (isMain) {
      process.mainModule = module;
      module.id = '.';
    }

    Module._cache[filename] = module;

    var hadException = true;

    try {
      module.load(filename);
      hadException = false;
    } finally {
      if (hadException) {
        delete Module._cache[filename];
      }
    }

    return module.exports;
  }
}
