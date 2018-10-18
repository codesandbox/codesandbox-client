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
import * as browser from '../../../../base/browser/browser';
import * as dom from '../../../../base/browser/dom';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent';
import * as aria from '../../../../base/browser/ui/aria/aria';
import { Delayer } from '../../../../base/common/async';
import * as errors from '../../../../base/common/errors';
import { anyEvent, debounceEvent, Emitter } from '../../../../base/common/event';
import { dispose } from '../../../../base/common/lifecycle';
import * as paths from '../../../../base/common/paths';
import * as env from '../../../../base/common/platform';
import * as strings from '../../../../base/common/strings';
import { TPromise } from '../../../../base/common/winjs.base';
import './media/searchview.css';
import { isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser';
import * as nls from '../../../../nls';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs';
import { IFileService } from '../../../../platform/files/common/files';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { TreeResourceNavigator, WorkbenchTree } from '../../../../platform/list/browser/listService';
import { INotificationService } from '../../../../platform/notification/common/notification';
import { IProgressService } from '../../../../platform/progress/common/progress';
import { ISearchHistoryService, VIEW_ID } from '../../../../platform/search/common/search';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { diffInserted, diffInsertedOutline, diffRemoved, diffRemovedOutline, editorFindMatchHighlight, editorFindMatchHighlightBorder, listActiveSelectionForeground } from '../../../../platform/theme/common/colorRegistry';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { OpenFileFolderAction, OpenFolderAction } from '../../../browser/actions/workspaceActions';
import { SimpleFileResourceDragAndDrop } from '../../../browser/dnd';
import { Viewlet } from '../../../browser/viewlet';
import { ExcludePatternInputWidget, PatternInputWidget } from './patternInputWidget';
import { CancelSearchAction, ClearSearchResultsAction, CollapseDeepestExpandedLevelAction, RefreshAction } from './searchActions';
import { SearchAccessibilityProvider, SearchDataSource, SearchFilter, SearchRenderer, SearchSorter, SearchTreeController } from './searchResultsView';
import { SearchWidget } from './searchWidget';
import * as Constants from '../common/constants';
import { QueryBuilder } from '../common/queryBuilder';
import { IReplaceService } from '../common/replace';
import { getOutOfWorkspaceEditorResources } from '../common/search';
import { FileMatch, FolderMatch, ISearchWorkbenchService, Match } from '../common/searchModel';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService';
import { IPartService } from '../../../services/part/common/partService';
import { IPreferencesService } from '../../../services/preferences/common/preferences';
import { IUntitledEditorService } from '../../../services/untitled/common/untitledEditorService';
var $ = dom.$;
var SearchView = /** @class */ (function (_super) {
    __extends(SearchView, _super);
    function SearchView(partService, telemetryService, fileService, editorService, progressService, notificationService, dialogService, storageService, contextViewService, instantiationService, configurationService, contextService, searchWorkbenchService, contextKeyService, replaceService, untitledEditorService, preferencesService, themeService, searchHistoryService, editorGroupsService) {
        var _this = _super.call(this, VIEW_ID, configurationService, partService, telemetryService, themeService) || this;
        _this.fileService = fileService;
        _this.editorService = editorService;
        _this.progressService = progressService;
        _this.notificationService = notificationService;
        _this.dialogService = dialogService;
        _this.storageService = storageService;
        _this.contextViewService = contextViewService;
        _this.instantiationService = instantiationService;
        _this.contextService = contextService;
        _this.searchWorkbenchService = searchWorkbenchService;
        _this.contextKeyService = contextKeyService;
        _this.replaceService = replaceService;
        _this.untitledEditorService = untitledEditorService;
        _this.preferencesService = preferencesService;
        _this.themeService = themeService;
        _this.searchHistoryService = searchHistoryService;
        _this.editorGroupsService = editorGroupsService;
        _this.actions = [];
        _this.messageDisposables = [];
        _this.viewletVisible = Constants.SearchViewVisibleKey.bindTo(contextKeyService);
        _this.viewletFocused = Constants.SearchViewFocusedKey.bindTo(contextKeyService);
        _this.inputBoxFocused = Constants.InputBoxFocusedKey.bindTo(_this.contextKeyService);
        _this.inputPatternIncludesFocused = Constants.PatternIncludesFocusedKey.bindTo(_this.contextKeyService);
        _this.inputPatternExclusionsFocused = Constants.PatternExcludesFocusedKey.bindTo(_this.contextKeyService);
        _this.firstMatchFocused = Constants.FirstMatchFocusKey.bindTo(contextKeyService);
        _this.fileMatchOrMatchFocused = Constants.FileMatchOrMatchFocusKey.bindTo(contextKeyService);
        _this.fileMatchOrFolderMatchFocus = Constants.FileMatchOrFolderMatchFocusKey.bindTo(contextKeyService);
        _this.fileMatchFocused = Constants.FileFocusKey.bindTo(contextKeyService);
        _this.folderMatchFocused = Constants.FolderFocusKey.bindTo(contextKeyService);
        _this.matchFocused = Constants.MatchFocusKey.bindTo(_this.contextKeyService);
        _this.hasSearchResultsKey = Constants.HasSearchResults.bindTo(_this.contextKeyService);
        _this.queryBuilder = _this.instantiationService.createInstance(QueryBuilder);
        _this.viewletSettings = _this.getMemento(storageService, 1 /* WORKSPACE */);
        _this._register(_this.fileService.onFileChanges(function (e) { return _this.onFilesChanged(e); }));
        _this._register(_this.untitledEditorService.onDidChangeDirty(function (e) { return _this.onUntitledDidChangeDirty(e); }));
        _this._register(_this.contextService.onDidChangeWorkbenchState(function () { return _this.onDidChangeWorkbenchState(); }));
        _this._register(_this.searchHistoryService.onDidClearHistory(function () { return _this.clearHistory(); }));
        _this.selectCurrentMatchEmitter = new Emitter();
        debounceEvent(_this.selectCurrentMatchEmitter.event, function (l, e) { return e; }, 100, /*leading=*/ true)(function () { return _this.selectCurrentMatch(); });
        _this.delayedRefresh = new Delayer(250);
        return _this;
    }
    SearchView.prototype.onDidChangeWorkbenchState = function () {
        if (this.contextService.getWorkbenchState() !== 1 /* EMPTY */ && this.searchWithoutFolderMessageElement) {
            dom.hide(this.searchWithoutFolderMessageElement);
        }
    };
    SearchView.prototype.create = function (parent) {
        var _this = this;
        _super.prototype.create.call(this, parent);
        this.viewModel = this._register(this.searchWorkbenchService.searchModel);
        var containerElement = dom.append(parent, $('.search-view'));
        this.searchWidgetsContainerElement = dom.append(containerElement, $('.search-widgets-container'));
        this.createSearchWidget(this.searchWidgetsContainerElement);
        var history = this.searchHistoryService.load();
        var filePatterns = this.viewletSettings['query.filePatterns'] || '';
        var patternExclusions = this.viewletSettings['query.folderExclusions'] || '';
        var patternExclusionsHistory = history.exclude || [];
        var patternIncludes = this.viewletSettings['query.folderIncludes'] || '';
        var patternIncludesHistory = history.include || [];
        var queryDetailsExpanded = this.viewletSettings['query.queryDetailsExpanded'] || '';
        var useExcludesAndIgnoreFiles = typeof this.viewletSettings['query.useExcludesAndIgnoreFiles'] === 'boolean' ?
            this.viewletSettings['query.useExcludesAndIgnoreFiles'] : true;
        this.queryDetails = dom.append(this.searchWidgetsContainerElement, $('.query-details'));
        // Toggle query details button
        this.toggleQueryDetailsButton = dom.append(this.queryDetails, $('.more', { tabindex: 0, role: 'button', title: nls.localize('moreSearch', "Toggle Search Details") }));
        this._register(dom.addDisposableListener(this.toggleQueryDetailsButton, dom.EventType.CLICK, function (e) {
            dom.EventHelper.stop(e);
            _this.toggleQueryDetails(!_this.isScreenReaderOptimized());
        }));
        this._register(dom.addDisposableListener(this.toggleQueryDetailsButton, dom.EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                dom.EventHelper.stop(e);
                _this.toggleQueryDetails(false);
            }
        }));
        this._register(dom.addDisposableListener(this.toggleQueryDetailsButton, dom.EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(1024 /* Shift */ | 2 /* Tab */)) {
                if (_this.searchWidget.isReplaceActive()) {
                    _this.searchWidget.focusReplaceAllAction();
                }
                else {
                    _this.searchWidget.focusRegexAction();
                }
                dom.EventHelper.stop(e);
            }
        }));
        // folder includes list
        var folderIncludesList = dom.append(this.queryDetails, $('.file-types.includes'));
        var filesToIncludeTitle = nls.localize('searchScope.includes', "files to include");
        dom.append(folderIncludesList, $('h4', undefined, filesToIncludeTitle));
        this.inputPatternIncludes = this._register(this.instantiationService.createInstance(PatternInputWidget, folderIncludesList, this.contextViewService, {
            ariaLabel: nls.localize('label.includes', 'Search Include Patterns'),
            history: patternIncludesHistory,
        }));
        this.inputPatternIncludes.setValue(patternIncludes);
        this.inputPatternIncludes.onSubmit(function () { return _this.onQueryChanged(true); });
        this.inputPatternIncludes.onCancel(function () { return _this.viewModel.cancelSearch(); }); // Cancel search without focusing the search widget
        this.trackInputBox(this.inputPatternIncludes.inputFocusTracker, this.inputPatternIncludesFocused);
        // excludes list
        var excludesList = dom.append(this.queryDetails, $('.file-types.excludes'));
        var excludesTitle = nls.localize('searchScope.excludes', "files to exclude");
        dom.append(excludesList, $('h4', undefined, excludesTitle));
        this.inputPatternExcludes = this._register(this.instantiationService.createInstance(ExcludePatternInputWidget, excludesList, this.contextViewService, {
            ariaLabel: nls.localize('label.excludes', 'Search Exclude Patterns'),
            history: patternExclusionsHistory,
        }));
        this.inputPatternExcludes.setValue(patternExclusions);
        this.inputPatternExcludes.setUseExcludesAndIgnoreFiles(useExcludesAndIgnoreFiles);
        this.inputPatternExcludes.onSubmit(function () { return _this.onQueryChanged(true); });
        this.inputPatternExcludes.onCancel(function () { return _this.viewModel.cancelSearch(); }); // Cancel search without focusing the search widget
        this.trackInputBox(this.inputPatternExcludes.inputFocusTracker, this.inputPatternExclusionsFocused);
        this.messagesElement = dom.append(containerElement, $('.messages'));
        if (this.contextService.getWorkbenchState() === 1 /* EMPTY */) {
            this.showSearchWithoutFolderMessage();
        }
        this.createSearchResultsView(containerElement);
        this.actions = [
            this.instantiationService.createInstance(RefreshAction, RefreshAction.ID, RefreshAction.LABEL),
            this.instantiationService.createInstance(CollapseDeepestExpandedLevelAction, CollapseDeepestExpandedLevelAction.ID, CollapseDeepestExpandedLevelAction.LABEL),
            this.instantiationService.createInstance(ClearSearchResultsAction, ClearSearchResultsAction.ID, ClearSearchResultsAction.LABEL)
        ];
        if (filePatterns !== '' || patternExclusions !== '' || patternIncludes !== '' || queryDetailsExpanded !== '' || !useExcludesAndIgnoreFiles) {
            this.toggleQueryDetails(true, true, true);
        }
        this._register(this.viewModel.searchResult.onChange(function (event) { return _this.onSearchResultsChanged(event); }));
        this._register(this.onDidFocus(function () { return _this.viewletFocused.set(true); }));
        this._register(this.onDidBlur(function () { return _this.viewletFocused.set(false); }));
        return TPromise.as(null);
    };
    Object.defineProperty(SearchView.prototype, "searchAndReplaceWidget", {
        get: function () {
            return this.searchWidget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchView.prototype, "searchIncludePattern", {
        get: function () {
            return this.inputPatternIncludes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchView.prototype, "searchExcludePattern", {
        get: function () {
            return this.inputPatternExcludes;
        },
        enumerable: true,
        configurable: true
    });
    SearchView.prototype.updateActions = function () {
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            action.update();
        }
    };
    SearchView.prototype.isScreenReaderOptimized = function () {
        var detected = browser.getAccessibilitySupport() === 2 /* Enabled */;
        var config = this.configurationService.getValue('editor').accessibilitySupport;
        return config === 'on' || (config === 'auto' && detected);
    };
    SearchView.prototype.createSearchWidget = function (container) {
        var _this = this;
        var contentPattern = this.viewletSettings['query.contentPattern'] || '';
        var isRegex = this.viewletSettings['query.regex'] === true;
        var isWholeWords = this.viewletSettings['query.wholeWords'] === true;
        var isCaseSensitive = this.viewletSettings['query.caseSensitive'] === true;
        var history = this.searchHistoryService.load();
        var searchHistory = history.search || this.viewletSettings['query.searchHistory'] || [];
        var replaceHistory = history.replace || this.viewletSettings['query.replaceHistory'] || [];
        this.searchWidget = this._register(this.instantiationService.createInstance(SearchWidget, container, {
            value: contentPattern,
            isRegex: isRegex,
            isCaseSensitive: isCaseSensitive,
            isWholeWords: isWholeWords,
            searchHistory: searchHistory,
            replaceHistory: replaceHistory
        }));
        if (this.storageService.getBoolean(SearchView.SHOW_REPLACE_STORAGE_KEY, 1 /* WORKSPACE */, true)) {
            this.searchWidget.toggleReplace(true);
        }
        this._register(this.searchWidget.onSearchSubmit(function () { return _this.onQueryChanged(); }));
        this._register(this.searchWidget.onSearchCancel(function () { return _this.cancelSearch(); }));
        this._register(this.searchWidget.searchInput.onDidOptionChange(function () { return _this.onQueryChanged(true); }));
        this._register(this.searchWidget.onReplaceToggled(function () { return _this.onReplaceToggled(); }));
        this._register(this.searchWidget.onReplaceStateChange(function (state) {
            _this.viewModel.replaceActive = state;
            _this.tree.refresh();
        }));
        this._register(this.searchWidget.onReplaceValueChanged(function (value) {
            _this.viewModel.replaceString = _this.searchWidget.getReplaceValue();
            _this.delayedRefresh.trigger(function () { return _this.tree.refresh(); });
        }));
        this._register(this.searchWidget.onBlur(function () {
            _this.toggleQueryDetailsButton.focus();
        }));
        this._register(this.searchWidget.onReplaceAll(function () { return _this.replaceAll(); }));
        this.trackInputBox(this.searchWidget.searchInputFocusTracker);
        this.trackInputBox(this.searchWidget.replaceInputFocusTracker);
    };
    SearchView.prototype.trackInputBox = function (inputFocusTracker, contextKey) {
        var _this = this;
        this._register(inputFocusTracker.onDidFocus(function () {
            _this.inputBoxFocused.set(true);
            if (contextKey) {
                contextKey.set(true);
            }
        }));
        this._register(inputFocusTracker.onDidBlur(function () {
            _this.inputBoxFocused.set(_this.searchWidget.searchInputHasFocus()
                || _this.searchWidget.replaceInputHasFocus()
                || _this.inputPatternIncludes.inputHasFocus()
                || _this.inputPatternExcludes.inputHasFocus());
            if (contextKey) {
                contextKey.set(false);
            }
        }));
    };
    SearchView.prototype.onReplaceToggled = function () {
        this.layout(this.size);
        var isReplaceShown = this.searchAndReplaceWidget.isReplaceShown();
        if (!isReplaceShown) {
            this.storageService.store(SearchView.SHOW_REPLACE_STORAGE_KEY, false, 1 /* WORKSPACE */);
        }
        else {
            this.storageService.remove(SearchView.SHOW_REPLACE_STORAGE_KEY, 1 /* WORKSPACE */);
        }
    };
    SearchView.prototype.onSearchResultsChanged = function (event) {
        if (this.isVisible()) {
            return this.refreshAndUpdateCount(event);
        }
        else {
            this.changedWhileHidden = true;
            return TPromise.wrap(null);
        }
    };
    SearchView.prototype.refreshAndUpdateCount = function (event) {
        var _this = this;
        return this.refreshTree(event).then(function () {
            _this.searchWidget.setReplaceAllActionState(!_this.viewModel.searchResult.isEmpty());
            _this.updateSearchResultCount();
        });
    };
    SearchView.prototype.refreshTree = function (event) {
        if (!event || event.added || event.removed) {
            return this.tree.refresh(this.viewModel.searchResult);
        }
        else {
            if (event.elements.length === 1) {
                return this.tree.refresh(event.elements[0]);
            }
            else {
                return this.tree.refresh(event.elements);
            }
        }
    };
    SearchView.prototype.replaceAll = function () {
        var _this = this;
        if (this.viewModel.searchResult.count() === 0) {
            return;
        }
        var progressRunner = this.progressService.show(100);
        var occurrences = this.viewModel.searchResult.count();
        var fileCount = this.viewModel.searchResult.fileCount();
        var replaceValue = this.searchWidget.getReplaceValue() || '';
        var afterReplaceAllMessage = this.buildAfterReplaceAllMessage(occurrences, fileCount, replaceValue);
        var confirmation = {
            title: nls.localize('replaceAll.confirmation.title', "Replace All"),
            message: this.buildReplaceAllConfirmationMessage(occurrences, fileCount, replaceValue),
            primaryButton: nls.localize('replaceAll.confirm.button', "&&Replace"),
            type: 'question'
        };
        this.dialogService.confirm(confirmation).then(function (res) {
            if (res.confirmed) {
                _this.searchWidget.setReplaceAllActionState(false);
                _this.viewModel.searchResult.replaceAll(progressRunner).then(function () {
                    progressRunner.done();
                    var messageEl = _this.clearMessage();
                    dom.append(messageEl, $('p', undefined, afterReplaceAllMessage));
                }, function (error) {
                    progressRunner.done();
                    errors.isPromiseCanceledError(error);
                    _this.notificationService.error(error);
                });
            }
        });
    };
    SearchView.prototype.buildAfterReplaceAllMessage = function (occurrences, fileCount, replaceValue) {
        if (occurrences === 1) {
            if (fileCount === 1) {
                if (replaceValue) {
                    return nls.localize('replaceAll.occurrence.file.message', "Replaced {0} occurrence across {1} file with '{2}'.", occurrences, fileCount, replaceValue);
                }
                return nls.localize('removeAll.occurrence.file.message', "Replaced {0} occurrence across {1} file'.", occurrences, fileCount);
            }
            if (replaceValue) {
                return nls.localize('replaceAll.occurrence.files.message', "Replaced {0} occurrence across {1} files with '{2}'.", occurrences, fileCount, replaceValue);
            }
            return nls.localize('removeAll.occurrence.files.message', "Replaced {0} occurrence across {1} files.", occurrences, fileCount);
        }
        if (fileCount === 1) {
            if (replaceValue) {
                return nls.localize('replaceAll.occurrences.file.message', "Replaced {0} occurrences across {1} file with '{2}'.", occurrences, fileCount, replaceValue);
            }
            return nls.localize('removeAll.occurrences.file.message', "Replaced {0} occurrences across {1} file'.", occurrences, fileCount);
        }
        if (replaceValue) {
            return nls.localize('replaceAll.occurrences.files.message', "Replaced {0} occurrences across {1} files with '{2}'.", occurrences, fileCount, replaceValue);
        }
        return nls.localize('removeAll.occurrences.files.message', "Replaced {0} occurrences across {1} files.", occurrences, fileCount);
    };
    SearchView.prototype.buildReplaceAllConfirmationMessage = function (occurrences, fileCount, replaceValue) {
        if (occurrences === 1) {
            if (fileCount === 1) {
                if (replaceValue) {
                    return nls.localize('removeAll.occurrence.file.confirmation.message', "Replace {0} occurrence across {1} file with '{2}'?", occurrences, fileCount, replaceValue);
                }
                return nls.localize('replaceAll.occurrence.file.confirmation.message', "Replace {0} occurrence across {1} file'?", occurrences, fileCount);
            }
            if (replaceValue) {
                return nls.localize('removeAll.occurrence.files.confirmation.message', "Replace {0} occurrence across {1} files with '{2}'?", occurrences, fileCount, replaceValue);
            }
            return nls.localize('replaceAll.occurrence.files.confirmation.message', "Replace {0} occurrence across {1} files?", occurrences, fileCount);
        }
        if (fileCount === 1) {
            if (replaceValue) {
                return nls.localize('removeAll.occurrences.file.confirmation.message', "Replace {0} occurrences across {1} file with '{2}'?", occurrences, fileCount, replaceValue);
            }
            return nls.localize('replaceAll.occurrences.file.confirmation.message', "Replace {0} occurrences across {1} file'?", occurrences, fileCount);
        }
        if (replaceValue) {
            return nls.localize('removeAll.occurrences.files.confirmation.message', "Replace {0} occurrences across {1} files with '{2}'?", occurrences, fileCount, replaceValue);
        }
        return nls.localize('replaceAll.occurrences.files.confirmation.message', "Replace {0} occurrences across {1} files?", occurrences, fileCount);
    };
    SearchView.prototype.clearMessage = function () {
        this.searchWithoutFolderMessageElement = void 0;
        dom.clearNode(this.messagesElement);
        dom.show(this.messagesElement);
        dispose(this.messageDisposables);
        this.messageDisposables = [];
        return dom.append(this.messagesElement, $('.message'));
    };
    SearchView.prototype.createSearchResultsView = function (container) {
        var _this = this;
        this.resultsElement = dom.append(container, $('.results.show-file-icons'));
        var dataSource = this._register(this.instantiationService.createInstance(SearchDataSource));
        var renderer = this._register(this.instantiationService.createInstance(SearchRenderer, this.getActionRunner(), this));
        var dnd = this.instantiationService.createInstance(SimpleFileResourceDragAndDrop, function (obj) { return obj instanceof FileMatch ? obj.resource() : void 0; });
        this.tree = this._register(this.instantiationService.createInstance(WorkbenchTree, this.resultsElement, {
            dataSource: dataSource,
            renderer: renderer,
            sorter: new SearchSorter(),
            filter: new SearchFilter(),
            controller: this.instantiationService.createInstance(SearchTreeController),
            accessibilityProvider: this.instantiationService.createInstance(SearchAccessibilityProvider),
            dnd: dnd
        }, {
            ariaLabel: nls.localize('treeAriaLabel', "Search Results"),
            showLoading: false
        }));
        this.tree.setInput(this.viewModel.searchResult);
        var searchResultsNavigator = this._register(new TreeResourceNavigator(this.tree, { openOnFocus: true }));
        this._register(debounceEvent(searchResultsNavigator.openResource, function (last, event) { return event; }, 75, true)(function (options) {
            if (options.element instanceof Match) {
                var selectedMatch = options.element;
                if (_this.currentSelectedFileMatch) {
                    _this.currentSelectedFileMatch.setSelectedMatch(null);
                }
                _this.currentSelectedFileMatch = selectedMatch.parent();
                _this.currentSelectedFileMatch.setSelectedMatch(selectedMatch);
                if (!(options.payload && options.payload.preventEditorOpen)) {
                    _this.onFocus(selectedMatch, options.editorOptions.preserveFocus, options.sideBySide, options.editorOptions.pinned);
                }
            }
        }));
        this._register(anyEvent(this.tree.onDidFocus, this.tree.onDidChangeFocus)(function () {
            if (_this.tree.isDOMFocused()) {
                var focus_1 = _this.tree.getFocus();
                _this.firstMatchFocused.set(_this.tree.getNavigator().first() === focus_1);
                _this.fileMatchOrMatchFocused.set(!!focus_1);
                _this.fileMatchFocused.set(focus_1 instanceof FileMatch);
                _this.folderMatchFocused.set(focus_1 instanceof FolderMatch);
                _this.matchFocused.set(focus_1 instanceof Match);
                _this.fileMatchOrFolderMatchFocus.set(focus_1 instanceof FileMatch || focus_1 instanceof FolderMatch);
            }
        }));
        this._register(this.tree.onDidBlur(function (e) {
            _this.firstMatchFocused.reset();
            _this.fileMatchOrMatchFocused.reset();
            _this.fileMatchFocused.reset();
            _this.folderMatchFocused.reset();
            _this.matchFocused.reset();
            _this.fileMatchOrFolderMatchFocus.reset();
        }));
    };
    SearchView.prototype.selectCurrentMatch = function () {
        var focused = this.tree.getFocus();
        var eventPayload = { focusEditor: true };
        this.tree.setSelection([focused], eventPayload);
    };
    SearchView.prototype.selectNextMatch = function () {
        var selected = this.tree.getSelection()[0];
        // Expand the initial selected node, if needed
        if (selected instanceof FileMatch) {
            if (!this.tree.isExpanded(selected)) {
                this.tree.expand(selected);
            }
        }
        var navigator = this.tree.getNavigator(selected, /*subTreeOnly=*/ false);
        var next = navigator.next();
        if (!next) {
            // Reached the end - get a new navigator from the root.
            // .first and .last only work when subTreeOnly = true. Maybe there's a simpler way.
            navigator = this.tree.getNavigator(this.tree.getInput(), /*subTreeOnly*/ true);
            next = navigator.first();
        }
        // Expand and go past FileMatch nodes
        while (!(next instanceof Match)) {
            if (!this.tree.isExpanded(next)) {
                this.tree.expand(next);
            }
            // Select the FileMatch's first child
            next = navigator.next();
        }
        // Reveal the newly selected element
        if (next) {
            var eventPayload = { preventEditorOpen: true };
            this.tree.setFocus(next, eventPayload);
            this.tree.setSelection([next], eventPayload);
            this.tree.reveal(next);
            this.selectCurrentMatchEmitter.fire();
        }
    };
    SearchView.prototype.selectPreviousMatch = function () {
        var selected = this.tree.getSelection()[0];
        var navigator = this.tree.getNavigator(selected, /*subTreeOnly=*/ false);
        var prev = navigator.previous();
        // Expand and go past FileMatch nodes
        if (!(prev instanceof Match)) {
            prev = navigator.previous();
            if (!prev) {
                // Wrap around. Get a new tree starting from the root
                navigator = this.tree.getNavigator(this.tree.getInput(), /*subTreeOnly*/ true);
                prev = navigator.last();
                // This is complicated because .last will set the navigator to the last FileMatch,
                // so expand it and FF to its last child
                this.tree.expand(prev);
                var tmp = void 0;
                while (tmp = navigator.next()) {
                    prev = tmp;
                }
            }
            if (!(prev instanceof Match)) {
                // There is a second non-Match result, which must be a collapsed FileMatch.
                // Expand it then select its last child.
                navigator.next();
                this.tree.expand(prev);
                prev = navigator.previous();
            }
        }
        // Reveal the newly selected element
        if (prev) {
            var eventPayload = { preventEditorOpen: true };
            this.tree.setFocus(prev, eventPayload);
            this.tree.setSelection([prev], eventPayload);
            this.tree.reveal(prev);
            this.selectCurrentMatchEmitter.fire();
        }
    };
    SearchView.prototype.setVisible = function (visible) {
        var promise;
        this.viewletVisible.set(visible);
        if (visible) {
            if (this.changedWhileHidden) {
                // Render if results changed while viewlet was hidden - #37818
                this.refreshAndUpdateCount();
                this.changedWhileHidden = false;
            }
            promise = _super.prototype.setVisible.call(this, visible);
            this.tree.onVisible();
        }
        else {
            this.tree.onHidden();
            promise = _super.prototype.setVisible.call(this, visible);
        }
        // Enable highlights if there are searchresults
        if (this.viewModel) {
            this.viewModel.searchResult.toggleHighlights(visible);
        }
        // Open focused element from results in case the editor area is otherwise empty
        if (visible && !this.editorService.activeEditor) {
            var focus_2 = this.tree.getFocus();
            if (focus_2) {
                this.onFocus(focus_2, true);
            }
        }
        return promise;
    };
    SearchView.prototype.moveFocusToResults = function () {
        this.tree.domFocus();
    };
    SearchView.prototype.focus = function () {
        _super.prototype.focus.call(this);
        var updatedText = this.updateTextFromSelection();
        this.searchWidget.focus(undefined, undefined, updatedText);
    };
    SearchView.prototype.updateTextFromSelection = function (allowUnselectedWord) {
        if (allowUnselectedWord === void 0) { allowUnselectedWord = true; }
        var updatedText = false;
        var seedSearchStringFromSelection = this.configurationService.getValue('editor').find.seedSearchStringFromSelection;
        if (seedSearchStringFromSelection) {
            var selectedText = this.getSearchTextFromEditor(allowUnselectedWord);
            if (selectedText) {
                if (this.searchWidget.searchInput.getRegex()) {
                    selectedText = strings.escapeRegExpCharacters(selectedText);
                }
                this.searchWidget.searchInput.setValue(selectedText);
                updatedText = true;
            }
        }
        return updatedText;
    };
    SearchView.prototype.focusNextInputBox = function () {
        if (this.searchWidget.searchInputHasFocus()) {
            if (this.searchWidget.isReplaceShown()) {
                this.searchWidget.focus(true, true);
            }
            else {
                this.moveFocusFromSearchOrReplace();
            }
            return;
        }
        if (this.searchWidget.replaceInputHasFocus()) {
            this.moveFocusFromSearchOrReplace();
            return;
        }
        if (this.inputPatternIncludes.inputHasFocus()) {
            this.inputPatternExcludes.focus();
            this.inputPatternExcludes.select();
            return;
        }
        if (this.inputPatternExcludes.inputHasFocus()) {
            this.selectTreeIfNotSelected();
            return;
        }
    };
    SearchView.prototype.moveFocusFromSearchOrReplace = function () {
        if (this.showsFileTypes()) {
            this.toggleQueryDetails(true, this.showsFileTypes());
        }
        else {
            this.selectTreeIfNotSelected();
        }
    };
    SearchView.prototype.focusPreviousInputBox = function () {
        if (this.searchWidget.searchInputHasFocus()) {
            return;
        }
        if (this.searchWidget.replaceInputHasFocus()) {
            this.searchWidget.focus(true);
            return;
        }
        if (this.inputPatternIncludes.inputHasFocus()) {
            this.searchWidget.focus(true, true);
            return;
        }
        if (this.inputPatternExcludes.inputHasFocus()) {
            this.inputPatternIncludes.focus();
            this.inputPatternIncludes.select();
            return;
        }
        if (this.tree.isDOMFocused()) {
            this.moveFocusFromResults();
            return;
        }
    };
    SearchView.prototype.moveFocusFromResults = function () {
        if (this.showsFileTypes()) {
            this.toggleQueryDetails(true, true, false, true);
        }
        else {
            this.searchWidget.focus(true, true);
        }
    };
    SearchView.prototype.reLayout = function () {
        if (this.isDisposed) {
            return;
        }
        if (this.size.width >= SearchView.WIDE_VIEW_SIZE) {
            dom.addClass(this.getContainer(), SearchView.WIDE_CLASS_NAME);
        }
        else {
            dom.removeClass(this.getContainer(), SearchView.WIDE_CLASS_NAME);
        }
        this.searchWidget.setWidth(this.size.width - 28 /* container margin */);
        this.inputPatternExcludes.setWidth(this.size.width - 28 /* container margin */);
        this.inputPatternIncludes.setWidth(this.size.width - 28 /* container margin */);
        var messagesSize = this.messagesElement.style.display === 'none' ?
            0 :
            dom.getTotalHeight(this.messagesElement);
        var searchResultContainerSize = this.size.height -
            messagesSize -
            dom.getTotalHeight(this.searchWidgetsContainerElement);
        this.resultsElement.style.height = searchResultContainerSize + 'px';
        this.tree.layout(searchResultContainerSize);
    };
    SearchView.prototype.layout = function (dimension) {
        this.size = dimension;
        this.reLayout();
    };
    SearchView.prototype.getControl = function () {
        return this.tree;
    };
    SearchView.prototype.isSearchSubmitted = function () {
        return this.searchSubmitted;
    };
    SearchView.prototype.isSearching = function () {
        return this.searching;
    };
    SearchView.prototype.hasSearchResults = function () {
        return !this.viewModel.searchResult.isEmpty();
    };
    SearchView.prototype.clearSearchResults = function () {
        this.viewModel.searchResult.clear();
        this.showEmptyStage();
        if (this.contextService.getWorkbenchState() === 1 /* EMPTY */) {
            this.showSearchWithoutFolderMessage();
        }
        this.searchWidget.clear();
        this.viewModel.cancelSearch();
    };
    SearchView.prototype.cancelSearch = function () {
        if (this.viewModel.cancelSearch()) {
            this.searchWidget.focus();
            return true;
        }
        return false;
    };
    SearchView.prototype.selectTreeIfNotSelected = function () {
        if (this.tree.getInput()) {
            this.tree.domFocus();
            var selection = this.tree.getSelection();
            if (selection.length === 0) {
                this.tree.focusNext();
            }
        }
    };
    SearchView.prototype.getSearchTextFromEditor = function (allowUnselectedWord) {
        if (!this.editorService.activeEditor) {
            return null;
        }
        if (dom.isAncestor(document.activeElement, this.getContainer())) {
            return null;
        }
        var activeTextEditorWidget = this.editorService.activeTextEditorWidget;
        if (isDiffEditor(activeTextEditorWidget)) {
            if (activeTextEditorWidget.getOriginalEditor().hasTextFocus()) {
                activeTextEditorWidget = activeTextEditorWidget.getOriginalEditor();
            }
            else {
                activeTextEditorWidget = activeTextEditorWidget.getModifiedEditor();
            }
        }
        if (!isCodeEditor(activeTextEditorWidget)) {
            return null;
        }
        var range = activeTextEditorWidget.getSelection();
        if (!range) {
            return null;
        }
        if (range.isEmpty() && !this.searchWidget.searchInput.getValue() && allowUnselectedWord) {
            var wordAtPosition = activeTextEditorWidget.getModel().getWordAtPosition(range.getStartPosition());
            if (wordAtPosition) {
                return wordAtPosition.word;
            }
        }
        if (!range.isEmpty() && range.startLineNumber === range.endLineNumber) {
            var searchText = activeTextEditorWidget.getModel().getLineContent(range.startLineNumber);
            searchText = searchText.substring(range.startColumn - 1, range.endColumn - 1);
            return searchText;
        }
        return null;
    };
    SearchView.prototype.showsFileTypes = function () {
        return dom.hasClass(this.queryDetails, 'more');
    };
    SearchView.prototype.toggleCaseSensitive = function () {
        this.searchWidget.searchInput.setCaseSensitive(!this.searchWidget.searchInput.getCaseSensitive());
        this.onQueryChanged(true);
    };
    SearchView.prototype.toggleWholeWords = function () {
        this.searchWidget.searchInput.setWholeWords(!this.searchWidget.searchInput.getWholeWords());
        this.onQueryChanged(true);
    };
    SearchView.prototype.toggleRegex = function () {
        this.searchWidget.searchInput.setRegex(!this.searchWidget.searchInput.getRegex());
        this.onQueryChanged(true);
    };
    SearchView.prototype.toggleQueryDetails = function (moveFocus, show, skipLayout, reverse) {
        if (moveFocus === void 0) { moveFocus = true; }
        var cls = 'more';
        show = typeof show === 'undefined' ? !dom.hasClass(this.queryDetails, cls) : Boolean(show);
        this.viewletSettings['query.queryDetailsExpanded'] = show;
        skipLayout = Boolean(skipLayout);
        if (show) {
            this.toggleQueryDetailsButton.setAttribute('aria-expanded', 'true');
            dom.addClass(this.queryDetails, cls);
            if (moveFocus) {
                if (reverse) {
                    this.inputPatternExcludes.focus();
                    this.inputPatternExcludes.select();
                }
                else {
                    this.inputPatternIncludes.focus();
                    this.inputPatternIncludes.select();
                }
            }
        }
        else {
            this.toggleQueryDetailsButton.setAttribute('aria-expanded', 'false');
            dom.removeClass(this.queryDetails, cls);
            if (moveFocus) {
                this.searchWidget.focus();
            }
        }
        if (!skipLayout && this.size) {
            this.layout(this.size);
        }
    };
    SearchView.prototype.searchInFolders = function (resources, pathToRelative) {
        var _this = this;
        var folderPaths = [];
        var workspace = this.contextService.getWorkspace();
        if (resources) {
            resources.forEach(function (resource) {
                var folderPath;
                if (_this.contextService.getWorkbenchState() === 2 /* FOLDER */) {
                    // Show relative path from the root for single-root mode
                    folderPath = paths.normalize(pathToRelative(workspace.folders[0].uri.fsPath, resource.fsPath));
                    if (folderPath && folderPath !== '.') {
                        folderPath = './' + folderPath;
                    }
                }
                else {
                    var owningFolder = _this.contextService.getWorkspaceFolder(resource);
                    if (owningFolder) {
                        var owningRootName_1 = owningFolder.name;
                        // If this root is the only one with its basename, use a relative ./ path. If there is another, use an absolute path
                        var isUniqueFolder = workspace.folders.filter(function (folder) { return folder.name === owningRootName_1; }).length === 1;
                        if (isUniqueFolder) {
                            var relativePath = paths.normalize(pathToRelative(owningFolder.uri.fsPath, resource.fsPath));
                            if (relativePath === '.') {
                                folderPath = "./" + owningFolder.name;
                            }
                            else {
                                folderPath = "./" + owningFolder.name + "/" + relativePath;
                            }
                        }
                        else {
                            folderPath = resource.fsPath;
                        }
                    }
                }
                if (folderPath) {
                    folderPaths.push(folderPath);
                }
            });
        }
        if (!folderPaths.length || folderPaths.some(function (folderPath) { return folderPath === '.'; })) {
            this.inputPatternIncludes.setValue('');
            this.searchWidget.focus();
            return;
        }
        // Show 'files to include' box
        if (!this.showsFileTypes()) {
            this.toggleQueryDetails(true, true);
        }
        this.inputPatternIncludes.setValue(folderPaths.join(', '));
        this.searchWidget.focus(false);
    };
    SearchView.prototype.onQueryChanged = function (preserveFocus) {
        var _this = this;
        var isRegex = this.searchWidget.searchInput.getRegex();
        var isWholeWords = this.searchWidget.searchInput.getWholeWords();
        var isCaseSensitive = this.searchWidget.searchInput.getCaseSensitive();
        var contentPattern = this.searchWidget.searchInput.getValue();
        var excludePatternText = this.inputPatternExcludes.getValue().trim();
        var includePatternText = this.inputPatternIncludes.getValue().trim();
        var useExcludesAndIgnoreFiles = this.inputPatternExcludes.useExcludesAndIgnoreFiles();
        if (contentPattern.length === 0) {
            return;
        }
        // Validate regex is OK
        if (isRegex) {
            var regExp = void 0;
            try {
                regExp = new RegExp(contentPattern);
            }
            catch (e) {
                return; // malformed regex
            }
            if (strings.regExpLeadsToEndlessLoop(regExp)) {
                return; // endless regex
            }
        }
        var content = {
            pattern: contentPattern,
            isRegExp: isRegex,
            isCaseSensitive: isCaseSensitive,
            isWordMatch: isWholeWords,
            isSmartCase: this.configurationService.getValue().search.smartCase
        };
        var excludePattern = this.inputPatternExcludes.getValue();
        var includePattern = this.inputPatternIncludes.getValue();
        // Need the full match line to correctly calculate replace text, if this is a search/replace with regex group references ($1, $2, ...).
        // 10000 chars is enough to avoid sending huge amounts of text around, if you do a replace with a longer match, it may or may not resolve the group refs correctly.
        // https://github.com/Microsoft/vscode/issues/58374
        var charsPerLine = content.isRegExp ? 10000 :
            250;
        var options = {
            extraFileResources: getOutOfWorkspaceEditorResources(this.editorService, this.contextService),
            maxResults: SearchView.MAX_TEXT_RESULTS,
            disregardIgnoreFiles: !useExcludesAndIgnoreFiles,
            disregardExcludeSettings: !useExcludesAndIgnoreFiles,
            excludePattern: excludePattern,
            includePattern: includePattern,
            previewOptions: {
                matchLines: 1,
                charsPerLine: charsPerLine
            }
        };
        var folderResources = this.contextService.getWorkspace().folders;
        var onQueryValidationError = function (err) {
            _this.searchWidget.searchInput.showMessage({ content: err.message, type: 3 /* ERROR */ });
            _this.viewModel.searchResult.clear();
        };
        var query;
        try {
            query = this.queryBuilder.text(content, folderResources.map(function (folder) { return folder.uri; }), options);
        }
        catch (err) {
            onQueryValidationError(err);
            return;
        }
        this.validateQuery(query).then(function () {
            _this.onQueryTriggered(query, excludePatternText, includePatternText);
            if (!preserveFocus) {
                _this.searchWidget.focus(false); // focus back to input field
            }
        }, onQueryValidationError);
    };
    SearchView.prototype.validateQuery = function (query) {
        var _this = this;
        // Validate folderQueries
        var folderQueriesExistP = query.folderQueries.map(function (fq) {
            return _this.fileService.existsFile(fq.folder);
        });
        return TPromise.join(folderQueriesExistP).then(function (existResults) {
            // If no folders exist, show an error message about the first one
            var existingFolderQueries = query.folderQueries.filter(function (folderQuery, i) { return existResults[i]; });
            if (!query.folderQueries.length || existingFolderQueries.length) {
                query.folderQueries = existingFolderQueries;
            }
            else {
                var nonExistantPath = query.folderQueries[0].folder.fsPath;
                var searchPathNotFoundError = nls.localize('searchPathNotFoundError', "Search path not found: {0}", nonExistantPath);
                return TPromise.wrapError(new Error(searchPathNotFoundError));
            }
            return undefined;
        });
    };
    SearchView.prototype.onQueryTriggered = function (query, excludePatternText, includePatternText) {
        var _this = this;
        this.inputPatternExcludes.onSearchSubmit();
        this.inputPatternIncludes.onSearchSubmit();
        this.viewModel.cancelSearch();
        // Progress total is 100.0% for more progress bar granularity
        var progressTotal = 1000;
        var progressWorked = 0;
        var progressRunner = query.useRipgrep ?
            this.progressService.show(/*infinite=*/ true) :
            this.progressService.show(progressTotal);
        this.searchWidget.searchInput.clearMessage();
        this.searching = true;
        setTimeout(function () {
            if (_this.searching) {
                _this.changeActionAtPosition(0, _this.instantiationService.createInstance(CancelSearchAction, CancelSearchAction.ID, CancelSearchAction.LABEL));
            }
        }, 2000);
        this.showEmptyStage();
        var onComplete = function (completed) {
            _this.searching = false;
            _this.changeActionAtPosition(0, _this.instantiationService.createInstance(RefreshAction, RefreshAction.ID, RefreshAction.LABEL));
            // Complete up to 100% as needed
            if (completed && !query.useRipgrep) {
                progressRunner.worked(progressTotal - progressWorked);
                setTimeout(function () { return progressRunner.done(); }, 200);
            }
            else {
                progressRunner.done();
            }
            // Do final render, then expand if just 1 file with less than 50 matches
            _this.onSearchResultsChanged().then(function () {
                if (_this.viewModel.searchResult.count() === 1) {
                    var onlyMatch = _this.viewModel.searchResult.matches()[0];
                    if (onlyMatch.count() < 50) {
                        return _this.tree.expand(onlyMatch);
                    }
                }
                return null;
            });
            _this.viewModel.replaceString = _this.searchWidget.getReplaceValue();
            var hasResults = !_this.viewModel.searchResult.isEmpty();
            _this.searchSubmitted = true;
            _this.updateActions();
            if (completed && completed.limitHit) {
                _this.searchWidget.searchInput.showMessage({
                    content: nls.localize('searchMaxResultsWarning', "The result set only contains a subset of all matches. Please be more specific in your search to narrow down the results."),
                    type: 2 /* WARNING */
                });
            }
            if (!hasResults) {
                var hasExcludes = !!excludePatternText;
                var hasIncludes = !!includePatternText;
                var message = void 0;
                if (!completed) {
                    message = nls.localize('searchCanceled', "Search was canceled before any results could be found - ");
                }
                else if (hasIncludes && hasExcludes) {
                    message = nls.localize('noResultsIncludesExcludes', "No results found in '{0}' excluding '{1}' - ", includePatternText, excludePatternText);
                }
                else if (hasIncludes) {
                    message = nls.localize('noResultsIncludes', "No results found in '{0}' - ", includePatternText);
                }
                else if (hasExcludes) {
                    message = nls.localize('noResultsExcludes', "No results found excluding '{0}' - ", excludePatternText);
                }
                else {
                    message = nls.localize('noResultsFound', "No results found. Review your settings for configured exclusions and ignore files - ");
                }
                // Indicate as status to ARIA
                aria.status(message);
                _this.tree.onHidden();
                dom.hide(_this.resultsElement);
                var messageEl = _this.clearMessage();
                var p = dom.append(messageEl, $('p', undefined, message));
                if (!completed) {
                    var searchAgainLink = dom.append(p, $('a.pointer.prominent', undefined, nls.localize('rerunSearch.message', "Search again")));
                    _this.messageDisposables.push(dom.addDisposableListener(searchAgainLink, dom.EventType.CLICK, function (e) {
                        dom.EventHelper.stop(e, false);
                        _this.onQueryChanged();
                    }));
                }
                else if (hasIncludes || hasExcludes) {
                    var searchAgainLink = dom.append(p, $('a.pointer.prominent', { tabindex: 0 }, nls.localize('rerunSearchInAll.message', "Search again in all files")));
                    _this.messageDisposables.push(dom.addDisposableListener(searchAgainLink, dom.EventType.CLICK, function (e) {
                        dom.EventHelper.stop(e, false);
                        _this.inputPatternExcludes.setValue('');
                        _this.inputPatternIncludes.setValue('');
                        _this.onQueryChanged();
                    }));
                }
                else {
                    var openSettingsLink = dom.append(p, $('a.pointer.prominent', { tabindex: 0 }, nls.localize('openSettings.message', "Open Settings")));
                    _this.messageDisposables.push(dom.addDisposableListener(openSettingsLink, dom.EventType.CLICK, function (e) {
                        dom.EventHelper.stop(e, false);
                        var options = { query: '.exclude' };
                        _this.contextService.getWorkbenchState() !== 1 /* EMPTY */ ?
                            _this.preferencesService.openWorkspaceSettings(undefined, options) :
                            _this.preferencesService.openGlobalSettings(undefined, options);
                    }));
                }
                if (completed) {
                    dom.append(p, $('span', undefined, ' - '));
                    var learnMoreLink = dom.append(p, $('a.pointer.prominent', { tabindex: 0 }, nls.localize('openSettings.learnMore', "Learn More")));
                    _this.messageDisposables.push(dom.addDisposableListener(learnMoreLink, dom.EventType.CLICK, function (e) {
                        dom.EventHelper.stop(e, false);
                        window.open('https://go.microsoft.com/fwlink/?linkid=853977');
                    }));
                }
                if (_this.contextService.getWorkbenchState() === 1 /* EMPTY */) {
                    _this.showSearchWithoutFolderMessage();
                }
            }
            else {
                _this.viewModel.searchResult.toggleHighlights(_this.isVisible()); // show highlights
                // Indicate final search result count for ARIA
                aria.status(nls.localize('ariaSearchResultsStatus', "Search returned {0} results in {1} files", _this.viewModel.searchResult.count(), _this.viewModel.searchResult.fileCount()));
            }
        };
        var onError = function (e) {
            if (errors.isPromiseCanceledError(e)) {
                onComplete(null);
            }
            else {
                _this.searching = false;
                _this.changeActionAtPosition(0, _this.instantiationService.createInstance(RefreshAction, RefreshAction.ID, RefreshAction.LABEL));
                progressRunner.done();
                _this.searchWidget.searchInput.showMessage({ content: e.message, type: 3 /* ERROR */ });
                _this.viewModel.searchResult.clear();
            }
        };
        var total = 0;
        var worked = 0;
        var visibleMatches = 0;
        var onProgress = function (p) {
            // Progress
            if (p.total) {
                total = p.total;
            }
            if (p.worked) {
                worked = p.worked;
            }
        };
        // Handle UI updates in an interval to show frequent progress and results
        var uiRefreshHandle = setInterval(function () {
            if (!_this.searching) {
                window.clearInterval(uiRefreshHandle);
                return;
            }
            if (!query.useRipgrep) {
                // Progress bar update
                var fakeProgress = true;
                if (total > 0 && worked > 0) {
                    var ratio = Math.round((worked / total) * progressTotal);
                    if (ratio > progressWorked) { // never show less progress than what we have already
                        progressRunner.worked(ratio - progressWorked);
                        progressWorked = ratio;
                        fakeProgress = false;
                    }
                }
                // Fake progress up to 90%, or when actual progress beats it
                var fakeMax = 900;
                var fakeMultiplier = 12;
                if (fakeProgress && progressWorked < fakeMax) {
                    // Linearly decrease the rate of fake progress.
                    // 1 is the smallest allowed amount of progress.
                    var fakeAmt = Math.round((fakeMax - progressWorked) / fakeMax * fakeMultiplier) || 1;
                    progressWorked += fakeAmt;
                    progressRunner.worked(fakeAmt);
                }
            }
            // Search result tree update
            var fileCount = _this.viewModel.searchResult.fileCount();
            if (visibleMatches !== fileCount) {
                visibleMatches = fileCount;
                _this.tree.refresh();
                _this.updateSearchResultCount();
            }
            if (fileCount > 0) {
                _this.updateActions();
            }
        }, 100);
        this.searchWidget.setReplaceAllActionState(false);
        this.viewModel.search(query, onProgress).then(onComplete, onError);
    };
    SearchView.prototype.updateSearchResultCount = function () {
        var fileCount = this.viewModel.searchResult.fileCount();
        this.hasSearchResultsKey.set(fileCount > 0);
        var msgWasHidden = this.messagesElement.style.display === 'none';
        if (fileCount > 0) {
            var messageEl = this.clearMessage();
            dom.append(messageEl, $('p', undefined, this.buildResultCountMessage(this.viewModel.searchResult.count(), fileCount)));
            if (msgWasHidden) {
                this.reLayout();
            }
        }
        else if (!msgWasHidden) {
            dom.hide(this.messagesElement);
        }
    };
    SearchView.prototype.buildResultCountMessage = function (resultCount, fileCount) {
        if (resultCount === 1 && fileCount === 1) {
            return nls.localize('search.file.result', "{0} result in {1} file", resultCount, fileCount);
        }
        else if (resultCount === 1) {
            return nls.localize('search.files.result', "{0} result in {1} files", resultCount, fileCount);
        }
        else if (fileCount === 1) {
            return nls.localize('search.file.results', "{0} results in {1} file", resultCount, fileCount);
        }
        else {
            return nls.localize('search.files.results', "{0} results in {1} files", resultCount, fileCount);
        }
    };
    SearchView.prototype.showSearchWithoutFolderMessage = function () {
        var _this = this;
        this.searchWithoutFolderMessageElement = this.clearMessage();
        var textEl = dom.append(this.searchWithoutFolderMessageElement, $('p', undefined, nls.localize('searchWithoutFolder', "You have not yet opened a folder. Only open files are currently searched - ")));
        var openFolderLink = dom.append(textEl, $('a.pointer.prominent', { tabindex: 0 }, nls.localize('openFolder', "Open Folder")));
        this.messageDisposables.push(dom.addDisposableListener(openFolderLink, dom.EventType.CLICK, function (e) {
            dom.EventHelper.stop(e, false);
            var actionClass = env.isMacintosh ? OpenFileFolderAction : OpenFolderAction;
            var action = _this.instantiationService.createInstance(actionClass, actionClass.ID, actionClass.LABEL);
            _this.actionRunner.run(action).then(function () {
                action.dispose();
            }, function (err) {
                action.dispose();
                errors.onUnexpectedError(err);
            });
        }));
    };
    SearchView.prototype.showEmptyStage = function () {
        // disable 'result'-actions
        this.searchSubmitted = false;
        this.updateActions();
        // clean up ui
        // this.replaceService.disposeAllReplacePreviews();
        dom.hide(this.messagesElement);
        dom.show(this.resultsElement);
        this.tree.onVisible();
        this.currentSelectedFileMatch = null;
    };
    SearchView.prototype.onFocus = function (lineMatch, preserveFocus, sideBySide, pinned) {
        if (!(lineMatch instanceof Match)) {
            this.viewModel.searchResult.rangeHighlightDecorations.removeHighlightRange();
            return TPromise.as(true);
        }
        return (this.viewModel.isReplaceActive() && !!this.viewModel.replaceString) ?
            this.replaceService.openReplacePreview(lineMatch, preserveFocus, sideBySide, pinned) :
            this.open(lineMatch, preserveFocus, sideBySide, pinned);
    };
    SearchView.prototype.open = function (element, preserveFocus, sideBySide, pinned) {
        var _this = this;
        var selection = this.getSelectionFrom(element);
        var resource = element instanceof Match ? element.parent().resource() : element.resource();
        return this.editorService.openEditor({
            resource: resource,
            options: {
                preserveFocus: preserveFocus,
                pinned: pinned,
                selection: selection,
                revealIfVisible: true
            }
        }, sideBySide ? SIDE_GROUP : ACTIVE_GROUP).then(function (editor) {
            if (editor && element instanceof Match && preserveFocus) {
                _this.viewModel.searchResult.rangeHighlightDecorations.highlightRange(editor.getControl().getModel(), element.range());
            }
            else {
                _this.viewModel.searchResult.rangeHighlightDecorations.removeHighlightRange();
            }
            return _this.editorGroupsService.activateGroup(editor.group);
        }, errors.onUnexpectedError);
    };
    SearchView.prototype.getSelectionFrom = function (element) {
        var match = null;
        if (element instanceof Match) {
            match = element;
        }
        if (element instanceof FileMatch && element.count() > 0) {
            match = element.matches()[element.matches().length - 1];
        }
        if (match) {
            var range = match.range();
            if (this.viewModel.isReplaceActive() && !!this.viewModel.replaceString) {
                var replaceString = match.replaceString;
                return {
                    startLineNumber: range.startLineNumber,
                    startColumn: range.startColumn,
                    endLineNumber: range.startLineNumber,
                    endColumn: range.startColumn + replaceString.length
                };
            }
            return range;
        }
        return void 0;
    };
    SearchView.prototype.onUntitledDidChangeDirty = function (resource) {
        if (!this.viewModel) {
            return;
        }
        // remove search results from this resource as it got disposed
        if (!this.untitledEditorService.isDirty(resource)) {
            var matches = this.viewModel.searchResult.matches();
            for (var i = 0, len = matches.length; i < len; i++) {
                if (resource.toString() === matches[i].resource().toString()) {
                    this.viewModel.searchResult.remove(matches[i]);
                }
            }
        }
    };
    SearchView.prototype.onFilesChanged = function (e) {
        if (!this.viewModel) {
            return;
        }
        var matches = this.viewModel.searchResult.matches();
        for (var i = 0, len = matches.length; i < len; i++) {
            if (e.contains(matches[i].resource(), 2 /* DELETED */)) {
                this.viewModel.searchResult.remove(matches[i]);
            }
        }
    };
    SearchView.prototype.getActions = function () {
        return this.actions;
    };
    SearchView.prototype.changeActionAtPosition = function (index, newAction) {
        this.actions.splice(index, 1, newAction);
        this.updateTitleArea();
    };
    SearchView.prototype.clearHistory = function () {
        this.searchWidget.clearHistory();
        this.inputPatternExcludes.clearHistory();
        this.inputPatternIncludes.clearHistory();
    };
    SearchView.prototype.shutdown = function () {
        var isRegex = this.searchWidget.searchInput.getRegex();
        var isWholeWords = this.searchWidget.searchInput.getWholeWords();
        var isCaseSensitive = this.searchWidget.searchInput.getCaseSensitive();
        var contentPattern = this.searchWidget.searchInput.getValue();
        var patternExcludes = this.inputPatternExcludes.getValue().trim();
        var patternIncludes = this.inputPatternIncludes.getValue().trim();
        var useExcludesAndIgnoreFiles = this.inputPatternExcludes.useExcludesAndIgnoreFiles();
        // store memento
        this.viewletSettings['query.contentPattern'] = contentPattern;
        this.viewletSettings['query.regex'] = isRegex;
        this.viewletSettings['query.wholeWords'] = isWholeWords;
        this.viewletSettings['query.caseSensitive'] = isCaseSensitive;
        this.viewletSettings['query.folderExclusions'] = patternExcludes;
        this.viewletSettings['query.folderIncludes'] = patternIncludes;
        this.viewletSettings['query.useExcludesAndIgnoreFiles'] = useExcludesAndIgnoreFiles;
        var searchHistory = this.searchWidget.getSearchHistory();
        var replaceHistory = this.searchWidget.getReplaceHistory();
        var patternExcludesHistory = this.inputPatternExcludes.getHistory();
        var patternIncludesHistory = this.inputPatternIncludes.getHistory();
        this.searchHistoryService.save({
            search: searchHistory,
            replace: replaceHistory,
            exclude: patternExcludesHistory,
            include: patternIncludesHistory
        });
        _super.prototype.shutdown.call(this);
    };
    SearchView.prototype.dispose = function () {
        this.isDisposed = true;
        _super.prototype.dispose.call(this);
    };
    SearchView.MAX_TEXT_RESULTS = 10000;
    SearchView.SHOW_REPLACE_STORAGE_KEY = 'vs.search.show.replace';
    SearchView.WIDE_CLASS_NAME = 'wide';
    SearchView.WIDE_VIEW_SIZE = 600;
    SearchView = __decorate([
        __param(0, IPartService),
        __param(1, ITelemetryService),
        __param(2, IFileService),
        __param(3, IEditorService),
        __param(4, IProgressService),
        __param(5, INotificationService),
        __param(6, IDialogService),
        __param(7, IStorageService),
        __param(8, IContextViewService),
        __param(9, IInstantiationService),
        __param(10, IConfigurationService),
        __param(11, IWorkspaceContextService),
        __param(12, ISearchWorkbenchService),
        __param(13, IContextKeyService),
        __param(14, IReplaceService),
        __param(15, IUntitledEditorService),
        __param(16, IPreferencesService),
        __param(17, IThemeService),
        __param(18, ISearchHistoryService),
        __param(19, IEditorGroupsService)
    ], SearchView);
    return SearchView;
}(Viewlet));
export { SearchView };
registerThemingParticipant(function (theme, collector) {
    var matchHighlightColor = theme.getColor(editorFindMatchHighlight);
    if (matchHighlightColor) {
        collector.addRule(".monaco-workbench .search-view .findInFileMatch { background-color: " + matchHighlightColor + "; }");
    }
    var diffInsertedColor = theme.getColor(diffInserted);
    if (diffInsertedColor) {
        collector.addRule(".monaco-workbench .search-view .replaceMatch { background-color: " + diffInsertedColor + "; }");
    }
    var diffRemovedColor = theme.getColor(diffRemoved);
    if (diffRemovedColor) {
        collector.addRule(".monaco-workbench .search-view .replace.findInFileMatch { background-color: " + diffRemovedColor + "; }");
    }
    var diffInsertedOutlineColor = theme.getColor(diffInsertedOutline);
    if (diffInsertedOutlineColor) {
        collector.addRule(".monaco-workbench .search-view .replaceMatch:not(:empty) { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + diffInsertedOutlineColor + "; }");
    }
    var diffRemovedOutlineColor = theme.getColor(diffRemovedOutline);
    if (diffRemovedOutlineColor) {
        collector.addRule(".monaco-workbench .search-view .replace.findInFileMatch { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + diffRemovedOutlineColor + "; }");
    }
    var findMatchHighlightBorder = theme.getColor(editorFindMatchHighlightBorder);
    if (findMatchHighlightBorder) {
        collector.addRule(".monaco-workbench .search-view .findInFileMatch { border: 1px " + (theme.type === 'hc' ? 'dashed' : 'solid') + " " + findMatchHighlightBorder + "; }");
    }
    var outlineSelectionColor = theme.getColor(listActiveSelectionForeground);
    if (outlineSelectionColor) {
        collector.addRule(".monaco-workbench .search-view .monaco-tree.focused .monaco-tree-row.focused.selected:not(.highlighted) .action-label:focus { outline-color: " + outlineSelectionColor + " }");
    }
});
