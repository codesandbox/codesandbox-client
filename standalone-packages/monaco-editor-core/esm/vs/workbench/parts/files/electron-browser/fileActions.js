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
import './media/fileactions.css';
import * as nls from '../../../../nls';
import * as types from '../../../../base/common/types';
import { isWindows, isLinux } from '../../../../base/common/platform';
import { sequence, always } from '../../../../base/common/async';
import * as paths from '../../../../base/common/paths';
import * as resources from '../../../../base/common/resources';
import { toErrorMessage } from '../../../../base/common/errorMessage';
import * as strings from '../../../../base/common/strings';
import { Action } from '../../../../base/common/actions';
import { dispose } from '../../../../base/common/lifecycle';
import { VIEWLET_ID } from '../common/files';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { IFileService, AutoSaveConfiguration } from '../../../../platform/files/common/files';
import { toResource } from '../../../common/editor';
import { Model, NewStatPlaceholder } from '../common/explorerModel';
import { IUntitledEditorService } from '../../../services/untitled/common/untitledEditorService';
import { CollapseAction } from '../../../browser/viewlet';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen';
import { IViewletService } from '../../../services/viewlet/browser/viewlet';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IWindowService } from '../../../../platform/windows/common/windows';
import { REVEAL_IN_EXPLORER_COMMAND_ID, SAVE_ALL_COMMAND_ID, SAVE_ALL_LABEL, SAVE_ALL_IN_GROUP_COMMAND_ID } from './fileCommands';
import { ITextModelService } from '../../../../editor/common/services/resolverService';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService';
import { IModeService } from '../../../../editor/common/services/modeService';
import { IModelService } from '../../../../editor/common/services/modelService';
import { ICommandService, CommandsRegistry } from '../../../../platform/commands/common/commands';
import { IListService } from '../../../../platform/list/browser/listService';
import { RawContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { Schemas } from '../../../../base/common/network';
import { IDialogService, getConfirmMessage } from '../../../../platform/dialogs/common/dialogs';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification';
import { IEditorService } from '../../../services/editor/common/editorService';
import { CLOSE_EDITORS_AND_GROUP_COMMAND_ID } from '../../../browser/parts/editor/editorCommands';
export var NEW_FILE_COMMAND_ID = 'explorer.newFile';
export var NEW_FILE_LABEL = nls.localize('newFile', "New File");
export var NEW_FOLDER_COMMAND_ID = 'explorer.newFolder';
export var NEW_FOLDER_LABEL = nls.localize('newFolder', "New Folder");
export var TRIGGER_RENAME_LABEL = nls.localize('rename', "Rename");
export var MOVE_FILE_TO_TRASH_LABEL = nls.localize('delete', "Delete");
export var COPY_FILE_LABEL = nls.localize('copyFile', "Copy");
export var PASTE_FILE_LABEL = nls.localize('pasteFile', "Paste");
export var FileCopiedContext = new RawContextKey('fileCopied', false);
var BaseErrorReportingAction = /** @class */ (function (_super) {
    __extends(BaseErrorReportingAction, _super);
    function BaseErrorReportingAction(id, label, _notificationService) {
        var _this = _super.call(this, id, label) || this;
        _this._notificationService = _notificationService;
        return _this;
    }
    Object.defineProperty(BaseErrorReportingAction.prototype, "notificationService", {
        get: function () {
            return this._notificationService;
        },
        enumerable: true,
        configurable: true
    });
    BaseErrorReportingAction.prototype.onError = function (error) {
        if (error.message === 'string') {
            error = error.message;
        }
        this._notificationService.error(toErrorMessage(error, false));
    };
    BaseErrorReportingAction.prototype.onErrorWithRetry = function (error, retry) {
        this._notificationService.prompt(Severity.Error, toErrorMessage(error, false), [{
                label: nls.localize('retry', "Retry"),
                run: function () { return retry(); }
            }]);
    };
    return BaseErrorReportingAction;
}(Action));
export { BaseErrorReportingAction };
var BaseFileAction = /** @class */ (function (_super) {
    __extends(BaseFileAction, _super);
    function BaseFileAction(id, label, fileService, notificationService, textFileService) {
        var _this = _super.call(this, id, label, notificationService) || this;
        _this.fileService = fileService;
        _this.textFileService = textFileService;
        _this.enabled = false;
        return _this;
    }
    BaseFileAction.prototype._isEnabled = function () {
        return true;
    };
    BaseFileAction.prototype._updateEnablement = function () {
        this.enabled = !!(this.fileService && this._isEnabled());
    };
    BaseFileAction = __decorate([
        __param(2, IFileService),
        __param(3, INotificationService),
        __param(4, ITextFileService)
    ], BaseFileAction);
    return BaseFileAction;
}(BaseErrorReportingAction));
export { BaseFileAction };
var TriggerRenameFileAction = /** @class */ (function (_super) {
    __extends(TriggerRenameFileAction, _super);
    function TriggerRenameFileAction(tree, element, fileService, notificationService, textFileService, instantiationService) {
        var _this = _super.call(this, TriggerRenameFileAction.ID, TRIGGER_RENAME_LABEL, fileService, notificationService, textFileService) || this;
        _this.tree = tree;
        _this.element = element;
        _this.renameAction = instantiationService.createInstance(RenameFileAction, element);
        _this._updateEnablement();
        return _this;
    }
    TriggerRenameFileAction.prototype.validateFileName = function (name) {
        var names = name.split(/[\\/]/).filter(function (part) { return !!part; });
        if (names.length > 1) { // error only occurs on multi-path
            var comparer = isLinux ? strings.compare : strings.compareIgnoreCase;
            if (comparer(names[0], this.element.name) === 0) {
                return nls.localize('renameWhenSourcePathIsParentOfTargetError', "Please use the 'New Folder' or 'New File' command to add children to an existing folder");
            }
        }
        return this.renameAction.validateFileName(this.element.parent, name);
    };
    TriggerRenameFileAction.prototype.run = function (context) {
        var _this = this;
        if (!context) {
            return Promise.reject(new Error('No context provided to BaseEnableFileRenameAction.'));
        }
        var viewletState = context.viewletState;
        if (!viewletState) {
            return Promise.reject(new Error('Invalid viewlet state provided to BaseEnableFileRenameAction.'));
        }
        var stat = context.stat;
        if (!stat) {
            return Promise.reject(new Error('Invalid stat provided to BaseEnableFileRenameAction.'));
        }
        viewletState.setEditable(stat, {
            action: this.renameAction,
            validator: function (value) {
                var message = _this.validateFileName(value);
                if (!message) {
                    return null;
                }
                return {
                    content: message,
                    formatContent: true,
                    type: 3 /* ERROR */
                };
            }
        });
        this.tree.refresh(stat, false).then(function () {
            _this.tree.setHighlight(stat);
            var unbind = _this.tree.onDidChangeHighlight(function (e) {
                if (!e.highlight) {
                    viewletState.clearEditable(stat);
                    _this.tree.refresh(stat);
                    unbind.dispose();
                }
            });
        });
        return void 0;
    };
    TriggerRenameFileAction.ID = 'renameFile';
    TriggerRenameFileAction = __decorate([
        __param(2, IFileService),
        __param(3, INotificationService),
        __param(4, ITextFileService),
        __param(5, IInstantiationService)
    ], TriggerRenameFileAction);
    return TriggerRenameFileAction;
}(BaseFileAction));
var BaseRenameAction = /** @class */ (function (_super) {
    __extends(BaseRenameAction, _super);
    function BaseRenameAction(id, label, element, fileService, notificationService, textFileService) {
        var _this = _super.call(this, id, label, fileService, notificationService, textFileService) || this;
        _this.element = element;
        return _this;
    }
    BaseRenameAction.prototype._isEnabled = function () {
        return _super.prototype._isEnabled.call(this) && this.element && !this.element.isReadonly;
    };
    BaseRenameAction.prototype.run = function (context) {
        var _this = this;
        if (!context) {
            return Promise.reject(new Error('No context provided to BaseRenameFileAction.'));
        }
        var name = context.value;
        if (!name) {
            return Promise.reject(new Error('No new name provided to BaseRenameFileAction.'));
        }
        // Automatically trim whitespaces and trailing dots to produce nice file names
        name = getWellFormedFileName(name);
        var existingName = getWellFormedFileName(this.element.name);
        // Return early if name is invalid or didn't change
        if (name === existingName || this.validateFileName(this.element.parent, name)) {
            return Promise.resolve(null);
        }
        // Call function and Emit Event through viewer
        var promise = this.runAction(name).then(null, function (error) {
            _this.onError(error);
        });
        return promise;
    };
    BaseRenameAction.prototype.validateFileName = function (parent, name) {
        var source = this.element.name;
        var target = name;
        if (!isLinux) { // allow rename of same file also when case differs (e.g. Game.js => game.js)
            source = source.toLowerCase();
            target = target.toLowerCase();
        }
        if (getWellFormedFileName(source) === getWellFormedFileName(target)) {
            return null;
        }
        return validateFileName(parent, name);
    };
    BaseRenameAction = __decorate([
        __param(3, IFileService),
        __param(4, INotificationService),
        __param(5, ITextFileService)
    ], BaseRenameAction);
    return BaseRenameAction;
}(BaseFileAction));
export { BaseRenameAction };
var RenameFileAction = /** @class */ (function (_super) {
    __extends(RenameFileAction, _super);
    function RenameFileAction(element, fileService, notificationService, textFileService) {
        var _this = _super.call(this, RenameFileAction.ID, nls.localize('rename', "Rename"), element, fileService, notificationService, textFileService) || this;
        _this._updateEnablement();
        return _this;
    }
    RenameFileAction.prototype.runAction = function (newName) {
        var parentResource = this.element.parent.resource;
        var targetResource = resources.joinPath(parentResource, newName);
        return this.textFileService.move(this.element.resource, targetResource);
    };
    RenameFileAction.ID = 'workbench.files.action.renameFile';
    RenameFileAction = __decorate([
        __param(1, IFileService),
        __param(2, INotificationService),
        __param(3, ITextFileService)
    ], RenameFileAction);
    return RenameFileAction;
}(BaseRenameAction));
/* Base New File/Folder Action */
var BaseNewAction = /** @class */ (function (_super) {
    __extends(BaseNewAction, _super);
    function BaseNewAction(id, label, tree, isFile, editableAction, element, fileService, notificationService, textFileService) {
        var _this = _super.call(this, id, label, fileService, notificationService, textFileService) || this;
        if (element) {
            _this.presetFolder = element.isDirectory ? element : element.parent;
        }
        _this.tree = tree;
        _this.isFile = isFile;
        _this.renameAction = editableAction;
        return _this;
    }
    BaseNewAction.prototype.run = function (context) {
        var _this = this;
        if (!context) {
            return Promise.reject(new Error('No context provided to BaseNewAction.'));
        }
        var viewletState = context.viewletState;
        if (!viewletState) {
            return Promise.reject(new Error('Invalid viewlet state provided to BaseNewAction.'));
        }
        var folder = this.presetFolder;
        if (!folder) {
            var focus_1 = this.tree.getFocus();
            if (focus_1) {
                folder = focus_1.isDirectory ? focus_1 : focus_1.parent;
            }
            else {
                var input = this.tree.getInput();
                folder = input instanceof Model ? input.roots[0] : input;
            }
        }
        if (!folder) {
            return Promise.reject(new Error('Invalid parent folder to create.'));
        }
        if (folder.isReadonly) {
            return Promise.reject(new Error('Parent folder is readonly.'));
        }
        if (!!folder.getChild(NewStatPlaceholder.NAME)) {
            // Do not allow to creatae a new file/folder while in the process of creating a new file/folder #47606
            return Promise.resolve(new Error('Parent folder is already in the process of creating a file'));
        }
        return this.tree.reveal(folder, 0.5).then(function () {
            return _this.tree.expand(folder).then(function () {
                var stat = NewStatPlaceholder.addNewStatPlaceholder(folder, !_this.isFile);
                _this.renameAction.element = stat;
                viewletState.setEditable(stat, {
                    action: _this.renameAction,
                    validator: function (value) {
                        var message = _this.renameAction.validateFileName(folder, value);
                        if (!message) {
                            return null;
                        }
                        return {
                            content: message,
                            formatContent: true,
                            type: 3 /* ERROR */
                        };
                    }
                });
                return _this.tree.refresh(folder).then(function () {
                    return _this.tree.expand(folder).then(function () {
                        return _this.tree.reveal(stat, 0.5).then(function () {
                            _this.tree.setHighlight(stat);
                            var unbind = _this.tree.onDidChangeHighlight(function (e) {
                                if (!e.highlight) {
                                    stat.destroy();
                                    _this.tree.refresh(folder);
                                    unbind.dispose();
                                }
                            });
                        });
                    });
                });
            });
        });
    };
    BaseNewAction = __decorate([
        __param(6, IFileService),
        __param(7, INotificationService),
        __param(8, ITextFileService)
    ], BaseNewAction);
    return BaseNewAction;
}(BaseFileAction));
export { BaseNewAction };
/* New File */
var NewFileAction = /** @class */ (function (_super) {
    __extends(NewFileAction, _super);
    function NewFileAction(tree, element, fileService, notificationService, textFileService, instantiationService) {
        var _this = _super.call(this, 'explorer.newFile', NEW_FILE_LABEL, tree, true, instantiationService.createInstance(CreateFileAction, element), null, fileService, notificationService, textFileService) || this;
        _this.class = 'explorer-action new-file';
        _this._updateEnablement();
        return _this;
    }
    NewFileAction = __decorate([
        __param(2, IFileService),
        __param(3, INotificationService),
        __param(4, ITextFileService),
        __param(5, IInstantiationService)
    ], NewFileAction);
    return NewFileAction;
}(BaseNewAction));
export { NewFileAction };
/* New Folder */
var NewFolderAction = /** @class */ (function (_super) {
    __extends(NewFolderAction, _super);
    function NewFolderAction(tree, element, fileService, notificationService, textFileService, instantiationService) {
        var _this = _super.call(this, 'explorer.newFolder', NEW_FOLDER_LABEL, tree, false, instantiationService.createInstance(CreateFolderAction, element), null, fileService, notificationService, textFileService) || this;
        _this.class = 'explorer-action new-folder';
        _this._updateEnablement();
        return _this;
    }
    NewFolderAction = __decorate([
        __param(2, IFileService),
        __param(3, INotificationService),
        __param(4, ITextFileService),
        __param(5, IInstantiationService)
    ], NewFolderAction);
    return NewFolderAction;
}(BaseNewAction));
export { NewFolderAction };
/* Create new file from anywhere: Open untitled */
var GlobalNewUntitledFileAction = /** @class */ (function (_super) {
    __extends(GlobalNewUntitledFileAction, _super);
    function GlobalNewUntitledFileAction(id, label, editorService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorService = editorService;
        return _this;
    }
    GlobalNewUntitledFileAction.prototype.run = function () {
        return this.editorService.openEditor({ options: { pinned: true } }); // untitled are always pinned
    };
    GlobalNewUntitledFileAction.ID = 'workbench.action.files.newUntitledFile';
    GlobalNewUntitledFileAction.LABEL = nls.localize('newUntitledFile', "New Untitled File");
    GlobalNewUntitledFileAction = __decorate([
        __param(2, IEditorService)
    ], GlobalNewUntitledFileAction);
    return GlobalNewUntitledFileAction;
}(Action));
export { GlobalNewUntitledFileAction };
/* Create New File/Folder (only used internally by explorerViewer) */
var BaseCreateAction = /** @class */ (function (_super) {
    __extends(BaseCreateAction, _super);
    function BaseCreateAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseCreateAction.prototype.validateFileName = function (parent, name) {
        if (this.element instanceof NewStatPlaceholder) {
            return validateFileName(parent, name);
        }
        return _super.prototype.validateFileName.call(this, parent, name);
    };
    return BaseCreateAction;
}(BaseRenameAction));
export { BaseCreateAction };
/* Create New File (only used internally by explorerViewer) */
var CreateFileAction = /** @class */ (function (_super) {
    __extends(CreateFileAction, _super);
    function CreateFileAction(element, fileService, editorService, notificationService, textFileService) {
        var _this = _super.call(this, CreateFileAction.ID, CreateFileAction.LABEL, element, fileService, notificationService, textFileService) || this;
        _this.editorService = editorService;
        _this._updateEnablement();
        return _this;
    }
    CreateFileAction.prototype.runAction = function (fileName) {
        var _this = this;
        var resource = this.element.parent.resource;
        return this.fileService.createFile(resources.joinPath(resource, fileName)).then(function (stat) {
            return _this.editorService.openEditor({ resource: stat.resource, options: { pinned: true } });
        }, function (error) {
            _this.onErrorWithRetry(error, function () { return _this.runAction(fileName); });
        });
    };
    CreateFileAction.ID = 'workbench.files.action.createFileFromExplorer';
    CreateFileAction.LABEL = nls.localize('createNewFile', "New File");
    CreateFileAction = __decorate([
        __param(1, IFileService),
        __param(2, IEditorService),
        __param(3, INotificationService),
        __param(4, ITextFileService)
    ], CreateFileAction);
    return CreateFileAction;
}(BaseCreateAction));
/* Create New Folder (only used internally by explorerViewer) */
var CreateFolderAction = /** @class */ (function (_super) {
    __extends(CreateFolderAction, _super);
    function CreateFolderAction(element, fileService, notificationService, textFileService) {
        var _this = _super.call(this, CreateFolderAction.ID, CreateFolderAction.LABEL, null, fileService, notificationService, textFileService) || this;
        _this._updateEnablement();
        return _this;
    }
    CreateFolderAction.prototype.runAction = function (fileName) {
        var _this = this;
        var resource = this.element.parent.resource;
        return this.fileService.createFolder(resources.joinPath(resource, fileName)).then(null, function (error) {
            _this.onErrorWithRetry(error, function () { return _this.runAction(fileName); });
        });
    };
    CreateFolderAction.ID = 'workbench.files.action.createFolderFromExplorer';
    CreateFolderAction.LABEL = nls.localize('createNewFolder', "New Folder");
    CreateFolderAction = __decorate([
        __param(1, IFileService),
        __param(2, INotificationService),
        __param(3, ITextFileService)
    ], CreateFolderAction);
    return CreateFolderAction;
}(BaseCreateAction));
var BaseDeleteFileAction = /** @class */ (function (_super) {
    __extends(BaseDeleteFileAction, _super);
    function BaseDeleteFileAction(tree, elements, useTrash, fileService, notificationService, dialogService, textFileService, configurationService) {
        var _this = _super.call(this, 'moveFileToTrash', MOVE_FILE_TO_TRASH_LABEL, fileService, notificationService, textFileService) || this;
        _this.tree = tree;
        _this.elements = elements;
        _this.useTrash = useTrash;
        _this.dialogService = dialogService;
        _this.configurationService = configurationService;
        _this.tree = tree;
        _this.useTrash = useTrash && elements.every(function (e) { return !paths.isUNC(e.resource.fsPath); }); // on UNC shares there is no trash
        _this._updateEnablement();
        return _this;
    }
    BaseDeleteFileAction.prototype._isEnabled = function () {
        return _super.prototype._isEnabled.call(this) && this.elements && this.elements.every(function (e) { return !e.isReadonly; });
    };
    BaseDeleteFileAction.prototype.run = function () {
        var _this = this;
        // Remove highlight
        if (this.tree) {
            this.tree.clearHighlight();
        }
        var primaryButton;
        if (this.useTrash) {
            primaryButton = isWindows ? nls.localize('deleteButtonLabelRecycleBin', "&&Move to Recycle Bin") : nls.localize({ key: 'deleteButtonLabelTrash', comment: ['&& denotes a mnemonic'] }, "&&Move to Trash");
        }
        else {
            primaryButton = nls.localize({ key: 'deleteButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Delete");
        }
        var distinctElements = resources.distinctParents(this.elements, function (e) { return e.resource; });
        // Handle dirty
        var confirmDirtyPromise = Promise.resolve(true);
        var dirty = this.textFileService.getDirty().filter(function (d) { return distinctElements.some(function (e) { return resources.isEqualOrParent(d, e.resource, !isLinux /* ignorecase */); }); });
        if (dirty.length) {
            var message = void 0;
            if (distinctElements.length > 1) {
                message = nls.localize('dirtyMessageFilesDelete', "You are deleting files with unsaved changes. Do you want to continue?");
            }
            else if (distinctElements[0].isDirectory) {
                if (dirty.length === 1) {
                    message = nls.localize('dirtyMessageFolderOneDelete', "You are deleting a folder with unsaved changes in 1 file. Do you want to continue?");
                }
                else {
                    message = nls.localize('dirtyMessageFolderDelete', "You are deleting a folder with unsaved changes in {0} files. Do you want to continue?", dirty.length);
                }
            }
            else {
                message = nls.localize('dirtyMessageFileDelete', "You are deleting a file with unsaved changes. Do you want to continue?");
            }
            confirmDirtyPromise = this.dialogService.confirm({
                message: message,
                type: 'warning',
                detail: nls.localize('dirtyWarning', "Your changes will be lost if you don't save them."),
                primaryButton: primaryButton
            }).then(function (res) {
                if (!res.confirmed) {
                    return false;
                }
                _this.skipConfirm = true; // since we already asked for confirmation
                return _this.textFileService.revertAll(dirty).then(function () { return true; });
            });
        }
        // Check if file is dirty in editor and save it to avoid data loss
        return confirmDirtyPromise.then(function (confirmed) {
            if (!confirmed) {
                return null;
            }
            var confirmDeletePromise;
            // Check if we need to ask for confirmation at all
            if (_this.skipConfirm || (_this.useTrash && _this.configurationService.getValue(BaseDeleteFileAction.CONFIRM_DELETE_SETTING_KEY) === false)) {
                confirmDeletePromise = Promise.resolve({ confirmed: true });
            }
            // Confirm for moving to trash
            else if (_this.useTrash) {
                var message = _this.getMoveToTrashMessage(distinctElements);
                confirmDeletePromise = _this.dialogService.confirm({
                    message: message,
                    detail: isWindows ? nls.localize('undoBin', "You can restore from the Recycle Bin.") : nls.localize('undoTrash', "You can restore from the Trash."),
                    primaryButton: primaryButton,
                    checkbox: {
                        label: nls.localize('doNotAskAgain', "Do not ask me again")
                    },
                    type: 'question'
                });
            }
            // Confirm for deleting permanently
            else {
                var message = _this.getDeleteMessage(distinctElements);
                confirmDeletePromise = _this.dialogService.confirm({
                    message: message,
                    detail: nls.localize('irreversible', "This action is irreversible!"),
                    primaryButton: primaryButton,
                    type: 'warning'
                });
            }
            return confirmDeletePromise.then(function (confirmation) {
                // Check for confirmation checkbox
                var updateConfirmSettingsPromise = Promise.resolve(void 0);
                if (confirmation.confirmed && confirmation.checkboxChecked === true) {
                    updateConfirmSettingsPromise = _this.configurationService.updateValue(BaseDeleteFileAction.CONFIRM_DELETE_SETTING_KEY, false, 1 /* USER */);
                }
                return updateConfirmSettingsPromise.then(function () {
                    // Check for confirmation
                    if (!confirmation.confirmed) {
                        return Promise.resolve(null);
                    }
                    // Call function
                    var servicePromise = Promise.all(distinctElements.map(function (e) { return _this.fileService.del(e.resource, { useTrash: _this.useTrash, recursive: true }); })).then(function () {
                        if (distinctElements[0].parent) {
                            _this.tree.setFocus(distinctElements[0].parent); // move focus to parent
                        }
                    }, function (error) {
                        // Handle error to delete file(s) from a modal confirmation dialog
                        var errorMessage;
                        var detailMessage;
                        var primaryButton;
                        if (_this.useTrash) {
                            errorMessage = isWindows ? nls.localize('binFailed', "Failed to delete using the Recycle Bin. Do you want to permanently delete instead?") : nls.localize('trashFailed', "Failed to delete using the Trash. Do you want to permanently delete instead?");
                            detailMessage = nls.localize('irreversible', "This action is irreversible!");
                            primaryButton = nls.localize({ key: 'deletePermanentlyButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Delete Permanently");
                        }
                        else {
                            errorMessage = toErrorMessage(error, false);
                            primaryButton = nls.localize({ key: 'retryButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Retry");
                        }
                        return _this.dialogService.confirm({
                            message: errorMessage,
                            detail: detailMessage,
                            type: 'warning',
                            primaryButton: primaryButton
                        }).then(function (res) {
                            // Focus back to tree
                            _this.tree.domFocus();
                            if (res.confirmed) {
                                if (_this.useTrash) {
                                    _this.useTrash = false; // Delete Permanently
                                }
                                _this.skipConfirm = true;
                                return _this.run();
                            }
                            return Promise.resolve(void 0);
                        });
                    });
                    return servicePromise;
                });
            });
        });
    };
    BaseDeleteFileAction.prototype.getMoveToTrashMessage = function (distinctElements) {
        if (this.containsBothDirectoryAndFile(distinctElements)) {
            return getConfirmMessage(nls.localize('confirmMoveTrashMessageFilesAndDirectories', "Are you sure you want to delete the following {0} files/directories and their contents?", distinctElements.length), distinctElements.map(function (e) { return e.resource; }));
        }
        if (distinctElements.length > 1) {
            if (distinctElements[0].isDirectory) {
                return getConfirmMessage(nls.localize('confirmMoveTrashMessageMultipleDirectories', "Are you sure you want to delete the following {0} directories and their contents?", distinctElements.length), distinctElements.map(function (e) { return e.resource; }));
            }
            return getConfirmMessage(nls.localize('confirmMoveTrashMessageMultiple', "Are you sure you want to delete the following {0} files?", distinctElements.length), distinctElements.map(function (e) { return e.resource; }));
        }
        if (distinctElements[0].isDirectory) {
            return nls.localize('confirmMoveTrashMessageFolder', "Are you sure you want to delete '{0}' and its contents?", distinctElements[0].name);
        }
        return nls.localize('confirmMoveTrashMessageFile', "Are you sure you want to delete '{0}'?", distinctElements[0].name);
    };
    BaseDeleteFileAction.prototype.getDeleteMessage = function (distinctElements) {
        if (this.containsBothDirectoryAndFile(distinctElements)) {
            return getConfirmMessage(nls.localize('confirmDeleteMessageFilesAndDirectories', "Are you sure you want to permanently delete the following {0} files/directories and their contents?", distinctElements.length), distinctElements.map(function (e) { return e.resource; }));
        }
        if (distinctElements.length > 1) {
            if (distinctElements[0].isDirectory) {
                return getConfirmMessage(nls.localize('confirmDeleteMessageMultipleDirectories', "Are you sure you want to permanently delete the following {0} directories and their contents?", distinctElements.length), distinctElements.map(function (e) { return e.resource; }));
            }
            return getConfirmMessage(nls.localize('confirmDeleteMessageMultiple', "Are you sure you want to permanently delete the following {0} files?", distinctElements.length), distinctElements.map(function (e) { return e.resource; }));
        }
        if (distinctElements[0].isDirectory) {
            return nls.localize('confirmDeleteMessageFolder', "Are you sure you want to permanently delete '{0}' and its contents?", distinctElements[0].name);
        }
        return nls.localize('confirmDeleteMessageFile', "Are you sure you want to permanently delete '{0}'?", distinctElements[0].name);
    };
    BaseDeleteFileAction.prototype.containsBothDirectoryAndFile = function (distinctElements) {
        var directories = distinctElements.filter(function (element) { return element.isDirectory; });
        var files = distinctElements.filter(function (element) { return !element.isDirectory; });
        return directories.length > 0 && files.length > 0;
    };
    BaseDeleteFileAction.CONFIRM_DELETE_SETTING_KEY = 'explorer.confirmDelete';
    BaseDeleteFileAction = __decorate([
        __param(3, IFileService),
        __param(4, INotificationService),
        __param(5, IDialogService),
        __param(6, ITextFileService),
        __param(7, IConfigurationService)
    ], BaseDeleteFileAction);
    return BaseDeleteFileAction;
}(BaseFileAction));
/* Add File */
var AddFilesAction = /** @class */ (function (_super) {
    __extends(AddFilesAction, _super);
    function AddFilesAction(tree, element, clazz, fileService, editorService, dialogService, notificationService, textFileService) {
        var _this = _super.call(this, 'workbench.files.action.addFile', nls.localize('addFiles', "Add Files"), fileService, notificationService, textFileService) || this;
        _this.editorService = editorService;
        _this.dialogService = dialogService;
        _this.tree = tree;
        _this.element = element;
        if (clazz) {
            _this.class = clazz;
        }
        _this._updateEnablement();
        return _this;
    }
    AddFilesAction.prototype.run = function (resourcesToAdd) {
        var _this = this;
        var addPromise = Promise.resolve(null).then(function () {
            if (resourcesToAdd && resourcesToAdd.length > 0) {
                // Find parent to add to
                var targetElement_1;
                if (_this.element) {
                    targetElement_1 = _this.element;
                }
                else {
                    var input = _this.tree.getInput();
                    targetElement_1 = _this.tree.getFocus() || (input instanceof Model ? input.roots[0] : input);
                }
                if (!targetElement_1.isDirectory) {
                    targetElement_1 = targetElement_1.parent;
                }
                // Resolve target to check for name collisions and ask user
                return _this.fileService.resolveFile(targetElement_1.resource).then(function (targetStat) {
                    // Check for name collisions
                    var targetNames = new Set();
                    targetStat.children.forEach(function (child) {
                        targetNames.add(isLinux ? child.name : child.name.toLowerCase());
                    });
                    var overwritePromise = Promise.resolve({ confirmed: true });
                    if (resourcesToAdd.some(function (resource) {
                        return targetNames.has(!resources.hasToIgnoreCase(resource) ? resources.basename(resource) : resources.basename(resource).toLowerCase());
                    })) {
                        var confirm_1 = {
                            message: nls.localize('confirmOverwrite', "A file or folder with the same name already exists in the destination folder. Do you want to replace it?"),
                            detail: nls.localize('irreversible', "This action is irreversible!"),
                            primaryButton: nls.localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
                            type: 'warning'
                        };
                        overwritePromise = _this.dialogService.confirm(confirm_1);
                    }
                    return overwritePromise.then(function (res) {
                        if (!res.confirmed) {
                            return void 0;
                        }
                        // Run add in sequence
                        var addPromisesFactory = [];
                        resourcesToAdd.forEach(function (resource) {
                            addPromisesFactory.push(function () {
                                var sourceFile = resource;
                                var targetFile = resources.joinPath(targetElement_1.resource, resources.basename(sourceFile));
                                // if the target exists and is dirty, make sure to revert it. otherwise the dirty contents
                                // of the target file would replace the contents of the added file. since we already
                                // confirmed the overwrite before, this is OK.
                                var revertPromise = Promise.resolve(null);
                                if (_this.textFileService.isDirty(targetFile)) {
                                    revertPromise = _this.textFileService.revertAll([targetFile], { soft: true });
                                }
                                return revertPromise.then(function () {
                                    var target = resources.joinPath(targetElement_1.resource, resources.basename(sourceFile));
                                    return _this.fileService.copyFile(sourceFile, target, true).then(function (stat) {
                                        // if we only add one file, just open it directly
                                        if (resourcesToAdd.length === 1) {
                                            _this.editorService.openEditor({ resource: stat.resource, options: { pinned: true } });
                                        }
                                    }, function (error) { return _this.onError(error); });
                                });
                            });
                        });
                        return sequence(addPromisesFactory);
                    });
                });
            }
            return void 0;
        });
        return addPromise.then(function () {
            _this.tree.clearHighlight();
        }, function (error) {
            _this.onError(error);
            _this.tree.clearHighlight();
        });
    };
    AddFilesAction = __decorate([
        __param(3, IFileService),
        __param(4, IEditorService),
        __param(5, IDialogService),
        __param(6, INotificationService),
        __param(7, ITextFileService)
    ], AddFilesAction);
    return AddFilesAction;
}(BaseFileAction));
export { AddFilesAction };
// Copy File/Folder
var CopyFileAction = /** @class */ (function (_super) {
    __extends(CopyFileAction, _super);
    function CopyFileAction(tree, elements, fileService, notificationService, textFileService, contextKeyService, clipboardService) {
        var _this = _super.call(this, 'filesExplorer.copy', COPY_FILE_LABEL, fileService, notificationService, textFileService) || this;
        _this.elements = elements;
        _this.clipboardService = clipboardService;
        _this.tree = tree;
        _this._updateEnablement();
        return _this;
    }
    CopyFileAction.prototype.run = function () {
        // Write to clipboard as file/folder to copy
        this.clipboardService.writeResources(this.elements.map(function (e) { return e.resource; }));
        // Remove highlight
        if (this.tree) {
            this.tree.clearHighlight();
        }
        this.tree.domFocus();
        return Promise.resolve(null);
    };
    CopyFileAction = __decorate([
        __param(2, IFileService),
        __param(3, INotificationService),
        __param(4, ITextFileService),
        __param(5, IContextKeyService),
        __param(6, IClipboardService)
    ], CopyFileAction);
    return CopyFileAction;
}(BaseFileAction));
// Paste File/Folder
var PasteFileAction = /** @class */ (function (_super) {
    __extends(PasteFileAction, _super);
    function PasteFileAction(tree, element, fileService, notificationService, textFileService, editorService) {
        var _this = _super.call(this, PasteFileAction.ID, PASTE_FILE_LABEL, fileService, notificationService, textFileService) || this;
        _this.editorService = editorService;
        _this.tree = tree;
        _this.element = element;
        if (!_this.element) {
            var input = _this.tree.getInput();
            _this.element = input instanceof Model ? input.roots[0] : input;
        }
        _this._updateEnablement();
        return _this;
    }
    PasteFileAction.prototype.run = function (fileToPaste) {
        var _this = this;
        // Check if target is ancestor of pasted folder
        if (this.element.resource.toString() !== fileToPaste.toString() && resources.isEqualOrParent(this.element.resource, fileToPaste, !isLinux /* ignorecase */)) {
            throw new Error(nls.localize('fileIsAncestor', "File to paste is an ancestor of the destination folder"));
        }
        return this.fileService.resolveFile(fileToPaste).then(function (fileToPasteStat) {
            // Remove highlight
            if (_this.tree) {
                _this.tree.clearHighlight();
            }
            // Find target
            var target;
            if (_this.element.resource.toString() === fileToPaste.toString()) {
                target = _this.element.parent;
            }
            else {
                target = _this.element.isDirectory ? _this.element : _this.element.parent;
            }
            var targetFile = findValidPasteFileTarget(target, { resource: fileToPaste, isDirectory: fileToPasteStat.isDirectory });
            // Copy File
            return _this.fileService.copyFile(fileToPaste, targetFile).then(function (stat) {
                if (!stat.isDirectory) {
                    return _this.editorService.openEditor({ resource: stat.resource, options: { pinned: true } });
                }
                return void 0;
            }, function (error) { return _this.onError(error); }).then(function () {
                _this.tree.domFocus();
            });
        }, function (error) {
            _this.onError(new Error(nls.localize('fileDeleted', "File to paste was deleted or moved meanwhile")));
        });
    };
    PasteFileAction.ID = 'filesExplorer.paste';
    PasteFileAction = __decorate([
        __param(2, IFileService),
        __param(3, INotificationService),
        __param(4, ITextFileService),
        __param(5, IEditorService)
    ], PasteFileAction);
    return PasteFileAction;
}(BaseFileAction));
// Duplicate File/Folder
var DuplicateFileAction = /** @class */ (function (_super) {
    __extends(DuplicateFileAction, _super);
    function DuplicateFileAction(tree, fileToDuplicate, target, fileService, editorService, notificationService, textFileService) {
        var _this = _super.call(this, 'workbench.files.action.duplicateFile', nls.localize('duplicateFile', "Duplicate"), fileService, notificationService, textFileService) || this;
        _this.editorService = editorService;
        _this.tree = tree;
        _this.element = fileToDuplicate;
        _this.target = (target && target.isDirectory) ? target : fileToDuplicate.parent;
        _this._updateEnablement();
        return _this;
    }
    DuplicateFileAction.prototype.run = function () {
        var _this = this;
        // Remove highlight
        if (this.tree) {
            this.tree.clearHighlight();
        }
        // Copy File
        var result = this.fileService.copyFile(this.element.resource, findValidPasteFileTarget(this.target, { resource: this.element.resource, isDirectory: this.element.isDirectory })).then(function (stat) {
            if (!stat.isDirectory) {
                return _this.editorService.openEditor({ resource: stat.resource, options: { pinned: true } });
            }
            return void 0;
        }, function (error) { return _this.onError(error); });
        return result;
    };
    DuplicateFileAction = __decorate([
        __param(3, IFileService),
        __param(4, IEditorService),
        __param(5, INotificationService),
        __param(6, ITextFileService)
    ], DuplicateFileAction);
    return DuplicateFileAction;
}(BaseFileAction));
export { DuplicateFileAction };
function findValidPasteFileTarget(targetFolder, fileToPaste) {
    var name = resources.basenameOrAuthority(fileToPaste.resource);
    var candidate = resources.joinPath(targetFolder.resource, name);
    while (true) {
        if (!targetFolder.root.find(candidate)) {
            break;
        }
        name = incrementFileName(name, fileToPaste.isDirectory);
        candidate = resources.joinPath(targetFolder.resource, name);
    }
    return candidate;
}
export function incrementFileName(name, isFolder) {
    var separators = '[\\.\\-_]';
    var maxNumber = 1073741824 /* MAX_SAFE_SMALL_INTEGER */;
    // file.1.txt=>file.2.txt
    var suffixFileRegex = RegExp('(.*' + separators + ')(\\d+)(\\..*)$');
    if (!isFolder && name.match(suffixFileRegex)) {
        return name.replace(suffixFileRegex, function (match, g1, g2, g3) {
            var number = parseInt(g2);
            return number < maxNumber
                ? g1 + strings.pad(number + 1, g2.length) + g3
                : strings.format('{0}{1}.1{2}', g1, g2, g3);
        });
    }
    // 1.file.txt=>2.file.txt
    var prefixFileRegex = RegExp('(\\d+)(' + separators + '.*)(\\..*)$');
    if (!isFolder && name.match(prefixFileRegex)) {
        return name.replace(prefixFileRegex, function (match, g1, g2, g3) {
            var number = parseInt(g1);
            return number < maxNumber
                ? strings.pad(number + 1, g1.length) + g2 + g3
                : strings.format('{0}{1}.1{2}', g1, g2, g3);
        });
    }
    // 1.txt=>2.txt
    var prefixFileNoNameRegex = RegExp('(\\d+)(\\..*)$');
    if (!isFolder && name.match(prefixFileNoNameRegex)) {
        return name.replace(prefixFileNoNameRegex, function (match, g1, g2) {
            var number = parseInt(g1);
            return number < maxNumber
                ? strings.pad(number + 1, g1.length) + g2
                : strings.format('{0}.1{1}', g1, g2);
        });
    }
    // file.txt=>file.1.txt
    var lastIndexOfDot = name.lastIndexOf('.');
    if (!isFolder && lastIndexOfDot >= 0) {
        return strings.format('{0}.1{1}', name.substr(0, lastIndexOfDot), name.substr(lastIndexOfDot));
    }
    // folder.1=>folder.2
    if (isFolder && name.match(/(\d+)$/)) {
        return name.replace(/(\d+)$/, function (match) {
            var groups = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                groups[_i - 1] = arguments[_i];
            }
            var number = parseInt(groups[0]);
            return number < maxNumber
                ? strings.pad(number + 1, groups[0].length)
                : strings.format('{0}.1', groups[0]);
        });
    }
    // 1.folder=>2.folder
    if (isFolder && name.match(/^(\d+)/)) {
        return name.replace(/^(\d+)(.*)$/, function (match) {
            var groups = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                groups[_i - 1] = arguments[_i];
            }
            var number = parseInt(groups[0]);
            return number < maxNumber
                ? strings.pad(number + 1, groups[0].length) + groups[1]
                : strings.format('{0}{1}.1', groups[0], groups[1]);
        });
    }
    // file/folder=>file.1/folder.1
    return strings.format('{0}.1', name);
}
// Global Compare with
var GlobalCompareResourcesAction = /** @class */ (function (_super) {
    __extends(GlobalCompareResourcesAction, _super);
    function GlobalCompareResourcesAction(id, label, quickOpenService, editorService, notificationService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickOpenService = quickOpenService;
        _this.editorService = editorService;
        _this.notificationService = notificationService;
        return _this;
    }
    GlobalCompareResourcesAction.prototype.run = function () {
        var _this = this;
        var activeInput = this.editorService.activeEditor;
        var activeResource = activeInput ? activeInput.getResource() : void 0;
        if (activeResource) {
            // Compare with next editor that opens
            var toDispose_1 = this.editorService.overrideOpenEditor(function (editor, options, group) {
                // Only once!
                toDispose_1.dispose();
                // Open editor as diff
                var resource = editor.getResource();
                if (resource) {
                    return {
                        override: _this.editorService.openEditor({
                            leftResource: activeResource,
                            rightResource: resource
                        }).then(function () { return void 0; })
                    };
                }
                return void 0;
            });
            // Bring up quick open
            this.quickOpenService.show('', { autoFocus: { autoFocusSecondEntry: true } }).then(function () {
                toDispose_1.dispose(); // make sure to unbind if quick open is closing
            });
        }
        else {
            this.notificationService.info(nls.localize('openFileToCompare', "Open a file first to compare it with another file."));
        }
        return Promise.resolve(true);
    };
    GlobalCompareResourcesAction.ID = 'workbench.files.action.compareFileWith';
    GlobalCompareResourcesAction.LABEL = nls.localize('globalCompareFile', "Compare Active File With...");
    GlobalCompareResourcesAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IEditorService),
        __param(4, INotificationService)
    ], GlobalCompareResourcesAction);
    return GlobalCompareResourcesAction;
}(Action));
export { GlobalCompareResourcesAction };
// Refresh Explorer Viewer
var RefreshViewExplorerAction = /** @class */ (function (_super) {
    __extends(RefreshViewExplorerAction, _super);
    function RefreshViewExplorerAction(explorerView, clazz) {
        return _super.call(this, 'workbench.files.action.refreshFilesExplorer', nls.localize('refresh', "Refresh"), clazz, true, function (context) { return explorerView.refresh(); }) || this;
    }
    return RefreshViewExplorerAction;
}(Action));
export { RefreshViewExplorerAction };
var ToggleAutoSaveAction = /** @class */ (function (_super) {
    __extends(ToggleAutoSaveAction, _super);
    function ToggleAutoSaveAction(id, label, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.configurationService = configurationService;
        return _this;
    }
    ToggleAutoSaveAction.prototype.run = function () {
        var setting = this.configurationService.inspect('files.autoSave');
        var userAutoSaveConfig = setting.user;
        if (types.isUndefinedOrNull(userAutoSaveConfig)) {
            userAutoSaveConfig = setting.default; // use default if setting not defined
        }
        var newAutoSaveValue;
        if ([AutoSaveConfiguration.AFTER_DELAY, AutoSaveConfiguration.ON_FOCUS_CHANGE, AutoSaveConfiguration.ON_WINDOW_CHANGE].some(function (s) { return s === userAutoSaveConfig; })) {
            newAutoSaveValue = AutoSaveConfiguration.OFF;
        }
        else {
            newAutoSaveValue = AutoSaveConfiguration.AFTER_DELAY;
        }
        return this.configurationService.updateValue('files.autoSave', newAutoSaveValue, 1 /* USER */);
    };
    ToggleAutoSaveAction.ID = 'workbench.action.toggleAutoSave';
    ToggleAutoSaveAction.LABEL = nls.localize('toggleAutoSave', "Toggle Auto Save");
    ToggleAutoSaveAction = __decorate([
        __param(2, IConfigurationService)
    ], ToggleAutoSaveAction);
    return ToggleAutoSaveAction;
}(Action));
export { ToggleAutoSaveAction };
var BaseSaveAllAction = /** @class */ (function (_super) {
    __extends(BaseSaveAllAction, _super);
    function BaseSaveAllAction(id, label, textFileService, untitledEditorService, commandService, notificationService) {
        var _this = _super.call(this, id, label, notificationService) || this;
        _this.textFileService = textFileService;
        _this.untitledEditorService = untitledEditorService;
        _this.commandService = commandService;
        _this.toDispose = [];
        _this.lastIsDirty = _this.textFileService.isDirty();
        _this.enabled = _this.lastIsDirty;
        _this.registerListeners();
        return _this;
    }
    BaseSaveAllAction.prototype.registerListeners = function () {
        var _this = this;
        // listen to files being changed locally
        this.toDispose.push(this.textFileService.models.onModelsDirty(function (e) { return _this.updateEnablement(true); }));
        this.toDispose.push(this.textFileService.models.onModelsSaved(function (e) { return _this.updateEnablement(false); }));
        this.toDispose.push(this.textFileService.models.onModelsReverted(function (e) { return _this.updateEnablement(false); }));
        this.toDispose.push(this.textFileService.models.onModelsSaveError(function (e) { return _this.updateEnablement(true); }));
        if (this.includeUntitled()) {
            this.toDispose.push(this.untitledEditorService.onDidChangeDirty(function (resource) { return _this.updateEnablement(_this.untitledEditorService.isDirty(resource)); }));
        }
    };
    BaseSaveAllAction.prototype.updateEnablement = function (isDirty) {
        if (this.lastIsDirty !== isDirty) {
            this.enabled = this.textFileService.isDirty();
            this.lastIsDirty = this.enabled;
        }
    };
    BaseSaveAllAction.prototype.run = function (context) {
        var _this = this;
        return this.doRun(context).then(function () { return true; }, function (error) {
            _this.onError(error);
            return null;
        });
    };
    BaseSaveAllAction.prototype.dispose = function () {
        this.toDispose = dispose(this.toDispose);
        _super.prototype.dispose.call(this);
    };
    BaseSaveAllAction = __decorate([
        __param(2, ITextFileService),
        __param(3, IUntitledEditorService),
        __param(4, ICommandService),
        __param(5, INotificationService)
    ], BaseSaveAllAction);
    return BaseSaveAllAction;
}(BaseErrorReportingAction));
export { BaseSaveAllAction };
var SaveAllAction = /** @class */ (function (_super) {
    __extends(SaveAllAction, _super);
    function SaveAllAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SaveAllAction.prototype, "class", {
        get: function () {
            return 'explorer-action save-all';
        },
        enumerable: true,
        configurable: true
    });
    SaveAllAction.prototype.doRun = function (context) {
        return this.commandService.executeCommand(SAVE_ALL_COMMAND_ID);
    };
    SaveAllAction.prototype.includeUntitled = function () {
        return true;
    };
    SaveAllAction.ID = 'workbench.action.files.saveAll';
    SaveAllAction.LABEL = SAVE_ALL_LABEL;
    return SaveAllAction;
}(BaseSaveAllAction));
export { SaveAllAction };
var SaveAllInGroupAction = /** @class */ (function (_super) {
    __extends(SaveAllInGroupAction, _super);
    function SaveAllInGroupAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SaveAllInGroupAction.prototype, "class", {
        get: function () {
            return 'explorer-action save-all';
        },
        enumerable: true,
        configurable: true
    });
    SaveAllInGroupAction.prototype.doRun = function (context) {
        return this.commandService.executeCommand(SAVE_ALL_IN_GROUP_COMMAND_ID, {}, context);
    };
    SaveAllInGroupAction.prototype.includeUntitled = function () {
        return true;
    };
    SaveAllInGroupAction.ID = 'workbench.files.action.saveAllInGroup';
    SaveAllInGroupAction.LABEL = nls.localize('saveAllInGroup', "Save All in Group");
    return SaveAllInGroupAction;
}(BaseSaveAllAction));
export { SaveAllInGroupAction };
var CloseGroupAction = /** @class */ (function (_super) {
    __extends(CloseGroupAction, _super);
    function CloseGroupAction(id, label, commandService) {
        var _this = _super.call(this, id, label, 'action-close-all-files') || this;
        _this.commandService = commandService;
        return _this;
    }
    CloseGroupAction.prototype.run = function (context) {
        return this.commandService.executeCommand(CLOSE_EDITORS_AND_GROUP_COMMAND_ID, {}, context);
    };
    CloseGroupAction.ID = 'workbench.files.action.closeGroup';
    CloseGroupAction.LABEL = nls.localize('closeGroup', "Close Group");
    CloseGroupAction = __decorate([
        __param(2, ICommandService)
    ], CloseGroupAction);
    return CloseGroupAction;
}(Action));
export { CloseGroupAction };
var FocusFilesExplorer = /** @class */ (function (_super) {
    __extends(FocusFilesExplorer, _super);
    function FocusFilesExplorer(id, label, viewletService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        return _this;
    }
    FocusFilesExplorer.prototype.run = function () {
        return this.viewletService.openViewlet(VIEWLET_ID, true).then(function (viewlet) {
            var view = viewlet.getExplorerView();
            if (view) {
                view.setExpanded(true);
                view.getViewer().domFocus();
            }
        });
    };
    FocusFilesExplorer.ID = 'workbench.files.action.focusFilesExplorer';
    FocusFilesExplorer.LABEL = nls.localize('focusFilesExplorer', "Focus on Files Explorer");
    FocusFilesExplorer = __decorate([
        __param(2, IViewletService)
    ], FocusFilesExplorer);
    return FocusFilesExplorer;
}(Action));
export { FocusFilesExplorer };
var ShowActiveFileInExplorer = /** @class */ (function (_super) {
    __extends(ShowActiveFileInExplorer, _super);
    function ShowActiveFileInExplorer(id, label, editorService, notificationService, commandService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorService = editorService;
        _this.notificationService = notificationService;
        _this.commandService = commandService;
        return _this;
    }
    ShowActiveFileInExplorer.prototype.run = function () {
        var resource = toResource(this.editorService.activeEditor, { supportSideBySide: true });
        if (resource) {
            this.commandService.executeCommand(REVEAL_IN_EXPLORER_COMMAND_ID, resource);
        }
        else {
            this.notificationService.info(nls.localize('openFileToShow', "Open a file first to show it in the explorer"));
        }
        return Promise.resolve(true);
    };
    ShowActiveFileInExplorer.ID = 'workbench.files.action.showActiveFileInExplorer';
    ShowActiveFileInExplorer.LABEL = nls.localize('showInExplorer', "Reveal Active File in Side Bar");
    ShowActiveFileInExplorer = __decorate([
        __param(2, IEditorService),
        __param(3, INotificationService),
        __param(4, ICommandService)
    ], ShowActiveFileInExplorer);
    return ShowActiveFileInExplorer;
}(Action));
export { ShowActiveFileInExplorer };
var CollapseExplorerView = /** @class */ (function (_super) {
    __extends(CollapseExplorerView, _super);
    function CollapseExplorerView(id, label, viewletService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        return _this;
    }
    CollapseExplorerView.prototype.run = function () {
        return this.viewletService.openViewlet(VIEWLET_ID, true).then(function (viewlet) {
            var explorerView = viewlet.getExplorerView();
            if (explorerView) {
                var viewer = explorerView.getViewer();
                if (viewer) {
                    var action = new CollapseAction(viewer, true, null);
                    action.run();
                    action.dispose();
                }
            }
        });
    };
    CollapseExplorerView.ID = 'workbench.files.action.collapseExplorerFolders';
    CollapseExplorerView.LABEL = nls.localize('collapseExplorerFolders', "Collapse Folders in Explorer");
    CollapseExplorerView = __decorate([
        __param(2, IViewletService)
    ], CollapseExplorerView);
    return CollapseExplorerView;
}(Action));
export { CollapseExplorerView };
var RefreshExplorerView = /** @class */ (function (_super) {
    __extends(RefreshExplorerView, _super);
    function RefreshExplorerView(id, label, viewletService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        return _this;
    }
    RefreshExplorerView.prototype.run = function () {
        return this.viewletService.openViewlet(VIEWLET_ID, true).then(function (viewlet) {
            var explorerView = viewlet.getExplorerView();
            if (explorerView) {
                explorerView.refresh();
            }
        });
    };
    RefreshExplorerView.ID = 'workbench.files.action.refreshFilesExplorer';
    RefreshExplorerView.LABEL = nls.localize('refreshExplorer', "Refresh Explorer");
    RefreshExplorerView = __decorate([
        __param(2, IViewletService)
    ], RefreshExplorerView);
    return RefreshExplorerView;
}(Action));
export { RefreshExplorerView };
var ShowOpenedFileInNewWindow = /** @class */ (function (_super) {
    __extends(ShowOpenedFileInNewWindow, _super);
    function ShowOpenedFileInNewWindow(id, label, editorService, windowService, notificationService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorService = editorService;
        _this.windowService = windowService;
        _this.notificationService = notificationService;
        return _this;
    }
    ShowOpenedFileInNewWindow.prototype.run = function () {
        var fileResource = toResource(this.editorService.activeEditor, { supportSideBySide: true, filter: Schemas.file /* todo@remote */ });
        if (fileResource) {
            this.windowService.openWindow([fileResource], { forceNewWindow: true, forceOpenWorkspaceAsFile: true });
        }
        else {
            this.notificationService.info(nls.localize('openFileToShowInNewWindow', "Open a file first to open in new window"));
        }
        return Promise.resolve(true);
    };
    ShowOpenedFileInNewWindow.ID = 'workbench.action.files.showOpenedFileInNewWindow';
    ShowOpenedFileInNewWindow.LABEL = nls.localize('openFileInNewWindow', "Open Active File in New Window");
    ShowOpenedFileInNewWindow = __decorate([
        __param(2, IEditorService),
        __param(3, IWindowService),
        __param(4, INotificationService)
    ], ShowOpenedFileInNewWindow);
    return ShowOpenedFileInNewWindow;
}(Action));
export { ShowOpenedFileInNewWindow };
export function validateFileName(parent, name) {
    // Produce a well formed file name
    name = getWellFormedFileName(name);
    // Name not provided
    if (!name || name.length === 0 || /^\s+$/.test(name)) {
        return nls.localize('emptyFileNameError', "A file or folder name must be provided.");
    }
    // Relative paths only
    if (name[0] === '/' || name[0] === '\\') {
        return nls.localize('fileNameStartsWithSlashError', "A file or folder name cannot start with a slash.");
    }
    var names = name.split(/[\\/]/).filter(function (part) { return !!part; });
    // Do not allow to overwrite existing file
    var childExists = !!parent.getChild(name);
    if (childExists) {
        return nls.localize('fileNameExistsError', "A file or folder **{0}** already exists at this location. Please choose a different name.", name);
    }
    // Invalid File name
    if (names.some(function (folderName) { return !paths.isValidBasename(folderName); })) {
        return nls.localize('invalidFileNameError', "The name **{0}** is not valid as a file or folder name. Please choose a different name.", trimLongName(name));
    }
    // Max length restriction (on Windows)
    if (isWindows) {
        var fullPathLength = name.length + parent.resource.fsPath.length + 1 /* path segment */;
        if (fullPathLength > 255) {
            return nls.localize('filePathTooLongError', "The name **{0}** results in a path that is too long. Please choose a shorter name.", trimLongName(name));
        }
    }
    return null;
}
function trimLongName(name) {
    if (name && name.length > 255) {
        return name.substr(0, 255) + "...";
    }
    return name;
}
export function getWellFormedFileName(filename) {
    if (!filename) {
        return filename;
    }
    // Trim tabs
    filename = strings.trim(filename, '\t');
    // Remove trailing dots, slashes, and spaces
    filename = strings.rtrim(filename, '.');
    filename = strings.rtrim(filename, '/');
    filename = strings.rtrim(filename, '\\');
    return filename;
}
var CompareWithClipboardAction = /** @class */ (function (_super) {
    __extends(CompareWithClipboardAction, _super);
    function CompareWithClipboardAction(id, label, editorService, instantiationService, textModelService, fileService) {
        var _this = _super.call(this, id, label) || this;
        _this.editorService = editorService;
        _this.instantiationService = instantiationService;
        _this.textModelService = textModelService;
        _this.fileService = fileService;
        _this.enabled = true;
        return _this;
    }
    CompareWithClipboardAction.prototype.run = function () {
        var _this = this;
        var resource = toResource(this.editorService.activeEditor, { supportSideBySide: true });
        if (resource && (this.fileService.canHandleResource(resource) || resource.scheme === Schemas.untitled)) {
            if (!this.registrationDisposal) {
                var provider = this.instantiationService.createInstance(ClipboardContentProvider);
                this.registrationDisposal = this.textModelService.registerTextModelContentProvider(CompareWithClipboardAction.SCHEME, provider);
            }
            var name_1 = resources.basename(resource);
            var editorLabel = nls.localize('clipboardComparisonLabel', "Clipboard ↔ {0}", name_1);
            var cleanUp = function () {
                _this.registrationDisposal = dispose(_this.registrationDisposal);
            };
            return always(this.editorService.openEditor({ leftResource: resource.with({ scheme: CompareWithClipboardAction.SCHEME }), rightResource: resource, label: editorLabel }), cleanUp);
        }
        return Promise.resolve(true);
    };
    CompareWithClipboardAction.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.registrationDisposal = dispose(this.registrationDisposal);
    };
    CompareWithClipboardAction.ID = 'workbench.files.action.compareWithClipboard';
    CompareWithClipboardAction.LABEL = nls.localize('compareWithClipboard', "Compare Active File with Clipboard");
    CompareWithClipboardAction.SCHEME = 'clipboardCompare';
    CompareWithClipboardAction = __decorate([
        __param(2, IEditorService),
        __param(3, IInstantiationService),
        __param(4, ITextModelService),
        __param(5, IFileService)
    ], CompareWithClipboardAction);
    return CompareWithClipboardAction;
}(Action));
export { CompareWithClipboardAction };
var ClipboardContentProvider = /** @class */ (function () {
    function ClipboardContentProvider(clipboardService, modeService, modelService) {
        this.clipboardService = clipboardService;
        this.modeService = modeService;
        this.modelService = modelService;
    }
    ClipboardContentProvider.prototype.provideTextContent = function (resource) {
        var model = this.modelService.createModel(this.clipboardService.readText(), this.modeService.getOrCreateMode('text/plain'), resource);
        return Promise.resolve(model);
    };
    ClipboardContentProvider = __decorate([
        __param(0, IClipboardService),
        __param(1, IModeService),
        __param(2, IModelService)
    ], ClipboardContentProvider);
    return ClipboardContentProvider;
}());
function getContext(listWidget, viewletService) {
    // These commands can only be triggered when explorer viewlet is visible so get it using the active viewlet
    var tree = listWidget;
    var stat = tree.getFocus();
    var selection = tree.getSelection();
    // Only respect the selection if user clicked inside it (focus belongs to it)
    return { stat: stat, selection: selection && selection.indexOf(stat) >= 0 ? selection : [], viewletState: viewletService.getActiveViewlet().getViewletState() };
}
// TODO@isidor these commands are calling into actions due to the complex inheritance action structure.
// It should be the other way around, that actions call into commands.
function openExplorerAndRunAction(accessor, constructor) {
    var instantationService = accessor.get(IInstantiationService);
    var listService = accessor.get(IListService);
    var viewletService = accessor.get(IViewletService);
    var activeViewlet = viewletService.getActiveViewlet();
    var explorerPromise = Promise.resolve(activeViewlet);
    if (!activeViewlet || activeViewlet.getId() !== VIEWLET_ID) {
        explorerPromise = viewletService.openViewlet(VIEWLET_ID, true);
    }
    return explorerPromise.then(function (explorer) {
        var explorerView = explorer.getExplorerView();
        if (explorerView && explorerView.isVisible() && explorerView.isExpanded()) {
            explorerView.focus();
            var explorerContext = getContext(listService.lastFocusedList, viewletService);
            var action = instantationService.createInstance(constructor, listService.lastFocusedList, explorerContext.stat);
            return action.run(explorerContext);
        }
        return undefined;
    });
}
CommandsRegistry.registerCommand({
    id: NEW_FILE_COMMAND_ID,
    handler: function (accessor) {
        return openExplorerAndRunAction(accessor, NewFileAction);
    }
});
CommandsRegistry.registerCommand({
    id: NEW_FOLDER_COMMAND_ID,
    handler: function (accessor) {
        return openExplorerAndRunAction(accessor, NewFolderAction);
    }
});
export var renameHandler = function (accessor) {
    var instantationService = accessor.get(IInstantiationService);
    var listService = accessor.get(IListService);
    var explorerContext = getContext(listService.lastFocusedList, accessor.get(IViewletService));
    var renameAction = instantationService.createInstance(TriggerRenameFileAction, listService.lastFocusedList, explorerContext.stat);
    return renameAction.run(explorerContext);
};
export var moveFileToTrashHandler = function (accessor) {
    var instantationService = accessor.get(IInstantiationService);
    var listService = accessor.get(IListService);
    var explorerContext = getContext(listService.lastFocusedList, accessor.get(IViewletService));
    var stats = explorerContext.selection.length > 1 ? explorerContext.selection : [explorerContext.stat];
    var moveFileToTrashAction = instantationService.createInstance(BaseDeleteFileAction, listService.lastFocusedList, stats, true);
    return moveFileToTrashAction.run();
};
export var deleteFileHandler = function (accessor) {
    var instantationService = accessor.get(IInstantiationService);
    var listService = accessor.get(IListService);
    var explorerContext = getContext(listService.lastFocusedList, accessor.get(IViewletService));
    var stats = explorerContext.selection.length > 1 ? explorerContext.selection : [explorerContext.stat];
    var deleteFileAction = instantationService.createInstance(BaseDeleteFileAction, listService.lastFocusedList, stats, false);
    return deleteFileAction.run();
};
export var copyFileHandler = function (accessor) {
    var instantationService = accessor.get(IInstantiationService);
    var listService = accessor.get(IListService);
    var explorerContext = getContext(listService.lastFocusedList, accessor.get(IViewletService));
    var stats = explorerContext.selection.length > 1 ? explorerContext.selection : [explorerContext.stat];
    var copyFileAction = instantationService.createInstance(CopyFileAction, listService.lastFocusedList, stats);
    return copyFileAction.run();
};
export var pasteFileHandler = function (accessor) {
    var instantationService = accessor.get(IInstantiationService);
    var listService = accessor.get(IListService);
    var clipboardService = accessor.get(IClipboardService);
    var explorerContext = getContext(listService.lastFocusedList, accessor.get(IViewletService));
    return Promise.all(resources.distinctParents(clipboardService.readResources(), function (r) { return r; }).map(function (toCopy) {
        var pasteFileAction = instantationService.createInstance(PasteFileAction, listService.lastFocusedList, explorerContext.stat);
        return pasteFileAction.run(toCopy);
    }));
};
