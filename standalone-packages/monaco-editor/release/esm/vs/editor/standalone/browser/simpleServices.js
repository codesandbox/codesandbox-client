/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
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
import Severity from "../../../base/common/severity.js";
import URI from "../../../base/common/uri.js";
import { TPromise } from "../../../base/common/winjs.base.js";
import { CommandsRegistry } from "../../../platform/commands/common/commands.js";
import { AbstractKeybindingService } from "../../../platform/keybinding/common/abstractKeybindingService.js";
import { USLayoutResolvedKeybinding } from "../../../platform/keybinding/common/usLayoutResolvedKeybinding.js";
import { KeybindingResolver } from "../../../platform/keybinding/common/keybindingResolver.js";
import { KeybindingSource } from "../../../platform/keybinding/common/keybinding.js";
import { WorkbenchState, WorkspaceFolder } from "../../../platform/workspace/common/workspace.js";
import { isCodeEditor } from "../../browser/editorBrowser.js";
import { Emitter } from "../../../base/common/event.js";
import { Configuration, DefaultConfigurationModel, ConfigurationModel } from "../../../platform/configuration/common/configurationModels.js";
import { ImmortalReference, combinedDisposable } from "../../../base/common/lifecycle.js";
import * as dom from "../../../base/browser/dom.js";
import { StandardKeyboardEvent } from "../../../base/browser/keyboardEvent.js";
import { KeybindingsRegistry } from "../../../platform/keybinding/common/keybindingsRegistry.js";
import { Menu } from "../../../platform/actions/common/menu.js";
import { createKeybinding, SimpleKeybinding } from "../../../base/common/keyCodes.js";
import { ResolvedKeybindingItem } from "../../../platform/keybinding/common/resolvedKeybindingItem.js";
import { OS } from "../../../base/common/platform.js";
import { Range } from "../../common/core/range.js";
import { NoOpNotification } from "../../../platform/notification/common/notification.js";
import { Position as Pos } from "../../common/core/position.js";
import { isEditorConfigurationKey, isDiffEditorConfigurationKey } from "../../common/config/commonEditorConfig.js";
import { isResourceTextEdit } from "../../common/modes.js";
import { EditOperation } from "../../common/core/editOperation.js";
import { localize } from "../../../nls.js";
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
        model = withTypedEditor(this.editor, function (editor) { return _this.findModel(editor, resource); }, function (diffEditor) {
            return _this.findModel(diffEditor.getOriginalEditor(), resource) ||
                _this.findModel(diffEditor.getModifiedEditor(), resource);
        });
        if (!model) {
            return TPromise.as(new ImmortalReference(null));
        }
        return TPromise.as(new ImmortalReference(new SimpleModel(model)));
    };
    SimpleEditorModelResolverService.prototype.registerTextModelContentProvider = function (scheme, provider) {
        return {
            dispose: function () {
                /* no op */
            }
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
            messageText = messageText + "\n\n" + confirmation.detail;
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
        this.onWillExecuteCommand = this
            ._onWillExecuteCommand.event;
        this._instantiationService = instantiationService;
        this._dynamicCommands = Object.create(null);
    }
    StandaloneCommandService.prototype.addCommand = function (command) {
        var _this = this;
        var id = command.id;
        this._dynamicCommands[id] = command;
        return {
            dispose: function () {
                delete _this._dynamicCommands[id];
            }
        };
    };
    StandaloneCommandService.prototype.executeCommand = function (id) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var command = CommandsRegistry.getCommand(id) || this._dynamicCommands[id];
        if (!command) {
            return TPromise.wrapError(new Error("command '" + id + "' not found"));
        }
        try {
            this._onWillExecuteCommand.fire({ commandId: id });
            var result = this._instantiationService.invokeFunction.apply(this._instantiationService, [command.handler].concat(args));
            return TPromise.as(result);
        }
        catch (err) {
            return TPromise.wrapError(err);
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
        toDispose.push({
            dispose: function () {
                for (var i = 0; i < _this._dynamicKeybindings.length; i++) {
                    var kb = _this._dynamicKeybindings[i];
                    if (kb.command === commandId) {
                        _this._dynamicKeybindings.splice(i, 1);
                        _this.updateResolver({
                            source: KeybindingSource.Default
                        });
                        return;
                    }
                }
            }
        });
        var commandService = this._commandService;
        if (commandService instanceof StandaloneCommandService) {
            toDispose.push(commandService.addCommand({
                id: commandId,
                handler: handler
            }));
        }
        else {
            throw new Error("Unknown command service!");
        }
        this.updateResolver({ source: KeybindingSource.Default });
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
    return (thing &&
        typeof thing === "object" &&
        (!thing.overrideIdentifier ||
            typeof thing.overrideIdentifier === "string") &&
        (!thing.resource || thing.resource instanceof URI));
}
var SimpleConfigurationService = /** @class */ (function () {
    function SimpleConfigurationService() {
        this._onDidChangeConfiguration = new Emitter();
        this.onDidChangeConfiguration = this._onDidChangeConfiguration.event;
        this._configuration = new Configuration(new DefaultConfigurationModel(), new ConfigurationModel());
    }
    SimpleConfigurationService.prototype.configuration = function () {
        return this._configuration;
    };
    SimpleConfigurationService.prototype.getValue = function (arg1, arg2) {
        var section = typeof arg1 === "string" ? arg1 : void 0;
        var overrides = isConfigurationOverrides(arg1)
            ? arg1
            : isConfigurationOverrides(arg2)
                ? arg2
                : {};
        return this.configuration().getValue(section, overrides, null);
    };
    SimpleConfigurationService.prototype.updateValue = function (key, value, arg3, arg4) {
        this.configuration().updateValue(key, value);
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
        return null;
    };
    return SimpleConfigurationService;
}());
export { SimpleConfigurationService };
var SimpleResourceConfigurationService = /** @class */ (function () {
    function SimpleResourceConfigurationService(configurationService) {
        var _this = this;
        this.configurationService = configurationService;
        this._onDidChangeConfigurationEmitter = new Emitter();
        this.configurationService.onDidChangeConfiguration(function (e) {
            _this._onDidChangeConfigurationEmitter.fire(e);
        });
    }
    SimpleResourceConfigurationService.prototype.getValue = function (resource, arg2, arg3) {
        var position = Pos.isIPosition(arg2) ? arg2 : null;
        var section = position
            ? typeof arg3 === "string"
                ? arg3
                : void 0
            : typeof arg2 === "string"
                ? arg2
                : void 0;
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
        this.onDidChangeWorkspaceName = this
            ._onDidChangeWorkspaceName.event;
        this._onDidChangeWorkspaceFolders = new Emitter();
        this.onDidChangeWorkspaceFolders = this._onDidChangeWorkspaceFolders.event;
        this._onDidChangeWorkbenchState = new Emitter();
        this.onDidChangeWorkbenchState = this
            ._onDidChangeWorkbenchState.event;
        var resource = URI.from({
            scheme: SimpleWorkspaceContextService.SCHEME,
            authority: "model",
            path: "/"
        });
        this.workspace = {
            id: "4064f6ec-cb38-4ad0-af64-ee6467e63c82",
            folders: [
                new WorkspaceFolder({ uri: resource, name: "", index: 0 })
            ],
            name: resource.fsPath
        };
    }
    SimpleWorkspaceContextService.prototype.getWorkspace = function () {
        return this.workspace;
    };
    SimpleWorkspaceContextService.prototype.getWorkbenchState = function () {
        if (this.workspace) {
            if (this.workspace.configuration) {
                return WorkbenchState.WORKSPACE;
            }
            return WorkbenchState.FOLDER;
        }
        return WorkbenchState.EMPTY;
    };
    SimpleWorkspaceContextService.prototype.getWorkspaceFolder = function (resource) {
        return resource &&
            resource.scheme === SimpleWorkspaceContextService.SCHEME
            ? this.workspace.folders[0]
            : void 0;
    };
    SimpleWorkspaceContextService.prototype.isInsideWorkspace = function (resource) {
        return (resource && resource.scheme === SimpleWorkspaceContextService.SCHEME);
    };
    SimpleWorkspaceContextService.prototype.isCurrentWorkspace = function (workspaceIdentifier) {
        return true;
    };
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
                return TPromise.wrapError(new Error("bad edit - only text edits are supported"));
            }
            var model = this._modelService.getModel(edit.resource);
            if (!model) {
                return TPromise.wrapError(new Error("bad edit - model not found"));
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
            model.applyEdits(edits.map(function (edit) {
                return EditOperation.replaceMove(Range.lift(edit.range), edit.text);
            }));
            totalFiles += 1;
            totalEdits += edits.length;
        });
        return TPromise.as({
            selection: undefined,
            ariaSummary: localize("summary", "Made {0} edits in {1} files", totalEdits, totalFiles)
        });
    };
    return SimpleBulkEditService;
}());
export { SimpleBulkEditService };
