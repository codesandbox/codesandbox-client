/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { StandardAutoClosingPairConditional } from '../languageConfiguration.js';
import { ignoreBracketsInToken } from '../supports.js';
import { BracketsUtils } from './richEditBrackets.js';
var BracketElectricCharacterSupport = /** @class */ (function () {
    function BracketElectricCharacterSupport(richEditBrackets, autoClosePairs, contribution) {
        contribution = contribution || {};
        this._richEditBrackets = richEditBrackets;
        this._complexAutoClosePairs = autoClosePairs.filter(function (pair) { return pair.open.length > 1 && !!pair.close; }).map(function (el) { return new StandardAutoClosingPairConditional(el); });
        if (contribution.docComment) {
            // IDocComment is legacy, only partially supported
            this._complexAutoClosePairs.push(new StandardAutoClosingPairConditional({ open: contribution.docComment.open, close: contribution.docComment.close }));
        }
    }
    BracketElectricCharacterSupport.prototype.getElectricCharacters = function () {
        var result = [];
        if (this._richEditBrackets) {
            for (var i = 0, len = this._richEditBrackets.brackets.length; i < len; i++) {
                var bracketPair = this._richEditBrackets.brackets[i];
                var lastChar = bracketPair.close.charAt(bracketPair.close.length - 1);
                result.push(lastChar);
            }
        }
        // auto close
        for (var _i = 0, _a = this._complexAutoClosePairs; _i < _a.length; _i++) {
            var pair = _a[_i];
            result.push(pair.open.charAt(pair.open.length - 1));
        }
        // Filter duplicate entries
        result = result.filter(function (item, pos, array) {
            return array.indexOf(item) === pos;
        });
        return result;
    };
    BracketElectricCharacterSupport.prototype.onElectricCharacter = function (character, context, column) {
        return (this._onElectricAutoClose(character, context, column) ||
            this._onElectricAutoIndent(character, context, column));
    };
    BracketElectricCharacterSupport.prototype._onElectricAutoIndent = function (character, context, column) {
        if (!this._richEditBrackets || this._richEditBrackets.brackets.length === 0) {
            return null;
        }
        var tokenIndex = context.findTokenIndexAtOffset(column - 1);
        if (ignoreBracketsInToken(context.getStandardTokenType(tokenIndex))) {
            return null;
        }
        var reversedBracketRegex = this._richEditBrackets.reversedRegex;
        var text = context.getLineContent().substring(0, column - 1) + character;
        var r = BracketsUtils.findPrevBracketInToken(reversedBracketRegex, 1, text, 0, text.length);
        if (!r) {
            return null;
        }
        var bracketText = text.substring(r.startColumn - 1, r.endColumn - 1);
        bracketText = bracketText.toLowerCase();
        var isOpen = this._richEditBrackets.textIsOpenBracket[bracketText];
        if (isOpen) {
            return null;
        }
        var textBeforeBracket = text.substring(0, r.startColumn - 1);
        if (!/^\s*$/.test(textBeforeBracket)) {
            // There is other text on the line before the bracket
            return null;
        }
        return {
            matchOpenBracket: bracketText
        };
    };
    BracketElectricCharacterSupport.prototype._onElectricAutoClose = function (character, context, column) {
        if (!this._complexAutoClosePairs.length) {
            return null;
        }
        var line = context.getLineContent();
        for (var i = 0, len = this._complexAutoClosePairs.length; i < len; i++) {
            var pair = this._complexAutoClosePairs[i];
            // See if the right electric character was pressed
            if (character !== pair.open.charAt(pair.open.length - 1)) {
                continue;
            }
            // check if the full open bracket matches
            var start = column - pair.open.length + 1;
            var actual = line.substring(start - 1, column - 1) + character;
            if (actual !== pair.open) {
                continue;
            }
            var lastTokenIndex = context.findTokenIndexAtOffset(column - 1);
            var lastTokenStandardType = context.getStandardTokenType(lastTokenIndex);
            // If we're in a scope listed in 'notIn', do nothing
            if (!pair.isOK(lastTokenStandardType)) {
                continue;
            }
            // If this line already contains the closing tag, do nothing.
            if (line.indexOf(pair.close, column - 1) >= 0) {
                continue;
            }
            return { appendText: pair.close };
        }
        return null;
    };
    return BracketElectricCharacterSupport;
}());
export { BracketElectricCharacterSupport };
