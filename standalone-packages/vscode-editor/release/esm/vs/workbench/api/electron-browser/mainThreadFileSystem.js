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
import { Emitter } from '../../../base/common/event.js';
import { dispose, toDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
import { ILabelService } from '../../../platform/label/common/label.js';
var MainThreadFileSystem = /** @class */ (function () {
    function MainThreadFileSystem(extHostContext, _fileService, _labelService) {
        this._fileService = _fileService;
        this._labelService = _labelService;
        this._fileProvider = new Map();
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostFileSystem);
    }
    MainThreadFileSystem.prototype.dispose = function () {
        this._fileProvider.forEach(function (value) { return value.dispose(); });
        this._fileProvider.clear();
    };
    MainThreadFileSystem.prototype.$registerFileSystemProvider = function (handle, scheme, capabilities) {
        this._fileProvider.set(handle, new RemoteFileSystemProvider(this._fileService, scheme, capabilities, handle, this._proxy));
    };
    MainThreadFileSystem.prototype.$unregisterProvider = function (handle) {
        dispose(this._fileProvider.get(handle));
        this._fileProvider.delete(handle);
    };
    MainThreadFileSystem.prototype.$setUriFormatter = function (selector, formatter) {
        this._labelService.registerFormatter(selector, formatter);
    };
    MainThreadFileSystem.prototype.$onFileSystemChange = function (handle, changes) {
        this._fileProvider.get(handle).$onFileSystemChange(changes);
    };
    MainThreadFileSystem = __decorate([
        extHostNamedCustomer(MainContext.MainThreadFileSystem),
        __param(1, IFileService),
        __param(2, ILabelService)
    ], MainThreadFileSystem);
    return MainThreadFileSystem;
}());
export { MainThreadFileSystem };
var RemoteFileSystemProvider = /** @class */ (function () {
    function RemoteFileSystemProvider(fileService, scheme, capabilities, _handle, _proxy) {
        this._handle = _handle;
        this._proxy = _proxy;
        this._onDidChange = new Emitter();
        this.onDidChangeFile = this._onDidChange.event;
        this.capabilities = capabilities;
        this._registration = fileService.registerProvider(scheme, this);
    }
    RemoteFileSystemProvider.prototype.dispose = function () {
        this._registration.dispose();
        this._onDidChange.dispose();
    };
    RemoteFileSystemProvider.prototype.watch = function (resource, opts) {
        var _this = this;
        var session = Math.random();
        this._proxy.$watch(this._handle, session, resource, opts);
        return toDisposable(function () {
            _this._proxy.$unwatch(_this._handle, session);
        });
    };
    RemoteFileSystemProvider.prototype.$onFileSystemChange = function (changes) {
        this._onDidChange.fire(changes.map(RemoteFileSystemProvider._createFileChange));
    };
    RemoteFileSystemProvider._createFileChange = function (dto) {
        return { resource: URI.revive(dto.resource), type: dto.type };
    };
    // --- forwarding calls
    RemoteFileSystemProvider._asBuffer = function (data) {
        return Buffer.isBuffer(data) ? data : Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    };
    RemoteFileSystemProvider.prototype.stat = function (resource) {
        return this._proxy.$stat(this._handle, resource).then(undefined, function (err) {
            throw err;
        });
    };
    RemoteFileSystemProvider.prototype.readFile = function (resource) {
        return this._proxy.$readFile(this._handle, resource);
    };
    RemoteFileSystemProvider.prototype.writeFile = function (resource, content, opts) {
        return this._proxy.$writeFile(this._handle, resource, RemoteFileSystemProvider._asBuffer(content), opts);
    };
    RemoteFileSystemProvider.prototype.delete = function (resource, opts) {
        return this._proxy.$delete(this._handle, resource, opts);
    };
    RemoteFileSystemProvider.prototype.mkdir = function (resource) {
        return this._proxy.$mkdir(this._handle, resource);
    };
    RemoteFileSystemProvider.prototype.readdir = function (resource) {
        return this._proxy.$readdir(this._handle, resource);
    };
    RemoteFileSystemProvider.prototype.rename = function (resource, target, opts) {
        return this._proxy.$rename(this._handle, resource, target, opts);
    };
    RemoteFileSystemProvider.prototype.copy = function (resource, target, opts) {
        return this._proxy.$copy(this._handle, resource, target, opts);
    };
    RemoteFileSystemProvider.prototype.open = function (resource) {
        return this._proxy.$open(this._handle, resource);
    };
    RemoteFileSystemProvider.prototype.close = function (fd) {
        return this._proxy.$close(this._handle, fd);
    };
    RemoteFileSystemProvider.prototype.read = function (fd, pos, data, offset, length) {
        return this._proxy.$read(this._handle, fd, pos, RemoteFileSystemProvider._asBuffer(data), offset, length);
    };
    RemoteFileSystemProvider.prototype.write = function (fd, pos, data, offset, length) {
        return this._proxy.$write(this._handle, fd, pos, RemoteFileSystemProvider._asBuffer(data), offset, length);
    };
    return RemoteFileSystemProvider;
}());
