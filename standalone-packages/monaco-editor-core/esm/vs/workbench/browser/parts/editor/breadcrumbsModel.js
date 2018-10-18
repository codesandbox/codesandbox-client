/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { equals } from '../../../../base/common/arrays';
import { TimeoutTimer } from '../../../../base/common/async';
import { CancellationTokenSource } from '../../../../base/common/cancellation';
import { size } from '../../../../base/common/collections';
import { onUnexpectedError } from '../../../../base/common/errors';
import { debounceEvent, Emitter } from '../../../../base/common/event';
import { dispose } from '../../../../base/common/lifecycle';
import { isEqual, dirname } from '../../../../base/common/resources';
import { DocumentSymbolProviderRegistry } from '../../../../editor/common/modes';
import { OutlineGroup, OutlineModel, TreeElement } from '../../../../editor/contrib/documentSymbols/outlineModel';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { Schemas } from '../../../../base/common/network';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { BreadcrumbsConfig } from './breadcrumbs';
import { FileKind } from '../../../../platform/files/common/files';
var FileElement = /** @class */ (function () {
    function FileElement(uri, kind) {
        this.uri = uri;
        this.kind = kind;
    }
    return FileElement;
}());
export { FileElement };
var EditorBreadcrumbsModel = /** @class */ (function () {
    function EditorBreadcrumbsModel(_uri, _editor, workspaceService, configurationService) {
        var _this = this;
        this._uri = _uri;
        this._editor = _editor;
        this._disposables = [];
        this._outlineElements = [];
        this._outlineDisposables = [];
        this._onDidUpdate = new Emitter();
        this.onDidUpdate = this._onDidUpdate.event;
        this._cfgFilePath = BreadcrumbsConfig.FilePath.bindTo(configurationService);
        this._cfgSymbolPath = BreadcrumbsConfig.SymbolPath.bindTo(configurationService);
        this._disposables.push(this._cfgFilePath.onDidChange(function (_) { return _this._onDidUpdate.fire(_this); }));
        this._disposables.push(this._cfgSymbolPath.onDidChange(function (_) { return _this._onDidUpdate.fire(_this); }));
        this._fileInfo = EditorBreadcrumbsModel._initFilePathInfo(this._uri, workspaceService);
        this._bindToEditor();
        this._onDidUpdate.fire(this);
    }
    EditorBreadcrumbsModel.prototype.dispose = function () {
        this._cfgFilePath.dispose();
        this._cfgSymbolPath.dispose();
        dispose(this._disposables);
    };
    EditorBreadcrumbsModel.prototype.isRelative = function () {
        return Boolean(this._fileInfo.folder);
    };
    EditorBreadcrumbsModel.prototype.getElements = function () {
        var result = [];
        // file path elements
        if (this._cfgFilePath.getValue() === 'on') {
            result = result.concat(this._fileInfo.path);
        }
        else if (this._cfgFilePath.getValue() === 'last' && this._fileInfo.path.length > 0) {
            result = result.concat(this._fileInfo.path.slice(-1));
        }
        // symbol path elements
        if (this._cfgSymbolPath.getValue() === 'on') {
            result = result.concat(this._outlineElements);
        }
        else if (this._cfgSymbolPath.getValue() === 'last' && this._outlineElements.length > 0) {
            result = result.concat(this._outlineElements.slice(-1));
        }
        return result;
    };
    EditorBreadcrumbsModel._initFilePathInfo = function (uri, workspaceService) {
        if (uri.scheme === Schemas.untitled) {
            return {
                folder: undefined,
                path: []
            };
        }
        var info = {
            folder: workspaceService.getWorkspaceFolder(uri),
            path: []
        };
        while (uri.path !== '/') {
            if (info.folder && isEqual(info.folder.uri, uri)) {
                break;
            }
            info.path.unshift(new FileElement(uri, info.path.length === 0 ? FileKind.FILE : FileKind.FOLDER));
            uri = dirname(uri);
        }
        if (info.folder && workspaceService.getWorkbenchState() === 3 /* WORKSPACE */) {
            info.path.unshift(new FileElement(info.folder.uri, FileKind.ROOT_FOLDER));
        }
        return info;
    };
    EditorBreadcrumbsModel.prototype._bindToEditor = function () {
        var _this = this;
        if (!this._editor) {
            return;
        }
        // update as model changes
        this._disposables.push(DocumentSymbolProviderRegistry.onDidChange(function (_) { return _this._updateOutline(); }));
        this._disposables.push(this._editor.onDidChangeModel(function (_) { return _this._updateOutline(); }));
        this._disposables.push(this._editor.onDidChangeModelLanguage(function (_) { return _this._updateOutline(); }));
        this._disposables.push(debounceEvent(this._editor.onDidChangeModelContent, function (_) { return _; }, 350)(function (_) { return _this._updateOutline(true); }));
        this._updateOutline();
        // stop when editor dies
        this._disposables.push(this._editor.onDidDispose(function () { return _this._outlineDisposables = dispose(_this._outlineDisposables); }));
    };
    EditorBreadcrumbsModel.prototype._updateOutline = function (didChangeContent) {
        var _this = this;
        this._outlineDisposables = dispose(this._outlineDisposables);
        if (!didChangeContent) {
            this._updateOutlineElements([]);
        }
        var buffer = this._editor.getModel();
        if (!buffer || !DocumentSymbolProviderRegistry.has(buffer) || !isEqual(buffer.uri, this._uri)) {
            return;
        }
        var source = new CancellationTokenSource();
        var versionIdThen = buffer.getVersionId();
        var timeout = new TimeoutTimer();
        this._outlineDisposables.push({
            dispose: function () {
                source.cancel();
                source.dispose();
                timeout.dispose();
            }
        });
        OutlineModel.create(buffer, source.token).then(function (model) {
            if (TreeElement.empty(model)) {
                // empty -> no outline elements
                _this._updateOutlineElements([]);
            }
            else {
                // copy the model
                model = model.adopt();
                _this._updateOutlineElements(_this._getOutlineElements(model, _this._editor.getPosition()));
                _this._outlineDisposables.push(_this._editor.onDidChangeCursorPosition(function (_) {
                    timeout.cancelAndSet(function () {
                        if (!buffer.isDisposed() && versionIdThen === buffer.getVersionId() && _this._editor.getModel()) {
                            _this._updateOutlineElements(_this._getOutlineElements(model, _this._editor.getPosition()));
                        }
                    }, 150);
                }));
            }
        }).catch(function (err) {
            _this._updateOutlineElements([]);
            onUnexpectedError(err);
        });
    };
    EditorBreadcrumbsModel.prototype._getOutlineElements = function (model, position) {
        if (!model) {
            return [];
        }
        var item = model.getItemEnclosingPosition(position);
        if (!item) {
            return [model];
        }
        var chain = [];
        while (item) {
            chain.push(item);
            var parent_1 = item.parent;
            if (parent_1 instanceof OutlineModel) {
                break;
            }
            if (parent_1 instanceof OutlineGroup && size(parent_1.parent.children) === 1) {
                break;
            }
            item = parent_1;
        }
        return chain.reverse();
    };
    EditorBreadcrumbsModel.prototype._updateOutlineElements = function (elements) {
        if (!equals(elements, this._outlineElements, EditorBreadcrumbsModel._outlineElementEquals)) {
            this._outlineElements = elements;
            this._onDidUpdate.fire(this);
        }
    };
    EditorBreadcrumbsModel._outlineElementEquals = function (a, b) {
        if (a === b) {
            return true;
        }
        else if (!a || !b) {
            return false;
        }
        else {
            return a.id === b.id;
        }
    };
    EditorBreadcrumbsModel = __decorate([
        __param(2, IWorkspaceContextService),
        __param(3, IConfigurationService)
    ], EditorBreadcrumbsModel);
    return EditorBreadcrumbsModel;
}());
export { EditorBreadcrumbsModel };
