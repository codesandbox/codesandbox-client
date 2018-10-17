/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { isWindows } from './platform.js';
import { startsWithIgnoreCase, equalsIgnoreCase } from './strings.js';
/**
 * The forward slash path separator.
 */
export var sep = '/';
/**
 * The native path separator depending on the OS.
 */
export var nativeSep = isWindows ? '\\' : '/';
/**
 * @returns the directory name of a path.
 */
export function dirname(path) {
    var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
    if (idx === 0) {
        return '.';
    }
    else if (~idx === 0) {
        return path[0];
    }
    else if (~idx === path.length - 1) {
        return dirname(path.substring(0, path.length - 1));
    }
    else {
        var res = path.substring(0, ~idx);
        if (isWindows && res[res.length - 1] === ':') {
            res += nativeSep; // make sure drive letters end with backslash
        }
        return res;
    }
}
/**
 * @returns the base name of a path.
 */
export function basename(path) {
    var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
    if (idx === 0) {
        return path;
    }
    else if (~idx === path.length - 1) {
        return basename(path.substring(0, path.length - 1));
    }
    else {
        return path.substr(~idx + 1);
    }
}
/**
 * @returns `.far` from `boo.far` or the empty string.
 */
export function extname(path) {
    path = basename(path);
    var idx = ~path.lastIndexOf('.');
    return idx ? path.substring(~idx) : '';
}
var _posixBadPath = /(\/\.\.?\/)|(\/\.\.?)$|^(\.\.?\/)|(\/\/+)|(\\)/;
var _winBadPath = /(\\\.\.?\\)|(\\\.\.?)$|^(\.\.?\\)|(\\\\+)|(\/)/;
function _isNormal(path, win) {
    return win
        ? !_winBadPath.test(path)
        : !_posixBadPath.test(path);
}
export function normalize(path, toOSPath) {
    if (path === null || path === void 0) {
        return path;
    }
    var len = path.length;
    if (len === 0) {
        return '.';
    }
    var wantsBackslash = isWindows && toOSPath;
    if (_isNormal(path, wantsBackslash)) {
        return path;
    }
    var sep = wantsBackslash ? '\\' : '/';
    var root = getRoot(path, sep);
    // skip the root-portion of the path
    var start = root.length;
    var skip = false;
    var res = '';
    for (var end = root.length; end <= len; end++) {
        // either at the end or at a path-separator character
        if (end === len || path.charCodeAt(end) === 47 /* Slash */ || path.charCodeAt(end) === 92 /* Backslash */) {
            if (streql(path, start, end, '..')) {
                // skip current and remove parent (if there is already something)
                var prev_start = res.lastIndexOf(sep);
                var prev_part = res.slice(prev_start + 1);
                if ((root || prev_part.length > 0) && prev_part !== '..') {
                    res = prev_start === -1 ? '' : res.slice(0, prev_start);
                    skip = true;
                }
            }
            else if (streql(path, start, end, '.') && (root || res || end < len - 1)) {
                // skip current (if there is already something or if there is more to come)
                skip = true;
            }
            if (!skip) {
                var part = path.slice(start, end);
                if (res !== '' && res[res.length - 1] !== sep) {
                    res += sep;
                }
                res += part;
            }
            start = end + 1;
            skip = false;
        }
    }
    return root + res;
}
function streql(value, start, end, other) {
    return start + other.length === end && value.indexOf(other, start) === start;
}
/**
 * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
 * `getRoot('files:///files/path') === files:///`,
 * or `getRoot('\\server\shares\path') === \\server\shares\`
 */
export function getRoot(path, sep) {
    if (sep === void 0) { sep = '/'; }
    if (!path) {
        return '';
    }
    var len = path.length;
    var code = path.charCodeAt(0);
    if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
        code = path.charCodeAt(1);
        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
            // UNC candidate \\localhost\shares\ddd
            //               ^^^^^^^^^^^^^^^^^^^
            code = path.charCodeAt(2);
            if (code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                var pos_1 = 3;
                var start = pos_1;
                for (; pos_1 < len; pos_1++) {
                    code = path.charCodeAt(pos_1);
                    if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                        break;
                    }
                }
                code = path.charCodeAt(pos_1 + 1);
                if (start !== pos_1 && code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                    pos_1 += 1;
                    for (; pos_1 < len; pos_1++) {
                        code = path.charCodeAt(pos_1);
                        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                            return path.slice(0, pos_1 + 1) // consume this separator
                                .replace(/[\\/]/g, sep);
                        }
                    }
                }
            }
        }
        // /user/far
        // ^
        return sep;
    }
    else if ((code >= 65 /* A */ && code <= 90 /* Z */) || (code >= 97 /* a */ && code <= 122 /* z */)) {
        // check for windows drive letter c:\ or c:
        if (path.charCodeAt(1) === 58 /* Colon */) {
            code = path.charCodeAt(2);
            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                // C:\fff
                // ^^^
                return path.slice(0, 2) + sep;
            }
            else {
                // C:
                // ^^
                return path.slice(0, 2);
            }
        }
    }
    // check for URI
    // scheme://authority/path
    // ^^^^^^^^^^^^^^^^^^^
    var pos = path.indexOf('://');
    if (pos !== -1) {
        pos += 3; // 3 -> "://".length
        for (; pos < len; pos++) {
            code = path.charCodeAt(pos);
            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                return path.slice(0, pos + 1); // consume this separator
            }
        }
    }
    return '';
}
export var join = function () {
    // Not using a function with var-args because of how TS compiles
    // them to JS - it would result in 2*n runtime cost instead
    // of 1*n, where n is parts.length.
    var value = '';
    for (var i = 0; i < arguments.length; i++) {
        var part = arguments[i];
        if (i > 0) {
            // add the separater between two parts unless
            // there already is one
            var last = value.charCodeAt(value.length - 1);
            if (last !== 47 /* Slash */ && last !== 92 /* Backslash */) {
                var next = part.charCodeAt(0);
                if (next !== 47 /* Slash */ && next !== 92 /* Backslash */) {
                    value += sep;
                }
            }
        }
        value += part;
    }
    return normalize(value);
};
/**
 * Check if the path follows this pattern: `\\hostname\sharename`.
 *
 * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
 * @return A boolean indication if the path is a UNC path, on none-windows
 * always false.
 */
