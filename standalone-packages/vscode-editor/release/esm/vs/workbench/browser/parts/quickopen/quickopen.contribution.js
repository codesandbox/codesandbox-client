/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { Extensions as ActionExtensions } from '../../../common/actions.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { RemoveFromEditorHistoryAction } from './quickOpenController.js';
import { QuickOpenSelectNextAction, QuickOpenSelectPreviousAction, inQuickOpenContext, getQuickNavigateHandler, QuickOpenNavigateNextAction, QuickOpenNavigatePreviousAction, defaultQuickOpenContext, QUICKOPEN_ACTION_ID, QUICKOPEN_ACION_LABEL } from './quickopen.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'workbench.action.closeQuickOpen',
    weight: 200 /* WorkbenchContrib */,
    when: inQuickOpenContext,
    primary: 9 /* Escape */, secondary: [1024 /* Shift */ | 9 /* Escape */],
    handler: function (accessor) {
        var quickOpenService = accessor.get(IQuickOpenService);
        quickOpenService.close();
        var quickInputService = accessor.get(IQuickInputService);
        return quickInputService.cancel();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'workbench.action.acceptSelectedQuickOpenItem',
    weight: 200 /* WorkbenchContrib */,
    when: inQuickOpenContext,
    primary: null,
    handler: function (accessor) {
        var quickOpenService = accessor.get(IQuickOpenService);
        quickOpenService.accept();
        var quickInputService = accessor.get(IQuickInputService);
        return quickInputService.accept();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'workbench.action.focusQuickOpen',
    weight: 200 /* WorkbenchContrib */,
    when: inQuickOpenContext,
    primary: null,
    handler: function (accessor) {
        var quickOpenService = accessor.get(IQuickOpenService);
        quickOpenService.focus();
        var quickInputService = accessor.get(IQuickInputService);
        quickInputService.focus();
    }
});
var registry = Registry.as(ActionExtensions.WorkbenchActions);
var globalQuickOpenKeybinding = { primary: 2048 /* CtrlCmd */ | 46 /* KEY_P */, secondary: [2048 /* CtrlCmd */ | 35 /* KEY_E */], mac: { primary: 2048 /* CtrlCmd */ | 46 /* KEY_P */, secondary: null } };
KeybindingsRegistry.registerKeybindingRule({
    id: QUICKOPEN_ACTION_ID,
    weight: 200 /* WorkbenchContrib */,
    when: undefined,
    primary: globalQuickOpenKeybinding.primary,
    secondary: globalQuickOpenKeybinding.secondary,
    mac: globalQuickOpenKeybinding.mac
});
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
    command: { id: QUICKOPEN_ACTION_ID, title: { value: QUICKOPEN_ACION_LABEL, original: 'Go to File...' } }
});
registry.registerWorkbenchAction(new SyncActionDescriptor(QuickOpenSelectNextAction, QuickOpenSelectNextAction.ID, QuickOpenSelectNextAction.LABEL, { primary: null, mac: { primary: 256 /* WinCtrl */ | 44 /* KEY_N */ } }, inQuickOpenContext, 200 /* WorkbenchContrib */ + 50), 'Select Next in Quick Open');
registry.registerWorkbenchAction(new SyncActionDescriptor(QuickOpenSelectPreviousAction, QuickOpenSelectPreviousAction.ID, QuickOpenSelectPreviousAction.LABEL, { primary: null, mac: { primary: 256 /* WinCtrl */ | 46 /* KEY_P */ } }, inQuickOpenContext, 200 /* WorkbenchContrib */ + 50), 'Select Previous in Quick Open');
registry.registerWorkbenchAction(new SyncActionDescriptor(QuickOpenNavigateNextAction, QuickOpenNavigateNextAction.ID, QuickOpenNavigateNextAction.LABEL), 'Navigate Next in Quick Open');
registry.registerWorkbenchAction(new SyncActionDescriptor(QuickOpenNavigatePreviousAction, QuickOpenNavigatePreviousAction.ID, QuickOpenNavigatePreviousAction.LABEL), 'Navigate Previous in Quick Open');
registry.registerWorkbenchAction(new SyncActionDescriptor(RemoveFromEditorHistoryAction, RemoveFromEditorHistoryAction.ID, RemoveFromEditorHistoryAction.LABEL), 'Remove From History');
var quickOpenNavigateNextInFilePickerId = 'workbench.action.quickOpenNavigateNextInFilePicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: quickOpenNavigateNextInFilePickerId,
    weight: 200 /* WorkbenchContrib */ + 50,
    handler: getQuickNavigateHandler(quickOpenNavigateNextInFilePickerId, true),
    when: defaultQuickOpenContext,
    primary: globalQuickOpenKeybinding.primary,
    secondary: globalQuickOpenKeybinding.secondary,
    mac: globalQuickOpenKeybinding.mac
});
var quickOpenNavigatePreviousInFilePickerId = 'workbench.action.quickOpenNavigatePreviousInFilePicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: quickOpenNavigatePreviousInFilePickerId,
    weight: 200 /* WorkbenchContrib */ + 50,
    handler: getQuickNavigateHandler(quickOpenNavigatePreviousInFilePickerId, false),
    when: defaultQuickOpenContext,
    primary: globalQuickOpenKeybinding.primary | 1024 /* Shift */,
    secondary: [globalQuickOpenKeybinding.secondary[0] | 1024 /* Shift */],
    mac: {
        primary: globalQuickOpenKeybinding.mac.primary | 1024 /* Shift */,
        secondary: null
    }
});
