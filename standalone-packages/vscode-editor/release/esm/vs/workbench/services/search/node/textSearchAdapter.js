/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as extfs from '../../../../base/node/extfs.js';
import { RipgrepTextSearchEngine } from './ripgrepTextSearchEngine.js';
import { TextSearchManager } from './textSearchManager.js';
var TextSearchEngineAdapter = /** @class */ (function () {
    function TextSearchEngineAdapter(query) {
        this.query = query;
    }
    TextSearchEngineAdapter.prototype.search = function (token, onResult, onMessage) {
        if ((!this.query.folderQueries || !this.query.folderQueries.length) && (!this.query.extraFileResources || !this.query.extraFileResources.length)) {
            return Promise.resolve({
                type: 'success',
                limitHit: false,
                stats: {
                    type: 'searchProcess'
                }
            });
        }
        var pretendOutputChannel = {
            appendLine: function (msg) {
                onMessage({ message: msg });
            }
        };
        var textSearchManager = new TextSearchManager(this.query, new RipgrepTextSearchEngine(pretendOutputChannel), extfs);
        return new Promise(function (resolve, reject) {
            return textSearchManager
                .search(function (matches) {
                onResult(matches.map(fileMatchToSerialized));
            }, token)
                .then(function (c) { return resolve({ limitHit: c.limitHit, stats: null, type: 'success' }); }, reject);
        });
    };
    return TextSearchEngineAdapter;
}());
export { TextSearchEngineAdapter };
function fileMatchToSerialized(match) {
    return {
        path: match.resource ? match.resource.fsPath : undefined,
        results: match.results,
        numMatches: (match.results || []).reduce(function (sum, r) {
            if (!!r.ranges) {
                var m = r;
                return sum + (Array.isArray(m.ranges) ? m.ranges.length : 1);
            }
            else {
                return sum + 1;
            }
        }, 0)
    };
}
