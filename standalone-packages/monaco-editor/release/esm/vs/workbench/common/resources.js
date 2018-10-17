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
import * as paths from '../../base/common/paths.js';
import { RawContextKey, IContextKeyService } from '../../platform/contextkey/common/contextkey.js';
import { IModeService } from '../../editor/common/services/modeService.js';
import { IFileService } from '../../platform/files/common/files.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { Schemas } from '../../base/common/network.js';
var ResourceContextKey = /** @class */ (function (_super) {
    __extends(ResourceContextKey, _super);
    function ResourceContextKey(contextKeyService, _fileService, _modeService) {
        var _this = _super.call(this) || this;
        _this._fileService = _fileService;
        _this._modeService = _modeService;
        _this._schemeKey = ResourceContextKey.Scheme.bindTo(contextKeyService);
        _this._filenameKey = ResourceContextKey.Filename.bindTo(contextKeyService);
        _this._langIdKey = ResourceContextKey.LangId.bindTo(contextKeyService);
        _this._resourceKey = ResourceContextKey.Resource.bindTo(contextKeyService);
        _this._extensionKey = ResourceContextKey.Extension.bindTo(contextKeyService);
        _this._hasResource = ResourceContextKey.HasResource.bindTo(contextKeyService);
        _this._isfileSystemResource = ResourceContextKey.IsFileSystemResource.bindTo(contextKeyService);
        _this._isFileSystemResourceOrUntitled = ResourceContextKey.IsFileSystemResourceOrUntitled.bindTo(contextKeyService);
        _this._register(_fileService.onDidChangeFileSystemProviderRegistrations(function () {
            var resource = _this._resourceKey.get();
            _this._isfileSystemResource.set(resource && _fileService.canHandleResource(resource));
            _this._isFileSystemResourceOrUntitled.set(_this._isfileSystemResource.get() || _this._schemeKey.get() === Schemas.untitled);
        }));
        return _this;
    }
    ResourceContextKey.prototype.set = function (value) {
        this._resourceKey.set(value);
        this._schemeKey.set(value && value.scheme);
        this._filenameKey.set(value && paths.basename(value.fsPath));
        this._langIdKey.set(value && this._modeService.getModeIdByFilepathOrFirstLine(value.fsPath));
        this._extensionKey.set(value && paths.extname(value.fsPath));
        this._hasResource.set(!!value);
        this._isfileSystemResource.set(value && this._fileService.canHandleResource(value));
        this._isFileSystemResourceOrUntitled.set(this._isfileSystemResource.get() || this._schemeKey.get() === Schemas.untitled);
    };
    ResourceContextKey.prototype.reset = function () {
        this._schemeKey.reset();
        this._langIdKey.reset();
        this._resourceKey.reset();
        this._langIdKey.reset();
        this._extensionKey.reset();
        this._hasResource.reset();
    };
    ResourceContextKey.prototype.get = function () {
        return this._resourceKey.get();
    };
    ResourceContextKey.Scheme = new RawContextKey('resourceScheme', undefined);
    ResourceContextKey.Filename = new RawContextKey('resourceFilename', undefined);
    ResourceContextKey.LangId = new RawContextKey('resourceLangId', undefined);
    ResourceContextKey.Resource = new RawContextKey('resource', undefined);
    ResourceContextKey.Extension = new RawContextKey('resourceExtname', undefined);
    ResourceContextKey.HasResource = new RawContextKey('resourceSet', false);
    ResourceContextKey.IsFileSystemResource = new RawContextKey('isFileSystemResource', false);
    ResourceContextKey.IsFileSystemResourceOrUntitled = new RawContextKey('isFileSystemResourceOrUntitled', false);
    ResourceContextKey = __decorate([
        __param(0, IContextKeyService),
        __param(1, IFileService),
        __param(2, IModeService)
    ], ResourceContextKey);
    return ResourceContextKey;
}(Disposable));
export { ResourceContextKey };
/**
 * Data URI related helpers.
 */
export var DataUri;
(function (DataUri) {
    DataUri.META_DATA_LABEL = 'label';
    DataUri.META_DATA_DESCRIPTION = 'description';
    DataUri.META_DATA_SIZE = 'size';
    DataUri.META_DATA_MIME = 'mime';
    function parseMetaData(dataUri) {
        var metadata = new Map();
        // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
        // the metadata is: size:2313;label:SomeLabel;description:SomeDescription
        var meta = dataUri.path.substring(dataUri.path.indexOf(';') + 1, dataUri.path.lastIndexOf(';'));
        meta.split(';').forEach(function (property) {
            var _a = property.split(':'), key = _a[0], value = _a[1];
            if (key && value) {
                metadata.set(key, value);
            }
        });
        // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
        // the mime is: image/png
        var mime = dataUri.path.substring(0, dataUri.path.indexOf(';'));
        if (mime) {
            metadata.set(DataUri.META_DATA_MIME, mime);
        }
        return metadata;
    }
    DataUri.parseMetaData = parseMetaData;
})(DataUri || (DataUri = {}));
