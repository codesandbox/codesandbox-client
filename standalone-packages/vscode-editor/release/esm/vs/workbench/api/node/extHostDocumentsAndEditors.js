/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from '../../../../assert.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { MainContext } from './extHost.protocol.js';
import { ExtHostDocumentData } from './extHostDocumentData.js';
import { ExtHostTextEditor } from './extHostTextEditor.js';
import * as typeConverters from './extHostTypeConverters.js';
var ExtHostDocumentsAndEditors = /** @class */ (function () {
    function ExtHostDocumentsAndEditors(_mainContext) {
        this._mainContext = _mainContext;
        this._disposables = [];
        this._editors = new Map();
        this._documents = new Map();
        this._onDidAddDocuments = new Emitter();
        this._onDidRemoveDocuments = new Emitter();
        this._onDidChangeVisibleTextEditors = new Emitter();
        this._onDidChangeActiveTextEditor = new Emitter();
        this.onDidAddDocuments = this._onDidAddDocuments.event;
        this.onDidRemoveDocuments = this._onDidRemoveDocuments.event;
        this.onDidChangeVisibleTextEditors = this._onDidChangeVisibleTextEditors.event;
        this.onDidChangeActiveTextEditor = this._onDidChangeActiveTextEditor.event;
    }
    ExtHostDocumentsAndEditors.prototype.dispose = function () {
        this._disposables = dispose(this._disposables);
    };
    ExtHostDocumentsAndEditors.prototype.$acceptDocumentsAndEditorsDelta = function (delta) {
        var removedDocuments = [];
        var addedDocuments = [];
        var removedEditors = [];
        if (delta.removedDocuments) {
            for (var _i = 0, _a = delta.removedDocuments; _i < _a.length; _i++) {
                var uriComponent = _a[_i];
                var uri = URI.revive(uriComponent);
                var id = uri.toString();
                var data = this._documents.get(id);
                this._documents.delete(id);
                removedDocuments.push(data);
            }
        }
        if (delta.addedDocuments) {
            for (var _b = 0, _c = delta.addedDocuments; _b < _c.length; _b++) {
                var data = _c[_b];
                var resource = URI.revive(data.uri);
                assert.ok(!this._documents.has(resource.toString()), "document '" + resource + " already exists!'");
                var documentData = new ExtHostDocumentData(this._mainContext.getProxy(MainContext.MainThreadDocuments), resource, data.lines, data.EOL, data.modeId, data.versionId, data.isDirty);
                this._documents.set(resource.toString(), documentData);
                addedDocuments.push(documentData);
            }
        }
        if (delta.removedEditors) {
            for (var _d = 0, _e = delta.removedEditors; _d < _e.length; _d++) {
                var id = _e[_d];
                var editor = this._editors.get(id);
                this._editors.delete(id);
                removedEditors.push(editor);
            }
        }
        if (delta.addedEditors) {
            for (var _f = 0, _g = delta.addedEditors; _f < _g.length; _f++) {
                var data = _g[_f];
                var resource = URI.revive(data.documentUri);
                assert.ok(this._documents.has(resource.toString()), "document '" + resource + "' does not exist");
                assert.ok(!this._editors.has(data.id), "editor '" + data.id + "' already exists!");
                var documentData = this._documents.get(resource.toString());
                var editor = new ExtHostTextEditor(this._mainContext.getProxy(MainContext.MainThreadTextEditors), data.id, documentData, data.selections.map(typeConverters.Selection.to), data.options, data.visibleRanges.map(typeConverters.Range.to), typeConverters.ViewColumn.to(data.editorPosition));
                this._editors.set(data.id, editor);
            }
        }
        if (delta.newActiveEditor !== undefined) {
            assert.ok(delta.newActiveEditor === null || this._editors.has(delta.newActiveEditor), "active editor '" + delta.newActiveEditor + "' does not exist");
            this._activeEditorId = delta.newActiveEditor;
        }
        dispose(removedDocuments);
        dispose(removedEditors);
        // now that the internal state is complete, fire events
        if (delta.removedDocuments) {
            this._onDidRemoveDocuments.fire(removedDocuments);
        }
        if (delta.addedDocuments) {
            this._onDidAddDocuments.fire(addedDocuments);
        }
        if (delta.removedEditors || delta.addedEditors) {
            this._onDidChangeVisibleTextEditors.fire(this.allEditors());
        }
        if (delta.newActiveEditor !== undefined) {
            this._onDidChangeActiveTextEditor.fire(this.activeEditor());
        }
    };
    ExtHostDocumentsAndEditors.prototype.getDocument = function (strUrl) {
        return this._documents.get(strUrl);
    };
    ExtHostDocumentsAndEditors.prototype.allDocuments = function () {
        var result = [];
        this._documents.forEach(function (data) { return result.push(data); });
        return result;
    };
    ExtHostDocumentsAndEditors.prototype.getEditor = function (id) {
        return this._editors.get(id);
    };
    ExtHostDocumentsAndEditors.prototype.activeEditor = function () {
        if (!this._activeEditorId) {
            return undefined;
        }
        else {
            return this._editors.get(this._activeEditorId);
        }
    };
    ExtHostDocumentsAndEditors.prototype.allEditors = function () {
        var result = [];
        this._editors.forEach(function (data) { return result.push(data); });
        return result;
    };
    return ExtHostDocumentsAndEditors;
}());
export { ExtHostDocumentsAndEditors };
