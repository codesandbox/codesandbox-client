/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { createSyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
var StatusbarItemDescriptor = /** @class */ (function () {
    function StatusbarItemDescriptor(ctor, alignment, priority) {
        this.syncDescriptor = createSyncDescriptor(ctor);
        this.alignment = alignment || 0 /* LEFT */;
        this.priority = priority || 0;
    }
    return StatusbarItemDescriptor;
}());
export { StatusbarItemDescriptor };
var StatusbarRegistry = /** @class */ (function () {
    function StatusbarRegistry() {
        this._items = [];
    }
    Object.defineProperty(StatusbarRegistry.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    StatusbarRegistry.prototype.registerStatusbarItem = function (descriptor) {
        this._items.push(descriptor);
    };
    return StatusbarRegistry;
}());
export var Extensions = {
    Statusbar: 'workbench.contributions.statusbar'
};
Registry.add(Extensions.Statusbar, new StatusbarRegistry());
