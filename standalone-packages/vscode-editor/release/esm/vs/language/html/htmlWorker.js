/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var Promise = monaco.Promise;
import * as htmlService from './_deps/vscode-html-languageservice/htmlLanguageService.js';
import * as ls from './_deps/vscode-languageserver-types/main.js';
var HTMLWorker = /** @class */ (function () {
    function HTMLWorker(ctx, createData) {
        this._ctx = ctx;
        this._languageSettings = createData.languageSettings;
        this._languageId = createData.languageId;
        this._languageService = htmlService.getLanguageService();
    }
    HTMLWorker.prototype.doValidation = function (uri) {
        // not yet suported
        return Promise.as([]);
    };
    HTMLWorker.prototype.doComplete = function (uri, position) {
        var document = this._getTextDocument(uri);
        var htmlDocument = this._languageService.parseHTMLDocument(document);
        return Promise.as(this._languageService.doComplete(document, position, htmlDocument, this._languageSettings && this._languageSettings.suggest));
    };
    HTMLWorker.prototype.format = function (uri, range, options) {
        var document = this._getTextDocument(uri);
        var textEdits = this._languageService.format(document, range, this._languageSettings && this._languageSettings.format);
        return Promise.as(textEdits);
    };
    HTMLWorker.prototype.findDocumentHighlights = function (uri, position) {
        var document = this._getTextDocument(uri);
        var htmlDocument = this._languageService.parseHTMLDocument(document);
        var highlights = this._languageService.findDocumentHighlights(document, position, htmlDocument);
        return Promise.as(highlights);
    };
    HTMLWorker.prototype.findDocumentLinks = function (uri) {
        var document = this._getTextDocument(uri);
        var links = this._languageService.findDocumentLinks(document, null);
        return Promise.as(links);
    };
    HTMLWorker.prototype.provideFoldingRanges = function (uri, context) {
        var document = this._getTextDocument(uri);
        var ranges = this._languageService.getFoldingRanges(document, context);
        return Promise.as(ranges);
    };
    HTMLWorker.prototype._getTextDocument = function (uri) {
        var models = this._ctx.getMirrorModels();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            if (model.uri.toString() === uri) {
                return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
            }
        }
        return null;
    };
    return HTMLWorker;
}());
export { HTMLWorker };
export function create(ctx, createData) {
    return new HTMLWorker(ctx, createData);
}
