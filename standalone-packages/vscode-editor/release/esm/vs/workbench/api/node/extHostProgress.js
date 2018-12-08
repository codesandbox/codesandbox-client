/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ProgressLocation } from './extHostTypeConverters.js';
import { Progress } from '../../../platform/progress/common/progress.js';
import { localize } from '../../../nls.js';
import { CancellationTokenSource, CancellationToken } from '../../../base/common/cancellation.js';
import { debounce } from '../../../base/common/decorators.js';
var ExtHostProgress = /** @class */ (function () {
    function ExtHostProgress(proxy) {
        this._handles = 0;
        this._mapHandleToCancellationSource = new Map();
        this._proxy = proxy;
    }
    ExtHostProgress.prototype.withProgress = function (extension, options, task) {
        var handle = this._handles++;
        var title = options.title, location = options.location, cancellable = options.cancellable;
        var source = localize('extensionSource', "{0} (Extension)", extension.displayName || extension.name);
        this._proxy.$startProgress(handle, { location: ProgressLocation.from(location), title: title, source: source, cancellable: cancellable });
        return this._withProgress(handle, task, cancellable);
    };
    ExtHostProgress.prototype._withProgress = function (handle, task, cancellable) {
        var _this = this;
        var source;
        if (cancellable) {
            source = new CancellationTokenSource();
            this._mapHandleToCancellationSource.set(handle, source);
        }
        var progressEnd = function (handle) {
            _this._proxy.$progressEnd(handle);
            _this._mapHandleToCancellationSource.delete(handle);
            if (source) {
                source.dispose();
            }
        };
        var p;
        try {
            p = task(new ProgressCallback(this._proxy, handle), cancellable ? source.token : CancellationToken.None);
        }
        catch (err) {
            progressEnd(handle);
            throw err;
        }
        p.then(function (result) { return progressEnd(handle); }, function (err) { return progressEnd(handle); });
        return p;
    };
    ExtHostProgress.prototype.$acceptProgressCanceled = function (handle) {
        var source = this._mapHandleToCancellationSource.get(handle);
        if (source) {
            source.cancel();
            this._mapHandleToCancellationSource.delete(handle);
        }
    };
    return ExtHostProgress;
}());
export { ExtHostProgress };
function mergeProgress(result, currentValue) {
    result.message = currentValue.message;
    if (typeof currentValue.increment === 'number') {
        if (typeof result.increment === 'number') {
            result.increment += currentValue.increment;
        }
        else {
            result.increment = currentValue.increment;
        }
    }
    return result;
}
var ProgressCallback = /** @class */ (function (_super) {
    __extends(ProgressCallback, _super);
    function ProgressCallback(_proxy, _handle) {
        var _this = _super.call(this, function (p) { return _this.throttledReport(p); }) || this;
        _this._proxy = _proxy;
        _this._handle = _handle;
        return _this;
    }
    ProgressCallback.prototype.throttledReport = function (p) {
        this._proxy.$progressReport(this._handle, p);
    };
    __decorate([
        debounce(100, function (result, currentValue) { return mergeProgress(result, currentValue); }, function () { return Object.create(null); })
    ], ProgressCallback.prototype, "throttledReport", null);
    return ProgressCallback;
}(Progress));
