/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
/**
 * The empty string.
 */
export var empty = '';
export function isFalsyOrWhitespace(str) {
    if (!str || typeof str !== 'string') {
        return true;
    }
    return str.trim().length === 0;
}
/**
 * @returns the provided number with the given number of preceding zeros.
 */
export function pad(n, l, char) {
    if (char === void 0) { char = '0'; }
    var str = '' + n;
    var r = [str];
    for (var i = str.length; i < l; i++) {
        r.push(char);
    }
    return r.reverse().join('');
}
var _formatRegexp = /{(\d+)}/g;
/**
 * Helper to produce a string with a variable number of arguments. Insert variable segments
 * into the string using the {n} notation where N is the index of the argument following the string.
 * @param value string to which formatting is applied
 * @param args replacements for {n}-entries
 */
export function format(value) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args.length === 0) {
        return value;
    }
    return value.replace(_formatRegexp, function (match, group) {
        var idx = parseInt(group, 10);
        return isNaN(idx) || idx < 0 || idx >= args.length ?
            match :
            args[idx];
    });
}
/**
 * Converts HTML characters inside the string to use entities instead. Makes the string safe from
 * being used e.g. in HTMLElement.innerHTML.
 */
export function escape(html) {
    return html.replace(/[<|>|&]/g, function (match) {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            default: return match;
        }
    });
}
/**
 * Escapes regular expression characters in a given string
 */
export function escapeRegExpCharacters(value) {
    return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\[\]\(\)\#]/g, '\\$&');
}
/**
 * Removes all occurrences of needle from the beginning and end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim (default is a blank)
 */
export function trim(haystack, needle) {
    if (needle === void 0) { needle = ' '; }
    var trimmed = ltrim(haystack, needle);
    return rtrim(trimmed, needle);
}
/**
 * Removes all occurrences of needle from the beginning of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */
export function ltrim(haystack, needle) {
    if (!haystack || !needle) {
        return haystack;
    }
    var needleLen = needle.length;
    if (needleLen === 0 || haystack.length === 0) {
        return haystack;
    }
    var offset = 0, idx = -1;
    while ((idx = haystack.indexOf(needle, offset)) === offset) {
        offset = offset + needleLen;
    }
    return haystack.substring(offset);
}
/**
 * Removes all occurrences of needle from the end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */
export function rtrim(haystack, needle) {
    if (!haystack || !needle) {
        return haystack;
    }
    var needleLen = needle.length, haystackLen = haystack.length;
    if (needleLen === 0 || haystackLen === 0) {
        return haystack;
    }
    var offset = haystackLen, idx = -1;
    while (true) {
        idx = haystack.lastIndexOf(needle, offset - 1);
        if (idx === -1 || idx + needleLen !== offset) {
            break;
        }
        if (idx === 0) {
            return '';
        }
        offset = idx;
    }
    return haystack.substring(0, offset);
}
export function convertSimple2RegExpPattern(pattern) {
    return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
}
export function stripWildcards(pattern) {
    return pattern.replace(/\*/g, '');
}
/**
 * Determines if haystack starts with needle.
 */
