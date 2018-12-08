/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Vertical Lane in the overview ruler of the editor.
 */
export var OverviewRulerLane;
(function (OverviewRulerLane) {
    OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
    OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
    OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
    OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
})(OverviewRulerLane || (OverviewRulerLane = {}));
var TextModelResolvedOptions = /** @class */ (function () {
    /**
     * @internal
     */
    function TextModelResolvedOptions(src) {
        this.tabSize = src.tabSize | 0;
        this.insertSpaces = Boolean(src.insertSpaces);
        this.defaultEOL = src.defaultEOL | 0;
        this.trimAutoWhitespace = Boolean(src.trimAutoWhitespace);
    }
    /**
     * @internal
     */
    TextModelResolvedOptions.prototype.equals = function (other) {
        return (this.tabSize === other.tabSize
            && this.insertSpaces === other.insertSpaces
            && this.defaultEOL === other.defaultEOL
            && this.trimAutoWhitespace === other.trimAutoWhitespace);
    };
    /**
     * @internal
     */
    TextModelResolvedOptions.prototype.createChangeEvent = function (newOpts) {
        return {
            tabSize: this.tabSize !== newOpts.tabSize,
            insertSpaces: this.insertSpaces !== newOpts.insertSpaces,
            trimAutoWhitespace: this.trimAutoWhitespace !== newOpts.trimAutoWhitespace,
        };
    };
    return TextModelResolvedOptions;
}());
export { TextModelResolvedOptions };
var FindMatch = /** @class */ (function () {
    /**
     * @internal
     */
    function FindMatch(range, matches) {
        this.range = range;
        this.matches = matches;
    }
    return FindMatch;
}());
export { FindMatch };
/**
 * @internal
 */
var ApplyEditsResult = /** @class */ (function () {
    function ApplyEditsResult(reverseEdits, changes, trimAutoWhitespaceLineNumbers) {
        this.reverseEdits = reverseEdits;
        this.changes = changes;
        this.trimAutoWhitespaceLineNumbers = trimAutoWhitespaceLineNumbers;
    }
    return ApplyEditsResult;
}());
export { ApplyEditsResult };
