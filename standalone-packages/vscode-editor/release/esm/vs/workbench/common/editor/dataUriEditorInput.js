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
import { EditorInput } from '../editor.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { BinaryEditorModel } from './binaryEditorModel.js';
import { DataUri } from '../resources.js';
/**
 * An editor input to present data URIs in a binary editor. Data URIs have the form of:
 * data:[mime type];[meta data <key=value>;...];base64,[base64 encoded value]
 */
var DataUriEditorInput = /** @class */ (function (_super) {
    __extends(DataUriEditorInput, _super);
    function DataUriEditorInput(name, description, resource, instantiationService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.name = name;
        _this.description = description;
        _this.resource = resource;
        if (!_this.name || !_this.description) {
            var metadata = DataUri.parseMetaData(_this.resource);
            if (!_this.name) {
                _this.name = metadata.get(DataUri.META_DATA_LABEL);
            }
            if (!_this.description) {
                _this.description = metadata.get(DataUri.META_DATA_DESCRIPTION);
            }
        }
        return _this;
    }
    DataUriEditorInput.prototype.getResource = function () {
        return this.resource;
    };
    DataUriEditorInput.prototype.getTypeId = function () {
        return DataUriEditorInput.ID;
    };
    DataUriEditorInput.prototype.getName = function () {
        return this.name;
    };
    DataUriEditorInput.prototype.getDescription = function () {
        return this.description;
    };
    DataUriEditorInput.prototype.resolve = function () {
        return this.instantiationService.createInstance(BinaryEditorModel, this.resource, this.getName()).load().then(function (m) { return m; });
    };
    DataUriEditorInput.prototype.matches = function (otherInput) {
        if (_super.prototype.matches.call(this, otherInput) === true) {
            return true;
        }
        if (otherInput instanceof DataUriEditorInput) {
            var otherDataUriEditorInput = otherInput;
            // Compare by resource
            return otherDataUriEditorInput.resource.toString() === this.resource.toString();
        }
        return false;
    };
    DataUriEditorInput.ID = 'workbench.editors.dataUriEditorInput';
    DataUriEditorInput = __decorate([
        __param(3, IInstantiationService)
    ], DataUriEditorInput);
    return DataUriEditorInput;
}(EditorInput));
export { DataUriEditorInput };
