/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as glob from '../../../../base/common/glob.js';
export function isSerializedSearchComplete(arg) {
    if (arg.type === 'error') {
        return true;
    }
    else if (arg.type === 'success') {
        return true;
    }
    else {
        return false;
    }
}
export function isSerializedSearchSuccess(arg) {
    return arg.type === 'success';
}
export function isSerializedFileMatch(arg) {
    return !!arg.path;
}
var FileMatch = /** @class */ (function () {
    function FileMatch(path) {
        this.path = path;
        this.results = [];
    }
    FileMatch.prototype.addMatch = function (match) {
        this.results.push(match);
    };
    FileMatch.prototype.serialize = function () {
        return {
            path: this.path,
            results: this.results,
            numMatches: this.results.length
        };
    };
    return FileMatch;
}());
export { FileMatch };
/**
 *  Computes the patterns that the provider handles. Discards sibling clauses and 'false' patterns
 */
export function resolvePatternsForProvider(globalPattern, folderPattern) {
    var merged = __assign({}, (globalPattern || {}), (folderPattern || {}));
    return Object.keys(merged)
        .filter(function (key) {
        var value = merged[key];
        return typeof value === 'boolean' && value;
    });
}
var QueryGlobTester = /** @class */ (function () {
    function QueryGlobTester(config, folderQuery) {
        this._excludeExpression = __assign({}, (config.excludePattern || {}), (folderQuery.excludePattern || {}));
        this._parsedExcludeExpression = glob.parse(this._excludeExpression);
        // Empty includeExpression means include nothing, so no {} shortcuts
        var includeExpression = config.includePattern;
        if (folderQuery.includePattern) {
            if (includeExpression) {
                includeExpression = __assign({}, includeExpression, folderQuery.includePattern);
            }
            else {
                includeExpression = folderQuery.includePattern;
            }
        }
        if (includeExpression) {
            this._parsedIncludeExpression = glob.parse(includeExpression);
        }
    }
    /**
     * Guaranteed sync - siblingsFn should not return a promise.
     */
    QueryGlobTester.prototype.includedInQuerySync = function (testPath, basename, hasSibling) {
        if (this._parsedExcludeExpression && this._parsedExcludeExpression(testPath, basename, hasSibling)) {
            return false;
        }
        if (this._parsedIncludeExpression && !this._parsedIncludeExpression(testPath, basename, hasSibling)) {
            return false;
        }
        return true;
    };
    /**
     * Guaranteed async.
     */
    QueryGlobTester.prototype.includedInQuery = function (testPath, basename, hasSibling) {
        var _this = this;
        var excludeP = this._parsedExcludeExpression ?
            Promise.resolve(this._parsedExcludeExpression(testPath, basename, hasSibling)).then(function (result) { return !!result; }) :
            Promise.resolve(false);
        return excludeP.then(function (excluded) {
            if (excluded) {
                return false;
            }
            return _this._parsedIncludeExpression ?
                Promise.resolve(_this._parsedIncludeExpression(testPath, basename, hasSibling)).then(function (result) { return !!result; }) :
                Promise.resolve(true);
        }).then(function (included) {
            return included;
        });
    };
    QueryGlobTester.prototype.hasSiblingExcludeClauses = function () {
        return hasSiblingClauses(this._excludeExpression);
    };
    return QueryGlobTester;
}());
export { QueryGlobTester };
function hasSiblingClauses(pattern) {
    for (var key in pattern) {
        if (typeof pattern[key] !== 'boolean') {
            return true;
        }
    }
    return false;
}
