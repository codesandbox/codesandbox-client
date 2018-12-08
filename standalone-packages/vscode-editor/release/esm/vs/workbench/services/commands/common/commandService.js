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
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { Emitter, filterEvent, toPromise } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
var CommandService = /** @class */ (function (_super) {
    __extends(CommandService, _super);
    function CommandService(_instantiationService, _extensionService, _logService) {
        var _this = _super.call(this) || this;
        _this._instantiationService = _instantiationService;
        _this._extensionService = _extensionService;
        _this._logService = _logService;
        _this._extensionHostIsReady = false;
        _this._onWillExecuteCommand = _this._register(new Emitter());
        _this.onWillExecuteCommand = _this._onWillExecuteCommand.event;
        _this._extensionService.whenInstalledExtensionsRegistered().then(function (value) { return _this._extensionHostIsReady = value; });
        return _this;
    }
    CommandService.prototype.executeCommand = function (id) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._logService.trace('CommandService#executeCommand', id);
        // we always send an activation event, but
        // we don't wait for it when the extension
        // host didn't yet start and the command is already registered
        var activation = this._extensionService.activateByEvent("onCommand:" + id);
        var commandIsRegistered = !!CommandsRegistry.getCommand(id);
        if (!this._extensionHostIsReady && commandIsRegistered) {
            return this._tryExecuteCommand(id, args);
        }
        else {
            var waitFor = activation;
            if (!commandIsRegistered) {
                waitFor = Promise.race([
                    // race activation events against command registration
                    Promise.all([activation, this._extensionService.activateByEvent("*")]),
                    toPromise(filterEvent(CommandsRegistry.onDidRegisterCommand, function (e) { return e === id; })),
                ]);
            }
            return waitFor.then(function (_) { return _this._tryExecuteCommand(id, args); });
        }
    };
    CommandService.prototype._tryExecuteCommand = function (id, args) {
        var command = CommandsRegistry.getCommand(id);
        if (!command) {
            return Promise.reject(new Error("command '" + id + "' not found"));
        }
        try {
            this._onWillExecuteCommand.fire({ commandId: id });
            var result = this._instantiationService.invokeFunction.apply(this._instantiationService, [command.handler].concat(args));
            return Promise.resolve(result);
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    CommandService = __decorate([
        __param(0, IInstantiationService),
        __param(1, IExtensionService),
        __param(2, ILogService)
    ], CommandService);
    return CommandService;
}(Disposable));
export { CommandService };
