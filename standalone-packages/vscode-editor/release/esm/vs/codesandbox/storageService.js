/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Event } from '../base/common/event.js';
var getScopeName = function (scope) {
    if (scope === 0 /* GLOBAL */) {
        return 'vs-global://';
    }
    else {
        return 'vs-workspace://';
    }
};
var CodeSandboxStorageService = /** @class */ (function () {
    function CodeSandboxStorageService() {
        this._serviceBrand = undefined;
        this.onDidChangeStorage = Event.None;
        this.onWillSaveState = Event.None;
    }
    CodeSandboxStorageService.prototype.get = function (key, scope, fallbackValue) {
        var item = localStorage.getItem(getScopeName(scope) + key);
        if (item) {
            return item;
        }
        return fallbackValue;
    };
    CodeSandboxStorageService.prototype.getBoolean = function (key, scope, fallbackValue) {
        var item = localStorage.getItem(getScopeName(scope) + key);
        if (item) {
            return !!item;
        }
        return fallbackValue;
    };
    CodeSandboxStorageService.prototype.getInteger = function (key, scope, fallbackValue) {
        var item = localStorage.getItem(getScopeName(scope) + key);
        if (item) {
            return +item;
        }
        return fallbackValue;
    };
    CodeSandboxStorageService.prototype.store = function (key, value, scope) {
        localStorage.setItem(getScopeName(scope) + key, value);
        return Promise.resolve();
    };
    CodeSandboxStorageService.prototype.remove = function (key, scope) {
        localStorage.removeItem(getScopeName(scope) + key);
        return Promise.resolve();
    };
    return CodeSandboxStorageService;
}());
export { CodeSandboxStorageService };
;