export function startsWith(haystack, needle) {
    if (haystack.length < needle.length) {
        return false;
    }
    if (haystack === needle) {
        return true;
    }
    for (var i = 0; i < needle.length; i++) {
        if (haystack[i] !== needle[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Determines if haystack ends with needle.
 */
export function endsWith(haystack, needle) {
    var diff = haystack.length - needle.length;
    if (diff > 0) {
        return haystack.indexOf(needle, diff) === diff;
    }
    else if (diff === 0) {
        return haystack === needle;
    }
    else {
        return false;
    }
}
export function createRegExp(searchString, isRegex, options) {
    if (options === void 0) { options = {}; }
    if (!searchString) {
        throw new Error('Cannot create regex from empty string');
    }
    if (!isRegex) {
        searchString = escapeRegExpCharacters(searchString);
    }
    if (options.wholeWord) {
        if (!/\B/.test(searchString.charAt(0))) {
            searchString = '\\b' + searchString;
        }
        if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
            searchString = searchString + '\\b';
        }
    }
    var modifiers = '';
    if (options.global) {
        modifiers += 'g';
    }
    if (!options.matchCase) {
        modifiers += 'i';
    }
    if (options.multiline) {
        modifiers += 'm';
    }
    return new RegExp(searchString, modifiers);
}
export function regExpLeadsToEndlessLoop(regexp) {
    // Exit early if it's one of these special cases which are meant to match
    // against an empty string
    if (regexp.source === '^' || regexp.source === '^$' || regexp.source === '$' || regexp.source === '^\\s*$') {
        return false;
    }
    // We check against an empty string. If the regular expression doesn't advance
    // (e.g. ends in an endless loop) it will match an empty string.
    var match = regexp.exec('');
    return (match && regexp.lastIndex === 0);
}
export function regExpContainsBackreference(regexpValue) {
    return !!regexpValue.match(/([^\\]|^)(\\\\)*\\\d+/);
}
/**
 * Returns first index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export function firstNonWhitespaceIndex(str) {
    for (var i = 0, len = str.length; i < len; i++) {
        var chCode = str.charCodeAt(i);
        if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
            return i;
        }
    }
    return -1;
}
/**
 * Returns the leading whitespace of the string.
 * If the string contains only whitespaces, returns entire string
 */
export function getLeadingWhitespace(str, start, end) {
    if (start === void 0) { start = 0; }
    if (end === void 0) { end = str.length; }
    for (var i = start; i < end; i++) {
        var chCode = str.charCodeAt(i);
        if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
            return str.substring(start, i);
        }
    }
    return str.substring(start, end);
}
/**
 * Returns last index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export function lastNonWhitespaceIndex(str, startIndex) {
    if (startIndex === void 0) { startIndex = str.length - 1; }
    for (var i = startIndex; i >= 0; i--) {
        var chCode = str.charCodeAt(i);
        if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
            return i;
        }
    }
    return -1;
}
export function compare(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else {
        return 0;
    }
}
export function compareIgnoreCase(a, b) {
    var len = Math.min(a.length, b.length);
    for (var i = 0; i < len; i++) {
        var codeA = a.charCodeAt(i);
        var codeB = b.charCodeAt(i);
        if (codeA === codeB) {
            // equal
            continue;
        }
        if (isUpperAsciiLetter(codeA)) {
            codeA += 32;
        }
        if (isUpperAsciiLetter(codeB)) {
            codeB += 32;
        }
        var diff = codeA - codeB;
        if (diff === 0) {
            // equal -> ignoreCase
            continue;
        }
        else if (isLowerAsciiLetter(codeA) && isLowerAsciiLetter(codeB)) {
            //
            return diff;
        }
        else {
            return compare(a.toLowerCase(), b.toLowerCase());
        }
    }
    if (a.length < b.length) {
        return -1;
    }
    else if (a.length > b.length) {
        return 1;
    }
    else {
        return 0;
    }
}
export function isLowerAsciiLetter(code) {
    return code >= 97 /* a */ && code <= 122 /* z */;
}
export function isUpperAsciiLetter(code) {
    return code >= 65 /* A */ && code <= 90 /* Z */;
}
function isAsciiLetter(code) {
    return isLowerAsciiLetter(code) || isUpperAsciiLetter(code);
}
export function equalsIgnoreCase(a, b) {
    var len1 = a ? a.length : 0;
    var len2 = b ? b.length : 0;
    if (len1 !== len2) {
        return false;
    }
    return doEqualsIgnoreCase(a, b);
}
function doEqualsIgnoreCase(a, b, stopAt) {
    if (stopAt === void 0) { stopAt = a.length; }
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }
    for (var i = 0; i < stopAt; i++) {
        var codeA = a.charCodeAt(i);
        var codeB = b.charCodeAt(i);
        if (codeA === codeB) {
            continue;
        }
        // a-z A-Z
        if (isAsciiLetter(codeA) && isAsciiLetter(codeB)) {
            var diff = Math.abs(codeA - codeB);
            if (diff !== 0 && diff !== 32) {
                return false;
            }
        }
        // Any other charcode
        else {
            if (String.fromCharCode(codeA).toLowerCase() !== String.fromCharCode(codeB).toLowerCase()) {
                return false;
            }
        }
    }
    return true;
}
export function startsWithIgnoreCase(str, candidate) {
    var candidateLength = candidate.length;
    if (candidate.length > str.length) {
        return false;
    }
    return doEqualsIgnoreCase(str, candidate, candidateLength);
}
/**
 * @returns the length of the common prefix of the two strings.
 */
export function commonPrefixLength(a, b) {
    var i, len = Math.min(a.length, b.length);
    for (i = 0; i < len; i++) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
            return i;
        }
    }
    return len;
}
/**
 * @returns the length of the common suffix of the two strings.
 */
