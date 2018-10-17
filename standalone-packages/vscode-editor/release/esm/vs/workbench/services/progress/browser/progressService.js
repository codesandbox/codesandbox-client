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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Disposable } from '../../../../base/common/lifecycle.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as types from '../../../../base/common/types.js';
import { IViewletService } from '../../viewlet/browser/viewlet.js';
import { IPanelService } from '../../panel/common/panelService.js';
var ScopedService = /** @class */ (function (_super) {
    __extends(ScopedService, _super);
    function ScopedService(viewletService, panelService, scopeId) {
        var _this = _super.call(this) || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        _this.scopeId = scopeId;
        _this.registerListeners();
        return _this;
    }
    ScopedService.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.viewletService.onDidViewletOpen(function (viewlet) { return _this.onScopeOpened(viewlet.getId()); }));
        this._register(this.panelService.onDidPanelOpen(function (panel) { return _this.onScopeOpened(panel.getId()); }));
        this._register(this.viewletService.onDidViewletClose(function (viewlet) { return _this.onScopeClosed(viewlet.getId()); }));
        this._register(this.panelService.onDidPanelClose(function (panel) { return _this.onScopeClosed(panel.getId()); }));
    };
    ScopedService.prototype.onScopeClosed = function (scopeId) {
        if (scopeId === this.scopeId) {
            this.onScopeDeactivated();
        }
    };
    ScopedService.prototype.onScopeOpened = function (scopeId) {
        if (scopeId === this.scopeId) {
            this.onScopeActivated();
        }
    };
    return ScopedService;
}(Disposable));
export { ScopedService };
var ScopedProgressService = /** @class */ (function (_super) {
    __extends(ScopedProgressService, _super);
    function ScopedProgressService(progressbar, scopeId, isActive, viewletService, panelService) {
        var _this = _super.call(this, viewletService, panelService, scopeId) || this;
        _this.progressbar = progressbar;
        _this.isActive = isActive || types.isUndefinedOrNull(scopeId); // If service is unscoped, enable by default
        _this.progressState = Object.create(null);
        return _this;
    }
    ScopedProgressService.prototype.onScopeDeactivated = function () {
        this.isActive = false;
    };
    ScopedProgressService.prototype.onScopeActivated = function () {
        this.isActive = true;
        // Return early if progress state indicates that progress is done
        if (this.progressState.done) {
            return;
        }
        // Replay Infinite Progress from Promise
        if (this.progressState.whilePromise) {
            var delay = void 0;
            if (this.progressState.whileDelay > 0) {
                var remainingDelay = this.progressState.whileDelay - (Date.now() - this.progressState.whileStart);
                if (remainingDelay > 0) {
                    delay = remainingDelay;
                }
            }
            this.doShowWhile(delay);
        }
        // Replay Infinite Progress
        else if (this.progressState.infinite) {
            this.progressbar.infinite().show();
        }
        // Replay Finite Progress (Total & Worked)
        else {
            if (this.progressState.total) {
                this.progressbar.total(this.progressState.total).show();
            }
            if (this.progressState.worked) {
                this.progressbar.worked(this.progressState.worked).show();
            }
        }
    };
    ScopedProgressService.prototype.clearProgressState = function () {
        this.progressState.infinite = void 0;
        this.progressState.done = void 0;
        this.progressState.worked = void 0;
        this.progressState.total = void 0;
        this.progressState.whilePromise = void 0;
        this.progressState.whileStart = void 0;
        this.progressState.whileDelay = void 0;
    };
    ScopedProgressService.prototype.show = function (infiniteOrTotal, delay) {
        var _this = this;
        var infinite;
        var total;
        // Sort out Arguments
        if (typeof infiniteOrTotal === 'boolean') {
            infinite = infiniteOrTotal;
        }
        else {
            total = infiniteOrTotal;
        }
        // Reset State
        this.clearProgressState();
        // Keep in State
        this.progressState.infinite = infinite;
        this.progressState.total = total;
        // Active: Show Progress
        if (this.isActive) {
            // Infinite: Start Progressbar and Show after Delay
            if (!types.isUndefinedOrNull(infinite)) {
                this.progressbar.infinite().show(delay);
            }
            // Finite: Start Progressbar and Show after Delay
            else if (!types.isUndefinedOrNull(total)) {
                this.progressbar.total(total).show(delay);
            }
        }
        return {
            total: function (total) {
                _this.progressState.infinite = false;
                _this.progressState.total = total;
                if (_this.isActive) {
                    _this.progressbar.total(total);
                }
            },
            worked: function (worked) {
                // Verify first that we are either not active or the progressbar has a total set
                if (!_this.isActive || _this.progressbar.hasTotal()) {
                    _this.progressState.infinite = false;
                    if (_this.progressState.worked) {
                        _this.progressState.worked += worked;
                    }
                    else {
                        _this.progressState.worked = worked;
                    }
                    if (_this.isActive) {
                        _this.progressbar.worked(worked);
                    }
                }
                // Otherwise the progress bar does not support worked(), we fallback to infinite() progress
                else {
                    _this.progressState.infinite = true;
                    _this.progressState.worked = void 0;
                    _this.progressState.total = void 0;
                    _this.progressbar.infinite().show();
                }
            },
            done: function () {
                _this.progressState.infinite = false;
                _this.progressState.done = true;
                if (_this.isActive) {
                    _this.progressbar.stop().hide();
                }
            }
        };
    };
    ScopedProgressService.prototype.showWhile = function (promise, delay) {
        var _this = this;
        var stack = !!this.progressState.whilePromise;
        // Reset State
        if (!stack) {
            this.clearProgressState();
        }
        // Otherwise join with existing running promise to ensure progress is accurate
        else {
            promise = TPromise.join([promise, this.progressState.whilePromise]);
        }
        // Keep Promise in State
        this.progressState.whilePromise = promise;
        this.progressState.whileDelay = delay || 0;
        this.progressState.whileStart = Date.now();
        var stop = function () {
            // If this is not the last promise in the list of joined promises, return early
            if (!!_this.progressState.whilePromise && _this.progressState.whilePromise !== promise) {
                return;
            }
            // The while promise is either null or equal the promise we last hooked on
            _this.clearProgressState();
            if (_this.isActive) {
                _this.progressbar.stop().hide();
            }
        };
        this.doShowWhile(delay);
        return promise.then(stop, stop);
    };
    ScopedProgressService.prototype.doShowWhile = function (delay) {
        // Show Progress when active
        if (this.isActive) {
            this.progressbar.infinite().show(delay);
        }
    };
    ScopedProgressService = __decorate([
        __param(3, IViewletService),
        __param(4, IPanelService)
    ], ScopedProgressService);
    return ScopedProgressService;
}(ScopedService));
export { ScopedProgressService };
var ProgressService = /** @class */ (function () {
    function ProgressService(progressbar) {
        this.progressbar = progressbar;
    }
    ProgressService.prototype.show = function (infiniteOrTotal, delay) {
        var _this = this;
        if (typeof infiniteOrTotal === 'boolean') {
            this.progressbar.infinite().show(delay);
        }
        else {
            this.progressbar.total(infiniteOrTotal).show(delay);
        }
        return {
            total: function (total) {
                _this.progressbar.total(total);
            },
            worked: function (worked) {
                if (_this.progressbar.hasTotal()) {
                    _this.progressbar.worked(worked);
                }
                else {
                    _this.progressbar.infinite().show();
                }
            },
            done: function () {
                _this.progressbar.stop().hide();
            }
        };
    };
    ProgressService.prototype.showWhile = function (promise, delay) {
        var _this = this;
        var stop = function () {
            _this.progressbar.stop().hide();
        };
        this.progressbar.infinite().show(delay);
        return promise.then(stop, stop);
    };
    return ProgressService;
}());
export { ProgressService };
