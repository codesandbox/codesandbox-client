/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
export var nullExtensionDescription = Object.freeze({
    id: 'nullExtensionDescription',
    name: 'Null Extension Description',
    version: '0.0.0',
    publisher: 'vscode',
    enableProposedApi: false,
    engines: { vscode: '' },
    extensionLocation: URI.parse('void:location'),
    isBuiltin: false,
});
export var IExtensionService = createDecorator('extensionService');
var ActivationTimes = /** @class */ (function () {
    function ActivationTimes(startup, codeLoadingTime, activateCallTime, activateResolvedTime, activationEvent) {
        this.startup = startup;
        this.codeLoadingTime = codeLoadingTime;
        this.activateCallTime = activateCallTime;
        this.activateResolvedTime = activateResolvedTime;
        this.activationEvent = activationEvent;
    }
    return ActivationTimes;
}());
export { ActivationTimes };
var ExtensionPointContribution = /** @class */ (function () {
    function ExtensionPointContribution(description, value) {
        this.description = description;
        this.value = value;
    }
    return ExtensionPointContribution;
}());
export { ExtensionPointContribution };
export var ExtensionHostLogFileName = 'exthost';
export function checkProposedApiEnabled(extension) {
    if (!extension.enableProposedApi) {
        throwProposedApiError(extension);
    }
}
export function throwProposedApiError(extension) {
    throw new Error("[" + extension.id + "]: Proposed API is only available when running out of dev or with the following command line switch: --enable-proposed-api " + extension.id);
}
