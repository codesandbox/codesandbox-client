/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BaseTextEditorModel } from './textEditorModel.js';
import { IModeService } from '../../../editor/common/services/modeService.js';
import { IModelService } from '../../../editor/common/services/modelService.js';
/**
 * An editor model whith an in-memory, readonly content that is backed by an existing editor model.
 */
var ResourceEditorModel = /** @class */ (function (_super) {
    __extends(ResourceEditorModel, _super);
    function ResourceEditorModel(resource, modeService, modelService) {
        var _this = _super.call(this, modelService, modeService, resource) || this;
        // TODO@Joao: force this class to dispose the underlying model
        _this.createdEditorModel = true;
        return _this;
    }
    ResourceEditorModel.prototype.isReadonly = function () {
        return true;
    };
    ResourceEditorModel = __decorate([
        __param(1, IModeService),
        __param(2, IModelService)
    ], ResourceEditorModel);
    return ResourceEditorModel;
}(BaseTextEditorModel));
export { ResourceEditorModel };
