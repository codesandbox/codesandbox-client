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
import * as fs from '../../../../../fs.js';
import * as gracefulFs from '../../../../../graceful-fs.js';
import { join, sep } from '../../../../../path.js';
import * as arrays from '../../../../base/common/arrays.js';
import { createCancelablePromise } from '../../../../base/common/async.js';
import { canceled } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import * as objects from '../../../../base/common/objects.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { compareItemsByScore, prepareQuery } from '../../../../base/parts/quickopen/common/quickOpenScorer.js';
import { MAX_FILE_SIZE } from '../../../../platform/files/node/files.js';
import { Engine as FileSearchEngine } from './fileSearch.js';
import { LegacyTextSearchService } from './legacy/rawLegacyTextSearchService.js';
import { TextSearchEngineAdapter } from './textSearchAdapter.js';
gracefulFs.gracefulify(fs);
var SearchService = /** @class */ (function () {
    function SearchService() {
        this.legacyTextSearchService = new LegacyTextSearchService();
        this.caches = Object.create(null);
    }
    SearchService.prototype.fileSearch = function (config) {
        var _this = this;
        var promise;
        var query = reviveQuery(config);
        var emitter = new Emitter({
            onFirstListenerDidAdd: function () {
                promise = createCancelablePromise(function (token) {
                    return _this.doFileSearchWithEngine(FileSearchEngine, query, function (p) { return emitter.fire(p); }, token);
                });
                promise.then(function (c) { return emitter.fire(c); }, function (err) { return emitter.fire({ type: 'error', error: { message: err.message, stack: err.stack } }); });
            },
            onLastListenerRemove: function () {
                promise.cancel();
            }
        });
        return emitter.event;
    };
    SearchService.prototype.textSearch = function (rawQuery) {
        var _this = this;
        var promise;
        var query = reviveQuery(rawQuery);
        var emitter = new Emitter({
            onFirstListenerDidAdd: function () {
                promise = createCancelablePromise(function (token) {
                    return (rawQuery.useRipgrep ?
                        _this.ripgrepTextSearch(query, function (p) { return emitter.fire(p); }, token) :
                        _this.legacyTextSearchService.textSearch(query, function (p) { return emitter.fire(p); }, token));
                });
                promise.then(function (c) { return emitter.fire(c); }, function (err) { return emitter.fire({ type: 'error', error: { message: err.message, stack: err.stack } }); });
            },
            onLastListenerRemove: function () {
                promise.cancel();
            }
        });
        return emitter.event;
    };
    SearchService.prototype.ripgrepTextSearch = function (config, progressCallback, token) {
        config.maxFileSize = MAX_FILE_SIZE;
        var engine = new TextSearchEngineAdapter(config);
        return engine.search(token, progressCallback, progressCallback);
    };
    SearchService.prototype.doFileSearch = function (config, progressCallback, token) {
        return this.doFileSearchWithEngine(FileSearchEngine, config, progressCallback, token);
    };
    SearchService.prototype.doFileSearchWithEngine = function (EngineClass, config, progressCallback, token, batchSize) {
        var _this = this;
        if (batchSize === void 0) { batchSize = SearchService.BATCH_SIZE; }
        var resultCount = 0;
        var fileProgressCallback = function (progress) {
            if (Array.isArray(progress)) {
                resultCount += progress.length;
                progressCallback(progress.map(function (m) { return _this.rawMatchToSearchItem(m); }));
            }
            else if (progress.relativePath) {
                resultCount++;
                progressCallback(_this.rawMatchToSearchItem(progress));
            }
            else {
                progressCallback(progress);
            }
        };
        if (config.sortByScore) {
            var sortedSearch_1 = this.trySortedSearchFromCache(config, fileProgressCallback, token);
            if (!sortedSearch_1) {
                var walkerConfig = config.maxResults ? objects.assign({}, config, { maxResults: null }) : config;
                var engine_1 = new EngineClass(walkerConfig);
                sortedSearch_1 = this.doSortedSearch(engine_1, config, progressCallback, fileProgressCallback, token);
            }
            return new Promise(function (c, e) {
                sortedSearch_1.then(function (_a) {
                    var result = _a[0], rawMatches = _a[1];
                    var serializedMatches = rawMatches.map(function (rawMatch) { return _this.rawMatchToSearchItem(rawMatch); });
                    _this.sendProgress(serializedMatches, progressCallback, batchSize);
                    c(result);
                }, e);
            });
        }
        var engine = new EngineClass(config);
        return this.doSearch(engine, fileProgressCallback, batchSize, token).then(function (complete) {
            return {
                limitHit: complete.limitHit,
                type: 'success',
                stats: {
                    detailStats: complete.stats,
                    type: 'searchProcess',
                    fromCache: false,
                    resultCount: resultCount,
                    sortingTime: undefined
                }
            };
        });
    };
    SearchService.prototype.rawMatchToSearchItem = function (match) {
        return { path: match.base ? join(match.base, match.relativePath) : match.relativePath };
    };
    SearchService.prototype.doSortedSearch = function (engine, config, progressCallback, fileProgressCallback, token) {
        var _this = this;
        var emitter = new Emitter();
        var allResultsPromise = createCancelablePromise(function (token) {
            var results = [];
            var innerProgressCallback = function (progress) {
                if (Array.isArray(progress)) {
                    results = progress;
                }
                else {
                    fileProgressCallback(progress);
                    emitter.fire(progress);
                }
            };
            return _this.doSearch(engine, innerProgressCallback, -1, token)
                .then(function (result) {
                return [result, results];
            });
        });
        var cache;
        if (config.cacheKey) {
            cache = this.getOrCreateCache(config.cacheKey);
            var cacheRow_1 = {
                promise: allResultsPromise,
                event: emitter.event,
                resolved: false
            };
            cache.resultsToSearchCache[config.filePattern] = cacheRow_1;
            allResultsPromise.then(function () {
                cacheRow_1.resolved = true;
            }, function (err) {
                delete cache.resultsToSearchCache[config.filePattern];
            });
            allResultsPromise = this.preventCancellation(allResultsPromise);
        }
        return allResultsPromise.then(function (_a) {
            var result = _a[0], results = _a[1];
            var scorerCache = cache ? cache.scorerCache : Object.create(null);
            var sortSW = (typeof config.maxResults !== 'number' || config.maxResults > 0) && StopWatch.create(false);
            return _this.sortResults(config, results, scorerCache, token)
                .then(function (sortedResults) {
                // sortingTime: -1 indicates a "sorted" search that was not sorted, i.e. populating the cache when quickopen is opened.
                // Contrasting with findFiles which is not sorted and will have sortingTime: undefined
                var sortingTime = sortSW ? sortSW.elapsed() : -1;
                return [{
                        type: 'success',
                        stats: {
                            detailStats: result.stats,
                            sortingTime: sortingTime,
                            fromCache: false,
                            type: 'searchProcess',
                            workspaceFolderCount: config.folderQueries.length,
                            resultCount: sortedResults.length
                        },
                        limitHit: result.limitHit || typeof config.maxResults === 'number' && results.length > config.maxResults
                    }, sortedResults];
            });
        });
    };
    SearchService.prototype.getOrCreateCache = function (cacheKey) {
        var existing = this.caches[cacheKey];
        if (existing) {
            return existing;
        }
        return this.caches[cacheKey] = new Cache();
    };
    SearchService.prototype.trySortedSearchFromCache = function (config, progressCallback, token) {
        var _this = this;
        var cache = config.cacheKey && this.caches[config.cacheKey];
        if (!cache) {
            return undefined;
        }
        var cached = this.getResultsFromCache(cache, config.filePattern, progressCallback, token);
        if (cached) {
            return cached.then(function (_a) {
                var result = _a[0], results = _a[1], cacheStats = _a[2];
                var sortSW = StopWatch.create(false);
                return _this.sortResults(config, results, cache.scorerCache, token)
                    .then(function (sortedResults) {
                    var sortingTime = sortSW.elapsed();
                    var stats = {
                        fromCache: true,
                        detailStats: cacheStats,
                        type: 'searchProcess',
                        resultCount: results.length,
                        sortingTime: sortingTime
                    };
                    return [
                        {
                            type: 'success',
                            limitHit: result.limitHit || typeof config.maxResults === 'number' && results.length > config.maxResults,
                            stats: stats
                        },
                        sortedResults
                    ];
                });
            });
        }
        return undefined;
    };
    SearchService.prototype.sortResults = function (config, results, scorerCache, token) {
        // we use the same compare function that is used later when showing the results using fuzzy scoring
        // this is very important because we are also limiting the number of results by config.maxResults
        // and as such we want the top items to be included in this result set if the number of items
        // exceeds config.maxResults.
        var query = prepareQuery(config.filePattern);
        var compare = function (matchA, matchB) { return compareItemsByScore(matchA, matchB, query, true, FileMatchItemAccessor, scorerCache); };
        return arrays.topAsync(results, compare, config.maxResults, 10000, token);
    };
    SearchService.prototype.sendProgress = function (results, progressCb, batchSize) {
        if (batchSize && batchSize > 0) {
            for (var i = 0; i < results.length; i += batchSize) {
                progressCb(results.slice(i, i + batchSize));
            }
        }
        else {
            progressCb(results);
        }
    };
    SearchService.prototype.getResultsFromCache = function (cache, searchValue, progressCallback, token) {
        var cacheLookupSW = StopWatch.create(false);
        // Find cache entries by prefix of search value
        var hasPathSep = searchValue.indexOf(sep) >= 0;
        var cachedRow;
        for (var previousSearch in cache.resultsToSearchCache) {
            // If we narrow down, we might be able to reuse the cached results
            if (strings.startsWith(searchValue, previousSearch)) {
                if (hasPathSep && previousSearch.indexOf(sep) < 0) {
                    continue; // since a path character widens the search for potential more matches, require it in previous search too
                }
                var row = cache.resultsToSearchCache[previousSearch];
                cachedRow = {
                    promise: this.preventCancellation(row.promise),
                    event: row.event,
                    resolved: row.resolved
                };
                break;
            }
        }
        if (!cachedRow) {
            return null;
        }
        var cacheLookupTime = cacheLookupSW.elapsed();
        var cacheFilterSW = StopWatch.create(false);
        var listener = cachedRow.event(progressCallback);
        if (token) {
            token.onCancellationRequested(function () {
                listener.dispose();
            });
        }
        return cachedRow.promise.then(function (_a) {
            var complete = _a[0], cachedEntries = _a[1];
            if (token && token.isCancellationRequested) {
                throw canceled();
            }
            // Pattern match on results
            var results = [];
            var normalizedSearchValueLowercase = strings.stripWildcards(searchValue).toLowerCase();
            for (var i = 0; i < cachedEntries.length; i++) {
                var entry = cachedEntries[i];
                // Check if this entry is a match for the search value
                if (!strings.fuzzyContains(entry.relativePath, normalizedSearchValueLowercase)) {
                    continue;
                }
                results.push(entry);
            }
            return [complete, results, {
                    cacheWasResolved: cachedRow.resolved,
                    cacheLookupTime: cacheLookupTime,
                    cacheFilterTime: cacheFilterSW.elapsed(),
                    cacheEntryCount: cachedEntries.length
                }];
        });
    };
    SearchService.prototype.doSearch = function (engine, progressCallback, batchSize, token) {
        return new Promise(function (c, e) {
            var batch = [];
            if (token) {
                token.onCancellationRequested(function () { return engine.cancel(); });
            }
            engine.search(function (match) {
                if (match) {
                    if (batchSize) {
                        batch.push(match);
                        if (batchSize > 0 && batch.length >= batchSize) {
                            progressCallback(batch);
                            batch = [];
                        }
                    }
                    else {
                        progressCallback(match);
                    }
                }
            }, function (progress) {
                progressCallback(progress);
            }, function (error, complete) {
                if (batch.length) {
                    progressCallback(batch);
                }
                if (error) {
                    e(error);
                }
                else {
                    c(complete);
                }
            });
        });
    };
    SearchService.prototype.clearCache = function (cacheKey) {
        delete this.caches[cacheKey];
        return Promise.resolve(undefined);
    };
    /**
     * Return a CancelablePromise which is not actually cancelable
     * TODO@rob - Is this really needed?
     */
    SearchService.prototype.preventCancellation = function (promise) {
        return new /** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.cancel = function () {
                // Do nothing
            };
            class_1.prototype.then = function (resolve, reject) {
                return promise.then(resolve, reject);
            };
            class_1.prototype.catch = function (reject) {
                return this.then(undefined, reject);
            };
            return class_1;
        }());
    };
    SearchService.BATCH_SIZE = 512;
    return SearchService;
}());
export { SearchService };
var Cache = /** @class */ (function () {
    function Cache() {
        this.resultsToSearchCache = Object.create(null);
        this.scorerCache = Object.create(null);
    }
    return Cache;
}());
var FileMatchItemAccessor = new /** @class */ (function () {
    function class_2() {
    }
    class_2.prototype.getItemLabel = function (match) {
        return match.basename; // e.g. myFile.txt
    };
    class_2.prototype.getItemDescription = function (match) {
        return match.relativePath.substr(0, match.relativePath.length - match.basename.length - 1); // e.g. some/path/to/file
    };
    class_2.prototype.getItemPath = function (match) {
        return match.relativePath; // e.g. some/path/to/file/myFile.txt
    };
    return class_2;
}());
function reviveQuery(rawQuery) {
    return __assign({}, rawQuery, {
        folderQueries: rawQuery.folderQueries && rawQuery.folderQueries.map(reviveFolderQuery),
        extraFileResources: rawQuery.extraFileResources && rawQuery.extraFileResources.map(function (components) { return URI.revive(components); })
    });
}
function reviveFolderQuery(rawFolderQuery) {
    return __assign({}, rawFolderQuery, { folder: URI.revive(rawFolderQuery.folder) });
}
