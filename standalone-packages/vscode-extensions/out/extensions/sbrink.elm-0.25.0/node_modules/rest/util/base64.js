/*
 * Copyright (c) 2009 Nicholas C. Zakas. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
 * Base 64 implementation in JavaScript
 * Original source available at https://raw.github.com/nzakas/computer-science-in-javascript/02a2745b4aa8214f2cae1bf0b15b447ca1a91b23/encodings/base64/base64.js
 *
 * Converted to AMD and linter refinement by Scott Andrews
 */

(function (define) {
	'use strict';

	/*jshint bitwise: false */
	define(function (/* require */) {

		var digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		/**
		 * Base64-encodes a string of text.
		 *
		 * @param {string} text The text to encode.
		 * @return {string} The base64-encoded string.
		 */
		function base64Encode(text) {

			if (/([^\u0000-\u00ff])/.test(text)) {
				throw new Error('Can\'t base64 encode non-ASCII characters.');
			}

			var i = 0,
				cur, prev, byteNum,
				result = [];

			while (i < text.length) {

				cur = text.charCodeAt(i);
				byteNum = i % 3;

				switch (byteNum) {
				case 0: //first byte
					result.push(digits.charAt(cur >> 2));
					break;

				case 1: //second byte
					result.push(digits.charAt((prev & 3) << 4 | (cur >> 4)));
					break;

				case 2: //third byte
					result.push(digits.charAt((prev & 0x0f) << 2 | (cur >> 6)));
					result.push(digits.charAt(cur & 0x3f));
					break;
				}

				prev = cur;
				i += 1;
			}

			if (byteNum === 0) {
				result.push(digits.charAt((prev & 3) << 4));
				result.push('==');
			} else if (byteNum === 1) {
				result.push(digits.charAt((prev & 0x0f) << 2));
				result.push('=');
			}

			return result.join('');
		}

		/**
		 * Base64-decodes a string of text.
		 *
		 * @param {string} text The text to decode.
		 * @return {string} The base64-decoded string.
		 */
		function base64Decode(text) {

			//ignore white space
			text = text.replace(/\s/g, '');

			//first check for any unexpected input
			if (!(/^[a-z0-9\+\/\s]+\={0,2}$/i.test(text)) || text.length % 4 > 0) {
				throw new Error('Not a base64-encoded string.');
			}

			//local variables
			var cur, prev, digitNum,
				i = 0,
				result = [];

			//remove any equals signs
			text = text.replace(/\=/g, '');

			//loop over each character
			while (i < text.length) {

				cur = digits.indexOf(text.charAt(i));
				digitNum = i % 4;

				switch (digitNum) {

				//case 0: first digit - do nothing, not enough info to work with

				case 1: //second digit
					result.push(String.fromCharCode(prev << 2 | cur >> 4));
					break;

				case 2: //third digit
					result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
					break;

				case 3: //fourth digit
					result.push(String.fromCharCode((prev & 3) << 6 | cur));
					break;
				}

				prev = cur;
				i += 1;
			}

			//return a string
			return result.join('');

		}

		return {
			encode: base64Encode,
			decode: base64Decode
		};

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
