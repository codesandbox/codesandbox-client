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
import * as nls from '../../../nls.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { SortLinesCommand } from './sortLinesCommand.js';
import { EditOperation } from '../../common/core/editOperation.js';
import { TrimTrailingWhitespaceCommand } from '../../common/commands/trimTrailingWhitespaceCommand.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { ReplaceCommand, ReplaceCommandThatPreservesSelection } from '../../common/commands/replaceCommand.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { Position } from '../../common/core/position.js';
import { registerEditorAction, EditorAction } from '../../browser/editorExtensions.js';
import { CopyLinesCommand } from './copyLinesCommand.js';
import { DeleteLinesCommand } from './deleteLinesCommand.js';
import { MoveLinesCommand } from './moveLinesCommand.js';
import { TypeOperations } from '../../common/controller/cursorTypeOperations.js';
import { CoreEditingCommands } from '../../browser/controller/coreCommands.js';
import { MenuId } from '../../../platform/actions/common/actions.js';
// copy lines
var AbstractCopyLinesAction = /** @class */ (function (_super) {
    __extends(AbstractCopyLinesAction, _super);
    function AbstractCopyLinesAction(down, opts) {
        var _this = _super.call(this, opts) || this;
        _this.down = down;
        return _this;
    }
    AbstractCopyLinesAction.prototype.run = function (_accessor, editor) {
        var commands = [];
        var selections = editor.getSelections();
        for (var i = 0; i < selections.length; i++) {
            commands.push(new CopyLinesCommand(selections[i], this.down));
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return AbstractCopyLinesAction;
}(EditorAction));
var CopyLinesUpAction = /** @class */ (function (_super) {
    __extends(CopyLinesUpAction, _super);
    function CopyLinesUpAction() {
        return _super.call(this, false, {
            id: 'editor.action.copyLinesUpAction',
            label: nls.localize('lines.copyUp', "Copy Line Up"),
            alias: 'Copy Line Up',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 512 /* Alt */ | 1024 /* Shift */ | 16 /* UpArrow */,
                linux: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1024 /* Shift */ | 16 /* UpArrow */ },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '2_line',
                title: nls.localize({ key: 'miCopyLinesUp', comment: ['&& denotes a mnemonic'] }, "&&Copy Line Up"),
                order: 1
            }
        }) || this;
    }
    return CopyLinesUpAction;
}(AbstractCopyLinesAction));
var CopyLinesDownAction = /** @class */ (function (_super) {
    __extends(CopyLinesDownAction, _super);
    function CopyLinesDownAction() {
        return _super.call(this, true, {
            id: 'editor.action.copyLinesDownAction',
            label: nls.localize('lines.copyDown', "Copy Line Down"),
            alias: 'Copy Line Down',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 512 /* Alt */ | 1024 /* Shift */ | 18 /* DownArrow */,
                linux: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1024 /* Shift */ | 18 /* DownArrow */ },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '2_line',
                title: nls.localize({ key: 'miCopyLinesDown', comment: ['&& denotes a mnemonic'] }, "Co&&py Line Down"),
                order: 2
            }
        }) || this;
    }
    return CopyLinesDownAction;
}(AbstractCopyLinesAction));
// move lines
var AbstractMoveLinesAction = /** @class */ (function (_super) {
    __extends(AbstractMoveLinesAction, _super);
    function AbstractMoveLinesAction(down, opts) {
        var _this = _super.call(this, opts) || this;
        _this.down = down;
        return _this;
    }
    AbstractMoveLinesAction.prototype.run = function (_accessor, editor) {
        var commands = [];
        var selections = editor.getSelections();
        var autoIndent = editor.getConfiguration().autoIndent;
        for (var i = 0; i < selections.length; i++) {
            commands.push(new MoveLinesCommand(selections[i], this.down, autoIndent));
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return AbstractMoveLinesAction;
}(EditorAction));
var MoveLinesUpAction = /** @class */ (function (_super) {
    __extends(MoveLinesUpAction, _super);
    function MoveLinesUpAction() {
        return _super.call(this, false, {
            id: 'editor.action.moveLinesUpAction',
            label: nls.localize('lines.moveUp', "Move Line Up"),
            alias: 'Move Line Up',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 512 /* Alt */ | 16 /* UpArrow */,
                linux: { primary: 512 /* Alt */ | 16 /* UpArrow */ },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '2_line',
                title: nls.localize({ key: 'miMoveLinesUp', comment: ['&& denotes a mnemonic'] }, "Mo&&ve Line Up"),
                order: 3
            }
        }) || this;
    }
    return MoveLinesUpAction;
}(AbstractMoveLinesAction));
var MoveLinesDownAction = /** @class */ (function (_super) {
    __extends(MoveLinesDownAction, _super);
    function MoveLinesDownAction() {
        return _super.call(this, true, {
            id: 'editor.action.moveLinesDownAction',
            label: nls.localize('lines.moveDown', "Move Line Down"),
            alias: 'Move Line Down',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 512 /* Alt */ | 18 /* DownArrow */,
                linux: { primary: 512 /* Alt */ | 18 /* DownArrow */ },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '2_line',
                title: nls.localize({ key: 'miMoveLinesDown', comment: ['&& denotes a mnemonic'] }, "Move &&Line Down"),
                order: 4
            }
        }) || this;
    }
    return MoveLinesDownAction;
}(AbstractMoveLinesAction));
var AbstractSortLinesAction = /** @class */ (function (_super) {
    __extends(AbstractSortLinesAction, _super);
    function AbstractSortLinesAction(descending, opts) {
        var _this = _super.call(this, opts) || this;
        _this.descending = descending;
        return _this;
    }
    AbstractSortLinesAction.prototype.run = function (_accessor, editor) {
        var selections = editor.getSelections();
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            if (!SortLinesCommand.canRun(editor.getModel(), selection, this.descending)) {
                return;
            }
        }
        var commands = [];
        for (var i = 0, len = selections.length; i < len; i++) {
            commands[i] = new SortLinesCommand(selections[i], this.descending);
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return AbstractSortLinesAction;
}(EditorAction));
export { AbstractSortLinesAction };
var SortLinesAscendingAction = /** @class */ (function (_super) {
    __extends(SortLinesAscendingAction, _super);
    function SortLinesAscendingAction() {
        return _super.call(this, false, {
            id: 'editor.action.sortLinesAscending',
            label: nls.localize('lines.sortAscending', "Sort Lines Ascending"),
            alias: 'Sort Lines Ascending',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return SortLinesAscendingAction;
}(AbstractSortLinesAction));
export { SortLinesAscendingAction };
var SortLinesDescendingAction = /** @class */ (function (_super) {
    __extends(SortLinesDescendingAction, _super);
    function SortLinesDescendingAction() {
        return _super.call(this, true, {
            id: 'editor.action.sortLinesDescending',
            label: nls.localize('lines.sortDescending', "Sort Lines Descending"),
            alias: 'Sort Lines Descending',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return SortLinesDescendingAction;
}(AbstractSortLinesAction));
export { SortLinesDescendingAction };
var TrimTrailingWhitespaceAction = /** @class */ (function (_super) {
    __extends(TrimTrailingWhitespaceAction, _super);
    function TrimTrailingWhitespaceAction() {
        return _super.call(this, {
            id: TrimTrailingWhitespaceAction.ID,
            label: nls.localize('lines.trimTrailingWhitespace', "Trim Trailing Whitespace"),
            alias: 'Trim Trailing Whitespace',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 54 /* KEY_X */),
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    TrimTrailingWhitespaceAction.prototype.run = function (_accessor, editor, args) {
        var cursors = [];
        if (args.reason === 'auto-save') {
            // See https://github.com/editorconfig/editorconfig-vscode/issues/47
            // It is very convenient for the editor config extension to invoke this action.
            // So, if we get a reason:'auto-save' passed in, let's preserve cursor positions.
            cursors = editor.getSelections().map(function (s) { return new Position(s.positionLineNumber, s.positionColumn); });
        }
        var command = new TrimTrailingWhitespaceCommand(editor.getSelection(), cursors);
        editor.pushUndoStop();
        editor.executeCommands(this.id, [command]);
        editor.pushUndoStop();
    };
    TrimTrailingWhitespaceAction.ID = 'editor.action.trimTrailingWhitespace';
    return TrimTrailingWhitespaceAction;
}(EditorAction));
export { TrimTrailingWhitespaceAction };
var DeleteLinesAction = /** @class */ (function (_super) {
    __extends(DeleteLinesAction, _super);
    function DeleteLinesAction() {
        return _super.call(this, {
            id: 'editor.action.deleteLines',
            label: nls.localize('lines.delete', "Delete Line"),
            alias: 'Delete Line',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 41 /* KEY_K */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DeleteLinesAction.prototype.run = function (_accessor, editor) {
        var ops = this._getLinesToRemove(editor);
        // Finally, construct the delete lines commands
        var commands = ops.map(function (op) {
            return new DeleteLinesCommand(op.startLineNumber, op.endLineNumber, op.positionColumn);
        });
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    DeleteLinesAction.prototype._getLinesToRemove = function (editor) {
        // Construct delete operations
        var operations = editor.getSelections().map(function (s) {
            var endLineNumber = s.endLineNumber;
            if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
                endLineNumber -= 1;
            }
            return {
                startLineNumber: s.startLineNumber,
                endLineNumber: endLineNumber,
                positionColumn: s.positionColumn
            };
        });
        // Sort delete operations
        operations.sort(function (a, b) {
            return a.startLineNumber - b.startLineNumber;
        });
        // Merge delete operations on consecutive lines
        var mergedOperations = [];
        var previousOperation = operations[0];
        for (var i = 1; i < operations.length; i++) {
            if (previousOperation.endLineNumber + 1 === operations[i].startLineNumber) {
                // Merge current operations into the previous one
                previousOperation.endLineNumber = operations[i].endLineNumber;
            }
            else {
                // Push previous operation
                mergedOperations.push(previousOperation);
                previousOperation = operations[i];
            }
        }
        // Push the last operation
        mergedOperations.push(previousOperation);
        return mergedOperations;
    };
    return DeleteLinesAction;
}(EditorAction));
var IndentLinesAction = /** @class */ (function (_super) {
    __extends(IndentLinesAction, _super);
    function IndentLinesAction() {
        return _super.call(this, {
            id: 'editor.action.indentLines',
            label: nls.localize('lines.indent', "Indent Line"),
            alias: 'Indent Line',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 89 /* US_CLOSE_SQUARE_BRACKET */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    IndentLinesAction.prototype.run = function (_accessor, editor) {
        editor.pushUndoStop();
        editor.executeCommands(this.id, TypeOperations.indent(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
        editor.pushUndoStop();
    };
    return IndentLinesAction;
}(EditorAction));
export { IndentLinesAction };
var OutdentLinesAction = /** @class */ (function (_super) {
    __extends(OutdentLinesAction, _super);
    function OutdentLinesAction() {
        return _super.call(this, {
            id: 'editor.action.outdentLines',
            label: nls.localize('lines.outdent', "Outdent Line"),
            alias: 'Outdent Line',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 87 /* US_OPEN_SQUARE_BRACKET */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    OutdentLinesAction.prototype.run = function (_accessor, editor) {
        CoreEditingCommands.Outdent.runEditorCommand(null, editor, null);
    };
    return OutdentLinesAction;
}(EditorAction));
var InsertLineBeforeAction = /** @class */ (function (_super) {
    __extends(InsertLineBeforeAction, _super);
    function InsertLineBeforeAction() {
        return _super.call(this, {
            id: 'editor.action.insertLineBefore',
            label: nls.localize('lines.insertBefore', "Insert Line Above"),
            alias: 'Insert Line Above',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 3 /* Enter */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    InsertLineBeforeAction.prototype.run = function (_accessor, editor) {
        editor.pushUndoStop();
        editor.executeCommands(this.id, TypeOperations.lineInsertBefore(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
    };
    return InsertLineBeforeAction;
}(EditorAction));
export { InsertLineBeforeAction };
var InsertLineAfterAction = /** @class */ (function (_super) {
    __extends(InsertLineAfterAction, _super);
    function InsertLineAfterAction() {
        return _super.call(this, {
            id: 'editor.action.insertLineAfter',
            label: nls.localize('lines.insertAfter', "Insert Line Below"),
            alias: 'Insert Line Below',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    InsertLineAfterAction.prototype.run = function (_accessor, editor) {
        editor.pushUndoStop();
        editor.executeCommands(this.id, TypeOperations.lineInsertAfter(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
    };
    return InsertLineAfterAction;
}(EditorAction));
export { InsertLineAfterAction };
var AbstractDeleteAllToBoundaryAction = /** @class */ (function (_super) {
    __extends(AbstractDeleteAllToBoundaryAction, _super);
    function AbstractDeleteAllToBoundaryAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractDeleteAllToBoundaryAction.prototype.run = function (_accessor, editor) {
        var primaryCursor = editor.getSelection();
        var rangesToDelete = this._getRangesToDelete(editor);
        // merge overlapping selections
        var effectiveRanges = [];
        for (var i = 0, count = rangesToDelete.length - 1; i < count; i++) {
            var range = rangesToDelete[i];
            var nextRange = rangesToDelete[i + 1];
            if (Range.intersectRanges(range, nextRange) === null) {
                effectiveRanges.push(range);
            }
            else {
                rangesToDelete[i + 1] = Range.plusRange(range, nextRange);
            }
        }
        effectiveRanges.push(rangesToDelete[rangesToDelete.length - 1]);
        var endCursorState = this._getEndCursorState(primaryCursor, effectiveRanges);
        var edits = effectiveRanges.map(function (range) {
            return EditOperation.replace(range, '');
        });
        editor.pushUndoStop();
        editor.executeEdits(this.id, edits, endCursorState);
        editor.pushUndoStop();
    };
    return AbstractDeleteAllToBoundaryAction;
}(EditorAction));
export { AbstractDeleteAllToBoundaryAction };
var DeleteAllLeftAction = /** @class */ (function (_super) {
    __extends(DeleteAllLeftAction, _super);
    function DeleteAllLeftAction() {
        return _super.call(this, {
            id: 'deleteAllLeft',
            label: nls.localize('lines.deleteAllLeft', "Delete All Left"),
            alias: 'Delete All Left',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: null,
                mac: { primary: 2048 /* CtrlCmd */ | 1 /* Backspace */ },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DeleteAllLeftAction.prototype._getEndCursorState = function (primaryCursor, rangesToDelete) {
        var endPrimaryCursor;
        var endCursorState = [];
        var deletedLines = 0;
        rangesToDelete.forEach(function (range) {
            var endCursor;
            if (range.endColumn === 1 && deletedLines > 0) {
                var newStartLine = range.startLineNumber - deletedLines;
                endCursor = new Selection(newStartLine, range.startColumn, newStartLine, range.startColumn);
            }
            else {
                endCursor = new Selection(range.startLineNumber, range.startColumn, range.startLineNumber, range.startColumn);
            }
            deletedLines += range.endLineNumber - range.startLineNumber;
            if (range.intersectRanges(primaryCursor)) {
                endPrimaryCursor = endCursor;
            }
            else {
                endCursorState.push(endCursor);
            }
        });
        if (endPrimaryCursor) {
            endCursorState.unshift(endPrimaryCursor);
        }
        return endCursorState;
    };
    DeleteAllLeftAction.prototype._getRangesToDelete = function (editor) {
        var rangesToDelete = editor.getSelections();
        var model = editor.getModel();
        rangesToDelete.sort(Range.compareRangesUsingStarts);
        rangesToDelete = rangesToDelete.map(function (selection) {
            if (selection.isEmpty()) {
                if (selection.startColumn === 1) {
                    var deleteFromLine = Math.max(1, selection.startLineNumber - 1);
                    var deleteFromColumn = selection.startLineNumber === 1 ? 1 : model.getLineContent(deleteFromLine).length + 1;
                    return new Range(deleteFromLine, deleteFromColumn, selection.startLineNumber, 1);
                }
                else {
                    return new Range(selection.startLineNumber, 1, selection.startLineNumber, selection.startColumn);
                }
            }
            else {
                return selection;
            }
        });
        return rangesToDelete;
    };
    return DeleteAllLeftAction;
}(AbstractDeleteAllToBoundaryAction));
export { DeleteAllLeftAction };
var DeleteAllRightAction = /** @class */ (function (_super) {
    __extends(DeleteAllRightAction, _super);
    function DeleteAllRightAction() {
        return _super.call(this, {
            id: 'deleteAllRight',
            label: nls.localize('lines.deleteAllRight', "Delete All Right"),
            alias: 'Delete All Right',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: null,
                mac: { primary: 256 /* WinCtrl */ | 41 /* KEY_K */, secondary: [2048 /* CtrlCmd */ | 20 /* Delete */] },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DeleteAllRightAction.prototype._getEndCursorState = function (primaryCursor, rangesToDelete) {
        var endPrimaryCursor;
        var endCursorState = [];
        for (var i = 0, len = rangesToDelete.length, offset = 0; i < len; i++) {
            var range = rangesToDelete[i];
            var endCursor = new Selection(range.startLineNumber - offset, range.startColumn, range.startLineNumber - offset, range.startColumn);
            if (range.intersectRanges(primaryCursor)) {
                endPrimaryCursor = endCursor;
            }
            else {
                endCursorState.push(endCursor);
            }
        }
        if (endPrimaryCursor) {
            endCursorState.unshift(endPrimaryCursor);
        }
        return endCursorState;
    };
    DeleteAllRightAction.prototype._getRangesToDelete = function (editor) {
        var model = editor.getModel();
        var rangesToDelete = editor.getSelections().map(function (sel) {
            if (sel.isEmpty()) {
                var maxColumn = model.getLineMaxColumn(sel.startLineNumber);
                if (sel.startColumn === maxColumn) {
                    return new Range(sel.startLineNumber, sel.startColumn, sel.startLineNumber + 1, 1);
                }
                else {
                    return new Range(sel.startLineNumber, sel.startColumn, sel.startLineNumber, maxColumn);
                }
            }
            return sel;
        });
        rangesToDelete.sort(Range.compareRangesUsingStarts);
        return rangesToDelete;
    };
    return DeleteAllRightAction;
}(AbstractDeleteAllToBoundaryAction));
export { DeleteAllRightAction };
var JoinLinesAction = /** @class */ (function (_super) {
    __extends(JoinLinesAction, _super);
    function JoinLinesAction() {
        return _super.call(this, {
            id: 'editor.action.joinLines',
            label: nls.localize('lines.joinLines', "Join Lines"),
            alias: 'Join Lines',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 0,
                mac: { primary: 256 /* WinCtrl */ | 40 /* KEY_J */ },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    JoinLinesAction.prototype.run = function (_accessor, editor) {
        var selections = editor.getSelections();
        var primaryCursor = editor.getSelection();
        selections.sort(Range.compareRangesUsingStarts);
        var reducedSelections = [];
        var lastSelection = selections.reduce(function (previousValue, currentValue) {
            if (previousValue.isEmpty()) {
                if (previousValue.endLineNumber === currentValue.startLineNumber) {
                    if (primaryCursor.equalsSelection(previousValue)) {
                        primaryCursor = currentValue;
                    }
                    return currentValue;
                }
                if (currentValue.startLineNumber > previousValue.endLineNumber + 1) {
                    reducedSelections.push(previousValue);
                    return currentValue;
                }
                else {
                    return new Selection(previousValue.startLineNumber, previousValue.startColumn, currentValue.endLineNumber, currentValue.endColumn);
                }
            }
            else {
                if (currentValue.startLineNumber > previousValue.endLineNumber) {
                    reducedSelections.push(previousValue);
                    return currentValue;
                }
                else {
                    return new Selection(previousValue.startLineNumber, previousValue.startColumn, currentValue.endLineNumber, currentValue.endColumn);
                }
            }
        });
        reducedSelections.push(lastSelection);
        var model = editor.getModel();
        var edits = [];
        var endCursorState = [];
        var endPrimaryCursor = primaryCursor;
        var lineOffset = 0;
        for (var i = 0, len = reducedSelections.length; i < len; i++) {
            var selection = reducedSelections[i];
            var startLineNumber = selection.startLineNumber;
            var startColumn = 1;
            var columnDeltaOffset = 0;
            var endLineNumber = void 0, endColumn = void 0;
            var selectionEndPositionOffset = model.getLineContent(selection.endLineNumber).length - selection.endColumn;
            if (selection.isEmpty() || selection.startLineNumber === selection.endLineNumber) {
                var position = selection.getStartPosition();
                if (position.lineNumber < model.getLineCount()) {
                    endLineNumber = startLineNumber + 1;
                    endColumn = model.getLineMaxColumn(endLineNumber);
                }
                else {
                    endLineNumber = position.lineNumber;
                    endColumn = model.getLineMaxColumn(position.lineNumber);
                }
            }
            else {
                endLineNumber = selection.endLineNumber;
                endColumn = model.getLineMaxColumn(endLineNumber);
            }
            var trimmedLinesContent = model.getLineContent(startLineNumber);
            for (var i_1 = startLineNumber + 1; i_1 <= endLineNumber; i_1++) {
                var lineText = model.getLineContent(i_1);
                var firstNonWhitespaceIdx = model.getLineFirstNonWhitespaceColumn(i_1);
                if (firstNonWhitespaceIdx >= 1) {
                    var insertSpace = true;
                    if (trimmedLinesContent === '') {
                        insertSpace = false;
                    }
                    if (insertSpace && (trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === ' ' ||
                        trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === '\t')) {
                        insertSpace = false;
                        trimmedLinesContent = trimmedLinesContent.replace(/[\s\uFEFF\xA0]+$/g, ' ');
                    }
                    var lineTextWithoutIndent = lineText.substr(firstNonWhitespaceIdx - 1);
                    trimmedLinesContent += (insertSpace ? ' ' : '') + lineTextWithoutIndent;
                    if (insertSpace) {
                        columnDeltaOffset = lineTextWithoutIndent.length + 1;
                    }
                    else {
                        columnDeltaOffset = lineTextWithoutIndent.length;
                    }
                }
                else {
                    columnDeltaOffset = 0;
                }
            }
            var deleteSelection = new Range(startLineNumber, startColumn, endLineNumber, endColumn);
            if (!deleteSelection.isEmpty()) {
                var resultSelection = void 0;
                if (selection.isEmpty()) {
                    edits.push(EditOperation.replace(deleteSelection, trimmedLinesContent));
                    resultSelection = new Selection(deleteSelection.startLineNumber - lineOffset, trimmedLinesContent.length - columnDeltaOffset + 1, startLineNumber - lineOffset, trimmedLinesContent.length - columnDeltaOffset + 1);
                }
                else {
                    if (selection.startLineNumber === selection.endLineNumber) {
                        edits.push(EditOperation.replace(deleteSelection, trimmedLinesContent));
                        resultSelection = new Selection(selection.startLineNumber - lineOffset, selection.startColumn, selection.endLineNumber - lineOffset, selection.endColumn);
                    }
                    else {
                        edits.push(EditOperation.replace(deleteSelection, trimmedLinesContent));
                        resultSelection = new Selection(selection.startLineNumber - lineOffset, selection.startColumn, selection.startLineNumber - lineOffset, trimmedLinesContent.length - selectionEndPositionOffset);
                    }
                }
                if (Range.intersectRanges(deleteSelection, primaryCursor) !== null) {
                    endPrimaryCursor = resultSelection;
                }
                else {
                    endCursorState.push(resultSelection);
                }
            }
            lineOffset += deleteSelection.endLineNumber - deleteSelection.startLineNumber;
        }
        endCursorState.unshift(endPrimaryCursor);
        editor.pushUndoStop();
        editor.executeEdits(this.id, edits, endCursorState);
        editor.pushUndoStop();
    };
    return JoinLinesAction;
}(EditorAction));
export { JoinLinesAction };
var TransposeAction = /** @class */ (function (_super) {
    __extends(TransposeAction, _super);
    function TransposeAction() {
        return _super.call(this, {
            id: 'editor.action.transpose',
            label: nls.localize('editor.transpose', "Transpose characters around the cursor"),
            alias: 'Transpose characters around the cursor',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    TransposeAction.prototype.run = function (_accessor, editor) {
        var selections = editor.getSelections();
        var model = editor.getModel();
        var commands = [];
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            if (!selection.isEmpty()) {
                continue;
            }
            var cursor = selection.getStartPosition();
            var maxColumn = model.getLineMaxColumn(cursor.lineNumber);
            if (cursor.column >= maxColumn) {
                if (cursor.lineNumber === model.getLineCount()) {
                    continue;
                }
                // The cursor is at the end of current line and current line is not empty
                // then we transpose the character before the cursor and the line break if there is any following line.
                var deleteSelection = new Range(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber + 1, 1);
                var chars = model.getValueInRange(deleteSelection).split('').reverse().join('');
                commands.push(new ReplaceCommand(new Selection(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber + 1, 1), chars));
            }
            else {
                var deleteSelection = new Range(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber, cursor.column + 1);
                var chars = model.getValueInRange(deleteSelection).split('').reverse().join('');
                commands.push(new ReplaceCommandThatPreservesSelection(deleteSelection, chars, new Selection(cursor.lineNumber, cursor.column + 1, cursor.lineNumber, cursor.column + 1)));
            }
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return TransposeAction;
}(EditorAction));
export { TransposeAction };
var AbstractCaseAction = /** @class */ (function (_super) {
    __extends(AbstractCaseAction, _super);
    function AbstractCaseAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractCaseAction.prototype.run = function (_accessor, editor) {
        var selections = editor.getSelections();
        var model = editor.getModel();
        var commands = [];
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            if (selection.isEmpty()) {
                var cursor = selection.getStartPosition();
                var word = model.getWordAtPosition(cursor);
                if (!word) {
                    continue;
                }
                var wordRange = new Range(cursor.lineNumber, word.startColumn, cursor.lineNumber, word.endColumn);
                var text = model.getValueInRange(wordRange);
                commands.push(new ReplaceCommandThatPreservesSelection(wordRange, this._modifyText(text), new Selection(cursor.lineNumber, cursor.column, cursor.lineNumber, cursor.column)));
            }
            else {
                var text = model.getValueInRange(selection);
                commands.push(new ReplaceCommandThatPreservesSelection(selection, this._modifyText(text), selection));
            }
        }
        editor.pushUndoStop();
        editor.executeCommands(this.id, commands);
        editor.pushUndoStop();
    };
    return AbstractCaseAction;
}(EditorAction));
export { AbstractCaseAction };
var UpperCaseAction = /** @class */ (function (_super) {
    __extends(UpperCaseAction, _super);
    function UpperCaseAction() {
        return _super.call(this, {
            id: 'editor.action.transformToUppercase',
            label: nls.localize('editor.transformToUppercase', "Transform to Uppercase"),
            alias: 'Transform to Uppercase',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    UpperCaseAction.prototype._modifyText = function (text) {
        return text.toLocaleUpperCase();
    };
    return UpperCaseAction;
}(AbstractCaseAction));
export { UpperCaseAction };
var LowerCaseAction = /** @class */ (function (_super) {
    __extends(LowerCaseAction, _super);
    function LowerCaseAction() {
        return _super.call(this, {
            id: 'editor.action.transformToLowercase',
            label: nls.localize('editor.transformToLowercase', "Transform to Lowercase"),
            alias: 'Transform to Lowercase',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    LowerCaseAction.prototype._modifyText = function (text) {
        return text.toLocaleLowerCase();
    };
    return LowerCaseAction;
}(AbstractCaseAction));
export { LowerCaseAction };
registerEditorAction(CopyLinesUpAction);
registerEditorAction(CopyLinesDownAction);
registerEditorAction(MoveLinesUpAction);
registerEditorAction(MoveLinesDownAction);
registerEditorAction(SortLinesAscendingAction);
registerEditorAction(SortLinesDescendingAction);
registerEditorAction(TrimTrailingWhitespaceAction);
registerEditorAction(DeleteLinesAction);
registerEditorAction(IndentLinesAction);
registerEditorAction(OutdentLinesAction);
registerEditorAction(InsertLineBeforeAction);
registerEditorAction(InsertLineAfterAction);
registerEditorAction(DeleteAllLeftAction);
registerEditorAction(DeleteAllRightAction);
registerEditorAction(JoinLinesAction);
registerEditorAction(TransposeAction);
registerEditorAction(UpperCaseAction);
registerEditorAction(LowerCaseAction);
