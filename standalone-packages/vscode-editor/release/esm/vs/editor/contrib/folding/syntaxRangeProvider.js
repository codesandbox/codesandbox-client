/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { MAX_LINE_NUMBER, FoldingRegions } from './foldingRanges.js';
var MAX_FOLDING_REGIONS = 5000;
var foldingContext = {};
export var ID_SYNTAX_PROVIDER = 'syntax';
var SyntaxRangeProvider = /** @class */ (function () {
    function SyntaxRangeProvider(editorModel, providers, limit) {
        if (limit === void 0) { limit = MAX_FOLDING_REGIONS; }
        this.editorModel = editorModel;
        this.providers = providers;
        this.limit = limit;
        this.id = ID_SYNTAX_PROVIDER;
    }
    SyntaxRangeProvider.prototype.compute = function (cancellationToken) {
        var _this = this;
        return collectSyntaxRanges(this.providers, this.editorModel, cancellationToken).then(function (ranges) {
            if (ranges) {
                var res = sanitizeRanges(ranges, _this.limit);
                return res;
            }
            return null;
        });
    };
    SyntaxRangeProvider.prototype.dispose = function () {
    };
    return SyntaxRangeProvider;
}());
export { SyntaxRangeProvider };
function collectSyntaxRanges(providers, model, cancellationToken) {
    var rangeData = null;
    var promises = providers.map(function (provider, i) {
        return Promise.resolve(provider.provideFoldingRanges(model, foldingContext, cancellationToken)).then(function (ranges) {
            if (cancellationToken.isCancellationRequested) {
                return;
            }
            if (Array.isArray(ranges)) {
                if (!Array.isArray(rangeData)) {
                    rangeData = [];
                }
                var nLines = model.getLineCount();
                for (var _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
                    var r = ranges_1[_i];
                    if (r.start > 0 && r.end > r.start && r.end <= nLines) {
                        rangeData.push({ start: r.start, end: r.end, rank: i, kind: r.kind });
                    }
                }
            }
        }, onUnexpectedExternalError);
    });
    return Promise.all(promises).then(function (_) {
        return rangeData;
    });
}
var RangesCollector = /** @class */ (function () {
    function RangesCollector(foldingRangesLimit) {
        this._startIndexes = [];
        this._endIndexes = [];
        this._nestingLevels = [];
        this._nestingLevelCounts = [];
        this._types = [];
        this._length = 0;
        this._foldingRangesLimit = foldingRangesLimit;
    }
    RangesCollector.prototype.add = function (startLineNumber, endLineNumber, type, nestingLevel) {
        if (startLineNumber > MAX_LINE_NUMBER || endLineNumber > MAX_LINE_NUMBER) {
            return;
        }
        var index = this._length;
        this._startIndexes[index] = startLineNumber;
        this._endIndexes[index] = endLineNumber;
        this._nestingLevels[index] = nestingLevel;
        this._types[index] = type;
        this._length++;
        if (nestingLevel < 30) {
            this._nestingLevelCounts[nestingLevel] = (this._nestingLevelCounts[nestingLevel] || 0) + 1;
        }
    };
    RangesCollector.prototype.toIndentRanges = function () {
        if (this._length <= this._foldingRangesLimit) {
            var startIndexes = new Uint32Array(this._length);
            var endIndexes = new Uint32Array(this._length);
            for (var i = 0; i < this._length; i++) {
                startIndexes[i] = this._startIndexes[i];
                endIndexes[i] = this._endIndexes[i];
            }
            return new FoldingRegions(startIndexes, endIndexes, this._types);
        }
        else {
            var entries = 0;
            var maxLevel = this._nestingLevelCounts.length;
            for (var i = 0; i < this._nestingLevelCounts.length; i++) {
                var n = this._nestingLevelCounts[i];
                if (n) {
                    if (n + entries > this._foldingRangesLimit) {
                        maxLevel = i;
                        break;
                    }
                    entries += n;
                }
            }
            var startIndexes = new Uint32Array(this._foldingRangesLimit);
            var endIndexes = new Uint32Array(this._foldingRangesLimit);
            var types = [];
            for (var i = 0, k = 0; i < this._length; i++) {
                var level = this._nestingLevels[i];
                if (level < maxLevel || (level === maxLevel && entries++ < this._foldingRangesLimit)) {
                    startIndexes[k] = this._startIndexes[i];
                    endIndexes[k] = this._endIndexes[i];
                    types[k] = this._types[i];
                    k++;
                }
            }
            return new FoldingRegions(startIndexes, endIndexes, types);
        }
    };
    return RangesCollector;
}());
export { RangesCollector };
export function sanitizeRanges(rangeData, limit) {
    var sorted = rangeData.sort(function (d1, d2) {
        var diff = d1.start - d2.start;
        if (diff === 0) {
            diff = d1.rank - d2.rank;
        }
        return diff;
    });
    var collector = new RangesCollector(limit);
    var top = void 0;
    var previous = [];
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var entry = sorted_1[_i];
        if (!top) {
            top = entry;
            collector.add(entry.start, entry.end, entry.kind && entry.kind.value, previous.length);
        }
        else {
            if (entry.start > top.start) {
                if (entry.end <= top.end) {
                    previous.push(top);
                    top = entry;
                    collector.add(entry.start, entry.end, entry.kind && entry.kind.value, previous.length);
                }
                else {
                    if (entry.start > top.end) {
                        do {
                            top = previous.pop();
                        } while (top && entry.start > top.end);
                        if (top) {
                            previous.push(top);
                        }
                        top = entry;
                    }
                    collector.add(entry.start, entry.end, entry.kind && entry.kind.value, previous.length);
                }
            }
        }
    }
    return collector.toIndentRanges();
}
