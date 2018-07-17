/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import BaseSeverity from '../../../base/common/severity.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Emitter } from '../../../base/common/event.js';
export var Severity = BaseSeverity;
export var INotificationService = createDecorator('notificationService');
var NoOpNotification = /** @class */ (function () {
    function NoOpNotification() {
        this.progress = new NoOpProgress();
        this._onDidClose = new Emitter();
    }
    Object.defineProperty(NoOpNotification.prototype, "onDidClose", {
        get: function () {
            return this._onDidClose.event;
        },
        enumerable: true,
        configurable: true
    });
    NoOpNotification.prototype.updateSeverity = function (severity) { };
    NoOpNotification.prototype.updateMessage = function (message) { };
    NoOpNotification.prototype.updateActions = function (actions) { };
    NoOpNotification.prototype.close = function () {
        this._onDidClose.dispose();
    };
    return NoOpNotification;
}());
export { NoOpNotification };
var NoOpProgress = /** @class */ (function () {
    function NoOpProgress() {
    }
    NoOpProgress.prototype.infinite = function () { };
    NoOpProgress.prototype.done = function () { };
    NoOpProgress.prototype.total = function (value) { };
    NoOpProgress.prototype.worked = function (value) { };
    return NoOpProgress;
}());
export { NoOpProgress };
