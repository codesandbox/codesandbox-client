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
import * as path from '../../../../path.js';
import * as arrays from '../../../base/common/arrays.js';
import { createCancelablePromise } from '../../../base/common/async.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { canceled } from '../../../base/common/errors.js';
import * as glob from '../../../base/common/glob.js';
import * as resources from '../../../base/common/resources.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import * as strings from '../../../base/common/strings.js';
import { compareItemsByScore, prepareQuery } from '../../../base/parts/quickopen/common/quickOpenScorer.js';
import { QueryGlobTester, resolvePatternsForProvider } from '../../services/search/node/search.js';
var FileIndexSearchEngine = /** @class */ (function () {
    function FileIndexSearchEngine(config, provider) {
        this.config = config;
        this.provider = provider;
        this.filesWalked = 0;
        this.dirsWalked = 0;
        this.filePattern = config.filePattern;
        this.includePattern = config.includePattern && glob.parse(config.includePattern);
        this.maxResults = config.maxResults || null;
        this.exists = config.exists;
        this.resultCount = 0;
        this.isLimitHit = false;
        this.activeCancellationTokens = new Set();
        if (this.filePattern) {
            this.normalizedFilePatternLowercase = strings.stripWildcards(this.filePattern).toLowerCase();
        }
        this.globalExcludePattern = config.excludePattern && glob.parse(config.excludePattern);
    }
    FileIndexSearchEngine.prototype.cancel = function () {
        this.isCanceled = true;
        this.activeCancellationTokens.forEach(function (t) { return t.cancel(); });
        this.activeCancellationTokens = new Set();
    };
    FileIndexSearchEngine.prototype.search = function (_onResult) {
        var _this = this;
        // Searches a single folder
        var folderQuery = this.config.folderQueries[0];
        return new Promise(function (resolve, reject) {
            var onResult = function (match) {
                _this.resultCount++;
                _onResult(match);
            };
            if (_this.isCanceled) {
                throw canceled();
            }
            // For each extra file
            if (_this.config.extraFileResources) {
                _this.config.extraFileResources
                    .forEach(function (extraFile) {
                    var extraFileStr = extraFile.toString(); // ?
                    var basename = path.basename(extraFileStr);
                    if (_this.globalExcludePattern && _this.globalExcludePattern(extraFileStr, basename)) {
                        return; // excluded
                    }
                    // File: Check for match on file pattern and include pattern
                    _this.matchFile(onResult, { base: extraFile, basename: basename });
                });
            }
            return Promise.all(_this.config.folderQueries.map(function (fq) { return _this.searchInFolder(folderQuery, onResult); })).then(function (stats) {
                resolve({
                    isLimitHit: _this.isLimitHit,
                    stats: {
                        directoriesWalked: _this.dirsWalked,
                        filesWalked: _this.filesWalked,
                        fileWalkTime: stats.map(function (s) { return s.fileWalkTime; }).reduce(function (s, c) { return s + c; }, 0),
                        providerTime: stats.map(function (s) { return s.providerTime; }).reduce(function (s, c) { return s + c; }, 0),
                        providerResultCount: stats.map(function (s) { return s.providerResultCount; }).reduce(function (s, c) { return s + c; }, 0)
                    }
                });
            }, function (errs) {
                if (!Array.isArray(errs)) {
                    errs = [errs];
                }
                errs = errs.filter(function (e) { return !!e; });
                return Promise.reject(errs[0]);
            });
        });
    };
    FileIndexSearchEngine.prototype.searchInFolder = function (fq, onResult) {
        var _this = this;
        var cancellation = new CancellationTokenSource();
        return new Promise(function (resolve, reject) {
            var options = _this.getSearchOptionsForFolder(fq);
            var tree = _this.initDirectoryTree();
            var queryTester = new QueryGlobTester(_this.config, fq);
            var noSiblingsClauses = !queryTester.hasSiblingExcludeClauses();
            var onProviderResult = function (uri) {
                if (_this.isCanceled) {
                    return;
                }
                // TODO@rob - ???
                var relativePath = path.relative(fq.folder.path, uri.path);
                if (noSiblingsClauses) {
                    var basename = path.basename(uri.path);
                    _this.matchFile(onResult, { base: fq.folder, relativePath: relativePath, basename: basename, original: uri });
                    return;
                }
                // TODO: Optimize siblings clauses with ripgrep here.
                _this.addDirectoryEntries(tree, fq.folder, relativePath, onResult);
            };
            var providerSW;
            var providerTime;
            var fileWalkTime;
            new Promise(function (resolve) { return process.nextTick(resolve); })
                .then(function () {
                _this.activeCancellationTokens.add(cancellation);
                providerSW = StopWatch.create();
                return _this.provider.provideFileIndex(options, cancellation.token);
            })
                .then(function (results) {
                providerTime = providerSW.elapsed();
                var postProcessSW = StopWatch.create();
                _this.activeCancellationTokens.delete(cancellation);
                if (_this.isCanceled) {
                    return null;
                }
                results.forEach(onProviderResult);
                _this.matchDirectoryTree(tree, queryTester, onResult);
                fileWalkTime = postProcessSW.elapsed();
                return null;
            }).then(function () {
                cancellation.dispose();
                resolve({
                    providerTime: providerTime,
                    fileWalkTime: fileWalkTime,
                    directoriesWalked: _this.dirsWalked,
                    filesWalked: _this.filesWalked
                });
            }, function (err) {
                cancellation.dispose();
                reject(err);
            });
        });
    };
    FileIndexSearchEngine.prototype.getSearchOptionsForFolder = function (fq) {
        var includes = resolvePatternsForProvider(this.config.includePattern, fq.includePattern);
        var excludes = resolvePatternsForProvider(this.config.excludePattern, fq.excludePattern);
        return {
            folder: fq.folder,
            excludes: excludes,
            includes: includes,
            useIgnoreFiles: !fq.disregardIgnoreFiles,
            useGlobalIgnoreFiles: !fq.disregardGlobalIgnoreFiles,
            followSymlinks: !fq.ignoreSymlinks
        };
    };
    FileIndexSearchEngine.prototype.initDirectoryTree = function () {
        var tree = {
            rootEntries: [],
            pathToEntries: Object.create(null)
        };
        tree.pathToEntries['.'] = tree.rootEntries;
        return tree;
    };
    FileIndexSearchEngine.prototype.addDirectoryEntries = function (_a, base, relativeFile, onResult) {
        var pathToEntries = _a.pathToEntries;
        // Support relative paths to files from a root resource (ignores excludes)
        if (relativeFile === this.filePattern) {
            var basename = path.basename(this.filePattern);
            this.matchFile(onResult, { base: base, relativePath: this.filePattern, basename: basename });
        }
        function add(relativePath) {
            var basename = path.basename(relativePath);
            var dirname = path.dirname(relativePath);
            var entries = pathToEntries[dirname];
            if (!entries) {
                entries = pathToEntries[dirname] = [];
                add(dirname);
            }
            entries.push({
                base: base,
                relativePath: relativePath,
                basename: basename
            });
        }
        add(relativeFile);
    };
    FileIndexSearchEngine.prototype.matchDirectoryTree = function (_a, queryTester, onResult) {
        var rootEntries = _a.rootEntries, pathToEntries = _a.pathToEntries;
        var self = this;
        var filePattern = this.filePattern;
        function matchDirectory(entries) {
            self.dirsWalked++;
            for (var i = 0, n = entries.length; i < n; i++) {
                var entry = entries[i];
                var relativePath = entry.relativePath, basename = entry.basename;
                // Check exclude pattern
                // If the user searches for the exact file name, we adjust the glob matching
                // to ignore filtering by siblings because the user seems to know what she
                // is searching for and we want to include the result in that case anyway
                var hasSibling = glob.hasSiblingFn(function () { return entries.map(function (entry) { return entry.basename; }); });
                if (!queryTester.includedInQuerySync(relativePath, basename, filePattern !== basename ? hasSibling : undefined)) {
                    continue;
                }
                var sub = pathToEntries[relativePath];
                if (sub) {
                    matchDirectory(sub);
                }
                else {
                    self.filesWalked++;
                    if (relativePath === filePattern) {
                        continue; // ignore file if its path matches with the file pattern because that is already matched above
                    }
                    self.matchFile(onResult, entry);
                }
                if (self.isLimitHit) {
                    break;
                }
            }
        }
        matchDirectory(rootEntries);
    };
    FileIndexSearchEngine.prototype.matchFile = function (onResult, candidate) {
        if (this.isFilePatternMatch(candidate.relativePath) && (!this.includePattern || this.includePattern(candidate.relativePath, candidate.basename))) {
            if (this.exists || (this.maxResults && this.resultCount >= this.maxResults)) {
                this.isLimitHit = true;
                this.cancel();
            }
            if (!this.isLimitHit) {
                onResult(candidate);
            }
        }
    };
    FileIndexSearchEngine.prototype.isFilePatternMatch = function (path) {
        // Check for search pattern
        if (this.filePattern) {
            if (this.filePattern === '*') {
                return true; // support the all-matching wildcard
            }
            return strings.fuzzyContains(path, this.normalizedFilePatternLowercase);
        }
        // No patterns means we match all
        return true;
    };
    return FileIndexSearchEngine;
}());
export { FileIndexSearchEngine };
var FileIndexSearchManager = /** @class */ (function () {
    function FileIndexSearchManager() {
        this.caches = Object.create(null);
        this.folderCacheKeys = new Map();
    }
    FileIndexSearchManager.prototype.fileSearch = function (config, provider, onBatch, token) {
        var _this = this;
        if (config.sortByScore) {
            var sortedSearch = this.trySortedSearchFromCache(config, token);
            if (!sortedSearch) {
                var engineConfig = config.maxResults ? __assign({}, config, { maxResults: null }) :
                    config;
                var engine_1 = new FileIndexSearchEngine(engineConfig, provider);
                sortedSearch = this.doSortedSearch(engine_1, config, token);
            }
            return sortedSearch.then(function (complete) {
                _this.sendAsBatches(complete.results, onBatch, FileIndexSearchManager.BATCH_SIZE);
                return complete;
            });
        }
        var engine = new FileIndexSearchEngine(config, provider);
        return this.doSearch(engine, token)
            .then(function (complete) {
            _this.sendAsBatches(complete.results, onBatch, FileIndexSearchManager.BATCH_SIZE);
            return {
                limitHit: complete.limitHit,
                stats: {
                    type: 'fileIndexProvider',
                    detailStats: complete.stats,
                    fromCache: false,
                    resultCount: complete.results.length
                }
            };
        });
    };
    FileIndexSearchManager.prototype.getFolderCacheKey = function (config) {
        var uri = config.folderQueries[0].folder.toString();
        var folderCacheKey = config.cacheKey && uri + "_" + config.cacheKey;
        if (!this.folderCacheKeys.get(config.cacheKey)) {
            this.folderCacheKeys.set(config.cacheKey, new Set());
        }
        this.folderCacheKeys.get(config.cacheKey).add(folderCacheKey);
        return folderCacheKey;
    };
    FileIndexSearchManager.prototype.rawMatchToSearchItem = function (match) {
        return {
            resource: match.original || resources.joinPath(match.base, match.relativePath)
        };
    };
    FileIndexSearchManager.prototype.doSortedSearch = function (engine, config, token) {
        var _this = this;
        var allResultsPromise = createCancelablePromise(function (token) {
            return _this.doSearch(engine, token);
        });
        var folderCacheKey = this.getFolderCacheKey(config);
        var cache;
        if (folderCacheKey) {
            cache = this.getOrCreateCache(folderCacheKey);
            var cacheRow_1 = {
                promise: allResultsPromise,
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
        return Promise.resolve(allResultsPromise.then(function (complete) {
            var scorerCache = cache ? cache.scorerCache : Object.create(null);
            var sortSW = (typeof config.maxResults !== 'number' || config.maxResults > 0) && StopWatch.create();
            return _this.sortResults(config, complete.results, scorerCache, token)
                .then(function (sortedResults) {
                // sortingTime: -1 indicates a "sorted" search that was not sorted, i.e. populating the cache when quickopen is opened.
                // Contrasting with findFiles which is not sorted and will have sortingTime: undefined
                var sortingTime = sortSW ? sortSW.elapsed() : -1;
                return {
                    limitHit: complete.limitHit || typeof config.maxResults === 'number' && complete.results.length > config.maxResults,
                    results: sortedResults,
                    stats: {
                        detailStats: complete.stats,
                        fromCache: false,
                        resultCount: sortedResults.length,
                        sortingTime: sortingTime,
                        type: 'fileIndexProvider'
                    }
                };
            });
        }));
    };
    FileIndexSearchManager.prototype.getOrCreateCache = function (cacheKey) {
        var existing = this.caches[cacheKey];
        if (existing) {
            return existing;
        }
        return this.caches[cacheKey] = new Cache();
    };
    FileIndexSearchManager.prototype.trySortedSearchFromCache = function (config, token) {
        var _this = this;
        var folderCacheKey = this.getFolderCacheKey(config);
        var cache = folderCacheKey && this.caches[folderCacheKey];
        if (!cache) {
            return undefined;
        }
        var cached = this.getResultsFromCache(cache, config.filePattern, token);
        if (cached) {
            return cached.then(function (complete) {
                var sortSW = StopWatch.create();
                return _this.sortResults(config, complete.results, cache.scorerCache, token)
                    .then(function (sortedResults) {
                    if (token && token.isCancellationRequested) {
                        throw canceled();
                    }
                    return {
                        limitHit: complete.limitHit || typeof config.maxResults === 'number' && complete.results.length > config.maxResults,
                        results: sortedResults,
                        stats: {
                            fromCache: true,
                            detailStats: complete.stats,
                            type: 'fileIndexProvider',
                            resultCount: sortedResults.length,
                            sortingTime: sortSW.elapsed()
                        }
                    };
                });
            });
        }
        return undefined;
    };
    FileIndexSearchManager.prototype.sortResults = function (config, results, scorerCache, token) {
        // we use the same compare function that is used later when showing the results using fuzzy scoring
        // this is very important because we are also limiting the number of results by config.maxResults
        // and as such we want the top items to be included in this result set if the number of items
        // exceeds config.maxResults.
        var query = prepareQuery(config.filePattern);
        var compare = function (matchA, matchB) { return compareItemsByScore(matchA, matchB, query, true, FileMatchItemAccessor, scorerCache); };
        return arrays.topAsync(results, compare, config.maxResults, 10000, token);
    };
    FileIndexSearchManager.prototype.sendAsBatches = function (rawMatches, onBatch, batchSize) {
        var _this = this;
        var serializedMatches = rawMatches.map(function (rawMatch) { return _this.rawMatchToSearchItem(rawMatch); });
        if (batchSize && batchSize > 0) {
            for (var i = 0; i < serializedMatches.length; i += batchSize) {
                onBatch(serializedMatches.slice(i, i + batchSize));
            }
        }
        else {
            onBatch(serializedMatches);
        }
    };
    FileIndexSearchManager.prototype.getResultsFromCache = function (cache, searchValue, token) {
        var cacheLookupSW = StopWatch.create();
        if (path.isAbsolute(searchValue)) {
            return null; // bypass cache if user looks up an absolute path where matching goes directly on disk
        }
        // Find cache entries by prefix of search value
        var hasPathSep = searchValue.indexOf(path.sep) >= 0;
        var cacheRow;
        for (var previousSearch in cache.resultsToSearchCache) {
            // If we narrow down, we might be able to reuse the cached results
            if (strings.startsWith(searchValue, previousSearch)) {
                if (hasPathSep && previousSearch.indexOf(path.sep) < 0) {
                    continue; // since a path character widens the search for potential more matches, require it in previous search too
                }
                var row = cache.resultsToSearchCache[previousSearch];
                cacheRow = {
                    promise: this.preventCancellation(row.promise),
                    resolved: row.resolved
                };
                break;
            }
        }
        if (!cacheRow) {
            return null;
        }
        var cacheLookupTime = cacheLookupSW.elapsed();
        var cacheFilterSW = StopWatch.create();
        return new Promise(function (c, e) {
            token.onCancellationRequested(function () { return e(canceled()); });
            cacheRow.promise.then(function (complete) {
                if (token && token.isCancellationRequested) {
                    e(canceled());
                }
                // Pattern match on results
                var results = [];
                var normalizedSearchValueLowercase = strings.stripWildcards(searchValue).toLowerCase();
                for (var i = 0; i < complete.results.length; i++) {
                    var entry = complete.results[i];
                    // Check if this entry is a match for the search value
                    if (!strings.fuzzyContains(entry.relativePath, normalizedSearchValueLowercase)) {
                        continue;
                    }
                    results.push(entry);
                }
                c({
                    limitHit: complete.limitHit,
                    results: results,
                    stats: {
                        cacheWasResolved: cacheRow.resolved,
                        cacheLookupTime: cacheLookupTime,
                        cacheFilterTime: cacheFilterSW.elapsed(),
                        cacheEntryCount: complete.results.length
                    }
                });
            }, e);
        });
    };
    FileIndexSearchManager.prototype.doSearch = function (engine, token) {
        token.onCancellationRequested(function () { return engine.cancel(); });
        var results = [];
        var onResult = function (match) { return results.push(match); };
        return engine.search(onResult).then(function (result) {
            return {
                limitHit: result.isLimitHit,
                results: results,
                stats: result.stats
            };
        });
    };
    FileIndexSearchManager.prototype.clearCache = function (cacheKey) {
        var _this = this;
        if (!this.folderCacheKeys.has(cacheKey)) {
            return Promise.resolve(undefined);
        }
        var expandedKeys = this.folderCacheKeys.get(cacheKey);
        expandedKeys.forEach(function (key) { return delete _this.caches[key]; });
        this.folderCacheKeys.delete(cacheKey);
        return Promise.resolve(undefined);
    };
    FileIndexSearchManager.prototype.preventCancellation = function (promise) {
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
    FileIndexSearchManager.BATCH_SIZE = 512;
    return FileIndexSearchManager;
}());
export { FileIndexSearchManager };
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
