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
import { TPromise } from '../../../base/common/winjs.base';
import { EditorInput } from '../editor';
import { telemetryURIDescriptor } from '../../../platform/telemetry/common/telemetryUtils';
import { ITextModelService } from '../../../editor/common/services/resolverService';
import { ResourceEditorModel } from './resourceEditorModel';
import { IHashService } from '../../services/hash/common/hashService';
/**
 * A read-only text editor input whos contents are made of the provided resource that points to an existing
 * code editor model.
 */
var ResourceEditorInput = /** @class */ (function (_super) {
    __extends(ResourceEditorInput, _super);
    function ResourceEditorInput(name, description, resource, textModelResolverService, hashService) {
        var _this = _super.call(this) || this;
        _this.textModelResolverService = textModelResolverService;
        _this.hashService = hashService;
        _this.name = name;
        _this.description = description;
        _this.resource = resource;
        return _this;
    }
    ResourceEditorInput.prototype.getResource = function () {
        return this.resource;
    };
    ResourceEditorInput.prototype.getTypeId = function () {
        return ResourceEditorInput.ID;
    };
    ResourceEditorInput.prototype.getName = function () {
        return this.name;
    };
    ResourceEditorInput.prototype.setName = function (name) {
        if (this.name !== name) {
            this.name = name;
            this._onDidChangeLabel.fire();
        }
    };
    ResourceEditorInput.prototype.getDescription = function () {
        return this.description;
    };
    ResourceEditorInput.prototype.setDescription = function (description) {
        if (this.description !== description) {
            this.description = description;
            this._onDidChangeLabel.fire();
        }
    };
    ResourceEditorInput.prototype.getTelemetryDescriptor = function () {
        var _this = this;
        var descriptor = _super.prototype.getTelemetryDescriptor.call(this);
        descriptor['resource'] = telemetryURIDescriptor(this.resource, function (path) { return _this.hashService.createSHA1(path); });
        /* __GDPR__FRAGMENT__
            "EditorTelemetryDescriptor" : {
                "resource": { "${inline}": [ "${URIDescriptor}" ] }
            }
        */
        return descriptor;
    };
    ResourceEditorInput.prototype.resolve = function () {
        var _this = this;
        if (!this.modelReference) {
            this.modelReference = this.textModelResolverService.createModelReference(this.resource);
        }
        return this.modelReference.then(function (ref) {
            var model = ref.object;
            if (!(model instanceof ResourceEditorModel)) {
                ref.dispose();
                _this.modelReference = null;
                return TPromise.wrapError(new Error("Unexpected model for ResourceInput: " + _this.resource));
            }
            return model;
        });
    };
    ResourceEditorInput.prototype.matches = function (otherInput) {
        if (_super.prototype.matches.call(this, otherInput) === true) {
            return true;
        }
        if (otherInput instanceof ResourceEditorInput) {
            var otherResourceEditorInput = otherInput;
            // Compare by properties
            return otherResourceEditorInput.resource.toString() === this.resource.toString();
        }
        return false;
    };
    ResourceEditorInput.prototype.dispose = function () {
        if (this.modelReference) {
            this.modelReference.then(function (ref) { return ref.dispose(); });
            this.modelReference = null;
        }
        _super.prototype.dispose.call(this);
    };
    ResourceEditorInput.ID = 'workbench.editors.resourceEditorInput';
    ResourceEditorInput = __decorate([
        __param(3, ITextModelService),
        __param(4, IHashService)
    ], ResourceEditorInput);
    return ResourceEditorInput;
}(EditorInput));
export { ResourceEditorInput };
