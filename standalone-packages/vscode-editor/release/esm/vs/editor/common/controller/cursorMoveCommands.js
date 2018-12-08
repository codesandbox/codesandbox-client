/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as types from '../../../base/common/types.js';
import { CursorState, SingleCursorState } from './cursorCommon.js';
import { MoveOperations } from './cursorMoveOperations.js';
import { WordOperations } from './cursorWordOperations.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
var CursorMoveCommands = /** @class */ (function () {
    function CursorMoveCommands() {
    }
    CursorMoveCommands.addCursorDown = function (context, cursors, useLogicalLine) {
        var result = [], resultLen = 0;
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[resultLen++] = new CursorState(cursor.modelState, cursor.viewState);
            if (useLogicalLine) {
                result[resultLen++] = CursorState.fromModelState(MoveOperations.translateDown(context.config, context.model, cursor.modelState));
            }
            else {
                result[resultLen++] = CursorState.fromViewState(MoveOperations.translateDown(context.config, context.viewModel, cursor.viewState));
            }
        }
        return result;
    };
    CursorMoveCommands.addCursorUp = function (context, cursors, useLogicalLine) {
        var result = [], resultLen = 0;
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[resultLen++] = new CursorState(cursor.modelState, cursor.viewState);
            if (useLogicalLine) {
                result[resultLen++] = CursorState.fromModelState(MoveOperations.translateUp(context.config, context.model, cursor.modelState));
            }
            else {
                result[resultLen++] = CursorState.fromViewState(MoveOperations.translateUp(context.config, context.viewModel, cursor.viewState));
            }
        }
        return result;
    };
    CursorMoveCommands.moveToBeginningOfLine = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = this._moveToLineStart(context, cursor, inSelectionMode);
        }
        return result;
    };
    CursorMoveCommands._moveToLineStart = function (context, cursor, inSelectionMode) {
        var currentViewStateColumn = cursor.viewState.position.column;
        var currentModelStateColumn = cursor.modelState.position.column;
        var isFirstLineOfWrappedLine = currentViewStateColumn === currentModelStateColumn;
        var currentViewStatelineNumber = cursor.viewState.position.lineNumber;
        var firstNonBlankColumn = context.viewModel.getLineFirstNonWhitespaceColumn(currentViewStatelineNumber);
        var isBeginningOfViewLine = currentViewStateColumn === firstNonBlankColumn;
        if (!isFirstLineOfWrappedLine && !isBeginningOfViewLine) {
            return this._moveToLineStartByView(context, cursor, inSelectionMode);
        }
        else {
            return this._moveToLineStartByModel(context, cursor, inSelectionMode);
        }
    };
    CursorMoveCommands._moveToLineStartByView = function (context, cursor, inSelectionMode) {
        return CursorState.fromViewState(MoveOperations.moveToBeginningOfLine(context.config, context.viewModel, cursor.viewState, inSelectionMode));
    };
    CursorMoveCommands._moveToLineStartByModel = function (context, cursor, inSelectionMode) {
        return CursorState.fromModelState(MoveOperations.moveToBeginningOfLine(context.config, context.model, cursor.modelState, inSelectionMode));
    };
    CursorMoveCommands.moveToEndOfLine = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = this._moveToLineEnd(context, cursor, inSelectionMode);
        }
        return result;
    };
    CursorMoveCommands._moveToLineEnd = function (context, cursor, inSelectionMode) {
        var viewStatePosition = cursor.viewState.position;
        var viewModelMaxColumn = context.viewModel.getLineMaxColumn(viewStatePosition.lineNumber);
        var isEndOfViewLine = viewStatePosition.column === viewModelMaxColumn;
        var modelStatePosition = cursor.modelState.position;
        var modelMaxColumn = context.model.getLineMaxColumn(modelStatePosition.lineNumber);
        var isEndLineOfWrappedLine = viewModelMaxColumn - viewStatePosition.column === modelMaxColumn - modelStatePosition.column;
        if (isEndOfViewLine || isEndLineOfWrappedLine) {
            return this._moveToLineEndByModel(context, cursor, inSelectionMode);
        }
        else {
            return this._moveToLineEndByView(context, cursor, inSelectionMode);
        }
    };
    CursorMoveCommands._moveToLineEndByView = function (context, cursor, inSelectionMode) {
        return CursorState.fromViewState(MoveOperations.moveToEndOfLine(context.config, context.viewModel, cursor.viewState, inSelectionMode));
    };
    CursorMoveCommands._moveToLineEndByModel = function (context, cursor, inSelectionMode) {
        return CursorState.fromModelState(MoveOperations.moveToEndOfLine(context.config, context.model, cursor.modelState, inSelectionMode));
    };
    CursorMoveCommands.expandLineSelection = function (context, cursors) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewSelection = cursor.viewState.selection;
            var startLineNumber = viewSelection.startLineNumber;
            var lineCount = context.viewModel.getLineCount();
            var endLineNumber = viewSelection.endLineNumber;
            var endColumn = void 0;
            if (endLineNumber === lineCount) {
                endColumn = context.viewModel.getLineMaxColumn(lineCount);
            }
            else {
                endLineNumber++;
                endColumn = 1;
            }
            result[i] = CursorState.fromViewState(new SingleCursorState(new Range(startLineNumber, 1, startLineNumber, 1), 0, new Position(endLineNumber, endColumn), 0));
        }
        return result;
    };
    CursorMoveCommands.moveToBeginningOfBuffer = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = CursorState.fromModelState(MoveOperations.moveToBeginningOfBuffer(context.config, context.model, cursor.modelState, inSelectionMode));
        }
        return result;
    };
    CursorMoveCommands.moveToEndOfBuffer = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = CursorState.fromModelState(MoveOperations.moveToEndOfBuffer(context.config, context.model, cursor.modelState, inSelectionMode));
        }
        return result;
    };
    CursorMoveCommands.selectAll = function (context, cursor) {
        var lineCount = context.model.getLineCount();
        var maxColumn = context.model.getLineMaxColumn(lineCount);
        return CursorState.fromModelState(new SingleCursorState(new Range(1, 1, 1, 1), 0, new Position(lineCount, maxColumn), 0));
    };
    CursorMoveCommands.line = function (context, cursor, inSelectionMode, _position, _viewPosition) {
        var position = context.model.validatePosition(_position);
        var viewPosition = (_viewPosition
            ? context.validateViewPosition(new Position(_viewPosition.lineNumber, _viewPosition.column), position)
            : context.convertModelPositionToViewPosition(position));
        if (!inSelectionMode || !cursor.modelState.hasSelection()) {
            // Entering line selection for the first time
            var lineCount = context.model.getLineCount();
            var selectToLineNumber = position.lineNumber + 1;
            var selectToColumn = 1;
            if (selectToLineNumber > lineCount) {
                selectToLineNumber = lineCount;
                selectToColumn = context.model.getLineMaxColumn(selectToLineNumber);
            }
            return CursorState.fromModelState(new SingleCursorState(new Range(position.lineNumber, 1, selectToLineNumber, selectToColumn), 0, new Position(selectToLineNumber, selectToColumn), 0));
        }
        // Continuing line selection
        var enteringLineNumber = cursor.modelState.selectionStart.getStartPosition().lineNumber;
        if (position.lineNumber < enteringLineNumber) {
            return CursorState.fromViewState(cursor.viewState.move(cursor.modelState.hasSelection(), viewPosition.lineNumber, 1, 0));
        }
        else if (position.lineNumber > enteringLineNumber) {
            var lineCount = context.viewModel.getLineCount();
            var selectToViewLineNumber = viewPosition.lineNumber + 1;
            var selectToViewColumn = 1;
            if (selectToViewLineNumber > lineCount) {
                selectToViewLineNumber = lineCount;
                selectToViewColumn = context.viewModel.getLineMaxColumn(selectToViewLineNumber);
            }
            return CursorState.fromViewState(cursor.viewState.move(cursor.modelState.hasSelection(), selectToViewLineNumber, selectToViewColumn, 0));
        }
        else {
            var endPositionOfSelectionStart = cursor.modelState.selectionStart.getEndPosition();
            return CursorState.fromModelState(cursor.modelState.move(cursor.modelState.hasSelection(), endPositionOfSelectionStart.lineNumber, endPositionOfSelectionStart.column, 0));
        }
    };
    CursorMoveCommands.word = function (context, cursor, inSelectionMode, _position) {
        var position = context.model.validatePosition(_position);
        return CursorState.fromModelState(WordOperations.word(context.config, context.model, cursor.modelState, inSelectionMode, position));
    };
    CursorMoveCommands.cancelSelection = function (context, cursor) {
        if (!cursor.modelState.hasSelection()) {
            return new CursorState(cursor.modelState, cursor.viewState);
        }
        var lineNumber = cursor.viewState.position.lineNumber;
        var column = cursor.viewState.position.column;
        return CursorState.fromViewState(new SingleCursorState(new Range(lineNumber, column, lineNumber, column), 0, new Position(lineNumber, column), 0));
    };
    CursorMoveCommands.moveTo = function (context, cursor, inSelectionMode, _position, _viewPosition) {
        var position = context.model.validatePosition(_position);
        var viewPosition = (_viewPosition
            ? context.validateViewPosition(new Position(_viewPosition.lineNumber, _viewPosition.column), position)
            : context.convertModelPositionToViewPosition(position));
        return CursorState.fromViewState(cursor.viewState.move(inSelectionMode, viewPosition.lineNumber, viewPosition.column, 0));
    };
    CursorMoveCommands.move = function (context, cursors, args) {
        var inSelectionMode = args.select;
        var value = args.value;
        switch (args.direction) {
            case 0 /* Left */: {
                if (args.unit === 4 /* HalfLine */) {
                    // Move left by half the current line length
                    return this._moveHalfLineLeft(context, cursors, inSelectionMode);
                }
                else {
                    // Move left by `moveParams.value` columns
                    return this._moveLeft(context, cursors, inSelectionMode, value);
                }
            }
            case 1 /* Right */: {
                if (args.unit === 4 /* HalfLine */) {
                    // Move right by half the current line length
                    return this._moveHalfLineRight(context, cursors, inSelectionMode);
                }
                else {
                    // Move right by `moveParams.value` columns
                    return this._moveRight(context, cursors, inSelectionMode, value);
                }
            }
            case 2 /* Up */: {
                if (args.unit === 2 /* WrappedLine */) {
                    // Move up by view lines
                    return this._moveUpByViewLines(context, cursors, inSelectionMode, value);
                }
                else {
                    // Move up by model lines
                    return this._moveUpByModelLines(context, cursors, inSelectionMode, value);
                }
            }
            case 3 /* Down */: {
                if (args.unit === 2 /* WrappedLine */) {
                    // Move down by view lines
                    return this._moveDownByViewLines(context, cursors, inSelectionMode, value);
                }
                else {
                    // Move down by model lines
                    return this._moveDownByModelLines(context, cursors, inSelectionMode, value);
                }
            }
            case 4 /* WrappedLineStart */: {
                // Move to the beginning of the current view line
                return this._moveToViewMinColumn(context, cursors, inSelectionMode);
            }
            case 5 /* WrappedLineFirstNonWhitespaceCharacter */: {
                // Move to the first non-whitespace column of the current view line
                return this._moveToViewFirstNonWhitespaceColumn(context, cursors, inSelectionMode);
            }
            case 6 /* WrappedLineColumnCenter */: {
                // Move to the "center" of the current view line
                return this._moveToViewCenterColumn(context, cursors, inSelectionMode);
            }
            case 7 /* WrappedLineEnd */: {
                // Move to the end of the current view line
                return this._moveToViewMaxColumn(context, cursors, inSelectionMode);
            }
            case 8 /* WrappedLineLastNonWhitespaceCharacter */: {
                // Move to the last non-whitespace column of the current view line
                return this._moveToViewLastNonWhitespaceColumn(context, cursors, inSelectionMode);
            }
            case 9 /* ViewPortTop */: {
                // Move to the nth line start in the viewport (from the top)
                var cursor = cursors[0];
                var visibleModelRange = context.getCompletelyVisibleModelRange();
                var modelLineNumber = this._firstLineNumberInRange(context.model, visibleModelRange, value);
                var modelColumn = context.model.getLineFirstNonWhitespaceColumn(modelLineNumber);
                return [this._moveToModelPosition(context, cursor, inSelectionMode, modelLineNumber, modelColumn)];
            }
            case 11 /* ViewPortBottom */: {
                // Move to the nth line start in the viewport (from the bottom)
                var cursor = cursors[0];
                var visibleModelRange = context.getCompletelyVisibleModelRange();
                var modelLineNumber = this._lastLineNumberInRange(context.model, visibleModelRange, value);
                var modelColumn = context.model.getLineFirstNonWhitespaceColumn(modelLineNumber);
                return [this._moveToModelPosition(context, cursor, inSelectionMode, modelLineNumber, modelColumn)];
            }
            case 10 /* ViewPortCenter */: {
                // Move to the line start in the viewport center
                var cursor = cursors[0];
                var visibleModelRange = context.getCompletelyVisibleModelRange();
                var modelLineNumber = Math.round((visibleModelRange.startLineNumber + visibleModelRange.endLineNumber) / 2);
                var modelColumn = context.model.getLineFirstNonWhitespaceColumn(modelLineNumber);
                return [this._moveToModelPosition(context, cursor, inSelectionMode, modelLineNumber, modelColumn)];
            }
            case 12 /* ViewPortIfOutside */: {
                // Move to a position inside the viewport
                var visibleViewRange = context.getCompletelyVisibleViewRange();
                var result = [];
                for (var i = 0, len = cursors.length; i < len; i++) {
                    var cursor = cursors[i];
                    result[i] = this.findPositionInViewportIfOutside(context, cursor, visibleViewRange, inSelectionMode);
                }
                return result;
            }
        }
        return null;
    };
    CursorMoveCommands.findPositionInViewportIfOutside = function (context, cursor, visibleViewRange, inSelectionMode) {
        var viewLineNumber = cursor.viewState.position.lineNumber;
        if (visibleViewRange.startLineNumber <= viewLineNumber && viewLineNumber <= visibleViewRange.endLineNumber - 1) {
            // Nothing to do, cursor is in viewport
            return new CursorState(cursor.modelState, cursor.viewState);
        }
        else {
            if (viewLineNumber > visibleViewRange.endLineNumber - 1) {
                viewLineNumber = visibleViewRange.endLineNumber - 1;
            }
            if (viewLineNumber < visibleViewRange.startLineNumber) {
                viewLineNumber = visibleViewRange.startLineNumber;
            }
            var viewColumn = context.viewModel.getLineFirstNonWhitespaceColumn(viewLineNumber);
            return this._moveToViewPosition(context, cursor, inSelectionMode, viewLineNumber, viewColumn);
        }
    };
    /**
     * Find the nth line start included in the range (from the start).
     */
    CursorMoveCommands._firstLineNumberInRange = function (model, range, count) {
        var startLineNumber = range.startLineNumber;
        if (range.startColumn !== model.getLineMinColumn(startLineNumber)) {
            // Move on to the second line if the first line start is not included in the range
            startLineNumber++;
        }
        return Math.min(range.endLineNumber, startLineNumber + count - 1);
    };
    /**
     * Find the nth line start included in the range (from the end).
     */
    CursorMoveCommands._lastLineNumberInRange = function (model, range, count) {
        var startLineNumber = range.startLineNumber;
        if (range.startColumn !== model.getLineMinColumn(startLineNumber)) {
            // Move on to the second line if the first line start is not included in the range
            startLineNumber++;
        }
        return Math.max(startLineNumber, range.endLineNumber - count + 1);
    };
    CursorMoveCommands._moveLeft = function (context, cursors, inSelectionMode, noOfColumns) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var newViewState = MoveOperations.moveLeft(context.config, context.viewModel, cursor.viewState, inSelectionMode, noOfColumns);
            if (noOfColumns === 1 && newViewState.position.lineNumber !== cursor.viewState.position.lineNumber) {
                // moved over to the previous view line
                var newViewModelPosition = context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(newViewState.position);
                if (newViewModelPosition.lineNumber === cursor.modelState.position.lineNumber) {
                    // stayed on the same model line => pass wrapping point where 2 view positions map to a single model position
                    newViewState = MoveOperations.moveLeft(context.config, context.viewModel, newViewState, inSelectionMode, 1);
                }
            }
            result[i] = CursorState.fromViewState(newViewState);
        }
        return result;
    };
    CursorMoveCommands._moveHalfLineLeft = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewLineNumber = cursor.viewState.position.lineNumber;
            var halfLine = Math.round(context.viewModel.getLineContent(viewLineNumber).length / 2);
            result[i] = CursorState.fromViewState(MoveOperations.moveLeft(context.config, context.viewModel, cursor.viewState, inSelectionMode, halfLine));
        }
        return result;
    };
    CursorMoveCommands._moveRight = function (context, cursors, inSelectionMode, noOfColumns) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var newViewState = MoveOperations.moveRight(context.config, context.viewModel, cursor.viewState, inSelectionMode, noOfColumns);
            if (noOfColumns === 1 && newViewState.position.lineNumber !== cursor.viewState.position.lineNumber) {
                // moved over to the next view line
                var newViewModelPosition = context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(newViewState.position);
                if (newViewModelPosition.lineNumber === cursor.modelState.position.lineNumber) {
                    // stayed on the same model line => pass wrapping point where 2 view positions map to a single model position
                    newViewState = MoveOperations.moveRight(context.config, context.viewModel, newViewState, inSelectionMode, 1);
                }
            }
            result[i] = CursorState.fromViewState(newViewState);
        }
        return result;
    };
    CursorMoveCommands._moveHalfLineRight = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewLineNumber = cursor.viewState.position.lineNumber;
            var halfLine = Math.round(context.viewModel.getLineContent(viewLineNumber).length / 2);
            result[i] = CursorState.fromViewState(MoveOperations.moveRight(context.config, context.viewModel, cursor.viewState, inSelectionMode, halfLine));
        }
        return result;
    };
    CursorMoveCommands._moveDownByViewLines = function (context, cursors, inSelectionMode, linesCount) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = CursorState.fromViewState(MoveOperations.moveDown(context.config, context.viewModel, cursor.viewState, inSelectionMode, linesCount));
        }
        return result;
    };
    CursorMoveCommands._moveDownByModelLines = function (context, cursors, inSelectionMode, linesCount) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = CursorState.fromModelState(MoveOperations.moveDown(context.config, context.model, cursor.modelState, inSelectionMode, linesCount));
        }
        return result;
    };
    CursorMoveCommands._moveUpByViewLines = function (context, cursors, inSelectionMode, linesCount) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = CursorState.fromViewState(MoveOperations.moveUp(context.config, context.viewModel, cursor.viewState, inSelectionMode, linesCount));
        }
        return result;
    };
    CursorMoveCommands._moveUpByModelLines = function (context, cursors, inSelectionMode, linesCount) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            result[i] = CursorState.fromModelState(MoveOperations.moveUp(context.config, context.model, cursor.modelState, inSelectionMode, linesCount));
        }
        return result;
    };
    CursorMoveCommands._moveToViewPosition = function (context, cursor, inSelectionMode, toViewLineNumber, toViewColumn) {
        return CursorState.fromViewState(cursor.viewState.move(inSelectionMode, toViewLineNumber, toViewColumn, 0));
    };
    CursorMoveCommands._moveToModelPosition = function (context, cursor, inSelectionMode, toModelLineNumber, toModelColumn) {
        return CursorState.fromModelState(cursor.modelState.move(inSelectionMode, toModelLineNumber, toModelColumn, 0));
    };
    CursorMoveCommands._moveToViewMinColumn = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewLineNumber = cursor.viewState.position.lineNumber;
            var viewColumn = context.viewModel.getLineMinColumn(viewLineNumber);
            result[i] = this._moveToViewPosition(context, cursor, inSelectionMode, viewLineNumber, viewColumn);
        }
        return result;
    };
    CursorMoveCommands._moveToViewFirstNonWhitespaceColumn = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewLineNumber = cursor.viewState.position.lineNumber;
            var viewColumn = context.viewModel.getLineFirstNonWhitespaceColumn(viewLineNumber);
            result[i] = this._moveToViewPosition(context, cursor, inSelectionMode, viewLineNumber, viewColumn);
        }
        return result;
    };
    CursorMoveCommands._moveToViewCenterColumn = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewLineNumber = cursor.viewState.position.lineNumber;
            var viewColumn = Math.round((context.viewModel.getLineMaxColumn(viewLineNumber) + context.viewModel.getLineMinColumn(viewLineNumber)) / 2);
            result[i] = this._moveToViewPosition(context, cursor, inSelectionMode, viewLineNumber, viewColumn);
        }
        return result;
    };
    CursorMoveCommands._moveToViewMaxColumn = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewLineNumber = cursor.viewState.position.lineNumber;
            var viewColumn = context.viewModel.getLineMaxColumn(viewLineNumber);
            result[i] = this._moveToViewPosition(context, cursor, inSelectionMode, viewLineNumber, viewColumn);
        }
        return result;
    };
    CursorMoveCommands._moveToViewLastNonWhitespaceColumn = function (context, cursors, inSelectionMode) {
        var result = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            var cursor = cursors[i];
            var viewLineNumber = cursor.viewState.position.lineNumber;
            var viewColumn = context.viewModel.getLineLastNonWhitespaceColumn(viewLineNumber);
            result[i] = this._moveToViewPosition(context, cursor, inSelectionMode, viewLineNumber, viewColumn);
        }
        return result;
    };
    return CursorMoveCommands;
}());
export { CursorMoveCommands };
export var CursorMove;
(function (CursorMove) {
    var isCursorMoveArgs = function (arg) {
        if (!types.isObject(arg)) {
            return false;
        }
        var cursorMoveArg = arg;
        if (!types.isString(cursorMoveArg.to)) {
            return false;
        }
        if (!types.isUndefined(cursorMoveArg.select) && !types.isBoolean(cursorMoveArg.select)) {
            return false;
        }
        if (!types.isUndefined(cursorMoveArg.by) && !types.isString(cursorMoveArg.by)) {
            return false;
        }
        if (!types.isUndefined(cursorMoveArg.value) && !types.isNumber(cursorMoveArg.value)) {
            return false;
        }
        return true;
    };
    CursorMove.description = {
        description: 'Move cursor to a logical position in the view',
        args: [
            {
                name: 'Cursor move argument object',
                description: "Property-value pairs that can be passed through this argument:\n\t\t\t\t\t* 'to': A mandatory logical position value providing where to move the cursor.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'left', 'right', 'up', 'down'\n\t\t\t\t\t\t'wrappedLineStart', 'wrappedLineEnd', 'wrappedLineColumnCenter'\n\t\t\t\t\t\t'wrappedLineFirstNonWhitespaceCharacter', 'wrappedLineLastNonWhitespaceCharacter'\n\t\t\t\t\t\t'viewPortTop', 'viewPortCenter', 'viewPortBottom', 'viewPortIfOutside'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'by': Unit to move. Default is computed based on 'to' value.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'line', 'wrappedLine', 'character', 'halfLine'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'value': Number of units to move. Default is '1'.\n\t\t\t\t\t* 'select': If 'true' makes the selection. Default is 'false'.\n\t\t\t\t",
                constraint: isCursorMoveArgs
            }
        ]
    };
    /**
     * Positions in the view for cursor move command.
     */
    CursorMove.RawDirection = {
        Left: 'left',
        Right: 'right',
        Up: 'up',
        Down: 'down',
        WrappedLineStart: 'wrappedLineStart',
        WrappedLineFirstNonWhitespaceCharacter: 'wrappedLineFirstNonWhitespaceCharacter',
        WrappedLineColumnCenter: 'wrappedLineColumnCenter',
        WrappedLineEnd: 'wrappedLineEnd',
        WrappedLineLastNonWhitespaceCharacter: 'wrappedLineLastNonWhitespaceCharacter',
        ViewPortTop: 'viewPortTop',
        ViewPortCenter: 'viewPortCenter',
        ViewPortBottom: 'viewPortBottom',
        ViewPortIfOutside: 'viewPortIfOutside'
    };
    /**
     * Units for Cursor move 'by' argument
     */
    CursorMove.RawUnit = {
        Line: 'line',
        WrappedLine: 'wrappedLine',
        Character: 'character',
        HalfLine: 'halfLine'
    };
    function parse(args) {
        if (!args.to) {
            // illegal arguments
            return null;
        }
        var direction;
        switch (args.to) {
            case CursorMove.RawDirection.Left:
                direction = 0 /* Left */;
                break;
            case CursorMove.RawDirection.Right:
                direction = 1 /* Right */;
                break;
            case CursorMove.RawDirection.Up:
                direction = 2 /* Up */;
                break;
            case CursorMove.RawDirection.Down:
                direction = 3 /* Down */;
                break;
            case CursorMove.RawDirection.WrappedLineStart:
                direction = 4 /* WrappedLineStart */;
                break;
            case CursorMove.RawDirection.WrappedLineFirstNonWhitespaceCharacter:
                direction = 5 /* WrappedLineFirstNonWhitespaceCharacter */;
                break;
            case CursorMove.RawDirection.WrappedLineColumnCenter:
                direction = 6 /* WrappedLineColumnCenter */;
                break;
            case CursorMove.RawDirection.WrappedLineEnd:
                direction = 7 /* WrappedLineEnd */;
                break;
            case CursorMove.RawDirection.WrappedLineLastNonWhitespaceCharacter:
                direction = 8 /* WrappedLineLastNonWhitespaceCharacter */;
                break;
            case CursorMove.RawDirection.ViewPortTop:
                direction = 9 /* ViewPortTop */;
                break;
            case CursorMove.RawDirection.ViewPortBottom:
                direction = 11 /* ViewPortBottom */;
                break;
            case CursorMove.RawDirection.ViewPortCenter:
                direction = 10 /* ViewPortCenter */;
                break;
            case CursorMove.RawDirection.ViewPortIfOutside:
                direction = 12 /* ViewPortIfOutside */;
                break;
            default:
                // illegal arguments
                return null;
        }
        var unit = 0 /* None */;
        switch (args.by) {
            case CursorMove.RawUnit.Line:
                unit = 1 /* Line */;
                break;
            case CursorMove.RawUnit.WrappedLine:
                unit = 2 /* WrappedLine */;
                break;
            case CursorMove.RawUnit.Character:
                unit = 3 /* Character */;
                break;
            case CursorMove.RawUnit.HalfLine:
                unit = 4 /* HalfLine */;
                break;
        }
        return {
            direction: direction,
            unit: unit,
            select: (!!args.select),
            value: (args.value || 1)
        };
    }
    CursorMove.parse = parse;
})(CursorMove || (CursorMove = {}));
