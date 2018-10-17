/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as resources from '../../../../base/common/resources.js';
import * as paths from '../../../../base/common/paths.js';
import * as DOM from '../../../../base/browser/dom.js';
import { Disposable, dispose } from '../../../../base/common/lifecycle.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { CountBadge } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { FileLabel } from '../../../browser/labels.js';
import { Match, SearchResult, FileMatch, FolderMatch, searchMatchComparer } from '../common/searchModel.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { RemoveAction, ReplaceAllAction, ReplaceAction, ReplaceAllInFolderAction } from './searchActions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { attachBadgeStyler } from '../../../../platform/theme/common/styler.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { WorkbenchTreeController } from '../../../../platform/list/browser/listService.js';
import { fillInContextMenuActions } from '../../../../platform/actions/browser/menuItemActionItem.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
var SearchDataSource = /** @class */ (function () {
    function SearchDataSource(contextService, configurationService) {
        var _this = this;
        this.contextService = contextService;
        this.configurationService = configurationService;
        this.updateIncludeFolderMatch();
        this.listener = this.contextService.onDidChangeWorkbenchState(function () { return _this.updateIncludeFolderMatch(); });
    }
    SearchDataSource.prototype.updateIncludeFolderMatch = function () {
        this.includeFolderMatch = (this.contextService.getWorkbenchState() === 3 /* WORKSPACE */);
    };
    SearchDataSource.prototype.getId = function (tree, element) {
        if (element instanceof FolderMatch) {
            return element.id();
        }
        if (element instanceof FileMatch) {
            return element.id();
        }
        if (element instanceof Match) {
            return element.id();
        }
        return 'root';
    };
    SearchDataSource.prototype._getChildren = function (element) {
        if (element instanceof FileMatch) {
            return element.matches();
        }
        else if (element instanceof FolderMatch) {
            return element.matches();
        }
        else if (element instanceof SearchResult) {
            var folderMatches = element.folderMatches();
            return folderMatches.length > 2 ? // "Other files" + workspace folder = 2
                folderMatches.filter(function (fm) { return !fm.isEmpty(); }) :
                element.matches();
        }
        return [];
    };
    SearchDataSource.prototype.getChildren = function (tree, element) {
        return TPromise.as(this._getChildren(element));
    };
    SearchDataSource.prototype.hasChildren = function (tree, element) {
        return element instanceof FileMatch || element instanceof FolderMatch || element instanceof SearchResult;
    };
    SearchDataSource.prototype.getParent = function (tree, element) {
        var value = null;
        if (element instanceof Match) {
            value = element.parent();
        }
        else if (element instanceof FileMatch) {
            value = this.includeFolderMatch ? element.parent() : element.parent().parent();
        }
        else if (element instanceof FolderMatch) {
            value = element.parent();
        }
        return TPromise.as(value);
    };
    SearchDataSource.prototype.shouldAutoexpand = function (tree, element) {
        var numChildren = this._getChildren(element).length;
        if (numChildren <= 0) {
            return false;
        }
        var collapseOption = this.configurationService.getValue('search.collapseResults');
        if (collapseOption === 'alwaysCollapse') {
            return false;
        }
        else if (collapseOption === 'alwaysExpand') {
            return true;
        }
        return numChildren < SearchDataSource.AUTOEXPAND_CHILD_LIMIT || element instanceof FolderMatch;
    };
    SearchDataSource.prototype.dispose = function () {
        this.listener = dispose(this.listener);
    };
    SearchDataSource.AUTOEXPAND_CHILD_LIMIT = 10;
    SearchDataSource = __decorate([
        __param(0, IWorkspaceContextService),
        __param(1, IConfigurationService)
    ], SearchDataSource);
    return SearchDataSource;
}());
export { SearchDataSource };
var SearchSorter = /** @class */ (function () {
    function SearchSorter() {
    }
    SearchSorter.prototype.compare = function (tree, elementA, elementB) {
        return searchMatchComparer(elementA, elementB);
    };
    return SearchSorter;
}());
export { SearchSorter };
var SearchRenderer = /** @class */ (function (_super) {
    __extends(SearchRenderer, _super);
    function SearchRenderer(actionRunner, searchView, instantiationService, themeService, contextService) {
        var _this = _super.call(this) || this;
        _this.searchView = searchView;
        _this.instantiationService = instantiationService;
        _this.themeService = themeService;
        _this.contextService = contextService;
        return _this;
    }
    SearchRenderer.prototype.getHeight = function (tree, element) {
        return 22;
    };
    SearchRenderer.prototype.getTemplateId = function (tree, element) {
        if (element instanceof FolderMatch) {
            return SearchRenderer.FOLDER_MATCH_TEMPLATE_ID;
        }
        else if (element instanceof FileMatch) {
            return SearchRenderer.FILE_MATCH_TEMPLATE_ID;
        }
        else if (element instanceof Match) {
            return SearchRenderer.MATCH_TEMPLATE_ID;
        }
        return null;
    };
    SearchRenderer.prototype.renderTemplate = function (tree, templateId, container) {
        if (templateId === SearchRenderer.FOLDER_MATCH_TEMPLATE_ID) {
            return this.renderFolderMatchTemplate(tree, templateId, container);
        }
        if (templateId === SearchRenderer.FILE_MATCH_TEMPLATE_ID) {
            return this.renderFileMatchTemplate(tree, templateId, container);
        }
        if (templateId === SearchRenderer.MATCH_TEMPLATE_ID) {
            return this.renderMatchTemplate(tree, templateId, container);
        }
        return null;
    };
    SearchRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
        if (SearchRenderer.FOLDER_MATCH_TEMPLATE_ID === templateId) {
            this.renderFolderMatch(tree, element, templateData);
        }
        else if (SearchRenderer.FILE_MATCH_TEMPLATE_ID === templateId) {
            this.renderFileMatch(tree, element, templateData);
        }
        else if (SearchRenderer.MATCH_TEMPLATE_ID === templateId) {
            this.renderMatch(tree, element, templateData);
        }
    };
    SearchRenderer.prototype.renderFolderMatchTemplate = function (tree, templateId, container) {
        var folderMatchElement = DOM.append(container, DOM.$('.foldermatch'));
        var label = this.instantiationService.createInstance(FileLabel, folderMatchElement, void 0);
        var badge = new CountBadge(DOM.append(folderMatchElement, DOM.$('.badge')));
        this._register(attachBadgeStyler(badge, this.themeService));
        var actions = new ActionBar(folderMatchElement, { animated: false });
        return { label: label, badge: badge, actions: actions };
    };
    SearchRenderer.prototype.renderFileMatchTemplate = function (tree, templateId, container) {
        var fileMatchElement = DOM.append(container, DOM.$('.filematch'));
        var label = this.instantiationService.createInstance(FileLabel, fileMatchElement, void 0);
        var badge = new CountBadge(DOM.append(fileMatchElement, DOM.$('.badge')));
        this._register(attachBadgeStyler(badge, this.themeService));
        var actions = new ActionBar(fileMatchElement, { animated: false });
        return { el: fileMatchElement, label: label, badge: badge, actions: actions };
    };
    SearchRenderer.prototype.renderMatchTemplate = function (tree, templateId, container) {
        DOM.addClass(container, 'linematch');
        var parent = DOM.append(container, DOM.$('a.plain.match'));
        var before = DOM.append(parent, DOM.$('span'));
        var match = DOM.append(parent, DOM.$('span.findInFileMatch'));
        var replace = DOM.append(parent, DOM.$('span.replaceMatch'));
        var after = DOM.append(parent, DOM.$('span'));
        var actions = new ActionBar(container, { animated: false });
        return {
            parent: parent,
            before: before,
            match: match,
            replace: replace,
            after: after,
            actions: actions
        };
    };
    SearchRenderer.prototype.renderFolderMatch = function (tree, folderMatch, templateData) {
        if (folderMatch.hasResource()) {
            var workspaceFolder = this.contextService.getWorkspaceFolder(folderMatch.resource());
            if (workspaceFolder && resources.isEqual(workspaceFolder.uri, folderMatch.resource())) {
                templateData.label.setFile(folderMatch.resource(), { fileKind: FileKind.ROOT_FOLDER, hidePath: true });
            }
            else {
                templateData.label.setFile(folderMatch.resource(), { fileKind: FileKind.FOLDER });
            }
        }
        else {
            templateData.label.setValue(nls.localize('searchFolderMatch.other.label', "Other files"));
        }
        var count = folderMatch.fileCount();
        templateData.badge.setCount(count);
        templateData.badge.setTitleFormat(count > 1 ? nls.localize('searchFileMatches', "{0} files found", count) : nls.localize('searchFileMatch', "{0} file found", count));
        templateData.actions.clear();
        var input = tree.getInput();
        var actions = [];
        if (input.searchModel.isReplaceActive() && count > 0) {
            actions.push(this.instantiationService.createInstance(ReplaceAllInFolderAction, tree, folderMatch));
        }
        actions.push(new RemoveAction(tree, folderMatch));
        templateData.actions.push(actions, { icon: true, label: false });
    };
    SearchRenderer.prototype.renderFileMatch = function (tree, fileMatch, templateData) {
        templateData.el.setAttribute('data-resource', fileMatch.resource().toString());
        templateData.label.setFile(fileMatch.resource(), { hideIcon: false });
        var count = fileMatch.count();
        templateData.badge.setCount(count);
        templateData.badge.setTitleFormat(count > 1 ? nls.localize('searchMatches', "{0} matches found", count) : nls.localize('searchMatch', "{0} match found", count));
        var input = tree.getInput();
        templateData.actions.clear();
        var actions = [];
        if (input.searchModel.isReplaceActive() && count > 0) {
            actions.push(this.instantiationService.createInstance(ReplaceAllAction, tree, fileMatch, this.searchView));
        }
        actions.push(new RemoveAction(tree, fileMatch));
        templateData.actions.push(actions, { icon: true, label: false });
    };
    SearchRenderer.prototype.renderMatch = function (tree, match, templateData) {
        var preview = match.preview();
        var searchModel = tree.getInput().searchModel;
        var replace = searchModel.isReplaceActive() && !!searchModel.replaceString;
        templateData.before.textContent = preview.before;
        templateData.match.textContent = preview.inside;
        DOM.toggleClass(templateData.match, 'replace', replace);
        templateData.replace.textContent = replace ? match.replaceString : '';
        templateData.after.textContent = preview.after;
        templateData.parent.title = (preview.before + (replace ? match.replaceString : preview.inside) + preview.after).trim().substr(0, 999);
        templateData.actions.clear();
        if (searchModel.isReplaceActive()) {
            templateData.actions.push([this.instantiationService.createInstance(ReplaceAction, tree, match, this.searchView), new RemoveAction(tree, match)], { icon: true, label: false });
        }
        else {
            templateData.actions.push([new RemoveAction(tree, match)], { icon: true, label: false });
        }
    };
    SearchRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
        if (SearchRenderer.FOLDER_MATCH_TEMPLATE_ID === templateId) {
            var template = templateData;
            template.label.dispose();
            template.actions.dispose();
        }
        else if (SearchRenderer.FILE_MATCH_TEMPLATE_ID === templateId) {
            var template = templateData;
            template.label.dispose();
            template.actions.dispose();
        }
        else if (SearchRenderer.MATCH_TEMPLATE_ID === templateId) {
            var template = templateData;
            template.actions.dispose();
        }
    };
    SearchRenderer.FOLDER_MATCH_TEMPLATE_ID = 'folderMatch';
    SearchRenderer.FILE_MATCH_TEMPLATE_ID = 'fileMatch';
    SearchRenderer.MATCH_TEMPLATE_ID = 'match';
    SearchRenderer = __decorate([
        __param(2, IInstantiationService),
        __param(3, IThemeService),
        __param(4, IWorkspaceContextService)
    ], SearchRenderer);
    return SearchRenderer;
}(Disposable));
export { SearchRenderer };
var SearchAccessibilityProvider = /** @class */ (function () {
    function SearchAccessibilityProvider(labelService) {
        this.labelService = labelService;
    }
    SearchAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
        if (element instanceof FolderMatch) {
            return element.hasResource() ?
                nls.localize('folderMatchAriaLabel', "{0} matches in folder root {1}, Search result", element.count(), element.name()) :
                nls.localize('otherFilesAriaLabel', "{0} matches outside of the workspace, Search result", element.count());
        }
        if (element instanceof FileMatch) {
            var path = this.labelService.getUriLabel(element.resource(), { relative: true }) || element.resource().fsPath;
            return nls.localize('fileMatchAriaLabel', "{0} matches in file {1} of folder {2}, Search result", element.count(), element.name(), paths.dirname(path));
        }
        if (element instanceof Match) {
            var match = element;
            var searchModel = tree.getInput().searchModel;
            var replace = searchModel.isReplaceActive() && !!searchModel.replaceString;
            var matchString = match.getMatchString();
            var range = match.range();
            var matchText = match.text().substr(0, range.endColumn + 150);
            if (replace) {
                return nls.localize('replacePreviewResultAria', "Replace term {0} with {1} at column position {2} in line with text {3}", matchString, match.replaceString, range.startColumn + 1, matchText);
            }
            return nls.localize('searchResultAria', "Found term {0} at column position {1} in line with text {2}", matchString, range.startColumn + 1, matchText);
        }
        return undefined;
    };
    SearchAccessibilityProvider = __decorate([
        __param(0, ILabelService)
    ], SearchAccessibilityProvider);
    return SearchAccessibilityProvider;
}());
export { SearchAccessibilityProvider };
var SearchFilter = /** @class */ (function () {
    function SearchFilter() {
    }
    SearchFilter.prototype.isVisible = function (tree, element) {
        return !(element instanceof FileMatch || element instanceof FolderMatch) || element.matches().length > 0;
    };
    return SearchFilter;
}());
export { SearchFilter };
var SearchTreeController = /** @class */ (function (_super) {
    __extends(SearchTreeController, _super);
    function SearchTreeController(contextMenuService, menuService, configurationService) {
        var _this = _super.call(this, {}, configurationService) || this;
        _this.contextMenuService = contextMenuService;
        _this.menuService = menuService;
        return _this;
    }
    SearchTreeController.prototype.onContextMenu = function (tree, element, event) {
        var _this = this;
        if (!this.contextMenu) {
            this.contextMenu = this.menuService.createMenu(MenuId.SearchContext, tree.contextKeyService);
        }
        tree.setFocus(element, { preventOpenOnFocus: true });
        var anchor = { x: event.posx, y: event.posy };
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActions: function () {
                var actions = [];
                fillInContextMenuActions(_this.contextMenu, { shouldForwardArgs: true }, actions, _this.contextMenuService);
                return TPromise.as(actions);
            },
            getActionsContext: function () { return element; }
        });
        return true;
    };
    SearchTreeController = __decorate([
        __param(0, IContextMenuService),
        __param(1, IMenuService),
        __param(2, IConfigurationService)
    ], SearchTreeController);
    return SearchTreeController;
}(WorkbenchTreeController));
export { SearchTreeController };
