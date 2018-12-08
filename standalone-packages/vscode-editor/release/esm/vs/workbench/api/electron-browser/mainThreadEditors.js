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
import { localize } from '../../../nls.js';
import { disposed } from '../../../base/common/errors.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { equals as objectEquals } from '../../../base/common/objects.js';
import { URI } from '../../../base/common/uri.js';
import { IBulkEditService } from '../../../editor/browser/services/bulkEditService.js';
import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { ExtHostContext, reviveWorkspaceEditDto } from '../node/extHost.protocol.js';
import { editorGroupToViewColumn, viewColumnToEditorGroup } from '../shared/editor.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../services/group/common/editorGroupsService.js';
var MainThreadTextEditors = /** @class */ (function () {
    function MainThreadTextEditors(documentsAndEditors, extHostContext, _codeEditorService, _bulkEditService, _editorService, _editorGroupService) {
        var _this = this;
        this._codeEditorService = _codeEditorService;
        this._bulkEditService = _bulkEditService;
        this._editorService = _editorService;
        this._editorGroupService = _editorGroupService;
        this._instanceId = String(++MainThreadTextEditors.INSTANCE_COUNT);
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostEditors);
        this._documentsAndEditors = documentsAndEditors;
        this._toDispose = [];
        this._textEditorsListenersMap = Object.create(null);
        this._editorPositionData = null;
        this._toDispose.push(documentsAndEditors.onTextEditorAdd(function (editors) { return editors.forEach(_this._onTextEditorAdd, _this); }));
        this._toDispose.push(documentsAndEditors.onTextEditorRemove(function (editors) { return editors.forEach(_this._onTextEditorRemove, _this); }));
        this._toDispose.push(this._editorService.onDidVisibleEditorsChange(function () { return _this._updateActiveAndVisibleTextEditors(); }));
        this._toDispose.push(this._editorGroupService.onDidRemoveGroup(function () { return _this._updateActiveAndVisibleTextEditors(); }));
        this._toDispose.push(this._editorGroupService.onDidMoveGroup(function () { return _this._updateActiveAndVisibleTextEditors(); }));
        this._registeredDecorationTypes = Object.create(null);
    }
    MainThreadTextEditors.prototype.dispose = function () {
        var _this = this;
        Object.keys(this._textEditorsListenersMap).forEach(function (editorId) {
            dispose(_this._textEditorsListenersMap[editorId]);
        });
        this._textEditorsListenersMap = Object.create(null);
        this._toDispose = dispose(this._toDispose);
        for (var decorationType in this._registeredDecorationTypes) {
            this._codeEditorService.removeDecorationType(decorationType);
        }
        this._registeredDecorationTypes = Object.create(null);
    };
    MainThreadTextEditors.prototype._onTextEditorAdd = function (textEditor) {
        var _this = this;
        var id = textEditor.getId();
        var toDispose = [];
        toDispose.push(textEditor.onPropertiesChanged(function (data) {
            _this._proxy.$acceptEditorPropertiesChanged(id, data);
        }));
        this._textEditorsListenersMap[id] = toDispose;
    };
    MainThreadTextEditors.prototype._onTextEditorRemove = function (id) {
        dispose(this._textEditorsListenersMap[id]);
        delete this._textEditorsListenersMap[id];
    };
    MainThreadTextEditors.prototype._updateActiveAndVisibleTextEditors = function () {
        // editor columns
        var editorPositionData = this._getTextEditorPositionData();
        if (!objectEquals(this._editorPositionData, editorPositionData)) {
            this._editorPositionData = editorPositionData;
            this._proxy.$acceptEditorPositionData(this._editorPositionData);
        }
    };
    MainThreadTextEditors.prototype._getTextEditorPositionData = function () {
        var result = Object.create(null);
        for (var _i = 0, _a = this._editorService.visibleControls; _i < _a.length; _i++) {
            var workbenchEditor = _a[_i];
            var id = this._documentsAndEditors.findTextEditorIdFor(workbenchEditor);
            if (id) {
                result[id] = editorGroupToViewColumn(this._editorGroupService, workbenchEditor.group);
            }
        }
        return result;
    };
    // --- from extension host process
    MainThreadTextEditors.prototype.$tryShowTextDocument = function (resource, options) {
        var _this = this;
        var uri = URI.revive(resource);
        var editorOptions = {
            preserveFocus: options.preserveFocus,
            pinned: options.pinned,
            selection: options.selection
        };
        var input = {
            resource: uri,
            options: editorOptions
        };
        return this._editorService.openEditor(input, viewColumnToEditorGroup(this._editorGroupService, options.position)).then(function (editor) {
            if (!editor) {
                return undefined;
            }
            return _this._documentsAndEditors.findTextEditorIdFor(editor);
        });
    };
    MainThreadTextEditors.prototype.$tryShowEditor = function (id, position) {
        var mainThreadEditor = this._documentsAndEditors.getEditor(id);
        if (mainThreadEditor) {
            var model = mainThreadEditor.getModel();
            return this._editorService.openEditor({
                resource: model.uri,
                options: { preserveFocus: false }
            }, viewColumnToEditorGroup(this._editorGroupService, position)).then(function () { return; });
        }
        return undefined;
    };
    MainThreadTextEditors.prototype.$tryHideEditor = function (id) {
        var mainThreadEditor = this._documentsAndEditors.getEditor(id);
        if (mainThreadEditor) {
            var editors = this._editorService.visibleControls;
            for (var _i = 0, editors_1 = editors; _i < editors_1.length; _i++) {
                var editor = editors_1[_i];
                if (mainThreadEditor.matches(editor)) {
                    return editor.group.closeEditor(editor.input).then(function () { return; });
                }
            }
        }
        return undefined;
    };
    MainThreadTextEditors.prototype.$trySetSelections = function (id, selections) {
        if (!this._documentsAndEditors.getEditor(id)) {
            return Promise.reject(disposed("TextEditor(" + id + ")"));
        }
        this._documentsAndEditors.getEditor(id).setSelections(selections);
        return Promise.resolve(null);
    };
    MainThreadTextEditors.prototype.$trySetDecorations = function (id, key, ranges) {
        key = this._instanceId + "-" + key;
        if (!this._documentsAndEditors.getEditor(id)) {
            return Promise.reject(disposed("TextEditor(" + id + ")"));
        }
        this._documentsAndEditors.getEditor(id).setDecorations(key, ranges);
        return Promise.resolve(null);
    };
    MainThreadTextEditors.prototype.$trySetDecorationsFast = function (id, key, ranges) {
        key = this._instanceId + "-" + key;
        if (!this._documentsAndEditors.getEditor(id)) {
            return Promise.reject(disposed("TextEditor(" + id + ")"));
        }
        this._documentsAndEditors.getEditor(id).setDecorationsFast(key, ranges);
        return Promise.resolve(null);
    };
    MainThreadTextEditors.prototype.$tryRevealRange = function (id, range, revealType) {
        if (!this._documentsAndEditors.getEditor(id)) {
            return Promise.reject(disposed("TextEditor(" + id + ")"));
        }
        this._documentsAndEditors.getEditor(id).revealRange(range, revealType);
        return undefined;
    };
    MainThreadTextEditors.prototype.$trySetOptions = function (id, options) {
        if (!this._documentsAndEditors.getEditor(id)) {
            return Promise.reject(disposed("TextEditor(" + id + ")"));
        }
        this._documentsAndEditors.getEditor(id).setConfiguration(options);
        return Promise.resolve(null);
    };
    MainThreadTextEditors.prototype.$tryApplyEdits = function (id, modelVersionId, edits, opts) {
        if (!this._documentsAndEditors.getEditor(id)) {
            return Promise.reject(disposed("TextEditor(" + id + ")"));
        }
        return Promise.resolve(this._documentsAndEditors.getEditor(id).applyEdits(modelVersionId, edits, opts));
    };
    MainThreadTextEditors.prototype.$tryApplyWorkspaceEdit = function (dto) {
        var edits = reviveWorkspaceEditDto(dto).edits;
        return this._bulkEditService.apply({ edits: edits }, undefined).then(function () { return true; }, function (err) { return false; });
    };
    MainThreadTextEditors.prototype.$tryInsertSnippet = function (id, template, ranges, opts) {
        if (!this._documentsAndEditors.getEditor(id)) {
            return Promise.reject(disposed("TextEditor(" + id + ")"));
        }
        return Promise.resolve(this._documentsAndEditors.getEditor(id).insertSnippet(template, ranges, opts));
    };
    MainThreadTextEditors.prototype.$registerTextEditorDecorationType = function (key, options) {
        key = this._instanceId + "-" + key;
        this._registeredDecorationTypes[key] = true;
        this._codeEditorService.registerDecorationType(key, options);
    };
    MainThreadTextEditors.prototype.$removeTextEditorDecorationType = function (key) {
        key = this._instanceId + "-" + key;
        delete this._registeredDecorationTypes[key];
        this._codeEditorService.removeDecorationType(key);
    };
    MainThreadTextEditors.prototype.$getDiffInformation = function (id) {
        var editor = this._documentsAndEditors.getEditor(id);
        if (!editor) {
            return Promise.reject(new Error('No such TextEditor'));
        }
        var codeEditor = editor.getCodeEditor();
        var codeEditorId = codeEditor.getId();
        var diffEditors = this._codeEditorService.listDiffEditors();
        var diffEditor = diffEditors.filter(function (d) { return d.getOriginalEditor().getId() === codeEditorId || d.getModifiedEditor().getId() === codeEditorId; })[0];
        if (diffEditor) {
            return Promise.resolve(diffEditor.getLineChanges());
        }
        var dirtyDiffContribution = codeEditor.getContribution('editor.contrib.dirtydiff');
        if (dirtyDiffContribution) {
            return Promise.resolve(dirtyDiffContribution.getChanges());
        }
        return Promise.resolve([]);
    };
    MainThreadTextEditors.INSTANCE_COUNT = 0;
    MainThreadTextEditors = __decorate([
        __param(2, ICodeEditorService),
        __param(3, IBulkEditService),
        __param(4, IEditorService),
        __param(5, IEditorGroupsService)
    ], MainThreadTextEditors);
    return MainThreadTextEditors;
}());
export { MainThreadTextEditors };
// --- commands
CommandsRegistry.registerCommand('_workbench.open', function (accessor, args) {
    var editorService = accessor.get(IEditorService);
    var editorGroupService = accessor.get(IEditorGroupsService);
    var openerService = accessor.get(IOpenerService);
    var resource = args[0], options = args[1], position = args[2], label = args[3];
    if (options || typeof position === 'number') {
        // use editor options or editor view column as a hint to use the editor service for opening
        return editorService.openEditor({ resource: resource, options: options, label: label }, viewColumnToEditorGroup(editorGroupService, position)).then(function (_) { return void 0; });
    }
    if (resource && resource.scheme === 'command') {
        // do not allow to execute commands from here
        return Promise.resolve(void 0);
    }
    // finally, delegate to opener service
    return openerService.open(resource).then(function (_) { return void 0; });
});
CommandsRegistry.registerCommand('_workbench.diff', function (accessor, args) {
    var editorService = accessor.get(IEditorService);
    var editorGroupService = accessor.get(IEditorGroupsService);
    var leftResource = args[0], rightResource = args[1], label = args[2], description = args[3], options = args[4], position = args[5];
    if (!options || typeof options !== 'object') {
        options = {
            preserveFocus: false
        };
    }
    if (!label) {
        label = localize('diffLeftRightLabel', "{0} ⟷ {1}", leftResource.toString(true), rightResource.toString(true));
    }
    return editorService.openEditor({ leftResource: leftResource, rightResource: rightResource, label: label, description: description, options: options }, viewColumnToEditorGroup(editorGroupService, position)).then(function () { return void 0; });
});
