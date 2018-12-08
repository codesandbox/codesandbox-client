/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../base/common/uri.js';
import { MainContext } from './extHost.protocol.js';
import { toDisposable, dispose } from '../../../base/common/lifecycle.js';
import { values } from '../../../base/common/map.js';
import { Range, FileChangeType } from './extHostTypes.js';
import { Schemas } from '../../../base/common/network.js';
var FsLinkProvider = /** @class */ (function () {
    function FsLinkProvider() {
        this._schemes = new Set();
    }
    FsLinkProvider.prototype.add = function (scheme) {
        this._regex = undefined;
        this._schemes.add(scheme);
    };
    FsLinkProvider.prototype.delete = function (scheme) {
        if (this._schemes.delete(scheme)) {
            this._regex = undefined;
        }
    };
    FsLinkProvider.prototype.provideDocumentLinks = function (document) {
        if (this._schemes.size === 0) {
            return undefined;
        }
        if (!this._regex) {
            this._regex = new RegExp("(" + (values(this._schemes).join('|')) + "):[^\\s]+", 'gi');
        }
        var result = [];
        var max = Math.min(document.lineCount, 2500);
        for (var line = 0; line < max; line++) {
            this._regex.lastIndex = 0;
            var textLine = document.lineAt(line);
            var m = void 0;
            while (m = this._regex.exec(textLine.text)) {
                var target = URI.parse(m[0]);
                if (target.path[0] !== '/') {
                    continue;
                }
                var range = new Range(line, this._regex.lastIndex - m[0].length, line, this._regex.lastIndex);
                result.push({ target: target, range: range });
            }
        }
        return result;
    };
    return FsLinkProvider;
}());
var ExtHostFileSystem = /** @class */ (function () {
    function ExtHostFileSystem(mainContext, _extHostLanguageFeatures) {
        this._extHostLanguageFeatures = _extHostLanguageFeatures;
        this._linkProvider = new FsLinkProvider();
        this._fsProvider = new Map();
        this._usedSchemes = new Set();
        this._watches = new Map();
        this._handlePool = 0;
        this._proxy = mainContext.getProxy(MainContext.MainThreadFileSystem);
        this._usedSchemes.add(Schemas.file);
        this._usedSchemes.add(Schemas.untitled);
        this._usedSchemes.add(Schemas.vscode);
        this._usedSchemes.add(Schemas.inMemory);
        this._usedSchemes.add(Schemas.internal);
        this._usedSchemes.add(Schemas.http);
        this._usedSchemes.add(Schemas.https);
        this._usedSchemes.add(Schemas.mailto);
        this._usedSchemes.add(Schemas.data);
    }
    ExtHostFileSystem.prototype.dispose = function () {
        dispose(this._linkProviderRegistration);
    };
    ExtHostFileSystem.prototype._registerLinkProviderIfNotYetRegistered = function () {
        if (!this._linkProviderRegistration) {
            this._linkProviderRegistration = this._extHostLanguageFeatures.registerDocumentLinkProvider(undefined, '*', this._linkProvider);
        }
    };
    ExtHostFileSystem.prototype.registerFileSystemProvider = function (scheme, provider, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (this._usedSchemes.has(scheme)) {
            throw new Error("a provider for the scheme '" + scheme + "' is already registered");
        }
        //
        this._registerLinkProviderIfNotYetRegistered();
        var handle = this._handlePool++;
        this._linkProvider.add(scheme);
        this._usedSchemes.add(scheme);
        this._fsProvider.set(handle, provider);
        var capabilites = 2 /* FileReadWrite */;
        if (options.isCaseSensitive) {
            capabilites += 1024 /* PathCaseSensitive */;
        }
        if (options.isReadonly) {
            capabilites += 2048 /* Readonly */;
        }
        if (typeof provider.copy === 'function') {
            capabilites += 8 /* FileFolderCopy */;
        }
        if (typeof provider.open === 'function' && typeof provider.close === 'function'
            && typeof provider.read === 'function' && typeof provider.write === 'function') {
            capabilites += 4 /* FileOpenReadWriteClose */;
        }
        this._proxy.$registerFileSystemProvider(handle, scheme, capabilites);
        var subscription = provider.onDidChangeFile(function (event) {
            var mapped = [];
            for (var _i = 0, event_1 = event; _i < event_1.length; _i++) {
                var e = event_1[_i];
                var resource = e.uri, type = e.type;
                if (resource.scheme !== scheme) {
                    // dropping events for wrong scheme
                    continue;
                }
                var newType = void 0;
                switch (type) {
                    case FileChangeType.Changed:
                        newType = 0 /* UPDATED */;
                        break;
                    case FileChangeType.Created:
                        newType = 1 /* ADDED */;
                        break;
                    case FileChangeType.Deleted:
                        newType = 2 /* DELETED */;
                        break;
                }
                mapped.push({ resource: resource, type: newType });
            }
            _this._proxy.$onFileSystemChange(handle, mapped);
        });
        return toDisposable(function () {
            subscription.dispose();
            _this._linkProvider.delete(scheme);
            _this._usedSchemes.delete(scheme);
            _this._fsProvider.delete(handle);
            _this._proxy.$unregisterProvider(handle);
        });
    };
    ExtHostFileSystem.prototype.setUriFormatter = function (scheme, formatter) {
        this._proxy.$setUriFormatter(scheme, formatter);
    };
    ExtHostFileSystem._asIStat = function (stat) {
        var type = stat.type, ctime = stat.ctime, mtime = stat.mtime, size = stat.size;
        return { type: type, ctime: ctime, mtime: mtime, size: size };
    };
    ExtHostFileSystem.prototype._checkProviderExists = function (handle) {
        if (!this._fsProvider.has(handle)) {
            var err = new Error();
            err.name = 'ENOPRO';
            err.message = "no provider";
            throw err;
        }
    };
    ExtHostFileSystem.prototype.$stat = function (handle, resource) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).stat(URI.revive(resource))).then(ExtHostFileSystem._asIStat);
    };
    ExtHostFileSystem.prototype.$readdir = function (handle, resource) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).readDirectory(URI.revive(resource)));
    };
    ExtHostFileSystem.prototype.$readFile = function (handle, resource) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).readFile(URI.revive(resource))).then(function (data) {
            return Buffer.isBuffer(data) ? data : Buffer.from(data.buffer, data.byteOffset, data.byteLength);
        });
    };
    ExtHostFileSystem.prototype.$writeFile = function (handle, resource, content, opts) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).writeFile(URI.revive(resource), content, opts));
    };
    ExtHostFileSystem.prototype.$delete = function (handle, resource, opts) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).delete(URI.revive(resource), opts));
    };
    ExtHostFileSystem.prototype.$rename = function (handle, oldUri, newUri, opts) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).rename(URI.revive(oldUri), URI.revive(newUri), opts));
    };
    ExtHostFileSystem.prototype.$copy = function (handle, oldUri, newUri, opts) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).copy(URI.revive(oldUri), URI.revive(newUri), opts));
    };
    ExtHostFileSystem.prototype.$mkdir = function (handle, resource) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).createDirectory(URI.revive(resource)));
    };
    ExtHostFileSystem.prototype.$watch = function (handle, session, resource, opts) {
        this._checkProviderExists(handle);
        var subscription = this._fsProvider.get(handle).watch(URI.revive(resource), opts);
        this._watches.set(session, subscription);
    };
    ExtHostFileSystem.prototype.$unwatch = function (session) {
        var subscription = this._watches.get(session);
        if (subscription) {
            subscription.dispose();
            this._watches.delete(session);
        }
    };
    ExtHostFileSystem.prototype.$open = function (handle, resource) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).open(URI.revive(resource)));
    };
    ExtHostFileSystem.prototype.$close = function (handle, fd) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).close(fd));
    };
    ExtHostFileSystem.prototype.$read = function (handle, fd, pos, data, offset, length) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).read(fd, pos, data, offset, length));
    };
    ExtHostFileSystem.prototype.$write = function (handle, fd, pos, data, offset, length) {
        this._checkProviderExists(handle);
        return Promise.resolve(this._fsProvider.get(handle).write(fd, pos, data, offset, length));
    };
    return ExtHostFileSystem;
}());
export { ExtHostFileSystem };
