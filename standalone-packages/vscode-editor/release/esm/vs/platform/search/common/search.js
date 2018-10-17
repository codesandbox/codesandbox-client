/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as glob from '../../../base/common/glob.js';
import * as objects from '../../../base/common/objects.js';
import * as paths from '../../../base/common/paths.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var VIEW_ID = 'workbench.view.search';
export var ISearchHistoryService = createDecorator('searchHistoryService');
export var ISearchService = createDecorator('searchService');
var FileMatch = /** @class */ (function () {
    function FileMatch(resource) {
        this.resource = resource;
        this.matches = [];
        // empty
    }
    return FileMatch;
}());
export { FileMatch };
var TextSearchResult = /** @class */ (function () {
    function TextSearchResult(fullLine, range, previewOptions) {
        this.range = range;
        if (previewOptions) {
            var leadingChars = Math.floor(previewOptions.charsPerLine / 5);
            var previewStart = Math.max(range.startColumn - leadingChars, 0);
            var previewEnd = previewOptions.charsPerLine + previewStart;
            var endOfMatchRangeInPreview = Math.min(previewEnd, range.endColumn - previewStart);
            this.preview = {
                text: fullLine.substring(previewStart, previewEnd),
                match: new OneLineRange(0, range.startColumn - previewStart, endOfMatchRangeInPreview)
            };
        }
        else {
            this.preview = {
                text: fullLine,
                match: new OneLineRange(0, range.startColumn, range.endColumn)
            };
        }
    }
    return TextSearchResult;
}());
export { TextSearchResult };
var OneLineRange = /** @class */ (function () {
    function OneLineRange(lineNumber, startColumn, endColumn) {
        this.startLineNumber = lineNumber;
        this.startColumn = startColumn;
        this.endLineNumber = lineNumber;
        this.endColumn = endColumn;
    }
    return OneLineRange;
}());
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
export function pathIncludedInQuery(query, fsPath) {
    if (query.excludePattern && glob.match(query.excludePattern, fsPath)) {
        return false;
    }
    if (query.includePattern && !glob.match(query.includePattern, fsPath)) {
        return false;
    }
    // If searchPaths are being used, the extra file must be in a subfolder and match the pattern, if present
    if (query.usingSearchPaths) {
        return query.folderQueries.every(function (fq) {
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
