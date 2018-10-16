/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls';
import * as types from '../../../../base/common/types';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry';
import { TextCompareEditorVisibleContext, ActiveEditorGroupEmptyContext, MultipleEditorGroupsContext } from '../../../common/editor';
import { IEditorService } from '../../../services/editor/common/editorService';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys';
import { TextDiffEditor } from './textDiffEditor';
import { KeyChord } from '../../../../base/common/keyCodes';
import { TPromise } from '../../../../base/common/winjs.base';
import { URI } from '../../../../base/common/uri';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen';
import { IListService } from '../../../../platform/list/browser/listService';
import { List } from '../../../../base/browser/ui/list/listWidget';
import { distinct } from '../../../../base/common/arrays';
import { IEditorGroupsService, preferredSideBySideGroupDirection } from '../../../services/group/common/editorGroupsService';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { CommandsRegistry } from '../../../../platform/commands/common/commands';
import { MenuRegistry, MenuId } from '../../../../platform/actions/common/actions';
import { INotificationService } from '../../../../platform/notification/common/notification';
export var CLOSE_SAVED_EDITORS_COMMAND_ID = 'workbench.action.closeUnmodifiedEditors';
export var CLOSE_EDITORS_IN_GROUP_COMMAND_ID = 'workbench.action.closeEditorsInGroup';
export var CLOSE_EDITORS_AND_GROUP_COMMAND_ID = 'workbench.action.closeEditorsAndGroup';
export var CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID = 'workbench.action.closeEditorsToTheRight';
export var CLOSE_EDITOR_COMMAND_ID = 'workbench.action.closeActiveEditor';
export var CLOSE_EDITOR_GROUP_COMMAND_ID = 'workbench.action.closeGroup';
export var CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID = 'workbench.action.closeOtherEditors';
export var MOVE_ACTIVE_EDITOR_COMMAND_ID = 'moveActiveEditor';
export var LAYOUT_EDITOR_GROUPS_COMMAND_ID = 'layoutEditorGroups';
export var KEEP_EDITOR_COMMAND_ID = 'workbench.action.keepEditor';
export var SHOW_EDITORS_IN_GROUP = 'workbench.action.showEditorsInGroup';
export var TOGGLE_DIFF_SIDE_BY_SIDE = 'toggle.diff.renderSideBySide';
export var GOTO_NEXT_CHANGE = 'workbench.action.compareEditor.nextChange';
export var GOTO_PREVIOUS_CHANGE = 'workbench.action.compareEditor.previousChange';
export var TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE = 'toggle.diff.ignoreTrimWhitespace';
export var SPLIT_EDITOR_UP = 'workbench.action.splitEditorUp';
export var SPLIT_EDITOR_DOWN = 'workbench.action.splitEditorDown';
export var SPLIT_EDITOR_LEFT = 'workbench.action.splitEditorLeft';
export var SPLIT_EDITOR_RIGHT = 'workbench.action.splitEditorRight';
export var NAVIGATE_ALL_EDITORS_GROUP_PREFIX = 'edt ';
export var NAVIGATE_IN_ACTIVE_GROUP_PREFIX = 'edt active ';
export var OPEN_EDITOR_AT_INDEX_COMMAND_ID = 'workbench.action.openEditorAtIndex';
var isActiveEditorMoveArg = function (arg) {
    if (!types.isObject(arg)) {
        return false;
    }
    if (!types.isString(arg.to)) {
        return false;
    }
    if (!types.isUndefined(arg.by) && !types.isString(arg.by)) {
        return false;
    }
    if (!types.isUndefined(arg.value) && !types.isNumber(arg.value)) {
        return false;
    }
    return true;
};
function registerActiveEditorMoveCommand() {
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: MOVE_ACTIVE_EDITOR_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: EditorContextKeys.editorTextFocus,
        primary: null,
        handler: function (accessor, args) { return moveActiveEditor(args, accessor); },
        description: {
            description: nls.localize('editorCommand.activeEditorMove.description', "Move the active editor by tabs or groups"),
            args: [
                {
                    name: nls.localize('editorCommand.activeEditorMove.arg.name', "Active editor move argument"),
                    description: nls.localize('editorCommand.activeEditorMove.arg.description', "Argument Properties:\n\t* 'to': String value providing where to move.\n\t* 'by': String value providing the unit for move (by tab or by group).\n\t* 'value': Number value providing how many positions or an absolute position to move."),
                    constraint: isActiveEditorMoveArg
                }
            ]
        }
    });
}
function moveActiveEditor(args, accessor) {
    if (args === void 0) { args = Object.create(null); }
    args.to = args.to || 'right';
    args.by = args.by || 'tab';
    args.value = typeof args.value === 'number' ? args.value : 1;
    var activeControl = accessor.get(IEditorService).activeControl;
    if (activeControl) {
        switch (args.by) {
            case 'tab':
                return moveActiveTab(args, activeControl, accessor);
            case 'group':
                return moveActiveEditorToGroup(args, activeControl, accessor);
        }
    }
}
function moveActiveTab(args, control, accessor) {
    var group = control.group;
    var index = group.getIndexOfEditor(control.input);
    switch (args.to) {
        case 'first':
            index = 0;
            break;
        case 'last':
            index = group.count - 1;
            break;
        case 'left':
            index = index - args.value;
            break;
        case 'right':
            index = index + args.value;
            break;
        case 'center':
            index = Math.round(group.count / 2) - 1;
            break;
        case 'position':
            index = args.value - 1;
            break;
    }
    index = index < 0 ? 0 : index >= group.count ? group.count - 1 : index;
    group.moveEditor(control.input, group, { index: index });
}
function moveActiveEditorToGroup(args, control, accessor) {
    var editorGroupService = accessor.get(IEditorGroupsService);
    var configurationService = accessor.get(IConfigurationService);
    var sourceGroup = control.group;
    var targetGroup;
    switch (args.to) {
        case 'left':
            targetGroup = editorGroupService.findGroup({ direction: 2 /* LEFT */ }, sourceGroup);
            if (!targetGroup) {
                targetGroup = editorGroupService.addGroup(sourceGroup, 2 /* LEFT */);
            }
            break;
        case 'right':
            targetGroup = editorGroupService.findGroup({ direction: 3 /* RIGHT */ }, sourceGroup);
            if (!targetGroup) {
                targetGroup = editorGroupService.addGroup(sourceGroup, 3 /* RIGHT */);
            }
            break;
        case 'up':
            targetGroup = editorGroupService.findGroup({ direction: 0 /* UP */ }, sourceGroup);
            if (!targetGroup) {
                targetGroup = editorGroupService.addGroup(sourceGroup, 0 /* UP */);
            }
            break;
        case 'down':
            targetGroup = editorGroupService.findGroup({ direction: 1 /* DOWN */ }, sourceGroup);
            if (!targetGroup) {
                targetGroup = editorGroupService.addGroup(sourceGroup, 1 /* DOWN */);
            }
            break;
        case 'first':
            targetGroup = editorGroupService.findGroup({ location: 0 /* FIRST */ }, sourceGroup);
            break;
        case 'last':
            targetGroup = editorGroupService.findGroup({ location: 1 /* LAST */ }, sourceGroup);
            break;
        case 'previous':
            targetGroup = editorGroupService.findGroup({ location: 3 /* PREVIOUS */ }, sourceGroup);
            break;
        case 'next':
            targetGroup = editorGroupService.findGroup({ location: 2 /* NEXT */ }, sourceGroup);
            if (!targetGroup) {
                targetGroup = editorGroupService.addGroup(sourceGroup, preferredSideBySideGroupDirection(configurationService));
            }
            break;
        case 'center':
            targetGroup = editorGroupService.getGroups(2 /* GRID_APPEARANCE */)[(editorGroupService.count / 2) - 1];
            break;
        case 'position':
            targetGroup = editorGroupService.getGroups(2 /* GRID_APPEARANCE */)[args.value - 1];
            break;
    }
    if (targetGroup) {
        sourceGroup.moveEditor(control.input, targetGroup);
        targetGroup.focus();
    }
}
function registerEditorGroupsLayoutCommand() {
    CommandsRegistry.registerCommand(LAYOUT_EDITOR_GROUPS_COMMAND_ID, function (accessor, args) {
        if (!args || typeof args !== 'object') {
            return;
        }
        var editorGroupService = accessor.get(IEditorGroupsService);
        editorGroupService.applyLayout(args);
    });
}
export function mergeAllGroups(editorGroupService) {
    var target = editorGroupService.activeGroup;
    editorGroupService.getGroups(1 /* MOST_RECENTLY_ACTIVE */).forEach(function (group) {
        if (group === target) {
            return; // keep target
        }
        editorGroupService.mergeGroup(group, target);
    });
}
function registerDiffEditorCommands() {
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: GOTO_NEXT_CHANGE,
        weight: 200 /* WorkbenchContrib */,
        when: TextCompareEditorVisibleContext,
        primary: 512 /* Alt */ | 63 /* F5 */,
        handler: function (accessor) { return navigateInDiffEditor(accessor, true); }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: GOTO_PREVIOUS_CHANGE,
        weight: 200 /* WorkbenchContrib */,
        when: TextCompareEditorVisibleContext,
        primary: 512 /* Alt */ | 1024 /* Shift */ | 63 /* F5 */,
        handler: function (accessor) { return navigateInDiffEditor(accessor, false); }
    });
    function navigateInDiffEditor(accessor, next) {
        var editorService = accessor.get(IEditorService);
        var candidates = [editorService.activeControl].concat(editorService.visibleControls).filter(function (e) { return e instanceof TextDiffEditor; });
        if (candidates.length > 0) {
            next ? candidates[0].getDiffNavigator().next() : candidates[0].getDiffNavigator().previous();
        }
    }
    function toggleDiffSideBySide(accessor) {
        var configurationService = accessor.get(IConfigurationService);
        var newValue = !configurationService.getValue('diffEditor.renderSideBySide');
        configurationService.updateValue('diffEditor.renderSideBySide', newValue, 1 /* USER */);
    }
    function toggleDiffIgnoreTrimWhitespace(accessor) {
        var configurationService = accessor.get(IConfigurationService);
        var newValue = !configurationService.getValue('diffEditor.ignoreTrimWhitespace');
        configurationService.updateValue('diffEditor.ignoreTrimWhitespace', newValue, 1 /* USER */);
    }
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: TOGGLE_DIFF_SIDE_BY_SIDE,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        primary: void 0,
        handler: function (accessor) { return toggleDiffSideBySide(accessor); }
    });
    // TODO@Ben remove me after a while
    CommandsRegistry.registerCommand('toggle.diff.editorMode', function (accessor) {
        toggleDiffSideBySide(accessor);
        accessor.get(INotificationService).warn(nls.localize('diffCommandDeprecation', "Command 'toggle.diff.editorMode' has been deprecated. Please use '{0}' instead.", TOGGLE_DIFF_SIDE_BY_SIDE));
    });
    MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
        command: {
            id: TOGGLE_DIFF_SIDE_BY_SIDE,
            title: {
                value: nls.localize('toggleInlineView', "Toggle Inline View"),
                original: 'Compare: Toggle Inline View'
            },
            category: nls.localize('compare', "Compare")
        },
        when: ContextKeyExpr.has('textCompareEditorActive')
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        primary: void 0,
        handler: function (accessor) { return toggleDiffIgnoreTrimWhitespace(accessor); }
    });
}
function registerOpenEditorAtIndexCommands() {
    var openEditorAtIndex = function (accessor, editorIndex) {
        var editorService = accessor.get(IEditorService);
        var activeControl = editorService.activeControl;
        if (activeControl) {
            var editor = activeControl.group.getEditor(editorIndex);
            if (editor) {
                editorService.openEditor(editor);
            }
        }
    };
    // This command takes in the editor index number to open as an argument
    CommandsRegistry.registerCommand({
        id: OPEN_EDITOR_AT_INDEX_COMMAND_ID,
        handler: openEditorAtIndex
    });
    var _loop_1 = function (i) {
        var editorIndex = i;
        var visibleIndex = i + 1;
        KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: OPEN_EDITOR_AT_INDEX_COMMAND_ID + visibleIndex,
            weight: 200 /* WorkbenchContrib */,
            when: void 0,
            primary: 512 /* Alt */ | toKeyCode(visibleIndex),
            mac: { primary: 256 /* WinCtrl */ | toKeyCode(visibleIndex) },
            handler: function (accessor) { return openEditorAtIndex(accessor, editorIndex); }
        });
    };
    // Keybindings to focus a specific index in the tab folder if tabs are enabled
    for (var i = 0; i < 9; i++) {
        _loop_1(i);
    }
    function toKeyCode(index) {
        switch (index) {
            case 0: return 21 /* KEY_0 */;
            case 1: return 22 /* KEY_1 */;
            case 2: return 23 /* KEY_2 */;
            case 3: return 24 /* KEY_3 */;
            case 4: return 25 /* KEY_4 */;
            case 5: return 26 /* KEY_5 */;
            case 6: return 27 /* KEY_6 */;
            case 7: return 28 /* KEY_7 */;
            case 8: return 29 /* KEY_8 */;
            case 9: return 30 /* KEY_9 */;
        }
        return void 0;
    }
}
function registerFocusEditorGroupAtIndexCommands() {
    var _loop_2 = function (groupIndex) {
        KeybindingsRegistry.registerCommandAndKeybindingRule({
            id: toCommandId(groupIndex),
            weight: 200 /* WorkbenchContrib */,
            when: void 0,
            primary: 2048 /* CtrlCmd */ | toKeyCode(groupIndex),
            handler: function (accessor) {
                var editorGroupService = accessor.get(IEditorGroupsService);
                var configurationService = accessor.get(IConfigurationService);
                // To keep backwards compatibility (pre-grid), allow to focus a group
                // that does not exist as long as it is the next group after the last
                // opened group. Otherwise we return.
                if (groupIndex > editorGroupService.count) {
                    return;
                }
                // Group exists: just focus
                var groups = editorGroupService.getGroups(2 /* GRID_APPEARANCE */);
                if (groups[groupIndex]) {
                    return groups[groupIndex].focus();
                }
                // Group does not exist: create new by splitting the active one of the last group
                var direction = preferredSideBySideGroupDirection(configurationService);
                var lastGroup = editorGroupService.findGroup({ location: 1 /* LAST */ });
                var newGroup = editorGroupService.addGroup(lastGroup, direction);
                // Focus
                newGroup.focus();
            }
        });
    };
    // Keybindings to focus a specific group (2-8) in the editor area
    for (var groupIndex = 1; groupIndex < 8; groupIndex++) {
        _loop_2(groupIndex);
    }
    function toCommandId(index) {
        switch (index) {
            case 1: return 'workbench.action.focusSecondEditorGroup';
            case 2: return 'workbench.action.focusThirdEditorGroup';
            case 3: return 'workbench.action.focusFourthEditorGroup';
            case 4: return 'workbench.action.focusFifthEditorGroup';
            case 5: return 'workbench.action.focusSixthEditorGroup';
            case 6: return 'workbench.action.focusSeventhEditorGroup';
            case 7: return 'workbench.action.focusEighthEditorGroup';
        }
        return void 0;
    }
    function toKeyCode(index) {
        switch (index) {
            case 1: return 23 /* KEY_2 */;
            case 2: return 24 /* KEY_3 */;
            case 3: return 25 /* KEY_4 */;
            case 4: return 26 /* KEY_5 */;
            case 5: return 27 /* KEY_6 */;
            case 6: return 28 /* KEY_7 */;
            case 7: return 29 /* KEY_8 */;
        }
        return void 0;
    }
}
export function splitEditor(editorGroupService, direction, context) {
    var sourceGroup;
    if (context && typeof context.groupId === 'number') {
        sourceGroup = editorGroupService.getGroup(context.groupId);
    }
    else {
        sourceGroup = editorGroupService.activeGroup;
    }
    // Add group
    var newGroup = editorGroupService.addGroup(sourceGroup, direction);
    // Split editor (if it can be split)
    var editorToCopy;
    if (context && typeof context.editorIndex === 'number') {
        editorToCopy = sourceGroup.getEditor(context.editorIndex);
    }
    else {
        editorToCopy = sourceGroup.activeEditor;
    }
    if (editorToCopy && editorToCopy.supportsSplitEditor()) {
        sourceGroup.copyEditor(editorToCopy, newGroup);
    }
    // Focus
    newGroup.focus();
}
function registerSplitEditorCommands() {
    [
        { id: SPLIT_EDITOR_UP, direction: 0 /* UP */ },
        { id: SPLIT_EDITOR_DOWN, direction: 1 /* DOWN */ },
        { id: SPLIT_EDITOR_LEFT, direction: 2 /* LEFT */ },
        { id: SPLIT_EDITOR_RIGHT, direction: 3 /* RIGHT */ }
    ].forEach(function (_a) {
        var id = _a.id, direction = _a.direction;
        CommandsRegistry.registerCommand(id, function (accessor, resourceOrContext, context) {
            splitEditor(accessor.get(IEditorGroupsService), direction, getCommandsContext(resourceOrContext, context));
        });
    });
}
function registerCloseEditorCommands() {
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: CLOSE_SAVED_EDITORS_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 51 /* KEY_U */),
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var contexts = getMultiSelectedEditorContexts(getCommandsContext(resourceOrContext, context), accessor.get(IListService), editorGroupService);
            var activeGroup = editorGroupService.activeGroup;
            if (contexts.length === 0) {
                contexts.push({ groupId: activeGroup.id }); // active group as fallback
            }
            return Promise.all(distinct(contexts.map(function (c) { return c.groupId; })).map(function (groupId) {
                return editorGroupService.getGroup(groupId).closeEditors({ savedOnly: true });
            }));
        }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        // CODESANDBOX CHANGE
        primary: KeyChord(256 /* WinCtrl */ | 41 /* KEY_K */, 53 /* KEY_W */),
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var contexts = getMultiSelectedEditorContexts(getCommandsContext(resourceOrContext, context), accessor.get(IListService), editorGroupService);
            var distinctGroupIds = distinct(contexts.map(function (c) { return c.groupId; }));
            if (distinctGroupIds.length === 0) {
                distinctGroupIds.push(editorGroupService.activeGroup.id);
            }
            return Promise.all(distinctGroupIds.map(function (groupId) {
                return editorGroupService.getGroup(groupId).closeAllEditors();
            }));
        }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: CLOSE_EDITOR_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        // CODESANDBOX CHANGE
        primary: 256 /* WinCtrl */ | 53 /* KEY_W */,
        win: { primary: 2048 /* CtrlCmd */ | 62 /* F4 */, secondary: [2048 /* CtrlCmd */ | 53 /* KEY_W */] },
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var contexts = getMultiSelectedEditorContexts(getCommandsContext(resourceOrContext, context), accessor.get(IListService), editorGroupService);
            var activeGroup = editorGroupService.activeGroup;
            if (contexts.length === 0 && activeGroup.activeEditor) {
                contexts.push({ groupId: activeGroup.id, editorIndex: activeGroup.getIndexOfEditor(activeGroup.activeEditor) }); // active editor as fallback
            }
            var groupIds = distinct(contexts.map(function (context) { return context.groupId; }));
            return Promise.all(groupIds.map(function (groupId) {
                var group = editorGroupService.getGroup(groupId);
                var editors = contexts
                    .filter(function (context) { return context.groupId === groupId; })
                    .map(function (context) { return typeof context.editorIndex === 'number' ? group.getEditor(context.editorIndex) : group.activeEditor; });
                return group.closeEditors(editors);
            }));
        }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: CLOSE_EDITOR_GROUP_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: ContextKeyExpr.and(ActiveEditorGroupEmptyContext, MultipleEditorGroupsContext),
        // CODESANDBOX CHANGE
        primary: 256 /* WinCtrl */ | 53 /* KEY_W */,
        win: { primary: 2048 /* CtrlCmd */ | 62 /* F4 */, secondary: [2048 /* CtrlCmd */ | 53 /* KEY_W */] },
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var commandsContext = getCommandsContext(resourceOrContext, context);
            var group;
            if (commandsContext && typeof commandsContext.groupId === 'number') {
                group = editorGroupService.getGroup(commandsContext.groupId);
            }
            else {
                group = editorGroupService.activeGroup;
            }
            editorGroupService.removeGroup(group);
        }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        primary: void 0,
        mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 50 /* KEY_T */ },
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var contexts = getMultiSelectedEditorContexts(getCommandsContext(resourceOrContext, context), accessor.get(IListService), editorGroupService);
            var activeGroup = editorGroupService.activeGroup;
            if (contexts.length === 0 && activeGroup.activeEditor) {
                contexts.push({ groupId: activeGroup.id, editorIndex: activeGroup.getIndexOfEditor(activeGroup.activeEditor) }); // active editor as fallback
            }
            var groupIds = distinct(contexts.map(function (context) { return context.groupId; }));
            return Promise.all(groupIds.map(function (groupId) {
                var group = editorGroupService.getGroup(groupId);
                var editors = contexts
                    .filter(function (context) { return context.groupId === groupId; })
                    .map(function (context) { return typeof context.editorIndex === 'number' ? group.getEditor(context.editorIndex) : group.activeEditor; });
                var editorsToClose = group.editors.filter(function (e) { return editors.indexOf(e) === -1; });
                return group.closeEditors(editorsToClose);
            }));
        }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        primary: void 0,
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var _a = resolveCommandsContext(editorGroupService, getCommandsContext(resourceOrContext, context)), group = _a.group, editor = _a.editor;
            if (group && editor) {
                return group.closeEditors({ direction: 1 /* RIGHT */, except: editor });
            }
            return TPromise.as(false);
        }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: KEEP_EDITOR_COMMAND_ID,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 3 /* Enter */),
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var _a = resolveCommandsContext(editorGroupService, getCommandsContext(resourceOrContext, context)), group = _a.group, editor = _a.editor;
            if (group && editor) {
                return group.pinEditor(editor);
            }
            return TPromise.as(false);
        }
    });
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: SHOW_EDITORS_IN_GROUP,
        weight: 200 /* WorkbenchContrib */,
        when: void 0,
        primary: void 0,
        handler: function (accessor, resourceOrContext, context) {
            var editorGroupService = accessor.get(IEditorGroupsService);
            var quickOpenService = accessor.get(IQuickOpenService);
            if (editorGroupService.count <= 1) {
                return quickOpenService.show(NAVIGATE_ALL_EDITORS_GROUP_PREFIX);
            }
            var commandsContext = getCommandsContext(resourceOrContext, context);
            if (commandsContext && typeof commandsContext.groupId === 'number') {
                editorGroupService.activateGroup(editorGroupService.getGroup(commandsContext.groupId)); // we need the group to be active
            }
            return quickOpenService.show(NAVIGATE_IN_ACTIVE_GROUP_PREFIX);
        }
    });
    CommandsRegistry.registerCommand(CLOSE_EDITORS_AND_GROUP_COMMAND_ID, function (accessor, resourceOrContext, context) {
        var editorGroupService = accessor.get(IEditorGroupsService);
        var group = resolveCommandsContext(editorGroupService, getCommandsContext(resourceOrContext, context)).group;
        if (group) {
            return group.closeAllEditors().then(function () {
                if (group.count === 0 && editorGroupService.getGroup(group.id) /* could be gone by now */) {
                    editorGroupService.removeGroup(group); // only remove group if it is now empty
                }
            });
        }
        return void 0;
    });
}
function getCommandsContext(resourceOrContext, context) {
    if (URI.isUri(resourceOrContext)) {
        return context;
    }
    if (resourceOrContext && typeof resourceOrContext.groupId === 'number') {
        return resourceOrContext;
    }
    if (context && typeof context.groupId === 'number') {
        return context;
    }
    return void 0;
}
function resolveCommandsContext(editorGroupService, context) {
    // Resolve from context
    var group = context && typeof context.groupId === 'number' ? editorGroupService.getGroup(context.groupId) : undefined;
    var editor = group && typeof context.editorIndex === 'number' ? group.getEditor(context.editorIndex) : undefined;
    var control = group ? group.activeControl : undefined;
    // Fallback to active group as needed
    if (!group) {
        group = editorGroupService.activeGroup;
        editor = group.activeEditor;
        control = group.activeControl;
    }
    return { group: group, editor: editor, control: control };
}
export function getMultiSelectedEditorContexts(editorContext, listService, editorGroupService) {
    // First check for a focused list to return the selected items from
    var list = listService.lastFocusedList;
    if (list instanceof List && list.isDOMFocused()) {
        var elementToContext = function (element) {
            if (isEditorGroup(element)) {
                return { groupId: element.id, editorIndex: void 0 };
            }
            return { groupId: element.groupId, editorIndex: editorGroupService.getGroup(element.groupId).getIndexOfEditor(element.editor) };
        };
        var onlyEditorGroupAndEditor = function (e) { return isEditorGroup(e) || isEditorIdentifier(e); };
        var focusedElements = list.getFocusedElements().filter(onlyEditorGroupAndEditor);
        var focus_1 = editorContext ? editorContext : focusedElements.length ? focusedElements.map(elementToContext)[0] : void 0; // need to take into account when editor context is { group: group }
        if (focus_1) {
            var selection = list.getSelectedElements().filter(onlyEditorGroupAndEditor);
            // Only respect selection if it contains focused element
            if (selection && selection.some(function (s) { return isEditorGroup(s) ? s.id === focus_1.groupId : s.groupId === focus_1.groupId && editorGroupService.getGroup(s.groupId).getIndexOfEditor(s.editor) === focus_1.editorIndex; })) {
                return selection.map(elementToContext);
            }
            return [focus_1];
        }
    }
    // Otherwise go with passed in context
    return !!editorContext ? [editorContext] : [];
}
function isEditorGroup(thing) {
    var group = thing;
    return group && typeof group.id === 'number' && Array.isArray(group.editors);
}
function isEditorIdentifier(thing) {
    var identifier = thing;
    return identifier && typeof identifier.groupId === 'number';
}
export function setup() {
    registerActiveEditorMoveCommand();
    registerEditorGroupsLayoutCommand();
    registerDiffEditorCommands();
    registerOpenEditorAtIndexCommands();
    registerCloseEditorCommands();
    registerFocusEditorGroupAtIndexCommands();
    registerSplitEditorCommands();
}
