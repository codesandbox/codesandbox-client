/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Range } from '../../core/range.js';
import * as strings from '../../../../base/common/strings.js';
import { PieceTreeBase } from './pieceTreeBase.js';
import { EndOfLinePreference, ApplyEditsResult } from '../../model.js';
var PieceTreeTextBuffer = /** @class */ (function () {
    function PieceTreeTextBuffer(chunks, BOM, eol, containsRTL, isBasicASCII, eolNormalized) {
        this._BOM = BOM;
        this._mightContainNonBasicASCII = !isBasicASCII;
        this._mightContainRTL = containsRTL;
        this._pieceTree = new PieceTreeBase(chunks, eol, eolNormalized);
    }
    // #region TextBuffer
    PieceTreeTextBuffer.prototype.equals = function (other) {
        if (!(other instanceof PieceTreeTextBuffer)) {
            return false;
        }
        if (this._BOM !== other._BOM) {
            return false;
        }
        if (this.getEOL() !== other.getEOL()) {
            return false;
        }
        return this._pieceTree.equal(other._pieceTree);
    };
    PieceTreeTextBuffer.prototype.mightContainRTL = function () {
        return this._mightContainRTL;
    };
    PieceTreeTextBuffer.prototype.mightContainNonBasicASCII = function () {
        return this._mightContainNonBasicASCII;
    };
    PieceTreeTextBuffer.prototype.getBOM = function () {
        return this._BOM;
    };
    PieceTreeTextBuffer.prototype.getEOL = function () {
        return this._pieceTree.getEOL();
    };
    PieceTreeTextBuffer.prototype.createSnapshot = function (preserveBOM) {
        return this._pieceTree.createSnapshot(preserveBOM ? this._BOM : '');
    };
    PieceTreeTextBuffer.prototype.getOffsetAt = function (lineNumber, column) {
        return this._pieceTree.getOffsetAt(lineNumber, column);
    };
    PieceTreeTextBuffer.prototype.getPositionAt = function (offset) {
        return this._pieceTree.getPositionAt(offset);
    };
    PieceTreeTextBuffer.prototype.getRangeAt = function (start, length) {
        var end = start + length;
        var startPosition = this.getPositionAt(start);
        var endPosition = this.getPositionAt(end);
        return new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
    };
    PieceTreeTextBuffer.prototype.getValueInRange = function (range, eol) {
        if (eol === void 0) { eol = EndOfLinePreference.TextDefined; }
        if (range.isEmpty()) {
            return '';
        }
        var lineEnding = this._getEndOfLine(eol);
        return this._pieceTree.getValueInRange(range, lineEnding);
    };
    PieceTreeTextBuffer.prototype.getValueLengthInRange = function (range, eol) {
        if (eol === void 0) { eol = EndOfLinePreference.TextDefined; }
        if (range.isEmpty()) {
            return 0;
        }
        if (range.startLineNumber === range.endLineNumber) {
            return (range.endColumn - range.startColumn);
        }
        var startOffset = this.getOffsetAt(range.startLineNumber, range.startColumn);
        var endOffset = this.getOffsetAt(range.endLineNumber, range.endColumn);
        return endOffset - startOffset;
    };
    PieceTreeTextBuffer.prototype.getLength = function () {
        return this._pieceTree.getLength();
    };
    PieceTreeTextBuffer.prototype.getLineCount = function () {
        return this._pieceTree.getLineCount();
    };
    PieceTreeTextBuffer.prototype.getLinesContent = function () {
        return this._pieceTree.getLinesContent();
    };
    PieceTreeTextBuffer.prototype.getLineContent = function (lineNumber) {
        return this._pieceTree.getLineContent(lineNumber);
    };
    PieceTreeTextBuffer.prototype.getLineCharCode = function (lineNumber, index) {
        return this._pieceTree.getLineCharCode(lineNumber, index);
    };
    PieceTreeTextBuffer.prototype.getLineLength = function (lineNumber) {
        return this._pieceTree.getLineLength(lineNumber);
    };
    PieceTreeTextBuffer.prototype.getLineMinColumn = function (lineNumber) {
        return 1;
    };
    PieceTreeTextBuffer.prototype.getLineMaxColumn = function (lineNumber) {
        return this.getLineLength(lineNumber) + 1;
    };
    PieceTreeTextBuffer.prototype.getLineFirstNonWhitespaceColumn = function (lineNumber) {
        var result = strings.firstNonWhitespaceIndex(this.getLineContent(lineNumber));
        if (result === -1) {
            return 0;
        }
        return result + 1;
    };
    PieceTreeTextBuffer.prototype.getLineLastNonWhitespaceColumn = function (lineNumber) {
        var result = strings.lastNonWhitespaceIndex(this.getLineContent(lineNumber));
        if (result === -1) {
            return 0;
        }
        return result + 2;
    };
    PieceTreeTextBuffer.prototype._getEndOfLine = function (eol) {
        switch (eol) {
            case EndOfLinePreference.LF:
                return '\n';
            case EndOfLinePreference.CRLF:
                return '\r\n';
            case EndOfLinePreference.TextDefined:
                return this.getEOL();
        }
        throw new Error('Unknown EOL preference');
    };
    PieceTreeTextBuffer.prototype.setEOL = function (newEOL) {
        this._pieceTree.setEOL(newEOL);
    };
    PieceTreeTextBuffer.prototype.applyEdits = function (rawOperations, recordTrimAutoWhitespace) {
        var mightContainRTL = this._mightContainRTL;
        var mightContainNonBasicASCII = this._mightContainNonBasicASCII;
        var canReduceOperations = true;
        var operations = [];
        for (var i = 0; i < rawOperations.length; i++) {
            var op = rawOperations[i];
            if (canReduceOperations && op._isTracked) {
                canReduceOperations = false;
            }
            var validatedRange = op.range;
            if (!mightContainRTL && op.text) {
                // check if the new inserted text contains RTL
                mightContainRTL = strings.containsRTL(op.text);
            }
            if (!mightContainNonBasicASCII && op.text) {
                mightContainNonBasicASCII = !strings.isBasicASCII(op.text);
            }
            operations[i] = {
                sortIndex: i,
                identifier: op.identifier,
                range: validatedRange,
                rangeOffset: this.getOffsetAt(validatedRange.startLineNumber, validatedRange.startColumn),
                rangeLength: this.getValueLengthInRange(validatedRange),
                lines: op.text ? op.text.split(/\r\n|\r|\n/) : null,
                forceMoveMarkers: op.forceMoveMarkers,
                isAutoWhitespaceEdit: op.isAutoWhitespaceEdit || false
            };
        }
        // Sort operations ascending
        operations.sort(PieceTreeTextBuffer._sortOpsAscending);
        var hasTouchingRanges = false;
        for (var i = 0, count = operations.length - 1; i < count; i++) {
            var rangeEnd = operations[i].range.getEndPosition();
            var nextRangeStart = operations[i + 1].range.getStartPosition();
            if (nextRangeStart.isBeforeOrEqual(rangeEnd)) {
                if (nextRangeStart.isBefore(rangeEnd)) {
                    // overlapping ranges
                    throw new Error('Overlapping ranges are not allowed!');
                }
                hasTouchingRanges = true;
            }
        }
        if (canReduceOperations) {
            operations = this._reduceOperations(operations);
        }
        // Delta encode operations
        var reverseRanges = PieceTreeTextBuffer._getInverseEditRanges(operations);
        var newTrimAutoWhitespaceCandidates = [];
        for (var i = 0; i < operations.length; i++) {
            var op = operations[i];
            var reverseRange = reverseRanges[i];
            if (recordTrimAutoWhitespace && op.isAutoWhitespaceEdit && op.range.isEmpty()) {
                // Record already the future line numbers that might be auto whitespace removal candidates on next edit
                for (var lineNumber = reverseRange.startLineNumber; lineNumber <= reverseRange.endLineNumber; lineNumber++) {
                    var currentLineContent = '';
                    if (lineNumber === reverseRange.startLineNumber) {
                        currentLineContent = this.getLineContent(op.range.startLineNumber);
                        if (strings.firstNonWhitespaceIndex(currentLineContent) !== -1) {
                            continue;
                        }
                    }
                    newTrimAutoWhitespaceCandidates.push({ lineNumber: lineNumber, oldContent: currentLineContent });
                }
            }
        }
        var reverseOperations = [];
        for (var i = 0; i < operations.length; i++) {
            var op = operations[i];
            var reverseRange = reverseRanges[i];
            reverseOperations[i] = {
                sortIndex: op.sortIndex,
                identifier: op.identifier,
                range: reverseRange,
                text: this.getValueInRange(op.range),
                forceMoveMarkers: op.forceMoveMarkers
            };
        }
        // Can only sort reverse operations when the order is not significant
        if (!hasTouchingRanges) {
            reverseOperations.sort(function (a, b) { return a.sortIndex - b.sortIndex; });
        }
        this._mightContainRTL = mightContainRTL;
        this._mightContainNonBasicASCII = mightContainNonBasicASCII;
        var contentChanges = this._doApplyEdits(operations);
        var trimAutoWhitespaceLineNumbers = null;
        if (recordTrimAutoWhitespace && newTrimAutoWhitespaceCandidates.length > 0) {
            // sort line numbers auto whitespace removal candidates for next edit descending
            newTrimAutoWhitespaceCandidates.sort(function (a, b) { return b.lineNumber - a.lineNumber; });
            trimAutoWhitespaceLineNumbers = [];
            for (var i = 0, len = newTrimAutoWhitespaceCandidates.length; i < len; i++) {
                var lineNumber = newTrimAutoWhitespaceCandidates[i].lineNumber;
                if (i > 0 && newTrimAutoWhitespaceCandidates[i - 1].lineNumber === lineNumber) {
                    // Do not have the same line number twice
                    continue;
                }
                var prevContent = newTrimAutoWhitespaceCandidates[i].oldContent;
                var lineContent = this.getLineContent(lineNumber);
                if (lineContent.length === 0 || lineContent === prevContent || strings.firstNonWhitespaceIndex(lineContent) !== -1) {
                    continue;
                }
                trimAutoWhitespaceLineNumbers.push(lineNumber);
            }
        }
        return new ApplyEditsResult(reverseOperations, contentChanges, trimAutoWhitespaceLineNumbers);
    };
    /**
     * Transform operations such that they represent the same logic edit,
     * but that they also do not cause OOM crashes.
     */
    PieceTreeTextBuffer.prototype._reduceOperations = function (operations) {
        if (operations.length < 1000) {
            // We know from empirical testing that a thousand edits work fine regardless of their shape.
            return operations;
        }
        // At one point, due to how events are emitted and how each operation is handled,
        // some operations can trigger a high ammount of temporary string allocations,
        // that will immediately get edited again.
        // e.g. a formatter inserting ridiculous ammounts of \n on a model with a single line
        // Therefore, the strategy is to collapse all the operations into a huge single edit operation
        return [this._toSingleEditOperation(operations)];
    };
    PieceTreeTextBuffer.prototype._toSingleEditOperation = function (operations) {
        var forceMoveMarkers = false, firstEditRange = operations[0].range, lastEditRange = operations[operations.length - 1].range, entireEditRange = new Range(firstEditRange.startLineNumber, firstEditRange.startColumn, lastEditRange.endLineNumber, lastEditRange.endColumn), lastEndLineNumber = firstEditRange.startLineNumber, lastEndColumn = firstEditRange.startColumn, result = [];
        for (var i = 0, len = operations.length; i < len; i++) {
            var operation = operations[i], range = operation.range;
            forceMoveMarkers = forceMoveMarkers || operation.forceMoveMarkers;
            // (1) -- Push old text
            for (var lineNumber = lastEndLineNumber; lineNumber < range.startLineNumber; lineNumber++) {
                if (lineNumber === lastEndLineNumber) {
                    result.push(this.getLineContent(lineNumber).substring(lastEndColumn - 1));
                }
                else {
                    result.push('\n');
                    result.push(this.getLineContent(lineNumber));
                }
            }
            if (range.startLineNumber === lastEndLineNumber) {
                result.push(this.getLineContent(range.startLineNumber).substring(lastEndColumn - 1, range.startColumn - 1));
            }
            else {
                result.push('\n');
                result.push(this.getLineContent(range.startLineNumber).substring(0, range.startColumn - 1));
            }
            // (2) -- Push new text
            if (operation.lines) {
                for (var j = 0, lenJ = operation.lines.length; j < lenJ; j++) {
                    if (j !== 0) {
                        result.push('\n');
                    }
                    result.push(operation.lines[j]);
                }
            }
            lastEndLineNumber = operation.range.endLineNumber;
            lastEndColumn = operation.range.endColumn;
        }
        return {
            sortIndex: 0,
            identifier: operations[0].identifier,
            range: entireEditRange,
            rangeOffset: this.getOffsetAt(entireEditRange.startLineNumber, entireEditRange.startColumn),
            rangeLength: this.getValueLengthInRange(entireEditRange, EndOfLinePreference.TextDefined),
            lines: result.join('').split('\n'),
            forceMoveMarkers: forceMoveMarkers,
            isAutoWhitespaceEdit: false
        };
    };
    PieceTreeTextBuffer.prototype._doApplyEdits = function (operations) {
        operations.sort(PieceTreeTextBuffer._sortOpsDescending);
        var contentChanges = [];
        // operations are from bottom to top
        for (var i = 0; i < operations.length; i++) {
            var op = operations[i];
            var startLineNumber = op.range.startLineNumber;
            var startColumn = op.range.startColumn;
            var endLineNumber = op.range.endLineNumber;
            var endColumn = op.range.endColumn;
            if (startLineNumber === endLineNumber && startColumn === endColumn && (!op.lines || op.lines.length === 0)) {
                // no-op
                continue;
            }
            var deletingLinesCnt = endLineNumber - startLineNumber;
            var insertingLinesCnt = (op.lines ? op.lines.length - 1 : 0);
            var editingLinesCnt = Math.min(deletingLinesCnt, insertingLinesCnt);
            var text = (op.lines ? op.lines.join(this.getEOL()) : '');
            if (text) {
                // replacement
                this._pieceTree.delete(op.rangeOffset, op.rangeLength);
                this._pieceTree.insert(op.rangeOffset, text, true);
            }
            else {
                // deletion
                this._pieceTree.delete(op.rangeOffset, op.rangeLength);
            }
            if (editingLinesCnt < insertingLinesCnt) {
                var newLinesContent = [];
                for (var j = editingLinesCnt + 1; j <= insertingLinesCnt; j++) {
                    newLinesContent.push(op.lines[j]);
                }
                newLinesContent[newLinesContent.length - 1] = this.getLineContent(startLineNumber + insertingLinesCnt - 1);
            }
            var contentChangeRange = new Range(startLineNumber, startColumn, endLineNumber, endColumn);
            contentChanges.push({
                range: contentChangeRange,
                rangeLength: op.rangeLength,
                text: text,
                rangeOffset: op.rangeOffset,
                forceMoveMarkers: op.forceMoveMarkers
            });
        }
        return contentChanges;
    };
    PieceTreeTextBuffer.prototype.findMatchesLineByLine = function (searchRange, searchData, captureMatches, limitResultCount) {
        return this._pieceTree.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
    };
    // #endregion
    // #region helper
    // testing purpose.
    PieceTreeTextBuffer.prototype.getPieceTree = function () {
        return this._pieceTree;
    };
    /**
     * Assumes `operations` are validated and sorted ascending
     */
    PieceTreeTextBuffer._getInverseEditRanges = function (operations) {
        var result = [];
        var prevOpEndLineNumber;
        var prevOpEndColumn;
        var prevOp = null;
        for (var i = 0, len = operations.length; i < len; i++) {
            var op = operations[i];
            var startLineNumber = void 0;
            var startColumn = void 0;
            if (prevOp) {
                if (prevOp.range.endLineNumber === op.range.startLineNumber) {
                    startLineNumber = prevOpEndLineNumber;
                    startColumn = prevOpEndColumn + (op.range.startColumn - prevOp.range.endColumn);
                }
                else {
                    startLineNumber = prevOpEndLineNumber + (op.range.startLineNumber - prevOp.range.endLineNumber);
                    startColumn = op.range.startColumn;
                }
            }
            else {
                startLineNumber = op.range.startLineNumber;
                startColumn = op.range.startColumn;
            }
            var resultRange = void 0;
            if (op.lines && op.lines.length > 0) {
                // the operation inserts something
                var lineCount = op.lines.length;
                var firstLine = op.lines[0];
                var lastLine = op.lines[lineCount - 1];
                if (lineCount === 1) {
                    // single line insert
                    resultRange = new Range(startLineNumber, startColumn, startLineNumber, startColumn + firstLine.length);
                }
                else {
                    // multi line insert
                    resultRange = new Range(startLineNumber, startColumn, startLineNumber + lineCount - 1, lastLine.length + 1);
                }
            }
            else {
                // There is nothing to insert
                resultRange = new Range(startLineNumber, startColumn, startLineNumber, startColumn);
            }
            prevOpEndLineNumber = resultRange.endLineNumber;
            prevOpEndColumn = resultRange.endColumn;
            result.push(resultRange);
            prevOp = op;
        }
        return result;
    };
    PieceTreeTextBuffer._sortOpsAscending = function (a, b) {
        var r = Range.compareRangesUsingEnds(a.range, b.range);
        if (r === 0) {
            return a.sortIndex - b.sortIndex;
        }
        return r;
    };
    PieceTreeTextBuffer._sortOpsDescending = function (a, b) {
        var r = Range.compareRangesUsingEnds(a.range, b.range);
        if (r === 0) {
            return b.sortIndex - a.sortIndex;
        }
        return -r;
    };
    return PieceTreeTextBuffer;
}());
export { PieceTreeTextBuffer };
