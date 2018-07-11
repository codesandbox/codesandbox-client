/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define('vscode-nls/vscode-nls',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function format(message, args) {
        var result;
        if (args.length === 0) {
            result = message;
        }
        else {
            result = message.replace(/\{(\d+)\}/g, function (match, rest) {
                var index = rest[0];
                return typeof args[index] !== 'undefined' ? args[index] : match;
            });
        }
        return result;
    }
    function localize(key, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return format(message, args);
    }
    function loadMessageBundle(file) {
        return localize;
    }
    exports.loadMessageBundle = loadMessageBundle;
    function config(opt) {
        return loadMessageBundle;
    }
    exports.config = config;
});

define('vscode-nls', ['vscode-nls/vscode-nls'], function (main) { return main; });

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/parser/htmlScanner',["require", "exports", "vscode-nls"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var nls = require("vscode-nls");
    var localize = nls.loadMessageBundle();
    var TokenType;
    (function (TokenType) {
        TokenType[TokenType["StartCommentTag"] = 0] = "StartCommentTag";
        TokenType[TokenType["Comment"] = 1] = "Comment";
        TokenType[TokenType["EndCommentTag"] = 2] = "EndCommentTag";
        TokenType[TokenType["StartTagOpen"] = 3] = "StartTagOpen";
        TokenType[TokenType["StartTagClose"] = 4] = "StartTagClose";
        TokenType[TokenType["StartTagSelfClose"] = 5] = "StartTagSelfClose";
        TokenType[TokenType["StartTag"] = 6] = "StartTag";
        TokenType[TokenType["EndTagOpen"] = 7] = "EndTagOpen";
        TokenType[TokenType["EndTagClose"] = 8] = "EndTagClose";
        TokenType[TokenType["EndTag"] = 9] = "EndTag";
        TokenType[TokenType["DelimiterAssign"] = 10] = "DelimiterAssign";
        TokenType[TokenType["AttributeName"] = 11] = "AttributeName";
        TokenType[TokenType["AttributeValue"] = 12] = "AttributeValue";
        TokenType[TokenType["StartDoctypeTag"] = 13] = "StartDoctypeTag";
        TokenType[TokenType["Doctype"] = 14] = "Doctype";
        TokenType[TokenType["EndDoctypeTag"] = 15] = "EndDoctypeTag";
        TokenType[TokenType["Content"] = 16] = "Content";
        TokenType[TokenType["Whitespace"] = 17] = "Whitespace";
        TokenType[TokenType["Unknown"] = 18] = "Unknown";
        TokenType[TokenType["Script"] = 19] = "Script";
        TokenType[TokenType["Styles"] = 20] = "Styles";
        TokenType[TokenType["EOS"] = 21] = "EOS";
    })(TokenType = exports.TokenType || (exports.TokenType = {}));
    var MultiLineStream = /** @class */ (function () {
        function MultiLineStream(source, position) {
            this.source = source;
            this.len = source.length;
            this.position = position;
        }
        MultiLineStream.prototype.eos = function () {
            return this.len <= this.position;
        };
        MultiLineStream.prototype.getSource = function () {
            return this.source;
        };
        MultiLineStream.prototype.pos = function () {
            return this.position;
        };
        MultiLineStream.prototype.goBackTo = function (pos) {
            this.position = pos;
        };
        MultiLineStream.prototype.goBack = function (n) {
            this.position -= n;
        };
        MultiLineStream.prototype.advance = function (n) {
            this.position += n;
        };
        MultiLineStream.prototype.goToEnd = function () {
            this.position = this.source.length;
        };
        MultiLineStream.prototype.nextChar = function () {
            return this.source.charCodeAt(this.position++) || 0;
        };
        MultiLineStream.prototype.peekChar = function (n) {
            if (n === void 0) { n = 0; }
            return this.source.charCodeAt(this.position + n) || 0;
        };
        MultiLineStream.prototype.advanceIfChar = function (ch) {
            if (ch === this.source.charCodeAt(this.position)) {
                this.position++;
                return true;
            }
            return false;
        };
        MultiLineStream.prototype.advanceIfChars = function (ch) {
            var i;
            if (this.position + ch.length > this.source.length) {
                return false;
            }
            for (i = 0; i < ch.length; i++) {
                if (this.source.charCodeAt(this.position + i) !== ch[i]) {
                    return false;
                }
            }
            this.advance(i);
            return true;
        };
        MultiLineStream.prototype.advanceIfRegExp = function (regex) {
            var str = this.source.substr(this.position);
            var match = str.match(regex);
            if (match) {
                this.position = this.position + match.index + match[0].length;
                return match[0];
            }
            return '';
        };
        MultiLineStream.prototype.advanceUntilRegExp = function (regex) {
            var str = this.source.substr(this.position);
            var match = str.match(regex);
            if (match) {
                this.position = this.position + match.index;
                return match[0];
            }
            else {
                this.goToEnd();
            }
            return '';
        };
        MultiLineStream.prototype.advanceUntilChar = function (ch) {
            while (this.position < this.source.length) {
                if (this.source.charCodeAt(this.position) === ch) {
                    return true;
                }
                this.advance(1);
            }
            return false;
        };
        MultiLineStream.prototype.advanceUntilChars = function (ch) {
            while (this.position + ch.length <= this.source.length) {
                var i = 0;
                for (; i < ch.length && this.source.charCodeAt(this.position + i) === ch[i]; i++) {
                }
                if (i === ch.length) {
                    return true;
                }
                this.advance(1);
            }
            this.goToEnd();
            return false;
        };
        MultiLineStream.prototype.skipWhitespace = function () {
            var n = this.advanceWhileChar(function (ch) {
                return ch === _WSP || ch === _TAB || ch === _NWL || ch === _LFD || ch === _CAR;
            });
            return n > 0;
        };
        MultiLineStream.prototype.advanceWhileChar = function (condition) {
            var posNow = this.position;
            while (this.position < this.len && condition(this.source.charCodeAt(this.position))) {
                this.position++;
            }
            return this.position - posNow;
        };
        return MultiLineStream;
    }());
    var _BNG = '!'.charCodeAt(0);
    var _MIN = '-'.charCodeAt(0);
    var _LAN = '<'.charCodeAt(0);
    var _RAN = '>'.charCodeAt(0);
    var _FSL = '/'.charCodeAt(0);
    var _EQS = '='.charCodeAt(0);
    var _DQO = '"'.charCodeAt(0);
    var _SQO = '\''.charCodeAt(0);
    var _NWL = '\n'.charCodeAt(0);
    var _CAR = '\r'.charCodeAt(0);
    var _LFD = '\f'.charCodeAt(0);
    var _WSP = ' '.charCodeAt(0);
    var _TAB = '\t'.charCodeAt(0);
    var ScannerState;
    (function (ScannerState) {
        ScannerState[ScannerState["WithinContent"] = 0] = "WithinContent";
        ScannerState[ScannerState["AfterOpeningStartTag"] = 1] = "AfterOpeningStartTag";
        ScannerState[ScannerState["AfterOpeningEndTag"] = 2] = "AfterOpeningEndTag";
        ScannerState[ScannerState["WithinDoctype"] = 3] = "WithinDoctype";
        ScannerState[ScannerState["WithinTag"] = 4] = "WithinTag";
        ScannerState[ScannerState["WithinEndTag"] = 5] = "WithinEndTag";
        ScannerState[ScannerState["WithinComment"] = 6] = "WithinComment";
        ScannerState[ScannerState["WithinScriptContent"] = 7] = "WithinScriptContent";
        ScannerState[ScannerState["WithinStyleContent"] = 8] = "WithinStyleContent";
        ScannerState[ScannerState["AfterAttributeName"] = 9] = "AfterAttributeName";
        ScannerState[ScannerState["BeforeAttributeValue"] = 10] = "BeforeAttributeValue";
    })(ScannerState = exports.ScannerState || (exports.ScannerState = {}));
    var htmlScriptContents = {
        'text/x-handlebars-template': true
    };
    function createScanner(input, initialOffset, initialState) {
        if (initialOffset === void 0) { initialOffset = 0; }
        if (initialState === void 0) { initialState = ScannerState.WithinContent; }
        var stream = new MultiLineStream(input, initialOffset);
        var state = initialState;
        var tokenOffset = 0;
        var tokenType = TokenType.Unknown;
        var tokenError;
        var hasSpaceAfterTag;
        var lastTag;
        var lastAttributeName;
        var lastTypeValue;
        function nextElementName() {
            return stream.advanceIfRegExp(/^[_:\w][_:\w-.\d]*/).toLowerCase();
        }
        function nextAttributeName() {
            return stream.advanceIfRegExp(/^[^\s"'>/=\x00-\x0F\x7F\x80-\x9F]*/).toLowerCase();
        }
        function finishToken(offset, type, errorMessage) {
            tokenType = type;
            tokenOffset = offset;
            tokenError = errorMessage;
            return type;
        }
        function scan() {
            var offset = stream.pos();
            var oldState = state;
            var token = internalScan();
            if (token !== TokenType.EOS && offset === stream.pos()) {
                console.log('Scanner.scan has not advanced at offset ' + offset + ', state before: ' + oldState + ' after: ' + state);
                stream.advance(1);
                return finishToken(offset, TokenType.Unknown);
            }
            return token;
        }
        function internalScan() {
            var offset = stream.pos();
            if (stream.eos()) {
                return finishToken(offset, TokenType.EOS);
            }
            var errorMessage;
            switch (state) {
                case ScannerState.WithinComment:
                    if (stream.advanceIfChars([_MIN, _MIN, _RAN])) {
                        state = ScannerState.WithinContent;
                        return finishToken(offset, TokenType.EndCommentTag);
                    }
                    stream.advanceUntilChars([_MIN, _MIN, _RAN]); // -->
                    return finishToken(offset, TokenType.Comment);
                case ScannerState.WithinDoctype:
                    if (stream.advanceIfChar(_RAN)) {
                        state = ScannerState.WithinContent;
                        return finishToken(offset, TokenType.EndDoctypeTag);
                    }
                    stream.advanceUntilChar(_RAN); // >
                    return finishToken(offset, TokenType.Doctype);
                case ScannerState.WithinContent:
                    if (stream.advanceIfChar(_LAN)) {
                        if (!stream.eos() && stream.peekChar() === _BNG) {
                            if (stream.advanceIfChars([_BNG, _MIN, _MIN])) {
                                state = ScannerState.WithinComment;
                                return finishToken(offset, TokenType.StartCommentTag);
                            }
                            if (stream.advanceIfRegExp(/^!doctype/i)) {
                                state = ScannerState.WithinDoctype;
                                return finishToken(offset, TokenType.StartDoctypeTag);
                            }
                        }
                        if (stream.advanceIfChar(_FSL)) {
                            state = ScannerState.AfterOpeningEndTag;
                            return finishToken(offset, TokenType.EndTagOpen);
                        }
                        state = ScannerState.AfterOpeningStartTag;
                        return finishToken(offset, TokenType.StartTagOpen);
                    }
                    stream.advanceUntilChar(_LAN);
                    return finishToken(offset, TokenType.Content);
                case ScannerState.AfterOpeningEndTag:
                    var tagName = nextElementName();
                    if (tagName.length > 0) {
                        state = ScannerState.WithinEndTag;
                        return finishToken(offset, TokenType.EndTag);
                    }
                    if (stream.skipWhitespace()) {
                        return finishToken(offset, TokenType.Whitespace, localize('error.unexpectedWhitespace', 'Tag name must directly follow the open bracket.'));
                    }
                    state = ScannerState.WithinEndTag;
                    stream.advanceUntilChar(_RAN);
                    if (offset < stream.pos()) {
                        return finishToken(offset, TokenType.Unknown, localize('error.endTagNameExpected', 'End tag name expected.'));
                    }
                    return internalScan();
                case ScannerState.WithinEndTag:
                    if (stream.skipWhitespace()) {
                        return finishToken(offset, TokenType.Whitespace);
                    }
                    if (stream.advanceIfChar(_RAN)) {
                        state = ScannerState.WithinContent;
                        return finishToken(offset, TokenType.EndTagClose);
                    }
                    errorMessage = localize('error.tagNameExpected', 'Closing bracket expected.');
                    break;
                case ScannerState.AfterOpeningStartTag:
                    lastTag = nextElementName();
                    lastTypeValue = void 0;
                    lastAttributeName = void 0;
                    if (lastTag.length > 0) {
                        hasSpaceAfterTag = false;
                        state = ScannerState.WithinTag;
                        return finishToken(offset, TokenType.StartTag);
                    }
                    if (stream.skipWhitespace()) {
                        return finishToken(offset, TokenType.Whitespace, localize('error.unexpectedWhitespace', 'Tag name must directly follow the open bracket.'));
                    }
                    state = ScannerState.WithinTag;
                    stream.advanceUntilChar(_RAN);
                    if (offset < stream.pos()) {
                        return finishToken(offset, TokenType.Unknown, localize('error.startTagNameExpected', 'Start tag name expected.'));
                    }
                    return internalScan();
                case ScannerState.WithinTag:
                    if (stream.skipWhitespace()) {
                        hasSpaceAfterTag = true; // remember that we have seen a whitespace
                        return finishToken(offset, TokenType.Whitespace);
                    }
                    if (hasSpaceAfterTag) {
                        lastAttributeName = nextAttributeName();
                        if (lastAttributeName.length > 0) {
                            state = ScannerState.AfterAttributeName;
                            hasSpaceAfterTag = false;
                            return finishToken(offset, TokenType.AttributeName);
                        }
                    }
                    if (stream.advanceIfChars([_FSL, _RAN])) {
                        state = ScannerState.WithinContent;
                        return finishToken(offset, TokenType.StartTagSelfClose);
                    }
                    if (stream.advanceIfChar(_RAN)) {
                        if (lastTag === 'script') {
                            if (lastTypeValue && htmlScriptContents[lastTypeValue]) {
                                // stay in html
                                state = ScannerState.WithinContent;
                            }
                            else {
                                state = ScannerState.WithinScriptContent;
                            }
                        }
                        else if (lastTag === 'style') {
                            state = ScannerState.WithinStyleContent;
                        }
                        else {
                            state = ScannerState.WithinContent;
                        }
                        return finishToken(offset, TokenType.StartTagClose);
                    }
                    stream.advance(1);
                    return finishToken(offset, TokenType.Unknown, localize('error.unexpectedCharacterInTag', 'Unexpected character in tag.'));
                case ScannerState.AfterAttributeName:
                    if (stream.skipWhitespace()) {
                        hasSpaceAfterTag = true;
                        return finishToken(offset, TokenType.Whitespace);
                    }
                    if (stream.advanceIfChar(_EQS)) {
                        state = ScannerState.BeforeAttributeValue;
                        return finishToken(offset, TokenType.DelimiterAssign);
                    }
                    state = ScannerState.WithinTag;
                    return internalScan(); // no advance yet - jump to WithinTag
                case ScannerState.BeforeAttributeValue:
                    if (stream.skipWhitespace()) {
                        return finishToken(offset, TokenType.Whitespace);
                    }
                    var attributeValue = stream.advanceIfRegExp(/^[^\s"'`=<>\/]+/);
                    if (attributeValue.length > 0) {
                        if (lastAttributeName === 'type') {
                            lastTypeValue = attributeValue;
                        }
                        state = ScannerState.WithinTag;
                        hasSpaceAfterTag = false;
                        return finishToken(offset, TokenType.AttributeValue);
                    }
                    var ch = stream.peekChar();
                    if (ch === _SQO || ch === _DQO) {
                        stream.advance(1); // consume quote
                        if (stream.advanceUntilChar(ch)) {
                            stream.advance(1); // consume quote
                        }
                        if (lastAttributeName === 'type') {
                            lastTypeValue = stream.getSource().substring(offset + 1, stream.pos() - 1);
                        }
                        state = ScannerState.WithinTag;
                        hasSpaceAfterTag = false;
                        return finishToken(offset, TokenType.AttributeValue);
                    }
                    state = ScannerState.WithinTag;
                    hasSpaceAfterTag = false;
                    return internalScan(); // no advance yet - jump to WithinTag
                case ScannerState.WithinScriptContent:
                    // see http://stackoverflow.com/questions/14574471/how-do-browsers-parse-a-script-tag-exactly
                    var sciptState = 1;
                    while (!stream.eos()) {
                        var match = stream.advanceIfRegExp(/<!--|-->|<\/?script\s*\/?>?/i);
                        if (match.length === 0) {
                            stream.goToEnd();
                            return finishToken(offset, TokenType.Script);
                        }
                        else if (match === '<!--') {
                            if (sciptState === 1) {
                                sciptState = 2;
                            }
                        }
                        else if (match === '-->') {
                            sciptState = 1;
                        }
                        else if (match[1] !== '/') {
                            if (sciptState === 2) {
                                sciptState = 3;
                            }
                        }
                        else {
                            if (sciptState === 3) {
                                sciptState = 2;
                            }
                            else {
                                stream.goBack(match.length); // to the beginning of the closing tag
                                break;
                            }
                        }
                    }
                    state = ScannerState.WithinContent;
                    if (offset < stream.pos()) {
                        return finishToken(offset, TokenType.Script);
                    }
                    return internalScan(); // no advance yet - jump to content
                case ScannerState.WithinStyleContent:
                    stream.advanceUntilRegExp(/<\/style/i);
                    state = ScannerState.WithinContent;
                    if (offset < stream.pos()) {
                        return finishToken(offset, TokenType.Styles);
                    }
                    return internalScan(); // no advance yet - jump to content
            }
            stream.advance(1);
            state = ScannerState.WithinContent;
            return finishToken(offset, TokenType.Unknown, errorMessage);
        }
        return {
            scan: scan,
            getTokenType: function () { return tokenType; },
            getTokenOffset: function () { return tokenOffset; },
            getTokenLength: function () { return stream.pos() - tokenOffset; },
            getTokenEnd: function () { return stream.pos(); },
            getTokenText: function () { return stream.getSource().substring(tokenOffset, stream.pos()); },
            getScannerState: function () { return state; },
            getTokenError: function () { return tokenError; }
        };
    }
    exports.createScanner = createScanner;
});
//# sourceMappingURL=htmlScanner.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/utils/arrays',["require", "exports"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
     * are located before all elements where p(x) is true.
     * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
     */
    function findFirst(array, p) {
        var low = 0, high = array.length;
        if (high === 0) {
            return 0; // no children
        }
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (p(array[mid])) {
                high = mid;
            }
            else {
                low = mid + 1;
            }
        }
        return low;
    }
    exports.findFirst = findFirst;
    function binarySearch(array, key, comparator) {
        var low = 0, high = array.length - 1;
        while (low <= high) {
            var mid = ((low + high) / 2) | 0;
            var comp = comparator(array[mid], key);
            if (comp < 0) {
                low = mid + 1;
            }
            else if (comp > 0) {
                high = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -(low + 1);
    }
    exports.binarySearch = binarySearch;
});
//# sourceMappingURL=arrays.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/utils/strings',["require", "exports"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function startsWith(haystack, needle) {
        if (haystack.length < needle.length) {
            return false;
        }
        for (var i = 0; i < needle.length; i++) {
            if (haystack[i] !== needle[i]) {
                return false;
            }
        }
        return true;
    }
    exports.startsWith = startsWith;
    /**
     * Determines if haystack ends with needle.
     */
    function endsWith(haystack, needle) {
        var diff = haystack.length - needle.length;
        if (diff > 0) {
            return haystack.lastIndexOf(needle) === diff;
        }
        else if (diff === 0) {
            return haystack === needle;
        }
        else {
            return false;
        }
    }
    exports.endsWith = endsWith;
    /**
     * @returns the length of the common prefix of the two strings.
     */
    function commonPrefixLength(a, b) {
        var i, len = Math.min(a.length, b.length);
        for (i = 0; i < len; i++) {
            if (a.charCodeAt(i) !== b.charCodeAt(i)) {
                return i;
            }
        }
        return len;
    }
    exports.commonPrefixLength = commonPrefixLength;
    function repeat(value, count) {
        var s = '';
        while (count > 0) {
            if ((count & 1) === 1) {
                s += value;
            }
            value += value;
            count = count >>> 1;
        }
        return s;
    }
    exports.repeat = repeat;
    var _a = 'a'.charCodeAt(0);
    var _z = 'z'.charCodeAt(0);
    var _A = 'A'.charCodeAt(0);
    var _Z = 'Z'.charCodeAt(0);
    var _0 = '0'.charCodeAt(0);
    var _9 = '9'.charCodeAt(0);
    function isLetterOrDigit(text, index) {
        var c = text.charCodeAt(index);
        return (_a <= c && c <= _z) || (_A <= c && c <= _Z) || (_0 <= c && c <= _9);
    }
    exports.isLetterOrDigit = isLetterOrDigit;
});
//# sourceMappingURL=strings.js.map;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*!
BEGIN THIRD PARTY
*/
/*--------------------------------------------------------------------------------------------
 *  This file is based on or incorporates material from the projects listed below (Third Party IP).
 *  The original copyright notice and the license under which Microsoft received such Third Party IP,
 *  are set forth below. Such licenses and notices are provided for informational purposes only.
 *  Microsoft licenses the Third Party IP to you under the licensing terms for the Microsoft product.
 *  Microsoft reserves all other rights not expressly granted under this agreement, whether by implication,
 *  estoppel or otherwise.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright © 2015 W3C® (MIT, ERCIM, Keio, Beihang). This software or document includes includes material copied
 *  from or derived from HTML 5.1 W3C Working Draft (http://www.w3.org/TR/2015/WD-html51-20151008/.)"
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Ionic Main Site (https://github.com/driftyco/ionic-site).
 *  Copyright Drifty Co. http://drifty.com/.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 *  except in compliance with the License. You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 *  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 *  MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 *  See the Apache Version 2.0 License for specific language governing permissions
 *  and limitations under the License.
 *--------------------------------------------------------------------------------------------*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/parser/htmlTags',["require", "exports", "../utils/strings", "../utils/arrays", "vscode-nls"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var strings = require("../utils/strings");
    var arrays = require("../utils/arrays");
    var nls = require("vscode-nls");
    var localize = nls.loadMessageBundle();
    exports.EMPTY_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];
    function isEmptyElement(e) {
        return !!e && arrays.binarySearch(exports.EMPTY_ELEMENTS, e.toLowerCase(), function (s1, s2) { return s1.localeCompare(s2); }) >= 0;
    }
    exports.isEmptyElement = isEmptyElement;
    var HTMLTagSpecification = /** @class */ (function () {
        function HTMLTagSpecification(label, attributes) {
            if (attributes === void 0) { attributes = []; }
            this.label = label;
            this.attributes = attributes;
        }
        return HTMLTagSpecification;
    }());
    exports.HTMLTagSpecification = HTMLTagSpecification;
    // HTML tag information sourced from http://www.w3.org/TR/2015/WD-html51-20151008/
    exports.HTML_TAGS = {
        // The root element
        html: new HTMLTagSpecification(localize('tags.html', 'The html element represents the root of an HTML document.'), ['manifest']),
        // Document metadata
        head: new HTMLTagSpecification(localize('tags.head', 'The head element represents a collection of metadata for the Document.')),
        title: new HTMLTagSpecification(localize('tags.title', 'The title element represents the document\'s title or name. Authors should use titles that identify their documents even when they are used out of context, for example in a user\'s history or bookmarks, or in search results. The document\'s title is often different from its first heading, since the first heading does not have to stand alone when taken out of context.')),
        base: new HTMLTagSpecification(localize('tags.base', 'The base element allows authors to specify the document base URL for the purposes of resolving relative URLs, and the name of the default browsing context for the purposes of following hyperlinks. The element does not represent any content beyond this information.'), ['href', 'target']),
        link: new HTMLTagSpecification(localize('tags.link', 'The link element allows authors to link their document to other resources.'), ['href', 'crossorigin:xo', 'rel', 'media', 'hreflang', 'type', 'sizes']),
        meta: new HTMLTagSpecification(localize('tags.meta', 'The meta element represents various kinds of metadata that cannot be expressed using the title, base, link, style, and script elements.'), ['name', 'http-equiv', 'content', 'charset']),
        style: new HTMLTagSpecification(localize('tags.style', 'The style element allows authors to embed style information in their documents. The style element is one of several inputs to the styling processing model. The element does not represent content for the user.'), ['media', 'nonce', 'type', 'scoped:v']),
        // Sections
        body: new HTMLTagSpecification(localize('tags.body', 'The body element represents the content of the document.'), ['onafterprint', 'onbeforeprint', 'onbeforeunload', 'onhashchange', 'onlanguagechange', 'onmessage', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onstorage', 'onunload']),
        article: new HTMLTagSpecification(localize('tags.article', 'The article element represents a complete, or self-contained, composition in a document, page, application, or site and that is, in principle, independently distributable or reusable, e.g. in syndication. This could be a forum post, a magazine or newspaper article, a blog entry, a user-submitted comment, an interactive widget or gadget, or any other independent item of content. Each article should be identified, typically by including a heading (h1–h6 element) as a child of the article element.')),
        section: new HTMLTagSpecification(localize('tags.section', 'The section element represents a generic section of a document or application. A section, in this context, is a thematic grouping of content. Each section should be identified, typically by including a heading ( h1- h6 element) as a child of the section element.')),
        nav: new HTMLTagSpecification(localize('tags.nav', 'The nav element represents a section of a page that links to other pages or to parts within the page: a section with navigation links.')),
        aside: new HTMLTagSpecification(localize('tags.aside', 'The aside element represents a section of a page that consists of content that is tangentially related to the content around the aside element, and which could be considered separate from that content. Such sections are often represented as sidebars in printed typography.')),
        h1: new HTMLTagSpecification(localize('tags.h1', 'The h1 element represents a section heading.')),
        h2: new HTMLTagSpecification(localize('tags.h2', 'The h2 element represents a section heading.')),
        h3: new HTMLTagSpecification(localize('tags.h3', 'The h3 element represents a section heading.')),
        h4: new HTMLTagSpecification(localize('tags.h4', 'The h4 element represents a section heading.')),
        h5: new HTMLTagSpecification(localize('tags.h5', 'The h5 element represents a section heading.')),
        h6: new HTMLTagSpecification(localize('tags.h6', 'The h6 element represents a section heading.')),
        header: new HTMLTagSpecification(localize('tags.header', 'The header element represents introductory content for its nearest ancestor sectioning content or sectioning root element. A header typically contains a group of introductory or navigational aids. When the nearest ancestor sectioning content or sectioning root element is the body element, then it applies to the whole page.')),
        footer: new HTMLTagSpecification(localize('tags.footer', 'The footer element represents a footer for its nearest ancestor sectioning content or sectioning root element. A footer typically contains information about its section such as who wrote it, links to related documents, copyright data, and the like.')),
        address: new HTMLTagSpecification(localize('tags.address', 'The address element represents the contact information for its nearest article or body element ancestor. If that is the body element, then the contact information applies to the document as a whole.')),
        // Grouping content
        p: new HTMLTagSpecification(localize('tags.p', 'The p element represents a paragraph.')),
        hr: new HTMLTagSpecification(localize('tags.hr', 'The hr element represents a paragraph-level thematic break, e.g. a scene change in a story, or a transition to another topic within a section of a reference book.')),
        pre: new HTMLTagSpecification(localize('tags.pre', 'The pre element represents a block of preformatted text, in which structure is represented by typographic conventions rather than by elements.')),
        blockquote: new HTMLTagSpecification(localize('tags.blockquote', 'The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a footer or cite element, and optionally with in-line changes such as annotations and abbreviations.'), ['cite']),
        ol: new HTMLTagSpecification(localize('tags.ol', 'The ol element represents a list of items, where the items have been intentionally ordered, such that changing the order would change the meaning of the document.'), ['reversed:v', 'start', 'type:lt']),
        ul: new HTMLTagSpecification(localize('tags.ul', 'The ul element represents a list of items, where the order of the items is not important — that is, where changing the order would not materially change the meaning of the document.')),
        li: new HTMLTagSpecification(localize('tags.li', 'The li element represents a list item. If its parent element is an ol, ul, or menu element, then the element is an item of the parent element\'s list, as defined for those elements. Otherwise, the list item has no defined list-related relationship to any other li element.'), ['value']),
        dl: new HTMLTagSpecification(localize('tags.dl', 'The dl element represents an association list consisting of zero or more name-value groups (a description list). A name-value group consists of one or more names (dt elements) followed by one or more values (dd elements), ignoring any nodes other than dt and dd elements. Within a single dl element, there should not be more than one dt element for each name.')),
        dt: new HTMLTagSpecification(localize('tags.dt', 'The dt element represents the term, or name, part of a term-description group in a description list (dl element).')),
        dd: new HTMLTagSpecification(localize('tags.dd', 'The dd element represents the description, definition, or value, part of a term-description group in a description list (dl element).')),
        figure: new HTMLTagSpecification(localize('tags.figure', 'The figure element represents some flow content, optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document.')),
        figcaption: new HTMLTagSpecification(localize('tags.figcaption', 'The figcaption element represents a caption or legend for the rest of the contents of the figcaption element\'s parent figure element, if any.')),
        main: new HTMLTagSpecification(localize('tags.main', 'The main element represents the main content of the body of a document or application. The main content area consists of content that is directly related to or expands upon the central topic of a document or central functionality of an application.')),
        div: new HTMLTagSpecification(localize('tags.div', 'The div element has no special meaning at all. It represents its children. It can be used with the class, lang, and title attributes to mark up semantics common to a group of consecutive elements.')),
        // Text-level semantics
        a: new HTMLTagSpecification(localize('tags.a', 'If the a element has an href attribute, then it represents a hyperlink (a hypertext anchor) labeled by its contents.'), ['href', 'target', 'download', 'ping', 'rel', 'hreflang', 'type']),
        em: new HTMLTagSpecification(localize('tags.em', 'The em element represents stress emphasis of its contents.')),
        strong: new HTMLTagSpecification(localize('tags.strong', 'The strong element represents strong importance, seriousness, or urgency for its contents.')),
        small: new HTMLTagSpecification(localize('tags.small', 'The small element represents side comments such as small print.')),
        s: new HTMLTagSpecification(localize('tags.s', 'The s element represents contents that are no longer accurate or no longer relevant.')),
        cite: new HTMLTagSpecification(localize('tags.cite', 'The cite element represents a reference to a creative work. It must include the title of the work or the name of the author(person, people or organization) or an URL reference, or a reference in abbreviated form as per the conventions used for the addition of citation metadata.')),
        q: new HTMLTagSpecification(localize('tags.q', 'The q element represents some phrasing content quoted from another source.'), ['cite']),
        dfn: new HTMLTagSpecification(localize('tags.dfn', 'The dfn element represents the defining instance of a term. The paragraph, description list group, or section that is the nearest ancestor of the dfn element must also contain the definition(s) for the term given by the dfn element.')),
        abbr: new HTMLTagSpecification(localize('tags.abbr', 'The abbr element represents an abbreviation or acronym, optionally with its expansion. The title attribute may be used to provide an expansion of the abbreviation. The attribute, if specified, must contain an expansion of the abbreviation, and nothing else.')),
        ruby: new HTMLTagSpecification(localize('tags.ruby', 'The ruby element allows one or more spans of phrasing content to be marked with ruby annotations. Ruby annotations are short runs of text presented alongside base text, primarily used in East Asian typography as a guide for pronunciation or to include other annotations. In Japanese, this form of typography is also known as furigana. Ruby text can appear on either side, and sometimes both sides, of the base text, and it is possible to control its position using CSS. A more complete introduction to ruby can be found in the Use Cases & Exploratory Approaches for Ruby Markup document as well as in CSS Ruby Module Level 1. [RUBY-UC] [CSSRUBY]')),
        rb: new HTMLTagSpecification(localize('tags.rb', 'The rb element marks the base text component of a ruby annotation. When it is the child of a ruby element, it doesn\'t represent anything itself, but its parent ruby element uses it as part of determining what it represents.')),
        rt: new HTMLTagSpecification(localize('tags.rt', 'The rt element marks the ruby text component of a ruby annotation. When it is the child of a ruby element or of an rtc element that is itself the child of a ruby element, it doesn\'t represent anything itself, but its ancestor ruby element uses it as part of determining what it represents.')),
        // <rtc> is not yet supported by 2+ browsers
        //rtc: new HTMLTagSpecification(
        //	localize('tags.rtc', 'The rtc element marks a ruby text container for ruby text components in a ruby annotation. When it is the child of a ruby element it doesn\'t represent anything itself, but its parent ruby element uses it as part of determining what it represents.')),
        rp: new HTMLTagSpecification(localize('tags.rp', 'The rp element is used to provide fallback text to be shown by user agents that don\'t support ruby annotations. One widespread convention is to provide parentheses around the ruby text component of a ruby annotation.')),
        // <data> is not yet supported by 2+ browsers
        //data: new HTMLTagSpecification(
        //	localize('tags.data', 'The data element represents its contents, along with a machine-readable form of those contents in the value attribute.')),
        time: new HTMLTagSpecification(localize('tags.time', 'The time element represents its contents, along with a machine-readable form of those contents in the datetime attribute. The kind of content is limited to various kinds of dates, times, time-zone offsets, and durations, as described below.'), ['datetime']),
        code: new HTMLTagSpecification(localize('tags.code', 'The code element represents a fragment of computer code. This could be an XML element name, a file name, a computer program, or any other string that a computer would recognize.')),
        var: new HTMLTagSpecification(localize('tags.var', 'The var element represents a variable. This could be an actual variable in a mathematical expression or programming context, an identifier representing a constant, a symbol identifying a physical quantity, a function parameter, or just be a term used as a placeholder in prose.')),
        samp: new HTMLTagSpecification(localize('tags.samp', 'The samp element represents sample or quoted output from another program or computing system.')),
        kbd: new HTMLTagSpecification(localize('tags.kbd', 'The kbd element represents user input (typically keyboard input, although it may also be used to represent other input, such as voice commands).')),
        sub: new HTMLTagSpecification(localize('tags.sub', 'The sub element represents a subscript.')),
        sup: new HTMLTagSpecification(localize('tags.sup', 'The sup element represents a superscript.')),
        i: new HTMLTagSpecification(localize('tags.i', 'The i element represents a span of text in an alternate voice or mood, or otherwise offset from the normal prose in a manner indicating a different quality of text, such as a taxonomic designation, a technical term, an idiomatic phrase from another language, transliteration, a thought, or a ship name in Western texts.')),
        b: new HTMLTagSpecification(localize('tags.b', 'The b element represents a span of text to which attention is being drawn for utilitarian purposes without conveying any extra importance and with no implication of an alternate voice or mood, such as key words in a document abstract, product names in a review, actionable words in interactive text-driven software, or an article lede.')),
        u: new HTMLTagSpecification(localize('tags.u', 'The u element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelt.')),
        mark: new HTMLTagSpecification(localize('tags.mark', 'The mark element represents a run of text in one document marked or highlighted for reference purposes, due to its relevance in another context. When used in a quotation or other block of text referred to from the prose, it indicates a highlight that was not originally present but which has been added to bring the reader\'s attention to a part of the text that might not have been considered important by the original author when the block was originally written, but which is now under previously unexpected scrutiny. When used in the main prose of a document, it indicates a part of the document that has been highlighted due to its likely relevance to the user\'s current activity.')),
        bdi: new HTMLTagSpecification(localize('tags.bdi', 'The bdi element represents a span of text that is to be isolated from its surroundings for the purposes of bidirectional text formatting. [BIDI]')),
        bdo: new HTMLTagSpecification(localize('tags.dbo', 'The bdo element represents explicit text directionality formatting control for its children. It allows authors to override the Unicode bidirectional algorithm by explicitly specifying a direction override. [BIDI]')),
        span: new HTMLTagSpecification(localize('tags.span', 'The span element doesn\'t mean anything on its own, but can be useful when used together with the global attributes, e.g. class, lang, or dir. It represents its children.')),
        br: new HTMLTagSpecification(localize('tags.br', 'The br element represents a line break.')),
        wbr: new HTMLTagSpecification(localize('tags.wbr', 'The wbr element represents a line break opportunity.')),
        // Edits
        ins: new HTMLTagSpecification(localize('tags.ins', 'The ins element represents an addition to the document.')),
        del: new HTMLTagSpecification(localize('tags.del', 'The del element represents a removal from the document.'), ['cite', 'datetime']),
        // Embedded content
        picture: new HTMLTagSpecification(localize('tags.picture', 'The picture element is a container which provides multiple sources to its contained img element to allow authors to declaratively control or give hints to the user agent about which image resource to use, based on the screen pixel density, viewport size, image format, and other factors. It represents its children.')),
        img: new HTMLTagSpecification(localize('tags.img', 'An img element represents an image.'), ['alt', 'src', 'srcset', 'crossorigin:xo', 'usemap', 'ismap:v', 'width', 'height']),
        iframe: new HTMLTagSpecification(localize('tags.iframe', 'The iframe element represents a nested browsing context.'), ['src', 'srcdoc', 'name', 'sandbox:sb', 'seamless:v', 'allowfullscreen:v', 'width', 'height']),
        embed: new HTMLTagSpecification(localize('tags.embed', 'The embed element provides an integration point for an external (typically non-HTML) application or interactive content.'), ['src', 'type', 'width', 'height']),
        object: new HTMLTagSpecification(localize('tags.object', 'The object element can represent an external resource, which, depending on the type of the resource, will either be treated as an image, as a nested browsing context, or as an external resource to be processed by a plugin.'), ['data', 'type', 'typemustmatch:v', 'name', 'usemap', 'form', 'width', 'height']),
        param: new HTMLTagSpecification(localize('tags.param', 'The param element defines parameters for plugins invoked by object elements. It does not represent anything on its own.'), ['name', 'value']),
        video: new HTMLTagSpecification(localize('tags.video', 'A video element is used for playing videos or movies, and audio files with captions.'), ['src', 'crossorigin:xo', 'poster', 'preload:pl', 'autoplay:v', 'mediagroup', 'loop:v', 'muted:v', 'controls:v', 'width', 'height']),
        audio: new HTMLTagSpecification(localize('tags.audio', 'An audio element represents a sound or audio stream.'), ['src', 'crossorigin:xo', 'preload:pl', 'autoplay:v', 'mediagroup', 'loop:v', 'muted:v', 'controls:v']),
        source: new HTMLTagSpecification(localize('tags.source', 'The source element allows authors to specify multiple alternative media resources for media elements. It does not represent anything on its own.'), 
        // 'When the source element has a parent that is a picture element, the source element allows authors to specify multiple alternative source sets for img elements.'
        ['src', 'type']),
        track: new HTMLTagSpecification(localize('tags.track', 'The track element allows authors to specify explicit external timed text tracks for media elements. It does not represent anything on its own.'), ['default:v', 'kind:tk', 'label', 'src', 'srclang']),
        map: new HTMLTagSpecification(localize('tags.map', 'The map element, in conjunction with an img element and any area element descendants, defines an image map. The element represents its children.'), ['name']),
        area: new HTMLTagSpecification(localize('tags.area', 'The area element represents either a hyperlink with some text and a corresponding area on an image map, or a dead area on an image map.'), ['alt', 'coords', 'shape:sh', 'href', 'target', 'download', 'ping', 'rel', 'hreflang', 'type']),
        // Tabular data
        table: new HTMLTagSpecification(localize('tags.table', 'The table element represents data with more than one dimension, in the form of a table.'), ['sortable:v', 'border']),
        caption: new HTMLTagSpecification(localize('tags.caption', 'The caption element represents the title of the table that is its parent, if it has a parent and that is a table element.')),
        colgroup: new HTMLTagSpecification(localize('tags.colgroup', 'The colgroup element represents a group of one or more columns in the table that is its parent, if it has a parent and that is a table element.'), ['span']),
        col: new HTMLTagSpecification(localize('tags.col', 'If a col element has a parent and that is a colgroup element that itself has a parent that is a table element, then the col element represents one or more columns in the column group represented by that colgroup.'), ['span']),
        tbody: new HTMLTagSpecification(localize('tags.tbody', 'The tbody element represents a block of rows that consist of a body of data for the parent table element, if the tbody element has a parent and it is a table.')),
        thead: new HTMLTagSpecification(localize('tags.thead', 'The thead element represents the block of rows that consist of the column labels (headers) for the parent table element, if the thead element has a parent and it is a table.')),
        tfoot: new HTMLTagSpecification(localize('tags.tfoot', 'The tfoot element represents the block of rows that consist of the column summaries (footers) for the parent table element, if the tfoot element has a parent and it is a table.')),
        tr: new HTMLTagSpecification(localize('tags.tr', 'The tr element represents a row of cells in a table.')),
        td: new HTMLTagSpecification(localize('tags.td', 'The td element represents a data cell in a table.'), ['colspan', 'rowspan', 'headers']),
        th: new HTMLTagSpecification(localize('tags.th', 'The th element represents a header cell in a table.'), ['colspan', 'rowspan', 'headers', 'scope:s', 'sorted', 'abbr']),
        // Forms
        form: new HTMLTagSpecification(localize('tags.form', 'The form element represents a collection of form-associated elements, some of which can represent editable values that can be submitted to a server for processing.'), ['accept-charset', 'action', 'autocomplete:o', 'enctype:et', 'method:m', 'name', 'novalidate:v', 'target']),
        label: new HTMLTagSpecification(localize('tags.label', 'The label element represents a caption in a user interface. The caption can be associated with a specific form control, known as the label element\'s labeled control, either using the for attribute, or by putting the form control inside the label element itself.'), ['form', 'for']),
        input: new HTMLTagSpecification(localize('tags.input', 'The input element represents a typed data field, usually with a form control to allow the user to edit the data.'), ['accept', 'alt', 'autocomplete:inputautocomplete', 'autofocus:v', 'checked:v', 'dirname', 'disabled:v', 'form', 'formaction', 'formenctype:et', 'formmethod:fm', 'formnovalidate:v', 'formtarget', 'height', 'inputmode:im', 'list', 'max', 'maxlength', 'min', 'minlength', 'multiple:v', 'name', 'pattern', 'placeholder', 'readonly:v', 'required:v', 'size', 'src', 'step', 'type:t', 'value', 'width']),
        button: new HTMLTagSpecification(localize('tags.button', 'The button element represents a button labeled by its contents.'), ['autofocus:v', 'disabled:v', 'form', 'formaction', 'formenctype:et', 'formmethod:fm', 'formnovalidate:v', 'formtarget', 'name', 'type:bt', 'value']),
        select: new HTMLTagSpecification(localize('tags.select', 'The select element represents a control for selecting amongst a set of options.'), ['autocomplete:inputautocomplete', 'autofocus:v', 'disabled:v', 'form', 'multiple:v', 'name', 'required:v', 'size']),
        datalist: new HTMLTagSpecification(localize('tags.datalist', 'The datalist element represents a set of option elements that represent predefined options for other controls. In the rendering, the datalist element represents nothing and it, along with its children, should be hidden.')),
        optgroup: new HTMLTagSpecification(localize('tags.optgroup', 'The optgroup element represents a group of option elements with a common label.'), ['disabled:v', 'label']),
        option: new HTMLTagSpecification(localize('tags.option', 'The option element represents an option in a select element or as part of a list of suggestions in a datalist element.'), ['disabled:v', 'label', 'selected:v', 'value']),
        textarea: new HTMLTagSpecification(localize('tags.textarea', 'The textarea element represents a multiline plain text edit control for the element\'s raw value. The contents of the control represent the control\'s default value.'), ['autocomplete:inputautocomplete', 'autofocus:v', 'cols', 'dirname', 'disabled:v', 'form', 'inputmode:im', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly:v', 'required:v', 'rows', 'wrap:w']),
        output: new HTMLTagSpecification(localize('tags.output', 'The output element represents the result of a calculation performed by the application, or the result of a user action.'), ['for', 'form', 'name']),
        progress: new HTMLTagSpecification(localize('tags.progress', 'The progress element represents the completion progress of a task. The progress is either indeterminate, indicating that progress is being made but that it is not clear how much more work remains to be done before the task is complete (e.g. because the task is waiting for a remote host to respond), or the progress is a number in the range zero to a maximum, giving the fraction of work that has so far been completed.'), ['value', 'max']),
        meter: new HTMLTagSpecification(localize('tags.meter', 'The meter element represents a scalar measurement within a known range, or a fractional value; for example disk usage, the relevance of a query result, or the fraction of a voting population to have selected a particular candidate.'), ['value', 'min', 'max', 'low', 'high', 'optimum']),
        fieldset: new HTMLTagSpecification(localize('tags.fieldset', 'The fieldset element represents a set of form controls optionally grouped under a common name.'), ['disabled:v', 'form', 'name']),
        legend: new HTMLTagSpecification(localize('tags.legend', 'The legend element represents a caption for the rest of the contents of the legend element\'s parent fieldset element, if any.')),
        // Interactive elements
        details: new HTMLTagSpecification(localize('tags.details', 'The details element represents a disclosure widget from which the user can obtain additional information or controls.'), ['open:v']),
        summary: new HTMLTagSpecification(localize('tags.summary', 'The summary element represents a summary, caption, or legend for the rest of the contents of the summary element\'s parent details element, if any.')),
        // <menu> and <menuitem> are not yet supported by 2+ browsers
        //menu: new HTMLTagSpecification(
        //	localize('tags.menu', 'The menu element represents a list of commands.'),
        //	['type:mt', 'label']),
        //menuitem: new HTMLTagSpecification(
        //	localize('tags.menuitem', 'The menuitem element represents a command that the user can invoke from a popup menu (either a context menu or the menu of a menu button).')),
        dialog: new HTMLTagSpecification(localize('tags.dialog', 'The dialog element represents a part of an application that a user interacts with to perform a task, for example a dialog box, inspector, or window.')),
        // Scripting
        script: new HTMLTagSpecification(localize('tags.script', 'The script element allows authors to include dynamic script and data blocks in their documents. The element does not represent content for the user.'), ['src', 'type', 'charset', 'async:v', 'defer:v', 'crossorigin:xo', 'nonce']),
        noscript: new HTMLTagSpecification(localize('tags.noscript', 'The noscript element represents nothing if scripting is enabled, and represents its children if scripting is disabled. It is used to present different markup to user agents that support scripting and those that don\'t support scripting, by affecting how the document is parsed.')),
        template: new HTMLTagSpecification(localize('tags.template', 'The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script.')),
        canvas: new HTMLTagSpecification(localize('tags.canvas', 'The canvas element provides scripts with a resolution-dependent bitmap canvas, which can be used for rendering graphs, game graphics, art, or other visual images on the fly.'), ['width', 'height'])
    };
    // Ionic tag information sourced from Ionic main website (https://github.com/driftyco/ionic-site)
    exports.IONIC_TAGS = {
        'ion-checkbox': new HTMLTagSpecification(localize('tags.ion.checkbox', 'The checkbox is no different than the HTML checkbox input, except it\'s styled differently. The checkbox behaves like any AngularJS checkbox.'), ['name', 'ng-false-value', 'ng-model', 'ng-true-value']),
        'ion-content': new HTMLTagSpecification(localize('tags.ion.content', 'The ionContent directive provides an easy to use content area that can be configured to use Ionic\'s custom Scroll View, or the built-in overflow scrolling of the browser.'), ['delegate-handle', 'direction:scrolldir', 'has-bouncing:b', 'locking:b', 'on-scroll', 'on-scroll-complete', 'overflow-scroll:b', 'padding:b', 'scroll:b', 'scrollbar-x:b', 'scrollbar-y:b', 'start-x', 'start-y']),
        'ion-delete-button': new HTMLTagSpecification(localize('tags.ion.deletebutton', 'Child of ionItem'), []),
        'ion-footer-bar': new HTMLTagSpecification(localize('tags.ion.footerbar', 'Adds a fixed footer bar below some content. Can also be a subfooter (higher up) if the "bar-subfooter" class is applied.'), ['align-title:align', 'keyboard-attach:v']),
        'ion-header-bar': new HTMLTagSpecification(localize('tags.ion.headerbar', 'Adds a fixed header bar above some content. Can also be a subheader (lower down) if the "bar-subheader" class is applied.'), ['align-title:align', 'no-tap-scroll:b']),
        'ion-infinite-scroll': new HTMLTagSpecification(localize('tags.ion.infinitescroll', 'Child of ionContent or ionScroll. The ionInfiniteScroll directive allows you to call a function whenever the user gets to the bottom of the page or near the bottom of the page.'), ['distance', 'icon', 'immediate-check:b', 'on-infinite', 'spinner']),
        'ion-input': new HTMLTagSpecification(localize('tags.ion.input', 'ionInput is meant for text type inputs only. Ionic uses an actual <input type="text"> HTML element within the component, with Ionic wrapping to better handle the user experience and interactivity.'), ['type:inputtype', 'clearInput:v']),
        'ion-item': new HTMLTagSpecification(localize('tags.ion.item', 'Child of ionList.'), []),
        'ion-list': new HTMLTagSpecification(localize('tags.ion.list', 'The List is a widely used interface element in almost any mobile app, and can include content ranging from basic text all the way to buttons, toggles, icons, and thumbnails.'), ['can-swipe:b', 'delegate-handle', 'show-delete:b', 'show-reorder:b', 'type:listtype']),
        'ion-modal-view': new HTMLTagSpecification(localize('tags.ion.modalview', 'The Modal is a content pane that can go over the user\'s main view temporarily. Usually used for making a choice or editing an item.'), []),
        'ion-nav-back-button': new HTMLTagSpecification(localize('tags.ion.navbackbutton', 'Child of ionNavBar. Creates a back button inside an ionNavBar. The back button will appear when the user is able to go back in the current navigation stack.'), []),
        'ion-nav-bar': new HTMLTagSpecification(localize('tags.ion.navbar', 'If you have an ionNavView directive, you can also create an <ion-nav-bar>, which will create a topbar that updates as the application state changes.'), ['align-title:align', 'delegate-handle', 'no-tap-scroll:b']),
        'ion-nav-buttons': new HTMLTagSpecification(localize('tags.ion.navbuttons', 'Child of ionNavView. Use ionNavButtons to set the buttons on your ionNavBar from within an ionView.'), ['side:navsides']),
        'ion-nav-title': new HTMLTagSpecification(localize('tags.ion.navtitle', 'Child of ionNavView. The ionNavTitle directive replaces an ionNavBar title text with custom HTML from within an ionView template.'), []),
        'ion-nav-view': new HTMLTagSpecification(localize('tags.ion.navview', 'The ionNavView directive is used to render templates in your application. Each template is part of a state. States are usually mapped to a url, and are defined programatically using angular-ui-router.'), ['name']),
        'ion-option-button': new HTMLTagSpecification(localize('tags.ion.optionbutton', 'Child of ionItem. Creates an option button inside a list item, that is visible when the item is swiped to the left by the user.'), []),
        'ion-pane': new HTMLTagSpecification(localize('tags.ion.pane', 'A simple container that fits content, with no side effects. Adds the "pane" class to the element.'), []),
        'ion-popover-view': new HTMLTagSpecification(localize('tags.ion.popoverview', 'The Popover is a view that floats above an app\'s content. Popovers provide an easy way to present or gather information from the user.'), []),
        'ion-radio': new HTMLTagSpecification(localize('tags.ion.radio', 'The radio ionRirective is no different than the HTML radio input, except it\'s styled differently. The ionRadio behaves like AngularJS radio input.'), ['disabled:b', 'icon', 'name', 'ng-disabled:b', 'ng-model', 'ng-value', 'value']),
        'ion-refresher': new HTMLTagSpecification(localize('tags.ion.refresher', 'Child of ionContent or ionScroll. Allows you to add pull-to-refresh to a scrollView. Place it as the first child of your ionContent or ionScroll element.'), ['disable-pulling-rotation:b', 'on-pulling', 'on-refresh', 'pulling-icon', 'pulling-text', 'refreshing-icon', 'spinner']),
        'ion-reorder-button': new HTMLTagSpecification(localize('tags.ion.reorderbutton', 'Child of ionItem.'), ['on-reorder']),
        'ion-scroll': new HTMLTagSpecification(localize('tags.ion.scroll', 'Creates a scrollable container for all content inside.'), ['delegate-handle', 'direction:scrolldir', 'has-bouncing:b', 'locking:b', 'max-zoom', 'min-zoom', 'on-refresh', 'on-scroll', 'paging:b', 'scrollbar-x:b', 'scrollbar-y:b', 'zooming:b']),
        'ion-side-menu': new HTMLTagSpecification(localize('tags.ion.sidemenu', 'Child of ionSideMenus. A container for a side menu, sibling to an ionSideMenuContent directive.'), ['is-enabled:b', 'expose-aside-when', 'side:navsides', 'width']),
        'ion-side-menu-content': new HTMLTagSpecification(localize('tags.ion.sidemenucontent', 'Child of ionSideMenus. A container for the main visible content, sibling to one or more ionSideMenu directives.'), ['drag-content:b', 'edge-drag-threshold']),
        'ion-side-menus': new HTMLTagSpecification(localize('tags.ion.sidemenus', 'A container element for side menu(s) and the main content. Allows the left and/or right side menu to be toggled by dragging the main content area side to side.'), ['delegate-handle', 'enable-menu-with-back-views:b']),
        'ion-slide': new HTMLTagSpecification(localize('tags.ion.slide', 'Child of ionSlideBox. Displays a slide inside of a slidebox.'), []),
        'ion-slide-box': new HTMLTagSpecification(localize('tags.ion.slidebox', 'The Slide Box is a multi-page container where each page can be swiped or dragged between.'), ['active-slide', 'auto-play:b', 'delegate-handle', 'does-continue:b', 'on-slide-changed', 'pager-click', 'show-pager:b', 'slide-interval']),
        'ion-spinner': new HTMLTagSpecification(localize('tags.ion.spinner', 'The ionSpinner directive provides a variety of animated spinners.'), ['icon']),
        'ion-tab': new HTMLTagSpecification(localize('tags.ion.tab', 'Child of ionTabs. Contains a tab\'s content. The content only exists while the given tab is selected.'), ['badge', 'badge-style', 'disabled', 'hidden', 'href', 'icon', 'icon-off', 'icon-on', 'ng-click', 'on-deselect', 'on-select', 'title']),
        'ion-tabs': new HTMLTagSpecification(localize('tags.ion.tabs', 'Powers a multi-tabbed interface with a tab bar and a set of "pages" that can be tabbed through.'), ['delegate-handle']),
        'ion-title': new HTMLTagSpecification(localize('tags.ion.title', 'ion-title is a component that sets the title of the ionNavbar'), []),
        'ion-toggle': new HTMLTagSpecification(localize('tags.ion.toggle', 'A toggle is an animated switch which binds a given model to a boolean. Allows dragging of the switch\'s nub. The toggle behaves like any AngularJS checkbox otherwise.'), ['name', 'ng-false-value', 'ng-model', 'ng-true-value', 'toggle-class']),
        'ion-view ': new HTMLTagSpecification(localize('tags.ion.view', 'Child of ionNavView. A container for view content and any navigational and header bar information.'), ['cache-view:b', 'can-swipe-back:b', 'hide-back-button:b', 'hide-nav-bar:b', 'view-title'])
    };
    function getHTML5TagProvider() {
        var globalAttributes = [
            'aria-activedescendant', 'aria-atomic:b', 'aria-autocomplete:autocomplete', 'aria-busy:b', 'aria-checked:tristate', 'aria-colcount', 'aria-colindex', 'aria-colspan', 'aria-controls', 'aria-current:current', 'aria-describedat',
            'aria-describedby', 'aria-disabled:b', 'aria-dropeffect:dropeffect', 'aria-errormessage', 'aria-expanded:u', 'aria-flowto', 'aria-grabbed:u', 'aria-haspopup:b', 'aria-hidden:b', 'aria-invalid:invalid', 'aria-kbdshortcuts',
            'aria-label', 'aria-labelledby', 'aria-level', 'aria-live:live', 'aria-modal:b', 'aria-multiline:b', 'aria-multiselectable:b', 'aria-orientation:orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed:tristate',
            'aria-readonly:b', 'aria-relevant:relevant', 'aria-required:b', 'aria-roledescription', 'aria-rowcount', 'aria-rowindex', 'aria-rowspan', 'aria-selected:u', 'aria-setsize', 'aria-sort:sort', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext',
            'accesskey', 'class', 'contenteditable:b', 'contextmenu', 'dir:d', 'draggable:b', 'dropzone', 'hidden:v', 'id', 'itemid', 'itemprop', 'itemref', 'itemscope:v', 'itemtype', 'lang', 'role:roles', 'spellcheck:b', 'style', 'tabindex',
            'title', 'translate:y'
        ];
        var eventHandlers = ['onabort', 'onblur', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'oncontextmenu', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart',
            'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'onformchange', 'onforminput', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata',
            'onloadstart', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onreadystatechange', 'onscroll',
            'onseeked', 'onseeking', 'onselect', 'onshow', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'onvolumechange', 'onwaiting'];
        var valueSets = {
            b: ['true', 'false'],
            u: ['true', 'false', 'undefined'],
            o: ['on', 'off'],
            y: ['yes', 'no'],
            w: ['soft', 'hard'],
            d: ['ltr', 'rtl', 'auto'],
            m: ['GET', 'POST', 'dialog'],
            fm: ['GET', 'POST'],
            s: ['row', 'col', 'rowgroup', 'colgroup'],
            t: ['hidden', 'text', 'search', 'tel', 'url', 'email', 'password', 'datetime', 'date', 'month', 'week', 'time', 'datetime-local', 'number', 'range', 'color', 'checkbox', 'radio', 'file', 'submit', 'image', 'reset', 'button'],
            im: ['verbatim', 'latin', 'latin-name', 'latin-prose', 'full-width-latin', 'kana', 'kana-name', 'katakana', 'numeric', 'tel', 'email', 'url'],
            bt: ['button', 'submit', 'reset', 'menu'],
            lt: ['1', 'a', 'A', 'i', 'I'],
            mt: ['context', 'toolbar'],
            mit: ['command', 'checkbox', 'radio'],
            et: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
            tk: ['subtitles', 'captions', 'descriptions', 'chapters', 'metadata'],
            pl: ['none', 'metadata', 'auto'],
            sh: ['circle', 'default', 'poly', 'rect'],
            xo: ['anonymous', 'use-credentials'],
            sb: ['allow-forms', 'allow-modals', 'allow-pointer-lock', 'allow-popups', 'allow-popups-to-escape-sandbox', 'allow-same-origin', 'allow-scripts', 'allow-top-navigation'],
            tristate: ['true', 'false', 'mixed', 'undefined'],
            inputautocomplete: ['additional-name', 'address-level1', 'address-level2', 'address-level3', 'address-level4', 'address-line1', 'address-line2', 'address-line3', 'bday', 'bday-year', 'bday-day', 'bday-month', 'billing', 'cc-additional-name', 'cc-csc', 'cc-exp', 'cc-exp-month', 'cc-exp-year', 'cc-family-name', 'cc-given-name', 'cc-name', 'cc-number', 'cc-type', 'country', 'country-name', 'current-password', 'email', 'family-name', 'fax', 'given-name', 'home', 'honorific-prefix', 'honorific-suffix', 'impp', 'language', 'mobile', 'name', 'new-password', 'nickname', 'organization', 'organization-title', 'pager', 'photo', 'postal-code', 'sex', 'shipping', 'street-address', 'tel-area-code', 'tel', 'tel-country-code', 'tel-extension', 'tel-local', 'tel-local-prefix', 'tel-local-suffix', 'tel-national', 'transaction-amount', 'transaction-currency', 'url', 'username', 'work'],
            autocomplete: ['inline', 'list', 'both', 'none'],
            current: ['page', 'step', 'location', 'date', 'time', 'true', 'false'],
            dropeffect: ['copy', 'move', 'link', 'execute', 'popup', 'none'],
            invalid: ['grammar', 'false', 'spelling', 'true'],
            live: ['off', 'polite', 'assertive'],
            orientation: ['vertical', 'horizontal', 'undefined'],
            relevant: ['additions', 'removals', 'text', 'all', 'additions text'],
            sort: ['ascending', 'descending', 'none', 'other'],
            roles: ['alert', 'alertdialog', 'button', 'checkbox', 'dialog', 'gridcell', 'link', 'log', 'marquee', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'progressbar', 'radio', 'scrollbar', 'searchbox', 'slider',
                'spinbutton', 'status', 'switch', 'tab', 'tabpanel', 'textbox', 'timer', 'tooltip', 'treeitem', 'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid',
                'application', 'article', 'cell', 'columnheader', 'definition', 'directory', 'document', 'feed', 'figure', 'group', 'heading', 'img', 'list', 'listitem', 'math', 'none', 'note', 'presentation', 'region', 'row', 'rowgroup',
                'rowheader', 'separator', 'table', 'term', 'text', 'toolbar',
                'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'region', 'search',
                'doc-abstract', 'doc-acknowledgments', 'doc-afterword', 'doc-appendix', 'doc-backlink', 'doc-biblioentry', 'doc-bibliography', 'doc-biblioref', 'doc-chapter', 'doc-colophon', 'doc-conclusion', 'doc-cover', 'doc-credit', 'doc-credits', 'doc-dedication', 'doc-endnote', 'doc-endnotes', 'doc-epigraph', 'doc-epilogue', 'doc-errata', 'doc-example', 'doc-footnote', 'doc-foreword', 'doc-glossary', 'doc-glossref', 'doc-index', 'doc-introduction', 'doc-noteref', 'doc-notice', 'doc-pagebreak', 'doc-pagelist', 'doc-part', 'doc-preface', 'doc-prologue', 'doc-pullquote', 'doc-qna', 'doc-subtitle', 'doc-tip', 'doc-toc']
        };
        return {
            getId: function () { return 'html5'; },
            isApplicable: function () { return true; },
            collectTags: function (collector) { return collectTagsDefault(collector, exports.HTML_TAGS); },
            collectAttributes: function (tag, collector) {
                collectAttributesDefault(tag, collector, exports.HTML_TAGS, globalAttributes);
                eventHandlers.forEach(function (handler) {
                    collector(handler, 'event');
                });
            },
            collectValues: function (tag, attribute, collector) { return collectValuesDefault(tag, attribute, collector, exports.HTML_TAGS, globalAttributes, valueSets); }
        };
    }
    exports.getHTML5TagProvider = getHTML5TagProvider;
    function getAngularTagProvider() {
        var customTags = {
            input: ['ng-model', 'ng-required', 'ng-minlength', 'ng-maxlength', 'ng-pattern', 'ng-trim'],
            select: ['ng-model'],
            textarea: ['ng-model', 'ng-required', 'ng-minlength', 'ng-maxlength', 'ng-pattern', 'ng-trim']
        };
        var globalAttributes = ['ng-app', 'ng-strict-di', 'ng-bind', 'ng-bind-html', 'ng-bind-template', 'ng-blur', 'ng-change', 'ng-checked', 'ng-class', 'ng-class-even', 'ng-class-odd',
            'ng-click', 'ng-cloak', 'ng-controller', 'ng-copy', 'ng-csp', 'ng-cut', 'ng-dblclick', 'ng-disabled', 'ng-focus', 'ng-form', 'ng-hide', 'ng-href', 'ng-if',
            'ng-include', 'ng-init', 'ng-jq', 'ng-keydown', 'ng-keypress', 'ng-keyup', 'ng-list', 'ng-model-options', 'ng-mousedown', 'ng-mouseenter', 'ng-mouseleave',
            'ng-mousemove', 'ng-mouseover', 'ng-mouseup', 'ng-non-bindable', 'ng-open', 'ng-options', 'ng-paste', 'ng-pluralize', 'ng-readonly', 'ng-repeat', 'ng-selected',
            'ng-show', 'ng-src', 'ng-srcset', 'ng-style', 'ng-submit', 'ng-switch', 'ng-transclude', 'ng-value'
        ];
        return {
            getId: function () { return 'angular1'; },
            isApplicable: function (languageId) { return languageId === 'html'; },
            collectTags: function (collector) {
                // no extra tags
            },
            collectAttributes: function (tag, collector) {
                if (tag) {
                    var attributes = customTags[tag];
                    if (attributes) {
                        attributes.forEach(function (a) {
                            collector(a);
                            collector('data-' + a);
                        });
                    }
                }
                globalAttributes.forEach(function (a) {
                    collector(a);
                    collector('data-' + a);
                });
            },
            collectValues: function (tag, attribute, collector) {
                // no values
            }
        };
    }
    exports.getAngularTagProvider = getAngularTagProvider;
    function getIonicTagProvider() {
        var customTags = {
            a: ['nav-direction:navdir', 'nav-transition:trans'],
            button: ['menu-toggle:menusides']
        };
        var globalAttributes = ['collection-repeat', 'force-refresh-images:b', 'ion-stop-event', 'item-height', 'item-render-buffer', 'item-width', 'menu-close:v',
            'on-double-tap', 'on-drag', 'on-drag-down', 'on-drag-left', 'on-drag-right', 'on-drag-up', 'on-hold', 'on-release', 'on-swipe', 'on-swipe-down', 'on-swipe-left',
            'on-swipe-right', 'on-swipe-up', 'on-tap', 'on-touch'];
        var valueSets = {
            align: ['center', 'left', 'right'],
            b: ['true', 'false'],
            inputtype: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
            listtype: ['card', 'list-inset'],
            menusides: ['left', 'right'],
            navdir: ['back', 'enter', 'exit', 'forward', 'swap'],
            navsides: ['left', 'primary', 'right', 'secondary'],
            scrolldir: ['x', 'xy', 'y'],
            trans: ['android', 'ios', 'none']
        };
        return {
            getId: function () { return 'ionic'; },
            isApplicable: function (languageId) { return languageId === 'html'; },
            collectTags: function (collector) { return collectTagsDefault(collector, exports.IONIC_TAGS); },
            collectAttributes: function (tag, collector) {
                collectAttributesDefault(tag, collector, exports.IONIC_TAGS, globalAttributes);
                if (tag) {
                    var attributes = customTags[tag];
                    if (attributes) {
                        attributes.forEach(function (a) {
                            var segments = a.split(':');
                            collector(segments[0], segments[1]);
                        });
                    }
                }
            },
            collectValues: function (tag, attribute, collector) { return collectValuesDefault(tag, attribute, collector, exports.IONIC_TAGS, globalAttributes, valueSets, customTags); }
        };
    }
    exports.getIonicTagProvider = getIonicTagProvider;
    function collectTagsDefault(collector, tagSet) {
        for (var tag in tagSet) {
            collector(tag, tagSet[tag].label);
        }
    }
    function collectAttributesDefault(tag, collector, tagSet, globalAttributes) {
        globalAttributes.forEach(function (attr) {
            var segments = attr.split(':');
            collector(segments[0], segments[1]);
        });
        if (tag) {
            var tags = tagSet[tag];
            if (tags) {
                var attributes = tags.attributes;
                if (attributes) {
                    attributes.forEach(function (attr) {
                        var segments = attr.split(':');
                        collector(segments[0], segments[1]);
                    });
                }
            }
        }
    }
    function collectValuesDefault(tag, attribute, collector, tagSet, globalAttributes, valueSets, customTags) {
        var prefix = attribute + ':';
        var processAttributes = function (attributes) {
            attributes.forEach(function (attr) {
                if (attr.length > prefix.length && strings.startsWith(attr, prefix)) {
                    var typeInfo = attr.substr(prefix.length);
                    if (typeInfo === 'v') {
                        collector(attribute);
                    }
                    else {
                        var values = valueSets[typeInfo];
                        if (values) {
                            values.forEach(collector);
                        }
                    }
                }
            });
        };
        if (tag) {
            var tags = tagSet[tag];
            if (tags) {
                var attributes = tags.attributes;
                if (attributes) {
                    processAttributes(attributes);
                }
            }
        }
        processAttributes(globalAttributes);
        if (customTags) {
            var customTagAttributes = customTags[tag];
            if (customTagAttributes) {
                processAttributes(customTagAttributes);
            }
        }
    }
});
/*!
END THIRD PARTY
*/
//# sourceMappingURL=htmlTags.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/parser/htmlParser',["require", "exports", "./htmlScanner", "../utils/arrays", "./htmlTags"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var htmlScanner_1 = require("./htmlScanner");
    var arrays_1 = require("../utils/arrays");
    var htmlTags_1 = require("./htmlTags");
    var Node = /** @class */ (function () {
        function Node(start, end, children, parent) {
            this.start = start;
            this.end = end;
            this.children = children;
            this.parent = parent;
            this.closed = false;
        }
        Object.defineProperty(Node.prototype, "attributeNames", {
            get: function () { return this.attributes ? Object.keys(this.attributes) : []; },
            enumerable: true,
            configurable: true
        });
        Node.prototype.isSameTag = function (tagInLowerCase) {
            return this.tag && tagInLowerCase && this.tag.length === tagInLowerCase.length && this.tag.toLowerCase() === tagInLowerCase;
        };
        Object.defineProperty(Node.prototype, "firstChild", {
            get: function () { return this.children[0]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "lastChild", {
            get: function () { return this.children.length ? this.children[this.children.length - 1] : void 0; },
            enumerable: true,
            configurable: true
        });
        Node.prototype.findNodeBefore = function (offset) {
            var idx = arrays_1.findFirst(this.children, function (c) { return offset <= c.start; }) - 1;
            if (idx >= 0) {
                var child = this.children[idx];
                if (offset > child.start) {
                    if (offset < child.end) {
                        return child.findNodeBefore(offset);
                    }
                    var lastChild = child.lastChild;
                    if (lastChild && lastChild.end === child.end) {
                        return child.findNodeBefore(offset);
                    }
                    return child;
                }
            }
            return this;
        };
        Node.prototype.findNodeAt = function (offset) {
            var idx = arrays_1.findFirst(this.children, function (c) { return offset <= c.start; }) - 1;
            if (idx >= 0) {
                var child = this.children[idx];
                if (offset > child.start && offset <= child.end) {
                    return child.findNodeAt(offset);
                }
            }
            return this;
        };
        return Node;
    }());
    exports.Node = Node;
    function parse(text) {
        var scanner = htmlScanner_1.createScanner(text);
        var htmlDocument = new Node(0, text.length, [], void 0);
        var curr = htmlDocument;
        var endTagStart = -1;
        var pendingAttribute = null;
        var token = scanner.scan();
        while (token !== htmlScanner_1.TokenType.EOS) {
            switch (token) {
                case htmlScanner_1.TokenType.StartTagOpen:
                    var child = new Node(scanner.getTokenOffset(), text.length, [], curr);
                    curr.children.push(child);
                    curr = child;
                    break;
                case htmlScanner_1.TokenType.StartTag:
                    curr.tag = scanner.getTokenText();
                    break;
                case htmlScanner_1.TokenType.StartTagClose:
                    curr.end = scanner.getTokenEnd(); // might be later set to end tag position
                    if (curr.tag && htmlTags_1.isEmptyElement(curr.tag) && curr.parent) {
                        curr.closed = true;
                        curr = curr.parent;
                    }
                    break;
                case htmlScanner_1.TokenType.EndTagOpen:
                    endTagStart = scanner.getTokenOffset();
                    break;
                case htmlScanner_1.TokenType.EndTag:
                    var closeTag = scanner.getTokenText().toLowerCase();
                    while (!curr.isSameTag(closeTag) && curr.parent) {
                        curr.end = endTagStart;
                        curr.closed = false;
                        curr = curr.parent;
                    }
                    if (curr !== htmlDocument) {
                        curr.closed = true;
                        curr.endTagStart = endTagStart;
                    }
                    break;
                case htmlScanner_1.TokenType.StartTagSelfClose:
                    if (curr.parent) {
                        curr.closed = true;
                        curr.end = scanner.getTokenEnd();
                        curr = curr.parent;
                    }
                    break;
                case htmlScanner_1.TokenType.EndTagClose:
                    if (curr.parent) {
                        curr.end = scanner.getTokenEnd();
                        curr = curr.parent;
                    }
                    break;
                case htmlScanner_1.TokenType.AttributeName: {
                    var attributeName = pendingAttribute = scanner.getTokenText();
                    var attributes = curr.attributes;
                    if (!attributes) {
                        curr.attributes = attributes = {};
                    }
                    attributes[pendingAttribute] = null; // Support valueless attributes such as 'checked'
                    break;
                }
                case htmlScanner_1.TokenType.AttributeValue: {
                    var value = scanner.getTokenText();
                    var attributes = curr.attributes;
                    if (attributes && pendingAttribute) {
                        attributes[pendingAttribute] = value;
                        pendingAttribute = null;
                    }
                    break;
                }
            }
            token = scanner.scan();
        }
        while (curr.parent) {
            curr.end = text.length;
            curr.closed = false;
            curr = curr.parent;
        }
        return {
            roots: htmlDocument.children,
            findNodeBefore: htmlDocument.findNodeBefore.bind(htmlDocument),
            findNodeAt: htmlDocument.findNodeAt.bind(htmlDocument)
        };
    }
    exports.parse = parse;
});
//# sourceMappingURL=htmlParser.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-languageserver-types/main',["require", "exports"], factory);
    }
})(function (require, exports) {
    /* --------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation. All rights reserved.
     * Licensed under the MIT License. See License.txt in the project root for license information.
     * ------------------------------------------------------------------------------------------ */
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The Position namespace provides helper functions to work with
     * [Position](#Position) literals.
     */
    var Position;
    (function (Position) {
        /**
         * Creates a new Position literal from the given line and character.
         * @param line The position's line.
         * @param character The position's character.
         */
        function create(line, character) {
            return { line: line, character: character };
        }
        Position.create = create;
        /**
         * Checks whether the given liternal conforms to the [Position](#Position) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.number(candidate.line) && Is.number(candidate.character);
        }
        Position.is = is;
    })(Position = exports.Position || (exports.Position = {}));
    /**
     * The Range namespace provides helper functions to work with
     * [Range](#Range) literals.
     */
    var Range;
    (function (Range) {
        function create(one, two, three, four) {
            if (Is.number(one) && Is.number(two) && Is.number(three) && Is.number(four)) {
                return { start: Position.create(one, two), end: Position.create(three, four) };
            }
            else if (Position.is(one) && Position.is(two)) {
                return { start: one, end: two };
            }
            else {
                throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
            }
        }
        Range.create = create;
        /**
         * Checks whether the given literal conforms to the [Range](#Range) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
        }
        Range.is = is;
    })(Range = exports.Range || (exports.Range = {}));
    /**
     * The Location namespace provides helper functions to work with
     * [Location](#Location) literals.
     */
    var Location;
    (function (Location) {
        /**
         * Creates a Location literal.
         * @param uri The location's uri.
         * @param range The location's range.
         */
        function create(uri, range) {
            return { uri: uri, range: range };
        }
        Location.create = create;
        /**
         * Checks whether the given literal conforms to the [Location](#Location) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
        }
        Location.is = is;
    })(Location = exports.Location || (exports.Location = {}));
    /**
     * The diagnostic's serverity.
     */
    var DiagnosticSeverity;
    (function (DiagnosticSeverity) {
        /**
         * Reports an error.
         */
        DiagnosticSeverity.Error = 1;
        /**
         * Reports a warning.
         */
        DiagnosticSeverity.Warning = 2;
        /**
         * Reports an information.
         */
        DiagnosticSeverity.Information = 3;
        /**
         * Reports a hint.
         */
        DiagnosticSeverity.Hint = 4;
    })(DiagnosticSeverity = exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
    /**
     * The Diagnostic namespace provides helper functions to work with
     * [Diagnostic](#Diagnostic) literals.
     */
    var Diagnostic;
    (function (Diagnostic) {
        /**
         * Creates a new Diagnostic literal.
         */
        function create(range, message, severity, code, source) {
            var result = { range: range, message: message };
            if (Is.defined(severity)) {
                result.severity = severity;
            }
            if (Is.defined(code)) {
                result.code = code;
            }
            if (Is.defined(source)) {
                result.source = source;
            }
            return result;
        }
        Diagnostic.create = create;
        /**
         * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate)
                && Range.is(candidate.range)
                && Is.string(candidate.message)
                && (Is.number(candidate.severity) || Is.undefined(candidate.severity))
                && (Is.number(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code))
                && (Is.string(candidate.source) || Is.undefined(candidate.source));
        }
        Diagnostic.is = is;
    })(Diagnostic = exports.Diagnostic || (exports.Diagnostic = {}));
    /**
     * The Command namespace provides helper functions to work with
     * [Command](#Command) literals.
     */
    var Command;
    (function (Command) {
        /**
         * Creates a new Command literal.
         */
        function create(title, command) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result = { title: title, command: command };
            if (Is.defined(args) && args.length > 0) {
                result.arguments = args;
            }
            return result;
        }
        Command.create = create;
        /**
         * Checks whether the given literal conforms to the [Command](#Command) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.title);
        }
        Command.is = is;
    })(Command = exports.Command || (exports.Command = {}));
    /**
     * The TextEdit namespace provides helper function to create replace,
     * insert and delete edits more easily.
     */
    var TextEdit;
    (function (TextEdit) {
        /**
         * Creates a replace text edit.
         * @param range The range of text to be replaced.
         * @param newText The new text.
         */
        function replace(range, newText) {
            return { range: range, newText: newText };
        }
        TextEdit.replace = replace;
        /**
         * Creates a insert text edit.
         * @param position The position to insert the text at.
         * @param newText The text to be inserted.
         */
        function insert(position, newText) {
            return { range: { start: position, end: position }, newText: newText };
        }
        TextEdit.insert = insert;
        /**
         * Creates a delete text edit.
         * @param range The range of text to be deleted.
         */
        function del(range) {
            return { range: range, newText: '' };
        }
        TextEdit.del = del;
    })(TextEdit = exports.TextEdit || (exports.TextEdit = {}));
    /**
     * The TextDocumentEdit namespace provides helper function to create
     * an edit that manipulates a text document.
     */
    var TextDocumentEdit;
    (function (TextDocumentEdit) {
        /**
         * Creates a new `TextDocumentEdit`
         */
        function create(textDocument, edits) {
            return { textDocument: textDocument, edits: edits };
        }
        TextDocumentEdit.create = create;
        function is(value) {
            var candidate = value;
            return Is.defined(candidate)
                && VersionedTextDocumentIdentifier.is(candidate.textDocument)
                && Array.isArray(candidate.edits);
        }
        TextDocumentEdit.is = is;
    })(TextDocumentEdit = exports.TextDocumentEdit || (exports.TextDocumentEdit = {}));
    var TextEditChangeImpl = /** @class */ (function () {
        function TextEditChangeImpl(edits) {
            this.edits = edits;
        }
        TextEditChangeImpl.prototype.insert = function (position, newText) {
            this.edits.push(TextEdit.insert(position, newText));
        };
        TextEditChangeImpl.prototype.replace = function (range, newText) {
            this.edits.push(TextEdit.replace(range, newText));
        };
        TextEditChangeImpl.prototype.delete = function (range) {
            this.edits.push(TextEdit.del(range));
        };
        TextEditChangeImpl.prototype.add = function (edit) {
            this.edits.push(edit);
        };
        TextEditChangeImpl.prototype.all = function () {
            return this.edits;
        };
        TextEditChangeImpl.prototype.clear = function () {
            this.edits.splice(0, this.edits.length);
        };
        return TextEditChangeImpl;
    }());
    /**
     * A workspace change helps constructing changes to a workspace.
     */
    var WorkspaceChange = /** @class */ (function () {
        function WorkspaceChange(workspaceEdit) {
            var _this = this;
            this._textEditChanges = Object.create(null);
            if (workspaceEdit) {
                this._workspaceEdit = workspaceEdit;
                if (workspaceEdit.documentChanges) {
                    workspaceEdit.documentChanges.forEach(function (textDocumentEdit) {
                        var textEditChange = new TextEditChangeImpl(textDocumentEdit.edits);
                        _this._textEditChanges[textDocumentEdit.textDocument.uri] = textEditChange;
                    });
                }
                else if (workspaceEdit.changes) {
                    Object.keys(workspaceEdit.changes).forEach(function (key) {
                        var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                        _this._textEditChanges[key] = textEditChange;
                    });
                }
            }
        }
        Object.defineProperty(WorkspaceChange.prototype, "edit", {
            /**
             * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
             * use to be returned from a workspace edit operation like rename.
             */
            get: function () {
                return this._workspaceEdit;
            },
            enumerable: true,
            configurable: true
        });
        WorkspaceChange.prototype.getTextEditChange = function (key) {
            if (VersionedTextDocumentIdentifier.is(key)) {
                if (!this._workspaceEdit) {
                    this._workspaceEdit = {
                        documentChanges: []
                    };
                }
                if (!this._workspaceEdit.documentChanges) {
                    throw new Error('Workspace edit is not configured for versioned document changes.');
                }
                var textDocument = key;
                var result = this._textEditChanges[textDocument.uri];
                if (!result) {
                    var edits = [];
                    var textDocumentEdit = {
                        textDocument: textDocument,
                        edits: edits
                    };
                    this._workspaceEdit.documentChanges.push(textDocumentEdit);
                    result = new TextEditChangeImpl(edits);
                    this._textEditChanges[textDocument.uri] = result;
                }
                return result;
            }
            else {
                if (!this._workspaceEdit) {
                    this._workspaceEdit = {
                        changes: Object.create(null)
                    };
                }
                if (!this._workspaceEdit.changes) {
                    throw new Error('Workspace edit is not configured for normal text edit changes.');
                }
                var result = this._textEditChanges[key];
                if (!result) {
                    var edits = [];
                    this._workspaceEdit.changes[key] = edits;
                    result = new TextEditChangeImpl(edits);
                    this._textEditChanges[key] = result;
                }
                return result;
            }
        };
        return WorkspaceChange;
    }());
    exports.WorkspaceChange = WorkspaceChange;
    /**
     * The TextDocumentIdentifier namespace provides helper functions to work with
     * [TextDocumentIdentifier](#TextDocumentIdentifier) literals.
     */
    var TextDocumentIdentifier;
    (function (TextDocumentIdentifier) {
        /**
         * Creates a new TextDocumentIdentifier literal.
         * @param uri The document's uri.
         */
        function create(uri) {
            return { uri: uri };
        }
        TextDocumentIdentifier.create = create;
        /**
         * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri);
        }
        TextDocumentIdentifier.is = is;
    })(TextDocumentIdentifier = exports.TextDocumentIdentifier || (exports.TextDocumentIdentifier = {}));
    /**
     * The VersionedTextDocumentIdentifier namespace provides helper functions to work with
     * [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) literals.
     */
    var VersionedTextDocumentIdentifier;
    (function (VersionedTextDocumentIdentifier) {
        /**
         * Creates a new VersionedTextDocumentIdentifier literal.
         * @param uri The document's uri.
         * @param uri The document's text.
         */
        function create(uri, version) {
            return { uri: uri, version: version };
        }
        VersionedTextDocumentIdentifier.create = create;
        /**
         * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.number(candidate.version);
        }
        VersionedTextDocumentIdentifier.is = is;
    })(VersionedTextDocumentIdentifier = exports.VersionedTextDocumentIdentifier || (exports.VersionedTextDocumentIdentifier = {}));
    /**
     * The TextDocumentItem namespace provides helper functions to work with
     * [TextDocumentItem](#TextDocumentItem) literals.
     */
    var TextDocumentItem;
    (function (TextDocumentItem) {
        /**
         * Creates a new TextDocumentItem literal.
         * @param uri The document's uri.
         * @param languageId The document's language identifier.
         * @param version The document's version number.
         * @param text The document's text.
         */
        function create(uri, languageId, version, text) {
            return { uri: uri, languageId: languageId, version: version, text: text };
        }
        TextDocumentItem.create = create;
        /**
         * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.number(candidate.version) && Is.string(candidate.text);
        }
        TextDocumentItem.is = is;
    })(TextDocumentItem = exports.TextDocumentItem || (exports.TextDocumentItem = {}));
    /**
     * Describes the content type that a client supports in various
     * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
     *
     * Please note that `MarkupKinds` must not start with a `$`. This kinds
     * are reserved for internal usage.
     */
    var MarkupKind;
    (function (MarkupKind) {
        /**
         * Plain text is supported as a content format
         */
        MarkupKind.PlainText = 'plaintext';
        /**
         * Markdown is supported as a content format
         */
        MarkupKind.Markdown = 'markdown';
    })(MarkupKind = exports.MarkupKind || (exports.MarkupKind = {}));
    /**
     * The kind of a completion entry.
     */
    var CompletionItemKind;
    (function (CompletionItemKind) {
        CompletionItemKind.Text = 1;
        CompletionItemKind.Method = 2;
        CompletionItemKind.Function = 3;
        CompletionItemKind.Constructor = 4;
        CompletionItemKind.Field = 5;
        CompletionItemKind.Variable = 6;
        CompletionItemKind.Class = 7;
        CompletionItemKind.Interface = 8;
        CompletionItemKind.Module = 9;
        CompletionItemKind.Property = 10;
        CompletionItemKind.Unit = 11;
        CompletionItemKind.Value = 12;
        CompletionItemKind.Enum = 13;
        CompletionItemKind.Keyword = 14;
        CompletionItemKind.Snippet = 15;
        CompletionItemKind.Color = 16;
        CompletionItemKind.File = 17;
        CompletionItemKind.Reference = 18;
        CompletionItemKind.Folder = 19;
        CompletionItemKind.EnumMember = 20;
        CompletionItemKind.Constant = 21;
        CompletionItemKind.Struct = 22;
        CompletionItemKind.Event = 23;
        CompletionItemKind.Operator = 24;
        CompletionItemKind.TypeParameter = 25;
    })(CompletionItemKind = exports.CompletionItemKind || (exports.CompletionItemKind = {}));
    /**
     * Defines whether the insert text in a completion item should be interpreted as
     * plain text or a snippet.
     */
    var InsertTextFormat;
    (function (InsertTextFormat) {
        /**
         * The primary text to be inserted is treated as a plain string.
         */
        InsertTextFormat.PlainText = 1;
        /**
         * The primary text to be inserted is treated as a snippet.
         *
         * A snippet can define tab stops and placeholders with `$1`, `$2`
         * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
         * the end of the snippet. Placeholders with equal identifiers are linked,
         * that is typing in one will update others too.
         *
         * See also: https://github.com/Microsoft/vscode/blob/master/src/vs/editor/contrib/snippet/common/snippet.md
         */
        InsertTextFormat.Snippet = 2;
    })(InsertTextFormat = exports.InsertTextFormat || (exports.InsertTextFormat = {}));
    /**
     * The CompletionItem namespace provides functions to deal with
     * completion items.
     */
    var CompletionItem;
    (function (CompletionItem) {
        /**
         * Create a completion item and seed it with a label.
         * @param label The completion item's label
         */
        function create(label) {
            return { label: label };
        }
        CompletionItem.create = create;
    })(CompletionItem = exports.CompletionItem || (exports.CompletionItem = {}));
    /**
     * The CompletionList namespace provides functions to deal with
     * completion lists.
     */
    var CompletionList;
    (function (CompletionList) {
        /**
         * Creates a new completion list.
         *
         * @param items The completion items.
         * @param isIncomplete The list is not complete.
         */
        function create(items, isIncomplete) {
            return { items: items ? items : [], isIncomplete: !!isIncomplete };
        }
        CompletionList.create = create;
    })(CompletionList = exports.CompletionList || (exports.CompletionList = {}));
    var MarkedString;
    (function (MarkedString) {
        /**
         * Creates a marked string from plain text.
         *
         * @param plainText The plain text.
         */
        function fromPlainText(plainText) {
            return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
        }
        MarkedString.fromPlainText = fromPlainText;
    })(MarkedString = exports.MarkedString || (exports.MarkedString = {}));
    /**
     * The ParameterInformation namespace provides helper functions to work with
     * [ParameterInformation](#ParameterInformation) literals.
     */
    var ParameterInformation;
    (function (ParameterInformation) {
        /**
         * Creates a new parameter information literal.
         *
         * @param label A label string.
         * @param documentation A doc string.
         */
        function create(label, documentation) {
            return documentation ? { label: label, documentation: documentation } : { label: label };
        }
        ParameterInformation.create = create;
        ;
    })(ParameterInformation = exports.ParameterInformation || (exports.ParameterInformation = {}));
    /**
     * The SignatureInformation namespace provides helper functions to work with
     * [SignatureInformation](#SignatureInformation) literals.
     */
    var SignatureInformation;
    (function (SignatureInformation) {
        function create(label, documentation) {
            var parameters = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                parameters[_i - 2] = arguments[_i];
            }
            var result = { label: label };
            if (Is.defined(documentation)) {
                result.documentation = documentation;
            }
            if (Is.defined(parameters)) {
                result.parameters = parameters;
            }
            else {
                result.parameters = [];
            }
            return result;
        }
        SignatureInformation.create = create;
    })(SignatureInformation = exports.SignatureInformation || (exports.SignatureInformation = {}));
    /**
     * A document highlight kind.
     */
    var DocumentHighlightKind;
    (function (DocumentHighlightKind) {
        /**
         * A textual occurrance.
         */
        DocumentHighlightKind.Text = 1;
        /**
         * Read-access of a symbol, like reading a variable.
         */
        DocumentHighlightKind.Read = 2;
        /**
         * Write-access of a symbol, like writing to a variable.
         */
        DocumentHighlightKind.Write = 3;
    })(DocumentHighlightKind = exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
    /**
     * DocumentHighlight namespace to provide helper functions to work with
     * [DocumentHighlight](#DocumentHighlight) literals.
     */
    var DocumentHighlight;
    (function (DocumentHighlight) {
        /**
         * Create a DocumentHighlight object.
         * @param range The range the highlight applies to.
         */
        function create(range, kind) {
            var result = { range: range };
            if (Is.number(kind)) {
                result.kind = kind;
            }
            return result;
        }
        DocumentHighlight.create = create;
    })(DocumentHighlight = exports.DocumentHighlight || (exports.DocumentHighlight = {}));
    /**
     * A symbol kind.
     */
    var SymbolKind;
    (function (SymbolKind) {
        SymbolKind.File = 1;
        SymbolKind.Module = 2;
        SymbolKind.Namespace = 3;
        SymbolKind.Package = 4;
        SymbolKind.Class = 5;
        SymbolKind.Method = 6;
        SymbolKind.Property = 7;
        SymbolKind.Field = 8;
        SymbolKind.Constructor = 9;
        SymbolKind.Enum = 10;
        SymbolKind.Interface = 11;
        SymbolKind.Function = 12;
        SymbolKind.Variable = 13;
        SymbolKind.Constant = 14;
        SymbolKind.String = 15;
        SymbolKind.Number = 16;
        SymbolKind.Boolean = 17;
        SymbolKind.Array = 18;
        SymbolKind.Object = 19;
        SymbolKind.Key = 20;
        SymbolKind.Null = 21;
        SymbolKind.EnumMember = 22;
        SymbolKind.Struct = 23;
        SymbolKind.Event = 24;
        SymbolKind.Operator = 25;
        SymbolKind.TypeParameter = 26;
    })(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
    var SymbolInformation;
    (function (SymbolInformation) {
        /**
         * Creates a new symbol information literal.
         *
         * @param name The name of the symbol.
         * @param kind The kind of the symbol.
         * @param range The range of the location of the symbol.
         * @param uri The resource of the location of symbol, defaults to the current document.
         * @param containerName The name of the symbol containg the symbol.
         */
        function create(name, kind, range, uri, containerName) {
            var result = {
                name: name,
                kind: kind,
                location: { uri: uri, range: range }
            };
            if (containerName) {
                result.containerName = containerName;
            }
            return result;
        }
        SymbolInformation.create = create;
    })(SymbolInformation = exports.SymbolInformation || (exports.SymbolInformation = {}));
    /**
     * The CodeActionContext namespace provides helper functions to work with
     * [CodeActionContext](#CodeActionContext) literals.
     */
    var CodeActionContext;
    (function (CodeActionContext) {
        /**
         * Creates a new CodeActionContext literal.
         */
        function create(diagnostics) {
            return { diagnostics: diagnostics };
        }
        CodeActionContext.create = create;
        /**
         * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is);
        }
        CodeActionContext.is = is;
    })(CodeActionContext = exports.CodeActionContext || (exports.CodeActionContext = {}));
    /**
     * The CodeLens namespace provides helper functions to work with
     * [CodeLens](#CodeLens) literals.
     */
    var CodeLens;
    (function (CodeLens) {
        /**
         * Creates a new CodeLens literal.
         */
        function create(range, data) {
            var result = { range: range };
            if (Is.defined(data))
                result.data = data;
            return result;
        }
        CodeLens.create = create;
        /**
         * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
        }
        CodeLens.is = is;
    })(CodeLens = exports.CodeLens || (exports.CodeLens = {}));
    /**
     * The FormattingOptions namespace provides helper functions to work with
     * [FormattingOptions](#FormattingOptions) literals.
     */
    var FormattingOptions;
    (function (FormattingOptions) {
        /**
         * Creates a new FormattingOptions literal.
         */
        function create(tabSize, insertSpaces) {
            return { tabSize: tabSize, insertSpaces: insertSpaces };
        }
        FormattingOptions.create = create;
        /**
         * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.number(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
        }
        FormattingOptions.is = is;
    })(FormattingOptions = exports.FormattingOptions || (exports.FormattingOptions = {}));
    /**
     * A document link is a range in a text document that links to an internal or external resource, like another
     * text document or a web site.
     */
    var DocumentLink = /** @class */ (function () {
        function DocumentLink() {
        }
        return DocumentLink;
    }());
    exports.DocumentLink = DocumentLink;
    /**
     * The DocumentLink namespace provides helper functions to work with
     * [DocumentLink](#DocumentLink) literals.
     */
    (function (DocumentLink) {
        /**
         * Creates a new DocumentLink literal.
         */
        function create(range, target) {
            return { range: range, target: target };
        }
        DocumentLink.create = create;
        /**
         * Checks whether the given literal conforms to the [DocumentLink](#DocumentLink) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
        }
        DocumentLink.is = is;
    })(DocumentLink = exports.DocumentLink || (exports.DocumentLink = {}));
    exports.DocumentLink = DocumentLink;
    exports.EOL = ['\n', '\r\n', '\r'];
    var TextDocument;
    (function (TextDocument) {
        /**
         * Creates a new ITextDocument literal from the given uri and content.
         * @param uri The document's uri.
         * @param languageId  The document's language Id.
         * @param content The document's content.
         */
        function create(uri, languageId, version, content) {
            return new FullTextDocument(uri, languageId, version, content);
        }
        TextDocument.create = create;
        /**
         * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.number(candidate.lineCount)
                && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
        }
        TextDocument.is = is;
        function applyEdits(document, edits) {
            var text = document.getText();
            var sortedEdits = mergeSort(edits, function (a, b) {
                var diff = a.range.start.line - b.range.start.line;
                if (diff === 0) {
                    return a.range.start.character - b.range.start.character;
                }
                return 0;
            });
            var lastModifiedOffset = text.length;
            for (var i = sortedEdits.length - 1; i >= 0; i--) {
                var e = sortedEdits[i];
                var startOffset = document.offsetAt(e.range.start);
                var endOffset = document.offsetAt(e.range.end);
                if (endOffset <= lastModifiedOffset) {
                    text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
                }
                else {
                    throw new Error('Ovelapping edit');
                }
                lastModifiedOffset = startOffset;
            }
            return text;
        }
        TextDocument.applyEdits = applyEdits;
        function mergeSort(data, compare) {
            if (data.length <= 1) {
                // sorted
                return data;
            }
            var p = (data.length / 2) | 0;
            var left = data.slice(0, p);
            var right = data.slice(p);
            mergeSort(left, compare);
            mergeSort(right, compare);
            var leftIdx = 0;
            var rightIdx = 0;
            var i = 0;
            while (leftIdx < left.length && rightIdx < right.length) {
                var ret = compare(left[leftIdx], right[rightIdx]);
                if (ret <= 0) {
                    // smaller_equal -> take left to preserve order
                    data[i++] = left[leftIdx++];
                }
                else {
                    // greater -> take right
                    data[i++] = right[rightIdx++];
                }
            }
            while (leftIdx < left.length) {
                data[i++] = left[leftIdx++];
            }
            while (rightIdx < right.length) {
                data[i++] = right[rightIdx++];
            }
            return data;
        }
    })(TextDocument = exports.TextDocument || (exports.TextDocument = {}));
    /**
     * Represents reasons why a text document is saved.
     */
    var TextDocumentSaveReason;
    (function (TextDocumentSaveReason) {
        /**
         * Manually triggered, e.g. by the user pressing save, by starting debugging,
         * or by an API call.
         */
        TextDocumentSaveReason.Manual = 1;
        /**
         * Automatic after a delay.
         */
        TextDocumentSaveReason.AfterDelay = 2;
        /**
         * When the editor lost focus.
         */
        TextDocumentSaveReason.FocusOut = 3;
    })(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
    var FullTextDocument = /** @class */ (function () {
        function FullTextDocument(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = null;
        }
        Object.defineProperty(FullTextDocument.prototype, "uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "languageId", {
            get: function () {
                return this._languageId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        FullTextDocument.prototype.getText = function (range) {
            if (range) {
                var start = this.offsetAt(range.start);
                var end = this.offsetAt(range.end);
                return this._content.substring(start, end);
            }
            return this._content;
        };
        FullTextDocument.prototype.update = function (event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = null;
        };
        FullTextDocument.prototype.getLineOffsets = function () {
            if (this._lineOffsets === null) {
                var lineOffsets = [];
                var text = this._content;
                var isLineStart = true;
                for (var i = 0; i < text.length; i++) {
                    if (isLineStart) {
                        lineOffsets.push(i);
                        isLineStart = false;
                    }
                    var ch = text.charAt(i);
                    isLineStart = (ch === '\r' || ch === '\n');
                    if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
                        i++;
                    }
                }
                if (isLineStart && text.length > 0) {
                    lineOffsets.push(text.length);
                }
                this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
        };
        FullTextDocument.prototype.positionAt = function (offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
                return Position.create(0, offset);
            }
            while (low < high) {
                var mid = Math.floor((low + high) / 2);
                if (lineOffsets[mid] > offset) {
                    high = mid;
                }
                else {
                    low = mid + 1;
                }
            }
            // low is the least x for which the line offset is larger than the current offset
            // or array.length if no line offset is larger than the current offset
            var line = low - 1;
            return Position.create(line, offset - lineOffsets[line]);
        };
        FullTextDocument.prototype.offsetAt = function (position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
                return this._content.length;
            }
            else if (position.line < 0) {
                return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = (position.line + 1 < lineOffsets.length) ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
        };
        Object.defineProperty(FullTextDocument.prototype, "lineCount", {
            get: function () {
                return this.getLineOffsets().length;
            },
            enumerable: true,
            configurable: true
        });
        return FullTextDocument;
    }());
    var Is;
    (function (Is) {
        var toString = Object.prototype.toString;
        function defined(value) {
            return typeof value !== 'undefined';
        }
        Is.defined = defined;
        function undefined(value) {
            return typeof value === 'undefined';
        }
        Is.undefined = undefined;
        function boolean(value) {
            return value === true || value === false;
        }
        Is.boolean = boolean;
        function string(value) {
            return toString.call(value) === '[object String]';
        }
        Is.string = string;
        function number(value) {
            return toString.call(value) === '[object Number]';
        }
        Is.number = number;
        function func(value) {
            return toString.call(value) === '[object Function]';
        }
        Is.func = func;
        function typedArray(value, check) {
            return Array.isArray(value) && value.every(check);
        }
        Is.typedArray = typedArray;
    })(Is || (Is = {}));
});

define('vscode-languageserver-types', ['vscode-languageserver-types/main'], function (main) { return main; });

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/parser/razorTags',["require", "exports"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getRazorTagProvider() {
        var customTags = {
            a: ['asp-action', 'asp-controller', 'asp-fragment', 'asp-host', 'asp-protocol', 'asp-route'],
            div: ['asp-validation-summary'],
            form: ['asp-action', 'asp-controller', 'asp-anti-forgery'],
            input: ['asp-for', 'asp-format'],
            label: ['asp-for'],
            select: ['asp-for', 'asp-items'],
            span: ['asp-validation-for']
        };
        return {
            getId: function () { return 'razor'; },
            isApplicable: function (languageId) { return languageId === 'razor'; },
            collectTags: function (collector) {
                // no extra tags
            },
            collectAttributes: function (tag, collector) {
                if (tag) {
                    var attributes = customTags[tag];
                    if (attributes) {
                        attributes.forEach(function (a) { return collector(a); });
                    }
                }
            },
            collectValues: function (tag, attribute, collector) {
                // no values
            }
        };
    }
    exports.getRazorTagProvider = getRazorTagProvider;
});
//# sourceMappingURL=razorTags.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/services/tagProviders',["require", "exports", "../parser/htmlTags", "../parser/razorTags"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var htmlTags_1 = require("../parser/htmlTags");
    var razorTags_1 = require("../parser/razorTags");
    exports.allTagProviders = [
        htmlTags_1.getHTML5TagProvider(),
        htmlTags_1.getAngularTagProvider(),
        htmlTags_1.getIonicTagProvider(),
        razorTags_1.getRazorTagProvider()
    ];
});
//# sourceMappingURL=tagProviders.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/parser/htmlEntities',["require", "exports"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * HTML 5 character entities
     * https://www.w3.org/TR/html5/syntax.html#named-character-references
     */
    exports.entities = {
        "Aacute;": "\u00C1",
        "Aacute": "\u00C1",
        "aacute;": "\u00E1",
        "aacute": "\u00E1",
        "Abreve;": "\u0102",
        "abreve;": "\u0103",
        "ac;": "\u223E",
        "acd;": "\u223F",
        "acE;": "\u223E\u0333",
        "Acirc;": "\u00C2",
        "Acirc": "\u00C2",
        "acirc;": "\u00E2",
        "acirc": "\u00E2",
        "acute;": "\u00B4",
        "acute": "\u00B4",
        "Acy;": "\u0410",
        "acy;": "\u0430",
        "AElig;": "\u00C6",
        "AElig": "\u00C6",
        "aelig;": "\u00E6",
        "aelig": "\u00E6",
        "af;": "\u2061",
        "Afr;": "\uD835\uDD04",
        "afr;": "\uD835\uDD1E",
        "Agrave;": "\u00C0",
        "Agrave": "\u00C0",
        "agrave;": "\u00E0",
        "agrave": "\u00E0",
        "alefsym;": "\u2135",
        "aleph;": "\u2135",
        "Alpha;": "\u0391",
        "alpha;": "\u03B1",
        "Amacr;": "\u0100",
        "amacr;": "\u0101",
        "amalg;": "\u2A3F",
        "AMP;": "\u0026",
        "AMP": "\u0026",
        "amp;": "\u0026",
        "amp": "\u0026",
        "And;": "\u2A53",
        "and;": "\u2227",
        "andand;": "\u2A55",
        "andd;": "\u2A5C",
        "andslope;": "\u2A58",
        "andv;": "\u2A5A",
        "ang;": "\u2220",
        "ange;": "\u29A4",
        "angle;": "\u2220",
        "angmsd;": "\u2221",
        "angmsdaa;": "\u29A8",
        "angmsdab;": "\u29A9",
        "angmsdac;": "\u29AA",
        "angmsdad;": "\u29AB",
        "angmsdae;": "\u29AC",
        "angmsdaf;": "\u29AD",
        "angmsdag;": "\u29AE",
        "angmsdah;": "\u29AF",
        "angrt;": "\u221F",
        "angrtvb;": "\u22BE",
        "angrtvbd;": "\u299D",
        "angsph;": "\u2222",
        "angst;": "\u00C5",
        "angzarr;": "\u237C",
        "Aogon;": "\u0104",
        "aogon;": "\u0105",
        "Aopf;": "\uD835\uDD38",
        "aopf;": "\uD835\uDD52",
        "ap;": "\u2248",
        "apacir;": "\u2A6F",
        "apE;": "\u2A70",
        "ape;": "\u224A",
        "apid;": "\u224B",
        "apos;": "\u0027",
        "ApplyFunction;": "\u2061",
        "approx;": "\u2248",
        "approxeq;": "\u224A",
        "Aring;": "\u00C5",
        "Aring": "\u00C5",
        "aring;": "\u00E5",
        "aring": "\u00E5",
        "Ascr;": "\uD835\uDC9C",
        "ascr;": "\uD835\uDCB6",
        "Assign;": "\u2254",
        "ast;": "\u002A",
        "asymp;": "\u2248",
        "asympeq;": "\u224D",
        "Atilde;": "\u00C3",
        "Atilde": "\u00C3",
        "atilde;": "\u00E3",
        "atilde": "\u00E3",
        "Auml;": "\u00C4",
        "Auml": "\u00C4",
        "auml;": "\u00E4",
        "auml": "\u00E4",
        "awconint;": "\u2233",
        "awint;": "\u2A11",
        "backcong;": "\u224C",
        "backepsilon;": "\u03F6",
        "backprime;": "\u2035",
        "backsim;": "\u223D",
        "backsimeq;": "\u22CD",
        "Backslash;": "\u2216",
        "Barv;": "\u2AE7",
        "barvee;": "\u22BD",
        "Barwed;": "\u2306",
        "barwed;": "\u2305",
        "barwedge;": "\u2305",
        "bbrk;": "\u23B5",
        "bbrktbrk;": "\u23B6",
        "bcong;": "\u224C",
        "Bcy;": "\u0411",
        "bcy;": "\u0431",
        "bdquo;": "\u201E",
        "becaus;": "\u2235",
        "Because;": "\u2235",
        "because;": "\u2235",
        "bemptyv;": "\u29B0",
        "bepsi;": "\u03F6",
        "bernou;": "\u212C",
        "Bernoullis;": "\u212C",
        "Beta;": "\u0392",
        "beta;": "\u03B2",
        "beth;": "\u2136",
        "between;": "\u226C",
        "Bfr;": "\uD835\uDD05",
        "bfr;": "\uD835\uDD1F",
        "bigcap;": "\u22C2",
        "bigcirc;": "\u25EF",
        "bigcup;": "\u22C3",
        "bigodot;": "\u2A00",
        "bigoplus;": "\u2A01",
        "bigotimes;": "\u2A02",
        "bigsqcup;": "\u2A06",
        "bigstar;": "\u2605",
        "bigtriangledown;": "\u25BD",
        "bigtriangleup;": "\u25B3",
        "biguplus;": "\u2A04",
        "bigvee;": "\u22C1",
        "bigwedge;": "\u22C0",
        "bkarow;": "\u290D",
        "blacklozenge;": "\u29EB",
        "blacksquare;": "\u25AA",
        "blacktriangle;": "\u25B4",
        "blacktriangledown;": "\u25BE",
        "blacktriangleleft;": "\u25C2",
        "blacktriangleright;": "\u25B8",
        "blank;": "\u2423",
        "blk12;": "\u2592",
        "blk14;": "\u2591",
        "blk34;": "\u2593",
        "block;": "\u2588",
        "bne;": "\u003D\u20E5",
        "bnequiv;": "\u2261\u20E5",
        "bNot;": "\u2AED",
        "bnot;": "\u2310",
        "Bopf;": "\uD835\uDD39",
        "bopf;": "\uD835\uDD53",
        "bot;": "\u22A5",
        "bottom;": "\u22A5",
        "bowtie;": "\u22C8",
        "boxbox;": "\u29C9",
        "boxDL;": "\u2557",
        "boxDl;": "\u2556",
        "boxdL;": "\u2555",
        "boxdl;": "\u2510",
        "boxDR;": "\u2554",
        "boxDr;": "\u2553",
        "boxdR;": "\u2552",
        "boxdr;": "\u250C",
        "boxH;": "\u2550",
        "boxh;": "\u2500",
        "boxHD;": "\u2566",
        "boxHd;": "\u2564",
        "boxhD;": "\u2565",
        "boxhd;": "\u252C",
        "boxHU;": "\u2569",
        "boxHu;": "\u2567",
        "boxhU;": "\u2568",
        "boxhu;": "\u2534",
        "boxminus;": "\u229F",
        "boxplus;": "\u229E",
        "boxtimes;": "\u22A0",
        "boxUL;": "\u255D",
        "boxUl;": "\u255C",
        "boxuL;": "\u255B",
        "boxul;": "\u2518",
        "boxUR;": "\u255A",
        "boxUr;": "\u2559",
        "boxuR;": "\u2558",
        "boxur;": "\u2514",
        "boxV;": "\u2551",
        "boxv;": "\u2502",
        "boxVH;": "\u256C",
        "boxVh;": "\u256B",
        "boxvH;": "\u256A",
        "boxvh;": "\u253C",
        "boxVL;": "\u2563",
        "boxVl;": "\u2562",
        "boxvL;": "\u2561",
        "boxvl;": "\u2524",
        "boxVR;": "\u2560",
        "boxVr;": "\u255F",
        "boxvR;": "\u255E",
        "boxvr;": "\u251C",
        "bprime;": "\u2035",
        "Breve;": "\u02D8",
        "breve;": "\u02D8",
        "brvbar;": "\u00A6",
        "brvbar": "\u00A6",
        "Bscr;": "\u212C",
        "bscr;": "\uD835\uDCB7",
        "bsemi;": "\u204F",
        "bsim;": "\u223D",
        "bsime;": "\u22CD",
        "bsol;": "\u005C",
        "bsolb;": "\u29C5",
        "bsolhsub;": "\u27C8",
        "bull;": "\u2022",
        "bullet;": "\u2022",
        "bump;": "\u224E",
        "bumpE;": "\u2AAE",
        "bumpe;": "\u224F",
        "Bumpeq;": "\u224E",
        "bumpeq;": "\u224F",
        "Cacute;": "\u0106",
        "cacute;": "\u0107",
        "Cap;": "\u22D2",
        "cap;": "\u2229",
        "capand;": "\u2A44",
        "capbrcup;": "\u2A49",
        "capcap;": "\u2A4B",
        "capcup;": "\u2A47",
        "capdot;": "\u2A40",
        "CapitalDifferentialD;": "\u2145",
        "caps;": "\u2229\uFE00",
        "caret;": "\u2041",
        "caron;": "\u02C7",
        "Cayleys;": "\u212D",
        "ccaps;": "\u2A4D",
        "Ccaron;": "\u010C",
        "ccaron;": "\u010D",
        "Ccedil;": "\u00C7",
        "Ccedil": "\u00C7",
        "ccedil;": "\u00E7",
        "ccedil": "\u00E7",
        "Ccirc;": "\u0108",
        "ccirc;": "\u0109",
        "Cconint;": "\u2230",
        "ccups;": "\u2A4C",
        "ccupssm;": "\u2A50",
        "Cdot;": "\u010A",
        "cdot;": "\u010B",
        "cedil;": "\u00B8",
        "cedil": "\u00B8",
        "Cedilla;": "\u00B8",
        "cemptyv;": "\u29B2",
        "cent;": "\u00A2",
        "cent": "\u00A2",
        "CenterDot;": "\u00B7",
        "centerdot;": "\u00B7",
        "Cfr;": "\u212D",
        "cfr;": "\uD835\uDD20",
        "CHcy;": "\u0427",
        "chcy;": "\u0447",
        "check;": "\u2713",
        "checkmark;": "\u2713",
        "Chi;": "\u03A7",
        "chi;": "\u03C7",
        "cir;": "\u25CB",
        "circ;": "\u02C6",
        "circeq;": "\u2257",
        "circlearrowleft;": "\u21BA",
        "circlearrowright;": "\u21BB",
        "circledast;": "\u229B",
        "circledcirc;": "\u229A",
        "circleddash;": "\u229D",
        "CircleDot;": "\u2299",
        "circledR;": "\u00AE",
        "circledS;": "\u24C8",
        "CircleMinus;": "\u2296",
        "CirclePlus;": "\u2295",
        "CircleTimes;": "\u2297",
        "cirE;": "\u29C3",
        "cire;": "\u2257",
        "cirfnint;": "\u2A10",
        "cirmid;": "\u2AEF",
        "cirscir;": "\u29C2",
        "ClockwiseContourIntegral;": "\u2232",
        "CloseCurlyDoubleQuote;": "\u201D",
        "CloseCurlyQuote;": "\u2019",
        "clubs;": "\u2663",
        "clubsuit;": "\u2663",
        "Colon;": "\u2237",
        "colon;": "\u003A",
        "Colone;": "\u2A74",
        "colone;": "\u2254",
        "coloneq;": "\u2254",
        "comma;": "\u002C",
        "commat;": "\u0040",
        "comp;": "\u2201",
        "compfn;": "\u2218",
        "complement;": "\u2201",
        "complexes;": "\u2102",
        "cong;": "\u2245",
        "congdot;": "\u2A6D",
        "Congruent;": "\u2261",
        "Conint;": "\u222F",
        "conint;": "\u222E",
        "ContourIntegral;": "\u222E",
        "Copf;": "\u2102",
        "copf;": "\uD835\uDD54",
        "coprod;": "\u2210",
        "Coproduct;": "\u2210",
        "COPY;": "\u00A9",
        "COPY": "\u00A9",
        "copy;": "\u00A9",
        "copy": "\u00A9",
        "copysr;": "\u2117",
        "CounterClockwiseContourIntegral;": "\u2233",
        "crarr;": "\u21B5",
        "Cross;": "\u2A2F",
        "cross;": "\u2717",
        "Cscr;": "\uD835\uDC9E",
        "cscr;": "\uD835\uDCB8",
        "csub;": "\u2ACF",
        "csube;": "\u2AD1",
        "csup;": "\u2AD0",
        "csupe;": "\u2AD2",
        "ctdot;": "\u22EF",
        "cudarrl;": "\u2938",
        "cudarrr;": "\u2935",
        "cuepr;": "\u22DE",
        "cuesc;": "\u22DF",
        "cularr;": "\u21B6",
        "cularrp;": "\u293D",
        "Cup;": "\u22D3",
        "cup;": "\u222A",
        "cupbrcap;": "\u2A48",
        "CupCap;": "\u224D",
        "cupcap;": "\u2A46",
        "cupcup;": "\u2A4A",
        "cupdot;": "\u228D",
        "cupor;": "\u2A45",
        "cups;": "\u222A\uFE00",
        "curarr;": "\u21B7",
        "curarrm;": "\u293C",
        "curlyeqprec;": "\u22DE",
        "curlyeqsucc;": "\u22DF",
        "curlyvee;": "\u22CE",
        "curlywedge;": "\u22CF",
        "curren;": "\u00A4",
        "curren": "\u00A4",
        "curvearrowleft;": "\u21B6",
        "curvearrowright;": "\u21B7",
        "cuvee;": "\u22CE",
        "cuwed;": "\u22CF",
        "cwconint;": "\u2232",
        "cwint;": "\u2231",
        "cylcty;": "\u232D",
        "Dagger;": "\u2021",
        "dagger;": "\u2020",
        "daleth;": "\u2138",
        "Darr;": "\u21A1",
        "dArr;": "\u21D3",
        "darr;": "\u2193",
        "dash;": "\u2010",
        "Dashv;": "\u2AE4",
        "dashv;": "\u22A3",
        "dbkarow;": "\u290F",
        "dblac;": "\u02DD",
        "Dcaron;": "\u010E",
        "dcaron;": "\u010F",
        "Dcy;": "\u0414",
        "dcy;": "\u0434",
        "DD;": "\u2145",
        "dd;": "\u2146",
        "ddagger;": "\u2021",
        "ddarr;": "\u21CA",
        "DDotrahd;": "\u2911",
        "ddotseq;": "\u2A77",
        "deg;": "\u00B0",
        "deg": "\u00B0",
        "Del;": "\u2207",
        "Delta;": "\u0394",
        "delta;": "\u03B4",
        "demptyv;": "\u29B1",
        "dfisht;": "\u297F",
        "Dfr;": "\uD835\uDD07",
        "dfr;": "\uD835\uDD21",
        "dHar;": "\u2965",
        "dharl;": "\u21C3",
        "dharr;": "\u21C2",
        "DiacriticalAcute;": "\u00B4",
        "DiacriticalDot;": "\u02D9",
        "DiacriticalDoubleAcute;": "\u02DD",
        "DiacriticalGrave;": "\u0060",
        "DiacriticalTilde;": "\u02DC",
        "diam;": "\u22C4",
        "Diamond;": "\u22C4",
        "diamond;": "\u22C4",
        "diamondsuit;": "\u2666",
        "diams;": "\u2666",
        "die;": "\u00A8",
        "DifferentialD;": "\u2146",
        "digamma;": "\u03DD",
        "disin;": "\u22F2",
        "div;": "\u00F7",
        "divide;": "\u00F7",
        "divide": "\u00F7",
        "divideontimes;": "\u22C7",
        "divonx;": "\u22C7",
        "DJcy;": "\u0402",
        "djcy;": "\u0452",
        "dlcorn;": "\u231E",
        "dlcrop;": "\u230D",
        "dollar;": "\u0024",
        "Dopf;": "\uD835\uDD3B",
        "dopf;": "\uD835\uDD55",
        "Dot;": "\u00A8",
        "dot;": "\u02D9",
        "DotDot;": "\u20DC",
        "doteq;": "\u2250",
        "doteqdot;": "\u2251",
        "DotEqual;": "\u2250",
        "dotminus;": "\u2238",
        "dotplus;": "\u2214",
        "dotsquare;": "\u22A1",
        "doublebarwedge;": "\u2306",
        "DoubleContourIntegral;": "\u222F",
        "DoubleDot;": "\u00A8",
        "DoubleDownArrow;": "\u21D3",
        "DoubleLeftArrow;": "\u21D0",
        "DoubleLeftRightArrow;": "\u21D4",
        "DoubleLeftTee;": "\u2AE4",
        "DoubleLongLeftArrow;": "\u27F8",
        "DoubleLongLeftRightArrow;": "\u27FA",
        "DoubleLongRightArrow;": "\u27F9",
        "DoubleRightArrow;": "\u21D2",
        "DoubleRightTee;": "\u22A8",
        "DoubleUpArrow;": "\u21D1",
        "DoubleUpDownArrow;": "\u21D5",
        "DoubleVerticalBar;": "\u2225",
        "DownArrow;": "\u2193",
        "Downarrow;": "\u21D3",
        "downarrow;": "\u2193",
        "DownArrowBar;": "\u2913",
        "DownArrowUpArrow;": "\u21F5",
        "DownBreve;": "\u0311",
        "downdownarrows;": "\u21CA",
        "downharpoonleft;": "\u21C3",
        "downharpoonright;": "\u21C2",
        "DownLeftRightVector;": "\u2950",
        "DownLeftTeeVector;": "\u295E",
        "DownLeftVector;": "\u21BD",
        "DownLeftVectorBar;": "\u2956",
        "DownRightTeeVector;": "\u295F",
        "DownRightVector;": "\u21C1",
        "DownRightVectorBar;": "\u2957",
        "DownTee;": "\u22A4",
        "DownTeeArrow;": "\u21A7",
        "drbkarow;": "\u2910",
        "drcorn;": "\u231F",
        "drcrop;": "\u230C",
        "Dscr;": "\uD835\uDC9F",
        "dscr;": "\uD835\uDCB9",
        "DScy;": "\u0405",
        "dscy;": "\u0455",
        "dsol;": "\u29F6",
        "Dstrok;": "\u0110",
        "dstrok;": "\u0111",
        "dtdot;": "\u22F1",
        "dtri;": "\u25BF",
        "dtrif;": "\u25BE",
        "duarr;": "\u21F5",
        "duhar;": "\u296F",
        "dwangle;": "\u29A6",
        "DZcy;": "\u040F",
        "dzcy;": "\u045F",
        "dzigrarr;": "\u27FF",
        "Eacute;": "\u00C9",
        "Eacute": "\u00C9",
        "eacute;": "\u00E9",
        "eacute": "\u00E9",
        "easter;": "\u2A6E",
        "Ecaron;": "\u011A",
        "ecaron;": "\u011B",
        "ecir;": "\u2256",
        "Ecirc;": "\u00CA",
        "Ecirc": "\u00CA",
        "ecirc;": "\u00EA",
        "ecirc": "\u00EA",
        "ecolon;": "\u2255",
        "Ecy;": "\u042D",
        "ecy;": "\u044D",
        "eDDot;": "\u2A77",
        "Edot;": "\u0116",
        "eDot;": "\u2251",
        "edot;": "\u0117",
        "ee;": "\u2147",
        "efDot;": "\u2252",
        "Efr;": "\uD835\uDD08",
        "efr;": "\uD835\uDD22",
        "eg;": "\u2A9A",
        "Egrave;": "\u00C8",
        "Egrave": "\u00C8",
        "egrave;": "\u00E8",
        "egrave": "\u00E8",
        "egs;": "\u2A96",
        "egsdot;": "\u2A98",
        "el;": "\u2A99",
        "Element;": "\u2208",
        "elinters;": "\u23E7",
        "ell;": "\u2113",
        "els;": "\u2A95",
        "elsdot;": "\u2A97",
        "Emacr;": "\u0112",
        "emacr;": "\u0113",
        "empty;": "\u2205",
        "emptyset;": "\u2205",
        "EmptySmallSquare;": "\u25FB",
        "emptyv;": "\u2205",
        "EmptyVerySmallSquare;": "\u25AB",
        "emsp;": "\u2003",
        "emsp13;": "\u2004",
        "emsp14;": "\u2005",
        "ENG;": "\u014A",
        "eng;": "\u014B",
        "ensp;": "\u2002",
        "Eogon;": "\u0118",
        "eogon;": "\u0119",
        "Eopf;": "\uD835\uDD3C",
        "eopf;": "\uD835\uDD56",
        "epar;": "\u22D5",
        "eparsl;": "\u29E3",
        "eplus;": "\u2A71",
        "epsi;": "\u03B5",
        "Epsilon;": "\u0395",
        "epsilon;": "\u03B5",
        "epsiv;": "\u03F5",
        "eqcirc;": "\u2256",
        "eqcolon;": "\u2255",
        "eqsim;": "\u2242",
        "eqslantgtr;": "\u2A96",
        "eqslantless;": "\u2A95",
        "Equal;": "\u2A75",
        "equals;": "\u003D",
        "EqualTilde;": "\u2242",
        "equest;": "\u225F",
        "Equilibrium;": "\u21CC",
        "equiv;": "\u2261",
        "equivDD;": "\u2A78",
        "eqvparsl;": "\u29E5",
        "erarr;": "\u2971",
        "erDot;": "\u2253",
        "Escr;": "\u2130",
        "escr;": "\u212F",
        "esdot;": "\u2250",
        "Esim;": "\u2A73",
        "esim;": "\u2242",
        "Eta;": "\u0397",
        "eta;": "\u03B7",
        "ETH;": "\u00D0",
        "ETH": "\u00D0",
        "eth;": "\u00F0",
        "eth": "\u00F0",
        "Euml;": "\u00CB",
        "Euml": "\u00CB",
        "euml;": "\u00EB",
        "euml": "\u00EB",
        "euro;": "\u20AC",
        "excl;": "\u0021",
        "exist;": "\u2203",
        "Exists;": "\u2203",
        "expectation;": "\u2130",
        "ExponentialE;": "\u2147",
        "exponentiale;": "\u2147",
        "fallingdotseq;": "\u2252",
        "Fcy;": "\u0424",
        "fcy;": "\u0444",
        "female;": "\u2640",
        "ffilig;": "\uFB03",
        "fflig;": "\uFB00",
        "ffllig;": "\uFB04",
        "Ffr;": "\uD835\uDD09",
        "ffr;": "\uD835\uDD23",
        "filig;": "\uFB01",
        "FilledSmallSquare;": "\u25FC",
        "FilledVerySmallSquare;": "\u25AA",
        "fjlig;": "\u0066\u006A",
        "flat;": "\u266D",
        "fllig;": "\uFB02",
        "fltns;": "\u25B1",
        "fnof;": "\u0192",
        "Fopf;": "\uD835\uDD3D",
        "fopf;": "\uD835\uDD57",
        "ForAll;": "\u2200",
        "forall;": "\u2200",
        "fork;": "\u22D4",
        "forkv;": "\u2AD9",
        "Fouriertrf;": "\u2131",
        "fpartint;": "\u2A0D",
        "frac12;": "\u00BD",
        "frac12": "\u00BD",
        "frac13;": "\u2153",
        "frac14;": "\u00BC",
        "frac14": "\u00BC",
        "frac15;": "\u2155",
        "frac16;": "\u2159",
        "frac18;": "\u215B",
        "frac23;": "\u2154",
        "frac25;": "\u2156",
        "frac34;": "\u00BE",
        "frac34": "\u00BE",
        "frac35;": "\u2157",
        "frac38;": "\u215C",
        "frac45;": "\u2158",
        "frac56;": "\u215A",
        "frac58;": "\u215D",
        "frac78;": "\u215E",
        "frasl;": "\u2044",
        "frown;": "\u2322",
        "Fscr;": "\u2131",
        "fscr;": "\uD835\uDCBB",
        "gacute;": "\u01F5",
        "Gamma;": "\u0393",
        "gamma;": "\u03B3",
        "Gammad;": "\u03DC",
        "gammad;": "\u03DD",
        "gap;": "\u2A86",
        "Gbreve;": "\u011E",
        "gbreve;": "\u011F",
        "Gcedil;": "\u0122",
        "Gcirc;": "\u011C",
        "gcirc;": "\u011D",
        "Gcy;": "\u0413",
        "gcy;": "\u0433",
        "Gdot;": "\u0120",
        "gdot;": "\u0121",
        "gE;": "\u2267",
        "ge;": "\u2265",
        "gEl;": "\u2A8C",
        "gel;": "\u22DB",
        "geq;": "\u2265",
        "geqq;": "\u2267",
        "geqslant;": "\u2A7E",
        "ges;": "\u2A7E",
        "gescc;": "\u2AA9",
        "gesdot;": "\u2A80",
        "gesdoto;": "\u2A82",
        "gesdotol;": "\u2A84",
        "gesl;": "\u22DB\uFE00",
        "gesles;": "\u2A94",
        "Gfr;": "\uD835\uDD0A",
        "gfr;": "\uD835\uDD24",
        "Gg;": "\u22D9",
        "gg;": "\u226B",
        "ggg;": "\u22D9",
        "gimel;": "\u2137",
        "GJcy;": "\u0403",
        "gjcy;": "\u0453",
        "gl;": "\u2277",
        "gla;": "\u2AA5",
        "glE;": "\u2A92",
        "glj;": "\u2AA4",
        "gnap;": "\u2A8A",
        "gnapprox;": "\u2A8A",
        "gnE;": "\u2269",
        "gne;": "\u2A88",
        "gneq;": "\u2A88",
        "gneqq;": "\u2269",
        "gnsim;": "\u22E7",
        "Gopf;": "\uD835\uDD3E",
        "gopf;": "\uD835\uDD58",
        "grave;": "\u0060",
        "GreaterEqual;": "\u2265",
        "GreaterEqualLess;": "\u22DB",
        "GreaterFullEqual;": "\u2267",
        "GreaterGreater;": "\u2AA2",
        "GreaterLess;": "\u2277",
        "GreaterSlantEqual;": "\u2A7E",
        "GreaterTilde;": "\u2273",
        "Gscr;": "\uD835\uDCA2",
        "gscr;": "\u210A",
        "gsim;": "\u2273",
        "gsime;": "\u2A8E",
        "gsiml;": "\u2A90",
        "GT;": "\u003E",
        "GT": "\u003E",
        "Gt;": "\u226B",
        "gt;": "\u003E",
        "gt": "\u003E",
        "gtcc;": "\u2AA7",
        "gtcir;": "\u2A7A",
        "gtdot;": "\u22D7",
        "gtlPar;": "\u2995",
        "gtquest;": "\u2A7C",
        "gtrapprox;": "\u2A86",
        "gtrarr;": "\u2978",
        "gtrdot;": "\u22D7",
        "gtreqless;": "\u22DB",
        "gtreqqless;": "\u2A8C",
        "gtrless;": "\u2277",
        "gtrsim;": "\u2273",
        "gvertneqq;": "\u2269\uFE00",
        "gvnE;": "\u2269\uFE00",
        "Hacek;": "\u02C7",
        "hairsp;": "\u200A",
        "half;": "\u00BD",
        "hamilt;": "\u210B",
        "HARDcy;": "\u042A",
        "hardcy;": "\u044A",
        "hArr;": "\u21D4",
        "harr;": "\u2194",
        "harrcir;": "\u2948",
        "harrw;": "\u21AD",
        "Hat;": "\u005E",
        "hbar;": "\u210F",
        "Hcirc;": "\u0124",
        "hcirc;": "\u0125",
        "hearts;": "\u2665",
        "heartsuit;": "\u2665",
        "hellip;": "\u2026",
        "hercon;": "\u22B9",
        "Hfr;": "\u210C",
        "hfr;": "\uD835\uDD25",
        "HilbertSpace;": "\u210B",
        "hksearow;": "\u2925",
        "hkswarow;": "\u2926",
        "hoarr;": "\u21FF",
        "homtht;": "\u223B",
        "hookleftarrow;": "\u21A9",
        "hookrightarrow;": "\u21AA",
        "Hopf;": "\u210D",
        "hopf;": "\uD835\uDD59",
        "horbar;": "\u2015",
        "HorizontalLine;": "\u2500",
        "Hscr;": "\u210B",
        "hscr;": "\uD835\uDCBD",
        "hslash;": "\u210F",
        "Hstrok;": "\u0126",
        "hstrok;": "\u0127",
        "HumpDownHump;": "\u224E",
        "HumpEqual;": "\u224F",
        "hybull;": "\u2043",
        "hyphen;": "\u2010",
        "Iacute;": "\u00CD",
        "Iacute": "\u00CD",
        "iacute;": "\u00ED",
        "iacute": "\u00ED",
        "ic;": "\u2063",
        "Icirc;": "\u00CE",
        "Icirc": "\u00CE",
        "icirc;": "\u00EE",
        "icirc": "\u00EE",
        "Icy;": "\u0418",
        "icy;": "\u0438",
        "Idot;": "\u0130",
        "IEcy;": "\u0415",
        "iecy;": "\u0435",
        "iexcl;": "\u00A1",
        "iexcl": "\u00A1",
        "iff;": "\u21D4",
        "Ifr;": "\u2111",
        "ifr;": "\uD835\uDD26",
        "Igrave;": "\u00CC",
        "Igrave": "\u00CC",
        "igrave;": "\u00EC",
        "igrave": "\u00EC",
        "ii;": "\u2148",
        "iiiint;": "\u2A0C",
        "iiint;": "\u222D",
        "iinfin;": "\u29DC",
        "iiota;": "\u2129",
        "IJlig;": "\u0132",
        "ijlig;": "\u0133",
        "Im;": "\u2111",
        "Imacr;": "\u012A",
        "imacr;": "\u012B",
        "image;": "\u2111",
        "ImaginaryI;": "\u2148",
        "imagline;": "\u2110",
        "imagpart;": "\u2111",
        "imath;": "\u0131",
        "imof;": "\u22B7",
        "imped;": "\u01B5",
        "Implies;": "\u21D2",
        "in;": "\u2208",
        "incare;": "\u2105",
        "infin;": "\u221E",
        "infintie;": "\u29DD",
        "inodot;": "\u0131",
        "Int;": "\u222C",
        "int;": "\u222B",
        "intcal;": "\u22BA",
        "integers;": "\u2124",
        "Integral;": "\u222B",
        "intercal;": "\u22BA",
        "Intersection;": "\u22C2",
        "intlarhk;": "\u2A17",
        "intprod;": "\u2A3C",
        "InvisibleComma;": "\u2063",
        "InvisibleTimes;": "\u2062",
        "IOcy;": "\u0401",
        "iocy;": "\u0451",
        "Iogon;": "\u012E",
        "iogon;": "\u012F",
        "Iopf;": "\uD835\uDD40",
        "iopf;": "\uD835\uDD5A",
        "Iota;": "\u0399",
        "iota;": "\u03B9",
        "iprod;": "\u2A3C",
        "iquest;": "\u00BF",
        "iquest": "\u00BF",
        "Iscr;": "\u2110",
        "iscr;": "\uD835\uDCBE",
        "isin;": "\u2208",
        "isindot;": "\u22F5",
        "isinE;": "\u22F9",
        "isins;": "\u22F4",
        "isinsv;": "\u22F3",
        "isinv;": "\u2208",
        "it;": "\u2062",
        "Itilde;": "\u0128",
        "itilde;": "\u0129",
        "Iukcy;": "\u0406",
        "iukcy;": "\u0456",
        "Iuml;": "\u00CF",
        "Iuml": "\u00CF",
        "iuml;": "\u00EF",
        "iuml": "\u00EF",
        "Jcirc;": "\u0134",
        "jcirc;": "\u0135",
        "Jcy;": "\u0419",
        "jcy;": "\u0439",
        "Jfr;": "\uD835\uDD0D",
        "jfr;": "\uD835\uDD27",
        "jmath;": "\u0237",
        "Jopf;": "\uD835\uDD41",
        "jopf;": "\uD835\uDD5B",
        "Jscr;": "\uD835\uDCA5",
        "jscr;": "\uD835\uDCBF",
        "Jsercy;": "\u0408",
        "jsercy;": "\u0458",
        "Jukcy;": "\u0404",
        "jukcy;": "\u0454",
        "Kappa;": "\u039A",
        "kappa;": "\u03BA",
        "kappav;": "\u03F0",
        "Kcedil;": "\u0136",
        "kcedil;": "\u0137",
        "Kcy;": "\u041A",
        "kcy;": "\u043A",
        "Kfr;": "\uD835\uDD0E",
        "kfr;": "\uD835\uDD28",
        "kgreen;": "\u0138",
        "KHcy;": "\u0425",
        "khcy;": "\u0445",
        "KJcy;": "\u040C",
        "kjcy;": "\u045C",
        "Kopf;": "\uD835\uDD42",
        "kopf;": "\uD835\uDD5C",
        "Kscr;": "\uD835\uDCA6",
        "kscr;": "\uD835\uDCC0",
        "lAarr;": "\u21DA",
        "Lacute;": "\u0139",
        "lacute;": "\u013A",
        "laemptyv;": "\u29B4",
        "lagran;": "\u2112",
        "Lambda;": "\u039B",
        "lambda;": "\u03BB",
        "Lang;": "\u27EA",
        "lang;": "\u27E8",
        "langd;": "\u2991",
        "langle;": "\u27E8",
        "lap;": "\u2A85",
        "Laplacetrf;": "\u2112",
        "laquo;": "\u00AB",
        "laquo": "\u00AB",
        "Larr;": "\u219E",
        "lArr;": "\u21D0",
        "larr;": "\u2190",
        "larrb;": "\u21E4",
        "larrbfs;": "\u291F",
        "larrfs;": "\u291D",
        "larrhk;": "\u21A9",
        "larrlp;": "\u21AB",
        "larrpl;": "\u2939",
        "larrsim;": "\u2973",
        "larrtl;": "\u21A2",
        "lat;": "\u2AAB",
        "lAtail;": "\u291B",
        "latail;": "\u2919",
        "late;": "\u2AAD",
        "lates;": "\u2AAD\uFE00",
        "lBarr;": "\u290E",
        "lbarr;": "\u290C",
        "lbbrk;": "\u2772",
        "lbrace;": "\u007B",
        "lbrack;": "\u005B",
        "lbrke;": "\u298B",
        "lbrksld;": "\u298F",
        "lbrkslu;": "\u298D",
        "Lcaron;": "\u013D",
        "lcaron;": "\u013E",
        "Lcedil;": "\u013B",
        "lcedil;": "\u013C",
        "lceil;": "\u2308",
        "lcub;": "\u007B",
        "Lcy;": "\u041B",
        "lcy;": "\u043B",
        "ldca;": "\u2936",
        "ldquo;": "\u201C",
        "ldquor;": "\u201E",
        "ldrdhar;": "\u2967",
        "ldrushar;": "\u294B",
        "ldsh;": "\u21B2",
        "lE;": "\u2266",
        "le;": "\u2264",
        "LeftAngleBracket;": "\u27E8",
        "LeftArrow;": "\u2190",
        "Leftarrow;": "\u21D0",
        "leftarrow;": "\u2190",
        "LeftArrowBar;": "\u21E4",
        "LeftArrowRightArrow;": "\u21C6",
        "leftarrowtail;": "\u21A2",
        "LeftCeiling;": "\u2308",
        "LeftDoubleBracket;": "\u27E6",
        "LeftDownTeeVector;": "\u2961",
        "LeftDownVector;": "\u21C3",
        "LeftDownVectorBar;": "\u2959",
        "LeftFloor;": "\u230A",
        "leftharpoondown;": "\u21BD",
        "leftharpoonup;": "\u21BC",
        "leftleftarrows;": "\u21C7",
        "LeftRightArrow;": "\u2194",
        "Leftrightarrow;": "\u21D4",
        "leftrightarrow;": "\u2194",
        "leftrightarrows;": "\u21C6",
        "leftrightharpoons;": "\u21CB",
        "leftrightsquigarrow;": "\u21AD",
        "LeftRightVector;": "\u294E",
        "LeftTee;": "\u22A3",
        "LeftTeeArrow;": "\u21A4",
        "LeftTeeVector;": "\u295A",
        "leftthreetimes;": "\u22CB",
        "LeftTriangle;": "\u22B2",
        "LeftTriangleBar;": "\u29CF",
        "LeftTriangleEqual;": "\u22B4",
        "LeftUpDownVector;": "\u2951",
        "LeftUpTeeVector;": "\u2960",
        "LeftUpVector;": "\u21BF",
        "LeftUpVectorBar;": "\u2958",
        "LeftVector;": "\u21BC",
        "LeftVectorBar;": "\u2952",
        "lEg;": "\u2A8B",
        "leg;": "\u22DA",
        "leq;": "\u2264",
        "leqq;": "\u2266",
        "leqslant;": "\u2A7D",
        "les;": "\u2A7D",
        "lescc;": "\u2AA8",
        "lesdot;": "\u2A7F",
        "lesdoto;": "\u2A81",
        "lesdotor;": "\u2A83",
        "lesg;": "\u22DA\uFE00",
        "lesges;": "\u2A93",
        "lessapprox;": "\u2A85",
        "lessdot;": "\u22D6",
        "lesseqgtr;": "\u22DA",
        "lesseqqgtr;": "\u2A8B",
        "LessEqualGreater;": "\u22DA",
        "LessFullEqual;": "\u2266",
        "LessGreater;": "\u2276",
        "lessgtr;": "\u2276",
        "LessLess;": "\u2AA1",
        "lesssim;": "\u2272",
        "LessSlantEqual;": "\u2A7D",
        "LessTilde;": "\u2272",
        "lfisht;": "\u297C",
        "lfloor;": "\u230A",
        "Lfr;": "\uD835\uDD0F",
        "lfr;": "\uD835\uDD29",
        "lg;": "\u2276",
        "lgE;": "\u2A91",
        "lHar;": "\u2962",
        "lhard;": "\u21BD",
        "lharu;": "\u21BC",
        "lharul;": "\u296A",
        "lhblk;": "\u2584",
        "LJcy;": "\u0409",
        "ljcy;": "\u0459",
        "Ll;": "\u22D8",
        "ll;": "\u226A",
        "llarr;": "\u21C7",
        "llcorner;": "\u231E",
        "Lleftarrow;": "\u21DA",
        "llhard;": "\u296B",
        "lltri;": "\u25FA",
        "Lmidot;": "\u013F",
        "lmidot;": "\u0140",
        "lmoust;": "\u23B0",
        "lmoustache;": "\u23B0",
        "lnap;": "\u2A89",
        "lnapprox;": "\u2A89",
        "lnE;": "\u2268",
        "lne;": "\u2A87",
        "lneq;": "\u2A87",
        "lneqq;": "\u2268",
        "lnsim;": "\u22E6",
        "loang;": "\u27EC",
        "loarr;": "\u21FD",
        "lobrk;": "\u27E6",
        "LongLeftArrow;": "\u27F5",
        "Longleftarrow;": "\u27F8",
        "longleftarrow;": "\u27F5",
        "LongLeftRightArrow;": "\u27F7",
        "Longleftrightarrow;": "\u27FA",
        "longleftrightarrow;": "\u27F7",
        "longmapsto;": "\u27FC",
        "LongRightArrow;": "\u27F6",
        "Longrightarrow;": "\u27F9",
        "longrightarrow;": "\u27F6",
        "looparrowleft;": "\u21AB",
        "looparrowright;": "\u21AC",
        "lopar;": "\u2985",
        "Lopf;": "\uD835\uDD43",
        "lopf;": "\uD835\uDD5D",
        "loplus;": "\u2A2D",
        "lotimes;": "\u2A34",
        "lowast;": "\u2217",
        "lowbar;": "\u005F",
        "LowerLeftArrow;": "\u2199",
        "LowerRightArrow;": "\u2198",
        "loz;": "\u25CA",
        "lozenge;": "\u25CA",
        "lozf;": "\u29EB",
        "lpar;": "\u0028",
        "lparlt;": "\u2993",
        "lrarr;": "\u21C6",
        "lrcorner;": "\u231F",
        "lrhar;": "\u21CB",
        "lrhard;": "\u296D",
        "lrm;": "\u200E",
        "lrtri;": "\u22BF",
        "lsaquo;": "\u2039",
        "Lscr;": "\u2112",
        "lscr;": "\uD835\uDCC1",
        "Lsh;": "\u21B0",
        "lsh;": "\u21B0",
        "lsim;": "\u2272",
        "lsime;": "\u2A8D",
        "lsimg;": "\u2A8F",
        "lsqb;": "\u005B",
        "lsquo;": "\u2018",
        "lsquor;": "\u201A",
        "Lstrok;": "\u0141",
        "lstrok;": "\u0142",
        "LT;": "\u003C",
        "LT": "\u003C",
        "Lt;": "\u226A",
        "lt;": "\u003C",
        "lt": "\u003C",
        "ltcc;": "\u2AA6",
        "ltcir;": "\u2A79",
        "ltdot;": "\u22D6",
        "lthree;": "\u22CB",
        "ltimes;": "\u22C9",
        "ltlarr;": "\u2976",
        "ltquest;": "\u2A7B",
        "ltri;": "\u25C3",
        "ltrie;": "\u22B4",
        "ltrif;": "\u25C2",
        "ltrPar;": "\u2996",
        "lurdshar;": "\u294A",
        "luruhar;": "\u2966",
        "lvertneqq;": "\u2268\uFE00",
        "lvnE;": "\u2268\uFE00",
        "macr;": "\u00AF",
        "macr": "\u00AF",
        "male;": "\u2642",
        "malt;": "\u2720",
        "maltese;": "\u2720",
        "Map;": "\u2905",
        "map;": "\u21A6",
        "mapsto;": "\u21A6",
        "mapstodown;": "\u21A7",
        "mapstoleft;": "\u21A4",
        "mapstoup;": "\u21A5",
        "marker;": "\u25AE",
        "mcomma;": "\u2A29",
        "Mcy;": "\u041C",
        "mcy;": "\u043C",
        "mdash;": "\u2014",
        "mDDot;": "\u223A",
        "measuredangle;": "\u2221",
        "MediumSpace;": "\u205F",
        "Mellintrf;": "\u2133",
        "Mfr;": "\uD835\uDD10",
        "mfr;": "\uD835\uDD2A",
        "mho;": "\u2127",
        "micro;": "\u00B5",
        "micro": "\u00B5",
        "mid;": "\u2223",
        "midast;": "\u002A",
        "midcir;": "\u2AF0",
        "middot;": "\u00B7",
        "middot": "\u00B7",
        "minus;": "\u2212",
        "minusb;": "\u229F",
        "minusd;": "\u2238",
        "minusdu;": "\u2A2A",
        "MinusPlus;": "\u2213",
        "mlcp;": "\u2ADB",
        "mldr;": "\u2026",
        "mnplus;": "\u2213",
        "models;": "\u22A7",
        "Mopf;": "\uD835\uDD44",
        "mopf;": "\uD835\uDD5E",
        "mp;": "\u2213",
        "Mscr;": "\u2133",
        "mscr;": "\uD835\uDCC2",
        "mstpos;": "\u223E",
        "Mu;": "\u039C",
        "mu;": "\u03BC",
        "multimap;": "\u22B8",
        "mumap;": "\u22B8",
        "nabla;": "\u2207",
        "Nacute;": "\u0143",
        "nacute;": "\u0144",
        "nang;": "\u2220\u20D2",
        "nap;": "\u2249",
        "napE;": "\u2A70\u0338",
        "napid;": "\u224B\u0338",
        "napos;": "\u0149",
        "napprox;": "\u2249",
        "natur;": "\u266E",
        "natural;": "\u266E",
        "naturals;": "\u2115",
        "nbsp;": "\u00A0",
        "nbsp": "\u00A0",
        "nbump;": "\u224E\u0338",
        "nbumpe;": "\u224F\u0338",
        "ncap;": "\u2A43",
        "Ncaron;": "\u0147",
        "ncaron;": "\u0148",
        "Ncedil;": "\u0145",
        "ncedil;": "\u0146",
        "ncong;": "\u2247",
        "ncongdot;": "\u2A6D\u0338",
        "ncup;": "\u2A42",
        "Ncy;": "\u041D",
        "ncy;": "\u043D",
        "ndash;": "\u2013",
        "ne;": "\u2260",
        "nearhk;": "\u2924",
        "neArr;": "\u21D7",
        "nearr;": "\u2197",
        "nearrow;": "\u2197",
        "nedot;": "\u2250\u0338",
        "NegativeMediumSpace;": "\u200B",
        "NegativeThickSpace;": "\u200B",
        "NegativeThinSpace;": "\u200B",
        "NegativeVeryThinSpace;": "\u200B",
        "nequiv;": "\u2262",
        "nesear;": "\u2928",
        "nesim;": "\u2242\u0338",
        "NestedGreaterGreater;": "\u226B",
        "NestedLessLess;": "\u226A",
        "NewLine;": "\u000A",
        "nexist;": "\u2204",
        "nexists;": "\u2204",
        "Nfr;": "\uD835\uDD11",
        "nfr;": "\uD835\uDD2B",
        "ngE;": "\u2267\u0338",
        "nge;": "\u2271",
        "ngeq;": "\u2271",
        "ngeqq;": "\u2267\u0338",
        "ngeqslant;": "\u2A7E\u0338",
        "nges;": "\u2A7E\u0338",
        "nGg;": "\u22D9\u0338",
        "ngsim;": "\u2275",
        "nGt;": "\u226B\u20D2",
        "ngt;": "\u226F",
        "ngtr;": "\u226F",
        "nGtv;": "\u226B\u0338",
        "nhArr;": "\u21CE",
        "nharr;": "\u21AE",
        "nhpar;": "\u2AF2",
        "ni;": "\u220B",
        "nis;": "\u22FC",
        "nisd;": "\u22FA",
        "niv;": "\u220B",
        "NJcy;": "\u040A",
        "njcy;": "\u045A",
        "nlArr;": "\u21CD",
        "nlarr;": "\u219A",
        "nldr;": "\u2025",
        "nlE;": "\u2266\u0338",
        "nle;": "\u2270",
        "nLeftarrow;": "\u21CD",
        "nleftarrow;": "\u219A",
        "nLeftrightarrow;": "\u21CE",
        "nleftrightarrow;": "\u21AE",
        "nleq;": "\u2270",
        "nleqq;": "\u2266\u0338",
        "nleqslant;": "\u2A7D\u0338",
        "nles;": "\u2A7D\u0338",
        "nless;": "\u226E",
        "nLl;": "\u22D8\u0338",
        "nlsim;": "\u2274",
        "nLt;": "\u226A\u20D2",
        "nlt;": "\u226E",
        "nltri;": "\u22EA",
        "nltrie;": "\u22EC",
        "nLtv;": "\u226A\u0338",
        "nmid;": "\u2224",
        "NoBreak;": "\u2060",
        "NonBreakingSpace;": "\u00A0",
        "Nopf;": "\u2115",
        "nopf;": "\uD835\uDD5F",
        "Not;": "\u2AEC",
        "not;": "\u00AC",
        "not": "\u00AC",
        "NotCongruent;": "\u2262",
        "NotCupCap;": "\u226D",
        "NotDoubleVerticalBar;": "\u2226",
        "NotElement;": "\u2209",
        "NotEqual;": "\u2260",
        "NotEqualTilde;": "\u2242\u0338",
        "NotExists;": "\u2204",
        "NotGreater;": "\u226F",
        "NotGreaterEqual;": "\u2271",
        "NotGreaterFullEqual;": "\u2267\u0338",
        "NotGreaterGreater;": "\u226B\u0338",
        "NotGreaterLess;": "\u2279",
        "NotGreaterSlantEqual;": "\u2A7E\u0338",
        "NotGreaterTilde;": "\u2275",
        "NotHumpDownHump;": "\u224E\u0338",
        "NotHumpEqual;": "\u224F\u0338",
        "notin;": "\u2209",
        "notindot;": "\u22F5\u0338",
        "notinE;": "\u22F9\u0338",
        "notinva;": "\u2209",
        "notinvb;": "\u22F7",
        "notinvc;": "\u22F6",
        "NotLeftTriangle;": "\u22EA",
        "NotLeftTriangleBar;": "\u29CF\u0338",
        "NotLeftTriangleEqual;": "\u22EC",
        "NotLess;": "\u226E",
        "NotLessEqual;": "\u2270",
        "NotLessGreater;": "\u2278",
        "NotLessLess;": "\u226A\u0338",
        "NotLessSlantEqual;": "\u2A7D\u0338",
        "NotLessTilde;": "\u2274",
        "NotNestedGreaterGreater;": "\u2AA2\u0338",
        "NotNestedLessLess;": "\u2AA1\u0338",
        "notni;": "\u220C",
        "notniva;": "\u220C",
        "notnivb;": "\u22FE",
        "notnivc;": "\u22FD",
        "NotPrecedes;": "\u2280",
        "NotPrecedesEqual;": "\u2AAF\u0338",
        "NotPrecedesSlantEqual;": "\u22E0",
        "NotReverseElement;": "\u220C",
        "NotRightTriangle;": "\u22EB",
        "NotRightTriangleBar;": "\u29D0\u0338",
        "NotRightTriangleEqual;": "\u22ED",
        "NotSquareSubset;": "\u228F\u0338",
        "NotSquareSubsetEqual;": "\u22E2",
        "NotSquareSuperset;": "\u2290\u0338",
        "NotSquareSupersetEqual;": "\u22E3",
        "NotSubset;": "\u2282\u20D2",
        "NotSubsetEqual;": "\u2288",
        "NotSucceeds;": "\u2281",
        "NotSucceedsEqual;": "\u2AB0\u0338",
        "NotSucceedsSlantEqual;": "\u22E1",
        "NotSucceedsTilde;": "\u227F\u0338",
        "NotSuperset;": "\u2283\u20D2",
        "NotSupersetEqual;": "\u2289",
        "NotTilde;": "\u2241",
        "NotTildeEqual;": "\u2244",
        "NotTildeFullEqual;": "\u2247",
        "NotTildeTilde;": "\u2249",
        "NotVerticalBar;": "\u2224",
        "npar;": "\u2226",
        "nparallel;": "\u2226",
        "nparsl;": "\u2AFD\u20E5",
        "npart;": "\u2202\u0338",
        "npolint;": "\u2A14",
        "npr;": "\u2280",
        "nprcue;": "\u22E0",
        "npre;": "\u2AAF\u0338",
        "nprec;": "\u2280",
        "npreceq;": "\u2AAF\u0338",
        "nrArr;": "\u21CF",
        "nrarr;": "\u219B",
        "nrarrc;": "\u2933\u0338",
        "nrarrw;": "\u219D\u0338",
        "nRightarrow;": "\u21CF",
        "nrightarrow;": "\u219B",
        "nrtri;": "\u22EB",
        "nrtrie;": "\u22ED",
        "nsc;": "\u2281",
        "nsccue;": "\u22E1",
        "nsce;": "\u2AB0\u0338",
        "Nscr;": "\uD835\uDCA9",
        "nscr;": "\uD835\uDCC3",
        "nshortmid;": "\u2224",
        "nshortparallel;": "\u2226",
        "nsim;": "\u2241",
        "nsime;": "\u2244",
        "nsimeq;": "\u2244",
        "nsmid;": "\u2224",
        "nspar;": "\u2226",
        "nsqsube;": "\u22E2",
        "nsqsupe;": "\u22E3",
        "nsub;": "\u2284",
        "nsubE;": "\u2AC5\u0338",
        "nsube;": "\u2288",
        "nsubset;": "\u2282\u20D2",
        "nsubseteq;": "\u2288",
        "nsubseteqq;": "\u2AC5\u0338",
        "nsucc;": "\u2281",
        "nsucceq;": "\u2AB0\u0338",
        "nsup;": "\u2285",
        "nsupE;": "\u2AC6\u0338",
        "nsupe;": "\u2289",
        "nsupset;": "\u2283\u20D2",
        "nsupseteq;": "\u2289",
        "nsupseteqq;": "\u2AC6\u0338",
        "ntgl;": "\u2279",
        "Ntilde;": "\u00D1",
        "Ntilde": "\u00D1",
        "ntilde;": "\u00F1",
        "ntilde": "\u00F1",
        "ntlg;": "\u2278",
        "ntriangleleft;": "\u22EA",
        "ntrianglelefteq;": "\u22EC",
        "ntriangleright;": "\u22EB",
        "ntrianglerighteq;": "\u22ED",
        "Nu;": "\u039D",
        "nu;": "\u03BD",
        "num;": "\u0023",
        "numero;": "\u2116",
        "numsp;": "\u2007",
        "nvap;": "\u224D\u20D2",
        "nVDash;": "\u22AF",
        "nVdash;": "\u22AE",
        "nvDash;": "\u22AD",
        "nvdash;": "\u22AC",
        "nvge;": "\u2265\u20D2",
        "nvgt;": "\u003E\u20D2",
        "nvHarr;": "\u2904",
        "nvinfin;": "\u29DE",
        "nvlArr;": "\u2902",
        "nvle;": "\u2264\u20D2",
        "nvlt;": "\u003C\u20D2",
        "nvltrie;": "\u22B4\u20D2",
        "nvrArr;": "\u2903",
        "nvrtrie;": "\u22B5\u20D2",
        "nvsim;": "\u223C\u20D2",
        "nwarhk;": "\u2923",
        "nwArr;": "\u21D6",
        "nwarr;": "\u2196",
        "nwarrow;": "\u2196",
        "nwnear;": "\u2927",
        "Oacute;": "\u00D3",
        "Oacute": "\u00D3",
        "oacute;": "\u00F3",
        "oacute": "\u00F3",
        "oast;": "\u229B",
        "ocir;": "\u229A",
        "Ocirc;": "\u00D4",
        "Ocirc": "\u00D4",
        "ocirc;": "\u00F4",
        "ocirc": "\u00F4",
        "Ocy;": "\u041E",
        "ocy;": "\u043E",
        "odash;": "\u229D",
        "Odblac;": "\u0150",
        "odblac;": "\u0151",
        "odiv;": "\u2A38",
        "odot;": "\u2299",
        "odsold;": "\u29BC",
        "OElig;": "\u0152",
        "oelig;": "\u0153",
        "ofcir;": "\u29BF",
        "Ofr;": "\uD835\uDD12",
        "ofr;": "\uD835\uDD2C",
        "ogon;": "\u02DB",
        "Ograve;": "\u00D2",
        "Ograve": "\u00D2",
        "ograve;": "\u00F2",
        "ograve": "\u00F2",
        "ogt;": "\u29C1",
        "ohbar;": "\u29B5",
        "ohm;": "\u03A9",
        "oint;": "\u222E",
        "olarr;": "\u21BA",
        "olcir;": "\u29BE",
        "olcross;": "\u29BB",
        "oline;": "\u203E",
        "olt;": "\u29C0",
        "Omacr;": "\u014C",
        "omacr;": "\u014D",
        "Omega;": "\u03A9",
        "omega;": "\u03C9",
        "Omicron;": "\u039F",
        "omicron;": "\u03BF",
        "omid;": "\u29B6",
        "ominus;": "\u2296",
        "Oopf;": "\uD835\uDD46",
        "oopf;": "\uD835\uDD60",
        "opar;": "\u29B7",
        "OpenCurlyDoubleQuote;": "\u201C",
        "OpenCurlyQuote;": "\u2018",
        "operp;": "\u29B9",
        "oplus;": "\u2295",
        "Or;": "\u2A54",
        "or;": "\u2228",
        "orarr;": "\u21BB",
        "ord;": "\u2A5D",
        "order;": "\u2134",
        "orderof;": "\u2134",
        "ordf;": "\u00AA",
        "ordf": "\u00AA",
        "ordm;": "\u00BA",
        "ordm": "\u00BA",
        "origof;": "\u22B6",
        "oror;": "\u2A56",
        "orslope;": "\u2A57",
        "orv;": "\u2A5B",
        "oS;": "\u24C8",
        "Oscr;": "\uD835\uDCAA",
        "oscr;": "\u2134",
        "Oslash;": "\u00D8",
        "Oslash": "\u00D8",
        "oslash;": "\u00F8",
        "oslash": "\u00F8",
        "osol;": "\u2298",
        "Otilde;": "\u00D5",
        "Otilde": "\u00D5",
        "otilde;": "\u00F5",
        "otilde": "\u00F5",
        "Otimes;": "\u2A37",
        "otimes;": "\u2297",
        "otimesas;": "\u2A36",
        "Ouml;": "\u00D6",
        "Ouml": "\u00D6",
        "ouml;": "\u00F6",
        "ouml": "\u00F6",
        "ovbar;": "\u233D",
        "OverBar;": "\u203E",
        "OverBrace;": "\u23DE",
        "OverBracket;": "\u23B4",
        "OverParenthesis;": "\u23DC",
        "par;": "\u2225",
        "para;": "\u00B6",
        "para": "\u00B6",
        "parallel;": "\u2225",
        "parsim;": "\u2AF3",
        "parsl;": "\u2AFD",
        "part;": "\u2202",
        "PartialD;": "\u2202",
        "Pcy;": "\u041F",
        "pcy;": "\u043F",
        "percnt;": "\u0025",
        "period;": "\u002E",
        "permil;": "\u2030",
        "perp;": "\u22A5",
        "pertenk;": "\u2031",
        "Pfr;": "\uD835\uDD13",
        "pfr;": "\uD835\uDD2D",
        "Phi;": "\u03A6",
        "phi;": "\u03C6",
        "phiv;": "\u03D5",
        "phmmat;": "\u2133",
        "phone;": "\u260E",
        "Pi;": "\u03A0",
        "pi;": "\u03C0",
        "pitchfork;": "\u22D4",
        "piv;": "\u03D6",
        "planck;": "\u210F",
        "planckh;": "\u210E",
        "plankv;": "\u210F",
        "plus;": "\u002B",
        "plusacir;": "\u2A23",
        "plusb;": "\u229E",
        "pluscir;": "\u2A22",
        "plusdo;": "\u2214",
        "plusdu;": "\u2A25",
        "pluse;": "\u2A72",
        "PlusMinus;": "\u00B1",
        "plusmn;": "\u00B1",
        "plusmn": "\u00B1",
        "plussim;": "\u2A26",
        "plustwo;": "\u2A27",
        "pm;": "\u00B1",
        "Poincareplane;": "\u210C",
        "pointint;": "\u2A15",
        "Popf;": "\u2119",
        "popf;": "\uD835\uDD61",
        "pound;": "\u00A3",
        "pound": "\u00A3",
        "Pr;": "\u2ABB",
        "pr;": "\u227A",
        "prap;": "\u2AB7",
        "prcue;": "\u227C",
        "prE;": "\u2AB3",
        "pre;": "\u2AAF",
        "prec;": "\u227A",
        "precapprox;": "\u2AB7",
        "preccurlyeq;": "\u227C",
        "Precedes;": "\u227A",
        "PrecedesEqual;": "\u2AAF",
        "PrecedesSlantEqual;": "\u227C",
        "PrecedesTilde;": "\u227E",
        "preceq;": "\u2AAF",
        "precnapprox;": "\u2AB9",
        "precneqq;": "\u2AB5",
        "precnsim;": "\u22E8",
        "precsim;": "\u227E",
        "Prime;": "\u2033",
        "prime;": "\u2032",
        "primes;": "\u2119",
        "prnap;": "\u2AB9",
        "prnE;": "\u2AB5",
        "prnsim;": "\u22E8",
        "prod;": "\u220F",
        "Product;": "\u220F",
        "profalar;": "\u232E",
        "profline;": "\u2312",
        "profsurf;": "\u2313",
        "prop;": "\u221D",
        "Proportion;": "\u2237",
        "Proportional;": "\u221D",
        "propto;": "\u221D",
        "prsim;": "\u227E",
        "prurel;": "\u22B0",
        "Pscr;": "\uD835\uDCAB",
        "pscr;": "\uD835\uDCC5",
        "Psi;": "\u03A8",
        "psi;": "\u03C8",
        "puncsp;": "\u2008",
        "Qfr;": "\uD835\uDD14",
        "qfr;": "\uD835\uDD2E",
        "qint;": "\u2A0C",
        "Qopf;": "\u211A",
        "qopf;": "\uD835\uDD62",
        "qprime;": "\u2057",
        "Qscr;": "\uD835\uDCAC",
        "qscr;": "\uD835\uDCC6",
        "quaternions;": "\u210D",
        "quatint;": "\u2A16",
        "quest;": "\u003F",
        "questeq;": "\u225F",
        "QUOT;": "\u0022",
        "QUOT": "\u0022",
        "quot;": "\u0022",
        "quot": "\u0022",
        "rAarr;": "\u21DB",
        "race;": "\u223D\u0331",
        "Racute;": "\u0154",
        "racute;": "\u0155",
        "radic;": "\u221A",
        "raemptyv;": "\u29B3",
        "Rang;": "\u27EB",
        "rang;": "\u27E9",
        "rangd;": "\u2992",
        "range;": "\u29A5",
        "rangle;": "\u27E9",
        "raquo;": "\u00BB",
        "raquo": "\u00BB",
        "Rarr;": "\u21A0",
        "rArr;": "\u21D2",
        "rarr;": "\u2192",
        "rarrap;": "\u2975",
        "rarrb;": "\u21E5",
        "rarrbfs;": "\u2920",
        "rarrc;": "\u2933",
        "rarrfs;": "\u291E",
        "rarrhk;": "\u21AA",
        "rarrlp;": "\u21AC",
        "rarrpl;": "\u2945",
        "rarrsim;": "\u2974",
        "Rarrtl;": "\u2916",
        "rarrtl;": "\u21A3",
        "rarrw;": "\u219D",
        "rAtail;": "\u291C",
        "ratail;": "\u291A",
        "ratio;": "\u2236",
        "rationals;": "\u211A",
        "RBarr;": "\u2910",
        "rBarr;": "\u290F",
        "rbarr;": "\u290D",
        "rbbrk;": "\u2773",
        "rbrace;": "\u007D",
        "rbrack;": "\u005D",
        "rbrke;": "\u298C",
        "rbrksld;": "\u298E",
        "rbrkslu;": "\u2990",
        "Rcaron;": "\u0158",
        "rcaron;": "\u0159",
        "Rcedil;": "\u0156",
        "rcedil;": "\u0157",
        "rceil;": "\u2309",
        "rcub;": "\u007D",
        "Rcy;": "\u0420",
        "rcy;": "\u0440",
        "rdca;": "\u2937",
        "rdldhar;": "\u2969",
        "rdquo;": "\u201D",
        "rdquor;": "\u201D",
        "rdsh;": "\u21B3",
        "Re;": "\u211C",
        "real;": "\u211C",
        "realine;": "\u211B",
        "realpart;": "\u211C",
        "reals;": "\u211D",
        "rect;": "\u25AD",
        "REG;": "\u00AE",
        "REG": "\u00AE",
        "reg;": "\u00AE",
        "reg": "\u00AE",
        "ReverseElement;": "\u220B",
        "ReverseEquilibrium;": "\u21CB",
        "ReverseUpEquilibrium;": "\u296F",
        "rfisht;": "\u297D",
        "rfloor;": "\u230B",
        "Rfr;": "\u211C",
        "rfr;": "\uD835\uDD2F",
        "rHar;": "\u2964",
        "rhard;": "\u21C1",
        "rharu;": "\u21C0",
        "rharul;": "\u296C",
        "Rho;": "\u03A1",
        "rho;": "\u03C1",
        "rhov;": "\u03F1",
        "RightAngleBracket;": "\u27E9",
        "RightArrow;": "\u2192",
        "Rightarrow;": "\u21D2",
        "rightarrow;": "\u2192",
        "RightArrowBar;": "\u21E5",
        "RightArrowLeftArrow;": "\u21C4",
        "rightarrowtail;": "\u21A3",
        "RightCeiling;": "\u2309",
        "RightDoubleBracket;": "\u27E7",
        "RightDownTeeVector;": "\u295D",
        "RightDownVector;": "\u21C2",
        "RightDownVectorBar;": "\u2955",
        "RightFloor;": "\u230B",
        "rightharpoondown;": "\u21C1",
        "rightharpoonup;": "\u21C0",
        "rightleftarrows;": "\u21C4",
        "rightleftharpoons;": "\u21CC",
        "rightrightarrows;": "\u21C9",
        "rightsquigarrow;": "\u219D",
        "RightTee;": "\u22A2",
        "RightTeeArrow;": "\u21A6",
        "RightTeeVector;": "\u295B",
        "rightthreetimes;": "\u22CC",
        "RightTriangle;": "\u22B3",
        "RightTriangleBar;": "\u29D0",
        "RightTriangleEqual;": "\u22B5",
        "RightUpDownVector;": "\u294F",
        "RightUpTeeVector;": "\u295C",
        "RightUpVector;": "\u21BE",
        "RightUpVectorBar;": "\u2954",
        "RightVector;": "\u21C0",
        "RightVectorBar;": "\u2953",
        "ring;": "\u02DA",
        "risingdotseq;": "\u2253",
        "rlarr;": "\u21C4",
        "rlhar;": "\u21CC",
        "rlm;": "\u200F",
        "rmoust;": "\u23B1",
        "rmoustache;": "\u23B1",
        "rnmid;": "\u2AEE",
        "roang;": "\u27ED",
        "roarr;": "\u21FE",
        "robrk;": "\u27E7",
        "ropar;": "\u2986",
        "Ropf;": "\u211D",
        "ropf;": "\uD835\uDD63",
        "roplus;": "\u2A2E",
        "rotimes;": "\u2A35",
        "RoundImplies;": "\u2970",
        "rpar;": "\u0029",
        "rpargt;": "\u2994",
        "rppolint;": "\u2A12",
        "rrarr;": "\u21C9",
        "Rrightarrow;": "\u21DB",
        "rsaquo;": "\u203A",
        "Rscr;": "\u211B",
        "rscr;": "\uD835\uDCC7",
        "Rsh;": "\u21B1",
        "rsh;": "\u21B1",
        "rsqb;": "\u005D",
        "rsquo;": "\u2019",
        "rsquor;": "\u2019",
        "rthree;": "\u22CC",
        "rtimes;": "\u22CA",
        "rtri;": "\u25B9",
        "rtrie;": "\u22B5",
        "rtrif;": "\u25B8",
        "rtriltri;": "\u29CE",
        "RuleDelayed;": "\u29F4",
        "ruluhar;": "\u2968",
        "rx;": "\u211E",
        "Sacute;": "\u015A",
        "sacute;": "\u015B",
        "sbquo;": "\u201A",
        "Sc;": "\u2ABC",
        "sc;": "\u227B",
        "scap;": "\u2AB8",
        "Scaron;": "\u0160",
        "scaron;": "\u0161",
        "sccue;": "\u227D",
        "scE;": "\u2AB4",
        "sce;": "\u2AB0",
        "Scedil;": "\u015E",
        "scedil;": "\u015F",
        "Scirc;": "\u015C",
        "scirc;": "\u015D",
        "scnap;": "\u2ABA",
        "scnE;": "\u2AB6",
        "scnsim;": "\u22E9",
        "scpolint;": "\u2A13",
        "scsim;": "\u227F",
        "Scy;": "\u0421",
        "scy;": "\u0441",
        "sdot;": "\u22C5",
        "sdotb;": "\u22A1",
        "sdote;": "\u2A66",
        "searhk;": "\u2925",
        "seArr;": "\u21D8",
        "searr;": "\u2198",
        "searrow;": "\u2198",
        "sect;": "\u00A7",
        "sect": "\u00A7",
        "semi;": "\u003B",
        "seswar;": "\u2929",
        "setminus;": "\u2216",
        "setmn;": "\u2216",
        "sext;": "\u2736",
        "Sfr;": "\uD835\uDD16",
        "sfr;": "\uD835\uDD30",
        "sfrown;": "\u2322",
        "sharp;": "\u266F",
        "SHCHcy;": "\u0429",
        "shchcy;": "\u0449",
        "SHcy;": "\u0428",
        "shcy;": "\u0448",
        "ShortDownArrow;": "\u2193",
        "ShortLeftArrow;": "\u2190",
        "shortmid;": "\u2223",
        "shortparallel;": "\u2225",
        "ShortRightArrow;": "\u2192",
        "ShortUpArrow;": "\u2191",
        "shy;": "\u00AD",
        "shy": "\u00AD",
        "Sigma;": "\u03A3",
        "sigma;": "\u03C3",
        "sigmaf;": "\u03C2",
        "sigmav;": "\u03C2",
        "sim;": "\u223C",
        "simdot;": "\u2A6A",
        "sime;": "\u2243",
        "simeq;": "\u2243",
        "simg;": "\u2A9E",
        "simgE;": "\u2AA0",
        "siml;": "\u2A9D",
        "simlE;": "\u2A9F",
        "simne;": "\u2246",
        "simplus;": "\u2A24",
        "simrarr;": "\u2972",
        "slarr;": "\u2190",
        "SmallCircle;": "\u2218",
        "smallsetminus;": "\u2216",
        "smashp;": "\u2A33",
        "smeparsl;": "\u29E4",
        "smid;": "\u2223",
        "smile;": "\u2323",
        "smt;": "\u2AAA",
        "smte;": "\u2AAC",
        "smtes;": "\u2AAC\uFE00",
        "SOFTcy;": "\u042C",
        "softcy;": "\u044C",
        "sol;": "\u002F",
        "solb;": "\u29C4",
        "solbar;": "\u233F",
        "Sopf;": "\uD835\uDD4A",
        "sopf;": "\uD835\uDD64",
        "spades;": "\u2660",
        "spadesuit;": "\u2660",
        "spar;": "\u2225",
        "sqcap;": "\u2293",
        "sqcaps;": "\u2293\uFE00",
        "sqcup;": "\u2294",
        "sqcups;": "\u2294\uFE00",
        "Sqrt;": "\u221A",
        "sqsub;": "\u228F",
        "sqsube;": "\u2291",
        "sqsubset;": "\u228F",
        "sqsubseteq;": "\u2291",
        "sqsup;": "\u2290",
        "sqsupe;": "\u2292",
        "sqsupset;": "\u2290",
        "sqsupseteq;": "\u2292",
        "squ;": "\u25A1",
        "Square;": "\u25A1",
        "square;": "\u25A1",
        "SquareIntersection;": "\u2293",
        "SquareSubset;": "\u228F",
        "SquareSubsetEqual;": "\u2291",
        "SquareSuperset;": "\u2290",
        "SquareSupersetEqual;": "\u2292",
        "SquareUnion;": "\u2294",
        "squarf;": "\u25AA",
        "squf;": "\u25AA",
        "srarr;": "\u2192",
        "Sscr;": "\uD835\uDCAE",
        "sscr;": "\uD835\uDCC8",
        "ssetmn;": "\u2216",
        "ssmile;": "\u2323",
        "sstarf;": "\u22C6",
        "Star;": "\u22C6",
        "star;": "\u2606",
        "starf;": "\u2605",
        "straightepsilon;": "\u03F5",
        "straightphi;": "\u03D5",
        "strns;": "\u00AF",
        "Sub;": "\u22D0",
        "sub;": "\u2282",
        "subdot;": "\u2ABD",
        "subE;": "\u2AC5",
        "sube;": "\u2286",
        "subedot;": "\u2AC3",
        "submult;": "\u2AC1",
        "subnE;": "\u2ACB",
        "subne;": "\u228A",
        "subplus;": "\u2ABF",
        "subrarr;": "\u2979",
        "Subset;": "\u22D0",
        "subset;": "\u2282",
        "subseteq;": "\u2286",
        "subseteqq;": "\u2AC5",
        "SubsetEqual;": "\u2286",
        "subsetneq;": "\u228A",
        "subsetneqq;": "\u2ACB",
        "subsim;": "\u2AC7",
        "subsub;": "\u2AD5",
        "subsup;": "\u2AD3",
        "succ;": "\u227B",
        "succapprox;": "\u2AB8",
        "succcurlyeq;": "\u227D",
        "Succeeds;": "\u227B",
        "SucceedsEqual;": "\u2AB0",
        "SucceedsSlantEqual;": "\u227D",
        "SucceedsTilde;": "\u227F",
        "succeq;": "\u2AB0",
        "succnapprox;": "\u2ABA",
        "succneqq;": "\u2AB6",
        "succnsim;": "\u22E9",
        "succsim;": "\u227F",
        "SuchThat;": "\u220B",
        "Sum;": "\u2211",
        "sum;": "\u2211",
        "sung;": "\u266A",
        "Sup;": "\u22D1",
        "sup;": "\u2283",
        "sup1;": "\u00B9",
        "sup1": "\u00B9",
        "sup2;": "\u00B2",
        "sup2": "\u00B2",
        "sup3;": "\u00B3",
        "sup3": "\u00B3",
        "supdot;": "\u2ABE",
        "supdsub;": "\u2AD8",
        "supE;": "\u2AC6",
        "supe;": "\u2287",
        "supedot;": "\u2AC4",
        "Superset;": "\u2283",
        "SupersetEqual;": "\u2287",
        "suphsol;": "\u27C9",
        "suphsub;": "\u2AD7",
        "suplarr;": "\u297B",
        "supmult;": "\u2AC2",
        "supnE;": "\u2ACC",
        "supne;": "\u228B",
        "supplus;": "\u2AC0",
        "Supset;": "\u22D1",
        "supset;": "\u2283",
        "supseteq;": "\u2287",
        "supseteqq;": "\u2AC6",
        "supsetneq;": "\u228B",
        "supsetneqq;": "\u2ACC",
        "supsim;": "\u2AC8",
        "supsub;": "\u2AD4",
        "supsup;": "\u2AD6",
        "swarhk;": "\u2926",
        "swArr;": "\u21D9",
        "swarr;": "\u2199",
        "swarrow;": "\u2199",
        "swnwar;": "\u292A",
        "szlig;": "\u00DF",
        "szlig": "\u00DF",
        "Tab;": "\u0009",
        "target;": "\u2316",
        "Tau;": "\u03A4",
        "tau;": "\u03C4",
        "tbrk;": "\u23B4",
        "Tcaron;": "\u0164",
        "tcaron;": "\u0165",
        "Tcedil;": "\u0162",
        "tcedil;": "\u0163",
        "Tcy;": "\u0422",
        "tcy;": "\u0442",
        "tdot;": "\u20DB",
        "telrec;": "\u2315",
        "Tfr;": "\uD835\uDD17",
        "tfr;": "\uD835\uDD31",
        "there4;": "\u2234",
        "Therefore;": "\u2234",
        "therefore;": "\u2234",
        "Theta;": "\u0398",
        "theta;": "\u03B8",
        "thetasym;": "\u03D1",
        "thetav;": "\u03D1",
        "thickapprox;": "\u2248",
        "thicksim;": "\u223C",
        "ThickSpace;": "\u205F\u200A",
        "thinsp;": "\u2009",
        "ThinSpace;": "\u2009",
        "thkap;": "\u2248",
        "thksim;": "\u223C",
        "THORN;": "\u00DE",
        "THORN": "\u00DE",
        "thorn;": "\u00FE",
        "thorn": "\u00FE",
        "Tilde;": "\u223C",
        "tilde;": "\u02DC",
        "TildeEqual;": "\u2243",
        "TildeFullEqual;": "\u2245",
        "TildeTilde;": "\u2248",
        "times;": "\u00D7",
        "times": "\u00D7",
        "timesb;": "\u22A0",
        "timesbar;": "\u2A31",
        "timesd;": "\u2A30",
        "tint;": "\u222D",
        "toea;": "\u2928",
        "top;": "\u22A4",
        "topbot;": "\u2336",
        "topcir;": "\u2AF1",
        "Topf;": "\uD835\uDD4B",
        "topf;": "\uD835\uDD65",
        "topfork;": "\u2ADA",
        "tosa;": "\u2929",
        "tprime;": "\u2034",
        "TRADE;": "\u2122",
        "trade;": "\u2122",
        "triangle;": "\u25B5",
        "triangledown;": "\u25BF",
        "triangleleft;": "\u25C3",
        "trianglelefteq;": "\u22B4",
        "triangleq;": "\u225C",
        "triangleright;": "\u25B9",
        "trianglerighteq;": "\u22B5",
        "tridot;": "\u25EC",
        "trie;": "\u225C",
        "triminus;": "\u2A3A",
        "TripleDot;": "\u20DB",
        "triplus;": "\u2A39",
        "trisb;": "\u29CD",
        "tritime;": "\u2A3B",
        "trpezium;": "\u23E2",
        "Tscr;": "\uD835\uDCAF",
        "tscr;": "\uD835\uDCC9",
        "TScy;": "\u0426",
        "tscy;": "\u0446",
        "TSHcy;": "\u040B",
        "tshcy;": "\u045B",
        "Tstrok;": "\u0166",
        "tstrok;": "\u0167",
        "twixt;": "\u226C",
        "twoheadleftarrow;": "\u219E",
        "twoheadrightarrow;": "\u21A0",
        "Uacute;": "\u00DA",
        "Uacute": "\u00DA",
        "uacute;": "\u00FA",
        "uacute": "\u00FA",
        "Uarr;": "\u219F",
        "uArr;": "\u21D1",
        "uarr;": "\u2191",
        "Uarrocir;": "\u2949",
        "Ubrcy;": "\u040E",
        "ubrcy;": "\u045E",
        "Ubreve;": "\u016C",
        "ubreve;": "\u016D",
        "Ucirc;": "\u00DB",
        "Ucirc": "\u00DB",
        "ucirc;": "\u00FB",
        "ucirc": "\u00FB",
        "Ucy;": "\u0423",
        "ucy;": "\u0443",
        "udarr;": "\u21C5",
        "Udblac;": "\u0170",
        "udblac;": "\u0171",
        "udhar;": "\u296E",
        "ufisht;": "\u297E",
        "Ufr;": "\uD835\uDD18",
        "ufr;": "\uD835\uDD32",
        "Ugrave;": "\u00D9",
        "Ugrave": "\u00D9",
        "ugrave;": "\u00F9",
        "ugrave": "\u00F9",
        "uHar;": "\u2963",
        "uharl;": "\u21BF",
        "uharr;": "\u21BE",
        "uhblk;": "\u2580",
        "ulcorn;": "\u231C",
        "ulcorner;": "\u231C",
        "ulcrop;": "\u230F",
        "ultri;": "\u25F8",
        "Umacr;": "\u016A",
        "umacr;": "\u016B",
        "uml;": "\u00A8",
        "uml": "\u00A8",
        "UnderBar;": "\u005F",
        "UnderBrace;": "\u23DF",
        "UnderBracket;": "\u23B5",
        "UnderParenthesis;": "\u23DD",
        "Union;": "\u22C3",
        "UnionPlus;": "\u228E",
        "Uogon;": "\u0172",
        "uogon;": "\u0173",
        "Uopf;": "\uD835\uDD4C",
        "uopf;": "\uD835\uDD66",
        "UpArrow;": "\u2191",
        "Uparrow;": "\u21D1",
        "uparrow;": "\u2191",
        "UpArrowBar;": "\u2912",
        "UpArrowDownArrow;": "\u21C5",
        "UpDownArrow;": "\u2195",
        "Updownarrow;": "\u21D5",
        "updownarrow;": "\u2195",
        "UpEquilibrium;": "\u296E",
        "upharpoonleft;": "\u21BF",
        "upharpoonright;": "\u21BE",
        "uplus;": "\u228E",
        "UpperLeftArrow;": "\u2196",
        "UpperRightArrow;": "\u2197",
        "Upsi;": "\u03D2",
        "upsi;": "\u03C5",
        "upsih;": "\u03D2",
        "Upsilon;": "\u03A5",
        "upsilon;": "\u03C5",
        "UpTee;": "\u22A5",
        "UpTeeArrow;": "\u21A5",
        "upuparrows;": "\u21C8",
        "urcorn;": "\u231D",
        "urcorner;": "\u231D",
        "urcrop;": "\u230E",
        "Uring;": "\u016E",
        "uring;": "\u016F",
        "urtri;": "\u25F9",
        "Uscr;": "\uD835\uDCB0",
        "uscr;": "\uD835\uDCCA",
        "utdot;": "\u22F0",
        "Utilde;": "\u0168",
        "utilde;": "\u0169",
        "utri;": "\u25B5",
        "utrif;": "\u25B4",
        "uuarr;": "\u21C8",
        "Uuml;": "\u00DC",
        "Uuml": "\u00DC",
        "uuml;": "\u00FC",
        "uuml": "\u00FC",
        "uwangle;": "\u29A7",
        "vangrt;": "\u299C",
        "varepsilon;": "\u03F5",
        "varkappa;": "\u03F0",
        "varnothing;": "\u2205",
        "varphi;": "\u03D5",
        "varpi;": "\u03D6",
        "varpropto;": "\u221D",
        "vArr;": "\u21D5",
        "varr;": "\u2195",
        "varrho;": "\u03F1",
        "varsigma;": "\u03C2",
        "varsubsetneq;": "\u228A\uFE00",
        "varsubsetneqq;": "\u2ACB\uFE00",
        "varsupsetneq;": "\u228B\uFE00",
        "varsupsetneqq;": "\u2ACC\uFE00",
        "vartheta;": "\u03D1",
        "vartriangleleft;": "\u22B2",
        "vartriangleright;": "\u22B3",
        "Vbar;": "\u2AEB",
        "vBar;": "\u2AE8",
        "vBarv;": "\u2AE9",
        "Vcy;": "\u0412",
        "vcy;": "\u0432",
        "VDash;": "\u22AB",
        "Vdash;": "\u22A9",
        "vDash;": "\u22A8",
        "vdash;": "\u22A2",
        "Vdashl;": "\u2AE6",
        "Vee;": "\u22C1",
        "vee;": "\u2228",
        "veebar;": "\u22BB",
        "veeeq;": "\u225A",
        "vellip;": "\u22EE",
        "Verbar;": "\u2016",
        "verbar;": "\u007C",
        "Vert;": "\u2016",
        "vert;": "\u007C",
        "VerticalBar;": "\u2223",
        "VerticalLine;": "\u007C",
        "VerticalSeparator;": "\u2758",
        "VerticalTilde;": "\u2240",
        "VeryThinSpace;": "\u200A",
        "Vfr;": "\uD835\uDD19",
        "vfr;": "\uD835\uDD33",
        "vltri;": "\u22B2",
        "vnsub;": "\u2282\u20D2",
        "vnsup;": "\u2283\u20D2",
        "Vopf;": "\uD835\uDD4D",
        "vopf;": "\uD835\uDD67",
        "vprop;": "\u221D",
        "vrtri;": "\u22B3",
        "Vscr;": "\uD835\uDCB1",
        "vscr;": "\uD835\uDCCB",
        "vsubnE;": "\u2ACB\uFE00",
        "vsubne;": "\u228A\uFE00",
        "vsupnE;": "\u2ACC\uFE00",
        "vsupne;": "\u228B\uFE00",
        "Vvdash;": "\u22AA",
        "vzigzag;": "\u299A",
        "Wcirc;": "\u0174",
        "wcirc;": "\u0175",
        "wedbar;": "\u2A5F",
        "Wedge;": "\u22C0",
        "wedge;": "\u2227",
        "wedgeq;": "\u2259",
        "weierp;": "\u2118",
        "Wfr;": "\uD835\uDD1A",
        "wfr;": "\uD835\uDD34",
        "Wopf;": "\uD835\uDD4E",
        "wopf;": "\uD835\uDD68",
        "wp;": "\u2118",
        "wr;": "\u2240",
        "wreath;": "\u2240",
        "Wscr;": "\uD835\uDCB2",
        "wscr;": "\uD835\uDCCC",
        "xcap;": "\u22C2",
        "xcirc;": "\u25EF",
        "xcup;": "\u22C3",
        "xdtri;": "\u25BD",
        "Xfr;": "\uD835\uDD1B",
        "xfr;": "\uD835\uDD35",
        "xhArr;": "\u27FA",
        "xharr;": "\u27F7",
        "Xi;": "\u039E",
        "xi;": "\u03BE",
        "xlArr;": "\u27F8",
        "xlarr;": "\u27F5",
        "xmap;": "\u27FC",
        "xnis;": "\u22FB",
        "xodot;": "\u2A00",
        "Xopf;": "\uD835\uDD4F",
        "xopf;": "\uD835\uDD69",
        "xoplus;": "\u2A01",
        "xotime;": "\u2A02",
        "xrArr;": "\u27F9",
        "xrarr;": "\u27F6",
        "Xscr;": "\uD835\uDCB3",
        "xscr;": "\uD835\uDCCD",
        "xsqcup;": "\u2A06",
        "xuplus;": "\u2A04",
        "xutri;": "\u25B3",
        "xvee;": "\u22C1",
        "xwedge;": "\u22C0",
        "Yacute;": "\u00DD",
        "Yacute": "\u00DD",
        "yacute;": "\u00FD",
        "yacute": "\u00FD",
        "YAcy;": "\u042F",
        "yacy;": "\u044F",
        "Ycirc;": "\u0176",
        "ycirc;": "\u0177",
        "Ycy;": "\u042B",
        "ycy;": "\u044B",
        "yen;": "\u00A5",
        "yen": "\u00A5",
        "Yfr;": "\uD835\uDD1C",
        "yfr;": "\uD835\uDD36",
        "YIcy;": "\u0407",
        "yicy;": "\u0457",
        "Yopf;": "\uD835\uDD50",
        "yopf;": "\uD835\uDD6A",
        "Yscr;": "\uD835\uDCB4",
        "yscr;": "\uD835\uDCCE",
        "YUcy;": "\u042E",
        "yucy;": "\u044E",
        "Yuml;": "\u0178",
        "yuml;": "\u00FF",
        "yuml": "\u00FF",
        "Zacute;": "\u0179",
        "zacute;": "\u017A",
        "Zcaron;": "\u017D",
        "zcaron;": "\u017E",
        "Zcy;": "\u0417",
        "zcy;": "\u0437",
        "Zdot;": "\u017B",
        "zdot;": "\u017C",
        "zeetrf;": "\u2128",
        "ZeroWidthSpace;": "\u200B",
        "Zeta;": "\u0396",
        "zeta;": "\u03B6",
        "Zfr;": "\u2128",
        "zfr;": "\uD835\uDD37",
        "ZHcy;": "\u0416",
        "zhcy;": "\u0436",
        "zigrarr;": "\u21DD",
        "Zopf;": "\u2124",
        "zopf;": "\uD835\uDD6B",
        "Zscr;": "\uD835\uDCB5",
        "zscr;": "\uD835\uDCCF",
        "zwj;": "\u200D",
        "zwnj;": "\u200C"
    };
});
//# sourceMappingURL=htmlEntities.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/services/htmlCompletion',["require", "exports", "vscode-languageserver-types", "../parser/htmlScanner", "../parser/htmlTags", "./tagProviders", "../parser/htmlEntities", "vscode-nls", "../utils/strings"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    var htmlScanner_1 = require("../parser/htmlScanner");
    var htmlTags_1 = require("../parser/htmlTags");
    var tagProviders_1 = require("./tagProviders");
    var htmlEntities_1 = require("../parser/htmlEntities");
    var nls = require("vscode-nls");
    var strings_1 = require("../utils/strings");
    var localize = nls.loadMessageBundle();
    var HTMLCompletion = /** @class */ (function () {
        function HTMLCompletion() {
            this.completionParticipants = [];
        }
        HTMLCompletion.prototype.setCompletionParticipants = function (registeredCompletionParticipants) {
            this.completionParticipants = registeredCompletionParticipants || [];
        };
        HTMLCompletion.prototype.doComplete = function (document, position, htmlDocument, settings) {
            var result = {
                isIncomplete: false,
                items: []
            };
            var completionParticipants = this.completionParticipants;
            var tagProviders = tagProviders_1.allTagProviders.filter(function (p) { return p.isApplicable(document.languageId) && (!settings || settings[p.getId()] !== false); });
            var text = document.getText();
            var offset = document.offsetAt(position);
            var node = htmlDocument.findNodeBefore(offset);
            if (!node) {
                return result;
            }
            var scanner = htmlScanner_1.createScanner(text, node.start);
            var currentTag = '';
            var currentAttributeName;
            function getReplaceRange(replaceStart, replaceEnd) {
                if (replaceEnd === void 0) { replaceEnd = offset; }
                if (replaceStart > offset) {
                    replaceStart = offset;
                }
                return { start: document.positionAt(replaceStart), end: document.positionAt(replaceEnd) };
            }
            function collectOpenTagSuggestions(afterOpenBracket, tagNameEnd) {
                var range = getReplaceRange(afterOpenBracket, tagNameEnd);
                tagProviders.forEach(function (provider) {
                    provider.collectTags(function (tag, label) {
                        result.items.push({
                            label: tag,
                            kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                            documentation: label,
                            textEdit: vscode_languageserver_types_1.TextEdit.replace(range, tag),
                            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                        });
                    });
                });
                return result;
            }
            function getLineIndent(offset) {
                var start = offset;
                while (start > 0) {
                    var ch = text.charAt(start - 1);
                    if ("\n\r".indexOf(ch) >= 0) {
                        return text.substring(start, offset);
                    }
                    if (!isWhiteSpace(ch)) {
                        return null;
                    }
                    start--;
                }
                return text.substring(0, offset);
            }
            function collectCloseTagSuggestions(afterOpenBracket, inOpenTag, tagNameEnd) {
                if (tagNameEnd === void 0) { tagNameEnd = offset; }
                var range = getReplaceRange(afterOpenBracket, tagNameEnd);
                var closeTag = isFollowedBy(text, tagNameEnd, htmlScanner_1.ScannerState.WithinEndTag, htmlScanner_1.TokenType.EndTagClose) ? '' : '>';
                var curr = node;
                if (inOpenTag) {
                    curr = curr.parent; // don't suggest the own tag, it's not yet open
                }
                while (curr) {
                    var tag = curr.tag;
                    if (tag && (!curr.closed || curr.endTagStart && (curr.endTagStart > offset))) {
                        var item = {
                            label: '/' + tag,
                            kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                            filterText: '/' + tag + closeTag,
                            textEdit: vscode_languageserver_types_1.TextEdit.replace(range, '/' + tag + closeTag),
                            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                        };
                        var startIndent = getLineIndent(curr.start);
                        var endIndent = getLineIndent(afterOpenBracket - 1);
                        if (startIndent !== null && endIndent !== null && startIndent !== endIndent) {
                            var insertText = startIndent + '</' + tag + closeTag;
                            item.textEdit = vscode_languageserver_types_1.TextEdit.replace(getReplaceRange(afterOpenBracket - 1 - endIndent.length), insertText);
                            item.filterText = endIndent + '</' + tag + closeTag;
                        }
                        result.items.push(item);
                        return result;
                    }
                    curr = curr.parent;
                }
                if (inOpenTag) {
                    return result;
                }
                tagProviders.forEach(function (provider) {
                    provider.collectTags(function (tag, label) {
                        result.items.push({
                            label: '/' + tag,
                            kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                            documentation: label,
                            filterText: '/' + tag + closeTag,
                            textEdit: vscode_languageserver_types_1.TextEdit.replace(range, '/' + tag + closeTag),
                            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                        });
                    });
                });
                return result;
            }
            function collectAutoCloseTagSuggestion(tagCloseEnd, tag) {
                if (settings && settings.hideAutoCompleteProposals) {
                    return result;
                }
                if (!htmlTags_1.isEmptyElement(tag)) {
                    var pos = document.positionAt(tagCloseEnd);
                    result.items.push({
                        label: '</' + tag + '>',
                        kind: vscode_languageserver_types_1.CompletionItemKind.Property,
                        filterText: '</' + tag + '>',
                        textEdit: vscode_languageserver_types_1.TextEdit.insert(pos, '$0</' + tag + '>'),
                        insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet
                    });
                }
                return result;
            }
            function collectTagSuggestions(tagStart, tagEnd) {
                collectOpenTagSuggestions(tagStart, tagEnd);
                collectCloseTagSuggestions(tagStart, true, tagEnd);
                return result;
            }
            function collectAttributeNameSuggestions(nameStart, nameEnd) {
                if (nameEnd === void 0) { nameEnd = offset; }
                var replaceEnd = offset;
                while (replaceEnd < nameEnd && text[replaceEnd] !== '<') {
                    replaceEnd++;
                }
                var range = getReplaceRange(nameStart, replaceEnd);
                var value = isFollowedBy(text, nameEnd, htmlScanner_1.ScannerState.AfterAttributeName, htmlScanner_1.TokenType.DelimiterAssign) ? '' : '="$1"';
                var tag = currentTag.toLowerCase();
                var seenAttributes = Object.create(null);
                tagProviders.forEach(function (provider) {
                    provider.collectAttributes(tag, function (attribute, type) {
                        if (seenAttributes[attribute]) {
                            return;
                        }
                        seenAttributes[attribute] = true;
                        var codeSnippet = attribute;
                        var command;
                        if (type !== 'v' && value.length) {
                            codeSnippet = codeSnippet + value;
                            if (type) {
                                command = {
                                    title: 'Suggest',
                                    command: 'editor.action.triggerSuggest'
                                };
                            }
                        }
                        result.items.push({
                            label: attribute,
                            kind: type === 'handler' ? vscode_languageserver_types_1.CompletionItemKind.Function : vscode_languageserver_types_1.CompletionItemKind.Value,
                            textEdit: vscode_languageserver_types_1.TextEdit.replace(range, codeSnippet),
                            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
                            command: command
                        });
                    });
                });
                collectDataAttributesSuggestions(range, seenAttributes);
                return result;
            }
            function collectDataAttributesSuggestions(range, seenAttributes) {
                var dataAttr = 'data-';
                var dataAttributes = {};
                dataAttributes[dataAttr] = dataAttr + "$1=\"$2\"";
                function addNodeDataAttributes(node) {
                    node.attributeNames.forEach(function (attr) {
                        if (strings_1.startsWith(attr, dataAttr) && !dataAttributes[attr] && !seenAttributes[attr]) {
                            dataAttributes[attr] = attr + '="$1"';
                        }
                    });
                    node.children.forEach(function (child) { return addNodeDataAttributes(child); });
                }
                if (htmlDocument) {
                    htmlDocument.roots.forEach(function (root) { return addNodeDataAttributes(root); });
                }
                Object.keys(dataAttributes).forEach(function (attr) { return result.items.push({
                    label: attr,
                    kind: vscode_languageserver_types_1.CompletionItemKind.Value,
                    textEdit: vscode_languageserver_types_1.TextEdit.replace(range, dataAttributes[attr]),
                    insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet
                }); });
            }
            function collectAttributeValueSuggestions(valueStart, valueEnd) {
                if (valueEnd === void 0) { valueEnd = offset; }
                var range;
                var addQuotes;
                var valuePrefix;
                if (offset > valueStart && offset <= valueEnd && isQuote(text[valueStart])) {
                    // inside quoted attribute
                    var valueContentStart = valueStart + 1;
                    var valueContentEnd = valueEnd;
                    // valueEnd points to the char after quote, which encloses the replace range
                    if (valueEnd > valueStart && text[valueEnd - 1] === text[valueStart]) {
                        valueContentEnd--;
                    }
                    var wsBefore = getWordStart(text, offset, valueContentStart);
                    var wsAfter = getWordEnd(text, offset, valueContentEnd);
                    range = getReplaceRange(wsBefore, wsAfter);
                    valuePrefix = offset >= valueContentStart && offset <= valueContentEnd ? text.substring(valueContentStart, offset) : '';
                    addQuotes = false;
                }
                else {
                    range = getReplaceRange(valueStart, valueEnd);
                    valuePrefix = text.substring(valueStart, offset);
                    addQuotes = true;
                }
                var tag = currentTag.toLowerCase();
                var attribute = currentAttributeName.toLowerCase();
                if (completionParticipants.length > 0) {
                    var fullRange = getReplaceRange(valueStart, valueEnd);
                    for (var _i = 0, completionParticipants_1 = completionParticipants; _i < completionParticipants_1.length; _i++) {
                        var participant = completionParticipants_1[_i];
                        if (participant.onHtmlAttributeValue) {
                            participant.onHtmlAttributeValue({ document: document, position: position, tag: tag, attribute: attribute, value: valuePrefix, range: fullRange });
                        }
                    }
                }
                var value = scanner.getTokenText();
                tagProviders.forEach(function (provider) {
                    provider.collectValues(tag, attribute, function (value) {
                        var insertText = addQuotes ? '"' + value + '"' : value;
                        result.items.push({
                            label: value,
                            filterText: insertText,
                            kind: vscode_languageserver_types_1.CompletionItemKind.Unit,
                            textEdit: vscode_languageserver_types_1.TextEdit.replace(range, insertText),
                            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                        });
                    });
                });
                collectCharacterEntityProposals();
                return result;
            }
            function scanNextForEndPos(nextToken) {
                if (offset === scanner.getTokenEnd()) {
                    token = scanner.scan();
                    if (token === nextToken && scanner.getTokenOffset() === offset) {
                        return scanner.getTokenEnd();
                    }
                }
                return offset;
            }
            function collectInsideContent() {
                for (var _i = 0, completionParticipants_2 = completionParticipants; _i < completionParticipants_2.length; _i++) {
                    var participant = completionParticipants_2[_i];
                    if (participant.onHtmlContent) {
                        participant.onHtmlContent({ document: document, position: position });
                    }
                }
                return collectCharacterEntityProposals();
            }
            function collectCharacterEntityProposals() {
                // character entities
                var k = offset - 1;
                var characterStart = position.character;
                while (k >= 0 && strings_1.isLetterOrDigit(text, k)) {
                    k--;
                    characterStart--;
                }
                if (k >= 0 && text[k] === '&') {
                    var range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(position.line, characterStart - 1), position);
                    for (var entity in htmlEntities_1.entities) {
                        if (strings_1.endsWith(entity, ';')) {
                            var label = '&' + entity;
                            result.items.push({
                                label: label,
                                kind: vscode_languageserver_types_1.CompletionItemKind.Keyword,
                                documentation: localize('entity.propose', "Character entity representing '" + htmlEntities_1.entities[entity] + "'"),
                                textEdit: vscode_languageserver_types_1.TextEdit.replace(range, label),
                                insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.PlainText
                            });
                        }
                    }
                }
                return result;
            }
            var token = scanner.scan();
            while (token !== htmlScanner_1.TokenType.EOS && scanner.getTokenOffset() <= offset) {
                switch (token) {
                    case htmlScanner_1.TokenType.StartTagOpen:
                        if (scanner.getTokenEnd() === offset) {
                            var endPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                            return collectTagSuggestions(offset, endPos);
                        }
                        break;
                    case htmlScanner_1.TokenType.StartTag:
                        if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                            return collectOpenTagSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                        }
                        currentTag = scanner.getTokenText();
                        break;
                    case htmlScanner_1.TokenType.AttributeName:
                        if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                            return collectAttributeNameSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                        }
                        currentAttributeName = scanner.getTokenText();
                        break;
                    case htmlScanner_1.TokenType.DelimiterAssign:
                        if (scanner.getTokenEnd() === offset) {
                            var endPos = scanNextForEndPos(htmlScanner_1.TokenType.AttributeValue);
                            return collectAttributeValueSuggestions(offset, endPos);
                        }
                        break;
                    case htmlScanner_1.TokenType.AttributeValue:
                        if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                            return collectAttributeValueSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                        }
                        break;
                    case htmlScanner_1.TokenType.Whitespace:
                        if (offset <= scanner.getTokenEnd()) {
                            switch (scanner.getScannerState()) {
                                case htmlScanner_1.ScannerState.AfterOpeningStartTag:
                                    var startPos = scanner.getTokenOffset();
                                    var endTagPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                                    return collectTagSuggestions(startPos, endTagPos);
                                case htmlScanner_1.ScannerState.WithinTag:
                                case htmlScanner_1.ScannerState.AfterAttributeName:
                                    return collectAttributeNameSuggestions(scanner.getTokenEnd());
                                case htmlScanner_1.ScannerState.BeforeAttributeValue:
                                    return collectAttributeValueSuggestions(scanner.getTokenEnd());
                                case htmlScanner_1.ScannerState.AfterOpeningEndTag:
                                    return collectCloseTagSuggestions(scanner.getTokenOffset() - 1, false);
                                case htmlScanner_1.ScannerState.WithinContent:
                                    return collectInsideContent();
                            }
                        }
                        break;
                    case htmlScanner_1.TokenType.EndTagOpen:
                        if (offset <= scanner.getTokenEnd()) {
                            var afterOpenBracket = scanner.getTokenOffset() + 1;
                            var endOffset = scanNextForEndPos(htmlScanner_1.TokenType.EndTag);
                            return collectCloseTagSuggestions(afterOpenBracket, false, endOffset);
                        }
                        break;
                    case htmlScanner_1.TokenType.EndTag:
                        if (offset <= scanner.getTokenEnd()) {
                            var start = scanner.getTokenOffset() - 1;
                            while (start >= 0) {
                                var ch = text.charAt(start);
                                if (ch === '/') {
                                    return collectCloseTagSuggestions(start, false, scanner.getTokenEnd());
                                }
                                else if (!isWhiteSpace(ch)) {
                                    break;
                                }
                                start--;
                            }
                        }
                        break;
                    case htmlScanner_1.TokenType.StartTagClose:
                        if (offset <= scanner.getTokenEnd()) {
                            if (currentTag) {
                                return collectAutoCloseTagSuggestion(scanner.getTokenEnd(), currentTag);
                            }
                        }
                        break;
                    case htmlScanner_1.TokenType.Content:
                        if (offset <= scanner.getTokenEnd()) {
                            return collectInsideContent();
                        }
                        break;
                    default:
                        if (offset <= scanner.getTokenEnd()) {
                            return result;
                        }
                        break;
                }
                token = scanner.scan();
            }
            return result;
        };
        HTMLCompletion.prototype.doTagComplete = function (document, position, htmlDocument) {
            var offset = document.offsetAt(position);
            if (offset <= 0) {
                return null;
            }
            var char = document.getText().charAt(offset - 1);
            if (char === '>') {
                var node = htmlDocument.findNodeBefore(offset);
                if (node && node.tag && !htmlTags_1.isEmptyElement(node.tag) && node.start < offset && (!node.endTagStart || node.endTagStart > offset)) {
                    var scanner = htmlScanner_1.createScanner(document.getText(), node.start);
                    var token = scanner.scan();
                    while (token !== htmlScanner_1.TokenType.EOS && scanner.getTokenEnd() <= offset) {
                        if (token === htmlScanner_1.TokenType.StartTagClose && scanner.getTokenEnd() === offset) {
                            return "$0</" + node.tag + ">";
                        }
                        token = scanner.scan();
                    }
                }
            }
            else if (char === '/') {
                var node = htmlDocument.findNodeBefore(offset);
                while (node && node.closed) {
                    node = node.parent;
                }
                if (node && node.tag) {
                    var scanner = htmlScanner_1.createScanner(document.getText(), node.start);
                    var token = scanner.scan();
                    while (token !== htmlScanner_1.TokenType.EOS && scanner.getTokenEnd() <= offset) {
                        if (token === htmlScanner_1.TokenType.EndTagOpen && scanner.getTokenEnd() === offset) {
                            return node.tag + ">";
                        }
                        token = scanner.scan();
                    }
                }
            }
            return null;
        };
        return HTMLCompletion;
    }());
    exports.HTMLCompletion = HTMLCompletion;
    function isQuote(s) {
        return /^["']*$/.test(s);
    }
    function isWhiteSpace(s) {
        return /^\s*$/.test(s);
    }
    function isFollowedBy(s, offset, intialState, expectedToken) {
        var scanner = htmlScanner_1.createScanner(s, offset, intialState);
        var token = scanner.scan();
        while (token === htmlScanner_1.TokenType.Whitespace) {
            token = scanner.scan();
        }
        return token === expectedToken;
    }
    function getWordStart(s, offset, limit) {
        while (offset > limit && !isWhiteSpace(s[offset - 1])) {
            offset--;
        }
        return offset;
    }
    function getWordEnd(s, offset, limit) {
        while (offset < limit && !isWhiteSpace(s[offset])) {
            offset++;
        }
        return offset;
    }
});
//# sourceMappingURL=htmlCompletion.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/services/htmlHover',["require", "exports", "../parser/htmlScanner", "vscode-languageserver-types", "./tagProviders"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var htmlScanner_1 = require("../parser/htmlScanner");
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    var tagProviders_1 = require("./tagProviders");
    function doHover(document, position, htmlDocument) {
        var offset = document.offsetAt(position);
        var node = htmlDocument.findNodeAt(offset);
        if (!node || !node.tag) {
            return null;
        }
        var tagProviders = tagProviders_1.allTagProviders.filter(function (p) { return p.isApplicable(document.languageId); });
        function getTagHover(tag, range, open) {
            tag = tag.toLowerCase();
            var _loop_1 = function (provider) {
                var hover = null;
                provider.collectTags(function (t, label) {
                    if (t === tag) {
                        var tagLabel = open ? '<' + tag + '>' : '</' + tag + '>';
                        hover = { contents: [{ language: 'html', value: tagLabel }, vscode_languageserver_types_1.MarkedString.fromPlainText(label)], range: range };
                    }
                });
                if (hover) {
                    return { value: hover };
                }
            };
            for (var _i = 0, tagProviders_2 = tagProviders; _i < tagProviders_2.length; _i++) {
                var provider = tagProviders_2[_i];
                var state_1 = _loop_1(provider);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return null;
        }
        function getTagNameRange(tokenType, startOffset) {
            var scanner = htmlScanner_1.createScanner(document.getText(), startOffset);
            var token = scanner.scan();
            while (token !== htmlScanner_1.TokenType.EOS && (scanner.getTokenEnd() < offset || scanner.getTokenEnd() === offset && token !== tokenType)) {
                token = scanner.scan();
            }
            if (token === tokenType && offset <= scanner.getTokenEnd()) {
                return { start: document.positionAt(scanner.getTokenOffset()), end: document.positionAt(scanner.getTokenEnd()) };
            }
            return null;
        }
        if (node.endTagStart && offset >= node.endTagStart) {
            var tagRange_1 = getTagNameRange(htmlScanner_1.TokenType.EndTag, node.endTagStart);
            if (tagRange_1) {
                return getTagHover(node.tag, tagRange_1, false);
            }
            return null;
        }
        var tagRange = getTagNameRange(htmlScanner_1.TokenType.StartTag, node.start);
        if (tagRange) {
            return getTagHover(node.tag, tagRange, true);
        }
        return null;
    }
    exports.doHover = doHover;
});
//# sourceMappingURL=htmlHover.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/beautify/beautify',["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    /*
     * Mock for the JS formatter. Ignore formatting of JS content in HTML.
     */
    function js_beautify(js_source_text, options) {
        // no formatting
        return js_source_text;
    }
    exports.js_beautify = js_beautify;
});
//# sourceMappingURL=beautify.js.map;
// copied from https://raw.githubusercontent.com/beautify-web/js-beautify/master/js/lib/beautify-css.js
// https://github.com/beautify-web/js-beautify/commit/2009d250914ba865e81b20b264aa40736e38bf86
/*jshint curly:false, eqeqeq:true, laxbreak:true, noempty:false */
/* AUTO-GENERATED. DO NOT MODIFY. */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 CSS Beautifier
---------------

    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

    Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
        http://jsbeautifier.org/

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are (default in brackets):
        indent_size (4)                         — indentation size,
        indent_char (space)                     — character to indent with,
        selector_separator_newline (true)       - separate selectors with newline or
                                                  not (e.g. "a,\nbr" or "a, br")
        end_with_newline (false)                - end with a newline
        newline_between_rules (true)            - add a new line after every css rule
        space_around_selector_separator (false) - ensure space around selector separators:
                                                  '>', '+', '~' (e.g. "a>b" -> "a > b")
    e.g

    css_beautify(css_source_text, {
      'indent_size': 1,
      'indent_char': '\t',
      'selector_separator': ' ',
      'end_with_newline': false,
      'newline_between_rules': true,
      'space_around_selector_separator': true
    });
*/

// http://www.w3.org/TR/CSS21/syndata.html#tokenization
// http://www.w3.org/TR/css3-syntax/

(function() {
var legacy_beautify_css =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

var mergeOpts = __webpack_require__(2).mergeOpts;
var acorn = __webpack_require__(1);
var Output = __webpack_require__(3).Output;


var lineBreak = acorn.lineBreak;
var allLineBreaks = acorn.allLineBreaks;

function Beautifier(source_text, options) {
    options = options || {};

    // Allow the setting of language/file-type specific options
    // with inheritance of overall settings
    options = mergeOpts(options, 'css');

    source_text = source_text || '';

    var newlinesFromLastWSEat = 0;
    var indentSize = options.indent_size ? parseInt(options.indent_size, 10) : 4;
    var indentCharacter = options.indent_char || ' ';
    var preserve_newlines = (options.preserve_newlines === undefined) ? false : options.preserve_newlines;
    var selectorSeparatorNewline = (options.selector_separator_newline === undefined) ? true : options.selector_separator_newline;
    var end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
    var newline_between_rules = (options.newline_between_rules === undefined) ? true : options.newline_between_rules;
    var space_around_combinator = (options.space_around_combinator === undefined) ? false : options.space_around_combinator;
    space_around_combinator = space_around_combinator || ((options.space_around_selector_separator === undefined) ? false : options.space_around_selector_separator);
    var eol = options.eol ? options.eol : 'auto';

    if (options.indent_with_tabs) {
        indentCharacter = '\t';
        indentSize = 1;
    }

    if (eol === 'auto') {
        eol = '\n';
        if (source_text && lineBreak.test(source_text || '')) {
            eol = source_text.match(lineBreak)[0];
        }
    }

    eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n');

    // HACK: newline parsing inconsistent. This brute force normalizes the input.
    source_text = source_text.replace(allLineBreaks, '\n');

    // tokenizer
    var whiteRe = /^\s+$/;

    var pos = -1,
        ch;
    var parenLevel = 0;

    function next() {
        ch = source_text.charAt(++pos);
        return ch || '';
    }

    function peek(skipWhitespace) {
        var result = '';
        var prev_pos = pos;
        if (skipWhitespace) {
            eatWhitespace();
        }
        result = source_text.charAt(pos + 1) || '';
        pos = prev_pos - 1;
        next();
        return result;
    }

    function eatString(endChars) {
        var start = pos;
        while (next()) {
            if (ch === "\\") {
                next();
            } else if (endChars.indexOf(ch) !== -1) {
                break;
            } else if (ch === "\n") {
                break;
            }
        }
        return source_text.substring(start, pos + 1);
    }

    function peekString(endChar) {
        var prev_pos = pos;
        var str = eatString(endChar);
        pos = prev_pos - 1;
        next();
        return str;
    }

    function eatWhitespace(preserve_newlines_local) {
        var result = 0;
        while (whiteRe.test(peek())) {
            next();
            if (ch === '\n' && preserve_newlines_local && preserve_newlines) {
                output.add_new_line(true);
                result++;
            }
        }
        newlinesFromLastWSEat = result;
        return result;
    }

    function skipWhitespace() {
        var result = '';
        if (ch && whiteRe.test(ch)) {
            result = ch;
        }
        while (whiteRe.test(next())) {
            result += ch;
        }
        return result;
    }

    function eatComment() {
        var start = pos;
        var singleLine = peek() === "/";
        next();
        while (next()) {
            if (!singleLine && ch === "*" && peek() === "/") {
                next();
                break;
            } else if (singleLine && ch === "\n") {
                return source_text.substring(start, pos);
            }
        }

        return source_text.substring(start, pos) + ch;
    }


    function lookBack(str) {
        return source_text.substring(pos - str.length, pos).toLowerCase() ===
            str;
    }

    // Nested pseudo-class if we are insideRule
    // and the next special character found opens
    // a new block
    function foundNestedPseudoClass() {
        var openParen = 0;
        for (var i = pos + 1; i < source_text.length; i++) {
            var ch = source_text.charAt(i);
            if (ch === "{") {
                return true;
            } else if (ch === '(') {
                // pseudoclasses can contain ()
                openParen += 1;
            } else if (ch === ')') {
                if (openParen === 0) {
                    return false;
                }
                openParen -= 1;
            } else if (ch === ";" || ch === "}") {
                return false;
            }
        }
        return false;
    }

    // printer
    var baseIndentString = '';
    var preindent_index = 0;
    if (source_text && source_text.length) {
        while ((source_text.charAt(preindent_index) === ' ' ||
                source_text.charAt(preindent_index) === '\t')) {
            preindent_index += 1;
        }
        baseIndentString = source_text.substring(0, preindent_index);
        js_source_text = source_text.substring(preindent_index);
    }


    var singleIndent = new Array(indentSize + 1).join(indentCharacter);
    var indentLevel;
    var nestedLevel;
    var output;

    function print_string(output_string) {
        if (output.just_added_newline()) {
            output.set_indent(indentLevel);
        }
        output.add_token(output_string);
    }

    function preserveSingleSpace(isAfterSpace) {
        if (isAfterSpace) {
            output.space_before_token = true;
        }
    }

    function indent() {
        indentLevel++;
    }

    function outdent() {
        if (indentLevel > 0) {
            indentLevel--;
        }
    }

    /*_____________________--------------------_____________________*/

    this.beautify = function() {
        // reset
        output = new Output(singleIndent, baseIndentString);
        indentLevel = 0;
        nestedLevel = 0;

        pos = -1;
        ch = null;
        parenLevel = 0;

        var insideRule = false;
        var insidePropertyValue = false;
        var enteringConditionalGroup = false;
        var top_ch = '';
        var last_top_ch = '';

        while (true) {
            var whitespace = skipWhitespace();
            var isAfterSpace = whitespace !== '';
            var isAfterNewline = whitespace.indexOf('\n') !== -1;
            last_top_ch = top_ch;
            top_ch = ch;

            if (!ch) {
                break;
            } else if (ch === '/' && peek() === '*') { /* css comment */
                var header = indentLevel === 0;

                if (isAfterNewline || header) {
                    output.add_new_line();
                }

                print_string(eatComment());
                output.add_new_line();
                if (header) {
                    output.add_new_line(true);
                }
            } else if (ch === '/' && peek() === '/') { // single line comment
                if (!isAfterNewline && last_top_ch !== '{') {
                    output.trim(true);
                }
                output.space_before_token = true;
                print_string(eatComment());
                output.add_new_line();
            } else if (ch === '@') {
                preserveSingleSpace(isAfterSpace);

                // deal with less propery mixins @{...}
                if (peek() === '{') {
                    print_string(eatString('}'));
                } else {
                    print_string(ch);

                    // strip trailing space, if present, for hash property checks
                    var variableOrRule = peekString(": ,;{}()[]/='\"");

                    if (variableOrRule.match(/[ :]$/)) {
                        // we have a variable or pseudo-class, add it and insert one space before continuing
                        next();
                        variableOrRule = eatString(": ").replace(/\s$/, '');
                        print_string(variableOrRule);
                        output.space_before_token = true;
                    }

                    variableOrRule = variableOrRule.replace(/\s$/, '');

                    // might be a nesting at-rule
                    if (variableOrRule in this.NESTED_AT_RULE) {
                        nestedLevel += 1;
                        if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
                            enteringConditionalGroup = true;
                        }
                    }
                }
            } else if (ch === '#' && peek() === '{') {
                preserveSingleSpace(isAfterSpace);
                print_string(eatString('}'));
            } else if (ch === '{') {
                if (peek(true) === '}') {
                    eatWhitespace();
                    next();
                    output.space_before_token = true;
                    print_string("{}");
                    if (!eatWhitespace(true)) {
                        output.add_new_line();
                    }

                    if (newlinesFromLastWSEat < 2 && newline_between_rules && indentLevel === 0) {
                        output.add_new_line(true);
                    }
                } else {
                    indent();
                    output.space_before_token = true;
                    print_string(ch);
                    if (!eatWhitespace(true)) {
                        output.add_new_line();
                    }

                    // when entering conditional groups, only rulesets are allowed
                    if (enteringConditionalGroup) {
                        enteringConditionalGroup = false;
                        insideRule = (indentLevel > nestedLevel);
                    } else {
                        // otherwise, declarations are also allowed
                        insideRule = (indentLevel >= nestedLevel);
                    }
                }
            } else if (ch === '}') {
                outdent();
                output.add_new_line();
                print_string(ch);
                insideRule = false;
                insidePropertyValue = false;
                if (nestedLevel) {
                    nestedLevel--;
                }

                if (!eatWhitespace(true)) {
                    output.add_new_line();
                }

                if (newlinesFromLastWSEat < 2 && newline_between_rules && indentLevel === 0) {
                    output.add_new_line(true);
                }
            } else if (ch === ":") {
                eatWhitespace();
                if ((insideRule || enteringConditionalGroup) &&
                    !(lookBack("&") || foundNestedPseudoClass()) &&
                    !lookBack("(")) {
                    // 'property: value' delimiter
                    // which could be in a conditional group query
                    print_string(':');
                    if (!insidePropertyValue) {
                        insidePropertyValue = true;
                        output.space_before_token = true;
                    }
                } else {
                    // sass/less parent reference don't use a space
                    // sass nested pseudo-class don't use a space

                    // preserve space before pseudoclasses/pseudoelements, as it means "in any child"
                    if (lookBack(" ")) {
                        output.space_before_token = true;
                    }
                    if (peek() === ":") {
                        // pseudo-element
                        next();
                        print_string("::");
                    } else {
                        // pseudo-class
                        print_string(':');
                    }
                }
            } else if (ch === '"' || ch === '\'') {
                preserveSingleSpace(isAfterSpace);
                print_string(eatString(ch));
            } else if (ch === ';') {
                insidePropertyValue = false;
                print_string(ch);
                if (!eatWhitespace(true)) {
                    output.add_new_line();
                }
            } else if (ch === '(') { // may be a url
                if (lookBack("url")) {
                    print_string(ch);
                    eatWhitespace();
                    if (next()) {
                        if (ch !== ')' && ch !== '"' && ch !== '\'') {
                            print_string(eatString(')'));
                        } else {
                            pos--;
                        }
                    }
                } else {
                    parenLevel++;
                    preserveSingleSpace(isAfterSpace);
                    print_string(ch);
                    eatWhitespace();
                }
            } else if (ch === ')') {
                print_string(ch);
                parenLevel--;
            } else if (ch === ',') {
                print_string(ch);
                if (!eatWhitespace(true) && selectorSeparatorNewline && !insidePropertyValue && parenLevel < 1) {
                    output.add_new_line();
                } else {
                    output.space_before_token = true;
                }
            } else if ((ch === '>' || ch === '+' || ch === '~') &&
                !insidePropertyValue && parenLevel < 1) {
                //handle combinator spacing
                if (space_around_combinator) {
                    output.space_before_token = true;
                    print_string(ch);
                    output.space_before_token = true;
                } else {
                    print_string(ch);
                    eatWhitespace();
                    // squash extra whitespace
                    if (ch && whiteRe.test(ch)) {
                        ch = '';
                    }
                }
            } else if (ch === ']') {
                print_string(ch);
            } else if (ch === '[') {
                preserveSingleSpace(isAfterSpace);
                print_string(ch);
            } else if (ch === '=') { // no whitespace before or after
                eatWhitespace();
                print_string('=');
                if (whiteRe.test(ch)) {
                    ch = '';
                }

            } else {
                preserveSingleSpace(isAfterSpace);
                print_string(ch);
            }
        }

        var sweetCode = output.get_code(end_with_newline, eol);

        return sweetCode;
    };

    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
    this.NESTED_AT_RULE = {
        "@page": true,
        "@font-face": true,
        "@keyframes": true,
        // also in CONDITIONAL_GROUP_RULE below
        "@media": true,
        "@supports": true,
        "@document": true
    };
    this.CONDITIONAL_GROUP_RULE = {
        "@media": true,
        "@supports": true,
        "@document": true
    };
}

module.exports.Beautifier = Beautifier;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* jshint curly: false */
// This section of code is taken from acorn.
//
// Acorn was written by Marijn Haverbeke and released under an MIT
// license. The Unicode regexps (for identifiers and whitespace) were
// taken from [Esprima](http://esprima.org) by Ariya Hidayat.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/marijnh/acorn.git

// ## Character categories

// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.

var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/; // jshint ignore:line
var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

// Whether a single character denotes a newline.

exports.newline = /[\n\r\u2028\u2029]/;

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

// in javascript, these two differ
// in python they are the same, different methods are called on them
exports.lineBreak = new RegExp('\r\n|' + exports.newline.source);
exports.allLineBreaks = new RegExp(exports.lineBreak.source, 'g');


// Test whether a given character code starts an identifier.

exports.isIdentifierStart = function(code) {
    // permit $ (36) and @ (64). @ is used in ES7 decorators.
    if (code < 65) return code === 36 || code === 64;
    // 65 through 91 are uppercase letters.
    if (code < 91) return true;
    // permit _ (95).
    if (code < 97) return code === 95;
    // 97 through 123 are lowercase letters.
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
};

// Test whether a given character is part of an identifier.

exports.isIdentifierChar = function(code) {
    if (code < 48) return code === 36;
    if (code < 58) return true;
    if (code < 65) return false;
    if (code < 91) return true;
    if (code < 97) return code === 95;
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

    The MIT License (MIT)

    Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation files
    (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

function mergeOpts(allOptions, targetType) {
    var finalOpts = {};
    var name;

    for (name in allOptions) {
        if (name !== targetType) {
            finalOpts[name] = allOptions[name];
        }
    }

    //merge in the per type settings for the targetType
    if (targetType in allOptions) {
        for (name in allOptions[targetType]) {
            finalOpts[name] = allOptions[targetType][name];
        }
    }
    return finalOpts;
}

module.exports.mergeOpts = mergeOpts;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

function OutputLine(parent) {
    var _character_count = 0;
    // use indent_count as a marker for lines that have preserved indentation
    var _indent_count = -1;

    var _items = [];
    var _empty = true;

    this.set_indent = function(level) {
        _character_count = parent.baseIndentLength + level * parent.indent_length;
        _indent_count = level;
    };

    this.get_character_count = function() {
        return _character_count;
    };

    this.is_empty = function() {
        return _empty;
    };

    this.last = function() {
        if (!this._empty) {
            return _items[_items.length - 1];
        } else {
            return null;
        }
    };

    this.push = function(input) {
        _items.push(input);
        _character_count += input.length;
        _empty = false;
    };

    this.pop = function() {
        var item = null;
        if (!_empty) {
            item = _items.pop();
            _character_count -= item.length;
            _empty = _items.length === 0;
        }
        return item;
    };

    this.remove_indent = function() {
        if (_indent_count > 0) {
            _indent_count -= 1;
            _character_count -= parent.indent_length;
        }
    };

    this.trim = function() {
        while (this.last() === ' ') {
            _items.pop();
            _character_count -= 1;
        }
        _empty = _items.length === 0;
    };

    this.toString = function() {
        var result = '';
        if (!this._empty) {
            if (_indent_count >= 0) {
                result = parent.indent_cache[_indent_count];
            }
            result += _items.join('');
        }
        return result;
    };
}

function Output(indent_string, baseIndentString) {
    baseIndentString = baseIndentString || '';
    this.indent_cache = [baseIndentString];
    this.baseIndentLength = baseIndentString.length;
    this.indent_length = indent_string.length;
    this.raw = false;

    var lines = [];
    this.baseIndentString = baseIndentString;
    this.indent_string = indent_string;
    this.previous_line = null;
    this.current_line = null;
    this.space_before_token = false;

    this.add_outputline = function() {
        this.previous_line = this.current_line;
        this.current_line = new OutputLine(this);
        lines.push(this.current_line);
    };

    // initialize
    this.add_outputline();


    this.get_line_number = function() {
        return lines.length;
    };

    // Using object instead of string to allow for later expansion of info about each line
    this.add_new_line = function(force_newline) {
        if (this.get_line_number() === 1 && this.just_added_newline()) {
            return false; // no newline on start of file
        }

        if (force_newline || !this.just_added_newline()) {
            if (!this.raw) {
                this.add_outputline();
            }
            return true;
        }

        return false;
    };

    this.get_code = function(end_with_newline, eol) {
        var sweet_code = lines.join('\n').replace(/[\r\n\t ]+$/, '');

        if (end_with_newline) {
            sweet_code += '\n';
        }

        if (eol !== '\n') {
            sweet_code = sweet_code.replace(/[\n]/g, eol);
        }

        return sweet_code;
    };

    this.set_indent = function(level) {
        // Never indent your first output indent at the start of the file
        if (lines.length > 1) {
            while (level >= this.indent_cache.length) {
                this.indent_cache.push(this.indent_cache[this.indent_cache.length - 1] + this.indent_string);
            }

            this.current_line.set_indent(level);
            return true;
        }
        this.current_line.set_indent(0);
        return false;
    };

    this.add_raw_token = function(token) {
        for (var x = 0; x < token.newlines; x++) {
            this.add_outputline();
        }
        this.current_line.push(token.whitespace_before);
        this.current_line.push(token.text);
        this.space_before_token = false;
    };

    this.add_token = function(printable_token) {
        this.add_space_before_token();
        this.current_line.push(printable_token);
    };

    this.add_space_before_token = function() {
        if (this.space_before_token && !this.just_added_newline()) {
            this.current_line.push(' ');
        }
        this.space_before_token = false;
    };

    this.remove_indent = function(index) {
        var output_length = lines.length;
        while (index < output_length) {
            lines[index].remove_indent();
            index++;
        }
    };

    this.trim = function(eat_newlines) {
        eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

        this.current_line.trim(indent_string, baseIndentString);

        while (eat_newlines && lines.length > 1 &&
            this.current_line.is_empty()) {
            lines.pop();
            this.current_line = lines[lines.length - 1];
            this.current_line.trim();
        }

        this.previous_line = lines.length > 1 ? lines[lines.length - 2] : null;
    };

    this.just_added_newline = function() {
        return this.current_line.is_empty();
    };

    this.just_added_blankline = function() {
        if (this.just_added_newline()) {
            if (lines.length === 1) {
                return true; // start of the file and newline = blank
            }

            var line = lines[lines.length - 2];
            return line.is_empty();
        }
        return false;
    };
}

module.exports.Output = Output;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

    The MIT License (MIT)

    Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation files
    (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

var Beautifier = __webpack_require__(0).Beautifier;

function css_beautify(source_text, options) {
    var beautifier = new Beautifier(source_text, options);
    return beautifier.beautify();
}

module.exports = css_beautify;

/***/ })
/******/ ]);
var css_beautify = legacy_beautify_css;
/* Footer */
if (typeof define === "function" && define.amd) {
    // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
    define('vscode-html-languageservice/beautify/beautify-css',[], function() {
        return {
            css_beautify: css_beautify
        };
    });
} else if (typeof exports !== "undefined") {
    // Add support for CommonJS. Just put this file somewhere on your require.paths
    // and you will be able to `var html_beautify = require("beautify").html_beautify`.
    exports.css_beautify = css_beautify;
} else if (typeof window !== "undefined") {
    // If we're running a web page and don't have either of the above, add our one global
    window.css_beautify = css_beautify;
} else if (typeof global !== "undefined") {
    // If we don't even have window, try global.
    global.css_beautify = css_beautify;
}

}());

// copied from https://raw.githubusercontent.com/beautify-web/js-beautify/master/js/lib/beautify-html.js
// https://github.com/beautify-web/js-beautify/commit/2009d250914ba865e81b20b264aa40736e38bf86
/*jshint curly:false, eqeqeq:true, laxbreak:true, noempty:false */
/* AUTO-GENERATED. DO NOT MODIFY. */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
    http://jsbeautifier.org/

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_inner_html (default false)  — indent <head> and <body> sections,
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    content_unformatted (defaults to pre tag) - list of tags, that its content shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"
    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
                                        Only works before elements, not inside tags or for text.
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}
    end_with_newline (false)          - end with a newline
    extra_liners (default [head,body,/html]) -List of tags that should have an extra newline before them.

    e.g.

    style_html(html_source, {
      'indent_inner_html': false,
      'indent_size': 2,
      'indent_char': ' ',
      'wrap_line_length': 78,
      'brace_style': 'expand',
      'preserve_newlines': true,
      'max_preserve_newlines': 5,
      'indent_handlebars': false,
      'extra_liners': ['/html']
    });
*/

(function() {
var legacy_beautify_html =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

var mergeOpts = __webpack_require__(2).mergeOpts;
var acorn = __webpack_require__(1);


var lineBreak = acorn.lineBreak;
var allLineBreaks = acorn.allLineBreaks;

// function trim(s) {
//     return s.replace(/^\s+|\s+$/g, '');
// }

function ltrim(s) {
    return s.replace(/^\s+/g, '');
}

function rtrim(s) {
    return s.replace(/\s+$/g, '');
}

function Beautifier(html_source, options, js_beautify, css_beautify) {
    //Wrapper function to invoke all the necessary constructors and deal with the output.
    html_source = html_source || '';

    var multi_parser,
        indent_inner_html,
        indent_body_inner_html,
        indent_head_inner_html,
        indent_size,
        indent_character,
        wrap_line_length,
        brace_style,
        unformatted,
        content_unformatted,
        preserve_newlines,
        max_preserve_newlines,
        indent_handlebars,
        wrap_attributes,
        wrap_attributes_indent_size,
        is_wrap_attributes_force,
        is_wrap_attributes_force_expand_multiline,
        is_wrap_attributes_force_aligned,
        end_with_newline,
        extra_liners,
        eol;

    options = options || {};

    // Allow the setting of language/file-type specific options
    // with inheritance of overall settings
    options = mergeOpts(options, 'html');

    // backwards compatibility to 1.3.4
    if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length, 10) === 0) &&
        (options.max_char !== undefined && parseInt(options.max_char, 10) !== 0)) {
        options.wrap_line_length = options.max_char;
    }

    indent_inner_html = (options.indent_inner_html === undefined) ? false : options.indent_inner_html;
    indent_body_inner_html = (options.indent_body_inner_html === undefined) ? true : options.indent_body_inner_html;
    indent_head_inner_html = (options.indent_head_inner_html === undefined) ? true : options.indent_head_inner_html;
    indent_size = (options.indent_size === undefined) ? 4 : parseInt(options.indent_size, 10);
    indent_character = (options.indent_char === undefined) ? ' ' : options.indent_char;
    brace_style = (options.brace_style === undefined) ? 'collapse' : options.brace_style;
    wrap_line_length = parseInt(options.wrap_line_length, 10) === 0 ? 32786 : parseInt(options.wrap_line_length || 250, 10);
    unformatted = options.unformatted || [
        // https://www.w3.org/TR/html5/dom.html#phrasing-content
        'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite',
        'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img',
        'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript',
        'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', /* 'script', */ 'select', 'small',
        'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var',
        'video', 'wbr', 'text',
        // prexisting - not sure of full effect of removing, leaving in
        'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt',
    ];
    content_unformatted = options.content_unformatted || [
        'pre',
    ];
    preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
    max_preserve_newlines = preserve_newlines ?
        (isNaN(parseInt(options.max_preserve_newlines, 10)) ? 32786 : parseInt(options.max_preserve_newlines, 10)) :
        0;
    indent_handlebars = (options.indent_handlebars === undefined) ? false : options.indent_handlebars;
    wrap_attributes = (options.wrap_attributes === undefined) ? 'auto' : options.wrap_attributes;
    wrap_attributes_indent_size = (isNaN(parseInt(options.wrap_attributes_indent_size, 10))) ? indent_size : parseInt(options.wrap_attributes_indent_size, 10);
    is_wrap_attributes_force = wrap_attributes.substr(0, 'force'.length) === 'force';
    is_wrap_attributes_force_expand_multiline = (wrap_attributes === 'force-expand-multiline');
    is_wrap_attributes_force_aligned = (wrap_attributes === 'force-aligned');
    end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
    extra_liners = (typeof options.extra_liners === 'object') && options.extra_liners ?
        options.extra_liners.concat() : (typeof options.extra_liners === 'string') ?
        options.extra_liners.split(',') : 'head,body,/html'.split(',');
    eol = options.eol ? options.eol : 'auto';

    if (options.indent_with_tabs) {
        indent_character = '\t';
        indent_size = 1;
    }

    if (eol === 'auto') {
        eol = '\n';
        if (html_source && lineBreak.test(html_source || '')) {
            eol = html_source.match(lineBreak)[0];
        }
    }

    eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n');

    // HACK: newline parsing inconsistent. This brute force normalizes the input.
    html_source = html_source.replace(allLineBreaks, '\n');

    function Parser() {

        this.pos = 0; //Parser position
        this.token = '';
        this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
        this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
            parent: 'parent1',
            parentcount: 1,
            parent1: ''
        };
        this.tag_type = '';
        this.token_text = this.last_token = this.last_text = this.token_type = '';
        this.newlines = 0;
        this.indent_content = indent_inner_html;
        this.indent_body_inner_html = indent_body_inner_html;
        this.indent_head_inner_html = indent_head_inner_html;

        this.Utils = { //Uilities made available to the various functions
            whitespace: "\n\r\t ".split(''),

            single_token: options.void_elements || [
                // HTLM void elements - aka self-closing tags - aka singletons
                // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
                'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
                'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr',
                // NOTE: Optional tags - are not understood.
                // https://www.w3.org/TR/html5/syntax.html#optional-tags
                // The rules for optional tags are too complex for a simple list
                // Also, the content of these tags should still be indented in many cases.
                // 'li' is a good exmple.

                // Doctype and xml elements
                '!doctype', '?xml',
                // ?php tag
                '?php',
                // other tags that were in this list, keeping just in case
                'basefont', 'isindex'
            ],
            extra_liners: extra_liners, //for tags that need a line of whitespace before them
            in_array: function(what, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (what === arr[i]) {
                        return true;
                    }
                }
                return false;
            }
        };

        // Return true if the given text is composed entirely of whitespace.
        this.is_whitespace = function(text) {
            for (var n = 0; n < text.length; n++) {
                if (!this.Utils.in_array(text.charAt(n), this.Utils.whitespace)) {
                    return false;
                }
            }
            return true;
        };

        this.traverse_whitespace = function() {
            var input_char = '';

            input_char = this.input.charAt(this.pos);
            if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                this.newlines = 0;
                while (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                    if (preserve_newlines && input_char === '\n' && this.newlines <= max_preserve_newlines) {
                        this.newlines += 1;
                    }

                    this.pos++;
                    input_char = this.input.charAt(this.pos);
                }
                return true;
            }
            return false;
        };

        // Append a space to the given content (string array) or, if we are
        // at the wrap_line_length, append a newline/indentation.
        // return true if a newline was added, false if a space was added
        this.space_or_wrap = function(content) {
            if (this.line_char_count >= this.wrap_line_length) { //insert a line when the wrap_line_length is reached
                this.print_newline(false, content);
                this.print_indentation(content);
                return true;
            } else {
                this.line_char_count++;
                content.push(' ');
                return false;
            }
        };

        this.get_content = function() { //function to capture regular content between tags
            var input_char = '',
                content = [],
                handlebarsStarted = 0;

            while (this.input.charAt(this.pos) !== '<' || handlebarsStarted === 2) {
                if (this.pos >= this.input.length) {
                    return content.length ? content.join('') : ['', 'TK_EOF'];
                }

                if (handlebarsStarted < 2 && this.traverse_whitespace()) {
                    this.space_or_wrap(content);
                    continue;
                }

                input_char = this.input.charAt(this.pos);

                if (indent_handlebars) {
                    if (input_char === '{') {
                        handlebarsStarted += 1;
                    } else if (handlebarsStarted < 2) {
                        handlebarsStarted = 0;
                    }

                    if (input_char === '}' && handlebarsStarted > 0) {
                        if (handlebarsStarted-- === 0) {
                            break;
                        }
                    }
                    // Handlebars parsing is complicated.
                    // {{#foo}} and {{/foo}} are formatted tags.
                    // {{something}} should get treated as content, except:
                    // {{else}} specifically behaves like {{#if}} and {{/if}}
                    var peek3 = this.input.substr(this.pos, 3);
                    if (peek3 === '{{#' || peek3 === '{{/') {
                        // These are tags and not content.
                        break;
                    } else if (peek3 === '{{!') {
                        return [this.get_tag(), 'TK_TAG_HANDLEBARS_COMMENT'];
                    } else if (this.input.substr(this.pos, 2) === '{{') {
                        if (this.get_tag(true) === '{{else}}') {
                            break;
                        }
                    }
                }

                this.pos++;
                this.line_char_count++;
                content.push(input_char); //letter at-a-time (or string) inserted to an array
            }
            return content.length ? content.join('') : '';
        };

        this.get_contents_to = function(name) { //get the full content of a script or style to pass to js_beautify
            if (this.pos === this.input.length) {
                return ['', 'TK_EOF'];
            }
            var content = '';
            var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
            reg_match.lastIndex = this.pos;
            var reg_array = reg_match.exec(this.input);
            var end_script = reg_array ? reg_array.index : this.input.length; //absolute end of script
            if (this.pos < end_script) { //get everything in between the script tags
                content = this.input.substring(this.pos, end_script);
                this.pos = end_script;
            }
            return content;
        };

        this.record_tag = function(tag) { //function to record a tag and its parent in this.tags Object
            if (this.tags[tag + 'count']) { //check for the existence of this tag type
                this.tags[tag + 'count']++;
                this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
            } else { //otherwise initialize this tag type
                this.tags[tag + 'count'] = 1;
                this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
            }
            this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
            this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
        };

        this.retrieve_tag = function(tag) { //function to retrieve the opening tag to the corresponding closer
            if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
                var temp_parent = this.tags.parent; //check to see if it's a closable tag.
                while (temp_parent) { //till we reach '' (the initial value);
                    if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
                        break;
                    }
                    temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
                }
                if (temp_parent) { //if we caught something
                    this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
                    this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
                }
                delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
                delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
                if (this.tags[tag + 'count'] === 1) {
                    delete this.tags[tag + 'count'];
                } else {
                    this.tags[tag + 'count']--;
                }
            }
        };

        this.indent_to_tag = function(tag) {
            // Match the indentation level to the last use of this tag, but don't remove it.
            if (!this.tags[tag + 'count']) {
                return;
            }
            var temp_parent = this.tags.parent;
            while (temp_parent) {
                if (tag + this.tags[tag + 'count'] === temp_parent) {
                    break;
                }
                temp_parent = this.tags[temp_parent + 'parent'];
            }
            if (temp_parent) {
                this.indent_level = this.tags[tag + this.tags[tag + 'count']];
            }
        };

        this.get_tag = function(peek) { //function to get a full tag and parse its type
            var input_char = '',
                content = [],
                comment = '',
                space = false,
                first_attr = true,
                has_wrapped_attrs = false,
                tag_start, tag_end,
                tag_start_char,
                orig_pos = this.pos,
                orig_line_char_count = this.line_char_count,
                is_tag_closed = false,
                tail;

            peek = peek !== undefined ? peek : false;

            do {
                if (this.pos >= this.input.length) {
                    if (peek) {
                        this.pos = orig_pos;
                        this.line_char_count = orig_line_char_count;
                    }
                    return content.length ? content.join('') : ['', 'TK_EOF'];
                }

                input_char = this.input.charAt(this.pos);
                this.pos++;

                if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
                    space = true;
                    continue;
                }

                if (input_char === "'" || input_char === '"') {
                    input_char += this.get_unformatted(input_char);
                    space = true;
                }

                if (input_char === '=') { //no space before =
                    space = false;
                }
                tail = this.input.substr(this.pos - 1);
                if (is_wrap_attributes_force_expand_multiline && has_wrapped_attrs && !is_tag_closed && (input_char === '>' || input_char === '/')) {
                    if (tail.match(/^\/?\s*>/)) {
                        space = false;
                        is_tag_closed = true;
                        this.print_newline(false, content);
                        this.print_indentation(content);
                    }
                }
                if (content.length && content[content.length - 1] !== '=' && input_char !== '>' && space) {
                    //no space after = or before >
                    var wrapped = this.space_or_wrap(content);
                    var indentAttrs = wrapped && input_char !== '/' && !is_wrap_attributes_force;
                    space = false;

                    if (is_wrap_attributes_force && input_char !== '/') {
                        var force_first_attr_wrap = false;
                        if (is_wrap_attributes_force_expand_multiline && first_attr) {
                            var is_only_attribute = tail.match(/^\S*(="([^"]|\\")*")?\s*\/?\s*>/) !== null;
                            force_first_attr_wrap = !is_only_attribute;
                        }
                        if (!first_attr || force_first_attr_wrap) {
                            this.print_newline(false, content);
                            this.print_indentation(content);
                            indentAttrs = true;
                        }
                    }
                    if (indentAttrs) {
                        has_wrapped_attrs = true;

                        //indent attributes an auto, forced, or forced-align line-wrap
                        var alignment_size = wrap_attributes_indent_size;
                        if (is_wrap_attributes_force_aligned) {
                            alignment_size = content.indexOf(' ') + 1;
                        }

                        for (var count = 0; count < alignment_size; count++) {
                            // only ever further indent with spaces since we're trying to align characters
                            content.push(' ');
                        }
                    }
                    if (first_attr) {
                        for (var i = 0; i < content.length; i++) {
                            if (content[i] === ' ') {
                                first_attr = false;
                                break;
                            }
                        }
                    }
                }

                if (indent_handlebars && tag_start_char === '<') {
                    // When inside an angle-bracket tag, put spaces around
                    // handlebars not inside of strings.
                    if ((input_char + this.input.charAt(this.pos)) === '{{') {
                        input_char += this.get_unformatted('}}');
                        if (content.length && content[content.length - 1] !== ' ' && content[content.length - 1] !== '<') {
                            input_char = ' ' + input_char;
                        }
                        space = true;
                    }
                }

                if (input_char === '<' && !tag_start_char) {
                    tag_start = this.pos - 1;
                    tag_start_char = '<';
                }

                if (indent_handlebars && !tag_start_char) {
                    if (content.length >= 2 && content[content.length - 1] === '{' && content[content.length - 2] === '{') {
                        if (input_char === '#' || input_char === '/' || input_char === '!') {
                            tag_start = this.pos - 3;
                        } else {
                            tag_start = this.pos - 2;
                        }
                        tag_start_char = '{';
                    }
                }

                this.line_char_count++;
                content.push(input_char); //inserts character at-a-time (or string)

                if (content[1] && (content[1] === '!' || content[1] === '?' || content[1] === '%')) { //if we're in a comment, do something special
                    // We treat all comments as literals, even more than preformatted tags
                    // we just look for the appropriate close tag
                    content = [this.get_comment(tag_start)];
                    break;
                }

                if (indent_handlebars && content[1] && content[1] === '{' && content[2] && content[2] === '!') { //if we're in a comment, do something special
                    // We treat all comments as literals, even more than preformatted tags
                    // we just look for the appropriate close tag
                    content = [this.get_comment(tag_start)];
                    break;
                }

                if (indent_handlebars && tag_start_char === '{' && content.length > 2 && content[content.length - 2] === '}' && content[content.length - 1] === '}') {
                    break;
                }
            } while (input_char !== '>');

            var tag_complete = content.join('');
            var tag_index;
            var tag_offset;

            // must check for space first otherwise the tag could have the first attribute included, and
            // then not un-indent correctly
            if (tag_complete.indexOf(' ') !== -1) { //if there's whitespace, thats where the tag name ends
                tag_index = tag_complete.indexOf(' ');
            } else if (tag_complete.indexOf('\n') !== -1) { //if there's a line break, thats where the tag name ends
                tag_index = tag_complete.indexOf('\n');
            } else if (tag_complete.charAt(0) === '{') {
                tag_index = tag_complete.indexOf('}');
            } else { //otherwise go with the tag ending
                tag_index = tag_complete.indexOf('>');
            }
            if (tag_complete.charAt(0) === '<' || !indent_handlebars) {
                tag_offset = 1;
            } else {
                tag_offset = tag_complete.charAt(2) === '#' ? 3 : 2;
            }
            var tag_check = tag_complete.substring(tag_offset, tag_index).toLowerCase();
            if (tag_complete.charAt(tag_complete.length - 2) === '/' ||
                this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
                if (!peek) {
                    this.tag_type = 'SINGLE';
                }
            } else if (indent_handlebars && tag_complete.charAt(0) === '{' && tag_check === 'else') {
                if (!peek) {
                    this.indent_to_tag('if');
                    this.tag_type = 'HANDLEBARS_ELSE';
                    this.indent_content = true;
                    this.traverse_whitespace();
                }
            } else if (this.is_unformatted(tag_check, unformatted) ||
                this.is_unformatted(tag_check, content_unformatted)) {
                // do not reformat the "unformatted" or "content_unformatted" tags
                comment = this.get_unformatted('</' + tag_check + '>', tag_complete); //...delegate to get_unformatted function
                content.push(comment);
                tag_end = this.pos - 1;
                this.tag_type = 'SINGLE';
            } else if (tag_check === 'script' &&
                (tag_complete.search('type') === -1 ||
                    (tag_complete.search('type') > -1 &&
                        tag_complete.search(/\b(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/) > -1))) {
                if (!peek) {
                    this.record_tag(tag_check);
                    this.tag_type = 'SCRIPT';
                }
            } else if (tag_check === 'style' &&
                (tag_complete.search('type') === -1 ||
                    (tag_complete.search('type') > -1 && tag_complete.search('text/css') > -1))) {
                if (!peek) {
                    this.record_tag(tag_check);
                    this.tag_type = 'STYLE';
                }
            } else if (tag_check.charAt(0) === '!') { //peek for <! comment
                // for comments content is already correct.
                if (!peek) {
                    this.tag_type = 'SINGLE';
                    this.traverse_whitespace();
                }
            } else if (!peek) {
                if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
                    this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
                    this.tag_type = 'END';
                } else { //otherwise it's a start-tag
                    this.record_tag(tag_check); //push it on the tag stack
                    if (tag_check.toLowerCase() !== 'html') {
                        this.indent_content = true;
                    }
                    this.tag_type = 'START';
                }

                // Allow preserving of newlines after a start or end tag
                if (this.traverse_whitespace()) {
                    this.space_or_wrap(content);
                }

                if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
                    this.print_newline(false, this.output);
                    if (this.output.length && this.output[this.output.length - 2] !== '\n') {
                        this.print_newline(true, this.output);
                    }
                }
            }

            if (peek) {
                this.pos = orig_pos;
                this.line_char_count = orig_line_char_count;
            }

            return content.join(''); //returns fully formatted tag
        };

        this.get_comment = function(start_pos) { //function to return comment content in its entirety
            // this is will have very poor perf, but will work for now.
            var comment = '',
                delimiter = '>',
                matched = false;

            this.pos = start_pos;
            var input_char = this.input.charAt(this.pos);
            this.pos++;

            while (this.pos <= this.input.length) {
                comment += input_char;

                // only need to check for the delimiter if the last chars match
                if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) &&
                    comment.indexOf(delimiter) !== -1) {
                    break;
                }

                // only need to search for custom delimiter for the first few characters
                if (!matched && comment.length < 10) {
                    if (comment.indexOf('<![if') === 0) { //peek for <![if conditional comment
                        delimiter = '<![endif]>';
                        matched = true;
                    } else if (comment.indexOf('<![cdata[') === 0) { //if it's a <[cdata[ comment...
                        delimiter = ']]>';
                        matched = true;
                    } else if (comment.indexOf('<![') === 0) { // some other ![ comment? ...
                        delimiter = ']>';
                        matched = true;
                    } else if (comment.indexOf('<!--') === 0) { // <!-- comment ...
                        delimiter = '-->';
                        matched = true;
                    } else if (comment.indexOf('{{!--') === 0) { // {{!-- handlebars comment
                        delimiter = '--}}';
                        matched = true;
                    } else if (comment.indexOf('{{!') === 0) { // {{! handlebars comment
                        if (comment.length === 5 && comment.indexOf('{{!--') === -1) {
                            delimiter = '}}';
                            matched = true;
                        }
                    } else if (comment.indexOf('<?') === 0) { // {{! handlebars comment
                        delimiter = '?>';
                        matched = true;
                    } else if (comment.indexOf('<%') === 0) { // {{! handlebars comment
                        delimiter = '%>';
                        matched = true;
                    }
                }

                input_char = this.input.charAt(this.pos);
                this.pos++;
            }

            return comment;
        };

        function tokenMatcher(delimiter) {
            var token = '';

            var add = function(str) {
                var newToken = token + str.toLowerCase();
                token = newToken.length <= delimiter.length ? newToken : newToken.substr(newToken.length - delimiter.length, delimiter.length);
            };

            var doesNotMatch = function() {
                return token.indexOf(delimiter) === -1;
            };

            return {
                add: add,
                doesNotMatch: doesNotMatch
            };
        }

        this.get_unformatted = function(delimiter, orig_tag) { //function to return unformatted content in its entirety
            if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) !== -1) {
                return '';
            }
            var input_char = '';
            var content = '';
            var space = true;

            var delimiterMatcher = tokenMatcher(delimiter);

            do {

                if (this.pos >= this.input.length) {
                    return content;
                }

                input_char = this.input.charAt(this.pos);
                this.pos++;

                if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                    if (!space) {
                        this.line_char_count--;
                        continue;
                    }
                    if (input_char === '\n' || input_char === '\r') {
                        content += '\n';
                        /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
            for (var i=0; i<this.indent_level; i++) {
              content += this.indent_string;
            }
            space = false; //...and make sure other indentation is erased
            */
                        this.line_char_count = 0;
                        continue;
                    }
                }
                content += input_char;
                delimiterMatcher.add(input_char);
                this.line_char_count++;
                space = true;

                if (indent_handlebars && input_char === '{' && content.length && content.charAt(content.length - 2) === '{') {
                    // Handlebars expressions in strings should also be unformatted.
                    content += this.get_unformatted('}}');
                    // Don't consider when stopping for delimiters.
                }
            } while (delimiterMatcher.doesNotMatch());

            return content;
        };

        this.get_token = function() { //initial handler for token-retrieval
            var token;

            if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
                var type = this.last_token.substr(7);
                token = this.get_contents_to(type);
                if (typeof token !== 'string') {
                    return token;
                }
                return [token, 'TK_' + type];
            }
            if (this.current_mode === 'CONTENT') {
                token = this.get_content();
                if (typeof token !== 'string') {
                    return token;
                } else {
                    return [token, 'TK_CONTENT'];
                }
            }

            if (this.current_mode === 'TAG') {
                token = this.get_tag();
                if (typeof token !== 'string') {
                    return token;
                } else {
                    var tag_name_type = 'TK_TAG_' + this.tag_type;
                    return [token, tag_name_type];
                }
            }
        };

        this.get_full_indent = function(level) {
            level = this.indent_level + level || 0;
            if (level < 1) {
                return '';
            }

            return Array(level + 1).join(this.indent_string);
        };

        this.is_unformatted = function(tag_check, unformatted) {
            //is this an HTML5 block-level link?
            if (!this.Utils.in_array(tag_check, unformatted)) {
                return false;
            }

            if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)) {
                return true;
            }

            //at this point we have an  tag; is its first child something we want to remain
            //unformatted?
            var next_tag = this.get_tag(true /* peek. */ );

            // test next_tag to see if it is just html tag (no external content)
            var tag = (next_tag || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);

            // if next_tag comes back but is not an isolated tag, then
            // let's treat the 'a' tag as having content
            // and respect the unformatted option
            if (!tag || this.Utils.in_array(tag[1], unformatted)) {
                return true;
            } else {
                return false;
            }
        };

        this.printer = function(js_source, indent_character, indent_size, wrap_line_length, brace_style) { //handles input/output and some other printing functions

            this.input = js_source || ''; //gets the input for the Parser

            // HACK: newline parsing inconsistent. This brute force normalizes the input.
            this.input = this.input.replace(/\r\n|[\r\u2028\u2029]/g, '\n');

            this.output = [];
            this.indent_character = indent_character;
            this.indent_string = '';
            this.indent_size = indent_size;
            this.brace_style = brace_style;
            this.indent_level = 0;
            this.wrap_line_length = wrap_line_length;
            this.line_char_count = 0; //count to see if wrap_line_length was exceeded

            for (var i = 0; i < this.indent_size; i++) {
                this.indent_string += this.indent_character;
            }

            this.print_newline = function(force, arr) {
                this.line_char_count = 0;
                if (!arr || !arr.length) {
                    return;
                }
                if (force || (arr[arr.length - 1] !== '\n')) { //we might want the extra line
                    if ((arr[arr.length - 1] !== '\n')) {
                        arr[arr.length - 1] = rtrim(arr[arr.length - 1]);
                    }
                    arr.push('\n');
                }
            };

            this.print_indentation = function(arr) {
                for (var i = 0; i < this.indent_level; i++) {
                    arr.push(this.indent_string);
                    this.line_char_count += this.indent_string.length;
                }
            };

            this.print_token = function(text) {
                // Avoid printing initial whitespace.
                if (this.is_whitespace(text) && !this.output.length) {
                    return;
                }
                if (text || text !== '') {
                    if (this.output.length && this.output[this.output.length - 1] === '\n') {
                        this.print_indentation(this.output);
                        text = ltrim(text);
                    }
                }
                this.print_token_raw(text);
            };

            this.print_token_raw = function(text) {
                // If we are going to print newlines, truncate trailing
                // whitespace, as the newlines will represent the space.
                if (this.newlines > 0) {
                    text = rtrim(text);
                }

                if (text && text !== '') {
                    if (text.length > 1 && text.charAt(text.length - 1) === '\n') {
                        // unformatted tags can grab newlines as their last character
                        this.output.push(text.slice(0, -1));
                        this.print_newline(false, this.output);
                    } else {
                        this.output.push(text);
                    }
                }

                for (var n = 0; n < this.newlines; n++) {
                    this.print_newline(n > 0, this.output);
                }
                this.newlines = 0;
            };

            this.indent = function() {
                this.indent_level++;
            };

            this.unindent = function() {
                if (this.indent_level > 0) {
                    this.indent_level--;
                }
            };
        };
        return this;
    }

    /*_____________________--------------------_____________________*/

    this.beautify = function() {
        multi_parser = new Parser(); //wrapping functions Parser
        multi_parser.printer(html_source, indent_character, indent_size, wrap_line_length, brace_style); //initialize starting values
        while (true) {
            var t = multi_parser.get_token();
            multi_parser.token_text = t[0];
            multi_parser.token_type = t[1];

            if (multi_parser.token_type === 'TK_EOF') {
                break;
            }

            switch (multi_parser.token_type) {
                case 'TK_TAG_START':
                    multi_parser.print_newline(false, multi_parser.output);
                    multi_parser.print_token(multi_parser.token_text);
                    if (multi_parser.indent_content) {
                        if ((multi_parser.indent_body_inner_html || !multi_parser.token_text.match(/<body(?:.*)>/)) &&
                            (multi_parser.indent_head_inner_html || !multi_parser.token_text.match(/<head(?:.*)>/))) {

                            multi_parser.indent();
                        }

                        multi_parser.indent_content = false;
                    }
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_STYLE':
                case 'TK_TAG_SCRIPT':
                    multi_parser.print_newline(false, multi_parser.output);
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_END':
                    //Print new line only if the tag has no content and has child
                    if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
                        var tag_name = (multi_parser.token_text.match(/\w+/) || [])[0];
                        var tag_extracted_from_last_output = null;
                        if (multi_parser.output.length) {
                            tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/(?:<|{{#)\s*(\w+)/);
                        }
                        if (tag_extracted_from_last_output === null ||
                            (tag_extracted_from_last_output[1] !== tag_name && !multi_parser.Utils.in_array(tag_extracted_from_last_output[1], unformatted))) {
                            multi_parser.print_newline(false, multi_parser.output);
                        }
                    }
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_SINGLE':
                    // Don't add a newline before elements that should remain unformatted.
                    var tag_check = multi_parser.token_text.match(/^\s*<([a-z-]+)/i);
                    if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
                        multi_parser.print_newline(false, multi_parser.output);
                    }
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_HANDLEBARS_ELSE':
                    // Don't add a newline if opening {{#if}} tag is on the current line
                    var foundIfOnCurrentLine = false;
                    for (var lastCheckedOutput = multi_parser.output.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
                        if (multi_parser.output[lastCheckedOutput] === '\n') {
                            break;
                        } else {
                            if (multi_parser.output[lastCheckedOutput].match(/{{#if/)) {
                                foundIfOnCurrentLine = true;
                                break;
                            }
                        }
                    }
                    if (!foundIfOnCurrentLine) {
                        multi_parser.print_newline(false, multi_parser.output);
                    }
                    multi_parser.print_token(multi_parser.token_text);
                    if (multi_parser.indent_content) {
                        multi_parser.indent();
                        multi_parser.indent_content = false;
                    }
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_HANDLEBARS_COMMENT':
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'TAG';
                    break;
                case 'TK_CONTENT':
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'TAG';
                    break;
                case 'TK_STYLE':
                case 'TK_SCRIPT':
                    if (multi_parser.token_text !== '') {
                        multi_parser.print_newline(false, multi_parser.output);
                        var text = multi_parser.token_text,
                            _beautifier,
                            script_indent_level = 1;
                        if (multi_parser.token_type === 'TK_SCRIPT') {
                            _beautifier = typeof js_beautify === 'function' && js_beautify;
                        } else if (multi_parser.token_type === 'TK_STYLE') {
                            _beautifier = typeof css_beautify === 'function' && css_beautify;
                        }

                        if (options.indent_scripts === "keep") {
                            script_indent_level = 0;
                        } else if (options.indent_scripts === "separate") {
                            script_indent_level = -multi_parser.indent_level;
                        }

                        var indentation = multi_parser.get_full_indent(script_indent_level);
                        if (_beautifier) {

                            // call the Beautifier if avaliable
                            var Child_options = function() {
                                this.eol = '\n';
                            };
                            Child_options.prototype = options;
                            var child_options = new Child_options();
                            text = _beautifier(text.replace(/^\s*/, indentation), child_options);
                        } else {
                            // simply indent the string otherwise
                            var white = text.match(/^\s*/)[0];
                            var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
                            var reindent = multi_parser.get_full_indent(script_indent_level - _level);
                            text = text.replace(/^\s*/, indentation)
                                .replace(/\r\n|\r|\n/g, '\n' + reindent)
                                .replace(/\s+$/, '');
                        }
                        if (text) {
                            multi_parser.print_token_raw(text);
                            multi_parser.print_newline(true, multi_parser.output);
                        }
                    }
                    multi_parser.current_mode = 'TAG';
                    break;
                default:
                    // We should not be getting here but we don't want to drop input on the floor
                    // Just output the text and move on
                    if (multi_parser.token_text !== '') {
                        multi_parser.print_token(multi_parser.token_text);
                    }
                    break;
            }
            multi_parser.last_token = multi_parser.token_type;
            multi_parser.last_text = multi_parser.token_text;
        }
        var sweet_code = multi_parser.output.join('').replace(/[\r\n\t ]+$/, '');

        // establish end_with_newline
        if (end_with_newline) {
            sweet_code += '\n';
        }

        if (eol !== '\n') {
            sweet_code = sweet_code.replace(/[\n]/g, eol);
        }

        return sweet_code;
    };
}

module.exports.Beautifier = Beautifier;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* jshint curly: false */
// This section of code is taken from acorn.
//
// Acorn was written by Marijn Haverbeke and released under an MIT
// license. The Unicode regexps (for identifiers and whitespace) were
// taken from [Esprima](http://esprima.org) by Ariya Hidayat.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/marijnh/acorn.git

// ## Character categories

// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.

var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/; // jshint ignore:line
var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

// Whether a single character denotes a newline.

exports.newline = /[\n\r\u2028\u2029]/;

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

// in javascript, these two differ
// in python they are the same, different methods are called on them
exports.lineBreak = new RegExp('\r\n|' + exports.newline.source);
exports.allLineBreaks = new RegExp(exports.lineBreak.source, 'g');


// Test whether a given character code starts an identifier.

exports.isIdentifierStart = function(code) {
    // permit $ (36) and @ (64). @ is used in ES7 decorators.
    if (code < 65) return code === 36 || code === 64;
    // 65 through 91 are uppercase letters.
    if (code < 91) return true;
    // permit _ (95).
    if (code < 97) return code === 95;
    // 97 through 123 are lowercase letters.
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
};

// Test whether a given character is part of an identifier.

exports.isIdentifierChar = function(code) {
    if (code < 48) return code === 36;
    if (code < 58) return true;
    if (code < 65) return false;
    if (code < 91) return true;
    if (code < 97) return code === 95;
    if (code < 123) return true;
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

    The MIT License (MIT)

    Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation files
    (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

function mergeOpts(allOptions, targetType) {
    var finalOpts = {};
    var name;

    for (name in allOptions) {
        if (name !== targetType) {
            finalOpts[name] = allOptions[name];
        }
    }

    //merge in the per type settings for the targetType
    if (targetType in allOptions) {
        for (name in allOptions[targetType]) {
            finalOpts[name] = allOptions[targetType][name];
        }
    }
    return finalOpts;
}

module.exports.mergeOpts = mergeOpts;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

    The MIT License (MIT)

    Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation files
    (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

var Beautifier = __webpack_require__(0).Beautifier;

function style_html(html_source, options, js_beautify, css_beautify) {
    var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
    return beautifier.beautify();
}

module.exports = style_html;

/***/ })
/******/ ]);
var style_html = legacy_beautify_html;
/* Footer */
if (typeof define === "function" && define.amd) {
    // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
    define('vscode-html-languageservice/beautify/beautify-html',["require", "./beautify", "./beautify-css"], function(requireamd) {
        var js_beautify = requireamd("./beautify");
        var css_beautify = requireamd("./beautify-css");

        return {
            html_beautify: function(html_source, options) {
                return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
            }
        };
    });
} else if (typeof exports !== "undefined") {
    // Add support for CommonJS. Just put this file somewhere on your require.paths
    // and you will be able to `var html_beautify = require("beautify").html_beautify`.
    var js_beautify = require('./beautify.js');
    var css_beautify = require('./beautify-css.js');

    exports.html_beautify = function(html_source, options) {
        return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
    };
} else if (typeof window !== "undefined") {
    // If we're running a web page and don't have either of the above, add our one global
    window.html_beautify = function(html_source, options) {
        return style_html(html_source, options, window.js_beautify, window.css_beautify);
    };
} else if (typeof global !== "undefined") {
    // If we don't even have window, try global.
    global.html_beautify = function(html_source, options) {
        return style_html(html_source, options, global.js_beautify, global.css_beautify);
    };
}

}());

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/services/htmlFormatter',["require", "exports", "vscode-languageserver-types", "../beautify/beautify-html", "../utils/strings"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    var beautify_html_1 = require("../beautify/beautify-html");
    var strings_1 = require("../utils/strings");
    function format(document, range, options) {
        var value = document.getText();
        var includesEnd = true;
        var initialIndentLevel = 0;
        var tabSize = options.tabSize || 4;
        if (range) {
            var startOffset = document.offsetAt(range.start);
            // include all leading whitespace iff at the beginning of the line
            var extendedStart = startOffset;
            while (extendedStart > 0 && isWhitespace(value, extendedStart - 1)) {
                extendedStart--;
            }
            if (extendedStart === 0 || isEOL(value, extendedStart - 1)) {
                startOffset = extendedStart;
            }
            else {
                // else keep at least one whitespace
                if (extendedStart < startOffset) {
                    startOffset = extendedStart + 1;
                }
            }
            // include all following whitespace until the end of the line
            var endOffset = document.offsetAt(range.end);
            var extendedEnd = endOffset;
            while (extendedEnd < value.length && isWhitespace(value, extendedEnd)) {
                extendedEnd++;
            }
            if (extendedEnd === value.length || isEOL(value, extendedEnd)) {
                endOffset = extendedEnd;
            }
            range = vscode_languageserver_types_1.Range.create(document.positionAt(startOffset), document.positionAt(endOffset));
            includesEnd = endOffset === value.length;
            value = value.substring(startOffset, endOffset);
            if (startOffset !== 0) {
                var startOfLineOffset = document.offsetAt(vscode_languageserver_types_1.Position.create(range.start.line, 0));
                initialIndentLevel = computeIndentLevel(document.getText(), startOfLineOffset, options);
            }
        }
        else {
            range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), document.positionAt(value.length));
        }
        var htmlOptions = {
            indent_size: options.insertSpaces ? tabSize : 1,
            indent_char: options.insertSpaces ? ' ' : '\t',
            wrap_line_length: getFormatOption(options, 'wrapLineLength', 120),
            unformatted: getTagsFormatOption(options, 'unformatted', void 0),
            content_unformatted: getTagsFormatOption(options, 'contentUnformatted', void 0),
            indent_inner_html: getFormatOption(options, 'indentInnerHtml', false),
            preserve_newlines: getFormatOption(options, 'preserveNewLines', true),
            max_preserve_newlines: getFormatOption(options, 'maxPreserveNewLines', 32786),
            indent_handlebars: getFormatOption(options, 'indentHandlebars', false),
            end_with_newline: includesEnd && getFormatOption(options, 'endWithNewline', false),
            extra_liners: getTagsFormatOption(options, 'extraLiners', void 0),
            wrap_attributes: getFormatOption(options, 'wrapAttributes', 'auto'),
            eol: '\n'
        };
        var result = beautify_html_1.html_beautify(value, htmlOptions);
        if (initialIndentLevel > 0) {
            var indent = options.insertSpaces ? strings_1.repeat(' ', tabSize * initialIndentLevel) : strings_1.repeat('\t', initialIndentLevel);
            result = result.split('\n').join('\n' + indent);
            if (range.start.character === 0) {
                result = indent + result; // keep the indent
            }
        }
        return [{
                range: range,
                newText: result
            }];
    }
    exports.format = format;
    function getFormatOption(options, key, dflt) {
        if (options && options.hasOwnProperty(key)) {
            var value = options[key];
            if (value !== null) {
                return value;
            }
        }
        return dflt;
    }
    function getTagsFormatOption(options, key, dflt) {
        var list = getFormatOption(options, key, null);
        if (typeof list === 'string') {
            if (list.length > 0) {
                return list.split(',').map(function (t) { return t.trim().toLowerCase(); });
            }
            return [];
        }
        return dflt;
    }
    function computeIndentLevel(content, offset, options) {
        var i = offset;
        var nChars = 0;
        var tabSize = options.tabSize || 4;
        while (i < content.length) {
            var ch = content.charAt(i);
            if (ch === ' ') {
                nChars++;
            }
            else if (ch === '\t') {
                nChars += tabSize;
            }
            else {
                break;
            }
            i++;
        }
        return Math.floor(nChars / tabSize);
    }
    function getEOL(document) {
        var text = document.getText();
        if (document.lineCount > 1) {
            var to = document.offsetAt(vscode_languageserver_types_1.Position.create(1, 0));
            var from = to;
            while (from > 0 && isEOL(text, from - 1)) {
                from--;
            }
            return text.substr(from, to - from);
        }
        return '\n';
    }
    function isEOL(text, offset) {
        return '\r\n'.indexOf(text.charAt(offset)) !== -1;
    }
    function isWhitespace(text, offset) {
        return ' \t'.indexOf(text.charAt(offset)) !== -1;
    }
});
//# sourceMappingURL=htmlFormatter.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-uri/index',["require", "exports"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function _encode(ch) {
        return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
    }
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
    function encodeURIComponent2(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, _encode);
    }
    function encodeNoop(str) {
        return str.replace(/[#?]/, _encode);
    }
    /**
     * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
     * This class is a simple parser which creates the basic component paths
     * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
     * and encoding.
     *
     *       foo://example.com:8042/over/there?name=ferret#nose
     *       \_/   \______________/\_________/ \_________/ \__/
     *        |           |            |            |        |
     *     scheme     authority       path        query   fragment
     *        |   _____________________|__
     *       / \ /                        \
     *       urn:example:animal:ferret:nose
     *
     *
     */
    var URI = (function () {
        function URI() {
            this._scheme = URI._empty;
            this._authority = URI._empty;
            this._path = URI._empty;
            this._query = URI._empty;
            this._fragment = URI._empty;
            this._formatted = null;
            this._fsPath = null;
        }
        URI.isUri = function (thing) {
            if (thing instanceof URI) {
                return true;
            }
            if (!thing) {
                return false;
            }
            return typeof thing.authority === 'string'
                && typeof thing.fragment === 'string'
                && typeof thing.path === 'string'
                && typeof thing.query === 'string'
                && typeof thing.scheme === 'string';
        };
        Object.defineProperty(URI.prototype, "scheme", {
            /**
             * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part before the first colon.
             */
            get: function () {
                return this._scheme;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "authority", {
            /**
             * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part between the first double slashes and the next slash.
             */
            get: function () {
                return this._authority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "path", {
            /**
             * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "query", {
            /**
             * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._query;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fragment", {
            /**
             * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._fragment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fsPath", {
            // ---- filesystem path -----------------------
            /**
             * Returns a string representing the corresponding file system path of this URI.
             * Will handle UNC paths and normalize windows drive letters to lower-case. Also
             * uses the platform specific path separator. Will *not* validate the path for
             * invalid characters and semantics. Will *not* look at the scheme of this URI.
             */
            get: function () {
                if (!this._fsPath) {
                    var value;
                    if (this._authority && this._path && this.scheme === 'file') {
                        // unc path: file://shares/c$/far/boo
                        value = "//" + this._authority + this._path;
                    }
                    else if (URI._driveLetterPath.test(this._path)) {
                        // windows drive letter: file:///c:/far/boo
                        value = this._path[1].toLowerCase() + this._path.substr(2);
                    }
                    else {
                        // other path
                        value = this._path;
                    }
                    if (isWindows) {
                        value = value.replace(/\//g, '\\');
                    }
                    this._fsPath = value;
                }
                return this._fsPath;
            },
            enumerable: true,
            configurable: true
        });
        // ---- modify to new -------------------------
        URI.prototype.with = function (change) {
            if (!change) {
                return this;
            }
            var scheme = change.scheme, authority = change.authority, path = change.path, query = change.query, fragment = change.fragment;
            if (scheme === void 0) {
                scheme = this.scheme;
            }
            else if (scheme === null) {
                scheme = '';
            }
            if (authority === void 0) {
                authority = this.authority;
            }
            else if (authority === null) {
                authority = '';
            }
            if (path === void 0) {
                path = this.path;
            }
            else if (path === null) {
                path = '';
            }
            if (query === void 0) {
                query = this.query;
            }
            else if (query === null) {
                query = '';
            }
            if (fragment === void 0) {
                fragment = this.fragment;
            }
            else if (fragment === null) {
                fragment = '';
            }
            if (scheme === this.scheme
                && authority === this.authority
                && path === this.path
                && query === this.query
                && fragment === this.fragment) {
                return this;
            }
            var ret = new URI();
            ret._scheme = scheme;
            ret._authority = authority;
            ret._path = path;
            ret._query = query;
            ret._fragment = fragment;
            URI._validate(ret);
            return ret;
        };
        // ---- parse & validate ------------------------
        URI.parse = function (value) {
            var ret = new URI();
            var data = URI._parseComponents(value);
            ret._scheme = data.scheme;
            ret._authority = decodeURIComponent(data.authority);
            ret._path = decodeURIComponent(data.path);
            ret._query = decodeURIComponent(data.query);
            ret._fragment = decodeURIComponent(data.fragment);
            URI._validate(ret);
            return ret;
        };
        URI.file = function (path) {
            var ret = new URI();
            ret._scheme = 'file';
            // normalize to fwd-slashes on windows,
            // on other systems bwd-slaches are valid
            // filename character, eg /f\oo/ba\r.txt
            if (isWindows) {
                path = path.replace(/\\/g, URI._slash);
            }
            // check for authority as used in UNC shares
            // or use the path as given
            if (path[0] === URI._slash && path[0] === path[1]) {
                var idx = path.indexOf(URI._slash, 2);
                if (idx === -1) {
                    ret._authority = path.substring(2);
                }
                else {
                    ret._authority = path.substring(2, idx);
                    ret._path = path.substring(idx);
                }
            }
            else {
                ret._path = path;
            }
            // Ensure that path starts with a slash
            // or that it is at least a slash
            if (ret._path[0] !== URI._slash) {
                ret._path = URI._slash + ret._path;
            }
            URI._validate(ret);
            return ret;
        };
        URI._parseComponents = function (value) {
            var ret = {
                scheme: URI._empty,
                authority: URI._empty,
                path: URI._empty,
                query: URI._empty,
                fragment: URI._empty,
            };
            var match = URI._regexp.exec(value);
            if (match) {
                ret.scheme = match[2] || ret.scheme;
                ret.authority = match[4] || ret.authority;
                ret.path = match[5] || ret.path;
                ret.query = match[7] || ret.query;
                ret.fragment = match[9] || ret.fragment;
            }
            return ret;
        };
        URI.from = function (components) {
            return new URI().with(components);
        };
        URI._validate = function (ret) {
            // scheme, https://tools.ietf.org/html/rfc3986#section-3.1
            // ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
            if (ret.scheme && !URI._schemePattern.test(ret.scheme)) {
                throw new Error('[UriError]: Scheme contains illegal characters.');
            }
            // path, http://tools.ietf.org/html/rfc3986#section-3.3
            // If a URI contains an authority component, then the path component
            // must either be empty or begin with a slash ("/") character.  If a URI
            // does not contain an authority component, then the path cannot begin
            // with two slash characters ("//").
            if (ret.path) {
                if (ret.authority) {
                    if (!URI._singleSlashStart.test(ret.path)) {
                        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
                    }
                }
                else {
                    if (URI._doubleSlashStart.test(ret.path)) {
                        throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
                    }
                }
            }
        };
        // ---- printing/externalize ---------------------------
        /**
         *
         * @param skipEncoding Do not encode the result, default is `false`
         */
        URI.prototype.toString = function (skipEncoding) {
            if (skipEncoding === void 0) { skipEncoding = false; }
            if (!skipEncoding) {
                if (!this._formatted) {
                    this._formatted = URI._asFormatted(this, false);
                }
                return this._formatted;
            }
            else {
                // we don't cache that
                return URI._asFormatted(this, true);
            }
        };
        URI._asFormatted = function (uri, skipEncoding) {
            var encoder = !skipEncoding
                ? encodeURIComponent2
                : encodeNoop;
            var parts = [];
            var scheme = uri.scheme, authority = uri.authority, path = uri.path, query = uri.query, fragment = uri.fragment;
            if (scheme) {
                parts.push(scheme, ':');
            }
            if (authority || scheme === 'file') {
                parts.push('//');
            }
            if (authority) {
                authority = authority.toLowerCase();
                var idx = authority.indexOf(':');
                if (idx === -1) {
                    parts.push(encoder(authority));
                }
                else {
                    parts.push(encoder(authority.substr(0, idx)), authority.substr(idx));
                }
            }
            if (path) {
                // lower-case windows drive letters in /C:/fff or C:/fff
                var m = URI._upperCaseDrive.exec(path);
                if (m) {
                    if (m[1]) {
                        path = '/' + m[2].toLowerCase() + path.substr(3); // "/c:".length === 3
                    }
                    else {
                        path = m[2].toLowerCase() + path.substr(2); // // "c:".length === 2
                    }
                }
                // encode every segement but not slashes
                // make sure that # and ? are always encoded
                // when occurring in paths - otherwise the result
                // cannot be parsed back again
                var lastIdx = 0;
                while (true) {
                    var idx = path.indexOf(URI._slash, lastIdx);
                    if (idx === -1) {
                        parts.push(encoder(path.substring(lastIdx)));
                        break;
                    }
                    parts.push(encoder(path.substring(lastIdx, idx)), URI._slash);
                    lastIdx = idx + 1;
                }
                ;
            }
            if (query) {
                parts.push('?', encoder(query));
            }
            if (fragment) {
                parts.push('#', encoder(fragment));
            }
            return parts.join(URI._empty);
        };
        URI.prototype.toJSON = function () {
            var res = {
                fsPath: this.fsPath,
                external: this.toString(),
                $mid: 1
            };
            if (this.path) {
                res.path = this.path;
            }
            if (this.scheme) {
                res.scheme = this.scheme;
            }
            if (this.authority) {
                res.authority = this.authority;
            }
            if (this.query) {
                res.query = this.query;
            }
            if (this.fragment) {
                res.fragment = this.fragment;
            }
            return res;
        };
        URI.revive = function (data) {
            var result = new URI();
            result._scheme = data.scheme || URI._empty;
            result._authority = data.authority || URI._empty;
            result._path = data.path || URI._empty;
            result._query = data.query || URI._empty;
            result._fragment = data.fragment || URI._empty;
            result._fsPath = data.fsPath;
            result._formatted = data.external;
            URI._validate(result);
            return result;
        };
        return URI;
    }());
    URI._empty = '';
    URI._slash = '/';
    URI._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    URI._driveLetterPath = /^\/[a-zA-z]:/;
    URI._upperCaseDrive = /^(\/)?([A-Z]:)/;
    URI._schemePattern = /^\w[\w\d+.-]*$/;
    URI._singleSlashStart = /^\//;
    URI._doubleSlashStart = /^\/\//;
    exports.default = URI;
    var isWindows;
    if (typeof process === 'object') {
        isWindows = process.platform === 'win32';
    }
    else if (typeof navigator === 'object') {
        var userAgent = navigator.userAgent;
        isWindows = userAgent.indexOf('Windows') >= 0;
    }
});

define('vscode-uri', ['vscode-uri/index'], function (main) { return main; });

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/services/htmlLinks',["require", "exports", "../parser/htmlScanner", "vscode-languageserver-types", "../utils/strings", "vscode-uri"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var htmlScanner_1 = require("../parser/htmlScanner");
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    var strings = require("../utils/strings");
    var vscode_uri_1 = require("vscode-uri");
    function normalizeRef(url, languageId) {
        var first = url[0];
        var last = url[url.length - 1];
        if (first === last && (first === '\'' || first === '\"')) {
            url = url.substr(1, url.length - 2);
        }
        if (languageId === 'razor' && url[0] === '~') {
            url = url.substr(1);
        }
        return url;
    }
    function validateRef(url, languageId) {
        if (!url.length) {
            return false;
        }
        if (languageId === 'handlebars' && /{{.*}}/.test(url)) {
            return false;
        }
        if (languageId === 'razor' && /@/.test(url)) {
            return false;
        }
        try {
            return !!vscode_uri_1.default.parse(url);
        }
        catch (e) {
            return false;
        }
    }
    function getWorkspaceUrl(documentUri, tokenContent, documentContext, base) {
        if (/^\s*javascript\:/i.test(tokenContent) || /^\s*\#/i.test(tokenContent) || /[\n\r]/.test(tokenContent)) {
            return null;
        }
        tokenContent = tokenContent.replace(/^\s*/g, '');
        if (/^https?:\/\//i.test(tokenContent) || /^file:\/\//i.test(tokenContent)) {
            // Absolute link that needs no treatment
            return tokenContent;
        }
        if (/^\/\//i.test(tokenContent)) {
            // Absolute link (that does not name the protocol)
            var pickedScheme = strings.startsWith(documentUri, 'https://') ? 'https' : 'http';
            return pickedScheme + ':' + tokenContent.replace(/^\s*/g, '');
        }
        if (documentContext) {
            return documentContext.resolveReference(tokenContent, base || documentUri);
        }
        return tokenContent;
    }
    function createLink(document, documentContext, attributeValue, startOffset, endOffset, base) {
        var tokenContent = normalizeRef(attributeValue, document.languageId);
        if (!validateRef(tokenContent, document.languageId)) {
            return null;
        }
        if (tokenContent.length < attributeValue.length) {
            startOffset++;
            endOffset--;
        }
        var workspaceUrl = getWorkspaceUrl(document.uri, tokenContent, documentContext, base);
        if (!workspaceUrl || !isValidURI(workspaceUrl)) {
            return null;
        }
        return {
            range: vscode_languageserver_types_1.Range.create(document.positionAt(startOffset), document.positionAt(endOffset)),
            target: workspaceUrl
        };
    }
    function isValidURI(uri) {
        try {
            vscode_uri_1.default.parse(uri);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    function findDocumentLinks(document, documentContext) {
        var newLinks = [];
        var rootAbsoluteUrl = null;
        var scanner = htmlScanner_1.createScanner(document.getText(), 0);
        var token = scanner.scan();
        var afterHrefOrSrc = false;
        var afterBase = false;
        var base = void 0;
        while (token !== htmlScanner_1.TokenType.EOS) {
            switch (token) {
                case htmlScanner_1.TokenType.StartTag:
                    if (!base) {
                        var tagName = scanner.getTokenText().toLowerCase();
                        afterBase = tagName === 'base';
                    }
                    break;
                case htmlScanner_1.TokenType.AttributeName:
                    var attributeName = scanner.getTokenText().toLowerCase();
                    afterHrefOrSrc = attributeName === 'src' || attributeName === 'href';
                    break;
                case htmlScanner_1.TokenType.AttributeValue:
                    if (afterHrefOrSrc) {
                        var attributeValue = scanner.getTokenText();
                        if (!afterBase) {
                            var link = createLink(document, documentContext, attributeValue, scanner.getTokenOffset(), scanner.getTokenEnd(), base);
                            if (link) {
                                newLinks.push(link);
                            }
                        }
                        if (afterBase && typeof base === 'undefined') {
                            base = normalizeRef(attributeValue, document.languageId);
                            if (base && documentContext) {
                                base = documentContext.resolveReference(base, document.uri);
                            }
                        }
                        afterBase = false;
                        afterHrefOrSrc = false;
                    }
                    break;
            }
            token = scanner.scan();
        }
        return newLinks;
    }
    exports.findDocumentLinks = findDocumentLinks;
});
//# sourceMappingURL=htmlLinks.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/services/htmlHighlighting',["require", "exports", "../parser/htmlScanner", "vscode-languageserver-types"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var htmlScanner_1 = require("../parser/htmlScanner");
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    function findDocumentHighlights(document, position, htmlDocument) {
        var offset = document.offsetAt(position);
        var node = htmlDocument.findNodeAt(offset);
        if (!node.tag) {
            return [];
        }
        var result = [];
        var startTagRange = getTagNameRange(htmlScanner_1.TokenType.StartTag, document, node.start);
        var endTagRange = typeof node.endTagStart === 'number' && getTagNameRange(htmlScanner_1.TokenType.EndTag, document, node.endTagStart);
        if (startTagRange && covers(startTagRange, position) || endTagRange && covers(endTagRange, position)) {
            if (startTagRange) {
                result.push({ kind: vscode_languageserver_types_1.DocumentHighlightKind.Read, range: startTagRange });
            }
            if (endTagRange) {
                result.push({ kind: vscode_languageserver_types_1.DocumentHighlightKind.Read, range: endTagRange });
            }
        }
        return result;
    }
    exports.findDocumentHighlights = findDocumentHighlights;
    function isBeforeOrEqual(pos1, pos2) {
        return pos1.line < pos2.line || (pos1.line === pos2.line && pos1.character <= pos2.character);
    }
    function covers(range, position) {
        return isBeforeOrEqual(range.start, position) && isBeforeOrEqual(position, range.end);
    }
    function getTagNameRange(tokenType, document, startOffset) {
        var scanner = htmlScanner_1.createScanner(document.getText(), startOffset);
        var token = scanner.scan();
        while (token !== htmlScanner_1.TokenType.EOS && token !== tokenType) {
            token = scanner.scan();
        }
        if (token !== htmlScanner_1.TokenType.EOS) {
            return { start: document.positionAt(scanner.getTokenOffset()), end: document.positionAt(scanner.getTokenEnd()) };
        }
        return null;
    }
});
//# sourceMappingURL=htmlHighlighting.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/services/htmlSymbolsProvider',["require", "exports", "vscode-languageserver-types"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    function findDocumentSymbols(document, htmlDocument) {
        var symbols = [];
        htmlDocument.roots.forEach(function (node) {
            provideFileSymbolsInternal(document, node, '', symbols);
        });
        return symbols;
    }
    exports.findDocumentSymbols = findDocumentSymbols;
    function provideFileSymbolsInternal(document, node, container, symbols) {
        var name = nodeToName(node);
        var location = vscode_languageserver_types_1.Location.create(document.uri, vscode_languageserver_types_1.Range.create(document.positionAt(node.start), document.positionAt(node.end)));
        var symbol = {
            name: name,
            location: location,
            containerName: container,
            kind: vscode_languageserver_types_1.SymbolKind.Field
        };
        symbols.push(symbol);
        node.children.forEach(function (child) {
            provideFileSymbolsInternal(document, child, name, symbols);
        });
    }
    function nodeToName(node) {
        var name = node.tag;
        if (node.attributes) {
            var id = node.attributes['id'];
            var classes = node.attributes['class'];
            if (id) {
                name += "#" + id.replace(/[\"\']/g, '');
            }
            if (classes) {
                name += classes.replace(/[\"\']/g, '').split(/\s+/).map(function (className) { return "." + className; }).join('');
            }
        }
        return name || '?';
    }
});
//# sourceMappingURL=htmlSymbolsProvider.js.map;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define('vscode-html-languageservice/htmlLanguageService',["require", "exports", "./parser/htmlScanner", "./parser/htmlParser", "./services/htmlCompletion", "./services/htmlHover", "./services/htmlFormatter", "./services/htmlLinks", "./services/htmlHighlighting", "./services/htmlSymbolsProvider", "vscode-languageserver-types"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var htmlScanner_1 = require("./parser/htmlScanner");
    var htmlParser_1 = require("./parser/htmlParser");
    var htmlCompletion_1 = require("./services/htmlCompletion");
    var htmlHover_1 = require("./services/htmlHover");
    var htmlFormatter_1 = require("./services/htmlFormatter");
    var htmlLinks_1 = require("./services/htmlLinks");
    var htmlHighlighting_1 = require("./services/htmlHighlighting");
    var htmlSymbolsProvider_1 = require("./services/htmlSymbolsProvider");
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    exports.TextDocument = vscode_languageserver_types_1.TextDocument;
    exports.Position = vscode_languageserver_types_1.Position;
    exports.CompletionItem = vscode_languageserver_types_1.CompletionItem;
    exports.CompletionList = vscode_languageserver_types_1.CompletionList;
    exports.Range = vscode_languageserver_types_1.Range;
    exports.SymbolInformation = vscode_languageserver_types_1.SymbolInformation;
    exports.Diagnostic = vscode_languageserver_types_1.Diagnostic;
    exports.TextEdit = vscode_languageserver_types_1.TextEdit;
    exports.DocumentHighlight = vscode_languageserver_types_1.DocumentHighlight;
    exports.FormattingOptions = vscode_languageserver_types_1.FormattingOptions;
    exports.MarkedString = vscode_languageserver_types_1.MarkedString;
    exports.DocumentLink = vscode_languageserver_types_1.DocumentLink;
    var TokenType;
    (function (TokenType) {
        TokenType[TokenType["StartCommentTag"] = 0] = "StartCommentTag";
        TokenType[TokenType["Comment"] = 1] = "Comment";
        TokenType[TokenType["EndCommentTag"] = 2] = "EndCommentTag";
        TokenType[TokenType["StartTagOpen"] = 3] = "StartTagOpen";
        TokenType[TokenType["StartTagClose"] = 4] = "StartTagClose";
        TokenType[TokenType["StartTagSelfClose"] = 5] = "StartTagSelfClose";
        TokenType[TokenType["StartTag"] = 6] = "StartTag";
        TokenType[TokenType["EndTagOpen"] = 7] = "EndTagOpen";
        TokenType[TokenType["EndTagClose"] = 8] = "EndTagClose";
        TokenType[TokenType["EndTag"] = 9] = "EndTag";
        TokenType[TokenType["DelimiterAssign"] = 10] = "DelimiterAssign";
        TokenType[TokenType["AttributeName"] = 11] = "AttributeName";
        TokenType[TokenType["AttributeValue"] = 12] = "AttributeValue";
        TokenType[TokenType["StartDoctypeTag"] = 13] = "StartDoctypeTag";
        TokenType[TokenType["Doctype"] = 14] = "Doctype";
        TokenType[TokenType["EndDoctypeTag"] = 15] = "EndDoctypeTag";
        TokenType[TokenType["Content"] = 16] = "Content";
        TokenType[TokenType["Whitespace"] = 17] = "Whitespace";
        TokenType[TokenType["Unknown"] = 18] = "Unknown";
        TokenType[TokenType["Script"] = 19] = "Script";
        TokenType[TokenType["Styles"] = 20] = "Styles";
        TokenType[TokenType["EOS"] = 21] = "EOS";
    })(TokenType = exports.TokenType || (exports.TokenType = {}));
    var ScannerState;
    (function (ScannerState) {
        ScannerState[ScannerState["WithinContent"] = 0] = "WithinContent";
        ScannerState[ScannerState["AfterOpeningStartTag"] = 1] = "AfterOpeningStartTag";
        ScannerState[ScannerState["AfterOpeningEndTag"] = 2] = "AfterOpeningEndTag";
        ScannerState[ScannerState["WithinDoctype"] = 3] = "WithinDoctype";
        ScannerState[ScannerState["WithinTag"] = 4] = "WithinTag";
        ScannerState[ScannerState["WithinEndTag"] = 5] = "WithinEndTag";
        ScannerState[ScannerState["WithinComment"] = 6] = "WithinComment";
        ScannerState[ScannerState["WithinScriptContent"] = 7] = "WithinScriptContent";
        ScannerState[ScannerState["WithinStyleContent"] = 8] = "WithinStyleContent";
        ScannerState[ScannerState["AfterAttributeName"] = 9] = "AfterAttributeName";
        ScannerState[ScannerState["BeforeAttributeValue"] = 10] = "BeforeAttributeValue";
    })(ScannerState = exports.ScannerState || (exports.ScannerState = {}));
    function getLanguageService() {
        var htmlCompletion = new htmlCompletion_1.HTMLCompletion();
        return {
            createScanner: htmlScanner_1.createScanner,
            parseHTMLDocument: function (document) { return htmlParser_1.parse(document.getText()); },
            doComplete: htmlCompletion.doComplete.bind(htmlCompletion),
            setCompletionParticipants: htmlCompletion.setCompletionParticipants.bind(htmlCompletion),
            doHover: htmlHover_1.doHover,
            format: htmlFormatter_1.format,
            findDocumentHighlights: htmlHighlighting_1.findDocumentHighlights,
            findDocumentLinks: htmlLinks_1.findDocumentLinks,
            findDocumentSymbols: htmlSymbolsProvider_1.findDocumentSymbols,
            doTagComplete: htmlCompletion.doTagComplete.bind(htmlCompletion),
        };
    }
    exports.getLanguageService = getLanguageService;
});
//# sourceMappingURL=htmlLanguageService.js.map;
define('vscode-html-languageservice', ['vscode-html-languageservice/htmlLanguageService'], function (main) { return main; });

define('vs/language/html/htmlWorker',["require", "exports", "vscode-html-languageservice", "vscode-languageserver-types"], function (require, exports, htmlService, ls) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise = monaco.Promise;
    var HTMLWorker = /** @class */ (function () {
        function HTMLWorker(ctx, createData) {
            this._ctx = ctx;
            this._languageSettings = createData.languageSettings;
            this._languageId = createData.languageId;
            this._languageService = htmlService.getLanguageService();
        }
        HTMLWorker.prototype.doValidation = function (uri) {
            // not yet suported
            return Promise.as([]);
        };
        HTMLWorker.prototype.doComplete = function (uri, position) {
            var document = this._getTextDocument(uri);
            var htmlDocument = this._languageService.parseHTMLDocument(document);
            return Promise.as(this._languageService.doComplete(document, position, htmlDocument, this._languageSettings && this._languageSettings.suggest));
        };
        HTMLWorker.prototype.format = function (uri, range, options) {
            var document = this._getTextDocument(uri);
            var textEdits = this._languageService.format(document, range, this._languageSettings && this._languageSettings.format);
            return Promise.as(textEdits);
        };
        HTMLWorker.prototype.findDocumentHighlights = function (uri, position) {
            var document = this._getTextDocument(uri);
            var htmlDocument = this._languageService.parseHTMLDocument(document);
            var highlights = this._languageService.findDocumentHighlights(document, position, htmlDocument);
            return Promise.as(highlights);
        };
        HTMLWorker.prototype.findDocumentLinks = function (uri) {
            var document = this._getTextDocument(uri);
            var links = this._languageService.findDocumentLinks(document, null);
            return Promise.as(links);
        };
        HTMLWorker.prototype._getTextDocument = function (uri) {
            var models = this._ctx.getMirrorModels();
            for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
                var model = models_1[_i];
                if (model.uri.toString() === uri) {
                    return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
                }
            }
            return null;
        };
        return HTMLWorker;
    }());
    exports.HTMLWorker = HTMLWorker;
    function create(ctx, createData) {
        return new HTMLWorker(ctx, createData);
    }
    exports.create = create;
});

