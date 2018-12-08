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
import * as nls from '../../../nls.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
var CursorState = /** @class */ (function () {
    function CursorState(selections) {
        this.selections = selections;
    }
    CursorState.prototype.equals = function (other) {
        var thisLen = this.selections.length;
        var otherLen = other.selections.length;
        if (thisLen !== otherLen) {
            return false;
        }
        for (var i = 0; i < thisLen; i++) {
            if (!this.selections[i].equalsSelection(other.selections[i])) {
                return false;
            }
        }
        return true;
    };
    return CursorState;
}());
var CursorUndoController = /** @class */ (function (_super) {
    __extends(CursorUndoController, _super);
    function CursorUndoController(editor) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._isCursorUndo = false;
        _this._undoStack = [];
        _this._prevState = _this._readState();
        _this._register(editor.onDidChangeModel(function (e) {
            _this._undoStack = [];
            _this._prevState = null;
        }));
        _this._register(editor.onDidChangeModelContent(function (e) {
            _this._undoStack = [];
            _this._prevState = null;
        }));
        _this._register(editor.onDidChangeCursorSelection(function (e) {
            if (!_this._isCursorUndo && _this._prevState) {
                _this._undoStack.push(_this._prevState);
                if (_this._undoStack.length > 50) {
                    // keep the cursor undo stack bounded
                    _this._undoStack.shift();
                }
            }
            _this._prevState = _this._readState();
        }));
        return _this;
    }
    CursorUndoController.get = function (editor) {
        return editor.getContribution(CursorUndoController.ID);
    };
    CursorUndoController.prototype._readState = function () {
        if (!this._editor.hasModel()) {
            // no model => no state
            return null;
        }
        return new CursorState(this._editor.getSelections());
    };
    CursorUndoController.prototype.getId = function () {
        return CursorUndoController.ID;
    };
    CursorUndoController.prototype.cursorUndo = function () {
        if (!this._editor.hasModel()) {
            return;
        }
        var currState = new CursorState(this._editor.getSelections());
        while (this._undoStack.length > 0) {
            var prevState = this._undoStack.pop();
            if (!prevState.equals(currState)) {
                this._isCursorUndo = true;
                this._editor.setSelections(prevState.selections);
                this._editor.revealRangeInCenterIfOutsideViewport(prevState.selections[0], 0 /* Smooth */);
                this._isCursorUndo = false;
                return;
            }
        }
    };
    CursorUndoController.ID = 'editor.contrib.cursorUndoController';
    return CursorUndoController;
}(Disposable));
export { CursorUndoController };
var CursorUndo = /** @class */ (function (_super) {
    __extends(CursorUndo, _super);
    function CursorUndo() {
        return _super.call(this, {
            id: 'cursorUndo',
            label: nls.localize('cursor.undo', "Soft Undo"),
            alias: 'Soft Undo',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 51 /* KEY_U */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    CursorUndo.prototype.run = function (accessor, editor, args) {
        CursorUndoController.get(editor).cursorUndo();
    };
    return CursorUndo;
}(EditorAction));
export { CursorUndo };
registerEditorContribution(CursorUndoController);
registerEditorAction(CursorUndo);
