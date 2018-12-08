/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { MainContext } from './extHost.protocol.js';
import { TextEditorDecorationType } from './extHostTextEditor.js';
import * as TypeConverters from './extHostTypeConverters.js';
import { TextEditorSelectionChangeKind } from './extHostTypes.js';
var ExtHostEditors = /** @class */ (function () {
    function ExtHostEditors(mainContext, extHostDocumentsAndEditors) {
        var _this = this;
        this._onDidChangeTextEditorSelection = new Emitter();
        this._onDidChangeTextEditorOptions = new Emitter();
        this._onDidChangeTextEditorVisibleRanges = new Emitter();
        this._onDidChangeTextEditorViewColumn = new Emitter();
        this._onDidChangeActiveTextEditor = new Emitter();
        this._onDidChangeVisibleTextEditors = new Emitter();
        this.onDidChangeTextEditorSelection = this._onDidChangeTextEditorSelection.event;
        this.onDidChangeTextEditorOptions = this._onDidChangeTextEditorOptions.event;
        this.onDidChangeTextEditorVisibleRanges = this._onDidChangeTextEditorVisibleRanges.event;
        this.onDidChangeTextEditorViewColumn = this._onDidChangeTextEditorViewColumn.event;
        this.onDidChangeActiveTextEditor = this._onDidChangeActiveTextEditor.event;
        this.onDidChangeVisibleTextEditors = this._onDidChangeVisibleTextEditors.event;
        this._proxy = mainContext.getProxy(MainContext.MainThreadTextEditors);
        this._extHostDocumentsAndEditors = extHostDocumentsAndEditors;
        this._extHostDocumentsAndEditors.onDidChangeVisibleTextEditors(function (e) { return _this._onDidChangeVisibleTextEditors.fire(e); });
        this._extHostDocumentsAndEditors.onDidChangeActiveTextEditor(function (e) { return _this._onDidChangeActiveTextEditor.fire(e); });
    }
    ExtHostEditors.prototype.getActiveTextEditor = function () {
        return this._extHostDocumentsAndEditors.activeEditor();
    };
    ExtHostEditors.prototype.getVisibleTextEditors = function () {
        return this._extHostDocumentsAndEditors.allEditors();
    };
    ExtHostEditors.prototype.showTextDocument = function (document, columnOrOptions, preserveFocus) {
        var _this = this;
        var options;
        if (typeof columnOrOptions === 'number') {
            options = {
                position: TypeConverters.ViewColumn.from(columnOrOptions),
                preserveFocus: preserveFocus
            };
        }
        else if (typeof columnOrOptions === 'object') {
            options = {
                position: TypeConverters.ViewColumn.from(columnOrOptions.viewColumn),
                preserveFocus: columnOrOptions.preserveFocus,
                selection: typeof columnOrOptions.selection === 'object' ? TypeConverters.Range.from(columnOrOptions.selection) : undefined,
                pinned: typeof columnOrOptions.preview === 'boolean' ? !columnOrOptions.preview : undefined
            };
        }
        else {
            options = {
                preserveFocus: false
            };
        }
        return this._proxy.$tryShowTextDocument(document.uri, options).then(function (id) {
            var editor = _this._extHostDocumentsAndEditors.getEditor(id);
            if (editor) {
                return editor;
            }
            else {
                throw new Error("Failed to show text document " + document.uri.toString() + ", should show in editor #" + id);
            }
        });
    };
    ExtHostEditors.prototype.createTextEditorDecorationType = function (options) {
        return new TextEditorDecorationType(this._proxy, options);
    };
    ExtHostEditors.prototype.applyWorkspaceEdit = function (edit) {
        var dto = TypeConverters.WorkspaceEdit.from(edit, this._extHostDocumentsAndEditors);
        return this._proxy.$tryApplyWorkspaceEdit(dto);
    };
    // --- called from main thread
    ExtHostEditors.prototype.$acceptEditorPropertiesChanged = function (id, data) {
        var textEditor = this._extHostDocumentsAndEditors.getEditor(id);
        // (1) set all properties
        if (data.options) {
            textEditor._acceptOptions(data.options);
        }
        if (data.selections) {
            var selections = data.selections.selections.map(TypeConverters.Selection.to);
            textEditor._acceptSelections(selections);
        }
        if (data.visibleRanges) {
            var visibleRanges = data.visibleRanges.map(TypeConverters.Range.to);
            textEditor._acceptVisibleRanges(visibleRanges);
        }
        // (2) fire change events
        if (data.options) {
            this._onDidChangeTextEditorOptions.fire({
                textEditor: textEditor,
                options: data.options
            });
        }
        if (data.selections) {
            var kind = TextEditorSelectionChangeKind.fromValue(data.selections.source);
            var selections = data.selections.selections.map(TypeConverters.Selection.to);
            this._onDidChangeTextEditorSelection.fire({
                textEditor: textEditor,
                selections: selections,
                kind: kind
            });
        }
        if (data.visibleRanges) {
            var visibleRanges = data.visibleRanges.map(TypeConverters.Range.to);
            this._onDidChangeTextEditorVisibleRanges.fire({
                textEditor: textEditor,
                visibleRanges: visibleRanges
            });
        }
    };
    ExtHostEditors.prototype.$acceptEditorPositionData = function (data) {
        for (var id in data) {
            var textEditor = this._extHostDocumentsAndEditors.getEditor(id);
            var viewColumn = TypeConverters.ViewColumn.to(data[id]);
            if (textEditor.viewColumn !== viewColumn) {
                textEditor._acceptViewColumn(viewColumn);
                this._onDidChangeTextEditorViewColumn.fire({ textEditor: textEditor, viewColumn: viewColumn });
            }
        }
    };
    ExtHostEditors.prototype.getDiffInformation = function (id) {
        return Promise.resolve(this._proxy.$getDiffInformation(id));
    };
    return ExtHostEditors;
}());
export { ExtHostEditors };
