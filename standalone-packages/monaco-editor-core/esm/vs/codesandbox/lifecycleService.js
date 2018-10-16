/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { LifecyclePhaseToString, } from '../platform/lifecycle/common/lifecycle';
import { IStorageService, } from '../platform/storage/common/storage';
import { Emitter } from '../base/common/event';
import { mark } from '../base/common/performance';
import { Barrier } from '../base/common/async';
import { ILogService } from '../platform/log/common/log';
var CodeSandboxLifecycleService = /** @class */ (function () {
    function CodeSandboxLifecycleService(_storageService, _logService) {
        this._storageService = _storageService;
        this._logService = _logService;
        this._onWillShutdown = new Emitter();
        this._onShutdown = new Emitter();
        this._phase = 1 /* Starting */;
        this._phaseWhen = new Map();
        var lastShutdownReason = this._storageService.getInteger(CodeSandboxLifecycleService._lastShutdownReasonKey, 1 /* WORKSPACE */);
        this._storageService.remove(CodeSandboxLifecycleService._lastShutdownReasonKey, 1 /* WORKSPACE */);
        if (lastShutdownReason === 3 /* RELOAD */) {
            this._startupKind = 3 /* ReloadedWindow */;
        }
        else if (lastShutdownReason === 4 /* LOAD */) {
            this._startupKind = 4 /* ReopenedWindow */;
        }
        else {
            this._startupKind = 1 /* NewWindow */;
        }
        this._logService.trace("lifecycle: starting up (startup kind: " + this._startupKind + ")");
        this._registerListeners();
    }
    CodeSandboxLifecycleService.prototype._registerListeners = function () {
        // const windowId = this._windowService.getCurrentWindowId();
        // // Main side indicates that window is about to unload, check for vetos
        // ipc.on('vscode:onBeforeUnload', (event, reply: { okChannel: string, cancelChannel: string, reason: ShutdownReason }) => {
        // 	this._logService.trace(`lifecycle: onBeforeUnload (reason: ${reply.reason})`);
        // 	// store shutdown reason to retrieve next startup
        // 	this._storageService.store(CodeSandboxLifecycleService._lastShutdownReasonKey, JSON.stringify(reply.reason), StorageScope.WORKSPACE);
        // 	// trigger onWillShutdown events and veto collecting
        // 	this.onBeforeUnload(reply.reason).then(veto => {
        // 		if (veto) {
        // 			this._logService.trace('lifecycle: onBeforeUnload prevented via veto');
        // 			this._storageService.remove(CodeSandboxLifecycleService._lastShutdownReasonKey, StorageScope.WORKSPACE);
        // 			ipc.send(reply.cancelChannel, windowId);
        // 		} else {
        // 			this._logService.trace('lifecycle: onBeforeUnload continues without veto');
        // 			ipc.send(reply.okChannel, windowId);
        // 		}
        // 	});
        // });
        // // Main side indicates that we will indeed shutdown
        // ipc.on('vscode:onWillUnload', (event, reply: { replyChannel: string, reason: ShutdownReason }) => {
        // 	this._logService.trace(`lifecycle: onWillUnload (reason: ${reply.reason})`);
        // 	this._onShutdown.fire(reply.reason);
        // 	ipc.send(reply.replyChannel, windowId);
        // });
    };
    Object.defineProperty(CodeSandboxLifecycleService.prototype, "phase", {
        // private onBeforeUnload(reason: ShutdownReason): TPromise<boolean> {
        // 	const vetos: (boolean | Thenable<boolean>)[] = [];
        // 	this._onWillShutdown.fire({
        // 		veto(value) {
        // 			vetos.push(value);
        // 		},
        // 		reason
        // 	});
        // 	return handleVetos(vetos, err => this._notificationService.error(toErrorMessage(err)));
        // }
        get: function () {
            return this._phase;
        },
        set: function (value) {
            if (value < this.phase) {
                throw new Error('Lifecycle cannot go backwards');
            }
            if (this._phase === value) {
                return;
            }
            this._logService.trace("lifecycle: phase changed (value: " + value + ")");
            this._phase = value;
            mark("LifecyclePhase/" + LifecyclePhaseToString(value));
            if (this._phaseWhen.has(this._phase)) {
                this._phaseWhen.get(this._phase).open();
                this._phaseWhen.delete(this._phase);
            }
        },
        enumerable: true,
        configurable: true
    });
    CodeSandboxLifecycleService.prototype.when = function (phase) {
        if (phase <= this._phase) {
            return Promise.resolve();
        }
        var barrier = this._phaseWhen.get(phase);
        if (!barrier) {
            barrier = new Barrier();
            this._phaseWhen.set(phase, barrier);
        }
        return barrier.wait();
    };
    Object.defineProperty(CodeSandboxLifecycleService.prototype, "startupKind", {
        get: function () {
            return this._startupKind;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeSandboxLifecycleService.prototype, "onWillShutdown", {
        get: function () {
            return this._onWillShutdown.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeSandboxLifecycleService.prototype, "onShutdown", {
        get: function () {
            return this._onShutdown.event;
        },
        enumerable: true,
        configurable: true
    });
    CodeSandboxLifecycleService._lastShutdownReasonKey = 'lifecyle.lastShutdownReason';
    CodeSandboxLifecycleService = __decorate([
        __param(0, IStorageService),
        __param(1, ILogService)
    ], CodeSandboxLifecycleService);
    return CodeSandboxLifecycleService;
}());
export { CodeSandboxLifecycleService };
