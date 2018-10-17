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
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as paths from '../../../../base/common/paths.js';
import * as strings from '../../../../base/common/strings.js';
import { isWindows } from '../../../../base/common/platform.js';
import { TextFileService as AbstractTextFileService } from '../common/textFileService.js';
import { IUntitledEditorService } from '../../untitled/common/untitledEditorService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { createTextBufferFactoryFromStream } from '../../../../editor/common/model/textModel.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IBackupFileService } from '../../backup/common/backup.js';
import { IWindowsService, IWindowService } from '../../../../platform/windows/common/windows.js';
import { IHistoryService } from '../../history/common/history.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { getConfirmMessage, IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IEditorService } from '../../editor/common/editorService.js';
var TextFileService = /** @class */ (function (_super) {
    __extends(TextFileService, _super);
    function TextFileService(contextService, fileService, untitledEditorService, lifecycleService, instantiationService, configurationService, modeService, modelService, windowService, environmentService, notificationService, backupFileService, windowsService, historyService, contextKeyService, dialogService, fileDialogService, editorService) {
        var _this = _super.call(this, lifecycleService, contextService, configurationService, fileService, untitledEditorService, instantiationService, notificationService, environmentService, backupFileService, windowsService, windowService, historyService, contextKeyService, modelService) || this;
        _this.modeService = modeService;
        _this.dialogService = dialogService;
        _this.fileDialogService = fileDialogService;
        _this.editorService = editorService;
        return _this;
    }
    TextFileService.prototype.resolveTextContent = function (resource, options) {
        return this.fileService.resolveStreamContent(resource, options).then(function (streamContent) {
            return createTextBufferFactoryFromStream(streamContent.value).then(function (res) {
                var r = {
                    resource: streamContent.resource,
                    name: streamContent.name,
                    mtime: streamContent.mtime,
                    etag: streamContent.etag,
                    encoding: streamContent.encoding,
                    isReadonly: streamContent.isReadonly,
                    value: res
                };
                return r;
            });
        });
    };
    TextFileService.prototype.confirmSave = function (resources) {
        if (this.environmentService.isExtensionDevelopment) {
            return TPromise.wrap(1 /* DONT_SAVE */); // no veto when we are in extension dev mode because we cannot assum we run interactive (e.g. tests)
        }
        var resourcesToConfirm = this.getDirty(resources);
        if (resourcesToConfirm.length === 0) {
            return TPromise.wrap(1 /* DONT_SAVE */);
        }
        var message = resourcesToConfirm.length === 1 ? nls.localize('saveChangesMessage', "Do you want to save the changes you made to {0}?", paths.basename(resourcesToConfirm[0].fsPath))
            : getConfirmMessage(nls.localize('saveChangesMessages', "Do you want to save the changes to the following {0} files?", resourcesToConfirm.length), resourcesToConfirm);
        var buttons = [
            resourcesToConfirm.length > 1 ? nls.localize({ key: 'saveAll', comment: ['&& denotes a mnemonic'] }, "&&Save All") : nls.localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save"),
            nls.localize({ key: 'dontSave', comment: ['&& denotes a mnemonic'] }, "Do&&n't Save"),
            nls.localize('cancel', "Cancel")
        ];
        return this.dialogService.show(Severity.Warning, message, buttons, {
            cancelId: 2,
            detail: nls.localize('saveChangesDetail', "Your changes will be lost if you don't save them.")
        }).then(function (index) {
            switch (index) {
                case 0: return 0 /* SAVE */;
                case 1: return 1 /* DONT_SAVE */;
                default: return 2 /* CANCEL */;
            }
        });
    };
    TextFileService.prototype.promptForPath = function (resource, defaultUri) {
        var _this = this;
        // Help user to find a name for the file by opening it first
        return this.editorService.openEditor({ resource: resource, options: { revealIfOpened: true, preserveFocus: true, } }).then(function () {
            return _this.fileDialogService.showSaveDialog(_this.getSaveDialogOptions(defaultUri));
        });
    };
    TextFileService.prototype.getSaveDialogOptions = function (defaultUri) {
        var _this = this;
        var options = {
            defaultUri: defaultUri,
            title: nls.localize('saveAsTitle', "Save As")
        };
        // Filters are only enabled on Windows where they work properly
        if (!isWindows) {
            return options;
        }
        // Build the file filter by using our known languages
        var ext = defaultUri ? paths.extname(defaultUri.path) : void 0;
        var matchingFilter;
        var filters = this.modeService.getRegisteredLanguageNames().map(function (languageName) {
            var extensions = _this.modeService.getExtensions(languageName);
            if (!extensions || !extensions.length) {
                return null;
            }
            var filter = { name: languageName, extensions: extensions.slice(0, 10).map(function (e) { return strings.trim(e, '.'); }) };
            if (ext && extensions.indexOf(ext) >= 0) {
                matchingFilter = filter;
                return null; // matching filter will be added last to the top
            }
            return filter;
        }).filter(function (f) { return !!f; });
        // Filters are a bit weird on Windows, based on having a match or not:
        // Match: we put the matching filter first so that it shows up selected and the all files last
        // No match: we put the all files filter first
        var allFilesFilter = { name: nls.localize('allFiles', "All Files"), extensions: ['*'] };
        if (matchingFilter) {
            filters.unshift(matchingFilter);
            filters.unshift(allFilesFilter);
        }
        else {
            filters.unshift(allFilesFilter);
        }
        // Allow to save file without extension
        filters.push({ name: nls.localize('noExt', "No Extension"), extensions: [''] });
        options.filters = filters;
        return options;
    };
    TextFileService = __decorate([
        __param(0, IWorkspaceContextService),
        __param(1, IFileService),
        __param(2, IUntitledEditorService),
        __param(3, ILifecycleService),
        __param(4, IInstantiationService),
        __param(5, IConfigurationService),
        __param(6, IModeService),
        __param(7, IModelService),
        __param(8, IWindowService),
        __param(9, IEnvironmentService),
        __param(10, INotificationService),
        __param(11, IBackupFileService),
        __param(12, IWindowsService),
        __param(13, IHistoryService),
        __param(14, IContextKeyService),
        __param(15, IDialogService),
        __param(16, IFileDialogService),
        __param(17, IEditorService)
    ], TextFileService);
    return TextFileService;
}(AbstractTextFileService));
export { TextFileService };
