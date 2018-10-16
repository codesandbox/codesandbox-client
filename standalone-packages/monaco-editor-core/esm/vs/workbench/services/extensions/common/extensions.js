/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
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
