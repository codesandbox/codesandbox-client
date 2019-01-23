/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as strings from '../../../../base/common/strings.js';
import { Range } from '../../core/range.js';
var RichEditBracket = /** @class */ (function () {
    function RichEditBracket(languageIdentifier, open, close, forwardRegex, reversedRegex) {
        this.languageIdentifier = languageIdentifier;
        this.open = open;
        this.close = close;
        this.forwardRegex = forwardRegex;
        this.reversedRegex = reversedRegex;
    }
    return RichEditBracket;
}());
export { RichEditBracket };
var RichEditBrackets = /** @class */ (function () {
    function RichEditBrackets(languageIdentifier, brackets) {
        var _this = this;
        this.brackets = brackets.map(function (b) {
            return new RichEditBracket(languageIdentifier, b[0], b[1], getRegexForBracketPair({ open: b[0], close: b[1] }), getReversedRegexForBracketPair({ open: b[0], close: b[1] }));
        });
        this.forwardRegex = getRegexForBrackets(this.brackets);
        this.reversedRegex = getReversedRegexForBrackets(this.brackets);
        this.textIsBracket = {};
        this.textIsOpenBracket = {};
        var maxBracketLength = 0;
        this.brackets.forEach(function (b) {
            _this.textIsBracket[b.open.toLowerCase()] = b;
            _this.textIsBracket[b.close.toLowerCase()] = b;
            _this.textIsOpenBracket[b.open.toLowerCase()] = true;
            _this.textIsOpenBracket[b.close.toLowerCase()] = false;
            maxBracketLength = Math.max(maxBracketLength, b.open.length);
            maxBracketLength = Math.max(maxBracketLength, b.close.length);
        });
        this.maxBracketLength = maxBracketLength;
    }
    return RichEditBrackets;
}());
export { RichEditBrackets };
function once(keyFn, computeFn) {
    var cache = {};
    return function (input) {
        var key = keyFn(input);
        if (!cache.hasOwnProperty(key)) {
            cache[key] = computeFn(input);
        }
        return cache[key];
    };
}
var getRegexForBracketPair = once(function (input) { return input.open + ";" + input.close; }, function (input) {
    return createBracketOrRegExp([input.open, input.close]);
});
var getReversedRegexForBracketPair = once(function (input) { return input.open + ";" + input.close; }, function (input) {
    return createBracketOrRegExp([toReversedString(input.open), toReversedString(input.close)]);
});
var getRegexForBrackets = once(function (input) { return input.map(function (b) { return b.open + ";" + b.close; }).join(';'); }, function (input) {
    var pieces = [];
    input.forEach(function (b) {
        pieces.push(b.open);
        pieces.push(b.close);
    });
    return createBracketOrRegExp(pieces);
});
var getReversedRegexForBrackets = once(function (input) { return input.map(function (b) { return b.open + ";" + b.close; }).join(';'); }, function (input) {
    var pieces = [];
    input.forEach(function (b) {
        pieces.push(toReversedString(b.open));
        pieces.push(toReversedString(b.close));
    });
    return createBracketOrRegExp(pieces);
});
function prepareBracketForRegExp(str) {
    // This bracket pair uses letters like e.g. "begin" - "end"
    var insertWordBoundaries = (/^[\w]+$/.test(str));
    str = strings.escapeRegExpCharacters(str);
    return (insertWordBoundaries ? "\\b" + str + "\\b" : str);
}
function createBracketOrRegExp(pieces) {
    var regexStr = "(" + pieces.map(prepareBracketForRegExp).join(')|(') + ")";
    return strings.createRegExp(regexStr, true);
}
var toReversedString = (function () {
    function reverse(str) {
        var reversedStr = '';
        for (var i = str.length - 1; i >= 0; i--) {
            reversedStr += str.charAt(i);
        }
        return reversedStr;
    }
    var lastInput = null;
    var lastOutput = null;
    return function toReversedString(str) {
        if (lastInput !== str) {
            lastInput = str;
            lastOutput = reverse(lastInput);
        }
        return lastOutput;
    };
})();
var BracketsUtils = /** @class */ (function () {
    function BracketsUtils() {
    }
    BracketsUtils._findPrevBracketInText = function (reversedBracketRegex, lineNumber, reversedText, offset) {
        var m = reversedText.match(reversedBracketRegex);
        if (!m) {
            return null;
        }
        var matchOffset = reversedText.length - m.index;
        var matchLength = m[0].length;
        var absoluteMatchOffset = offset + matchOffset;
        return new Range(lineNumber, absoluteMatchOffset - matchLength + 1, lineNumber, absoluteMatchOffset + 1);
    };
    BracketsUtils.findPrevBracketInToken = function (reversedBracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd) {
        // Because JS does not support backwards regex search, we search forwards in a reversed string with a reversed regex ;)
        var reversedLineText = toReversedString(lineText);
        var reversedTokenText = reversedLineText.substring(lineText.length - currentTokenEnd, lineText.length - currentTokenStart);
        return this._findPrevBracketInText(reversedBracketRegex, lineNumber, reversedTokenText, currentTokenStart);
    };
    BracketsUtils.findNextBracketInText = function (bracketRegex, lineNumber, text, offset) {
        var m = text.match(bracketRegex);
        if (!m) {
            return null;
        }
        var matchOffset = m.index;
        var matchLength = m[0].length;
        if (matchLength === 0) {
            return null;
        }
        var absoluteMatchOffset = offset + matchOffset;
        return new Range(lineNumber, absoluteMatchOffset + 1, lineNumber, absoluteMatchOffset + 1 + matchLength);
    };
    BracketsUtils.findNextBracketInToken = function (bracketRegex, lineNumber, lineText, currentTokenStart, currentTokenEnd) {
        var currentTokenText = lineText.substring(currentTokenStart, currentTokenEnd);
        return this.findNextBracketInText(bracketRegex, lineNumber, currentTokenText, currentTokenStart);
    };
    return BracketsUtils;
}());
export { BracketsUtils };
