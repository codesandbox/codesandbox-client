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
import { IModeService } from '../../../editor/common/services/modeService.js';
import { IModelService } from '../../../editor/common/services/modelService.js';
import { MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
var MainThreadLanguages = /** @class */ (function () {
    function MainThreadLanguages(_extHostContext, _modeService, _modelService) {
        this._modeService = _modeService;
        this._modelService = _modelService;
    }
    MainThreadLanguages.prototype.dispose = function () {
        // nothing
    };
    MainThreadLanguages.prototype.$getLanguages = function () {
        return Promise.resolve(this._modeService.getRegisteredModes());
    };
    MainThreadLanguages.prototype.$changeLanguage = function (resource, languageId) {
        var uri = URI.revive(resource);
        var model = this._modelService.getModel(uri);
        if (!model) {
            return Promise.reject(new Error('Invalid uri'));
        }
        var languageIdentifier = this._modeService.getLanguageIdentifier(languageId);
        if (!languageIdentifier || languageIdentifier.language !== languageId) {
            return Promise.reject(new Error("Unknown language id: " + languageId));
        }
        this._modelService.setMode(model, this._modeService.create(languageId));
        return Promise.resolve(undefined);
    };
    MainThreadLanguages = __decorate([
        extHostNamedCustomer(MainContext.MainThreadLanguages),
        __param(1, IModeService),
        __param(2, IModelService)
    ], MainThreadLanguages);
    return MainThreadLanguages;
}());
export { MainThreadLanguages };
