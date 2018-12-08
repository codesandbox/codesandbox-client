/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { startsWith } from '../../../../base/common/strings.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { SearchRange, TextSearchMatch } from '../../../../platform/search/common/search.js';
import { mapArrayOrNot } from '../../../../base/common/arrays.js';
export function anchorGlob(glob) {
    return startsWith(glob, '**') || startsWith(glob, '/') ? glob : "/" + glob;
}
/**
 * Create a vscode.TextSearchResult by using our internal TextSearchResult type for its previewOptions logic.
 */
export function createTextSearchResult(uri, text, range, previewOptions) {
    var searchRange = mapArrayOrNot(range, rangeToSearchRange);
    var internalResult = new TextSearchMatch(text, searchRange, previewOptions);
    var internalPreviewRange = internalResult.preview.matches;
    return {
        ranges: mapArrayOrNot(searchRange, searchRangeToRange),
        uri: uri,
        preview: {
            text: internalResult.preview.text,
            matches: mapArrayOrNot(internalPreviewRange, searchRangeToRange)
        }
    };
}
function rangeToSearchRange(range) {
    return new SearchRange(range.start.line, range.start.character, range.end.line, range.end.character);
}
function searchRangeToRange(range) {
    return new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
}
var Position = /** @class */ (function () {
    function Position(line, character) {
        this.line = line;
        this.character = character;
    }
    Position.prototype.isBefore = function (other) { return false; };
    Position.prototype.isBeforeOrEqual = function (other) { return false; };
    Position.prototype.isAfter = function (other) { return false; };
    Position.prototype.isAfterOrEqual = function (other) { return false; };
    Position.prototype.isEqual = function (other) { return false; };
    Position.prototype.compareTo = function (other) { return 0; };
    Position.prototype.translate = function (_, _2) { return new Position(0, 0); };
    Position.prototype.with = function (_) { return new Position(0, 0); };
    return Position;
}());
export { Position };
var Range = /** @class */ (function () {
    function Range(startLine, startCol, endLine, endCol) {
        this.start = new Position(startLine, startCol);
        this.end = new Position(endLine, endCol);
    }
    Range.prototype.contains = function (positionOrRange) { return false; };
    Range.prototype.isEqual = function (other) { return false; };
    Range.prototype.intersection = function (range) { return undefined; };
    Range.prototype.union = function (other) { return new Range(0, 0, 0, 0); };
    Range.prototype.with = function (_) { return new Range(0, 0, 0, 0); };
    return Range;
}());
export { Range };
var OutputChannel = /** @class */ (function () {
    function OutputChannel(logService) {
        this.logService = logService;
    }
    OutputChannel.prototype.appendLine = function (msg) {
        this.logService.debug('RipgrepSearchEH#search', msg);
    };
    OutputChannel = __decorate([
        __param(0, ILogService)
    ], OutputChannel);
    return OutputChannel;
}());
export { OutputChannel };
