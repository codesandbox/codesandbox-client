/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { equalsIgnoreCase } from '../../../../base/common/strings.js';
import { URI as uri } from '../../../../base/common/uri.js';
import { isAbsolute_posix, isAbsolute_win32 } from '../../../../base/common/paths.js';
import { deepClone } from '../../../../base/common/objects.js';
var _formatPIIRegexp = /{([^}]+)}/g;
export function formatPII(value, excludePII, args) {
    return value.replace(_formatPIIRegexp, function (match, group) {
        if (excludePII && group.length > 0 && group[0] !== '_') {
            return match;
        }
        return args && args.hasOwnProperty(group) ?
            args[group] :
            match;
    });
}
export function isExtensionHostDebugging(config) {
    return config.type && equalsIgnoreCase(config.type === 'vslsShare' ? config.adapterProxy.configuration.type : config.type, 'extensionhost');
}
export function getExactExpressionStartAndEnd(lineContent, looseStart, looseEnd) {
    var matchingExpression = undefined;
    var startOffset = 0;
    // Some example supported expressions: myVar.prop, a.b.c.d, myVar?.prop, myVar->prop, MyClass::StaticProp, *myVar
    // Match any character except a set of characters which often break interesting sub-expressions
    var expression = /([^()\[\]{}<>\s+\-/%~#^;=|,`!]|\->)+/g;
    var result = undefined;
    // First find the full expression under the cursor
    while (result = expression.exec(lineContent)) {
        var start = result.index + 1;
        var end = start + result[0].length;
        if (start <= looseStart && end >= looseEnd) {
            matchingExpression = result[0];
            startOffset = start;
            break;
        }
    }
    // If there are non-word characters after the cursor, we want to truncate the expression then.
    // For example in expression 'a.b.c.d', if the focus was under 'b', 'a.b' would be evaluated.
    if (matchingExpression) {
        var subExpression = /\w+/g;
        var subExpressionResult = undefined;
        while (subExpressionResult = subExpression.exec(matchingExpression)) {
            var subEnd = subExpressionResult.index + 1 + startOffset + subExpressionResult[0].length;
            if (subEnd >= looseEnd) {
                break;
            }
        }
        if (subExpressionResult) {
            matchingExpression = matchingExpression.substring(0, subExpression.lastIndex);
        }
    }
    return matchingExpression ?
        { start: startOffset, end: startOffset + matchingExpression.length - 1 } :
        { start: 0, end: 0 };
}
// RFC 2396, Appendix A: https://www.ietf.org/rfc/rfc2396.txt
var _schemePattern = /^[a-zA-Z][a-zA-Z0-9\+\-\.]+:/;
export function isUri(s) {
    // heuristics: a valid uri starts with a scheme and
    // the scheme has at least 2 characters so that it doesn't look like a drive letter.
    return s && s.match(_schemePattern);
}
export function stringToUri(source) {
    if (typeof source.path === 'string') {
        if (isUri(source.path)) {
            source.path = uri.parse(source.path);
        }
        else {
            // assume path
            if (isAbsolute_posix(source.path) || isAbsolute_win32(source.path)) {
                source.path = uri.file(source.path);
            }
            else {
                // leave relative path as is
            }
        }
    }
}
export function uriToString(source) {
    if (typeof source.path === 'object') {
        var u = uri.revive(source.path);
        if (u.scheme === 'file') {
            source.path = u.fsPath;
        }
        else {
            source.path = u.toString();
        }
    }
}
// path hooks helpers
export function convertToDAPaths(message, fixSourcePaths) {
    // since we modify Source.paths in the message in place, we need to make a copy of it (see #61129)
    var msg = deepClone(message);
    convertPaths(msg, function (toDA, source) {
        if (toDA && source) {
            fixSourcePaths(source);
        }
    });
    return msg;
}
export function convertToVSCPaths(message, fixSourcePaths) {
    // since we modify Source.paths in the message in place, we need to make a copy of it (see #61129)
    var msg = deepClone(message);
    convertPaths(msg, function (toDA, source) {
        if (!toDA && source) {
            fixSourcePaths(source);
        }
    });
    return msg;
}
function convertPaths(msg, fixSourcePaths) {
    switch (msg.type) {
        case 'event':
            var event_1 = msg;
            switch (event_1.event) {
                case 'output':
                    fixSourcePaths(false, event_1.body.source);
                    break;
                case 'loadedSource':
                    fixSourcePaths(false, event_1.body.source);
                    break;
                case 'breakpoint':
                    fixSourcePaths(false, event_1.body.breakpoint.source);
                    break;
                default:
                    break;
            }
            break;
        case 'request':
            var request = msg;
            switch (request.command) {
                case 'setBreakpoints':
                    fixSourcePaths(true, request.arguments.source);
                    break;
                case 'source':
                    fixSourcePaths(true, request.arguments.source);
                    break;
                case 'gotoTargets':
                    fixSourcePaths(true, request.arguments.source);
                    break;
                default:
                    break;
            }
            break;
        case 'response':
            var response = msg;
            if (response.success) {
                switch (response.command) {
                    case 'stackTrace':
                        var r1 = response;
                        r1.body.stackFrames.forEach(function (frame) { return fixSourcePaths(false, frame.source); });
                        break;
                    case 'loadedSources':
                        var r2 = response;
                        r2.body.sources.forEach(function (source) { return fixSourcePaths(false, source); });
                        break;
                    case 'scopes':
                        var r3 = response;
                        r3.body.scopes.forEach(function (scope) { return fixSourcePaths(false, scope.source); });
                        break;
                    case 'setFunctionBreakpoints':
                        var r4 = response;
                        r4.body.breakpoints.forEach(function (bp) { return fixSourcePaths(false, bp.source); });
                        break;
                    case 'setBreakpoints':
                        var r5 = response;
                        r5.body.breakpoints.forEach(function (bp) { return fixSourcePaths(false, bp.source); });
                        break;
                    default:
                        break;
                }
            }
            break;
    }
}
