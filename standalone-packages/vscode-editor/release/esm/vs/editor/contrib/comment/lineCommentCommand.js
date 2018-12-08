/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings.js';
import { EditOperation } from '../../common/core/editOperation.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { LanguageConfigurationRegistry } from '../../common/modes/languageConfigurationRegistry.js';
import { BlockCommentCommand } from './blockCommentCommand.js';
var LineCommentCommand = /** @class */ (function () {
    function LineCommentCommand(selection, tabSize, type) {
        this._selection = selection;
        this._tabSize = tabSize;
        this._type = type;
        this._deltaColumn = 0;
    }
    /**
     * Do an initial pass over the lines and gather info about the line comment string.
     * Returns null if any of the lines doesn't support a line comment string.
     */
    LineCommentCommand._gatherPreflightCommentStrings = function (model, startLineNumber, endLineNumber) {
        model.tokenizeIfCheap(startLineNumber);
        var languageId = model.getLanguageIdAtPosition(startLineNumber, 1);
        var config = LanguageConfigurationRegistry.getComments(languageId);
        var commentStr = (config ? config.lineCommentToken : null);
        if (!commentStr) {
            // Mode does not support line comments
            return null;
        }
        var lines = [];
        for (var i = 0, lineCount = endLineNumber - startLineNumber + 1; i < lineCount; i++) {
            lines[i] = {
                ignore: false,
                commentStr: commentStr,
                commentStrOffset: 0,
                commentStrLength: commentStr.length
            };
        }
        return lines;
    };
    /**
     * Analyze lines and decide which lines are relevant and what the toggle should do.
     * Also, build up several offsets and lengths useful in the generation of editor operations.
     */
    LineCommentCommand._analyzeLines = function (type, model, lines, startLineNumber) {
        var onlyWhitespaceLines = true;
        var shouldRemoveComments;
        if (type === 0 /* Toggle */) {
            shouldRemoveComments = true;
        }
        else if (type === 1 /* ForceAdd */) {
            shouldRemoveComments = false;
        }
        else {
            shouldRemoveComments = true;
        }
        for (var i = 0, lineCount = lines.length; i < lineCount; i++) {
            var lineData = lines[i];
            var lineNumber = startLineNumber + i;
            var lineContent = model.getLineContent(lineNumber);
            var lineContentStartOffset = strings.firstNonWhitespaceIndex(lineContent);
            if (lineContentStartOffset === -1) {
                // Empty or whitespace only line
                if (type === 0 /* Toggle */) {
                    lineData.ignore = true;
                }
                else if (type === 1 /* ForceAdd */) {
                    lineData.ignore = true;
                }
                else {
                    lineData.ignore = true;
                }
                lineData.commentStrOffset = lineContent.length;
                continue;
            }
            onlyWhitespaceLines = false;
            lineData.ignore = false;
            lineData.commentStrOffset = lineContentStartOffset;
            if (shouldRemoveComments && !BlockCommentCommand._haystackHasNeedleAtOffset(lineContent, lineData.commentStr, lineContentStartOffset)) {
                if (type === 0 /* Toggle */) {
                    // Every line so far has been a line comment, but this one is not
                    shouldRemoveComments = false;
                }
                else if (type === 1 /* ForceAdd */) {
                    // Will not happen
                }
                else {
                    lineData.ignore = true;
                }
            }
            if (shouldRemoveComments) {
                var commentStrEndOffset = lineContentStartOffset + lineData.commentStrLength;
                if (commentStrEndOffset < lineContent.length && lineContent.charCodeAt(commentStrEndOffset) === 32 /* Space */) {
                    lineData.commentStrLength += 1;
                }
            }
        }
        if (type === 0 /* Toggle */ && onlyWhitespaceLines) {
            // For only whitespace lines, we insert comments
            shouldRemoveComments = false;
            // Also, no longer ignore them
            for (var i = 0, lineCount = lines.length; i < lineCount; i++) {
                lines[i].ignore = false;
            }
        }
        return {
            supported: true,
            shouldRemoveComments: shouldRemoveComments,
            lines: lines
        };
    };
    /**
     * Analyze all lines and decide exactly what to do => not supported | insert line comments | remove line comments
     */
    LineCommentCommand._gatherPreflightData = function (type, model, startLineNumber, endLineNumber) {
        var lines = LineCommentCommand._gatherPreflightCommentStrings(model, startLineNumber, endLineNumber);
        if (lines === null) {
            return {
                supported: false
            };
        }
        return LineCommentCommand._analyzeLines(type, model, lines, startLineNumber);
    };
    /**
     * Given a successful analysis, execute either insert line comments, either remove line comments
     */
    LineCommentCommand.prototype._executeLineComments = function (model, builder, data, s) {
        var ops;
        if (data.shouldRemoveComments) {
            ops = LineCommentCommand._createRemoveLineCommentsOperations(data.lines, s.startLineNumber);
        }
        else {
            LineCommentCommand._normalizeInsertionPoint(model, data.lines, s.startLineNumber, this._tabSize);
            ops = LineCommentCommand._createAddLineCommentsOperations(data.lines, s.startLineNumber);
        }
        var cursorPosition = new Position(s.positionLineNumber, s.positionColumn);
        for (var i = 0, len = ops.length; i < len; i++) {
            builder.addEditOperation(ops[i].range, ops[i].text);
            if (ops[i].range.isEmpty() && ops[i].range.getStartPosition().equals(cursorPosition)) {
                var lineContent = model.getLineContent(cursorPosition.lineNumber);
                if (lineContent.length + 1 === cursorPosition.column) {
                    this._deltaColumn = (ops[i].text || '').length;
                }
            }
        }
        this._selectionId = builder.trackSelection(s);
    };
    LineCommentCommand.prototype._attemptRemoveBlockComment = function (model, s, startToken, endToken) {
        var startLineNumber = s.startLineNumber;
        var endLineNumber = s.endLineNumber;
        var startTokenAllowedBeforeColumn = endToken.length + Math.max(model.getLineFirstNonWhitespaceColumn(s.startLineNumber), s.startColumn);
        var startTokenIndex = model.getLineContent(startLineNumber).lastIndexOf(startToken, startTokenAllowedBeforeColumn - 1);
        var endTokenIndex = model.getLineContent(endLineNumber).indexOf(endToken, s.endColumn - 1 - startToken.length);
        if (startTokenIndex !== -1 && endTokenIndex === -1) {
            endTokenIndex = model.getLineContent(startLineNumber).indexOf(endToken, startTokenIndex + startToken.length);
            endLineNumber = startLineNumber;
        }
        if (startTokenIndex === -1 && endTokenIndex !== -1) {
            startTokenIndex = model.getLineContent(endLineNumber).lastIndexOf(startToken, endTokenIndex);
            startLineNumber = endLineNumber;
        }
        if (s.isEmpty() && (startTokenIndex === -1 || endTokenIndex === -1)) {
            startTokenIndex = model.getLineContent(startLineNumber).indexOf(startToken);
            if (startTokenIndex !== -1) {
                endTokenIndex = model.getLineContent(startLineNumber).indexOf(endToken, startTokenIndex + startToken.length);
            }
        }
        // We have to adjust to possible inner white space.
        // For Space after startToken, add Space to startToken - range math will work out.
        if (startTokenIndex !== -1 && model.getLineContent(startLineNumber).charCodeAt(startTokenIndex + startToken.length) === 32 /* Space */) {
            startToken += ' ';
        }
        // For Space before endToken, add Space before endToken and shift index one left.
        if (endTokenIndex !== -1 && model.getLineContent(endLineNumber).charCodeAt(endTokenIndex - 1) === 32 /* Space */) {
            endToken = ' ' + endToken;
            endTokenIndex -= 1;
        }
        if (startTokenIndex !== -1 && endTokenIndex !== -1) {
            return BlockCommentCommand._createRemoveBlockCommentOperations(new Range(startLineNumber, startTokenIndex + startToken.length + 1, endLineNumber, endTokenIndex + 1), startToken, endToken);
        }
        return null;
    };
    /**
     * Given an unsuccessful analysis, delegate to the block comment command
     */
    LineCommentCommand.prototype._executeBlockComment = function (model, builder, s) {
        model.tokenizeIfCheap(s.startLineNumber);
        var languageId = model.getLanguageIdAtPosition(s.startLineNumber, 1);
        var config = LanguageConfigurationRegistry.getComments(languageId);
        if (!config || !config.blockCommentStartToken || !config.blockCommentEndToken) {
            // Mode does not support block comments
            return;
        }
        var startToken = config.blockCommentStartToken;
        var endToken = config.blockCommentEndToken;
        var ops = this._attemptRemoveBlockComment(model, s, startToken, endToken);
        if (!ops) {
            if (s.isEmpty()) {
                var lineContent = model.getLineContent(s.startLineNumber);
                var firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
                if (firstNonWhitespaceIndex === -1) {
                    // Line is empty or contains only whitespace
                    firstNonWhitespaceIndex = lineContent.length;
                }
                ops = BlockCommentCommand._createAddBlockCommentOperations(new Range(s.startLineNumber, firstNonWhitespaceIndex + 1, s.startLineNumber, lineContent.length + 1), startToken, endToken);
            }
            else {
                ops = BlockCommentCommand._createAddBlockCommentOperations(new Range(s.startLineNumber, model.getLineFirstNonWhitespaceColumn(s.startLineNumber), s.endLineNumber, model.getLineMaxColumn(s.endLineNumber)), startToken, endToken);
            }
            if (ops.length === 1) {
                // Leave cursor after token and Space
                this._deltaColumn = startToken.length + 1;
            }
        }
        this._selectionId = builder.trackSelection(s);
        for (var i = 0; i < ops.length; i++) {
            builder.addEditOperation(ops[i].range, ops[i].text);
        }
    };
    LineCommentCommand.prototype.getEditOperations = function (model, builder) {
        var s = this._selection;
        this._moveEndPositionDown = false;
        if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
            this._moveEndPositionDown = true;
            s = s.setEndPosition(s.endLineNumber - 1, model.getLineMaxColumn(s.endLineNumber - 1));
        }
        var data = LineCommentCommand._gatherPreflightData(this._type, model, s.startLineNumber, s.endLineNumber);
        if (data.supported) {
            return this._executeLineComments(model, builder, data, s);
        }
        return this._executeBlockComment(model, builder, s);
    };
    LineCommentCommand.prototype.computeCursorState = function (model, helper) {
        var result = helper.getTrackedSelection(this._selectionId);
        if (this._moveEndPositionDown) {
            result = result.setEndPosition(result.endLineNumber + 1, 1);
        }
        return new Selection(result.selectionStartLineNumber, result.selectionStartColumn + this._deltaColumn, result.positionLineNumber, result.positionColumn + this._deltaColumn);
    };
    /**
     * Generate edit operations in the remove line comment case
     */
    LineCommentCommand._createRemoveLineCommentsOperations = function (lines, startLineNumber) {
        var res = [];
        for (var i = 0, len = lines.length; i < len; i++) {
            var lineData = lines[i];
            if (lineData.ignore) {
                continue;
            }
            res.push(EditOperation.delete(new Range(startLineNumber + i, lineData.commentStrOffset + 1, startLineNumber + i, lineData.commentStrOffset + lineData.commentStrLength + 1)));
        }
        return res;
    };
    /**
     * Generate edit operations in the add line comment case
     */
    LineCommentCommand._createAddLineCommentsOperations = function (lines, startLineNumber) {
        var res = [];
        for (var i = 0, len = lines.length; i < len; i++) {
            var lineData = lines[i];
            if (lineData.ignore) {
                continue;
            }
            res.push(EditOperation.insert(new Position(startLineNumber + i, lineData.commentStrOffset + 1), lineData.commentStr + ' '));
        }
        return res;
    };
    // TODO@Alex -> duplicated in characterHardWrappingLineMapper
    LineCommentCommand.nextVisibleColumn = function (currentVisibleColumn, tabSize, isTab, columnSize) {
        if (isTab) {
            return currentVisibleColumn + (tabSize - (currentVisibleColumn % tabSize));
        }
        return currentVisibleColumn + columnSize;
    };
    /**
     * Adjust insertion points to have them vertically aligned in the add line comment case
     */
    LineCommentCommand._normalizeInsertionPoint = function (model, lines, startLineNumber, tabSize) {
        var minVisibleColumn = Number.MAX_VALUE;
        var j;
        var lenJ;
        for (var i = 0, len = lines.length; i < len; i++) {
            if (lines[i].ignore) {
                continue;
            }
            var lineContent = model.getLineContent(startLineNumber + i);
            var currentVisibleColumn = 0;
            for (var j_1 = 0, lenJ_1 = lines[i].commentStrOffset; currentVisibleColumn < minVisibleColumn && j_1 < lenJ_1; j_1++) {
                currentVisibleColumn = LineCommentCommand.nextVisibleColumn(currentVisibleColumn, tabSize, lineContent.charCodeAt(j_1) === 9 /* Tab */, 1);
            }
            if (currentVisibleColumn < minVisibleColumn) {
                minVisibleColumn = currentVisibleColumn;
            }
        }
        minVisibleColumn = Math.floor(minVisibleColumn / tabSize) * tabSize;
        for (var i = 0, len = lines.length; i < len; i++) {
            if (lines[i].ignore) {
                continue;
            }
            var lineContent = model.getLineContent(startLineNumber + i);
            var currentVisibleColumn = 0;
            for (j = 0, lenJ = lines[i].commentStrOffset; currentVisibleColumn < minVisibleColumn && j < lenJ; j++) {
                currentVisibleColumn = LineCommentCommand.nextVisibleColumn(currentVisibleColumn, tabSize, lineContent.charCodeAt(j) === 9 /* Tab */, 1);
            }
            if (currentVisibleColumn > minVisibleColumn) {
                lines[i].commentStrOffset = j - 1;
            }
            else {
                lines[i].commentStrOffset = j;
            }
        }
    };
    return LineCommentCommand;
}());
export { LineCommentCommand };
