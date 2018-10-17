/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
var AbstractCodeEditorService = /** @class */ (function (_super) {
    __extends(AbstractCodeEditorService, _super);
    function AbstractCodeEditorService() {
        var _this = _super.call(this) || this;
        _this._onCodeEditorAdd = _this._register(new Emitter());
        _this.onCodeEditorAdd = _this._onCodeEditorAdd.event;
        _this._onCodeEditorRemove = _this._register(new Emitter());
        _this.onCodeEditorRemove = _this._onCodeEditorRemove.event;
        _this._onDiffEditorAdd = _this._register(new Emitter());
        _this.onDiffEditorAdd = _this._onDiffEditorAdd.event;
        _this._onDiffEditorRemove = _this._register(new Emitter());
        _this.onDiffEditorRemove = _this._onDiffEditorRemove.event;
        _this._onDidChangeTransientModelProperty = _this._register(new Emitter());
        _this.onDidChangeTransientModelProperty = _this._onDidChangeTransientModelProperty.event;
        _this._transientWatchers = {};
        _this._codeEditors = Object.create(null);
        _this._diffEditors = Object.create(null);
        return _this;
    }
    AbstractCodeEditorService.prototype.addCodeEditor = function (editor) {
        this._codeEditors[editor.getId()] = editor;
        this._onCodeEditorAdd.fire(editor);
    };
    AbstractCodeEditorService.prototype.removeCodeEditor = function (editor) {
        if (delete this._codeEditors[editor.getId()]) {
            this._onCodeEditorRemove.fire(editor);
        }
    };
    AbstractCodeEditorService.prototype.listCodeEditors = function () {
        var _this = this;
        return Object.keys(this._codeEditors).map(function (id) { return _this._codeEditors[id]; });
    };
    AbstractCodeEditorService.prototype.addDiffEditor = function (editor) {
        this._diffEditors[editor.getId()] = editor;
        this._onDiffEditorAdd.fire(editor);
    };
    AbstractCodeEditorService.prototype.removeDiffEditor = function (editor) {
        if (delete this._diffEditors[editor.getId()]) {
            this._onDiffEditorRemove.fire(editor);
        }
    };
    AbstractCodeEditorService.prototype.listDiffEditors = function () {
        var _this = this;
        return Object.keys(this._diffEditors).map(function (id) { return _this._diffEditors[id]; });
    };
    AbstractCodeEditorService.prototype.getFocusedCodeEditor = function () {
        var editorWithWidgetFocus = null;
        var editors = this.listCodeEditors();
        for (var i = 0; i < editors.length; i++) {
            var editor = editors[i];
            if (editor.hasTextFocus()) {
                // bingo!
                return editor;
            }
            if (editor.hasWidgetFocus()) {
                editorWithWidgetFocus = editor;
            }
        }
        return editorWithWidgetFocus;
    };
    AbstractCodeEditorService.prototype.setTransientModelProperty = function (model, key, value) {
        var uri = model.uri.toString();
        var w;
        if (this._transientWatchers.hasOwnProperty(uri)) {
            w = this._transientWatchers[uri];
        }
        else {
            w = new ModelTransientSettingWatcher(uri, model, this);
            this._transientWatchers[uri] = w;
        }
        w.set(key, value);
        this._onDidChangeTransientModelProperty.fire(model);
    };
    AbstractCodeEditorService.prototype.getTransientModelProperty = function (model, key) {
        var uri = model.uri.toString();
        if (!this._transientWatchers.hasOwnProperty(uri)) {
            return undefined;
        }
        return this._transientWatchers[uri].get(key);
    };
    AbstractCodeEditorService.prototype._removeWatcher = function (w) {
        delete this._transientWatchers[w.uri];
    };
    return AbstractCodeEditorService;
}(Disposable));
export { AbstractCodeEditorService };
var ModelTransientSettingWatcher = /** @class */ (function () {
    function ModelTransientSettingWatcher(uri, model, owner) {
        var _this = this;
        this.uri = uri;
        this._values = {};
        model.onWillDispose(function () { return owner._removeWatcher(_this); });
    }
    ModelTransientSettingWatcher.prototype.set = function (key, value) {
        this._values[key] = value;
    };
    ModelTransientSettingWatcher.prototype.get = function (key) {
        return this._values[key];
    };
    return ModelTransientSettingWatcher;
}());
export { ModelTransientSettingWatcher };
