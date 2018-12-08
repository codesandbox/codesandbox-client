/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as strings from '../../../base/common/strings.js';
import { CharacterClassifier } from '../core/characterClassifier.js';
import { toUint32Array } from '../core/uint.js';
import { PrefixSumComputer } from './prefixSumComputer.js';
import { OutputPosition } from './splitLinesCollection.js';
var WrappingCharacterClassifier = /** @class */ (function (_super) {
    __extends(WrappingCharacterClassifier, _super);
    function WrappingCharacterClassifier(BREAK_BEFORE, BREAK_AFTER, BREAK_OBTRUSIVE) {
        var _this = _super.call(this, 0 /* NONE */) || this;
        for (var i = 0; i < BREAK_BEFORE.length; i++) {
            _this.set(BREAK_BEFORE.charCodeAt(i), 1 /* BREAK_BEFORE */);
        }
        for (var i = 0; i < BREAK_AFTER.length; i++) {
            _this.set(BREAK_AFTER.charCodeAt(i), 2 /* BREAK_AFTER */);
        }
        for (var i = 0; i < BREAK_OBTRUSIVE.length; i++) {
            _this.set(BREAK_OBTRUSIVE.charCodeAt(i), 3 /* BREAK_OBTRUSIVE */);
        }
        return _this;
    }
    WrappingCharacterClassifier.prototype.get = function (charCode) {
        // Initialize CharacterClass.BREAK_IDEOGRAPHIC for these Unicode ranges:
        // 1. CJK Unified Ideographs (0x4E00 -- 0x9FFF)
        // 2. CJK Unified Ideographs Extension A (0x3400 -- 0x4DBF)
        // 3. Hiragana and Katakana (0x3040 -- 0x30FF)
        if ((charCode >= 0x3040 && charCode <= 0x30FF)
            || (charCode >= 0x3400 && charCode <= 0x4DBF)
            || (charCode >= 0x4E00 && charCode <= 0x9FFF)) {
            return 4 /* BREAK_IDEOGRAPHIC */;
        }
        return _super.prototype.get.call(this, charCode);
    };
    return WrappingCharacterClassifier;
}(CharacterClassifier));
var CharacterHardWrappingLineMapperFactory = /** @class */ (function () {
    function CharacterHardWrappingLineMapperFactory(breakBeforeChars, breakAfterChars, breakObtrusiveChars) {
        this.classifier = new WrappingCharacterClassifier(breakBeforeChars, breakAfterChars, breakObtrusiveChars);
    }
    // TODO@Alex -> duplicated in lineCommentCommand
    CharacterHardWrappingLineMapperFactory.nextVisibleColumn = function (currentVisibleColumn, tabSize, isTab, columnSize) {
        currentVisibleColumn = +currentVisibleColumn; //@perf
        tabSize = +tabSize; //@perf
        columnSize = +columnSize; //@perf
        if (isTab) {
            return currentVisibleColumn + (tabSize - (currentVisibleColumn % tabSize));
        }
        return currentVisibleColumn + columnSize;
    };
    CharacterHardWrappingLineMapperFactory.prototype.createLineMapping = function (lineText, tabSize, breakingColumn, columnsForFullWidthChar, hardWrappingIndent) {
        if (breakingColumn === -1) {
            return null;
        }
        tabSize = +tabSize; //@perf
        breakingColumn = +breakingColumn; //@perf
        columnsForFullWidthChar = +columnsForFullWidthChar; //@perf
        hardWrappingIndent = +hardWrappingIndent; //@perf
        var wrappedTextIndentVisibleColumn = 0;
        var wrappedTextIndent = '';
        var firstNonWhitespaceIndex = -1;
        if (hardWrappingIndent !== 0 /* None */) {
            firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineText);
            if (firstNonWhitespaceIndex !== -1) {
                // Track existing indent
                wrappedTextIndent = lineText.substring(0, firstNonWhitespaceIndex);
                for (var i = 0; i < firstNonWhitespaceIndex; i++) {
                    wrappedTextIndentVisibleColumn = CharacterHardWrappingLineMapperFactory.nextVisibleColumn(wrappedTextIndentVisibleColumn, tabSize, lineText.charCodeAt(i) === 9 /* Tab */, 1);
                }
                // Increase indent of continuation lines, if desired
                var numberOfAdditionalTabs = 0;
                if (hardWrappingIndent === 2 /* Indent */) {
                    numberOfAdditionalTabs = 1;
                }
                else if (hardWrappingIndent === 3 /* DeepIndent */) {
                    numberOfAdditionalTabs = 2;
                }
                for (var i = 0; i < numberOfAdditionalTabs; i++) {
                    wrappedTextIndent += '\t';
                    wrappedTextIndentVisibleColumn = CharacterHardWrappingLineMapperFactory.nextVisibleColumn(wrappedTextIndentVisibleColumn, tabSize, true, 1);
                }
                // Force sticking to beginning of line if no character would fit except for the indentation
                if (wrappedTextIndentVisibleColumn + columnsForFullWidthChar > breakingColumn) {
                    wrappedTextIndent = '';
                    wrappedTextIndentVisibleColumn = 0;
                }
            }
        }
        var classifier = this.classifier;
        var lastBreakingOffset = 0; // Last 0-based offset in the lineText at which a break happened
        var breakingLengths = []; // The length of each broken-up line text
        var breakingLengthsIndex = 0; // The count of breaks already done
        var visibleColumn = 0; // Visible column since the beginning of the current line
        var niceBreakOffset = -1; // Last index of a character that indicates a break should happen before it (more desirable)
        var niceBreakVisibleColumn = 0; // visible column if a break were to be later introduced before `niceBreakOffset`
        var obtrusiveBreakOffset = -1; // Last index of a character that indicates a break should happen before it (less desirable)
        var obtrusiveBreakVisibleColumn = 0; // visible column if a break were to be later introduced before `obtrusiveBreakOffset`
        var len = lineText.length;
        for (var i = 0; i < len; i++) {
            // At this point, there is a certainty that the character before `i` fits on the current line,
            // but the character at `i` might not fit
            var charCode = lineText.charCodeAt(i);
            var charCodeIsTab = (charCode === 9 /* Tab */);
            var charCodeClass = classifier.get(charCode);
            if (charCodeClass === 1 /* BREAK_BEFORE */) {
                // This is a character that indicates that a break should happen before it
                // Since we are certain the character before `i` fits, there's no extra checking needed,
                // just mark it as a nice breaking opportunity
                niceBreakOffset = i;
                niceBreakVisibleColumn = wrappedTextIndentVisibleColumn;
            }
            // CJK breaking : before break
            if (charCodeClass === 4 /* BREAK_IDEOGRAPHIC */ && i > 0) {
                var prevCode = lineText.charCodeAt(i - 1);
                var prevClass = classifier.get(prevCode);
                if (prevClass !== 1 /* BREAK_BEFORE */) { // Kinsoku Shori: Don't break after a leading character, like an open bracket
                    niceBreakOffset = i;
                    niceBreakVisibleColumn = wrappedTextIndentVisibleColumn;
                }
            }
            var charColumnSize = 1;
            if (strings.isFullWidthCharacter(charCode)) {
                charColumnSize = columnsForFullWidthChar;
            }
            // Advance visibleColumn with character at `i`
            visibleColumn = CharacterHardWrappingLineMapperFactory.nextVisibleColumn(visibleColumn, tabSize, charCodeIsTab, charColumnSize);
            if (visibleColumn > breakingColumn && i !== 0) {
                // We need to break at least before character at `i`:
                //  - break before niceBreakLastOffset if it exists (and re-establish a correct visibleColumn by using niceBreakVisibleColumn + charAt(i))
                //  - otherwise, break before obtrusiveBreakLastOffset if it exists (and re-establish a correct visibleColumn by using obtrusiveBreakVisibleColumn + charAt(i))
                //  - otherwise, break before i (and re-establish a correct visibleColumn by charAt(i))
                var breakBeforeOffset = void 0;
                var restoreVisibleColumnFrom = void 0;
                if (niceBreakOffset !== -1 && niceBreakVisibleColumn <= breakingColumn) {
                    // We will break before `niceBreakLastOffset`
                    breakBeforeOffset = niceBreakOffset;
                    restoreVisibleColumnFrom = niceBreakVisibleColumn;
                }
                else if (obtrusiveBreakOffset !== -1 && obtrusiveBreakVisibleColumn <= breakingColumn) {
                    // We will break before `obtrusiveBreakLastOffset`
                    breakBeforeOffset = obtrusiveBreakOffset;
                    restoreVisibleColumnFrom = obtrusiveBreakVisibleColumn;
                }
                else {
                    // We will break before `i`
                    breakBeforeOffset = i;
                    restoreVisibleColumnFrom = wrappedTextIndentVisibleColumn;
                }
                // Break before character at `breakBeforeOffset`
                breakingLengths[breakingLengthsIndex++] = breakBeforeOffset - lastBreakingOffset;
                lastBreakingOffset = breakBeforeOffset;
                // Re-establish visibleColumn by taking character at `i` into account
                visibleColumn = CharacterHardWrappingLineMapperFactory.nextVisibleColumn(restoreVisibleColumnFrom, tabSize, charCodeIsTab, charColumnSize);
                // Reset markers
                niceBreakOffset = -1;
                niceBreakVisibleColumn = 0;
                obtrusiveBreakOffset = -1;
                obtrusiveBreakVisibleColumn = 0;
            }
            // At this point, there is a certainty that the character at `i` fits on the current line
            if (niceBreakOffset !== -1) {
                // Advance niceBreakVisibleColumn
                niceBreakVisibleColumn = CharacterHardWrappingLineMapperFactory.nextVisibleColumn(niceBreakVisibleColumn, tabSize, charCodeIsTab, charColumnSize);
            }
            if (obtrusiveBreakOffset !== -1) {
                // Advance obtrusiveBreakVisibleColumn
                obtrusiveBreakVisibleColumn = CharacterHardWrappingLineMapperFactory.nextVisibleColumn(obtrusiveBreakVisibleColumn, tabSize, charCodeIsTab, charColumnSize);
            }
            if (charCodeClass === 2 /* BREAK_AFTER */ && (hardWrappingIndent === 0 /* None */ || i >= firstNonWhitespaceIndex)) {
                // This is a character that indicates that a break should happen after it
                niceBreakOffset = i + 1;
                niceBreakVisibleColumn = wrappedTextIndentVisibleColumn;
            }
            // CJK breaking : after break
            if (charCodeClass === 4 /* BREAK_IDEOGRAPHIC */ && i < len - 1) {
                var nextCode = lineText.charCodeAt(i + 1);
                var nextClass = classifier.get(nextCode);
                if (nextClass !== 2 /* BREAK_AFTER */) { // Kinsoku Shori: Don't break before a trailing character, like a period
                    niceBreakOffset = i + 1;
                    niceBreakVisibleColumn = wrappedTextIndentVisibleColumn;
                }
            }
            if (charCodeClass === 3 /* BREAK_OBTRUSIVE */) {
                // This is an obtrusive character that indicates that a break should happen after it
                obtrusiveBreakOffset = i + 1;
                obtrusiveBreakVisibleColumn = wrappedTextIndentVisibleColumn;
            }
        }
        if (breakingLengthsIndex === 0) {
            return null;
        }
        // Add last segment
        breakingLengths[breakingLengthsIndex++] = len - lastBreakingOffset;
        return new CharacterHardWrappingLineMapping(new PrefixSumComputer(toUint32Array(breakingLengths)), wrappedTextIndent);
    };
    return CharacterHardWrappingLineMapperFactory;
}());
export { CharacterHardWrappingLineMapperFactory };
var CharacterHardWrappingLineMapping = /** @class */ (function () {
    function CharacterHardWrappingLineMapping(prefixSums, wrappedLinesIndent) {
        this._prefixSums = prefixSums;
        this._wrappedLinesIndent = wrappedLinesIndent;
    }
    CharacterHardWrappingLineMapping.prototype.getOutputLineCount = function () {
        return this._prefixSums.getCount();
    };
    CharacterHardWrappingLineMapping.prototype.getWrappedLinesIndent = function () {
        return this._wrappedLinesIndent;
    };
    CharacterHardWrappingLineMapping.prototype.getInputOffsetOfOutputPosition = function (outputLineIndex, outputOffset) {
        if (outputLineIndex === 0) {
            return outputOffset;
        }
        else {
            return this._prefixSums.getAccumulatedValue(outputLineIndex - 1) + outputOffset;
        }
    };
    CharacterHardWrappingLineMapping.prototype.getOutputPositionOfInputOffset = function (inputOffset) {
        var r = this._prefixSums.getIndexOf(inputOffset);
        return new OutputPosition(r.index, r.remainder);
    };
    return CharacterHardWrappingLineMapping;
}());
export { CharacterHardWrappingLineMapping };
