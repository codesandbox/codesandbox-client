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
import * as path from '../../../../base/common/paths';
import * as nls from '../../../../nls';
import { Emitter } from '../../../../base/common/event';
import { TPromise } from '../../../../base/common/winjs.base';
import { guessMimeTypes } from '../../../../base/common/mime';
import { toErrorMessage } from '../../../../base/common/errorMessage';
import { URI } from '../../../../base/common/uri';
import { isUndefinedOrNull } from '../../../../base/common/types';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { IEnvironmentService } from '../../../../platform/environment/common/environment';
import { ITextFileService } from './textfiles';
import { BaseTextEditorModel } from '../../../common/editor/textEditorModel';
import { IBackupFileService } from '../../backup/common/backup';
import { IFileService, CONTENT_CHANGE_EVENT_BUFFER_DELAY } from '../../../../platform/files/common/files';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IModeService } from '../../../../editor/common/services/modeService';
import { IModelService } from '../../../../editor/common/services/modelService';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { RunOnceScheduler, timeout } from '../../../../base/common/async';
import { IHashService } from '../../hash/common/hashService';
import { createTextBufferFactory } from '../../../../editor/common/model/textModel';
import { INotificationService } from '../../../../platform/notification/common/notification';
import { isLinux } from '../../../../base/common/platform';
import { toDisposable } from '../../../../base/common/lifecycle';
import { ILogService } from '../../../../platform/log/common/log';
import { isEqual, isEqualOrParent } from '../../../../base/common/resources';
/**
 * The text file editor model listens to changes to its underlying code editor model and saves these changes through the file service back to the disk.
 */
