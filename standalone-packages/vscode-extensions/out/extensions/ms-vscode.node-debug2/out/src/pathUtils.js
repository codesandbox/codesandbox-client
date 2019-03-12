"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FS = require("fs");
const CP = require("child_process");
/**
 * The input paths must use the path syntax of the underlying operating system.
 */
function makePathAbsolute(absPath, relPath) {
    return Path.resolve(Path.dirname(absPath), relPath);
}
exports.makePathAbsolute = makePathAbsolute;
/**
 * Remove the first segment of the given path and return the result.
 * The input path must use the path syntax of the underlying operating system.
 */
function removeFirstSegment(path) {
    const segments = path.split(Path.sep);
    segments.shift();
    if (segments.length > 0) {
        return segments.join(Path.sep);
    }
    return null;
}
exports.removeFirstSegment = removeFirstSegment;
/**
 * Return the relative path between 'path' and 'target'.
 * The input paths must use the path syntax of the underlying operating system.
 */
function makeRelative(target, path) {
    const t = target.split(Path.sep);
    const p = path.split(Path.sep);
    let i = 0;
    for (; i < Math.min(t.length, p.length) && t[i] === p[i]; i++) {
    }
    let result = '';
    for (; i < p.length; i++) {
        result = Path.join(result, p[i]);
    }
    return result;
}
exports.makeRelative = makeRelative;
/**
 * Returns a path with a lower case drive letter.
 */
function normalizeDriveLetter(path) {
    const regex = /^([A-Z])(\:[\\\/].*)$/;
    if (regex.test(path)) {
        path = path.replace(regex, (s, s1, s2) => s1.toLowerCase() + s2);
    }
    return path;
}
exports.normalizeDriveLetter = normalizeDriveLetter;
function pathCompare(path1, path2) {
    return normalizeDriveLetter(path1) === normalizeDriveLetter(path2);
}
exports.pathCompare = pathCompare;
/**
 * Given an absolute, normalized, and existing file path 'realPath' returns the exact path that the file has on disk.
 * On a case insensitive file system, the returned path might differ from the original path by character casing.
 * On a case sensitive file system, the returned path will always be identical to the original path.
 * In case of errors, null is returned. But you cannot use this function to verify that a path exists.
 * realPath does not handle '..' or '.' path segments and it does not take the locale into account.
 * Since a drive letter of a Windows path cannot be looked up, realPath normalizes the drive letter to lower case.
 */
function realCasePath(path) {
    let dir = Path.dirname(path);
    if (path === dir) { // end recursion
        // is this an upper case drive letter?
        if (/^[A-Z]\:\\$/.test(path)) {
            path = path.toLowerCase();
        }
        return path;
    }
    let name = Path.basename(path).toLowerCase();
    try {
        let entries = FS.readdirSync(dir);
        let found = entries.filter(e => e.toLowerCase() === name); // use a case insensitive search
        if (found.length === 1) {
            // on a case sensitive filesystem we cannot determine here, whether the file exists or not, hence we need the 'file exists' precondition
            let prefix = realCasePath(dir); // recurse
            if (prefix) {
                return Path.join(prefix, found[0]);
            }
        }
        else if (found.length > 1) {
            // must be a case sensitive $filesystem
            const ix = found.indexOf(name);
            if (ix >= 0) { // case sensitive
                let prefix = realCasePath(dir); // recurse
                if (prefix) {
                    return Path.join(prefix, found[ix]);
                }
            }
        }
    }
    catch (error) {
        // silently ignore error
    }
    return null;
}
exports.realCasePath = realCasePath;
function isSymlinkedPath(path) {
    return new Promise((resolve, reject) => {
        FS.lstat(path, (err, stats) => {
            if (err) {
                reject(err);
            }
            if (stats.isSymbolicLink()) {
                resolve(true);
            }
            else {
                const parent = Path.dirname(path);
                if (parent === path) {
                    resolve(false);
                }
                else {
                    resolve(isSymlinkedPath(parent));
                }
            }
        });
    });
}
exports.isSymlinkedPath = isSymlinkedPath;
/**
 * Make sure that all directories of the given path exist (like mkdir -p).
 */
function mkdirs(path) {
    if (!FS.existsSync(path)) {
        mkdirs(Path.dirname(path));
        FS.mkdirSync(path);
    }
}
exports.mkdirs = mkdirs;
// ---- the following functions work with Windows and Unix-style paths independent from the underlying OS.
/**
 * Returns true if the Windows or Unix-style path is absolute.
 */
