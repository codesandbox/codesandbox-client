/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { RunOnceScheduler, createCancelablePromise } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
var HoverOperation = /** @class */ (function () {
    function HoverOperation(computer, success, error, progress, hoverTime) {
        var _this = this;
        this._computer = computer;
        this._state = 0 /* IDLE */;
        this._hoverTime = hoverTime;
        this._firstWaitScheduler = new RunOnceScheduler(function () { return _this._triggerAsyncComputation(); }, 0);
        this._secondWaitScheduler = new RunOnceScheduler(function () { return _this._triggerSyncComputation(); }, 0);
        this._loadingMessageScheduler = new RunOnceScheduler(function () { return _this._showLoadingMessage(); }, 0);
        this._asyncComputationPromise = null;
        this._asyncComputationPromiseDone = false;
        this._completeCallback = success;
        this._errorCallback = error;
        this._progressCallback = progress;
    }
    HoverOperation.prototype.setHoverTime = function (hoverTime) {
        this._hoverTime = hoverTime;
    };
    HoverOperation.prototype._firstWaitTime = function () {
        return this._hoverTime / 2;
    };
    HoverOperation.prototype._secondWaitTime = function () {
        return this._hoverTime / 2;
    };
    HoverOperation.prototype._loadingMessageTime = function () {
        return 3 * this._hoverTime;
    };
    HoverOperation.prototype._triggerAsyncComputation = function () {
        var _this = this;
        this._state = 2 /* SECOND_WAIT */;
        this._secondWaitScheduler.schedule(this._secondWaitTime());
        if (this._computer.computeAsync) {
            this._asyncComputationPromiseDone = false;
            this._asyncComputationPromise = createCancelablePromise(function (token) { return _this._computer.computeAsync(token); });
            this._asyncComputationPromise.then(function (asyncResult) {
                _this._asyncComputationPromiseDone = true;
                _this._withAsyncResult(asyncResult);
            }, function (e) { return _this._onError(e); });
        }
        else {
            this._asyncComputationPromiseDone = true;
        }
    };
    HoverOperation.prototype._triggerSyncComputation = function () {
        if (this._computer.computeSync) {
            this._computer.onResult(this._computer.computeSync(), true);
        }
        if (this._asyncComputationPromiseDone) {
            this._state = 0 /* IDLE */;
            this._onComplete(this._computer.getResult());
        }
        else {
            this._state = 3 /* WAITING_FOR_ASYNC_COMPUTATION */;
            this._onProgress(this._computer.getResult());
        }
    };
    HoverOperation.prototype._showLoadingMessage = function () {
        if (this._state === 3 /* WAITING_FOR_ASYNC_COMPUTATION */) {
            this._onProgress(this._computer.getResultWithLoadingMessage());
        }
    };
    HoverOperation.prototype._withAsyncResult = function (asyncResult) {
        if (asyncResult) {
            this._computer.onResult(asyncResult, false);
        }
        if (this._state === 3 /* WAITING_FOR_ASYNC_COMPUTATION */) {
            this._state = 0 /* IDLE */;
            this._onComplete(this._computer.getResult());
        }
    };
    HoverOperation.prototype._onComplete = function (value) {
        if (this._completeCallback) {
            this._completeCallback(value);
        }
    };
    HoverOperation.prototype._onError = function (error) {
        if (this._errorCallback) {
            this._errorCallback(error);
        }
        else {
            onUnexpectedError(error);
        }
    };
    HoverOperation.prototype._onProgress = function (value) {
        if (this._progressCallback) {
            this._progressCallback(value);
        }
    };
    HoverOperation.prototype.start = function (mode) {
        if (mode === 0 /* Delayed */) {
            if (this._state === 0 /* IDLE */) {
                this._state = 1 /* FIRST_WAIT */;
                this._firstWaitScheduler.schedule(this._firstWaitTime());
                this._loadingMessageScheduler.schedule(this._loadingMessageTime());
            }
        }
        else {
            switch (this._state) {
                case 0 /* IDLE */:
                    this._triggerAsyncComputation();
                    this._secondWaitScheduler.cancel();
                    this._triggerSyncComputation();
                    break;
                case 2 /* SECOND_WAIT */:
                    this._secondWaitScheduler.cancel();
                    this._triggerSyncComputation();
                    break;
            }
        }
    };
    HoverOperation.prototype.cancel = function () {
        this._loadingMessageScheduler.cancel();
        if (this._state === 1 /* FIRST_WAIT */) {
            this._firstWaitScheduler.cancel();
        }
        if (this._state === 2 /* SECOND_WAIT */) {
            this._secondWaitScheduler.cancel();
            if (this._asyncComputationPromise) {
                this._asyncComputationPromise.cancel();
                this._asyncComputationPromise = null;
            }
        }
        if (this._state === 3 /* WAITING_FOR_ASYNC_COMPUTATION */) {
            if (this._asyncComputationPromise) {
                this._asyncComputationPromise.cancel();
                this._asyncComputationPromise = null;
            }
        }
        this._state = 0 /* IDLE */;
    };
    return HoverOperation;
}());
export { HoverOperation };
