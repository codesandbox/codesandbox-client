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
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { Selection } from '../../common/core/selection.js';
import { registerEditorCommand, EditorCommand } from '../../browser/editorExtensions.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { WordOperations } from '../../common/controller/cursorWordOperations.js';
import { ReplaceCommand } from '../../common/commands/replaceCommand.js';
import { getMapForWordSeparators } from '../../common/controller/wordCharacterClassifier.js';
import { CursorState } from '../../common/controller/cursorCommon.js';
import { CursorChangeReason } from '../../common/controller/cursorEvents.js';
var MoveWordCommand = /** @class */ (function (_super) {
    __extends(MoveWordCommand, _super);
    function MoveWordCommand(opts) {
        var _this = _super.call(this, opts) || this;
        _this._inSelectionMode = opts.inSelectionMode;
        _this._wordNavigationType = opts.wordNavigationType;
        return _this;
    }
    MoveWordCommand.prototype.runEditorCommand = function (accessor, editor, args) {
        var _this = this;
        var config = editor.getConfiguration();
        var wordSeparators = getMapForWordSeparators(config.wordSeparators);
        var model = editor.getModel();
        var selections = editor.getSelections();
        var result = selections.map(function (sel) {
            var inPosition = new Position(sel.positionLineNumber, sel.positionColumn);
            var outPosition = _this._move(wordSeparators, model, inPosition, _this._wordNavigationType);
            return _this._moveTo(sel, outPosition, _this._inSelectionMode);
        });
        editor._getCursors().setStates('moveWordCommand', CursorChangeReason.NotSet, result.map(function (r) { return CursorState.fromModelSelection(r); }));
        if (result.length === 1) {
            var pos = new Position(result[0].positionLineNumber, result[0].positionColumn);
            editor.revealPosition(pos, 0 /* Smooth */);
        }
    };
    MoveWordCommand.prototype._moveTo = function (from, to, inSelectionMode) {
        if (inSelectionMode) {
            // move just position
            return new Selection(from.selectionStartLineNumber, from.selectionStartColumn, to.lineNumber, to.column);
        }
        else {
            // move everything
            return new Selection(to.lineNumber, to.column, to.lineNumber, to.column);
        }
    };
    return MoveWordCommand;
}(EditorCommand));
export { MoveWordCommand };
var WordLeftCommand = /** @class */ (function (_super) {
    __extends(WordLeftCommand, _super);
    function WordLeftCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WordLeftCommand.prototype._move = function (wordSeparators, model, position, wordNavigationType) {
        return WordOperations.moveWordLeft(wordSeparators, model, position, wordNavigationType);
    };
    return WordLeftCommand;
}(MoveWordCommand));
export { WordLeftCommand };
var WordRightCommand = /** @class */ (function (_super) {
    __extends(WordRightCommand, _super);
    function WordRightCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WordRightCommand.prototype._move = function (wordSeparators, model, position, wordNavigationType) {
        return WordOperations.moveWordRight(wordSeparators, model, position, wordNavigationType);
    };
    return WordRightCommand;
}(MoveWordCommand));
export { WordRightCommand };
var CursorWordStartLeft = /** @class */ (function (_super) {
    __extends(CursorWordStartLeft, _super);
    function CursorWordStartLeft() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordStartLeft',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 15 /* LeftArrow */,
                mac: { primary: 512 /* Alt */ | 15 /* LeftArrow */ }
            }
        }) || this;
    }
    return CursorWordStartLeft;
}(WordLeftCommand));
export { CursorWordStartLeft };
var CursorWordEndLeft = /** @class */ (function (_super) {
    __extends(CursorWordEndLeft, _super);
    function CursorWordEndLeft() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordEndLeft',
            precondition: null
        }) || this;
    }
    return CursorWordEndLeft;
}(WordLeftCommand));
export { CursorWordEndLeft };
var CursorWordLeft = /** @class */ (function (_super) {
    __extends(CursorWordLeft, _super);
    function CursorWordLeft() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordLeft',
            precondition: null
        }) || this;
    }
    return CursorWordLeft;
}(WordLeftCommand));
export { CursorWordLeft };
var CursorWordStartLeftSelect = /** @class */ (function (_super) {
    __extends(CursorWordStartLeftSelect, _super);
    function CursorWordStartLeftSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordStartLeftSelect',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 15 /* LeftArrow */,
                mac: { primary: 512 /* Alt */ | 1024 /* Shift */ | 15 /* LeftArrow */ }
            }
        }) || this;
    }
    return CursorWordStartLeftSelect;
}(WordLeftCommand));
export { CursorWordStartLeftSelect };
var CursorWordEndLeftSelect = /** @class */ (function (_super) {
    __extends(CursorWordEndLeftSelect, _super);
    function CursorWordEndLeftSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordEndLeftSelect',
            precondition: null
        }) || this;
    }
    return CursorWordEndLeftSelect;
}(WordLeftCommand));
export { CursorWordEndLeftSelect };
var CursorWordLeftSelect = /** @class */ (function (_super) {
    __extends(CursorWordLeftSelect, _super);
    function CursorWordLeftSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordLeftSelect',
            precondition: null
        }) || this;
    }
    return CursorWordLeftSelect;
}(WordLeftCommand));
export { CursorWordLeftSelect };
var CursorWordStartRight = /** @class */ (function (_super) {
    __extends(CursorWordStartRight, _super);
    function CursorWordStartRight() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordStartRight',
            precondition: null
        }) || this;
    }
    return CursorWordStartRight;
}(WordRightCommand));
export { CursorWordStartRight };
var CursorWordEndRight = /** @class */ (function (_super) {
    __extends(CursorWordEndRight, _super);
    function CursorWordEndRight() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordEndRight',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 17 /* RightArrow */,
                mac: { primary: 512 /* Alt */ | 17 /* RightArrow */ }
            }
        }) || this;
    }
    return CursorWordEndRight;
}(WordRightCommand));
export { CursorWordEndRight };
var CursorWordRight = /** @class */ (function (_super) {
    __extends(CursorWordRight, _super);
    function CursorWordRight() {
        return _super.call(this, {
            inSelectionMode: false,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordRight',
            precondition: null
        }) || this;
    }
    return CursorWordRight;
}(WordRightCommand));
export { CursorWordRight };
var CursorWordStartRightSelect = /** @class */ (function (_super) {
    __extends(CursorWordStartRightSelect, _super);
    function CursorWordStartRightSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 0 /* WordStart */,
            id: 'cursorWordStartRightSelect',
            precondition: null
        }) || this;
    }
    return CursorWordStartRightSelect;
}(WordRightCommand));
export { CursorWordStartRightSelect };
var CursorWordEndRightSelect = /** @class */ (function (_super) {
    __extends(CursorWordEndRightSelect, _super);
    function CursorWordEndRightSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordEndRightSelect',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 17 /* RightArrow */,
                mac: { primary: 512 /* Alt */ | 1024 /* Shift */ | 17 /* RightArrow */ }
            }
        }) || this;
    }
    return CursorWordEndRightSelect;
}(WordRightCommand));
export { CursorWordEndRightSelect };
var CursorWordRightSelect = /** @class */ (function (_super) {
    __extends(CursorWordRightSelect, _super);
    function CursorWordRightSelect() {
        return _super.call(this, {
            inSelectionMode: true,
            wordNavigationType: 1 /* WordEnd */,
            id: 'cursorWordRightSelect',
            precondition: null
        }) || this;
    }
    return CursorWordRightSelect;
}(WordRightCommand));
export { CursorWordRightSelect };
var DeleteWordCommand = /** @class */ (function (_super) {
    __extends(DeleteWordCommand, _super);
    function DeleteWordCommand(opts) {
        var _this = _super.call(this, opts) || this;
        _this._whitespaceHeuristics = opts.whitespaceHeuristics;
        _this._wordNavigationType = opts.wordNavigationType;
        return _this;
    }
    DeleteWordCommand.prototype.runEditorCommand = function (accessor, editor, args) {
        var _this = this;
        var config = editor.getConfiguration();
        var wordSeparators = getMapForWordSeparators(config.wordSeparators);
        var model = editor.getModel();
        var selections = editor.getSelections();
        var commands = selections.map(function (sel) {
            var deleteRange = _this._delete(wordSeparators, model, sel, _this._whitespaceHeuristics, _this._wordNavigationType);
            return new ReplaceCommand(deleteRange, '');
        });
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return DeleteWordCommand;
}(EditorCommand));
export { DeleteWordCommand };
var DeleteWordLeftCommand = /** @class */ (function (_super) {
    __extends(DeleteWordLeftCommand, _super);
    function DeleteWordLeftCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteWordLeftCommand.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        var r = WordOperations.deleteWordLeft(wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType);
        if (r) {
            return r;
        }
        return new Range(1, 1, 1, 1);
    };
    return DeleteWordLeftCommand;
}(DeleteWordCommand));
export { DeleteWordLeftCommand };
var DeleteWordRightCommand = /** @class */ (function (_super) {
    __extends(DeleteWordRightCommand, _super);
    function DeleteWordRightCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteWordRightCommand.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        var r = WordOperations.deleteWordRight(wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType);
        if (r) {
            return r;
        }
        var lineCount = model.getLineCount();
        var maxColumn = model.getLineMaxColumn(lineCount);
        return new Range(lineCount, maxColumn, lineCount, maxColumn);
    };
    return DeleteWordRightCommand;
}(DeleteWordCommand));
export { DeleteWordRightCommand };
var DeleteWordStartLeft = /** @class */ (function (_super) {
    __extends(DeleteWordStartLeft, _super);
    function DeleteWordStartLeft() {
        return _super.call(this, {
            whitespaceHeuristics: false,
            wordNavigationType: 0 /* WordStart */,
            id: 'deleteWordStartLeft',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return DeleteWordStartLeft;
}(DeleteWordLeftCommand));
export { DeleteWordStartLeft };
var DeleteWordEndLeft = /** @class */ (function (_super) {
    __extends(DeleteWordEndLeft, _super);
    function DeleteWordEndLeft() {
        return _super.call(this, {
            whitespaceHeuristics: false,
            wordNavigationType: 1 /* WordEnd */,
            id: 'deleteWordEndLeft',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return DeleteWordEndLeft;
}(DeleteWordLeftCommand));
export { DeleteWordEndLeft };
var DeleteWordLeft = /** @class */ (function (_super) {
    __extends(DeleteWordLeft, _super);
    function DeleteWordLeft() {
        return _super.call(this, {
            whitespaceHeuristics: true,
            wordNavigationType: 0 /* WordStart */,
            id: 'deleteWordLeft',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 1 /* Backspace */,
                mac: { primary: 512 /* Alt */ | 1 /* Backspace */ }
            }
        }) || this;
    }
    return DeleteWordLeft;
}(DeleteWordLeftCommand));
export { DeleteWordLeft };
var DeleteWordStartRight = /** @class */ (function (_super) {
    __extends(DeleteWordStartRight, _super);
    function DeleteWordStartRight() {
        return _super.call(this, {
            whitespaceHeuristics: false,
            wordNavigationType: 0 /* WordStart */,
            id: 'deleteWordStartRight',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return DeleteWordStartRight;
}(DeleteWordRightCommand));
export { DeleteWordStartRight };
var DeleteWordEndRight = /** @class */ (function (_super) {
    __extends(DeleteWordEndRight, _super);
    function DeleteWordEndRight() {
        return _super.call(this, {
            whitespaceHeuristics: false,
            wordNavigationType: 1 /* WordEnd */,
            id: 'deleteWordEndRight',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return DeleteWordEndRight;
}(DeleteWordRightCommand));
export { DeleteWordEndRight };
var DeleteWordRight = /** @class */ (function (_super) {
    __extends(DeleteWordRight, _super);
    function DeleteWordRight() {
        return _super.call(this, {
            whitespaceHeuristics: true,
            wordNavigationType: 1 /* WordEnd */,
            id: 'deleteWordRight',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 20 /* Delete */,
                mac: { primary: 512 /* Alt */ | 20 /* Delete */ }
            }
        }) || this;
    }
    return DeleteWordRight;
}(DeleteWordRightCommand));
export { DeleteWordRight };
registerEditorCommand(new CursorWordStartLeft());
registerEditorCommand(new CursorWordEndLeft());
registerEditorCommand(new CursorWordLeft());
registerEditorCommand(new CursorWordStartLeftSelect());
registerEditorCommand(new CursorWordEndLeftSelect());
registerEditorCommand(new CursorWordLeftSelect());
registerEditorCommand(new CursorWordStartRight());
registerEditorCommand(new CursorWordEndRight());
registerEditorCommand(new CursorWordRight());
registerEditorCommand(new CursorWordStartRightSelect());
registerEditorCommand(new CursorWordEndRightSelect());
registerEditorCommand(new CursorWordRightSelect());
registerEditorCommand(new DeleteWordStartLeft());
registerEditorCommand(new DeleteWordEndLeft());
registerEditorCommand(new DeleteWordLeft());
registerEditorCommand(new DeleteWordStartRight());
registerEditorCommand(new DeleteWordEndRight());
registerEditorCommand(new DeleteWordRight());
