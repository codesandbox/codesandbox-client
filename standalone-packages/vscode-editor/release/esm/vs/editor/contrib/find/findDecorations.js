/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Range } from '../../common/core/range.js';
import { OverviewRulerLane } from '../../common/model.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { overviewRulerFindMatchForeground } from '../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../platform/theme/common/themeService.js';
var FindDecorations = /** @class */ (function () {
    function FindDecorations(editor) {
        this._editor = editor;
        this._decorations = [];
        this._overviewRulerApproximateDecorations = [];
        this._findScopeDecorationId = null;
        this._rangeHighlightDecorationId = null;
        this._highlightedDecorationId = null;
        this._startPosition = this._editor.getPosition();
    }
    FindDecorations.prototype.dispose = function () {
        this._editor.deltaDecorations(this._allDecorations(), []);
        this._decorations = [];
        this._overviewRulerApproximateDecorations = [];
        this._findScopeDecorationId = null;
        this._rangeHighlightDecorationId = null;
        this._highlightedDecorationId = null;
    };
    FindDecorations.prototype.reset = function () {
        this._decorations = [];
        this._overviewRulerApproximateDecorations = [];
        this._findScopeDecorationId = null;
        this._rangeHighlightDecorationId = null;
        this._highlightedDecorationId = null;
    };
    FindDecorations.prototype.getCount = function () {
        return this._decorations.length;
    };
    FindDecorations.prototype.getFindScope = function () {
        if (this._findScopeDecorationId) {
            return this._editor.getModel().getDecorationRange(this._findScopeDecorationId);
        }
        return null;
    };
    FindDecorations.prototype.getStartPosition = function () {
        return this._startPosition;
    };
    FindDecorations.prototype.setStartPosition = function (newStartPosition) {
        this._startPosition = newStartPosition;
        this.setCurrentFindMatch(null);
    };
    FindDecorations.prototype._getDecorationIndex = function (decorationId) {
        var index = this._decorations.indexOf(decorationId);
        if (index >= 0) {
            return index + 1;
        }
        return 1;
    };
    FindDecorations.prototype.getCurrentMatchesPosition = function (desiredRange) {
        var candidates = this._editor.getModel().getDecorationsInRange(desiredRange);
        for (var i = 0, len = candidates.length; i < len; i++) {
            var candidate = candidates[i];
            var candidateOpts = candidate.options;
            if (candidateOpts === FindDecorations._FIND_MATCH_DECORATION || candidateOpts === FindDecorations._CURRENT_FIND_MATCH_DECORATION) {
                return this._getDecorationIndex(candidate.id);
            }
        }
        return 1;
    };
    FindDecorations.prototype.setCurrentFindMatch = function (nextMatch) {
        var _this = this;
        var newCurrentDecorationId = null;
        var matchPosition = 0;
        if (nextMatch) {
            for (var i = 0, len = this._decorations.length; i < len; i++) {
                var range = this._editor.getModel().getDecorationRange(this._decorations[i]);
                if (nextMatch.equalsRange(range)) {
                    newCurrentDecorationId = this._decorations[i];
                    matchPosition = (i + 1);
                    break;
                }
            }
        }
        if (this._highlightedDecorationId !== null || newCurrentDecorationId !== null) {
            this._editor.changeDecorations(function (changeAccessor) {
                if (_this._highlightedDecorationId !== null) {
                    changeAccessor.changeDecorationOptions(_this._highlightedDecorationId, FindDecorations._FIND_MATCH_DECORATION);
                    _this._highlightedDecorationId = null;
                }
                if (newCurrentDecorationId !== null) {
                    _this._highlightedDecorationId = newCurrentDecorationId;
                    changeAccessor.changeDecorationOptions(_this._highlightedDecorationId, FindDecorations._CURRENT_FIND_MATCH_DECORATION);
                }
                if (_this._rangeHighlightDecorationId !== null) {
                    changeAccessor.removeDecoration(_this._rangeHighlightDecorationId);
                    _this._rangeHighlightDecorationId = null;
                }
                if (newCurrentDecorationId !== null) {
                    var rng = _this._editor.getModel().getDecorationRange(newCurrentDecorationId);
                    if (rng.startLineNumber !== rng.endLineNumber && rng.endColumn === 1) {
                        var lineBeforeEnd = rng.endLineNumber - 1;
                        var lineBeforeEndMaxColumn = _this._editor.getModel().getLineMaxColumn(lineBeforeEnd);
                        rng = new Range(rng.startLineNumber, rng.startColumn, lineBeforeEnd, lineBeforeEndMaxColumn);
                    }
                    _this._rangeHighlightDecorationId = changeAccessor.addDecoration(rng, FindDecorations._RANGE_HIGHLIGHT_DECORATION);
                }
            });
        }
        return matchPosition;
    };
    FindDecorations.prototype.set = function (findMatches, findScope) {
        var _this = this;
        this._editor.changeDecorations(function (accessor) {
            var findMatchesOptions = FindDecorations._FIND_MATCH_DECORATION;
            var newOverviewRulerApproximateDecorations = [];
            if (findMatches.length > 1000) {
                // we go into a mode where the overview ruler gets "approximate" decorations
                // the reason is that the overview ruler paints all the decorations in the file and we don't want to cause freezes
                findMatchesOptions = FindDecorations._FIND_MATCH_NO_OVERVIEW_DECORATION;
                // approximate a distance in lines where matches should be merged
                var lineCount = _this._editor.getModel().getLineCount();
                var height = _this._editor.getLayoutInfo().height;
                var approxPixelsPerLine = height / lineCount;
                var mergeLinesDelta = Math.max(2, Math.ceil(3 / approxPixelsPerLine));
                // merge decorations as much as possible
                var prevStartLineNumber = findMatches[0].range.startLineNumber;
                var prevEndLineNumber = findMatches[0].range.endLineNumber;
                for (var i = 1, len = findMatches.length; i < len; i++) {
                    var range = findMatches[i].range;
                    if (prevEndLineNumber + mergeLinesDelta >= range.startLineNumber) {
                        if (range.endLineNumber > prevEndLineNumber) {
                            prevEndLineNumber = range.endLineNumber;
                        }
                    }
                    else {
                        newOverviewRulerApproximateDecorations.push({
                            range: new Range(prevStartLineNumber, 1, prevEndLineNumber, 1),
                            options: FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION
                        });
                        prevStartLineNumber = range.startLineNumber;
                        prevEndLineNumber = range.endLineNumber;
                    }
                }
                newOverviewRulerApproximateDecorations.push({
                    range: new Range(prevStartLineNumber, 1, prevEndLineNumber, 1),
                    options: FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION
                });
            }
            // Find matches
            var newFindMatchesDecorations = new Array(findMatches.length);
            for (var i = 0, len = findMatches.length; i < len; i++) {
                newFindMatchesDecorations[i] = {
                    range: findMatches[i].range,
                    options: findMatchesOptions
                };
            }
            _this._decorations = accessor.deltaDecorations(_this._decorations, newFindMatchesDecorations);
            // Overview ruler approximate decorations
            _this._overviewRulerApproximateDecorations = accessor.deltaDecorations(_this._overviewRulerApproximateDecorations, newOverviewRulerApproximateDecorations);
            // Range highlight
            if (_this._rangeHighlightDecorationId) {
                accessor.removeDecoration(_this._rangeHighlightDecorationId);
                _this._rangeHighlightDecorationId = null;
            }
            // Find scope
            if (_this._findScopeDecorationId) {
                accessor.removeDecoration(_this._findScopeDecorationId);
                _this._findScopeDecorationId = null;
            }
            if (findScope) {
                _this._findScopeDecorationId = accessor.addDecoration(findScope, FindDecorations._FIND_SCOPE_DECORATION);
            }
        });
    };
    FindDecorations.prototype.matchBeforePosition = function (position) {
        if (this._decorations.length === 0) {
            return null;
        }
        for (var i = this._decorations.length - 1; i >= 0; i--) {
            var decorationId = this._decorations[i];
            var r = this._editor.getModel().getDecorationRange(decorationId);
            if (!r || r.endLineNumber > position.lineNumber) {
                continue;
            }
            if (r.endLineNumber < position.lineNumber) {
                return r;
            }
            if (r.endColumn > position.column) {
                continue;
            }
            return r;
        }
        return this._editor.getModel().getDecorationRange(this._decorations[this._decorations.length - 1]);
    };
    FindDecorations.prototype.matchAfterPosition = function (position) {
        if (this._decorations.length === 0) {
            return null;
        }
        for (var i = 0, len = this._decorations.length; i < len; i++) {
            var decorationId = this._decorations[i];
            var r = this._editor.getModel().getDecorationRange(decorationId);
            if (!r || r.startLineNumber < position.lineNumber) {
                continue;
            }
            if (r.startLineNumber > position.lineNumber) {
                return r;
            }
            if (r.startColumn < position.column) {
                continue;
            }
            return r;
        }
        return this._editor.getModel().getDecorationRange(this._decorations[0]);
    };
    FindDecorations.prototype._allDecorations = function () {
        var result = [];
        result = result.concat(this._decorations);
        result = result.concat(this._overviewRulerApproximateDecorations);
        if (this._findScopeDecorationId) {
            result.push(this._findScopeDecorationId);
        }
        if (this._rangeHighlightDecorationId) {
            result.push(this._rangeHighlightDecorationId);
        }
        return result;
    };
    FindDecorations._CURRENT_FIND_MATCH_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        zIndex: 13,
        className: 'currentFindMatch',
        showIfCollapsed: true,
        overviewRuler: {
            color: themeColorFromId(overviewRulerFindMatchForeground),
            position: OverviewRulerLane.Center
        }
    });
    FindDecorations._FIND_MATCH_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'findMatch',
        showIfCollapsed: true,
        overviewRuler: {
            color: themeColorFromId(overviewRulerFindMatchForeground),
            position: OverviewRulerLane.Center
        }
    });
    FindDecorations._FIND_MATCH_NO_OVERVIEW_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'findMatch',
        showIfCollapsed: true
    });
    FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        overviewRuler: {
            color: themeColorFromId(overviewRulerFindMatchForeground),
            position: OverviewRulerLane.Center
        }
    });
    FindDecorations._RANGE_HIGHLIGHT_DECORATION = ModelDecorationOptions.register({
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */,
        className: 'rangeHighlight',
        isWholeLine: true
    });
    FindDecorations._FIND_SCOPE_DECORATION = ModelDecorationOptions.register({
        className: 'findScope',
        isWholeLine: true
    });
    return FindDecorations;
}());
export { FindDecorations };
