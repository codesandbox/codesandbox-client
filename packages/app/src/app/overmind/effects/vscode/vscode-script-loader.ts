/* eslint-disable */
import * as child_process from 'node-services/lib/child_process';
import { default as Module } from 'node-services/lib/module';
import * as net from 'node-services/lib/net';
import resolve from 'resolve';

const { VSCODE_METADATA, MONACO_METADATA } = require('./metadata');

const PREFIX = '/vs';

const global: any = self || window;
global.global = typeof window === 'undefined' ? self : window;
let requiresDefined = false;

function initializeRequires() {
  global.require.define('vs/platform/product/node/product', [], () => ({
    default: {
      nameShort: 'Code - OSS',
      nameLong: 'Code - OSS',
      applicationName: 'code-oss',
      dataFolderName: '.vscode-oss',
      win32MutexName: 'vscodeoss',
      licenseName: 'MIT',
      licenseUrl: 'https://github.com/Microsoft/vscode/blob/master/LICENSE.txt',
      win32DirName: 'Microsoft Code OSS',
      win32NameVersion: 'Microsoft Code OSS',
      win32RegValueName: 'CodeOSS',
      win32AppId: '{{E34003BB-9E10-4501-8C11-BE3FAA83F23F}',
      win32x64AppId: '{{D77B7E06-80BA-4137-BCF4-654B95CCEBC5}',
      win32UserAppId: '{{C6065F05-9603-4FC4-8101-B9781A25D88E}',
      win32x64UserAppId: '{{C6065F05-9603-4FC4-8101-B9781A25D88E}',
      win32AppUserModelId: 'Microsoft.CodeOSS',
      win32ShellNameShort: 'C&ode - OSS',
      darwinBundleIdentifier: 'com.visualstudio.code.oss',
      reportIssueUrl: 'https://github.com/Microsoft/vscode/issues/new',
      urlProtocol: 'code-oss',
      extensionAllowedProposedApi: ['ms-vscode.references-view'],
    },
  }));
  global.require.define('vs/platform/product/node/package', [], () => ({
    default: {
      name: 'code-oss-dev',
      version: '1.33.0',
      distro: '533c92fa5e71d449c33c99a6d7c0fbc9a12ea537',
      author: {
        name: 'Microsoft Corporation',
      },
      main: './out/main',
      private: true,
      scripts: {
        test: 'mocha',
        preinstall: 'node build/npm/preinstall.js',
        postinstall: 'node build/npm/postinstall.js',
        compile: 'gulp compile --max_old_space_size=4095',
        watch: 'gulp watch --max_old_space_size=4095',
        'watch-client': 'gulp watch-client --max_old_space_size=4095',
        'monaco-editor-test': 'mocha --only-monaco-editor',
        precommit: 'node build/gulpfile.hygiene.js',
        gulp: 'gulp --max_old_space_size=4095',
        '7z': '7z',
        'update-grammars': 'node build/npm/update-all-grammars.js',
        'update-localization-extension':
          'node build/npm/update-localization-extension.js',
        smoketest: 'cd test/smoke && node test/index.js',
        'monaco-compile-check': 'tsc -p src/tsconfig.monaco.json --noEmit',
        'download-builtin-extensions': 'node build/lib/builtInExtensions.js',
        'strict-null-check': 'tsc -p src/tsconfig.strictNullChecks.json',
        'strict-null-check-watch':
          'tsc -p src/tsconfig.strictNullChecks.json --watch',
        'prepare:container':
          'rm -rf out-container && mkdir out-container && mkdir out-container/vscode && cp -R out-editor-build out-container/vscode/out && cp start-ext-host.js out-container/vscode && cp out/bootstrap* out-container/vscode/out && cp -R extensions-bundle/extensions out-container/extensions && mkdir out-container/vscode/node_modules.asar && mkdir out-container/vscode/node_modules && cp -R node_modules/async-limiter out-container/vscode/node_modules/async-limiter && cp -R node_modules/ws out-container/vscode/node_modules/ws && cp -R node_modules/vscode-textmate out-container/vscode/node_modules.asar/vscode-textmate',
      },
      dependencies: {
        applicationinsights: '1.0.8',
        'gc-signals': '^0.0.2',
        getmac: '1.4.1',
        'graceful-fs': '4.1.11',
        'http-proxy-agent': '^2.1.0',
        'https-proxy-agent': '^2.2.1',
        'iconv-lite': '0.4.23',
        jschardet: '1.6.0',
        keytar: '4.2.1',
        minimist: '1.2.0',
        'native-is-elevated': '^0.2.1',
        'native-keymap': '1.2.5',
        'native-watchdog': '1.0.0',
        'node-pty': '0.8.1',
        semver: '^5.5.0',
        spdlog: '0.7.2',
        'sudo-prompt': '8.2.0',
        'v8-inspect-profiler': '^0.0.20',
        'vscode-chokidar': '1.6.5',
        'vscode-debugprotocol': '1.34.0',
        'vscode-nsfw': '1.1.1',
        'vscode-proxy-agent': '0.4.0',
        'vscode-ripgrep': '^1.2.5',
        'vscode-sqlite3': '4.0.7',
        'vscode-textmate': '^4.0.1',
        'vscode-xterm': '3.13.0-beta1',
        winreg: '^1.2.4',
        ws: '^6.1.0',
        yauzl: '^2.9.1',
        yazl: '^2.4.3',
      },
      devDependencies: {
        '7zip': '0.0.6',
        '@types/keytar': '^4.0.1',
        '@types/minimist': '^1.2.0',
        '@types/mocha': '2.2.39',
        '@types/node': '^10.12.12',
        '@types/semver': '^5.5.0',
        '@types/sinon': '^1.16.36',
        '@types/webpack': '^4.4.10',
        '@types/winreg': '^1.2.30',
        '@types/ws': '^6.0.1',
        'ansi-colors': '^3.2.3',
        asar: '^0.14.0',
        'chromium-pickle-js': '^0.2.0',
        'clean-css': '3.4.6',
        'copy-webpack-plugin': '^4.5.2',
        coveralls: '^2.11.11',
        'cson-parser': '^1.3.3',
        debounce: '^1.0.0',
        documentdb: '^1.5.1',
        'electron-mksnapshot': '~2.0.0',
        eslint: '^3.4.0',
        'event-stream': '3.3.4',
        express: '^4.13.1',
        'fancy-log': '^1.3.3',
        'fast-plist': '0.1.2',
        glob: '^5.0.13',
        gulp: '^4.0.0',
        'gulp-atom-electron': '^1.20.0',
        'gulp-azure-storage': '^0.10.0',
        'gulp-buffer': '0.0.2',
        'gulp-concat': '^2.6.1',
        'gulp-cssnano': '^2.1.3',
        'gulp-eslint': '^5.0.0',
        'gulp-filter': '^5.1.0',
        'gulp-flatmap': '^1.0.2',
        'gulp-json-editor': '^2.5.0',
        'gulp-plumber': '^1.2.0',
        'gulp-remote-src': '^0.4.4',
        'gulp-rename': '^1.2.0',
        'gulp-replace': '^0.5.4',
        'gulp-shell': '^0.6.5',
        'gulp-tsb': '2.0.7',
        'gulp-tslint': '^8.1.3',
        'gulp-uglify': '^3.0.0',
        'gulp-vinyl-zip': '^2.1.2',
        husky: '^0.13.1',
        'innosetup-compiler': '^5.5.60',
        is: '^3.1.0',
        istanbul: '^0.3.17',
        'jsdom-no-contextify': '^3.1.0',
        'lazy.js': '^0.4.2',
        'merge-options': '^1.0.1',
        mime: '^1.4.1',
        minimatch: '^3.0.4',
        mkdirp: '^0.5.0',
        mocha: '^2.2.5',
        'mocha-junit-reporter': '^1.17.0',
        optimist: '0.3.5',
        'p-all': '^1.0.0',
        pump: '^1.0.1',
        queue: '3.0.6',
        rcedit: '^1.1.0',
        'remap-istanbul': '^0.13.0',
        rimraf: '^2.2.8',
        sinon: '^1.17.2',
        'source-map': '^0.4.4',
        'ts-loader': '^4.4.2',
        tslint: '^5.11.0',
        typescript: '3.3.1',
        'typescript-formatter': '7.1.0',
        'typescript-tslint-plugin': '^0.0.7',
        'uglify-es': '^3.0.18',
        underscore: '^1.8.2',
        vinyl: '^2.0.0',
        'vinyl-fs': '^3.0.0',
        vsce: '1.48.0',
        'vscode-nls-dev': '3.2.5',
        webpack: '^4.16.5',
        'webpack-cli': '^3.1.0',
        'webpack-stream': '^5.1.1',
      },
      repository: {
        type: 'git',
        url: 'https://github.com/Microsoft/vscode.git',
      },
      bugs: {
        url: 'https://github.com/Microsoft/vscode/issues',
      },
      optionalDependencies: {
        'vscode-windows-registry': '1.0.1',
        'win-ca-lib':
          'https://github.com/chrmarti/win-ca/releases/download/v2.4.1-lib-test/win-ca-lib-2.4.1.tgz',
        'windows-foreground-love': '0.1.0',
        'windows-mutex': '0.2.1',
        'windows-process-tree': '0.2.3',
      },
    },
  }));

  global.require.define('path', [], () => {
    const path = require('path');
    return {
      ...path,
      posix: path,
    };
  });

  global.require.define('http', [], () => {
    if (typeof self.window === 'undefined') {
      // @ts-ignore Trick the module in thinking that it's on window, it's an outdated check
      self.window = self;
    }
    return require('http-browserify');
  });

  global.require.define('https', [], () => {
    if (typeof self.window === 'undefined') {
      // @ts-ignore Trick the module in thinking that it's on window, it's an outdated check
      self.window = self;
    }
    return require('https-browserify');
  });

  global.require.define('util', [], () => {
    return require('util');
  });

  global.require.define('url', [], () => {
    return require('url');
  });

  global.require.define('tls', [], () => {
    return {};
  });

  global.require.define('string_decoder', [], () => {
    return require('string_decoder');
  });

  global.require.define('crypto', [], () => {
    return {
      createHash: () => require('crypto-browserify').createHash('sha1'),
    };
  });

  global.require.define('node-pty', [], () => {
    return {};
  });

  global.require.define(
    'vs/workbench/services/extensions/node/proxyResolver',
    [],
    () => {
      return {
        connectProxyResolver: () => Promise.resolve(undefined),
      };
    }
  );

  global.require.define('os', [], () => {
    return { tmpdir: () => '/tmp', release: () => '16' };
  });

  global.require.define('vs/base/node/encoding', [], () => {
    return {
      UTF8: 'utf8',
      UTF8_with_bom: 'utf8bom',
      UTF16be: 'utf16be',
      UTF16le: 'utf16le',
    };
  });

  global.require.define('child_process', [], () => {
    return child_process;
  });

  global.require.define('electron', [], () => {
    return {
      webFrame: {
        getZoomFactor() {
          return 1;
        },
      },
      clipboard: {
        writeText: (text: string) => {
          // @ts-ignore
          return navigator.clipboard.writeText(text);
        },
        readText: () => {
          // @ts-ignore
          return navigator.clipboard.readText();
        },
      },
    };
  });

  global.require.define('net', [], () => {
    return net;
  });

  global.require.define('fs', [], () => {
    return global.BrowserFS.BFSRequire('fs');
  });

  global.require.define('semver', [], () => {
    return require('semver');
  });

  global.require.define('assert', [], () => {
    return require('assert');
  });

  global.require.define('punycode', [], () => {
    return require('punycode');
  });

  global.require.define('vs/base/common/amd', [], () => ({
    getPathFromAmdModule: (_, relativePath) =>
      require('path').join('/vs', relativePath),
  }));

  global.require.define('vs/platform/request/node/request', [], () => {
    // TODO
    return {};
  });

  global.require.define('vs/base/node/request', [], () => {
    // TODO
    return {};
  });

  global.require.define('vs/base/node/proxy', [], () => {
    // TODO
    return {};
  });

  global.require.define('stream', [], () => {
    // TODO
    return require('stream');
  });

  global.require.define('vscode-textmate', [], () => {
    return require('vscode-textmate/out/main');
  });

  global.require.define('yazl', [], () => {
    // TODO: install yazl
  });
  global.require.define('yauzl', [], () => {
    // TODO: install yazl
  });

  global.require.define('native-keymap', [], () => {
    return {
      getCurrentKeyboardLayout(): null {
        return null;
      },

      getKeyMap(): undefined[] {
        return [];
      },
    };
  });
}

