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
import { registerEditorCommand } from '../../browser/editorExtensions.js';
import { WordPartOperations } from '../../common/controller/cursorWordOperations.js';
import { Range } from '../../common/core/range.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { DeleteWordCommand, MoveWordCommand } from '../wordOperations/wordOperations.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
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
                primary: 0,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 1 /* Backspace */ },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DeleteWordPartLeft.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        var r = WordPartOperations.deleteWordPartLeft(wordSeparators, model, selection, whitespaceHeuristics);
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
            wordNavigationType: 2 /* WordEnd */,
            id: 'deleteWordPartRight',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 0,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 20 /* Delete */ },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DeleteWordPartRight.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        var r = WordPartOperations.deleteWordPartRight(wordSeparators, model, selection, whitespaceHeuristics);
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
        return WordPartOperations.moveWordPartLeft(wordSeparators, model, position);
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
            id: 'cursorWordPartLeft',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 0,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 15 /* LeftArrow */ },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    return CursorWordPartLeft;
}(WordPartLeftCommand));
export { CursorWordPartLeft };
// Register previous id for compatibility purposes
CommandsRegistry.registerCommandAlias('cursorWordPartStartLeft', 'cursorWordPartLeft');
var CursorWordPartLeftSelect = /** @class */ (function (_super) {
    __extends(CursorWordPartLeftSelect, _super);
    function CursorWordPartLeftSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordPartLeftSelect',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 0,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 1024 /* Shift */ | 15 /* LeftArrow */ },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    return CursorWordPartLeftSelect;
}(WordPartLeftCommand));
export { CursorWordPartLeftSelect };
// Register previous id for compatibility purposes
CommandsRegistry.registerCommandAlias('cursorWordPartStartLeftSelect', 'cursorWordPartLeftSelect');
var WordPartRightCommand = /** @class */ (function (_super) {
    __extends(WordPartRightCommand, _super);
    function WordPartRightCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WordPartRightCommand.prototype._move = function (wordSeparators, model, position, wordNavigationType) {
        return WordPartOperations.moveWordPartRight(wordSeparators, model, position);
    };
    return WordPartRightCommand;
}(MoveWordCommand));
export { WordPartRightCommand };
var CursorWordPartRight = /** @class */ (function (_super) {
    __extends(CursorWordPartRight, _super);
    function CursorWordPartRight() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 2 /* WordEnd */,
            id: 'cursorWordPartRight',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 0,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 17 /* RightArrow */ },
                weight: 100 /* EditorContrib */
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
            wordNavigationType: 2 /* WordEnd */,
            id: 'cursorWordPartRightSelect',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 0,
                mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 1024 /* Shift */ | 17 /* RightArrow */ },
                weight: 100 /* EditorContrib */
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
