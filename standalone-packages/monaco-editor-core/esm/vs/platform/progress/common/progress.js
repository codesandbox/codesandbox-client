/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation';
import { CancellationTokenSource } from '../../../base/common/cancellation';
import { dispose, toDisposable } from '../../../base/common/lifecycle';
export var IProgressService = createDecorator('progressService');
export var emptyProgressRunner = Object.freeze({
    total: function () { },
    worked: function () { },
    done: function () { }
});
export var emptyProgress = Object.freeze({ report: function () { } });
var Progress = /** @class */ (function () {
    function Progress(callback) {
        this._callback = callback;
    }
    Object.defineProperty(Progress.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Progress.prototype.report = function (item) {
        this._value = item;
        this._callback(this._value);
    };
    return Progress;
}());
export { Progress };
var LongRunningOperation = /** @class */ (function () {
    function LongRunningOperation(progressService) {
        this.progressService = progressService;
        this.currentOperationId = 0;
        this.currentOperationDisposables = [];
    }
    LongRunningOperation.prototype.start = function (progressDelay) {
        var _this = this;
        // Stop any previous operation
        this.stop();
        // Start new
        var newOperationId = ++this.currentOperationId;
        var newOperationToken = new CancellationTokenSource();
        this.currentProgressTimeout = setTimeout(function () {
            if (newOperationId === _this.currentOperationId) {
                _this.currentProgressRunner = _this.progressService.show(true);
            }
        }, progressDelay);
        this.currentOperationDisposables.push(toDisposable(function () { return clearTimeout(_this.currentProgressTimeout); }), toDisposable(function () { return newOperationToken.cancel(); }), toDisposable(function () { return _this.currentProgressRunner ? _this.currentProgressRunner.done() : void 0; }));
        return {
            id: newOperationId,
            token: newOperationToken.token,
            stop: function () { return _this.doStop(newOperationId); },
            isCurrent: function () { return _this.currentOperationId === newOperationId; }
        };
    };
    LongRunningOperation.prototype.stop = function () {
        this.doStop(this.currentOperationId);
    };
    LongRunningOperation.prototype.doStop = function (operationId) {
        if (this.currentOperationId === operationId) {
            this.currentOperationDisposables = dispose(this.currentOperationDisposables);
        }
    };
    LongRunningOperation.prototype.dispose = function () {
        this.currentOperationDisposables = dispose(this.currentOperationDisposables);
    };
    return LongRunningOperation;
}());
export { LongRunningOperation };
