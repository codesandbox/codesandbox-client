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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ContextSubMenu } from '../../../../base/browser/contextmenu';
import { getDomNodePagePosition } from '../../../../base/browser/dom';
import { Delayer } from '../../../../base/common/async';
import { Emitter } from '../../../../base/common/event';
import { Disposable, dispose } from '../../../../base/common/lifecycle';
import { TPromise } from '../../../../base/common/winjs.base';
import { MouseTargetType } from '../../../../editor/browser/editorBrowser';
import { Position } from '../../../../editor/common/core/position';
import { Range } from '../../../../editor/common/core/range';
import { TrackedRangeStickiness } from '../../../../editor/common/model';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel';
import * as nls from '../../../../nls';
import { IConfigurationService, overrideIdentifierFromKey } from '../../../../platform/configuration/common/configuration';
import { Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { Registry } from '../../../../platform/registry/common/platform';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { RangeHighlightDecorations } from '../../../browser/parts/editor/rangeDecorations';
import { DefaultSettingsHeaderWidget, EditPreferenceWidget, SettingsGroupTitleWidget, SettingsHeaderWidget } from './preferencesWidgets';
import { IPreferencesService } from '../../../services/preferences/common/preferences';
import { DefaultSettingsEditorModel, WorkspaceConfigurationEditorModel } from '../../../services/preferences/common/preferencesModels';
var UserSettingsRenderer = /** @class */ (function (_super) {
    __extends(UserSettingsRenderer, _super);
    function UserSettingsRenderer(editor, preferencesModel, preferencesService, configurationService, instantiationService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.preferencesModel = preferencesModel;
        _this.preferencesService = preferencesService;
        _this.configurationService = configurationService;
        _this.instantiationService = instantiationService;
        _this.modelChangeDelayer = new Delayer(200);
        _this._onFocusPreference = new Emitter();
        _this.onFocusPreference = _this._onFocusPreference.event;
        _this._onClearFocusPreference = new Emitter();
        _this.onClearFocusPreference = _this._onClearFocusPreference.event;
        _this._onUpdatePreference = new Emitter();
        _this.onUpdatePreference = _this._onUpdatePreference.event;
        _this.settingHighlighter = _this._register(instantiationService.createInstance(SettingHighlighter, editor, _this._onFocusPreference, _this._onClearFocusPreference));
        _this.highlightMatchesRenderer = _this._register(instantiationService.createInstance(HighlightMatchesRenderer, editor));
        _this.editSettingActionRenderer = _this._register(_this.instantiationService.createInstance(EditSettingRenderer, _this.editor, _this.preferencesModel, _this.settingHighlighter));
        _this._register(_this.editSettingActionRenderer.onUpdateSetting(function (_a) {
            var key = _a.key, value = _a.value, source = _a.source;
            return _this._updatePreference(key, value, source);
        }));
        _this._register(_this.editor.getModel().onDidChangeContent(function () { return _this.modelChangeDelayer.trigger(function () { return _this.onModelChanged(); }); }));
        return _this;
    }
    UserSettingsRenderer.prototype.getAssociatedPreferencesModel = function () {
        return this.associatedPreferencesModel;
    };
    UserSettingsRenderer.prototype.setAssociatedPreferencesModel = function (associatedPreferencesModel) {
        this.associatedPreferencesModel = associatedPreferencesModel;
        this.editSettingActionRenderer.associatedPreferencesModel = associatedPreferencesModel;
        // Create header only in Settings editor mode
        this.createHeader();
    };
    UserSettingsRenderer.prototype.createHeader = function () {
        this._register(new SettingsHeaderWidget(this.editor, '')).setMessage(nls.localize('emptyUserSettingsHeader', "Place your settings here to overwrite the Default Settings."));
    };
    UserSettingsRenderer.prototype.render = function () {
        this.editSettingActionRenderer.render(this.preferencesModel.settingsGroups, this.associatedPreferencesModel);
        if (this.filterResult) {
            this.filterPreferences(this.filterResult);
        }
    };
    UserSettingsRenderer.prototype._updatePreference = function (key, value, source) {
        this._onUpdatePreference.fire({ key: key, value: value, source: source });
        this.updatePreference(key, value, source);
    };
    UserSettingsRenderer.prototype.updatePreference = function (key, value, source) {
        var _this = this;
        var overrideIdentifier = source.overrideOf ? overrideIdentifierFromKey(source.overrideOf.key) : null;
        var resource = this.preferencesModel.uri;
        this.configurationService.updateValue(key, value, { overrideIdentifier: overrideIdentifier, resource: resource }, this.preferencesModel.configurationTarget)
            .then(function () { return _this.onSettingUpdated(source); });
    };
    UserSettingsRenderer.prototype.onModelChanged = function () {
        if (!this.editor.getModel()) {
            // model could have been disposed during the delay
            return;
        }
        this.render();
    };
    UserSettingsRenderer.prototype.onSettingUpdated = function (setting) {
        this.editor.focus();
        setting = this.getSetting(setting);
        if (setting) {
            // TODO:@sandy Selection range should be template range
            this.editor.setSelection(setting.valueRange);
            this.settingHighlighter.highlight(setting, true);
        }
    };
    UserSettingsRenderer.prototype.getSetting = function (setting) {
        var key = setting.key, overrideOf = setting.overrideOf;
        if (overrideOf) {
            var setting_1 = this.getSetting(overrideOf);
            for (var _i = 0, _a = setting_1.overrides; _i < _a.length; _i++) {
                var override = _a[_i];
                if (override.key === key) {
                    return override;
                }
            }
            return null;
        }
        return this.preferencesModel.getPreference(key);
    };
    UserSettingsRenderer.prototype.filterPreferences = function (filterResult) {
        this.filterResult = filterResult;
        this.settingHighlighter.clear(true);
        this.highlightMatchesRenderer.render(filterResult ? filterResult.matches : []);
    };
    UserSettingsRenderer.prototype.focusPreference = function (setting) {
        var s = this.getSetting(setting);
        if (s) {
            this.settingHighlighter.highlight(s, true);
            this.editor.setPosition({ lineNumber: s.keyRange.startLineNumber, column: s.keyRange.startColumn });
        }
        else {
            this.settingHighlighter.clear(true);
        }
    };
    UserSettingsRenderer.prototype.clearFocus = function (setting) {
        this.settingHighlighter.clear(true);
    };
    UserSettingsRenderer.prototype.editPreference = function (setting) {
        var editableSetting = this.getSetting(setting);
        return editableSetting && this.editSettingActionRenderer.activateOnSetting(editableSetting);
    };
    UserSettingsRenderer = __decorate([
        __param(2, IPreferencesService),
        __param(3, IConfigurationService),
        __param(4, IInstantiationService)
    ], UserSettingsRenderer);
    return UserSettingsRenderer;
}(Disposable));
export { UserSettingsRenderer };
var WorkspaceSettingsRenderer = /** @class */ (function (_super) {
    __extends(WorkspaceSettingsRenderer, _super);
    function WorkspaceSettingsRenderer(editor, preferencesModel, preferencesService, telemetryService, configurationService, instantiationService) {
        var _this = _super.call(this, editor, preferencesModel, preferencesService, configurationService, instantiationService) || this;
        _this.workspaceConfigurationRenderer = _this._register(instantiationService.createInstance(WorkspaceConfigurationRenderer, editor, preferencesModel));
        return _this;
    }
    WorkspaceSettingsRenderer.prototype.createHeader = function () {
        this._register(new SettingsHeaderWidget(this.editor, '')).setMessage(nls.localize('emptyWorkspaceSettingsHeader', "Place your settings here to overwrite the User Settings."));
    };
    WorkspaceSettingsRenderer.prototype.setAssociatedPreferencesModel = function (associatedPreferencesModel) {
        _super.prototype.setAssociatedPreferencesModel.call(this, associatedPreferencesModel);
        this.workspaceConfigurationRenderer.render(this.getAssociatedPreferencesModel());
    };
    WorkspaceSettingsRenderer.prototype.render = function () {
        _super.prototype.render.call(this);
        this.workspaceConfigurationRenderer.render(this.getAssociatedPreferencesModel());
    };
    WorkspaceSettingsRenderer = __decorate([
        __param(2, IPreferencesService),
        __param(3, ITelemetryService),
        __param(4, IConfigurationService),
        __param(5, IInstantiationService)
    ], WorkspaceSettingsRenderer);
    return WorkspaceSettingsRenderer;
}(UserSettingsRenderer));
export { WorkspaceSettingsRenderer };
var FolderSettingsRenderer = /** @class */ (function (_super) {
    __extends(FolderSettingsRenderer, _super);
    function FolderSettingsRenderer(editor, preferencesModel, preferencesService, telemetryService, configurationService, instantiationService) {
        return _super.call(this, editor, preferencesModel, preferencesService, configurationService, instantiationService) || this;
    }
    FolderSettingsRenderer.prototype.createHeader = function () {
        this._register(new SettingsHeaderWidget(this.editor, '')).setMessage(nls.localize('emptyFolderSettingsHeader', "Place your folder settings here to overwrite those from the Workspace Settings."));
    };
    FolderSettingsRenderer = __decorate([
        __param(2, IPreferencesService),
        __param(3, ITelemetryService),
        __param(4, IConfigurationService),
        __param(5, IInstantiationService)
    ], FolderSettingsRenderer);
    return FolderSettingsRenderer;
}(UserSettingsRenderer));
export { FolderSettingsRenderer };
var DefaultSettingsRenderer = /** @class */ (function (_super) {
    __extends(DefaultSettingsRenderer, _super);
    function DefaultSettingsRenderer(editor, preferencesModel, preferencesService, instantiationService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.preferencesModel = preferencesModel;
        _this.preferencesService = preferencesService;
        _this.instantiationService = instantiationService;
        _this._onUpdatePreference = new Emitter();
        _this.onUpdatePreference = _this._onUpdatePreference.event;
        _this._onFocusPreference = new Emitter();
        _this.onFocusPreference = _this._onFocusPreference.event;
        _this._onClearFocusPreference = new Emitter();
        _this.onClearFocusPreference = _this._onClearFocusPreference.event;
        _this.settingHighlighter = _this._register(instantiationService.createInstance(SettingHighlighter, editor, _this._onFocusPreference, _this._onClearFocusPreference));
        _this.settingsHeaderRenderer = _this._register(instantiationService.createInstance(DefaultSettingsHeaderRenderer, editor));
        _this.settingsGroupTitleRenderer = _this._register(instantiationService.createInstance(SettingsGroupTitleRenderer, editor));
        _this.filteredMatchesRenderer = _this._register(instantiationService.createInstance(FilteredMatchesRenderer, editor));
        _this.editSettingActionRenderer = _this._register(instantiationService.createInstance(EditSettingRenderer, editor, preferencesModel, _this.settingHighlighter));
        _this.bracesHidingRenderer = _this._register(instantiationService.createInstance(BracesHidingRenderer, editor, preferencesModel));
        _this.hiddenAreasRenderer = _this._register(instantiationService.createInstance(HiddenAreasRenderer, editor, [_this.settingsGroupTitleRenderer, _this.filteredMatchesRenderer, _this.bracesHidingRenderer]));
        _this._register(_this.editSettingActionRenderer.onUpdateSetting(function (e) { return _this._onUpdatePreference.fire(e); }));
        _this._register(_this.settingsGroupTitleRenderer.onHiddenAreasChanged(function () { return _this.hiddenAreasRenderer.render(); }));
        _this._register(preferencesModel.onDidChangeGroups(function () { return _this.render(); }));
        return _this;
    }
    DefaultSettingsRenderer.prototype.getAssociatedPreferencesModel = function () {
        return this._associatedPreferencesModel;
    };
    DefaultSettingsRenderer.prototype.setAssociatedPreferencesModel = function (associatedPreferencesModel) {
        this._associatedPreferencesModel = associatedPreferencesModel;
        this.editSettingActionRenderer.associatedPreferencesModel = associatedPreferencesModel;
    };
    DefaultSettingsRenderer.prototype.render = function () {
        this.settingsGroupTitleRenderer.render(this.preferencesModel.settingsGroups);
        this.editSettingActionRenderer.render(this.preferencesModel.settingsGroups, this._associatedPreferencesModel);
        this.settingHighlighter.clear(true);
        this.bracesHidingRenderer.render(null, this.preferencesModel.settingsGroups);
        this.settingsGroupTitleRenderer.showGroup(0);
        this.hiddenAreasRenderer.render();
    };
    DefaultSettingsRenderer.prototype.filterPreferences = function (filterResult) {
        this.filterResult = filterResult;
        if (filterResult) {
            this.filteredMatchesRenderer.render(filterResult, this.preferencesModel.settingsGroups);
            this.settingsGroupTitleRenderer.render(null);
            this.settingsHeaderRenderer.render(filterResult);
            this.settingHighlighter.clear(true);
            this.bracesHidingRenderer.render(filterResult, this.preferencesModel.settingsGroups);
            this.editSettingActionRenderer.render(filterResult.filteredGroups, this._associatedPreferencesModel);
        }
        else {
            this.settingHighlighter.clear(true);
            this.filteredMatchesRenderer.render(null, this.preferencesModel.settingsGroups);
            this.settingsHeaderRenderer.render(null);
            this.settingsGroupTitleRenderer.render(this.preferencesModel.settingsGroups);
            this.settingsGroupTitleRenderer.showGroup(0);
            this.bracesHidingRenderer.render(null, this.preferencesModel.settingsGroups);
            this.editSettingActionRenderer.render(this.preferencesModel.settingsGroups, this._associatedPreferencesModel);
        }
        this.hiddenAreasRenderer.render();
    };
    DefaultSettingsRenderer.prototype.focusPreference = function (s) {
        var setting = this.getSetting(s);
        if (setting) {
            this.settingsGroupTitleRenderer.showSetting(setting);
            this.settingHighlighter.highlight(setting, true);
        }
        else {
            this.settingHighlighter.clear(true);
        }
    };
    DefaultSettingsRenderer.prototype.getSetting = function (setting) {
        var key = setting.key, overrideOf = setting.overrideOf;
        if (overrideOf) {
            var setting_2 = this.getSetting(overrideOf);
            for (var _i = 0, _a = setting_2.overrides; _i < _a.length; _i++) {
                var override = _a[_i];
                if (override.key === key) {
                    return override;
                }
            }
            return null;
        }
        var settingsGroups = this.filterResult ? this.filterResult.filteredGroups : this.preferencesModel.settingsGroups;
        return this.getPreference(key, settingsGroups);
    };
    DefaultSettingsRenderer.prototype.getPreference = function (key, settingsGroups) {
        for (var _i = 0, settingsGroups_1 = settingsGroups; _i < settingsGroups_1.length; _i++) {
            var group = settingsGroups_1[_i];
            for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                var section = _b[_a];
                for (var _c = 0, _d = section.settings; _c < _d.length; _c++) {
                    var setting = _d[_c];
                    if (setting.key === key) {
                        return setting;
                    }
                }
            }
        }
        return null;
    };
    DefaultSettingsRenderer.prototype.clearFocus = function (setting) {
        this.settingHighlighter.clear(true);
    };
    DefaultSettingsRenderer.prototype.updatePreference = function (key, value, source) {
    };
    DefaultSettingsRenderer.prototype.editPreference = function (setting) {
        return this.editSettingActionRenderer.activateOnSetting(setting);
    };
    DefaultSettingsRenderer = __decorate([
        __param(2, IPreferencesService),
        __param(3, IInstantiationService)
    ], DefaultSettingsRenderer);
    return DefaultSettingsRenderer;
}(Disposable));
export { DefaultSettingsRenderer };
var BracesHidingRenderer = /** @class */ (function (_super) {
    __extends(BracesHidingRenderer, _super);
    function BracesHidingRenderer(editor) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        return _this;
    }
    BracesHidingRenderer.prototype.render = function (result, settingsGroups) {
        this._result = result;
        this._settingsGroups = settingsGroups;
    };
    Object.defineProperty(BracesHidingRenderer.prototype, "hiddenAreas", {
        get: function () {
            // Opening square brace
            var hiddenAreas = [
                {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1
                }
            ];
            var hideBraces = function (group, hideExtraLine) {
                // Opening curly brace
                hiddenAreas.push({
                    startLineNumber: group.range.startLineNumber - 3,
                    startColumn: 1,
                    endLineNumber: group.range.startLineNumber - (hideExtraLine ? 1 : 3),
                    endColumn: 1
                });
                // Closing curly brace
                hiddenAreas.push({
                    startLineNumber: group.range.endLineNumber + 1,
                    startColumn: 1,
                    endLineNumber: group.range.endLineNumber + 4,
                    endColumn: 1
                });
            };
            this._settingsGroups.forEach(function (g) { return hideBraces(g); });
            if (this._result) {
                this._result.filteredGroups.forEach(function (g, i) { return hideBraces(g, true); });
            }
            // Closing square brace
            var lineCount = this.editor.getModel().getLineCount();
            hiddenAreas.push({
                startLineNumber: lineCount,
                startColumn: 1,
                endLineNumber: lineCount,
                endColumn: 1
            });
            return hiddenAreas;
        },
        enumerable: true,
        configurable: true
    });
    return BracesHidingRenderer;
}(Disposable));
export { BracesHidingRenderer };
var DefaultSettingsHeaderRenderer = /** @class */ (function (_super) {
    __extends(DefaultSettingsHeaderRenderer, _super);
    function DefaultSettingsHeaderRenderer(editor) {
        var _this = _super.call(this) || this;
        _this.settingsHeaderWidget = _this._register(new DefaultSettingsHeaderWidget(editor, ''));
        _this.onClick = _this.settingsHeaderWidget.onClick;
        return _this;
    }
    DefaultSettingsHeaderRenderer.prototype.render = function (filterResult) {
        var hasSettings = !filterResult || filterResult.filteredGroups.length > 0;
        this.settingsHeaderWidget.toggleMessage(hasSettings);
    };
    return DefaultSettingsHeaderRenderer;
}(Disposable));
var SettingsGroupTitleRenderer = /** @class */ (function (_super) {
    __extends(SettingsGroupTitleRenderer, _super);
    function SettingsGroupTitleRenderer(editor, instantiationService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.instantiationService = instantiationService;
        _this._onHiddenAreasChanged = new Emitter();
        _this.hiddenGroups = [];
        _this.disposables = [];
        return _this;
    }
    Object.defineProperty(SettingsGroupTitleRenderer.prototype, "onHiddenAreasChanged", {
        get: function () { return this._onHiddenAreasChanged.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsGroupTitleRenderer.prototype, "hiddenAreas", {
        get: function () {
            var hiddenAreas = [];
            for (var _i = 0, _a = this.hiddenGroups; _i < _a.length; _i++) {
                var group = _a[_i];
                hiddenAreas.push(group.range);
            }
            return hiddenAreas;
        },
        enumerable: true,
        configurable: true
    });
    SettingsGroupTitleRenderer.prototype.render = function (settingsGroups) {
        var _this = this;
        this.disposeWidgets();
        if (!settingsGroups) {
            return;
        }
        this.settingsGroups = settingsGroups.slice();
        this.settingsGroupTitleWidgets = [];
        var _loop_1 = function (group) {
            if (group.sections.every(function (sect) { return sect.settings.length === 0; })) {
                return "continue";
            }
            var settingsGroupTitleWidget = this_1.instantiationService.createInstance(SettingsGroupTitleWidget, this_1.editor, group);
            settingsGroupTitleWidget.render();
            this_1.settingsGroupTitleWidgets.push(settingsGroupTitleWidget);
            this_1.disposables.push(settingsGroupTitleWidget);
            this_1.disposables.push(settingsGroupTitleWidget.onToggled(function (collapsed) { return _this.onToggled(collapsed, settingsGroupTitleWidget.settingsGroup); }));
        };
        var this_1 = this;
        for (var _i = 0, _a = this.settingsGroups.slice().reverse(); _i < _a.length; _i++) {
            var group = _a[_i];
            _loop_1(group);
        }
        this.settingsGroupTitleWidgets.reverse();
    };
    SettingsGroupTitleRenderer.prototype.showGroup = function (groupIdx) {
        var shownGroup = this.settingsGroupTitleWidgets[groupIdx].settingsGroup;
        this.hiddenGroups = this.settingsGroups.filter(function (g) { return g !== shownGroup; });
        for (var _i = 0, _a = this.settingsGroupTitleWidgets.filter(function (widget) { return widget.settingsGroup !== shownGroup; }); _i < _a.length; _i++) {
            var groupTitleWidget = _a[_i];
            groupTitleWidget.toggleCollapse(true);
        }
        this._onHiddenAreasChanged.fire();
    };
    SettingsGroupTitleRenderer.prototype.showSetting = function (setting) {
        var settingsGroupTitleWidget = this.settingsGroupTitleWidgets.filter(function (widget) { return Range.containsRange(widget.settingsGroup.range, setting.range); })[0];
        if (settingsGroupTitleWidget && settingsGroupTitleWidget.isCollapsed()) {
            settingsGroupTitleWidget.toggleCollapse(false);
            this.hiddenGroups.splice(this.hiddenGroups.indexOf(settingsGroupTitleWidget.settingsGroup), 1);
            this._onHiddenAreasChanged.fire();
        }
    };
    SettingsGroupTitleRenderer.prototype.onToggled = function (collapsed, group) {
        var index = this.hiddenGroups.indexOf(group);
        if (collapsed) {
            var currentPosition = this.editor.getPosition();
            if (group.range.startLineNumber <= currentPosition.lineNumber && group.range.endLineNumber >= currentPosition.lineNumber) {
                this.editor.setPosition({ lineNumber: group.range.startLineNumber - 1, column: 1 });
            }
            this.hiddenGroups.push(group);
        }
        else {
            this.hiddenGroups.splice(index, 1);
        }
        this._onHiddenAreasChanged.fire();
    };
    SettingsGroupTitleRenderer.prototype.disposeWidgets = function () {
        this.hiddenGroups = [];
        this.disposables = dispose(this.disposables);
    };
    SettingsGroupTitleRenderer.prototype.dispose = function () {
        this.disposeWidgets();
        _super.prototype.dispose.call(this);
    };
    SettingsGroupTitleRenderer = __decorate([
        __param(1, IInstantiationService)
    ], SettingsGroupTitleRenderer);
    return SettingsGroupTitleRenderer;
}(Disposable));
export { SettingsGroupTitleRenderer };
var HiddenAreasRenderer = /** @class */ (function (_super) {
    __extends(HiddenAreasRenderer, _super);
    function HiddenAreasRenderer(editor, hiddenAreasProviders) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.hiddenAreasProviders = hiddenAreasProviders;
        return _this;
    }
    HiddenAreasRenderer.prototype.render = function () {
        var ranges = [];
        for (var _i = 0, _a = this.hiddenAreasProviders; _i < _a.length; _i++) {
            var hiddenAreaProvider = _a[_i];
            ranges.push.apply(ranges, hiddenAreaProvider.hiddenAreas);
        }
        this.editor.setHiddenAreas(ranges);
    };
    HiddenAreasRenderer.prototype.dispose = function () {
        this.editor.setHiddenAreas([]);
        _super.prototype.dispose.call(this);
    };
    return HiddenAreasRenderer;
}(Disposable));
export { HiddenAreasRenderer };
var FilteredMatchesRenderer = /** @class */ (function (_super) {
    __extends(FilteredMatchesRenderer, _super);
    function FilteredMatchesRenderer(editor) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.decorationIds = [];
        _this.hiddenAreas = [];
        return _this;
    }
    FilteredMatchesRenderer.prototype.render = function (result, allSettingsGroups) {
        var _this = this;
        var model = this.editor.getModel();
        this.hiddenAreas = [];
        if (result) {
            this.hiddenAreas = this.computeHiddenRanges(result.filteredGroups, result.allGroups, model);
            this.decorationIds = this.editor.deltaDecorations(this.decorationIds, result.matches.map(function (match) { return _this.createDecoration(match, model); }));
        }
        else {
            this.hiddenAreas = this.computeHiddenRanges(null, allSettingsGroups, model);
            this.decorationIds = this.editor.deltaDecorations(this.decorationIds, []);
        }
    };
    FilteredMatchesRenderer.prototype.createDecoration = function (range, model) {
        return {
            range: range,
            options: FilteredMatchesRenderer._FIND_MATCH
        };
    };
    FilteredMatchesRenderer.prototype.computeHiddenRanges = function (filteredGroups, allSettingsGroups, model) {
        // Hide the contents of hidden groups
        var notMatchesRanges = [];
        if (filteredGroups) {
            allSettingsGroups.forEach(function (group, i) {
                notMatchesRanges.push({
                    startLineNumber: group.range.startLineNumber - 1,
                    startColumn: group.range.startColumn,
                    endLineNumber: group.range.endLineNumber,
                    endColumn: group.range.endColumn
                });
            });
        }
        return notMatchesRanges;
    };
    FilteredMatchesRenderer.prototype.dispose = function () {
        this.decorationIds = this.editor.deltaDecorations(this.decorationIds, []);
        _super.prototype.dispose.call(this);
    };
    FilteredMatchesRenderer._FIND_MATCH = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'findMatch'
    });
    return FilteredMatchesRenderer;
}(Disposable));
export { FilteredMatchesRenderer };
var HighlightMatchesRenderer = /** @class */ (function (_super) {
    __extends(HighlightMatchesRenderer, _super);
    function HighlightMatchesRenderer(editor) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.decorationIds = [];
        return _this;
    }
    HighlightMatchesRenderer.prototype.render = function (matches) {
        var _this = this;
        var model = this.editor.getModel();
        this.decorationIds = this.editor.deltaDecorations(this.decorationIds, matches.map(function (match) { return _this.createDecoration(match, model); }));
    };
    HighlightMatchesRenderer.prototype.createDecoration = function (range, model) {
        return {
            range: range,
            options: HighlightMatchesRenderer._FIND_MATCH
        };
    };
    HighlightMatchesRenderer.prototype.dispose = function () {
        this.decorationIds = this.editor.deltaDecorations(this.decorationIds, []);
        _super.prototype.dispose.call(this);
    };
    HighlightMatchesRenderer._FIND_MATCH = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'findMatch'
    });
    return HighlightMatchesRenderer;
}(Disposable));
export { HighlightMatchesRenderer };
var EditSettingRenderer = /** @class */ (function (_super) {
    __extends(EditSettingRenderer, _super);
    function EditSettingRenderer(editor, masterSettingsModel, settingHighlighter, instantiationService, contextMenuService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.masterSettingsModel = masterSettingsModel;
        _this.settingHighlighter = settingHighlighter;
        _this.instantiationService = instantiationService;
        _this.contextMenuService = contextMenuService;
        _this.settingsGroups = [];
        _this._onUpdateSetting = new Emitter();
        _this.onUpdateSetting = _this._onUpdateSetting.event;
        _this.editPreferenceWidgetForCursorPosition = _this._register(_this.instantiationService.createInstance(EditPreferenceWidget, editor));
        _this.editPreferenceWidgetForMouseMove = _this._register(_this.instantiationService.createInstance(EditPreferenceWidget, editor));
        _this.toggleEditPreferencesForMouseMoveDelayer = new Delayer(75);
        _this._register(_this.editPreferenceWidgetForCursorPosition.onClick(function (e) { return _this.onEditSettingClicked(_this.editPreferenceWidgetForCursorPosition, e); }));
        _this._register(_this.editPreferenceWidgetForMouseMove.onClick(function (e) { return _this.onEditSettingClicked(_this.editPreferenceWidgetForMouseMove, e); }));
        _this._register(_this.editor.onDidChangeCursorPosition(function (positionChangeEvent) { return _this.onPositionChanged(positionChangeEvent); }));
        _this._register(_this.editor.onMouseMove(function (mouseMoveEvent) { return _this.onMouseMoved(mouseMoveEvent); }));
        _this._register(_this.editor.onDidChangeConfiguration(function () { return _this.onConfigurationChanged(); }));
        return _this;
    }
    EditSettingRenderer.prototype.render = function (settingsGroups, associatedPreferencesModel) {
        this.editPreferenceWidgetForCursorPosition.hide();
        this.editPreferenceWidgetForMouseMove.hide();
        this.settingsGroups = settingsGroups;
        this.associatedPreferencesModel = associatedPreferencesModel;
        var settings = this.getSettings(this.editor.getPosition().lineNumber);
        if (settings.length) {
            this.showEditPreferencesWidget(this.editPreferenceWidgetForCursorPosition, settings);
        }
    };
    EditSettingRenderer.prototype.isDefaultSettings = function () {
        return this.masterSettingsModel instanceof DefaultSettingsEditorModel;
    };
    EditSettingRenderer.prototype.onConfigurationChanged = function () {
        if (!this.editor.getConfiguration().viewInfo.glyphMargin) {
            this.editPreferenceWidgetForCursorPosition.hide();
            this.editPreferenceWidgetForMouseMove.hide();
        }
    };
    EditSettingRenderer.prototype.onPositionChanged = function (positionChangeEvent) {
        this.editPreferenceWidgetForMouseMove.hide();
        var settings = this.getSettings(positionChangeEvent.position.lineNumber);
        if (settings.length) {
            this.showEditPreferencesWidget(this.editPreferenceWidgetForCursorPosition, settings);
        }
        else {
            this.editPreferenceWidgetForCursorPosition.hide();
        }
    };
    EditSettingRenderer.prototype.onMouseMoved = function (mouseMoveEvent) {
        var _this = this;
        var editPreferenceWidget = this.getEditPreferenceWidgetUnderMouse(mouseMoveEvent);
        if (editPreferenceWidget) {
            this.onMouseOver(editPreferenceWidget);
            return;
        }
        this.settingHighlighter.clear();
        this.toggleEditPreferencesForMouseMoveDelayer.trigger(function () { return _this.toggleEditPreferenceWidgetForMouseMove(mouseMoveEvent); });
    };
    EditSettingRenderer.prototype.getEditPreferenceWidgetUnderMouse = function (mouseMoveEvent) {
        if (mouseMoveEvent.target.type === MouseTargetType.GUTTER_GLYPH_MARGIN) {
            var line = mouseMoveEvent.target.position.lineNumber;
            if (this.editPreferenceWidgetForMouseMove.getLine() === line && this.editPreferenceWidgetForMouseMove.isVisible()) {
                return this.editPreferenceWidgetForMouseMove;
            }
            if (this.editPreferenceWidgetForCursorPosition.getLine() === line && this.editPreferenceWidgetForCursorPosition.isVisible()) {
                return this.editPreferenceWidgetForCursorPosition;
            }
        }
        return null;
    };
    EditSettingRenderer.prototype.toggleEditPreferenceWidgetForMouseMove = function (mouseMoveEvent) {
        var settings = mouseMoveEvent.target.position ? this.getSettings(mouseMoveEvent.target.position.lineNumber) : null;
        if (settings && settings.length) {
            this.showEditPreferencesWidget(this.editPreferenceWidgetForMouseMove, settings);
        }
        else {
            this.editPreferenceWidgetForMouseMove.hide();
        }
    };
    EditSettingRenderer.prototype.showEditPreferencesWidget = function (editPreferencesWidget, settings) {
        var line = settings[0].valueRange.startLineNumber;
        if (this.editor.getConfiguration().viewInfo.glyphMargin && this.marginFreeFromOtherDecorations(line)) {
            editPreferencesWidget.show(line, nls.localize('editTtile', "Edit"), settings);
            var editPreferenceWidgetToHide = editPreferencesWidget === this.editPreferenceWidgetForCursorPosition ? this.editPreferenceWidgetForMouseMove : this.editPreferenceWidgetForCursorPosition;
            editPreferenceWidgetToHide.hide();
        }
    };
    EditSettingRenderer.prototype.marginFreeFromOtherDecorations = function (line) {
        var decorations = this.editor.getLineDecorations(line);
        if (decorations) {
            for (var _i = 0, decorations_1 = decorations; _i < decorations_1.length; _i++) {
                var options = decorations_1[_i].options;
                if (options.glyphMarginClassName && options.glyphMarginClassName.indexOf(EditPreferenceWidget.GLYPH_MARGIN_CLASS_NAME) === -1) {
                    return false;
                }
            }
        }
        return true;
    };
    EditSettingRenderer.prototype.getSettings = function (lineNumber) {
        var _this = this;
        var configurationMap = this.getConfigurationsMap();
        return this.getSettingsAtLineNumber(lineNumber).filter(function (setting) {
            var configurationNode = configurationMap[setting.key];
            if (configurationNode) {
                if (_this.isDefaultSettings()) {
                    if (setting.key === 'launch') {
                        // Do not show because of https://github.com/Microsoft/vscode/issues/32593
                        return false;
                    }
                    return true;
                }
                if (configurationNode.type === 'boolean' || configurationNode.enum) {
                    if (_this.masterSettingsModel.configurationTarget !== 3 /* WORKSPACE_FOLDER */) {
                        return true;
                    }
                    if (configurationNode.scope === 3 /* RESOURCE */) {
                        return true;
                    }
                }
            }
            return false;
        });
    };
    EditSettingRenderer.prototype.getSettingsAtLineNumber = function (lineNumber) {
        // index of setting, across all groups/sections
        var index = 0;
        var settings = [];
        for (var _i = 0, _a = this.settingsGroups; _i < _a.length; _i++) {
            var group = _a[_i];
            if (group.range.startLineNumber > lineNumber) {
                break;
            }
            if (lineNumber >= group.range.startLineNumber && lineNumber <= group.range.endLineNumber) {
                for (var _b = 0, _c = group.sections; _b < _c.length; _b++) {
                    var section = _c[_b];
                    for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                        var setting = _e[_d];
                        if (setting.range.startLineNumber > lineNumber) {
                            break;
                        }
                        if (lineNumber >= setting.range.startLineNumber && lineNumber <= setting.range.endLineNumber) {
                            if (!this.isDefaultSettings() && setting.overrides.length) {
                                // Only one level because override settings cannot have override settings
                                for (var _f = 0, _g = setting.overrides; _f < _g.length; _f++) {
                                    var overrideSetting = _g[_f];
                                    if (lineNumber >= overrideSetting.range.startLineNumber && lineNumber <= overrideSetting.range.endLineNumber) {
                                        settings.push(__assign({}, overrideSetting, { index: index, groupId: group.id }));
                                    }
                                }
                            }
                            else {
                                settings.push(__assign({}, setting, { index: index, groupId: group.id }));
                            }
                        }
                        index++;
                    }
                }
            }
        }
        return settings;
    };
    EditSettingRenderer.prototype.onMouseOver = function (editPreferenceWidget) {
        this.settingHighlighter.highlight(editPreferenceWidget.preferences[0]);
    };
    EditSettingRenderer.prototype.onEditSettingClicked = function (editPreferenceWidget, e) {
        var _this = this;
        var anchor = { x: e.event.posx, y: e.event.posy + 10 };
        var actions = this.getSettings(editPreferenceWidget.getLine()).length === 1 ? this.getActions(editPreferenceWidget.preferences[0], this.getConfigurationsMap()[editPreferenceWidget.preferences[0].key])
            : editPreferenceWidget.preferences.map(function (setting) { return new ContextSubMenu(setting.key, _this.getActions(setting, _this.getConfigurationsMap()[setting.key])); });
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActions: function () { return TPromise.wrap(actions); }
        });
    };
    EditSettingRenderer.prototype.activateOnSetting = function (setting) {
        var _this = this;
        var startLine = setting.keyRange.startLineNumber;
        var settings = this.getSettings(startLine);
        if (!settings.length) {
            return false;
        }
        this.editPreferenceWidgetForMouseMove.show(startLine, '', settings);
        var actions = this.getActions(this.editPreferenceWidgetForMouseMove.preferences[0], this.getConfigurationsMap()[this.editPreferenceWidgetForMouseMove.preferences[0].key]);
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return _this.toAbsoluteCoords(new Position(startLine, 1)); },
            getActions: function () { return TPromise.wrap(actions); }
        });
        return true;
    };
    EditSettingRenderer.prototype.toAbsoluteCoords = function (position) {
        var positionCoords = this.editor.getScrolledVisiblePosition(position);
        var editorCoords = getDomNodePagePosition(this.editor.getDomNode());
        var x = editorCoords.left + positionCoords.left;
        var y = editorCoords.top + positionCoords.top + positionCoords.height;
        return { x: x, y: y + 10 };
    };
    EditSettingRenderer.prototype.getConfigurationsMap = function () {
        return Registry.as(ConfigurationExtensions.Configuration).getConfigurationProperties();
    };
    EditSettingRenderer.prototype.getActions = function (setting, jsonSchema) {
        var _this = this;
        if (jsonSchema.type === 'boolean') {
            return [{
                    id: 'truthyValue',
                    label: 'true',
                    enabled: true,
                    run: function () { return _this.updateSetting(setting.key, true, setting); }
                }, {
                    id: 'falsyValue',
                    label: 'false',
                    enabled: true,
                    run: function () { return _this.updateSetting(setting.key, false, setting); }
                }];
        }
        if (jsonSchema.enum) {
            return jsonSchema.enum.map(function (value) {
                return {
                    id: value,
                    label: JSON.stringify(value),
                    enabled: true,
                    run: function () { return _this.updateSetting(setting.key, value, setting); }
                };
            });
        }
        return this.getDefaultActions(setting);
    };
    EditSettingRenderer.prototype.getDefaultActions = function (setting) {
        var _this = this;
        if (this.isDefaultSettings()) {
            var settingInOtherModel = this.associatedPreferencesModel.getPreference(setting.key);
            return [{
                    id: 'setDefaultValue',
                    label: settingInOtherModel ? nls.localize('replaceDefaultValue', "Replace in Settings") : nls.localize('copyDefaultValue', "Copy to Settings"),
                    enabled: true,
                    run: function () { return _this.updateSetting(setting.key, setting.value, setting); }
                }];
        }
        return [];
    };
    EditSettingRenderer.prototype.updateSetting = function (key, value, source) {
        this._onUpdateSetting.fire({ key: key, value: value, source: source });
    };
    EditSettingRenderer = __decorate([
        __param(3, IInstantiationService),
        __param(4, IContextMenuService)
    ], EditSettingRenderer);
    return EditSettingRenderer;
}(Disposable));
var SettingHighlighter = /** @class */ (function (_super) {
    __extends(SettingHighlighter, _super);
    function SettingHighlighter(editor, focusEventEmitter, clearFocusEventEmitter, instantiationService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.focusEventEmitter = focusEventEmitter;
        _this.clearFocusEventEmitter = clearFocusEventEmitter;
        _this.fixedHighlighter = _this._register(instantiationService.createInstance(RangeHighlightDecorations));
        _this.volatileHighlighter = _this._register(instantiationService.createInstance(RangeHighlightDecorations));
        _this.fixedHighlighter.onHighlghtRemoved(function () { return _this.clearFocusEventEmitter.fire(_this.highlightedSetting); });
        _this.volatileHighlighter.onHighlghtRemoved(function () { return _this.clearFocusEventEmitter.fire(_this.highlightedSetting); });
        return _this;
    }
    SettingHighlighter.prototype.highlight = function (setting, fix) {
        if (fix === void 0) { fix = false; }
        this.highlightedSetting = setting;
        this.volatileHighlighter.removeHighlightRange();
        this.fixedHighlighter.removeHighlightRange();
        var highlighter = fix ? this.fixedHighlighter : this.volatileHighlighter;
        highlighter.highlightRange({
            range: setting.valueRange,
            resource: this.editor.getModel().uri
        }, this.editor);
        this.editor.revealLineInCenterIfOutsideViewport(setting.valueRange.startLineNumber, 0 /* Smooth */);
        this.focusEventEmitter.fire(setting);
    };
    SettingHighlighter.prototype.clear = function (fix) {
        if (fix === void 0) { fix = false; }
        this.volatileHighlighter.removeHighlightRange();
        if (fix) {
            this.fixedHighlighter.removeHighlightRange();
        }
        this.clearFocusEventEmitter.fire(this.highlightedSetting);
    };
    SettingHighlighter = __decorate([
        __param(3, IInstantiationService)
    ], SettingHighlighter);
    return SettingHighlighter;
}(Disposable));
var WorkspaceConfigurationRenderer = /** @class */ (function (_super) {
    __extends(WorkspaceConfigurationRenderer, _super);
    function WorkspaceConfigurationRenderer(editor, workspaceSettingsEditorModel, workspaceContextService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.workspaceSettingsEditorModel = workspaceSettingsEditorModel;
        _this.workspaceContextService = workspaceContextService;
        _this.decorationIds = [];
        _this.renderingDelayer = new Delayer(200);
        _this._register(_this.editor.getModel().onDidChangeContent(function () { return _this.renderingDelayer.trigger(function () { return _this.render(_this.associatedSettingsEditorModel); }); }));
        return _this;
    }
    WorkspaceConfigurationRenderer.prototype.render = function (associatedSettingsEditorModel) {
        var _this = this;
        this.associatedSettingsEditorModel = associatedSettingsEditorModel;
        // Dim other configurations in workspace configuration file only in the context of Settings Editor
        if (this.associatedSettingsEditorModel && this.workspaceContextService.getWorkbenchState() === 3 /* WORKSPACE */ && this.workspaceSettingsEditorModel instanceof WorkspaceConfigurationEditorModel) {
            var ranges = [];
            for (var _i = 0, _a = this.workspaceSettingsEditorModel.configurationGroups; _i < _a.length; _i++) {
                var settingsGroup = _a[_i];
                for (var _b = 0, _c = settingsGroup.sections; _b < _c.length; _b++) {
                    var section = _c[_b];
                    for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                        var setting = _e[_d];
                        if (setting.key !== 'settings') {
                            ranges.push({
                                startLineNumber: setting.keyRange.startLineNumber,
                                startColumn: setting.keyRange.startColumn - 1,
                                endLineNumber: setting.valueRange.endLineNumber,
                                endColumn: setting.valueRange.endColumn
                            });
                        }
                    }
                }
            }
            this.decorationIds = this.editor.deltaDecorations(this.decorationIds, ranges.map(function (range) { return _this.createDecoration(range, _this.editor.getModel()); }));
        }
    };
    WorkspaceConfigurationRenderer.prototype.createDecoration = function (range, model) {
        return {
            range: range,
            options: WorkspaceConfigurationRenderer._DIM_CONFIGURATION_
        };
    };
    WorkspaceConfigurationRenderer.prototype.dispose = function () {
        this.decorationIds = this.editor.deltaDecorations(this.decorationIds, []);
        _super.prototype.dispose.call(this);
    };
    WorkspaceConfigurationRenderer._DIM_CONFIGURATION_ = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        inlineClassName: 'dim-configuration'
    });
    WorkspaceConfigurationRenderer = __decorate([
        __param(2, IWorkspaceContextService)
    ], WorkspaceConfigurationRenderer);
    return WorkspaceConfigurationRenderer;
}(Disposable));
