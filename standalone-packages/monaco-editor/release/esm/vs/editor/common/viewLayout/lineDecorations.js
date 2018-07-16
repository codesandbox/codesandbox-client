/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as strings from '../../../base/common/strings.js';
var LineDecoration = /** @class */ (function () {
    function LineDecoration(startColumn, endColumn, className, type) {
        this.startColumn = startColumn;
        this.endColumn = endColumn;
        this.className = className;
        this.type = type;
    }
    LineDecoration._equals = function (a, b) {
        return (a.startColumn === b.startColumn
            && a.endColumn === b.endColumn
            && a.className === b.className
            && a.type === b.type);
    };
    LineDecoration.equalsArr = function (a, b) {
        var aLen = a.length;
        var bLen = b.length;
        if (aLen !== bLen) {
            return false;
        }
        for (var i = 0; i < aLen; i++) {
            if (!LineDecoration._equals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    };
    LineDecoration.filter = function (lineDecorations, lineNumber, minLineColumn, maxLineColumn) {
        if (lineDecorations.length === 0) {
            return [];
        }
        var result = [], resultLen = 0;
        for (var i = 0, len = lineDecorations.length; i < len; i++) {
            var d = lineDecorations[i];
            var range = d.range;
            if (range.endLineNumber < lineNumber || range.startLineNumber > lineNumber) {
                // Ignore decorations that sit outside this line
                continue;
            }
            if (range.isEmpty() && (d.type === 0 /* Regular */ || d.type === 3 /* RegularAffectingLetterSpacing */)) {
                // Ignore empty range decorations
                continue;
            }
            var startColumn = (range.startLineNumber === lineNumber ? range.startColumn : minLineColumn);
            var endColumn = (range.endLineNumber === lineNumber ? range.endColumn : maxLineColumn);
            result[resultLen++] = new LineDecoration(startColumn, endColumn, d.inlineClassName, d.type);
        }
        return result;
    };
    LineDecoration.compare = function (a, b) {
        if (a.startColumn === b.startColumn) {
            if (a.endColumn === b.endColumn) {
                if (a.className < b.className) {
                    return -1;
                }
                if (a.className > b.className) {
                    return 1;
                }
                return 0;
            }
            return a.endColumn - b.endColumn;
        }
        return a.startColumn - b.startColumn;
    };
    return LineDecoration;
}());
export { LineDecoration };
var DecorationSegment = /** @class */ (function () {
    function DecorationSegment(startOffset, endOffset, className) {
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.className = className;
    }
    return DecorationSegment;
}());
export { DecorationSegment };
var Stack = /** @class */ (function () {
    function Stack() {
        this.stopOffsets = [];
        this.classNames = [];
        this.count = 0;
    }
    Stack.prototype.consumeLowerThan = function (maxStopOffset, nextStartOffset, result) {
        while (this.count > 0 && this.stopOffsets[0] < maxStopOffset) {
            var i = 0;
            // Take all equal stopping offsets
            while (i + 1 < this.count && this.stopOffsets[i] === this.stopOffsets[i + 1]) {
                i++;
            }
            // Basically we are consuming the first i + 1 elements of the stack
            result.push(new DecorationSegment(nextStartOffset, this.stopOffsets[i], this.classNames.join(' ')));
            nextStartOffset = this.stopOffsets[i] + 1;
            // Consume them
            this.stopOffsets.splice(0, i + 1);
            this.classNames.splice(0, i + 1);
            this.count -= (i + 1);
        }
        if (this.count > 0 && nextStartOffset < maxStopOffset) {
            result.push(new DecorationSegment(nextStartOffset, maxStopOffset - 1, this.classNames.join(' ')));
            nextStartOffset = maxStopOffset;
        }
        return nextStartOffset;
    };
    Stack.prototype.insert = function (stopOffset, className) {
        if (this.count === 0 || this.stopOffsets[this.count - 1] <= stopOffset) {
            // Insert at the end
            this.stopOffsets.push(stopOffset);
            this.classNames.push(className);
        }
        else {
            // Find the insertion position for `stopOffset`
            for (var i = 0; i < this.count; i++) {
                if (this.stopOffsets[i] >= stopOffset) {
                    this.stopOffsets.splice(i, 0, stopOffset);
                    this.classNames.splice(i, 0, className);
                    break;
                }
            }
        }
        this.count++;
        return;
    };
    return Stack;
}());
var LineDecorationsNormalizer = /** @class */ (function () {
    function LineDecorationsNormalizer() {
    }
    /**
     * Normalize line decorations. Overlapping decorations will generate multiple segments
     */
    LineDecorationsNormalizer.normalize = function (lineContent, lineDecorations) {
        if (lineDecorations.length === 0) {
            return [];
        }
        var result = [];
        var stack = new Stack();
        var nextStartOffset = 0;
        for (var i = 0, len = lineDecorations.length; i < len; i++) {
            var d = lineDecorations[i];
            var startColumn = d.startColumn;
            var endColumn = d.endColumn;
            var className = d.className;
            // If the position would end up in the middle of a high-low surrogate pair, we move it to before the pair
            if (startColumn > 1) {
                var charCodeBefore = lineContent.charCodeAt(startColumn - 2);
                if (strings.isHighSurrogate(charCodeBefore)) {
                    startColumn--;
                }
            }
            if (endColumn > 1) {
                var charCodeBefore = lineContent.charCodeAt(endColumn - 2);
                if (strings.isHighSurrogate(charCodeBefore)) {
                    endColumn--;
                }
            }
            var currentStartOffset = startColumn - 1;
            var currentEndOffset = endColumn - 2;
            nextStartOffset = stack.consumeLowerThan(currentStartOffset, nextStartOffset, result);
            if (stack.count === 0) {
                nextStartOffset = currentStartOffset;
            }
            stack.insert(currentEndOffset, className);
        }
        stack.consumeLowerThan(1073741824 /* MAX_SAFE_SMALL_INTEGER */, nextStartOffset, result);
        return result;
    };
    return LineDecorationsNormalizer;
}());
export { LineDecorationsNormalizer };
