/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from "vscode-uri";
var Slash = '/'.charCodeAt(0);
var Dot = '.'.charCodeAt(0);
export function isAbsolutePath(path) {
    return path.charCodeAt(0) === Slash;
}
export function dirname(uri) {
    var lastIndexOfSlash = uri.lastIndexOf('/');
    return lastIndexOfSlash !== -1 ? uri.substr(0, lastIndexOfSlash) : '';
}
export function basename(uri) {
    var lastIndexOfSlash = uri.lastIndexOf('/');
    return uri.substr(lastIndexOfSlash + 1);
}
export function extname(uri) {
    for (var i = uri.length - 1; i >= 0; i--) {
        var ch = uri.charCodeAt(i);
        if (ch === Dot) {
            if (i > 0 && uri.charCodeAt(i - 1) !== Slash) {
                return uri.substr(i);
            }
            else {
                break;
            }
        }
        else if (ch === Slash) {
            break;
        }
    }
    return '';
}
export function resolvePath(uriString, path) {
    if (isAbsolutePath(path)) {
        var uri = URI.parse(uriString);
        var parts = path.split('/');
        return uri.with({ path: normalizePath(parts) }).toString();
    }
    return joinPath(uriString, path);
}
export function normalizePath(parts) {
    var newParts = [];
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (part.length === 0 || part.length === 1 && part.charCodeAt(0) === Dot) {
            // ignore
        }
        else if (part.length === 2 && part.charCodeAt(0) === Dot && part.charCodeAt(1) === Dot) {
            newParts.pop();
        }
        else {
            newParts.push(part);
        }
    }
    if (parts.length > 1 && parts[parts.length - 1].length === 0) {
        newParts.push('');
    }
    var res = newParts.join('/');
    if (parts[0].length === 0) {
        res = '/' + res;
    }
    return res;
}
export function joinPath(uriString) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    var uri = URI.parse(uriString);
    var parts = uri.path.split('/');
    for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
        var path = paths_1[_a];
        parts.push.apply(parts, path.split('/'));
    }
    return uri.with({ path: normalizePath(parts) }).toString();
}
