var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter } from '../base/common/event';
import { CommandsRegistry, } from '../platform/commands/common/commands';
import { IInstantiationService } from '../platform/instantiation/common/instantiation';
import { toDisposable } from '../base/common/lifecycle';
var CodeSandboxCommandService = /** @class */ (function () {
    function CodeSandboxCommandService(_instantiationService) {
        this._instantiationService = _instantiationService;
        this._onWillExecuteCommand = new Emitter();
        this.onWillExecuteCommand = this
            ._onWillExecuteCommand.event;
        this._dynamicCommands = Object.create(null);
    }
    CodeSandboxCommandService.prototype.addCommand = function (command) {
        var _this = this;
        var id = command.id;
        this._dynamicCommands[id] = command;
        return toDisposable(function () {
            delete _this._dynamicCommands[id];
        });
    };
    CodeSandboxCommandService.prototype.executeCommand = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var command = CommandsRegistry.getCommand(id) || this._dynamicCommands[id];
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
    CodeSandboxCommandService = __decorate([
        __param(0, IInstantiationService)
    ], CodeSandboxCommandService);
    return CodeSandboxCommandService;
}());
export { CodeSandboxCommandService };
