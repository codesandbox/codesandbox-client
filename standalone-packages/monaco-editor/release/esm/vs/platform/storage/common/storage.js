/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var ID = 'storageService';
export var IStorageService = createDecorator(ID);
export var StorageScope;
(function (StorageScope) {
    /**
     * The stored data will be scoped to all workspaces of this domain.
     */
    StorageScope[StorageScope["GLOBAL"] = 0] = "GLOBAL";
    /**
     * The stored data will be scoped to the current workspace.
     */
    StorageScope[StorageScope["WORKSPACE"] = 1] = "WORKSPACE";
})(StorageScope || (StorageScope = {}));
export var NullStorageService = {
    _serviceBrand: undefined,
    store: function () { return undefined; },
    remove: function () { return undefined; },
    get: function (a, b, defaultValue) { return defaultValue; },
    getInteger: function (a, b, defaultValue) { return defaultValue; },
    getBoolean: function (a, b, defaultValue) { return defaultValue; }
};
