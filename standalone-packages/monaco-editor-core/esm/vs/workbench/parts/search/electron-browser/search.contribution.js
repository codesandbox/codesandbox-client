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
import './media/search.contribution.css';
import { Registry } from '../../../../platform/registry/common/platform';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions';
import { Extensions as ViewletExtensions, ViewletDescriptor } from '../../../browser/viewlet';
import { Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry';
import * as nls from '../../../../nls';
import { TPromise } from '../../../../base/common/winjs.base';
import { Action } from '../../../../base/common/actions';
import * as objects from '../../../../base/common/objects';
import * as platform from '../../../../base/common/platform';
import { ExplorerFolderContext, ExplorerRootContext } from '../../files/common/files';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../../platform/actions/common/actions';
import { Extensions as ActionExtensions } from '../../../common/actions';
import { QuickOpenHandlerDescriptor, Extensions as QuickOpenExtensions } from '../../../browser/quickopen';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService';
import { getSelectionSearchString } from '../../../../editor/contrib/find/findController';
import { IViewletService } from '../../../services/viewlet/browser/viewlet';
import * as Constants from '../common/constants';
import { registerContributions as replaceContributions } from '../browser/replaceContributions';
import { registerContributions as searchWidgetContributions } from '../browser/searchWidget';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey';
import { ToggleCaseSensitiveKeybinding, ToggleRegexKeybinding, ToggleWholeWordKeybinding } from '../../../../editor/contrib/find/findModel';
import { ISearchWorkbenchService, SearchWorkbenchService } from '../common/searchModel';
import { CommandsRegistry } from '../../../../platform/commands/common/commands';
import { SearchView } from '../browser/searchView';
import { defaultQuickOpenContextKey } from '../../../browser/parts/quickopen/quickopen';
import { OpenSymbolHandler } from '../browser/openSymbolHandler';
import { OpenAnythingHandler } from '../browser/openAnythingHandler';
import { registerLanguageCommand } from '../../../../editor/browser/editorExtensions';
import { getWorkspaceSymbols } from '../common/search';
import { illegalArgument } from '../../../../base/common/errors';
import { WorkbenchListFocusContextKey, IListService } from '../../../../platform/list/browser/listService';
import { relative } from '../../../../../path';
import { dirname } from '../../../../base/common/resources';
import { ResourceContextKey } from '../../../common/resources';
import { IFileService } from '../../../../platform/files/common/files';
import { distinct } from '../../../../base/common/arrays';
import { getMultiSelectedResources } from '../../files/browser/files';
import { Schemas } from '../../../../base/common/network';
import { Extensions as PanelExtensions, PanelDescriptor } from '../../../browser/panel';
import { IPanelService } from '../../../services/panel/common/panelService';
import { openSearchView, getSearchView, ReplaceAllInFolderAction, ReplaceAllAction, CloseReplaceAction, FocusNextSearchResultAction, FocusPreviousSearchResultAction, ReplaceInFilesAction, FindInFilesAction, toggleCaseSensitiveCommand, toggleRegexCommand, CollapseDeepestExpandedLevelAction, toggleWholeWordCommand, RemoveAction, ReplaceAction, ClearSearchResultsAction, copyPathCommand, copyMatchCommand, copyAllCommand, clearHistoryCommand, FocusNextInputAction, FocusPreviousInputAction, RefreshAction, focusSearchListCommand, OpenSearchViewletAction } from '../browser/searchActions';
import { VIEW_ID } from '../../../../platform/search/common/search';
import { Extensions as WorkbenchExtensions } from '../../../common/contributions';
import { SearchViewLocationUpdater } from '../browser/searchViewLocationUpdater';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IEditorService } from '../../../services/editor/common/editorService';
registerSingleton(ISearchWorkbenchService, SearchWorkbenchService);
replaceContributions();
searchWidgetContributions();
var category = nls.localize('search', "Search");
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'workbench.action.search.toggleQueryDetails',
    weight: 200 /* WorkbenchContrib */,
    when: Constants.SearchViewVisibleKey,
    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 40 /* KEY_J */,
    handler: function (accessor) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        if (searchView) {
            searchView.toggleQueryDetails();
        }
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.FocusSearchFromResults,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.FirstMatchFocusKey),
    primary: 2048 /* CtrlCmd */ | 16 /* UpArrow */,
    handler: function (accessor, args) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        searchView.focusPreviousInputBox();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.OpenMatchToSide,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.FileMatchOrMatchFocusKey),
    primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
    mac: {
        primary: 256 /* WinCtrl */ | 3 /* Enter */
    },
    handler: function (accessor, args) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        var tree = searchView.getControl();
        searchView.open(tree.getFocus(), false, true, true);
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.CancelActionId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, WorkbenchListFocusContextKey),
    primary: 9 /* Escape */,
    handler: function (accessor, args) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        searchView.cancelSearch();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.RemoveActionId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.FileMatchOrMatchFocusKey),
    primary: 20 /* Delete */,
    mac: {
        primary: 2048 /* CtrlCmd */ | 1 /* Backspace */,
    },
    handler: function (accessor, args) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        var tree = searchView.getControl();
        accessor.get(IInstantiationService).createInstance(RemoveAction, tree, tree.getFocus(), searchView).run();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.ReplaceActionId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.ReplaceActiveKey, Constants.MatchFocusKey),
    primary: 1024 /* Shift */ | 2048 /* CtrlCmd */ | 22 /* KEY_1 */,
    handler: function (accessor, args) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        var tree = searchView.getControl();
        accessor.get(IInstantiationService).createInstance(ReplaceAction, tree, tree.getFocus(), searchView).run();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.ReplaceAllInFileActionId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.ReplaceActiveKey, Constants.FileFocusKey),
    primary: 1024 /* Shift */ | 2048 /* CtrlCmd */ | 22 /* KEY_1 */,
    secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 3 /* Enter */],
    handler: function (accessor, args) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        var tree = searchView.getControl();
        accessor.get(IInstantiationService).createInstance(ReplaceAllAction, tree, tree.getFocus(), searchView).run();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.ReplaceAllInFolderActionId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.ReplaceActiveKey, Constants.FolderFocusKey),
    primary: 1024 /* Shift */ | 2048 /* CtrlCmd */ | 22 /* KEY_1 */,
    secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 3 /* Enter */],
    handler: function (accessor, args) {
        var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
        var tree = searchView.getControl();
        accessor.get(IInstantiationService).createInstance(ReplaceAllInFolderAction, tree, tree.getFocus()).run();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.CloseReplaceWidgetActionId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.ReplaceInputBoxFocusedKey),
    primary: 9 /* Escape */,
    handler: function (accessor, args) {
        accessor.get(IInstantiationService).createInstance(CloseReplaceAction, Constants.CloseReplaceWidgetActionId, '').run();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: FocusNextInputAction.ID,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.InputBoxFocusedKey),
    primary: 2048 /* CtrlCmd */ | 18 /* DownArrow */,
    handler: function (accessor, args) {
        accessor.get(IInstantiationService).createInstance(FocusNextInputAction, FocusNextInputAction.ID, '').run();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: FocusPreviousInputAction.ID,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.InputBoxFocusedKey, Constants.SearchInputBoxFocusedKey.toNegated()),
    primary: 2048 /* CtrlCmd */ | 16 /* UpArrow */,
    handler: function (accessor, args) {
        accessor.get(IInstantiationService).createInstance(FocusPreviousInputAction, FocusPreviousInputAction.ID, '').run();
    }
});
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: {
        id: Constants.ReplaceActionId,
        title: ReplaceAction.LABEL
    },
    when: ContextKeyExpr.and(Constants.ReplaceActiveKey, Constants.MatchFocusKey),
    group: 'search',
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: {
        id: Constants.ReplaceAllInFolderActionId,
        title: ReplaceAllInFolderAction.LABEL
    },
    when: ContextKeyExpr.and(Constants.ReplaceActiveKey, Constants.FolderFocusKey),
    group: 'search',
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: {
        id: Constants.ReplaceAllInFileActionId,
        title: ReplaceAllAction.LABEL
    },
    when: ContextKeyExpr.and(Constants.ReplaceActiveKey, Constants.FileFocusKey),
    group: 'search',
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: {
        id: Constants.RemoveActionId,
        title: RemoveAction.LABEL
    },
    when: Constants.FileMatchOrMatchFocusKey,
    group: 'search',
    order: 2
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.CopyMatchCommandId,
    weight: 200 /* WorkbenchContrib */,
    when: Constants.FileMatchOrMatchFocusKey,
    primary: 2048 /* CtrlCmd */ | 33 /* KEY_C */,
    handler: copyMatchCommand
});
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: {
        id: Constants.CopyMatchCommandId,
        title: nls.localize('copyMatchLabel', "Copy")
    },
    when: Constants.FileMatchOrMatchFocusKey,
    group: 'search_2',
    order: 1
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: Constants.CopyPathCommandId,
    weight: 200 /* WorkbenchContrib */,
    when: Constants.FileMatchOrFolderMatchFocusKey,
    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 33 /* KEY_C */,
    win: {
        primary: 1024 /* Shift */ | 512 /* Alt */ | 33 /* KEY_C */
    },
    handler: copyPathCommand
});
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: {
        id: Constants.CopyPathCommandId,
        title: nls.localize('copyPathLabel', "Copy Path")
    },
    when: Constants.FileMatchOrFolderMatchFocusKey,
    group: 'search_2',
    order: 2
});
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: {
        id: Constants.CopyAllCommandId,
        title: nls.localize('copyAllLabel', "Copy All")
    },
    when: Constants.HasSearchResults,
    group: 'search_2',
    order: 3
});
CommandsRegistry.registerCommand({
    id: Constants.CopyAllCommandId,
    handler: copyAllCommand
});
CommandsRegistry.registerCommand({
    id: Constants.ClearSearchHistoryCommandId,
    handler: clearHistoryCommand
});
var clearSearchHistoryLabel = nls.localize('clearSearchHistoryLabel', "Clear Search History");
var ClearSearchHistoryCommand = {
    id: Constants.ClearSearchHistoryCommandId,
    title: clearSearchHistoryLabel,
    category: category
};
MenuRegistry.addCommand(ClearSearchHistoryCommand);
CommandsRegistry.registerCommand({
    id: Constants.ToggleSearchViewPositionCommandId,
    handler: function (accessor) {
        var configurationService = accessor.get(IConfigurationService);
        var currentValue = configurationService.getValue('search').location;
        var toggleValue = currentValue === 'sidebar' ? 'panel' : 'sidebar';
        configurationService.updateValue('search.location', toggleValue);
    }
});
var toggleSearchViewPositionLabel = nls.localize('toggleSearchViewPositionLabel', "Toggle Search View Position");
var ToggleSearchViewPositionCommand = {
    id: Constants.ToggleSearchViewPositionCommandId,
    title: toggleSearchViewPositionLabel,
    category: category
};
MenuRegistry.addCommand(ToggleSearchViewPositionCommand);
MenuRegistry.appendMenuItem(MenuId.SearchContext, {
    command: ToggleSearchViewPositionCommand,
    when: Constants.SearchViewVisibleKey,
    group: 'search_9',
    order: 1
});
CommandsRegistry.registerCommand({
    id: Constants.FocusSearchListCommandID,
    handler: focusSearchListCommand
});
var focusSearchListCommandLabel = nls.localize('focusSearchListCommandLabel', "Focus List");
var FocusSearchListCommand = {
    id: Constants.FocusSearchListCommandID,
    title: focusSearchListCommandLabel,
    category: category
};
MenuRegistry.addCommand(FocusSearchListCommand);
var FIND_IN_FOLDER_ID = 'filesExplorer.findInFolder';
CommandsRegistry.registerCommand({
    id: FIND_IN_FOLDER_ID,
    handler: function (accessor, resource) {
        var listService = accessor.get(IListService);
        var viewletService = accessor.get(IViewletService);
        var panelService = accessor.get(IPanelService);
        var fileService = accessor.get(IFileService);
        var resources = getMultiSelectedResources(resource, listService, accessor.get(IEditorService));
        return openSearchView(viewletService, panelService, true).then(function (searchView) {
            if (resources && resources.length) {
                return fileService.resolveFiles(resources.map(function (resource) { return ({ resource: resource }); })).then(function (results) {
                    var folders = [];
                    results.forEach(function (result) {
                        if (result.success) {
                            folders.push(result.stat.isDirectory ? result.stat.resource : dirname(result.stat.resource));
                        }
                    });
                    searchView.searchInFolders(distinct(folders, function (folder) { return folder.toString(); }), function (from, to) { return relative(from, to); });
                });
            }
            return void 0;
        });
    }
});
CommandsRegistry.registerCommand({
    id: ClearSearchResultsAction.ID,
    handler: function (accessor, args) {
        accessor.get(IInstantiationService).createInstance(ClearSearchResultsAction, ClearSearchResultsAction.ID, '').run();
    }
});
CommandsRegistry.registerCommand({
    id: RefreshAction.ID,
    handler: function (accessor, args) {
        accessor.get(IInstantiationService).createInstance(RefreshAction, RefreshAction.ID, '').run();
    }
});
var FIND_IN_WORKSPACE_ID = 'filesExplorer.findInWorkspace';
CommandsRegistry.registerCommand({
    id: FIND_IN_WORKSPACE_ID,
    handler: function (accessor) {
        return openSearchView(accessor.get(IViewletService), accessor.get(IPanelService), true).then(function (searchView) {
            searchView.searchInFolders(null, function (from, to) { return relative(from, to); });
        });
    }
});
MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
    group: '4_search',
    order: 10,
    command: {
        id: FIND_IN_FOLDER_ID,
        title: nls.localize('findInFolder', "Find in Folder...")
    },
    when: ContextKeyExpr.and(ExplorerFolderContext, ResourceContextKey.Scheme.isEqualTo(Schemas.file)) // todo@remote
});
MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
    group: '4_search',
    order: 10,
    command: {
        id: FIND_IN_WORKSPACE_ID,
        title: nls.localize('findInWorkspace', "Find in Workspace...")
    },
    when: ContextKeyExpr.and(ExplorerRootContext, ExplorerFolderContext.toNegated())
});
var ShowAllSymbolsAction = /** @class */ (function (_super) {
    __extends(ShowAllSymbolsAction, _super);
    function ShowAllSymbolsAction(actionId, actionLabel, quickOpenService, editorService) {
        var _this = _super.call(this, actionId, actionLabel) || this;
        _this.quickOpenService = quickOpenService;
        _this.editorService = editorService;
        _this.enabled = !!_this.quickOpenService;
        return _this;
    }
    ShowAllSymbolsAction.prototype.run = function (context) {
        var prefix = ShowAllSymbolsAction.ALL_SYMBOLS_PREFIX;
        var inputSelection = void 0;
        var editor = this.editorService.getFocusedCodeEditor();
        var word = editor && getSelectionSearchString(editor);
        if (word) {
            prefix = prefix + word;
            inputSelection = { start: 1, end: word.length + 1 };
        }
        this.quickOpenService.show(prefix, { inputSelection: inputSelection });
        return TPromise.as(null);
    };
    ShowAllSymbolsAction.ID = 'workbench.action.showAllSymbols';
    ShowAllSymbolsAction.LABEL = nls.localize('showTriggerActions', "Go to Symbol in Workspace...");
    ShowAllSymbolsAction.ALL_SYMBOLS_PREFIX = '#';
    ShowAllSymbolsAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, ICodeEditorService)
    ], ShowAllSymbolsAction);
    return ShowAllSymbolsAction;
}(Action));
// Register View in Viewlet and Panel area
Registry.as(ViewletExtensions.Viewlets).registerViewlet(new ViewletDescriptor(SearchView, VIEW_ID, nls.localize('name', "Search"), 'search', 1));
Registry.as(PanelExtensions.Panels).registerPanel(new PanelDescriptor(SearchView, VIEW_ID, nls.localize('name', "Search"), 'search', 10));
// Register view location updater
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(SearchViewLocationUpdater, 2 /* Restoring */);
// Actions
var registry = Registry.as(ActionExtensions.WorkbenchActions);
// Show Search and Find in Files are redundant, but we can't break keybindings by removing one. So it's the same action, same keybinding, registered to different IDs.
// Show Search 'when' is redundant but if the two conflict with exactly the same keybinding and 'when' clause, then they can show up as "unbound" - #51780
registry.registerWorkbenchAction(new SyncActionDescriptor(OpenSearchViewletAction, VIEW_ID, OpenSearchViewletAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 36 /* KEY_F */ }, Constants.SearchViewVisibleKey.toNegated()), 'View: Show Search', nls.localize('view', "View"));
registry.registerWorkbenchAction(new SyncActionDescriptor(FindInFilesAction, Constants.FindInFilesActionId, nls.localize('findInFiles', "Find in Files"), { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 36 /* KEY_F */ }), 'Find in Files', category);
MenuRegistry.appendMenuItem(MenuId.MenubarEditMenu, {
    group: '4_find_global',
    command: {
        id: Constants.FindInFilesActionId,
        title: nls.localize({ key: 'miFindInFiles', comment: ['&& denotes a mnemonic'] }, "Find &&in Files")
    },
    order: 1
});
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusNextSearchResultAction, FocusNextSearchResultAction.ID, FocusNextSearchResultAction.LABEL, { primary: 62 /* F4 */ }, ContextKeyExpr.and(Constants.HasSearchResults)), 'Focus Next Search Result', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusPreviousSearchResultAction, FocusPreviousSearchResultAction.ID, FocusPreviousSearchResultAction.LABEL, { primary: 1024 /* Shift */ | 62 /* F4 */ }, ContextKeyExpr.and(Constants.HasSearchResults)), 'Focus Previous Search Result', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ReplaceInFilesAction, ReplaceInFilesAction.ID, ReplaceInFilesAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 38 /* KEY_H */ }), 'Replace in Files', category);
MenuRegistry.appendMenuItem(MenuId.MenubarEditMenu, {
    group: '4_find_global',
    command: {
        id: ReplaceInFilesAction.ID,
        title: nls.localize({ key: 'miReplaceInFiles', comment: ['&& denotes a mnemonic'] }, "Replace &&in Files")
    },
    order: 2
});
KeybindingsRegistry.registerCommandAndKeybindingRule(objects.assign({
    id: Constants.ToggleCaseSensitiveCommandId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.SearchViewFocusedKey, Constants.FileMatchOrFolderMatchFocusKey.toNegated()),
    handler: toggleCaseSensitiveCommand
}, ToggleCaseSensitiveKeybinding));
KeybindingsRegistry.registerCommandAndKeybindingRule(objects.assign({
    id: Constants.ToggleWholeWordCommandId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.SearchViewFocusedKey),
    handler: toggleWholeWordCommand
}, ToggleWholeWordKeybinding));
KeybindingsRegistry.registerCommandAndKeybindingRule(objects.assign({
    id: Constants.ToggleRegexCommandId,
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.SearchViewFocusedKey),
    handler: toggleRegexCommand
}, ToggleRegexKeybinding));
registry.registerWorkbenchAction(new SyncActionDescriptor(CollapseDeepestExpandedLevelAction, CollapseDeepestExpandedLevelAction.ID, CollapseDeepestExpandedLevelAction.LABEL), 'Search: Collapse All', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ShowAllSymbolsAction, ShowAllSymbolsAction.ID, ShowAllSymbolsAction.LABEL, { primary: 2048 /* CtrlCmd */ | 50 /* KEY_T */ }), 'Go to Symbol in Workspace...');
registry.registerWorkbenchAction(new SyncActionDescriptor(RefreshAction, RefreshAction.ID, RefreshAction.LABEL), 'Search: Refresh', category);
registry.registerWorkbenchAction(new SyncActionDescriptor(ClearSearchResultsAction, ClearSearchResultsAction.ID, ClearSearchResultsAction.LABEL), 'Search: Clear', category);
// Register Quick Open Handler
Registry.as(QuickOpenExtensions.Quickopen).registerDefaultQuickOpenHandler(new QuickOpenHandlerDescriptor(OpenAnythingHandler, OpenAnythingHandler.ID, '', defaultQuickOpenContextKey, nls.localize('openAnythingHandlerDescription', "Go to File")));
Registry.as(QuickOpenExtensions.Quickopen).registerQuickOpenHandler(new QuickOpenHandlerDescriptor(OpenSymbolHandler, OpenSymbolHandler.ID, ShowAllSymbolsAction.ALL_SYMBOLS_PREFIX, 'inWorkspaceSymbolsPicker', [
    {
        prefix: ShowAllSymbolsAction.ALL_SYMBOLS_PREFIX,
        needsEditor: false,
        description: nls.localize('openSymbolDescriptionNormal', "Go to Symbol in Workspace")
    }
]));
// Configuration
var configurationRegistry = Registry.as(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
    id: 'search',
    order: 13,
    title: nls.localize('searchConfigurationTitle', "Search"),
    type: 'object',
    properties: {
        'search.exclude': {
            type: 'object',
            markdownDescription: nls.localize('exclude', "Configure glob patterns for excluding files and folders in searches. Inherits all glob patterns from the `#files.exclude#` setting. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options)."),
            default: { '**/node_modules': true, '**/bower_components': true },
            additionalProperties: {
                anyOf: [
                    {
                        type: 'boolean',
                        description: nls.localize('exclude.boolean', "The glob pattern to match file paths against. Set to true or false to enable or disable the pattern."),
                    },
                    {
                        type: 'object',
                        properties: {
                            when: {
                                type: 'string',
                                pattern: '\\w*\\$\\(basename\\)\\w*',
                                default: '$(basename).ext',
                                description: nls.localize('exclude.when', 'Additional check on the siblings of a matching file. Use $(basename) as variable for the matching file name.')
                            }
                        }
                    }
                ]
            },
            scope: 3 /* RESOURCE */
        },
        'search.useRipgrep': {
            type: 'boolean',
            description: nls.localize('useRipgrep', "Controls whether to use ripgrep in text and file search."),
            default: true
        },
        'search.useIgnoreFiles': {
            type: 'boolean',
            markdownDescription: nls.localize('useIgnoreFiles', "Controls whether to use `.gitignore` and `.ignore` files when searching for files."),
            default: true,
            scope: 3 /* RESOURCE */
        },
        'search.quickOpen.includeSymbols': {
            type: 'boolean',
            description: nls.localize('search.quickOpen.includeSymbols', "Whether to include results from a global symbol search in the file results for Quick Open."),
            default: false
        },
        'search.quickOpen.includeHistory': {
            type: 'boolean',
            description: nls.localize('search.quickOpen.includeHistory', "Whether to include results from recently opened files in the file results for Quick Open."),
            default: true
        },
        'search.followSymlinks': {
            type: 'boolean',
            description: nls.localize('search.followSymlinks', "Controls whether to follow symlinks while searching."),
            default: true
        },
        'search.smartCase': {
            type: 'boolean',
            description: nls.localize('search.smartCase', "Search case-insensitively if the pattern is all lowercase, otherwise, search case-sensitively."),
            default: false
        },
        'search.globalFindClipboard': {
            type: 'boolean',
            default: false,
            description: nls.localize('search.globalFindClipboard', "Controls whether the search view should read or modify the shared find clipboard on macOS."),
            included: platform.isMacintosh
        },
        'search.location': {
            type: 'string',
            enum: ['sidebar', 'panel'],
            default: 'sidebar',
            description: nls.localize('search.location', "Controls whether the search will be shown as a view in the sidebar or as a panel in the panel area for more horizontal space."),
        },
        'search.collapseResults': {
            type: 'string',
            enum: ['auto', 'alwaysCollapse', 'alwaysExpand'],
            enumDescriptions: [
                'Files with less than 10 results are expanded. Others are collapsed.',
                '',
                ''
            ],
            default: 'auto',
            description: nls.localize('search.collapseAllResults', "Controls whether the search results will be collapsed or expanded."),
        }
    }
});
registerLanguageCommand('_executeWorkspaceSymbolProvider', function (accessor, args) {
    var query = args.query;
    if (typeof query !== 'string') {
        throw illegalArgument();
    }
    return getWorkspaceSymbols(query);
});
// View menu
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '3_views',
    command: {
        id: VIEW_ID,
        title: nls.localize({ key: 'miViewSearch', comment: ['&& denotes a mnemonic'] }, "&&Search")
    },
    order: 2
});
// Go to menu
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
    group: 'z_go_to',
    command: {
        id: 'workbench.action.showAllSymbols',
        title: nls.localize({ key: 'miGotoSymbolInWorkspace', comment: ['&& denotes a mnemonic'] }, "Go to Symbol in &&Workspace...")
    },
    order: 3
});
