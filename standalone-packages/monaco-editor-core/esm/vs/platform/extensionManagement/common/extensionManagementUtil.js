/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { compareIgnoreCase } from '../../../base/common/strings';
export function areSameExtensions(a, b) {
    if (a.uuid && b.uuid) {
        return a.uuid === b.uuid;
    }
    if (a.id === b.id) {
        return true;
    }
    return compareIgnoreCase(a.id, b.id) === 0;
}
export function adoptToGalleryExtensionId(id) {
    return id.toLocaleLowerCase();
}
export function getGalleryExtensionId(publisher, name) {
    return publisher.toLocaleLowerCase() + "." + name.toLocaleLowerCase();
}
export function getGalleryExtensionIdFromLocal(local) {
    return local.manifest ? getGalleryExtensionId(local.manifest.publisher, local.manifest.name) : local.identifier.id;
}
export var LOCAL_EXTENSION_ID_REGEX = /^([^.]+\..+)-(\d+\.\d+\.\d+(-.*)?)$/;
export function getIdFromLocalExtensionId(localExtensionId) {
    var matches = LOCAL_EXTENSION_ID_REGEX.exec(localExtensionId);
    if (matches && matches[1]) {
        return adoptToGalleryExtensionId(matches[1]);
    }
    return adoptToGalleryExtensionId(localExtensionId);
}
export function getLocalExtensionId(id, version) {
    return id + "-" + version;
}
export function groupByExtension(extensions, getExtensionIdentifier) {
    var byExtension = [];
    var findGroup = function (extension) {
        for (var _i = 0, byExtension_1 = byExtension; _i < byExtension_1.length; _i++) {
            var group = byExtension_1[_i];
            if (group.some(function (e) { return areSameExtensions(getExtensionIdentifier(e), getExtensionIdentifier(extension)); })) {
                return group;
            }
        }
        return null;
    };
    for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
        var extension = extensions_1[_i];
        var group = findGroup(extension);
        if (group) {
            group.push(extension);
        }
        else {
            byExtension.push([extension]);
        }
    }
    return byExtension;
}
export function getLocalExtensionTelemetryData(extension) {
    return {
        id: getGalleryExtensionIdFromLocal(extension),
        name: extension.manifest.name,
        galleryId: null,
        publisherId: extension.metadata ? extension.metadata.publisherId : null,
        publisherName: extension.manifest.publisher,
        publisherDisplayName: extension.metadata ? extension.metadata.publisherDisplayName : null,
        dependencies: extension.manifest.extensionDependencies && extension.manifest.extensionDependencies.length > 0
    };
}
/* __GDPR__FRAGMENT__
    "GalleryExtensionTelemetryData" : {
        "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
        "name": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
        "galleryId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
        "publisherId": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
        "publisherName": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
        "publisherDisplayName": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
        "dependencies": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
        "${include}": [
            "${GalleryExtensionTelemetryData2}"
        ]
    }
*/
export function getGalleryExtensionTelemetryData(extension) {
    return __assign({ id: extension.identifier.id, name: extension.name, galleryId: extension.identifier.uuid, publisherId: extension.publisherId, publisherName: extension.publisher, publisherDisplayName: extension.publisherDisplayName, dependencies: extension.properties.dependencies.length > 0 }, extension.telemetryData);
}
export var BetterMergeDisabledNowKey = 'extensions/bettermergedisablednow';
export var BetterMergeId = 'pprice.better-merge';
export function getMaliciousExtensionsSet(report) {
    var result = new Set();
    for (var _i = 0, report_1 = report; _i < report_1.length; _i++) {
        var extension = report_1[_i];
        if (extension.malicious) {
            result.add(extension.id.id);
        }
    }
    return result;
}
var nonWorkspaceExtensions = new Set();
export function isWorkspaceExtension(manifest, configurationService) {
    var extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
    var configuredWorkspaceExtensions = configurationService.getValue('_workbench.workspaceExtensions') || [];
    if (configuredWorkspaceExtensions.length) {
        if (configuredWorkspaceExtensions.indexOf(extensionId) !== -1) {
            return true;
        }
        if (configuredWorkspaceExtensions.indexOf("-" + extensionId) !== -1) {
            return false;
        }
    }
    if (manifest.main) {
        if ((manifest.categories || []).indexOf('Workspace Extension') !== -1) {
            return true;
        }
        return !nonWorkspaceExtensions.has(extensionId);
    }
    return false;
}
