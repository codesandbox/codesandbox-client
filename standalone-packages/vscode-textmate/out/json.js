/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function doFail(streamState, msg) {
    // console.log('Near offset ' + streamState.pos + ': ' + msg + ' ~~~' + streamState.source.substr(streamState.pos, 50) + '~~~');
    throw new Error('Near offset ' + streamState.pos + ': ' + msg + ' ~~~' + streamState.source.substr(streamState.pos, 50) + '~~~');
}
function parse(source, filename, withMetadata) {
    var streamState = new JSONStreamState(source);
    var token = new JSONToken();
    var state = 0 /* ROOT_STATE */;
    var cur = null;
    var stateStack = [];
    var objStack = [];
    function pushState() {
        stateStack.push(state);
        objStack.push(cur);
    }
    function popState() {
        state = stateStack.pop();
        cur = objStack.pop();
    }
    function fail(msg) {
        doFail(streamState, msg);
    }
    while (nextJSONToken(streamState, token)) {
        if (state === 0 /* ROOT_STATE */) {
            if (cur !== null) {
                fail('too many constructs in root');
            }
            if (token.type === 3 /* LEFT_CURLY_BRACKET */) {
                cur = {};
                if (withMetadata) {
                    cur.$vscodeTextmateLocation = token.toLocation(filename);
                }
                pushState();
                state = 1 /* DICT_STATE */;
                continue;
            }
            if (token.type === 2 /* LEFT_SQUARE_BRACKET */) {
                cur = [];
                pushState();
                state = 4 /* ARR_STATE */;
                continue;
            }
            fail('unexpected token in root');
        }
        if (state === 2 /* DICT_STATE_COMMA */) {
            if (token.type === 5 /* RIGHT_CURLY_BRACKET */) {
                popState();
                continue;
            }
            if (token.type === 7 /* COMMA */) {
                state = 3 /* DICT_STATE_NO_CLOSE */;
                continue;
            }
            fail('expected , or }');
        }
        if (state === 1 /* DICT_STATE */ || state === 3 /* DICT_STATE_NO_CLOSE */) {
            if (state === 1 /* DICT_STATE */ && token.type === 5 /* RIGHT_CURLY_BRACKET */) {
                popState();
                continue;
            }
            if (token.type === 1 /* STRING */) {
                var keyValue = token.value;
                if (!nextJSONToken(streamState, token) || token.type !== 6 /* COLON */) {
                    fail('expected colon');
                }
                if (!nextJSONToken(streamState, token)) {
                    fail('expected value');
                }
                state = 2 /* DICT_STATE_COMMA */;
                if (token.type === 1 /* STRING */) {
                    cur[keyValue] = token.value;
                    continue;
                }
                if (token.type === 8 /* NULL */) {
                    cur[keyValue] = null;
                    continue;
                }
                if (token.type === 9 /* TRUE */) {
                    cur[keyValue] = true;
                    continue;
                }
                if (token.type === 10 /* FALSE */) {
                    cur[keyValue] = false;
                    continue;
                }
                if (token.type === 11 /* NUMBER */) {
                    cur[keyValue] = parseFloat(token.value);
                    continue;
                }
                if (token.type === 2 /* LEFT_SQUARE_BRACKET */) {
                    var newArr = [];
                    cur[keyValue] = newArr;
                    pushState();
                    state = 4 /* ARR_STATE */;
                    cur = newArr;
                    continue;
                }
                if (token.type === 3 /* LEFT_CURLY_BRACKET */) {
                    var newDict = {};
                    if (withMetadata) {
                        newDict.$vscodeTextmateLocation = token.toLocation(filename);
                    }
                    cur[keyValue] = newDict;
                    pushState();
                    state = 1 /* DICT_STATE */;
                    cur = newDict;
                    continue;
                }
            }
            fail('unexpected token in dict');
        }
        if (state === 5 /* ARR_STATE_COMMA */) {
            if (token.type === 4 /* RIGHT_SQUARE_BRACKET */) {
                popState();
                continue;
            }
            if (token.type === 7 /* COMMA */) {
                state = 6 /* ARR_STATE_NO_CLOSE */;
                continue;
            }
            fail('expected , or ]');
        }
        if (state === 4 /* ARR_STATE */ || state === 6 /* ARR_STATE_NO_CLOSE */) {
            if (state === 4 /* ARR_STATE */ && token.type === 4 /* RIGHT_SQUARE_BRACKET */) {
                popState();
                continue;
            }
            state = 5 /* ARR_STATE_COMMA */;
            if (token.type === 1 /* STRING */) {
                cur.push(token.value);
                continue;
            }
            if (token.type === 8 /* NULL */) {
                cur.push(null);
                continue;
            }
            if (token.type === 9 /* TRUE */) {
                cur.push(true);
                continue;
            }
            if (token.type === 10 /* FALSE */) {
                cur.push(false);
                continue;
            }
            if (token.type === 11 /* NUMBER */) {
                cur.push(parseFloat(token.value));
                continue;
            }
            if (token.type === 2 /* LEFT_SQUARE_BRACKET */) {
                var newArr = [];
                cur.push(newArr);
                pushState();
                state = 4 /* ARR_STATE */;
                cur = newArr;
                continue;
            }
            if (token.type === 3 /* LEFT_CURLY_BRACKET */) {
                var newDict = {};
                if (withMetadata) {
                    newDict.$vscodeTextmateLocation = token.toLocation(filename);
                }
                cur.push(newDict);
                pushState();
                state = 1 /* DICT_STATE */;
                cur = newDict;
                continue;
            }
            fail('unexpected token in array');
        }
        fail('unknown state');
    }
    if (objStack.length !== 0) {
        fail('unclosed constructs');
    }
    return cur;
}
exports.parse = parse;
var JSONStreamState = /** @class */ (function () {
    function JSONStreamState(source) {
        this.source = source;
        this.pos = 0;
        this.len = source.length;
        this.line = 1;
        this.char = 0;
    }
    return JSONStreamState;
}());
var JSONToken = /** @class */ (function () {
    function JSONToken() {
        this.value = null;
        this.offset = -1;
        this.len = -1;
        this.line = -1;
        this.char = -1;
    }
    JSONToken.prototype.toLocation = function (filename) {
        return {
            filename: filename,
            line: this.line,
            char: this.char
        };
    };
    return JSONToken;
}());
/**
 * precondition: the string is known to be valid JSON (https://www.ietf.org/rfc/rfc4627.txt)
 */