export function commonSuffixLength(a, b) {
    var i, len = Math.min(a.length, b.length);
    var aLastIndex = a.length - 1;
    var bLastIndex = b.length - 1;
    for (i = 0; i < len; i++) {
        if (a.charCodeAt(aLastIndex - i) !== b.charCodeAt(bLastIndex - i)) {
            return i;
        }
    }
    return len;
}
function substrEquals(a, aStart, aEnd, b, bStart, bEnd) {
    while (aStart < aEnd && bStart < bEnd) {
        if (a[aStart] !== b[bStart]) {
            return false;
        }
        aStart += 1;
        bStart += 1;
    }
    return true;
}
/**
 * Return the overlap between the suffix of `a` and the prefix of `b`.
 * For instance `overlap("foobar", "arr, I'm a pirate") === 2`.
 */
export function overlap(a, b) {
    var aEnd = a.length;
    var bEnd = b.length;
    var aStart = aEnd - bEnd;
    if (aStart === 0) {
        return a === b ? aEnd : 0;
    }
    else if (aStart < 0) {
        bEnd += aStart;
        aStart = 0;
    }
    while (aStart < aEnd && bEnd > 0) {
        if (substrEquals(a, aStart, aEnd, b, 0, bEnd)) {
            return bEnd;
        }
        bEnd -= 1;
        aStart += 1;
    }
    return 0;
}
// --- unicode
// http://en.wikipedia.org/wiki/Surrogate_pair
// Returns the code point starting at a specified index in a string
// Code points U+0000 to U+D7FF and U+E000 to U+FFFF are represented on a single character
// Code points U+10000 to U+10FFFF are represented on two consecutive characters
//export function getUnicodePoint(str:string, index:number, len:number):number {
//	let chrCode = str.charCodeAt(index);
//	if (0xD800 <= chrCode && chrCode <= 0xDBFF && index + 1 < len) {
//		let nextChrCode = str.charCodeAt(index + 1);
//		if (0xDC00 <= nextChrCode && nextChrCode <= 0xDFFF) {
//			return (chrCode - 0xD800) << 10 + (nextChrCode - 0xDC00) + 0x10000;
//		}
//	}
//	return chrCode;
//}
export function isHighSurrogate(charCode) {
    return (0xD800 <= charCode && charCode <= 0xDBFF);
}
export function isLowSurrogate(charCode) {
    return (0xDC00 <= charCode && charCode <= 0xDFFF);
}
/**
 * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-rtl-test.js
 */
var CONTAINS_RTL = /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u08BD\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE33\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDCFF]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD50-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
/**
 * Returns true if `str` contains any Unicode character that is classified as "R" or "AL".
 */
export function containsRTL(str) {
    return CONTAINS_RTL.test(str);
}
/**
 * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-emoji-test.js
 */
var CONTAINS_EMOJI = /(?:[\u231A\u231B\u23F0\u23F3\u2600-\u27BF\u2B50\u2B55]|\uD83C[\uDDE6-\uDDFF\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEF8]|\uD83E[\uDD00-\uDDE6])/;
export function containsEmoji(str) {
    return CONTAINS_EMOJI.test(str);
}
var IS_BASIC_ASCII = /^[\t\n\r\x20-\x7E]*$/;
/**
 * Returns true if `str` contains only basic ASCII characters in the range 32 - 126 (including 32 and 126) or \n, \r, \t
 */
