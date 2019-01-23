/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as Types from '../../../base/common/types.js';
import * as Assert from '../../../base/common/assert.js';
var RegistryImpl = /** @class */ (function () {
    function RegistryImpl() {
        this.data = {};
    }
    RegistryImpl.prototype.add = function (id, data) {
        Assert.ok(Types.isString(id));
        Assert.ok(Types.isObject(data));
        Assert.ok(!this.data.hasOwnProperty(id), 'There is already an extension with this id');
        this.data[id] = data;
    };
    RegistryImpl.prototype.knows = function (id) {
        return this.data.hasOwnProperty(id);
    };
    RegistryImpl.prototype.as = function (id) {
        return this.data[id] || null;
    };
    return RegistryImpl;
}());
export var Registry = new RegistryImpl();
