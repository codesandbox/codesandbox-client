/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from '../../../../../path.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import * as glob from '../../../../base/common/glob.js';
import * as resources from '../../../../base/common/resources.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { QueryGlobTester, resolvePatternsForProvider } from './search.js';
var FileSearchEngine = /** @class */ (function () {
    function FileSearchEngine(config, provider) {
        this.config = config;
        this.provider = provider;
        this.isLimitHit = false;
        this.resultCount = 0;
        this.isCanceled = false;
        this.filePattern = config.filePattern;
        this.includePattern = config.includePattern && glob.parse(config.includePattern);
        this.maxResults = config.maxResults || undefined;
        this.exists = config.exists;
        this.activeCancellationTokens = new Set();
        this.globalExcludePattern = config.excludePattern && glob.parse(config.excludePattern);
    }
    FileSearchEngine.prototype.cancel = function () {
        this.isCanceled = true;
        this.activeCancellationTokens.forEach(function (t) { return t.cancel(); });
        this.activeCancellationTokens = new Set();
    };
    FileSearchEngine.prototype.search = function (_onResult) {
        var _this = this;
        var folderQueries = this.config.folderQueries || [];
        return new Promise(function (resolve, reject) {
            var onResult = function (match) {
                _this.resultCount++;
                _onResult(match);
            };
            // Support that the file pattern is a full path to a file that exists
            if (_this.isCanceled) {
                return resolve({ limitHit: _this.isLimitHit });
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
            // For each root folder
            Promise.all(folderQueries.map(function (fq) {
                return _this.searchInFolder(fq, onResult);
            })).then(function (stats) {
                resolve({
                    limitHit: _this.isLimitHit,
                    stats: stats[0] || undefined // Only looking at single-folder workspace stats...
                });
            }, function (err) {
                reject(new Error(toErrorMessage(err)));
            });
        });
    };
    FileSearchEngine.prototype.searchInFolder = function (fq, onResult) {
        var _this = this;
        var cancellation = new CancellationTokenSource();
        return new Promise(function (resolve, reject) {
            var options = _this.getSearchOptionsForFolder(fq);
            var tree = _this.initDirectoryTree();
            var queryTester = new QueryGlobTester(_this.config, fq);
            var noSiblingsClauses = !queryTester.hasSiblingExcludeClauses();
            var providerSW;
            new Promise(function (_resolve) { return process.nextTick(_resolve); })
                .then(function () {
                _this.activeCancellationTokens.add(cancellation);
                providerSW = StopWatch.create();
                return _this.provider.provideFileSearchResults({
                    pattern: _this.config.filePattern || ''
                }, options, cancellation.token);
            })
                .then(function (results) {
                var providerTime = providerSW.elapsed();
                var postProcessSW = StopWatch.create();
                if (_this.isCanceled) {
                    return null;
                }
                if (results) {
                    results.forEach(function (result) {
                        var relativePath = path.relative(fq.folder.fsPath, result.fsPath);
                        if (noSiblingsClauses) {
                            var basename = path.basename(result.fsPath);
                            _this.matchFile(onResult, { base: fq.folder, relativePath: relativePath, basename: basename });
                            return;
                        }
                        // TODO: Optimize siblings clauses with ripgrep here.
                        _this.addDirectoryEntries(tree, fq.folder, relativePath, onResult);
                    });
                }
                _this.activeCancellationTokens.delete(cancellation);
                if (_this.isCanceled) {
                    return null;
                }
                _this.matchDirectoryTree(tree, queryTester, onResult);
                return {
                    providerTime: providerTime,
                    postProcessTime: postProcessSW.elapsed()
                };
            }).then(function (stats) {
                cancellation.dispose();
                resolve(stats);
            }, function (err) {
                cancellation.dispose();
                reject(err);
            });
        });
    };
    FileSearchEngine.prototype.getSearchOptionsForFolder = function (fq) {
        var includes = resolvePatternsForProvider(this.config.includePattern, fq.includePattern);
        var excludes = resolvePatternsForProvider(this.config.excludePattern, fq.excludePattern);
        return {
            folder: fq.folder,
            excludes: excludes,
            includes: includes,
            useIgnoreFiles: !fq.disregardIgnoreFiles,
            useGlobalIgnoreFiles: !fq.disregardGlobalIgnoreFiles,
            followSymlinks: !fq.ignoreSymlinks,
            maxResults: this.config.maxResults
        };
    };
    FileSearchEngine.prototype.initDirectoryTree = function () {
        var tree = {
            rootEntries: [],
            pathToEntries: Object.create(null)
        };
        tree.pathToEntries['.'] = tree.rootEntries;
        return tree;
    };
    FileSearchEngine.prototype.addDirectoryEntries = function (_a, base, relativeFile, onResult) {
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
    FileSearchEngine.prototype.matchDirectoryTree = function (_a, queryTester, onResult) {
        var rootEntries = _a.rootEntries, pathToEntries = _a.pathToEntries;
        var self = this;
        var filePattern = this.filePattern;
        function matchDirectory(entries) {
            var hasSibling = glob.hasSiblingFn(function () { return entries.map(function (entry) { return entry.basename; }); });
            for (var i = 0, n = entries.length; i < n; i++) {
                var entry = entries[i];
                var relativePath = entry.relativePath, basename = entry.basename;
                // Check exclude pattern
                // If the user searches for the exact file name, we adjust the glob matching
                // to ignore filtering by siblings because the user seems to know what she
                // is searching for and we want to include the result in that case anyway
                if (!queryTester.includedInQuerySync(relativePath, basename, filePattern !== basename ? hasSibling : undefined)) {
                    continue;
                }
                var sub = pathToEntries[relativePath];
                if (sub) {
                    matchDirectory(sub);
                }
                else {
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
    FileSearchEngine.prototype.matchFile = function (onResult, candidate) {
        if (!this.includePattern || (candidate.relativePath && this.includePattern(candidate.relativePath, candidate.basename))) {
            if (this.exists || (this.maxResults && this.resultCount >= this.maxResults)) {
                this.isLimitHit = true;
                this.cancel();
            }
            if (!this.isLimitHit) {
                onResult(candidate);
            }
        }
    };
    return FileSearchEngine;
}());
var FileSearchManager = /** @class */ (function () {
    function FileSearchManager() {
    }
    FileSearchManager.prototype.fileSearch = function (config, provider, onBatch, token) {
        var _this = this;
        var engine = new FileSearchEngine(config, provider);
        var resultCount = 0;
        var onInternalResult = function (batch) {
            resultCount += batch.length;
            onBatch(batch.map(function (m) { return _this.rawMatchToSearchItem(m); }));
        };
        return this.doSearch(engine, FileSearchManager.BATCH_SIZE, onInternalResult, token).then(function (result) {
            return {
                limitHit: result.limitHit,
                stats: {
                    fromCache: false,
                    type: 'fileSearchProvider',
                    resultCount: resultCount,
                    detailStats: result.stats
                }
            };
        });
    };
    FileSearchManager.prototype.rawMatchToSearchItem = function (match) {
        if (match.relativePath) {
            return {
                resource: resources.joinPath(match.base, match.relativePath)
            };
        }
        else {
            // extraFileResources
            return {
                resource: match.base
            };
        }
    };
    FileSearchManager.prototype.doSearch = function (engine, batchSize, onResultBatch, token) {
        token.onCancellationRequested(function () {
            engine.cancel();
        });
        var _onResult = function (match) {
            if (match) {
                batch.push(match);
                if (batchSize > 0 && batch.length >= batchSize) {
                    onResultBatch(batch);
                    batch = [];
                }
            }
        };
        var batch = [];
        return engine.search(_onResult).then(function (result) {
            if (batch.length) {
                onResultBatch(batch);
            }
            return result;
        }, function (error) {
            if (batch.length) {
                onResultBatch(batch);
            }
            return Promise.reject(error);
        });
    };
    FileSearchManager.BATCH_SIZE = 512;
    return FileSearchManager;
}());
export { FileSearchManager };
