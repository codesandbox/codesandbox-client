/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as fs from '../../../../../../fs.js';
import * as gracefulFs from '../../../../../../graceful-fs.js';
import { MAX_FILE_SIZE } from '../../../../../platform/files/node/files.js';
import { FileWalker } from '../fileSearch.js';
import { Engine } from './textSearch.js';
import { TextSearchWorkerProvider } from './textSearchWorkerProvider.js';
import { BatchedCollector } from '../textSearchManager.js';
gracefulFs.gracefulify(fs);
var LegacyTextSearchService = /** @class */ (function () {
    function LegacyTextSearchService() {
    }
    LegacyTextSearchService.prototype.textSearch = function (config, progressCallback, token) {
        if (!this.textSearchWorkerProvider) {
            this.textSearchWorkerProvider = new TextSearchWorkerProvider();
        }
        var engine = new Engine(config, new FileWalker({
            type: 1 /* File */,
            folderQueries: config.folderQueries,
            extraFileResources: config.extraFileResources,
            includePattern: config.includePattern,
            excludePattern: config.excludePattern,
            useRipgrep: false
        }, MAX_FILE_SIZE), this.textSearchWorkerProvider);
        return this.doTextSearch(engine, progressCallback, LegacyTextSearchService.BATCH_SIZE, token);
    };
    LegacyTextSearchService.prototype.doTextSearch = function (engine, progressCallback, batchSize, token) {
        if (token) {
            token.onCancellationRequested(function () { return engine.cancel(); });
        }
        return new Promise(function (c, e) {
            // Use BatchedCollector to get new results to the frontend every 2s at least, until 50 results have been returned
            var collector = new BatchedCollector(batchSize, progressCallback);
            engine.search(function (matches) {
                var totalMatches = matches.reduce(function (acc, m) { return acc + m.numMatches; }, 0);
                collector.addItems(matches, totalMatches);
            }, function (progress) {
                progressCallback(progress);
            }, function (error, stats) {
                collector.flush();
                if (error) {
                    e(error);
                }
                else {
                    c({
                        type: 'success',
                        limitHit: stats.limitHit,
                        stats: null
                    });
                }
            });
        });
    };
    LegacyTextSearchService.BATCH_SIZE = 512;
    return LegacyTextSearchService;
}());
export { LegacyTextSearchService };
