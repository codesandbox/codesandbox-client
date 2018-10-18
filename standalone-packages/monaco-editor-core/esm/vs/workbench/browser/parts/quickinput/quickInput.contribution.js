/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { QuickPickManyToggle, BackAction } from './quickInput';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry';
import { Registry } from '../../../../platform/registry/common/platform';
import { Extensions as ActionExtensions } from '../../../common/actions';
import { SyncActionDescriptor } from '../../../../platform/actions/common/actions';
import { inQuickOpenContext } from '../quickopen/quickopen';
KeybindingsRegistry.registerCommandAndKeybindingRule(QuickPickManyToggle);
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(BackAction, BackAction.ID, BackAction.LABEL, { primary: null, win: { primary: 512 /* Alt */ | 15 /* LeftArrow */ }, mac: { primary: 256 /* WinCtrl */ | 83 /* US_MINUS */ }, linux: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 83 /* US_MINUS */ } }, inQuickOpenContext, 200 /* WorkbenchContrib */ + 50), 'Back');
