import '../../editor/editor.api.js';
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var Emitter = monaco.Emitter;
// --- TypeScript configuration and defaults ---------
var LanguageServiceDefaultsImpl = /** @class */ (function () {
    function LanguageServiceDefaultsImpl(compilerOptions, diagnosticsOptions) {
        this._onDidChange = new Emitter();
        this._extraLibs = Object.create(null);
        this._workerMaxIdleTime = 2 * 60 * 1000;
        this.setCompilerOptions(compilerOptions);
        this.setDiagnosticsOptions(diagnosticsOptions);
    }
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    LanguageServiceDefaultsImpl.prototype.getExtraLibs = function () {
        var result = Object.create(null);
        for (var key in this._extraLibs) {
            result[key] = this._extraLibs[key];
        }
        return Object.freeze(result);
    };
    LanguageServiceDefaultsImpl.prototype.addExtraLib = function (content, filePath) {
        var _this = this;
        if (typeof filePath === 'undefined') {
            filePath = "ts:extralib-" + Date.now();
        }
        if (this._extraLibs[filePath]) {
            throw new Error(filePath + " already a extra lib");
        }
        this._extraLibs[filePath] = content;
        this._onDidChange.fire(this);
        return {
            dispose: function () {
                if (delete _this._extraLibs[filePath]) {
                    _this._onDidChange.fire(_this);
                }
            }
        };
    };
    LanguageServiceDefaultsImpl.prototype.getCompilerOptions = function () {
        return this._compilerOptions;
    };
    LanguageServiceDefaultsImpl.prototype.setCompilerOptions = function (options) {
        this._compilerOptions = options || Object.create(null);
        this._onDidChange.fire(this);
    };
    LanguageServiceDefaultsImpl.prototype.getDiagnosticsOptions = function () {
        return this._diagnosticsOptions;
    };
    LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
        this._diagnosticsOptions = options || Object.create(null);
        this._onDidChange.fire(this);
    };
    LanguageServiceDefaultsImpl.prototype.setMaximumWorkerIdleTime = function (value) {
        // doesn't fire an event since no
        // worker restart is required here
        this._workerMaxIdleTime = value;
    };
    LanguageServiceDefaultsImpl.prototype.getWorkerMaxIdleTime = function () {
        return this._workerMaxIdleTime;
    };
    LanguageServiceDefaultsImpl.prototype.setEagerModelSync = function (value) {
        // doesn't fire an event since no
        // worker restart is required here
        this._eagerModelSync = value;
    };
    LanguageServiceDefaultsImpl.prototype.getEagerModelSync = function () {
        return this._eagerModelSync;
    };
    return LanguageServiceDefaultsImpl;
}());
export { LanguageServiceDefaultsImpl };
//#region enums copied from typescript to prevent loading the entire typescriptServices ---
var ModuleKind;
(function (ModuleKind) {
    ModuleKind[ModuleKind["None"] = 0] = "None";
    ModuleKind[ModuleKind["CommonJS"] = 1] = "CommonJS";
    ModuleKind[ModuleKind["AMD"] = 2] = "AMD";
    ModuleKind[ModuleKind["UMD"] = 3] = "UMD";
    ModuleKind[ModuleKind["System"] = 4] = "System";
    ModuleKind[ModuleKind["ES2015"] = 5] = "ES2015";
    ModuleKind[ModuleKind["ESNext"] = 6] = "ESNext";
})(ModuleKind || (ModuleKind = {}));
var JsxEmit;
(function (JsxEmit) {
    JsxEmit[JsxEmit["None"] = 0] = "None";
    JsxEmit[JsxEmit["Preserve"] = 1] = "Preserve";
    JsxEmit[JsxEmit["React"] = 2] = "React";
    JsxEmit[JsxEmit["ReactNative"] = 3] = "ReactNative";
})(JsxEmit || (JsxEmit = {}));
var NewLineKind;
(function (NewLineKind) {
    NewLineKind[NewLineKind["CarriageReturnLineFeed"] = 0] = "CarriageReturnLineFeed";
    NewLineKind[NewLineKind["LineFeed"] = 1] = "LineFeed";
})(NewLineKind || (NewLineKind = {}));
var ScriptTarget;
(function (ScriptTarget) {
    ScriptTarget[ScriptTarget["ES3"] = 0] = "ES3";
    ScriptTarget[ScriptTarget["ES5"] = 1] = "ES5";
    ScriptTarget[ScriptTarget["ES2015"] = 2] = "ES2015";
    ScriptTarget[ScriptTarget["ES2016"] = 3] = "ES2016";
    ScriptTarget[ScriptTarget["ES2017"] = 4] = "ES2017";
    ScriptTarget[ScriptTarget["ES2018"] = 5] = "ES2018";
    ScriptTarget[ScriptTarget["ESNext"] = 6] = "ESNext";
    ScriptTarget[ScriptTarget["JSON"] = 100] = "JSON";
    ScriptTarget[ScriptTarget["Latest"] = 6] = "Latest";
})(ScriptTarget || (ScriptTarget = {}));
var ModuleResolutionKind;
(function (ModuleResolutionKind) {
    ModuleResolutionKind[ModuleResolutionKind["Classic"] = 1] = "Classic";
    ModuleResolutionKind[ModuleResolutionKind["NodeJs"] = 2] = "NodeJs";
})(ModuleResolutionKind || (ModuleResolutionKind = {}));
//#endregion
var typescriptDefaults = new LanguageServiceDefaultsImpl({ allowNonTsExtensions: true, target: ScriptTarget.Latest }, { noSemanticValidation: false, noSyntaxValidation: false });
var javascriptDefaults = new LanguageServiceDefaultsImpl({ allowNonTsExtensions: true, allowJs: true, target: ScriptTarget.Latest }, { noSemanticValidation: true, noSyntaxValidation: false });
function getTypeScriptWorker() {
    return getMode().then(function (mode) { return mode.getTypeScriptWorker(); });
}
function getJavaScriptWorker() {
    return getMode().then(function (mode) { return mode.getJavaScriptWorker(); });
}
// Export API
function createAPI() {
    return {
        ModuleKind: ModuleKind,
        JsxEmit: JsxEmit,
        NewLineKind: NewLineKind,
        ScriptTarget: ScriptTarget,
        ModuleResolutionKind: ModuleResolutionKind,
        typescriptDefaults: typescriptDefaults,
        javascriptDefaults: javascriptDefaults,
        getTypeScriptWorker: getTypeScriptWorker,
        getJavaScriptWorker: getJavaScriptWorker
    };
}
monaco.languages.typescript = createAPI();
// --- Registration to monaco editor ---
function getMode() {
    return monaco.Promise.wrap(import('./tsMode.js'));
}
monaco.languages.onLanguage('typescript', function () {
    return getMode().then(function (mode) { return mode.setupTypeScript(typescriptDefaults); });
});
monaco.languages.onLanguage('javascript', function () {
    return getMode().then(function (mode) { return mode.setupJavaScript(javascriptDefaults); });
});
