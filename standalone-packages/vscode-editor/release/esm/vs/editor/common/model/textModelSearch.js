/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings.js';
import { getMapForWordSeparators } from '../controller/wordCharacterClassifier.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { FindMatch } from '../model.js';
var LIMIT_FIND_COUNT = 999;
var SearchParams = /** @class */ (function () {
    function SearchParams(searchString, isRegex, matchCase, wordSeparators) {
        this.searchString = searchString;
        this.isRegex = isRegex;
        this.matchCase = matchCase;
        this.wordSeparators = wordSeparators;
    }
    SearchParams.prototype.parseSearchRequest = function () {
        if (this.searchString === '') {
            return null;
        }
        // Try to create a RegExp out of the params
        var multiline;
        if (this.isRegex) {
            multiline = isMultilineRegexSource(this.searchString);
        }
        else {
            multiline = (this.searchString.indexOf('\n') >= 0);
        }
        var regex = null;
        try {
            regex = strings.createRegExp(this.searchString, this.isRegex, {
                matchCase: this.matchCase,
                wholeWord: false,
                multiline: multiline,
                global: true
            });
        }
        catch (err) {
            return null;
        }
        if (!regex) {
            return null;
        }
        var canUseSimpleSearch = (!this.isRegex && !multiline);
        if (canUseSimpleSearch && this.searchString.toLowerCase() !== this.searchString.toUpperCase()) {
            // casing might make a difference
            canUseSimpleSearch = this.matchCase;
        }
        return new SearchData(regex, this.wordSeparators ? getMapForWordSeparators(this.wordSeparators) : null, canUseSimpleSearch ? this.searchString : null);
    };
    return SearchParams;
}());
export { SearchParams };
export function isMultilineRegexSource(searchString) {
    if (!searchString || searchString.length === 0) {
        return false;
    }
    for (var i = 0, len = searchString.length; i < len; i++) {
        var chCode = searchString.charCodeAt(i);
        if (chCode === 92 /* Backslash */) {
            // move to next char
            i++;
            if (i >= len) {
                // string ends with a \
                break;
            }
            var nextChCode = searchString.charCodeAt(i);
            if (nextChCode === 110 /* n */ || nextChCode === 114 /* r */ || nextChCode === 87 /* W */) {
                return true;
            }
        }
    }
    return false;
}
var SearchData = /** @class */ (function () {
    function SearchData(regex, wordSeparators, simpleSearch) {
        this.regex = regex;
        this.wordSeparators = wordSeparators;
        this.simpleSearch = simpleSearch;
    }
    return SearchData;
}());
export { SearchData };
export function createFindMatch(range, rawMatches, captureMatches) {
    if (!captureMatches) {
        return new FindMatch(range, null);
    }
    var matches = [];
    for (var i = 0, len = rawMatches.length; i < len; i++) {
        matches[i] = rawMatches[i];
    }
    return new FindMatch(range, matches);
}
var LineFeedCounter = /** @class */ (function () {
    function LineFeedCounter(text) {
        var lineFeedsOffsets = [];
        var lineFeedsOffsetsLen = 0;
        for (var i = 0, textLen = text.length; i < textLen; i++) {
            if (text.charCodeAt(i) === 10 /* LineFeed */) {
                lineFeedsOffsets[lineFeedsOffsetsLen++] = i;
            }
        }
        this._lineFeedsOffsets = lineFeedsOffsets;
    }
    LineFeedCounter.prototype.findLineFeedCountBeforeOffset = function (offset) {
        var lineFeedsOffsets = this._lineFeedsOffsets;
        var min = 0;
        var max = lineFeedsOffsets.length - 1;
        if (max === -1) {
            // no line feeds
            return 0;
        }
        if (offset <= lineFeedsOffsets[0]) {
            // before first line feed
            return 0;
        }
        while (min < max) {
            var mid = min + ((max - min) / 2 >> 0);
            if (lineFeedsOffsets[mid] >= offset) {
                max = mid - 1;
            }
            else {
                if (lineFeedsOffsets[mid + 1] >= offset) {
                    // bingo!
                    min = mid;
                    max = mid;
                }
                else {
                    min = mid + 1;
                }
            }
        }
        return min + 1;
    };
    return LineFeedCounter;
}());
var TextModelSearch = /** @class */ (function () {
    function TextModelSearch() {
    }
    TextModelSearch.findMatches = function (model, searchParams, searchRange, captureMatches, limitResultCount) {
        var searchData = searchParams.parseSearchRequest();
        if (!searchData) {
            return [];
        }
        if (searchData.regex.multiline) {
            return this._doFindMatchesMultiline(model, searchRange, new Searcher(searchData.wordSeparators, searchData.regex), captureMatches, limitResultCount);
        }
        return this._doFindMatchesLineByLine(model, searchRange, searchData, captureMatches, limitResultCount);
    };
    /**
     * Multiline search always executes on the lines concatenated with \n.
     * We must therefore compensate for the count of \n in case the model is CRLF
     */
    TextModelSearch._getMultilineMatchRange = function (model, deltaOffset, text, lfCounter, matchIndex, match0) {
        var startOffset;
        var lineFeedCountBeforeMatch = 0;
        if (lfCounter) {
            lineFeedCountBeforeMatch = lfCounter.findLineFeedCountBeforeOffset(matchIndex);
            startOffset = deltaOffset + matchIndex + lineFeedCountBeforeMatch /* add as many \r as there were \n */;
        }
        else {
            startOffset = deltaOffset + matchIndex;
        }
        var endOffset;
        if (lfCounter) {
            var lineFeedCountBeforeEndOfMatch = lfCounter.findLineFeedCountBeforeOffset(matchIndex + match0.length);
            var lineFeedCountInMatch = lineFeedCountBeforeEndOfMatch - lineFeedCountBeforeMatch;
            endOffset = startOffset + match0.length + lineFeedCountInMatch /* add as many \r as there were \n */;
        }
        else {
            endOffset = startOffset + match0.length;
        }
        var startPosition = model.getPositionAt(startOffset);
        var endPosition = model.getPositionAt(endOffset);
        return new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
    };
    TextModelSearch._doFindMatchesMultiline = function (model, searchRange, searcher, captureMatches, limitResultCount) {
        var deltaOffset = model.getOffsetAt(searchRange.getStartPosition());
        // We always execute multiline search over the lines joined with \n
        // This makes it that \n will match the EOL for both CRLF and LF models
        // We compensate for offset errors in `_getMultilineMatchRange`
        var text = model.getValueInRange(searchRange, 1 /* LF */);
        var lfCounter = (model.getEOL() === '\r\n' ? new LineFeedCounter(text) : null);
        var result = [];
        var counter = 0;
        var m;
        searcher.reset(0);
        while ((m = searcher.next(text))) {
            result[counter++] = createFindMatch(this._getMultilineMatchRange(model, deltaOffset, text, lfCounter, m.index, m[0]), m, captureMatches);
            if (counter >= limitResultCount) {
                return result;
            }
        }
        return result;
    };
    TextModelSearch._doFindMatchesLineByLine = function (model, searchRange, searchData, captureMatches, limitResultCount) {
        var result = [];
        var resultLen = 0;
        // Early case for a search range that starts & stops on the same line number
        if (searchRange.startLineNumber === searchRange.endLineNumber) {
            var text_1 = model.getLineContent(searchRange.startLineNumber).substring(searchRange.startColumn - 1, searchRange.endColumn - 1);
            resultLen = this._findMatchesInLine(searchData, text_1, searchRange.startLineNumber, searchRange.startColumn - 1, resultLen, result, captureMatches, limitResultCount);
            return result;
        }
        // Collect results from first line
        var text = model.getLineContent(searchRange.startLineNumber).substring(searchRange.startColumn - 1);
        resultLen = this._findMatchesInLine(searchData, text, searchRange.startLineNumber, searchRange.startColumn - 1, resultLen, result, captureMatches, limitResultCount);
        // Collect results from middle lines
        for (var lineNumber = searchRange.startLineNumber + 1; lineNumber < searchRange.endLineNumber && resultLen < limitResultCount; lineNumber++) {
            resultLen = this._findMatchesInLine(searchData, model.getLineContent(lineNumber), lineNumber, 0, resultLen, result, captureMatches, limitResultCount);
        }
        // Collect results from last line
        if (resultLen < limitResultCount) {
            var text_2 = model.getLineContent(searchRange.endLineNumber).substring(0, searchRange.endColumn - 1);
            resultLen = this._findMatchesInLine(searchData, text_2, searchRange.endLineNumber, 0, resultLen, result, captureMatches, limitResultCount);
        }
        return result;
    };
    TextModelSearch._findMatchesInLine = function (searchData, text, lineNumber, deltaOffset, resultLen, result, captureMatches, limitResultCount) {
        var wordSeparators = searchData.wordSeparators;
        if (!captureMatches && searchData.simpleSearch) {
            var searchString = searchData.simpleSearch;
            var searchStringLen = searchString.length;
            var textLength = text.length;
            var lastMatchIndex = -searchStringLen;
            while ((lastMatchIndex = text.indexOf(searchString, lastMatchIndex + searchStringLen)) !== -1) {
                if (!wordSeparators || isValidMatch(wordSeparators, text, textLength, lastMatchIndex, searchStringLen)) {
                    result[resultLen++] = new FindMatch(new Range(lineNumber, lastMatchIndex + 1 + deltaOffset, lineNumber, lastMatchIndex + 1 + searchStringLen + deltaOffset), null);
                    if (resultLen >= limitResultCount) {
                        return resultLen;
                    }
                }
            }
            return resultLen;
        }
        var searcher = new Searcher(searchData.wordSeparators, searchData.regex);
        var m;
        // Reset regex to search from the beginning
        searcher.reset(0);
        do {
            m = searcher.next(text);
            if (m) {
                result[resultLen++] = createFindMatch(new Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset), m, captureMatches);
                if (resultLen >= limitResultCount) {
                    return resultLen;
                }
            }
        } while (m);
        return resultLen;
    };
    TextModelSearch.findNextMatch = function (model, searchParams, searchStart, captureMatches) {
        var searchData = searchParams.parseSearchRequest();
        if (!searchData) {
            return null;
        }
        var searcher = new Searcher(searchData.wordSeparators, searchData.regex);
        if (searchData.regex.multiline) {
            return this._doFindNextMatchMultiline(model, searchStart, searcher, captureMatches);
        }
        return this._doFindNextMatchLineByLine(model, searchStart, searcher, captureMatches);
    };
    TextModelSearch._doFindNextMatchMultiline = function (model, searchStart, searcher, captureMatches) {
        var searchTextStart = new Position(searchStart.lineNumber, 1);
        var deltaOffset = model.getOffsetAt(searchTextStart);
        var lineCount = model.getLineCount();
        // We always execute multiline search over the lines joined with \n
        // This makes it that \n will match the EOL for both CRLF and LF models
        // We compensate for offset errors in `_getMultilineMatchRange`
        var text = model.getValueInRange(new Range(searchTextStart.lineNumber, searchTextStart.column, lineCount, model.getLineMaxColumn(lineCount)), 1 /* LF */);
        var lfCounter = (model.getEOL() === '\r\n' ? new LineFeedCounter(text) : null);
        searcher.reset(searchStart.column - 1);
        var m = searcher.next(text);
        if (m) {
            return createFindMatch(this._getMultilineMatchRange(model, deltaOffset, text, lfCounter, m.index, m[0]), m, captureMatches);
        }
        if (searchStart.lineNumber !== 1 || searchStart.column !== 1) {
            // Try again from the top
            return this._doFindNextMatchMultiline(model, new Position(1, 1), searcher, captureMatches);
        }
        return null;
    };
    TextModelSearch._doFindNextMatchLineByLine = function (model, searchStart, searcher, captureMatches) {
        var lineCount = model.getLineCount();
        var startLineNumber = searchStart.lineNumber;
        // Look in first line
        var text = model.getLineContent(startLineNumber);
        var r = this._findFirstMatchInLine(searcher, text, startLineNumber, searchStart.column, captureMatches);
        if (r) {
            return r;
        }
        for (var i = 1; i <= lineCount; i++) {
            var lineIndex = (startLineNumber + i - 1) % lineCount;
            var text_3 = model.getLineContent(lineIndex + 1);
            var r_1 = this._findFirstMatchInLine(searcher, text_3, lineIndex + 1, 1, captureMatches);
            if (r_1) {
                return r_1;
            }
        }
        return null;
    };
    TextModelSearch._findFirstMatchInLine = function (searcher, text, lineNumber, fromColumn, captureMatches) {
        // Set regex to search from column
        searcher.reset(fromColumn - 1);
        var m = searcher.next(text);
        if (m) {
            return createFindMatch(new Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length), m, captureMatches);
        }
        return null;
    };
    TextModelSearch.findPreviousMatch = function (model, searchParams, searchStart, captureMatches) {
        var searchData = searchParams.parseSearchRequest();
        if (!searchData) {
            return null;
        }
        var searcher = new Searcher(searchData.wordSeparators, searchData.regex);
        if (searchData.regex.multiline) {
            return this._doFindPreviousMatchMultiline(model, searchStart, searcher, captureMatches);
        }
        return this._doFindPreviousMatchLineByLine(model, searchStart, searcher, captureMatches);
    };
    TextModelSearch._doFindPreviousMatchMultiline = function (model, searchStart, searcher, captureMatches) {
        var matches = this._doFindMatchesMultiline(model, new Range(1, 1, searchStart.lineNumber, searchStart.column), searcher, captureMatches, 10 * LIMIT_FIND_COUNT);
        if (matches.length > 0) {
            return matches[matches.length - 1];
        }
        var lineCount = model.getLineCount();
        if (searchStart.lineNumber !== lineCount || searchStart.column !== model.getLineMaxColumn(lineCount)) {
            // Try again with all content
            return this._doFindPreviousMatchMultiline(model, new Position(lineCount, model.getLineMaxColumn(lineCount)), searcher, captureMatches);
        }
        return null;
    };
    TextModelSearch._doFindPreviousMatchLineByLine = function (model, searchStart, searcher, captureMatches) {
        var lineCount = model.getLineCount();
        var startLineNumber = searchStart.lineNumber;
        // Look in first line
        var text = model.getLineContent(startLineNumber).substring(0, searchStart.column - 1);
        var r = this._findLastMatchInLine(searcher, text, startLineNumber, captureMatches);
        if (r) {
            return r;
        }
        for (var i = 1; i <= lineCount; i++) {
            var lineIndex = (lineCount + startLineNumber - i - 1) % lineCount;
            var text_4 = model.getLineContent(lineIndex + 1);
            var r_2 = this._findLastMatchInLine(searcher, text_4, lineIndex + 1, captureMatches);
            if (r_2) {
                return r_2;
            }
        }
        return null;
    };
    TextModelSearch._findLastMatchInLine = function (searcher, text, lineNumber, captureMatches) {
        var bestResult = null;
        var m;
        searcher.reset(0);
        while ((m = searcher.next(text))) {
            bestResult = createFindMatch(new Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length), m, captureMatches);
        }
        return bestResult;
    };
    return TextModelSearch;
}());
export { TextModelSearch };
function leftIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength) {
    if (matchStartIndex === 0) {
        // Match starts at start of string
        return true;
    }
    var charBefore = text.charCodeAt(matchStartIndex - 1);
    if (wordSeparators.get(charBefore) !== 0 /* Regular */) {
        // The character before the match is a word separator
        return true;
    }
    if (charBefore === 13 /* CarriageReturn */ || charBefore === 10 /* LineFeed */) {
        // The character before the match is line break or carriage return.
        return true;
    }
    if (matchLength > 0) {
        var firstCharInMatch = text.charCodeAt(matchStartIndex);
        if (wordSeparators.get(firstCharInMatch) !== 0 /* Regular */) {
            // The first character inside the match is a word separator
            return true;
        }
    }
    return false;
}
function rightIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength) {
    if (matchStartIndex + matchLength === textLength) {
        // Match ends at end of string
        return true;
    }
    var charAfter = text.charCodeAt(matchStartIndex + matchLength);
    if (wordSeparators.get(charAfter) !== 0 /* Regular */) {
        // The character after the match is a word separator
        return true;
    }
    if (charAfter === 13 /* CarriageReturn */ || charAfter === 10 /* LineFeed */) {
        // The character after the match is line break or carriage return.
        return true;
    }
    if (matchLength > 0) {
        var lastCharInMatch = text.charCodeAt(matchStartIndex + matchLength - 1);
        if (wordSeparators.get(lastCharInMatch) !== 0 /* Regular */) {
            // The last character in the match is a word separator
            return true;
        }
    }
    return false;
}
export function isValidMatch(wordSeparators, text, textLength, matchStartIndex, matchLength) {
    return (leftIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength)
        && rightIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength));
}
var Searcher = /** @class */ (function () {
    function Searcher(wordSeparators, searchRegex) {
        this._wordSeparators = wordSeparators;
        this._searchRegex = searchRegex;
        this._prevMatchStartIndex = -1;
        this._prevMatchLength = 0;
    }
    Searcher.prototype.reset = function (lastIndex) {
        this._searchRegex.lastIndex = lastIndex;
        this._prevMatchStartIndex = -1;
        this._prevMatchLength = 0;
    };
    Searcher.prototype.next = function (text) {
        var textLength = text.length;
        var m;
        do {
            if (this._prevMatchStartIndex + this._prevMatchLength === textLength) {
                // Reached the end of the line
                return null;
            }
            m = this._searchRegex.exec(text);
            if (!m) {
                return null;
            }
            var matchStartIndex = m.index;
            var matchLength = m[0].length;
            if (matchStartIndex === this._prevMatchStartIndex && matchLength === this._prevMatchLength) {
                // Exit early if the regex matches the same range twice
                return null;
            }
            this._prevMatchStartIndex = matchStartIndex;
            this._prevMatchLength = matchLength;
            if (!this._wordSeparators || isValidMatch(this._wordSeparators, text, textLength, matchStartIndex, matchLength)) {
                return m;
            }
        } while (m);
        return null;
    };
    return Searcher;
}());
export { Searcher };
