/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { MainContext } from './extHost.protocol.js';
import { setWordDefinitionFor } from './extHostDocumentData.js';
import * as TypeConverters from './extHostTypeConverters.js';
var ExtHostDocuments = /** @class */ (function () {
    function ExtHostDocuments(mainContext, documentsAndEditors) {
        var _this = this;
        this._onDidAddDocument = new Emitter();
        this._onDidRemoveDocument = new Emitter();
        this._onDidChangeDocument = new Emitter();
        this._onDidSaveDocument = new Emitter();
        this.onDidAddDocument = this._onDidAddDocument.event;
        this.onDidRemoveDocument = this._onDidRemoveDocument.event;
        this.onDidChangeDocument = this._onDidChangeDocument.event;
        this.onDidSaveDocument = this._onDidSaveDocument.event;
        this._documentLoader = new Map();
        this._proxy = mainContext.getProxy(MainContext.MainThreadDocuments);
        this._documentsAndEditors = documentsAndEditors;
        this._toDispose = [
            this._documentsAndEditors.onDidRemoveDocuments(function (documents) {
                for (var _i = 0, documents_1 = documents; _i < documents_1.length; _i++) {
                    var data = documents_1[_i];
                    _this._onDidRemoveDocument.fire(data.document);
                }
            }),
            this._documentsAndEditors.onDidAddDocuments(function (documents) {
                for (var _i = 0, documents_2 = documents; _i < documents_2.length; _i++) {
                    var data = documents_2[_i];
                    _this._onDidAddDocument.fire(data.document);
                }
            })
        ];
    }
    ExtHostDocuments.prototype.dispose = function () {
        dispose(this._toDispose);
    };
    ExtHostDocuments.prototype.getAllDocumentData = function () {
        return this._documentsAndEditors.allDocuments();
    };
    ExtHostDocuments.prototype.getDocumentData = function (resource) {
        if (!resource) {
            return undefined;
        }
        var data = this._documentsAndEditors.getDocument(resource.toString());
        if (data) {
            return data;
        }
        return undefined;
    };
    ExtHostDocuments.prototype.ensureDocumentData = function (uri) {
        var _this = this;
        var cached = this._documentsAndEditors.getDocument(uri.toString());
        if (cached) {
            return Promise.resolve(cached);
        }
        var promise = this._documentLoader.get(uri.toString());
        if (!promise) {
            promise = this._proxy.$tryOpenDocument(uri).then(function () {
                _this._documentLoader.delete(uri.toString());
                return _this._documentsAndEditors.getDocument(uri.toString());
            }, function (err) {
                _this._documentLoader.delete(uri.toString());
                return Promise.reject(err);
            });
            this._documentLoader.set(uri.toString(), promise);
        }
        return promise;
    };
    ExtHostDocuments.prototype.createDocumentData = function (options) {
        return this._proxy.$tryCreateDocument(options).then(function (data) { return URI.revive(data); });
    };
    ExtHostDocuments.prototype.$acceptModelModeChanged = function (uriComponents, oldModeId, newModeId) {
        var uri = URI.revive(uriComponents);
        var strURL = uri.toString();
        var data = this._documentsAndEditors.getDocument(strURL);
        // Treat a mode change as a remove + add
        this._onDidRemoveDocument.fire(data.document);
        data._acceptLanguageId(newModeId);
        this._onDidAddDocument.fire(data.document);
    };
    ExtHostDocuments.prototype.$acceptModelSaved = function (uriComponents) {
        var uri = URI.revive(uriComponents);
        var strURL = uri.toString();
        var data = this._documentsAndEditors.getDocument(strURL);
        this.$acceptDirtyStateChanged(uriComponents, false);
        this._onDidSaveDocument.fire(data.document);
    };
    ExtHostDocuments.prototype.$acceptDirtyStateChanged = function (uriComponents, isDirty) {
        var uri = URI.revive(uriComponents);
        var strURL = uri.toString();
        var data = this._documentsAndEditors.getDocument(strURL);
        data._acceptIsDirty(isDirty);
        this._onDidChangeDocument.fire({
            document: data.document,
            contentChanges: []
        });
    };
    ExtHostDocuments.prototype.$acceptModelChanged = function (uriComponents, events, isDirty) {
        var uri = URI.revive(uriComponents);
        var strURL = uri.toString();
        var data = this._documentsAndEditors.getDocument(strURL);
        data._acceptIsDirty(isDirty);
        data.onEvents(events);
        this._onDidChangeDocument.fire({
            document: data.document,
            contentChanges: events.changes.map(function (change) {
                return {
                    range: TypeConverters.Range.to(change.range),
                    rangeOffset: change.rangeOffset,
                    rangeLength: change.rangeLength,
                    text: change.text
                };
            })
        });
    };
    ExtHostDocuments.prototype.setWordDefinitionFor = function (modeId, wordDefinition) {
        setWordDefinitionFor(modeId, wordDefinition);
    };
    return ExtHostDocuments;
}());
export { ExtHostDocuments };
