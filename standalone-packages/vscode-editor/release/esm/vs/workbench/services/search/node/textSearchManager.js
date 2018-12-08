/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from '../../../../../path.js';
import { mapArrayOrNot } from '../../../../base/common/arrays.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import * as glob from '../../../../base/common/glob.js';
import * as resources from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { toCanonicalName } from '../../../../base/node/encoding.js';
import * as extfs from '../../../../base/node/extfs.js';
import { QueryGlobTester, resolvePatternsForProvider } from './search.js';
var TextSearchManager = /** @class */ (function () {
    function TextSearchManager(query, provider, _extfs) {
        if (_extfs === void 0) { _extfs = extfs; }
        this.query = query;
        this.provider = provider;
        this._extfs = _extfs;
        this.resultCount = 0;
    }
    TextSearchManager.prototype.search = function (onProgress, token) {
        var _this = this;
        var folderQueries = this.query.folderQueries || [];
        var tokenSource = new CancellationTokenSource();
        token.onCancellationRequested(function () { return tokenSource.cancel(); });
        return new Promise(function (resolve, reject) {
            _this.collector = new TextSearchResultsCollector(onProgress);
            var isCanceled = false;
            var onResult = function (match, folderIdx) {
                if (isCanceled) {
                    return;
                }
                if (typeof _this.query.maxResults === 'number' && _this.resultCount >= _this.query.maxResults) {
                    _this.isLimitHit = true;
                    isCanceled = true;
                    tokenSource.cancel();
                }
                if (!_this.isLimitHit) {
                    _this.resultCount++;
                    _this.collector.add(match, folderIdx);
                }
            };
            // For each root folder
            Promise.all(folderQueries.map(function (fq, i) {
                return _this.searchInFolder(fq, function (r) { return onResult(r, i); }, tokenSource.token);
            })).then(function (results) {
                tokenSource.dispose();
                _this.collector.flush();
                var someFolderHitLImit = results.some(function (result) { return !!result && !!result.limitHit; });
                resolve({
                    limitHit: _this.isLimitHit || someFolderHitLImit,
                    stats: {
                        type: 'textSearchProvider'
                    }
                });
            }, function (err) {
                tokenSource.dispose();
                var errMsg = toErrorMessage(err);
                reject(new Error(errMsg));
            });
        });
    };
    TextSearchManager.prototype.searchInFolder = function (folderQuery, onResult, token) {
        var _this = this;
        var queryTester = new QueryGlobTester(this.query, folderQuery);
        var testingPs = [];
        var progress = {
            report: function (result) {
                // TODO: validate result.ranges vs result.preview.matches
                var hasSibling = folderQuery.folder.scheme === 'file' ?
                    glob.hasSiblingPromiseFn(function () {
                        return _this.readdir(path.dirname(result.uri.fsPath));
                    }) :
                    undefined;
                var relativePath = path.relative(folderQuery.folder.fsPath, result.uri.fsPath);
                testingPs.push(queryTester.includedInQuery(relativePath, path.basename(relativePath), hasSibling)
                    .then(function (included) {
                    if (included) {
                        onResult(result);
                    }
                }));
            }
        };
        var searchOptions = this.getSearchOptionsForFolder(folderQuery);
        return new Promise(function (resolve) { return process.nextTick(resolve); })
            .then(function () { return _this.provider.provideTextSearchResults(patternInfoToQuery(_this.query.contentPattern), searchOptions, progress, token); })
            .then(function (result) {
            return Promise.all(testingPs)
                .then(function () { return result; });
        });
    };
    TextSearchManager.prototype.readdir = function (dirname) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._extfs.readdir(dirname, function (err, files) {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });
    };
    TextSearchManager.prototype.getSearchOptionsForFolder = function (fq) {
        var includes = resolvePatternsForProvider(this.query.includePattern, fq.includePattern);
        var excludes = resolvePatternsForProvider(this.query.excludePattern, fq.excludePattern);
        var options = {
            folder: URI.from(fq.folder),
            excludes: excludes,
            includes: includes,
            useIgnoreFiles: !fq.disregardIgnoreFiles,
            useGlobalIgnoreFiles: !fq.disregardGlobalIgnoreFiles,
            followSymlinks: !fq.ignoreSymlinks,
            encoding: fq.fileEncoding && toCanonicalName(fq.fileEncoding),
            maxFileSize: this.query.maxFileSize,
            maxResults: this.query.maxResults,
            previewOptions: this.query.previewOptions,
            afterContext: this.query.afterContext,
            beforeContext: this.query.beforeContext
        };
        options.usePCRE2 = this.query.usePCRE2;
        return options;
    };
    return TextSearchManager;
}());
export { TextSearchManager };
function patternInfoToQuery(patternInfo) {
    return {
        isCaseSensitive: patternInfo.isCaseSensitive || false,
        isRegExp: patternInfo.isRegExp || false,
        isWordMatch: patternInfo.isWordMatch || false,
        isMultiline: patternInfo.isMultiline || false,
        pattern: patternInfo.pattern
    };
}
var TextSearchResultsCollector = /** @class */ (function () {
    function TextSearchResultsCollector(_onResult) {
        var _this = this;
        this._onResult = _onResult;
        this._currentFileMatch = null;
        this._batchedCollector = new BatchedCollector(512, function (items) { return _this.sendItems(items); });
    }
    TextSearchResultsCollector.prototype.add = function (data, folderIdx) {
        // Collects TextSearchResults into IInternalFileMatches and collates using BatchedCollector.
        // This is efficient for ripgrep which sends results back one file at a time. It wouldn't be efficient for other search
        // providers that send results in random order. We could do this step afterwards instead.
        if (this._currentFileMatch && (this._currentFolderIdx !== folderIdx || !resources.isEqual(this._currentUri, data.uri))) {
            this.pushToCollector();
            this._currentFileMatch = null;
        }
        if (!this._currentFileMatch) {
            this._currentFolderIdx = folderIdx;
            this._currentFileMatch = {
                resource: data.uri,
                results: []
            };
        }
        this._currentFileMatch.results.push(extensionResultToFrontendResult(data));
    };
    TextSearchResultsCollector.prototype.pushToCollector = function () {
        var size = this._currentFileMatch && this._currentFileMatch.results ?
            this._currentFileMatch.results.length :
            0;
        this._batchedCollector.addItem(this._currentFileMatch, size);
    };
    TextSearchResultsCollector.prototype.flush = function () {
        this.pushToCollector();
        this._batchedCollector.flush();
    };
    TextSearchResultsCollector.prototype.sendItems = function (items) {
        this._onResult(items);
    };
    return TextSearchResultsCollector;
}());
export { TextSearchResultsCollector };
function extensionResultToFrontendResult(data) {
    // Warning: result from RipgrepTextSearchEH has fake vscode.Range. Don't depend on any other props beyond these...
    if (extensionResultIsMatch(data)) {
        return {
            preview: {
                matches: mapArrayOrNot(data.preview.matches, function (m) { return ({
                    startLineNumber: m.start.line,
                    startColumn: m.start.character,
                    endLineNumber: m.end.line,
                    endColumn: m.end.character
                }); }),
                text: data.preview.text
            },
            ranges: mapArrayOrNot(data.ranges, function (r) { return ({
                startLineNumber: r.start.line,
                startColumn: r.start.character,
                endLineNumber: r.end.line,
                endColumn: r.end.character
            }); })
        };
    }
    else {
        return {
            text: data.text,
            lineNumber: data.lineNumber
        };
    }
}
export function extensionResultIsMatch(data) {
    return !!data.preview;
}
/**
 * Collects items that have a size - before the cumulative size of collected items reaches START_BATCH_AFTER_COUNT, the callback is called for every
 * set of items collected.
 * But after that point, the callback is called with batches of maxBatchSize.
 * If the batch isn't filled within some time, the callback is also called.
 */