export function isUNC(path) {
    if (!isWindows) {
        // UNC is a windows concept
        return false;
    }
    if (!path || path.length < 5) {
        // at least \\a\b
        return false;
    }
    var code = path.charCodeAt(0);
    if (code !== 92 /* Backslash */) {
        return false;
    }
    code = path.charCodeAt(1);
    if (code !== 92 /* Backslash */) {
        return false;
    }
    var pos = 2;
    var start = pos;
    for (; pos < path.length; pos++) {
        code = path.charCodeAt(pos);
        if (code === 92 /* Backslash */) {
            break;
        }
    }
    if (start === pos) {
        return false;
    }
    code = path.charCodeAt(pos + 1);
    if (isNaN(code) || code === 92 /* Backslash */) {
        return false;
    }
    return true;
}
// Reference: https://en.wikipedia.org/wiki/Filename
var INVALID_FILE_CHARS = isWindows ? /[\\/:\*\?"<>\|]/g : /[\\/]/g;
var WINDOWS_FORBIDDEN_NAMES = /^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])$/i;
export function isValidBasename(name) {
    if (!name || name.length === 0 || /^\s+$/.test(name)) {
        return false; // require a name that is not just whitespace
    }
    INVALID_FILE_CHARS.lastIndex = 0; // the holy grail of software development
    if (INVALID_FILE_CHARS.test(name)) {
        return false; // check for certain invalid file characters
    }
    if (isWindows && WINDOWS_FORBIDDEN_NAMES.test(name)) {
        return false; // check for certain invalid file names
    }
    if (name === '.' || name === '..') {
        return false; // check for reserved values
    }
    if (isWindows && name[name.length - 1] === '.') {
        return false; // Windows: file cannot end with a "."
    }
    if (isWindows && name.length !== name.trim().length) {
        return false; // Windows: file cannot end with a whitespace
    }
    return true;
}
export function isEqual(pathA, pathB, ignoreCase) {
    var identityEquals = (pathA === pathB);
    if (!ignoreCase || identityEquals) {
        return identityEquals;
    }
    if (!pathA || !pathB) {
        return false;
    }
    return equalsIgnoreCase(pathA, pathB);
}
export function isEqualOrParent(path, candidate, ignoreCase) {
    if (path === candidate) {
        return true;
    }
    if (!path || !candidate) {
        return false;
    }
    if (candidate.length > path.length) {
        return false;
    }
    if (ignoreCase) {
        var beginsWith = startsWithIgnoreCase(path, candidate);
        if (!beginsWith) {
            return false;
        }
        if (candidate.length === path.length) {
            return true; // same path, different casing
        }
        var sepOffset = candidate.length;
        if (candidate.charAt(candidate.length - 1) === nativeSep) {
            sepOffset--; // adjust the expected sep offset in case our candidate already ends in separator character
        }
        return path.charAt(sepOffset) === nativeSep;
    }
    if (candidate.charAt(candidate.length - 1) !== nativeSep) {
        candidate += nativeSep;
    }
    return path.indexOf(candidate) === 0;
}
/**
 * Adapted from Node's path.isAbsolute functions
 */
export function isAbsolute(path) {
    return isWindows ?
        isAbsolute_win32(path) :
        isAbsolute_posix(path);
}
export function isAbsolute_win32(path) {
    if (!path) {
        return false;
    }
    var char0 = path.charCodeAt(0);
    if (char0 === 47 /* Slash */ || char0 === 92 /* Backslash */) {
        return true;
    }
    else if ((char0 >= 65 /* A */ && char0 <= 90 /* Z */) || (char0 >= 97 /* a */ && char0 <= 122 /* z */)) {
        if (path.length > 2 && path.charCodeAt(1) === 58 /* Colon */) {
            var char2 = path.charCodeAt(2);
            if (char2 === 47 /* Slash */ || char2 === 92 /* Backslash */) {
                return true;
            }
        }
    }
    return false;
}
export function isAbsolute_posix(path) {
    return path && path.charCodeAt(0) === 47 /* Slash */;
}
