/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { join } from '../../../../base/common/paths.js';
export var IPreferencesSearchService = createDecorator('preferencesSearchService');
export var CONTEXT_SETTINGS_EDITOR = new RawContextKey('inSettingsEditor', false);
export var CONTEXT_SETTINGS_SEARCH_FOCUS = new RawContextKey('inSettingsSearch', false);
export var CONTEXT_TOC_ROW_FOCUS = new RawContextKey('settingsTocRowFocus', false);
export var CONTEXT_KEYBINDINGS_EDITOR = new RawContextKey('inKeybindings', false);
export var CONTEXT_KEYBINDINGS_SEARCH_FOCUS = new RawContextKey('inKeybindingsSearch', false);
export var CONTEXT_KEYBINDINGS_SEARCH_VALUE = new RawContextKey('hasKeybindingsSearchValue', false);
export var CONTEXT_KEYBINDING_FOCUS = new RawContextKey('keybindingFocus', false);
export var SETTINGS_EDITOR_COMMAND_SEARCH = 'settings.action.search';
export var SETTINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS = 'settings.action.clearSearchResults';
export var SETTINGS_EDITOR_COMMAND_FOCUS_NEXT_SETTING = 'settings.action.focusNextSetting';
export var SETTINGS_EDITOR_COMMAND_FOCUS_PREVIOUS_SETTING = 'settings.action.focusPreviousSetting';
export var SETTINGS_EDITOR_COMMAND_FOCUS_FILE = 'settings.action.focusSettingsFile';
export var SETTINGS_EDITOR_COMMAND_EDIT_FOCUSED_SETTING = 'settings.action.editFocusedSetting';
export var SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_FROM_SEARCH = 'settings.action.focusSettingsFromSearch';
export var SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_LIST = 'settings.action.focusSettingsList';
export var SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU = 'settings.action.showContextMenu';
export var KEYBINDINGS_EDITOR_COMMAND_SEARCH = 'keybindings.editor.searchKeybindings';
export var KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS = 'keybindings.editor.clearSearchResults';
export var KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS = 'keybindings.editor.recordSearchKeys';
export var KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE = 'keybindings.editor.toggleSortByPrecedence';
export var KEYBINDINGS_EDITOR_COMMAND_DEFINE = 'keybindings.editor.defineKeybinding';
export var KEYBINDINGS_EDITOR_COMMAND_REMOVE = 'keybindings.editor.removeKeybinding';
export var KEYBINDINGS_EDITOR_COMMAND_RESET = 'keybindings.editor.resetKeybinding';
export var KEYBINDINGS_EDITOR_COMMAND_COPY = 'keybindings.editor.copyKeybindingEntry';
export var KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND = 'keybindings.editor.copyCommandKeybindingEntry';
export var KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR = 'keybindings.editor.showConflicts';
export var KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS = 'keybindings.editor.focusKeybindings';
export var KEYBINDINGS_EDITOR_CLEAR_INPUT = 'keybindings.editor.showDefaultKeybindings';
export var KEYBINDINGS_EDITOR_SHOW_DEFAULT_KEYBINDINGS = 'keybindings.editor.showDefaultKeybindings';
export var KEYBINDINGS_EDITOR_SHOW_USER_KEYBINDINGS = 'keybindings.editor.showUserKeybindings';
export var FOLDER_SETTINGS_PATH = join('.vscode', 'settings.json');
export var DEFAULT_SETTINGS_EDITOR_SETTING = 'workbench.settings.openDefaultSettings';
