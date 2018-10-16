/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { globals } from '../common/platform.js';
import { logOnceWebWorkerWarning } from '../common/worker/simpleWorker.js';
function getWorker(workerId, label) {
    // Option for hosts to overwrite the worker script (used in the standalone editor)
    if (globals.MonacoEnvironment) {
        if (typeof globals.MonacoEnvironment.getWorker === 'function') {
            return globals.MonacoEnvironment.getWorker(workerId, label);
        }
        if (typeof globals.MonacoEnvironment.getWorkerUrl === 'function') {
            return new Worker(globals.MonacoEnvironment.getWorkerUrl(workerId, label));
        }
    }
    // ESM-comment-begin
    // 	if (typeof require === 'function') {
    // 		return new Worker(require.toUrl('./' + workerId) + '#' + label);
    // 	}
    // ESM-comment-end
    throw new Error("You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker");
}
/**
 * A worker that uses HTML5 web workers so that is has
 * its own global scope and its own thread.
 */
var WebWorker = /** @class */ (function () {
    function WebWorker(moduleId, id, label, onMessageCallback, onErrorCallback) {
        this.id = id;
        this.worker = getWorker('workerMain.js', label);
        this.postMessage(moduleId);
        this.worker.onmessage = function (ev) {
            onMessageCallback(ev.data);
        };
        if (typeof this.worker.addEventListener === 'function') {
            this.worker.addEventListener('error', onErrorCallback);
        }
    }
    WebWorker.prototype.getId = function () {
        return this.id;
    };
    WebWorker.prototype.postMessage = function (msg) {
        if (this.worker) {
            this.worker.postMessage(msg);
        }
    };
    WebWorker.prototype.dispose = function () {
        this.worker.terminate();
        this.worker = null;
    };
    return WebWorker;
}());
var DefaultWorkerFactory = /** @class */ (function () {
    function DefaultWorkerFactory(label) {
        this._label = label;
        this._webWorkerFailedBeforeError = false;
    }
    DefaultWorkerFactory.prototype.create = function (moduleId, onMessageCallback, onErrorCallback) {
        var _this = this;
        var workerId = (++DefaultWorkerFactory.LAST_WORKER_ID);
        if (this._webWorkerFailedBeforeError) {
            throw this._webWorkerFailedBeforeError;
        }
        return new WebWorker(moduleId, workerId, this._label || 'anonymous' + workerId, onMessageCallback, function (err) {
            logOnceWebWorkerWarning(err);
            _this._webWorkerFailedBeforeError = err;
            onErrorCallback(err);
        });
    };
    DefaultWorkerFactory.LAST_WORKER_ID = 0;
    return DefaultWorkerFactory;
}());
export { DefaultWorkerFactory };
