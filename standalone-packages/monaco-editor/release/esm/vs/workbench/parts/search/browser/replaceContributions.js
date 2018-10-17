/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IReplaceService } from '../common/replace.js';
import { ReplaceService, ReplacePreviewContentProvider } from './replaceService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
export function registerContributions() {
    registerSingleton(IReplaceService, ReplaceService);
    Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ReplacePreviewContentProvider, 1 /* Starting */);
}
