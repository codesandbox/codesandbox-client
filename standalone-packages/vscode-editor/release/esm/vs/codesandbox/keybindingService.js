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
import * as nls from '../nls.js';
import { IContextKeyService, ContextKeyExpr, } from '../platform/contextkey/common/contextkey.js';
import { ExtensionsRegistry } from '../workbench/services/extensions/common/extensionsRegistry.js';
import { ICommandService, } from '../platform/commands/common/commands.js';
import { ITelemetryService } from '../platform/telemetry/common/telemetry.js';
import { INotificationService } from '../platform/notification/common/notification.js';
import { AbstractKeybindingService } from '../platform/keybinding/common/abstractKeybindingService.js';
import { KeybindingResolver } from '../platform/keybinding/common/keybindingResolver.js';
import { KeybindingsRegistry, } from '../platform/keybinding/common/keybindingsRegistry.js';
import { StandardKeyboardEvent, } from '../base/browser/keyboardEvent.js';
import { createKeybinding, } from '../base/common/keyCodes.js';
import { OS } from '../base/common/platform.js';
import { toDisposable, combinedDisposable, } from '../base/common/lifecycle.js';
import { ResolvedKeybindingItem } from '../platform/keybinding/common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../platform/keybinding/common/usLayoutResolvedKeybinding.js';
import * as dom from '../base/browser/dom.js';
import { CodeSandboxCommandService } from './commandService.js';
import { ConfigWatcher } from '../base/node/config.js';
import { IEnvironmentService } from '../platform/environment/common/environment.js';
import { onUnexpectedError } from '../base/common/errors.js';
import { KeybindingIO, OutputBuilder, } from '../workbench/services/keybinding/common/keybindingIO.js';
import { MacLinuxFallbackKeyboardMapper } from '../workbench/services/keybinding/common/macLinuxFallbackKeyboardMapper.js';
import { KeybindingParser } from '../base/common/keybindingParser.js';
function isContributedKeyBindingsArray(thing) {
    return Array.isArray(thing);
}
function isValidContributedKeyBinding(keyBinding, rejects) {
    if (!keyBinding) {
        rejects.push(nls.localize('nonempty', "expected non-empty value."));
        return false;
    }
    if (typeof keyBinding.command !== 'string') {
        rejects.push(nls.localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
        return false;
    }
    if (keyBinding.key && typeof keyBinding.key !== 'string') {
        rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'key'));
        return false;
    }
    if (keyBinding.when && typeof keyBinding.when !== 'string') {
        rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
        return false;
    }
    if (keyBinding.mac && typeof keyBinding.mac !== 'string') {
        rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'mac'));
        return false;
    }
    if (keyBinding.linux && typeof keyBinding.linux !== 'string') {
        rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'linux'));
        return false;
    }
    if (keyBinding.win && typeof keyBinding.win !== 'string') {
        rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'win'));
        return false;
    }
    return true;
}
var keybindingType = {
    type: 'object',
    default: { command: '', key: '' },
    properties: {
        command: {
            description: nls.localize('vscode.extension.contributes.keybindings.command', 'Identifier of the command to run when keybinding is triggered.'),
            type: 'string'
        },
        key: {
            description: nls.localize('vscode.extension.contributes.keybindings.key', 'Key or key sequence (separate keys with plus-sign and sequences with space, e.g Ctrl+O and Ctrl+L L for a chord).'),
            type: 'string'
        },
        mac: {
            description: nls.localize('vscode.extension.contributes.keybindings.mac', 'Mac specific key or key sequence.'),
            type: 'string'
        },
        linux: {
            description: nls.localize('vscode.extension.contributes.keybindings.linux', 'Linux specific key or key sequence.'),
            type: 'string'
        },
        win: {
            description: nls.localize('vscode.extension.contributes.keybindings.win', 'Windows specific key or key sequence.'),
            type: 'string'
        },
        when: {
            description: nls.localize('vscode.extension.contributes.keybindings.when', 'Condition when the key is active.'),
            type: 'string'
        }
    }
};
var keybindingsExtPoint = ExtensionsRegistry.registerExtensionPoint('keybindings', [], {
    description: nls.localize('vscode.extension.contributes.keybindings', "Contributes keybindings."),
    oneOf: [
        keybindingType,
        {
            type: 'array',
            items: keybindingType
        }
    ]
});
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
        keybindingsExtPoint.setHandler(function (extensions) {
            var commandAdded = false;
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                commandAdded = _this._handleKeybindingsExtensionPointUser(extension.description.isBuiltin, extension.value, extension.collector) || commandAdded;
            }
            if (commandAdded) {
                _this.updateResolver({ source: 1 /* Default */ });
            }
        });
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
    CodeSandboxKeybindingService.prototype._handleKeybindingsExtensionPointUser = function (isBuiltin, keybindings, collector) {
        if (isContributedKeyBindingsArray(keybindings)) {
            var commandAdded = false;
            for (var i = 0, len = keybindings.length; i < len; i++) {
                commandAdded = this._handleKeybinding(isBuiltin, i + 1, keybindings[i], collector) || commandAdded;
            }
            return commandAdded;
        }
        else {
            return this._handleKeybinding(isBuiltin, 1, keybindings, collector);
        }
    };
    CodeSandboxKeybindingService.prototype._handleKeybinding = function (isBuiltin, idx, keybindings, collector) {
        var rejects = [];
        var commandAdded = false;
        if (isValidContributedKeyBinding(keybindings, rejects)) {
            var rule = this._asCommandRule(isBuiltin, idx++, keybindings);
            if (rule) {
                KeybindingsRegistry.registerKeybindingRule2(rule, 1 /* Extension */);
                commandAdded = true;
            }
        }
        if (rejects.length > 0) {
            collector.error(nls.localize('invalid.keybindings', "Invalid `contributes.{0}`: {1}", keybindingsExtPoint.name, rejects.join('\n')));
        }
        return commandAdded;
    };
    CodeSandboxKeybindingService.prototype._asCommandRule = function (isBuiltin, idx, binding) {
        var command = binding.command, when = binding.when, key = binding.key, mac = binding.mac, linux = binding.linux, win = binding.win;
        var weight;
        if (isBuiltin) {
            weight = 300 /* BuiltinExtension */ + idx;
        }
        else {
            weight = 400 /* ExternalExtension */ + idx;
        }
        var desc = {
            id: command,
            when: ContextKeyExpr.deserialize(when),
            weight: weight,
            primary: KeybindingParser.parseKeybinding(key, OS),
            mac: mac && { primary: KeybindingParser.parseKeybinding(mac, OS) },
            linux: linux && { primary: KeybindingParser.parseKeybinding(linux, OS) },
            win: win && { primary: KeybindingParser.parseKeybinding(win, OS) }
        };
        if (!desc.primary && !desc.mac && !desc.linux && !desc.win) {
            return undefined;
        }
        return desc;
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
