/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

function doFail(streamState: JSONStreamState, msg: string): void {
	// console.log('Near offset ' + streamState.pos + ': ' + msg + ' ~~~' + streamState.source.substr(streamState.pos, 50) + '~~~');
	throw new Error('Near offset ' + streamState.pos + ': ' + msg + ' ~~~' + streamState.source.substr(streamState.pos, 50) + '~~~');
}

export interface ILocation {
	readonly filename: string;
	readonly line: number;
	readonly char: number;
}

export function parse(source: string, filename: string, withMetadata: boolean): any {
	let streamState = new JSONStreamState(source);
	let token = new JSONToken();
	let state = JSONState.ROOT_STATE;
	let cur: any = null;
	let stateStack: JSONState[] = [];
	let objStack: any[] = [];

	function pushState(): void {
		stateStack.push(state);
		objStack.push(cur);
	}

	function popState(): void {
		state = stateStack.pop();
		cur = objStack.pop();
	}

	function fail(msg: string): void {
		doFail(streamState, msg);
	}

	while (nextJSONToken(streamState, token)) {

		if (state === JSONState.ROOT_STATE) {
			if (cur !== null) {
				fail('too many constructs in root');
			}

			if (token.type === JSONTokenType.LEFT_CURLY_BRACKET) {
				cur = {};
				if (withMetadata) {
					cur.$vscodeTextmateLocation = token.toLocation(filename);
				}
				pushState();
				state = JSONState.DICT_STATE;
				continue;
			}

			if (token.type === JSONTokenType.LEFT_SQUARE_BRACKET) {
				cur = [];
				pushState();
				state = JSONState.ARR_STATE;
				continue;
			}

			fail('unexpected token in root');

		}

		if (state === JSONState.DICT_STATE_COMMA) {

			if (token.type === JSONTokenType.RIGHT_CURLY_BRACKET) {
				popState();
				continue;
			}

			if (token.type === JSONTokenType.COMMA) {
				state = JSONState.DICT_STATE_NO_CLOSE;
				continue;
			}

			fail('expected , or }');

		}

		if (state === JSONState.DICT_STATE || state === JSONState.DICT_STATE_NO_CLOSE) {

			if (state === JSONState.DICT_STATE && token.type === JSONTokenType.RIGHT_CURLY_BRACKET) {
				popState();
				continue;
			}

			if (token.type === JSONTokenType.STRING) {
				let keyValue = token.value;

				if (!nextJSONToken(streamState, token) || (/*TS bug*/<any>token.type) !== JSONTokenType.COLON) {
					fail('expected colon');
				}
				if (!nextJSONToken(streamState, token)) {
					fail('expected value');
				}

				state = JSONState.DICT_STATE_COMMA;

				if (token.type === JSONTokenType.STRING) {
					cur[keyValue] = token.value;
					continue;
				}
				if (token.type === JSONTokenType.NULL) {
					cur[keyValue] = null;
					continue;
				}
				if (token.type === JSONTokenType.TRUE) {
					cur[keyValue] = true;
					continue;
				}
				if (token.type === JSONTokenType.FALSE) {
					cur[keyValue] = false;
					continue;
				}
				if (token.type === JSONTokenType.NUMBER) {
					cur[keyValue] = parseFloat(token.value);
					continue;
				}
				if (token.type === JSONTokenType.LEFT_SQUARE_BRACKET) {
					let newArr: any[] = [];
					cur[keyValue] = newArr;
					pushState();
					state = JSONState.ARR_STATE;
					cur = newArr;
					continue;
				}
				if (token.type === JSONTokenType.LEFT_CURLY_BRACKET) {
					let newDict: any = {};
					if (withMetadata) {
						newDict.$vscodeTextmateLocation = token.toLocation(filename);
					}
					cur[keyValue] = newDict;
					pushState();
					state = JSONState.DICT_STATE;
					cur = newDict;
					continue;
				}
			}

			fail('unexpected token in dict');
		}

		if (state === JSONState.ARR_STATE_COMMA) {

			if (token.type === JSONTokenType.RIGHT_SQUARE_BRACKET) {
				popState();
				continue;
			}

			if (token.type === JSONTokenType.COMMA) {
				state = JSONState.ARR_STATE_NO_CLOSE;
				continue;
			}

			fail('expected , or ]');
		}

		if (state === JSONState.ARR_STATE || state === JSONState.ARR_STATE_NO_CLOSE) {

			if (state === JSONState.ARR_STATE && token.type === JSONTokenType.RIGHT_SQUARE_BRACKET) {
				popState();
				continue;
			}

			state = JSONState.ARR_STATE_COMMA;

			if (token.type === JSONTokenType.STRING) {
				cur.push(token.value);
				continue;
			}
			if (token.type === JSONTokenType.NULL) {
				cur.push(null);
				continue;
			}
			if (token.type === JSONTokenType.TRUE) {
				cur.push(true);
				continue;
			}
			if (token.type === JSONTokenType.FALSE) {
				cur.push(false);
				continue;
			}
			if (token.type === JSONTokenType.NUMBER) {
				cur.push(parseFloat(token.value));
				continue;
			}

			if (token.type === JSONTokenType.LEFT_SQUARE_BRACKET) {
				let newArr: any[] = [];
				cur.push(newArr);
				pushState();
				state = JSONState.ARR_STATE;
				cur = newArr;
				continue;
			}
			if (token.type === JSONTokenType.LEFT_CURLY_BRACKET) {
				let newDict: any = {};
				if (withMetadata) {
					newDict.$vscodeTextmateLocation = token.toLocation(filename);
				}
				cur.push(newDict);
				pushState();
				state = JSONState.DICT_STATE;
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

class JSONStreamState {
	source: string;

	pos: number;
	len: number;

	line: number;
	char: number;

	constructor(source: string) {
		this.source = source;
		this.pos = 0;
		this.len = source.length;
		this.line = 1;
		this.char = 0;
	}
}

const enum JSONTokenType {
	UNKNOWN = 0,
	STRING = 1,
	LEFT_SQUARE_BRACKET = 2, // [
	LEFT_CURLY_BRACKET = 3, // {
	RIGHT_SQUARE_BRACKET = 4, // ]
	RIGHT_CURLY_BRACKET = 5, // }
	COLON = 6, // :
	COMMA = 7, // ,
	NULL = 8,
	TRUE = 9,
	FALSE = 10,
	NUMBER = 11
}

const enum JSONState {
	ROOT_STATE = 0,
	DICT_STATE = 1,
	DICT_STATE_COMMA = 2,
	DICT_STATE_NO_CLOSE = 3,
	ARR_STATE = 4,
	ARR_STATE_COMMA = 5,
	ARR_STATE_NO_CLOSE = 6,
}

const enum ChCode {
	SPACE = 0x20,
	HORIZONTAL_TAB = 0x09,
	CARRIAGE_RETURN = 0x0D,
	LINE_FEED = 0x0A,
	QUOTATION_MARK = 0x22,
	BACKSLASH = 0x5C,

	LEFT_SQUARE_BRACKET = 0x5B,
	LEFT_CURLY_BRACKET = 0x7B,
	RIGHT_SQUARE_BRACKET = 0x5D,
	RIGHT_CURLY_BRACKET = 0x7D,
	COLON = 0x3A,
	COMMA = 0x2C,
	DOT = 0x2E,

	D0 = 0x30,
	D9 = 0x39,

	MINUS = 0x2D,
	PLUS = 0x2B,

	E = 0x45,

	a = 0x61,
	e = 0x65,
	f = 0x66,
	l = 0x6C,
	n = 0x6E,
	r = 0x72,
	s = 0x73,
	t = 0x74,
	u = 0x75,
}

class JSONToken {
	value: string;
	type: JSONTokenType;

	offset: number;
	len: number;

	line: number; /* 1 based line number */
	char: number;

	constructor() {
		this.value = null;
		this.offset = -1;
		this.len = -1;
		this.line = -1;
		this.char = -1;
	}

	toLocation(filename: string): ILocation {
		return {
			filename: filename,
			line: this.line,
			char: this.char
		};
	}
}

/**
 * precondition: the string is known to be valid JSON (https://www.ietf.org/rfc/rfc4627.txt)
 */
function nextJSONToken(_state: JSONStreamState, _out: JSONToken): boolean {
	_out.value = null;
	_out.type = JSONTokenType.UNKNOWN;
	_out.offset = -1;
	_out.len = -1;
	_out.line = -1;
	_out.char = -1;

	let source = _state.source;
	let pos = _state.pos;
	let len = _state.len;
	let line = _state.line;
	let char = _state.char;

	//------------------------ skip whitespace
	let chCode: number;
	do {
		if (pos >= len) {
			return false; /*EOS*/
		}

		chCode = source.charCodeAt(pos);
		if (chCode === ChCode.SPACE || chCode === ChCode.HORIZONTAL_TAB || chCode === ChCode.CARRIAGE_RETURN) {
			// regular whitespace
			pos++; char++;
			continue;
		}

		if (chCode === ChCode.LINE_FEED) {
			// newline
			pos++; line++; char = 0;
			continue;
		}

		// not whitespace
		break;
	} while (true);

	_out.offset = pos;
	_out.line = line;
	_out.char = char;

	if (chCode === ChCode.QUOTATION_MARK) {
		//------------------------ strings
		_out.type = JSONTokenType.STRING;

		pos++; char++;

		do {
			if (pos >= len) {
				return false; /*EOS*/
			}

			chCode = source.charCodeAt(pos);
			pos++; char++;

			if (chCode === ChCode.BACKSLASH) {
				// skip next char
				pos++; char++;
				continue;
			}

			if (chCode === ChCode.QUOTATION_MARK) {
				// end of the string
				break;
			}
		} while (true);

		_out.value = source.substring(_out.offset + 1, pos - 1).replace(/\\u([0-9A-Fa-f]{4})/g, (_, m0) => {
			return (<any>String).fromCodePoint(parseInt(m0, 16));
		}).replace(/\\(.)/g, (_, m0) => {
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

	} else if (chCode === ChCode.LEFT_SQUARE_BRACKET) {

		_out.type = JSONTokenType.LEFT_SQUARE_BRACKET;
		pos++; char++;

	} else if (chCode === ChCode.LEFT_CURLY_BRACKET) {

		_out.type = JSONTokenType.LEFT_CURLY_BRACKET;
		pos++; char++;

	} else if (chCode === ChCode.RIGHT_SQUARE_BRACKET) {

		_out.type = JSONTokenType.RIGHT_SQUARE_BRACKET;
		pos++; char++;

	} else if (chCode === ChCode.RIGHT_CURLY_BRACKET) {

		_out.type = JSONTokenType.RIGHT_CURLY_BRACKET;
		pos++; char++;

	} else if (chCode === ChCode.COLON) {

		_out.type = JSONTokenType.COLON;
		pos++; char++;

	} else if (chCode === ChCode.COMMA) {

		_out.type = JSONTokenType.COMMA;
		pos++; char++;

	} else if (chCode === ChCode.n) {
		//------------------------ null

		_out.type = JSONTokenType.NULL;
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.u) { return false; /* INVALID */ }
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.l) { return false; /* INVALID */ }
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.l) { return false; /* INVALID */ }
		pos++; char++;

	} else if (chCode === ChCode.t) {
		//------------------------ true

		_out.type = JSONTokenType.TRUE;
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.r) { return false; /* INVALID */ }
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.u) { return false; /* INVALID */ }
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.e) { return false; /* INVALID */ }
		pos++; char++;

	} else if (chCode === ChCode.f) {
		//------------------------ false

		_out.type = JSONTokenType.FALSE;
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.a) { return false; /* INVALID */ }
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.l) { return false; /* INVALID */ }
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.s) { return false; /* INVALID */ }
		pos++; char++; chCode = source.charCodeAt(pos);
		if (chCode !== ChCode.e) { return false; /* INVALID */ }
		pos++; char++;

	} else {
		//------------------------ numbers

		_out.type = JSONTokenType.NUMBER;
		do {
			if (pos >= len) { return false; /*EOS*/ }

			chCode = source.charCodeAt(pos);
			if (
				chCode === ChCode.DOT
				|| (chCode >= ChCode.D0 && chCode <= ChCode.D9)
				|| (chCode === ChCode.e || chCode === ChCode.E)
				|| (chCode === ChCode.MINUS || chCode === ChCode.PLUS)
			) {
				// looks like a piece of a number
				pos++; char++;
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
