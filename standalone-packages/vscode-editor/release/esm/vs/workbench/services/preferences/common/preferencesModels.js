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
import { flatten, tail, find } from '../../../../base/common/arrays.js';
import { Emitter } from '../../../../base/common/event.js';
import { visit } from '../../../../base/common/json.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as map from '../../../../base/common/map.js';
import { assign } from '../../../../base/common/objects.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions, OVERRIDE_PROPERTY_PATTERN } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorModel } from '../../../common/editor.js';
var AbstractSettingsModel = /** @class */ (function (_super) {
    __extends(AbstractSettingsModel, _super);
    function AbstractSettingsModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._currentResultGroups = new Map();
        return _this;
    }
    AbstractSettingsModel.prototype.updateResultGroup = function (id, resultGroup) {
        if (resultGroup) {
            this._currentResultGroups.set(id, resultGroup);
        }
        else {
            this._currentResultGroups.delete(id);
        }
        this.removeDuplicateResults();
        return this.update();
    };
    /**
     * Remove duplicates between result groups, preferring results in earlier groups
     */
    AbstractSettingsModel.prototype.removeDuplicateResults = function () {
        var _this = this;
        var settingKeys = new Set();
        map.keys(this._currentResultGroups)
            .sort(function (a, b) { return _this._currentResultGroups.get(a).order - _this._currentResultGroups.get(b).order; })
            .forEach(function (groupId) {
            var group = _this._currentResultGroups.get(groupId);
            group.result.filterMatches = group.result.filterMatches.filter(function (s) { return !settingKeys.has(s.setting.key); });
            group.result.filterMatches.forEach(function (s) { return settingKeys.add(s.setting.key); });
        });
    };
    AbstractSettingsModel.prototype.filterSettings = function (filter, groupFilter, settingMatcher) {
        var allGroups = this.filterGroups;
        var filterMatches = [];
        for (var _i = 0, allGroups_1 = allGroups; _i < allGroups_1.length; _i++) {
            var group = allGroups_1[_i];
            var groupMatched = groupFilter(group);
            for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                var section = _b[_a];
                for (var _c = 0, _d = section.settings; _c < _d.length; _c++) {
                    var setting = _d[_c];
                    var settingMatchResult = settingMatcher(setting, group);
                    if (groupMatched || settingMatchResult) {
                        filterMatches.push({
                            setting: setting,
                            matches: settingMatchResult && settingMatchResult.matches,
                            score: settingMatchResult ? settingMatchResult.score : 0
                        });
                    }
                }
            }
        }
        return filterMatches.sort(function (a, b) { return b.score - a.score; });
    };
    AbstractSettingsModel.prototype.getPreference = function (key) {
        for (var _i = 0, _a = this.settingsGroups; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.sections; _b < _c.length; _b++) {
                var section = _c[_b];
                for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                    var setting = _e[_d];
                    if (key === setting.key) {
                        return setting;
                    }
                }
            }
        }
        return null;
    };
    AbstractSettingsModel.prototype.collectMetadata = function (groups) {
        var metadata = Object.create(null);
        var hasMetadata = false;
        groups.forEach(function (g) {
            if (g.result.metadata) {
                metadata[g.id] = g.result.metadata;
                hasMetadata = true;
            }
        });
        return hasMetadata ? metadata : null;
    };
    Object.defineProperty(AbstractSettingsModel.prototype, "filterGroups", {
        get: function () {
            return this.settingsGroups;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractSettingsModel;
}(EditorModel));
export { AbstractSettingsModel };
var SettingsEditorModel = /** @class */ (function (_super) {
    __extends(SettingsEditorModel, _super);
    function SettingsEditorModel(reference, _configurationTarget) {
        var _this = _super.call(this) || this;
        _this._configurationTarget = _configurationTarget;
        _this._onDidChangeGroups = _this._register(new Emitter());
        _this.onDidChangeGroups = _this._onDidChangeGroups.event;
        _this.settingsModel = reference.object.textEditorModel;
        _this._register(_this.onDispose(function () { return reference.dispose(); }));
        _this._register(_this.settingsModel.onDidChangeContent(function () {
            _this._settingsGroups = null;
            _this._onDidChangeGroups.fire();
        }));
        return _this;
    }
    Object.defineProperty(SettingsEditorModel.prototype, "uri", {
        get: function () {
            return this.settingsModel.uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsEditorModel.prototype, "configurationTarget", {
        get: function () {
            return this._configurationTarget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsEditorModel.prototype, "settingsGroups", {
        get: function () {
            if (!this._settingsGroups) {
                this.parse();
            }
            return this._settingsGroups;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsEditorModel.prototype, "content", {
        get: function () {
            return this.settingsModel.getValue();
        },
        enumerable: true,
        configurable: true
    });
    SettingsEditorModel.prototype.findValueMatches = function (filter, setting) {
        return this.settingsModel.findMatches(filter, setting.valueRange, false, false, null, false).map(function (match) { return match.range; });
    };
    SettingsEditorModel.prototype.isSettingsProperty = function (property, previousParents) {
        return previousParents.length === 0; // Settings is root
    };
    SettingsEditorModel.prototype.parse = function () {
        var _this = this;
        this._settingsGroups = parse(this.settingsModel, function (property, previousParents) { return _this.isSettingsProperty(property, previousParents); });
    };
    SettingsEditorModel.prototype.update = function () {
        var resultGroups = map.values(this._currentResultGroups);
        if (!resultGroups.length) {
            return null;
        }
        // Transform resultGroups into IFilterResult - ISetting ranges are already correct here
        var filteredSettings = [];
        var matches = [];
        resultGroups.forEach(function (group) {
            group.result.filterMatches.forEach(function (filterMatch) {
                filteredSettings.push(filterMatch.setting);
                matches.push.apply(matches, filterMatch.matches);
            });
        });
        var filteredGroup;
        var modelGroup = this.settingsGroups[0]; // Editable model has one or zero groups
        if (modelGroup) {
            filteredGroup = {
                id: modelGroup.id,
                range: modelGroup.range,
                sections: [{
                        settings: filteredSettings
                    }],
                title: modelGroup.title,
                titleRange: modelGroup.titleRange,
                contributedByExtension: !!modelGroup.contributedByExtension
            };
        }
        var metadata = this.collectMetadata(resultGroups);
        return {
            allGroups: this.settingsGroups,
            filteredGroups: filteredGroup ? [filteredGroup] : [],
            matches: matches,
            metadata: metadata
        };
    };
    return SettingsEditorModel;
}(AbstractSettingsModel));
export { SettingsEditorModel };
var Settings2EditorModel = /** @class */ (function (_super) {
    __extends(Settings2EditorModel, _super);
    function Settings2EditorModel(_defaultSettings, configurationService) {
        var _this = _super.call(this) || this;
        _this._defaultSettings = _defaultSettings;
        _this._onDidChangeGroups = _this._register(new Emitter());
        _this.onDidChangeGroups = _this._onDidChangeGroups.event;
        _this.dirty = false;
        configurationService.onDidChangeConfiguration(function (e) {
            if (e.source === 4 /* DEFAULT */) {
                _this.dirty = true;
                _this._onDidChangeGroups.fire();
            }
        });
        return _this;
    }
    Object.defineProperty(Settings2EditorModel.prototype, "filterGroups", {
        get: function () {
            // Don't filter "commonly used"
            return this.settingsGroups.slice(1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings2EditorModel.prototype, "settingsGroups", {
        get: function () {
            var groups = this._defaultSettings.getSettingsGroups(this.dirty);
            this.dirty = false;
            return groups;
        },
        enumerable: true,
        configurable: true
    });
    Settings2EditorModel.prototype.findValueMatches = function (filter, setting) {
        // TODO @roblou
        return [];
    };
    Settings2EditorModel.prototype.update = function () {
        throw new Error('Not supported');
    };
    Settings2EditorModel = __decorate([
        __param(1, IConfigurationService)
    ], Settings2EditorModel);
    return Settings2EditorModel;
}(AbstractSettingsModel));
export { Settings2EditorModel };
function parse(model, isSettingsProperty) {
    var settings = [];
    var overrideSetting = null;
    var currentProperty = null;
    var currentParent = [];
    var previousParents = [];
    var settingsPropertyIndex = -1;
    var range = {
        startLineNumber: 0,
        startColumn: 0,
        endLineNumber: 0,
        endColumn: 0
    };
    function onValue(value, offset, length) {
        if (Array.isArray(currentParent)) {
            currentParent.push(value);
        }
        else if (currentProperty) {
            currentParent[currentProperty] = value;
        }
        if (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null)) {
            // settings value started
            var setting = previousParents.length === settingsPropertyIndex + 1 ? settings[settings.length - 1] : overrideSetting.overrides[overrideSetting.overrides.length - 1];
            if (setting) {
                var valueStartPosition = model.getPositionAt(offset);
                var valueEndPosition = model.getPositionAt(offset + length);
                setting.value = value;
                setting.valueRange = {
                    startLineNumber: valueStartPosition.lineNumber,
                    startColumn: valueStartPosition.column,
                    endLineNumber: valueEndPosition.lineNumber,
                    endColumn: valueEndPosition.column
                };
                setting.range = assign(setting.range, {
                    endLineNumber: valueEndPosition.lineNumber,
                    endColumn: valueEndPosition.column
                });
            }
        }
    }
    var visitor = {
        onObjectBegin: function (offset, length) {
            if (isSettingsProperty(currentProperty, previousParents)) {
                // Settings started
                settingsPropertyIndex = previousParents.length;
                var position = model.getPositionAt(offset);
                range.startLineNumber = position.lineNumber;
                range.startColumn = position.column;
            }
            var object = {};
            onValue(object, offset, length);
            currentParent = object;
            currentProperty = null;
            previousParents.push(currentParent);
        },
        onObjectProperty: function (name, offset, length) {
            currentProperty = name;
            if (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null)) {
                // setting started
                var settingStartPosition = model.getPositionAt(offset);
                var setting = {
                    description: [],
                    descriptionIsMarkdown: false,
                    key: name,
                    keyRange: {
                        startLineNumber: settingStartPosition.lineNumber,
                        startColumn: settingStartPosition.column + 1,
                        endLineNumber: settingStartPosition.lineNumber,
                        endColumn: settingStartPosition.column + length
                    },
                    range: {
                        startLineNumber: settingStartPosition.lineNumber,
                        startColumn: settingStartPosition.column,
                        endLineNumber: 0,
                        endColumn: 0
                    },
                    value: null,
                    valueRange: null,
                    descriptionRanges: null,
                    overrides: [],
                    overrideOf: overrideSetting
                };
                if (previousParents.length === settingsPropertyIndex + 1) {
                    settings.push(setting);
                    if (OVERRIDE_PROPERTY_PATTERN.test(name)) {
                        overrideSetting = setting;
                    }
                }
                else {
                    overrideSetting.overrides.push(setting);
                }
            }
        },
        onObjectEnd: function (offset, length) {
            currentParent = previousParents.pop();
            if (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null)) {
                // setting ended
                var setting = previousParents.length === settingsPropertyIndex + 1 ? settings[settings.length - 1] : overrideSetting.overrides[overrideSetting.overrides.length - 1];
                if (setting) {
                    var valueEndPosition = model.getPositionAt(offset + length);
                    setting.valueRange = assign(setting.valueRange, {
                        endLineNumber: valueEndPosition.lineNumber,
                        endColumn: valueEndPosition.column
                    });
                    setting.range = assign(setting.range, {
                        endLineNumber: valueEndPosition.lineNumber,
                        endColumn: valueEndPosition.column
                    });
                }
                if (previousParents.length === settingsPropertyIndex + 1) {
                    overrideSetting = null;
                }
            }
            if (previousParents.length === settingsPropertyIndex) {
                // settings ended
                var position = model.getPositionAt(offset);
                range.endLineNumber = position.lineNumber;
                range.endColumn = position.column;
            }
        },
        onArrayBegin: function (offset, length) {
            var array = [];
            onValue(array, offset, length);
            previousParents.push(currentParent);
            currentParent = array;
            currentProperty = null;
        },
        onArrayEnd: function (offset, length) {
            currentParent = previousParents.pop();
            if (previousParents.length === settingsPropertyIndex + 1 || (previousParents.length === settingsPropertyIndex + 2 && overrideSetting !== null)) {
                // setting value ended
                var setting = previousParents.length === settingsPropertyIndex + 1 ? settings[settings.length - 1] : overrideSetting.overrides[overrideSetting.overrides.length - 1];
                if (setting) {
                    var valueEndPosition = model.getPositionAt(offset + length);
                    setting.valueRange = assign(setting.valueRange, {
                        endLineNumber: valueEndPosition.lineNumber,
                        endColumn: valueEndPosition.column
                    });
                    setting.range = assign(setting.range, {
                        endLineNumber: valueEndPosition.lineNumber,
                        endColumn: valueEndPosition.column
                    });
                }
            }
        },
        onLiteralValue: onValue,
        onError: function (error) {
            var setting = settings[settings.length - 1];
            if (setting && (!setting.range || !setting.keyRange || !setting.valueRange)) {
                settings.pop();
            }
        }
    };
    if (!model.isDisposed()) {
        visit(model.getValue(), visitor);
    }
    return settings.length > 0 ? [{
            sections: [
                {
                    settings: settings
                }
            ],
            title: null,
            titleRange: null,
            range: range
        }] : [];
}
var WorkspaceConfigurationEditorModel = /** @class */ (function (_super) {
    __extends(WorkspaceConfigurationEditorModel, _super);
    function WorkspaceConfigurationEditorModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(WorkspaceConfigurationEditorModel.prototype, "configurationGroups", {
        get: function () {
            return this._configurationGroups;
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceConfigurationEditorModel.prototype.parse = function () {
        _super.prototype.parse.call(this);
        this._configurationGroups = parse(this.settingsModel, function (property, previousParents) { return previousParents.length === 0; });
    };
    WorkspaceConfigurationEditorModel.prototype.isSettingsProperty = function (property, previousParents) {
        return property === 'settings' && previousParents.length === 1;
    };
    return WorkspaceConfigurationEditorModel;
}(SettingsEditorModel));
export { WorkspaceConfigurationEditorModel };
var DefaultSettings = /** @class */ (function (_super) {
    __extends(DefaultSettings, _super);
    function DefaultSettings(_mostCommonlyUsedSettingsKeys, target) {
        var _this = _super.call(this) || this;
        _this._mostCommonlyUsedSettingsKeys = _mostCommonlyUsedSettingsKeys;
        _this.target = target;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        return _this;
    }
    DefaultSettings.prototype.getContent = function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (!this._content || forceUpdate) {
            this._content = this.toContent(true, this.getSettingsGroups(forceUpdate));
        }
        return this._content;
    };
    DefaultSettings.prototype.getSettingsGroups = function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (!this._allSettingsGroups || forceUpdate) {
            this._allSettingsGroups = this.parse();
        }
        return this._allSettingsGroups;
    };
    DefaultSettings.prototype.parse = function () {
        var settingsGroups = this.getRegisteredGroups();
        this.initAllSettingsMap(settingsGroups);
        var mostCommonlyUsed = this.getMostCommonlyUsedSettings(settingsGroups);
        return [mostCommonlyUsed].concat(settingsGroups);
    };
    Object.defineProperty(DefaultSettings.prototype, "raw", {
        get: function () {
            if (!DefaultSettings._RAW) {
                DefaultSettings._RAW = this.toContent(false, this.getRegisteredGroups());
            }
            return DefaultSettings._RAW;
        },
        enumerable: true,
        configurable: true
    });
    DefaultSettings.prototype.getRegisteredGroups = function () {
        var _this = this;
        var configurations = Registry.as(Extensions.Configuration).getConfigurations().slice();
        var groups = this.removeEmptySettingsGroups(configurations.sort(this.compareConfigurationNodes)
            .reduce(function (result, config, index, array) { return _this.parseConfig(config, result, array); }, []));
        return this.sortGroups(groups);
    };
    DefaultSettings.prototype.sortGroups = function (groups) {
        groups.forEach(function (group) {
            group.sections.forEach(function (section) {
                section.settings.sort(function (a, b) { return a.key.localeCompare(b.key); });
            });
        });
        return groups;
    };
    DefaultSettings.prototype.initAllSettingsMap = function (allSettingsGroups) {
        this._settingsByName = new Map();
        for (var _i = 0, allSettingsGroups_1 = allSettingsGroups; _i < allSettingsGroups_1.length; _i++) {
            var group = allSettingsGroups_1[_i];
            for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                var section = _b[_a];
                for (var _c = 0, _d = section.settings; _c < _d.length; _c++) {
                    var setting = _d[_c];
                    this._settingsByName.set(setting.key, setting);
                }
            }
        }
    };
    DefaultSettings.prototype.getMostCommonlyUsedSettings = function (allSettingsGroups) {
        var _this = this;
        var settings = this._mostCommonlyUsedSettingsKeys.map(function (key) {
            var setting = _this._settingsByName.get(key);
            if (setting) {
                return {
                    description: setting.description,
                    key: setting.key,
                    value: setting.value,
                    range: null,
                    valueRange: null,
                    overrides: [],
                    scope: 3 /* RESOURCE */,
                    type: setting.type,
                    enum: setting.enum,
                    enumDescriptions: setting.enumDescriptions
                };
            }
            return null;
        }).filter(function (setting) { return !!setting; });
        return {
            id: 'mostCommonlyUsed',
            range: null,
            title: nls.localize('commonlyUsed', "Commonly Used"),
            titleRange: null,
            sections: [
                {
                    settings: settings
                }
            ]
        };
    };
    DefaultSettings.prototype.parseConfig = function (config, result, configurations, settingsGroup, seenSettings) {
        var _this = this;
        seenSettings = seenSettings ? seenSettings : {};
        var title = config.title;
        if (!title) {
            var configWithTitleAndSameId = find(configurations, function (c) { return (c.id === config.id) && c.title; });
            if (configWithTitleAndSameId) {
                title = configWithTitleAndSameId.title;
            }
        }
        if (title) {
            if (!settingsGroup) {
                settingsGroup = find(result, function (g) { return g.title === title; });
                if (!settingsGroup) {
                    settingsGroup = { sections: [{ settings: [] }], id: config.id, title: title, titleRange: null, range: null, contributedByExtension: !!config.contributedByExtension };
                    result.push(settingsGroup);
                }
            }
            else {
                settingsGroup.sections[settingsGroup.sections.length - 1].title = title;
            }
        }
        if (config.properties) {
            if (!settingsGroup) {
                settingsGroup = { sections: [{ settings: [] }], id: config.id, title: config.id, titleRange: null, range: null, contributedByExtension: !!config.contributedByExtension };
                result.push(settingsGroup);
            }
            var configurationSettings = [];
            for (var _i = 0, _a = settingsGroup.sections[settingsGroup.sections.length - 1].settings.concat(this.parseSettings(config.properties)); _i < _a.length; _i++) {
                var setting = _a[_i];
                if (!seenSettings[setting.key]) {
                    configurationSettings.push(setting);
                    seenSettings[setting.key] = true;
                }
            }
            if (configurationSettings.length) {
                settingsGroup.sections[settingsGroup.sections.length - 1].settings = configurationSettings;
            }
        }
        if (config.allOf) {
            config.allOf.forEach(function (c) { return _this.parseConfig(c, result, configurations, settingsGroup, seenSettings); });
        }
        return result;
    };
    DefaultSettings.prototype.removeEmptySettingsGroups = function (settingsGroups) {
        var result = [];
        for (var _i = 0, settingsGroups_1 = settingsGroups; _i < settingsGroups_1.length; _i++) {
            var settingsGroup = settingsGroups_1[_i];
            settingsGroup.sections = settingsGroup.sections.filter(function (section) { return section.settings.length > 0; });
            if (settingsGroup.sections.length) {
                result.push(settingsGroup);
            }
        }
        return result;
    };
    DefaultSettings.prototype.parseSettings = function (settingsObject) {
        var result = [];
        for (var key in settingsObject) {
            var prop = settingsObject[key];
            if (this.matchesScope(prop)) {
                var value = prop.default;
                var description = (prop.description || prop.markdownDescription || '').split('\n');
                var overrides = OVERRIDE_PROPERTY_PATTERN.test(key) ? this.parseOverrideSettings(prop.default) : [];
                result.push({
                    key: key,
                    value: value,
                    description: description,
                    descriptionIsMarkdown: !prop.description,
                    range: null,
                    keyRange: null,
                    valueRange: null,
                    descriptionRanges: [],
                    overrides: overrides,
                    scope: prop.scope,
                    type: prop.type,
                    enum: prop.enum,
                    enumDescriptions: prop.enumDescriptions || prop.markdownEnumDescriptions,
                    enumDescriptionsAreMarkdown: !prop.enumDescriptions,
                    tags: prop.tags,
                    deprecationMessage: prop.deprecationMessage,
                    validator: createValidator(prop)
                });
            }
        }
        return result;
    };
    DefaultSettings.prototype.parseOverrideSettings = function (overrideSettings) {
        return Object.keys(overrideSettings).map(function (key) { return ({
            key: key,
            value: overrideSettings[key],
            description: [],
            descriptionIsMarkdown: false,
            range: null,
            keyRange: null,
            valueRange: null,
            descriptionRanges: [],
            overrides: []
        }); });
    };
    DefaultSettings.prototype.matchesScope = function (property) {
        if (this.target === 3 /* WORKSPACE_FOLDER */) {
            return property.scope === 3 /* RESOURCE */;
        }
        if (this.target === 2 /* WORKSPACE */) {
            return property.scope === 2 /* WINDOW */ || property.scope === 3 /* RESOURCE */;
        }
        return true;
    };
    DefaultSettings.prototype.compareConfigurationNodes = function (c1, c2) {
        if (typeof c1.order !== 'number') {
            return 1;
        }
        if (typeof c2.order !== 'number') {
            return -1;
        }
        if (c1.order === c2.order) {
            var title1 = c1.title || '';
            var title2 = c2.title || '';
            return title1.localeCompare(title2);
        }
        return c1.order - c2.order;
    };
    DefaultSettings.prototype.toContent = function (asArray, settingsGroups) {
        var builder = new SettingsContentBuilder();
        if (asArray) {
            builder.pushLine('[');
        }
        settingsGroups.forEach(function (settingsGroup, i) {
            builder.pushGroup(settingsGroup);
            builder.pushLine(',');
        });
        if (asArray) {
            builder.pushLine(']');
        }
        return builder.getContent();
    };
    return DefaultSettings;
}(Disposable));
export { DefaultSettings };
var DefaultSettingsEditorModel = /** @class */ (function (_super) {
    __extends(DefaultSettingsEditorModel, _super);
    function DefaultSettingsEditorModel(_uri, reference, defaultSettings) {
        var _this = _super.call(this) || this;
        _this._uri = _uri;
        _this.defaultSettings = defaultSettings;
        _this._onDidChangeGroups = _this._register(new Emitter());
        _this.onDidChangeGroups = _this._onDidChangeGroups.event;
        _this._register(defaultSettings.onDidChange(function () { return _this._onDidChangeGroups.fire(); }));
        _this._model = reference.object.textEditorModel;
        _this._register(_this.onDispose(function () { return reference.dispose(); }));
        return _this;
    }
    Object.defineProperty(DefaultSettingsEditorModel.prototype, "uri", {
        get: function () {
            return this._uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultSettingsEditorModel.prototype, "target", {
        get: function () {
            return this.defaultSettings.target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultSettingsEditorModel.prototype, "settingsGroups", {
        get: function () {
            return this.defaultSettings.getSettingsGroups();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultSettingsEditorModel.prototype, "filterGroups", {
        get: function () {
            // Don't look at "commonly used" for filter
            return this.settingsGroups.slice(1);
        },
        enumerable: true,
        configurable: true
    });
    DefaultSettingsEditorModel.prototype.update = function () {
        // Grab current result groups, only render non-empty groups
        var resultGroups = map
            .values(this._currentResultGroups)
            .sort(function (a, b) { return a.order - b.order; });
        var nonEmptyResultGroups = resultGroups.filter(function (group) { return group.result.filterMatches.length; });
        var startLine = tail(this.settingsGroups).range.endLineNumber + 2;
        var _a = this.writeResultGroups(nonEmptyResultGroups, startLine), filteredGroups = _a.settingsGroups, matches = _a.matches;
        var metadata = this.collectMetadata(resultGroups);
        return resultGroups.length ?
            {
                allGroups: this.settingsGroups,
                filteredGroups: filteredGroups,
                matches: matches,
                metadata: metadata
            } :
            null;
    };
    /**
     * Translate the ISearchResultGroups to text, and write it to the editor model
     */
    DefaultSettingsEditorModel.prototype.writeResultGroups = function (groups, startLine) {
        var _this = this;
        var contentBuilderOffset = startLine - 1;
        var builder = new SettingsContentBuilder(contentBuilderOffset);
        var settingsGroups = [];
        var matches = [];
        builder.pushLine(',');
        groups.forEach(function (resultGroup) {
            var settingsGroup = _this.getGroup(resultGroup);
            settingsGroups.push(settingsGroup);
            matches.push.apply(matches, _this.writeSettingsGroupToBuilder(builder, settingsGroup, resultGroup.result.filterMatches));
        });
        // note: 1-indexed line numbers here
        var groupContent = builder.getContent() + '\n';
        var groupEndLine = this._model.getLineCount();
        var cursorPosition = new Selection(startLine, 1, startLine, 1);
        var edit = {
            text: groupContent,
            forceMoveMarkers: true,
            range: new Range(startLine, 1, groupEndLine, 1),
            identifier: { major: 1, minor: 0 }
        };
        this._model.pushEditOperations([cursorPosition], [edit], function () { return [cursorPosition]; });
        // Force tokenization now - otherwise it may be slightly delayed, causing a flash of white text
        var tokenizeTo = Math.min(startLine + 60, this._model.getLineCount());
        this._model.forceTokenization(tokenizeTo);
        return { matches: matches, settingsGroups: settingsGroups };
    };
    DefaultSettingsEditorModel.prototype.writeSettingsGroupToBuilder = function (builder, settingsGroup, filterMatches) {
        filterMatches = filterMatches
            .map(function (filteredMatch) {
            // Fix match ranges to offset from setting start line
            return {
                setting: filteredMatch.setting,
                score: filteredMatch.score,
                matches: filteredMatch.matches && filteredMatch.matches.map(function (match) {
                    return new Range(match.startLineNumber - filteredMatch.setting.range.startLineNumber, match.startColumn, match.endLineNumber - filteredMatch.setting.range.startLineNumber, match.endColumn);
                })
            };
        });
        builder.pushGroup(settingsGroup);
        builder.pushLine(',');
        // builder has rewritten settings ranges, fix match ranges
        var fixedMatches = flatten(filterMatches
            .map(function (m) { return m.matches || []; })
            .map(function (settingMatches, i) {
            var setting = settingsGroup.sections[0].settings[i];
            return settingMatches.map(function (range) {
                return new Range(range.startLineNumber + setting.range.startLineNumber, range.startColumn, range.endLineNumber + setting.range.startLineNumber, range.endColumn);
            });
        }));
        return fixedMatches;
    };
    DefaultSettingsEditorModel.prototype.copySetting = function (setting) {
        return {
            description: setting.description,
            scope: setting.scope,
            type: setting.type,
            enum: setting.enum,
            enumDescriptions: setting.enumDescriptions,
            key: setting.key,
            value: setting.value,
            range: setting.range,
            overrides: [],
            overrideOf: setting.overrideOf,
            tags: setting.tags,
            deprecationMessage: setting.deprecationMessage,
            keyRange: undefined,
            valueRange: undefined,
            descriptionIsMarkdown: undefined,
            descriptionRanges: undefined
        };
    };
    DefaultSettingsEditorModel.prototype.findValueMatches = function (filter, setting) {
        return [];
    };
    DefaultSettingsEditorModel.prototype.getPreference = function (key) {
        for (var _i = 0, _a = this.settingsGroups; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.sections; _b < _c.length; _b++) {
                var section = _c[_b];
                for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                    var setting = _e[_d];
                    if (setting.key === key) {
                        return setting;
                    }
                }
            }
        }
        return null;
    };
    DefaultSettingsEditorModel.prototype.getGroup = function (resultGroup) {
        var _this = this;
        return {
            id: resultGroup.id,
            range: null,
            title: resultGroup.label,
            titleRange: null,
            sections: [
                {
                    settings: resultGroup.result.filterMatches.map(function (m) { return _this.copySetting(m.setting); })
                }
            ]
        };
    };
    return DefaultSettingsEditorModel;
}(AbstractSettingsModel));
export { DefaultSettingsEditorModel };
var SettingsContentBuilder = /** @class */ (function () {
    function SettingsContentBuilder(_rangeOffset) {
        if (_rangeOffset === void 0) { _rangeOffset = 0; }
        this._rangeOffset = _rangeOffset;
        this._contentByLines = [];
    }
    Object.defineProperty(SettingsContentBuilder.prototype, "lineCountWithOffset", {
        get: function () {
            return this._contentByLines.length + this._rangeOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsContentBuilder.prototype, "lastLine", {
        get: function () {
            return this._contentByLines[this._contentByLines.length - 1] || '';
        },
        enumerable: true,
        configurable: true
    });
    SettingsContentBuilder.prototype.offsetIndexToIndex = function (offsetIdx) {
        return offsetIdx - this._rangeOffset;
    };
    SettingsContentBuilder.prototype.pushLine = function () {
        var lineText = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lineText[_i] = arguments[_i];
        }
        var _a;
        (_a = this._contentByLines).push.apply(_a, lineText);
    };
    SettingsContentBuilder.prototype.pushGroup = function (settingsGroups) {
        this._contentByLines.push('{');
        this._contentByLines.push('');
        this._contentByLines.push('');
        var lastSetting = this._pushGroup(settingsGroups);
        if (lastSetting) {
            // Strip the comma from the last setting
            var lineIdx = this.offsetIndexToIndex(lastSetting.range.endLineNumber);
            var content = this._contentByLines[lineIdx - 2];
            this._contentByLines[lineIdx - 2] = content.substring(0, content.length - 1);
        }
        this._contentByLines.push('}');
    };
    SettingsContentBuilder.prototype._pushGroup = function (group) {
        var indent = '  ';
        var lastSetting = null;
        var groupStart = this.lineCountWithOffset + 1;
        for (var _i = 0, _a = group.sections; _i < _a.length; _i++) {
            var section = _a[_i];
            if (section.title) {
                var sectionTitleStart = this.lineCountWithOffset + 1;
                this.addDescription([section.title], indent, this._contentByLines);
                section.titleRange = { startLineNumber: sectionTitleStart, startColumn: 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length };
            }
            if (section.settings.length) {
                for (var _b = 0, _c = section.settings; _b < _c.length; _b++) {
                    var setting = _c[_b];
                    this.pushSetting(setting, indent);
                    lastSetting = setting;
                }
            }
        }
        group.range = { startLineNumber: groupStart, startColumn: 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length };
        return lastSetting;
    };
    SettingsContentBuilder.prototype.getContent = function () {
        return this._contentByLines.join('\n');
    };
    SettingsContentBuilder.prototype.pushSetting = function (setting, indent) {
        var settingStart = this.lineCountWithOffset + 1;
        this.pushSettingDescription(setting, indent);
        var preValueContent = indent;
        var keyString = JSON.stringify(setting.key);
        preValueContent += keyString;
        setting.keyRange = { startLineNumber: this.lineCountWithOffset + 1, startColumn: preValueContent.indexOf(setting.key) + 1, endLineNumber: this.lineCountWithOffset + 1, endColumn: setting.key.length };
        preValueContent += ': ';
        var valueStart = this.lineCountWithOffset + 1;
        this.pushValue(setting, preValueContent, indent);
        setting.valueRange = { startLineNumber: valueStart, startColumn: preValueContent.length + 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length + 1 };
        this._contentByLines[this._contentByLines.length - 1] += ',';
        this._contentByLines.push('');
        setting.range = { startLineNumber: settingStart, startColumn: 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length };
    };
    SettingsContentBuilder.prototype.pushSettingDescription = function (setting, indent) {
        var _this = this;
        var fixSettingLink = function (line) { return line.replace(/`#(.*)#`/g, function (match, settingName) { return "`" + settingName + "`"; }); };
        setting.descriptionRanges = [];
        var descriptionPreValue = indent + '// ';
        for (var _i = 0, _a = (setting.deprecationMessage ? [setting.deprecationMessage].concat(setting.description) : setting.description); _i < _a.length; _i++) {
            var line = _a[_i];
            line = fixSettingLink(line);
            this._contentByLines.push(descriptionPreValue + line);
            setting.descriptionRanges.push({ startLineNumber: this.lineCountWithOffset, startColumn: this.lastLine.indexOf(line) + 1, endLineNumber: this.lineCountWithOffset, endColumn: this.lastLine.length });
        }
        if (setting.enumDescriptions && setting.enumDescriptions.some(function (desc) { return !!desc; })) {
            setting.enumDescriptions.forEach(function (desc, i) {
                var displayEnum = escapeInvisibleChars(String(setting.enum[i]));
                var line = desc ?
                    displayEnum + ": " + fixSettingLink(desc) :
                    displayEnum;
                _this._contentByLines.push("  //  - " + line);
                setting.descriptionRanges.push({ startLineNumber: _this.lineCountWithOffset, startColumn: _this.lastLine.indexOf(line) + 1, endLineNumber: _this.lineCountWithOffset, endColumn: _this.lastLine.length });
            });
        }
    };
    SettingsContentBuilder.prototype.pushValue = function (setting, preValueConent, indent) {
        var valueString = JSON.stringify(setting.value, null, indent);
        if (valueString && (typeof setting.value === 'object')) {
            if (setting.overrides.length) {
                this._contentByLines.push(preValueConent + ' {');
                for (var _i = 0, _a = setting.overrides; _i < _a.length; _i++) {
                    var subSetting = _a[_i];
                    this.pushSetting(subSetting, indent + indent);
                    this._contentByLines.pop();
                }
                var lastSetting = setting.overrides[setting.overrides.length - 1];
                var content = this._contentByLines[lastSetting.range.endLineNumber - 2];
                this._contentByLines[lastSetting.range.endLineNumber - 2] = content.substring(0, content.length - 1);
                this._contentByLines.push(indent + '}');
            }
            else {
                var mulitLineValue = valueString.split('\n');
                this._contentByLines.push(preValueConent + mulitLineValue[0]);
                for (var i = 1; i < mulitLineValue.length; i++) {
                    this._contentByLines.push(indent + mulitLineValue[i]);
                }
            }
        }
        else {
            this._contentByLines.push(preValueConent + valueString);
        }
    };
    SettingsContentBuilder.prototype.addDescription = function (description, indent, result) {
        for (var _i = 0, description_1 = description; _i < description_1.length; _i++) {
            var line = description_1[_i];
            result.push(indent + '// ' + line);
        }
    };
    return SettingsContentBuilder;
}());
export function createValidator(prop) {
    return function (value) {
        var exclusiveMax;
        var exclusiveMin;
        if (typeof prop.exclusiveMaximum === 'boolean') {
            exclusiveMax = prop.exclusiveMaximum ? prop.maximum : undefined;
        }
        else {
            exclusiveMax = prop.exclusiveMaximum;
        }
        if (typeof prop.exclusiveMinimum === 'boolean') {
            exclusiveMin = prop.exclusiveMinimum ? prop.minimum : undefined;
        }
        else {
            exclusiveMin = prop.exclusiveMinimum;
        }
        var patternRegex;
        if (typeof prop.pattern === 'string') {
            patternRegex = new RegExp(prop.pattern);
        }
        var type = Array.isArray(prop.type) ? prop.type : [prop.type];
        var canBeType = function (t) { return type.indexOf(t) > -1; };
        var isNullable = canBeType('null');
        var isNumeric = (canBeType('number') || canBeType('integer')) && (type.length === 1 || type.length === 2 && isNullable);
        var isIntegral = (canBeType('integer')) && (type.length === 1 || type.length === 2 && isNullable);
        var numericValidations = isNumeric ? [
            {
                enabled: exclusiveMax !== undefined && (prop.maximum === undefined || exclusiveMax <= prop.maximum),
                isValid: (function (value) { return value < exclusiveMax; }),
                message: nls.localize('validations.exclusiveMax', "Value must be strictly less than {0}.", exclusiveMax)
            },
            {
                enabled: exclusiveMin !== undefined && (prop.minimum === undefined || exclusiveMin >= prop.minimum),
                isValid: (function (value) { return value > exclusiveMin; }),
                message: nls.localize('validations.exclusiveMin', "Value must be strictly greater than {0}.", exclusiveMin)
            },
            {
                enabled: prop.maximum !== undefined && (exclusiveMax === undefined || exclusiveMax > prop.maximum),
                isValid: (function (value) { return value <= prop.maximum; }),
                message: nls.localize('validations.max', "Value must be less than or equal to {0}.", prop.maximum)
            },
            {
                enabled: prop.minimum !== undefined && (exclusiveMin === undefined || exclusiveMin < prop.minimum),
                isValid: (function (value) { return value >= prop.minimum; }),
                message: nls.localize('validations.min', "Value must be greater than or equal to {0}.", prop.minimum)
            },
            {
                enabled: prop.multipleOf !== undefined,
                isValid: (function (value) { return value % prop.multipleOf === 0; }),
                message: nls.localize('validations.multipleOf', "Value must be a multiple of {0}.", prop.multipleOf)
            },
            {
                enabled: isIntegral,
                isValid: (function (value) { return value % 1 === 0; }),
                message: nls.localize('validations.expectedInteger', "Value must be an integer.")
            },
        ].filter(function (validation) { return validation.enabled; }) : [];
        var stringValidations = [
            {
                enabled: prop.maxLength !== undefined,
                isValid: (function (value) { return value.length <= prop.maxLength; }),
                message: nls.localize('validations.maxLength', "Value must be fewer than {0} characters long.", prop.maxLength)
            },
            {
                enabled: prop.minLength !== undefined,
                isValid: (function (value) { return value.length >= prop.minLength; }),
                message: nls.localize('validations.minLength', "Value must be more than {0} characters long.", prop.minLength)
            },
            {
                enabled: patternRegex !== undefined,
                isValid: (function (value) { return patternRegex.test(value); }),
                message: prop.patternErrorMessage || nls.localize('validations.regex', "Value must match regex `{0}`.", prop.pattern)
            },
        ].filter(function (validation) { return validation.enabled; });
        if (prop.type === 'string' && stringValidations.length === 0) {
            return null;
        }
        if (isNullable && value === '') {
            return '';
        }
        var errors = [];
        if (isNumeric) {
            if (value === '' || isNaN(+value)) {
                errors.push(nls.localize('validations.expectedNumeric', "Value must be a number."));
            }
            else {
                errors.push.apply(errors, numericValidations.filter(function (validator) { return !validator.isValid(+value); }).map(function (validator) { return validator.message; }));
            }
        }
        if (prop.type === 'string') {
            errors.push.apply(errors, stringValidations.filter(function (validator) { return !validator.isValid('' + value); }).map(function (validator) { return validator.message; }));
        }
        if (errors.length) {
            return prop.errorMessage ? [prop.errorMessage].concat(errors).join(' ') : errors.join(' ');
        }
        return '';
    };
}
function escapeInvisibleChars(enumValue) {
    return enumValue && enumValue
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}
export function defaultKeybindingsContents(keybindingService) {
    var defaultsHeader = '// ' + nls.localize('defaultKeybindingsHeader', "Overwrite key bindings by placing them into your key bindings file.");
    return defaultsHeader + '\n' + keybindingService.getDefaultKeybindingsContent();
}
var DefaultKeybindingsEditorModel = /** @class */ (function () {
    function DefaultKeybindingsEditorModel(_uri, keybindingService) {
        this._uri = _uri;
        this.keybindingService = keybindingService;
    }
    Object.defineProperty(DefaultKeybindingsEditorModel.prototype, "uri", {
        get: function () {
            return this._uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultKeybindingsEditorModel.prototype, "content", {
        get: function () {
            if (!this._content) {
                this._content = defaultKeybindingsContents(this.keybindingService);
            }
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    DefaultKeybindingsEditorModel.prototype.getPreference = function () {
        return null;
    };
    DefaultKeybindingsEditorModel.prototype.dispose = function () {
        // Not disposable
    };
    DefaultKeybindingsEditorModel = __decorate([
        __param(1, IKeybindingService)
    ], DefaultKeybindingsEditorModel);
    return DefaultKeybindingsEditorModel;
}());
export { DefaultKeybindingsEditorModel };
