/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EditorContextKeys } from '../../common/editorContextKeys';
import { registerEditorCommand } from '../../browser/editorExtensions';
import { Range } from '../../common/core/range';
import { WordPartOperations } from '../../common/controller/cursorWordOperations';
import { DeleteWordCommand, MoveWordCommand } from '../wordOperations/wordOperations';
var DeleteWordPartLeft = /** @class */ (function (_super) {
    __extends(DeleteWordPartLeft, _super);
    function DeleteWordPartLeft() {
        return _super.call(this, {
            whitespaceHeuristics: true,
            wordNavigationType: 0 /* WordStart */,
            id: 'deleteWordPartLeft',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1 /* Backspace */,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 1 /* Backspace */ }
            }
        }) || this;
    }
    DeleteWordPartLeft.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        var r = WordPartOperations.deleteWordPartLeft(wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType);
        if (r) {
            return r;
        }
        return new Range(1, 1, 1, 1);
    };
    return DeleteWordPartLeft;
}(DeleteWordCommand));
export { DeleteWordPartLeft };
var DeleteWordPartRight = /** @class */ (function (_super) {
    __extends(DeleteWordPartRight, _super);
    function DeleteWordPartRight() {
        return _super.call(this, {
            whitespaceHeuristics: true,
            wordNavigationType: 1 /* WordEnd */,
            id: 'deleteWordPartRight',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 20 /* Delete */,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 20 /* Delete */ }
            }
        }) || this;
    }
    DeleteWordPartRight.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        var r = WordPartOperations.deleteWordPartRight(wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType);
        if (r) {
            return r;
        }
        var lineCount = model.getLineCount();
        var maxColumn = model.getLineMaxColumn(lineCount);
        return new Range(lineCount, maxColumn, lineCount, maxColumn);
    };
    return DeleteWordPartRight;
}(DeleteWordCommand));
export { DeleteWordPartRight };
var WordPartLeftCommand = /** @class */ (function (_super) {
    __extends(WordPartLeftCommand, _super);
    function WordPartLeftCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WordPartLeftCommand.prototype._move = function (wordSeparators, model, position, wordNavigationType) {
        return WordPartOperations.moveWordPartLeft(wordSeparators, model, position, wordNavigationType);
    };
    return WordPartLeftCommand;
}(MoveWordCommand));
export { WordPartLeftCommand };
var CursorWordPartLeft = /** @class */ (function (_super) {
    __extends(CursorWordPartLeft, _super);
    function CursorWordPartLeft() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordPartStartLeft',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 15 /* LeftArrow */,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 15 /* LeftArrow */ }
            }
        }) || this;
    }
    return CursorWordPartLeft;
}(WordPartLeftCommand));
export { CursorWordPartLeft };
var CursorWordPartLeftSelect = /** @class */ (function (_super) {
    __extends(CursorWordPartLeftSelect, _super);
    function CursorWordPartLeftSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordPartStartLeftSelect',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1024 /* Shift */ | 15 /* LeftArrow */,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 1024 /* Shift */ | 15 /* LeftArrow */ }
            }
        }) || this;
    }
    return CursorWordPartLeftSelect;
}(WordPartLeftCommand));
export { CursorWordPartLeftSelect };
var WordPartRightCommand = /** @class */ (function (_super) {
    __extends(WordPartRightCommand, _super);
    function WordPartRightCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WordPartRightCommand.prototype._move = function (wordSeparators, model, position, wordNavigationType) {
        return WordPartOperations.moveWordPartRight(wordSeparators, model, position, wordNavigationType);
    };
    return WordPartRightCommand;
}(MoveWordCommand));
export { WordPartRightCommand };
var CursorWordPartRight = /** @class */ (function (_super) {
    __extends(CursorWordPartRight, _super);
    function CursorWordPartRight() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordPartRight',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 17 /* RightArrow */,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 17 /* RightArrow */ }
            }
        }) || this;
    }
    return CursorWordPartRight;
}(WordPartRightCommand));
export { CursorWordPartRight };
var CursorWordPartRightSelect = /** @class */ (function (_super) {
    __extends(CursorWordPartRightSelect, _super);
    function CursorWordPartRightSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordPartRightSelect',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1024 /* Shift */ | 17 /* RightArrow */,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 1024 /* Shift */ | 17 /* RightArrow */ }
            }
        }) || this;
    }
    return CursorWordPartRightSelect;
}(WordPartRightCommand));
export { CursorWordPartRightSelect };
registerEditorCommand(new DeleteWordPartLeft());
registerEditorCommand(new DeleteWordPartRight());
registerEditorCommand(new CursorWordPartLeft());
registerEditorCommand(new CursorWordPartLeftSelect());
registerEditorCommand(new CursorWordPartRight());
registerEditorCommand(new CursorWordPartRightSelect());
