/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var SearchWorkerChannel = /** @class */ (function () {
    function SearchWorkerChannel(worker) {
        this.worker = worker;
    }
    SearchWorkerChannel.prototype.listen = function (event, arg) {
        throw new Error('No events');
    };
    SearchWorkerChannel.prototype.call = function (command, arg) {
        switch (command) {
            case 'initialize': return this.worker.initialize();
            case 'search': return this.worker.search(arg);
            case 'cancel': return this.worker.cancel();
        }
        throw new Error("Call not found: " + command);
    };
    return SearchWorkerChannel;
}());
export { SearchWorkerChannel };
var SearchWorkerChannelClient = /** @class */ (function () {
    function SearchWorkerChannelClient(channel) {
        this.channel = channel;
    }
    SearchWorkerChannelClient.prototype.initialize = function () {
        return this.channel.call('initialize');
    };
    SearchWorkerChannelClient.prototype.search = function (args) {
        return this.channel.call('search', args);
    };
    SearchWorkerChannelClient.prototype.cancel = function () {
        return this.channel.call('cancel');
    };
    return SearchWorkerChannelClient;
}());
export { SearchWorkerChannelClient };
