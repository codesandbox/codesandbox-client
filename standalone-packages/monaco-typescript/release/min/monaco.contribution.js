/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-typescript version: 3.1.0(2ef4e21e7205938cfddb5fcbf2614e1cc841c7b7)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
define('vs/language/typescript/monaco.contribution', [
  'require',
  'exports',
], function(n, e) {
  'use strict';
  Object.defineProperty(e, '__esModule', { value: !0 });
  var t,
    i,
    r,
    o,
    a,
    s,
    c,
    p,
    u,
    l,
    g,
    d,
    S,
    f,
    m = monaco.Emitter,
    h = (function() {
      function e(e, t) {
        (this._onDidChange = new m()),
          (this._extraLibs = Object.create(null)),
          (this._workerMaxIdleTime = 12e4),
          this.setCompilerOptions(e),
          this.setDiagnosticsOptions(t);
      }
      return (
        Object.defineProperty(e.prototype, 'onDidChange', {
          get: function() {
            return this._onDidChange.event;
          },
          enumerable: !0,
          configurable: !0,
        }),
        (e.prototype.getExtraLibs = function() {
          var e = Object.create(null);
          for (var t in this._extraLibs) e[t] = this._extraLibs[t];
          return Object.freeze(e);
        }),
        (e.prototype.addExtraLib = function(e, t) {
          var n = this;
          if (
            (void 0 === t && (t = 'ts:extralib-' + Date.now()),
            this._extraLibs[t])
          )
            throw new Error(t + ' already a extra lib');
          return (
            (this._extraLibs[t] = e),
            this._onDidChange.fire(this),
            {
              dispose: function() {
                delete n._extraLibs[t] && n._onDidChange.fire(n);
              },
            }
          );
        }),
        (e.prototype.getCompilerOptions = function() {
          return this._compilerOptions;
        }),
        (e.prototype.setCompilerOptions = function(e) {
          (this._compilerOptions = e || Object.create(null)),
            this._onDidChange.fire(this);
        }),
        (e.prototype.getDiagnosticsOptions = function() {
          return this._diagnosticsOptions;
        }),
        (e.prototype.setDiagnosticsOptions = function(e) {
          (this._diagnosticsOptions = e || Object.create(null)),
            this._onDidChange.fire(this);
        }),
        (e.prototype.setMaximumWorkerIdleTime = function(e) {
          this._workerMaxIdleTime = e;
        }),
        (e.prototype.getWorkerMaxIdleTime = function() {
          return this._workerMaxIdleTime;
        }),
        (e.prototype.setEagerModelSync = function(e) {
          this._eagerModelSync = e;
        }),
        (e.prototype.getEagerModelSync = function() {
          return this._eagerModelSync;
        }),
        e
      );
    })();
  (e.LanguageServiceDefaultsImpl = h),
    ((i = t || (t = {}))[(i.None = 0)] = 'None'),
    (i[(i.CommonJS = 1)] = 'CommonJS'),
    (i[(i.AMD = 2)] = 'AMD'),
    (i[(i.UMD = 3)] = 'UMD'),
    (i[(i.System = 4)] = 'System'),
    (i[(i.ES2015 = 5)] = 'ES2015'),
    ((o = r || (r = {}))[(o.None = 0)] = 'None'),
    (o[(o.Preserve = 1)] = 'Preserve'),
    (o[(o.React = 2)] = 'React'),
    ((s = a || (a = {}))[(s.CarriageReturnLineFeed = 0)] =
      'CarriageReturnLineFeed'),
    (s[(s.LineFeed = 1)] = 'LineFeed'),
    ((p = c || (c = {}))[(p.Unknown = 0)] = 'Unknown'),
    (p[(p.JS = 1)] = 'JS'),
    (p[(p.JSX = 2)] = 'JSX'),
    (p[(p.TS = 3)] = 'TS'),
    (p[(p.TSX = 4)] = 'TSX'),
    ((l = u || (u = {}))[(l.ES3 = 0)] = 'ES3'),
    (l[(l.ES5 = 1)] = 'ES5'),
    (l[(l.ES2015 = 2)] = 'ES2015'),
    (l[(l.ES2016 = 3)] = 'ES2016'),
    (l[(l.ES2017 = 4)] = 'ES2017'),
    (l[(l.ESNext = 5)] = 'ESNext'),
    (l[(l.Latest = 5)] = 'Latest'),
    ((d = g || (g = {}))[(d.Standard = 0)] = 'Standard'),
    (d[(d.JSX = 1)] = 'JSX'),
    ((f = S || (S = {}))[(f.Classic = 1)] = 'Classic'),
    (f[(f.NodeJs = 2)] = 'NodeJs');
  var y = new h(
      { allowNonTsExtensions: !0, target: u.Latest },
      { noSemanticValidation: !1, noSyntaxValidation: !1 }
    ),
    x = new h(
      { allowNonTsExtensions: !0, allowJs: !0, target: u.Latest },
      { noSemanticValidation: !0, noSyntaxValidation: !1 }
    );
  function E() {
    return b().then(function(e) {
      return e.getTypeScriptWorker();
    });
  }
  function _() {
    return b().then(function(e) {
      return e.getJavaScriptWorker();
    });
  }
  function b() {
    return monaco.Promise.wrap(
      new Promise(function(e, t) {
        n(['./tsMode'], e, t);
      })
    );
  }
  (monaco.languages.typescript = {
    ModuleKind: t,
    JsxEmit: r,
    NewLineKind: a,
    ScriptTarget: u,
    ModuleResolutionKind: S,
    typescriptDefaults: y,
    javascriptDefaults: x,
    getTypeScriptWorker: E,
    getJavaScriptWorker: _,
  }),
    monaco.languages.register({
      id: 'typescript',
      extensions: ['.ts', '.tsx'],
      aliases: ['TypeScript', 'ts', 'typescript'],
      mimetypes: ['text/typescript'],
    }),
    monaco.languages.onLanguage('typescript', function() {
      return b().then(function(e) {
        return e.setupTypeScript(y);
      });
    }),
    monaco.languages.register({
      id: 'javascript',
      extensions: ['.js', '.es6', '.jsx'],
      firstLine: '^#!.*\\bnode',
      filenames: ['jakefile'],
      aliases: ['JavaScript', 'javascript', 'js'],
      mimetypes: ['text/javascript'],
    }),
    monaco.languages.onLanguage('javascript', function() {
      return b().then(function(e) {
        return e.setupJavaScript(x);
      });
    });
});
