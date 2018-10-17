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
import * as DOM from '../../../../base/browser/dom.js';
import { Sizing, SplitView } from '../../../../base/browser/ui/splitview/splitview.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import * as arrays from '../../../../base/common/arrays.js';
import { Delayer, ThrottledDelayer } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { getErrorMessage, isPromiseCanceledError, onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { ArrayNavigator } from '../../../../base/common/iterator.js';
import { Disposable, dispose } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { EditorExtensionsRegistry, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditorWidget.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/resourceConfiguration.js';
import { FindController } from '../../../../editor/contrib/find/findController.js';
import { FoldingController } from '../../../../editor/contrib/folding/folding.js';
import { MessageController } from '../../../../editor/contrib/message/messageController.js';
import { SelectionHighlighter } from '../../../../editor/contrib/multicursor/multicursor.js';
import * as nls from '../../../../nls.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { scrollbarShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { attachStylerCallback } from '../../../../platform/theme/common/styler.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { Extensions as EditorExtensions } from '../../../browser/editor.js';
import { BaseEditor } from '../../../browser/parts/editor/baseEditor.js';
import { BaseTextEditor } from '../../../browser/parts/editor/textEditor.js';
import { PREFERENCES_EDITOR_ID } from '../../files/common/files.js';
import { DefaultSettingsRenderer, FolderSettingsRenderer, UserSettingsRenderer, WorkspaceSettingsRenderer } from './preferencesRenderers.js';
import { SearchWidget, SettingsTargetsWidget } from './preferencesWidgets.js';
import { CONTEXT_SETTINGS_EDITOR, CONTEXT_SETTINGS_SEARCH_FOCUS, IPreferencesSearchService } from '../common/preferences.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { DefaultSettingsEditorModel, SettingsEditorModel } from '../../../services/preferences/common/preferencesModels.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IWindowService } from '../../../../platform/windows/common/windows.js';
var PreferencesEditor = /** @class */ (function (_super) {
    __extends(PreferencesEditor, _super);
    function PreferencesEditor(preferencesService, telemetryService, editorService, contextKeyService, instantiationService, themeService, progressService) {
        var _this = _super.call(this, PreferencesEditor.ID, telemetryService, themeService) || this;
        _this.preferencesService = preferencesService;
        _this.editorService = editorService;
        _this.contextKeyService = contextKeyService;
        _this.instantiationService = instantiationService;
        _this.progressService = progressService;
        _this.lastFocusedWidget = null;
        _this.minimumHeight = 260;
        _this._onDidCreateWidget = new Emitter();
        _this.onDidSizeConstraintsChange = _this._onDidCreateWidget.event;
        _this.defaultSettingsEditorContextKey = CONTEXT_SETTINGS_EDITOR.bindTo(_this.contextKeyService);
        _this.searchFocusContextKey = CONTEXT_SETTINGS_SEARCH_FOCUS.bindTo(_this.contextKeyService);
        _this.delayedFilterLogging = new Delayer(1000);
        _this.localSearchDelayer = new Delayer(100);
        _this.remoteSearchThrottle = new ThrottledDelayer(200);
        return _this;
    }
    Object.defineProperty(PreferencesEditor.prototype, "minimumWidth", {
        get: function () { return this.sideBySidePreferencesWidget ? this.sideBySidePreferencesWidget.minimumWidth : 0; },
        // these setters need to exist because this extends from BaseEditor
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreferencesEditor.prototype, "maximumWidth", {
        get: function () { return this.sideBySidePreferencesWidget ? this.sideBySidePreferencesWidget.maximumWidth : Number.POSITIVE_INFINITY; },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    PreferencesEditor.prototype.createEditor = function (parent) {
        var _this = this;
        DOM.addClass(parent, 'preferences-editor');
        this.headerContainer = DOM.append(parent, DOM.$('.preferences-header'));
        this.searchWidget = this._register(this.instantiationService.createInstance(SearchWidget, this.headerContainer, {
            ariaLabel: nls.localize('SearchSettingsWidget.AriaLabel', "Search settings"),
            placeholder: nls.localize('SearchSettingsWidget.Placeholder', "Search Settings"),
            focusKey: this.searchFocusContextKey,
            showResultCount: true,
            ariaLive: 'assertive'
        }));
        this._register(this.searchWidget.onDidChange(function (value) { return _this.onInputChanged(); }));
        this._register(this.searchWidget.onFocus(function () { return _this.lastFocusedWidget = _this.searchWidget; }));
        this.lastFocusedWidget = this.searchWidget;
        var editorsContainer = DOM.append(parent, DOM.$('.preferences-editors-container'));
        this.sideBySidePreferencesWidget = this._register(this.instantiationService.createInstance(SideBySidePreferencesWidget, editorsContainer));
        this._onDidCreateWidget.fire();
        this._register(this.sideBySidePreferencesWidget.onFocus(function () { return _this.lastFocusedWidget = _this.sideBySidePreferencesWidget; }));
        this._register(this.sideBySidePreferencesWidget.onDidSettingsTargetChange(function (target) { return _this.switchSettings(target); }));
        this.preferencesRenderers = this._register(this.instantiationService.createInstance(PreferencesRenderersController));
        this._register(this.preferencesRenderers.onDidFilterResultsCountChange(function (count) { return _this.showSearchResultsMessage(count); }));
    };
    PreferencesEditor.prototype.clearSearchResults = function () {
        if (this.searchWidget) {
            this.searchWidget.clear();
        }
    };
    PreferencesEditor.prototype.focusNextResult = function () {
        if (this.preferencesRenderers) {
            this.preferencesRenderers.focusNextPreference(true);
        }
    };
    PreferencesEditor.prototype.focusPreviousResult = function () {
        if (this.preferencesRenderers) {
            this.preferencesRenderers.focusNextPreference(false);
        }
    };
    PreferencesEditor.prototype.editFocusedPreference = function () {
        this.preferencesRenderers.editFocusedPreference();
    };
    PreferencesEditor.prototype.setInput = function (newInput, options, token) {
        var _this = this;
        this.defaultSettingsEditorContextKey.set(true);
        if (options && options.query) {
            this.focusSearch(options.query);
        }
        return _super.prototype.setInput.call(this, newInput, options, token).then(function () { return _this.updateInput(newInput, options, token); });
    };
    PreferencesEditor.prototype.layout = function (dimension) {
        this.searchWidget.layout(dimension);
        var headerHeight = DOM.getTotalHeight(this.headerContainer);
        this.sideBySidePreferencesWidget.layout(new DOM.Dimension(dimension.width, dimension.height - headerHeight));
    };
    PreferencesEditor.prototype.getControl = function () {
        return this.sideBySidePreferencesWidget.getControl();
    };
    PreferencesEditor.prototype.focus = function () {
        if (this.lastFocusedWidget) {
            this.lastFocusedWidget.focus();
        }
    };
    PreferencesEditor.prototype.focusSearch = function (filter) {
        if (filter) {
            this.searchWidget.setValue(filter);
        }
        this.searchWidget.focus();
    };
    PreferencesEditor.prototype.focusSettingsFileEditor = function () {
        if (this.sideBySidePreferencesWidget) {
            this.sideBySidePreferencesWidget.focus();
        }
    };
    PreferencesEditor.prototype.clearInput = function () {
        this.defaultSettingsEditorContextKey.set(false);
        this.sideBySidePreferencesWidget.clearInput();
        this.preferencesRenderers.onHidden();
        _super.prototype.clearInput.call(this);
    };
    PreferencesEditor.prototype.setEditorVisible = function (visible, group) {
        this.sideBySidePreferencesWidget.setEditorVisible(visible, group);
        _super.prototype.setEditorVisible.call(this, visible, group);
    };
    PreferencesEditor.prototype.updateInput = function (newInput, options, token) {
        var _this = this;
        return this.sideBySidePreferencesWidget.setInput(newInput.details, newInput.master, options, token).then(function (_a) {
            var defaultPreferencesRenderer = _a.defaultPreferencesRenderer, editablePreferencesRenderer = _a.editablePreferencesRenderer;
            if (token.isCancellationRequested) {
                return void 0;
            }
            _this.preferencesRenderers.defaultPreferencesRenderer = defaultPreferencesRenderer;
            _this.preferencesRenderers.editablePreferencesRenderer = editablePreferencesRenderer;
            _this.onInputChanged();
        });
    };
    PreferencesEditor.prototype.onInputChanged = function () {
        var _this = this;
        var query = this.searchWidget.getValue().trim();
        this.delayedFilterLogging.cancel();
        this.triggerSearch(query)
            .then(function () {
            var result = _this.preferencesRenderers.lastFilterResult;
            if (result) {
                _this.delayedFilterLogging.trigger(function () { return _this.reportFilteringUsed(query, _this.preferencesRenderers.lastFilterResult); });
            }
        });
    };
    PreferencesEditor.prototype.triggerSearch = function (query) {
        var _this = this;
        if (query) {
            return TPromise.join([
                this.localSearchDelayer.trigger(function () { return _this.preferencesRenderers.localFilterPreferences(query).then(function () { }); }),
                this.remoteSearchThrottle.trigger(function () { return TPromise.wrap(_this.progressService.showWhile(_this.preferencesRenderers.remoteSearchPreferences(query), 500)); })
            ]);
        }
        else {
            // When clearing the input, update immediately to clear it
            this.localSearchDelayer.cancel();
            this.preferencesRenderers.localFilterPreferences(query);
            this.remoteSearchThrottle.cancel();
            return this.preferencesRenderers.remoteSearchPreferences(query);
        }
    };
    PreferencesEditor.prototype.switchSettings = function (target) {
        var _this = this;
        // Focus the editor if this editor is not active editor
        if (this.editorService.activeControl !== this) {
            this.focus();
        }
        var promise = this.input && this.input.isDirty() ? this.input.save() : TPromise.as(true);
        promise.then(function (value) {
            if (target === 1 /* USER */) {
                _this.preferencesService.switchSettings(1 /* USER */, _this.preferencesService.userSettingsResource, true);
            }
            else if (target === 2 /* WORKSPACE */) {
                _this.preferencesService.switchSettings(2 /* WORKSPACE */, _this.preferencesService.workspaceSettingsResource, true);
            }
            else if (target instanceof URI) {
                _this.preferencesService.switchSettings(3 /* WORKSPACE_FOLDER */, target, true);
            }
        });
    };
    PreferencesEditor.prototype.showSearchResultsMessage = function (count) {
        var countValue = count.count;
        if (count.target) {
            this.sideBySidePreferencesWidget.setResultCount(count.target, count.count);
        }
        else if (this.searchWidget.getValue()) {
            if (countValue === 0) {
                this.searchWidget.showMessage(nls.localize('noSettingsFound', "No Results"), countValue);
            }
            else if (countValue === 1) {
                this.searchWidget.showMessage(nls.localize('oneSettingFound', "1 Setting Found"), countValue);
            }
            else {
                this.searchWidget.showMessage(nls.localize('settingsFound', "{0} Settings Found", countValue), countValue);
            }
        }
        else {
            this.searchWidget.showMessage(nls.localize('totalSettingsMessage', "Total {0} Settings", countValue), countValue);
        }
    };
    PreferencesEditor.prototype._countById = function (settingsGroups) {
        var result = {};
        for (var _i = 0, settingsGroups_1 = settingsGroups; _i < settingsGroups_1.length; _i++) {
            var group = settingsGroups_1[_i];
            var i = 0;
            for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                var section = _b[_a];
                i += section.settings.length;
            }
            result[group.id] = i;
        }
        return result;
    };
    PreferencesEditor.prototype.reportFilteringUsed = function (filter, filterResult) {
        if (filter && filter !== this._lastReportedFilter) {
            var metadata_1 = filterResult && filterResult.metadata;
            var counts = filterResult && this._countById(filterResult.filteredGroups);
            var durations_1;
            if (metadata_1) {
                durations_1 = Object.create(null);
                Object.keys(metadata_1).forEach(function (key) { return durations_1[key] = metadata_1[key].duration; });
            }
            var data = {
                filter: filter,
                durations: durations_1,
                counts: counts,
                requestCount: metadata_1 && metadata_1['nlpResult'] && metadata_1['nlpResult'].requestCount
            };
            /* __GDPR__
                "defaultSettings.filter" : {
                    "filter": { "classification": "CustomerContent", "purpose": "FeatureInsight" },
                    "durations.nlpresult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "counts.nlpresult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "durations.filterresult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "counts.filterresult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "requestCount" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
                }
            */
            this.telemetryService.publicLog('defaultSettings.filter', data);
            this._lastReportedFilter = filter;
        }
    };
    PreferencesEditor.prototype.dispose = function () {
        this._onDidCreateWidget.dispose();
        _super.prototype.dispose.call(this);
    };
    PreferencesEditor.ID = PREFERENCES_EDITOR_ID;
    PreferencesEditor = __decorate([
        __param(0, IPreferencesService),
        __param(1, ITelemetryService),
        __param(2, IEditorService),
        __param(3, IContextKeyService),
        __param(4, IInstantiationService),
        __param(5, IThemeService),
        __param(6, IProgressService)
    ], PreferencesEditor);
    return PreferencesEditor;
}(BaseEditor));
export { PreferencesEditor };
var SettingsNavigator = /** @class */ (function (_super) {
    __extends(SettingsNavigator, _super);
    function SettingsNavigator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SettingsNavigator.prototype.next = function () {
        return _super.prototype.next.call(this) || _super.prototype.first.call(this);
    };
    SettingsNavigator.prototype.previous = function () {
        return _super.prototype.previous.call(this) || _super.prototype.last.call(this);
    };
    SettingsNavigator.prototype.reset = function () {
        this.index = this.start - 1;
    };
    return SettingsNavigator;
}(ArrayNavigator));
var PreferencesRenderersController = /** @class */ (function (_super) {
    __extends(PreferencesRenderersController, _super);
    function PreferencesRenderersController(preferencesSearchService, telemetryService, preferencesService, workspaceContextService, logService) {
        var _this = _super.call(this) || this;
        _this.preferencesSearchService = preferencesSearchService;
        _this.telemetryService = telemetryService;
        _this.preferencesService = preferencesService;
        _this.workspaceContextService = workspaceContextService;
        _this.logService = logService;
        _this._defaultPreferencesRendererDisposables = [];
        _this._editablePreferencesRendererDisposables = [];
        _this._prefsModelsForSearch = new Map();
        _this._onDidFilterResultsCountChange = _this._register(new Emitter());
        _this.onDidFilterResultsCountChange = _this._onDidFilterResultsCountChange.event;
        return _this;
    }
    Object.defineProperty(PreferencesRenderersController.prototype, "lastFilterResult", {
        get: function () {
            return this._lastFilterResult;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreferencesRenderersController.prototype, "defaultPreferencesRenderer", {
        get: function () {
            return this._defaultPreferencesRenderer;
        },
        set: function (defaultPreferencesRenderer) {
            var _this = this;
            if (this._defaultPreferencesRenderer !== defaultPreferencesRenderer) {
                this._defaultPreferencesRenderer = defaultPreferencesRenderer;
                this._defaultPreferencesRendererDisposables = dispose(this._defaultPreferencesRendererDisposables);
                if (this._defaultPreferencesRenderer) {
                    this._defaultPreferencesRenderer.onUpdatePreference(function (_a) {
                        var key = _a.key, value = _a.value, source = _a.source;
                        _this._editablePreferencesRenderer.updatePreference(key, value, source);
                        _this._updatePreference(key, value, source);
                    }, this, this._defaultPreferencesRendererDisposables);
                    this._defaultPreferencesRenderer.onFocusPreference(function (preference) { return _this._focusPreference(preference, _this._editablePreferencesRenderer); }, this, this._defaultPreferencesRendererDisposables);
                    this._defaultPreferencesRenderer.onClearFocusPreference(function (preference) { return _this._clearFocus(preference, _this._editablePreferencesRenderer); }, this, this._defaultPreferencesRendererDisposables);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreferencesRenderersController.prototype, "editablePreferencesRenderer", {
        get: function () {
            return this._editablePreferencesRenderer;
        },
        set: function (editableSettingsRenderer) {
            var _this = this;
            if (this._editablePreferencesRenderer !== editableSettingsRenderer) {
                this._editablePreferencesRenderer = editableSettingsRenderer;
                this._editablePreferencesRendererDisposables = dispose(this._editablePreferencesRendererDisposables);
                if (this._editablePreferencesRenderer) {
                    this._editablePreferencesRenderer.preferencesModel
                        .onDidChangeGroups(this._onEditableContentDidChange, this, this._editablePreferencesRendererDisposables);
                    this._editablePreferencesRenderer.onUpdatePreference(function (_a) {
                        var key = _a.key, value = _a.value, source = _a.source;
                        return _this._updatePreference(key, value, source, true);
                    }, this, this._defaultPreferencesRendererDisposables);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    PreferencesRenderersController.prototype._onEditableContentDidChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var foundExactMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localFilterPreferences(this._lastQuery, true)];
                    case 1:
                        foundExactMatch = _a.sent();
                        if (!!foundExactMatch) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.remoteSearchPreferences(this._lastQuery, true)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PreferencesRenderersController.prototype.onHidden = function () {
        this._prefsModelsForSearch.forEach(function (model) { return model.dispose(); });
        this._prefsModelsForSearch = new Map();
    };
    PreferencesRenderersController.prototype.remoteSearchPreferences = function (query, updateCurrentResults) {
        var _this = this;
        if (this.lastFilterResult && this.lastFilterResult.exactMatch) {
            // Skip and clear remote search
            query = '';
        }
        if (this._remoteFilterCancelToken) {
            this._remoteFilterCancelToken.cancel();
            this._remoteFilterCancelToken.dispose();
            this._remoteFilterCancelToken = null;
        }
        this._currentRemoteSearchProvider = (updateCurrentResults && this._currentRemoteSearchProvider) || this.preferencesSearchService.getRemoteSearchProvider(query);
        this._remoteFilterCancelToken = new CancellationTokenSource();
        return this.filterOrSearchPreferences(query, this._currentRemoteSearchProvider, 'nlpResult', nls.localize('nlpResult', "Natural Language Results"), 1, this._remoteFilterCancelToken.token, updateCurrentResults).then(function () {
            if (_this._remoteFilterCancelToken) {
                _this._remoteFilterCancelToken.dispose();
                _this._remoteFilterCancelToken = null;
            }
        }, function (err) {
            if (isPromiseCanceledError(err)) {
                return null;
            }
            else {
                onUnexpectedError(err);
            }
        });
    };
    PreferencesRenderersController.prototype.localFilterPreferences = function (query, updateCurrentResults) {
        if (this._settingsNavigator) {
            this._settingsNavigator.reset();
        }
        this._currentLocalSearchProvider = (updateCurrentResults && this._currentLocalSearchProvider) || this.preferencesSearchService.getLocalSearchProvider(query);
        return this.filterOrSearchPreferences(query, this._currentLocalSearchProvider, 'filterResult', nls.localize('filterResult', "Filtered Results"), 0, undefined, updateCurrentResults);
    };
    PreferencesRenderersController.prototype.filterOrSearchPreferences = function (query, searchProvider, groupId, groupLabel, groupOrder, token, editableContentOnly) {
        var _this = this;
        this._lastQuery = query;
        var filterPs = [this._filterOrSearchPreferences(query, this.editablePreferencesRenderer, searchProvider, groupId, groupLabel, groupOrder, token)];
        if (!editableContentOnly) {
            filterPs.push(this._filterOrSearchPreferences(query, this.defaultPreferencesRenderer, searchProvider, groupId, groupLabel, groupOrder, token));
            filterPs.push(this.searchAllSettingsTargets(query, searchProvider, groupId, groupLabel, groupOrder, token).then(function () { return null; }));
        }
        return TPromise.join(filterPs).then(function (results) {
            var editableFilterResult = results[0], defaultFilterResult = results[1];
            if (!defaultFilterResult && editableContentOnly) {
                defaultFilterResult = _this.lastFilterResult;
            }
            _this.consolidateAndUpdate(defaultFilterResult, editableFilterResult);
            _this._lastFilterResult = defaultFilterResult;
            return defaultFilterResult && defaultFilterResult.exactMatch;
        });
    };
    PreferencesRenderersController.prototype.searchAllSettingsTargets = function (query, searchProvider, groupId, groupLabel, groupOrder, token) {
        var searchPs = [
            this.searchSettingsTarget(query, searchProvider, 2 /* WORKSPACE */, groupId, groupLabel, groupOrder, token),
            this.searchSettingsTarget(query, searchProvider, 1 /* USER */, groupId, groupLabel, groupOrder, token)
        ];
        for (var _i = 0, _a = this.workspaceContextService.getWorkspace().folders; _i < _a.length; _i++) {
            var folder = _a[_i];
            var folderSettingsResource = this.preferencesService.getFolderSettingsResource(folder.uri);
            searchPs.push(this.searchSettingsTarget(query, searchProvider, folderSettingsResource, groupId, groupLabel, groupOrder, token));
        }
        return TPromise.join(searchPs).then(function () { });
    };
    PreferencesRenderersController.prototype.searchSettingsTarget = function (query, provider, target, groupId, groupLabel, groupOrder, token) {
        var _this = this;
        if (!query) {
            // Don't open the other settings targets when query is empty
            this._onDidFilterResultsCountChange.fire({ target: target, count: 0 });
            return Promise.resolve(null);
        }
        return this.getPreferencesEditorModel(target).then(function (model) {
            return model && _this._filterOrSearchPreferencesModel('', model, provider, groupId, groupLabel, groupOrder, token);
        }).then(function (result) {
            var count = result ? _this._flatten(result.filteredGroups).length : 0;
            _this._onDidFilterResultsCountChange.fire({ target: target, count: count });
        }, function (err) {
            if (!isPromiseCanceledError(err)) {
                return TPromise.wrapError(err);
            }
            return null;
        });
    };
    PreferencesRenderersController.prototype.getPreferencesEditorModel = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var resource, targetKey, model, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        resource = target === 1 /* USER */ ? this.preferencesService.userSettingsResource :
                            target === 2 /* WORKSPACE */ ? this.preferencesService.workspaceSettingsResource :
                                target;
                        if (!resource) {
                            return [2 /*return*/, null];
                        }
                        targetKey = resource.toString();
                        if (!!this._prefsModelsForSearch.has(targetKey)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this._register;
                        return [4 /*yield*/, this.preferencesService.createPreferencesEditorModel(resource)];
                    case 2:
                        model = _a.apply(this, [_b.sent()]);
                        this._prefsModelsForSearch.set(targetKey, model);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        // Will throw when the settings file doesn't exist.
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/, this._prefsModelsForSearch.get(targetKey)];
                }
            });
        });
    };
    PreferencesRenderersController.prototype.focusNextPreference = function (forward) {
        if (forward === void 0) { forward = true; }
        if (!this._settingsNavigator) {
            return;
        }
        var setting = forward ? this._settingsNavigator.next() : this._settingsNavigator.previous();
        this._focusPreference(setting, this._defaultPreferencesRenderer);
        this._focusPreference(setting, this._editablePreferencesRenderer);
    };
    PreferencesRenderersController.prototype.editFocusedPreference = function () {
        if (!this._settingsNavigator || !this._settingsNavigator.current()) {
            return;
        }
        var setting = this._settingsNavigator.current();
        var shownInEditableRenderer = this._editablePreferencesRenderer.editPreference(setting);
        if (!shownInEditableRenderer) {
            this.defaultPreferencesRenderer.editPreference(setting);
        }
    };
    PreferencesRenderersController.prototype._filterOrSearchPreferences = function (filter, preferencesRenderer, provider, groupId, groupLabel, groupOrder, token) {
        if (!preferencesRenderer) {
            return TPromise.wrap(null);
        }
        var model = preferencesRenderer.preferencesModel;
        return this._filterOrSearchPreferencesModel(filter, model, provider, groupId, groupLabel, groupOrder, token).then(function (filterResult) {
            preferencesRenderer.filterPreferences(filterResult);
            return filterResult;
        });
    };
    PreferencesRenderersController.prototype._filterOrSearchPreferencesModel = function (filter, model, provider, groupId, groupLabel, groupOrder, token) {
        var _this = this;
        var searchP = provider ? provider.searchModel(model, token) : TPromise.wrap(null);
        return searchP
            .then(null, function (err) {
            if (isPromiseCanceledError(err)) {
                return TPromise.wrapError(err);
            }
            else {
                /* __GDPR__
                    "defaultSettings.searchError" : {
                        "message": { "classification": "CallstackOrException", "purpose": "FeatureInsight" },
                        "filter": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                var message = getErrorMessage(err).trim();
                if (message && message !== 'Error') {
                    // "Error" = any generic network error
                    _this.telemetryService.publicLog('defaultSettings.searchError', { message: message, filter: filter });
                    _this.logService.info('Setting search error: ' + message);
                }
                return null;
            }
        })
            .then(function (searchResult) {
            if (token && token.isCancellationRequested) {
                searchResult = null;
            }
            var filterResult = searchResult ?
                model.updateResultGroup(groupId, {
                    id: groupId,
                    label: groupLabel,
                    result: searchResult,
                    order: groupOrder
                }) :
                model.updateResultGroup(groupId, null);
            if (filterResult) {
                filterResult.query = filter;
                filterResult.exactMatch = searchResult && searchResult.exactMatch;
            }
            return filterResult;
        });
    };
    PreferencesRenderersController.prototype.consolidateAndUpdate = function (defaultFilterResult, editableFilterResult) {
        var defaultPreferencesFilteredGroups = defaultFilterResult ? defaultFilterResult.filteredGroups : this._getAllPreferences(this._defaultPreferencesRenderer);
        var editablePreferencesFilteredGroups = editableFilterResult ? editableFilterResult.filteredGroups : this._getAllPreferences(this._editablePreferencesRenderer);
        var consolidatedSettings = this._consolidateSettings(editablePreferencesFilteredGroups, defaultPreferencesFilteredGroups);
        // Maintain the current navigation position when updating SettingsNavigator
        var current = this._settingsNavigator && this._settingsNavigator.current();
        var navigatorSettings = this._lastQuery ? consolidatedSettings : [];
        var currentIndex = current ?
            arrays.firstIndex(navigatorSettings, function (s) { return s.key === current.key; }) :
            -1;
        this._settingsNavigator = new SettingsNavigator(navigatorSettings, Math.max(currentIndex, 0));
        if (currentIndex >= 0) {
            this._settingsNavigator.next();
            var newCurrent = this._settingsNavigator.current();
            this._focusPreference(newCurrent, this._defaultPreferencesRenderer);
            this._focusPreference(newCurrent, this._editablePreferencesRenderer);
        }
        var totalCount = consolidatedSettings.length;
        this._onDidFilterResultsCountChange.fire({ count: totalCount });
    };
    PreferencesRenderersController.prototype._getAllPreferences = function (preferencesRenderer) {
        return preferencesRenderer ? preferencesRenderer.preferencesModel.settingsGroups : [];
    };
    PreferencesRenderersController.prototype._focusPreference = function (preference, preferencesRenderer) {
        if (preference && preferencesRenderer) {
            preferencesRenderer.focusPreference(preference);
        }
    };
    PreferencesRenderersController.prototype._clearFocus = function (preference, preferencesRenderer) {
        if (preference && preferencesRenderer) {
            preferencesRenderer.clearFocus(preference);
        }
    };
    PreferencesRenderersController.prototype._updatePreference = function (key, value, source, fromEditableSettings) {
        var data = {
            userConfigurationKeys: [key]
        };
        if (this.lastFilterResult) {
            data['query'] = this.lastFilterResult.query;
            data['editableSide'] = !!fromEditableSettings;
            var nlpMetadata_1 = this.lastFilterResult.metadata && this.lastFilterResult.metadata['nlpResult'];
            if (nlpMetadata_1) {
                var sortedKeys = Object.keys(nlpMetadata_1.scoredResults).sort(function (a, b) { return nlpMetadata_1.scoredResults[b].score - nlpMetadata_1.scoredResults[a].score; });
                var suffix_1 = '##' + key;
                data['nlpIndex'] = arrays.firstIndex(sortedKeys, function (key) { return strings.endsWith(key, suffix_1); });
            }
            var settingLocation = this._findSetting(this.lastFilterResult, key);
            if (settingLocation) {
                data['groupId'] = this.lastFilterResult.filteredGroups[settingLocation.groupIdx].id;
                data['displayIdx'] = settingLocation.overallSettingIdx;
            }
        }
        /* __GDPR__
            "defaultSettingsActions.copySetting" : {
                "userConfigurationKeys" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "query" : { "classification": "CustomerContent", "purpose": "FeatureInsight" },
                "nlpIndex" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "groupId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "displayIdx" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "editableSide" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            }
        */
        this.telemetryService.publicLog('defaultSettingsActions.copySetting', data);
    };
    PreferencesRenderersController.prototype._findSetting = function (filterResult, key) {
        var overallSettingIdx = 0;
        for (var groupIdx = 0; groupIdx < filterResult.filteredGroups.length; groupIdx++) {
            var group = filterResult.filteredGroups[groupIdx];
            for (var settingIdx = 0; settingIdx < group.sections[0].settings.length; settingIdx++) {
                var setting = group.sections[0].settings[settingIdx];
                if (key === setting.key) {
                    return { groupIdx: groupIdx, settingIdx: settingIdx, overallSettingIdx: overallSettingIdx };
                }
                overallSettingIdx++;
            }
        }
        return null;
    };
    PreferencesRenderersController.prototype._consolidateSettings = function (editableSettingsGroups, defaultSettingsGroups) {
        var defaultSettings = this._flatten(defaultSettingsGroups);
        var editableSettings = this._flatten(editableSettingsGroups).filter(function (secondarySetting) { return defaultSettings.every(function (primarySetting) { return primarySetting.key !== secondarySetting.key; }); });
        return defaultSettings.concat(editableSettings);
    };
    PreferencesRenderersController.prototype._flatten = function (settingsGroups) {
        var settings = [];
        for (var _i = 0, settingsGroups_2 = settingsGroups; _i < settingsGroups_2.length; _i++) {
            var group = settingsGroups_2[_i];
            for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                var section = _b[_a];
                settings.push.apply(settings, section.settings);
            }
        }
        return settings;
    };
    PreferencesRenderersController.prototype.dispose = function () {
        dispose(this._defaultPreferencesRendererDisposables);
        dispose(this._editablePreferencesRendererDisposables);
        _super.prototype.dispose.call(this);
    };
    PreferencesRenderersController = __decorate([
        __param(0, IPreferencesSearchService),
        __param(1, ITelemetryService),
        __param(2, IPreferencesService),
        __param(3, IWorkspaceContextService),
        __param(4, ILogService)
    ], PreferencesRenderersController);
    return PreferencesRenderersController;
}(Disposable));
var SideBySidePreferencesWidget = /** @class */ (function (_super) {
    __extends(SideBySidePreferencesWidget, _super);
    function SideBySidePreferencesWidget(parentElement, instantiationService, themeService, workspaceContextService, preferencesService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.themeService = themeService;
        _this.workspaceContextService = workspaceContextService;
        _this.preferencesService = preferencesService;
        _this.dimension = new DOM.Dimension(0, 0);
        _this._onFocus = new Emitter();
        _this.onFocus = _this._onFocus.event;
        _this._onDidSettingsTargetChange = new Emitter();
        _this.onDidSettingsTargetChange = _this._onDidSettingsTargetChange.event;
        DOM.addClass(parentElement, 'side-by-side-preferences-editor');
        _this.splitview = new SplitView(parentElement, { orientation: 1 /* HORIZONTAL */ });
        _this._register(_this.splitview);
        _this._register(_this.splitview.onDidSashReset(function () { return _this.splitview.distributeViewSizes(); }));
        _this.defaultPreferencesEditorContainer = DOM.$('.default-preferences-editor-container');
        var defaultPreferencesHeaderContainer = DOM.append(_this.defaultPreferencesEditorContainer, DOM.$('.preferences-header-container'));
        _this.defaultPreferencesHeader = DOM.append(defaultPreferencesHeaderContainer, DOM.$('div.default-preferences-header'));
        _this.defaultPreferencesHeader.textContent = nls.localize('defaultSettings', "Default Settings");
        _this.defaultPreferencesEditor = _this._register(_this.instantiationService.createInstance(DefaultPreferencesEditor));
        _this.defaultPreferencesEditor.create(_this.defaultPreferencesEditorContainer);
        _this.defaultPreferencesEditor.getControl().onDidFocusEditorWidget(function () { return _this.lastFocusedEditor = _this.defaultPreferencesEditor; });
        _this.splitview.addView({
            element: _this.defaultPreferencesEditorContainer,
            layout: function (size) { return _this.defaultPreferencesEditor.layout(new DOM.Dimension(size, _this.dimension.height - 34 /* height of header container */)); },
            minimumSize: 220,
            maximumSize: Number.POSITIVE_INFINITY,
            onDidChange: Event.None
        }, Sizing.Distribute);
        _this.editablePreferencesEditorContainer = DOM.$('.editable-preferences-editor-container');
        var editablePreferencesHeaderContainer = DOM.append(_this.editablePreferencesEditorContainer, DOM.$('.preferences-header-container'));
        _this.settingsTargetsWidget = _this._register(_this.instantiationService.createInstance(SettingsTargetsWidget, editablePreferencesHeaderContainer));
        _this._register(_this.settingsTargetsWidget.onDidTargetChange(function (target) { return _this._onDidSettingsTargetChange.fire(target); }));
        _this._register(attachStylerCallback(_this.themeService, { scrollbarShadow: scrollbarShadow }, function (colors) {
            var shadow = colors.scrollbarShadow ? colors.scrollbarShadow.toString() : null;
            if (shadow) {
                _this.editablePreferencesEditorContainer.style.boxShadow = "-6px 0 5px -5px " + shadow;
            }
            else {
                _this.editablePreferencesEditorContainer.style.boxShadow = null;
            }
        }));
        _this.splitview.addView({
            element: _this.editablePreferencesEditorContainer,
            layout: function (size) { return _this.editablePreferencesEditor && _this.editablePreferencesEditor.layout(new DOM.Dimension(size, _this.dimension.height - 34 /* height of header container */)); },
            minimumSize: 220,
            maximumSize: Number.POSITIVE_INFINITY,
            onDidChange: Event.None
        }, Sizing.Distribute);
        var focusTracker = _this._register(DOM.trackFocus(parentElement));
        _this._register(focusTracker.onDidFocus(function () { return _this._onFocus.fire(); }));
        return _this;
    }
    Object.defineProperty(SideBySidePreferencesWidget.prototype, "minimumWidth", {
        get: function () { return this.splitview.minimumSize; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideBySidePreferencesWidget.prototype, "maximumWidth", {
        get: function () { return this.splitview.maximumSize; },
        enumerable: true,
        configurable: true
    });
    SideBySidePreferencesWidget.prototype.setInput = function (defaultPreferencesEditorInput, editablePreferencesEditorInput, options, token) {
        var _this = this;
        this.getOrCreateEditablePreferencesEditor(editablePreferencesEditorInput);
        this.settingsTargetsWidget.settingsTarget = this.getSettingsTarget(editablePreferencesEditorInput.getResource());
        return TPromise.join([
            this.updateInput(this.defaultPreferencesEditor, defaultPreferencesEditorInput, DefaultSettingsEditorContribution.ID, editablePreferencesEditorInput.getResource(), options, token),
            this.updateInput(this.editablePreferencesEditor, editablePreferencesEditorInput, SettingsEditorContribution.ID, defaultPreferencesEditorInput.getResource(), options, token)
        ])
            .then(function (_a) {
            var defaultPreferencesRenderer = _a[0], editablePreferencesRenderer = _a[1];
            if (token.isCancellationRequested) {
                return {};
            }
            _this.defaultPreferencesHeader.textContent = defaultPreferencesRenderer && _this.getDefaultPreferencesHeaderText(defaultPreferencesRenderer.preferencesModel.target);
            return { defaultPreferencesRenderer: defaultPreferencesRenderer, editablePreferencesRenderer: editablePreferencesRenderer };
        });
    };
    SideBySidePreferencesWidget.prototype.getDefaultPreferencesHeaderText = function (target) {
        switch (target) {
            case 1 /* USER */:
                return nls.localize('defaultUserSettings', "Default User Settings");
            case 2 /* WORKSPACE */:
                return nls.localize('defaultWorkspaceSettings', "Default Workspace Settings");
            case 3 /* WORKSPACE_FOLDER */:
                return nls.localize('defaultFolderSettings', "Default Folder Settings");
        }
        return '';
    };
    SideBySidePreferencesWidget.prototype.setResultCount = function (settingsTarget, count) {
        this.settingsTargetsWidget.setResultCount(settingsTarget, count);
    };
    SideBySidePreferencesWidget.prototype.layout = function (dimension) {
        if (dimension === void 0) { dimension = this.dimension; }
        this.dimension = dimension;
        this.splitview.layout(dimension.width);
    };
    SideBySidePreferencesWidget.prototype.focus = function () {
        if (this.lastFocusedEditor) {
            this.lastFocusedEditor.focus();
        }
    };
    SideBySidePreferencesWidget.prototype.getControl = function () {
        return this.editablePreferencesEditor ? this.editablePreferencesEditor.getControl() : null;
    };
    SideBySidePreferencesWidget.prototype.clearInput = function () {
        if (this.defaultPreferencesEditor) {
            this.defaultPreferencesEditor.clearInput();
        }
        if (this.editablePreferencesEditor) {
            this.editablePreferencesEditor.clearInput();
        }
    };
    SideBySidePreferencesWidget.prototype.setEditorVisible = function (visible, group) {
        this.isVisible = visible;
        this.group = group;
        if (this.defaultPreferencesEditor) {
            this.defaultPreferencesEditor.setVisible(this.isVisible, this.group);
        }
        if (this.editablePreferencesEditor) {
            this.editablePreferencesEditor.setVisible(this.isVisible, this.group);
        }
    };
    SideBySidePreferencesWidget.prototype.getOrCreateEditablePreferencesEditor = function (editorInput) {
        var _this = this;
        if (this.editablePreferencesEditor) {
            return this.editablePreferencesEditor;
        }
        var descriptor = Registry.as(EditorExtensions.Editors).getEditor(editorInput);
        var editor = descriptor.instantiate(this.instantiationService);
        this.editablePreferencesEditor = editor;
        this.editablePreferencesEditor.create(this.editablePreferencesEditorContainer);
        this.editablePreferencesEditor.setVisible(this.isVisible, this.group);
        this.editablePreferencesEditor.getControl().onDidFocusEditorWidget(function () { return _this.lastFocusedEditor = _this.editablePreferencesEditor; });
        this.lastFocusedEditor = this.editablePreferencesEditor;
        this.layout();
        return editor;
    };
    SideBySidePreferencesWidget.prototype.updateInput = function (editor, input, editorContributionId, associatedPreferencesModelUri, options, token) {
        return editor.setInput(input, options, token)
            .then(function () {
            if (token.isCancellationRequested) {
                return void 0;
            }
            return editor.getControl().getContribution(editorContributionId).updatePreferencesRenderer(associatedPreferencesModelUri);
        });
    };
    SideBySidePreferencesWidget.prototype.getSettingsTarget = function (resource) {
        if (this.preferencesService.userSettingsResource.toString() === resource.toString()) {
            return 1 /* USER */;
        }
        var workspaceSettingsResource = this.preferencesService.workspaceSettingsResource;
        if (workspaceSettingsResource && workspaceSettingsResource.toString() === resource.toString()) {
            return 2 /* WORKSPACE */;
        }
        var folder = this.workspaceContextService.getWorkspaceFolder(resource);
        if (folder) {
            return folder.uri;
        }
        return 1 /* USER */;
    };
    SideBySidePreferencesWidget.prototype.disposeEditors = function () {
        if (this.defaultPreferencesEditor) {
            this.defaultPreferencesEditor.dispose();
            this.defaultPreferencesEditor = null;
        }
        if (this.editablePreferencesEditor) {
            this.editablePreferencesEditor.dispose();
            this.editablePreferencesEditor = null;
        }
    };
    SideBySidePreferencesWidget.prototype.dispose = function () {
        this.disposeEditors();
        _super.prototype.dispose.call(this);
    };
    SideBySidePreferencesWidget = __decorate([
        __param(1, IInstantiationService),
        __param(2, IThemeService),
        __param(3, IWorkspaceContextService),
        __param(4, IPreferencesService)
    ], SideBySidePreferencesWidget);
    return SideBySidePreferencesWidget;
}(Widget));
var DefaultPreferencesEditor = /** @class */ (function (_super) {
    __extends(DefaultPreferencesEditor, _super);
    function DefaultPreferencesEditor(telemetryService, instantiationService, storageService, configurationService, themeService, textFileService, editorGroupService, editorService, windowService) {
        return _super.call(this, DefaultPreferencesEditor.ID, telemetryService, instantiationService, storageService, configurationService, themeService, textFileService, editorService, editorGroupService, windowService) || this;
    }
    DefaultPreferencesEditor._getContributions = function () {
        var skipContributions = [FoldingController.prototype, SelectionHighlighter.prototype, FindController.prototype];
        var contributions = EditorExtensionsRegistry.getEditorContributions().filter(function (c) { return skipContributions.indexOf(c.prototype) === -1; });
        contributions.push(DefaultSettingsEditorContribution);
        return contributions;
    };
    DefaultPreferencesEditor.prototype.createEditorControl = function (parent, configuration) {
        var _this = this;
        var editor = this.instantiationService.createInstance(CodeEditorWidget, parent, configuration, { contributions: DefaultPreferencesEditor._getContributions() });
        // Inform user about editor being readonly if user starts type
        this._register(editor.onDidType(function () { return _this.showReadonlyHint(editor); }));
        this._register(editor.onDidPaste(function () { return _this.showReadonlyHint(editor); }));
        return editor;
    };
    DefaultPreferencesEditor.prototype.showReadonlyHint = function (editor) {
        var messageController = MessageController.get(editor);
        if (!messageController.isVisible()) {
            messageController.showMessage(nls.localize('defaultEditorReadonly', "Edit in the right hand side editor to override defaults."), editor.getSelection().getPosition());
        }
    };
    DefaultPreferencesEditor.prototype.getConfigurationOverrides = function () {
        var options = _super.prototype.getConfigurationOverrides.call(this);
        options.readOnly = true;
        if (this.input) {
            options.lineNumbers = 'off';
            options.renderLineHighlight = 'none';
            options.scrollBeyondLastLine = false;
            options.folding = false;
            options.renderWhitespace = 'none';
            options.wordWrap = 'on';
            options.renderIndentGuides = false;
            options.rulers = [];
            options.glyphMargin = true;
            options.minimap = {
                enabled: false
            };
        }
        return options;
    };
    DefaultPreferencesEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        return _super.prototype.setInput.call(this, input, options, token)
            .then(function () { return _this.input.resolve()
            .then(function (editorModel) {
            if (token.isCancellationRequested) {
                return void 0;
            }
            return editorModel.load();
        })
            .then(function (editorModel) {
            if (token.isCancellationRequested) {
                return void 0;
            }
            _this.getControl().setModel(editorModel.textEditorModel);
        }); });
    };
    DefaultPreferencesEditor.prototype.clearInput = function () {
        // Clear Model
        this.getControl().setModel(null);
        // Pass to super
        _super.prototype.clearInput.call(this);
    };
    DefaultPreferencesEditor.prototype.layout = function (dimension) {
        this.getControl().layout(dimension);
    };
    DefaultPreferencesEditor.prototype.getAriaLabel = function () {
        return nls.localize('preferencesAriaLabel', "Default preferences. Readonly text editor.");
    };
    DefaultPreferencesEditor.ID = 'workbench.editor.defaultPreferences';
    DefaultPreferencesEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IInstantiationService),
        __param(2, IStorageService),
        __param(3, ITextResourceConfigurationService),
        __param(4, IThemeService),
        __param(5, ITextFileService),
        __param(6, IEditorGroupsService),
        __param(7, IEditorService),
        __param(8, IWindowService)
    ], DefaultPreferencesEditor);
    return DefaultPreferencesEditor;
}(BaseTextEditor));
export { DefaultPreferencesEditor };
var AbstractSettingsEditorContribution = /** @class */ (function (_super) {
    __extends(AbstractSettingsEditorContribution, _super);
    function AbstractSettingsEditorContribution(editor, instantiationService, preferencesService, workspaceContextService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.instantiationService = instantiationService;
        _this.preferencesService = preferencesService;
        _this.workspaceContextService = workspaceContextService;
        _this._register(_this.editor.onDidChangeModel(function () { return _this._onModelChanged(); }));
        return _this;
    }
    AbstractSettingsEditorContribution.prototype.updatePreferencesRenderer = function (associatedPreferencesModelUri) {
        var _this = this;
        if (!this.preferencesRendererCreationPromise) {
            this.preferencesRendererCreationPromise = this._createPreferencesRenderer();
        }
        if (this.preferencesRendererCreationPromise) {
            return this._hasAssociatedPreferencesModelChanged(associatedPreferencesModelUri)
                .then(function (changed) { return changed ? _this._updatePreferencesRenderer(associatedPreferencesModelUri) : _this.preferencesRendererCreationPromise; });
        }
        return TPromise.as(null);
    };
    AbstractSettingsEditorContribution.prototype._onModelChanged = function () {
        var model = this.editor.getModel();
        this.disposePreferencesRenderer();
        if (model) {
            this.preferencesRendererCreationPromise = this._createPreferencesRenderer();
        }
    };
    AbstractSettingsEditorContribution.prototype._hasAssociatedPreferencesModelChanged = function (associatedPreferencesModelUri) {
        return this.preferencesRendererCreationPromise.then(function (preferencesRenderer) {
            return !(preferencesRenderer && preferencesRenderer.getAssociatedPreferencesModel() && preferencesRenderer.getAssociatedPreferencesModel().uri.toString() === associatedPreferencesModelUri.toString());
        });
    };
    AbstractSettingsEditorContribution.prototype._updatePreferencesRenderer = function (associatedPreferencesModelUri) {
        var _this = this;
        return this.preferencesService.createPreferencesEditorModel(associatedPreferencesModelUri)
            .then(function (associatedPreferencesEditorModel) {
            return _this.preferencesRendererCreationPromise.then(function (preferencesRenderer) {
                if (preferencesRenderer) {
                    var associatedPreferencesModel = preferencesRenderer.getAssociatedPreferencesModel();
                    if (associatedPreferencesModel) {
                        associatedPreferencesModel.dispose();
                    }
                    preferencesRenderer.setAssociatedPreferencesModel(associatedPreferencesEditorModel);
                }
                return preferencesRenderer;
            });
        });
    };
    AbstractSettingsEditorContribution.prototype.disposePreferencesRenderer = function () {
        if (this.preferencesRendererCreationPromise) {
            this.preferencesRendererCreationPromise.then(function (preferencesRenderer) {
                if (preferencesRenderer) {
                    var associatedPreferencesModel = preferencesRenderer.getAssociatedPreferencesModel();
                    if (associatedPreferencesModel) {
                        associatedPreferencesModel.dispose();
                    }
                    preferencesRenderer.preferencesModel.dispose();
                    preferencesRenderer.dispose();
                }
            });
            this.preferencesRendererCreationPromise = TPromise.as(null);
        }
    };
    AbstractSettingsEditorContribution.prototype.dispose = function () {
        this.disposePreferencesRenderer();
        _super.prototype.dispose.call(this);
    };
    AbstractSettingsEditorContribution = __decorate([
        __param(1, IInstantiationService),
        __param(2, IPreferencesService),
        __param(3, IWorkspaceContextService)
    ], AbstractSettingsEditorContribution);
    return AbstractSettingsEditorContribution;
}(Disposable));
var DefaultSettingsEditorContribution = /** @class */ (function (_super) {
    __extends(DefaultSettingsEditorContribution, _super);
    function DefaultSettingsEditorContribution() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultSettingsEditorContribution.prototype.getId = function () {
        return DefaultSettingsEditorContribution.ID;
    };
    DefaultSettingsEditorContribution.prototype._createPreferencesRenderer = function () {
        var _this = this;
        return this.preferencesService.createPreferencesEditorModel(this.editor.getModel().uri)
            .then(function (editorModel) {
            if (editorModel instanceof DefaultSettingsEditorModel && _this.editor.getModel()) {
                var preferencesRenderer = _this.instantiationService.createInstance(DefaultSettingsRenderer, _this.editor, editorModel);
                preferencesRenderer.render();
                return preferencesRenderer;
            }
            return null;
        });
    };
    DefaultSettingsEditorContribution.ID = 'editor.contrib.defaultsettings';
    return DefaultSettingsEditorContribution;
}(AbstractSettingsEditorContribution));
var SettingsEditorContribution = /** @class */ (function (_super) {
    __extends(SettingsEditorContribution, _super);
    function SettingsEditorContribution(editor, instantiationService, preferencesService, workspaceContextService) {
        var _this = _super.call(this, editor, instantiationService, preferencesService, workspaceContextService) || this;
        _this._register(_this.workspaceContextService.onDidChangeWorkbenchState(function () { return _this._onModelChanged(); }));
        return _this;
    }
    SettingsEditorContribution.prototype.getId = function () {
        return SettingsEditorContribution.ID;
    };
    SettingsEditorContribution.prototype._createPreferencesRenderer = function () {
        var _this = this;
        if (this.isSettingsModel()) {
            return this.preferencesService.createPreferencesEditorModel(this.editor.getModel().uri)
                .then(function (settingsModel) {
                if (settingsModel instanceof SettingsEditorModel && _this.editor.getModel()) {
                    switch (settingsModel.configurationTarget) {
                        case 1 /* USER */:
                            return _this.instantiationService.createInstance(UserSettingsRenderer, _this.editor, settingsModel);
                        case 2 /* WORKSPACE */:
                            return _this.instantiationService.createInstance(WorkspaceSettingsRenderer, _this.editor, settingsModel);
                        case 3 /* WORKSPACE_FOLDER */:
                            return _this.instantiationService.createInstance(FolderSettingsRenderer, _this.editor, settingsModel);
                    }
                }
                return null;
            })
                .then(function (preferencesRenderer) {
                if (preferencesRenderer) {
                    preferencesRenderer.render();
                }
                return preferencesRenderer;
            });
        }
        return null;
    };
    SettingsEditorContribution.prototype.isSettingsModel = function () {
        var model = this.editor.getModel();
        if (!model) {
            return false;
        }
        if (this.preferencesService.userSettingsResource && this.preferencesService.userSettingsResource.toString() === model.uri.toString()) {
            return true;
        }
        if (this.preferencesService.workspaceSettingsResource && this.preferencesService.workspaceSettingsResource.toString() === model.uri.toString()) {
            return true;
        }
        for (var _i = 0, _a = this.workspaceContextService.getWorkspace().folders; _i < _a.length; _i++) {
            var folder = _a[_i];
            var folderSettingsResource = this.preferencesService.getFolderSettingsResource(folder.uri);
            if (folderSettingsResource && folderSettingsResource.toString() === model.uri.toString()) {
                return true;
            }
        }
        return false;
    };
    SettingsEditorContribution.ID = 'editor.contrib.settings';
    SettingsEditorContribution = __decorate([
        __param(1, IInstantiationService),
        __param(2, IPreferencesService),
        __param(3, IWorkspaceContextService)
    ], SettingsEditorContribution);
    return SettingsEditorContribution;
}(AbstractSettingsEditorContribution));
registerEditorContribution(SettingsEditorContribution);
