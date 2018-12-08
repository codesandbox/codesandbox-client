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
import { IMarkerService } from '../../../platform/markers/common/markers.js';
import { URI } from '../../../base/common/uri.js';
import { MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
var MainThreadDiagnostics = /** @class */ (function () {
    function MainThreadDiagnostics(extHostContext, markerService) {
        this._activeOwners = new Set();
        this._markerService = markerService;
    }
    MainThreadDiagnostics.prototype.dispose = function () {
        var _this = this;
        this._activeOwners.forEach(function (owner) { return _this._markerService.changeAll(owner, undefined); });
    };
    MainThreadDiagnostics.prototype.$changeMany = function (owner, entries) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            var uri = entry[0], markers = entry[1];
            if (markers) {
                for (var _a = 0, markers_1 = markers; _a < markers_1.length; _a++) {
                    var marker = markers_1[_a];
                    if (marker.relatedInformation) {
                        for (var _b = 0, _c = marker.relatedInformation; _b < _c.length; _b++) {
                            var relatedInformation = _c[_b];
                            relatedInformation.resource = URI.revive(relatedInformation.resource);
                        }
                    }
                }
            }
            this._markerService.changeOne(owner, URI.revive(uri), markers);
        }
        this._activeOwners.add(owner);
    };
    MainThreadDiagnostics.prototype.$clear = function (owner) {
        this._markerService.changeAll(owner, undefined);
        this._activeOwners.delete(owner);
    };
    MainThreadDiagnostics = __decorate([
        extHostNamedCustomer(MainContext.MainThreadDiagnostics),
        __param(1, IMarkerService)
    ], MainThreadDiagnostics);
    return MainThreadDiagnostics;
}());
export { MainThreadDiagnostics };
