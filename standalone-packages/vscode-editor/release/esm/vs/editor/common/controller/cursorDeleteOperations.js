/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings.js';
import { ReplaceCommand } from '../commands/replaceCommand.js';
import { CursorColumns, EditOperationResult, isQuote } from './cursorCommon.js';
import { MoveOperations } from './cursorMoveOperations.js';
import { Range } from '../core/range.js';
var DeleteOperations = /** @class */ (function () {
    function DeleteOperations() {
    }
    DeleteOperations.deleteRight = function (prevEditOperationType, config, model, selections) {
        var commands = [];
        var shouldPushStackElementBefore = (prevEditOperationType !== 3 /* DeletingRight */);
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            var deleteSelection = selection;
            if (deleteSelection.isEmpty()) {
                var position = selection.getPosition();
                var rightOfPosition = MoveOperations.right(config, model, position.lineNumber, position.column);
                deleteSelection = new Range(rightOfPosition.lineNumber, rightOfPosition.column, position.lineNumber, position.column);
            }
            if (deleteSelection.isEmpty()) {
                // Probably at end of file => ignore
                commands[i] = null;
                continue;
            }
            if (deleteSelection.startLineNumber !== deleteSelection.endLineNumber) {
                shouldPushStackElementBefore = true;
            }
            commands[i] = new ReplaceCommand(deleteSelection, '');
        }
        return [shouldPushStackElementBefore, commands];
    };
    DeleteOperations._isAutoClosingPairDelete = function (config, model, selections) {
        if (config.autoClosingBrackets === 'never' && config.autoClosingQuotes === 'never') {
            return false;
        }
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            var position = selection.getPosition();
            if (!selection.isEmpty()) {
                return false;
            }
            var lineText = model.getLineContent(position.lineNumber);
            var character = lineText[position.column - 2];
            if (!config.autoClosingPairsOpen.hasOwnProperty(character)) {
                return false;
            }
            if (isQuote(character)) {
                if (config.autoClosingQuotes === 'never') {
                    return false;
                }
            }
            else {
                if (config.autoClosingBrackets === 'never') {
                    return false;
                }
            }
            var afterCharacter = lineText[position.column - 1];
            var closeCharacter = config.autoClosingPairsOpen[character];
            if (afterCharacter !== closeCharacter) {
                return false;
            }
        }
        return true;
    };
    DeleteOperations._runAutoClosingPairDelete = function (config, model, selections) {
        var commands = [];
        for (var i = 0, len = selections.length; i < len; i++) {
            var position = selections[i].getPosition();
            var deleteSelection = new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column + 1);
            commands[i] = new ReplaceCommand(deleteSelection, '');
        }
        return [true, commands];
    };
    DeleteOperations.deleteLeft = function (prevEditOperationType, config, model, selections) {
        if (this._isAutoClosingPairDelete(config, model, selections)) {
            return this._runAutoClosingPairDelete(config, model, selections);
        }
        var commands = [];
        var shouldPushStackElementBefore = (prevEditOperationType !== 2 /* DeletingLeft */);
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            var deleteSelection = selection;
            if (deleteSelection.isEmpty()) {
                var position = selection.getPosition();
                if (config.useTabStops && position.column > 1) {
                    var lineContent = model.getLineContent(position.lineNumber);
                    var firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
                    var lastIndentationColumn = (firstNonWhitespaceIndex === -1
                        ? /* entire string is whitespace */ lineContent.length + 1
                        : firstNonWhitespaceIndex + 1);
                    if (position.column <= lastIndentationColumn) {
                        var fromVisibleColumn = CursorColumns.visibleColumnFromColumn2(config, model, position);
                        var toVisibleColumn = CursorColumns.prevTabStop(fromVisibleColumn, config.tabSize);
                        var toColumn = CursorColumns.columnFromVisibleColumn2(config, model, position.lineNumber, toVisibleColumn);
                        deleteSelection = new Range(position.lineNumber, toColumn, position.lineNumber, position.column);
                    }
                    else {
                        deleteSelection = new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column);
                    }
                }
                else {
                    var leftOfPosition = MoveOperations.left(config, model, position.lineNumber, position.column);
                    deleteSelection = new Range(leftOfPosition.lineNumber, leftOfPosition.column, position.lineNumber, position.column);
                }
            }
            if (deleteSelection.isEmpty()) {
                // Probably at beginning of file => ignore
                commands[i] = null;
                continue;
            }
            if (deleteSelection.startLineNumber !== deleteSelection.endLineNumber) {
                shouldPushStackElementBefore = true;
            }
            commands[i] = new ReplaceCommand(deleteSelection, '');
        }
        return [shouldPushStackElementBefore, commands];
    };
    DeleteOperations.cut = function (config, model, selections) {
        var commands = [];
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            if (selection.isEmpty()) {
                if (config.emptySelectionClipboard) {
                    // This is a full line cut
                    var position = selection.getPosition();
                    var startLineNumber = void 0, startColumn = void 0, endLineNumber = void 0, endColumn = void 0;
                    if (position.lineNumber < model.getLineCount()) {
                        // Cutting a line in the middle of the model
                        startLineNumber = position.lineNumber;
                        startColumn = 1;
                        endLineNumber = position.lineNumber + 1;
                        endColumn = 1;
                    }
                    else if (position.lineNumber > 1) {
                        // Cutting the last line & there are more than 1 lines in the model
                        startLineNumber = position.lineNumber - 1;
                        startColumn = model.getLineMaxColumn(position.lineNumber - 1);
                        endLineNumber = position.lineNumber;
                        endColumn = model.getLineMaxColumn(position.lineNumber);
                    }
                    else {
                        // Cutting the single line that the model contains
                        startLineNumber = position.lineNumber;
                        startColumn = 1;
                        endLineNumber = position.lineNumber;
                        endColumn = model.getLineMaxColumn(position.lineNumber);
                    }
                    var deleteSelection = new Range(startLineNumber, startColumn, endLineNumber, endColumn);
                    if (!deleteSelection.isEmpty()) {
                        commands[i] = new ReplaceCommand(deleteSelection, '');
                    }
                    else {
                        commands[i] = null;
                    }
                }
                else {
                    // Cannot cut empty selection
                    commands[i] = null;
                }
            }
            else {
                commands[i] = new ReplaceCommand(selection, '');
            }
        }
        return new EditOperationResult(0 /* Other */, commands, {
            shouldPushStackElementBefore: true,
            shouldPushStackElementAfter: true
        });
    };
    return DeleteOperations;
}());
export { DeleteOperations };