export default function (isVSCode: boolean, requiredModule?: string[]) {
  var METADATA = isVSCode ? VSCODE_METADATA : MONACO_METADATA;
  var IS_FILE_PROTOCOL = global.location.protocol === 'file:';
  var DIRNAME: string | null = null;
  if (IS_FILE_PROTOCOL) {
    var port = global.location.port;
    if (port.length > 0) {
      port = ':' + port;
    }
    DIRNAME =
      global.location.protocol +
      '//' +
      global.location.hostname +
      port +
      global.location.pathname.substr(
        0,
        global.location.pathname.lastIndexOf('/')
      );

    var bases = document.getElementsByTagName('base');
    if (bases.length > 0) {
      DIRNAME = DIRNAME + '/' + bases[0].getAttribute('href');
    }
  }

  var LOADER_OPTS = (function () {
    function parseQueryString() {
      var str = global.location.search;
      str = str.replace(/^\?/, '');
      var pieces = str.split(/&/);
      var result = {};
      pieces.forEach(function (piece) {
        var config = piece.split(/=/);
        result[config[0]] = config[1];
      });
      return result;
    }
    var overwrites = parseQueryString();
    var result = {};
    result['editor'] = overwrites['editor'] || 'src';
    METADATA.PLUGINS.map(function (plugin) {
      result[plugin.name] =
        overwrites[plugin.name] || (process.env.VSCODE ? 'src' : 'npm/min');
    });
    return result;
  })();
  function toHREF(search) {
    var port = global.location.port;
    if (port.length > 0) {
      port = ':' + port;
    }
    return (
      global.location.protocol +
      '//' +
      global.location.hostname +
      port +
      global.location.pathname +
      search +
      global.location.hash
    );
  }

  function Component(name: string, modulePrefix: string, paths, contrib?: any) {
    this.name = name;
    this.modulePrefix = modulePrefix;
    this.paths = paths;
    this.contrib = contrib;
    this.selectedPath = LOADER_OPTS[name];
  }
  Component.prototype.isRelease = function () {
    return /release/.test(this.selectedPath);
  };
  Component.prototype.getResolvedPath = function () {
    var resolvedPath = this.paths[this.selectedPath];
    if (
      this.selectedPath === 'npm/dev' ||
      this.selectedPath === 'npm/min' ||
      this.isRelease()
    ) {
      if (IS_FILE_PROTOCOL) {
        resolvedPath = DIRNAME + '/../' + resolvedPath;
      } else {
        if (resolvedPath.startsWith('../')) {
          resolvedPath = '/' + resolvedPath.replace('../', '');
        }
      }
    } else {
      if (IS_FILE_PROTOCOL) {
        resolvedPath = DIRNAME + '/../..' + resolvedPath;
      }
    }
    return resolvedPath;
  };
  Component.prototype.generateLoaderConfig = function (dest) {
    dest[this.modulePrefix] =
      process.env.CODESANDBOX_HOST + this.getResolvedPath();
  };
  Component.prototype.generateUrlForPath = function (pathName) {
    var NEW_LOADER_OPTS = {};
    Object.keys(LOADER_OPTS).forEach(function (key) {
      NEW_LOADER_OPTS[key] =
        LOADER_OPTS[key] === 'npm/dev' ? undefined : LOADER_OPTS[key];
    });
    NEW_LOADER_OPTS[this.name] = pathName === 'npm/dev' ? undefined : pathName;

    var search = Object.keys(NEW_LOADER_OPTS)
      .map(function (key) {
        var value = NEW_LOADER_OPTS[key];
        if (value) {
          return key + '=' + value;
        }
        return '';
      })
      .filter(function (assignment) {
        return Boolean(assignment);
      })
      .join('&');
    if (search.length > 0) {
      search = '?' + search;
    }
    return toHREF(search);
  };
  Component.prototype.renderLoadingOptions = function () {
    return (
      '<strong style="width:130px;display:inline-block;">' +
      this.name +
      '</strong>:&nbsp;&nbsp;&nbsp;' +
      Object.keys(this.paths)
        .map(
          function (pathName) {
            if (pathName === this.selectedPath) {
              return '<strong>' + pathName + '</strong>';
            }
            return (
              '<a href="' +
              this.generateUrlForPath(pathName) +
              '">' +
              pathName +
              '</a>'
            );
          }.bind(this)
        )
        .join('&nbsp;&nbsp;&nbsp;')
    );
  };

  var RESOLVED_CORE = new Component('editor', 'vs', METADATA.CORE.paths);
  global.RESOLVED_CORE_PATH = RESOLVED_CORE.getResolvedPath();
  var RESOLVED_PLUGINS = METADATA.PLUGINS.map(function (plugin) {
    return new Component(
      plugin.name,
      plugin.modulePrefix,
      plugin.paths,
      plugin.contrib
    );
  });

  function loadScript(path, callback) {
    if (typeof document !== 'undefined') {
      var script = document.createElement('script');
      script.onload = callback;
      script.async = true;
      script.type = 'text/javascript';
      script.src = path;
      document.head.appendChild(script);
    } else {
      global.importScripts(path);
      callback();
    }
  }

  (function () {
    if (process.env.DEBUG_VERSION) {
      var allComponents = [RESOLVED_CORE];
      if (!RESOLVED_CORE.isRelease()) {
        allComponents = allComponents.concat(RESOLVED_PLUGINS);
      }

      var div = document.createElement('div');
      div.style.position = 'fixed';
      div.style.top = '0';
      div.style.right = '0';
      div.style.background = 'lightgray';
      div.style.padding = '5px 20px 5px 5px';
      div.style.zIndex = '1000';

      div.innerHTML =
        '<ul><li>' +
        allComponents
          .map(function (component) {
            return component.renderLoadingOptions();
          })
          .join('</li><li>') +
        '</li></ul>';

      document.body.appendChild(div);

      var aElements = document.getElementsByTagName('a');
      for (var i = 0; i < aElements.length; i++) {
        var aElement = aElements[i];
        if (aElement.className === 'loading-opts') {
          aElement.href += global.location.search;
        }
      }
    }
  })();

  return function (callback: () => void, PATH_PREFIX?: string) {
    PATH_PREFIX = PATH_PREFIX || '';

    global.nodeRequire = path => {
      if (path.indexOf('/extensions/') === 0) {
        const resolvedPath = resolve.sync(path, {
          basedir: '/',
        });

        const module = new Module(path);
        module.load(resolvedPath);

        return module.exports;
      }

      if (path === 'module') {
        return Module;
      }

      if (path === 'native-watchdog') {
        return { start: () => {} };
      }
    };

    function loadFiles() {
      var loaderPathsConfig = {
        'vs/language/vue': '/public/14/vs/language/vue',
      };
      if (!RESOLVED_CORE.isRelease()) {
        RESOLVED_PLUGINS.forEach(function (plugin) {
          plugin.generateLoaderConfig(loaderPathsConfig);
        });
      }
      RESOLVED_CORE.generateLoaderConfig(loaderPathsConfig);

      if (process.env.NODE_ENV === 'development') {
        console.log('LOADER CONFIG: ');
        console.log(JSON.stringify(loaderPathsConfig, null, '\t'));
      }

      const requireToUrl = p => require('path').join('/vs', p);
      global.require.toUrl = requireToUrl;

      if (!requiresDefined && global.require.define) {
        requiresDefined = true;
        initializeRequires();
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('setting config', global.AMDLoader);
      }
      // global.require.config({ requireToUrl, paths: { vs: '/public/vscode' } });
      global.require.config({
        // isBuild: true,
        paths: loaderPathsConfig,
        requireToUrl,
      });

      global.deps = new Set();

      if (requiredModule) {
        global.require(requiredModule, function (a) {
          if (!isVSCode && !RESOLVED_CORE.isRelease()) {
            // At this point we've loaded the monaco-editor-core
            global.require(
              RESOLVED_PLUGINS.map(function (plugin) {
                return plugin.contrib;
              }),
              function () {
                // At this point we've loaded all the plugins
                callback();
              }
            );
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    }

    if (global.require) {
      loadFiles();
    } else {
      loadScript(
        PATH_PREFIX + RESOLVED_CORE.getResolvedPath() + '/loader.js',
        loadFiles
      );
    }
  };
}
