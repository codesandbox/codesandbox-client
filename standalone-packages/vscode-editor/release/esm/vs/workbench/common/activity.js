/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Registry } from '../../platform/registry/common/platform.js';
export var GlobalActivityExtensions = 'workbench.contributions.globalActivities';
var GlobalActivityRegistry = /** @class */ (function () {
    function GlobalActivityRegistry() {
        this.activityDescriptors = new Set();
    }
    GlobalActivityRegistry.prototype.registerActivity = function (descriptor) {
        this.activityDescriptors.add(descriptor);
    };
    GlobalActivityRegistry.prototype.getActivities = function () {
        var result = [];
        this.activityDescriptors.forEach(function (d) { return result.push(d); });
        return result;
    };
    return GlobalActivityRegistry;
}());
export { GlobalActivityRegistry };
Registry.add(GlobalActivityExtensions, new GlobalActivityRegistry());
