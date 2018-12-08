/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import * as strings from '../../../../base/common/strings.js';
import * as resources from '../../../../base/common/resources.js';
var configurationExtPoint = ExtensionsRegistry.registerExtensionPoint('jsonValidation', [], {
    description: nls.localize('contributes.jsonValidation', 'Contributes json schema configuration.'),
    type: 'array',
    defaultSnippets: [{ body: [{ fileMatch: '${1:file.json}', url: '${2:url}' }] }],
    items: {
        type: 'object',
        defaultSnippets: [{ body: { fileMatch: '${1:file.json}', url: '${2:url}' } }],
        properties: {
            fileMatch: {
                type: 'string',
                description: nls.localize('contributes.jsonValidation.fileMatch', 'The file pattern to match, for example "package.json" or "*.launch".'),
            },
            url: {
                description: nls.localize('contributes.jsonValidation.url', 'A schema URL (\'http:\', \'https:\') or relative path to the extension folder (\'./\').'),
                type: 'string'
            }
        }
    }
});
var JSONValidationExtensionPoint = /** @class */ (function () {
    function JSONValidationExtensionPoint() {
        configurationExtPoint.setHandler(function (extensions) {
            var _loop_1 = function (i) {
                var extensionValue = extensions[i].value;
                var collector = extensions[i].collector;
                var extensionLocation = extensions[i].description.extensionLocation;
                if (!extensionValue || !Array.isArray(extensionValue)) {
                    collector.error(nls.localize('invalid.jsonValidation', "'configuration.jsonValidation' must be a array"));
                    return { value: void 0 };
                }
                extensionValue.forEach(function (extension) {
                    if (typeof extension.fileMatch !== 'string') {
                        collector.error(nls.localize('invalid.fileMatch', "'configuration.jsonValidation.fileMatch' must be defined"));
                        return;
                    }
                    var uri = extension.url;
                    if (typeof extension.url !== 'string') {
                        collector.error(nls.localize('invalid.url', "'configuration.jsonValidation.url' must be a URL or relative path"));
                        return;
                    }
                    if (strings.startsWith(uri, './')) {
                        try {
                            var colorThemeLocation = resources.joinPath(extensionLocation, uri);
                            if (!resources.isEqualOrParent(colorThemeLocation, extensionLocation)) {
                                collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.url` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", configurationExtPoint.name, colorThemeLocation.toString(), extensionLocation.path));
                            }
                        }
                        catch (e) {
                            collector.error(nls.localize('invalid.url.fileschema', "'configuration.jsonValidation.url' is an invalid relative URL: {0}", e.message));
                        }
                    }
                    else if (!strings.startsWith(uri, 'https:/') && strings.startsWith(uri, 'https:/')) {
                        collector.error(nls.localize('invalid.url.schema', "'configuration.jsonValidation.url' must start with 'http:', 'https:' or './' to reference schemas located in the extension"));
                        return;
                    }
                });
            };
            for (var i = 0; i < extensions.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        });
    }
    return JSONValidationExtensionPoint;
}());
export { JSONValidationExtensionPoint };
