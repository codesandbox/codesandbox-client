/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { URI } from './uri.js';
import { nativeSep, normalize, basename as pathsBasename, sep } from './paths.js';
import { endsWith, ltrim, startsWithIgnoreCase, rtrim, startsWith } from './strings.js';
import { Schemas } from './network.js';
import { isLinux, isWindows, isMacintosh } from './platform.js';
import { isEqual } from './resources.js';
/**
 * @deprecated use LabelService instead
 */
export function getPathLabel(resource, userHomeProvider, rootProvider) {
    if (!resource) {
        return null;
    }
    if (typeof resource === 'string') {
        resource = URI.file(resource);
    }
    // return early if we can resolve a relative path label from the root
    var baseResource = rootProvider ? rootProvider.getWorkspaceFolder(resource) : null;
    if (baseResource) {
        var hasMultipleRoots = rootProvider.getWorkspace().folders.length > 1;
        var pathLabel = void 0;
        if (isEqual(baseResource.uri, resource, !isLinux)) {
            pathLabel = ''; // no label if paths are identical
        }
        else {
            pathLabel = normalize(ltrim(resource.path.substr(baseResource.uri.path.length), sep), true);
        }
        if (hasMultipleRoots) {
            var rootName = (baseResource && baseResource.name) ? baseResource.name : pathsBasename(baseResource.uri.fsPath);
            pathLabel = pathLabel ? (rootName + ' • ' + pathLabel) : rootName; // always show root basename if there are multiple
        }
        return pathLabel;
    }
    // return if the resource is neither file:// nor untitled:// and no baseResource was provided
    if (resource.scheme !== Schemas.file && resource.scheme !== Schemas.untitled) {
        return resource.with({ query: null, fragment: null }).toString(true);
    }
    // convert c:\something => C:\something
    if (hasDriveLetter(resource.fsPath)) {
        return normalize(normalizeDriveLetter(resource.fsPath), true);
    }
    // normalize and tildify (macOS, Linux only)
    var res = normalize(resource.fsPath, true);
    if (!isWindows && userHomeProvider) {
        res = tildify(res, userHomeProvider.userHome);
    }
    return res;
}
export function getBaseLabel(resource) {
    if (!resource) {
        return null;
    }
    if (typeof resource === 'string') {
        resource = URI.file(resource);
    }
    var base = pathsBasename(resource.path) || (resource.scheme === Schemas.file ? resource.fsPath : resource.path) /* can be empty string if '/' is passed in */;
    // convert c: => C:
    if (hasDriveLetter(base)) {
        return normalizeDriveLetter(base);
    }
    return base;
}
function hasDriveLetter(path) {
    return isWindows && path && path[1] === ':';
}
export function normalizeDriveLetter(path) {
    if (hasDriveLetter(path)) {
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
    return path;
}
var normalizedUserHomeCached = Object.create(null);
export function tildify(path, userHome) {
    if (isWindows || !path || !userHome) {
        return path; // unsupported
    }
    // Keep a normalized user home path as cache to prevent accumulated string creation
    var normalizedUserHome = normalizedUserHomeCached.original === userHome ? normalizedUserHomeCached.normalized : void 0;
    if (!normalizedUserHome) {
        normalizedUserHome = "" + rtrim(userHome, sep) + sep;
        normalizedUserHomeCached = { original: userHome, normalized: normalizedUserHome };
    }
    // Linux: case sensitive, macOS: case insensitive
    if (isLinux ? startsWith(path, normalizedUserHome) : startsWithIgnoreCase(path, normalizedUserHome)) {
        path = "~/" + path.substr(normalizedUserHome.length);
    }
    return path;
}
export function untildify(path, userHome) {
    return path.replace(/^~($|\/|\\)/, userHome + "$1");
}
/**
 * Shortens the paths but keeps them easy to distinguish.
 * Replaces not important parts with ellipsis.
 * Every shorten path matches only one original path and vice versa.
 *
 * Algorithm for shortening paths is as follows:
 * 1. For every path in list, find unique substring of that path.
 * 2. Unique substring along with ellipsis is shortened path of that path.
 * 3. To find unique substring of path, consider every segment of length from 1 to path.length of path from end of string
 *    and if present segment is not substring to any other paths then present segment is unique path,
 *    else check if it is not present as suffix of any other path and present segment is suffix of path itself,
 *    if it is true take present segment as unique path.
 * 4. Apply ellipsis to unique segment according to whether segment is present at start/in-between/end of path.
 *
 * Example 1
 * 1. consider 2 paths i.e. ['a\\b\\c\\d', 'a\\f\\b\\c\\d']
 * 2. find unique path of first path,
 * 	a. 'd' is present in path2 and is suffix of path2, hence not unique of present path.
 * 	b. 'c' is present in path2 and 'c' is not suffix of present path, similarly for 'b' and 'a' also.
 * 	c. 'd\\c' is suffix of path2.
 *  d. 'b\\c' is not suffix of present path.
 *  e. 'a\\b' is not present in path2, hence unique path is 'a\\b...'.
 * 3. for path2, 'f' is not present in path1 hence unique is '...\\f\\...'.
 *
 * Example 2
 * 1. consider 2 paths i.e. ['a\\b', 'a\\b\\c'].
 * 	a. Even if 'b' is present in path2, as 'b' is suffix of path1 and is not suffix of path2, unique path will be '...\\b'.
 * 2. for path2, 'c' is not present in path1 hence unique path is '..\\c'.
 */
var ellipsis = '\u2026';
var unc = '\\\\';
var home = '~';
export function shorten(paths) {
    var shortenedPaths = new Array(paths.length);
    // for every path
    var match = false;
    for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
        var path = paths[pathIndex];
        if (path === '') {
            shortenedPaths[pathIndex] = "." + nativeSep;
            continue;
        }
        if (!path) {
            shortenedPaths[pathIndex] = path;
            continue;
        }
        match = true;
        // trim for now and concatenate unc path (e.g. \\network) or root path (/etc, ~/etc) later
        var prefix = '';
        if (path.indexOf(unc) === 0) {
            prefix = path.substr(0, path.indexOf(unc) + unc.length);
            path = path.substr(path.indexOf(unc) + unc.length);
        }
        else if (path.indexOf(nativeSep) === 0) {
            prefix = path.substr(0, path.indexOf(nativeSep) + nativeSep.length);
            path = path.substr(path.indexOf(nativeSep) + nativeSep.length);
        }
        else if (path.indexOf(home) === 0) {
            prefix = path.substr(0, path.indexOf(home) + home.length);
            path = path.substr(path.indexOf(home) + home.length);
        }
        // pick the first shortest subpath found
        var segments = path.split(nativeSep);
        for (var subpathLength = 1; match && subpathLength <= segments.length; subpathLength++) {
            for (var start = segments.length - subpathLength; match && start >= 0; start--) {
                match = false;
                var subpath = segments.slice(start, start + subpathLength).join(nativeSep);
                // that is unique to any other path
                for (var otherPathIndex = 0; !match && otherPathIndex < paths.length; otherPathIndex++) {
                    // suffix subpath treated specially as we consider no match 'x' and 'x/...'
                    if (otherPathIndex !== pathIndex && paths[otherPathIndex] && paths[otherPathIndex].indexOf(subpath) > -1) {
                        var isSubpathEnding = (start + subpathLength === segments.length);
                        // Adding separator as prefix for subpath, such that 'endsWith(src, trgt)' considers subpath as directory name instead of plain string.
                        // prefix is not added when either subpath is root directory or path[otherPathIndex] does not have multiple directories.
                        var subpathWithSep = (start > 0 && paths[otherPathIndex].indexOf(nativeSep) > -1) ? nativeSep + subpath : subpath;
                        var isOtherPathEnding = endsWith(paths[otherPathIndex], subpathWithSep);
                        match = !isSubpathEnding || isOtherPathEnding;
                    }
                }
                // found unique subpath
                if (!match) {
                    var result = '';
                    // preserve disk drive or root prefix
                    if (endsWith(segments[0], ':') || prefix !== '') {
                        if (start === 1) {
                            // extend subpath to include disk drive prefix
                            start = 0;
                            subpathLength++;
                            subpath = segments[0] + nativeSep + subpath;
                        }
                        if (start > 0) {
                            result = segments[0] + nativeSep;
                        }
                        result = prefix + result;
                    }
                    // add ellipsis at the beginning if neeeded
                    if (start > 0) {
                        result = result + ellipsis + nativeSep;
                    }
                    result = result + subpath;
                    // add ellipsis at the end if needed
                    if (start + subpathLength < segments.length) {
                        result = result + nativeSep + ellipsis;
                    }
                    shortenedPaths[pathIndex] = result;
                }
            }
        }
        if (match) {
            shortenedPaths[pathIndex] = path; // use full path if no unique subpaths found
        }
    }
    return shortenedPaths;
}
var Type;
(function (Type) {
    Type[Type["TEXT"] = 0] = "TEXT";
    Type[Type["VARIABLE"] = 1] = "VARIABLE";
    Type[Type["SEPARATOR"] = 2] = "SEPARATOR";
})(Type || (Type = {}));
/**
 * Helper to insert values for specific template variables into the string. E.g. "this $(is) a $(template)" can be
 * passed to this function together with an object that maps "is" and "template" to strings to have them replaced.
 * @param value string to which templating is applied
 * @param values the values of the templates to use
 */
