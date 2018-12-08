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
import * as path from '../../../../../path.js';
import * as crypto from '../../../../../crypto.js';
import * as pfs from '../../../../base/node/pfs.js';
import { URI as Uri } from '../../../../base/common/uri.js';
import { ResourceQueue } from '../../../../base/common/async.js';
import { BACKUP_FILE_UPDATE_OPTIONS, BACKUP_FILE_RESOLVE_OPTIONS } from '../common/backup.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { readToMatchingString } from '../../../../base/node/stream.js';
import { createTextBufferFactoryFromStream, createTextBufferFactoryFromSnapshot } from '../../../../editor/common/model/textModel.js';
import { keys } from '../../../../base/common/map.js';
var BackupSnapshot = /** @class */ (function () {
    function BackupSnapshot(snapshot, preamble) {
        this.snapshot = snapshot;
        this.preamble = preamble;
    }
    BackupSnapshot.prototype.read = function () {
        var value = this.snapshot.read();
        if (!this.preambleHandled) {
            this.preambleHandled = true;
            if (typeof value === 'string') {
                value = this.preamble + value;
            }
            else {
                value = this.preamble;
            }
        }
        return value;
    };
    return BackupSnapshot;
}());
export { BackupSnapshot };
var BackupFilesModel = /** @class */ (function () {
    function BackupFilesModel() {
        this.cache = Object.create(null);
    }
    BackupFilesModel.prototype.resolve = function (backupRoot) {
        var _this = this;
        return pfs.readDirsInDir(backupRoot).then(function (backupSchemas) {
            // For all supported schemas
            return TPromise.join(backupSchemas.map(function (backupSchema) {
                // Read backup directory for backups
                var backupSchemaPath = path.join(backupRoot, backupSchema);
                return pfs.readdir(backupSchemaPath).then(function (backupHashes) {
                    // Remember known backups in our caches
                    backupHashes.forEach(function (backupHash) {
                        var backupResource = Uri.file(path.join(backupSchemaPath, backupHash));
                        _this.add(backupResource);
                    });
                });
            }));
        }).then(function () { return _this; }, function (error) { return _this; });
    };
    BackupFilesModel.prototype.add = function (resource, versionId) {
        if (versionId === void 0) { versionId = 0; }
        this.cache[resource.toString()] = versionId;
    };
    BackupFilesModel.prototype.count = function () {
        return Object.keys(this.cache).length;
    };
    BackupFilesModel.prototype.has = function (resource, versionId) {
        var cachedVersionId = this.cache[resource.toString()];
        if (typeof cachedVersionId !== 'number') {
            return false; // unknown resource
        }
        if (typeof versionId === 'number') {
            return versionId === cachedVersionId; // if we are asked with a specific version ID, make sure to test for it
        }
        return true;
    };
    BackupFilesModel.prototype.get = function () {
        return Object.keys(this.cache).map(function (k) { return Uri.parse(k); });
    };
    BackupFilesModel.prototype.remove = function (resource) {
        delete this.cache[resource.toString()];
    };
    BackupFilesModel.prototype.clear = function () {
        this.cache = Object.create(null);
    };
    return BackupFilesModel;
}());
export { BackupFilesModel };
var BackupFileService = /** @class */ (function () {
    function BackupFileService(backupWorkspacePath, fileService) {
        this.fileService = fileService;
        this.isShuttingDown = false;
        this.ioOperationQueues = new ResourceQueue();
        this.initialize(backupWorkspacePath);
    }
    BackupFileService.prototype.initialize = function (backupWorkspacePath) {
        this.backupWorkspacePath = backupWorkspacePath;
        this.ready = this.init();
    };
    BackupFileService.prototype.init = function () {
        var model = new BackupFilesModel();
        return model.resolve(this.backupWorkspacePath);
    };
    BackupFileService.prototype.hasBackups = function () {
        return this.ready.then(function (model) {
            return model.count() > 0;
        });
    };
    BackupFileService.prototype.loadBackupResource = function (resource) {
        var _this = this;
        return this.ready.then(function (model) {
            // Return directly if we have a known backup with that resource
            var backupResource = _this.toBackupResource(resource);
            if (model.has(backupResource)) {
                return backupResource;
            }
            return void 0;
        });
    };
    BackupFileService.prototype.backupResource = function (resource, content, versionId) {
        var _this = this;
        if (this.isShuttingDown) {
            return TPromise.as(void 0);
        }
        return this.ready.then(function (model) {
            var backupResource = _this.toBackupResource(resource);
            if (model.has(backupResource, versionId)) {
                return void 0; // return early if backup version id matches requested one
            }
            return _this.ioOperationQueues.queueFor(backupResource).queue(function () {
                var preamble = "" + resource.toString() + BackupFileService.META_MARKER;
                // Update content with value
                return _this.fileService.updateContent(backupResource, new BackupSnapshot(content, preamble), BACKUP_FILE_UPDATE_OPTIONS).then(function () { return model.add(backupResource, versionId); });
            });
        });
    };
    BackupFileService.prototype.discardResourceBackup = function (resource) {
        var _this = this;
        return this.ready.then(function (model) {
            var backupResource = _this.toBackupResource(resource);
            return _this.ioOperationQueues.queueFor(backupResource).queue(function () {
                return pfs.del(backupResource.fsPath).then(function () { return model.remove(backupResource); });
            });
        });
    };
    BackupFileService.prototype.discardAllWorkspaceBackups = function () {
        var _this = this;
        this.isShuttingDown = true;
        return this.ready.then(function (model) {
            return pfs.del(_this.backupWorkspacePath).then(function () { return model.clear(); });
        });
    };
    BackupFileService.prototype.getWorkspaceFileBackups = function () {
        return this.ready.then(function (model) {
            var readPromises = [];
            model.get().forEach(function (fileBackup) {
                readPromises.push(readToMatchingString(fileBackup.fsPath, BackupFileService.META_MARKER, 2000, 10000).then(Uri.parse));
            });
            return TPromise.join(readPromises);
        });
    };
    BackupFileService.prototype.resolveBackupContent = function (backup) {
        return this.fileService.resolveStreamContent(backup, BACKUP_FILE_RESOLVE_OPTIONS).then(function (content) {
            // Add a filter method to filter out everything until the meta marker
            var metaFound = false;
            var metaPreambleFilter = function (chunk) {
                if (!metaFound && chunk) {
                    var metaIndex = chunk.indexOf(BackupFileService.META_MARKER);
                    if (metaIndex === -1) {
                        return ''; // meta not yet found, return empty string
                    }
                    metaFound = true;
                    return chunk.substr(metaIndex + 1); // meta found, return everything after
                }
                return chunk;
            };
            return createTextBufferFactoryFromStream(content.value, metaPreambleFilter);
        });
    };
    BackupFileService.prototype.toBackupResource = function (resource) {
        return Uri.file(path.join(this.backupWorkspacePath, resource.scheme, this.hashPath(resource)));
    };
    BackupFileService.prototype.hashPath = function (resource) {
        return crypto.createHash('md5').update(resource.fsPath).digest('hex');
    };
    BackupFileService.META_MARKER = '\n';
    BackupFileService = __decorate([
        __param(1, IFileService)
    ], BackupFileService);
    return BackupFileService;
}());
export { BackupFileService };
var InMemoryBackupFileService = /** @class */ (function () {
    function InMemoryBackupFileService() {
        this.backups = new Map();
    }
    InMemoryBackupFileService.prototype.hasBackups = function () {
        return TPromise.as(this.backups.size > 0);
    };
    InMemoryBackupFileService.prototype.loadBackupResource = function (resource) {
        var backupResource = this.toBackupResource(resource);
        if (this.backups.has(backupResource.toString())) {
            return TPromise.as(backupResource);
        }
        return TPromise.as(void 0);
    };
    InMemoryBackupFileService.prototype.backupResource = function (resource, content, versionId) {
        var backupResource = this.toBackupResource(resource);
        this.backups.set(backupResource.toString(), content);
        return TPromise.as(void 0);
    };
    InMemoryBackupFileService.prototype.resolveBackupContent = function (backupResource) {
        var snapshot = this.backups.get(backupResource.toString());
        if (snapshot) {
            return TPromise.as(createTextBufferFactoryFromSnapshot(snapshot));
        }
        return TPromise.as(void 0);
    };
    InMemoryBackupFileService.prototype.getWorkspaceFileBackups = function () {
        return TPromise.as(keys(this.backups).map(function (key) { return Uri.parse(key); }));
    };
    InMemoryBackupFileService.prototype.discardResourceBackup = function (resource) {
        this.backups.delete(this.toBackupResource(resource).toString());
        return TPromise.as(void 0);
    };
    InMemoryBackupFileService.prototype.discardAllWorkspaceBackups = function () {
        this.backups.clear();
        return TPromise.as(void 0);
    };
    InMemoryBackupFileService.prototype.toBackupResource = function (resource) {
        return Uri.file(path.join(resource.scheme, this.hashPath(resource)));
    };
    InMemoryBackupFileService.prototype.hashPath = function (resource) {
        return crypto.createHash('md5').update(resource.fsPath).digest('hex');
    };
    return InMemoryBackupFileService;
}());
export { InMemoryBackupFileService };
