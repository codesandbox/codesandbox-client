/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { validateConstraint } from '../../../base/common/types.js';
import * as extHostTypes from './extHostTypes.js';
import * as extHostTypeConverter from './extHostTypeConverters.js';
import { cloneAndChange } from '../../../base/common/objects.js';
import { MainContext, ObjectIdentifier } from './extHost.protocol.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { revive } from '../../../base/common/marshalling.js';
var ExtHostCommands = /** @class */ (function () {
    function ExtHostCommands(mainContext, heapService, logService) {
        this._commands = new Map();
        this._proxy = mainContext.getProxy(MainContext.MainThreadCommands);
        this._logService = logService;
        this._converter = new CommandsConverter(this, heapService);
        this._argumentProcessors = [{ processArgument: function (a) { return revive(a, 0); } }];
    }
    Object.defineProperty(ExtHostCommands.prototype, "converter", {
        get: function () {
            return this._converter;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostCommands.prototype.registerArgumentProcessor = function (processor) {
        this._argumentProcessors.push(processor);
    };
    ExtHostCommands.prototype.registerCommand = function (global, id, callback, thisArg, description) {
        var _this = this;
        this._logService.trace('ExtHostCommands#registerCommand', id);
        if (!id.trim().length) {
            throw new Error('invalid id');
        }
        if (this._commands.has(id)) {
            throw new Error("command '" + id + "' already exists");
        }
        this._commands.set(id, { callback: callback, thisArg: thisArg, description: description });
        if (global) {
            this._proxy.$registerCommand(id);
        }
        return new extHostTypes.Disposable(function () {
            if (_this._commands.delete(id)) {
                if (global) {
                    _this._proxy.$unregisterCommand(id);
                }
            }
        });
    };
    ExtHostCommands.prototype.executeCommand = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._logService.trace('ExtHostCommands#executeCommand', id);
        if (this._commands.has(id)) {
            // we stay inside the extension host and support
            // to pass any kind of parameters around
            return this._executeContributedCommand(id, args);
        }
        else {
            // automagically convert some argument types
            args = cloneAndChange(args, function (value) {
                if (value instanceof extHostTypes.Position) {
                    return extHostTypeConverter.Position.from(value);
                }
                if (value instanceof extHostTypes.Range) {
                    return extHostTypeConverter.Range.from(value);
                }
                if (value instanceof extHostTypes.Location) {
                    return extHostTypeConverter.location.from(value);
                }
                if (!Array.isArray(value)) {
                    return value;
                }
            });
            return this._proxy.$executeCommand(id, args).then(function (result) { return revive(result, 0); });
        }
    };
    ExtHostCommands.prototype._executeContributedCommand = function (id, args) {
        var _a = this._commands.get(id), callback = _a.callback, thisArg = _a.thisArg, description = _a.description;
        if (description) {
            for (var i = 0; i < description.args.length; i++) {
                try {
                    validateConstraint(args[i], description.args[i].constraint);
                }
                catch (err) {
                    return Promise.reject(new Error("Running the contributed command:'" + id + "' failed. Illegal argument '" + description.args[i].name + "' - " + description.args[i].description));
                }
            }
        }
        try {
            var result = callback.apply(thisArg, args);
            return Promise.resolve(result);
        }
        catch (err) {
            this._logService.error(err, id);
            return Promise.reject(new Error("Running the contributed command:'" + id + "' failed."));
        }
    };
    ExtHostCommands.prototype.$executeContributedCommand = function (id) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._logService.trace('ExtHostCommands#$executeContributedCommand', id);
        if (!this._commands.has(id)) {
            return Promise.reject(new Error("Contributed command '" + id + "' does not exist."));
        }
        else {
            args = args.map(function (arg) { return _this._argumentProcessors.reduce(function (r, p) { return p.processArgument(r); }, arg); });
            return this._executeContributedCommand(id, args);
        }
    };
    ExtHostCommands.prototype.getCommands = function (filterUnderscoreCommands) {
        if (filterUnderscoreCommands === void 0) { filterUnderscoreCommands = false; }
        this._logService.trace('ExtHostCommands#getCommands', filterUnderscoreCommands);
        return this._proxy.$getCommands().then(function (result) {
            if (filterUnderscoreCommands) {
                result = result.filter(function (command) { return command[0] !== '_'; });
            }
            return result;
        });
    };
    ExtHostCommands.prototype.$getContributedCommandHandlerDescriptions = function () {
        var result = Object.create(null);
        this._commands.forEach(function (command, id) {
            var description = command.description;
            if (description) {
                result[id] = description;
            }
        });
        return Promise.resolve(result);
    };
    return ExtHostCommands;
}());
export { ExtHostCommands };
var CommandsConverter = /** @class */ (function () {
    // --- conversion between internal and api commands
    function CommandsConverter(commands, heap) {
        this._delegatingCommandId = "_internal_command_delegation_" + Date.now();
        this._commands = commands;
        this._heap = heap;
        this._commands.registerCommand(true, this._delegatingCommandId, this._executeConvertedCommand, this);
    }
    CommandsConverter.prototype.toInternal = function (command) {
        if (!command) {
            return undefined;
        }
        var result = {
            id: command.command,
            title: command.title
        };
        if (command.command && !isFalsyOrEmpty(command.arguments)) {
            // we have a contributed command with arguments. that
            // means we don't want to send the arguments around
            var id = this._heap.keep(command);
            ObjectIdentifier.mixin(result, id);
            result.id = this._delegatingCommandId;
            result.arguments = [id];
        }
        if (command.tooltip) {
            result.tooltip = command.tooltip;
        }
        return result;
    };
    CommandsConverter.prototype.fromInternal = function (command) {
        if (!command) {
            return undefined;
        }
        var id = ObjectIdentifier.of(command);
        if (typeof id === 'number') {
            return this._heap.get(id);
        }
        else {
            return {
                command: command.id,
                title: command.title,
                arguments: command.arguments
            };
        }
    };
    CommandsConverter.prototype._executeConvertedCommand = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        var actualCmd = this._heap.get(args[0]);
        return (_a = this._commands).executeCommand.apply(_a, [actualCmd.command].concat(actualCmd.arguments));
    };
    return CommandsConverter;
}());
export { CommandsConverter };
