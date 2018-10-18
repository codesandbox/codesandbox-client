/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings';
var ReplacePattern = /** @class */ (function () {
    function ReplacePattern(replaceString, arg2, arg3) {
        this._hasParameters = false;
        this._replacePattern = replaceString;
        var searchPatternInfo;
        var parseParameters;
        if (typeof arg2 === 'boolean') {
            parseParameters = arg2;
        }
        else {
            searchPatternInfo = arg2;
            parseParameters = searchPatternInfo.isRegExp;
        }
        if (parseParameters) {
            this.parseReplaceString(replaceString);
        }
        this._regExp = arg3 ? arg3 : strings.createRegExp(searchPatternInfo.pattern, searchPatternInfo.isRegExp, { matchCase: searchPatternInfo.isCaseSensitive, wholeWord: searchPatternInfo.isWordMatch, multiline: searchPatternInfo.isMultiline, global: false });
        if (this._regExp.global) {
            this._regExp = strings.createRegExp(this._regExp.source, true, { matchCase: !this._regExp.ignoreCase, wholeWord: false, multiline: this._regExp.multiline, global: false });
        }
    }
    Object.defineProperty(ReplacePattern.prototype, "hasParameters", {
        get: function () {
            return this._hasParameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReplacePattern.prototype, "pattern", {
        get: function () {
            return this._replacePattern;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReplacePattern.prototype, "regExp", {
        get: function () {
            return this._regExp;
        },
        enumerable: true,
        configurable: true
    });
    /**
    * Returns the replace string for the first match in the given text.
    * If text has no matches then returns null.
    */
    ReplacePattern.prototype.getReplaceString = function (text) {
        this._regExp.lastIndex = 0;
        var match = this._regExp.exec(text);
        if (match) {
            if (this.hasParameters) {
                if (match[0] === text) {
                    return text.replace(this._regExp, this.pattern);
                }
                var replaceString = text.replace(this._regExp, this.pattern);
                return replaceString.substr(match.index, match[0].length - (text.length - replaceString.length));
            }
            return this.pattern;
        }
        return null;
    };
    /**
     * \n => LF
     * \t => TAB
     * \\ => \
     * $0 => $& (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter)
     * everything else stays untouched
     */
    ReplacePattern.prototype.parseReplaceString = function (replaceString) {
        if (!replaceString || replaceString.length === 0) {
            return;
        }
        var substrFrom = 0, result = '';
        for (var i = 0, len = replaceString.length; i < len; i++) {
            var chCode = replaceString.charCodeAt(i);
            if (chCode === 92 /* Backslash */) {
                // move to next char
                i++;
                if (i >= len) {
                    // string ends with a \
                    break;
                }
                var nextChCode = replaceString.charCodeAt(i);
                var replaceWithCharacter = null;
                switch (nextChCode) {
                    case 92 /* Backslash */:
                        // \\ => \
                        replaceWithCharacter = '\\';
                        break;
                    case 110 /* n */:
                        // \n => LF
                        replaceWithCharacter = '\n';
                        break;
                    case 116 /* t */:
                        // \t => TAB
                        replaceWithCharacter = '\t';
                        break;
                }
                if (replaceWithCharacter) {
                    result += replaceString.substring(substrFrom, i - 1) + replaceWithCharacter;
                    substrFrom = i + 1;
                }
            }
            if (chCode === 36 /* DollarSign */) {
                // move to next char
                i++;
                if (i >= len) {
                    // string ends with a $
                    break;
                }
                var nextChCode = replaceString.charCodeAt(i);
                var replaceWithCharacter = null;
                switch (nextChCode) {
                    case 48 /* Digit0 */:
                        // $0 => $&
                        replaceWithCharacter = '$&';
                        this._hasParameters = true;
                        break;
                    case 96 /* BackTick */:
                    case 39 /* SingleQuote */:
                        this._hasParameters = true;
                        break;
                    default:
                        // check if it is a valid string parameter $n (0 <= n <= 99). $0 is already handled by now.
                        if (!this.between(nextChCode, 49 /* Digit1 */, 57 /* Digit9 */)) {
                            break;
                        }
                        if (i === replaceString.length - 1) {
                            this._hasParameters = true;
                            break;
                        }
                        var charCode = replaceString.charCodeAt(++i);
                        if (!this.between(charCode, 48 /* Digit0 */, 57 /* Digit9 */)) {
                            this._hasParameters = true;
                            --i;
                            break;
                        }
                        if (i === replaceString.length - 1) {
                            this._hasParameters = true;
                            break;
                        }
                        charCode = replaceString.charCodeAt(++i);
                        if (!this.between(charCode, 48 /* Digit0 */, 57 /* Digit9 */)) {
                            this._hasParameters = true;
                            --i;
                            break;
                        }
                        break;
                }
                if (replaceWithCharacter) {
                    result += replaceString.substring(substrFrom, i - 1) + replaceWithCharacter;
                    substrFrom = i + 1;
                }
            }
        }
        if (substrFrom === 0) {
            // no replacement occurred
            return;
        }
        this._replacePattern = result + replaceString.substring(substrFrom);
    };
    ReplacePattern.prototype.between = function (value, from, to) {
        return from <= value && value <= to;
    };
    return ReplacePattern;
}());
export { ReplacePattern };
