/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { globals } from './platform.js';
var hasPerformanceNow = (globals.performance && typeof globals.performance.now === 'function');
var StopWatch = /** @class */ (function () {
    function StopWatch(highResolution) {
        this._highResolution = hasPerformanceNow && highResolution;
        this._startTime = this._now();
        this._stopTime = -1;
    }
    StopWatch.create = function (highResolution) {
        if (highResolution === void 0) { highResolution = true; }
        return new StopWatch(highResolution);
    };
    StopWatch.prototype.stop = function () {
        this._stopTime = this._now();
    };
    StopWatch.prototype.elapsed = function () {
        if (this._stopTime !== -1) {
            return this._stopTime - this._startTime;
        }
        return this._now() - this._startTime;
    };
    StopWatch.prototype._now = function () {
        return this._highResolution ? globals.performance.now() : new Date().getTime();
    };
    return StopWatch;
}());
export { StopWatch };
