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
import { IStatusbarService } from '../../../platform/statusbar/common/statusbar.js';
import { MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
var MainThreadStatusBar = /** @class */ (function () {
    function MainThreadStatusBar(extHostContext, _statusbarService) {
        this._statusbarService = _statusbarService;
        this._entries = Object.create(null);
    }
    MainThreadStatusBar.prototype.dispose = function () {
        for (var key in this._entries) {
            this._entries[key].dispose();
        }
    };
    MainThreadStatusBar.prototype.$setEntry = function (id, extensionId, text, tooltip, command, color, alignment, priority) {
        // Dispose any old
        this.$dispose(id);
        // Add new
        var entry = this._statusbarService.addEntry({ text: text, tooltip: tooltip, command: command, color: color, extensionId: extensionId }, alignment, priority);
        this._entries[id] = entry;
    };
    MainThreadStatusBar.prototype.$dispose = function (id) {
        var disposeable = this._entries[id];
        if (disposeable) {
            disposeable.dispose();
        }
        delete this._entries[id];
    };
    MainThreadStatusBar = __decorate([
        extHostNamedCustomer(MainContext.MainThreadStatusBar),
        __param(1, IStatusbarService)
    ], MainThreadStatusBar);
    return MainThreadStatusBar;
}());
export { MainThreadStatusBar };