function nextJSONToken(_state, _out) {
    _out.value = null;
    _out.type = 0 /* UNKNOWN */;
    _out.offset = -1;
    _out.len = -1;
    _out.line = -1;
    _out.char = -1;
    var source = _state.source;
    var pos = _state.pos;
    var len = _state.len;
    var line = _state.line;
    var char = _state.char;
    //------------------------ skip whitespace
    var chCode;
    do {
        if (pos >= len) {
            return false; /*EOS*/
        }
        chCode = source.charCodeAt(pos);
        if (chCode === 32 /* SPACE */ || chCode === 9 /* HORIZONTAL_TAB */ || chCode === 13 /* CARRIAGE_RETURN */) {
            // regular whitespace
            pos++;
            char++;
            continue;
        }
        if (chCode === 10 /* LINE_FEED */) {
            // newline
            pos++;
            line++;
            char = 0;
            continue;
        }
        // not whitespace
        break;
    } while (true);
    _out.offset = pos;
    _out.line = line;
    _out.char = char;
    if (chCode === 34 /* QUOTATION_MARK */) {
        //------------------------ strings
        _out.type = 1 /* STRING */;
        pos++;
        char++;
        do {
            if (pos >= len) {
                return false; /*EOS*/
            }
            chCode = source.charCodeAt(pos);
            pos++;
            char++;
            if (chCode === 92 /* BACKSLASH */) {
                // skip next char
                pos++;
                char++;
                continue;
            }
            if (chCode === 34 /* QUOTATION_MARK */) {
                // end of the string
                break;
            }
        } while (true);
        _out.value = source.substring(_out.offset + 1, pos - 1).replace(/\\u([0-9A-Fa-f]{4})/g, function (_, m0) {
            return String.fromCodePoint(parseInt(m0, 16));
        }).replace(/\\(.)/g, function (_, m0) {
            switch (m0) {
                case '"': return '"';
                case '\\': return '\\';
                case '/': return '/';
                case 'b': return '\b';
                case 'f': return '\f';
                case 'n': return '\n';
                case 'r': return '\r';
                case 't': return '\t';
                default: doFail(_state, 'invalid escape sequence');
            }
        });
    }
    else if (chCode === 91 /* LEFT_SQUARE_BRACKET */) {
        _out.type = 2 /* LEFT_SQUARE_BRACKET */;
        pos++;
        char++;
    }
    else if (chCode === 123 /* LEFT_CURLY_BRACKET */) {
        _out.type = 3 /* LEFT_CURLY_BRACKET */;
        pos++;
        char++;
    }
    else if (chCode === 93 /* RIGHT_SQUARE_BRACKET */) {
        _out.type = 4 /* RIGHT_SQUARE_BRACKET */;
        pos++;
        char++;
    }
    else if (chCode === 125 /* RIGHT_CURLY_BRACKET */) {
        _out.type = 5 /* RIGHT_CURLY_BRACKET */;
        pos++;
        char++;
    }
    else if (chCode === 58 /* COLON */) {
        _out.type = 6 /* COLON */;
        pos++;
        char++;
    }
    else if (chCode === 44 /* COMMA */) {
        _out.type = 7 /* COMMA */;
        pos++;
        char++;
    }
    else if (chCode === 110 /* n */) {
        //------------------------ null
        _out.type = 8 /* NULL */;
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 117 /* u */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 108 /* l */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 108 /* l */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
    }
    else if (chCode === 116 /* t */) {
        //------------------------ true
        _out.type = 9 /* TRUE */;
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 114 /* r */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 117 /* u */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 101 /* e */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
    }
    else if (chCode === 102 /* f */) {
        //------------------------ false
        _out.type = 10 /* FALSE */;
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 97 /* a */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 108 /* l */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 115 /* s */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
        chCode = source.charCodeAt(pos);
        if (chCode !== 101 /* e */) {
            return false; /* INVALID */
        }
        pos++;
        char++;
    }
    else {
        //------------------------ numbers
        _out.type = 11 /* NUMBER */;
        do {
            if (pos >= len) {
                return false; /*EOS*/
            }
            chCode = source.charCodeAt(pos);
            if (chCode === 46 /* DOT */
                || (chCode >= 48 /* D0 */ && chCode <= 57 /* D9 */)
                || (chCode === 101 /* e */ || chCode === 69 /* E */)
                || (chCode === 45 /* MINUS */ || chCode === 43 /* PLUS */)) {
                // looks like a piece of a number
                pos++;
                char++;
                continue;
            }
            // pos--; char--;
            break;
        } while (true);
    }
    _out.len = pos - _out.offset;
    if (_out.value === null) {
        _out.value = source.substr(_out.offset, _out.len);
    }
    _state.pos = pos;
    _state.line = line;
    _state.char = char;
    // console.log('PRODUCING TOKEN: ', _out.value, JSONTokenType[_out.type]);
    return true;
}
//# sourceMappingURL=json.js.map