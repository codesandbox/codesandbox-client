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
import { SingleCursorState } from './cursorCommon.js';
import { getMapForWordSeparators } from './wordCharacterClassifier.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
var WordOperations = /** @class */ (function () {
    function WordOperations() {
    }
    WordOperations._createWord = function (lineContent, wordType, nextCharClass, start, end) {
        // console.log('WORD ==> ' + start + ' => ' + end + ':::: <<<' + lineContent.substring(start, end) + '>>>');
        return { start: start, end: end, wordType: wordType, nextCharClass: nextCharClass };
    };
    WordOperations._findPreviousWordOnLine = function (wordSeparators, model, position) {
        var lineContent = model.getLineContent(position.lineNumber);
        return this._doFindPreviousWordOnLine(lineContent, wordSeparators, position);
    };
    WordOperations._doFindPreviousWordOnLine = function (lineContent, wordSeparators, position) {
        var wordType = 0 /* None */;
        for (var chIndex = position.column - 2; chIndex >= 0; chIndex--) {
            var chCode = lineContent.charCodeAt(chIndex);
            var chClass = wordSeparators.get(chCode);
            if (chClass === 0 /* Regular */) {
                if (wordType === 2 /* Separator */) {
                    return this._createWord(lineContent, wordType, chClass, chIndex + 1, this._findEndOfWord(lineContent, wordSeparators, wordType, chIndex + 1));
                }
                wordType = 1 /* Regular */;
            }
            else if (chClass === 2 /* WordSeparator */) {
                if (wordType === 1 /* Regular */) {
                    return this._createWord(lineContent, wordType, chClass, chIndex + 1, this._findEndOfWord(lineContent, wordSeparators, wordType, chIndex + 1));
                }
                wordType = 2 /* Separator */;
            }
            else if (chClass === 1 /* Whitespace */) {
                if (wordType !== 0 /* None */) {
                    return this._createWord(lineContent, wordType, chClass, chIndex + 1, this._findEndOfWord(lineContent, wordSeparators, wordType, chIndex + 1));
                }
            }
        }
        if (wordType !== 0 /* None */) {
            return this._createWord(lineContent, wordType, 1 /* Whitespace */, 0, this._findEndOfWord(lineContent, wordSeparators, wordType, 0));
        }
        return null;
    };
    WordOperations._findEndOfWord = function (lineContent, wordSeparators, wordType, startIndex) {
        var len = lineContent.length;
        for (var chIndex = startIndex; chIndex < len; chIndex++) {
            var chCode = lineContent.charCodeAt(chIndex);
            var chClass = wordSeparators.get(chCode);
            if (chClass === 1 /* Whitespace */) {
                return chIndex;
            }
            if (wordType === 1 /* Regular */ && chClass === 2 /* WordSeparator */) {
                return chIndex;
            }
            if (wordType === 2 /* Separator */ && chClass === 0 /* Regular */) {
                return chIndex;
            }
        }
        return len;
    };
    WordOperations._findNextWordOnLine = function (wordSeparators, model, position) {
        var lineContent = model.getLineContent(position.lineNumber);
        return this._doFindNextWordOnLine(lineContent, wordSeparators, position);
    };
    WordOperations._doFindNextWordOnLine = function (lineContent, wordSeparators, position) {
        var wordType = 0 /* None */;
        var len = lineContent.length;
        for (var chIndex = position.column - 1; chIndex < len; chIndex++) {
            var chCode = lineContent.charCodeAt(chIndex);
            var chClass = wordSeparators.get(chCode);
            if (chClass === 0 /* Regular */) {
                if (wordType === 2 /* Separator */) {
                    return this._createWord(lineContent, wordType, chClass, this._findStartOfWord(lineContent, wordSeparators, wordType, chIndex - 1), chIndex);
                }
                wordType = 1 /* Regular */;
            }
            else if (chClass === 2 /* WordSeparator */) {
                if (wordType === 1 /* Regular */) {
                    return this._createWord(lineContent, wordType, chClass, this._findStartOfWord(lineContent, wordSeparators, wordType, chIndex - 1), chIndex);
                }
                wordType = 2 /* Separator */;
            }
            else if (chClass === 1 /* Whitespace */) {
                if (wordType !== 0 /* None */) {
                    return this._createWord(lineContent, wordType, chClass, this._findStartOfWord(lineContent, wordSeparators, wordType, chIndex - 1), chIndex);
                }
            }
        }
        if (wordType !== 0 /* None */) {
            return this._createWord(lineContent, wordType, 1 /* Whitespace */, this._findStartOfWord(lineContent, wordSeparators, wordType, len - 1), len);
        }
        return null;
    };
    WordOperations._findStartOfWord = function (lineContent, wordSeparators, wordType, startIndex) {
        for (var chIndex = startIndex; chIndex >= 0; chIndex--) {
            var chCode = lineContent.charCodeAt(chIndex);
            var chClass = wordSeparators.get(chCode);
            if (chClass === 1 /* Whitespace */) {
                return chIndex + 1;
            }
            if (wordType === 1 /* Regular */ && chClass === 2 /* WordSeparator */) {
                return chIndex + 1;
            }
            if (wordType === 2 /* Separator */ && chClass === 0 /* Regular */) {
                return chIndex + 1;
            }
        }
        return 0;
    };
    WordOperations.moveWordLeft = function (wordSeparators, model, position, wordNavigationType) {
        var lineNumber = position.lineNumber;
        var column = position.column;
        var movedToPreviousLine = false;
        if (column === 1) {
            if (lineNumber > 1) {
                movedToPreviousLine = true;
                lineNumber = lineNumber - 1;
                column = model.getLineMaxColumn(lineNumber);
            }
        }
        var prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, column));
        if (wordNavigationType === 0 /* WordStart */) {
            if (prevWordOnLine && !movedToPreviousLine) {
                // Special case for Visual Studio compatibility:
                // when starting in the trim whitespace at the end of a line,
                // go to the end of the last word
                var lastWhitespaceColumn = model.getLineLastNonWhitespaceColumn(lineNumber);
                if (lastWhitespaceColumn < column) {
                    return new Position(lineNumber, prevWordOnLine.end + 1);
                }
            }
            return new Position(lineNumber, prevWordOnLine ? prevWordOnLine.start + 1 : 1);
        }
        if (wordNavigationType === 1 /* WordStartFast */) {
            if (prevWordOnLine
                && prevWordOnLine.wordType === 2 /* Separator */
                && prevWordOnLine.end - prevWordOnLine.start === 1
                && prevWordOnLine.nextCharClass === 0 /* Regular */) {
                // Skip over a word made up of one single separator and followed by a regular character
                prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, prevWordOnLine.start + 1));
            }
            return new Position(lineNumber, prevWordOnLine ? prevWordOnLine.start + 1 : 1);
        }
        // We are stopping at the ending of words
        if (prevWordOnLine && column <= prevWordOnLine.end + 1) {
            prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, prevWordOnLine.start + 1));
        }
        return new Position(lineNumber, prevWordOnLine ? prevWordOnLine.end + 1 : 1);
    };
    WordOperations._moveWordPartLeft = function (model, position) {
        var lineNumber = position.lineNumber;
        var maxColumn = model.getLineMaxColumn(lineNumber);
        if (position.column === 1) {
            return (lineNumber > 1 ? new Position(lineNumber - 1, model.getLineMaxColumn(lineNumber - 1)) : position);
        }
        var lineContent = model.getLineContent(lineNumber);
        for (var column = position.column - 1; column > 1; column--) {
            var left = lineContent.charCodeAt(column - 2);
            var right = lineContent.charCodeAt(column - 1);
            if (left !== 95 /* Underline */ && right === 95 /* Underline */) {
                // snake_case_variables
                return new Position(lineNumber, column);
            }
            if (strings.isLowerAsciiLetter(left) && strings.isUpperAsciiLetter(right)) {
                // camelCaseVariables
                return new Position(lineNumber, column);
            }
            if (strings.isUpperAsciiLetter(left) && strings.isUpperAsciiLetter(right)) {
                // thisIsACamelCaseWithOneLetterWords
                if (column + 1 < maxColumn) {
                    var rightRight = lineContent.charCodeAt(column);
                    if (strings.isLowerAsciiLetter(rightRight)) {
                        return new Position(lineNumber, column);
                    }
                }
            }
        }
        return new Position(lineNumber, 1);
    };
    WordOperations.moveWordRight = function (wordSeparators, model, position, wordNavigationType) {
        var lineNumber = position.lineNumber;
        var column = position.column;
        if (column === model.getLineMaxColumn(lineNumber)) {
            if (lineNumber < model.getLineCount()) {
                lineNumber = lineNumber + 1;
                column = 1;
            }
        }
        var nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, column));
        if (wordNavigationType === 2 /* WordEnd */) {
            if (nextWordOnLine && nextWordOnLine.wordType === 2 /* Separator */) {
                if (nextWordOnLine.end - nextWordOnLine.start === 1 && nextWordOnLine.nextCharClass === 0 /* Regular */) {
                    // Skip over a word made up of one single separator and followed by a regular character
                    nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, nextWordOnLine.end + 1));
                }
            }
            if (nextWordOnLine) {
                column = nextWordOnLine.end + 1;
            }
            else {
                column = model.getLineMaxColumn(lineNumber);
            }
        }
        else {
            if (nextWordOnLine && column >= nextWordOnLine.start + 1) {
                nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, nextWordOnLine.end + 1));
            }
            if (nextWordOnLine) {
                column = nextWordOnLine.start + 1;
            }
            else {
                column = model.getLineMaxColumn(lineNumber);
            }
        }
        return new Position(lineNumber, column);
    };
    WordOperations._moveWordPartRight = function (model, position) {
        var lineNumber = position.lineNumber;
        var maxColumn = model.getLineMaxColumn(lineNumber);
        if (position.column === maxColumn) {
            return (lineNumber < model.getLineCount() ? new Position(lineNumber + 1, 1) : position);
        }
        var lineContent = model.getLineContent(lineNumber);
        for (var column = position.column + 1; column < maxColumn; column++) {
            var left = lineContent.charCodeAt(column - 2);
            var right = lineContent.charCodeAt(column - 1);
            if (left === 95 /* Underline */ && right !== 95 /* Underline */) {
                // snake_case_variables
                return new Position(lineNumber, column);
            }
            if (strings.isLowerAsciiLetter(left) && strings.isUpperAsciiLetter(right)) {
                // camelCaseVariables
                return new Position(lineNumber, column);
            }
            if (strings.isUpperAsciiLetter(left) && strings.isUpperAsciiLetter(right)) {
                // thisIsACamelCaseWithOneLetterWords
                if (column + 1 < maxColumn) {
                    var rightRight = lineContent.charCodeAt(column);
                    if (strings.isLowerAsciiLetter(rightRight)) {
                        return new Position(lineNumber, column);
                    }
                }
            }
        }
        return new Position(lineNumber, maxColumn);
    };
    WordOperations._deleteWordLeftWhitespace = function (model, position) {
        var lineContent = model.getLineContent(position.lineNumber);
        var startIndex = position.column - 2;
        var lastNonWhitespace = strings.lastNonWhitespaceIndex(lineContent, startIndex);
        if (lastNonWhitespace + 1 < startIndex) {
            return new Range(position.lineNumber, lastNonWhitespace + 2, position.lineNumber, position.column);
        }
        return null;
    };
    WordOperations.deleteWordLeft = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        if (!selection.isEmpty()) {
            return selection;
        }
        var position = new Position(selection.positionLineNumber, selection.positionColumn);
        var lineNumber = position.lineNumber;
        var column = position.column;
        if (lineNumber === 1 && column === 1) {
            // Ignore deleting at beginning of file
            return null;
        }
        if (whitespaceHeuristics) {
            var r = this._deleteWordLeftWhitespace(model, position);
            if (r) {
                return r;
            }
        }
        var prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, position);
        if (wordNavigationType === 0 /* WordStart */) {
            if (prevWordOnLine) {
                column = prevWordOnLine.start + 1;
            }
            else {
                if (column > 1) {
                    column = 1;
                }
                else {
                    lineNumber--;
                    column = model.getLineMaxColumn(lineNumber);
                }
            }
        }
        else {
            if (prevWordOnLine && column <= prevWordOnLine.end + 1) {
                prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, prevWordOnLine.start + 1));
            }
            if (prevWordOnLine) {
                column = prevWordOnLine.end + 1;
            }
            else {
                if (column > 1) {
                    column = 1;
                }
                else {
                    lineNumber--;
                    column = model.getLineMaxColumn(lineNumber);
                }
            }
        }
        return new Range(lineNumber, column, position.lineNumber, position.column);
    };
    WordOperations._deleteWordPartLeft = function (model, selection) {
        if (!selection.isEmpty()) {
            return selection;
        }
        var pos = selection.getPosition();
        var toPosition = WordOperations._moveWordPartLeft(model, pos);
        return new Range(pos.lineNumber, pos.column, toPosition.lineNumber, toPosition.column);
    };
    WordOperations._findFirstNonWhitespaceChar = function (str, startIndex) {
        var len = str.length;
        for (var chIndex = startIndex; chIndex < len; chIndex++) {
            var ch = str.charAt(chIndex);
            if (ch !== ' ' && ch !== '\t') {
                return chIndex;
            }
        }
        return len;
    };
    WordOperations._deleteWordRightWhitespace = function (model, position) {
        var lineContent = model.getLineContent(position.lineNumber);
        var startIndex = position.column - 1;
        var firstNonWhitespace = this._findFirstNonWhitespaceChar(lineContent, startIndex);
        if (startIndex + 1 < firstNonWhitespace) {
            // bingo
            return new Range(position.lineNumber, position.column, position.lineNumber, firstNonWhitespace + 1);
        }
        return null;
    };
    WordOperations.deleteWordRight = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
        if (!selection.isEmpty()) {
            return selection;
        }
        var position = new Position(selection.positionLineNumber, selection.positionColumn);
        var lineNumber = position.lineNumber;
        var column = position.column;
        var lineCount = model.getLineCount();
        var maxColumn = model.getLineMaxColumn(lineNumber);
        if (lineNumber === lineCount && column === maxColumn) {
            // Ignore deleting at end of file
            return null;
        }
        if (whitespaceHeuristics) {
            var r = this._deleteWordRightWhitespace(model, position);
            if (r) {
                return r;
            }
        }
        var nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, position);
        if (wordNavigationType === 2 /* WordEnd */) {
            if (nextWordOnLine) {
                column = nextWordOnLine.end + 1;
            }
            else {
                if (column < maxColumn || lineNumber === lineCount) {
                    column = maxColumn;
                }
                else {
                    lineNumber++;
                    nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, 1));
                    if (nextWordOnLine) {
                        column = nextWordOnLine.start + 1;
                    }
                    else {
                        column = model.getLineMaxColumn(lineNumber);
                    }
                }
            }
        }
        else {
            if (nextWordOnLine && column >= nextWordOnLine.start + 1) {
                nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, nextWordOnLine.end + 1));
            }
            if (nextWordOnLine) {
                column = nextWordOnLine.start + 1;
            }
            else {
                if (column < maxColumn || lineNumber === lineCount) {
                    column = maxColumn;
                }
                else {
                    lineNumber++;
                    nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, 1));
                    if (nextWordOnLine) {
                        column = nextWordOnLine.start + 1;
                    }
                    else {
                        column = model.getLineMaxColumn(lineNumber);
                    }
                }
            }
        }
        return new Range(lineNumber, column, position.lineNumber, position.column);
    };
    WordOperations._deleteWordPartRight = function (model, selection) {
        if (!selection.isEmpty()) {
            return selection;
        }
        var pos = selection.getPosition();
        var toPosition = WordOperations._moveWordPartRight(model, pos);
        return new Range(pos.lineNumber, pos.column, toPosition.lineNumber, toPosition.column);
    };
    WordOperations.word = function (config, model, cursor, inSelectionMode, position) {
        var wordSeparators = getMapForWordSeparators(config.wordSeparators);
        var prevWord = WordOperations._findPreviousWordOnLine(wordSeparators, model, position);
        var nextWord = WordOperations._findNextWordOnLine(wordSeparators, model, position);
        if (!inSelectionMode) {
            // Entering word selection for the first time
            var startColumn_1;
            var endColumn_1;
            if (prevWord && prevWord.wordType === 1 /* Regular */ && prevWord.start <= position.column - 1 && position.column - 1 <= prevWord.end) {
                // isTouchingPrevWord
                startColumn_1 = prevWord.start + 1;
                endColumn_1 = prevWord.end + 1;
            }
            else if (nextWord && nextWord.wordType === 1 /* Regular */ && nextWord.start <= position.column - 1 && position.column - 1 <= nextWord.end) {
                // isTouchingNextWord
                startColumn_1 = nextWord.start + 1;
                endColumn_1 = nextWord.end + 1;
            }
            else {
                if (prevWord) {
                    startColumn_1 = prevWord.end + 1;
                }
                else {
                    startColumn_1 = 1;
                }
                if (nextWord) {
                    endColumn_1 = nextWord.start + 1;
                }
                else {
                    endColumn_1 = model.getLineMaxColumn(position.lineNumber);
                }
            }
            return new SingleCursorState(new Range(position.lineNumber, startColumn_1, position.lineNumber, endColumn_1), 0, new Position(position.lineNumber, endColumn_1), 0);
        }
        var startColumn;
        var endColumn;
        if (prevWord && prevWord.wordType === 1 /* Regular */ && prevWord.start < position.column - 1 && position.column - 1 < prevWord.end) {
            // isInsidePrevWord
            startColumn = prevWord.start + 1;
            endColumn = prevWord.end + 1;
        }
        else if (nextWord && nextWord.wordType === 1 /* Regular */ && nextWord.start < position.column - 1 && position.column - 1 < nextWord.end) {
            // isInsideNextWord
            startColumn = nextWord.start + 1;
            endColumn = nextWord.end + 1;
        }
        else {
            startColumn = position.column;
            endColumn = position.column;
        }
        var lineNumber = position.lineNumber;
        var column;
        if (cursor.selectionStart.containsPosition(position)) {
            column = cursor.selectionStart.endColumn;
        }
        else if (position.isBeforeOrEqual(cursor.selectionStart.getStartPosition())) {
            column = startColumn;
            var possiblePosition = new Position(lineNumber, column);
            if (cursor.selectionStart.containsPosition(possiblePosition)) {
                column = cursor.selectionStart.endColumn;
            }
        }
        else {
            column = endColumn;
            var possiblePosition = new Position(lineNumber, column);
            if (cursor.selectionStart.containsPosition(possiblePosition)) {
                column = cursor.selectionStart.startColumn;
            }
        }
        return cursor.move(true, lineNumber, column, 0);
    };
    return WordOperations;
}());
export { WordOperations };
var WordPartOperations = /** @class */ (function (_super) {
    __extends(WordPartOperations, _super);
    function WordPartOperations() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WordPartOperations.deleteWordPartLeft = function (wordSeparators, model, selection, whitespaceHeuristics) {
        var candidates = enforceDefined([
            WordOperations.deleteWordLeft(wordSeparators, model, selection, whitespaceHeuristics, 0 /* WordStart */),
            WordOperations.deleteWordLeft(wordSeparators, model, selection, whitespaceHeuristics, 2 /* WordEnd */),
            WordOperations._deleteWordPartLeft(model, selection)
        ]);
        candidates.sort(Range.compareRangesUsingEnds);
        return candidates[2];
    };
    WordPartOperations.deleteWordPartRight = function (wordSeparators, model, selection, whitespaceHeuristics) {
        var candidates = enforceDefined([
            WordOperations.deleteWordRight(wordSeparators, model, selection, whitespaceHeuristics, 0 /* WordStart */),
            WordOperations.deleteWordRight(wordSeparators, model, selection, whitespaceHeuristics, 2 /* WordEnd */),
            WordOperations._deleteWordPartRight(model, selection)
        ]);
        candidates.sort(Range.compareRangesUsingStarts);
        return candidates[0];
    };
    WordPartOperations.moveWordPartLeft = function (wordSeparators, model, position) {
        var candidates = enforceDefined([
            WordOperations.moveWordLeft(wordSeparators, model, position, 0 /* WordStart */),
            WordOperations.moveWordLeft(wordSeparators, model, position, 2 /* WordEnd */),
            WordOperations._moveWordPartLeft(model, position)
        ]);
        candidates.sort(Position.compare);
        return candidates[2];
    };
    WordPartOperations.moveWordPartRight = function (wordSeparators, model, position) {
        var candidates = enforceDefined([
            WordOperations.moveWordRight(wordSeparators, model, position, 0 /* WordStart */),
            WordOperations.moveWordRight(wordSeparators, model, position, 2 /* WordEnd */),
            WordOperations._moveWordPartRight(model, position)
        ]);
        candidates.sort(Position.compare);
        return candidates[0];
    };
    return WordPartOperations;
}(WordOperations));
export { WordPartOperations };
function enforceDefined(arr) {
    return arr.filter(function (el) { return Boolean(el); });
}
