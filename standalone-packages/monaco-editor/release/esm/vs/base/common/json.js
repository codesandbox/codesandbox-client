/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export var ScanError;
(function (ScanError) {
    ScanError[ScanError["None"] = 0] = "None";
    ScanError[ScanError["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
    ScanError[ScanError["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
    ScanError[ScanError["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
    ScanError[ScanError["InvalidUnicode"] = 4] = "InvalidUnicode";
    ScanError[ScanError["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
    ScanError[ScanError["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
export var SyntaxKind;
(function (SyntaxKind) {
    SyntaxKind[SyntaxKind["Unknown"] = 0] = "Unknown";
    SyntaxKind[SyntaxKind["OpenBraceToken"] = 1] = "OpenBraceToken";
    SyntaxKind[SyntaxKind["CloseBraceToken"] = 2] = "CloseBraceToken";
    SyntaxKind[SyntaxKind["OpenBracketToken"] = 3] = "OpenBracketToken";
    SyntaxKind[SyntaxKind["CloseBracketToken"] = 4] = "CloseBracketToken";
    SyntaxKind[SyntaxKind["CommaToken"] = 5] = "CommaToken";
    SyntaxKind[SyntaxKind["ColonToken"] = 6] = "ColonToken";
    SyntaxKind[SyntaxKind["NullKeyword"] = 7] = "NullKeyword";
    SyntaxKind[SyntaxKind["TrueKeyword"] = 8] = "TrueKeyword";
    SyntaxKind[SyntaxKind["FalseKeyword"] = 9] = "FalseKeyword";
    SyntaxKind[SyntaxKind["StringLiteral"] = 10] = "StringLiteral";
    SyntaxKind[SyntaxKind["NumericLiteral"] = 11] = "NumericLiteral";
    SyntaxKind[SyntaxKind["LineCommentTrivia"] = 12] = "LineCommentTrivia";
    SyntaxKind[SyntaxKind["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
    SyntaxKind[SyntaxKind["LineBreakTrivia"] = 14] = "LineBreakTrivia";
    SyntaxKind[SyntaxKind["Trivia"] = 15] = "Trivia";
    SyntaxKind[SyntaxKind["EOF"] = 16] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
/**
 * Creates a JSON scanner on the given text.
 * If ignoreTrivia is set, whitespaces or comments are ignored.
 */
export function createScanner(text, ignoreTrivia) {
    if (ignoreTrivia === void 0) { ignoreTrivia = false; }
    var pos = 0, len = text.length, value = '', tokenOffset = 0, token = SyntaxKind.Unknown, scanError = ScanError.None;
    function scanHexDigits(count, exact) {
        var digits = 0;
        var value = 0;
        while (digits < count || !exact) {
            var ch = text.charCodeAt(pos);
            if (ch >= 48 /* _0 */ && ch <= 57 /* _9 */) {
                value = value * 16 + ch - 48 /* _0 */;
            }
            else if (ch >= 65 /* A */ && ch <= 70 /* F */) {
                value = value * 16 + ch - 65 /* A */ + 10;
            }
            else if (ch >= 97 /* a */ && ch <= 102 /* f */) {
                value = value * 16 + ch - 97 /* a */ + 10;
            }
            else {
                break;
            }
            pos++;
            digits++;
        }
        if (digits < count) {
            value = -1;
        }
        return value;
    }
    function setPosition(newPosition) {
        pos = newPosition;
        value = '';
        tokenOffset = 0;
        token = SyntaxKind.Unknown;
        scanError = ScanError.None;
    }
    function scanNumber() {
        var start = pos;
        if (text.charCodeAt(pos) === 48 /* _0 */) {
            pos++;
        }
        else {
            pos++;
            while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                pos++;
            }
        }
        if (pos < text.length && text.charCodeAt(pos) === 46 /* dot */) {
            pos++;
            if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                pos++;
                while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                }
            }
            else {
                scanError = ScanError.UnexpectedEndOfNumber;
                return text.substring(start, pos);
            }
        }
        var end = pos;
        if (pos < text.length && (text.charCodeAt(pos) === 69 /* E */ || text.charCodeAt(pos) === 101 /* e */)) {
            pos++;
            if (pos < text.length && text.charCodeAt(pos) === 43 /* plus */ || text.charCodeAt(pos) === 45 /* minus */) {
                pos++;
            }
            if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                pos++;
                while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                }
                end = pos;
            }
            else {
                scanError = ScanError.UnexpectedEndOfNumber;
            }
        }
        return text.substring(start, end);
    }
    function scanString() {
        var result = '', start = pos;
        while (true) {
            if (pos >= len) {
                result += text.substring(start, pos);
                scanError = ScanError.UnexpectedEndOfString;
                break;
            }
            var ch = text.charCodeAt(pos);
            if (ch === 34 /* doubleQuote */) {
                result += text.substring(start, pos);
                pos++;
                break;
            }
            if (ch === 92 /* backslash */) {
                result += text.substring(start, pos);
                pos++;
                if (pos >= len) {
                    scanError = ScanError.UnexpectedEndOfString;
                    break;
                }
                ch = text.charCodeAt(pos++);
                switch (ch) {
                    case 34 /* doubleQuote */:
                        result += '\"';
                        break;
                    case 92 /* backslash */:
                        result += '\\';
                        break;
                    case 47 /* slash */:
                        result += '/';
                        break;
                    case 98 /* b */:
                        result += '\b';
                        break;
                    case 102 /* f */:
                        result += '\f';
                        break;
                    case 110 /* n */:
                        result += '\n';
                        break;
                    case 114 /* r */:
                        result += '\r';
                        break;
                    case 116 /* t */:
                        result += '\t';
                        break;
                    case 117 /* u */:
                        var ch_1 = scanHexDigits(4, true);
                        if (ch_1 >= 0) {
                            result += String.fromCharCode(ch_1);
                        }
                        else {
                            scanError = ScanError.InvalidUnicode;
                        }
                        break;
                    default:
                        scanError = ScanError.InvalidEscapeCharacter;
                }
                start = pos;
                continue;
            }
            if (ch >= 0 && ch <= 0x1f) {
                if (isLineBreak(ch)) {
                    result += text.substring(start, pos);
                    scanError = ScanError.UnexpectedEndOfString;
                    break;
                }
                else {
                    scanError = ScanError.InvalidCharacter;
                    // mark as error but continue with string
                }
            }
            pos++;
        }
        return result;
    }
    function scanNext() {
        value = '';
        scanError = ScanError.None;
        tokenOffset = pos;
        if (pos >= len) {
            // at the end
            tokenOffset = len;
            return token = SyntaxKind.EOF;
        }
        var code = text.charCodeAt(pos);
        // trivia: whitespace
        if (isWhiteSpace(code)) {
            do {
                pos++;
                value += String.fromCharCode(code);
                code = text.charCodeAt(pos);
            } while (isWhiteSpace(code));
            return token = SyntaxKind.Trivia;
        }
        // trivia: newlines
        if (isLineBreak(code)) {
            pos++;
            value += String.fromCharCode(code);
            if (code === 13 /* carriageReturn */ && text.charCodeAt(pos) === 10 /* lineFeed */) {
                pos++;
                value += '\n';
            }
            return token = SyntaxKind.LineBreakTrivia;
        }
        switch (code) {
            // tokens: []{}:,
            case 123 /* openBrace */:
                pos++;
                return token = SyntaxKind.OpenBraceToken;
            case 125 /* closeBrace */:
                pos++;
                return token = SyntaxKind.CloseBraceToken;
            case 91 /* openBracket */:
                pos++;
                return token = SyntaxKind.OpenBracketToken;
            case 93 /* closeBracket */:
                pos++;
                return token = SyntaxKind.CloseBracketToken;
            case 58 /* colon */:
                pos++;
                return token = SyntaxKind.ColonToken;
            case 44 /* comma */:
                pos++;
                return token = SyntaxKind.CommaToken;
            // strings
            case 34 /* doubleQuote */:
                pos++;
                value = scanString();
                return token = SyntaxKind.StringLiteral;
            // comments
            case 47 /* slash */:
                var start = pos - 1;
                // Single-line comment
                if (text.charCodeAt(pos + 1) === 47 /* slash */) {
                    pos += 2;
                    while (pos < len) {
                        if (isLineBreak(text.charCodeAt(pos))) {
                            break;
                        }
                        pos++;
                    }
                    value = text.substring(start, pos);
                    return token = SyntaxKind.LineCommentTrivia;
                }
                // Multi-line comment
                if (text.charCodeAt(pos + 1) === 42 /* asterisk */) {
                    pos += 2;
                    var safeLength = len - 1; // For lookahead.
                    var commentClosed = false;
                    while (pos < safeLength) {
                        var ch = text.charCodeAt(pos);
                        if (ch === 42 /* asterisk */ && text.charCodeAt(pos + 1) === 47 /* slash */) {
                            pos += 2;
                            commentClosed = true;
                            break;
                        }
                        pos++;
                    }
                    if (!commentClosed) {
                        pos++;
                        scanError = ScanError.UnexpectedEndOfComment;
                    }
                    value = text.substring(start, pos);
                    return token = SyntaxKind.BlockCommentTrivia;
                }
                // just a single slash
                value += String.fromCharCode(code);
                pos++;
                return token = SyntaxKind.Unknown;
            // numbers
            case 45 /* minus */:
                value += String.fromCharCode(code);
                pos++;
                if (pos === len || !isDigit(text.charCodeAt(pos))) {
                    return token = SyntaxKind.Unknown;
                }
            // found a minus, followed by a number so
            // we fall through to proceed with scanning
            // numbers
            case 48 /* _0 */:
            case 49 /* _1 */:
            case 50 /* _2 */:
            case 51 /* _3 */:
            case 52 /* _4 */:
            case 53 /* _5 */:
            case 54 /* _6 */:
            case 55 /* _7 */:
            case 56 /* _8 */:
            case 57 /* _9 */:
                value += scanNumber();
                return token = SyntaxKind.NumericLiteral;
            // literals and unknown symbols
            default:
                // is a literal? Read the full word.
                while (pos < len && isUnknownContentCharacter(code)) {
                    pos++;
                    code = text.charCodeAt(pos);
                }
                if (tokenOffset !== pos) {
                    value = text.substring(tokenOffset, pos);
                    // keywords: true, false, null
                    switch (value) {
                        case 'true': return token = SyntaxKind.TrueKeyword;
                        case 'false': return token = SyntaxKind.FalseKeyword;
                        case 'null': return token = SyntaxKind.NullKeyword;
                    }
                    return token = SyntaxKind.Unknown;
                }
                // some
                value += String.fromCharCode(code);
                pos++;
                return token = SyntaxKind.Unknown;
        }
    }
    function isUnknownContentCharacter(code) {
        if (isWhiteSpace(code) || isLineBreak(code)) {
            return false;
        }
        switch (code) {
            case 125 /* closeBrace */:
            case 93 /* closeBracket */:
            case 123 /* openBrace */:
            case 91 /* openBracket */:
            case 34 /* doubleQuote */:
            case 58 /* colon */:
            case 44 /* comma */:
            case 47 /* slash */:
                return false;
        }
        return true;
    }
    function scanNextNonTrivia() {
        var result;
        do {
            result = scanNext();
        } while (result >= SyntaxKind.LineCommentTrivia && result <= SyntaxKind.Trivia);
        return result;
    }
    return {
        setPosition: setPosition,
        getPosition: function () { return pos; },
        scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
        getToken: function () { return token; },
        getTokenValue: function () { return value; },
        getTokenOffset: function () { return tokenOffset; },
        getTokenLength: function () { return pos - tokenOffset; },
        getTokenError: function () { return scanError; }
    };
}
function isWhiteSpace(ch) {
    return ch === 32 /* space */ || ch === 9 /* tab */ || ch === 11 /* verticalTab */ || ch === 12 /* formFeed */ ||
        ch === 160 /* nonBreakingSpace */ || ch === 5760 /* ogham */ || ch >= 8192 /* enQuad */ && ch <= 8203 /* zeroWidthSpace */ ||
        ch === 8239 /* narrowNoBreakSpace */ || ch === 8287 /* mathematicalSpace */ || ch === 12288 /* ideographicSpace */ || ch === 65279 /* byteOrderMark */;
}
function isLineBreak(ch) {
    return ch === 10 /* lineFeed */ || ch === 13 /* carriageReturn */ || ch === 8232 /* lineSeparator */ || ch === 8233 /* paragraphSeparator */;
}
function isDigit(ch) {
    return ch >= 48 /* _0 */ && ch <= 57 /* _9 */;
}
export var ParseErrorCode;
(function (ParseErrorCode) {
    ParseErrorCode[ParseErrorCode["InvalidSymbol"] = 0] = "InvalidSymbol";
    ParseErrorCode[ParseErrorCode["InvalidNumberFormat"] = 1] = "InvalidNumberFormat";
    ParseErrorCode[ParseErrorCode["PropertyNameExpected"] = 2] = "PropertyNameExpected";
    ParseErrorCode[ParseErrorCode["ValueExpected"] = 3] = "ValueExpected";
    ParseErrorCode[ParseErrorCode["ColonExpected"] = 4] = "ColonExpected";
    ParseErrorCode[ParseErrorCode["CommaExpected"] = 5] = "CommaExpected";
    ParseErrorCode[ParseErrorCode["CloseBraceExpected"] = 6] = "CloseBraceExpected";
    ParseErrorCode[ParseErrorCode["CloseBracketExpected"] = 7] = "CloseBracketExpected";
    ParseErrorCode[ParseErrorCode["EndOfFileExpected"] = 8] = "EndOfFileExpected";
})(ParseErrorCode || (ParseErrorCode = {}));
function getLiteralNodeType(value) {
    switch (typeof value) {
        case 'boolean': return 'boolean';
        case 'number': return 'number';
        case 'string': return 'string';
        default: return 'null';
    }
}
/**
 * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 * Therefore always check the errors list to find out if the input was valid.
 */
export function parse(text, errors, options) {
    if (errors === void 0) { errors = []; }
    var currentProperty = null;
    var currentParent = [];
    var previousParents = [];
    function onValue(value) {
        if (Array.isArray(currentParent)) {
            currentParent.push(value);
        }
        else if (currentProperty) {
            currentParent[currentProperty] = value;
        }
    }
    var visitor = {
        onObjectBegin: function () {
            var object = {};
            onValue(object);
            previousParents.push(currentParent);
            currentParent = object;
            currentProperty = null;
        },
        onObjectProperty: function (name) {
            currentProperty = name;
        },
        onObjectEnd: function () {
            currentParent = previousParents.pop();
        },
        onArrayBegin: function () {
            var array = [];
            onValue(array);
            previousParents.push(currentParent);
            currentParent = array;
            currentProperty = null;
        },
        onArrayEnd: function () {
            currentParent = previousParents.pop();
        },
        onLiteralValue: onValue,
        onError: function (error) {
            errors.push({ error: error });
        }
    };
    visit(text, visitor, options);
    return currentParent[0];
}
/**
 * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 */
export function parseTree(text, errors, options) {
    if (errors === void 0) { errors = []; }
    var currentParent = { type: 'array', offset: -1, length: -1, children: [] }; // artificial root
    function ensurePropertyComplete(endOffset) {
        if (currentParent.type === 'property') {
            currentParent.length = endOffset - currentParent.offset;
            currentParent = currentParent.parent;
        }
    }
    function onValue(valueNode) {
        currentParent.children.push(valueNode);
        return valueNode;
    }
    var visitor = {
        onObjectBegin: function (offset) {
            currentParent = onValue({ type: 'object', offset: offset, length: -1, parent: currentParent, children: [] });
        },
        onObjectProperty: function (name, offset, length) {
            currentParent = onValue({ type: 'property', offset: offset, length: -1, parent: currentParent, children: [] });
            currentParent.children.push({ type: 'string', value: name, offset: offset, length: length, parent: currentParent });
        },
        onObjectEnd: function (offset, length) {
            currentParent.length = offset + length - currentParent.offset;
            currentParent = currentParent.parent;
            ensurePropertyComplete(offset + length);
        },
        onArrayBegin: function (offset, length) {
            currentParent = onValue({ type: 'array', offset: offset, length: -1, parent: currentParent, children: [] });
        },
        onArrayEnd: function (offset, length) {
            currentParent.length = offset + length - currentParent.offset;
            currentParent = currentParent.parent;
            ensurePropertyComplete(offset + length);
        },
        onLiteralValue: function (value, offset, length) {
            onValue({ type: getLiteralNodeType(value), offset: offset, length: length, parent: currentParent, value: value });
            ensurePropertyComplete(offset + length);
        },
        onSeparator: function (sep, offset, length) {
            if (currentParent.type === 'property') {
                if (sep === ':') {
                    currentParent.columnOffset = offset;
                }
                else if (sep === ',') {
                    ensurePropertyComplete(offset);
                }
            }
        },
        onError: function (error) {
            errors.push({ error: error });
        }
    };
    visit(text, visitor, options);
    var result = currentParent.children[0];
    if (result) {
        delete result.parent;
    }
    return result;
}
export function findNodeAtLocation(root, path) {
    if (!root) {
        return void 0;
    }
    var node = root;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var segment = path_1[_i];
        if (typeof segment === 'string') {
            if (node.type !== 'object') {
                return void 0;
            }
            var found = false;
            for (var _a = 0, _b = node.children; _a < _b.length; _a++) {
                var propertyNode = _b[_a];
                if (propertyNode.children[0].value === segment) {
                    node = propertyNode.children[1];
                    found = true;
                    break;
                }
            }
            if (!found) {
                return void 0;
            }
        }
        else {
            var index = segment;
            if (node.type !== 'array' || index < 0 || index >= node.children.length) {
                return void 0;
            }
            node = node.children[index];
        }
    }
    return node;
}
export function getNodeValue(node) {
    if (node.type === 'array') {
        return node.children.map(getNodeValue);
    }
    else if (node.type === 'object') {
        var obj = {};
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var prop = _a[_i];
            obj[prop.children[0].value] = getNodeValue(prop.children[1]);
        }
        return obj;
    }
    return node.value;
}
/**
 * Parses the given text and invokes the visitor functions for each object, array and literal reached.
 */
export function visit(text, visitor, options) {
    var _scanner = createScanner(text, false);
    function toNoArgVisit(visitFunction) {
        return visitFunction ? function () { return visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength()); } : function () { return true; };
    }
    function toOneArgVisit(visitFunction) {
        return visitFunction ? function (arg) { return visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength()); } : function () { return true; };
    }
    var onObjectBegin = toNoArgVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisit(visitor.onObjectProperty), onObjectEnd = toNoArgVisit(visitor.onObjectEnd), onArrayBegin = toNoArgVisit(visitor.onArrayBegin), onArrayEnd = toNoArgVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisit(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onError = toOneArgVisit(visitor.onError);
    var disallowComments = options && options.disallowComments;
    var disallowTrailingComma = options && options.disallowTrailingComma;
    function scanNext() {
        while (true) {
            var token = _scanner.scan();
            switch (token) {
                case SyntaxKind.LineCommentTrivia:
                case SyntaxKind.BlockCommentTrivia:
                    if (disallowComments) {
                        handleError(ParseErrorCode.InvalidSymbol);
                    }
                    break;
                case SyntaxKind.Unknown:
                    handleError(ParseErrorCode.InvalidSymbol);
                    break;
                case SyntaxKind.Trivia:
                case SyntaxKind.LineBreakTrivia:
                    break;
                default:
                    return token;
            }
        }
    }
    function handleError(error, skipUntilAfter, skipUntil) {
        if (skipUntilAfter === void 0) { skipUntilAfter = []; }
        if (skipUntil === void 0) { skipUntil = []; }
        onError(error);
        if (skipUntilAfter.length + skipUntil.length > 0) {
            var token = _scanner.getToken();
            while (token !== SyntaxKind.EOF) {
                if (skipUntilAfter.indexOf(token) !== -1) {
                    scanNext();
                    break;
                }
                else if (skipUntil.indexOf(token) !== -1) {
                    break;
                }
                token = scanNext();
            }
        }
    }
    function parseString(isValue) {
        var value = _scanner.getTokenValue();
        if (isValue) {
            onLiteralValue(value);
        }
        else {
            onObjectProperty(value);
        }
        scanNext();
        return true;
    }
    function parseLiteral() {
        switch (_scanner.getToken()) {
            case SyntaxKind.NumericLiteral:
                var value = 0;
                try {
                    value = JSON.parse(_scanner.getTokenValue());
                    if (typeof value !== 'number') {
                        handleError(ParseErrorCode.InvalidNumberFormat);
                        value = 0;
                    }
                }
                catch (e) {
                    handleError(ParseErrorCode.InvalidNumberFormat);
                }
                onLiteralValue(value);
                break;
            case SyntaxKind.NullKeyword:
                onLiteralValue(null);
                break;
            case SyntaxKind.TrueKeyword:
                onLiteralValue(true);
                break;
            case SyntaxKind.FalseKeyword:
                onLiteralValue(false);
                break;
            default:
                return false;
        }
        scanNext();
        return true;
    }
    function parseProperty() {
        if (_scanner.getToken() !== SyntaxKind.StringLiteral) {
            handleError(ParseErrorCode.PropertyNameExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
            return false;
        }
        parseString(false);
        if (_scanner.getToken() === SyntaxKind.ColonToken) {
            onSeparator(':');
            scanNext(); // consume colon
            if (!parseValue()) {
                handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
            }
        }
        else {
            handleError(ParseErrorCode.ColonExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
        }
        return true;
    }
    function parseObject() {
        onObjectBegin();
        scanNext(); // consume open brace
        var needsComma = false;
        while (_scanner.getToken() !== SyntaxKind.CloseBraceToken && _scanner.getToken() !== SyntaxKind.EOF) {
            if (_scanner.getToken() === SyntaxKind.CommaToken) {
                if (!needsComma) {
                    handleError(ParseErrorCode.ValueExpected, [], []);
                }
                onSeparator(',');
                scanNext(); // consume comma
                if (_scanner.getToken() === SyntaxKind.CloseBraceToken && !disallowTrailingComma) {
                    break;
                }
            }
            else if (needsComma) {
                handleError(ParseErrorCode.CommaExpected, [], []);
            }
            if (!parseProperty()) {
                handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
            }
            needsComma = true;
        }
        onObjectEnd();
        if (_scanner.getToken() !== SyntaxKind.CloseBraceToken) {
            handleError(ParseErrorCode.CloseBraceExpected, [SyntaxKind.CloseBraceToken], []);
        }
        else {
            scanNext(); // consume close brace
        }
        return true;
    }
    function parseArray() {
        onArrayBegin();
        scanNext(); // consume open bracket
        var needsComma = false;
        while (_scanner.getToken() !== SyntaxKind.CloseBracketToken && _scanner.getToken() !== SyntaxKind.EOF) {
            if (_scanner.getToken() === SyntaxKind.CommaToken) {
                if (!needsComma) {
                    handleError(ParseErrorCode.ValueExpected, [], []);
                }
                onSeparator(',');
                scanNext(); // consume comma
                if (_scanner.getToken() === SyntaxKind.CloseBracketToken && !disallowTrailingComma) {
                    break;
                }
            }
            else if (needsComma) {
                handleError(ParseErrorCode.CommaExpected, [], []);
            }
            if (!parseValue()) {
                handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBracketToken, SyntaxKind.CommaToken]);
            }
            needsComma = true;
        }
        onArrayEnd();
        if (_scanner.getToken() !== SyntaxKind.CloseBracketToken) {
            handleError(ParseErrorCode.CloseBracketExpected, [SyntaxKind.CloseBracketToken], []);
        }
        else {
            scanNext(); // consume close bracket
        }
        return true;
    }
    function parseValue() {
        switch (_scanner.getToken()) {
            case SyntaxKind.OpenBracketToken:
                return parseArray();
            case SyntaxKind.OpenBraceToken:
                return parseObject();
            case SyntaxKind.StringLiteral:
                return parseString(true);
            default:
                return parseLiteral();
        }
    }
    scanNext();
    if (_scanner.getToken() === SyntaxKind.EOF) {
        return true;
    }
    if (!parseValue()) {
        handleError(ParseErrorCode.ValueExpected, [], []);
        return false;
    }
    if (_scanner.getToken() !== SyntaxKind.EOF) {
        handleError(ParseErrorCode.EndOfFileExpected, [], []);
    }
    return true;
}
