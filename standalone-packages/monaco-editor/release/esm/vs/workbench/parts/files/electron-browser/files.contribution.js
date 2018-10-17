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
import { URI } from '../../../../base/common/uri.js';
import { Extensions as ViewletExtensions, ViewletDescriptor, ShowViewletAction } from '../../../browser/viewlet.js';
import * as nls from '../../../../nls.js';
import { SyncActionDescriptor, MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Extensions as ActionExtensions } from '../../../common/actions.js';
import { Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { Extensions as EditorInputExtensions } from '../../../common/editor.js';
import { AutoSaveConfiguration, HotExitConfiguration, SUPPORTED_ENCODINGS } from '../../../../platform/files/common/files.js';
import { VIEWLET_ID, SortOrderConfiguration, FILE_EDITOR_INPUT_ID } from '../common/files.js';
import { FileEditorTracker } from '../browser/editors/fileEditorTracker.js';
import { SaveErrorHandler } from './saveErrorHandler.js';
import { FileEditorInput } from '../common/editors/fileEditorInput.js';
import { TextFileEditor } from '../browser/editors/textFileEditor.js';
import { BinaryFileEditor } from '../browser/editors/binaryFileEditor.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
import * as platform from '../../../../base/common/platform.js';
import { DirtyFilesTracker } from '../common/dirtyFilesTracker.js';
import { ExplorerViewlet, ExplorerViewletViewsContribution } from './explorerViewlet.js';
import { EditorDescriptor, Extensions as EditorExtensions } from '../../../browser/editor.js';
import { DataUriEditorInput } from '../../../common/editor/dataUriEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { nativeSep } from '../../../../base/common/paths.js';
import { IPartService } from '../../../services/part/common/partService.js';
// Viewlet Action
var OpenExplorerViewletAction = /** @class */ (function (_super) {
    __extends(OpenExplorerViewletAction, _super);
    function OpenExplorerViewletAction(id, label, viewletService, editorGroupService, partService) {
        return _super.call(this, id, label, VIEWLET_ID, viewletService, editorGroupService, partService) || this;
    }
    OpenExplorerViewletAction.ID = VIEWLET_ID;
    OpenExplorerViewletAction.LABEL = nls.localize('showExplorerViewlet', "Show Explorer");
    OpenExplorerViewletAction = __decorate([
        __param(2, IViewletService),
        __param(3, IEditorGroupsService),
        __param(4, IPartService)
    ], OpenExplorerViewletAction);
    return OpenExplorerViewletAction;
}(ShowViewletAction));
export { OpenExplorerViewletAction };
var FileUriLabelContribution = /** @class */ (function () {
    function FileUriLabelContribution(labelService) {
        labelService.registerFormatter('file://', {
            uri: {
                label: '${authority}${path}',
                separator: nativeSep,
                tildify: !platform.isWindows,
                normalizeDriveLetter: platform.isWindows,
                authorityPrefix: nativeSep + nativeSep
            },
            workspace: {
                suffix: ''
            }
        });
    }
    FileUriLabelContribution = __decorate([
        __param(0, ILabelService)
    ], FileUriLabelContribution);
    return FileUriLabelContribution;
}());
// Register Viewlet
Registry.as(ViewletExtensions.Viewlets).registerViewlet(new ViewletDescriptor(ExplorerViewlet, VIEWLET_ID, nls.localize('explore', "Explorer"), 'explore', 0));
Registry.as(ViewletExtensions.Viewlets).setDefaultViewletId(VIEWLET_ID);
var openViewletKb = {
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 35 /* KEY_E */
};
// Register Action to Open Viewlet
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenExplorerViewletAction, OpenExplorerViewletAction.ID, OpenExplorerViewletAction.LABEL, openViewletKb), 'View: Show Explorer', nls.localize('view', "View"));
// Register file editors
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(TextFileEditor, TextFileEditor.ID, nls.localize('textFileEditor', "Text File Editor")), [
    new SyncDescriptor(FileEditorInput)
]);
Registry.as(EditorExtensions.Editors).registerEditor(new EditorDescriptor(BinaryFileEditor, BinaryFileEditor.ID, nls.localize('binaryFileEditor', "Binary File Editor")), [
    new SyncDescriptor(FileEditorInput),
    new SyncDescriptor(DataUriEditorInput)
]);
// Register default file input factory
Registry.as(EditorInputExtensions.EditorInputFactories).registerFileInputFactory({
    createFileInput: function (resource, encoding, instantiationService) {
        return instantiationService.createInstance(FileEditorInput, resource, encoding);
    },
    isFileInput: function (obj) {
        return obj instanceof FileEditorInput;
    }
});
// Register Editor Input Factory
var FileEditorInputFactory = /** @class */ (function () {
    function FileEditorInputFactory() {
    }
    FileEditorInputFactory.prototype.serialize = function (editorInput) {
        var fileEditorInput = editorInput;
        var resource = fileEditorInput.getResource();
        var fileInput = {
            resource: resource.toString(),
            resourceJSON: resource.toJSON(),
            encoding: fileEditorInput.getEncoding()
        };
        return JSON.stringify(fileInput);
    };
    FileEditorInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
        return instantiationService.invokeFunction(function (accessor) {
            var fileInput = JSON.parse(serializedEditorInput);
            var resource = !!fileInput.resourceJSON ? URI.revive(fileInput.resourceJSON) : URI.parse(fileInput.resource);
            var encoding = fileInput.encoding;
            return accessor.get(IEditorService).createInput({ resource: resource, encoding: encoding, forceFile: true });
        });
    };
    return FileEditorInputFactory;
}());
Registry.as(EditorInputExtensions.EditorInputFactories).registerEditorInputFactory(FILE_EDITOR_INPUT_ID, FileEditorInputFactory);
// Register Explorer views
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ExplorerViewletViewsContribution, 1 /* Starting */);
// Register File Editor Tracker
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(FileEditorTracker, 1 /* Starting */);
// Register Save Error Handler
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(SaveErrorHandler, 1 /* Starting */);
// Register Dirty Files Tracker
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(DirtyFilesTracker, 1 /* Starting */);
// Register uri display for file uris
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(FileUriLabelContribution, 1 /* Starting */);
// Configuration
var configurationRegistry = Registry.as(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
    'id': 'files',
    'order': 9,
    'title': nls.localize('filesConfigurationTitle', "Files"),
    'type': 'object',
    'properties': {
        'files.exclude': {
            'type': 'object',
            'markdownDescription': nls.localize('exclude', "Configure glob patterns for excluding files and folders. For example, the files explorer decides which files and folders to show or hide based on this setting. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options)."),
            'default': { '**/.git': true, '**/.svn': true, '**/.hg': true, '**/CVS': true, '**/.DS_Store': true },
            'scope': 3 /* RESOURCE */,
            'additionalProperties': {
                'anyOf': [
                    {
                        'type': 'boolean',
                        'description': nls.localize('files.exclude.boolean', "The glob pattern to match file paths against. Set to true or false to enable or disable the pattern."),
                    },
                    {
                        'type': 'object',
                        'properties': {
                            'when': {
                                'type': 'string',
                                'pattern': '\\w*\\$\\(basename\\)\\w*',
                                'default': '$(basename).ext',
                                'description': nls.localize('files.exclude.when', "Additional check on the siblings of a matching file. Use $(basename) as variable for the matching file name.")
                            }
                        }
                    }
                ]
            }
        },
        'files.associations': {
            'type': 'object',
            'markdownDescription': nls.localize('associations', "Configure file associations to languages (e.g. `\"*.extension\": \"html\"`). These have precedence over the default associations of the languages installed."),
        },
        'files.encoding': {
            'type': 'string',
            'overridable': true,
            'enum': Object.keys(SUPPORTED_ENCODINGS),
            'default': 'utf8',
            'description': nls.localize('encoding', "The default character set encoding to use when reading and writing files. This setting can also be configured per language."),
            'scope': 3 /* RESOURCE */,
            'enumDescriptions': Object.keys(SUPPORTED_ENCODINGS).map(function (key) { return SUPPORTED_ENCODINGS[key].labelLong; })
        },
        'files.autoGuessEncoding': {
            'type': 'boolean',
            'overridable': true,
            'default': false,
            'description': nls.localize('autoGuessEncoding', "When enabled, the editor will attempt to guess the character set encoding when opening files. This setting can also be configured per language."),
            'scope': 3 /* RESOURCE */
        },
        'files.eol': {
            'type': 'string',
            'enum': [
                '\n',
                '\r\n'
            ],
            'enumDescriptions': [
                nls.localize('eol.LF', "LF"),
                nls.localize('eol.CRLF', "CRLF")
            ],
            'default': (platform.isLinux || platform.isMacintosh) ? '\n' : '\r\n',
            'description': nls.localize('eol', "The default end of line character."),
            'scope': 3 /* RESOURCE */
        },
        'files.enableTrash': {
            'type': 'boolean',
            'default': true,
            'description': nls.localize('useTrash', "Moves files/folders to the OS trash (recycle bin on Windows) when deleting. Disabling this will delete files/folders permanently.")
        },
        'files.trimTrailingWhitespace': {
            'type': 'boolean',
            'default': false,
            'description': nls.localize('trimTrailingWhitespace', "When enabled, will trim trailing whitespace when saving a file."),
            'overridable': true,
            'scope': 3 /* RESOURCE */
        },
        'files.insertFinalNewline': {
            'type': 'boolean',
            'default': false,
            'description': nls.localize('insertFinalNewline', "When enabled, insert a final new line at the end of the file when saving it."),
            'overridable': true,
            'scope': 3 /* RESOURCE */
        },
        'files.trimFinalNewlines': {
            'type': 'boolean',
            'default': false,
            'description': nls.localize('trimFinalNewlines', "When enabled, will trim all new lines after the final new line at the end of the file when saving it."),
            'overridable': true,
            'scope': 3 /* RESOURCE */
        },
        'files.autoSave': {
            'type': 'string',
            'enum': [AutoSaveConfiguration.OFF, AutoSaveConfiguration.AFTER_DELAY, AutoSaveConfiguration.ON_FOCUS_CHANGE, AutoSaveConfiguration.ON_WINDOW_CHANGE],
            'markdownEnumDescriptions': [
                nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.off' }, "A dirty file is never automatically saved."),
                nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.afterDelay' }, "A dirty file is automatically saved after the configured `#files.autoSaveDelay#`."),
                nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.onFocusChange' }, "A dirty file is automatically saved when the editor loses focus."),
                nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'files.autoSave.onWindowChange' }, "A dirty file is automatically saved when the window loses focus.")
            ],
            'default': AutoSaveConfiguration.OFF,
            'markdownDescription': nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'autoSave' }, "Controls auto save of dirty files. Read more about autosave [here](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save).", AutoSaveConfiguration.OFF, AutoSaveConfiguration.AFTER_DELAY, AutoSaveConfiguration.ON_FOCUS_CHANGE, AutoSaveConfiguration.ON_WINDOW_CHANGE, AutoSaveConfiguration.AFTER_DELAY)
        },
        'files.autoSaveDelay': {
            'type': 'number',
            'default': 1000,
            'markdownDescription': nls.localize({ comment: ['This is the description for a setting. Values surrounded by single quotes are not to be translated.'], key: 'autoSaveDelay' }, "Controls the delay in ms after which a dirty file is saved automatically. Only applies when `#files.autoSave#` is set to `{0}`.", AutoSaveConfiguration.AFTER_DELAY)
        },
        'files.watcherExclude': {
            'type': 'object',
            'default': platform.isWindows /* https://github.com/Microsoft/vscode/issues/23954 */ ? { '**/.git/objects/**': true, '**/.git/subtree-cache/**': true, '**/node_modules/*/**': true } : { '**/.git/objects/**': true, '**/.git/subtree-cache/**': true, '**/node_modules/**': true },
            'description': nls.localize('watcherExclude', "Configure glob patterns of file paths to exclude from file watching. Patterns must match on absolute paths (i.e. prefix with ** or the full path to match properly). Changing this setting requires a restart. When you experience Code consuming lots of cpu time on startup, you can exclude large folders to reduce the initial load."),
            'scope': 3 /* RESOURCE */
        },
        'files.hotExit': {
            'type': 'string',
            'enum': [HotExitConfiguration.OFF, HotExitConfiguration.ON_EXIT, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE],
            'default': HotExitConfiguration.ON_EXIT,
            'markdownEnumDescriptions': [
                nls.localize('hotExit.off', 'Disable hot exit.'),
                nls.localize('hotExit.onExit', 'Hot exit will be triggered when the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu). All windows with backups will be restored upon next launch.'),
                nls.localize('hotExit.onExitAndWindowClose', 'Hot exit will be triggered when the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu), and also for any window with a folder opened regardless of whether it\'s the last window. All windows without folders opened will be restored upon next launch. To restore folder windows as they were before shutdown set `#window.restoreWindows#` to `all`.')
            ],
            'description': nls.localize('hotExit', "Controls whether unsaved files are remembered between sessions, allowing the save prompt when exiting the editor to be skipped.", HotExitConfiguration.ON_EXIT, HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE)
        },
        'files.useExperimentalFileWatcher': {
            'type': 'boolean',
            'default': false,
            'description': nls.localize('useExperimentalFileWatcher', "Use the new experimental file watcher.")
        },
        'files.defaultLanguage': {
            'type': 'string',
            'description': nls.localize('defaultLanguage', "The default language mode that is assigned to new files.")
        },
        'files.maxMemoryForLargeFilesMB': {
            'type': 'number',
            'default': 4096,
            'markdownDescription': nls.localize('maxMemoryForLargeFilesMB', "Controls the memory available to VS Code after restart when trying to open large files. Same effect as specifying `--max-memory=NEWSIZE` on the command line.")
        }
    }
});
configurationRegistry.registerConfiguration({
    id: 'editor',
    order: 5,
    title: nls.localize('editorConfigurationTitle', "Editor"),
    type: 'object',
    properties: {
        'editor.formatOnSave': {
            'type': 'boolean',
            'default': false,
            'description': nls.localize('formatOnSave', "Format a file on save. A formatter must be available, the file must not be auto-saved, and editor must not be shutting down."),
            'overridable': true,
            'scope': 3 /* RESOURCE */
        },
        'editor.formatOnSaveTimeout': {
            'type': 'number',
            'default': 750,
            'description': nls.localize('formatOnSaveTimeout', "Timeout in milliseconds after which the formatting that is run on file save is cancelled."),
            'overridable': true,
            'scope': 3 /* RESOURCE */
        }
    }
});
configurationRegistry.registerConfiguration({
    'id': 'explorer',
    'order': 10,
    'title': nls.localize('explorerConfigurationTitle', "File Explorer"),
    'type': 'object',
    'properties': {
        'explorer.openEditors.visible': {
            'type': 'number',
            'description': nls.localize({ key: 'openEditorsVisible', comment: ['Open is an adjective'] }, "Number of editors shown in the Open Editors pane."),
            'default': 9
        },
        'explorer.autoReveal': {
            'type': 'boolean',
            'description': nls.localize('autoReveal', "Controls whether the explorer should automatically reveal and select files when opening them."),
            'default': true
        },
        'explorer.enableDragAndDrop': {
            'type': 'boolean',
            'description': nls.localize('enableDragAndDrop', "Controls whether the explorer should allow to move files and folders via drag and drop."),
            'default': true
        },
        'explorer.confirmDragAndDrop': {
            'type': 'boolean',
            'description': nls.localize('confirmDragAndDrop', "Controls whether the explorer should ask for confirmation to move files and folders via drag and drop."),
            'default': true
        },
        'explorer.confirmDelete': {
            'type': 'boolean',
            'description': nls.localize('confirmDelete', "Controls whether the explorer should ask for confirmation when deleting a file via the trash."),
            'default': true
        },
        'explorer.sortOrder': {
            'type': 'string',
            'enum': [SortOrderConfiguration.DEFAULT, SortOrderConfiguration.MIXED, SortOrderConfiguration.FILES_FIRST, SortOrderConfiguration.TYPE, SortOrderConfiguration.MODIFIED],
            'default': SortOrderConfiguration.DEFAULT,
            'enumDescriptions': [
                nls.localize('sortOrder.default', 'Files and folders are sorted by their names, in alphabetical order. Folders are displayed before files.'),
                nls.localize('sortOrder.mixed', 'Files and folders are sorted by their names, in alphabetical order. Files are interwoven with folders.'),
                nls.localize('sortOrder.filesFirst', 'Files and folders are sorted by their names, in alphabetical order. Files are displayed before folders.'),
                nls.localize('sortOrder.type', 'Files and folders are sorted by their extensions, in alphabetical order. Folders are displayed before files.'),
                nls.localize('sortOrder.modified', 'Files and folders are sorted by last modified date, in descending order. Folders are displayed before files.')
            ],
            'description': nls.localize('sortOrder', "Controls sorting order of files and folders in the explorer.")
        },
        'explorer.decorations.colors': {
            type: 'boolean',
            description: nls.localize('explorer.decorations.colors', "Controls whether file decorations should use colors."),
            default: true
        },
        'explorer.decorations.badges': {
            type: 'boolean',
            description: nls.localize('explorer.decorations.badges', "Controls whether file decorations should use badges."),
            default: true
        },
    }
});
// View menu
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '3_views',
    command: {
        id: VIEWLET_ID,
        title: nls.localize({ key: 'miViewExplorer', comment: ['&& denotes a mnemonic'] }, "&&Explorer")
    },
    order: 1
});
