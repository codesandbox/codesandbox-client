/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { registerSingleton } from '../../../../platform/instantiation/common/extensions';
import { IReplaceService } from '../common/replace';
import { ReplaceService, ReplacePreviewContentProvider } from './replaceService';
import { Registry } from '../../../../platform/registry/common/platform';
import { Extensions as WorkbenchExtensions } from '../../../common/contributions';
export function registerContributions() {
    registerSingleton(IReplaceService, ReplaceService);
    Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ReplacePreviewContentProvider, 1 /* Starting */);
}
