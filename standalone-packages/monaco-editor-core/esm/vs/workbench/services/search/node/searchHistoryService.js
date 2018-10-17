/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter } from '../../../../base/common/event';
import { IStorageService } from '../../../../platform/storage/common/storage';
var SearchHistoryService = /** @class */ (function () {
    function SearchHistoryService(storageService) {
        this.storageService = storageService;
        this._onDidClearHistory = new Emitter();
        this.onDidClearHistory = this._onDidClearHistory.event;
    }
    SearchHistoryService.prototype.clearHistory = function () {
        this.storageService.remove(SearchHistoryService.SEARCH_HISTORY_KEY, 1 /* WORKSPACE */);
        this._onDidClearHistory.fire();
    };
    SearchHistoryService.prototype.load = function () {
        var result;
        var raw = this.storageService.get(SearchHistoryService.SEARCH_HISTORY_KEY, 1 /* WORKSPACE */);
        if (raw) {
            try {
                result = JSON.parse(raw);
            }
            catch (e) {
                // Invalid data
            }
        }
        return result || {};
    };
    SearchHistoryService.prototype.save = function (history) {
        this.storageService.store(SearchHistoryService.SEARCH_HISTORY_KEY, JSON.stringify(history), 1 /* WORKSPACE */);
    };
    SearchHistoryService.SEARCH_HISTORY_KEY = 'workbench.search.history';
    SearchHistoryService = __decorate([
        __param(0, IStorageService)
    ], SearchHistoryService);
    return SearchHistoryService;
}());
export { SearchHistoryService };
