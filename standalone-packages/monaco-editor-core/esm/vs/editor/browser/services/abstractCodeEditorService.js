/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Emitter } from '../../../base/common/event';
var AbstractCodeEditorService = /** @class */ (function () {
    function AbstractCodeEditorService() {
        this._transientWatchers = {};
        this._codeEditors = Object.create(null);
        this._diffEditors = Object.create(null);
        this._onCodeEditorAdd = new Emitter();
        this._onCodeEditorRemove = new Emitter();
        this._onDiffEditorAdd = new Emitter();
        this._onDiffEditorRemove = new Emitter();
    }
    AbstractCodeEditorService.prototype.addCodeEditor = function (editor) {
        this._codeEditors[editor.getId()] = editor;
        this._onCodeEditorAdd.fire(editor);
    };
    Object.defineProperty(AbstractCodeEditorService.prototype, "onCodeEditorAdd", {
        get: function () {
            return this._onCodeEditorAdd.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractCodeEditorService.prototype.removeCodeEditor = function (editor) {
        if (delete this._codeEditors[editor.getId()]) {
            this._onCodeEditorRemove.fire(editor);
        }
    };
    Object.defineProperty(AbstractCodeEditorService.prototype, "onCodeEditorRemove", {
        get: function () {
            return this._onCodeEditorRemove.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractCodeEditorService.prototype.listCodeEditors = function () {
        var _this = this;
        return Object.keys(this._codeEditors).map(function (id) { return _this._codeEditors[id]; });
    };
    AbstractCodeEditorService.prototype.addDiffEditor = function (editor) {
        this._diffEditors[editor.getId()] = editor;
        this._onDiffEditorAdd.fire(editor);
    };
    Object.defineProperty(AbstractCodeEditorService.prototype, "onDiffEditorAdd", {
        get: function () {
            return this._onDiffEditorAdd.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractCodeEditorService.prototype.removeDiffEditor = function (editor) {
        if (delete this._diffEditors[editor.getId()]) {
            this._onDiffEditorRemove.fire(editor);
        }
    };
    Object.defineProperty(AbstractCodeEditorService.prototype, "onDiffEditorRemove", {
        get: function () {
            return this._onDiffEditorRemove.event;
        },
        enumerable: true,
        configurable: true
    });
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
}());
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
