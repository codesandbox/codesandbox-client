/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { localize } from '../../../nls.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var EXTENSION_IDENTIFIER_PATTERN = '^([a-z0-9A-Z][a-z0-9\-A-Z]*)\\.([a-z0-9A-Z][a-z0-9\-A-Z]*)$';
export var EXTENSION_IDENTIFIER_REGEX = new RegExp(EXTENSION_IDENTIFIER_PATTERN);
export function isIExtensionIdentifier(thing) {
    return thing
        && typeof thing === 'object'
        && typeof thing.id === 'string'
        && (!thing.uuid || typeof thing.uuid === 'string');
}
export var IExtensionManagementService = createDecorator('extensionManagementService');
export var IExtensionGalleryService = createDecorator('extensionGalleryService');
export var IExtensionManagementServerService = createDecorator('extensionManagementServerService');
export var IExtensionEnablementService = createDecorator('extensionEnablementService');
export var IExtensionTipsService = createDecorator('extensionTipsService');
export var ExtensionsLabel = localize('extensions', "Extensions");
export var ExtensionsChannelId = 'extensions';
export var PreferencesLabel = localize('preferences', "Preferences");
