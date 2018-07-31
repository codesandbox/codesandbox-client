/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as ts from './lib/typescriptServices.js';
import { contents as libdts } from './lib/lib-ts.js';
import { contents as libes6ts } from './lib/lib-es6-ts.js';
var Promise = monaco.Promise;
var DEFAULT_LIB = {
    NAME: 'defaultLib:lib.d.ts',
    CONTENTS: libdts
};
var ES6_LIB = {
    NAME: 'defaultLib:lib.es6.d.ts',
    CONTENTS: libes6ts
};
var TypeScriptWorker = /** @class */ (function () {
    function TypeScriptWorker(ctx, createData) {
        this._extraLibs = Object.create(null);
        this._languageService = ts.createLanguageService(this);
        this._ctx = ctx;
        this._compilerOptions = createData.compilerOptions;
        this._extraLibs = createData.extraLibs;
    }
    // --- language service host ---------------
    TypeScriptWorker.prototype.getCompilationSettings = function () {
        return this._compilerOptions;
    };
    TypeScriptWorker.prototype.getScriptFileNames = function () {
        var models = this._ctx.getMirrorModels().map(function (model) { return model.uri.toString(); });
        return models.concat(Object.keys(this._extraLibs));
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
        else if (this.isDefaultLibFileName(fileName) || fileName in this._extraLibs) {
            // extra lib and default lib are static
            return '1';
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
        else {
            return;
        }
        return {
            getText: function (start, end) { return text.substring(start, end); },
            getLength: function () { return text.length; },
            getChangeRange: function () { return undefined; }
        };
    };
    TypeScriptWorker.prototype.getScriptKind = function (fileName) {
        var suffix = fileName.substr(fileName.lastIndexOf('.') + 1);
        switch (suffix) {
            case 'ts': return ts.ScriptKind.TS;
            case 'tsx': return ts.ScriptKind.TSX;
            case 'js': return ts.ScriptKind.JS;
            case 'jsx': return ts.ScriptKind.JSX;
            default: return this.getCompilationSettings().allowJs
                ? ts.ScriptKind.JS
                : ts.ScriptKind.TS;
        }
    };
    TypeScriptWorker.prototype.getCurrentDirectory = function () {
        return '';
    };
    TypeScriptWorker.prototype.getDefaultLibFileName = function (options) {
        // TODO@joh support lib.es7.d.ts
        return options.target <= ts.ScriptTarget.ES5 ? DEFAULT_LIB.NAME : ES6_LIB.NAME;
    };
    TypeScriptWorker.prototype.isDefaultLibFileName = function (fileName) {
        return fileName === this.getDefaultLibFileName(this._compilerOptions);
    };
    // --- language features
    TypeScriptWorker.prototype.getSyntacticDiagnostics = function (fileName) {
        var diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
        diagnostics.forEach(function (diag) { return diag.file = undefined; }); // diag.file cannot be JSON'yfied
        return Promise.as(diagnostics);
    };
    TypeScriptWorker.prototype.getSemanticDiagnostics = function (fileName) {
        var diagnostics = this._languageService.getSemanticDiagnostics(fileName);
        diagnostics.forEach(function (diag) { return diag.file = undefined; }); // diag.file cannot be JSON'yfied
        return Promise.as(diagnostics);
    };
    TypeScriptWorker.prototype.getCompilerOptionsDiagnostics = function (fileName) {
        var diagnostics = this._languageService.getCompilerOptionsDiagnostics();
        diagnostics.forEach(function (diag) { return diag.file = undefined; }); // diag.file cannot be JSON'yfied
        return Promise.as(diagnostics);
    };
    TypeScriptWorker.prototype.getCompletionsAtPosition = function (fileName, position) {
        return Promise.as(this._languageService.getCompletionsAtPosition(fileName, position, undefined));
    };
    TypeScriptWorker.prototype.getCompletionEntryDetails = function (fileName, position, entry) {
        return Promise.as(this._languageService.getCompletionEntryDetails(fileName, position, entry, undefined, undefined));
    };
    TypeScriptWorker.prototype.getSignatureHelpItems = function (fileName, position) {
        return Promise.as(this._languageService.getSignatureHelpItems(fileName, position));
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
export { TypeScriptWorker };
export function create(ctx, createData) {
    return new TypeScriptWorker(ctx, createData);
}
