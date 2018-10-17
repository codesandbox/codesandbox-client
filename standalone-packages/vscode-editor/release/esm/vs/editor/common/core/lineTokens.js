/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TokenMetadata } from '../modes.js';
var LineTokens = /** @class */ (function () {
    function LineTokens(tokens, text) {
        this._tokens = tokens;
        this._tokensCount = (this._tokens.length >>> 1);
        this._text = text;
    }
    LineTokens.prototype.equals = function (other) {
        if (other instanceof LineTokens) {
            return this.slicedEquals(other, 0, this._tokensCount);
        }
        return false;
    };
    LineTokens.prototype.slicedEquals = function (other, sliceFromTokenIndex, sliceTokenCount) {
        if (this._text !== other._text) {
            return false;
        }
        if (this._tokensCount !== other._tokensCount) {
            return false;
        }
        var from = (sliceFromTokenIndex << 1);
        var to = from + (sliceTokenCount << 1);
        for (var i = from; i < to; i++) {
            if (this._tokens[i] !== other._tokens[i]) {
                return false;
            }
        }
        return true;
    };
    LineTokens.prototype.getLineContent = function () {
        return this._text;
    };
    LineTokens.prototype.getCount = function () {
        return this._tokensCount;
    };
    LineTokens.prototype.getStartOffset = function (tokenIndex) {
        if (tokenIndex > 0) {
            return this._tokens[(tokenIndex - 1) << 1];
        }
        return 0;
    };
    LineTokens.prototype.getLanguageId = function (tokenIndex) {
        var metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getLanguageId(metadata);
    };
    LineTokens.prototype.getStandardTokenType = function (tokenIndex) {
        var metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getTokenType(metadata);
    };
    LineTokens.prototype.getForeground = function (tokenIndex) {
        var metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getForeground(metadata);
    };
    LineTokens.prototype.getClassName = function (tokenIndex) {
        var metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getClassNameFromMetadata(metadata);
    };
    LineTokens.prototype.getInlineStyle = function (tokenIndex, colorMap) {
        var metadata = this._tokens[(tokenIndex << 1) + 1];
        return TokenMetadata.getInlineStyleFromMetadata(metadata, colorMap);
    };
    LineTokens.prototype.getEndOffset = function (tokenIndex) {
        return this._tokens[tokenIndex << 1];
    };
    /**
     * Find the token containing offset `offset`.
     * @param offset The search offset
     * @return The index of the token containing the offset.
     */
    LineTokens.prototype.findTokenIndexAtOffset = function (offset) {
        return LineTokens.findIndexInTokensArray(this._tokens, offset);
    };
    LineTokens.prototype.inflate = function () {
        return this;
    };
    LineTokens.prototype.sliceAndInflate = function (startOffset, endOffset, deltaOffset) {
        return new SlicedLineTokens(this, startOffset, endOffset, deltaOffset);
    };
    LineTokens.convertToEndOffset = function (tokens, lineTextLength) {
        var tokenCount = (tokens.length >>> 1);
        var lastTokenIndex = tokenCount - 1;
        for (var tokenIndex = 0; tokenIndex < lastTokenIndex; tokenIndex++) {
            tokens[tokenIndex << 1] = tokens[(tokenIndex + 1) << 1];
        }
        tokens[lastTokenIndex << 1] = lineTextLength;
    };
    LineTokens.findIndexInTokensArray = function (tokens, desiredIndex) {
        if (tokens.length <= 2) {
            return 0;
        }
        var low = 0;
        var high = (tokens.length >>> 1) - 1;
        while (low < high) {
            var mid = low + Math.floor((high - low) / 2);
            var endOffset = tokens[(mid << 1)];
            if (endOffset === desiredIndex) {
                return mid + 1;
            }
            else if (endOffset < desiredIndex) {
                low = mid + 1;
            }
            else if (endOffset > desiredIndex) {
                high = mid;
            }
        }
        return low;
    };
    return LineTokens;
}());
export { LineTokens };
var SlicedLineTokens = /** @class */ (function () {
    function SlicedLineTokens(source, startOffset, endOffset, deltaOffset) {
        this._source = source;
        this._startOffset = startOffset;
        this._endOffset = endOffset;
        this._deltaOffset = deltaOffset;
        this._firstTokenIndex = source.findTokenIndexAtOffset(startOffset);
        this._tokensCount = 0;
        for (var i = this._firstTokenIndex, len = source.getCount(); i < len; i++) {
            var tokenStartOffset = source.getStartOffset(i);
            if (tokenStartOffset >= endOffset) {
                break;
            }
            this._tokensCount++;
        }
    }
    SlicedLineTokens.prototype.equals = function (other) {
        if (other instanceof SlicedLineTokens) {
            return (this._startOffset === other._startOffset
                && this._endOffset === other._endOffset
                && this._deltaOffset === other._deltaOffset
                && this._source.slicedEquals(other._source, this._firstTokenIndex, this._tokensCount));
        }
        return false;
    };
    SlicedLineTokens.prototype.getCount = function () {
        return this._tokensCount;
    };
    SlicedLineTokens.prototype.getForeground = function (tokenIndex) {
        return this._source.getForeground(this._firstTokenIndex + tokenIndex);
    };
    SlicedLineTokens.prototype.getEndOffset = function (tokenIndex) {
        var tokenEndOffset = this._source.getEndOffset(this._firstTokenIndex + tokenIndex);
        return Math.min(this._endOffset, tokenEndOffset) - this._startOffset + this._deltaOffset;
    };
    SlicedLineTokens.prototype.getClassName = function (tokenIndex) {
        return this._source.getClassName(this._firstTokenIndex + tokenIndex);
    };
    SlicedLineTokens.prototype.getInlineStyle = function (tokenIndex, colorMap) {
        return this._source.getInlineStyle(this._firstTokenIndex + tokenIndex, colorMap);
    };
    SlicedLineTokens.prototype.findTokenIndexAtOffset = function (offset) {
        return this._source.findTokenIndexAtOffset(offset + this._startOffset - this._deltaOffset) - this._firstTokenIndex;
    };
    return SlicedLineTokens;
}());
export { SlicedLineTokens };
