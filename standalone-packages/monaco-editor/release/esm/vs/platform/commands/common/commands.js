/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from '../../../base/common/winjs.base.js';
import { validateConstraints } from '../../../base/common/types.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { LinkedList } from '../../../base/common/linkedList.js';
export var ICommandService = createDecorator('commandService');
export var CommandsRegistry = new /** @class */ (function () {
    function class_1() {
        this._commands = new Map();
    }
    class_1.prototype.registerCommand = function (idOrCommand, handler) {
        var _this = this;
        if (!idOrCommand) {
            throw new Error("invalid command");
        }
        if (typeof idOrCommand === 'string') {
            if (!handler) {
                throw new Error("invalid command");
            }
            return this.registerCommand({ id: idOrCommand, handler: handler });
        }
        // add argument validation if rich command metadata is provided
        if (idOrCommand.description) {
            var constraints_1 = [];
            for (var _i = 0, _a = idOrCommand.description.args; _i < _a.length; _i++) {
                var arg = _a[_i];
                constraints_1.push(arg.constraint);
            }
            var actualHandler_1 = idOrCommand.handler;
            idOrCommand.handler = function (accessor) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                validateConstraints(args, constraints_1);
                return actualHandler_1.apply(void 0, [accessor].concat(args));
            };
        }
        // find a place to store the command
        var id = idOrCommand.id;
        var commands = this._commands.get(id);
        if (!commands) {
            commands = new LinkedList();
            this._commands.set(id, commands);
        }
        var removeFn = commands.unshift(idOrCommand);
        return {
            dispose: function () {
                removeFn();
                if (_this._commands.get(id).isEmpty()) {
                    _this._commands.delete(id);
                }
            }
        };
    };
    class_1.prototype.getCommand = function (id) {
        var list = this._commands.get(id);
        if (!list || list.isEmpty()) {
            return undefined;
        }
        return list.iterator().next().value;
    };
    class_1.prototype.getCommands = function () {
        var _this = this;
        var result = Object.create(null);
        this._commands.forEach(function (value, key) {
            result[key] = _this.getCommand(key);
        });
        return result;
    };
    return class_1;
}());
export var NullCommandService = {
    _serviceBrand: undefined,
    onWillExecuteCommand: function () { return ({ dispose: function () { } }); },
    executeCommand: function () {
        return TPromise.as(undefined);
    }
};
