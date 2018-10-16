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
import * as arrays from '../../../../base/common/arrays';
import { isArray } from '../../../../base/common/types';
import { URI } from '../../../../base/common/uri';
import { localize } from '../../../../nls';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { knownAcronyms } from './settingsLayout';
import { SettingValueType } from '../../../services/preferences/common/preferences';
export var MODIFIED_SETTING_TAG = 'modified';
export var ONLINE_SERVICES_SETTING_TAG = 'usesOnlineServices';
var SettingsTreeElement = /** @class */ (function () {
    function SettingsTreeElement() {
    }
    return SettingsTreeElement;
}());
export { SettingsTreeElement };
var SettingsTreeGroupElement = /** @class */ (function (_super) {
    __extends(SettingsTreeGroupElement, _super);
    function SettingsTreeGroupElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SettingsTreeGroupElement.prototype, "children", {
        get: function () {
            return this._children;
        },
        set: function (newChildren) {
            var _this = this;
            this._children = newChildren;
            this._childSettingKeys = new Set();
            this._children.forEach(function (child) {
                if (child instanceof SettingsTreeSettingElement) {
                    _this._childSettingKeys.add(child.setting.key);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns whether this group contains the given child key (to a depth of 1 only)
     */
    SettingsTreeGroupElement.prototype.containsSetting = function (key) {
        return this._childSettingKeys.has(key);
    };
    return SettingsTreeGroupElement;
}(SettingsTreeElement));
export { SettingsTreeGroupElement };
var SettingsTreeNewExtensionsElement = /** @class */ (function (_super) {
    __extends(SettingsTreeNewExtensionsElement, _super);
    function SettingsTreeNewExtensionsElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SettingsTreeNewExtensionsElement;
}(SettingsTreeElement));
export { SettingsTreeNewExtensionsElement };
var SettingsTreeSettingElement = /** @class */ (function (_super) {
    __extends(SettingsTreeSettingElement, _super);
    function SettingsTreeSettingElement(setting, parent, index, inspectResult) {
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.setting = setting;
        _this.parent = parent;
        _this.id = sanitizeId(parent.id + '_' + setting.key);
        _this.update(inspectResult);
        return _this;
    }
    Object.defineProperty(SettingsTreeSettingElement.prototype, "displayCategory", {
        get: function () {
            if (!this._displayCategory) {
                this.initLabel();
            }
            return this._displayCategory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsTreeSettingElement.prototype, "displayLabel", {
        get: function () {
            if (!this._displayLabel) {
                this.initLabel();
            }
            return this._displayLabel;
        },
        enumerable: true,
        configurable: true
    });
    SettingsTreeSettingElement.prototype.initLabel = function () {
        var displayKeyFormat = settingKeyToDisplayFormat(this.setting.key, this.parent.id);
        this._displayLabel = displayKeyFormat.label;
        this._displayCategory = displayKeyFormat.category;
    };
    SettingsTreeSettingElement.prototype.update = function (inspectResult) {
        var _this = this;
        var isConfigured = inspectResult.isConfigured, inspected = inspectResult.inspected, targetSelector = inspectResult.targetSelector;
        var displayValue = isConfigured ? inspected[targetSelector] : inspected.default;
        var overriddenScopeList = [];
        if (targetSelector === 'user' && typeof inspected.workspace !== 'undefined') {
            overriddenScopeList.push(localize('workspace', "Workspace"));
        }
        if (targetSelector === 'workspace' && typeof inspected.user !== 'undefined') {
            overriddenScopeList.push(localize('user', "User"));
        }
        this.value = displayValue;
        this.scopeValue = isConfigured && inspected[targetSelector];
        this.defaultValue = inspected.default;
        this.isConfigured = isConfigured;
        if (isConfigured || this.setting.tags || this.tags) {
            // Don't create an empty Set for all 1000 settings, only if needed
            this.tags = new Set();
            if (isConfigured) {
                this.tags.add(MODIFIED_SETTING_TAG);
            }
            if (this.setting.tags) {
                this.setting.tags.forEach(function (tag) { return _this.tags.add(tag); });
            }
        }
        this.overriddenScopeList = overriddenScopeList;
        this.description = this.setting.description.join('\n');
        if (this.setting.enum && (!this.setting.type || settingTypeEnumRenderable(this.setting.type))) {
            this.valueType = SettingValueType.Enum;
        }
        else if (this.setting.type === 'string') {
            this.valueType = SettingValueType.String;
        }
        else if (isExcludeSetting(this.setting)) {
            this.valueType = SettingValueType.Exclude;
        }
        else if (this.setting.type === 'integer') {
            this.valueType = SettingValueType.Integer;
        }
        else if (this.setting.type === 'number') {
            this.valueType = SettingValueType.Number;
        }
        else if (this.setting.type === 'boolean') {
            this.valueType = SettingValueType.Boolean;
        }
        else if (isArray(this.setting.type) && this.setting.type.indexOf(SettingValueType.Null) > -1 && this.setting.type.length === 2) {
            if (this.setting.type.indexOf(SettingValueType.Integer) > -1) {
                this.valueType = SettingValueType.NullableInteger;
            }
            else if (this.setting.type.indexOf(SettingValueType.Number) > -1) {
                this.valueType = SettingValueType.NullableNumber;
            }
            else {
                this.valueType = SettingValueType.Complex;
            }
        }
        else {
            this.valueType = SettingValueType.Complex;
        }
    };
    SettingsTreeSettingElement.prototype.matchesAllTags = function (tagFilters) {
        var _this = this;
        if (!tagFilters || !tagFilters.size) {
            return true;
        }
        if (this.tags) {
            var hasFilteredTag_1 = true;
            tagFilters.forEach(function (tag) {
                hasFilteredTag_1 = hasFilteredTag_1 && _this.tags.has(tag);
            });
            return hasFilteredTag_1;
        }
        else {
            return false;
        }
    };
    SettingsTreeSettingElement.prototype.matchesScope = function (scope) {
        var configTarget = URI.isUri(scope) ? 3 /* WORKSPACE_FOLDER */ : scope;
        if (configTarget === 3 /* WORKSPACE_FOLDER */) {
            return this.setting.scope === 3 /* RESOURCE */;
        }
        if (configTarget === 2 /* WORKSPACE */) {
            return this.setting.scope === 2 /* WINDOW */ || this.setting.scope === 3 /* RESOURCE */;
        }
        return true;
    };
    return SettingsTreeSettingElement;
}(SettingsTreeElement));
export { SettingsTreeSettingElement };
var SettingsTreeModel = /** @class */ (function () {
    function SettingsTreeModel(_viewState, _configurationService) {
        this._viewState = _viewState;
        this._configurationService = _configurationService;
        this._treeElementsById = new Map();
        this._treeElementsBySettingName = new Map();
    }
    Object.defineProperty(SettingsTreeModel.prototype, "root", {
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    SettingsTreeModel.prototype.update = function (newTocRoot) {
        if (newTocRoot === void 0) { newTocRoot = this._tocRoot; }
        this._treeElementsById.clear();
        this._treeElementsBySettingName.clear();
        var newRoot = this.createSettingsTreeGroupElement(newTocRoot);
        if (newRoot.children[0] instanceof SettingsTreeGroupElement) {
            newRoot.children[0].isFirstGroup = true; // TODO
        }
        if (this._root) {
            this._root.children = newRoot.children;
        }
        else {
            this._root = newRoot;
        }
    };
    SettingsTreeModel.prototype.getElementById = function (id) {
        return this._treeElementsById.get(id);
    };
    SettingsTreeModel.prototype.getElementsByName = function (name) {
        return this._treeElementsBySettingName.get(name);
    };
    SettingsTreeModel.prototype.updateElementsByName = function (name) {
        var _this = this;
        if (!this._treeElementsBySettingName.has(name)) {
            return;
        }
        this._treeElementsBySettingName.get(name).forEach(function (element) {
            var inspectResult = inspectSetting(element.setting.key, _this._viewState.settingsTarget, _this._configurationService);
            element.update(inspectResult);
        });
    };
    SettingsTreeModel.prototype.createSettingsTreeGroupElement = function (tocEntry, parent) {
        var _this = this;
        var element = new SettingsTreeGroupElement();
        var index = this._treeElementsById.size;
        element.index = index;
        element.id = tocEntry.id;
        element.label = tocEntry.label;
        element.parent = parent;
        element.level = this.getDepth(element);
        var children = [];
        if (tocEntry.settings) {
            var settingChildren = tocEntry.settings.map(function (s) { return _this.createSettingsTreeSettingElement(s, element); })
                .filter(function (el) { return el.setting.deprecationMessage ? el.isConfigured : true; });
            children.push.apply(children, settingChildren);
        }
        if (tocEntry.children) {
            var groupChildren = tocEntry.children.map(function (child) { return _this.createSettingsTreeGroupElement(child, element); });
            children.push.apply(children, groupChildren);
        }
        element.children = children;
        this._treeElementsById.set(element.id, element);
        return element;
    };
    SettingsTreeModel.prototype.getDepth = function (element) {
        if (element.parent) {
            return 1 + this.getDepth(element.parent);
        }
        else {
            return 0;
        }
    };
    SettingsTreeModel.prototype.createSettingsTreeSettingElement = function (setting, parent) {
        var index = this._treeElementsById.size;
        var inspectResult = inspectSetting(setting.key, this._viewState.settingsTarget, this._configurationService);
        var element = new SettingsTreeSettingElement(setting, parent, index, inspectResult);
        this._treeElementsById.set(element.id, element);
        var nameElements = this._treeElementsBySettingName.get(setting.key) || [];
        nameElements.push(element);
        this._treeElementsBySettingName.set(setting.key, nameElements);
        return element;
    };
    SettingsTreeModel = __decorate([
        __param(1, IConfigurationService)
    ], SettingsTreeModel);
    return SettingsTreeModel;
}());
export { SettingsTreeModel };
function inspectSetting(key, target, configurationService) {
    var inspectOverrides = URI.isUri(target) ? { resource: target } : undefined;
    var inspected = configurationService.inspect(key, inspectOverrides);
    var targetSelector = target === 1 /* USER */ ? 'user' :
        target === 2 /* WORKSPACE */ ? 'workspace' :
            'workspaceFolder';
    var isConfigured = typeof inspected[targetSelector] !== 'undefined';
    return { isConfigured: isConfigured, inspected: inspected, targetSelector: targetSelector };
}
function sanitizeId(id) {
    return id.replace(/[\.\/]/, '_');
}
export function settingKeyToDisplayFormat(key, groupId) {
    if (groupId === void 0) { groupId = ''; }
    var lastDotIdx = key.lastIndexOf('.');
    var category = '';
    if (lastDotIdx >= 0) {
        category = key.substr(0, lastDotIdx);
        key = key.substr(lastDotIdx + 1);
    }
    groupId = groupId.replace(/\//g, '.');
    category = trimCategoryForGroup(category, groupId);
    category = wordifyKey(category);
    var label = wordifyKey(key);
    return { category: category, label: label };
}
function wordifyKey(key) {
    return key
        .replace(/\.([a-z])/g, function (match, p1) { return " \u203A " + p1.toUpperCase(); })
        .replace(/([a-z])([A-Z])/g, '$1 $2') // fooBar => foo Bar
        .replace(/^[a-z]/g, function (match) { return match.toUpperCase(); }) // foo => Foo
        .replace(/\b\w+\b/g, function (match) {
        return knownAcronyms.has(match.toLowerCase()) ?
            match.toUpperCase() :
            match;
    });
}
function trimCategoryForGroup(category, groupId) {
    var doTrim = function (forward) {
        var parts = groupId.split('.');
        while (parts.length) {
            var reg = new RegExp("^" + parts.join('\\.') + "(\\.|$)", 'i');
            if (reg.test(category)) {
                return category.replace(reg, '');
            }
            if (forward) {
                parts.pop();
            }
            else {
                parts.shift();
            }
        }
        return null;
    };
    var trimmed = doTrim(true);
    if (trimmed === null) {
        trimmed = doTrim(false);
    }
    if (trimmed === null) {
        trimmed = category;
    }
    return trimmed;
}
export function isExcludeSetting(setting) {
    return setting.key === 'files.exclude' ||
        setting.key === 'search.exclude' ||
        setting.key === 'files.watcherExclude';
}
function settingTypeEnumRenderable(_type) {
    var enumRenderableSettingTypes = ['string', 'boolean', 'null', 'integer', 'number'];
    var type = isArray(_type) ? _type : [_type];
    return type.every(function (type) { return enumRenderableSettingTypes.indexOf(type) > -1; });
}
var SearchResultModel = /** @class */ (function (_super) {
    __extends(SearchResultModel, _super);
    function SearchResultModel(viewState, configurationService) {
        var _this = _super.call(this, viewState, configurationService) || this;
        _this.id = 'searchResultModel';
        _this.update({ id: 'searchResultModel', label: '' });
        return _this;
    }
    SearchResultModel.prototype.getUniqueResults = function () {
        if (this.cachedUniqueSearchResults) {
            return this.cachedUniqueSearchResults;
        }
        if (!this.rawSearchResults) {
            return [];
        }
        var localMatchKeys = new Set();
        var localResult = this.rawSearchResults[0 /* Local */];
        if (localResult) {
            localResult.filterMatches.forEach(function (m) { return localMatchKeys.add(m.setting.key); });
        }
        var remoteResult = this.rawSearchResults[1 /* Remote */];
        if (remoteResult) {
            remoteResult.filterMatches = remoteResult.filterMatches.filter(function (m) { return !localMatchKeys.has(m.setting.key); });
        }
        if (remoteResult) {
            this.newExtensionSearchResults = this.rawSearchResults[2 /* NewExtensions */];
        }
        this.cachedUniqueSearchResults = [localResult, remoteResult];
        return this.cachedUniqueSearchResults;
    };
    SearchResultModel.prototype.getRawResults = function () {
        return this.rawSearchResults;
    };
    SearchResultModel.prototype.setResult = function (order, result) {
        this.cachedUniqueSearchResults = null;
        this.rawSearchResults = this.rawSearchResults || [];
        if (!result) {
            delete this.rawSearchResults[order];
            return;
        }
        this.rawSearchResults[order] = result;
        this.updateChildren();
    };
    SearchResultModel.prototype.updateChildren = function () {
        var _this = this;
        this.update({
            id: 'searchResultModel',
            label: 'searchResultModel',
            settings: this.getFlatSettings()
        });
        // Save time, filter children in the search model instead of relying on the tree filter, which still requires heights to be calculated.
        this.root.children = this.root.children
            .filter(function (child) { return child instanceof SettingsTreeSettingElement && child.matchesAllTags(_this._viewState.tagFilters) && child.matchesScope(_this._viewState.settingsTarget); });
        if (this.newExtensionSearchResults && this.newExtensionSearchResults.filterMatches.length) {
            var newExtElement = new SettingsTreeNewExtensionsElement();
            newExtElement.index = this._treeElementsById.size;
            newExtElement.parent = this._root;
            newExtElement.id = 'newExtensions';
            this._treeElementsById.set(newExtElement.id, newExtElement);
            var resultExtensionIds = this.newExtensionSearchResults.filterMatches
                .map(function (result) { return result.setting; })
                .filter(function (setting) { return setting.extensionName && setting.extensionPublisher; })
                .map(function (setting) { return setting.extensionPublisher + "." + setting.extensionName; });
            newExtElement.extensionIds = arrays.distinct(resultExtensionIds);
            this._root.children.push(newExtElement);
        }
    };
    SearchResultModel.prototype.getFlatSettings = function () {
        var flatSettings = [];
        this.getUniqueResults()
            .filter(function (r) { return !!r; })
            .forEach(function (r) {
            flatSettings.push.apply(flatSettings, r.filterMatches.map(function (m) { return m.setting; }));
        });
        return flatSettings;
    };
    SearchResultModel = __decorate([
        __param(1, IConfigurationService)
    ], SearchResultModel);
    return SearchResultModel;
}(SettingsTreeModel));
export { SearchResultModel };
var tagRegex = /(^|\s)@tag:("([^"]*)"|[^"]\S*)/g;
export function parseQuery(query) {
    var tags = [];
    query = query.replace(tagRegex, function (_, __, quotedTag, tag) {
        tags.push(tag || quotedTag);
        return '';
    });
    query = query.replace("@" + MODIFIED_SETTING_TAG, function () {
        tags.push(MODIFIED_SETTING_TAG);
        return '';
    });
    query = query.trim();
    return {
        tags: tags,
        query: query
    };
}
