/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Extensions as ViewContainerExtensions } from '../../../common/views.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
export var VIEWLET_ID = 'workbench.view.extensions';
export var VIEW_CONTAINER = Registry.as(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer(VIEWLET_ID);
export var SERVICE_ID = 'extensionsWorkbenchService';
export var IExtensionsWorkbenchService = createDecorator(SERVICE_ID);
export var ConfigurationKey = 'extensions';
export var AutoUpdateConfigurationKey = 'extensions.autoUpdate';
export var AutoCheckUpdatesConfigurationKey = 'extensions.autoCheckUpdates';
export var ShowRecommendationsOnlyOnDemandKey = 'extensions.showRecommendationsOnlyOnDemand';
export var CloseExtensionDetailsOnViewChangeKey = 'extensions.closeExtensionDetailsOnViewChange';
