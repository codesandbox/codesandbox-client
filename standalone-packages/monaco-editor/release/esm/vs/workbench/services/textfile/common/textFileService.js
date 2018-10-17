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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { URI } from '../../../../base/common/uri.js';
import * as paths from '../../../../base/common/paths.js';
import * as errors from '../../../../base/common/errors.js';
import * as objects from '../../../../base/common/objects.js';
import { Emitter } from '../../../../base/common/event.js';
import * as platform from '../../../../base/common/platform.js';
import { AutoSaveContext } from './textfiles.js';
import { AutoSaveConfiguration, HotExitConfiguration } from '../../../../platform/files/common/files.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { TextFileEditorModelManager } from './textFileEditorModelManager.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../editor/common/model/textModel.js';
import { isEqualOrParent, isEqual, joinPath } from '../../../../base/common/resources.js';
/**
 * The workbench file service implementation implements the raw file service spec and adds additional methods on top.
 *
 * It also adds diagnostics and logging around file system operations.
 */
var TextFileService = /** @class */ (function (_super) {
    __extends(TextFileService, _super);
    function TextFileService(lifecycleService, contextService, configurationService, fileService, untitledEditorService, instantiationService, notificationService, environmentService, backupFileService, windowsService, windowService, historyService, contextKeyService, modelService) {
        var _this = _super.call(this) || this;
        _this.lifecycleService = lifecycleService;
        _this.contextService = contextService;
        _this.configurationService = configurationService;
        _this.fileService = fileService;
        _this.untitledEditorService = untitledEditorService;
        _this.instantiationService = instantiationService;
        _this.notificationService = notificationService;
        _this.environmentService = environmentService;
        _this.backupFileService = backupFileService;
        _this.windowsService = windowsService;
        _this.windowService = windowService;
        _this.historyService = historyService;
        _this.modelService = modelService;
        _this._onAutoSaveConfigurationChange = _this._register(new Emitter());
        _this._onFilesAssociationChange = _this._register(new Emitter());
        _this._onWillMove = _this._register(new Emitter());
        _this._models = _this.instantiationService.createInstance(TextFileEditorModelManager);
        _this.autoSaveContext = AutoSaveContext.bindTo(contextKeyService);
        var configuration = _this.configurationService.getValue();
        _this.currentFilesAssociationConfig = configuration && configuration.files && configuration.files.associations;
        _this.onFilesConfigurationChange(configuration);
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(TextFileService.prototype, "onAutoSaveConfigurationChange", {
        get: function () { return this._onAutoSaveConfigurationChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFileService.prototype, "onFilesAssociationChange", {
        get: function () { return this._onFilesAssociationChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFileService.prototype, "onWillMove", {
        get: function () { return this._onWillMove.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFileService.prototype, "models", {
        get: function () {
            return this._models;
        },
        enumerable: true,
        configurable: true
    });
    TextFileService.prototype.registerListeners = function () {
        var _this = this;
        // Lifecycle
        this.lifecycleService.onWillShutdown(function (event) { return event.veto(_this.beforeShutdown(event.reason)); });
        this.lifecycleService.onShutdown(this.dispose, this);
        // Files configuration changes
        this._register(this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration('files')) {
                _this.onFilesConfigurationChange(_this.configurationService.getValue());
            }
        }));
    };
    TextFileService.prototype.beforeShutdown = function (reason) {
        var _this = this;
        // Dirty files need treatment on shutdown
        var dirty = this.getDirty();
        if (dirty.length) {
            // If auto save is enabled, save all files and then check again for dirty files
            // We DO NOT run any save participant if we are in the shutdown phase for performance reasons
            var handleAutoSave = void 0;
            if (this.getAutoSaveMode() !== 0 /* OFF */) {
                handleAutoSave = this.saveAll(false /* files only */, { skipSaveParticipants: true }).then(function () { return _this.getDirty(); });
            }
            else {
                handleAutoSave = TPromise.as(dirty);
            }
            return handleAutoSave.then(function (dirty) {
                // If we still have dirty files, we either have untitled ones or files that cannot be saved
                // or auto save was not enabled and as such we did not save any dirty files to disk automatically
                if (dirty.length) {
                    // If hot exit is enabled, backup dirty files and allow to exit without confirmation
                    if (_this.isHotExitEnabled) {
                        return _this.backupBeforeShutdown(dirty, _this.models, reason).then(function (result) {
                            if (result.didBackup) {
                                return _this.noVeto({ cleanUpBackups: false }); // no veto and no backup cleanup (since backup was successful)
                            }
                            // since a backup did not happen, we have to confirm for the dirty files now
                            return _this.confirmBeforeShutdown();
                        }, function (errors) {
                            var firstError = errors[0];
                            _this.notificationService.error(nls.localize('files.backup.failSave', "Files that are dirty could not be written to the backup location (Error: {0}). Try saving your files first and then exit.", firstError.message));
                            return true; // veto, the backups failed
                        });
                    }
                    // Otherwise just confirm from the user what to do with the dirty files
                    return _this.confirmBeforeShutdown();
                }
                return void 0;
            });
        }
        // No dirty files: no veto
        return this.noVeto({ cleanUpBackups: true });
    };
    TextFileService.prototype.backupBeforeShutdown = function (dirtyToBackup, textFileEditorModelManager, reason) {
        var _this = this;
        return this.windowsService.getWindowCount().then(function (windowCount) {
            // When quit is requested skip the confirm callback and attempt to backup all workspaces.
            // When quit is not requested the confirm callback should be shown when the window being
            // closed is the only VS Code window open, except for on Mac where hot exit is only
            // ever activated when quit is requested.
            var doBackup;
            switch (reason) {
                case 1 /* CLOSE */:
                    if (_this.contextService.getWorkbenchState() !== 1 /* EMPTY */ && _this.configuredHotExit === HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
                        doBackup = true; // backup if a folder is open and onExitAndWindowClose is configured
                    }
                    else if (windowCount > 1 || platform.isMacintosh) {
                        doBackup = false; // do not backup if a window is closed that does not cause quitting of the application
                    }
                    else {
                        doBackup = true; // backup if last window is closed on win/linux where the application quits right after
                    }
                    break;
                case 2 /* QUIT */:
                    doBackup = true; // backup because next start we restore all backups
                    break;
                case 3 /* RELOAD */:
                    doBackup = true; // backup because after window reload, backups restore
                    break;
                case 4 /* LOAD */:
                    if (_this.contextService.getWorkbenchState() !== 1 /* EMPTY */ && _this.configuredHotExit === HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
                        doBackup = true; // backup if a folder is open and onExitAndWindowClose is configured
                    }
                    else {
                        doBackup = false; // do not backup because we are switching contexts
                    }
                    break;
            }
            if (!doBackup) {
                return TPromise.as({ didBackup: false });
            }
            // Backup
            return _this.backupAll(dirtyToBackup, textFileEditorModelManager).then(function () { return { didBackup: true }; });
        });
    };
    TextFileService.prototype.backupAll = function (dirtyToBackup, textFileEditorModelManager) {
        var _this = this;
        // split up between files and untitled
        var filesToBackup = [];
        var untitledToBackup = [];
        dirtyToBackup.forEach(function (s) {
            if (_this.fileService.canHandleResource(s)) {
                filesToBackup.push(textFileEditorModelManager.get(s));
            }
            else if (s.scheme === Schemas.untitled) {
                untitledToBackup.push(s);
            }
        });
        return this.doBackupAll(filesToBackup, untitledToBackup);
    };
    TextFileService.prototype.doBackupAll = function (dirtyFileModels, untitledResources) {
        var _this = this;
        // Handle file resources first
        return TPromise.join(dirtyFileModels.map(function (model) { return _this.backupFileService.backupResource(model.getResource(), model.createSnapshot(), model.getVersionId()); })).then(function (results) {
            // Handle untitled resources
            var untitledModelPromises = untitledResources
                .filter(function (untitled) { return _this.untitledEditorService.exists(untitled); })
                .map(function (untitled) { return _this.untitledEditorService.loadOrCreate({ resource: untitled }); });
            return TPromise.join(untitledModelPromises).then(function (untitledModels) {
                var untitledBackupPromises = untitledModels.map(function (model) {
                    return _this.backupFileService.backupResource(model.getResource(), model.createSnapshot(), model.getVersionId());
                });
                return TPromise.join(untitledBackupPromises).then(function () { return void 0; });
            });
        });
    };
    TextFileService.prototype.confirmBeforeShutdown = function () {
        var _this = this;
        return this.confirmSave().then(function (confirm) {
            // Save
            if (confirm === 0 /* SAVE */) {
                return _this.saveAll(true /* includeUntitled */, { skipSaveParticipants: true }).then(function (result) {
                    if (result.results.some(function (r) { return !r.success; })) {
                        return true; // veto if some saves failed
                    }
                    return _this.noVeto({ cleanUpBackups: true });
                });
            }
            // Don't Save
            else if (confirm === 1 /* DONT_SAVE */) {
                // Make sure to revert untitled so that they do not restore
                // see https://github.com/Microsoft/vscode/issues/29572
                _this.untitledEditorService.revertAll();
                return _this.noVeto({ cleanUpBackups: true });
            }
            // Cancel
            else if (confirm === 2 /* CANCEL */) {
                return true; // veto
            }
            return void 0;
        });
    };
    TextFileService.prototype.noVeto = function (options) {
        if (!options.cleanUpBackups) {
            return false;
        }
        return this.cleanupBackupsBeforeShutdown().then(function () { return false; }, function () { return false; });
    };
    TextFileService.prototype.cleanupBackupsBeforeShutdown = function () {
        if (this.environmentService.isExtensionDevelopment) {
            return TPromise.as(void 0);
        }
        return this.backupFileService.discardAllWorkspaceBackups();
    };
    TextFileService.prototype.onFilesConfigurationChange = function (configuration) {
        var wasAutoSaveEnabled = (this.getAutoSaveMode() !== 0 /* OFF */);
        var autoSaveMode = (configuration && configuration.files && configuration.files.autoSave) || AutoSaveConfiguration.OFF;
        this.autoSaveContext.set(autoSaveMode);
        switch (autoSaveMode) {
            case AutoSaveConfiguration.AFTER_DELAY:
                this.configuredAutoSaveDelay = configuration && configuration.files && configuration.files.autoSaveDelay;
                this.configuredAutoSaveOnFocusChange = false;
                this.configuredAutoSaveOnWindowChange = false;
                break;
            case AutoSaveConfiguration.ON_FOCUS_CHANGE:
                this.configuredAutoSaveDelay = void 0;
                this.configuredAutoSaveOnFocusChange = true;
                this.configuredAutoSaveOnWindowChange = false;
                break;
            case AutoSaveConfiguration.ON_WINDOW_CHANGE:
                this.configuredAutoSaveDelay = void 0;
                this.configuredAutoSaveOnFocusChange = false;
                this.configuredAutoSaveOnWindowChange = true;
                break;
            default:
                this.configuredAutoSaveDelay = void 0;
                this.configuredAutoSaveOnFocusChange = false;
                this.configuredAutoSaveOnWindowChange = false;
                break;
        }
        // Emit as event
        this._onAutoSaveConfigurationChange.fire(this.getAutoSaveConfiguration());
        // save all dirty when enabling auto save
        if (!wasAutoSaveEnabled && this.getAutoSaveMode() !== 0 /* OFF */) {
            this.saveAll();
        }
        // Check for change in files associations
        var filesAssociation = configuration && configuration.files && configuration.files.associations;
        if (!objects.equals(this.currentFilesAssociationConfig, filesAssociation)) {
            this.currentFilesAssociationConfig = filesAssociation;
            this._onFilesAssociationChange.fire();
        }
        // Hot exit
        var hotExitMode = configuration && configuration.files && configuration.files.hotExit;
        if (hotExitMode === HotExitConfiguration.OFF || hotExitMode === HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
            this.configuredHotExit = hotExitMode;
        }
        else {
            this.configuredHotExit = HotExitConfiguration.ON_EXIT;
        }
    };
    TextFileService.prototype.getDirty = function (resources) {
        // Collect files
        var dirty = this.getDirtyFileModels(resources).map(function (m) { return m.getResource(); });
        // Add untitled ones
        dirty.push.apply(dirty, this.untitledEditorService.getDirty(resources));
        return dirty;
    };
    TextFileService.prototype.isDirty = function (resource) {
        // Check for dirty file
        if (this._models.getAll(resource).some(function (model) { return model.isDirty(); })) {
            return true;
        }
        // Check for dirty untitled
        return this.untitledEditorService.getDirty().some(function (dirty) { return !resource || dirty.toString() === resource.toString(); });
    };
    TextFileService.prototype.save = function (resource, options) {
        // Run a forced save if we detect the file is not dirty so that save participants can still run
        if (options && options.force && this.fileService.canHandleResource(resource) && !this.isDirty(resource)) {
            var model_1 = this._models.get(resource);
            if (model_1) {
                if (!options) {
                    options = Object.create(null);
                }
                options.reason = 1 /* EXPLICIT */;
                return model_1.save(options).then(function () { return !model_1.isDirty(); });
            }
        }
        return this.saveAll([resource], options).then(function (result) { return result.results.length === 1 && result.results[0].success; });
    };
    TextFileService.prototype.saveAll = function (arg1, options) {
        // get all dirty
        var toSave = [];
        if (Array.isArray(arg1)) {
            toSave = this.getDirty(arg1);
        }
        else {
            toSave = this.getDirty();
        }
        // split up between files and untitled
        var filesToSave = [];
        var untitledToSave = [];
        toSave.forEach(function (s) {
            if ((Array.isArray(arg1) || arg1 === true /* includeUntitled */) && s.scheme === Schemas.untitled) {
                untitledToSave.push(s);
            }
            else {
                filesToSave.push(s);
            }
        });
        return this.doSaveAll(filesToSave, untitledToSave, options);
    };
    TextFileService.prototype.doSaveAll = function (fileResources, untitledResources, options) {
        var _this = this;
        // Handle files first that can just be saved
        return this.doSaveAllFiles(fileResources, options).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var targetsForUntitled, i, untitled, targetUri, targetPath, untitledSaveAsPromises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetsForUntitled = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < untitledResources.length)) return [3 /*break*/, 6];
                        untitled = untitledResources[i];
                        if (!this.untitledEditorService.exists(untitled)) return [3 /*break*/, 5];
                        targetUri = void 0;
                        if (!this.untitledEditorService.hasAssociatedFilePath(untitled)) return [3 /*break*/, 2];
                        targetUri = untitled.with({ scheme: Schemas.file });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.promptForPath(untitled, this.suggestFileName(untitled))];
                    case 3:
                        targetPath = _a.sent();
                        if (!targetPath) {
                            return [2 /*return*/, TPromise.as({
                                    results: fileResources.concat(untitledResources).map(function (r) {
                                        return {
                                            source: r
                                        };
                                    })
                                })];
                        }
                        targetUri = targetPath;
                        _a.label = 4;
                    case 4:
                        targetsForUntitled.push(targetUri);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        untitledSaveAsPromises = [];
                        targetsForUntitled.forEach(function (target, index) {
                            var untitledSaveAsPromise = _this.saveAs(untitledResources[index], target).then(function (uri) {
                                result.results.push({
                                    source: untitledResources[index],
                                    target: uri,
                                    success: !!uri
                                });
                            });
                            untitledSaveAsPromises.push(untitledSaveAsPromise);
                        });
                        return [2 /*return*/, TPromise.join(untitledSaveAsPromises).then(function () {
                                return result;
                            })];
                }
            });
        }); });
    };
    TextFileService.prototype.doSaveAllFiles = function (resources, options) {
        if (options === void 0) { options = Object.create(null); }
        var dirtyFileModels = this.getDirtyFileModels(Array.isArray(resources) ? resources : void 0 /* Save All */)
            .filter(function (model) {
            if ((model.hasState(3 /* CONFLICT */) || model.hasState(5 /* ERROR */)) && (options.reason === 2 /* AUTO */ || options.reason === 3 /* FOCUS_CHANGE */ || options.reason === 4 /* WINDOW_CHANGE */)) {
                return false; // if model is in save conflict or error, do not save unless save reason is explicit or not provided at all
            }
            return true;
        });
        var mapResourceToResult = new ResourceMap();
        dirtyFileModels.forEach(function (m) {
            mapResourceToResult.set(m.getResource(), {
                source: m.getResource()
            });
        });
        return TPromise.join(dirtyFileModels.map(function (model) {
            return model.save(options).then(function () {
                if (!model.isDirty()) {
                    mapResourceToResult.get(model.getResource()).success = true;
                }
            });
        })).then(function (r) {
            return {
                results: mapResourceToResult.values()
            };
        });
    };
    TextFileService.prototype.getFileModels = function (arg1) {
        var _this = this;
        if (Array.isArray(arg1)) {
            var models_1 = [];
            arg1.forEach(function (resource) {
                models_1.push.apply(models_1, _this.getFileModels(resource));
            });
            return models_1;
        }
        return this._models.getAll(arg1);
    };
    TextFileService.prototype.getDirtyFileModels = function (arg1) {
        return this.getFileModels(arg1).filter(function (model) { return model.isDirty(); });
    };
    TextFileService.prototype.saveAs = function (resource, target, options) {
        var _this = this;
        // Get to target resource
        var targetPromise;
        if (target) {
            targetPromise = TPromise.wrap(target);
        }
        else {
            var dialogPath = resource;
            if (resource.scheme === Schemas.untitled) {
                dialogPath = this.suggestFileName(resource);
            }
            targetPromise = this.promptForPath(resource, dialogPath);
        }
        return targetPromise.then(function (target) {
            if (!target) {
                return TPromise.as(null); // user canceled
            }
            // Just save if target is same as models own resource
            if (resource.toString() === target.toString()) {
                return _this.save(resource, options).then(function () { return resource; });
            }
            // Do it
            return _this.doSaveAs(resource, target, options);
        });
    };
    TextFileService.prototype.doSaveAs = function (resource, target, options) {
        var _this = this;
        // Retrieve text model from provided resource if any
        var modelPromise = TPromise.as(null);
        if (this.fileService.canHandleResource(resource)) {
            modelPromise = TPromise.as(this._models.get(resource));
        }
        else if (resource.scheme === Schemas.untitled && this.untitledEditorService.exists(resource)) {
            modelPromise = this.untitledEditorService.loadOrCreate({ resource: resource });
        }
        return modelPromise.then(function (model) {
            // We have a model: Use it (can be null e.g. if this file is binary and not a text file or was never opened before)
            if (model) {
                return _this.doSaveTextFileAs(model, resource, target, options);
            }
            // Otherwise we can only copy
            return _this.fileService.copyFile(resource, target);
        }).then(function () {
            // Revert the source
            return _this.revert(resource).then(function () {
                // Done: return target
                return target;
            });
        });
    };
    TextFileService.prototype.doSaveTextFileAs = function (sourceModel, resource, target, options) {
        var _this = this;
        var targetModelResolver;
        // Prefer an existing model if it is already loaded for the given target resource
        var targetModel = this.models.get(target);
        if (targetModel && targetModel.isResolved()) {
            targetModelResolver = TPromise.as(targetModel);
        }
        // Otherwise create the target file empty if it does not exist already and resolve it from there
        else {
            targetModelResolver = this.fileService.resolveFile(target).then(function (stat) { return stat; }, function () { return null; }).then(function (stat) { return stat || _this.fileService.updateContent(target, ''); }).then(function (stat) {
                return _this.models.loadOrCreate(target);
            });
        }
        return targetModelResolver.then(function (targetModel) {
            // take over encoding and model value from source model
            targetModel.updatePreferredEncoding(sourceModel.getEncoding());
            _this.modelService.updateModel(targetModel.textEditorModel, createTextBufferFactoryFromSnapshot(sourceModel.createSnapshot()));
            // save model
            return targetModel.save(options);
        }, function (error) {
            // binary model: delete the file and run the operation again
            if (error.fileOperationResult === 0 /* FILE_IS_BINARY */ || error.fileOperationResult === 8 /* FILE_TOO_LARGE */) {
                return _this.fileService.del(target).then(function () { return _this.doSaveTextFileAs(sourceModel, resource, target, options); });
            }
            return TPromise.wrapError(error);
        });
    };
    TextFileService.prototype.suggestFileName = function (untitledResource) {
        var untitledFileName = this.untitledEditorService.suggestFileName(untitledResource);
        var schemeFilter = Schemas.file;
        var lastActiveFile = this.historyService.getLastActiveFile(schemeFilter);
        if (lastActiveFile) {
            return joinPath(lastActiveFile, untitledFileName);
        }
        var lastActiveFolder = this.historyService.getLastActiveWorkspaceRoot(schemeFilter);
        if (lastActiveFolder) {
            return joinPath(lastActiveFolder, untitledFileName);
        }
        return URI.file(untitledFileName);
    };
    TextFileService.prototype.revert = function (resource, options) {
        return this.revertAll([resource], options).then(function (result) { return result.results.length === 1 && result.results[0].success; });
    };
    TextFileService.prototype.revertAll = function (resources, options) {
        var _this = this;
        // Revert files first
        return this.doRevertAllFiles(resources, options).then(function (operation) {
            // Revert untitled
            var reverted = _this.untitledEditorService.revertAll(resources);
            reverted.forEach(function (res) { return operation.results.push({ source: res, success: true }); });
            return operation;
        });
    };
    TextFileService.prototype.doRevertAllFiles = function (resources, options) {
        var fileModels = options && options.force ? this.getFileModels(resources) : this.getDirtyFileModels(resources);
        var mapResourceToResult = new ResourceMap();
        fileModels.forEach(function (m) {
            mapResourceToResult.set(m.getResource(), {
                source: m.getResource()
            });
        });
        return TPromise.join(fileModels.map(function (model) {
            return model.revert(options && options.soft).then(function () {
                if (!model.isDirty()) {
                    mapResourceToResult.get(model.getResource()).success = true;
                }
            }, function (error) {
                // FileNotFound means the file got deleted meanwhile, so still record as successful revert
                if (error.fileOperationResult === 2 /* FILE_NOT_FOUND */) {
                    mapResourceToResult.get(model.getResource()).success = true;
                }
                // Otherwise bubble up the error
                else {
                    return TPromise.wrapError(error);
                }
                return void 0;
            });
        })).then(function (r) {
            return {
                results: mapResourceToResult.values()
            };
        });
    };
    TextFileService.prototype.create = function (resource, contents, options) {
        var existingModel = this.models.get(resource);
        return this.fileService.createFile(resource, contents, options).then(function () {
            // If we had an existing model for the given resource, load
            // it again to make sure it is up to date with the contents
            // we just wrote into the underlying resource by calling
            // revert()
            if (existingModel && !existingModel.isDisposed()) {
                return existingModel.revert();
            }
            return void 0;
        });
    };
    TextFileService.prototype.delete = function (resource, options) {
        var _this = this;
        var dirtyFiles = this.getDirty().filter(function (dirty) { return isEqualOrParent(dirty, resource, !platform.isLinux /* ignorecase */); });
        return this.revertAll(dirtyFiles, { soft: true }).then(function () { return _this.fileService.del(resource, options); });
    };
    TextFileService.prototype.move = function (source, target, overwrite) {
        var _this = this;
        var waitForPromises = [];
        this._onWillMove.fire({
            oldResource: source,
            newResource: target,
            waitUntil: function (p) {
                waitForPromises.push(TPromise.wrap(p).then(undefined, errors.onUnexpectedError));
            }
        });
        // prevent async waitUntil-calls
        Object.freeze(waitForPromises);
        return TPromise.join(waitForPromises).then(function () {
            // Handle target models if existing (if target URI is a folder, this can be multiple)
            var handleTargetModelPromise = TPromise.as(void 0);
            var dirtyTargetModels = _this.getDirtyFileModels().filter(function (model) { return isEqualOrParent(model.getResource(), target, false /* do not ignorecase, see https://github.com/Microsoft/vscode/issues/56384 */); });
            if (dirtyTargetModels.length) {
                handleTargetModelPromise = _this.revertAll(dirtyTargetModels.map(function (targetModel) { return targetModel.getResource(); }), { soft: true });
            }
            return handleTargetModelPromise.then(function () {
                // Handle dirty source models if existing (if source URI is a folder, this can be multiple)
                var handleDirtySourceModels;
                var dirtySourceModels = _this.getDirtyFileModels().filter(function (model) { return isEqualOrParent(model.getResource(), source, !platform.isLinux /* ignorecase */); });
                var dirtyTargetModels = [];
                if (dirtySourceModels.length) {
                    handleDirtySourceModels = TPromise.join(dirtySourceModels.map(function (sourceModel) {
                        var sourceModelResource = sourceModel.getResource();
                        var targetModelResource;
                        // If the source is the actual model, just use target as new resource
                        if (isEqual(sourceModelResource, source, !platform.isLinux /* ignorecase */)) {
                            targetModelResource = target;
                        }
                        // Otherwise a parent folder of the source is being moved, so we need
                        // to compute the target resource based on that
                        else {
                            targetModelResource = sourceModelResource.with({ path: paths.join(target.path, sourceModelResource.path.substr(source.path.length + 1)) });
                        }
                        // Remember as dirty target model to load after the operation
                        dirtyTargetModels.push(targetModelResource);
                        // Backup dirty source model to the target resource it will become later
                        return _this.backupFileService.backupResource(targetModelResource, sourceModel.createSnapshot(), sourceModel.getVersionId());
                    }));
                }
                else {
                    handleDirtySourceModels = TPromise.as(void 0);
                }
                return handleDirtySourceModels.then(function () {
                    // Soft revert the dirty source files if any
                    return _this.revertAll(dirtySourceModels.map(function (dirtySourceModel) { return dirtySourceModel.getResource(); }), { soft: true }).then(function () {
                        // Rename to target
                        return _this.fileService.moveFile(source, target, overwrite).then(function () {
                            // Load models that were dirty before
                            return TPromise.join(dirtyTargetModels.map(function (dirtyTargetModel) { return _this.models.loadOrCreate(dirtyTargetModel); })).then(function () { return void 0; });
                        }, function (error) {
                            // In case of an error, discard any dirty target backups that were made
                            return TPromise.join(dirtyTargetModels.map(function (dirtyTargetModel) { return _this.backupFileService.discardResourceBackup(dirtyTargetModel); }))
                                .then(function () { return TPromise.wrapError(error); });
                        });
                    });
                });
            });
        });
    };
    TextFileService.prototype.getAutoSaveMode = function () {
        if (this.configuredAutoSaveOnFocusChange) {
            return 3 /* ON_FOCUS_CHANGE */;
        }
        if (this.configuredAutoSaveOnWindowChange) {
            return 4 /* ON_WINDOW_CHANGE */;
        }
        if (this.configuredAutoSaveDelay && this.configuredAutoSaveDelay > 0) {
            return this.configuredAutoSaveDelay <= 1000 ? 1 /* AFTER_SHORT_DELAY */ : 2 /* AFTER_LONG_DELAY */;
        }
        return 0 /* OFF */;
    };
    TextFileService.prototype.getAutoSaveConfiguration = function () {
        return {
            autoSaveDelay: this.configuredAutoSaveDelay && this.configuredAutoSaveDelay > 0 ? this.configuredAutoSaveDelay : void 0,
            autoSaveFocusChange: this.configuredAutoSaveOnFocusChange,
            autoSaveApplicationChange: this.configuredAutoSaveOnWindowChange
        };
    };
    Object.defineProperty(TextFileService.prototype, "isHotExitEnabled", {
        get: function () {
            return !this.environmentService.isExtensionDevelopment && this.configuredHotExit !== HotExitConfiguration.OFF;
        },
        enumerable: true,
        configurable: true
    });
    TextFileService.prototype.dispose = function () {
        // Clear all caches
        this._models.clear();
        _super.prototype.dispose.call(this);
    };
    return TextFileService;
}(Disposable));
export { TextFileService };
