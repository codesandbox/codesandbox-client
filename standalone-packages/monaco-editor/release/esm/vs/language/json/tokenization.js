/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as json from './_deps/jsonc-parser/main.js';
export function createTokenizationSupport(supportComments) {
    return {
        getInitialState: function () { return new JSONState(null, null, false); },
        tokenize: function (line, state, offsetDelta, stopAtOffset) { return tokenize(supportComments, line, state, offsetDelta, stopAtOffset); }
    };
}
export var TOKEN_DELIM_OBJECT = 'delimiter.bracket.json';
export var TOKEN_DELIM_ARRAY = 'delimiter.array.json';
export var TOKEN_DELIM_COLON = 'delimiter.colon.json';
export var TOKEN_DELIM_COMMA = 'delimiter.comma.json';
export var TOKEN_VALUE_BOOLEAN = 'keyword.json';
export var TOKEN_VALUE_NULL = 'keyword.json';
export var TOKEN_VALUE_STRING = 'string.value.json';
export var TOKEN_VALUE_NUMBER = 'number.json';
export var TOKEN_PROPERTY_NAME = 'string.key.json';
export var TOKEN_COMMENT_BLOCK = 'comment.block.json';
export var TOKEN_COMMENT_LINE = 'comment.line.json';
var JSONState = /** @class */ (function () {
    function JSONState(state, scanError, lastWasColon) {
        this._state = state;
        this.scanError = scanError;
        this.lastWasColon = lastWasColon;
    }
    JSONState.prototype.clone = function () {
        return new JSONState(this._state, this.scanError, this.lastWasColon);
    };
    JSONState.prototype.equals = function (other) {
        if (other === this) {
            return true;
        }
        if (!other || !(other instanceof JSONState)) {
            return false;
        }
        return this.scanError === other.scanError &&
            this.lastWasColon === other.lastWasColon;
    };
    JSONState.prototype.getStateData = function () {
        return this._state;
    };
    JSONState.prototype.setStateData = function (state) {
        this._state = state;
    };
    return JSONState;
}());
function tokenize(comments, line, state, offsetDelta, stopAtOffset) {
    if (offsetDelta === void 0) { offsetDelta = 0; }
    // handle multiline strings and block comments
    var numberOfInsertedCharacters = 0, adjustOffset = false;
    switch (state.scanError) {
        case 2 /* UnexpectedEndOfString */:
            line = '"' + line;
            numberOfInsertedCharacters = 1;
            break;
        case 1 /* UnexpectedEndOfComment */:
            line = '/*' + line;
            numberOfInsertedCharacters = 2;
            break;
    }
    var scanner = json.createScanner(line), kind, ret, lastWasColon = state.lastWasColon;
    ret = {
        tokens: [],
        endState: state.clone()
    };
    while (true) {
        var offset = offsetDelta + scanner.getPosition(), type = '';
        kind = scanner.scan();
        if (kind === 17 /* EOF */) {
            break;
        }
        // Check that the scanner has advanced
        if (offset === offsetDelta + scanner.getPosition()) {
            throw new Error('Scanner did not advance, next 3 characters are: ' + line.substr(scanner.getPosition(), 3));
        }
        // In case we inserted /* or " character, we need to
        // adjust the offset of all tokens (except the first)
        if (adjustOffset) {
            offset -= numberOfInsertedCharacters;
        }
        adjustOffset = numberOfInsertedCharacters > 0;
        // brackets and type
        switch (kind) {
            case 1 /* OpenBraceToken */:
                type = TOKEN_DELIM_OBJECT;
                lastWasColon = false;
                break;
            case 2 /* CloseBraceToken */:
                type = TOKEN_DELIM_OBJECT;
                lastWasColon = false;
                break;
            case 3 /* OpenBracketToken */:
                type = TOKEN_DELIM_ARRAY;
                lastWasColon = false;
                break;
            case 4 /* CloseBracketToken */:
                type = TOKEN_DELIM_ARRAY;
                lastWasColon = false;
                break;
            case 6 /* ColonToken */:
                type = TOKEN_DELIM_COLON;
                lastWasColon = true;
                break;
            case 5 /* CommaToken */:
                type = TOKEN_DELIM_COMMA;
                lastWasColon = false;
                break;
            case 8 /* TrueKeyword */:
            case 9 /* FalseKeyword */:
                type = TOKEN_VALUE_BOOLEAN;
                lastWasColon = false;
                break;
            case 7 /* NullKeyword */:
                type = TOKEN_VALUE_NULL;
                lastWasColon = false;
                break;
            case 10 /* StringLiteral */:
                type = lastWasColon ? TOKEN_VALUE_STRING : TOKEN_PROPERTY_NAME;
                lastWasColon = false;
                break;
            case 11 /* NumericLiteral */:
                type = TOKEN_VALUE_NUMBER;
                lastWasColon = false;
                break;
        }
        // comments, iff enabled
        if (comments) {
            switch (kind) {
                case 12 /* LineCommentTrivia */:
                    type = TOKEN_COMMENT_LINE;
                    break;
                case 13 /* BlockCommentTrivia */:
                    type = TOKEN_COMMENT_BLOCK;
                    break;
            }
        }
        ret.endState = new JSONState(state.getStateData(), scanner.getTokenError(), lastWasColon);
        ret.tokens.push({
            startIndex: offset,
            scopes: type
        });
    }
    return ret;
}