var TextFileEditorModel = /** @class */ (function (_super) {
    __extends(TextFileEditorModel, _super);
    function TextFileEditorModel(resource, preferredEncoding, notificationService, modeService, modelService, fileService, instantiationService, telemetryService, textFileService, backupFileService, environmentService, contextService, hashService, logService) {
        var _this = _super.call(this, modelService, modeService) || this;
        _this.notificationService = notificationService;
        _this.fileService = fileService;
        _this.instantiationService = instantiationService;
        _this.telemetryService = telemetryService;
        _this.textFileService = textFileService;
        _this.backupFileService = backupFileService;
        _this.environmentService = environmentService;
        _this.contextService = contextService;
        _this.hashService = hashService;
        _this.logService = logService;
        _this._onDidContentChange = _this._register(new Emitter());
        _this._onDidStateChange = _this._register(new Emitter());
        _this.resource = resource;
        _this.preferredEncoding = preferredEncoding;
        _this.inOrphanMode = false;
        _this.dirty = false;
        _this.versionId = 0;
        _this.lastSaveAttemptTime = 0;
        _this.saveSequentializer = new SaveSequentializer();
        _this.contentChangeEventScheduler = _this._register(new RunOnceScheduler(function () { return _this._onDidContentChange.fire(6 /* CONTENT_CHANGE */); }, TextFileEditorModel.DEFAULT_CONTENT_CHANGE_BUFFER_DELAY));
        _this.orphanedChangeEventScheduler = _this._register(new RunOnceScheduler(function () { return _this._onDidStateChange.fire(7 /* ORPHANED_CHANGE */); }, TextFileEditorModel.DEFAULT_ORPHANED_CHANGE_BUFFER_DELAY));
        _this.updateAutoSaveConfiguration(textFileService.getAutoSaveConfiguration());
        _this.registerListeners();
        return _this;
    }
    TextFileEditorModel.setSaveErrorHandler = function (handler) { TextFileEditorModel.saveErrorHandler = handler; };
    TextFileEditorModel.setSaveParticipant = function (handler) { TextFileEditorModel.saveParticipant = handler; };
    Object.defineProperty(TextFileEditorModel.prototype, "onDidContentChange", {
        get: function () { return this._onDidContentChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFileEditorModel.prototype, "onDidStateChange", {
        get: function () { return this._onDidStateChange.event; },
        enumerable: true,
        configurable: true
    });
    TextFileEditorModel.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.fileService.onFileChanges(function (e) { return _this.onFileChanges(e); }));
        this._register(this.textFileService.onAutoSaveConfigurationChange(function (config) { return _this.updateAutoSaveConfiguration(config); }));
        this._register(this.textFileService.onFilesAssociationChange(function (e) { return _this.onFilesAssociationChange(); }));
        this._register(this.onDidStateChange(function (e) { return _this.onStateChange(e); }));
    };
    TextFileEditorModel.prototype.onStateChange = function (e) {
        if (e === 4 /* REVERTED */) {
            // Cancel any content change event promises as they are no longer valid.
            this.contentChangeEventScheduler.cancel();
            // Refire state change reverted events as content change events
            this._onDidContentChange.fire(4 /* REVERTED */);
        }
    };
    TextFileEditorModel.prototype.onFileChanges = function (e) {
        var _this = this;
        var fileEventImpactsModel = false;
        var newInOrphanModeGuess;
        // If we are currently orphaned, we check if the model file was added back
        if (this.inOrphanMode) {
            var modelFileAdded = e.contains(this.resource, 1 /* ADDED */);
            if (modelFileAdded) {
                newInOrphanModeGuess = false;
                fileEventImpactsModel = true;
            }
        }
        // Otherwise we check if the model file was deleted
        else {
            var modelFileDeleted = e.contains(this.resource, 2 /* DELETED */);
            if (modelFileDeleted) {
                newInOrphanModeGuess = true;
                fileEventImpactsModel = true;
            }
        }
        if (fileEventImpactsModel && this.inOrphanMode !== newInOrphanModeGuess) {
            var checkOrphanedPromise = void 0;
            if (newInOrphanModeGuess) {
                // We have received reports of users seeing delete events even though the file still
                // exists (network shares issue: https://github.com/Microsoft/vscode/issues/13665).
                // Since we do not want to mark the model as orphaned, we have to check if the
                // file is really gone and not just a faulty file event.
                checkOrphanedPromise = timeout(100).then(function () {
                    if (_this.disposed) {
                        return true;
                    }
                    return _this.fileService.existsFile(_this.resource).then(function (exists) { return !exists; });
                });
            }
            else {
                checkOrphanedPromise = Promise.resolve(false);
            }
            checkOrphanedPromise.then(function (newInOrphanModeValidated) {
                if (_this.inOrphanMode !== newInOrphanModeValidated && !_this.disposed) {
                    _this.setOrphaned(newInOrphanModeValidated);
                }
            });
        }
    };
    TextFileEditorModel.prototype.setOrphaned = function (orphaned) {
        if (this.inOrphanMode !== orphaned) {
            this.inOrphanMode = orphaned;
            this.orphanedChangeEventScheduler.schedule();
        }
    };
    TextFileEditorModel.prototype.updateAutoSaveConfiguration = function (config) {
        var autoSaveAfterMilliesEnabled = (typeof config.autoSaveDelay === 'number') && config.autoSaveDelay > 0;
        this.autoSaveAfterMilliesEnabled = autoSaveAfterMilliesEnabled;
        this.autoSaveAfterMillies = autoSaveAfterMilliesEnabled ? config.autoSaveDelay : void 0;
    };
    TextFileEditorModel.prototype.onFilesAssociationChange = function () {
        if (!this.textEditorModel) {
            return;
        }
        var firstLineText = this.getFirstLineText(this.textEditorModel);
        var mode = this.getOrCreateMode(this.modeService, void 0, firstLineText);
        this.modelService.setMode(this.textEditorModel, mode);
    };
    TextFileEditorModel.prototype.getVersionId = function () {
        return this.versionId;
    };
    TextFileEditorModel.prototype.revert = function (soft) {
        var _this = this;
        if (!this.isResolved()) {
            return TPromise.wrap(null);
        }
        // Cancel any running auto-save
        this.cancelPendingAutoSave();
        // Unset flags
        var undo = this.setDirty(false);
        var loadPromise;
        if (soft) {
            loadPromise = TPromise.as(this);
        }
        else {
            loadPromise = this.load({ forceReadFromDisk: true });
        }
        return loadPromise.then(function () {
            // Emit file change event
            _this._onDidStateChange.fire(4 /* REVERTED */);
        }, function (error) {
            // Set flags back to previous values, we are still dirty if revert failed
            undo();
            return TPromise.wrapError(error);
        });
    };
    TextFileEditorModel.prototype.load = function (options) {
        this.logService.trace('load() - enter', this.resource);
        // It is very important to not reload the model when the model is dirty.
        // We also only want to reload the model from the disk if no save is pending
        // to avoid data loss.
        if (this.dirty || this.saveSequentializer.hasPendingSave()) {
            this.logService.trace('load() - exit - without loading because model is dirty or being saved', this.resource);
            return TPromise.as(this);
        }
        // Only for new models we support to load from backup
        if (!this.textEditorModel && !this.createTextEditorModelPromise) {
            return this.loadFromBackup(options);
        }
        // Otherwise load from file resource
        return this.loadFromFile(options);
    };
    TextFileEditorModel.prototype.loadFromBackup = function (options) {
        var _this = this;
        return this.backupFileService.loadBackupResource(this.resource).then(function (backup) {
            // Make sure meanwhile someone else did not suceed or start loading
            if (_this.createTextEditorModelPromise || _this.textEditorModel) {
                return _this.createTextEditorModelPromise || TPromise.as(_this);
            }
            // If we have a backup, continue loading with it
            if (!!backup) {
                var content = {
                    resource: _this.resource,
                    name: path.basename(_this.resource.fsPath),
                    mtime: Date.now(),
                    etag: void 0,
                    value: createTextBufferFactory(''),
                    encoding: _this.fileService.encoding.getWriteEncoding(_this.resource, _this.preferredEncoding),
                    isReadonly: false
                };
                return _this.loadWithContent(content, options, backup);
            }
            // Otherwise load from file
            return _this.loadFromFile(options);
        });
    };
    TextFileEditorModel.prototype.loadFromFile = function (options) {
        var _this = this;
        var forceReadFromDisk = options && options.forceReadFromDisk;
        var allowBinary = this.isResolved() /* always allow if we resolved previously */ || (options && options.allowBinary);
        // Decide on etag
        var etag;
        if (forceReadFromDisk) {
            etag = void 0; // reset ETag if we enforce to read from disk
        }
        else if (this.lastResolvedDiskStat) {
            etag = this.lastResolvedDiskStat.etag; // otherwise respect etag to support caching
        }
        // Ensure to track the versionId before doing a long running operation
        // to make sure the model was not changed in the meantime which would
        // indicate that the user or program has made edits. If we would ignore
        // this, we could potentially loose the changes that were made because
        // after resolving the content we update the model and reset the dirty
        // flag.
        var currentVersionId = this.versionId;
        // Resolve Content
        return this.textFileService
            .resolveTextContent(this.resource, { acceptTextOnly: !allowBinary, etag: etag, encoding: this.preferredEncoding })
            .then(function (content) {
            // Clear orphaned state when loading was successful
            _this.setOrphaned(false);
            // Guard against the model having changed in the meantime
            if (currentVersionId === _this.versionId) {
                return _this.loadWithContent(content, options);
            }
            return _this;
        }, function (error) {
            var result = error.fileOperationResult;
            // Apply orphaned state based on error code
            _this.setOrphaned(result === 2 /* FILE_NOT_FOUND */);
            // NotModified status is expected and can be handled gracefully
            if (result === 3 /* FILE_NOT_MODIFIED_SINCE */) {
                // Guard against the model having changed in the meantime
                if (currentVersionId === _this.versionId) {
                    _this.setDirty(false); // Ensure we are not tracking a stale state
                }
                return TPromise.as(_this);
            }
            // Ignore when a model has been resolved once and the file was deleted meanwhile. Since
            // we already have the model loaded, we can return to this state and update the orphaned
            // flag to indicate that this model has no version on disk anymore.
            if (_this.isResolved() && result === 2 /* FILE_NOT_FOUND */) {
                return TPromise.as(_this);
            }
            // Otherwise bubble up the error
            return TPromise.wrapError(error);
        });
    };
    TextFileEditorModel.prototype.loadWithContent = function (content, options, backup) {
        var _this = this;
        return this.doLoadWithContent(content, backup).then(function (model) {
            // Telemetry: We log the fileGet telemetry event after the model has been loaded to ensure a good mimetype
            var settingsType = _this.getTypeIfSettings();
            if (settingsType) {
                /* __GDPR__
                    "settingsRead" : {
                        "settingsType": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                _this.telemetryService.publicLog('settingsRead', { settingsType: settingsType }); // Do not log read to user settings.json and .vscode folder as a fileGet event as it ruins our JSON usage data
            }
            else {
                /* __GDPR__
                    "fileGet" : {
                        "${include}": [
                            "${FileTelemetryData}"
                        ]
                    }
                */
                _this.telemetryService.publicLog('fileGet', _this.getTelemetryData(options && options.reason ? options.reason : 3 /* OTHER */));
            }
            return model;
        });
    };
    TextFileEditorModel.prototype.doLoadWithContent = function (content, backup) {
        this.logService.trace('load() - resolved content', this.resource);
        // Update our resolved disk stat model
        this.updateLastResolvedDiskStat({
            resource: this.resource,
            name: content.name,
            mtime: content.mtime,
            etag: content.etag,
            isDirectory: false,
            isSymbolicLink: false,
            children: void 0,
            isReadonly: content.isReadonly
        });
        // Keep the original encoding to not loose it when saving
        var oldEncoding = this.contentEncoding;
        this.contentEncoding = content.encoding;
        // Handle events if encoding changed
        if (this.preferredEncoding) {
            this.updatePreferredEncoding(this.contentEncoding); // make sure to reflect the real encoding of the file (never out of sync)
        }
        else if (oldEncoding !== this.contentEncoding) {
            this._onDidStateChange.fire(5 /* ENCODING */);
        }
        // Update Existing Model
        if (this.textEditorModel) {
            return this.doUpdateTextModel(content.value);
        }
        // Join an existing request to create the editor model to avoid race conditions
        else if (this.createTextEditorModelPromise) {
            this.logService.trace('load() - join existing text editor model promise', this.resource);
            return this.createTextEditorModelPromise;
        }
        // Create New Model
        return this.doCreateTextModel(content.resource, content.value, backup);
    };
    TextFileEditorModel.prototype.doUpdateTextModel = function (value) {
        this.logService.trace('load() - updated text editor model', this.resource);
        // Ensure we are not tracking a stale state
        this.setDirty(false);
        // Update model value in a block that ignores model content change events
        this.blockModelContentChange = true;
        try {
            this.updateTextEditorModel(value);
        }
        finally {
            this.blockModelContentChange = false;
        }
        // Ensure we track the latest saved version ID given that the contents changed
        this.updateSavedVersionId();
        return TPromise.as(this);
    };
    TextFileEditorModel.prototype.doCreateTextModel = function (resource, value, backup) {
        var _this = this;
        this.logService.trace('load() - created text editor model', this.resource);
        this.createTextEditorModelPromise = this.doLoadBackup(backup).then(function (backupContent) {
            var hasBackupContent = !!backupContent;
            return _this.createTextEditorModel(hasBackupContent ? backupContent : value, resource).then(function () {
                _this.createTextEditorModelPromise = null;
                // We restored a backup so we have to set the model as being dirty
                // We also want to trigger auto save if it is enabled to simulate the exact same behaviour
                // you would get if manually making the model dirty (fixes https://github.com/Microsoft/vscode/issues/16977)
                if (hasBackupContent) {
                    _this.makeDirty();
                    if (_this.autoSaveAfterMilliesEnabled) {
                        _this.doAutoSave(_this.versionId);
                    }
                }
                // Ensure we are not tracking a stale state
                else {
                    _this.setDirty(false);
                }
                // Model Listeners
                _this.installModelListeners();
                return _this;
            }, function (error) {
                _this.createTextEditorModelPromise = null;
                return TPromise.wrapError(error);
            });
        });
        return this.createTextEditorModelPromise;
    };
    TextFileEditorModel.prototype.installModelListeners = function () {
        // See https://github.com/Microsoft/vscode/issues/30189
        // This code has been extracted to a different method because it caused a memory leak
        // where `value` was captured in the content change listener closure scope.
        var _this = this;
        // Content Change
        this._register(this.textEditorModel.onDidChangeContent(function () { return _this.onModelContentChanged(); }));
    };
    TextFileEditorModel.prototype.doLoadBackup = function (backup) {
        if (!backup) {
            return TPromise.as(null);
        }
        return this.backupFileService.resolveBackupContent(backup).then(function (backupContent) { return backupContent; }, function (error) { return null; } /* ignore errors */);
    };
    TextFileEditorModel.prototype.getOrCreateMode = function (modeService, preferredModeIds, firstLineText) {
        return modeService.getOrCreateModeByFilepathOrFirstLine(this.resource.fsPath, firstLineText);
    };
    TextFileEditorModel.prototype.onModelContentChanged = function () {
        this.logService.trace("onModelContentChanged() - enter", this.resource);
        // In any case increment the version id because it tracks the textual content state of the model at all times
        this.versionId++;
        this.logService.trace("onModelContentChanged() - new versionId " + this.versionId, this.resource);
        // Ignore if blocking model changes
        if (this.blockModelContentChange) {
            return;
        }
        // The contents changed as a matter of Undo and the version reached matches the saved one
        // In this case we clear the dirty flag and emit a SAVED event to indicate this state.
        // Note: we currently only do this check when auto-save is turned off because there you see
        // a dirty indicator that you want to get rid of when undoing to the saved version.
        if (!this.autoSaveAfterMilliesEnabled && this.textEditorModel.getAlternativeVersionId() === this.bufferSavedVersionId) {
            this.logService.trace('onModelContentChanged() - model content changed back to last saved version', this.resource);
            // Clear flags
            var wasDirty = this.dirty;
            this.setDirty(false);
            // Emit event
            if (wasDirty) {
                this._onDidStateChange.fire(4 /* REVERTED */);
            }
            return;
        }
        this.logService.trace('onModelContentChanged() - model content changed and marked as dirty', this.resource);
        // Mark as dirty
        this.makeDirty();
        // Start auto save process unless we are in conflict resolution mode and unless it is disabled
        if (this.autoSaveAfterMilliesEnabled) {
            if (!this.inConflictMode) {
                this.doAutoSave(this.versionId);
            }
            else {
                this.logService.trace('makeDirty() - prevented save because we are in conflict resolution mode', this.resource);
            }
        }
        // Handle content change events
        this.contentChangeEventScheduler.schedule();
    };
    TextFileEditorModel.prototype.makeDirty = function () {
        // Track dirty state and version id
        var wasDirty = this.dirty;
        this.setDirty(true);
        // Emit as Event if we turned dirty
        if (!wasDirty) {
            this._onDidStateChange.fire(0 /* DIRTY */);
        }
    };
    TextFileEditorModel.prototype.doAutoSave = function (versionId) {
        var _this = this;
        this.logService.trace("doAutoSave() - enter for versionId " + versionId, this.resource);
        // Cancel any currently running auto saves to make this the one that succeeds
        this.cancelPendingAutoSave();
        // Create new save timer and store it for disposal as needed
        var handle = setTimeout(function () {
            // Only trigger save if the version id has not changed meanwhile
            if (versionId === _this.versionId) {
                _this.doSave(versionId, { reason: 2 /* AUTO */ }); // Very important here to not return the promise because if the timeout promise is canceled it will bubble up the error otherwise - do not change
            }
        }, this.autoSaveAfterMillies);
        this.autoSaveDisposable = toDisposable(function () { return clearTimeout(handle); });
    };
    TextFileEditorModel.prototype.cancelPendingAutoSave = function () {
        if (this.autoSaveDisposable) {
            this.autoSaveDisposable.dispose();
            this.autoSaveDisposable = void 0;
        }
    };
    TextFileEditorModel.prototype.save = function (options) {
        if (options === void 0) { options = Object.create(null); }
        if (!this.isResolved()) {
            return TPromise.wrap(null);
        }
        this.logService.trace('save() - enter', this.resource);
        // Cancel any currently running auto saves to make this the one that succeeds
        this.cancelPendingAutoSave();
        return this.doSave(this.versionId, options);
    };
    TextFileEditorModel.prototype.doSave = function (versionId, options) {
        var _this = this;
        if (isUndefinedOrNull(options.reason)) {
            options.reason = 1 /* EXPLICIT */;
        }
        this.logService.trace("doSave(" + versionId + ") - enter with versionId ' + versionId", this.resource);
        // Lookup any running pending save for this versionId and return it if found
        //
        // Scenario: user invoked the save action multiple times quickly for the same contents
        //           while the save was not yet finished to disk
        //
        if (this.saveSequentializer.hasPendingSave(versionId)) {
            this.logService.trace("doSave(" + versionId + ") - exit - found a pending save for versionId " + versionId, this.resource);
            return this.saveSequentializer.pendingSave;
        }
        // Return early if not dirty (unless forced) or version changed meanwhile
        //
        // Scenario A: user invoked save action even though the model is not dirty
        // Scenario B: auto save was triggered for a certain change by the user but meanwhile the user changed
        //             the contents and the version for which auto save was started is no longer the latest.
        //             Thus we avoid spawning multiple auto saves and only take the latest.
        //
        if ((!options.force && !this.dirty) || versionId !== this.versionId) {
            this.logService.trace("doSave(" + versionId + ") - exit - because not dirty and/or versionId is different (this.isDirty: " + this.dirty + ", this.versionId: " + this.versionId + ")", this.resource);
            return TPromise.wrap(null);
        }
        // Return if currently saving by storing this save request as the next save that should happen.
        // Never ever must 2 saves execute at the same time because this can lead to dirty writes and race conditions.
        //
        // Scenario A: auto save was triggered and is currently busy saving to disk. this takes long enough that another auto save
        //             kicks in.
        // Scenario B: save is very slow (e.g. network share) and the user manages to change the buffer and trigger another save
        //             while the first save has not returned yet.
        //
        if (this.saveSequentializer.hasPendingSave()) {
            this.logService.trace("doSave(" + versionId + ") - exit - because busy saving", this.resource);
            // Register this as the next upcoming save and return
            return this.saveSequentializer.setNext(function () { return _this.doSave(_this.versionId /* make sure to use latest version id here */, options); });
        }
        // Push all edit operations to the undo stack so that the user has a chance to
        // Ctrl+Z back to the saved version. We only do this when auto-save is turned off
        if (!this.autoSaveAfterMilliesEnabled) {
            this.textEditorModel.pushStackElement();
        }
        // A save participant can still change the model now and since we are so close to saving
        // we do not want to trigger another auto save or similar, so we block this
        // In addition we update our version right after in case it changed because of a model change
        // Save participants can also be skipped through API.
        var saveParticipantPromise = TPromise.as(versionId);
        if (TextFileEditorModel.saveParticipant && !options.skipSaveParticipants) {
            var onCompleteOrError = function () {
                _this.blockModelContentChange = false;
                return _this.versionId;
            };
            saveParticipantPromise = TPromise.as(undefined).then(function () {
                _this.blockModelContentChange = true;
                return TextFileEditorModel.saveParticipant.participate(_this, { reason: options.reason });
            }).then(onCompleteOrError, onCompleteOrError);
        }
        // mark the save participant as current pending save operation
        return this.saveSequentializer.setPending(versionId, saveParticipantPromise.then(function (newVersionId) {
            // We have to protect against being disposed at this point. It could be that the save() operation
            // was triggerd followed by a dispose() operation right after without waiting. Typically we cannot
            // be disposed if we are dirty, but if we are not dirty, save() and dispose() can still be triggered
            // one after the other without waiting for the save() to complete. If we are disposed(), we risk
            // saving contents to disk that are stale (see https://github.com/Microsoft/vscode/issues/50942).
            // To fix this issue, we will not store the contents to disk when we got disposed.
            if (_this.disposed) {
                return void 0;
            }
            // Under certain conditions we do a short-cut of flushing contents to disk when we can assume that
            // the file has not changed and as such was not dirty before.
            // The conditions are all of:
            // - a forced, explicit save (Ctrl+S)
            // - the model is not dirty (otherwise we know there are changed which needs to go to the file)
            // - the model is not in orphan mode (because in that case we know the file does not exist on disk)
            // - the model version did not change due to save participants running
            if (options.force && !_this.dirty && !_this.inOrphanMode && options.reason === 1 /* EXPLICIT */ && versionId === newVersionId) {
                return _this.doTouch(newVersionId);
            }
            // update versionId with its new value (if pre-save changes happened)
            versionId = newVersionId;
            // Clear error flag since we are trying to save again
            _this.inErrorMode = false;
            // Remember when this model was saved last
            _this.lastSaveAttemptTime = Date.now();
            // Save to Disk
            // mark the save operation as currently pending with the versionId (it might have changed from a save participant triggering)
            _this.logService.trace("doSave(" + versionId + ") - before updateContent()", _this.resource);
            return _this.saveSequentializer.setPending(newVersionId, _this.fileService.updateContent(_this.lastResolvedDiskStat.resource, _this.createSnapshot(), {
                overwriteReadonly: options.overwriteReadonly,
                overwriteEncoding: options.overwriteEncoding,
                mtime: _this.lastResolvedDiskStat.mtime,
                encoding: _this.getEncoding(),
                etag: _this.lastResolvedDiskStat.etag,
                writeElevated: options.writeElevated
            }).then(function (stat) {
                _this.logService.trace("doSave(" + versionId + ") - after updateContent()", _this.resource);
                // Telemetry
                var settingsType = _this.getTypeIfSettings();
                if (settingsType) {
                    /* __GDPR__
                        "settingsWritten" : {
                            "settingsType": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                        }
                    */
                    _this.telemetryService.publicLog('settingsWritten', { settingsType: settingsType }); // Do not log write to user settings.json and .vscode folder as a filePUT event as it ruins our JSON usage data
                }
                else {
                    /* __GDPR__
                        "filePUT" : {
                            "${include}": [
                                "${FileTelemetryData}"
                            ]
                        }
                    */
                    _this.telemetryService.publicLog('filePUT', _this.getTelemetryData(options.reason));
                }
                // Update dirty state unless model has changed meanwhile
                if (versionId === _this.versionId) {
                    _this.logService.trace("doSave(" + versionId + ") - setting dirty to false because versionId did not change", _this.resource);
                    _this.setDirty(false);
                }
                else {
                    _this.logService.trace("doSave(" + versionId + ") - not setting dirty to false because versionId did change meanwhile", _this.resource);
                }
                // Updated resolved stat with updated stat
                _this.updateLastResolvedDiskStat(stat);
                // Cancel any content change event promises as they are no longer valid
                _this.contentChangeEventScheduler.cancel();
                // Emit File Saved Event
                _this._onDidStateChange.fire(3 /* SAVED */);
            }, function (error) {
                if (!error) {
                    error = new Error('Unknown Save Error'); // TODO@remote we should never get null as error (https://github.com/Microsoft/vscode/issues/55051)
                }
                _this.logService.error("doSave(" + versionId + ") - exit - resulted in a save error: " + error.toString(), _this.resource);
                // Flag as error state in the model
                _this.inErrorMode = true;
                // Look out for a save conflict
                if (error.fileOperationResult === 4 /* FILE_MODIFIED_SINCE */) {
                    _this.inConflictMode = true;
                }
                // Show to user
                _this.onSaveError(error);
                // Emit as event
                _this._onDidStateChange.fire(2 /* SAVE_ERROR */);
            }));
        }));
    };
    TextFileEditorModel.prototype.getTypeIfSettings = function () {
        if (path.extname(this.resource.fsPath) !== '.json') {
            return '';
        }
        // Check for global settings file
        if (isEqual(this.resource, URI.file(this.environmentService.appSettingsPath), !isLinux)) {
            return 'global-settings';
        }
        // Check for keybindings file
        if (isEqual(this.resource, URI.file(this.environmentService.appKeybindingsPath), !isLinux)) {
            return 'keybindings';
        }
        // Check for locale file
        if (isEqual(this.resource, URI.file(path.join(this.environmentService.appSettingsHome, 'locale.json')), !isLinux)) {
            return 'locale';
        }
        // Check for snippets
        if (isEqualOrParent(this.resource, URI.file(path.join(this.environmentService.appSettingsHome, 'snippets')))) {
            return 'snippets';
        }
        // Check for workspace settings file
        var folders = this.contextService.getWorkspace().folders;
        for (var i = 0; i < folders.length; i++) {
            if (isEqualOrParent(this.resource, folders[i].toResource('.vscode'))) {
                var filename = path.basename(this.resource.fsPath);
                if (TextFileEditorModel.WHITELIST_WORKSPACE_JSON.indexOf(filename) > -1) {
                    return ".vscode/" + filename;
                }
            }
        }
        return '';
    };
    TextFileEditorModel.prototype.getTelemetryData = function (reason) {
        var ext = path.extname(this.resource.fsPath);
        var fileName = path.basename(this.resource.fsPath);
        var telemetryData = {
            mimeType: guessMimeTypes(this.resource.fsPath).join(', '),
            ext: ext,
            path: this.hashService.createSHA1(this.resource.fsPath),
            reason: reason
        };
        if (ext === '.json' && TextFileEditorModel.WHITELIST_JSON.indexOf(fileName) > -1) {
            telemetryData['whitelistedjson'] = fileName;
        }
        /* __GDPR__FRAGMENT__
            "FileTelemetryData" : {
                "mimeType" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "ext": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "path": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "reason": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "whitelistedjson": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        return telemetryData;
    };
    TextFileEditorModel.prototype.doTouch = function (versionId) {
        var _this = this;
        return this.saveSequentializer.setPending(versionId, this.fileService.updateContent(this.lastResolvedDiskStat.resource, this.createSnapshot(), {
            mtime: this.lastResolvedDiskStat.mtime,
            encoding: this.getEncoding(),
            etag: this.lastResolvedDiskStat.etag
        }).then(function (stat) {
            // Updated resolved stat with updated stat since touching it might have changed mtime
            _this.updateLastResolvedDiskStat(stat);
        }, function () { return void 0; } /* gracefully ignore errors if just touching */));
    };
    TextFileEditorModel.prototype.setDirty = function (dirty) {
        var _this = this;
        var wasDirty = this.dirty;
        var wasInConflictMode = this.inConflictMode;
        var wasInErrorMode = this.inErrorMode;
        var oldBufferSavedVersionId = this.bufferSavedVersionId;
        if (!dirty) {
            this.dirty = false;
            this.inConflictMode = false;
            this.inErrorMode = false;
            this.updateSavedVersionId();
        }
        else {
            this.dirty = true;
        }
        // Return function to revert this call
        return function () {
            _this.dirty = wasDirty;
            _this.inConflictMode = wasInConflictMode;
            _this.inErrorMode = wasInErrorMode;
            _this.bufferSavedVersionId = oldBufferSavedVersionId;
        };
    };
    TextFileEditorModel.prototype.updateSavedVersionId = function () {
        // we remember the models alternate version id to remember when the version
        // of the model matches with the saved version on disk. we need to keep this
        // in order to find out if the model changed back to a saved version (e.g.
        // when undoing long enough to reach to a version that is saved and then to
        // clear the dirty flag)
        if (this.textEditorModel) {
            this.bufferSavedVersionId = this.textEditorModel.getAlternativeVersionId();
        }
    };
    TextFileEditorModel.prototype.updateLastResolvedDiskStat = function (newVersionOnDiskStat) {
        // First resolve - just take
        if (!this.lastResolvedDiskStat) {
            this.lastResolvedDiskStat = newVersionOnDiskStat;
        }
        // Subsequent resolve - make sure that we only assign it if the mtime is equal or has advanced.
        // This prevents race conditions from loading and saving. If a save comes in late after a revert
        // was called, the mtime could be out of sync.
        else if (this.lastResolvedDiskStat.mtime <= newVersionOnDiskStat.mtime) {
            this.lastResolvedDiskStat = newVersionOnDiskStat;
        }
    };
    TextFileEditorModel.prototype.onSaveError = function (error) {
        // Prepare handler
        if (!TextFileEditorModel.saveErrorHandler) {
            TextFileEditorModel.setSaveErrorHandler(this.instantiationService.createInstance(DefaultSaveErrorHandler));
        }
        // Handle
        TextFileEditorModel.saveErrorHandler.onSaveError(error, this);
    };
    TextFileEditorModel.prototype.isDirty = function () {
        return this.dirty;
    };
    TextFileEditorModel.prototype.getLastSaveAttemptTime = function () {
        return this.lastSaveAttemptTime;
    };
    TextFileEditorModel.prototype.getETag = function () {
        return this.lastResolvedDiskStat ? this.lastResolvedDiskStat.etag : null;
    };
    TextFileEditorModel.prototype.hasState = function (state) {
        switch (state) {
            case 3 /* CONFLICT */:
                return this.inConflictMode;
            case 1 /* DIRTY */:
                return this.dirty;
            case 5 /* ERROR */:
                return this.inErrorMode;
            case 4 /* ORPHAN */:
                return this.inOrphanMode;
            case 2 /* PENDING_SAVE */:
                return this.saveSequentializer.hasPendingSave();
            case 0 /* SAVED */:
                return !this.dirty;
        }
    };
    TextFileEditorModel.prototype.getEncoding = function () {
        return this.preferredEncoding || this.contentEncoding;
    };
    TextFileEditorModel.prototype.setEncoding = function (encoding, mode) {
        if (!this.isNewEncoding(encoding)) {
            return; // return early if the encoding is already the same
        }
        // Encode: Save with encoding
        if (mode === 0 /* Encode */) {
            this.updatePreferredEncoding(encoding);
            // Save
            if (!this.isDirty()) {
                this.versionId++; // needs to increment because we change the model potentially
                this.makeDirty();
            }
            if (!this.inConflictMode) {
                this.save({ overwriteEncoding: true });
            }
        }
        // Decode: Load with encoding
        else {
            if (this.isDirty()) {
                this.notificationService.info(nls.localize('saveFileFirst', "The file is dirty. Please save it first before reopening it with another encoding."));
                return;
            }
            this.updatePreferredEncoding(encoding);
            // Load
            this.load({
                forceReadFromDisk: true // because encoding has changed
            });
        }
    };
    TextFileEditorModel.prototype.updatePreferredEncoding = function (encoding) {
        if (!this.isNewEncoding(encoding)) {
            return;
        }
        this.preferredEncoding = encoding;
        // Emit
        this._onDidStateChange.fire(5 /* ENCODING */);
    };
    TextFileEditorModel.prototype.isNewEncoding = function (encoding) {
        if (this.preferredEncoding === encoding) {
            return false; // return early if the encoding is already the same
        }
        if (!this.preferredEncoding && this.contentEncoding === encoding) {
            return false; // also return if we don't have a preferred encoding but the content encoding is already the same
        }
        return true;
    };
    TextFileEditorModel.prototype.isResolved = function () {
        return !isUndefinedOrNull(this.lastResolvedDiskStat);
    };
    TextFileEditorModel.prototype.isReadonly = function () {
        return this.lastResolvedDiskStat && this.lastResolvedDiskStat.isReadonly;
    };
    TextFileEditorModel.prototype.isDisposed = function () {
        return this.disposed;
    };
    TextFileEditorModel.prototype.getResource = function () {
        return this.resource;
    };
    TextFileEditorModel.prototype.getStat = function () {
        return this.lastResolvedDiskStat;
    };
    TextFileEditorModel.prototype.dispose = function () {
        this.disposed = true;
        this.inConflictMode = false;
        this.inOrphanMode = false;
        this.inErrorMode = false;
        this.createTextEditorModelPromise = null;
        this.cancelPendingAutoSave();
        _super.prototype.dispose.call(this);
    };
    TextFileEditorModel.DEFAULT_CONTENT_CHANGE_BUFFER_DELAY = CONTENT_CHANGE_EVENT_BUFFER_DELAY;
    TextFileEditorModel.DEFAULT_ORPHANED_CHANGE_BUFFER_DELAY = 100;
    TextFileEditorModel.WHITELIST_JSON = ['package.json', 'package-lock.json', 'tsconfig.json', 'jsconfig.json', 'bower.json', '.eslintrc.json', 'tslint.json', 'composer.json'];
    TextFileEditorModel.WHITELIST_WORKSPACE_JSON = ['settings.json', 'extensions.json', 'tasks.json', 'launch.json'];
    TextFileEditorModel = __decorate([
        __param(2, INotificationService),
        __param(3, IModeService),
        __param(4, IModelService),
        __param(5, IFileService),
        __param(6, IInstantiationService),
        __param(7, ITelemetryService),
        __param(8, ITextFileService),
        __param(9, IBackupFileService),
        __param(10, IEnvironmentService),
        __param(11, IWorkspaceContextService),
        __param(12, IHashService),
        __param(13, ILogService)
    ], TextFileEditorModel);
    return TextFileEditorModel;
}(BaseTextEditorModel));
export { TextFileEditorModel };
var SaveSequentializer = /** @class */ (function () {
    function SaveSequentializer() {
    }
    SaveSequentializer.prototype.hasPendingSave = function (versionId) {
        if (!this._pendingSave) {
            return false;
        }
        if (typeof versionId === 'number') {
            return this._pendingSave.versionId === versionId;
        }
        return !!this._pendingSave;
    };
    Object.defineProperty(SaveSequentializer.prototype, "pendingSave", {
        get: function () {
            return this._pendingSave ? this._pendingSave.promise : void 0;
        },
        enumerable: true,
        configurable: true
    });
    SaveSequentializer.prototype.setPending = function (versionId, promise) {
        var _this = this;
        this._pendingSave = { versionId: versionId, promise: promise };
        promise.then(function () { return _this.donePending(versionId); }, function () { return _this.donePending(versionId); });
        return promise;
    };
    SaveSequentializer.prototype.donePending = function (versionId) {
        if (this._pendingSave && versionId === this._pendingSave.versionId) {
            // only set pending to done if the promise finished that is associated with that versionId
            this._pendingSave = void 0;
            // schedule the next save now that we are free if we have any
            this.triggerNextSave();
        }
    };
    SaveSequentializer.prototype.triggerNextSave = function () {
        if (this._nextSave) {
            var saveOperation = this._nextSave;
            this._nextSave = void 0;
            // Run next save and complete on the associated promise
            saveOperation.run().then(saveOperation.promiseValue, saveOperation.promiseError);
        }
    };
    SaveSequentializer.prototype.setNext = function (run) {
        // this is our first next save, so we create associated promise with it
        // so that we can return a promise that completes when the save operation
        // has completed.
        if (!this._nextSave) {
            var promiseValue_1;
            var promiseError_1;
            var promise = new TPromise(function (c, e) {
                promiseValue_1 = c;
                promiseError_1 = e;
            });
            this._nextSave = {
                run: run,
                promise: promise,
                promiseValue: promiseValue_1,
                promiseError: promiseError_1
            };
        }
        // we have a previous next save, just overwrite it
        else {
            this._nextSave.run = run;
        }
        return this._nextSave.promise;
    };
    return SaveSequentializer;
}());
export { SaveSequentializer };
var DefaultSaveErrorHandler = /** @class */ (function () {
    function DefaultSaveErrorHandler(notificationService) {
        this.notificationService = notificationService;
    }
    DefaultSaveErrorHandler.prototype.onSaveError = function (error, model) {
        this.notificationService.error(nls.localize('genericSaveError', "Failed to save '{0}': {1}", path.basename(model.getResource().fsPath), toErrorMessage(error, false)));
    };
    DefaultSaveErrorHandler = __decorate([
        __param(0, INotificationService)
    ], DefaultSaveErrorHandler);
    return DefaultSaveErrorHandler;
}());
