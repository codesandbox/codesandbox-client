/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter } from '../../../base/common/event.js';
import { combinedDisposable, dispose } from '../../../base/common/lifecycle.js';
import { values } from '../../../base/common/map.js';
import { isCodeEditor, isDiffEditor } from '../../../editor/browser/editorBrowser.js';
import { IBulkEditService } from '../../../editor/browser/services/bulkEditService.js';
import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService.js';
import { IModeService } from '../../../editor/common/services/modeService.js';
import { IModelService, shouldSynchronizeModel } from '../../../editor/common/services/modelService.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { extHostCustomer } from './extHostCustomers.js';
import { MainThreadDocuments } from './mainThreadDocuments.js';
import { MainThreadTextEditor } from './mainThreadEditor.js';
import { MainThreadTextEditors } from './mainThreadEditors.js';
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
import { editorGroupToViewColumn } from '../shared/editor.js';
import { BaseTextEditor } from '../../browser/parts/editor/textEditor.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../services/group/common/editorGroupsService.js';
import { IPanelService } from '../../services/panel/common/panelService.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';
import { IUntitledEditorService } from '../../services/untitled/common/untitledEditorService.js';
var delta;
(function (delta) {
    function ofSets(before, after) {
        var removed = [];
        var added = [];
        before.forEach(function (element) {
            if (!after.has(element)) {
                removed.push(element);
            }
        });
        after.forEach(function (element) {
            if (!before.has(element)) {
                added.push(element);
            }
        });
        return { removed: removed, added: added };
    }
    delta.ofSets = ofSets;
    function ofMaps(before, after) {
        var removed = [];
        var added = [];
        before.forEach(function (value, index) {
            if (!after.has(index)) {
                removed.push(value);
            }
        });
        after.forEach(function (value, index) {
            if (!before.has(index)) {
                added.push(value);
            }
        });
        return { removed: removed, added: added };
    }
    delta.ofMaps = ofMaps;
})(delta || (delta = {}));
var TextEditorSnapshot = /** @class */ (function () {
    function TextEditorSnapshot(editor) {
        this.editor = editor;
        this.id = editor.getId() + "," + editor.getModel().id;
    }
    return TextEditorSnapshot;
}());
var DocumentAndEditorStateDelta = /** @class */ (function () {
    function DocumentAndEditorStateDelta(removedDocuments, addedDocuments, removedEditors, addedEditors, oldActiveEditor, newActiveEditor) {
        this.removedDocuments = removedDocuments;
        this.addedDocuments = addedDocuments;
        this.removedEditors = removedEditors;
        this.addedEditors = addedEditors;
        this.oldActiveEditor = oldActiveEditor;
        this.newActiveEditor = newActiveEditor;
        this.isEmpty = this.removedDocuments.length === 0
            && this.addedDocuments.length === 0
            && this.removedEditors.length === 0
            && this.addedEditors.length === 0
            && oldActiveEditor === newActiveEditor;
    }
    DocumentAndEditorStateDelta.prototype.toString = function () {
        var ret = 'DocumentAndEditorStateDelta\n';
        ret += "\tRemoved Documents: [" + this.removedDocuments.map(function (d) { return d.uri.toString(true); }).join(', ') + "]\n";
        ret += "\tAdded Documents: [" + this.addedDocuments.map(function (d) { return d.uri.toString(true); }).join(', ') + "]\n";
        ret += "\tRemoved Editors: [" + this.removedEditors.map(function (e) { return e.id; }).join(', ') + "]\n";
        ret += "\tAdded Editors: [" + this.addedEditors.map(function (e) { return e.id; }).join(', ') + "]\n";
        ret += "\tNew Active Editor: " + this.newActiveEditor + "\n";
        return ret;
    };
    return DocumentAndEditorStateDelta;
}());
var DocumentAndEditorState = /** @class */ (function () {
    function DocumentAndEditorState(documents, textEditors, activeEditor) {
        this.documents = documents;
        this.textEditors = textEditors;
        this.activeEditor = activeEditor;
        //
    }
    DocumentAndEditorState.compute = function (before, after) {
        if (!before) {
            return new DocumentAndEditorStateDelta([], values(after.documents), [], values(after.textEditors), undefined, after.activeEditor);
        }
        var documentDelta = delta.ofSets(before.documents, after.documents);
        var editorDelta = delta.ofMaps(before.textEditors, after.textEditors);
        var oldActiveEditor = before.activeEditor !== after.activeEditor ? before.activeEditor : undefined;
        var newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;
        return new DocumentAndEditorStateDelta(documentDelta.removed, documentDelta.added, editorDelta.removed, editorDelta.added, oldActiveEditor, newActiveEditor);
    };
    return DocumentAndEditorState;
}());
var MainThreadDocumentAndEditorStateComputer = /** @class */ (function () {
    function MainThreadDocumentAndEditorStateComputer(_onDidChangeState, _modelService, _codeEditorService, _editorService, _panelService) {
        var _this = this;
        this._onDidChangeState = _onDidChangeState;
        this._modelService = _modelService;
        this._codeEditorService = _codeEditorService;
        this._editorService = _editorService;
        this._panelService = _panelService;
        this._toDispose = [];
        this._toDisposeOnEditorRemove = new Map();
        this._activeEditorOrder = 0 /* Editor */;
        this._modelService.onModelAdded(this._updateStateOnModelAdd, this, this._toDispose);
        this._modelService.onModelRemoved(function (_) { return _this._updateState(); }, this, this._toDispose);
        this._editorService.onDidActiveEditorChange(function (_) { return _this._updateState(); }, this, this._toDispose);
        this._codeEditorService.onCodeEditorAdd(this._onDidAddEditor, this, this._toDispose);
        this._codeEditorService.onCodeEditorRemove(this._onDidRemoveEditor, this, this._toDispose);
        this._codeEditorService.listCodeEditors().forEach(this._onDidAddEditor, this);
        this._panelService.onDidPanelOpen(function (_) { return _this._activeEditorOrder = 1 /* Panel */; }, undefined, this._toDispose);
        this._panelService.onDidPanelClose(function (_) { return _this._activeEditorOrder = 0 /* Editor */; }, undefined, this._toDispose);
        this._editorService.onDidVisibleEditorsChange(function (_) { return _this._activeEditorOrder = 0 /* Editor */; }, undefined, this._toDispose);
        this._updateState();
    }
    MainThreadDocumentAndEditorStateComputer.prototype.dispose = function () {
        this._toDispose = dispose(this._toDispose);
    };
    MainThreadDocumentAndEditorStateComputer.prototype._onDidAddEditor = function (e) {
        var _this = this;
        this._toDisposeOnEditorRemove.set(e.getId(), combinedDisposable([
            e.onDidChangeModel(function () { return _this._updateState(); }),
            e.onDidFocusEditorText(function () { return _this._updateState(); }),
            e.onDidFocusEditorWidget(function () { return _this._updateState(e); })
        ]));
        this._updateState();
    };
    MainThreadDocumentAndEditorStateComputer.prototype._onDidRemoveEditor = function (e) {
        var sub = this._toDisposeOnEditorRemove.get(e.getId());
        if (sub) {
            this._toDisposeOnEditorRemove.delete(e.getId());
            sub.dispose();
            this._updateState();
        }
    };
    MainThreadDocumentAndEditorStateComputer.prototype._updateStateOnModelAdd = function (model) {
        if (!shouldSynchronizeModel(model)) {
            // ignore
            return;
        }
        if (!this._currentState) {
            // too early
            this._updateState();
            return;
        }
        // small (fast) delta
        this._currentState = new DocumentAndEditorState(this._currentState.documents.add(model), this._currentState.textEditors, this._currentState.activeEditor);
        this._onDidChangeState(new DocumentAndEditorStateDelta([], [model], [], [], undefined, undefined));
    };
    MainThreadDocumentAndEditorStateComputer.prototype._updateState = function (widgetFocusCandidate) {
        // models: ignore too large models
        var models = new Set();
        for (var _i = 0, _a = this._modelService.getModels(); _i < _a.length; _i++) {
            var model = _a[_i];
            if (shouldSynchronizeModel(model)) {
                models.add(model);
            }
        }
        // editor: only take those that have a not too large model
        var editors = new Map();
        var activeEditor = null;
        for (var _b = 0, _c = this._codeEditorService.listCodeEditors(); _b < _c.length; _b++) {
            var editor = _c[_b];
            if (editor.isSimpleWidget) {
                continue;
            }
            var model = editor.getModel();
            if (model && shouldSynchronizeModel(model)
                && !model.isDisposed() // model disposed
                && Boolean(this._modelService.getModel(model.uri)) // model disposing, the flag didn't flip yet but the model service already removed it
            ) {
                var apiEditor = new TextEditorSnapshot(editor);
                editors.set(apiEditor.id, apiEditor);
                if (editor.hasTextFocus() || (widgetFocusCandidate === editor && editor.hasWidgetFocus())) {
                    // text focus has priority, widget focus is tricky because multiple
                    // editors might claim widget focus at the same time. therefore we use a
                    // candidate (which is the editor that has raised an widget focus event)
                    // in addition to the widget focus check
                    activeEditor = apiEditor.id;
                }
            }
        }
        // active editor: if none of the previous editors had focus we try
        // to match output panels or the active workbench editor with
        // one of editor we have just computed
        if (!activeEditor) {
            var candidate_1;
            if (this._activeEditorOrder === 0 /* Editor */) {
                candidate_1 = this._getActiveEditorFromEditorPart() || this._getActiveEditorFromPanel();
            }
            else {
                candidate_1 = this._getActiveEditorFromPanel() || this._getActiveEditorFromEditorPart();
            }
            if (candidate_1) {
                editors.forEach(function (snapshot) {
                    if (candidate_1 === snapshot.editor) {
                        activeEditor = snapshot.id;
                    }
                });
            }
        }
        // compute new state and compare against old
        var newState = new DocumentAndEditorState(models, editors, activeEditor);
        var delta = DocumentAndEditorState.compute(this._currentState, newState);
        if (!delta.isEmpty) {
            this._currentState = newState;
            this._onDidChangeState(delta);
        }
    };
    MainThreadDocumentAndEditorStateComputer.prototype._getActiveEditorFromPanel = function () {
        var panel = this._panelService.getActivePanel();
        if (panel instanceof BaseTextEditor && isCodeEditor(panel.getControl())) {
            return panel.getControl();
        }
        else {
            return undefined;
        }
    };
    MainThreadDocumentAndEditorStateComputer.prototype._getActiveEditorFromEditorPart = function () {
        var result = this._editorService.activeTextEditorWidget;
        if (isDiffEditor(result)) {
            result = result.getModifiedEditor();
        }
        return result;
    };
    MainThreadDocumentAndEditorStateComputer = __decorate([
        __param(1, IModelService),
        __param(2, ICodeEditorService),
        __param(3, IEditorService),
        __param(4, IPanelService)
    ], MainThreadDocumentAndEditorStateComputer);
    return MainThreadDocumentAndEditorStateComputer;
}());
var MainThreadDocumentsAndEditors = /** @class */ (function () {
    function MainThreadDocumentsAndEditors(extHostContext, _modelService, _textFileService, _editorService, codeEditorService, modeService, fileService, textModelResolverService, untitledEditorService, _editorGroupService, bulkEditService, panelService) {
        var _this = this;
        this._modelService = _modelService;
        this._textFileService = _textFileService;
        this._editorService = _editorService;
        this._editorGroupService = _editorGroupService;
        this._textEditors = Object.create(null);
        this._onTextEditorAdd = new Emitter();
        this._onTextEditorRemove = new Emitter();
        this._onDocumentAdd = new Emitter();
        this._onDocumentRemove = new Emitter();
        this.onTextEditorAdd = this._onTextEditorAdd.event;
        this.onTextEditorRemove = this._onTextEditorRemove.event;
        this.onDocumentAdd = this._onDocumentAdd.event;
        this.onDocumentRemove = this._onDocumentRemove.event;
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDocumentsAndEditors);
        var mainThreadDocuments = new MainThreadDocuments(this, extHostContext, this._modelService, modeService, this._textFileService, fileService, textModelResolverService, untitledEditorService);
        extHostContext.set(MainContext.MainThreadDocuments, mainThreadDocuments);
        var mainThreadTextEditors = new MainThreadTextEditors(this, extHostContext, codeEditorService, bulkEditService, this._editorService, this._editorGroupService);
        extHostContext.set(MainContext.MainThreadTextEditors, mainThreadTextEditors);
        // It is expected that the ctor of the state computer calls our `_onDelta`.
        this._stateComputer = new MainThreadDocumentAndEditorStateComputer(function (delta) { return _this._onDelta(delta); }, _modelService, codeEditorService, this._editorService, panelService);
        this._toDispose = [
            mainThreadDocuments,
            mainThreadTextEditors,
            this._stateComputer,
            this._onTextEditorAdd,
            this._onTextEditorRemove,
            this._onDocumentAdd,
            this._onDocumentRemove,
        ];
    }
    MainThreadDocumentsAndEditors.prototype.dispose = function () {
        this._toDispose = dispose(this._toDispose);
    };
    MainThreadDocumentsAndEditors.prototype._onDelta = function (delta) {
        var _this = this;
        var removedDocuments;
        var removedEditors = [];
        var addedEditors = [];
        // removed models
        removedDocuments = delta.removedDocuments.map(function (m) { return m.uri; });
        // added editors
        for (var _i = 0, _a = delta.addedEditors; _i < _a.length; _i++) {
            var apiEditor = _a[_i];
            var mainThreadEditor = new MainThreadTextEditor(apiEditor.id, apiEditor.editor.getModel(), apiEditor.editor, { onGainedFocus: function () { }, onLostFocus: function () { } }, this._modelService);
            this._textEditors[apiEditor.id] = mainThreadEditor;
            addedEditors.push(mainThreadEditor);
        }
        // removed editors
        for (var _b = 0, _c = delta.removedEditors; _b < _c.length; _b++) {
            var id = _c[_b].id;
            var mainThreadEditor = this._textEditors[id];
            if (mainThreadEditor) {
                mainThreadEditor.dispose();
                delete this._textEditors[id];
                removedEditors.push(id);
            }
        }
        var extHostDelta = Object.create(null);
        var empty = true;
        if (delta.newActiveEditor !== undefined) {
            empty = false;
            extHostDelta.newActiveEditor = delta.newActiveEditor;
        }
        if (removedDocuments.length > 0) {
            empty = false;
            extHostDelta.removedDocuments = removedDocuments;
        }
        if (removedEditors.length > 0) {
            empty = false;
            extHostDelta.removedEditors = removedEditors;
        }
        if (delta.addedDocuments.length > 0) {
            empty = false;
            extHostDelta.addedDocuments = delta.addedDocuments.map(function (m) { return _this._toModelAddData(m); });
        }
        if (delta.addedEditors.length > 0) {
            empty = false;
            extHostDelta.addedEditors = addedEditors.map(function (e) { return _this._toTextEditorAddData(e); });
        }
        if (!empty) {
            // first update ext host
            this._proxy.$acceptDocumentsAndEditorsDelta(extHostDelta);
            // second update dependent state listener
            this._onDocumentRemove.fire(removedDocuments);
            this._onDocumentAdd.fire(delta.addedDocuments);
            this._onTextEditorRemove.fire(removedEditors);
            this._onTextEditorAdd.fire(addedEditors);
        }
    };
    MainThreadDocumentsAndEditors.prototype._toModelAddData = function (model) {
        return {
            uri: model.uri,
            versionId: model.getVersionId(),
            lines: model.getLinesContent(),
            EOL: model.getEOL(),
            modeId: model.getLanguageIdentifier().language,
            isDirty: this._textFileService.isDirty(model.uri)
        };
    };
    MainThreadDocumentsAndEditors.prototype._toTextEditorAddData = function (textEditor) {
        var props = textEditor.getProperties();
        return {
            id: textEditor.getId(),
            documentUri: textEditor.getModel().uri,
            options: props.options,
            selections: props.selections,
            visibleRanges: props.visibleRanges,
            editorPosition: this._findEditorPosition(textEditor)
        };
    };
    MainThreadDocumentsAndEditors.prototype._findEditorPosition = function (editor) {
        for (var _i = 0, _a = this._editorService.visibleControls; _i < _a.length; _i++) {
            var workbenchEditor = _a[_i];
            if (editor.matches(workbenchEditor)) {
                return editorGroupToViewColumn(this._editorGroupService, workbenchEditor.group);
            }
        }
        return undefined;
    };
    MainThreadDocumentsAndEditors.prototype.findTextEditorIdFor = function (editor) {
        for (var id in this._textEditors) {
            if (this._textEditors[id].matches(editor)) {
                return id;
            }
        }
        return undefined;
    };
    MainThreadDocumentsAndEditors.prototype.getEditor = function (id) {
        return this._textEditors[id];
    };
    MainThreadDocumentsAndEditors = __decorate([
        extHostCustomer,
        __param(1, IModelService),
        __param(2, ITextFileService),
        __param(3, IEditorService),
        __param(4, ICodeEditorService),
        __param(5, IModeService),
        __param(6, IFileService),
        __param(7, ITextModelService),
        __param(8, IUntitledEditorService),
        __param(9, IEditorGroupsService),
        __param(10, IBulkEditService),
        __param(11, IPanelService)
    ], MainThreadDocumentsAndEditors);
    return MainThreadDocumentsAndEditors;
}());
export { MainThreadDocumentsAndEditors };
