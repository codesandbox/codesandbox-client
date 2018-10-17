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
import '../browser/media/preferences.css';
import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Extensions } from '../../../common/actions.js';
import { Extensions as EditorInputExtensions } from '../../../common/editor.js';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { KeyChord } from '../../../../base/common/keyCodes.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { PreferencesEditor } from '../browser/preferencesEditor.js';
import { SettingsEditor2 } from './settingsEditor2.js';
import { DefaultPreferencesEditorInput, PreferencesEditorInput, KeybindingsEditorInput, SettingsEditor2Input } from '../../../services/preferences/common/preferencesEditorInput.js';
import { KeybindingsEditor } from '../browser/keybindingsEditor.js';
import { OpenDefaultKeybindingsFileAction, OpenRawDefaultSettingsAction, OpenSettingsAction, OpenGlobalSettingsAction, OpenGlobalKeybindingsFileAction, OpenWorkspaceSettingsAction, OpenFolderSettingsAction, ConfigureLanguageBasedSettingsAction, OPEN_FOLDER_SETTINGS_COMMAND, OpenGlobalKeybindingsAction, OpenSettings2Action, OpenSettingsJsonAction } from '../browser/preferencesActions.js';
import { IPreferencesSearchService, CONTEXT_KEYBINDING_FOCUS, CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS, KEYBINDINGS_EDITOR_COMMAND_DEFINE, KEYBINDINGS_EDITOR_COMMAND_REMOVE, KEYBINDINGS_EDITOR_COMMAND_SEARCH, KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS, KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE, KEYBINDINGS_EDITOR_COMMAND_COPY, KEYBINDINGS_EDITOR_COMMAND_RESET, KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND, KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR, KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS, KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS, SETTINGS_EDITOR_COMMAND_SEARCH, CONTEXT_SETTINGS_EDITOR, SETTINGS_EDITOR_COMMAND_FOCUS_FILE, CONTEXT_SETTINGS_SEARCH_FOCUS, SETTINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS, SETTINGS_EDITOR_COMMAND_FOCUS_NEXT_SETTING, SETTINGS_EDITOR_COMMAND_FOCUS_PREVIOUS_SETTING, SETTINGS_EDITOR_COMMAND_EDIT_FOCUSED_SETTING, SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_FROM_SEARCH, CONTEXT_TOC_ROW_FOCUS, SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_LIST, SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU, KEYBINDINGS_EDITOR_SHOW_DEFAULT_KEYBINDINGS, KEYBINDINGS_EDITOR_SHOW_USER_KEYBINDINGS, CONTEXT_KEYBINDINGS_SEARCH_VALUE } from '../common/preferences.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { PreferencesContribution } from '../common/preferencesContribution.js';
import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { EditorDescriptor, Extensions as EditorExtensions } from '../../../browser/editor.js';
import { PreferencesSearchService } from './preferencesSearch.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { Command } from '../../../../editor/browser/editorExtensions.js';
import { Context as SuggestContext } from '../../../../editor/contrib/suggest/suggest.js';
registerSingleton(IPreferencesSearchService, PreferencesSearchService);
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(PreferencesEditor, PreferencesEditor.ID, nls.localize('defaultPreferencesEditor', "Default Preferences Editor")), [
    new SyncDescriptor(PreferencesEditorInput)
]);
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(SettingsEditor2, SettingsEditor2.ID, nls.localize('settingsEditor2', "Settings Editor 2")), [
    new SyncDescriptor(SettingsEditor2Input)
]);
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(KeybindingsEditor, KeybindingsEditor.ID, nls.localize('keybindingsEditor', "Keybindings Editor")), [
    new SyncDescriptor(KeybindingsEditorInput)
]);
// Register Preferences Editor Input Factory
var PreferencesEditorInputFactory = /** @class */ (function () {
    function PreferencesEditorInputFactory() {
    }
    PreferencesEditorInputFactory.prototype.serialize = function (editorInput) {
        var input = editorInput;
        if (input.details && input.master) {
            var registry_1 = Registry.as(EditorInputExtensions.EditorInputFactories);
            var detailsInputFactory = registry_1.getEditorInputFactory(input.details.getTypeId());
            var masterInputFactory = registry_1.getEditorInputFactory(input.master.getTypeId());
            if (detailsInputFactory && masterInputFactory) {
                var detailsSerialized = detailsInputFactory.serialize(input.details);
                var masterSerialized = masterInputFactory.serialize(input.master);
                if (detailsSerialized && masterSerialized) {
                    return JSON.stringify({
                        name: input.getName(),
                        description: input.getDescription(),
                        detailsSerialized: detailsSerialized,
                        masterSerialized: masterSerialized,
                        detailsTypeId: input.details.getTypeId(),
                        masterTypeId: input.master.getTypeId()
                    });
                }
            }
        }
        return null;
    };
    PreferencesEditorInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
        var deserialized = JSON.parse(serializedEditorInput);
        var registry = Registry.as(EditorInputExtensions.EditorInputFactories);
        var detailsInputFactory = registry.getEditorInputFactory(deserialized.detailsTypeId);
        var masterInputFactory = registry.getEditorInputFactory(deserialized.masterTypeId);
        if (detailsInputFactory && masterInputFactory) {
            var detailsInput = detailsInputFactory.deserialize(instantiationService, deserialized.detailsSerialized);
            var masterInput = masterInputFactory.deserialize(instantiationService, deserialized.masterSerialized);
            if (detailsInput && masterInput) {
                return new PreferencesEditorInput(deserialized.name, deserialized.description, detailsInput, masterInput);
            }
        }
        return null;
    };
    return PreferencesEditorInputFactory;
}());
var KeybindingsEditorInputFactory = /** @class */ (function () {
    function KeybindingsEditorInputFactory() {
    }
    KeybindingsEditorInputFactory.prototype.serialize = function (editorInput) {
        var input = editorInput;
        return JSON.stringify({
            name: input.getName(),
            typeId: input.getTypeId()
        });
    };
    KeybindingsEditorInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
        return instantiationService.createInstance(KeybindingsEditorInput);
    };
    return KeybindingsEditorInputFactory;
}());
var SettingsEditor2InputFactory = /** @class */ (function () {
    function SettingsEditor2InputFactory() {
    }
    SettingsEditor2InputFactory.prototype.serialize = function (input) {
        var serialized = {};
        return JSON.stringify(serialized);
    };
    SettingsEditor2InputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
        return instantiationService.createInstance(SettingsEditor2Input);
    };
    return SettingsEditor2InputFactory;
}());
// Register Default Preferences Editor Input Factory
var DefaultPreferencesEditorInputFactory = /** @class */ (function () {
    function DefaultPreferencesEditorInputFactory() {
    }
    DefaultPreferencesEditorInputFactory.prototype.serialize = function (editorInput) {
        var input = editorInput;
        var serialized = { resource: input.getResource().toString() };
        return JSON.stringify(serialized);
    };
    DefaultPreferencesEditorInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
        var deserialized = JSON.parse(serializedEditorInput);
        return instantiationService.createInstance(DefaultPreferencesEditorInput, URI.parse(deserialized.resource));
    };
    return DefaultPreferencesEditorInputFactory;
}());
Registry.as(EditorInputExtensions.EditorInputFactories).registerEditorInputFactory(PreferencesEditorInput.ID, PreferencesEditorInputFactory);
Registry.as(EditorInputExtensions.EditorInputFactories).registerEditorInputFactory(DefaultPreferencesEditorInput.ID, DefaultPreferencesEditorInputFactory);
Registry.as(EditorInputExtensions.EditorInputFactories).registerEditorInputFactory(KeybindingsEditorInput.ID, KeybindingsEditorInputFactory);
Registry.as(EditorInputExtensions.EditorInputFactories).registerEditorInputFactory(SettingsEditor2Input.ID, SettingsEditor2InputFactory);
// Contribute Global Actions
var category = nls.localize('preferences', "Preferences");
var registry = Registry.as(Extensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenRawDefaultSettingsAction, OpenRawDefaultSettingsAction.ID, OpenRawDefaultSettingsAction.LABEL), 'Preferences: Open Raw Default Settings', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenSettingsAction, OpenSettingsAction.ID, OpenSettingsAction.LABEL, { primary: 2048 /* CtrlCmd */ | 82 /* US_COMMA */ }), 'Preferences: Open Settings', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenSettingsJsonAction, OpenSettingsJsonAction.ID, OpenSettingsJsonAction.LABEL), 'Preferences: Open Settings (JSON)', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenSettings2Action, OpenSettings2Action.ID, OpenSettings2Action.LABEL), 'Preferences: Open Settings (UI)', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenGlobalSettingsAction, OpenGlobalSettingsAction.ID, OpenGlobalSettingsAction.LABEL), 'Preferences: Open User Settings', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenGlobalKeybindingsAction, OpenGlobalKeybindingsAction.ID, OpenGlobalKeybindingsAction.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 49 /* KEY_S */) }), 'Preferences: Open Keyboard Shortcuts', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenDefaultKeybindingsFileAction, OpenDefaultKeybindingsFileAction.ID, OpenDefaultKeybindingsFileAction.LABEL), 'Preferences: Open Default Keyboard Shortcuts File', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenGlobalKeybindingsFileAction, OpenGlobalKeybindingsFileAction.ID, OpenGlobalKeybindingsFileAction.LABEL, { primary: null }), 'Preferences: Open Keyboard Shortcuts File', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ConfigureLanguageBasedSettingsAction, ConfigureLanguageBasedSettingsAction.ID, ConfigureLanguageBasedSettingsAction.LABEL), 'Preferences: Configure Language Specific Settings...', category);
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_DEFINE,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 41 /* KEY_K */),
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control && control instanceof KeybindingsEditor) {
            control.defineKeybinding(control.activeKeybindingEntry);
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_REMOVE,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
    primary: 20 /* Delete */,
    mac: {
        primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 1 /* Backspace */)
    },
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control && control instanceof KeybindingsEditor) {
            control.removeKeybinding(control.activeKeybindingEntry);
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_RESET,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
    primary: null,
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control && control instanceof KeybindingsEditor) {
            control.resetKeybinding(control.activeKeybindingEntry);
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_SEARCH,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS.toNegated()),
    primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */,
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control && control instanceof KeybindingsEditor) {
            control.focusSearch();
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS),
    primary: 512 /* Alt */ | 41 /* KEY_K */,
    mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 41 /* KEY_K */ },
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control && control instanceof KeybindingsEditor) {
            control.recordSearchKeys();
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
    primary: 512 /* Alt */ | 46 /* KEY_P */,
    mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 46 /* KEY_P */ },
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control && control instanceof KeybindingsEditor) {
            control.toggleSortByPrecedence();
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
    primary: null,
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control) {
            control.showSimilarKeybindings(control.activeKeybindingEntry);
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_COPY,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
    primary: 2048 /* CtrlCmd */ | 33 /* KEY_C */,
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control) {
            control.copyKeybinding(control.activeKeybindingEntry);
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
    primary: null,
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control) {
            control.copyKeybindingCommand(control.activeKeybindingEntry);
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS),
    primary: 18 /* DownArrow */,
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control) {
            control.focusKeybindings();
        }
    }
});
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(PreferencesContribution, 1 /* Starting */);
CommandsRegistry.registerCommand(OPEN_FOLDER_SETTINGS_COMMAND, function (accessor, resource) {
    var preferencesService = accessor.get(IPreferencesService);
    return preferencesService.openFolderSettings(resource);
});
CommandsRegistry.registerCommand(OpenFolderSettingsAction.ID, function (serviceAccessor) {
    serviceAccessor.get(IInstantiationService).createInstance(OpenFolderSettingsAction, OpenFolderSettingsAction.ID, OpenFolderSettingsAction.LABEL).run();
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
    command: {
        id: OpenFolderSettingsAction.ID,
        title: { value: category + ": " + OpenFolderSettingsAction.LABEL, original: 'Preferences: Open Folder Settings' },
    },
    when: new RawContextKey('workbenchState', '').isEqualTo('workspace')
});
CommandsRegistry.registerCommand(OpenWorkspaceSettingsAction.ID, function (serviceAccessor) {
    serviceAccessor.get(IInstantiationService).createInstance(OpenWorkspaceSettingsAction, OpenWorkspaceSettingsAction.ID, OpenWorkspaceSettingsAction.LABEL).run();
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
    command: {
        id: OpenWorkspaceSettingsAction.ID,
        title: { value: category + ": " + OpenWorkspaceSettingsAction.LABEL, original: 'Preferences: Open Workspace Settings' },
    },
    when: new RawContextKey('workbenchState', '').notEqualsTo('empty')
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS),
    primary: 9 /* Escape */,
    handler: function (accessor, args) {
        var control = accessor.get(IEditorService).activeControl;
        if (control) {
            control.clearSearchResults();
        }
    }
});
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
    command: {
        id: KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS,
        title: nls.localize('clearInput', "Clear Keybindings Search Input"),
        iconLocation: {
            light: URI.parse(require.toUrl("vs/workbench/parts/preferences/browser/media/clear.svg")),
            dark: URI.parse(require.toUrl("vs/workbench/parts/preferences/browser/media/clear-inverse.svg"))
        },
        precondition: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_SEARCH_VALUE)
    },
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
    group: 'navigation',
});
CommandsRegistry.registerCommand(OpenGlobalKeybindingsFileAction.ID, function (serviceAccessor) {
    serviceAccessor.get(IInstantiationService).createInstance(OpenGlobalKeybindingsFileAction, OpenGlobalKeybindingsFileAction.ID, OpenGlobalKeybindingsFileAction.LABEL).run();
});
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
    command: {
        id: OpenGlobalKeybindingsFileAction.ID,
        title: OpenGlobalKeybindingsFileAction.LABEL,
        iconLocation: {
            light: URI.parse(require.toUrl("vs/workbench/parts/preferences/browser/media/open-file.svg")),
            dark: URI.parse(require.toUrl("vs/workbench/parts/preferences/browser/media/open-file-inverse.svg"))
        }
    },
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
    group: 'navigation',
});
CommandsRegistry.registerCommand(KEYBINDINGS_EDITOR_SHOW_DEFAULT_KEYBINDINGS, function (serviceAccessor) {
    var control = serviceAccessor.get(IEditorService).activeControl;
    if (control) {
        control.search('@source:default');
    }
});
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
    command: {
        id: KEYBINDINGS_EDITOR_SHOW_DEFAULT_KEYBINDINGS,
        title: nls.localize('showDefaultKeybindings', "Show Default Keybindings")
    },
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
    group: '1_keyboard_preferences_actions'
});
CommandsRegistry.registerCommand(KEYBINDINGS_EDITOR_SHOW_USER_KEYBINDINGS, function (serviceAccessor) {
    var control = serviceAccessor.get(IEditorService).activeControl;
    if (control) {
        control.search('@source:user');
    }
});
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
    command: {
        id: KEYBINDINGS_EDITOR_SHOW_USER_KEYBINDINGS,
        title: nls.localize('showUserKeybindings', "Show User Keybindings")
    },
    when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
    group: '1_keyboard_preferences_actions'
});
var SettingsCommand = /** @class */ (function (_super) {
    __extends(SettingsCommand, _super);
    function SettingsCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SettingsCommand.prototype.getPreferencesEditor = function (accessor) {
        var activeControl = accessor.get(IEditorService).activeControl;
        if (activeControl instanceof PreferencesEditor || activeControl instanceof SettingsEditor2) {
            return activeControl;
        }
        return null;
    };
    return SettingsCommand;
}(Command));
var StartSearchDefaultSettingsCommand = /** @class */ (function (_super) {
    __extends(StartSearchDefaultSettingsCommand, _super);
    function StartSearchDefaultSettingsCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StartSearchDefaultSettingsCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor) {
            preferencesEditor.focusSearch();
        }
    };
    return StartSearchDefaultSettingsCommand;
}(SettingsCommand));
var startSearchCommand = new StartSearchDefaultSettingsCommand({
    id: SETTINGS_EDITOR_COMMAND_SEARCH,
    precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_EDITOR),
    kbOpts: { primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */, weight: 100 /* EditorContrib */ }
});
startSearchCommand.register();
var ClearSearchResultsCommand = /** @class */ (function (_super) {
    __extends(ClearSearchResultsCommand, _super);
    function ClearSearchResultsCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClearSearchResultsCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor) {
            preferencesEditor.clearSearchResults();
        }
    };
    return ClearSearchResultsCommand;
}(SettingsCommand));
var clearSearchResultsCommand = new ClearSearchResultsCommand({
    id: SETTINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS,
    precondition: CONTEXT_SETTINGS_SEARCH_FOCUS,
    kbOpts: { primary: 9 /* Escape */, weight: 100 /* EditorContrib */ }
});
clearSearchResultsCommand.register();
var FocusSettingsFileEditorCommand = /** @class */ (function (_super) {
    __extends(FocusSettingsFileEditorCommand, _super);
    function FocusSettingsFileEditorCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusSettingsFileEditorCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor instanceof PreferencesEditor) {
            preferencesEditor.focusSettingsFileEditor();
        }
        else {
            preferencesEditor.focusSettings();
        }
    };
    return FocusSettingsFileEditorCommand;
}(SettingsCommand));
var focusSettingsFileEditorCommand = new FocusSettingsFileEditorCommand({
    id: SETTINGS_EDITOR_COMMAND_FOCUS_FILE,
    precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_SEARCH_FOCUS, SuggestContext.Visible.toNegated()),
    kbOpts: { primary: 18 /* DownArrow */, weight: 100 /* EditorContrib */ }
});
focusSettingsFileEditorCommand.register();
var focusSettingsFromSearchCommand = new FocusSettingsFileEditorCommand({
    id: SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_FROM_SEARCH,
    precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_SEARCH_FOCUS, SuggestContext.Visible.toNegated()),
    kbOpts: { primary: 18 /* DownArrow */, weight: 200 /* WorkbenchContrib */ }
});
focusSettingsFromSearchCommand.register();
var FocusNextSearchResultCommand = /** @class */ (function (_super) {
    __extends(FocusNextSearchResultCommand, _super);
    function FocusNextSearchResultCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusNextSearchResultCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor instanceof PreferencesEditor) {
            preferencesEditor.focusNextResult();
        }
    };
    return FocusNextSearchResultCommand;
}(SettingsCommand));
var focusNextSearchResultCommand = new FocusNextSearchResultCommand({
    id: SETTINGS_EDITOR_COMMAND_FOCUS_NEXT_SETTING,
    precondition: CONTEXT_SETTINGS_SEARCH_FOCUS,
    kbOpts: { primary: 3 /* Enter */, weight: 100 /* EditorContrib */ }
});
focusNextSearchResultCommand.register();
var FocusPreviousSearchResultCommand = /** @class */ (function (_super) {
    __extends(FocusPreviousSearchResultCommand, _super);
    function FocusPreviousSearchResultCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusPreviousSearchResultCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor instanceof PreferencesEditor) {
            preferencesEditor.focusPreviousResult();
        }
    };
    return FocusPreviousSearchResultCommand;
}(SettingsCommand));
var focusPreviousSearchResultCommand = new FocusPreviousSearchResultCommand({
    id: SETTINGS_EDITOR_COMMAND_FOCUS_PREVIOUS_SETTING,
    precondition: CONTEXT_SETTINGS_SEARCH_FOCUS,
    kbOpts: { primary: 1024 /* Shift */ | 3 /* Enter */, weight: 100 /* EditorContrib */ }
});
focusPreviousSearchResultCommand.register();
var EditFocusedSettingCommand = /** @class */ (function (_super) {
    __extends(EditFocusedSettingCommand, _super);
    function EditFocusedSettingCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditFocusedSettingCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor instanceof PreferencesEditor) {
            preferencesEditor.editFocusedPreference();
        }
    };
    return EditFocusedSettingCommand;
}(SettingsCommand));
var editFocusedSettingCommand = new EditFocusedSettingCommand({
    id: SETTINGS_EDITOR_COMMAND_EDIT_FOCUSED_SETTING,
    precondition: CONTEXT_SETTINGS_SEARCH_FOCUS,
    kbOpts: { primary: 2048 /* CtrlCmd */ | 84 /* US_DOT */, weight: 100 /* EditorContrib */ }
});
editFocusedSettingCommand.register();
var FocusSettingsListCommand = /** @class */ (function (_super) {
    __extends(FocusSettingsListCommand, _super);
    function FocusSettingsListCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusSettingsListCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor instanceof SettingsEditor2) {
            preferencesEditor.focusSettings();
        }
    };
    return FocusSettingsListCommand;
}(SettingsCommand));
var focusSettingsListCommand = new FocusSettingsListCommand({
    id: SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_LIST,
    precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_EDITOR, CONTEXT_TOC_ROW_FOCUS),
    kbOpts: { primary: 3 /* Enter */, weight: 200 /* WorkbenchContrib */ }
});
focusSettingsListCommand.register();
var ShowContextMenuCommand = /** @class */ (function (_super) {
    __extends(ShowContextMenuCommand, _super);
    function ShowContextMenuCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShowContextMenuCommand.prototype.runCommand = function (accessor, args) {
        var preferencesEditor = this.getPreferencesEditor(accessor);
        if (preferencesEditor instanceof SettingsEditor2) {
            preferencesEditor.showContextMenu();
        }
    };
    return ShowContextMenuCommand;
}(SettingsCommand));
var showContextMenuCommand = new ShowContextMenuCommand({
    id: SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU,
    precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_EDITOR),
    kbOpts: { primary: 1024 /* Shift */ | 67 /* F9 */, weight: 200 /* WorkbenchContrib */ }
});
showContextMenuCommand.register();
// Preferences menu
MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
    group: '1_settings',
    command: {
        id: OpenSettingsAction.ID,
        title: nls.localize({ key: 'miOpenSettings', comment: ['&& denotes a mnemonic'] }, "&&Settings")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
    group: '2_keybindings',
    command: {
        id: OpenGlobalKeybindingsAction.ID,
        title: nls.localize({ key: 'miOpenKeymap', comment: ['&& denotes a mnemonic'] }, "&&Keyboard Shortcuts")
    },
    order: 1
});
