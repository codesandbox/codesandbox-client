/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Event } from '../../../base/common/event.js';
export var IStorageService = createDecorator('storageService');
export var NullStorageService = new /** @class */ (function () {
    function class_1() {
        this._serviceBrand = undefined;
        this.onDidChangeStorage = Event.None;
        this.onWillSaveState = Event.None;
    }
    class_1.prototype.get = function (key, scope, fallbackValue) {
        return fallbackValue;
    };
    class_1.prototype.getBoolean = function (key, scope, fallbackValue) {
        return fallbackValue;
    };
    class_1.prototype.getInteger = function (key, scope, fallbackValue) {
        return fallbackValue;
    };
    class_1.prototype.store = function (key, value, scope) {
        return Promise.resolve();
    };
    class_1.prototype.remove = function (key, scope) {
        return Promise.resolve();
    };
    return class_1;
}());
