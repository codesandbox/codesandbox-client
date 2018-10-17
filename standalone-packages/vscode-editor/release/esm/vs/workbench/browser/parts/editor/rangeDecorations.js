/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Emitter } from '../../../../base/common/event.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { CursorChangeReason } from '../../../../editor/common/controller/cursorEvents.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { TrackedRangeStickiness } from '../../../../editor/common/model.js';
var RangeHighlightDecorations = /** @class */ (function (_super) {
    __extends(RangeHighlightDecorations, _super);
    function RangeHighlightDecorations(editorService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        _this.rangeHighlightDecorationId = null;
        _this.editor = null;
        _this.editorDisposables = [];
        _this._onHighlightRemoved = _this._register(new Emitter());
        return _this;
    }
    Object.defineProperty(RangeHighlightDecorations.prototype, "onHighlghtRemoved", {
        get: function () { return this._onHighlightRemoved.event; },
        enumerable: true,
        configurable: true
    });
    RangeHighlightDecorations.prototype.removeHighlightRange = function () {
        if (this.editor && this.editor.getModel() && this.rangeHighlightDecorationId) {
            this.editor.deltaDecorations([this.rangeHighlightDecorationId], []);
            this._onHighlightRemoved.fire();
        }
        this.rangeHighlightDecorationId = null;
    };
    RangeHighlightDecorations.prototype.highlightRange = function (range, editor) {
        editor = editor ? editor : this.getEditor(range);
        if (editor) {
            this.doHighlightRange(editor, range);
        }
    };
    RangeHighlightDecorations.prototype.doHighlightRange = function (editor, selectionRange) {
        var _this = this;
        this.removeHighlightRange();
        editor.changeDecorations(function (changeAccessor) {
            _this.rangeHighlightDecorationId = changeAccessor.addDecoration(selectionRange.range, _this.createRangeHighlightDecoration(selectionRange.isWholeLine));
        });
        this.setEditor(editor);
    };
    RangeHighlightDecorations.prototype.getEditor = function (resourceRange) {
        var activeEditor = this.editorService.activeEditor;
        var resource = activeEditor && activeEditor.getResource();
        if (resource) {
            if (resource.toString() === resourceRange.resource.toString()) {
                return this.editorService.activeTextEditorWidget;
            }
        }
        return null;
    };
    RangeHighlightDecorations.prototype.setEditor = function (editor) {
        var _this = this;
        if (this.editor !== editor) {
            this.disposeEditorListeners();
            this.editor = editor;
            this.editorDisposables.push(this.editor.onDidChangeCursorPosition(function (e) {
                if (e.reason === CursorChangeReason.NotSet
                    || e.reason === CursorChangeReason.Explicit
                    || e.reason === CursorChangeReason.Undo
                    || e.reason === CursorChangeReason.Redo) {
                    _this.removeHighlightRange();
                }
            }));
            this.editorDisposables.push(this.editor.onDidChangeModel(function () { _this.removeHighlightRange(); }));
            this.editorDisposables.push(this.editor.onDidDispose(function () {
                _this.removeHighlightRange();
                _this.editor = null;
            }));
        }
    };
    RangeHighlightDecorations.prototype.disposeEditorListeners = function () {
        this.editorDisposables.forEach(function (disposable) { return disposable.dispose(); });
        this.editorDisposables = [];
    };
    RangeHighlightDecorations.prototype.createRangeHighlightDecoration = function (isWholeLine) {
        if (isWholeLine === void 0) { isWholeLine = true; }
        return (isWholeLine ? RangeHighlightDecorations._WHOLE_LINE_RANGE_HIGHLIGHT : RangeHighlightDecorations._RANGE_HIGHLIGHT);
    };
    RangeHighlightDecorations.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this.editor && this.editor.getModel()) {
            this.removeHighlightRange();
            this.disposeEditorListeners();
            this.editor = null;
        }
    };
    RangeHighlightDecorations._WHOLE_LINE_RANGE_HIGHLIGHT = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'rangeHighlight',
        isWholeLine: true
    });
    RangeHighlightDecorations._RANGE_HIGHLIGHT = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'rangeHighlight'
    });
    RangeHighlightDecorations = __decorate([
        __param(0, IEditorService)
    ], RangeHighlightDecorations);
    return RangeHighlightDecorations;
}(Disposable));
export { RangeHighlightDecorations };
