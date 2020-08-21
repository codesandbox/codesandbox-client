const __read = (this && this.__read) || function (o, n) {
    let m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    const i = m.call(o); let r; const ar = []; let e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error }; }
    finally {
        try {
            if (r && !r.done && (m = i.return)) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
const __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
const __values = (this && this.__values) || function (o) {
    const m = typeof Symbol === "function" && o[Symbol.iterator]; let i = 0;
    if (m) return m.call(o);
    return {
        next () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
define(["require", "exports", "./lib/typescriptServices", "./lib/lib", "./fetchDependencyTypings", "./lib/emmet/expand/languageserver-types", "./lib/emmet/emmetHelper"], function (require, exports, ts, lib_1, fetchTypings, ls, emmet) {
    /* eslint-disable */
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise = monaco.Promise;
    var DEFAULT_LIB = {
        NAME: "defaultLib:lib.d.ts",
        CONTENTS: lib_1.lib_dts
    };
    var ES6_LIB = {
        NAME: "defaultLib:lib.es6.d.ts",
        CONTENTS: lib_1.lib_es6_dts
    };
    var Priority;
    (function (Priority) {
        Priority[Priority["Emmet"] = 0] = "Emmet";
        Priority[Priority["Platform"] = 1] = "Platform";
    })(Priority = exports.Priority || (exports.Priority = {}));
    // Quickly remove amd so BrowserFS will register to global scope instead.
    // @ts-ignore
    var oldamd = self.define.amd;
    self.define.amd = null;
    self.importScripts("/static/browserfs9/browserfs.min.js");
    self.define.amd = oldamd;
    self.BrowserFS = BrowserFS;
    self.process = BrowserFS.BFSRequire("process");
    self.Buffer = BrowserFS.BFSRequire("buffer").Buffer;
    var getAllFiles = function (fs, dir, filelist) {
        if (!fs) {
            return [];
        }
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function (file) {
            if (fs.statSync(dir + file).isDirectory()) {
                filelist = getAllFiles(fs, dir + file + "/", filelist);
            }
            else {
                filelist.push(dir + file);
            }
        });
        return filelist;
    };
    var TypeScriptWorker = /** @class */ (function () {
        function TypeScriptWorker(ctx, createData) {
            var _this = this;
            this._extraLibs = Object.create(null);
            this._languageService = ts.createLanguageService(this);
            this.files = new Map();
            this.typesLoaded = false;
            this.fetchingTypes = false;
            this.fetchedTypes = [];
            this._ctx = ctx;
            this._compilerOptions = createData.compilerOptions;
            this._extraLibs = createData.extraLibs;
            // @ts-ignore
            ctx.onModelRemoved(function (str) {
                var p = str.indexOf("file://") === 0 ? monaco.Uri.parse(str).fsPath : str;
                _this.syncFile(p);
            });
            self.BrowserFS.configure({
                fs: "WorkerFS",
                options: { worker: self }
            }, function (e) {
                if (e) {
                    console.error(e);
                    return;
                }
                _this.fs = BrowserFS.BFSRequire("fs");
                _this.syncDirectory("/sandbox");
                _this.getTypings();
                setInterval(function () { return _this.getTypings(); }, 5000);
                // BrowserFS is initialized and ready-to-use!
            });
        }
        TypeScriptWorker.prototype.getTypings = function () {
            var _this = this;
            if (this.fetchingTypes) {
                return;
            }
            this.fetchingTypes = true;
            var ensureDirectoryExistence = function (filePath, cb) {
                var dirname = BrowserFS.BFSRequire("path").dirname(filePath);
                _this.fs.stat(dirname, function (err, exists) {
                    if (Boolean(exists)) {
                        cb(true);
                        return;
                    }
                    ensureDirectoryExistence(dirname, function () {
                        _this.fs.mkdir(dirname, cb);
                    });
                });
            };
            this.fs.readFile("/sandbox/package.json", function (e, data) {
                if (e) {
                    return;
                }
                var code = data.toString();
                try {
                    var p = JSON.parse(code);
                    var dependencies_1 = p.dependencies || {};
                    var devDependencies_1 = p.devDependencies || {};
                    Promise.join(__spread(Object.keys(dependencies_1), Object.keys(devDependencies_1).filter(function (p) { return p.indexOf("@types/") === 0; })).map(function (depName) {
                        var version = dependencies_1[depName] || devDependencies_1[depName];
                        var key = depName + "@" + version;
                        if (_this.fetchedTypes.indexOf(key) > -1) {
                            return Promise.as(void 0);
                        }
                        _this.fetchedTypes.push(key);
                        return fetchTypings
                            .fetchAndAddDependencies(depName, version)
                            .then(function (paths) {
                            var fileAmount = Object.keys(paths).length;
                            Object.keys(paths).forEach(function (p) {
                                var pathToWrite = "/sandbox/" + p;
                                _this.files.set(pathToWrite, paths[p]);
                                // Only sync with browsersfs if the file amount is not too high, otherwise we'll
                                // clog all resources of browserfs
                                if (fileAmount < 400) {
                                    ensureDirectoryExistence(pathToWrite, function () {
                                        _this.fs.writeFile(pathToWrite, paths[p], function () { });
                                    });
                                }
                            });
                        }).catch(function () { });
                    })).then(function () {
                        _this._languageService.cleanupSemanticCache();
                        setTimeout(function () {
                            _this.typesLoaded = true;
                        });
                    });
                }
                catch (e) {
                    return;
                }
                finally {
                    _this.fetchingTypes = false;
                }
            });
        };
        TypeScriptWorker.prototype.syncFile = function (path) {
            var _this = this;
            this.fs.readFile(path, function (e, str) {
                if (e) {
                    _this.files.delete(path);
                    return;
                }
                _this.files.set(path, str.toString());
            });
        };
        TypeScriptWorker.prototype.syncDirectory = function (path) {
            var _this = this;
            this.fs.readdir(path, function (e, entries) {
                if (e) {
                    return;
                }
                entries.forEach(function (entry) {
                    var fullEntry = path + "/" + entry;
                    _this.fs.stat(fullEntry, function (err, stat) {
                        if (err) {
                            _this.files.delete(path);
                            return;
                        }
                        if (stat.isDirectory()) {
                            _this.syncDirectory(fullEntry);
                        }
                        else {
                            _this.syncFile(fullEntry);
                        }
                    });
                });
            });
        };
        // --- language service host ---------------
        TypeScriptWorker.prototype.getCompilationSettings = function () {
            return this._compilerOptions;
        };
        TypeScriptWorker.prototype.readFile = function (resource, encoding) {
            var path = resource.indexOf("file://") === 0
                ? monaco.Uri.parse(resource).fsPath
                : resource;
            if (this.fs) {
                return this.files.get(path);
            }
            return undefined;
        };
        TypeScriptWorker.prototype.getScriptFileNames = function () {
            var models = this._ctx.getMirrorModels().map(function (model) { return model.uri.toString(); });
            return models
                .concat(Object.keys(this._extraLibs))
                .concat(__spread(this.files.keys()).map(function (p) { return "file://" + p; }));
        };
        TypeScriptWorker.prototype._getModel = function (fileName) {
            var models = this._ctx.getMirrorModels();
            for (var i = 0; i < models.length; i++) {
                if (models[i].uri.toString() === fileName) {
                    return models[i];
                }
            }
            return null;
        };
        TypeScriptWorker.prototype.getScriptVersion = function (fileName) {
            var model = this._getModel(fileName);
            if (model) {
                return model.version.toString();
            }
            else if (this.isDefaultLibFileName(fileName) ||
                fileName in this._extraLibs) {
                // extra lib and default lib are static
                return "1";
            }
        };
        TypeScriptWorker.prototype.getScriptSnapshot = function (fileName) {
            var text;
            var model = this._getModel(fileName);
            if (model) {
                // a true editor model
                text = model.getValue();
            }
            else if (fileName in this._extraLibs) {
                // static extra lib
                text = this._extraLibs[fileName];
            }
            else if (fileName === DEFAULT_LIB.NAME) {
                text = DEFAULT_LIB.CONTENTS;
            }
            else if (fileName === ES6_LIB.NAME) {
                text = ES6_LIB.CONTENTS;
            }
            else if (this.fs) {
                var usedFilename = fileName.indexOf("file://") === 0
                    ? monaco.Uri.parse(fileName).fsPath
                    : fileName;
                text = this.files.get(usedFilename);
            }
            else {
                return;
            }
            if (text == null) {
                return;
            }
            return {
                getText: function (start, end) { return text.substring(start, end); },
                getLength: function () { return text.length; },
                getChangeRange: function () { return undefined; }
            };
        };
        TypeScriptWorker.prototype.getScriptKind = function (fileName) {
            var suffix = fileName.substr(fileName.lastIndexOf(".") + 1);
            switch (suffix) {
                case "ts":
                    return ts.ScriptKind.TS;
                case "tsx":
                    return ts.ScriptKind.TSX;
                case "js":
                    return ts.ScriptKind.JS;
                case "jsx":
                    return ts.ScriptKind.JSX;
                default:
                    return this.getCompilationSettings().allowJs
                        ? ts.ScriptKind.JS
                        : ts.ScriptKind.TS;
            }
        };
        TypeScriptWorker.prototype.getCurrentDirectory = function () {
            return "/sandbox";
        };
        TypeScriptWorker.prototype.getDefaultLibFileName = function (options) {
            // TODO@joh support lib.es7.d.ts
            return options.target <= ts.ScriptTarget.ES5
                ? DEFAULT_LIB.NAME
                : ES6_LIB.NAME;
        };
        TypeScriptWorker.prototype.isDefaultLibFileName = function (fileName) {
            return fileName === this.getDefaultLibFileName(this._compilerOptions);
        };
        TypeScriptWorker.prototype.fileExists = function (resource) {
            if (!this.fs) {
                return false;
            }
            var path = resource.indexOf("file://") === 0
                ? monaco.Uri.parse(resource).fsPath
                : resource;
            return this.files.has(path);
        };
        TypeScriptWorker.prototype.directoryExists = function (resource) {
            if (!this.fs) {
                return false;
            }
            var path = resource.indexOf("file://") === 0
                ? monaco.Uri.parse(resource).fsPath
                : resource;
            return __spread(this.files.keys()).some(function (f) { return f.indexOf(path) === 0; });
        };
        TypeScriptWorker.prototype.getDirectories = function (resource) {
            if (!this.fs) {
                return [];
            }
            var path = resource.indexOf("file://") === 0
                ? monaco.Uri.parse(resource).fsPath
                : resource;
            var resourceSplits = path.split("/").length;
            return __spread(this.files.keys()).filter(function (f) { return f.indexOf(path) === 0; })
                .map(function (p) {
                var newP = p.split("/");
                newP.length = resourceSplits;
                return newP[newP.length - 1];
            });
        };
        TypeScriptWorker.prototype._getTextDocument = function (uri) {
            var e_1, _a;
            var models = this._ctx.getMirrorModels();
            try {
                for (var models_1 = __values(models), models_1_1 = models_1.next(); !models_1_1.done; models_1_1 = models_1.next()) {
                    var model = models_1_1.value;
                    if (model.uri.toString() === uri) {
                        return ls.TextDocument.create(uri, "javascript", model.version, model.getValue());
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (models_1_1 && !models_1_1.done && (_a = models_1.return)) _a.call(models_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
        // --- language features
        TypeScriptWorker.clearFiles = function (diagnostics) {
            // Clear the `file` field, which cannot be JSON'yfied because it
            // contains cyclic data structures.
            diagnostics.forEach(function (diag) {
                diag.file = undefined;
                var related = diag.relatedInformation;
                if (related) {
                    related.forEach(function (diag2) { return (diag2.file = undefined); });
                }
            });
        };
        TypeScriptWorker.prototype.getSyntacticDiagnostics = function (fileName) {
            if (!this.typesLoaded) {
                return Promise.as([]);
            }
            var diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
            TypeScriptWorker.clearFiles(diagnostics);
            return Promise.as(diagnostics);
        };
        TypeScriptWorker.prototype.getSemanticDiagnostics = function (fileName) {
            if (!this.typesLoaded) {
                return Promise.as([]);
            }
            var diagnostics = this._languageService.getSemanticDiagnostics(fileName);
            TypeScriptWorker.clearFiles(diagnostics);
            return Promise.as(diagnostics);
        };
        TypeScriptWorker.prototype.getCompilerOptionsDiagnostics = function (fileName) {
            var diagnostics = this._languageService.getCompilerOptionsDiagnostics();
            TypeScriptWorker.clearFiles(diagnostics);
            return Promise.as(diagnostics);
        };
        TypeScriptWorker.prototype.getCompletionsAtPosition = function (fileName, offset) {
            var document = this._getTextDocument(fileName);
            var position = document.positionAt(offset);
            var languageCompletions = this._languageService.getCompletionsAtPosition(fileName, offset, undefined);
            var emmetCompletions = emmet.doComplete(document, position, "jsx", {
                showExpandedAbbreviation: "always",
                showAbbreviationSuggestions: true,
                syntaxProfiles: {},
                variables: {},
                preferences: {}
            });
            var newLanguageCompletions = {
                languageCompletions: languageCompletions,
                emmetCompletions: emmetCompletions
            };
            return Promise.as(newLanguageCompletions);
        };
        TypeScriptWorker.prototype.getCompletionEntryDetails = function (fileName, position, entry) {
            return Promise.as(this._languageService.getCompletionEntryDetails(fileName, position, entry, undefined, undefined, undefined));
        };
        TypeScriptWorker.prototype.getSignatureHelpItems = function (fileName, position) {
            return Promise.as(this._languageService.getSignatureHelpItems(fileName, position, undefined));
        };
        TypeScriptWorker.prototype.getQuickInfoAtPosition = function (fileName, position) {
            return Promise.as(this._languageService.getQuickInfoAtPosition(fileName, position));
        };
        TypeScriptWorker.prototype.getOccurrencesAtPosition = function (fileName, position) {
            return Promise.as(this._languageService.getOccurrencesAtPosition(fileName, position));
        };
        TypeScriptWorker.prototype.getDefinitionAtPosition = function (fileName, position) {
            return Promise.as(this._languageService.getDefinitionAtPosition(fileName, position));
        };
        TypeScriptWorker.prototype.getReferencesAtPosition = function (fileName, position) {
            return Promise.as(this._languageService.getReferencesAtPosition(fileName, position));
        };
        TypeScriptWorker.prototype.getNavigationBarItems = function (fileName) {
            return Promise.as(this._languageService.getNavigationBarItems(fileName));
        };
        TypeScriptWorker.prototype.getFormattingEditsForDocument = function (fileName, options) {
            return Promise.as(this._languageService.getFormattingEditsForDocument(fileName, options));
        };
        TypeScriptWorker.prototype.getFormattingEditsForRange = function (fileName, start, end, options) {
            return Promise.as(this._languageService.getFormattingEditsForRange(fileName, start, end, options));
        };
        TypeScriptWorker.prototype.getFormattingEditsAfterKeystroke = function (fileName, postion, ch, options) {
            return Promise.as(this._languageService.getFormattingEditsAfterKeystroke(fileName, postion, ch, options));
        };
        TypeScriptWorker.prototype.getEmitOutput = function (fileName) {
            return Promise.as(this._languageService.getEmitOutput(fileName));
        };
        return TypeScriptWorker;
    }());
    exports.TypeScriptWorker = TypeScriptWorker;
    function create(ctx, createData) {
        return new TypeScriptWorker(ctx, createData);
    }
    exports.create = create;
});
