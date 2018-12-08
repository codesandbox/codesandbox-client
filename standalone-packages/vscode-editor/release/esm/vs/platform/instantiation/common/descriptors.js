/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var SyncDescriptor = /** @class */ (function () {
    function SyncDescriptor(ctor, staticArguments, supportsDelayedInstantiation) {
        if (staticArguments === void 0) { staticArguments = []; }
        if (supportsDelayedInstantiation === void 0) { supportsDelayedInstantiation = false; }
        this.ctor = ctor;
        this.staticArguments = staticArguments;
        this.supportsDelayedInstantiation = supportsDelayedInstantiation;
    }
    return SyncDescriptor;
}());
export { SyncDescriptor };
export var createSyncDescriptor = function (ctor) {
    var staticArguments = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        staticArguments[_i - 1] = arguments[_i];
    }
    return new SyncDescriptor(ctor, staticArguments);
};
