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
import { dispose } from '../../../base/common/lifecycle.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { extHostCustomer } from './extHostCustomers.js';
import { ExtHostContext } from '../node/extHost.protocol.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';
var MainThreadFileSystemEventService = /** @class */ (function () {
    function MainThreadFileSystemEventService(extHostContext, fileService, textfileService) {
        this._listener = new Array();
        var proxy = extHostContext.getProxy(ExtHostContext.ExtHostFileSystemEventService);
        // file system events - (changes the editor and other make)
        var events = {
            created: [],
            changed: [],
            deleted: []
        };
        fileService.onFileChanges(function (event) {
            for (var _i = 0, _a = event.changes; _i < _a.length; _i++) {
                var change = _a[_i];
                switch (change.type) {
                    case 1 /* ADDED */:
                        events.created.push(change.resource);
                        break;
                    case 0 /* UPDATED */:
                        events.changed.push(change.resource);
                        break;
                    case 2 /* DELETED */:
                        events.deleted.push(change.resource);
                        break;
                }
            }
            proxy.$onFileEvent(events);
            events.created.length = 0;
            events.changed.length = 0;
            events.deleted.length = 0;
        }, undefined, this._listener);
        // file operation events - (changes the editor makes)
        fileService.onAfterOperation(function (e) {
            if (e.operation === 2 /* MOVE */) {
                proxy.$onFileRename(e.resource, e.target.resource);
            }
        }, undefined, this._listener);
        textfileService.onWillMove(function (e) {
            var promise = proxy.$onWillRename(e.oldResource, e.newResource);
            e.waitUntil(promise);
        }, undefined, this._listener);
    }
    MainThreadFileSystemEventService.prototype.dispose = function () {
        dispose(this._listener);
    };
    MainThreadFileSystemEventService = __decorate([
        extHostCustomer,
        __param(1, IFileService),
        __param(2, ITextFileService)
    ], MainThreadFileSystemEventService);
    return MainThreadFileSystemEventService;
}());
export { MainThreadFileSystemEventService };
