/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { Range } from '../../common/core/range.js';
import { findFirstInSorted } from '../../../base/common/arrays.js';
var HiddenRangeModel = /** @class */ (function () {
    function HiddenRangeModel(model) {
        var _this = this;
        this._updateEventEmitter = new Emitter();
        this._foldingModel = model;
        this._foldingModelListener = model.onDidChange(function (_) { return _this.updateHiddenRanges(); });
        this._hiddenRanges = [];
        if (model.regions.length) {
            this.updateHiddenRanges();
        }
    }
    Object.defineProperty(HiddenRangeModel.prototype, "onDidChange", {
        get: function () { return this._updateEventEmitter.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HiddenRangeModel.prototype, "hiddenRanges", {
        get: function () { return this._hiddenRanges; },
        enumerable: true,
        configurable: true
    });
    HiddenRangeModel.prototype.updateHiddenRanges = function () {
        var updateHiddenAreas = false;
        var newHiddenAreas = [];
        var i = 0; // index into hidden
        var k = 0;
        var lastCollapsedStart = Number.MAX_VALUE;
        var lastCollapsedEnd = -1;
        var ranges = this._foldingModel.regions;
        for (; i < ranges.length; i++) {
            if (!ranges.isCollapsed(i)) {
                continue;
            }
            var startLineNumber = ranges.getStartLineNumber(i) + 1; // the first line is not hidden
            var endLineNumber = ranges.getEndLineNumber(i);
            if (lastCollapsedStart <= startLineNumber && endLineNumber <= lastCollapsedEnd) {
                // ignore ranges contained in collapsed regions
                continue;
            }
            if (!updateHiddenAreas && k < this._hiddenRanges.length && this._hiddenRanges[k].startLineNumber === startLineNumber && this._hiddenRanges[k].endLineNumber === endLineNumber) {
                // reuse the old ranges
                newHiddenAreas.push(this._hiddenRanges[k]);
                k++;
            }
            else {
                updateHiddenAreas = true;
                newHiddenAreas.push(new Range(startLineNumber, 1, endLineNumber, 1));
            }
            lastCollapsedStart = startLineNumber;
            lastCollapsedEnd = endLineNumber;
        }
        if (updateHiddenAreas || k < this._hiddenRanges.length) {
            this.applyHiddenRanges(newHiddenAreas);
        }
    };
    HiddenRangeModel.prototype.applyMemento = function (state) {
        if (!Array.isArray(state) || state.length === 0) {
            return false;
        }
        var hiddenRanges = [];
        for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
            var r = state_1[_i];
            if (!r.startLineNumber || !r.endLineNumber) {
                return false;
            }
            hiddenRanges.push(new Range(r.startLineNumber + 1, 1, r.endLineNumber, 1));
        }
        this.applyHiddenRanges(hiddenRanges);
        return true;
    };
    /**
     * Collapse state memento, for persistence only, only used if folding model is not yet initialized
     */
    HiddenRangeModel.prototype.getMemento = function () {
        return this._hiddenRanges.map(function (r) { return ({ startLineNumber: r.startLineNumber - 1, endLineNumber: r.endLineNumber }); });
    };
    HiddenRangeModel.prototype.applyHiddenRanges = function (newHiddenAreas) {
        this._hiddenRanges = newHiddenAreas;
        this._updateEventEmitter.fire(newHiddenAreas);
    };
    HiddenRangeModel.prototype.hasRanges = function () {
        return this._hiddenRanges.length > 0;
    };
    HiddenRangeModel.prototype.isHidden = function (line) {
        return findRange(this._hiddenRanges, line) !== null;
    };
    HiddenRangeModel.prototype.adjustSelections = function (selections) {
        var _this = this;
        var hasChanges = false;
        var editorModel = this._foldingModel.textModel;
        var lastRange = null;
        var adjustLine = function (line) {
            if (!lastRange || !isInside(line, lastRange)) {
                lastRange = findRange(_this._hiddenRanges, line);
            }
            if (lastRange) {
                return lastRange.startLineNumber - 1;
            }
            return null;
        };
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            var adjustedStartLine = adjustLine(selection.startLineNumber);
            if (adjustedStartLine) {
                selection = selection.setStartPosition(adjustedStartLine, editorModel.getLineMaxColumn(adjustedStartLine));
                hasChanges = true;
            }
            var adjustedEndLine = adjustLine(selection.endLineNumber);
            if (adjustedEndLine) {
                selection = selection.setEndPosition(adjustedEndLine, editorModel.getLineMaxColumn(adjustedEndLine));
                hasChanges = true;
            }
            selections[i] = selection;
        }
        return hasChanges;
    };
    HiddenRangeModel.prototype.dispose = function () {
        if (this.hiddenRanges.length > 0) {
            this._hiddenRanges = [];
            this._updateEventEmitter.fire(this._hiddenRanges);
        }
        if (this._foldingModelListener) {
            this._foldingModelListener.dispose();
            this._foldingModelListener = null;
        }
    };
    return HiddenRangeModel;
}());
export { HiddenRangeModel };
function isInside(line, range) {
    return line >= range.startLineNumber && line <= range.endLineNumber;
}
function findRange(ranges, line) {
    var i = findFirstInSorted(ranges, function (r) { return line < r.startLineNumber; }) - 1;
    if (i >= 0 && ranges[i].endLineNumber >= line) {
        return ranges[i];
    }
    return null;
}
