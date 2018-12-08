/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from '../../../../../../path.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
var Engine = /** @class */ (function () {
    function Engine(config, walker, workerProvider) {
        this.isCanceled = false;
        this.isDone = false;
        this.totalBytes = 0;
        this.processedBytes = 0;
        this.progressed = 0;
        this.walkerIsDone = false;
        this.limitReached = false;
        this.numResults = 0;
        this.nextWorker = 0;
        this.config = makeRawSearch(config);
        this.config2 = config;
        this.walker = walker;
        this.workerProvider = workerProvider;
    }
    Engine.prototype.cancel = function () {
        this.isCanceled = true;
        this.walker.cancel();
        this.workers.forEach(function (w) {
            w.cancel()
                .then(null, onUnexpectedError);
        });
    };
    Engine.prototype.initializeWorkers = function () {
        this.workers.forEach(function (w) {
            w.initialize()
                .then(null, onUnexpectedError);
        });
    };
    Engine.prototype.search = function (onResult, onProgress, done) {
        var _this = this;
        this.workers = this.workerProvider.getWorkers();
        this.initializeWorkers();
        var fileEncoding = this.config.folderQueries.length === 1 ?
            this.config.folderQueries[0].fileEncoding || 'utf8' :
            'utf8';
        var progress = function () {
            if (++_this.progressed % Engine.PROGRESS_FLUSH_CHUNK_SIZE === 0) {
                onProgress({ total: _this.totalBytes, worked: _this.processedBytes }); // buffer progress in chunks to reduce pressure
            }
        };
        var unwind = function (processed) {
            _this.processedBytes += processed;
            // Emit progress() unless we got canceled or hit the limit
            if (processed && !_this.isDone && !_this.isCanceled && !_this.limitReached) {
                progress();
            }
            // Emit done()
            if (!_this.isDone && _this.processedBytes === _this.totalBytes && _this.walkerIsDone) {
                _this.isDone = true;
                done(_this.walkerError, {
                    limitHit: _this.limitReached,
                    stats: _this.walker.getStats()
                });
            }
        };
        var run = function (batch, batchBytes) {
            var worker = _this.workers[_this.nextWorker];
            _this.nextWorker = (_this.nextWorker + 1) % _this.workers.length;
            var maxResults = _this.config.maxResults && (_this.config.maxResults - _this.numResults);
            var searchArgs = { absolutePaths: batch, maxResults: maxResults, pattern: _this.config.contentPattern, fileEncoding: fileEncoding, previewOptions: _this.config.previewOptions };
            worker.search(searchArgs).then(function (result) {
                if (!result || _this.limitReached || _this.isCanceled) {
                    return unwind(batchBytes);
                }
                var matches = result.matches;
                onResult(matches);
                _this.numResults += result.numMatches;
                if (_this.config.maxResults && _this.numResults >= _this.config.maxResults) {
                    // It's possible to go over maxResults like this, but it's much simpler than trying to extract the exact number
                    // of file matches, line matches, and matches within a line to == maxResults.
                    _this.limitReached = true;
                }
                unwind(batchBytes);
            }, function (error) {
                // An error on the worker's end, not in reading the file, but in processing the batch. Log and continue.
                onUnexpectedError(error);
                unwind(batchBytes);
            });
        };
        // Walk over the file system
        var nextBatch = [];
        var nextBatchBytes = 0;
        var batchFlushBytes = Math.pow(2, 20); // 1MB
        this.walker.walk(this.config2.folderQueries, this.config2.extraFileResources, function (result) {
            var bytes = result.size || 1;
            _this.totalBytes += bytes;
            // If we have reached the limit or we are canceled, ignore it
            if (_this.limitReached || _this.isCanceled) {
                return unwind(bytes);
            }
            // Indicate progress to the outside
            progress();
            var absolutePath = result.base ? [result.base, result.relativePath].join(path.sep) : result.relativePath;
            nextBatch.push(absolutePath);
            nextBatchBytes += bytes;
            if (nextBatchBytes >= batchFlushBytes) {
                run(nextBatch, nextBatchBytes);
                nextBatch = [];
                nextBatchBytes = 0;
            }
        }, onProgress, function (error, isLimitHit) {
            _this.walkerIsDone = true;
            _this.walkerError = error;
            // Send any remaining paths to a worker, or unwind if we're stopping
            if (nextBatch.length) {
                if (_this.limitReached || _this.isCanceled) {
                    unwind(nextBatchBytes);
                }
                else {
                    run(nextBatch, nextBatchBytes);
                }
            }
            else {
                unwind(0);
            }
        });
    };
    Engine.PROGRESS_FLUSH_CHUNK_SIZE = 50; // optimization: number of files to process before emitting progress event
    return Engine;
}());
export { Engine };
/**
 * Exported for tests
 */
export function makeRawSearch(query) {
    var rawSearch = {
        folderQueries: [],
        extraFiles: [],
        excludePattern: query.excludePattern,
        includePattern: query.includePattern,
        maxResults: query.maxResults,
        useRipgrep: query.useRipgrep,
        disregardIgnoreFiles: query.folderQueries.some(function (fq) { return fq.disregardIgnoreFiles; }),
        disregardGlobalIgnoreFiles: query.folderQueries.some(function (fq) { return fq.disregardGlobalIgnoreFiles; }),
        ignoreSymlinks: query.folderQueries.some(function (fq) { return fq.ignoreSymlinks; }),
        previewOptions: query.previewOptions
    };
    for (var _i = 0, _a = query.folderQueries; _i < _a.length; _i++) {
        var q = _a[_i];
        rawSearch.folderQueries.push({
            excludePattern: q.excludePattern,
            includePattern: q.includePattern,
            fileEncoding: q.fileEncoding,
            disregardIgnoreFiles: q.disregardIgnoreFiles,
            disregardGlobalIgnoreFiles: q.disregardGlobalIgnoreFiles,
            folder: q.folder.fsPath
        });
    }
    if (query.extraFileResources) {
        for (var _b = 0, _c = query.extraFileResources; _b < _c.length; _b++) {
            var r = _c[_b];
            rawSearch.extraFiles.push(r.fsPath);
        }
    }
    rawSearch.contentPattern = query.contentPattern;
    return rawSearch;
}