export function isBasicASCII(str) {
    return IS_BASIC_ASCII.test(str);
}
export function containsFullWidthCharacter(str) {
    for (var i = 0, len = str.length; i < len; i++) {
        if (isFullWidthCharacter(str.charCodeAt(i))) {
            return true;
        }
    }
    return false;
}
export function isFullWidthCharacter(charCode) {
    // Do a cheap trick to better support wrapping of wide characters, treat them as 2 columns
    // http://jrgraphix.net/research/unicode_blocks.php
    //          2E80 — 2EFF   CJK Radicals Supplement
    //          2F00 — 2FDF   Kangxi Radicals
    //          2FF0 — 2FFF   Ideographic Description Characters
    //          3000 — 303F   CJK Symbols and Punctuation
    //          3040 — 309F   Hiragana
    //          30A0 — 30FF   Katakana
    //          3100 — 312F   Bopomofo
    //          3130 — 318F   Hangul Compatibility Jamo
    //          3190 — 319F   Kanbun
    //          31A0 — 31BF   Bopomofo Extended
    //          31F0 — 31FF   Katakana Phonetic Extensions
    //          3200 — 32FF   Enclosed CJK Letters and Months
    //          3300 — 33FF   CJK Compatibility
    //          3400 — 4DBF   CJK Unified Ideographs Extension A
    //          4DC0 — 4DFF   Yijing Hexagram Symbols
    //          4E00 — 9FFF   CJK Unified Ideographs
    //          A000 — A48F   Yi Syllables
    //          A490 — A4CF   Yi Radicals
    //          AC00 — D7AF   Hangul Syllables
    // [IGNORE] D800 — DB7F   High Surrogates
    // [IGNORE] DB80 — DBFF   High Private Use Surrogates
    // [IGNORE] DC00 — DFFF   Low Surrogates
    // [IGNORE] E000 — F8FF   Private Use Area
    //          F900 — FAFF   CJK Compatibility Ideographs
    // [IGNORE] FB00 — FB4F   Alphabetic Presentation Forms
    // [IGNORE] FB50 — FDFF   Arabic Presentation Forms-A
    // [IGNORE] FE00 — FE0F   Variation Selectors
    // [IGNORE] FE20 — FE2F   Combining Half Marks
    // [IGNORE] FE30 — FE4F   CJK Compatibility Forms
    // [IGNORE] FE50 — FE6F   Small Form Variants
    // [IGNORE] FE70 — FEFF   Arabic Presentation Forms-B
    //          FF00 — FFEF   Halfwidth and Fullwidth Forms
    //               [https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms]
    //               of which FF01 - FF5E fullwidth ASCII of 21 to 7E
    // [IGNORE]    and FF65 - FFDC halfwidth of Katakana and Hangul
    // [IGNORE] FFF0 — FFFF   Specials
    charCode = +charCode; // @perf
    return ((charCode >= 0x2E80 && charCode <= 0xD7AF)
        || (charCode >= 0xF900 && charCode <= 0xFAFF)
        || (charCode >= 0xFF01 && charCode <= 0xFF5E));
}
/**
 * Given a string and a max length returns a shorted version. Shorting
 * happens at favorable positions - such as whitespace or punctuation characters.
 */
export function lcut(text, n) {
    if (text.length < n) {
        return text;
    }
    var re = /\b/g;
    var i = 0;
    while (re.test(text)) {
        if (text.length - re.lastIndex < n) {
            break;
        }
        i = re.lastIndex;
        re.lastIndex += 1;
    }
    return text.substring(i).replace(/^\s/, empty);
}
// Escape codes
// http://en.wikipedia.org/wiki/ANSI_escape_code
var EL = /\x1B\x5B[12]?K/g; // Erase in line
var COLOR_START = /\x1b\[\d+m/g; // Color
var COLOR_END = /\x1b\[0?m/g; // Color
export function removeAnsiEscapeCodes(str) {
    if (str) {
        str = str.replace(EL, '');
        str = str.replace(COLOR_START, '');
        str = str.replace(COLOR_END, '');
    }
    return str;
}
// -- UTF-8 BOM
export var UTF8_BOM_CHARACTER = String.fromCharCode(65279 /* UTF8_BOM */);
export function startsWithUTF8BOM(str) {
    return (str && str.length > 0 && str.charCodeAt(0) === 65279 /* UTF8_BOM */);
}
export function stripUTF8BOM(str) {
    return startsWithUTF8BOM(str) ? str.substr(1) : str;
}
export function safeBtoa(str) {
    return btoa(encodeURIComponent(str)); // we use encodeURIComponent because btoa fails for non Latin 1 values
}
export function repeat(s, count) {
    var result = '';
    for (var i = 0; i < count; i++) {
        result += s;
    }
    return result;
}
/**
 * Checks if the characters of the provided query string are included in the
 * target string. The characters do not have to be contiguous within the string.
 */
export function fuzzyContains(target, query) {
    if (!target || !query) {
        return false; // return early if target or query are undefined
    }
    if (target.length < query.length) {
        return false; // impossible for query to be contained in target
    }
    var queryLen = query.length;
    var targetLower = target.toLowerCase();
    var index = 0;
    var lastIndexOf = -1;
    while (index < queryLen) {
        var indexOf = targetLower.indexOf(query[index], lastIndexOf + 1);
        if (indexOf < 0) {
            return false;
        }
        lastIndexOf = indexOf;
        index++;
    }
    return true;
}
export function containsUppercaseCharacter(target, ignoreEscapedChars) {
    if (ignoreEscapedChars === void 0) { ignoreEscapedChars = false; }
    if (!target) {
        return false;
    }
    if (ignoreEscapedChars) {
        target = target.replace(/\\./g, '');
    }
    return target.toLowerCase() !== target;
}
