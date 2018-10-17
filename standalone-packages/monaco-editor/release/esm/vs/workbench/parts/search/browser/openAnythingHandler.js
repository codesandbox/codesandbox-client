/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as arrays from '../../../../base/common/arrays.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import * as types from '../../../../base/common/types.js';
import { QuickOpenModel, QuickOpenItemAccessor } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { QuickOpenHandler } from '../../../browser/quickopen.js';
import { FileEntry, OpenFileHandler } from './openFileHandler.js';
import * as openSymbolHandler from './openSymbolHandler.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { compareItemsByScore, scoreItem, prepareQuery } from '../../../../base/parts/quickopen/common/quickOpenScorer.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { isPromiseCanceledError } from '../../../../base/common/errors.js';
export var OpenSymbolHandler = openSymbolHandler.OpenSymbolHandler; // OpenSymbolHandler is used from an extension and must be in the main bundle file so it can load
var OpenAnythingHandler = /** @class */ (function (_super) {
    __extends(OpenAnythingHandler, _super);
    function OpenAnythingHandler(notificationService, instantiationService, configurationService) {
        var _this = _super.call(this) || this;
        _this.notificationService = notificationService;
        _this.configurationService = configurationService;
        _this.scorerCache = Object.create(null);
        _this.searchDelayer = new ThrottledDelayer(OpenAnythingHandler.TYPING_SEARCH_DELAY);
        _this.openSymbolHandler = instantiationService.createInstance(OpenSymbolHandler);
        _this.openFileHandler = instantiationService.createInstance(OpenFileHandler);
        _this.updateHandlers(_this.configurationService.getValue());
        _this.registerListeners();
        return _this;
    }
    OpenAnythingHandler.prototype.registerListeners = function () {
        var _this = this;
        this.configurationService.onDidChangeConfiguration(function (e) { return _this.updateHandlers(_this.configurationService.getValue()); });
    };
    OpenAnythingHandler.prototype.updateHandlers = function (configuration) {
        this.includeSymbols = configuration && configuration.search && configuration.search.quickOpen && configuration.search.quickOpen.includeSymbols;
        // Files
        this.openFileHandler.setOptions({
            forceUseIcons: this.includeSymbols // only need icons for file results if we mix with symbol results
        });
        // Symbols
        this.openSymbolHandler.setOptions({
            skipDelay: true,
            skipLocalSymbols: true,
            skipSorting: true // we sort combined with file results
        });
    };
    OpenAnythingHandler.prototype.getResults = function (searchValue, token) {
        var _this = this;
        this.isClosed = false; // Treat this call as the handler being in use
        // Find a suitable range from the pattern looking for ":" and "#"
        var searchWithRange = this.extractRange(searchValue);
        if (searchWithRange) {
            searchValue = searchWithRange.search; // ignore range portion in query
        }
        // Prepare search for scoring
        var query = prepareQuery(searchValue);
        if (!query.value) {
            return TPromise.as(new QuickOpenModel()); // Respond directly to empty search
        }
        // The throttler needs a factory for its promises
        var resultsPromise = function () {
            var resultPromises = [];
            // File Results
            var filePromise = _this.openFileHandler.getResults(query.original, token, OpenAnythingHandler.MAX_DISPLAYED_RESULTS);
            resultPromises.push(filePromise);
            // Symbol Results (unless disabled or a range or absolute path is specified)
            if (_this.includeSymbols && !searchWithRange) {
                resultPromises.push(_this.openSymbolHandler.getResults(query.original, token));
            }
            // Join and sort unified
            return TPromise.join(resultPromises).then(function (results) {
                // If the quick open widget has been closed meanwhile, ignore the result
                if (_this.isClosed || token.isCancellationRequested) {
                    return TPromise.as(new QuickOpenModel());
                }
                // Combine results.
                var mergedResults = [].concat.apply([], results.map(function (r) { return r.entries; }));
                // Sort
                var compare = function (elementA, elementB) { return compareItemsByScore(elementA, elementB, query, true, QuickOpenItemAccessor, _this.scorerCache); };
                var viewResults = arrays.top(mergedResults, compare, OpenAnythingHandler.MAX_DISPLAYED_RESULTS);
                // Apply range and highlights to file entries
                viewResults.forEach(function (entry) {
                    if (entry instanceof FileEntry) {
                        entry.setRange(searchWithRange ? searchWithRange.range : null);
                        var itemScore = scoreItem(entry, query, true, QuickOpenItemAccessor, _this.scorerCache);
                        entry.setHighlights(itemScore.labelMatch, itemScore.descriptionMatch);
                    }
                });
                return TPromise.as(new QuickOpenModel(viewResults));
            }, function (error) {
                if (!isPromiseCanceledError(error)) {
                    if (error && error[0] && error[0].message) {
                        _this.notificationService.error(error[0].message.replace(/[\*_\[\]]/g, '\\$&'));
                    }
                    else {
                        _this.notificationService.error(error);
                    }
                }
                return null;
            });
        };
        // Trigger through delayer to prevent accumulation while the user is typing (except when expecting results to come from cache)
        return this.hasShortResponseTime() ? resultsPromise() : this.searchDelayer.trigger(resultsPromise, OpenAnythingHandler.TYPING_SEARCH_DELAY);
    };
    OpenAnythingHandler.prototype.hasShortResponseTime = function () {
        if (!this.includeSymbols) {
            return this.openFileHandler.hasShortResponseTime();
        }
        return this.openFileHandler.hasShortResponseTime() && this.openSymbolHandler.hasShortResponseTime();
    };
    OpenAnythingHandler.prototype.extractRange = function (value) {
        if (!value) {
            return null;
        }
        var range = null;
        // Find Line/Column number from search value using RegExp
        var patternMatch = OpenAnythingHandler.LINE_COLON_PATTERN.exec(value);
        if (patternMatch && patternMatch.length > 1) {
            var startLineNumber = parseInt(patternMatch[1], 10);
            // Line Number
            if (types.isNumber(startLineNumber)) {
                range = {
                    startLineNumber: startLineNumber,
                    startColumn: 1,
                    endLineNumber: startLineNumber,
                    endColumn: 1
                };
                // Column Number
                if (patternMatch.length > 3) {
                    var startColumn = parseInt(patternMatch[3], 10);
                    if (types.isNumber(startColumn)) {
                        range = {
                            startLineNumber: range.startLineNumber,
                            startColumn: startColumn,
                            endLineNumber: range.endLineNumber,
                            endColumn: startColumn
                        };
                    }
                }
            }
            // User has typed "something:" or "something#" without a line number, in this case treat as start of file
            else if (patternMatch[1] === '') {
                range = {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 1,
                    endColumn: 1
                };
            }
        }
        if (range) {
            return {
                search: value.substr(0, patternMatch.index),
                range: range
            };
        }
        return null;
    };
    OpenAnythingHandler.prototype.getGroupLabel = function () {
        return this.includeSymbols ? nls.localize('fileAndTypeResults', "file and symbol results") : nls.localize('fileResults', "file results");
    };
    OpenAnythingHandler.prototype.getAutoFocus = function (searchValue) {
        return {
            autoFocusFirstEntry: true
        };
    };
    OpenAnythingHandler.prototype.onOpen = function () {
        this.openSymbolHandler.onOpen();
        this.openFileHandler.onOpen();
    };
    OpenAnythingHandler.prototype.onClose = function (canceled) {
        this.isClosed = true;
        // Clear Cache
        this.scorerCache = Object.create(null);
        // Propagate
        this.openSymbolHandler.onClose(canceled);
        this.openFileHandler.onClose(canceled);
    };
    OpenAnythingHandler.ID = 'workbench.picker.anything';
    OpenAnythingHandler.LINE_COLON_PATTERN = /[#|:|\(](\d*)([#|:|,](\d*))?\)?$/;
    OpenAnythingHandler.TYPING_SEARCH_DELAY = 200; // This delay accommodates for the user typing a word and then stops typing to start searching
    OpenAnythingHandler.MAX_DISPLAYED_RESULTS = 512;
    OpenAnythingHandler = __decorate([
        __param(0, INotificationService),
        __param(1, IInstantiationService),
        __param(2, IConfigurationService)
    ], OpenAnythingHandler);
    return OpenAnythingHandler;
}(QuickOpenHandler));
export { OpenAnythingHandler };
