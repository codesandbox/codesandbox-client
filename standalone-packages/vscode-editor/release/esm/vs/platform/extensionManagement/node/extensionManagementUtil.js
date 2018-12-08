/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as semver from '../../../../semver.js';
import { adoptToGalleryExtensionId, LOCAL_EXTENSION_ID_REGEX } from '../common/extensionManagementUtil.js';
export function getIdAndVersionFromLocalExtensionId(localExtensionId) {
    var matches = LOCAL_EXTENSION_ID_REGEX.exec(localExtensionId);
    if (matches && matches[1] && matches[2]) {
        var version = semver.valid(matches[2]);
        if (version) {
            return { id: adoptToGalleryExtensionId(matches[1]), version: version };
        }
    }
    return {
        id: adoptToGalleryExtensionId(localExtensionId),
        version: null
    };
}
