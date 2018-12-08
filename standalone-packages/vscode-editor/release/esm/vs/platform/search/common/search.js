/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { mapArrayOrNot } from '../../../base/common/arrays.js';
import * as glob from '../../../base/common/glob.js';
import * as objects from '../../../base/common/objects.js';
import * as paths from '../../../base/common/paths.js';
import { getNLines } from '../../../base/common/strings.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var VIEW_ID = 'workbench.view.search';
export var ISearchHistoryService = createDecorator('searchHistoryService');
export var ISearchService = createDecorator('searchService');
export function resultIsMatch(result) {
    return !!result.preview;
}
var FileMatch = /** @class */ (function () {
    function FileMatch(resource) {
        this.resource = resource;
        this.results = [];
        // empty
    }
    return FileMatch;
}());
export { FileMatch };
var TextSearchMatch = /** @class */ (function () {
    function TextSearchMatch(text, range, previewOptions) {
        this.ranges = range;
        if (previewOptions && previewOptions.matchLines === 1 && !Array.isArray(range)) {
            // 1 line preview requested
            text = getNLines(text, previewOptions.matchLines);
            var leadingChars = Math.floor(previewOptions.charsPerLine / 5);
            var previewStart = Math.max(range.startColumn - leadingChars, 0);
            var previewText = text.substring(previewStart, previewOptions.charsPerLine + previewStart);
            var endColInPreview = (range.endLineNumber - range.startLineNumber + 1) <= previewOptions.matchLines ?
                Math.min(previewText.length, range.endColumn - previewStart) : // if number of match lines will not be trimmed by previewOptions
                previewText.length; // if number of lines is trimmed
            this.preview = {
                text: previewText,
                matches: new OneLineRange(0, range.startColumn - previewStart, endColInPreview)
            };
        }
        else {
            var firstMatchLine_1 = Array.isArray(range) ? range[0].startLineNumber : range.startLineNumber;
            // n line, no preview requested, or multiple matches in the preview
            this.preview = {
                text: text,
                matches: mapArrayOrNot(range, function (r) { return new SearchRange(r.startLineNumber - firstMatchLine_1, r.startColumn, r.endLineNumber - firstMatchLine_1, r.endColumn); })
            };
        }
    }
    return TextSearchMatch;
}());
export { TextSearchMatch };
var SearchRange = /** @class */ (function () {
    function SearchRange(startLineNumber, startColumn, endLineNumber, endColumn) {
        this.startLineNumber = startLineNumber;
        this.startColumn = startColumn;
        this.endLineNumber = endLineNumber;
        this.endColumn = endColumn;
    }
    return SearchRange;
}());
export { SearchRange };
var OneLineRange = /** @class */ (function (_super) {
    __extends(OneLineRange, _super);
    function OneLineRange(lineNumber, startColumn, endColumn) {
        return _super.call(this, lineNumber, startColumn, lineNumber, endColumn) || this;
    }
    return OneLineRange;
}(SearchRange));
export { OneLineRange };
export function getExcludes(configuration) {
    var fileExcludes = configuration && configuration.files && configuration.files.exclude;
    var searchExcludes = configuration && configuration.search && configuration.search.exclude;
    if (!fileExcludes && !searchExcludes) {
        return undefined;
    }
    if (!fileExcludes || !searchExcludes) {
        return fileExcludes || searchExcludes;
    }
    var allExcludes = Object.create(null);
    // clone the config as it could be frozen
    allExcludes = objects.mixin(allExcludes, objects.deepClone(fileExcludes));
    allExcludes = objects.mixin(allExcludes, objects.deepClone(searchExcludes), true);
    return allExcludes;
}
export function pathIncludedInQuery(queryProps, fsPath) {
    if (queryProps.excludePattern && glob.match(queryProps.excludePattern, fsPath)) {
        return false;
    }
    if (queryProps.includePattern && !glob.match(queryProps.includePattern, fsPath)) {
        return false;
    }
    // If searchPaths are being used, the extra file must be in a subfolder and match the pattern, if present
    if (queryProps.usingSearchPaths) {
        return !!queryProps.folderQueries && queryProps.folderQueries.every(function (fq) {
            var searchPath = fq.folder.fsPath;
            if (paths.isEqualOrParent(fsPath, searchPath)) {
                return !fq.includePattern || !!glob.match(fq.includePattern, fsPath);
            }
            else {
                return false;
            }
        });
    }
    return true;
}
export var SearchErrorCode;
(function (SearchErrorCode) {
    SearchErrorCode[SearchErrorCode["unknownEncoding"] = 1] = "unknownEncoding";
    SearchErrorCode[SearchErrorCode["regexParseError"] = 2] = "regexParseError";
    SearchErrorCode[SearchErrorCode["globParseError"] = 3] = "globParseError";
    SearchErrorCode[SearchErrorCode["invalidLiteral"] = 4] = "invalidLiteral";
    SearchErrorCode[SearchErrorCode["rgProcessError"] = 5] = "rgProcessError";
    SearchErrorCode[SearchErrorCode["other"] = 6] = "other";
})(SearchErrorCode || (SearchErrorCode = {}));
var SearchError = /** @class */ (function (_super) {
    __extends(SearchError, _super);
    function SearchError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        return _this;
    }
    return SearchError;
}(Error));
export { SearchError };
export function deserializeSearchError(errorMsg) {
    try {
        var details = JSON.parse(errorMsg);
        return new SearchError(details.message, details.code);
    }
    catch (e) {
        return new SearchError(errorMsg, SearchErrorCode.other);
    }
}
export function serializeSearchError(searchError) {
    var details = { message: searchError.message, code: searchError.code };
    return new Error(JSON.stringify(details));
}
