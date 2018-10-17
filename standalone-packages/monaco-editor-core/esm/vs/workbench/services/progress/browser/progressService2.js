/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './media/progressService2.css';
import { localize } from '../../../../nls';
import { dispose } from '../../../../base/common/lifecycle';
import { emptyProgress, Progress } from '../../../../platform/progress/common/progress';
import { IViewletService } from '../../viewlet/browser/viewlet';
import { IStatusbarService } from '../../../../platform/statusbar/common/statusbar';
import { TPromise } from '../../../../base/common/winjs.base';
import { always, timeout } from '../../../../base/common/async';
import { ProgressBadge, IActivityService } from '../../activity/common/activity';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification';
import { Action } from '../../../../base/common/actions';
import { once } from '../../../../base/common/event';
import { ViewContainer } from '../../../common/views';
var ProgressService2 = /** @class */ (function () {
    function ProgressService2(_activityBar, _viewletService, _notificationService, _statusbarService) {
        this._activityBar = _activityBar;
        this._viewletService = _viewletService;
        this._notificationService = _notificationService;
        this._statusbarService = _statusbarService;
        this._stack = [];
        //
    }
    ProgressService2.prototype.withProgress = function (options, task, onDidCancel) {
        var location = options.location;
        if (location instanceof ViewContainer) {
            var viewlet = this._viewletService.getViewlet(location.id);
            if (viewlet) {
                return this._withViewletProgress(location.id, task);
            }
            console.warn("Bad progress location: " + location.id);
            return undefined;
        }
        switch (location) {
            case 15 /* Notification */:
                return this._withNotificationProgress(options, task, onDidCancel);
            case 10 /* Window */:
                return this._withWindowProgress(options, task);
            case 1 /* Explorer */:
                return this._withViewletProgress('workbench.view.explorer', task);
            case 3 /* Scm */:
                return this._withViewletProgress('workbench.view.scm', task);
            case 5 /* Extensions */:
                return this._withViewletProgress('workbench.view.extensions', task);
            default:
                console.warn("Bad progress location: " + location);
                return undefined;
        }
    };
    ProgressService2.prototype._withWindowProgress = function (options, callback) {
        var _this = this;
        var task = [options, new Progress(function () { return _this._updateWindowProgress(); })];
        var promise = callback(task[1]);
        var delayHandle = setTimeout(function () {
            delayHandle = undefined;
            _this._stack.unshift(task);
            _this._updateWindowProgress();
            // show progress for at least 150ms
            always(Promise.all([
                timeout(150),
                promise
            ]), function () {
                var idx = _this._stack.indexOf(task);
                _this._stack.splice(idx, 1);
                _this._updateWindowProgress();
            });
        }, 150);
        // cancel delay if promise finishes below 150ms
        always(promise, function () { return clearTimeout(delayHandle); });
        return promise;
    };
    ProgressService2.prototype._updateWindowProgress = function (idx) {
        if (idx === void 0) { idx = 0; }
        dispose(this._globalStatusEntry);
        if (idx < this._stack.length) {
            var _a = this._stack[idx], options = _a[0], progress = _a[1];
            var progressTitle = options.title;
            var progressMessage = progress.value && progress.value.message;
            var text = void 0;
            var title = void 0;
            if (progressTitle && progressMessage) {
                // <title>: <message>
                text = localize('progress.text2', "{0}: {1}", progressTitle, progressMessage);
                title = options.source ? localize('progress.title3', "[{0}] {1}: {2}", options.source, progressTitle, progressMessage) : text;
            }
            else if (progressTitle) {
                // <title>
                text = progressTitle;
                title = options.source ? localize('progress.title2', "[{0}]: {1}", options.source, progressTitle) : text;
            }
            else if (progressMessage) {
                // <message>
                text = progressMessage;
                title = options.source ? localize('progress.title2', "[{0}]: {1}", options.source, progressMessage) : text;
            }
            else {
                // no title, no message -> no progress. try with next on stack
                this._updateWindowProgress(idx + 1);
                return;
            }
            this._globalStatusEntry = this._statusbarService.addEntry({
                text: "$(sync~spin) " + text,
                tooltip: title
            }, 0 /* LEFT */);
        }
    };
    ProgressService2.prototype._withNotificationProgress = function (options, callback, onDidCancel) {
        var _this = this;
        var toDispose = [];
        var createNotification = function (message, increment) {
            if (!message) {
                return undefined; // we need a message at least
            }
            var actions = { primary: [] };
            if (options.cancellable) {
                var cancelAction = new /** @class */ (function (_super) {
                    __extends(class_1, _super);
                    function class_1() {
                        return _super.call(this, 'progress.cancel', localize('cancel', "Cancel"), null, true) || this;
                    }
                    class_1.prototype.run = function () {
                        if (typeof onDidCancel === 'function') {
                            onDidCancel();
                        }
                        return TPromise.as(undefined);
                    };
                    return class_1;
                }(Action));
                toDispose.push(cancelAction);
                actions.primary.push(cancelAction);
            }
            var handle = _this._notificationService.notify({
                severity: Severity.Info,
                message: message,
                source: options.source,
                actions: actions
            });
            updateProgress(handle, increment);
            once(handle.onDidClose)(function () {
                dispose(toDispose);
            });
            return handle;
        };
        var updateProgress = function (notification, increment) {
            if (typeof increment === 'number' && increment >= 0) {
                notification.progress.total(100); // always percentage based
                notification.progress.worked(increment);
            }
            else {
                notification.progress.infinite();
            }
        };
        var handle;
        var updateNotification = function (message, increment) {
            if (!handle) {
                handle = createNotification(message, increment);
            }
            else {
                if (typeof message === 'string') {
                    var newMessage = void 0;
                    if (typeof options.title === 'string') {
                        newMessage = options.title + ": " + message; // always prefix with overall title if we have it (https://github.com/Microsoft/vscode/issues/50932)
                    }
                    else {
                        newMessage = message;
                    }
                    handle.updateMessage(newMessage);
                }
                if (typeof increment === 'number') {
                    updateProgress(handle, increment);
                }
            }
        };
        // Show initially
        updateNotification(options.title);
        // Update based on progress
        var p = callback({
            report: function (progress) {
                updateNotification(progress.message, progress.increment);
            }
        });
        // Show progress for at least 800ms and then hide once done or canceled
        always(Promise.all([timeout(800), p]), function () {
            if (handle) {
                handle.close();
            }
        });
        return p;
    };
    ProgressService2.prototype._withViewletProgress = function (viewletId, task) {
        var _this = this;
        var promise = task(emptyProgress);
        // show in viewlet
        var viewletProgress = this._viewletService.getProgressIndicator(viewletId);
        if (viewletProgress) {
            viewletProgress.showWhile(TPromise.wrap(promise));
        }
        // show activity bar
        var activityProgress;
        var delayHandle = setTimeout(function () {
            delayHandle = undefined;
            var handle = _this._activityBar.showActivity(viewletId, new ProgressBadge(function () { return ''; }), 'progress-badge', 100);
            var startTimeVisible = Date.now();
            var minTimeVisible = 300;
            activityProgress = {
                dispose: function () {
                    var d = Date.now() - startTimeVisible;
                    if (d < minTimeVisible) {
                        // should at least show for Nms
                        setTimeout(function () { return handle.dispose(); }, minTimeVisible - d);
                    }
                    else {
                        // shown long enough
                        handle.dispose();
                    }
                }
            };
        }, 300);
        var onDone = function () {
            clearTimeout(delayHandle);
            dispose(activityProgress);
        };
        promise.then(onDone, onDone);
        return promise;
    };
    ProgressService2 = __decorate([
        __param(0, IActivityService),
        __param(1, IViewletService),
        __param(2, INotificationService),
        __param(3, IStatusbarService)
    ], ProgressService2);
    return ProgressService2;
}());
export { ProgressService2 };
