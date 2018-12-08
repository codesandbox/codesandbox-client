/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { ModelDecorationOptions } from '../model/textModel.js';
import * as viewEvents from '../view/viewEvents.js';
import { PrefixSumComputerWithCache } from './prefixSumComputer.js';
import { ViewLineData } from './viewModel.js';
var OutputPosition = /** @class */ (function () {
    function OutputPosition(outputLineIndex, outputOffset) {
        this.outputLineIndex = outputLineIndex;
        this.outputOffset = outputOffset;
    }
    return OutputPosition;
}());
export { OutputPosition };
var CoordinatesConverter = /** @class */ (function () {
    function CoordinatesConverter(lines) {
        this._lines = lines;
    }
    // View -> Model conversion and related methods
    CoordinatesConverter.prototype.convertViewPositionToModelPosition = function (viewPosition) {
        return this._lines.convertViewPositionToModelPosition(viewPosition.lineNumber, viewPosition.column);
    };
    CoordinatesConverter.prototype.convertViewRangeToModelRange = function (viewRange) {
        var start = this._lines.convertViewPositionToModelPosition(viewRange.startLineNumber, viewRange.startColumn);
        var end = this._lines.convertViewPositionToModelPosition(viewRange.endLineNumber, viewRange.endColumn);
        return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    };
    CoordinatesConverter.prototype.validateViewPosition = function (viewPosition, expectedModelPosition) {
        return this._lines.validateViewPosition(viewPosition.lineNumber, viewPosition.column, expectedModelPosition);
    };
    CoordinatesConverter.prototype.validateViewRange = function (viewRange, expectedModelRange) {
        var validViewStart = this._lines.validateViewPosition(viewRange.startLineNumber, viewRange.startColumn, expectedModelRange.getStartPosition());
        var validViewEnd = this._lines.validateViewPosition(viewRange.endLineNumber, viewRange.endColumn, expectedModelRange.getEndPosition());
        return new Range(validViewStart.lineNumber, validViewStart.column, validViewEnd.lineNumber, validViewEnd.column);
    };
    // Model -> View conversion and related methods
    CoordinatesConverter.prototype.convertModelPositionToViewPosition = function (modelPosition) {
        return this._lines.convertModelPositionToViewPosition(modelPosition.lineNumber, modelPosition.column);
    };
    CoordinatesConverter.prototype.convertModelRangeToViewRange = function (modelRange) {
        var start = this._lines.convertModelPositionToViewPosition(modelRange.startLineNumber, modelRange.startColumn);
        var end = this._lines.convertModelPositionToViewPosition(modelRange.endLineNumber, modelRange.endColumn);
        return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    };
    CoordinatesConverter.prototype.modelPositionIsVisible = function (modelPosition) {
        return this._lines.modelPositionIsVisible(modelPosition.lineNumber, modelPosition.column);
    };
    return CoordinatesConverter;
}());
export { CoordinatesConverter };
var SplitLinesCollection = /** @class */ (function () {
    function SplitLinesCollection(model, linePositionMapperFactory, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent) {
        this.model = model;
        this._validModelVersionId = -1;
        this.tabSize = tabSize;
        this.wrappingColumn = wrappingColumn;
        this.columnsForFullWidthChar = columnsForFullWidthChar;
        this.wrappingIndent = wrappingIndent;
        this.linePositionMapperFactory = linePositionMapperFactory;
        this._constructLines(true);
    }
    SplitLinesCollection.prototype.dispose = function () {
        this.hiddenAreasIds = this.model.deltaDecorations(this.hiddenAreasIds, []);
    };
    SplitLinesCollection.prototype.createCoordinatesConverter = function () {
        return new CoordinatesConverter(this);
    };
    SplitLinesCollection.prototype._ensureValidState = function () {
        var modelVersion = this.model.getVersionId();
        if (modelVersion !== this._validModelVersionId) {
            // This is pretty bad, it means we lost track of the model...
            throw new Error("ViewModel is out of sync with Model!");
        }
        if (this.lines.length !== this.model.getLineCount()) {
            // This is pretty bad, it means we lost track of the model...
            this._constructLines(false);
        }
    };
    SplitLinesCollection.prototype._constructLines = function (resetHiddenAreas) {
        var _this = this;
        this.lines = [];
        if (resetHiddenAreas) {
            this.hiddenAreasIds = [];
        }
        var linesContent = this.model.getLinesContent();
        var lineCount = linesContent.length;
        var values = new Uint32Array(lineCount);
        var hiddenAreas = this.hiddenAreasIds.map(function (areaId) { return _this.model.getDecorationRange(areaId); }).sort(Range.compareRangesUsingStarts);
        var hiddenAreaStart = 1, hiddenAreaEnd = 0;
        var hiddenAreaIdx = -1;
        var nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : lineCount + 2;
        for (var i = 0; i < lineCount; i++) {
            var lineNumber = i + 1;
            if (lineNumber === nextLineNumberToUpdateHiddenArea) {
                hiddenAreaIdx++;
                hiddenAreaStart = hiddenAreas[hiddenAreaIdx].startLineNumber;
                hiddenAreaEnd = hiddenAreas[hiddenAreaIdx].endLineNumber;
                nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : lineCount + 2;
            }
            var isInHiddenArea = (lineNumber >= hiddenAreaStart && lineNumber <= hiddenAreaEnd);
            var line = createSplitLine(this.linePositionMapperFactory, linesContent[i], this.tabSize, this.wrappingColumn, this.columnsForFullWidthChar, this.wrappingIndent, !isInHiddenArea);
            values[i] = line.getViewLineCount();
            this.lines[i] = line;
        }
        this._validModelVersionId = this.model.getVersionId();
        this.prefixSumComputer = new PrefixSumComputerWithCache(values);
    };
    SplitLinesCollection.prototype.getHiddenAreas = function () {
        var _this = this;
        return this.hiddenAreasIds.map(function (decId) {
            return _this.model.getDecorationRange(decId);
        });
    };
    SplitLinesCollection.prototype._reduceRanges = function (_ranges) {
        var _this = this;
        if (_ranges.length === 0) {
            return [];
        }
        var ranges = _ranges.map(function (r) { return _this.model.validateRange(r); }).sort(Range.compareRangesUsingStarts);
        var result = [];
        var currentRangeStart = ranges[0].startLineNumber;
        var currentRangeEnd = ranges[0].endLineNumber;
        for (var i = 1, len = ranges.length; i < len; i++) {
            var range = ranges[i];
            if (range.startLineNumber > currentRangeEnd + 1) {
                result.push(new Range(currentRangeStart, 1, currentRangeEnd, 1));
                currentRangeStart = range.startLineNumber;
                currentRangeEnd = range.endLineNumber;
            }
            else if (range.endLineNumber > currentRangeEnd) {
                currentRangeEnd = range.endLineNumber;
            }
        }
        result.push(new Range(currentRangeStart, 1, currentRangeEnd, 1));
        return result;
    };
    SplitLinesCollection.prototype.setHiddenAreas = function (_ranges) {
        var _this = this;
        var newRanges = this._reduceRanges(_ranges);
        // BEGIN TODO@Martin: Please stop calling this method on each model change!
        var oldRanges = this.hiddenAreasIds.map(function (areaId) { return _this.model.getDecorationRange(areaId); }).sort(Range.compareRangesUsingStarts);
        if (newRanges.length === oldRanges.length) {
            var hasDifference = false;
            for (var i = 0; i < newRanges.length; i++) {
                if (!newRanges[i].equalsRange(oldRanges[i])) {
                    hasDifference = true;
                    break;
                }
            }
            if (!hasDifference) {
                return false;
            }
        }
        // END TODO@Martin: Please stop calling this method on each model change!
        var newDecorations = [];
        for (var i = 0; i < newRanges.length; i++) {
            newDecorations.push({
                range: newRanges[i],
                options: ModelDecorationOptions.EMPTY
            });
        }
        this.hiddenAreasIds = this.model.deltaDecorations(this.hiddenAreasIds, newDecorations);
        var hiddenAreas = newRanges;
        var hiddenAreaStart = 1, hiddenAreaEnd = 0;
        var hiddenAreaIdx = -1;
        var nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : this.lines.length + 2;
        var hasVisibleLine = false;
        for (var i = 0; i < this.lines.length; i++) {
            var lineNumber = i + 1;
            if (lineNumber === nextLineNumberToUpdateHiddenArea) {
                hiddenAreaIdx++;
                hiddenAreaStart = hiddenAreas[hiddenAreaIdx].startLineNumber;
                hiddenAreaEnd = hiddenAreas[hiddenAreaIdx].endLineNumber;
                nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : this.lines.length + 2;
            }
            var lineChanged = false;
            if (lineNumber >= hiddenAreaStart && lineNumber <= hiddenAreaEnd) {
                // Line should be hidden
                if (this.lines[i].isVisible()) {
                    this.lines[i] = this.lines[i].setVisible(false);
                    lineChanged = true;
                }
            }
            else {
                hasVisibleLine = true;
                // Line should be visible
                if (!this.lines[i].isVisible()) {
                    this.lines[i] = this.lines[i].setVisible(true);
                    lineChanged = true;
                }
            }
            if (lineChanged) {
                var newOutputLineCount = this.lines[i].getViewLineCount();
                this.prefixSumComputer.changeValue(i, newOutputLineCount);
            }
        }
        if (!hasVisibleLine) {
            // Cannot have everything be hidden => reveal everything!
            this.setHiddenAreas([]);
        }
        return true;
    };
    SplitLinesCollection.prototype.modelPositionIsVisible = function (modelLineNumber, _modelColumn) {
        if (modelLineNumber < 1 || modelLineNumber > this.lines.length) {
            // invalid arguments
            return false;
        }
        return this.lines[modelLineNumber - 1].isVisible();
    };
    SplitLinesCollection.prototype.setTabSize = function (newTabSize) {
        if (this.tabSize === newTabSize) {
            return false;
        }
        this.tabSize = newTabSize;
        this._constructLines(false);
        return true;
    };
    SplitLinesCollection.prototype.setWrappingSettings = function (wrappingIndent, wrappingColumn, columnsForFullWidthChar) {
        if (this.wrappingIndent === wrappingIndent && this.wrappingColumn === wrappingColumn && this.columnsForFullWidthChar === columnsForFullWidthChar) {
            return false;
        }
        this.wrappingIndent = wrappingIndent;
        this.wrappingColumn = wrappingColumn;
        this.columnsForFullWidthChar = columnsForFullWidthChar;
        this._constructLines(false);
        return true;
    };
    SplitLinesCollection.prototype.onModelFlushed = function () {
        this._constructLines(true);
    };
    SplitLinesCollection.prototype.onModelLinesDeleted = function (versionId, fromLineNumber, toLineNumber) {
        if (versionId <= this._validModelVersionId) {
            // Here we check for versionId in case the lines were reconstructed in the meantime.
            // We don't want to apply stale change events on top of a newer read model state.
            return null;
        }
        var outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(fromLineNumber - 2) + 1);
        var outputToLineNumber = this.prefixSumComputer.getAccumulatedValue(toLineNumber - 1);
        this.lines.splice(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);
        this.prefixSumComputer.removeValues(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);
        return new viewEvents.ViewLinesDeletedEvent(outputFromLineNumber, outputToLineNumber);
    };
    SplitLinesCollection.prototype.onModelLinesInserted = function (versionId, fromLineNumber, _toLineNumber, text) {
        if (versionId <= this._validModelVersionId) {
            // Here we check for versionId in case the lines were reconstructed in the meantime.
            // We don't want to apply stale change events on top of a newer read model state.
            return null;
        }
        var hiddenAreas = this.getHiddenAreas();
        var isInHiddenArea = false;
        var testPosition = new Position(fromLineNumber, 1);
        for (var i = 0; i < hiddenAreas.length; i++) {
            if (hiddenAreas[i].containsPosition(testPosition)) {
                isInHiddenArea = true;
                break;
            }
        }
        var outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(fromLineNumber - 2) + 1);
        var totalOutputLineCount = 0;
        var insertLines = [];
        var insertPrefixSumValues = new Uint32Array(text.length);
        for (var i = 0, len = text.length; i < len; i++) {
            var line = createSplitLine(this.linePositionMapperFactory, text[i], this.tabSize, this.wrappingColumn, this.columnsForFullWidthChar, this.wrappingIndent, !isInHiddenArea);
            insertLines.push(line);
            var outputLineCount = line.getViewLineCount();
            totalOutputLineCount += outputLineCount;
            insertPrefixSumValues[i] = outputLineCount;
        }
        // TODO@Alex: use arrays.arrayInsert
        this.lines = this.lines.slice(0, fromLineNumber - 1).concat(insertLines).concat(this.lines.slice(fromLineNumber - 1));
        this.prefixSumComputer.insertValues(fromLineNumber - 1, insertPrefixSumValues);
        return new viewEvents.ViewLinesInsertedEvent(outputFromLineNumber, outputFromLineNumber + totalOutputLineCount - 1);
    };
    SplitLinesCollection.prototype.onModelLineChanged = function (versionId, lineNumber, newText) {
        if (versionId <= this._validModelVersionId) {
            // Here we check for versionId in case the lines were reconstructed in the meantime.
            // We don't want to apply stale change events on top of a newer read model state.
            return [false, null, null, null];
        }
        var lineIndex = lineNumber - 1;
        var oldOutputLineCount = this.lines[lineIndex].getViewLineCount();
        var isVisible = this.lines[lineIndex].isVisible();
        var line = createSplitLine(this.linePositionMapperFactory, newText, this.tabSize, this.wrappingColumn, this.columnsForFullWidthChar, this.wrappingIndent, isVisible);
        this.lines[lineIndex] = line;
        var newOutputLineCount = this.lines[lineIndex].getViewLineCount();
        var lineMappingChanged = false;
        var changeFrom = 0;
        var changeTo = -1;
        var insertFrom = 0;
        var insertTo = -1;
        var deleteFrom = 0;
        var deleteTo = -1;
        if (oldOutputLineCount > newOutputLineCount) {
            changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
            changeTo = changeFrom + newOutputLineCount - 1;
            deleteFrom = changeTo + 1;
            deleteTo = deleteFrom + (oldOutputLineCount - newOutputLineCount) - 1;
            lineMappingChanged = true;
        }
        else if (oldOutputLineCount < newOutputLineCount) {
            changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
            changeTo = changeFrom + oldOutputLineCount - 1;
            insertFrom = changeTo + 1;
            insertTo = insertFrom + (newOutputLineCount - oldOutputLineCount) - 1;
            lineMappingChanged = true;
        }
        else {
            changeFrom = (lineNumber === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(lineNumber - 2) + 1);
            changeTo = changeFrom + newOutputLineCount - 1;
        }
        this.prefixSumComputer.changeValue(lineIndex, newOutputLineCount);
        var viewLinesChangedEvent = (changeFrom <= changeTo ? new viewEvents.ViewLinesChangedEvent(changeFrom, changeTo) : null);
        var viewLinesInsertedEvent = (insertFrom <= insertTo ? new viewEvents.ViewLinesInsertedEvent(insertFrom, insertTo) : null);
        var viewLinesDeletedEvent = (deleteFrom <= deleteTo ? new viewEvents.ViewLinesDeletedEvent(deleteFrom, deleteTo) : null);
        return [lineMappingChanged, viewLinesChangedEvent, viewLinesInsertedEvent, viewLinesDeletedEvent];
    };
    SplitLinesCollection.prototype.acceptVersionId = function (versionId) {
        this._validModelVersionId = versionId;
        if (this.lines.length === 1 && !this.lines[0].isVisible()) {
            // At least one line must be visible => reset hidden areas
            this.setHiddenAreas([]);
        }
    };
    SplitLinesCollection.prototype.getViewLineCount = function () {
        this._ensureValidState();
        return this.prefixSumComputer.getTotalValue();
    };
    SplitLinesCollection.prototype._toValidViewLineNumber = function (viewLineNumber) {
        if (viewLineNumber < 1) {
            return 1;
        }
        var viewLineCount = this.getViewLineCount();
        if (viewLineNumber > viewLineCount) {
            return viewLineCount;
        }
        return viewLineNumber;
    };
    /**
     * Gives a hint that a lot of requests are about to come in for these line numbers.
     */
    SplitLinesCollection.prototype.warmUpLookupCache = function (viewStartLineNumber, viewEndLineNumber) {
        this.prefixSumComputer.warmUpCache(viewStartLineNumber - 1, viewEndLineNumber - 1);
    };
    SplitLinesCollection.prototype.getActiveIndentGuide = function (viewLineNumber, minLineNumber, maxLineNumber) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        minLineNumber = this._toValidViewLineNumber(minLineNumber);
        maxLineNumber = this._toValidViewLineNumber(maxLineNumber);
        var modelPosition = this.convertViewPositionToModelPosition(viewLineNumber, this.getViewLineMinColumn(viewLineNumber));
        var modelMinPosition = this.convertViewPositionToModelPosition(minLineNumber, this.getViewLineMinColumn(minLineNumber));
        var modelMaxPosition = this.convertViewPositionToModelPosition(maxLineNumber, this.getViewLineMinColumn(maxLineNumber));
        var result = this.model.getActiveIndentGuide(modelPosition.lineNumber, modelMinPosition.lineNumber, modelMaxPosition.lineNumber);
        var viewStartPosition = this.convertModelPositionToViewPosition(result.startLineNumber, 1);
        var viewEndPosition = this.convertModelPositionToViewPosition(result.endLineNumber, this.model.getLineMaxColumn(result.endLineNumber));
        return {
            startLineNumber: viewStartPosition.lineNumber,
            endLineNumber: viewEndPosition.lineNumber,
            indent: result.indent
        };
    };
    SplitLinesCollection.prototype.getViewLinesIndentGuides = function (viewStartLineNumber, viewEndLineNumber) {
        this._ensureValidState();
        viewStartLineNumber = this._toValidViewLineNumber(viewStartLineNumber);
        viewEndLineNumber = this._toValidViewLineNumber(viewEndLineNumber);
        var modelStart = this.convertViewPositionToModelPosition(viewStartLineNumber, this.getViewLineMinColumn(viewStartLineNumber));
        var modelEnd = this.convertViewPositionToModelPosition(viewEndLineNumber, this.getViewLineMaxColumn(viewEndLineNumber));
        var result = [];
        var resultRepeatCount = [];
        var resultRepeatOption = [];
        var modelStartLineIndex = modelStart.lineNumber - 1;
        var modelEndLineIndex = modelEnd.lineNumber - 1;
        var reqStart = null;
        for (var modelLineIndex = modelStartLineIndex; modelLineIndex <= modelEndLineIndex; modelLineIndex++) {
            var line = this.lines[modelLineIndex];
            if (line.isVisible()) {
                var viewLineStartIndex = line.getViewLineNumberOfModelPosition(0, modelLineIndex === modelStartLineIndex ? modelStart.column : 1);
                var viewLineEndIndex = line.getViewLineNumberOfModelPosition(0, this.model.getLineMaxColumn(modelLineIndex + 1));
                var count = viewLineEndIndex - viewLineStartIndex + 1;
                var option = 0 /* BlockNone */;
                if (count > 1 && line.getViewLineMinColumn(this.model, modelLineIndex + 1, viewLineEndIndex) === 1) {
                    // wrapped lines should block indent guides
                    option = (viewLineStartIndex === 0 ? 1 /* BlockSubsequent */ : 2 /* BlockAll */);
                }
                resultRepeatCount.push(count);
                resultRepeatOption.push(option);
                // merge into previous request
                if (reqStart === null) {
                    reqStart = new Position(modelLineIndex + 1, 0);
                }
            }
            else {
                // hit invisible line => flush request
                if (reqStart !== null) {
                    result = result.concat(this.model.getLinesIndentGuides(reqStart.lineNumber, modelLineIndex));
                    reqStart = null;
                }
            }
        }
        if (reqStart !== null) {
            result = result.concat(this.model.getLinesIndentGuides(reqStart.lineNumber, modelEnd.lineNumber));
            reqStart = null;
        }
        var viewLineCount = viewEndLineNumber - viewStartLineNumber + 1;
        var viewIndents = new Array(viewLineCount);
        var currIndex = 0;
        for (var i = 0, len = result.length; i < len; i++) {
            var value = result[i];
            var count = Math.min(viewLineCount - currIndex, resultRepeatCount[i]);
            var option = resultRepeatOption[i];
            var blockAtIndex = void 0;
            if (option === 2 /* BlockAll */) {
                blockAtIndex = 0;
            }
            else if (option === 1 /* BlockSubsequent */) {
                blockAtIndex = 1;
            }
            else {
                blockAtIndex = count;
            }
            for (var j = 0; j < count; j++) {
                if (j === blockAtIndex) {
                    value = 0;
                }
                viewIndents[currIndex++] = value;
            }
        }
        return viewIndents;
    };
    SplitLinesCollection.prototype.getViewLineContent = function (viewLineNumber) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineContent(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineLength = function (viewLineNumber) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineLength(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineMinColumn = function (viewLineNumber) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineMinColumn(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineMaxColumn = function (viewLineNumber) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineMaxColumn(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLineData = function (viewLineNumber) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        return this.lines[lineIndex].getViewLineData(this.model, lineIndex + 1, remainder);
    };
    SplitLinesCollection.prototype.getViewLinesData = function (viewStartLineNumber, viewEndLineNumber, needed) {
        this._ensureValidState();
        viewStartLineNumber = this._toValidViewLineNumber(viewStartLineNumber);
        viewEndLineNumber = this._toValidViewLineNumber(viewEndLineNumber);
        var start = this.prefixSumComputer.getIndexOf(viewStartLineNumber - 1);
        var viewLineNumber = viewStartLineNumber;
        var startModelLineIndex = start.index;
        var startRemainder = start.remainder;
        var result = [];
        for (var modelLineIndex = startModelLineIndex, len = this.model.getLineCount(); modelLineIndex < len; modelLineIndex++) {
            var line = this.lines[modelLineIndex];
            if (!line.isVisible()) {
                continue;
            }
            var fromViewLineIndex = (modelLineIndex === startModelLineIndex ? startRemainder : 0);
            var remainingViewLineCount = line.getViewLineCount() - fromViewLineIndex;
            var lastLine = false;
            if (viewLineNumber + remainingViewLineCount > viewEndLineNumber) {
                lastLine = true;
                remainingViewLineCount = viewEndLineNumber - viewLineNumber + 1;
            }
            var toViewLineIndex = fromViewLineIndex + remainingViewLineCount;
            line.getViewLinesData(this.model, modelLineIndex + 1, fromViewLineIndex, toViewLineIndex, viewLineNumber - viewStartLineNumber, needed, result);
            viewLineNumber += remainingViewLineCount;
            if (lastLine) {
                break;
            }
        }
        return result;
    };
    SplitLinesCollection.prototype.validateViewPosition = function (viewLineNumber, viewColumn, expectedModelPosition) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        var line = this.lines[lineIndex];
        var minColumn = line.getViewLineMinColumn(this.model, lineIndex + 1, remainder);
        var maxColumn = line.getViewLineMaxColumn(this.model, lineIndex + 1, remainder);
        if (viewColumn < minColumn) {
            viewColumn = minColumn;
        }
        if (viewColumn > maxColumn) {
            viewColumn = maxColumn;
        }
        var computedModelColumn = line.getModelColumnOfViewPosition(remainder, viewColumn);
        var computedModelPosition = this.model.validatePosition(new Position(lineIndex + 1, computedModelColumn));
        if (computedModelPosition.equals(expectedModelPosition)) {
            return new Position(viewLineNumber, viewColumn);
        }
        return this.convertModelPositionToViewPosition(expectedModelPosition.lineNumber, expectedModelPosition.column);
    };
    SplitLinesCollection.prototype.convertViewPositionToModelPosition = function (viewLineNumber, viewColumn) {
        this._ensureValidState();
        viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
        var r = this.prefixSumComputer.getIndexOf(viewLineNumber - 1);
        var lineIndex = r.index;
        var remainder = r.remainder;
        var inputColumn = this.lines[lineIndex].getModelColumnOfViewPosition(remainder, viewColumn);
        // console.log('out -> in ' + viewLineNumber + ',' + viewColumn + ' ===> ' + (lineIndex+1) + ',' + inputColumn);
        return this.model.validatePosition(new Position(lineIndex + 1, inputColumn));
    };
    SplitLinesCollection.prototype.convertModelPositionToViewPosition = function (_modelLineNumber, _modelColumn) {
        this._ensureValidState();
        var validPosition = this.model.validatePosition(new Position(_modelLineNumber, _modelColumn));
        var inputLineNumber = validPosition.lineNumber;
        var inputColumn = validPosition.column;
        var lineIndex = inputLineNumber - 1, lineIndexChanged = false;
        while (lineIndex > 0 && !this.lines[lineIndex].isVisible()) {
            lineIndex--;
            lineIndexChanged = true;
        }
        if (lineIndex === 0 && !this.lines[lineIndex].isVisible()) {
            // Could not reach a real line
            // console.log('in -> out ' + inputLineNumber + ',' + inputColumn + ' ===> ' + 1 + ',' + 1);
            return new Position(1, 1);
        }
        var deltaLineNumber = 1 + (lineIndex === 0 ? 0 : this.prefixSumComputer.getAccumulatedValue(lineIndex - 1));
        var r;
        if (lineIndexChanged) {
            r = this.lines[lineIndex].getViewPositionOfModelPosition(deltaLineNumber, this.model.getLineMaxColumn(lineIndex + 1));
        }
        else {
            r = this.lines[inputLineNumber - 1].getViewPositionOfModelPosition(deltaLineNumber, inputColumn);
        }
        // console.log('in -> out ' + inputLineNumber + ',' + inputColumn + ' ===> ' + r.lineNumber + ',' + r);
        return r;
    };
    SplitLinesCollection.prototype._getViewLineNumberForModelPosition = function (inputLineNumber, inputColumn) {
        var lineIndex = inputLineNumber - 1;
        if (this.lines[lineIndex].isVisible()) {
            // this model line is visible
            var deltaLineNumber_1 = 1 + (lineIndex === 0 ? 0 : this.prefixSumComputer.getAccumulatedValue(lineIndex - 1));
            return this.lines[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber_1, inputColumn);
        }
        // this model line is not visible
        while (lineIndex > 0 && !this.lines[lineIndex].isVisible()) {
            lineIndex--;
        }
        if (lineIndex === 0 && !this.lines[lineIndex].isVisible()) {
            // Could not reach a real line
            return 1;
        }
        var deltaLineNumber = 1 + (lineIndex === 0 ? 0 : this.prefixSumComputer.getAccumulatedValue(lineIndex - 1));
        return this.lines[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber, this.model.getLineMaxColumn(lineIndex + 1));
    };
    SplitLinesCollection.prototype.getAllOverviewRulerDecorations = function (ownerId, filterOutValidation, theme) {
        var decorations = this.model.getOverviewRulerDecorations(ownerId, filterOutValidation);
        var result = new OverviewRulerDecorations();
        for (var i = 0, len = decorations.length; i < len; i++) {
            var decoration = decorations[i];
            var opts = decoration.options.overviewRuler;
            var lane = opts ? opts.position : 0;
            if (lane === 0) {
                continue;
            }
            var color = opts.getColor(theme);
            var viewStartLineNumber = this._getViewLineNumberForModelPosition(decoration.range.startLineNumber, decoration.range.startColumn);
            var viewEndLineNumber = this._getViewLineNumberForModelPosition(decoration.range.endLineNumber, decoration.range.endColumn);
            result.accept(color, viewStartLineNumber, viewEndLineNumber, lane);
        }
        return result.result;
    };
    SplitLinesCollection.prototype.getDecorationsInRange = function (range, ownerId, filterOutValidation) {
        var modelStart = this.convertViewPositionToModelPosition(range.startLineNumber, range.startColumn);
        var modelEnd = this.convertViewPositionToModelPosition(range.endLineNumber, range.endColumn);
        if (modelEnd.lineNumber - modelStart.lineNumber <= range.endLineNumber - range.startLineNumber) {
            // most likely there are no hidden lines => fast path
            // fetch decorations from column 1 to cover the case of wrapped lines that have whole line decorations at column 1
            return this.model.getDecorationsInRange(new Range(modelStart.lineNumber, 1, modelEnd.lineNumber, modelEnd.column), ownerId, filterOutValidation);
        }
        var result = [];
        var modelStartLineIndex = modelStart.lineNumber - 1;
        var modelEndLineIndex = modelEnd.lineNumber - 1;
        var reqStart = null;
        for (var modelLineIndex = modelStartLineIndex; modelLineIndex <= modelEndLineIndex; modelLineIndex++) {
            var line = this.lines[modelLineIndex];
            if (line.isVisible()) {
                // merge into previous request
                if (reqStart === null) {
                    reqStart = new Position(modelLineIndex + 1, modelLineIndex === modelStartLineIndex ? modelStart.column : 1);
                }
            }
            else {
                // hit invisible line => flush request
                if (reqStart !== null) {
                    var maxLineColumn = this.model.getLineMaxColumn(modelLineIndex);
                    result = result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber, reqStart.column, modelLineIndex, maxLineColumn), ownerId, filterOutValidation));
                    reqStart = null;
                }
            }
        }
        if (reqStart !== null) {
            result = result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber, reqStart.column, modelEnd.lineNumber, modelEnd.column), ownerId, filterOutValidation));
            reqStart = null;
        }
        result.sort(function (a, b) {
            var res = Range.compareRangesUsingStarts(a.range, b.range);
            if (res === 0) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            }
            return res;
        });
        // Eliminate duplicate decorations that might have intersected our visible ranges multiple times
        var finalResult = [], finalResultLen = 0;
        var prevDecId = null;
        for (var i = 0, len = result.length; i < len; i++) {
            var dec = result[i];
            var decId = dec.id;
            if (prevDecId === decId) {
                // skip
                continue;
            }
            prevDecId = decId;
            finalResult[finalResultLen++] = dec;
        }
        return finalResult;
    };
    return SplitLinesCollection;
}());
export { SplitLinesCollection };
var VisibleIdentitySplitLine = /** @class */ (function () {
    function VisibleIdentitySplitLine() {
    }
    VisibleIdentitySplitLine.prototype.isVisible = function () {
        return true;
    };
    VisibleIdentitySplitLine.prototype.setVisible = function (isVisible) {
        if (isVisible) {
            return this;
        }
        return InvisibleIdentitySplitLine.INSTANCE;
    };
    VisibleIdentitySplitLine.prototype.getViewLineCount = function () {
        return 1;
    };
    VisibleIdentitySplitLine.prototype.getViewLineContent = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineContent(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineLength = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineLength(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineMinColumn = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineMinColumn(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineMaxColumn = function (model, modelLineNumber, _outputLineIndex) {
        return model.getLineMaxColumn(modelLineNumber);
    };
    VisibleIdentitySplitLine.prototype.getViewLineData = function (model, modelLineNumber, _outputLineIndex) {
        var lineTokens = model.getLineTokens(modelLineNumber);
        var lineContent = lineTokens.getLineContent();
        return new ViewLineData(lineContent, false, 1, lineContent.length + 1, lineTokens.inflate());
    };
    VisibleIdentitySplitLine.prototype.getViewLinesData = function (model, modelLineNumber, _fromOuputLineIndex, _toOutputLineIndex, globalStartIndex, needed, result) {
        if (!needed[globalStartIndex]) {
            result[globalStartIndex] = null;
            return;
        }
        result[globalStartIndex] = this.getViewLineData(model, modelLineNumber, 0);
    };
    VisibleIdentitySplitLine.prototype.getModelColumnOfViewPosition = function (_outputLineIndex, outputColumn) {
        return outputColumn;
    };
    VisibleIdentitySplitLine.prototype.getViewPositionOfModelPosition = function (deltaLineNumber, inputColumn) {
        return new Position(deltaLineNumber, inputColumn);
    };
    VisibleIdentitySplitLine.prototype.getViewLineNumberOfModelPosition = function (deltaLineNumber, _inputColumn) {
        return deltaLineNumber;
    };
    VisibleIdentitySplitLine.INSTANCE = new VisibleIdentitySplitLine();
    return VisibleIdentitySplitLine;
}());
var InvisibleIdentitySplitLine = /** @class */ (function () {
    function InvisibleIdentitySplitLine() {
    }
    InvisibleIdentitySplitLine.prototype.isVisible = function () {
        return false;
    };
    InvisibleIdentitySplitLine.prototype.setVisible = function (isVisible) {
        if (!isVisible) {
            return this;
        }
        return VisibleIdentitySplitLine.INSTANCE;
    };
    InvisibleIdentitySplitLine.prototype.getViewLineCount = function () {
        return 0;
    };
    InvisibleIdentitySplitLine.prototype.getViewLineContent = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineLength = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineMinColumn = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineMaxColumn = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineData = function (_model, _modelLineNumber, _outputLineIndex) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLinesData = function (_model, _modelLineNumber, _fromOuputLineIndex, _toOutputLineIndex, _globalStartIndex, _needed, _result) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getModelColumnOfViewPosition = function (_outputLineIndex, _outputColumn) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewPositionOfModelPosition = function (_deltaLineNumber, _inputColumn) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.prototype.getViewLineNumberOfModelPosition = function (_deltaLineNumber, _inputColumn) {
        throw new Error('Not supported');
    };
    InvisibleIdentitySplitLine.INSTANCE = new InvisibleIdentitySplitLine();
    return InvisibleIdentitySplitLine;
}());
var SplitLine = /** @class */ (function () {
    function SplitLine(positionMapper, isVisible) {
        this.positionMapper = positionMapper;
        this.wrappedIndent = this.positionMapper.getWrappedLinesIndent();
        this.wrappedIndentLength = this.wrappedIndent.length;
        this.outputLineCount = this.positionMapper.getOutputLineCount();
        this._isVisible = isVisible;
    }
    SplitLine.prototype.isVisible = function () {
        return this._isVisible;
    };
    SplitLine.prototype.setVisible = function (isVisible) {
        this._isVisible = isVisible;
        return this;
    };
    SplitLine.prototype.getViewLineCount = function () {
        if (!this._isVisible) {
            return 0;
        }
        return this.outputLineCount;
    };
    SplitLine.prototype.getInputStartOffsetOfOutputLineIndex = function (outputLineIndex) {
        return this.positionMapper.getInputOffsetOfOutputPosition(outputLineIndex, 0);
    };
    SplitLine.prototype.getInputEndOffsetOfOutputLineIndex = function (model, modelLineNumber, outputLineIndex) {
        if (outputLineIndex + 1 === this.outputLineCount) {
            return model.getLineMaxColumn(modelLineNumber) - 1;
        }
        return this.positionMapper.getInputOffsetOfOutputPosition(outputLineIndex + 1, 0);
    };
    SplitLine.prototype.getViewLineContent = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
        var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, modelLineNumber, outputLineIndex);
        var r = model.getValueInRange({
            startLineNumber: modelLineNumber,
            startColumn: startOffset + 1,
            endLineNumber: modelLineNumber,
            endColumn: endOffset + 1
        });
        if (outputLineIndex > 0) {
            r = this.wrappedIndent + r;
        }
        return r;
    };
    SplitLine.prototype.getViewLineLength = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
        var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, modelLineNumber, outputLineIndex);
        var r = endOffset - startOffset;
        if (outputLineIndex > 0) {
            r = this.wrappedIndent.length + r;
        }
        return r;
    };
    SplitLine.prototype.getViewLineMinColumn = function (_model, _modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        if (outputLineIndex > 0) {
            return this.wrappedIndentLength + 1;
        }
        return 1;
    };
    SplitLine.prototype.getViewLineMaxColumn = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        return this.getViewLineContent(model, modelLineNumber, outputLineIndex).length + 1;
    };
    SplitLine.prototype.getViewLineData = function (model, modelLineNumber, outputLineIndex) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var startOffset = this.getInputStartOffsetOfOutputLineIndex(outputLineIndex);
        var endOffset = this.getInputEndOffsetOfOutputLineIndex(model, modelLineNumber, outputLineIndex);
        var lineContent = model.getValueInRange({
            startLineNumber: modelLineNumber,
            startColumn: startOffset + 1,
            endLineNumber: modelLineNumber,
            endColumn: endOffset + 1
        });
        if (outputLineIndex > 0) {
            lineContent = this.wrappedIndent + lineContent;
        }
        var minColumn = (outputLineIndex > 0 ? this.wrappedIndentLength + 1 : 1);
        var maxColumn = lineContent.length + 1;
        var continuesWithWrappedLine = (outputLineIndex + 1 < this.getViewLineCount());
        var deltaStartIndex = 0;
        if (outputLineIndex > 0) {
            deltaStartIndex = this.wrappedIndentLength;
        }
        var lineTokens = model.getLineTokens(modelLineNumber);
        return new ViewLineData(lineContent, continuesWithWrappedLine, minColumn, maxColumn, lineTokens.sliceAndInflate(startOffset, endOffset, deltaStartIndex));
    };
    SplitLine.prototype.getViewLinesData = function (model, modelLineNumber, fromOuputLineIndex, toOutputLineIndex, globalStartIndex, needed, result) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        for (var outputLineIndex = fromOuputLineIndex; outputLineIndex < toOutputLineIndex; outputLineIndex++) {
            var globalIndex = globalStartIndex + outputLineIndex - fromOuputLineIndex;
            if (!needed[globalIndex]) {
                result[globalIndex] = null;
                continue;
            }
            result[globalIndex] = this.getViewLineData(model, modelLineNumber, outputLineIndex);
        }
    };
    SplitLine.prototype.getModelColumnOfViewPosition = function (outputLineIndex, outputColumn) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var adjustedColumn = outputColumn - 1;
        if (outputLineIndex > 0) {
            if (adjustedColumn < this.wrappedIndentLength) {
                adjustedColumn = 0;
            }
            else {
                adjustedColumn -= this.wrappedIndentLength;
            }
        }
        return this.positionMapper.getInputOffsetOfOutputPosition(outputLineIndex, adjustedColumn) + 1;
    };
    SplitLine.prototype.getViewPositionOfModelPosition = function (deltaLineNumber, inputColumn) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var r = this.positionMapper.getOutputPositionOfInputOffset(inputColumn - 1);
        var outputLineIndex = r.outputLineIndex;
        var outputColumn = r.outputOffset + 1;
        if (outputLineIndex > 0) {
            outputColumn += this.wrappedIndentLength;
        }
        //		console.log('in -> out ' + deltaLineNumber + ',' + inputColumn + ' ===> ' + (deltaLineNumber+outputLineIndex) + ',' + outputColumn);
        return new Position(deltaLineNumber + outputLineIndex, outputColumn);
    };
    SplitLine.prototype.getViewLineNumberOfModelPosition = function (deltaLineNumber, inputColumn) {
        if (!this._isVisible) {
            throw new Error('Not supported');
        }
        var r = this.positionMapper.getOutputPositionOfInputOffset(inputColumn - 1);
        return (deltaLineNumber + r.outputLineIndex);
    };
    return SplitLine;
}());
export { SplitLine };
function createSplitLine(linePositionMapperFactory, text, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent, isVisible) {
    var positionMapper = linePositionMapperFactory.createLineMapping(text, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent);
    if (positionMapper === null) {
        // No mapping needed
        if (isVisible) {
            return VisibleIdentitySplitLine.INSTANCE;
        }
        return InvisibleIdentitySplitLine.INSTANCE;
    }
    else {
        return new SplitLine(positionMapper, isVisible);
    }
}
var IdentityCoordinatesConverter = /** @class */ (function () {
    function IdentityCoordinatesConverter(lines) {
        this._lines = lines;
    }
    IdentityCoordinatesConverter.prototype._validPosition = function (pos) {
        return this._lines.model.validatePosition(pos);
    };
    IdentityCoordinatesConverter.prototype._validRange = function (range) {
        return this._lines.model.validateRange(range);
    };
    // View -> Model conversion and related methods
    IdentityCoordinatesConverter.prototype.convertViewPositionToModelPosition = function (viewPosition) {
        return this._validPosition(viewPosition);
    };
    IdentityCoordinatesConverter.prototype.convertViewRangeToModelRange = function (viewRange) {
        return this._validRange(viewRange);
    };
    IdentityCoordinatesConverter.prototype.validateViewPosition = function (_viewPosition, expectedModelPosition) {
        return this._validPosition(expectedModelPosition);
    };
    IdentityCoordinatesConverter.prototype.validateViewRange = function (_viewRange, expectedModelRange) {
        return this._validRange(expectedModelRange);
    };
    // Model -> View conversion and related methods
    IdentityCoordinatesConverter.prototype.convertModelPositionToViewPosition = function (modelPosition) {
        return this._validPosition(modelPosition);
    };
    IdentityCoordinatesConverter.prototype.convertModelRangeToViewRange = function (modelRange) {
        return this._validRange(modelRange);
    };
    IdentityCoordinatesConverter.prototype.modelPositionIsVisible = function (modelPosition) {
        var lineCount = this._lines.model.getLineCount();
        if (modelPosition.lineNumber < 1 || modelPosition.lineNumber > lineCount) {
            // invalid arguments
            return false;
        }
        return true;
    };
    return IdentityCoordinatesConverter;
}());
export { IdentityCoordinatesConverter };
var IdentityLinesCollection = /** @class */ (function () {
    function IdentityLinesCollection(model) {
        this.model = model;
    }
    IdentityLinesCollection.prototype.dispose = function () {
    };
    IdentityLinesCollection.prototype.createCoordinatesConverter = function () {
        return new IdentityCoordinatesConverter(this);
    };
    IdentityLinesCollection.prototype.getHiddenAreas = function () {
        return [];
    };
    IdentityLinesCollection.prototype.setHiddenAreas = function (_ranges) {
        return false;
    };
    IdentityLinesCollection.prototype.setTabSize = function (_newTabSize) {
        return false;
    };
    IdentityLinesCollection.prototype.setWrappingSettings = function (_wrappingIndent, _wrappingColumn, _columnsForFullWidthChar) {
        return false;
    };
    IdentityLinesCollection.prototype.onModelFlushed = function () {
    };
    IdentityLinesCollection.prototype.onModelLinesDeleted = function (_versionId, fromLineNumber, toLineNumber) {
        return new viewEvents.ViewLinesDeletedEvent(fromLineNumber, toLineNumber);
    };
    IdentityLinesCollection.prototype.onModelLinesInserted = function (_versionId, fromLineNumber, toLineNumber, _text) {
        return new viewEvents.ViewLinesInsertedEvent(fromLineNumber, toLineNumber);
    };
    IdentityLinesCollection.prototype.onModelLineChanged = function (_versionId, lineNumber, _newText) {
        return [false, new viewEvents.ViewLinesChangedEvent(lineNumber, lineNumber), null, null];
    };
    IdentityLinesCollection.prototype.acceptVersionId = function (_versionId) {
    };
    IdentityLinesCollection.prototype.getViewLineCount = function () {
        return this.model.getLineCount();
    };
    IdentityLinesCollection.prototype.warmUpLookupCache = function (_viewStartLineNumber, _viewEndLineNumber) {
    };
    IdentityLinesCollection.prototype.getActiveIndentGuide = function (viewLineNumber, _minLineNumber, _maxLineNumber) {
        return {
            startLineNumber: viewLineNumber,
            endLineNumber: viewLineNumber,
            indent: 0
        };
    };
    IdentityLinesCollection.prototype.getViewLinesIndentGuides = function (viewStartLineNumber, viewEndLineNumber) {
        var viewLineCount = viewEndLineNumber - viewStartLineNumber + 1;
        var result = new Array(viewLineCount);
        for (var i = 0; i < viewLineCount; i++) {
            result[i] = 0;
        }
        return result;
    };
    IdentityLinesCollection.prototype.getViewLineContent = function (viewLineNumber) {
        return this.model.getLineContent(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineLength = function (viewLineNumber) {
        return this.model.getLineLength(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineMinColumn = function (viewLineNumber) {
        return this.model.getLineMinColumn(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineMaxColumn = function (viewLineNumber) {
        return this.model.getLineMaxColumn(viewLineNumber);
    };
    IdentityLinesCollection.prototype.getViewLineData = function (viewLineNumber) {
        var lineTokens = this.model.getLineTokens(viewLineNumber);
        var lineContent = lineTokens.getLineContent();
        return new ViewLineData(lineContent, false, 1, lineContent.length + 1, lineTokens.inflate());
    };
    IdentityLinesCollection.prototype.getViewLinesData = function (viewStartLineNumber, viewEndLineNumber, needed) {
        var lineCount = this.model.getLineCount();
        viewStartLineNumber = Math.min(Math.max(1, viewStartLineNumber), lineCount);
        viewEndLineNumber = Math.min(Math.max(1, viewEndLineNumber), lineCount);
        var result = [];
        for (var lineNumber = viewStartLineNumber; lineNumber <= viewEndLineNumber; lineNumber++) {
            var idx = lineNumber - viewStartLineNumber;
            if (!needed[idx]) {
                result[idx] = null;
            }
            result[idx] = this.getViewLineData(lineNumber);
        }
        return result;
    };
    IdentityLinesCollection.prototype.getAllOverviewRulerDecorations = function (ownerId, filterOutValidation, theme) {
        var decorations = this.model.getOverviewRulerDecorations(ownerId, filterOutValidation);
        var result = new OverviewRulerDecorations();
        for (var i = 0, len = decorations.length; i < len; i++) {
            var decoration = decorations[i];
            var opts = decoration.options.overviewRuler;
            var lane = opts ? opts.position : 0;
            if (lane === 0) {
                continue;
            }
            var color = opts.getColor(theme);
            var viewStartLineNumber = decoration.range.startLineNumber;
            var viewEndLineNumber = decoration.range.endLineNumber;
            result.accept(color, viewStartLineNumber, viewEndLineNumber, lane);
        }
        return result.result;
    };
    IdentityLinesCollection.prototype.getDecorationsInRange = function (range, ownerId, filterOutValidation) {
        return this.model.getDecorationsInRange(range, ownerId, filterOutValidation);
    };
    return IdentityLinesCollection;
}());
export { IdentityLinesCollection };
var OverviewRulerDecorations = /** @class */ (function () {
    function OverviewRulerDecorations() {
        this.result = Object.create(null);
    }
    OverviewRulerDecorations.prototype.accept = function (color, startLineNumber, endLineNumber, lane) {
        var prev = this.result[color];
        if (prev) {
            var prevLane = prev[prev.length - 3];
            var prevEndLineNumber = prev[prev.length - 1];
            if (prevLane === lane && prevEndLineNumber + 1 >= startLineNumber) {
                // merge into prev
                if (endLineNumber > prevEndLineNumber) {
                    prev[prev.length - 1] = endLineNumber;
                }
                return;
            }
            // push
            prev.push(lane, startLineNumber, endLineNumber);
        }
        else {
            this.result[color] = [lane, startLineNumber, endLineNumber];
        }
    };
    return OverviewRulerDecorations;
}());
