/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as assert from 'assert';
import { parse as JSONparse } from '../json';

describe('JSON', () => {
	function isValid(json: string): void {
		let expected = JSON.parse(json);
		let actual = JSONparse(json, null, false);
		assert.deepEqual(actual, expected);

		// let actual2 = JSONparse(json, true);
		// assert.deepEqual(actual2, expected);
	}

	function isInvalid(json: string): void {
		let hadErr = false;
		try {
			JSONparse(json, null, false);
		} catch (err) {
			hadErr = true;
		}
		assert.equal(hadErr, true, 'expected invalid: ' + json);
	}

	it('Invalid body', function () {
		isInvalid('{}[]');
		isInvalid('*');
	});

	it('Trailing Whitespace', function () {
		isValid('{}\n\n');
	});

	it('Objects', function () {
		isValid('{}');
		isValid('{"key": "value"}');
		isValid('{"key1": true, "key2": 3, "key3": [null], "key4": { "nested": {}}}');
		isValid('{"constructor": true }');

		isInvalid('{');
		isInvalid('{3:3}');
		isInvalid('{\'key\': 3}');
		isInvalid('{"key" 3}');
		isInvalid('{"key":3 "key2": 4}');
		isInvalid('{"key":42, }');
		isInvalid('{"key:42');
	});

	it('Arrays', function () {
		isValid('[]');
		isValid('[1, 2]');
		isValid('[1, "string", false, {}, [null]]');

		isInvalid('[');
		isInvalid('[,]');
		isInvalid('[1 2]');
		isInvalid('[true false]');
		isInvalid('[1, ]');
		isInvalid('[[]');
		isInvalid('["something"');
		isInvalid('[magic]');
	});

	it('Strings', function () {
		isValid('["string"]');
		isValid('["\\"\\\\\\/\\b\\f\\n\\r\\t\\u1234\\u12AB"]');
		isValid('["\\\\"]');

		isInvalid('["');
		isInvalid('["]');
		isInvalid('["\\z"]');
		isInvalid('["\\u"]');
		isInvalid('["\\u123"]');
		isInvalid('["\\u123Z"]');
		isInvalid('[\'string\']');
	});

	it('Numbers', function () {
		isValid('[0, -1, 186.1, 0.123, -1.583e+4, 1.583E-4, 5e8]');

		// isInvalid('[+1]');
		// isInvalid('[01]');
		// isInvalid('[1.]');
		// isInvalid('[1.1+3]');
		// isInvalid('[1.4e]');
		// isInvalid('[-A]');
	});

	it('misc', function () {
		isValid('{}');
		isValid('[null]');
		isValid('{"a":true}');
		isValid('{\n\t"key" : {\n\t"key2": 42\n\t}\n}');
		isValid('{"key":[{"key2":42}]}');
		isValid('{\n\t\n}');
		isValid('{\n"first":true\n\n}');
		isValid('{\n"key":32,\n\n"key2":45}');
		isValid('{"a": 1,\n\n"d": 2}');
		isValid('{"a": 1, "a": 2}');
		isValid('{"a": { "a": 2, "a": 3}}');
		isValid('[{ "a": 2, "a": 3}]');
		isValid('{"key1":"first string", "key2":["second string"]}');

		isInvalid('{\n"key":32,\nerror\n}');
	});
});