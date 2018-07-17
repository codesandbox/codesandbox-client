/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { createDecorator as createServiceDecorator } from '../../instantiation/common/instantiation';
import { Disposable } from '../../../base/common/lifecycle';
import { isWindows } from '../../../base/common/platform';
import { Emitter } from '../../../base/common/event';
export var ILogService = createServiceDecorator('logService');
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Critical"] = 5] = "Critical";
    LogLevel[LogLevel["Off"] = 6] = "Off";
})(LogLevel || (LogLevel = {}));
export var DEFAULT_LOG_LEVEL = LogLevel.Info;
var AbstractLogService = /** @class */ (function (_super) {
    __extends(AbstractLogService, _super);
    function AbstractLogService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = DEFAULT_LOG_LEVEL;
        _this._onDidChangeLogLevel = _this._register(new Emitter());
        _this.onDidChangeLogLevel = _this._onDidChangeLogLevel.event;
        return _this;
    }
    AbstractLogService.prototype.setLevel = function (level) {
        if (this.level !== level) {
            this.level = level;
            this._onDidChangeLogLevel.fire(this.level);
        }
    };
    AbstractLogService.prototype.getLevel = function () {
        return this.level;
    };
    return AbstractLogService;
}(Disposable));
export { AbstractLogService };
var ConsoleLogMainService = /** @class */ (function (_super) {
    __extends(ConsoleLogMainService, _super);
    function ConsoleLogMainService(logLevel) {
        if (logLevel === void 0) { logLevel = DEFAULT_LOG_LEVEL; }
        var _this = _super.call(this) || this;
        _this.setLevel(logLevel);
        _this.useColors = !isWindows;
        return _this;
    }
    ConsoleLogMainService.prototype.trace = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Trace) {
            if (this.useColors) {
                console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
            }
            else {
                console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
            }
        }
    };
    ConsoleLogMainService.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Debug) {
            if (this.useColors) {
                console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
            }
            else {
                console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
            }
        }
    };
    ConsoleLogMainService.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Info) {
            if (this.useColors) {
                console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
            }
            else {
                console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
            }
        }
    };
    ConsoleLogMainService.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Warning) {
            if (this.useColors) {
                console.warn.apply(console, ["\u001B[93m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
            }
            else {
                console.warn.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
            }
        }
    };
    ConsoleLogMainService.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Error) {
            if (this.useColors) {
                console.error.apply(console, ["\u001B[91m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
            }
            else {
                console.error.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
            }
        }
    };
    ConsoleLogMainService.prototype.critical = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Critical) {
            if (this.useColors) {
                console.error.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
            }
            else {
                console.error.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
            }
        }
    };
    ConsoleLogMainService.prototype.dispose = function () {
        // noop
    };
    return ConsoleLogMainService;
}(AbstractLogService));
export { ConsoleLogMainService };
var ConsoleLogService = /** @class */ (function (_super) {
    __extends(ConsoleLogService, _super);
    function ConsoleLogService(logLevel) {
        if (logLevel === void 0) { logLevel = DEFAULT_LOG_LEVEL; }
        var _this = _super.call(this) || this;
        _this.setLevel(logLevel);
        return _this;
    }
    ConsoleLogService.prototype.trace = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Trace) {
            console.log.apply(console, ['%cTRACE', 'color: #888', message].concat(args));
        }
    };
    ConsoleLogService.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Debug) {
            console.log.apply(console, ['%cDEBUG', 'background: #eee; color: #888', message].concat(args));
        }
    };
    ConsoleLogService.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Info) {
            console.log.apply(console, ['%c INFO', 'color: #33f', message].concat(args));
        }
    };
    ConsoleLogService.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Warning) {
            console.log.apply(console, ['%c WARN', 'color: #993', message].concat(args));
        }
    };
    ConsoleLogService.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Error) {
            console.log.apply(console, ['%c  ERR', 'color: #f33', message].concat(args));
        }
    };
    ConsoleLogService.prototype.critical = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.getLevel() <= LogLevel.Critical) {
            console.log.apply(console, ['%cCRITI', 'background: #f33; color: white', message].concat(args));
        }
    };
    ConsoleLogService.prototype.dispose = function () { };
    return ConsoleLogService;
}(AbstractLogService));
export { ConsoleLogService };
var MultiplexLogService = /** @class */ (function (_super) {
    __extends(MultiplexLogService, _super);
    function MultiplexLogService(logServices) {
        var _this = _super.call(this) || this;
        _this.logServices = logServices;
        if (logServices.length) {
            _this.setLevel(logServices[0].getLevel());
        }
        return _this;
    }
    MultiplexLogService.prototype.setLevel = function (level) {
        for (var _i = 0, _a = this.logServices; _i < _a.length; _i++) {
            var logService = _a[_i];
            logService.setLevel(level);
        }
        _super.prototype.setLevel.call(this, level);
    };
    MultiplexLogService.prototype.trace = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
            var logService = _b[_a];
            logService.trace.apply(logService, [message].concat(args));
        }
    };
    MultiplexLogService.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
            var logService = _b[_a];
            logService.debug.apply(logService, [message].concat(args));
        }
    };
    MultiplexLogService.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
            var logService = _b[_a];
            logService.info.apply(logService, [message].concat(args));
        }
    };
    MultiplexLogService.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
            var logService = _b[_a];
            logService.warn.apply(logService, [message].concat(args));
        }
    };
    MultiplexLogService.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
            var logService = _b[_a];
            logService.error.apply(logService, [message].concat(args));
        }
    };
    MultiplexLogService.prototype.critical = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
            var logService = _b[_a];
            logService.critical.apply(logService, [message].concat(args));
        }
    };
    MultiplexLogService.prototype.dispose = function () {
        for (var _i = 0, _a = this.logServices; _i < _a.length; _i++) {
            var logService = _a[_i];
            logService.dispose();
        }
    };
    return MultiplexLogService;
}(AbstractLogService));
export { MultiplexLogService };
var DelegatedLogService = /** @class */ (function (_super) {
    __extends(DelegatedLogService, _super);
    function DelegatedLogService(logService) {
        var _this = _super.call(this) || this;
        _this.logService = logService;
        _this._register(logService);
        return _this;
    }
    Object.defineProperty(DelegatedLogService.prototype, "onDidChangeLogLevel", {
        get: function () {
            return this.logService.onDidChangeLogLevel;
        },
        enumerable: true,
        configurable: true
    });
    DelegatedLogService.prototype.setLevel = function (level) {
        this.logService.setLevel(level);
    };
    DelegatedLogService.prototype.getLevel = function () {
        return this.logService.getLevel();
    };
    DelegatedLogService.prototype.trace = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.logService).trace.apply(_a, [message].concat(args));
    };
    DelegatedLogService.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.logService).debug.apply(_a, [message].concat(args));
    };
    DelegatedLogService.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.logService).info.apply(_a, [message].concat(args));
    };
    DelegatedLogService.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.logService).warn.apply(_a, [message].concat(args));
    };
    DelegatedLogService.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.logService).error.apply(_a, [message].concat(args));
    };
    DelegatedLogService.prototype.critical = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        (_a = this.logService).critical.apply(_a, [message].concat(args));
    };
    return DelegatedLogService;
}(Disposable));
export { DelegatedLogService };
var NullLogService = /** @class */ (function () {
    function NullLogService() {
        this.onDidChangeLogLevel = new Emitter().event;
    }
    NullLogService.prototype.setLevel = function (level) { };
    NullLogService.prototype.getLevel = function () { return LogLevel.Info; };
    NullLogService.prototype.trace = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    NullLogService.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    NullLogService.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    NullLogService.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    NullLogService.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    NullLogService.prototype.critical = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    NullLogService.prototype.dispose = function () { };
    return NullLogService;
}());
export { NullLogService };
export function getLogLevel(environmentService) {
    if (environmentService.verbose) {
        return LogLevel.Trace;
    }
    if (typeof environmentService.args.log === 'string') {
        var logLevel = environmentService.args.log.toLowerCase();
        switch (logLevel) {
            case 'trace':
                return LogLevel.Trace;
            case 'debug':
                return LogLevel.Debug;
            case 'info':
                return LogLevel.Info;
            case 'warn':
                return LogLevel.Warning;
            case 'error':
                return LogLevel.Error;
            case 'critical':
                return LogLevel.Critical;
            case 'off':
                return LogLevel.Off;
        }
    }
    return DEFAULT_LOG_LEVEL;
}
