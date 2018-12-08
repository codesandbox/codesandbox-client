/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as os from '../../../../../../os.js';
import * as ipc from '../../../../../base/parts/ipc/node/ipc.js';
import { Client } from '../../../../../base/parts/ipc/node/ipc.cp.js';
import { SearchWorkerChannelClient } from './worker/searchWorkerIpc.js';
import { getPathFromAmdModule } from '../../../../../base/common/amd.js';
var TextSearchWorkerProvider = /** @class */ (function () {
    function TextSearchWorkerProvider() {
        this.workers = [];
    }
    TextSearchWorkerProvider.prototype.getWorkers = function () {
        var numWorkers = os.cpus().length;
        while (this.workers.length < numWorkers) {
            this.createWorker();
        }
        return this.workers;
    };
    TextSearchWorkerProvider.prototype.createWorker = function () {
        var client = new Client(getPathFromAmdModule(require, 'bootstrap-fork'), {
            serverName: 'Search Worker ' + this.workers.length,
            args: ['--type=searchWorker'],
            timeout: 30 * 1000,
            env: {
                AMD_ENTRYPOINT: 'vs/workbench/services/search/node/legacy/worker/searchWorkerApp',
                PIPE_LOGGING: 'true',
                VERBOSE_LOGGING: process.env.VERBOSE_LOGGING
            },
            useQueue: true
        });
        var channel = ipc.getNextTickChannel(client.getChannel('searchWorker'));
        var channelClient = new SearchWorkerChannelClient(channel);
        this.workers.push(channelClient);
    };
    return TextSearchWorkerProvider;
}());
export { TextSearchWorkerProvider };
