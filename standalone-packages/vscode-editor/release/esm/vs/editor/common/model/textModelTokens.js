/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as arrays from '../../../base/common/arrays.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { LineTokens } from '../core/lineTokens.js';
import { Position } from '../core/position.js';
import { nullTokenize2 } from '../modes/nullMode.js';
function getDefaultMetadata(topLevelLanguageId) {
    return ((topLevelLanguageId << 0 /* LANGUAGEID_OFFSET */)
        | (0 /* Other */ << 8 /* TOKEN_TYPE_OFFSET */)
        | (0 /* None */ << 11 /* FONT_STYLE_OFFSET */)
        | (1 /* DefaultForeground */ << 14 /* FOREGROUND_OFFSET */)
        | (2 /* DefaultBackground */ << 23 /* BACKGROUND_OFFSET */)) >>> 0;
}
var EMPTY_LINE_TOKENS = (new Uint32Array(0)).buffer;
var ModelLineTokens = /** @class */ (function () {
    function ModelLineTokens(state) {
        this._state = state;
        this._lineTokens = null;
        this._invalid = true;
    }
    ModelLineTokens.prototype.deleteBeginning = function (toChIndex) {
        if (this._lineTokens === null || this._lineTokens === EMPTY_LINE_TOKENS) {
            return;
        }
        this.delete(0, toChIndex);
    };
    ModelLineTokens.prototype.deleteEnding = function (fromChIndex) {
        if (this._lineTokens === null || this._lineTokens === EMPTY_LINE_TOKENS) {
            return;
        }
        var tokens = new Uint32Array(this._lineTokens);
        var lineTextLength = tokens[tokens.length - 2];
        this.delete(fromChIndex, lineTextLength);
    };
    ModelLineTokens.prototype.delete = function (fromChIndex, toChIndex) {
        if (this._lineTokens === null || this._lineTokens === EMPTY_LINE_TOKENS || fromChIndex === toChIndex) {
            return;
        }
        var tokens = new Uint32Array(this._lineTokens);
        var tokensCount = (tokens.length >>> 1);
        // special case: deleting everything
        if (fromChIndex === 0 && tokens[tokens.length - 2] === toChIndex) {
            this._lineTokens = EMPTY_LINE_TOKENS;
            return;
        }
        var fromTokenIndex = LineTokens.findIndexInTokensArray(tokens, fromChIndex);
        var fromTokenStartOffset = (fromTokenIndex > 0 ? tokens[(fromTokenIndex - 1) << 1] : 0);
        var fromTokenEndOffset = tokens[fromTokenIndex << 1];
        if (toChIndex < fromTokenEndOffset) {
            // the delete range is inside a single token
            var delta_1 = (toChIndex - fromChIndex);
            for (var i = fromTokenIndex; i < tokensCount; i++) {
                tokens[i << 1] -= delta_1;
            }
            return;
        }
        var dest;
        var lastEnd;
        if (fromTokenStartOffset !== fromChIndex) {
            tokens[fromTokenIndex << 1] = fromChIndex;
            dest = ((fromTokenIndex + 1) << 1);
            lastEnd = fromChIndex;
        }
        else {
            dest = (fromTokenIndex << 1);
            lastEnd = fromTokenStartOffset;
        }
        var delta = (toChIndex - fromChIndex);
        for (var tokenIndex = fromTokenIndex + 1; tokenIndex < tokensCount; tokenIndex++) {
            var tokenEndOffset = tokens[tokenIndex << 1] - delta;
            if (tokenEndOffset > lastEnd) {
                tokens[dest++] = tokenEndOffset;
                tokens[dest++] = tokens[(tokenIndex << 1) + 1];
                lastEnd = tokenEndOffset;
            }
        }
        if (dest === tokens.length) {
            // nothing to trim
            return;
        }
        var tmp = new Uint32Array(dest);
        tmp.set(tokens.subarray(0, dest), 0);
        this._lineTokens = tmp.buffer;
    };
    ModelLineTokens.prototype.append = function (_otherTokens) {
        if (_otherTokens === EMPTY_LINE_TOKENS) {
            return;
        }
        if (this._lineTokens === EMPTY_LINE_TOKENS) {
            this._lineTokens = _otherTokens;
            return;
        }
        if (this._lineTokens === null) {
            return;
        }
        if (_otherTokens === null) {
            // cannot determine combined line length...
            this._lineTokens = null;
            return;
        }
        var myTokens = new Uint32Array(this._lineTokens);
        var otherTokens = new Uint32Array(_otherTokens);
        var otherTokensCount = (otherTokens.length >>> 1);
        var result = new Uint32Array(myTokens.length + otherTokens.length);
        result.set(myTokens, 0);
        var dest = myTokens.length;
        var delta = myTokens[myTokens.length - 2];
        for (var i = 0; i < otherTokensCount; i++) {
            result[dest++] = otherTokens[(i << 1)] + delta;
            result[dest++] = otherTokens[(i << 1) + 1];
        }
        this._lineTokens = result.buffer;
    };
    ModelLineTokens.prototype.insert = function (chIndex, textLength) {
        if (!this._lineTokens) {
            // nothing to do
            return;
        }
        var tokens = new Uint32Array(this._lineTokens);
        var tokensCount = (tokens.length >>> 1);
        var fromTokenIndex = LineTokens.findIndexInTokensArray(tokens, chIndex);
        if (fromTokenIndex > 0) {
            var fromTokenStartOffset = (fromTokenIndex > 0 ? tokens[(fromTokenIndex - 1) << 1] : 0);
            if (fromTokenStartOffset === chIndex) {
                fromTokenIndex--;
            }
        }
        for (var tokenIndex = fromTokenIndex; tokenIndex < tokensCount; tokenIndex++) {
            tokens[tokenIndex << 1] += textLength;
        }
    };
    return ModelLineTokens;
}());
var ModelLinesTokens = /** @class */ (function () {
    function ModelLinesTokens(languageIdentifier, tokenizationSupport) {
        this.languageIdentifier = languageIdentifier;
        this.tokenizationSupport = tokenizationSupport;
        this._tokens = [];
        if (this.tokenizationSupport) {
            var initialState = null;
            try {
                initialState = this.tokenizationSupport.getInitialState();
            }
            catch (e) {
                onUnexpectedError(e);
                this.tokenizationSupport = null;
            }
            if (initialState) {
                this._tokens[0] = new ModelLineTokens(initialState);
            }
        }
        this._invalidLineStartIndex = 0;
        this._lastState = null;
    }
    Object.defineProperty(ModelLinesTokens.prototype, "inValidLineStartIndex", {
        get: function () {
            return this._invalidLineStartIndex;
        },
        enumerable: true,
        configurable: true
    });
    ModelLinesTokens.prototype.getTokens = function (topLevelLanguageId, lineIndex, lineText) {
        var rawLineTokens = null;
        if (lineIndex < this._tokens.length && this._tokens[lineIndex]) {
            rawLineTokens = this._tokens[lineIndex]._lineTokens;
        }
        if (rawLineTokens !== null && rawLineTokens !== EMPTY_LINE_TOKENS) {
            return new LineTokens(new Uint32Array(rawLineTokens), lineText);
        }
        var lineTokens = new Uint32Array(2);
        lineTokens[0] = lineText.length;
        lineTokens[1] = getDefaultMetadata(topLevelLanguageId);
        return new LineTokens(lineTokens, lineText);
    };
    ModelLinesTokens.prototype.isCheapToTokenize = function (lineNumber) {
        var firstInvalidLineNumber = this._invalidLineStartIndex + 1;
        return (firstInvalidLineNumber >= lineNumber);
    };
    ModelLinesTokens.prototype.hasLinesToTokenize = function (buffer) {
        return (this._invalidLineStartIndex < buffer.getLineCount());
    };
    ModelLinesTokens.prototype.invalidateLine = function (lineIndex) {
        this._setIsInvalid(lineIndex, true);
        if (lineIndex < this._invalidLineStartIndex) {
            this._setIsInvalid(this._invalidLineStartIndex, true);
            this._invalidLineStartIndex = lineIndex;
        }
    };
    ModelLinesTokens.prototype._setIsInvalid = function (lineIndex, invalid) {
        if (lineIndex < this._tokens.length && this._tokens[lineIndex]) {
            this._tokens[lineIndex]._invalid = invalid;
        }
    };
    ModelLinesTokens.prototype._isInvalid = function (lineIndex) {
        if (lineIndex < this._tokens.length && this._tokens[lineIndex]) {
            return this._tokens[lineIndex]._invalid;
        }
        return true;
    };
    ModelLinesTokens.prototype._getState = function (lineIndex) {
        if (lineIndex < this._tokens.length && this._tokens[lineIndex]) {
            return this._tokens[lineIndex]._state;
        }
        return null;
    };
    ModelLinesTokens.prototype._setTokens = function (topLevelLanguageId, lineIndex, lineTextLength, tokens) {
        var target;
        if (lineIndex < this._tokens.length && this._tokens[lineIndex]) {
            target = this._tokens[lineIndex];
        }
        else {
            target = new ModelLineTokens(null);
            this._tokens[lineIndex] = target;
        }
        if (lineTextLength === 0) {
            target._lineTokens = EMPTY_LINE_TOKENS;
            return;
        }
        if (!tokens || tokens.length === 0) {
            tokens = new Uint32Array(2);
            tokens[0] = 0;
            tokens[1] = getDefaultMetadata(topLevelLanguageId);
        }
        LineTokens.convertToEndOffset(tokens, lineTextLength);
        target._lineTokens = tokens.buffer;
    };
    ModelLinesTokens.prototype._setState = function (lineIndex, state) {
        if (lineIndex < this._tokens.length && this._tokens[lineIndex]) {
            this._tokens[lineIndex]._state = state;
        }
        else {
            var tmp = new ModelLineTokens(state);
            this._tokens[lineIndex] = tmp;
        }
    };
    //#region Editing
    ModelLinesTokens.prototype.applyEdits = function (range, eolCount, firstLineLength) {
        var deletingLinesCnt = range.endLineNumber - range.startLineNumber;
        var insertingLinesCnt = eolCount;
        var editingLinesCnt = Math.min(deletingLinesCnt, insertingLinesCnt);
        for (var j = editingLinesCnt; j >= 0; j--) {
            this.invalidateLine(range.startLineNumber + j - 1);
        }
        this._acceptDeleteRange(range);
        this._acceptInsertText(new Position(range.startLineNumber, range.startColumn), eolCount, firstLineLength);
    };
    ModelLinesTokens.prototype._acceptDeleteRange = function (range) {
        var firstLineIndex = range.startLineNumber - 1;
        if (firstLineIndex >= this._tokens.length) {
            return;
        }
        if (range.startLineNumber === range.endLineNumber) {
            if (range.startColumn === range.endColumn) {
                // Nothing to delete
                return;
            }
            this._tokens[firstLineIndex].delete(range.startColumn - 1, range.endColumn - 1);
            return;
        }
        var firstLine = this._tokens[firstLineIndex];
        firstLine.deleteEnding(range.startColumn - 1);
        var lastLineIndex = range.endLineNumber - 1;
        var lastLineTokens = null;
        if (lastLineIndex < this._tokens.length) {
            var lastLine = this._tokens[lastLineIndex];
            lastLine.deleteBeginning(range.endColumn - 1);
            lastLineTokens = lastLine._lineTokens;
        }
        // Take remaining text on last line and append it to remaining text on first line
        firstLine.append(lastLineTokens);
        // Delete middle lines
        this._tokens.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);
    };
    ModelLinesTokens.prototype._acceptInsertText = function (position, eolCount, firstLineLength) {
        if (eolCount === 0 && firstLineLength === 0) {
            // Nothing to insert
            return;
        }
        var lineIndex = position.lineNumber - 1;
        if (lineIndex >= this._tokens.length) {
            return;
        }
        if (eolCount === 0) {
            // Inserting text on one line
            this._tokens[lineIndex].insert(position.column - 1, firstLineLength);
            return;
        }
        var line = this._tokens[lineIndex];
        line.deleteEnding(position.column - 1);
        line.insert(position.column - 1, firstLineLength);
        var insert = new Array(eolCount);
        for (var i = eolCount - 1; i >= 0; i--) {
            insert[i] = new ModelLineTokens(null);
        }
        this._tokens = arrays.arrayInsert(this._tokens, position.lineNumber, insert);
    };
    //#endregion
    //#region Tokenization
    ModelLinesTokens.prototype._tokenizeOneLine = function (buffer, eventBuilder) {
        if (!this.hasLinesToTokenize(buffer)) {
            return buffer.getLineCount() + 1;
        }
        var lineNumber = this._invalidLineStartIndex + 1;
        this._updateTokensUntilLine(buffer, eventBuilder, lineNumber);
        return lineNumber;
    };
    ModelLinesTokens.prototype._tokenizeText = function (buffer, text, state) {
        var r = null;
        if (this.tokenizationSupport) {
            try {
                r = this.tokenizationSupport.tokenize2(text, state, 0);
            }
            catch (e) {
                onUnexpectedError(e);
            }
        }
        if (!r) {
            r = nullTokenize2(this.languageIdentifier.id, text, state, 0);
        }
        return r;
    };
    ModelLinesTokens.prototype._updateTokensUntilLine = function (buffer, eventBuilder, lineNumber) {
        if (!this.tokenizationSupport) {
            this._invalidLineStartIndex = buffer.getLineCount();
            return;
        }
        var linesLength = buffer.getLineCount();
        var endLineIndex = lineNumber - 1;
        // Validate all states up to and including endLineIndex
        for (var lineIndex = this._invalidLineStartIndex; lineIndex <= endLineIndex; lineIndex++) {
            var endStateIndex = lineIndex + 1;
            var text = buffer.getLineContent(lineIndex + 1);
            var lineStartState = this._getState(lineIndex);
            var r = null;
            try {
                // Tokenize only the first X characters
                var freshState = lineStartState.clone();
                r = this.tokenizationSupport.tokenize2(text, freshState, 0);
            }
            catch (e) {
                onUnexpectedError(e);
            }
            if (!r) {
                r = nullTokenize2(this.languageIdentifier.id, text, lineStartState, 0);
            }
            this._setTokens(this.languageIdentifier.id, lineIndex, text.length, r.tokens);
            eventBuilder.registerChangedTokens(lineIndex + 1);
            this._setIsInvalid(lineIndex, false);
            if (endStateIndex < linesLength) {
                var previousEndState = this._getState(endStateIndex);
                if (previousEndState !== null && r.endState.equals(previousEndState)) {
                    // The end state of this line remains the same
                    var nextInvalidLineIndex = lineIndex + 1;
                    while (nextInvalidLineIndex < linesLength) {
                        if (this._isInvalid(nextInvalidLineIndex)) {
                            break;
                        }
                        if (nextInvalidLineIndex + 1 < linesLength) {
                            if (this._getState(nextInvalidLineIndex + 1) === null) {
                                break;
                            }
                        }
                        else {
                            if (this._lastState === null) {
                                break;
                            }
                        }
                        nextInvalidLineIndex++;
                    }
                    this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, nextInvalidLineIndex);
                    lineIndex = nextInvalidLineIndex - 1; // -1 because the outer loop increments it
                }
                else {
                    this._setState(endStateIndex, r.endState);
                }
            }
            else {
                this._lastState = r.endState;
            }
        }
        this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, endLineIndex + 1);
    };
    return ModelLinesTokens;
}());
export { ModelLinesTokens };
var ModelTokensChangedEventBuilder = /** @class */ (function () {
    function ModelTokensChangedEventBuilder() {
        this._ranges = [];
    }
    ModelTokensChangedEventBuilder.prototype.registerChangedTokens = function (lineNumber) {
        var ranges = this._ranges;
        var rangesLength = ranges.length;
        var previousRange = rangesLength > 0 ? ranges[rangesLength - 1] : null;
        if (previousRange && previousRange.toLineNumber === lineNumber - 1) {
            // extend previous range
            previousRange.toLineNumber++;
        }
        else {
            // insert new range
            ranges[rangesLength] = {
                fromLineNumber: lineNumber,
                toLineNumber: lineNumber
            };
        }
    };
    ModelTokensChangedEventBuilder.prototype.build = function () {
        if (this._ranges.length === 0) {
            return null;
        }
        return {
            ranges: this._ranges
        };
    };
    return ModelTokensChangedEventBuilder;
}());
export { ModelTokensChangedEventBuilder };
