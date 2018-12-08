/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Schemas } from '../../../base/common/network.js';
import { DataUri, basenameOrAuthority } from '../../../base/common/resources.js';
import { PLAINTEXT_MODE_ID } from '../modes/modesRegistry.js';
import { FileKind } from '../../../platform/files/common/files.js';
export function getIconClasses(modelService, modeService, resource, fileKind) {
    // we always set these base classes even if we do not have a path
    var classes = fileKind === FileKind.ROOT_FOLDER ? ['rootfolder-icon'] : fileKind === FileKind.FOLDER ? ['folder-icon'] : ['file-icon'];
    if (resource) {
        // Get the path and name of the resource. For data-URIs, we need to parse specially
        var name_1;
        var path = void 0;
        if (resource.scheme === Schemas.data) {
            var metadata = DataUri.parseMetaData(resource);
            name_1 = metadata.get(DataUri.META_DATA_LABEL);
            path = name_1;
        }
        else {
            name_1 = cssEscape(basenameOrAuthority(resource).toLowerCase());
            path = resource.path.toLowerCase();
        }
        // Folders
        if (fileKind === FileKind.FOLDER) {
            classes.push(name_1 + "-name-folder-icon");
        }
        // Files
        else {
            // Name & Extension(s)
            if (name_1) {
                classes.push(name_1 + "-name-file-icon");
                var dotSegments = name_1.split('.');
                for (var i = 1; i < dotSegments.length; i++) {
                    classes.push(dotSegments.slice(i).join('.') + "-ext-file-icon"); // add each combination of all found extensions if more than one
                }
                classes.push("ext-file-icon"); // extra segment to increase file-ext score
            }
            // Configured Language
            var configuredLangId = getConfiguredLangId(modelService, resource);
            configuredLangId = configuredLangId || modeService.getModeIdByFilepathOrFirstLine(path);
            if (configuredLangId) {
                classes.push(cssEscape(configuredLangId) + "-lang-file-icon");
            }
        }
    }
    return classes;
}
export function getConfiguredLangId(modelService, resource) {
    var configuredLangId = null;
    if (resource) {
        var model = modelService.getModel(resource);
        if (model) {
            var modeId = model.getLanguageIdentifier().language;
            if (modeId && modeId !== PLAINTEXT_MODE_ID) {
                configuredLangId = modeId; // only take if the mode is specific (aka no just plain text)
            }
        }
    }
    return configuredLangId;
}
export function cssEscape(val) {
    return val.replace(/\s/g, '\\$&'); // make sure to not introduce CSS classes from files that contain whitespace
}
