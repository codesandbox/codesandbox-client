/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var ID = 'storageService';
export var IStorageService = createDecorator(ID);
export var NullStorageService = {
    _serviceBrand: undefined,
    store: function () { return undefined; },
    remove: function () { return undefined; },
    get: function (a, b, defaultValue) { return defaultValue; },
    getInteger: function (a, b, defaultValue) { return defaultValue; },
    getBoolean: function (a, b, defaultValue) { return defaultValue; }
};
