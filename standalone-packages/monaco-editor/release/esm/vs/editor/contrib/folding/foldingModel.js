/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { FoldingRegions } from './foldingRanges.js';
var FoldingModel = /** @class */ (function () {
    function FoldingModel(textModel, decorationProvider) {
        this._updateEventEmitter = new Emitter();
        this._textModel = textModel;
        this._decorationProvider = decorationProvider;
        this._regions = new FoldingRegions(new Uint32Array(0), new Uint32Array(0));
        this._editorDecorationIds = [];
        this._isInitialized = false;
    }
    Object.defineProperty(FoldingModel.prototype, "regions", {
        get: function () { return this._regions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldingModel.prototype, "onDidChange", {
        get: function () { return this._updateEventEmitter.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldingModel.prototype, "textModel", {
        get: function () { return this._textModel; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FoldingModel.prototype, "isInitialized", {
        get: function () { return this._isInitialized; },
        enumerable: true,
        configurable: true
    });
    FoldingModel.prototype.toggleCollapseState = function (regions) {
        var _this = this;
        if (!regions.length) {
            return;
        }
        var processed = {};
        this._decorationProvider.changeDecorations(function (accessor) {
            for (var _i = 0, regions_1 = regions; _i < regions_1.length; _i++) {
                var region = regions_1[_i];
                var index = region.regionIndex;
                var editorDecorationId = _this._editorDecorationIds[index];
                if (editorDecorationId && !processed[editorDecorationId]) {
                    processed[editorDecorationId] = true;
                    var newCollapseState = !_this._regions.isCollapsed(index);
                    _this._regions.setCollapsed(index, newCollapseState);
                    accessor.changeDecorationOptions(editorDecorationId, _this._decorationProvider.getDecorationOption(newCollapseState));
                }
            }
        });
        this._updateEventEmitter.fire({ model: this, collapseStateChanged: regions });
    };
    FoldingModel.prototype.update = function (newRegions, blockedLineNumers) {
        var _this = this;
        if (blockedLineNumers === void 0) { blockedLineNumers = []; }
        var newEditorDecorations = [];
        var isBlocked = function (startLineNumber, endLineNumber) {
            for (var _i = 0, blockedLineNumers_1 = blockedLineNumers; _i < blockedLineNumers_1.length; _i++) {
                var blockedLineNumber = blockedLineNumers_1[_i];
                if (startLineNumber < blockedLineNumber && blockedLineNumber <= endLineNumber) { // first line is visible
                    return true;
                }
            }
            return false;
        };
        var initRange = function (index, isCollapsed) {
            var startLineNumber = newRegions.getStartLineNumber(index);
            if (isCollapsed && isBlocked(startLineNumber, newRegions.getEndLineNumber(index))) {
                isCollapsed = false;
            }
            newRegions.setCollapsed(index, isCollapsed);
            var maxColumn = _this._textModel.getLineMaxColumn(startLineNumber);
            var decorationRange = {
                startLineNumber: startLineNumber,
                startColumn: maxColumn,
                endLineNumber: startLineNumber,
                endColumn: maxColumn
            };
            newEditorDecorations.push({ range: decorationRange, options: _this._decorationProvider.getDecorationOption(isCollapsed) });
        };
        var i = 0;
        var nextCollapsed = function () {
            while (i < _this._regions.length) {
                var isCollapsed = _this._regions.isCollapsed(i);
                i++;
                if (isCollapsed) {
                    return i - 1;
                }
            }
            return -1;
        };
        var k = 0;
        var collapsedIndex = nextCollapsed();
        while (collapsedIndex !== -1 && k < newRegions.length) {
            // get the latest range
            var decRange = this._textModel.getDecorationRange(this._editorDecorationIds[collapsedIndex]);
            if (decRange) {
                var collapsedStartLineNumber = decRange.startLineNumber;
                if (this._textModel.getLineMaxColumn(collapsedStartLineNumber) === decRange.startColumn) { // test that the decoration is still at the end otherwise it got deleted
                    while (k < newRegions.length) {
                        var startLineNumber = newRegions.getStartLineNumber(k);
                        if (collapsedStartLineNumber >= startLineNumber) {
                            initRange(k, collapsedStartLineNumber === startLineNumber);
                            k++;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            collapsedIndex = nextCollapsed();
        }
        while (k < newRegions.length) {
            initRange(k, false);
            k++;
        }
        this._editorDecorationIds = this._decorationProvider.deltaDecorations(this._editorDecorationIds, newEditorDecorations);
        this._regions = newRegions;
        this._isInitialized = true;
        this._updateEventEmitter.fire({ model: this });
    };
    /**
     * Collapse state memento, for persistence only
     */
    FoldingModel.prototype.getMemento = function () {
        var collapsedRanges = [];
        for (var i = 0; i < this._regions.length; i++) {
            if (this._regions.isCollapsed(i)) {
                var range = this._textModel.getDecorationRange(this._editorDecorationIds[i]);
                if (range) {
                    var startLineNumber = range.startLineNumber;
                    var endLineNumber = range.endLineNumber + this._regions.getEndLineNumber(i) - this._regions.getStartLineNumber(i);
                    collapsedRanges.push({ startLineNumber: startLineNumber, endLineNumber: endLineNumber });
                }
            }
        }
        if (collapsedRanges.length > 0) {
            return collapsedRanges;
        }
        return null;
    };
    /**
     * Apply persisted state, for persistence only
     */
    FoldingModel.prototype.applyMemento = function (state) {
        if (!Array.isArray(state)) {
            return;
        }
        var toToogle = [];
        for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
            var range = state_1[_i];
            var region = this.getRegionAtLine(range.startLineNumber);
            if (region && !region.isCollapsed) {
                toToogle.push(region);
            }
        }
        this.toggleCollapseState(toToogle);
    };
    FoldingModel.prototype.dispose = function () {
        this._decorationProvider.deltaDecorations(this._editorDecorationIds, []);
    };
    FoldingModel.prototype.getAllRegionsAtLine = function (lineNumber, filter) {
        var result = [];
        if (this._regions) {
            var index = this._regions.findRange(lineNumber);
            var level = 1;
            while (index >= 0) {
                var current = this._regions.toRegion(index);
                if (!filter || filter(current, level)) {
                    result.push(current);
                }
                level++;
                index = current.parentIndex;
            }
        }
        return result;
    };
    FoldingModel.prototype.getRegionAtLine = function (lineNumber) {
        if (this._regions) {
            var index = this._regions.findRange(lineNumber);
            if (index >= 0) {
                return this._regions.toRegion(index);
            }
        }
        return null;
    };
    FoldingModel.prototype.getRegionsInside = function (region, filter) {
        var result = [];
        var trackLevel = filter && filter.length === 2;
        var levelStack = trackLevel ? [] : null;
        var index = region ? region.regionIndex + 1 : 0;
        var endLineNumber = region ? region.endLineNumber : Number.MAX_VALUE;
        for (var i = index, len = this._regions.length; i < len; i++) {
            var current = this._regions.toRegion(i);
            if (this._regions.getStartLineNumber(i) < endLineNumber) {
                if (trackLevel) {
                    while (levelStack.length > 0 && !current.containedBy(levelStack[levelStack.length - 1])) {
                        levelStack.pop();
                    }
                    levelStack.push(current);
                    if (filter(current, levelStack.length)) {
                        result.push(current);
                    }
                }
                else if (!filter || filter(current)) {
                    result.push(current);
                }
            }
            else {
                break;
            }
        }
        return result;
    };
    return FoldingModel;
}());
export { FoldingModel };
/**
 * Collapse or expand the regions at the given locations including all children.
 * @param doCollapse Wheter to collase or expand
 * @param levels The number of levels. Use 1 to only impact the regions at the location, use Number.MAX_VALUE for all levels.
 * @param lineNumbers the location of the regions to collapse or expand, or if not set, all regions in the model.
 */
export function setCollapseStateLevelsDown(foldingModel, doCollapse, levels, lineNumbers) {
    if (levels === void 0) { levels = Number.MAX_VALUE; }
    var toToggle = [];
    if (lineNumbers && lineNumbers.length > 0) {
        for (var _i = 0, lineNumbers_1 = lineNumbers; _i < lineNumbers_1.length; _i++) {
            var lineNumber = lineNumbers_1[_i];
            var region = foldingModel.getRegionAtLine(lineNumber);
            if (region) {
                if (region.isCollapsed !== doCollapse) {
                    toToggle.push(region);
                }
                if (levels > 1) {
                    var regionsInside = foldingModel.getRegionsInside(region, function (r, level) { return r.isCollapsed !== doCollapse && level < levels; });
                    toToggle.push.apply(toToggle, regionsInside);
                }
            }
        }
    }
    else {
        var regionsInside = foldingModel.getRegionsInside(null, function (r, level) { return r.isCollapsed !== doCollapse && level < levels; });
        toToggle.push.apply(toToggle, regionsInside);
    }
    foldingModel.toggleCollapseState(toToggle);
}
/**
 * Collapse or expand the regions at the given locations including all parents.
 * @param doCollapse Wheter to collase or expand
 * @param levels The number of levels. Use 1 to only impact the regions at the location, use Number.MAX_VALUE for all levels.
 * @param lineNumbers the location of the regions to collapse or expand, or if not set, all regions in the model.
 */
export function setCollapseStateLevelsUp(foldingModel, doCollapse, levels, lineNumbers) {
    var toToggle = [];
    for (var _i = 0, lineNumbers_2 = lineNumbers; _i < lineNumbers_2.length; _i++) {
        var lineNumber = lineNumbers_2[_i];
        var regions = foldingModel.getAllRegionsAtLine(lineNumber, function (region, level) { return region.isCollapsed !== doCollapse && level <= levels; });
        toToggle.push.apply(toToggle, regions);
    }
    foldingModel.toggleCollapseState(toToggle);
}
/**
 * Folds or unfolds all regions that have a given level, except if they contain one of the blocked lines.
 * @param foldLevel level. Level == 1 is the top level
 * @param doCollapse Wheter to collase or expand
* @param blockedLineNumbers
*/
export function setCollapseStateAtLevel(foldingModel, foldLevel, doCollapse, blockedLineNumbers) {
    var filter = function (region, level) { return level === foldLevel && region.isCollapsed !== doCollapse && !blockedLineNumbers.some(function (line) { return region.containsLine(line); }); };
    var toToggle = foldingModel.getRegionsInside(null, filter);
    foldingModel.toggleCollapseState(toToggle);
}
/**
 * Folds all regions for which the lines start with a given regex
 * @param foldingModel the folding model
 */
export function setCollapseStateForMatchingLines(foldingModel, regExp, doCollapse) {
    var editorModel = foldingModel.textModel;
    var regions = foldingModel.regions;
    var toToggle = [];
    for (var i = regions.length - 1; i >= 0; i--) {
        if (doCollapse !== regions.isCollapsed(i)) {
            var startLineNumber = regions.getStartLineNumber(i);
            if (regExp.test(editorModel.getLineContent(startLineNumber))) {
                toToggle.push(regions.toRegion(i));
            }
        }
    }
    foldingModel.toggleCollapseState(toToggle);
}
/**
 * Folds all regions of the given type
 * @param foldingModel the folding model
 */
export function setCollapseStateForType(foldingModel, type, doCollapse) {
    var regions = foldingModel.regions;
    var toToggle = [];
    for (var i = regions.length - 1; i >= 0; i--) {
        if (doCollapse !== regions.isCollapsed(i) && type === regions.getType(i)) {
            toToggle.push(regions.toRegion(i));
        }
    }
    foldingModel.toggleCollapseState(toToggle);
}
