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
import Severity from '../../../base/common/severity';
import { Registry } from '../../../platform/registry/common/platform';
import { Extensions } from '../../../platform/configuration/common/configurationRegistry';
import { URI } from '../../../base/common/uri';
import { TPromise } from '../../../base/common/winjs.base';
import { CommandsRegistry } from '../../../platform/commands/common/commands';
import { AbstractKeybindingService } from '../../../platform/keybinding/common/abstractKeybindingService';
import { USLayoutResolvedKeybinding } from '../../../platform/keybinding/common/usLayoutResolvedKeybinding';
import { KeybindingResolver } from '../../../platform/keybinding/common/keybindingResolver';
import { WorkspaceFolder, Workspace } from '../../../platform/workspace/common/workspace';
import { isCodeEditor } from '../../browser/editorBrowser';
import { Emitter } from '../../../base/common/event';
import { Configuration, DefaultConfigurationModel, ConfigurationChangeEvent } from '../../../platform/configuration/common/configurationModels';
import { ImmortalReference, combinedDisposable, toDisposable, Disposable } from '../../../base/common/lifecycle';
import * as dom from '../../../base/browser/dom';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent';
import { KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry';
import { Menu } from '../../../platform/actions/common/menu';
import { createKeybinding, SimpleKeybinding } from '../../../base/common/keyCodes';
import { ResolvedKeybindingItem } from '../../../platform/keybinding/common/resolvedKeybindingItem';
import { OS } from '../../../base/common/platform';
import { Range } from '../../common/core/range';
import { NoOpNotification } from '../../../platform/notification/common/notification';
import { Position as Pos } from '../../common/core/position';
import { isEditorConfigurationKey, isDiffEditorConfigurationKey } from '../../common/config/commonEditorConfig';
import { isResourceTextEdit } from '../../common/modes';
import { EditOperation } from '../../common/core/editOperation';
import { localize } from '../../../nls';
import { WorkspaceConfigurationChangeEvent } from '../../../workbench/services/configuration/common/configurationModels';
import { equals } from '../../../base/common/objects';
import { UserConfiguration } from '../../../platform/configuration/node/configuration';
var SimpleModel = /** @class */ (function () {
    function SimpleModel(model) {
        this.model = model;
        this._onDispose = new Emitter();
    }
    Object.defineProperty(SimpleModel.prototype, "onDispose", {
        get: function () {
            return this._onDispose.event;
        },
        enumerable: true,
        configurable: true
    });
    SimpleModel.prototype.load = function () {
        return TPromise.as(this);
    };
    Object.defineProperty(SimpleModel.prototype, "textEditorModel", {
        get: function () {
            return this.model;
        },
        enumerable: true,
        configurable: true
    });
    SimpleModel.prototype.isReadonly = function () {
        return false;
    };
    SimpleModel.prototype.dispose = function () {
        this._onDispose.fire();
    };
    return SimpleModel;
}());
export { SimpleModel };
function withTypedEditor(widget, codeEditorCallback, diffEditorCallback) {
    if (isCodeEditor(widget)) {
        // Single Editor
        return codeEditorCallback(widget);
    }
    else {
        // Diff Editor
        return diffEditorCallback(widget);
    }
}
var SimpleEditorModelResolverService = /** @class */ (function () {
    function SimpleEditorModelResolverService() {
    }
    SimpleEditorModelResolverService.prototype.setEditor = function (editor) {
        this.editor = editor;
    };
    SimpleEditorModelResolverService.prototype.createModelReference = function (resource) {
        var _this = this;
        var model;
        model = withTypedEditor(this.editor, function (editor) { return _this.findModel(editor, resource); }, function (diffEditor) { return _this.findModel(diffEditor.getOriginalEditor(), resource) || _this.findModel(diffEditor.getModifiedEditor(), resource); });
        if (!model) {
            return TPromise.as(new ImmortalReference(null));
        }
        return TPromise.as(new ImmortalReference(new SimpleModel(model)));
    };
    SimpleEditorModelResolverService.prototype.registerTextModelContentProvider = function (scheme, provider) {
        return {
            dispose: function () { }
        };
    };
    SimpleEditorModelResolverService.prototype.findModel = function (editor, resource) {
        return window.monaco.editor.getModel(resource);
    };
    return SimpleEditorModelResolverService;
}());
export { SimpleEditorModelResolverService };
var SimpleProgressService = /** @class */ (function () {
    function SimpleProgressService() {
    }
    SimpleProgressService.prototype.show = function () {
        return SimpleProgressService.NULL_PROGRESS_RUNNER;
    };
    SimpleProgressService.prototype.showWhile = function (promise, delay) {
        return null;
    };
    SimpleProgressService.NULL_PROGRESS_RUNNER = {
        done: function () { },
        total: function () { },
        worked: function () { }
    };
    return SimpleProgressService;
}());
export { SimpleProgressService };
var SimpleDialogService = /** @class */ (function () {
    function SimpleDialogService() {
    }
    SimpleDialogService.prototype.confirm = function (confirmation) {
        return this.doConfirm(confirmation).then(function (confirmed) {
            return {
                confirmed: confirmed,
                checkboxChecked: false // unsupported
            };
        });
    };
    SimpleDialogService.prototype.doConfirm = function (confirmation) {
        var messageText = confirmation.message;
        if (confirmation.detail) {
            messageText = messageText + '\n\n' + confirmation.detail;
        }
        return TPromise.wrap(window.confirm(messageText));
    };
    SimpleDialogService.prototype.show = function (severity, message, buttons, options) {
        return TPromise.as(0);
    };
    return SimpleDialogService;
}());
export { SimpleDialogService };
var SimpleNotificationService = /** @class */ (function () {
    function SimpleNotificationService() {
    }
    SimpleNotificationService.prototype.info = function (message) {
        return this.notify({ severity: Severity.Info, message: message });
    };
    SimpleNotificationService.prototype.warn = function (message) {
        return this.notify({ severity: Severity.Warning, message: message });
    };
    SimpleNotificationService.prototype.error = function (error) {
        return this.notify({ severity: Severity.Error, message: error });
    };
    SimpleNotificationService.prototype.notify = function (notification) {
        switch (notification.severity) {
            case Severity.Error:
                console.error(notification.message);
                break;
            case Severity.Warning:
                console.warn(notification.message);
                break;
            default:
                console.log(notification.message);
                break;
        }
        return SimpleNotificationService.NO_OP;
    };
    SimpleNotificationService.prototype.prompt = function (severity, message, choices, onCancel) {
        return SimpleNotificationService.NO_OP;
    };
    SimpleNotificationService.NO_OP = new NoOpNotification();
    return SimpleNotificationService;
}());
export { SimpleNotificationService };
var StandaloneCommandService = /** @class */ (function () {
    function StandaloneCommandService(instantiationService) {
        this._onWillExecuteCommand = new Emitter();
        this.onWillExecuteCommand = this._onWillExecuteCommand.event;
        this._instantiationService = instantiationService;
        this._dynamicCommands = Object.create(null);
    }
    StandaloneCommandService.prototype.addCommand = function (command) {
        var _this = this;
        var id = command.id;
        this._dynamicCommands[id] = command;
        return toDisposable(function () {
            delete _this._dynamicCommands[id];
        });
    };
    StandaloneCommandService.prototype.executeCommand = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var command = (CommandsRegistry.getCommand(id) || this._dynamicCommands[id]);
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
    return StandaloneCommandService;
}());
export { StandaloneCommandService };
var StandaloneKeybindingService = /** @class */ (function (_super) {
    __extends(StandaloneKeybindingService, _super);
    function StandaloneKeybindingService(contextKeyService, commandService, telemetryService, notificationService, domNode) {
        var _this = _super.call(this, contextKeyService, commandService, telemetryService, notificationService) || this;
        _this._cachedResolver = null;
        _this._dynamicKeybindings = [];
        _this._register(dom.addDisposableListener(domNode, dom.EventType.KEY_DOWN, function (e) {
            var keyEvent = new StandardKeyboardEvent(e);
            var shouldPreventDefault = _this._dispatch(keyEvent, keyEvent.target);
            if (shouldPreventDefault) {
                keyEvent.preventDefault();
            }
        }));
        return _this;
    }
    StandaloneKeybindingService.prototype.addDynamicKeybinding = function (commandId, keybinding, handler, when) {
        var _this = this;
        var toDispose = [];
        this._dynamicKeybindings.push({
            keybinding: createKeybinding(keybinding, OS),
            command: commandId,
            when: when,
            weight1: 1000,
            weight2: 0
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
        if (commandService instanceof StandaloneCommandService) {
            toDispose.push(commandService.addCommand({
                id: commandId,
                handler: handler
            }));
        }
        else {
            throw new Error('Unknown command service!');
        }
        this.updateResolver({ source: 1 /* Default */ });
        return combinedDisposable(toDispose);
    };
    StandaloneKeybindingService.prototype.updateResolver = function (event) {
        this._cachedResolver = null;
        this._onDidUpdateKeybindings.fire(event);
    };
    StandaloneKeybindingService.prototype._getResolver = function () {
        if (!this._cachedResolver) {
            var defaults = this._toNormalizedKeybindingItems(KeybindingsRegistry.getDefaultKeybindings(), true);
            var overrides = this._toNormalizedKeybindingItems(this._dynamicKeybindings, false);
            this._cachedResolver = new KeybindingResolver(defaults, overrides);
        }
        return this._cachedResolver;
    };
    StandaloneKeybindingService.prototype._documentHasFocus = function () {
        return document.hasFocus();
    };
    StandaloneKeybindingService.prototype._toNormalizedKeybindingItems = function (items, isDefault) {
        var result = [], resultLen = 0;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var when = (item.when ? item.when.normalize() : null);
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
    StandaloneKeybindingService.prototype.resolveKeybinding = function (keybinding) {
        return [new USLayoutResolvedKeybinding(keybinding, OS)];
    };
    StandaloneKeybindingService.prototype.resolveKeyboardEvent = function (keyboardEvent) {
        var keybinding = new SimpleKeybinding(keyboardEvent.ctrlKey, keyboardEvent.shiftKey, keyboardEvent.altKey, keyboardEvent.metaKey, keyboardEvent.keyCode);
        return new USLayoutResolvedKeybinding(keybinding, OS);
    };
    StandaloneKeybindingService.prototype.resolveUserBinding = function (userBinding) {
        return [];
    };
    return StandaloneKeybindingService;
}(AbstractKeybindingService));
export { StandaloneKeybindingService };
function isConfigurationOverrides(thing) {
    return thing
        && typeof thing === 'object'
        && (!thing.overrideIdentifier || typeof thing.overrideIdentifier === 'string')
        && (!thing.resource || thing.resource instanceof URI);
}
var CONFIG_LOCATION = '/vscode/settings.json';
var SimpleConfigurationService = /** @class */ (function (_super) {
    __extends(SimpleConfigurationService, _super);
    function SimpleConfigurationService() {
        var _this = _super.call(this) || this;
        _this._onDidChangeConfiguration = new Emitter();
        _this.onDidChangeConfiguration = _this._onDidChangeConfiguration.event;
        // TODO fix this
        _this.workspace = new Workspace('');
        _this.userConfiguration = _this._register(new UserConfiguration(CONFIG_LOCATION));
        _this._configuration = new Configuration(new DefaultConfigurationModel(), _this.userConfiguration.configurationModel);
        _this._register(Registry.as(Extensions.Configuration).onDidRegisterConfiguration(function (configurationProperties) { return _this.onDidRegisterConfiguration(configurationProperties); }));
        return _this;
    }
    SimpleConfigurationService.prototype.writeConfig = function (contents) {
        require('fs').writeFileSync(CONFIG_LOCATION, JSON.stringify(contents, null, 2));
        this.userConfiguration.reload();
        this.configuration().updateUserConfiguration(this.userConfiguration.configurationModel);
    };
    SimpleConfigurationService.prototype.configuration = function () {
        return this._configuration;
    };
    SimpleConfigurationService.prototype.getValue = function (arg1, arg2) {
        var section = typeof arg1 === 'string' ? arg1 : void 0;
        var overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : {};
        return this.configuration().getValue(section, overrides, null);
    };
    SimpleConfigurationService.prototype.updateValue = function (key, value, arg3, arg4, donotNotifyError) {
        var overrides = isConfigurationOverrides(arg3) ? arg3 : void 0;
        var target = this.deriveConfigurationTarget(key, value, overrides, overrides ? arg4 : arg3);
        this.userConfiguration.configurationModel.setValue(key, value);
        this.configuration().updateValue(key, value);
        this.triggerConfigurationChange(new ConfigurationChangeEvent().change([key]), target);
        this.writeConfig(this.userConfiguration.configurationModel.contents);
        return TPromise.as(null);
    };
    SimpleConfigurationService.prototype.inspect = function (key, options) {
        if (options === void 0) { options = {}; }
        return this.configuration().inspect(key, options, null);
    };
    SimpleConfigurationService.prototype.keys = function () {
        return this.configuration().keys(null);
    };
    SimpleConfigurationService.prototype.reloadConfiguration = function () {
        return TPromise.as(null);
    };
    SimpleConfigurationService.prototype.getConfigurationData = function () {
        return this.configuration().toData();
    };
    SimpleConfigurationService.prototype.onDidRegisterConfiguration = function (keys) {
        this.reset(); // reset our caches
        this.trigger(keys, 4 /* DEFAULT */);
    };
    SimpleConfigurationService.prototype.trigger = function (keys, source) {
        this._onDidChangeConfiguration.fire(new ConfigurationChangeEvent().change(keys).telemetryData(source, this.getTargetConfiguration(source)));
    };
    SimpleConfigurationService.prototype.reset = function () {
        var defaults = new DefaultConfigurationModel();
        this._configuration = new Configuration(defaults, this.userConfiguration.configurationModel);
    };
    SimpleConfigurationService.prototype.getTargetConfiguration = function (target) {
        switch (target) {
            case 4 /* DEFAULT */:
                return this._configuration.defaults.contents;
            case 1 /* USER */:
                return this._configuration.user.contents;
        }
        return {};
    };
    SimpleConfigurationService.prototype.deriveConfigurationTarget = function (key, value, overrides, target) {
        if (target) {
            return target;
        }
        if (value === void 0) {
            // Ignore. But expected is to remove the value from all targets
            return void 0;
        }
        var inspect = this.inspect(key, overrides);
        if (equals(value, inspect.value)) {
            // No change. So ignore.
            return void 0;
        }
        if (inspect.workspaceFolder !== void 0) {
            return 3 /* WORKSPACE_FOLDER */;
        }
        if (inspect.workspace !== void 0) {
            return 2 /* WORKSPACE */;
        }
        return 1 /* USER */;
    };
    SimpleConfigurationService.prototype.triggerConfigurationChange = function (configurationEvent, target) {
        if (configurationEvent.affectedKeys.length) {
            configurationEvent.telemetryData(target, this.getTargetConfiguration(target));
            this._onDidChangeConfiguration.fire(new WorkspaceConfigurationChangeEvent(configurationEvent, this.workspace));
        }
    };
    return SimpleConfigurationService;
}(Disposable));
export { SimpleConfigurationService };
var SimpleResourceConfigurationService = /** @class */ (function () {
    function SimpleResourceConfigurationService(configurationService) {
        var _this = this;
        this.configurationService = configurationService;
        this._onDidChangeConfigurationEmitter = new Emitter();
        this.onDidChangeConfiguration = this.configurationService.onDidChangeConfiguration;
        this.configurationService.onDidChangeConfiguration(function (e) {
            _this._onDidChangeConfigurationEmitter.fire(e);
        });
    }
    SimpleResourceConfigurationService.prototype.getValue = function (resource, arg2, arg3) {
        var position = Pos.isIPosition(arg2) ? arg2 : null;
        var section = position ? (typeof arg3 === 'string' ? arg3 : void 0) : (typeof arg2 === 'string' ? arg2 : void 0);
        return this.configurationService.getValue(section);
    };
    return SimpleResourceConfigurationService;
}());
export { SimpleResourceConfigurationService };
var SimpleMenuService = /** @class */ (function () {
    function SimpleMenuService(commandService) {
        this._commandService = commandService;
    }
    SimpleMenuService.prototype.createMenu = function (id, contextKeyService) {
        return new Menu(id, TPromise.as(true), this._commandService, contextKeyService);
    };
    return SimpleMenuService;
}());
export { SimpleMenuService };
var StandaloneTelemetryService = /** @class */ (function () {
    function StandaloneTelemetryService() {
        this.isOptedIn = false;
    }
    StandaloneTelemetryService.prototype.publicLog = function (eventName, data) {
        return TPromise.wrap(null);
    };
    StandaloneTelemetryService.prototype.getTelemetryInfo = function () {
        return null;
    };
    return StandaloneTelemetryService;
}());
export { StandaloneTelemetryService };
var SimpleWorkspaceContextService = /** @class */ (function () {
    function SimpleWorkspaceContextService() {
        this._onDidChangeWorkspaceName = new Emitter();
        this.onDidChangeWorkspaceName = this._onDidChangeWorkspaceName.event;
        this._onDidChangeWorkspaceFolders = new Emitter();
        this.onDidChangeWorkspaceFolders = this._onDidChangeWorkspaceFolders.event;
        this._onDidChangeWorkbenchState = new Emitter();
        this.onDidChangeWorkbenchState = this._onDidChangeWorkbenchState.event;
        var resource = URI.from({ scheme: SimpleWorkspaceContextService.SCHEME, authority: 'model', path: '/sandbox' });
        this.workspace = { id: '4064f6ec-cb38-4ad0-af64-ee6467e63c82', folders: [new WorkspaceFolder({ uri: resource, name: '', index: 0 })] };
    }
    SimpleWorkspaceContextService.prototype.getWorkspace = function () {
        return this.workspace;
    };
    SimpleWorkspaceContextService.prototype.getWorkbenchState = function () {
        if (this.workspace) {
            if (this.workspace.configuration) {
                return 3 /* WORKSPACE */;
            }
            return 2 /* FOLDER */;
        }
        return 1 /* EMPTY */;
    };
    SimpleWorkspaceContextService.prototype.getWorkspaceFolder = function (resource) {
        return this.workspace.folders[0];
    };
    SimpleWorkspaceContextService.prototype.isInsideWorkspace = function (resource) {
        return resource && resource.scheme === SimpleWorkspaceContextService.SCHEME;
    };
    SimpleWorkspaceContextService.prototype.isCurrentWorkspace = function (workspaceIdentifier) {
        return true;
    };
    SimpleWorkspaceContextService.SCHEME = 'inmemory';
    return SimpleWorkspaceContextService;
}());
export { SimpleWorkspaceContextService };
export function applyConfigurationValues(configurationService, source, isDiffEditor) {
    if (!source) {
        return;
    }
    if (!(configurationService instanceof SimpleConfigurationService)) {
        return;
    }
    Object.keys(source).forEach(function (key) {
        if (isEditorConfigurationKey(key)) {
            configurationService.updateValue("editor." + key, source[key]);
        }
        if (isDiffEditor && isDiffEditorConfigurationKey(key)) {
            configurationService.updateValue("diffEditor." + key, source[key]);
        }
    });
}
var SimpleBulkEditService = /** @class */ (function () {
    function SimpleBulkEditService(_modelService) {
        this._modelService = _modelService;
        //
    }
    SimpleBulkEditService.prototype.apply = function (workspaceEdit, options) {
        var edits = new Map();
        for (var _i = 0, _a = workspaceEdit.edits; _i < _a.length; _i++) {
            var edit = _a[_i];
            if (!isResourceTextEdit(edit)) {
                return Promise.reject(new Error('bad edit - only text edits are supported'));
            }
            var model = this._modelService.getModel(edit.resource);
            if (!model) {
                return Promise.reject(new Error('bad edit - model not found'));
            }
            var array = edits.get(model);
            if (!array) {
                array = [];
            }
            edits.set(model, array.concat(edit.edits));
        }
        var totalEdits = 0;
        var totalFiles = 0;
        edits.forEach(function (edits, model) {
            model.applyEdits(edits.map(function (edit) { return EditOperation.replaceMove(Range.lift(edit.range), edit.text); }));
            totalFiles += 1;
            totalEdits += edits.length;
        });
        return Promise.resolve({
            selection: undefined,
            ariaSummary: localize('summary', 'Made {0} edits in {1} files', totalEdits, totalFiles)
        });
    };
    return SimpleBulkEditService;
}());
export { SimpleBulkEditService };
var SimpleUriLabelService = /** @class */ (function () {
    function SimpleUriLabelService() {
        this._onDidRegisterFormatter = new Emitter();
        this.onDidRegisterFormatter = this._onDidRegisterFormatter.event;
    }
    SimpleUriLabelService.prototype.getUriLabel = function (resource, options) {
        if (resource.scheme === 'file') {
            return resource.fsPath;
        }
        return resource.path;
    };
    SimpleUriLabelService.prototype.getWorkspaceLabel = function (workspace, options) {
        return '';
    };
    SimpleUriLabelService.prototype.registerFormatter = function (selector, formatter) {
        throw new Error('Not implemented');
    };
    return SimpleUriLabelService;
}());
export { SimpleUriLabelService };
