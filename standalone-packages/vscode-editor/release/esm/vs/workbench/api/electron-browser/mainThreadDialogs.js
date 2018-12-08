/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { URI } from '../../../base/common/uri.js';
import { MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { forEach } from '../../../base/common/collections.js';
import { IFileDialogService } from '../../../platform/dialogs/common/dialogs.js';
var MainThreadDialogs = /** @class */ (function () {
    function MainThreadDialogs(context, _fileDialogService) {
        this._fileDialogService = _fileDialogService;
        //
    }
    MainThreadDialogs_1 = MainThreadDialogs;
    MainThreadDialogs.prototype.dispose = function () {
        //
    };
    MainThreadDialogs.prototype.$showOpenDialog = function (options) {
        return Promise.resolve(this._fileDialogService.showOpenDialog(MainThreadDialogs_1._convertOpenOptions(options)));
    };
    MainThreadDialogs.prototype.$showSaveDialog = function (options) {
        return Promise.resolve(this._fileDialogService.showSaveDialog(MainThreadDialogs_1._convertSaveOptions(options)));
    };
    MainThreadDialogs._convertOpenOptions = function (options) {
        var result = {
            openLabel: options.openLabel,
            canSelectFiles: options.canSelectFiles || (!options.canSelectFiles && !options.canSelectFolders),
            canSelectFolders: options.canSelectFolders,
            canSelectMany: options.canSelectMany,
            defaultUri: URI.revive(options.defaultUri)
        };
        if (options.filters) {
            result.filters = [];
            forEach(options.filters, function (entry) { return result.filters.push({ name: entry.key, extensions: entry.value }); });
        }
        return result;
    };
    MainThreadDialogs._convertSaveOptions = function (options) {
        var result = {
            defaultUri: URI.revive(options.defaultUri),
            saveLabel: options.saveLabel
        };
        if (options.filters) {
            result.filters = [];
            forEach(options.filters, function (entry) { return result.filters.push({ name: entry.key, extensions: entry.value }); });
        }
        return result;
    };
    var MainThreadDialogs_1;
    MainThreadDialogs = MainThreadDialogs_1 = __decorate([
        extHostNamedCustomer(MainContext.MainThreadDialogs),
        __param(1, IFileDialogService)
    ], MainThreadDialogs);
    return MainThreadDialogs;
}());
export { MainThreadDialogs };
