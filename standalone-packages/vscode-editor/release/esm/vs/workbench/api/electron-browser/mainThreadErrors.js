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
import { onUnexpectedError } from '../../../base/common/errors.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { MainContext } from '../node/extHost.protocol.js';
var MainThreadErrors = /** @class */ (function () {
    function MainThreadErrors() {
    }
    MainThreadErrors.prototype.dispose = function () {
        //
    };
    MainThreadErrors.prototype.$onUnexpectedError = function (err) {
        if (err && err.$isError) {
            var name_1 = err.name, message = err.message, stack = err.stack;
            err = new Error();
            err.message = message;
            err.name = name_1;
            err.stack = stack;
        }
        onUnexpectedError(err);
    };
    MainThreadErrors = __decorate([
        extHostNamedCustomer(MainContext.MainThreadErrors)
    ], MainThreadErrors);
    return MainThreadErrors;
}());
export { MainThreadErrors };
