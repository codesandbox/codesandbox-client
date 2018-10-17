/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as env from '../../../../base/common/platform.js';
import * as nls from '../../../../nls.js';
import { QuickOpenHandlerDescriptor, Extensions as QuickOpenExtensions } from '../../../browser/quickopen.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncActionDescriptor, MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { Extensions as ActionExtensions } from '../../../common/actions.js';
import { GotoSymbolAction, GOTO_SYMBOL_PREFIX, SCOPE_PREFIX, GotoSymbolHandler } from './gotoSymbolHandler.js';
import { ShowAllCommandsAction, ALL_COMMANDS_PREFIX, ClearCommandHistoryAction, CommandsHandler } from './commandsHandler.js';
import { GotoLineAction, GOTO_LINE_PREFIX, GotoLineHandler } from './gotoLineHandler.js';
import { HELP_PREFIX, HelpHandler } from './helpHandler.js';
import { VIEW_PICKER_PREFIX, OpenViewPickerAction, QuickOpenViewPickerAction, ViewPickerHandler } from './viewPickerHandler.js';
import { inQuickOpenContext, getQuickNavigateHandler } from '../../../browser/parts/quickopen/quickopen.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
// Register Actions
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(ClearCommandHistoryAction, ClearCommandHistoryAction.ID, ClearCommandHistoryAction.LABEL), 'Clear Command History');
registry.registerWorkbenchAction(new SyncActionDescriptor(ShowAllCommandsAction, ShowAllCommandsAction.ID, ShowAllCommandsAction.LABEL, {
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 46 /* KEY_P */,
    secondary: [59 /* F1 */]
}), 'Show All Commands');
registry.registerWorkbenchAction(new SyncActionDescriptor(GotoLineAction, GotoLineAction.ID, GotoLineAction.LABEL, {
    primary: 2048 /* CtrlCmd */ | 37 /* KEY_G */,
    mac: { primary: 256 /* WinCtrl */ | 37 /* KEY_G */ }
}), 'Go to Line...');
registry.registerWorkbenchAction(new SyncActionDescriptor(GotoSymbolAction, GotoSymbolAction.ID, GotoSymbolAction.LABEL, {
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 45 /* KEY_O */
}), 'Go to Symbol in File...');
var inViewsPickerContextKey = 'inViewsPicker';
var inViewsPickerContext = ContextKeyExpr.and(inQuickOpenContext, ContextKeyExpr.has(inViewsPickerContextKey));
var viewPickerKeybinding = { primary: 2048 /* CtrlCmd */ | 47 /* KEY_Q */, mac: { primary: 256 /* WinCtrl */ | 47 /* KEY_Q */ }, linux: { primary: null } };
var viewCategory = nls.localize('view', "View");
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenViewPickerAction, OpenViewPickerAction.ID, OpenViewPickerAction.LABEL), 'View: Open View', viewCategory);
registry.registerWorkbenchAction(new SyncActionDescriptor(QuickOpenViewPickerAction, QuickOpenViewPickerAction.ID, QuickOpenViewPickerAction.LABEL, viewPickerKeybinding), 'View: Quick Open View', viewCategory);
var quickOpenNavigateNextInViewPickerId = 'workbench.action.quickOpenNavigateNextInViewPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: quickOpenNavigateNextInViewPickerId,
    weight: 200 /* WorkbenchContrib */ + 50,
    handler: getQuickNavigateHandler(quickOpenNavigateNextInViewPickerId, true),
    when: inViewsPickerContext,
    primary: viewPickerKeybinding.primary,
    linux: viewPickerKeybinding.linux,
    mac: viewPickerKeybinding.mac
});
var quickOpenNavigatePreviousInViewPickerId = 'workbench.action.quickOpenNavigatePreviousInViewPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: quickOpenNavigatePreviousInViewPickerId,
    weight: 200 /* WorkbenchContrib */ + 50,
    handler: getQuickNavigateHandler(quickOpenNavigatePreviousInViewPickerId, false),
    when: inViewsPickerContext,
    primary: viewPickerKeybinding.primary | 1024 /* Shift */,
    linux: viewPickerKeybinding.linux,
    mac: {
        primary: viewPickerKeybinding.mac.primary | 1024 /* Shift */
    }
});
// Register Quick Open Handler
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(CommandsHandler, CommandsHandler.ID, ALL_COMMANDS_PREFIX, 'inCommandsPicker', nls.localize('commandsHandlerDescriptionDefault', "Show and Run Commands")));
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(GotoLineHandler, GotoLineHandler.ID, GOTO_LINE_PREFIX, null, [
    {
        prefix: GOTO_LINE_PREFIX,
        needsEditor: true,
        description: env.isMacintosh ? nls.localize('gotoLineDescriptionMac', "Go to Line") : nls.localize('gotoLineDescriptionWin', "Go to Line")
    },
]));
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(GotoSymbolHandler, GotoSymbolHandler.ID, GOTO_SYMBOL_PREFIX, 'inFileSymbolsPicker', [
    {
        prefix: GOTO_SYMBOL_PREFIX,
        needsEditor: true,
        description: nls.localize('gotoSymbolDescription', "Go to Symbol in File")
    },
    {
        prefix: GOTO_SYMBOL_PREFIX + SCOPE_PREFIX,
        needsEditor: true,
        description: nls.localize('gotoSymbolDescriptionScoped', "Go to Symbol in File by Category")
    }
]));
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(HelpHandler, HelpHandler.ID, HELP_PREFIX, null, nls.localize('helpDescription', "Show Help")));
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(ViewPickerHandler, ViewPickerHandler.ID, VIEW_PICKER_PREFIX, inViewsPickerContextKey, [
    {
        prefix: VIEW_PICKER_PREFIX,
        needsEditor: false,
        description: nls.localize('viewPickerDescription', "Open View")
    }
]));
// View menu
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '1_open',
    command: {
        id: ShowAllCommandsAction.ID,
        title: nls.localize({ key: 'miCommandPalette', comment: ['&& denotes a mnemonic'] }, "&&Command Palette...")
    },
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '1_open',
    command: {
        id: OpenViewPickerAction.ID,
        title: nls.localize({ key: 'miOpenView', comment: ['&& denotes a mnemonic'] }, "&&Open View...")
    },
    order: 2
});
// Go to menu
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
    group: 'z_go_to',
    command: {
        id: 'workbench.action.gotoSymbol',
        title: nls.localize({ key: 'miGotoSymbolInFile', comment: ['&& denotes a mnemonic'] }, "Go to &&Symbol in File...")
    },
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
    group: 'z_go_to',
    command: {
        id: 'workbench.action.gotoLine',
        title: nls.localize({ key: 'miGotoLine', comment: ['&& denotes a mnemonic'] }, "Go to &&Line...")
    },
    order: 7
});