var BatchedCollector = /** @class */ (function () {
    function BatchedCollector(maxBatchSize, cb) {
        this.maxBatchSize = maxBatchSize;
        this.cb = cb;
        this.totalNumberCompleted = 0;
        this.batch = [];
        this.batchSize = 0;
    }
    BatchedCollector.prototype.addItem = function (item, size) {
        if (!item) {
            return;
        }
        this.addItemToBatch(item, size);
    };
    BatchedCollector.prototype.addItems = function (items, size) {
        if (!items) {
            return;
        }
        this.addItemsToBatch(items, size);
    };
    BatchedCollector.prototype.addItemToBatch = function (item, size) {
        this.batch.push(item);
        this.batchSize += size;
        this.onUpdate();
    };
    BatchedCollector.prototype.addItemsToBatch = function (item, size) {
        this.batch = this.batch.concat(item);
        this.batchSize += size;
        this.onUpdate();
    };
    BatchedCollector.prototype.onUpdate = function () {
        var _this = this;
        if (this.totalNumberCompleted < BatchedCollector.START_BATCH_AFTER_COUNT) {
            // Flush because we aren't batching yet
            this.flush();
        }
        else if (this.batchSize >= this.maxBatchSize) {
            // Flush because the batch is full
            this.flush();
        }
        else if (!this.timeoutHandle) {
            // No timeout running, start a timeout to flush
            this.timeoutHandle = setTimeout(function () {
                _this.flush();
            }, BatchedCollector.TIMEOUT);
        }
    };
    BatchedCollector.prototype.flush = function () {
        if (this.batchSize) {
            this.totalNumberCompleted += this.batchSize;
            this.cb(this.batch);
            this.batch = [];
            this.batchSize = 0;
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
                this.timeoutHandle = 0;
            }
        }
    };
    BatchedCollector.TIMEOUT = 4000;
    // After START_BATCH_AFTER_COUNT items have been collected, stop flushing on timeout
    BatchedCollector.START_BATCH_AFTER_COUNT = 50;
    return BatchedCollector;
}());
export { BatchedCollector };
