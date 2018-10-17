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
import * as DOM from '../../../../base/browser/dom.js';
import { Action } from '../../../../base/common/actions.js';
import { createKeybinding } from '../../../../base/common/keyCodes.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import { Schemas } from '../../../../base/common/network.js';
import { isWindows, OS } from '../../../../base/common/platform.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ISearchHistoryService, VIEW_ID } from '../../../../platform/search/common/search.js';
import * as Constants from '../common/constants.js';
import { IReplaceService } from '../common/replace.js';
import { FileMatch, FolderMatch, Match, searchMatchComparer, SearchResult } from '../common/searchModel.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IPanelService } from '../../../services/panel/common/panelService.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
import { normalize } from '../../../../base/common/paths.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
export function isSearchViewFocused(viewletService, panelService) {
    var searchView = getSearchView(viewletService, panelService);
    var activeElement = document.activeElement;
    return searchView && activeElement && DOM.isAncestor(activeElement, searchView.getContainer());
}
export function appendKeyBindingLabel(label, keyBinding, keyBindingService2) {
    if (typeof keyBinding === 'number') {
        var resolvedKeybindings = keyBindingService2.resolveKeybinding(createKeybinding(keyBinding, OS));
        return doAppendKeyBindingLabel(label, resolvedKeybindings.length > 0 ? resolvedKeybindings[0] : null);
    }
    else {
        return doAppendKeyBindingLabel(label, keyBinding);
    }
}
export function openSearchView(viewletService, panelService, focus) {
    if (viewletService.getViewlets().filter(function (v) { return v.id === VIEW_ID; }).length) {
        return viewletService.openViewlet(VIEW_ID, focus).then(function (viewlet) { return viewlet; });
    }
    return panelService.openPanel(VIEW_ID, focus).then(function (panel) { return panel; });
}
export function getSearchView(viewletService, panelService) {
    var activeViewlet = viewletService.getActiveViewlet();
    if (activeViewlet && activeViewlet.getId() === VIEW_ID) {
        return activeViewlet;
    }
    var activePanel = panelService.getActivePanel();
    if (activePanel && activePanel.getId() === VIEW_ID) {
        return activePanel;
    }
    return undefined;
}
function doAppendKeyBindingLabel(label, keyBinding) {
    return keyBinding ? label + ' (' + keyBinding.getLabel() + ')' : label;
}
export var toggleCaseSensitiveCommand = function (accessor) {
    var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
    searchView.toggleCaseSensitive();
};
export var toggleWholeWordCommand = function (accessor) {
    var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
    searchView.toggleWholeWords();
};
export var toggleRegexCommand = function (accessor) {
    var searchView = getSearchView(accessor.get(IViewletService), accessor.get(IPanelService));
    searchView.toggleRegex();
};
var FocusNextInputAction = /** @class */ (function (_super) {
    __extends(FocusNextInputAction, _super);
    function FocusNextInputAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        return _this;
    }
    FocusNextInputAction.prototype.run = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        searchView.focusNextInputBox();
        return TPromise.as(null);
    };
    FocusNextInputAction.ID = 'search.focus.nextInputBox';
    FocusNextInputAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], FocusNextInputAction);
    return FocusNextInputAction;
}(Action));
export { FocusNextInputAction };
var FocusPreviousInputAction = /** @class */ (function (_super) {
    __extends(FocusPreviousInputAction, _super);
    function FocusPreviousInputAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        return _this;
    }
    FocusPreviousInputAction.prototype.run = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        searchView.focusPreviousInputBox();
        return TPromise.as(null);
    };
    FocusPreviousInputAction.ID = 'search.focus.previousInputBox';
    FocusPreviousInputAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], FocusPreviousInputAction);
    return FocusPreviousInputAction;
}(Action));
export { FocusPreviousInputAction };
var FindOrReplaceInFilesAction = /** @class */ (function (_super) {
    __extends(FindOrReplaceInFilesAction, _super);
    function FindOrReplaceInFilesAction(id, label, viewletService, panelService, expandSearchReplaceWidget) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        _this.expandSearchReplaceWidget = expandSearchReplaceWidget;
        return _this;
    }
    FindOrReplaceInFilesAction.prototype.run = function () {
        var _this = this;
        return openSearchView(this.viewletService, this.panelService, false).then(function (openedView) {
            var searchAndReplaceWidget = openedView.searchAndReplaceWidget;
            searchAndReplaceWidget.toggleReplace(_this.expandSearchReplaceWidget);
            var updatedText = openedView.updateTextFromSelection(!_this.expandSearchReplaceWidget);
            openedView.searchAndReplaceWidget.focus(undefined, updatedText, updatedText);
        });
    };
    return FindOrReplaceInFilesAction;
}(Action));
export { FindOrReplaceInFilesAction };
var FindInFilesAction = /** @class */ (function (_super) {
    __extends(FindInFilesAction, _super);
    function FindInFilesAction(id, label, viewletService, panelService) {
        return _super.call(this, id, label, viewletService, panelService, /*expandSearchReplaceWidget=*/ false) || this;
    }
    FindInFilesAction.LABEL = nls.localize('findInFiles', "Find in Files");
    FindInFilesAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], FindInFilesAction);
    return FindInFilesAction;
}(FindOrReplaceInFilesAction));
export { FindInFilesAction };
var OpenSearchViewletAction = /** @class */ (function (_super) {
    __extends(OpenSearchViewletAction, _super);
    function OpenSearchViewletAction(id, label, viewletService, panelService, editorGroupService) {
        var _this = _super.call(this, id, label, viewletService, panelService, /*expandSearchReplaceWidget=*/ false) || this;
        _this.editorGroupService = editorGroupService;
        return _this;
    }
    OpenSearchViewletAction.prototype.run = function () {
        // Pass focus to viewlet if not open or focused
        if (this.otherViewletShowing() || !isSearchViewFocused(this.viewletService, this.panelService)) {
            return _super.prototype.run.call(this);
        }
        // Otherwise pass focus to editor group
        this.editorGroupService.activeGroup.focus();
        return TPromise.as(true);
    };
    OpenSearchViewletAction.prototype.otherViewletShowing = function () {
        return !getSearchView(this.viewletService, this.panelService);
    };
    OpenSearchViewletAction.LABEL = nls.localize('showSearch', "Show Search");
    OpenSearchViewletAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService),
        __param(4, IEditorGroupsService)
    ], OpenSearchViewletAction);
    return OpenSearchViewletAction;
}(FindOrReplaceInFilesAction));
export { OpenSearchViewletAction };
var ReplaceInFilesAction = /** @class */ (function (_super) {
    __extends(ReplaceInFilesAction, _super);
    function ReplaceInFilesAction(id, label, viewletService, panelService) {
        return _super.call(this, id, label, viewletService, panelService, /*expandSearchReplaceWidget=*/ true) || this;
    }
    ReplaceInFilesAction.ID = 'workbench.action.replaceInFiles';
    ReplaceInFilesAction.LABEL = nls.localize('replaceInFiles', "Replace in Files");
    ReplaceInFilesAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], ReplaceInFilesAction);
    return ReplaceInFilesAction;
}(FindOrReplaceInFilesAction));
export { ReplaceInFilesAction };
var CloseReplaceAction = /** @class */ (function (_super) {
    __extends(CloseReplaceAction, _super);
    function CloseReplaceAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        return _this;
    }
    CloseReplaceAction.prototype.run = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        searchView.searchAndReplaceWidget.toggleReplace(false);
        searchView.searchAndReplaceWidget.focus();
        return TPromise.as(null);
    };
    CloseReplaceAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], CloseReplaceAction);
    return CloseReplaceAction;
}(Action));
export { CloseReplaceAction };
var RefreshAction = /** @class */ (function (_super) {
    __extends(RefreshAction, _super);
    function RefreshAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label, 'search-action refresh') || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        _this.update();
        return _this;
    }
    RefreshAction.prototype.update = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        this.enabled = searchView && searchView.isSearchSubmitted();
    };
    RefreshAction.prototype.run = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        if (searchView) {
            searchView.onQueryChanged();
        }
        return TPromise.as(null);
    };
    RefreshAction.ID = 'search.action.refreshSearchResults';
    RefreshAction.LABEL = nls.localize('RefreshAction.label', "Refresh");
    RefreshAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], RefreshAction);
    return RefreshAction;
}(Action));
export { RefreshAction };
var CollapseDeepestExpandedLevelAction = /** @class */ (function (_super) {
    __extends(CollapseDeepestExpandedLevelAction, _super);
    function CollapseDeepestExpandedLevelAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label, 'search-action collapse') || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        _this.update();
        return _this;
    }
    CollapseDeepestExpandedLevelAction.prototype.update = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        this.enabled = searchView && searchView.hasSearchResults();
    };
    CollapseDeepestExpandedLevelAction.prototype.run = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        if (searchView) {
            var viewer = searchView.getControl();
            if (viewer.getHighlight()) {
                return TPromise.as(null); // Global action disabled if user is in edit mode from another action
            }
            /**
             * The hierarchy is FolderMatch, FileMatch, Match. If the top level is FileMatches, then there is only
             * one level to collapse so collapse everything. If FolderMatch, check if there are visible grandchildren,
             * i.e. if Matches are returned by the navigator, and if so, collapse to them, otherwise collapse all levels.
             */
            var navigator_1 = viewer.getNavigator();
            var node = navigator_1.first();
            var collapseFileMatchLevel = false;
            if (node instanceof FolderMatch) {
                while (node = navigator_1.next()) {
                    if (node instanceof Match) {
                        collapseFileMatchLevel = true;
                        break;
                    }
                }
            }
            if (collapseFileMatchLevel) {
                node = navigator_1.first();
                do {
                    if (node instanceof FileMatch) {
                        viewer.collapse(node);
                    }
                } while (node = navigator_1.next());
            }
            else {
                viewer.collapseAll();
            }
            viewer.clearSelection();
            viewer.clearFocus();
            viewer.domFocus();
            viewer.focusFirst();
        }
        return TPromise.as(null);
    };
    CollapseDeepestExpandedLevelAction.ID = 'search.action.collapseSearchResults';
    CollapseDeepestExpandedLevelAction.LABEL = nls.localize('CollapseDeepestExpandedLevelAction.label', "Collapse All");
    CollapseDeepestExpandedLevelAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], CollapseDeepestExpandedLevelAction);
    return CollapseDeepestExpandedLevelAction;
}(Action));
export { CollapseDeepestExpandedLevelAction };
var ClearSearchResultsAction = /** @class */ (function (_super) {
    __extends(ClearSearchResultsAction, _super);
    function ClearSearchResultsAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label, 'search-action clear-search-results') || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        _this.update();
        return _this;
    }
    ClearSearchResultsAction.prototype.update = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        this.enabled = searchView && searchView.isSearchSubmitted();
    };
    ClearSearchResultsAction.prototype.run = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        if (searchView) {
            searchView.clearSearchResults();
        }
        return TPromise.as(null);
    };
    ClearSearchResultsAction.ID = 'search.action.clearSearchResults';
    ClearSearchResultsAction.LABEL = nls.localize('ClearSearchResultsAction.label', "Clear Search Results");
    ClearSearchResultsAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], ClearSearchResultsAction);
    return ClearSearchResultsAction;
}(Action));
export { ClearSearchResultsAction };
var CancelSearchAction = /** @class */ (function (_super) {
    __extends(CancelSearchAction, _super);
    function CancelSearchAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label, 'search-action cancel-search') || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        _this.update();
        return _this;
    }
    CancelSearchAction.prototype.update = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        this.enabled = searchView && searchView.isSearching();
    };
    CancelSearchAction.prototype.run = function () {
        var searchView = getSearchView(this.viewletService, this.panelService);
        if (searchView) {
            searchView.cancelSearch();
        }
        return TPromise.as(null);
    };
    CancelSearchAction.ID = 'search.action.cancelSearch';
    CancelSearchAction.LABEL = nls.localize('CancelSearchAction.label', "Cancel Search");
    CancelSearchAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], CancelSearchAction);
    return CancelSearchAction;
}(Action));
export { CancelSearchAction };
var FocusNextSearchResultAction = /** @class */ (function (_super) {
    __extends(FocusNextSearchResultAction, _super);
    function FocusNextSearchResultAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        return _this;
    }
    FocusNextSearchResultAction.prototype.run = function () {
        return openSearchView(this.viewletService, this.panelService).then(function (searchView) {
            searchView.selectNextMatch();
        });
    };
    FocusNextSearchResultAction.ID = 'search.action.focusNextSearchResult';
    FocusNextSearchResultAction.LABEL = nls.localize('FocusNextSearchResult.label', "Focus Next Search Result");
    FocusNextSearchResultAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], FocusNextSearchResultAction);
    return FocusNextSearchResultAction;
}(Action));
export { FocusNextSearchResultAction };
var FocusPreviousSearchResultAction = /** @class */ (function (_super) {
    __extends(FocusPreviousSearchResultAction, _super);
    function FocusPreviousSearchResultAction(id, label, viewletService, panelService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        _this.panelService = panelService;
        return _this;
    }
    FocusPreviousSearchResultAction.prototype.run = function () {
        return openSearchView(this.viewletService, this.panelService).then(function (searchView) {
            searchView.selectPreviousMatch();
        });
    };
    FocusPreviousSearchResultAction.ID = 'search.action.focusPreviousSearchResult';
    FocusPreviousSearchResultAction.LABEL = nls.localize('FocusPreviousSearchResult.label', "Focus Previous Search Result");
    FocusPreviousSearchResultAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPanelService)
    ], FocusPreviousSearchResultAction);
    return FocusPreviousSearchResultAction;
}(Action));
export { FocusPreviousSearchResultAction };
var AbstractSearchAndReplaceAction = /** @class */ (function (_super) {
    __extends(AbstractSearchAndReplaceAction, _super);
    function AbstractSearchAndReplaceAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns element to focus after removing the given element
     */
    AbstractSearchAndReplaceAction.prototype.getElementToFocusAfterRemoved = function (viewer, elementToBeRemoved) {
        var elementToFocus = this.getNextElementAfterRemoved(viewer, elementToBeRemoved);
        if (!elementToFocus) {
            elementToFocus = this.getPreviousElementAfterRemoved(viewer, elementToBeRemoved);
        }
        return elementToFocus;
    };
    AbstractSearchAndReplaceAction.prototype.getNextElementAfterRemoved = function (viewer, element) {
        var navigator = this.getNavigatorAt(element, viewer);
        if (element instanceof FolderMatch) {
            // If file match is removed then next element is the next file match
            while (!!navigator.next() && !(navigator.current() instanceof FolderMatch)) { }
        }
        else if (element instanceof FileMatch) {
            // If file match is removed then next element is the next file match
            while (!!navigator.next() && !(navigator.current() instanceof FileMatch)) { }
        }
        else {
            while (navigator.next() && !(navigator.current() instanceof Match)) {
                viewer.expand(navigator.current());
            }
        }
        return navigator.current();
    };
    AbstractSearchAndReplaceAction.prototype.getPreviousElementAfterRemoved = function (viewer, element) {
        var navigator = this.getNavigatorAt(element, viewer);
        var previousElement = navigator.previous();
        // If this is the only match, then the file/folder match is also removed
        // Hence take the previous element.
        var parent = element.parent();
        if (parent === previousElement) {
            previousElement = navigator.previous();
        }
        if (parent instanceof FileMatch && parent.parent() === previousElement) {
            previousElement = navigator.previous();
        }
        // If the previous element is a File or Folder, expand it and go to its last child.
        // Spell out the two cases, would be too easy to create an infinite loop, like by adding another level...
        if (element instanceof Match && previousElement && previousElement instanceof FolderMatch) {
            navigator.next();
            viewer.expand(previousElement);
            previousElement = navigator.previous();
        }
        if (element instanceof Match && previousElement && previousElement instanceof FileMatch) {
            navigator.next();
            viewer.expand(previousElement);
            previousElement = navigator.previous();
        }
        return previousElement;
    };
    AbstractSearchAndReplaceAction.prototype.getNavigatorAt = function (element, viewer) {
        var navigator = viewer.getNavigator();
        while (navigator.current() !== element && !!navigator.next()) { }
        return navigator;
    };
    return AbstractSearchAndReplaceAction;
}(Action));
export { AbstractSearchAndReplaceAction };
var RemoveAction = /** @class */ (function (_super) {
    __extends(RemoveAction, _super);
    function RemoveAction(viewer, element) {
        var _this = _super.call(this, 'remove', RemoveAction.LABEL, 'action-remove') || this;
        _this.viewer = viewer;
        _this.element = element;
        return _this;
    }
    RemoveAction.prototype.run = function () {
        var currentFocusElement = this.viewer.getFocus();
        var nextFocusElement = !currentFocusElement || currentFocusElement instanceof SearchResult || elementIsEqualOrParent(currentFocusElement, this.element) ?
            this.getElementToFocusAfterRemoved(this.viewer, this.element) :
            null;
        if (nextFocusElement) {
            this.viewer.reveal(nextFocusElement);
            this.viewer.setFocus(nextFocusElement);
        }
        var elementToRefresh;
        var element = this.element;
        if (element instanceof FolderMatch) {
            var parent_1 = element.parent();
            parent_1.remove(element);
            elementToRefresh = parent_1;
        }
        else if (element instanceof FileMatch) {
            var parent_2 = element.parent();
            parent_2.remove(element);
            elementToRefresh = parent_2;
        }
        else if (element instanceof Match) {
            var parent_3 = element.parent();
            parent_3.remove(element);
            elementToRefresh = parent_3.count() === 0 ? parent_3.parent() : parent_3;
        }
        this.viewer.domFocus();
        return this.viewer.refresh(elementToRefresh);
    };
    RemoveAction.LABEL = nls.localize('RemoveAction.label', "Dismiss");
    return RemoveAction;
}(AbstractSearchAndReplaceAction));
export { RemoveAction };
function elementIsEqualOrParent(element, testParent) {
    do {
        if (element === testParent) {
            return true;
        }
    } while (!(element.parent() instanceof SearchResult) && (element = element.parent()));
    return false;
}
var ReplaceAllAction = /** @class */ (function (_super) {
    __extends(ReplaceAllAction, _super);
    function ReplaceAllAction(viewer, fileMatch, viewlet, keyBindingService) {
        var _this = _super.call(this, Constants.ReplaceAllInFileActionId, appendKeyBindingLabel(ReplaceAllAction.LABEL, keyBindingService.lookupKeybinding(Constants.ReplaceAllInFileActionId), keyBindingService), 'action-replace-all') || this;
        _this.viewer = viewer;
        _this.fileMatch = fileMatch;
        _this.viewlet = viewlet;
        return _this;
    }
    ReplaceAllAction.prototype.run = function () {
        var _this = this;
        var nextFocusElement = this.getElementToFocusAfterRemoved(this.viewer, this.fileMatch);
        return this.fileMatch.parent().replace(this.fileMatch).then(function () {
            if (nextFocusElement) {
                _this.viewer.setFocus(nextFocusElement);
            }
            _this.viewer.domFocus();
            _this.viewlet.open(_this.fileMatch, true);
        });
    };
    ReplaceAllAction.LABEL = nls.localize('file.replaceAll.label', "Replace All");
    ReplaceAllAction = __decorate([
        __param(3, IKeybindingService)
    ], ReplaceAllAction);
    return ReplaceAllAction;
}(AbstractSearchAndReplaceAction));
export { ReplaceAllAction };
var ReplaceAllInFolderAction = /** @class */ (function (_super) {
    __extends(ReplaceAllInFolderAction, _super);
    function ReplaceAllInFolderAction(viewer, folderMatch, keyBindingService) {
        var _this = _super.call(this, Constants.ReplaceAllInFolderActionId, appendKeyBindingLabel(ReplaceAllInFolderAction.LABEL, keyBindingService.lookupKeybinding(Constants.ReplaceAllInFolderActionId), keyBindingService), 'action-replace-all') || this;
        _this.viewer = viewer;
        _this.folderMatch = folderMatch;
        return _this;
    }
    ReplaceAllInFolderAction.prototype.run = function () {
        var _this = this;
        var nextFocusElement = this.getElementToFocusAfterRemoved(this.viewer, this.folderMatch);
        return this.folderMatch.replaceAll()
            .then(function () {
            if (nextFocusElement) {
                _this.viewer.setFocus(nextFocusElement);
            }
            _this.viewer.domFocus();
        });
    };
    ReplaceAllInFolderAction.LABEL = nls.localize('file.replaceAll.label', "Replace All");
    ReplaceAllInFolderAction = __decorate([
        __param(2, IKeybindingService)
    ], ReplaceAllInFolderAction);
    return ReplaceAllInFolderAction;
}(AbstractSearchAndReplaceAction));
export { ReplaceAllInFolderAction };
var ReplaceAction = /** @class */ (function (_super) {
    __extends(ReplaceAction, _super);
    function ReplaceAction(viewer, element, viewlet, replaceService, keyBindingService, editorService) {
        var _this = _super.call(this, Constants.ReplaceActionId, appendKeyBindingLabel(ReplaceAction.LABEL, keyBindingService.lookupKeybinding(Constants.ReplaceActionId), keyBindingService), 'action-replace') || this;
        _this.viewer = viewer;
        _this.element = element;
        _this.viewlet = viewlet;
        _this.replaceService = replaceService;
        _this.editorService = editorService;
        return _this;
    }
    ReplaceAction.prototype.run = function () {
        var _this = this;
        this.enabled = false;
        return this.element.parent().replace(this.element).then(function () {
            var elementToFocus = _this.getElementToFocusAfterReplace();
            if (elementToFocus) {
                _this.viewer.setFocus(elementToFocus);
            }
            var elementToShowReplacePreview = _this.getElementToShowReplacePreview(elementToFocus);
            _this.viewer.domFocus();
            if (!elementToShowReplacePreview || _this.hasToOpenFile()) {
                _this.viewlet.open(_this.element, true);
            }
            else {
                _this.replaceService.openReplacePreview(elementToShowReplacePreview, true);
            }
        });
    };
    ReplaceAction.prototype.getElementToFocusAfterReplace = function () {
        var navigator = this.viewer.getNavigator();
        var fileMatched = false;
        var elementToFocus = null;
        do {
            elementToFocus = navigator.current();
            if (elementToFocus instanceof Match) {
                if (elementToFocus.parent().id() === this.element.parent().id()) {
                    fileMatched = true;
                    if (this.element.range().getStartPosition().isBeforeOrEqual(elementToFocus.range().getStartPosition())) {
                        // Closest next match in the same file
                        break;
                    }
                }
                else if (fileMatched) {
                    // First match in the next file (if expanded)
                    break;
                }
            }
            else if (fileMatched) {
                if (!this.viewer.isExpanded(elementToFocus)) {
                    // Next file match (if collapsed)
                    break;
                }
            }
        } while (!!navigator.next());
        return elementToFocus;
    };
    ReplaceAction.prototype.getElementToShowReplacePreview = function (elementToFocus) {
        if (this.hasSameParent(elementToFocus)) {
            return elementToFocus;
        }
        var previousElement = this.getPreviousElementAfterRemoved(this.viewer, this.element);
        if (this.hasSameParent(previousElement)) {
            return previousElement;
        }
        return null;
    };
    ReplaceAction.prototype.hasSameParent = function (element) {
        return element && element instanceof Match && element.parent().resource() === this.element.parent().resource();
    };
    ReplaceAction.prototype.hasToOpenFile = function () {
        var activeEditor = this.editorService.activeEditor;
        var file = activeEditor ? activeEditor.getResource() : void 0;
        if (file) {
            return file.toString() === this.element.parent().resource().toString();
        }
        return false;
    };
    ReplaceAction.LABEL = nls.localize('match.replace.label', "Replace");
    ReplaceAction = __decorate([
        __param(3, IReplaceService),
        __param(4, IKeybindingService),
        __param(5, IEditorService)
    ], ReplaceAction);
    return ReplaceAction;
}(AbstractSearchAndReplaceAction));
export { ReplaceAction };
function uriToClipboardString(resource) {
    return resource.scheme === Schemas.file ? normalize(normalizeDriveLetter(resource.fsPath), true) : resource.toString();
}
export var copyPathCommand = function (accessor, fileMatch) {
    var clipboardService = accessor.get(IClipboardService);
    var text = uriToClipboardString(fileMatch.resource());
    clipboardService.writeText(text);
};
function matchToString(match) {
    return match.range().startLineNumber + "," + match.range().startColumn + ": " + match.text();
}
var lineDelimiter = isWindows ? '\r\n' : '\n';
function fileMatchToString(fileMatch, maxMatches) {
    var matchTextRows = fileMatch.matches()
        .sort(searchMatchComparer)
        .slice(0, maxMatches)
        .map(matchToString)
        .map(function (matchText) { return '  ' + matchText; });
    return {
        text: "" + uriToClipboardString(fileMatch.resource()) + lineDelimiter + matchTextRows.join(lineDelimiter),
        count: matchTextRows.length
    };
}
function folderMatchToString(folderMatch, maxMatches) {
    var fileResults = [];
    var numMatches = 0;
    var matches = folderMatch.matches().sort(searchMatchComparer);
    for (var i = 0; i < folderMatch.fileCount() && numMatches < maxMatches; i++) {
        var fileResult = fileMatchToString(matches[i], maxMatches - numMatches);
        numMatches += fileResult.count;
        fileResults.push(fileResult.text);
    }
    return {
        text: fileResults.join(lineDelimiter + lineDelimiter),
        count: numMatches
    };
}
var maxClipboardMatches = 1e4;
export var copyMatchCommand = function (accessor, match) {
    var clipboardService = accessor.get(IClipboardService);
    var text;
    if (match instanceof Match) {
        text = matchToString(match);
    }
    else if (match instanceof FileMatch) {
        text = fileMatchToString(match, maxClipboardMatches).text;
    }
    else if (match instanceof FolderMatch) {
        text = folderMatchToString(match, maxClipboardMatches).text;
    }
    if (text) {
        clipboardService.writeText(text);
    }
};
function allFolderMatchesToString(folderMatches, maxMatches) {
    var folderResults = [];
    var numMatches = 0;
    folderMatches = folderMatches.sort(searchMatchComparer);
    for (var i = 0; i < folderMatches.length && numMatches < maxMatches; i++) {
        var folderResult = folderMatchToString(folderMatches[i], maxMatches - numMatches);
        if (folderResult.count) {
            numMatches += folderResult.count;
            folderResults.push(folderResult.text);
        }
    }
    return folderResults.join(lineDelimiter + lineDelimiter);
}
export var copyAllCommand = function (accessor) {
    var viewletService = accessor.get(IViewletService);
    var panelService = accessor.get(IPanelService);
    var clipboardService = accessor.get(IClipboardService);
    var searchView = getSearchView(viewletService, panelService);
    var root = searchView.getControl().getInput();
    var text = allFolderMatchesToString(root.folderMatches(), maxClipboardMatches);
    clipboardService.writeText(text);
};
export var clearHistoryCommand = function (accessor) {
    var searchHistoryService = accessor.get(ISearchHistoryService);
    searchHistoryService.clearHistory();
};
export var focusSearchListCommand = function (accessor) {
    var viewletService = accessor.get(IViewletService);
    var panelService = accessor.get(IPanelService);
    openSearchView(viewletService, panelService).then(function (searchView) {
        searchView.moveFocusToResults();
    });
};
