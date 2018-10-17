/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nls from '../../../../nls';
import * as paths from '../../../../base/common/paths';
import { URI } from '../../../../base/common/uri';
import { toResource } from '../../../common/editor';
import { IWindowsService, IWindowService } from '../../../../platform/windows/common/windows';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IViewletService } from '../../../services/viewlet/browser/viewlet';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { ExplorerFocusCondition, FileOnDiskContentProvider, VIEWLET_ID } from '../common/files';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { toErrorMessage } from '../../../../base/common/errorMessage';
import { IListService } from '../../../../platform/list/browser/listService';
import { Tree } from '../../../../base/parts/tree/browser/treeImpl';
import { CommandsRegistry } from '../../../../platform/commands/common/commands';
import { RawContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { IFileService } from '../../../../platform/files/common/files';
import { IUntitledEditorService } from '../../../services/untitled/common/untitledEditorService';
import { getCodeEditor } from '../../../../editor/browser/editorBrowser';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry';
import { KeyChord } from '../../../../base/common/keyCodes';
import { isWindows, isMacintosh } from '../../../../base/common/platform';
import { ITextModelService } from '../../../../editor/common/services/resolverService';
import { sequence } from '../../../../base/common/async';
import { getResourceForCommand, getMultiSelectedResources } from '../browser/files';
import { IWorkspaceEditingService } from '../../../services/workspace/common/workspaceEditing';
import { getMultiSelectedEditorContexts } from '../../../browser/parts/editor/editorCommands';
import { Schemas } from '../../../../base/common/network';
import { INotificationService } from '../../../../platform/notification/common/notification';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService';
import { ILabelService } from '../../../../platform/label/common/label';
// Commands
export var REVEAL_IN_OS_COMMAND_ID = 'revealFileInOS';
export var REVEAL_IN_OS_LABEL = isWindows ? nls.localize('revealInWindows', "Reveal in Explorer") : isMacintosh ? nls.localize('revealInMac', "Reveal in Finder") : nls.localize('openContainer', "Open Containing Folder");
export var REVEAL_IN_EXPLORER_COMMAND_ID = 'revealInExplorer';
export var REVERT_FILE_COMMAND_ID = 'workbench.action.files.revert';
export var OPEN_TO_SIDE_COMMAND_ID = 'explorer.openToSide';
export var SELECT_FOR_COMPARE_COMMAND_ID = 'selectForCompare';
export var COMPARE_SELECTED_COMMAND_ID = 'compareSelected';
export var COMPARE_RESOURCE_COMMAND_ID = 'compareFiles';
export var COMPARE_WITH_SAVED_COMMAND_ID = 'workbench.files.action.compareWithSaved';
export var COPY_PATH_COMMAND_ID = 'copyFilePath';
export var COPY_RELATIVE_PATH_COMMAND_ID = 'copyRelativeFilePath';
export var SAVE_FILE_AS_COMMAND_ID = 'workbench.action.files.saveAs';
export var SAVE_FILE_AS_LABEL = nls.localize('saveAs', "Save As...");
export var SAVE_FILE_COMMAND_ID = 'workbench.action.files.save';
export var SAVE_FILE_LABEL = nls.localize('save', "Save");
export var SAVE_FILE_WITHOUT_FORMATTING_COMMAND_ID = 'workbench.action.files.saveWithoutFormatting';
export var SAVE_FILE_WITHOUT_FORMATTING_LABEL = nls.localize('saveWithoutFormatting', "Save without Formatting");
export var SAVE_ALL_COMMAND_ID = 'saveAll';
export var SAVE_ALL_LABEL = nls.localize('saveAll', "Save All");
export var SAVE_ALL_IN_GROUP_COMMAND_ID = 'workbench.files.action.saveAllInGroup';
export var SAVE_FILES_COMMAND_ID = 'workbench.action.files.saveFiles';
export var OpenEditorsGroupContext = new RawContextKey('groupFocusedInOpenEditors', false);
export var DirtyEditorContext = new RawContextKey('dirtyEditor', false);
export var ResourceSelectedForCompareContext = new RawContextKey('resourceSelectedForCompare', false);
export var REMOVE_ROOT_FOLDER_COMMAND_ID = 'removeRootFolder';
export var REMOVE_ROOT_FOLDER_LABEL = nls.localize('removeFolderFromWorkspace', "Remove Folder from Workspace");
export var openWindowCommand = function (accessor, paths, forceNewWindow) {
    var windowService = accessor.get(IWindowService);
    windowService.openWindow(paths.map(function (p) { return typeof p === 'string' ? URI.file(p) : p; }), { forceNewWindow: forceNewWindow });
};
function save(resource, isSaveAs, options, editorService, fileService, untitledEditorService, textFileService, editorGroupService) {
    function ensureForcedSave(options) {
        if (!options) {
            options = { force: true };
        }
        else {
            options.force = true;
        }
        return options;
    }
    if (resource && (fileService.canHandleResource(resource) || resource.scheme === Schemas.untitled)) {
        // Save As (or Save untitled with associated path)
        if (isSaveAs || resource.scheme === Schemas.untitled) {
            var encodingOfSource_1;
            if (resource.scheme === Schemas.untitled) {
                encodingOfSource_1 = untitledEditorService.getEncoding(resource);
            }
            else if (fileService.canHandleResource(resource)) {
                var textModel = textFileService.models.get(resource);
                encodingOfSource_1 = textModel && textModel.getEncoding(); // text model can be null e.g. if this is a binary file!
            }
            var viewStateOfSource_1;
            var activeTextEditorWidget = getCodeEditor(editorService.activeTextEditorWidget);
            if (activeTextEditorWidget) {
                var activeResource = toResource(editorService.activeEditor, { supportSideBySide: true });
                if (activeResource && (fileService.canHandleResource(activeResource) || resource.scheme === Schemas.untitled) && activeResource.toString() === resource.toString()) {
                    viewStateOfSource_1 = activeTextEditorWidget.saveViewState();
                }
            }
            // Special case: an untitled file with associated path gets saved directly unless "saveAs" is true
            var savePromise = void 0;
            if (!isSaveAs && resource.scheme === Schemas.untitled && untitledEditorService.hasAssociatedFilePath(resource)) {
                savePromise = textFileService.save(resource, options).then(function (result) {
                    if (result) {
                        return resource.with({ scheme: Schemas.file });
                    }
                    return null;
                });
            }
            // Otherwise, really "Save As..."
            else {
                // Force a change to the file to trigger external watchers if any
                // fixes https://github.com/Microsoft/vscode/issues/59655
                options = ensureForcedSave(options);
                savePromise = textFileService.saveAs(resource, void 0, options);
            }
            return savePromise.then(function (target) {
                if (!target || target.toString() === resource.toString()) {
                    return void 0; // save canceled or same resource used
                }
                var replacement = {
                    resource: target,
                    encoding: encodingOfSource_1,
                    options: {
                        pinned: true,
                        viewState: viewStateOfSource_1
                    }
                };
                return Promise.all(editorGroupService.groups.map(function (g) {
                    return editorService.replaceEditors([{
                            editor: { resource: resource },
                            replacement: replacement
                        }], g);
                })).then(function () { return true; });
            });
        }
        // Pin the active editor if we are saving it
        var activeControl = editorService.activeControl;
        var activeEditorResource = activeControl && activeControl.input && activeControl.input.getResource();
        if (activeEditorResource && activeEditorResource.toString() === resource.toString()) {
            activeControl.group.pinEditor(activeControl.input);
        }
        // Just save (force a change to the file to trigger external watchers if any)
        options = ensureForcedSave(options);
        return textFileService.save(resource, options);
    }
    return Promise.resolve(false);
}
function saveAll(saveAllArguments, editorService, untitledEditorService, textFileService, editorGroupService) {
    // Store some properties per untitled file to restore later after save is completed
    var groupIdToUntitledResourceInput = new Map();
    editorGroupService.groups.forEach(function (g) {
        var activeEditorResource = g.activeEditor && g.activeEditor.getResource();
        g.editors.forEach(function (e) {
            var resource = e.getResource();
            if (resource && untitledEditorService.isDirty(resource)) {
                if (!groupIdToUntitledResourceInput.has(g.id)) {
                    groupIdToUntitledResourceInput.set(g.id, []);
                }
                groupIdToUntitledResourceInput.get(g.id).push({
                    encoding: untitledEditorService.getEncoding(resource),
                    resource: resource,
                    options: {
                        inactive: activeEditorResource ? activeEditorResource.toString() !== resource.toString() : true,
                        pinned: true,
                        preserveFocus: true,
                        index: g.getIndexOfEditor(e)
                    }
                });
            }
        });
    });
    // Save all
    return textFileService.saveAll(saveAllArguments).then(function (result) {
        groupIdToUntitledResourceInput.forEach(function (inputs, groupId) {
            // Update untitled resources to the saved ones, so we open the proper files
            inputs.forEach(function (i) {
                var targetResult = result.results.filter(function (r) { return r.success && r.source.toString() === i.resource.toString(); }).pop();
                if (targetResult) {
                    i.resource = targetResult.target;
                }
            });
            editorService.openEditors(inputs, groupId);
        });
    });
}
// Command registration
CommandsRegistry.registerCommand({
    id: REVERT_FILE_COMMAND_ID,
    handler: function (accessor, resource) {
        var editorService = accessor.get(IEditorService);
        var textFileService = accessor.get(ITextFileService);
        var notificationService = accessor.get(INotificationService);
        var resources = getMultiSelectedResources(resource, accessor.get(IListService), editorService)
            .filter(function (resource) { return resource.scheme !== Schemas.untitled; });
        if (resources.length) {
            return textFileService.revertAll(resources, { force: true }).then(null, function (error) {
                notificationService.error(nls.localize('genericRevertError', "Failed to revert '{0}': {1}", resources.map(function (r) { return paths.basename(r.fsPath); }).join(', '), toErrorMessage(error, false)));
            });
        }
        return Promise.resolve(true);
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    weight: 200 /* WorkbenchContrib */,
    when: ExplorerFocusCondition,
    primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
    mac: {
        primary: 256 /* WinCtrl */ | 3 /* Enter */
    },
    id: OPEN_TO_SIDE_COMMAND_ID, handler: function (accessor, resource) {
        var editorService = accessor.get(IEditorService);
        var listService = accessor.get(IListService);
        var fileService = accessor.get(IFileService);
        var tree = listService.lastFocusedList;
        var resources = getMultiSelectedResources(resource, listService, editorService);
        // Remove highlight
        if (tree instanceof Tree) {
            tree.clearHighlight();
        }
        // Set side input
        if (resources.length) {
            return fileService.resolveFiles(resources.map(function (resource) { return ({ resource: resource }); })).then(function (resolved) {
                var editors = resolved.filter(function (r) { return r.success && !r.stat.isDirectory; }).map(function (r) { return ({
                    resource: r.stat.resource
                }); });
                return editorService.openEditors(editors, SIDE_GROUP);
            });
        }
        return Promise.resolve(true);
    }
});
var COMPARE_WITH_SAVED_SCHEMA = 'showModifications';
var provider;
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: COMPARE_WITH_SAVED_COMMAND_ID,
    when: undefined,
    weight: 200 /* WorkbenchContrib */,
    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 34 /* KEY_D */),
    handler: function (accessor, resource) {
        if (!provider) {
            var instantiationService = accessor.get(IInstantiationService);
            var textModelService = accessor.get(ITextModelService);
            provider = instantiationService.createInstance(FileOnDiskContentProvider);
            textModelService.registerTextModelContentProvider(COMPARE_WITH_SAVED_SCHEMA, provider);
        }
        var editorService = accessor.get(IEditorService);
        var uri = getResourceForCommand(resource, accessor.get(IListService), editorService);
        if (uri && uri.scheme === Schemas.file /* only files on disk supported for now */) {
            var name_1 = paths.basename(uri.fsPath);
            var editorLabel = nls.localize('modifiedLabel', "{0} (on disk) ↔ {1}", name_1, name_1);
            return editorService.openEditor({ leftResource: uri.with({ scheme: COMPARE_WITH_SAVED_SCHEMA }), rightResource: uri, label: editorLabel }).then(function () { return void 0; });
        }
        return Promise.resolve(true);
    }
});
var globalResourceToCompare;
var resourceSelectedForCompareContext;
CommandsRegistry.registerCommand({
    id: SELECT_FOR_COMPARE_COMMAND_ID,
    handler: function (accessor, resource) {
        var listService = accessor.get(IListService);
        var tree = listService.lastFocusedList;
        // Remove highlight
        if (tree instanceof Tree) {
            tree.clearHighlight();
            tree.domFocus();
        }
        globalResourceToCompare = getResourceForCommand(resource, listService, accessor.get(IEditorService));
        if (!resourceSelectedForCompareContext) {
            resourceSelectedForCompareContext = ResourceSelectedForCompareContext.bindTo(accessor.get(IContextKeyService));
        }
        resourceSelectedForCompareContext.set(true);
    }
});
CommandsRegistry.registerCommand({
    id: COMPARE_SELECTED_COMMAND_ID,
    handler: function (accessor, resource) {
        var editorService = accessor.get(IEditorService);
        var resources = getMultiSelectedResources(resource, accessor.get(IListService), editorService);
        if (resources.length === 2) {
            return editorService.openEditor({
                leftResource: resources[0],
                rightResource: resources[1]
            });
        }
        return Promise.resolve(true);
    }
});
CommandsRegistry.registerCommand({
    id: COMPARE_RESOURCE_COMMAND_ID,
    handler: function (accessor, resource) {
        var editorService = accessor.get(IEditorService);
        var listService = accessor.get(IListService);
        var tree = listService.lastFocusedList;
        // Remove highlight
        if (tree instanceof Tree) {
            tree.clearHighlight();
        }
        return editorService.openEditor({
            leftResource: globalResourceToCompare,
            rightResource: getResourceForCommand(resource, listService, editorService)
        }).then(function () { return void 0; });
    }
});
function revealResourcesInOS(resources, windowsService, notificationService, workspaceContextService) {
    if (resources.length) {
        sequence(resources.map(function (r) { return function () { return windowsService.showItemInFolder(paths.normalize(r.fsPath, true)); }; }));
    }
    else if (workspaceContextService.getWorkspace().folders.length) {
        windowsService.showItemInFolder(paths.normalize(workspaceContextService.getWorkspace().folders[0].uri.fsPath, true));
    }
    else {
        notificationService.info(nls.localize('openFileToReveal', "Open a file first to reveal"));
    }
}
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: REVEAL_IN_OS_COMMAND_ID,
    weight: 200 /* WorkbenchContrib */,
    when: EditorContextKeys.focus.toNegated(),
    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 48 /* KEY_R */,
    win: {
        primary: 1024 /* Shift */ | 512 /* Alt */ | 48 /* KEY_R */
    },
    handler: function (accessor, resource) {
        var resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService));
        revealResourcesInOS(resources, accessor.get(IWindowsService), accessor.get(INotificationService), accessor.get(IWorkspaceContextService));
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    weight: 200 /* WorkbenchContrib */,
    when: undefined,
    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 48 /* KEY_R */),
    id: 'workbench.action.files.revealActiveFileInWindows',
    handler: function (accessor) {
        var editorService = accessor.get(IEditorService);
        var activeInput = editorService.activeEditor;
        var resources = activeInput && activeInput.getResource() ? [activeInput.getResource()] : [];
        revealResourcesInOS(resources, accessor.get(IWindowsService), accessor.get(INotificationService), accessor.get(IWorkspaceContextService));
    }
});
function resourcesToClipboard(resources, relative, clipboardService, notificationService, labelService) {
    if (resources.length) {
        var lineDelimiter = isWindows ? '\r\n' : '\n';
        var text = resources.map(function (resource) { return labelService.getUriLabel(resource, { relative: relative, noPrefix: true }); })
            .join(lineDelimiter);
        clipboardService.writeText(text);
    }
    else {
        notificationService.info(nls.localize('openFileToCopy', "Open a file first to copy its path"));
    }
}
KeybindingsRegistry.registerCommandAndKeybindingRule({
    weight: 200 /* WorkbenchContrib */,
    when: EditorContextKeys.focus.toNegated(),
    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 33 /* KEY_C */,
    win: {
        primary: 1024 /* Shift */ | 512 /* Alt */ | 33 /* KEY_C */
    },
    id: COPY_PATH_COMMAND_ID,
    handler: function (accessor, resource) {
        var resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService));
        resourcesToClipboard(resources, false, accessor.get(IClipboardService), accessor.get(INotificationService), accessor.get(ILabelService));
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    weight: 200 /* WorkbenchContrib */,
    when: EditorContextKeys.focus.toNegated(),
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 512 /* Alt */ | 33 /* KEY_C */,
    win: {
        primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 512 /* Alt */ | 33 /* KEY_C */)
    },
    id: COPY_RELATIVE_PATH_COMMAND_ID,
    handler: function (accessor, resource) {
        var resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService));
        resourcesToClipboard(resources, true, accessor.get(IClipboardService), accessor.get(INotificationService), accessor.get(ILabelService));
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    weight: 200 /* WorkbenchContrib */,
    when: undefined,
    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 46 /* KEY_P */),
    id: 'workbench.action.files.copyPathOfActiveFile',
    handler: function (accessor) {
        var editorService = accessor.get(IEditorService);
        var activeInput = editorService.activeEditor;
        var resources = activeInput && activeInput.getResource() ? [activeInput.getResource()] : [];
        resourcesToClipboard(resources, false, accessor.get(IClipboardService), accessor.get(INotificationService), accessor.get(ILabelService));
    }
});
CommandsRegistry.registerCommand({
    id: REVEAL_IN_EXPLORER_COMMAND_ID,
    handler: function (accessor, resource) {
        var viewletService = accessor.get(IViewletService);
        var contextService = accessor.get(IWorkspaceContextService);
        var uri = getResourceForCommand(resource, accessor.get(IListService), accessor.get(IEditorService));
        viewletService.openViewlet(VIEWLET_ID, false).then(function (viewlet) {
            var isInsideWorkspace = contextService.isInsideWorkspace(uri);
            if (isInsideWorkspace) {
                var explorerView = viewlet.getExplorerView();
                if (explorerView) {
                    explorerView.setExpanded(true);
                    explorerView.select(uri, true);
                }
            }
            else {
                var openEditorsView = viewlet.getOpenEditorsView();
                if (openEditorsView) {
                    openEditorsView.setExpanded(true);
                }
            }
        });
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: SAVE_FILE_AS_COMMAND_ID,
    weight: 200 /* WorkbenchContrib */,
    when: undefined,
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 49 /* KEY_S */,
    handler: function (accessor, resourceOrObject) {
        var editorService = accessor.get(IEditorService);
        var resource = undefined;
        if (resourceOrObject && 'from' in resourceOrObject && resourceOrObject.from === 'menu') {
            resource = toResource(editorService.activeEditor);
        }
        else {
            resource = getResourceForCommand(resourceOrObject, accessor.get(IListService), editorService);
        }
        return save(resource, true, void 0, editorService, accessor.get(IFileService), accessor.get(IUntitledEditorService), accessor.get(ITextFileService), accessor.get(IEditorGroupsService));
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    when: undefined,
    weight: 200 /* WorkbenchContrib */,
    primary: 2048 /* CtrlCmd */ | 49 /* KEY_S */,
    id: SAVE_FILE_COMMAND_ID,
    handler: function (accessor, resource) {
        var editorService = accessor.get(IEditorService);
        var resources = getMultiSelectedResources(resource, accessor.get(IListService), editorService);
        if (resources.length === 1) {
            // If only one resource is selected explictly call save since the behavior is a bit different than save all #41841
            return save(resources[0], false, void 0, editorService, accessor.get(IFileService), accessor.get(IUntitledEditorService), accessor.get(ITextFileService), accessor.get(IEditorGroupsService));
        }
        return saveAll(resources, editorService, accessor.get(IUntitledEditorService), accessor.get(ITextFileService), accessor.get(IEditorGroupsService));
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    when: undefined,
    weight: 200 /* WorkbenchContrib */,
    primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 49 /* KEY_S */),
    win: { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 1024 /* Shift */ | 49 /* KEY_S */) },
    id: SAVE_FILE_WITHOUT_FORMATTING_COMMAND_ID,
    handler: function (accessor) {
        var editorService = accessor.get(IEditorService);
        var resource = toResource(editorService.activeEditor, { supportSideBySide: true });
        if (resource) {
            return save(resource, false, { skipSaveParticipants: true }, editorService, accessor.get(IFileService), accessor.get(IUntitledEditorService), accessor.get(ITextFileService), accessor.get(IEditorGroupsService));
        }
        return void 0;
    }
});
CommandsRegistry.registerCommand({
    id: SAVE_ALL_COMMAND_ID,
    handler: function (accessor) {
        return saveAll(true, accessor.get(IEditorService), accessor.get(IUntitledEditorService), accessor.get(ITextFileService), accessor.get(IEditorGroupsService));
    }
});
CommandsRegistry.registerCommand({
    id: SAVE_ALL_IN_GROUP_COMMAND_ID,
    handler: function (accessor, resource, editorContext) {
        var contexts = getMultiSelectedEditorContexts(editorContext, accessor.get(IListService), accessor.get(IEditorGroupsService));
        var editorGroupService = accessor.get(IEditorGroupsService);
        var saveAllArg;
        if (!contexts.length) {
            saveAllArg = true;
        }
        else {
            var fileService_1 = accessor.get(IFileService);
            saveAllArg = [];
            contexts.forEach(function (context) {
                var editorGroup = editorGroupService.getGroup(context.groupId);
                editorGroup.editors.forEach(function (editor) {
                    var resource = toResource(editor, { supportSideBySide: true });
                    if (resource && (resource.scheme === Schemas.untitled || fileService_1.canHandleResource(resource))) {
                        saveAllArg.push(resource);
                    }
                });
            });
        }
        return saveAll(saveAllArg, accessor.get(IEditorService), accessor.get(IUntitledEditorService), accessor.get(ITextFileService), accessor.get(IEditorGroupsService));
    }
});
CommandsRegistry.registerCommand({
    id: SAVE_FILES_COMMAND_ID,
    handler: function (accessor) {
        return saveAll(false, accessor.get(IEditorService), accessor.get(IUntitledEditorService), accessor.get(ITextFileService), accessor.get(IEditorGroupsService));
    }
});
CommandsRegistry.registerCommand({
    id: REMOVE_ROOT_FOLDER_COMMAND_ID,
    handler: function (accessor, resource) {
        var workspaceEditingService = accessor.get(IWorkspaceEditingService);
        var contextService = accessor.get(IWorkspaceContextService);
        var workspace = contextService.getWorkspace();
        var resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService)).filter(function (r) {
            // Need to verify resources are workspaces since multi selection can trigger this command on some non workspace resources
            return workspace.folders.some(function (f) { return f.uri.toString() === r.toString(); });
        });
        return workspaceEditingService.removeFolders(resources);
    }
});
