/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getGalleryExtensionId } from '../../extensionManagement/common/extensionManagementUtil.js';
export var MANIFEST_CACHE_FOLDER = 'CachedExtensions';
export var USER_MANIFEST_CACHE_FILE = 'user';
export var BUILTIN_MANIFEST_CACHE_FILE = 'builtin';
var uiExtensions = new Set();
uiExtensions.add('msjsdiag.debugger-for-chrome');
export function isUIExtension(manifest, configurationService) {
    var extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
    var configuredUIExtensions = configurationService.getValue('_workbench.uiExtensions') || [];
    if (configuredUIExtensions.length) {
        if (configuredUIExtensions.indexOf(extensionId) !== -1) {
            return true;
        }
        if (configuredUIExtensions.indexOf("-" + extensionId) !== -1) {
            return false;
        }
    }
    switch (manifest.extensionKind) {
        case 'ui': return true;
        case 'workspace': return false;
        default: return uiExtensions.has(extensionId) || !manifest.main;
    }
}
