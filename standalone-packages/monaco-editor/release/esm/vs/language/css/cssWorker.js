/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var Promise = monaco.Promise;
import * as cssService from './_deps/vscode-css-languageservice/cssLanguageService.js';
import * as ls from './_deps/vscode-languageserver-types/main.js';
var CSSWorker = /** @class */ (function () {
    function CSSWorker(ctx, createData) {
        this._ctx = ctx;
        this._languageSettings = createData.languageSettings;
        this._languageId = createData.languageId;
        switch (this._languageId) {
            case 'css':
                this._languageService = cssService.getCSSLanguageService();
                break;
            case 'less':
                this._languageService = cssService.getLESSLanguageService();
                break;
            case 'scss':
                this._languageService = cssService.getSCSSLanguageService();
                break;
            default:
                throw new Error('Invalid language id: ' + this._languageId);
        }
        this._languageService.configure(this._languageSettings);
    }
    // --- language service host ---------------
    CSSWorker.prototype.doValidation = function (uri) {
        var document = this._getTextDocument(uri);
        if (document) {
            var stylesheet = this._languageService.parseStylesheet(document);
            var diagnostics = this._languageService.doValidation(document, stylesheet);
            return Promise.as(diagnostics);
        }
        return Promise.as([]);
    };
    CSSWorker.prototype.doComplete = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var completions = this._languageService.doComplete(document, position, stylesheet);
        return Promise.as(completions);
    };
    CSSWorker.prototype.doHover = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var hover = this._languageService.doHover(document, position, stylesheet);
        return Promise.as(hover);
    };
    CSSWorker.prototype.findDefinition = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var definition = this._languageService.findDefinition(document, position, stylesheet);
        return Promise.as(definition);
    };
    CSSWorker.prototype.findReferences = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var references = this._languageService.findReferences(document, position, stylesheet);
        return Promise.as(references);
    };
    CSSWorker.prototype.findDocumentHighlights = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var highlights = this._languageService.findDocumentHighlights(document, position, stylesheet);
        return Promise.as(highlights);
    };
    CSSWorker.prototype.findDocumentSymbols = function (uri) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var symbols = this._languageService.findDocumentSymbols(document, stylesheet);
        return Promise.as(symbols);
    };
    CSSWorker.prototype.doCodeActions = function (uri, range, context) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var actions = this._languageService.doCodeActions(document, range, context, stylesheet);
        return Promise.as(actions);
    };
    CSSWorker.prototype.findDocumentColors = function (uri) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var colorSymbols = this._languageService.findDocumentColors(document, stylesheet);
        return Promise.as(colorSymbols);
    };
    CSSWorker.prototype.getColorPresentations = function (uri, color, range) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var colorPresentations = this._languageService.getColorPresentations(document, stylesheet, color, range);
        return Promise.as(colorPresentations);
    };
    CSSWorker.prototype.doRename = function (uri, position, newName) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var renames = this._languageService.doRename(document, position, newName, stylesheet);
        return Promise.as(renames);
    };
    CSSWorker.prototype._getTextDocument = function (uri) {
        var models = this._ctx.getMirrorModels();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            if (model.uri.toString() === uri) {
                return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
            }
        }
        return null;
    };
    return CSSWorker;
}());
export { CSSWorker };
export function create(ctx, createData) {
    return new CSSWorker(ctx, createData);
}
