/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as paths from './paths';
import { URI } from './uri';
import { equalsIgnoreCase } from './strings';
import { Schemas } from './network';
import { isLinux, isWindows } from './platform';
export function getComparisonKey(resource) {
    return hasToIgnoreCase(resource) ? resource.toString().toLowerCase() : resource.toString();
}
export function hasToIgnoreCase(resource) {
    // A file scheme resource is in the same platform as code, so ignore case for non linux platforms
    // Resource can be from another platform. Lowering the case as an hack. Should come from File system provider
    return resource && resource.scheme === Schemas.file ? !isLinux : true;
}
export function basenameOrAuthority(resource) {
    return basename(resource) || resource.authority;
}
/**
 * Tests wheter a `candidate` URI is a parent or equal of a given `base` URI.
 * @param base A uri which is "longer"
 * @param parentCandidate A uri which is "shorter" then `base`
 */
export function isEqualOrParent(base, parentCandidate, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = hasToIgnoreCase(base); }
    if (base.scheme === parentCandidate.scheme) {
        if (base.scheme === Schemas.file) {
            return paths.isEqualOrParent(fsPath(base), fsPath(parentCandidate), ignoreCase);
        }
        if (isEqualAuthority(base.authority, parentCandidate.authority, ignoreCase)) {
            return paths.isEqualOrParent(base.path, parentCandidate.path, ignoreCase, '/');
        }
    }
    return false;
}
function isEqualAuthority(a1, a2, ignoreCase) {
    return a1 === a2 || ignoreCase && a1 && a2 && equalsIgnoreCase(a1, a2);
}
export function isEqual(first, second, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = hasToIgnoreCase(first); }
    var identityEquals = (first === second);
    if (identityEquals) {
        return true;
    }
    if (!first || !second) {
        return false;
    }
    if (ignoreCase) {
        return equalsIgnoreCase(first.toString(), second.toString());
    }
    return first.toString() === second.toString();
}
export function basename(resource) {
    return paths.basename(resource.path);
}
/**
 * Return a URI representing the directory of a URI path.
 *
 * @param resource The input URI.
 * @returns The URI representing the directory of the input URI.
 */
export function dirname(resource) {
    var dirname = paths.dirname(resource.path, '/');
    if (resource.authority && dirname.length && dirname.charCodeAt(0) !== 47 /* Slash */) {
        return null; // If a URI contains an authority component, then the path component must either be empty or begin with a CharCode.Slash ("/") character
    }
    return resource.with({
        path: dirname
    });
}
/**
 * Join a URI path with a path fragment and normalizes the resulting path.
 *
 * @param resource The input URI.
 * @param pathFragment The path fragment to add to the URI path.
 * @returns The resulting URI.
 */
export function joinPath(resource, pathFragment) {
    var joinedPath;
    if (resource.scheme === Schemas.file) {
        joinedPath = URI.file(paths.join(fsPath(resource), pathFragment)).path;
    }
    else {
        joinedPath = paths.join(resource.path, pathFragment);
    }
    return resource.with({
        path: joinedPath
    });
}
/**
 * Normalizes the path part of a URI: Resolves `.` and `..` elements with directory names.
 *
 * @param resource The URI to normalize the path.
 * @returns The URI with the normalized path.
 */
export function normalizePath(resource) {
    var normalizedPath;
    if (resource.scheme === Schemas.file) {
        normalizedPath = URI.file(paths.normalize(fsPath(resource))).path;
    }
    else {
        normalizedPath = paths.normalize(resource.path);
    }
    return resource.with({
        path: normalizedPath
    });
}
/**
 * Returns the fsPath of an URI where the drive letter is not normalized.
 * See #56403.
 */
export function fsPath(uri) {
    var value;
    if (uri.authority && uri.path.length > 1 && uri.scheme === 'file') {
        // unc path: file://shares/c$/far/boo
        value = "//" + uri.authority + uri.path;
    }
    else if (isWindows
        && uri.path.charCodeAt(0) === 47 /* Slash */
        && (uri.path.charCodeAt(1) >= 65 /* A */ && uri.path.charCodeAt(1) <= 90 /* Z */ || uri.path.charCodeAt(1) >= 97 /* a */ && uri.path.charCodeAt(1) <= 122 /* z */)
        && uri.path.charCodeAt(2) === 58 /* Colon */) {
        value = uri.path.substr(1);
    }
    else {
        // other path
        value = uri.path;
    }
    if (isWindows) {
        value = value.replace(/\//g, '\\');
    }
    return value;
}
/**
 * Returns true if the URI path is absolute.
 */
export function isAbsolutePath(resource) {
    return paths.isAbsolute(resource.path);
}
export function distinctParents(items, resourceAccessor) {
    var distinctParents = [];
    var _loop_1 = function (i) {
        var candidateResource = resourceAccessor(items[i]);
        if (items.some(function (otherItem, index) {
            if (index === i) {
                return false;
            }
            return isEqualOrParent(candidateResource, resourceAccessor(otherItem));
        })) {
            return "continue";
        }
        distinctParents.push(items[i]);
    };
    for (var i = 0; i < items.length; i++) {
        _loop_1(i);
    }
    return distinctParents;
}
/**
 * Tests wheter the given URL is a file URI created by `URI.parse` instead of `URI.file`.
 * Such URI have no scheme or scheme that consist of a single letter (windows drive letter)
 * @param candidate The URI to test
 * @returns A corrected, real file URI if the input seems to be malformed.
 * Undefined is returned if the input URI looks fine.
 */
export function isMalformedFileUri(candidate) {
    if (!candidate.scheme || isWindows && candidate.scheme.match(/^[a-zA-Z]$/)) {
        return URI.file((candidate.scheme ? candidate.scheme + ':' : '') + candidate.path);
    }
    return void 0;
}