export function template(template, values) {
    if (values === void 0) { values = Object.create(null); }
    var segments = [];
    var inVariable = false;
    var char;
    var curVal = '';
    for (var i = 0; i < template.length; i++) {
        char = template[i];
        // Beginning of variable
        if (char === '$' || (inVariable && char === '{')) {
            if (curVal) {
                segments.push({ value: curVal, type: Type.TEXT });
            }
            curVal = '';
            inVariable = true;
        }
        // End of variable
        else if (char === '}' && inVariable) {
            var resolved = values[curVal];
            // Variable
            if (typeof resolved === 'string') {
                if (resolved.length) {
                    segments.push({ value: resolved, type: Type.VARIABLE });
                }
            }
            // Separator
            else if (resolved) {
                var prevSegment = segments[segments.length - 1];
                if (!prevSegment || prevSegment.type !== Type.SEPARATOR) {
                    segments.push({ value: resolved.label, type: Type.SEPARATOR }); // prevent duplicate separators
                }
            }
            curVal = '';
            inVariable = false;
        }
        // Text or Variable Name
        else {
            curVal += char;
        }
    }
    // Tail
    if (curVal && !inVariable) {
        segments.push({ value: curVal, type: Type.TEXT });
    }
    return segments.filter(function (segment, index) {
        // Only keep separator if we have values to the left and right
        if (segment.type === Type.SEPARATOR) {
            var left = segments[index - 1];
            var right = segments[index + 1];
            return [left, right].every(function (segment) { return segment && (segment.type === Type.VARIABLE || segment.type === Type.TEXT) && segment.value.length > 0; });
        }
        // accept any TEXT and VARIABLE
        return true;
    }).map(function (segment) { return segment.value; }).join('');
}
/**
 * Handles mnemonics for menu items. Depending on OS:
 * - Windows: Supported via & character (replace && with &)
 * -   Linux: Supported via & character (replace && with &)
 * -   macOS: Unsupported (replace && with empty string)
 */
export function mnemonicMenuLabel(label, forceDisableMnemonics) {
    if (isMacintosh || forceDisableMnemonics) {
        return label.replace(/\(&&\w\)|&&/g, '');
    }
    return label.replace(/&&/g, '&');
}
/**
 * Handles mnemonics for buttons. Depending on OS:
 * - Windows: Supported via & character (replace && with &)
 * -   Linux: Supported via _ character (replace && with _)
 * -   macOS: Unsupported (replace && with empty string)
 */
export function mnemonicButtonLabel(label) {
    if (isMacintosh) {
        return label.replace(/\(&&\w\)|&&/g, '');
    }
    return label.replace(/&&/g, isWindows ? '&' : '_');
}
export function unmnemonicLabel(label) {
    return label.replace(/&/g, '&&');
}
