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
import { IContextKeyService, } from '../platform/contextkey/common/contextkey';
import { ICommandService, } from '../platform/commands/common/commands';
import { ITelemetryService } from '../platform/telemetry/common/telemetry';
import { INotificationService } from '../platform/notification/common/notification';
import { AbstractKeybindingService } from '../platform/keybinding/common/abstractKeybindingService';
import { KeybindingResolver } from '../platform/keybinding/common/keybindingResolver';
import { KeybindingsRegistry, } from '../platform/keybinding/common/keybindingsRegistry';
import { StandardKeyboardEvent, } from '../base/browser/keyboardEvent';
import { createKeybinding, } from '../base/common/keyCodes';
import { OS } from '../base/common/platform';
import { toDisposable, combinedDisposable, } from '../base/common/lifecycle';
import { ResolvedKeybindingItem } from '../platform/keybinding/common/resolvedKeybindingItem';
import { USLayoutResolvedKeybinding } from '../platform/keybinding/common/usLayoutResolvedKeybinding';
import * as dom from '../base/browser/dom';
import { CodeSandboxCommandService } from './commandService';
import { ConfigWatcher } from '../base/node/config';
import { IEnvironmentService } from '../platform/environment/common/environment';
import { onUnexpectedError } from '../base/common/errors';
import { KeybindingIO, OutputBuilder, } from '../workbench/services/keybinding/common/keybindingIO';
import { MacLinuxFallbackKeyboardMapper } from '../workbench/services/keybinding/common/macLinuxFallbackKeyboardMapper';
import { KeybindingParser } from '../base/common/keybindingParser';
var CodeSandboxKeybindingService = /** @class */ (function (_super) {
    __extends(CodeSandboxKeybindingService, _super);
    function CodeSandboxKeybindingService(window, environmentService, contextKeyService, commandService, telemetryService, notificationService) {
        var _this = _super.call(this, contextKeyService, commandService, telemetryService, notificationService) || this;
        _this._firstTimeComputingResolver = true;
        _this._cachedResolver = null;
        _this._dynamicKeybindings = [];
        _this._register(dom.addDisposableListener(window, dom.EventType.KEY_DOWN, function (e) {
            var keyEvent = new StandardKeyboardEvent(e);
            var shouldPreventDefault = _this._dispatch(keyEvent, keyEvent.target);
            if (shouldPreventDefault) {
                keyEvent.preventDefault();
            }
        }));
        _this.userKeybindings = _this._register(new ConfigWatcher(environmentService.appKeybindingsPath, {
            defaultConfig: [],
            onError: function (error) { return onUnexpectedError(error); },
        }));
        _this._keyboardMapper = new MacLinuxFallbackKeyboardMapper(OS);
        _this._register(_this.userKeybindings.onDidUpdateConfiguration(function (event) {
            return _this.updateResolver({
                source: 2 /* User */,
                keybindings: event.config,
            });
        }));
        return _this;
    }
    CodeSandboxKeybindingService.prototype.addDynamicKeybinding = function (commandId, keybinding, handler, when) {
        var _this = this;
        var toDispose = [];
        this._dynamicKeybindings.push({
            keybinding: createKeybinding(keybinding, OS),
            command: commandId,
            when: when,
            weight1: 1000,
            weight2: 0,
        });
        toDispose.push(toDisposable(function () {
            for (var i = 0; i < _this._dynamicKeybindings.length; i++) {
                var kb = _this._dynamicKeybindings[i];
                if (kb.command === commandId) {
                    _this._dynamicKeybindings.splice(i, 1);
                    _this.updateResolver({ source: 1 /* Default */ });
                    return;
                }
            }
        }));
        var commandService = this._commandService;
        if (commandService instanceof CodeSandboxCommandService) {
            toDispose.push(commandService.addCommand({
                id: commandId,
                handler: handler,
            }));
        }
        else {
            throw new Error('Unknown command service!');
        }
        this.updateResolver({ source: 1 /* Default */ });
        return combinedDisposable(toDispose);
    };
    CodeSandboxKeybindingService.prototype.updateResolver = function (event) {
        this._cachedResolver = null;
        this._onDidUpdateKeybindings.fire(event);
    };
    CodeSandboxKeybindingService.prototype._getResolver = function () {
        if (!this._cachedResolver) {
            var defaults = this._resolveKeybindingItems(KeybindingsRegistry.getDefaultKeybindings(), true);
            var overrides = this._resolveUserKeybindingItems(this._getExtraKeybindings(this._firstTimeComputingResolver), false);
            this._cachedResolver = new KeybindingResolver(defaults, overrides);
            this._firstTimeComputingResolver = false;
        }
        return this._cachedResolver;
    };
    CodeSandboxKeybindingService.prototype._safeGetConfig = function () {
        var rawConfig = this.userKeybindings.getConfig();
        if (Array.isArray(rawConfig)) {
            return rawConfig;
        }
        return [];
    };
    CodeSandboxKeybindingService.prototype._getExtraKeybindings = function (isFirstTime) {
        var extraUserKeybindings = this._safeGetConfig();
        if (!isFirstTime) {
            var cnt = extraUserKeybindings.length;
            /* __GDPR__
                      "customKeybindingsChanged" : {
                          "keyCount" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
                      }
                  */
            this._telemetryService.publicLog('customKeybindingsChanged', {
                keyCount: cnt,
            });
        }
        return extraUserKeybindings.map(function (k) {
            return KeybindingIO.readUserKeybindingItem(k, OS);
        });
    };
    CodeSandboxKeybindingService.prototype._resolveKeybindingItems = function (items, isDefault) {
        var result = [], resultLen = 0;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var when = item.when ? item.when.normalize() : null;
            var keybinding = item.keybinding;
            if (!keybinding) {
                // This might be a removal keybinding item in user settings => accept it
                result[resultLen++] = new ResolvedKeybindingItem(null, item.command, item.commandArgs, when, isDefault);
            }
            else {
                var resolvedKeybindings = this.resolveKeybinding(keybinding);
                for (var j = 0; j < resolvedKeybindings.length; j++) {
                    result[resultLen++] = new ResolvedKeybindingItem(resolvedKeybindings[j], item.command, item.commandArgs, when, isDefault);
                }
            }
        }
        return result;
    };
    CodeSandboxKeybindingService.prototype._resolveUserKeybindingItems = function (items, isDefault) {
        var result = [], resultLen = 0;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var when = item.when ? item.when.normalize() : null;
            var firstPart = item.firstPart;
            var chordPart = item.chordPart;
            if (!firstPart) {
                // This might be a removal keybinding item in user settings => accept it
                result[resultLen++] = new ResolvedKeybindingItem(null, item.command, item.commandArgs, when, isDefault);
            }
            else {
                var resolvedKeybindings = this._keyboardMapper.resolveUserBinding(firstPart, chordPart);
                for (var j = 0; j < resolvedKeybindings.length; j++) {
                    result[resultLen++] = new ResolvedKeybindingItem(resolvedKeybindings[j], item.command, item.commandArgs, when, isDefault);
                }
            }
        }
        return result;
    };
    CodeSandboxKeybindingService._getDefaultKeybindings = function (defaultKeybindings) {
        var out = new OutputBuilder();
        out.writeLine('[');
        var lastIndex = defaultKeybindings.length - 1;
        defaultKeybindings.forEach(function (k, index) {
            KeybindingIO.writeKeybindingItem(out, k, OS);
            if (index !== lastIndex) {
                out.writeLine(',');
            }
            else {
                out.writeLine();
            }
        });
        out.writeLine(']');
        return out.toString();
    };
    CodeSandboxKeybindingService._getAllCommandsAsComment = function (boundCommands) {
        var unboundCommands = KeybindingResolver.getAllUnboundCommands(boundCommands);
        var pretty = unboundCommands.sort().join('\n// - ');
        return '// ' + 'Here are other available commands: ' + '\n// - ' + pretty;
    };
    CodeSandboxKeybindingService.prototype.getDefaultKeybindingsContent = function () {
        var resolver = this._getResolver();
        var defaultKeybindings = resolver.getDefaultKeybindings();
        var boundCommands = resolver.getDefaultBoundCommands();
        return (CodeSandboxKeybindingService._getDefaultKeybindings(defaultKeybindings) +
            '\n\n' +
            CodeSandboxKeybindingService._getAllCommandsAsComment(boundCommands));
    };
    CodeSandboxKeybindingService.prototype._documentHasFocus = function () {
        return document.hasFocus();
    };
    CodeSandboxKeybindingService.prototype._toNormalizedKeybindingItems = function (items, isDefault) {
        var result = [], resultLen = 0;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var when = item.when ? item.when.normalize() : null;
            var keybinding = item.keybinding;
            if (!keybinding) {
                // This might be a removal keybinding item in user settings => accept it
                result[resultLen++] = new ResolvedKeybindingItem(null, item.command, item.commandArgs, when, isDefault);
            }
            else {
                var resolvedKeybindings = [
                    new USLayoutResolvedKeybinding(keybinding, OS),
                ];
                for (var j = 0; j < resolvedKeybindings.length; j++) {
                    result[resultLen++] = new ResolvedKeybindingItem(resolvedKeybindings[j], item.command, item.commandArgs, when, isDefault);
                }
            }
        }
        return result;
    };
    CodeSandboxKeybindingService.prototype.resolveKeybinding = function (keybinding) {
        return this._keyboardMapper.resolveKeybinding(keybinding);
    };
    CodeSandboxKeybindingService.prototype.resolveKeyboardEvent = function (keyboardEvent) {
        return this._keyboardMapper.resolveKeyboardEvent(keyboardEvent);
    };
    CodeSandboxKeybindingService.prototype.resolveUserBinding = function (userBinding) {
        var _a = KeybindingParser.parseUserBinding(userBinding), firstPart = _a[0], chordPart = _a[1];
        return this._keyboardMapper.resolveUserBinding(firstPart, chordPart);
    };
    CodeSandboxKeybindingService = __decorate([
        __param(1, IEnvironmentService),
        __param(2, IContextKeyService),
        __param(3, ICommandService),
        __param(4, ITelemetryService),
        __param(5, INotificationService)
    ], CodeSandboxKeybindingService);
    return CodeSandboxKeybindingService;
}(AbstractKeybindingService));
export { CodeSandboxKeybindingService };
