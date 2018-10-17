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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import * as arrays from '../../../../base/common/arrays.js';
import * as types from '../../../../base/common/types.js';
import { language, LANGUAGE_DEFAULT } from '../../../../base/common/platform.js';
import { Action } from '../../../../base/common/actions.js';
import { QuickOpenEntryGroup, QuickOpenModel } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { QuickOpenHandler } from '../../../browser/quickopen.js';
import { matchesWords, matchesPrefix, matchesContiguousSubString, or } from '../../../../base/common/filters.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { registerEditorAction, EditorAction } from '../../../../editor/browser/editorExtensions.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { once } from '../../../../base/common/event.js';
import { LRUCache } from '../../../../base/common/map.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { isPromiseCanceledError } from '../../../../base/common/errors.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
export var ALL_COMMANDS_PREFIX = '>';
var lastCommandPaletteInput;
var commandHistory;
var commandCounter = 1;
function resolveCommandHistory(configurationService) {
    var config = configurationService.getValue();
    var commandHistory = config.workbench && config.workbench.commandPalette && config.workbench.commandPalette.history;
    if (typeof commandHistory !== 'number') {
        commandHistory = CommandsHistory.DEFAULT_COMMANDS_HISTORY_LENGTH;
    }
    return commandHistory;
}
var CommandsHistory = /** @class */ (function () {
    function CommandsHistory(storageService, lifecycleService, configurationService) {
        this.storageService = storageService;
        this.lifecycleService = lifecycleService;
        this.configurationService = configurationService;
        this.updateConfiguration();
        this.load();
        this.registerListeners();
    }
    CommandsHistory.prototype.updateConfiguration = function () {
        this.commandHistoryLength = resolveCommandHistory(this.configurationService);
        if (commandHistory) {
            commandHistory.limit = this.commandHistoryLength;
        }
    };
    CommandsHistory.prototype.load = function () {
        var raw = this.storageService.get(CommandsHistory.PREF_KEY_CACHE);
        var serializedCache;
        if (raw) {
            try {
                serializedCache = JSON.parse(raw);
            }
            catch (error) {
                // invalid data
            }
        }
        commandHistory = new LRUCache(this.commandHistoryLength, 1);
        if (serializedCache) {
            var entries = void 0;
            if (serializedCache.usesLRU) {
                entries = serializedCache.entries;
            }
            else {
                entries = serializedCache.entries.sort(function (a, b) { return a.value - b.value; });
            }
            entries.forEach(function (entry) { return commandHistory.set(entry.key, entry.value); });
        }
        commandCounter = this.storageService.getInteger(CommandsHistory.PREF_KEY_COUNTER, void 0, commandCounter);
    };
    CommandsHistory.prototype.registerListeners = function () {
        var _this = this;
        this.configurationService.onDidChangeConfiguration(function (e) { return _this.updateConfiguration(); });
        once(this.lifecycleService.onShutdown)(function (reason) { return _this.save(); });
    };
    CommandsHistory.prototype.save = function () {
        var serializedCache = { usesLRU: true, entries: [] };
        commandHistory.forEach(function (value, key) { return serializedCache.entries.push({ key: key, value: value }); });
        this.storageService.store(CommandsHistory.PREF_KEY_CACHE, JSON.stringify(serializedCache));
        this.storageService.store(CommandsHistory.PREF_KEY_COUNTER, commandCounter);
    };
    CommandsHistory.prototype.push = function (commandId) {
        commandHistory.set(commandId, commandCounter++); // set counter to command
    };
    CommandsHistory.prototype.peek = function (commandId) {
        return commandHistory.peek(commandId);
    };
    CommandsHistory.DEFAULT_COMMANDS_HISTORY_LENGTH = 50;
    CommandsHistory.PREF_KEY_CACHE = 'commandPalette.mru.cache';
    CommandsHistory.PREF_KEY_COUNTER = 'commandPalette.mru.counter';
    CommandsHistory = __decorate([
        __param(0, IStorageService),
        __param(1, ILifecycleService),
        __param(2, IConfigurationService)
    ], CommandsHistory);
    return CommandsHistory;
}());
var ShowAllCommandsAction = /** @class */ (function (_super) {
    __extends(ShowAllCommandsAction, _super);
    function ShowAllCommandsAction(id, label, quickOpenService, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickOpenService = quickOpenService;
        _this.configurationService = configurationService;
        return _this;
    }
    ShowAllCommandsAction.prototype.run = function (context) {
        var config = this.configurationService.getValue();
        var restoreInput = config.workbench && config.workbench.commandPalette && config.workbench.commandPalette.preserveInput === true;
        // Show with last command palette input if any and configured
        var value = ALL_COMMANDS_PREFIX;
        if (restoreInput && lastCommandPaletteInput) {
            value = "" + value + lastCommandPaletteInput;
        }
        this.quickOpenService.show(value, { inputSelection: lastCommandPaletteInput ? { start: 1 /* after prefix */, end: value.length } : void 0 });
        return TPromise.as(null);
    };
    ShowAllCommandsAction.ID = 'workbench.action.showCommands';
    ShowAllCommandsAction.LABEL = nls.localize('showTriggerActions', "Show All Commands");
    ShowAllCommandsAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IConfigurationService)
    ], ShowAllCommandsAction);
    return ShowAllCommandsAction;
}(Action));
export { ShowAllCommandsAction };
var ClearCommandHistoryAction = /** @class */ (function (_super) {
    __extends(ClearCommandHistoryAction, _super);
    function ClearCommandHistoryAction(id, label, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.configurationService = configurationService;
        return _this;
    }
    ClearCommandHistoryAction.prototype.run = function (context) {
        var commandHistoryLength = resolveCommandHistory(this.configurationService);
        if (commandHistoryLength > 0) {
            commandHistory = new LRUCache(commandHistoryLength);
            commandCounter = 1;
        }
        return TPromise.as(null);
    };
    ClearCommandHistoryAction.ID = 'workbench.action.clearCommandHistory';
    ClearCommandHistoryAction.LABEL = nls.localize('clearCommandHistory', "Clear Command History");
    ClearCommandHistoryAction = __decorate([
        __param(2, IConfigurationService)
    ], ClearCommandHistoryAction);
    return ClearCommandHistoryAction;
}(Action));
export { ClearCommandHistoryAction };
var CommandPaletteEditorAction = /** @class */ (function (_super) {
    __extends(CommandPaletteEditorAction, _super);
    function CommandPaletteEditorAction() {
        return _super.call(this, {
            id: ShowAllCommandsAction.ID,
            label: nls.localize('showCommands.label', "Command Palette..."),
            alias: 'Command Palette',
            precondition: null,
            menuOpts: {
                group: 'z_commands',
                order: 1
            }
        }) || this;
    }
    CommandPaletteEditorAction.prototype.run = function (accessor, editor) {
        var quickOpenService = accessor.get(IQuickOpenService);
        // Show with prefix
        quickOpenService.show(ALL_COMMANDS_PREFIX);
        return TPromise.as(null);
    };
    return CommandPaletteEditorAction;
}(EditorAction));
var BaseCommandEntry = /** @class */ (function (_super) {
    __extends(BaseCommandEntry, _super);
    function BaseCommandEntry(commandId, keybinding, label, alias, highlights, onBeforeRun, notificationService, telemetryService) {
        var _this = _super.call(this) || this;
        _this.commandId = commandId;
        _this.keybinding = keybinding;
        _this.label = label;
        _this.onBeforeRun = onBeforeRun;
        _this.notificationService = notificationService;
        _this.telemetryService = telemetryService;
        _this.labelLowercase = _this.label.toLowerCase();
        _this.keybindingAriaLabel = keybinding ? keybinding.getAriaLabel() : void 0;
        if (_this.label !== alias) {
            _this.alias = alias;
        }
        else {
            highlights.alias = null;
        }
        _this.setHighlights(highlights.label, null, highlights.alias);
        return _this;
    }
    BaseCommandEntry.prototype.getCommandId = function () {
        return this.commandId;
    };
    BaseCommandEntry.prototype.getLabel = function () {
        return this.label;
    };
    BaseCommandEntry.prototype.getSortLabel = function () {
        return this.labelLowercase;
    };
    BaseCommandEntry.prototype.getDescription = function () {
        return this.description;
    };
    BaseCommandEntry.prototype.setDescription = function (description) {
        this.description = description;
    };
    BaseCommandEntry.prototype.getKeybinding = function () {
        return this.keybinding;
    };
    BaseCommandEntry.prototype.getDetail = function () {
        return this.alias;
    };
    BaseCommandEntry.prototype.getAriaLabel = function () {
        if (this.keybindingAriaLabel) {
            return nls.localize('entryAriaLabelWithKey', "{0}, {1}, commands", this.getLabel(), this.keybindingAriaLabel);
        }
        return nls.localize('entryAriaLabel', "{0}, commands", this.getLabel());
    };
    BaseCommandEntry.prototype.run = function (mode, context) {
        if (mode === 1 /* OPEN */) {
            this.runAction(this.getAction());
            return true;
        }
        return false;
    };
    BaseCommandEntry.prototype.runAction = function (action) {
        var _this = this;
        // Indicate onBeforeRun
        this.onBeforeRun(this.commandId);
        // Use a timeout to give the quick open widget a chance to close itself first
        setTimeout(function () {
            if (action && (!(action instanceof Action) || action.enabled)) {
                try {
                    /* __GDPR__
                        "workbenchActionExecuted" : {
                            "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                            "from": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                        }
                    */
                    _this.telemetryService.publicLog('workbenchActionExecuted', { id: action.id, from: 'quick open' });
                    (action.run() || TPromise.as(null)).then(function () {
                        if (action instanceof Action) {
                            action.dispose();
                        }
                    }, function (err) { return _this.onError(err); });
                }
                catch (error) {
                    _this.onError(error);
                }
            }
            else {
                _this.notificationService.info(nls.localize('actionNotEnabled', "Command '{0}' is not enabled in the current context.", _this.getLabel()));
            }
        }, 50);
    };
    BaseCommandEntry.prototype.onError = function (error) {
        if (isPromiseCanceledError(error)) {
            return;
        }
        this.notificationService.error(error || nls.localize('canNotRun', "Command '{0}' resulted in an error.", this.label));
    };
    BaseCommandEntry = __decorate([
        __param(6, INotificationService),
        __param(7, ITelemetryService)
    ], BaseCommandEntry);
    return BaseCommandEntry;
}(QuickOpenEntryGroup));
var EditorActionCommandEntry = /** @class */ (function (_super) {
    __extends(EditorActionCommandEntry, _super);
    function EditorActionCommandEntry(commandId, keybinding, label, meta, highlights, action, onBeforeRun, notificationService, telemetryService) {
        var _this = _super.call(this, commandId, keybinding, label, meta, highlights, onBeforeRun, notificationService, telemetryService) || this;
        _this.action = action;
        return _this;
    }
    EditorActionCommandEntry.prototype.getAction = function () {
        return this.action;
    };
    EditorActionCommandEntry = __decorate([
        __param(7, INotificationService),
        __param(8, ITelemetryService)
    ], EditorActionCommandEntry);
    return EditorActionCommandEntry;
}(BaseCommandEntry));
var ActionCommandEntry = /** @class */ (function (_super) {
    __extends(ActionCommandEntry, _super);
    function ActionCommandEntry(commandId, keybinding, label, alias, highlights, action, onBeforeRun, notificationService, telemetryService) {
        var _this = _super.call(this, commandId, keybinding, label, alias, highlights, onBeforeRun, notificationService, telemetryService) || this;
        _this.action = action;
        return _this;
    }
    ActionCommandEntry.prototype.getAction = function () {
        return this.action;
    };
    ActionCommandEntry = __decorate([
        __param(7, INotificationService),
        __param(8, ITelemetryService)
    ], ActionCommandEntry);
    return ActionCommandEntry;
}(BaseCommandEntry));
var wordFilter = or(matchesPrefix, matchesWords, matchesContiguousSubString);
var CommandsHandler = /** @class */ (function (_super) {
    __extends(CommandsHandler, _super);
    function CommandsHandler(editorService, instantiationService, keybindingService, menuService, configurationService, extensionService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        _this.instantiationService = instantiationService;
        _this.keybindingService = keybindingService;
        _this.menuService = menuService;
        _this.configurationService = configurationService;
        _this.extensionService = extensionService;
        _this.commandsHistory = _this.instantiationService.createInstance(CommandsHistory);
        _this.configurationService.onDidChangeConfiguration(function (e) { return _this.updateConfiguration(); });
        _this.updateConfiguration();
        return _this;
    }
    CommandsHandler.prototype.updateConfiguration = function () {
        this.commandHistoryEnabled = resolveCommandHistory(this.configurationService) > 0;
    };
    CommandsHandler.prototype.getResults = function (searchValue, token) {
        var _this = this;
        // wait for extensions being registered to cover all commands
        // also from extensions
        return this.extensionService.whenInstalledExtensionsRegistered().then(function () {
            if (token.isCancellationRequested) {
                return new QuickOpenModel([]);
            }
            searchValue = searchValue.trim();
            // Remember as last command palette input
            lastCommandPaletteInput = searchValue;
            // Editor Actions
            var activeTextEditorWidget = _this.editorService.activeTextEditorWidget;
            var editorActions = [];
            if (activeTextEditorWidget && types.isFunction(activeTextEditorWidget.getSupportedActions)) {
                editorActions = activeTextEditorWidget.getSupportedActions();
            }
            var editorEntries = _this.editorActionsToEntries(editorActions, searchValue);
            // Other Actions
            var menu = _this.editorService.invokeWithinEditorContext(function (accessor) { return _this.menuService.createMenu(MenuId.CommandPalette, accessor.get(IContextKeyService)); });
            var menuActions = menu.getActions().reduce(function (r, _a) {
                var actions = _a[1];
                return r.concat(actions);
            }, []).filter(function (action) { return action instanceof MenuItemAction; });
            var commandEntries = _this.menuItemActionsToEntries(menuActions, searchValue);
            // Concat
            var entries = editorEntries.concat(commandEntries);
            // Remove duplicates
            entries = arrays.distinct(entries, function (entry) { return "" + entry.getLabel() + entry.getGroupLabel() + entry.getCommandId(); });
            // Handle label clashes
            var commandLabels = new Set();
            entries.forEach(function (entry) {
                var commandLabel = "" + entry.getLabel() + entry.getGroupLabel();
                if (commandLabels.has(commandLabel)) {
                    entry.setDescription(entry.getCommandId());
                }
                else {
                    commandLabels.add(commandLabel);
                }
            });
            // Sort by MRU order and fallback to name otherwie
            entries = entries.sort(function (elementA, elementB) {
                var counterA = _this.commandsHistory.peek(elementA.getCommandId());
                var counterB = _this.commandsHistory.peek(elementB.getCommandId());
                if (counterA && counterB) {
                    return counterA > counterB ? -1 : 1; // use more recently used command before older
                }
                if (counterA) {
                    return -1; // first command was used, so it wins over the non used one
                }
                if (counterB) {
                    return 1; // other command was used so it wins over the command
                }
                // both commands were never used, so we sort by name
                return elementA.getSortLabel().localeCompare(elementB.getSortLabel());
            });
            // Introduce group marker border between recently used and others
            // only if we have recently used commands in the result set
            var firstEntry = entries[0];
            if (firstEntry && _this.commandsHistory.peek(firstEntry.getCommandId())) {
                firstEntry.setGroupLabel(nls.localize('recentlyUsed', "recently used"));
                for (var i = 1; i < entries.length; i++) {
                    var entry = entries[i];
                    if (!_this.commandsHistory.peek(entry.getCommandId())) {
                        entry.setShowBorder(true);
                        entry.setGroupLabel(nls.localize('morecCommands', "other commands"));
                        break;
                    }
                }
            }
            return new QuickOpenModel(entries);
        });
    };
    CommandsHandler.prototype.editorActionsToEntries = function (actions, searchValue) {
        var _this = this;
        var entries = [];
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            if (action.id === ShowAllCommandsAction.ID) {
                continue; // avoid duplicates
            }
            var label = action.label;
            if (label) {
                // Alias for non default languages
                var alias = (language !== LANGUAGE_DEFAULT) ? action.alias : null;
                var labelHighlights = wordFilter(searchValue, label);
                var aliasHighlights = alias ? wordFilter(searchValue, alias) : null;
                if (labelHighlights || aliasHighlights) {
                    entries.push(this.instantiationService.createInstance(EditorActionCommandEntry, action.id, this.keybindingService.lookupKeybinding(action.id), label, alias, { label: labelHighlights, alias: aliasHighlights }, action, function (id) { return _this.onBeforeRunCommand(id); }));
                }
            }
        }
        return entries;
    };
    CommandsHandler.prototype.onBeforeRunCommand = function (commandId) {
        // Remember in commands history
        this.commandsHistory.push(commandId);
    };
    CommandsHandler.prototype.menuItemActionsToEntries = function (actions, searchValue) {
        var _this = this;
        var entries = [];
        for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
            var action = actions_1[_i];
            var title = typeof action.item.title === 'string' ? action.item.title : action.item.title.value;
            var category = void 0, label = title;
            if (action.item.category) {
                category = typeof action.item.category === 'string' ? action.item.category : action.item.category.value;
                label = nls.localize('cat.title', "{0}: {1}", category, title);
            }
            if (label) {
                var labelHighlights = wordFilter(searchValue, label);
                // Add an 'alias' in original language when running in different locale
                var aliasTitle = (language !== LANGUAGE_DEFAULT && typeof action.item.title !== 'string') ? action.item.title.original : null;
                var aliasCategory = (language !== LANGUAGE_DEFAULT && category && typeof action.item.category !== 'string') ? action.item.category.original : null;
                var alias = void 0;
                if (aliasTitle && category) {
                    alias = aliasCategory ? aliasCategory + ": " + aliasTitle : category + ": " + aliasTitle;
                }
                else if (aliasTitle) {
                    alias = aliasTitle;
                }
                var aliasHighlights = alias ? wordFilter(searchValue, alias) : null;
                if (labelHighlights || aliasHighlights) {
                    entries.push(this.instantiationService.createInstance(ActionCommandEntry, action.id, this.keybindingService.lookupKeybinding(action.item.id), label, alias, { label: labelHighlights, alias: aliasHighlights }, action, function (id) { return _this.onBeforeRunCommand(id); }));
                }
            }
        }
        return entries;
    };
    CommandsHandler.prototype.getAutoFocus = function (searchValue, context) {
        var autoFocusPrefixMatch = searchValue.trim();
        if (autoFocusPrefixMatch && this.commandHistoryEnabled) {
            var firstEntry = context.model && context.model.entries[0];
            if (firstEntry instanceof BaseCommandEntry && this.commandsHistory.peek(firstEntry.getCommandId())) {
                autoFocusPrefixMatch = void 0; // keep focus on MRU element if we have history elements
            }
        }
        return {
            autoFocusFirstEntry: true,
            autoFocusPrefixMatch: autoFocusPrefixMatch
        };
    };
    CommandsHandler.prototype.getEmptyLabel = function (searchString) {
        return nls.localize('noCommandsMatching', "No commands matching");
    };
    CommandsHandler.ID = 'workbench.picker.commands';
    CommandsHandler = __decorate([
        __param(0, IEditorService),
        __param(1, IInstantiationService),
        __param(2, IKeybindingService),
        __param(3, IMenuService),
        __param(4, IConfigurationService),
        __param(5, IExtensionService)
    ], CommandsHandler);
    return CommandsHandler;
}(QuickOpenHandler));
export { CommandsHandler };
registerEditorAction(CommandPaletteEditorAction);
