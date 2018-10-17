/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { QuickPickManyToggle, BackAction } from './quickInput.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as ActionExtensions } from '../../../common/actions.js';
import { SyncActionDescriptor } from '../../../../platform/actions/common/actions.js';
import { inQuickOpenContext } from '../quickopen/quickopen.js';
KeybindingsRegistry.registerCommandAndKeybindingRule(QuickPickManyToggle);
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(BackAction, BackAction.ID, BackAction.LABEL, { primary: null, win: { primary: 512 /* Alt */ | 15 /* LeftArrow */ }, mac: { primary: 256 /* WinCtrl */ | 83 /* US_MINUS */ }, linux: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 83 /* US_MINUS */ } }, inQuickOpenContext, 200 /* WorkbenchContrib */ + 50), 'Back');