function isAbsolutePath(path) {
    if (path) {
        if (path.charAt(0) === '/') {
            return true;
        }
        if (/^[a-zA-Z]\:[\\\/]/.test(path)) {
            return true;
        }
    }
    return false;
}
exports.isAbsolutePath = isAbsolutePath;
/**
 * Convert the given Windows or Unix-style path into a normalized path that only uses forward slashes and has all superflous '..' sequences removed.
 * If the path starts with a Windows-style drive letter, a '/' is prepended.
 */
function normalize(path) {
    path = path.replace(/\\/g, '/');
    if (/^[a-zA-Z]\:\//.test(path)) {
        path = '/' + path;
    }
    path = Path.normalize(path); // use node's normalize to remove '<dir>/..' etc.
    path = path.replace(/\\/g, '/');
    return path;
}
exports.normalize = normalize;
/**
 * Convert the given normalized path into a Windows-style path.
 */
function toWindows(path) {
    if (/^\/[a-zA-Z]\:\//.test(path)) {
        path = path.substr(1);
    }
    path = path.replace(/\//g, '\\');
    return path;
}
exports.toWindows = toWindows;
/**
 * Append the given relative path to the absolute path and normalize the result.
 */
function join(absPath, relPath) {
    absPath = normalize(absPath);
    relPath = normalize(relPath);
    if (absPath.charAt(absPath.length - 1) === '/') {
        absPath = absPath + relPath;
    }
    else {
        absPath = absPath + '/' + relPath;
    }
    absPath = Path.normalize(absPath);
    absPath = absPath.replace(/\\/g, '/');
    return absPath;
}
exports.join = join;
/**
 * Return the relative path between 'from' and 'to'.
 */
function makeRelative2(from, to) {
    from = normalize(from);
    to = normalize(to);
    const froms = from.substr(1).split('/');
    const tos = to.substr(1).split('/');
    while (froms.length > 0 && tos.length > 0 && froms[0] === tos[0]) {
        froms.shift();
        tos.shift();
    }
    let l = froms.length - tos.length;
    if (l === 0) {
        l = tos.length - 1;
    }
    while (l > 0) {
        tos.unshift('..');
        l--;
    }
    return tos.join('/');
}
exports.makeRelative2 = makeRelative2;
/*
 * Lookup the given program on the PATH and return its absolute path on success and undefined otherwise.
 */
function findOnPath(program, args_env) {
    const env = extendObject(extendObject({}, process.env), args_env);
    let locator;
    if (process.platform === 'win32') {
        const windir = env['WINDIR'] || 'C:\\Windows';
        locator = Path.join(windir, 'System32', 'where.exe');
    }
    else {
        locator = '/usr/bin/which';
    }
    try {
        if (FS.existsSync(locator)) {
            const lines = CP.execSync(`${locator} ${program}`, { env }).toString().split(/\r?\n/);
            if (process.platform === 'win32') {
                // return the first path that has a executable extension
                const executableExtensions = env['PATHEXT'].toUpperCase();
                for (const path of lines) {
                    const ext = Path.extname(path).toUpperCase();
                    if (ext && executableExtensions.indexOf(ext + ';') > 0) {
                        return path;
                    }
                }
            }
            else {
                // return the first path
                if (lines.length > 0) {
                    return lines[0];
                }
            }
            return undefined;
        }
        else {
            // do not report failure if 'locator' app doesn't exist
        }
        return program;
    }
    catch (err) {
        // fall through
    }
    // fail
    return undefined;
}
exports.findOnPath = findOnPath;
function findExecutable(program, args_env) {
    const env = extendObject(extendObject({}, process.env), args_env);
    if (process.platform === 'win32' && !Path.extname(program)) {
        const PATHEXT = env['PATHEXT'];
        if (PATHEXT) {
            const executableExtensions = PATHEXT.split(';');
            for (const extension of executableExtensions) {
                const path = program + extension;
                if (FS.existsSync(path)) {
                    return path;
                }
            }
        }
    }
    if (FS.existsSync(program)) {
        return program;
    }
    return undefined;
}
exports.findExecutable = findExecutable;
function extendObject(toObject, fromObject) {
    for (let key in fromObject) {
        if (fromObject.hasOwnProperty(key)) {
            toObject[key] = fromObject[key];
        }
    }
    return toObject;
}
exports.extendObject = extendObject;

//# sourceMappingURL=pathUtils.js.map
