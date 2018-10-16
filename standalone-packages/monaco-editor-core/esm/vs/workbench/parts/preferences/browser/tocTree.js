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
import * as DOM from '../../../../base/browser/dom';
import { ScrollbarVisibility } from '../../../../base/common/scrollable';
import { TPromise } from '../../../../base/common/winjs.base';
import { DefaultTreestyler } from '../../../../base/parts/tree/browser/treeDefaults';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IListService, WorkbenchTree, WorkbenchTreeController } from '../../../../platform/list/browser/listService';
import { editorBackground } from '../../../../platform/theme/common/colorRegistry';
import { attachStyler } from '../../../../platform/theme/common/styler';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { SettingsAccessibilityProvider, SettingsTreeFilter } from './settingsTree';
import { SettingsTreeGroupElement, SettingsTreeSettingElement } from './settingsTreeModels';
import { settingsHeaderForeground } from './settingsWidgets';
var $ = DOM.$;
var TOCTreeModel = /** @class */ (function () {
    function TOCTreeModel(_viewState) {
        this._viewState = _viewState;
    }
    Object.defineProperty(TOCTreeModel.prototype, "settingsTreeRoot", {
        get: function () {
            return this._settingsTreeRoot;
        },
        set: function (value) {
            this._settingsTreeRoot = value;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TOCTreeModel.prototype, "currentSearchModel", {
        set: function (model) {
            this._currentSearchModel = model;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TOCTreeModel.prototype, "children", {
        get: function () {
            return this._settingsTreeRoot.children;
        },
        enumerable: true,
        configurable: true
    });
    TOCTreeModel.prototype.update = function () {
        if (this._settingsTreeRoot) {
            this.updateGroupCount(this._settingsTreeRoot);
        }
    };
    TOCTreeModel.prototype.updateGroupCount = function (group) {
        var _this = this;
        group.children.forEach(function (child) {
            if (child instanceof SettingsTreeGroupElement) {
                _this.updateGroupCount(child);
            }
        });
        var childCount = group.children
            .filter(function (child) { return child instanceof SettingsTreeGroupElement; })
            .reduce(function (acc, cur) { return acc + cur.count; }, 0);
        group.count = childCount + this.getGroupCount(group);
    };
    TOCTreeModel.prototype.getGroupCount = function (group) {
        var _this = this;
        return group.children.filter(function (child) {
            if (!(child instanceof SettingsTreeSettingElement)) {
                return false;
            }
            if (_this._currentSearchModel && !_this._currentSearchModel.root.containsSetting(child.setting.key)) {
                return false;
            }
            // Check everything that the SettingsFilter checks except whether it's filtered by a category
            return child.matchesScope(_this._viewState.settingsTarget) && child.matchesAllTags(_this._viewState.tagFilters);
        }).length;
    };
    return TOCTreeModel;
}());
export { TOCTreeModel };
var TOCDataSource = /** @class */ (function () {
    function TOCDataSource(_treeFilter) {
        this._treeFilter = _treeFilter;
    }
    TOCDataSource.prototype.getId = function (tree, element) {
        return element.id;
    };
    TOCDataSource.prototype.hasChildren = function (tree, element) {
        var _this = this;
        if (element instanceof TOCTreeModel) {
            return true;
        }
        if (element instanceof SettingsTreeGroupElement) {
            // Should have child which won't be filtered out
            return element.children && element.children.some(function (child) { return child instanceof SettingsTreeGroupElement && _this._treeFilter.isVisible(tree, child); });
        }
        return false;
    };
    TOCDataSource.prototype.getChildren = function (tree, element) {
        return TPromise.as(this._getChildren(element));
    };
    TOCDataSource.prototype._getChildren = function (element) {
        return element.children
            .filter(function (child) { return child instanceof SettingsTreeGroupElement; });
    };
    TOCDataSource.prototype.getParent = function (tree, element) {
        return TPromise.wrap(element instanceof SettingsTreeGroupElement && element.parent);
    };
    return TOCDataSource;
}());
export { TOCDataSource };
var TOC_ENTRY_TEMPLATE_ID = 'settings.toc.entry';
var TOCRenderer = /** @class */ (function () {
    function TOCRenderer() {
    }
    TOCRenderer.prototype.getHeight = function (tree, element) {
        return 22;
    };
    TOCRenderer.prototype.getTemplateId = function (tree, element) {
        return TOC_ENTRY_TEMPLATE_ID;
    };
    TOCRenderer.prototype.renderTemplate = function (tree, templateId, container) {
        return {
            labelElement: DOM.append(container, $('.settings-toc-entry')),
            countElement: DOM.append(container, $('.settings-toc-count'))
        };
    };
    TOCRenderer.prototype.renderElement = function (tree, element, templateId, template) {
        var count = element.count;
        var label = element.label;
        DOM.toggleClass(template.labelElement, 'no-results', count === 0);
        template.labelElement.textContent = label;
        if (count) {
            template.countElement.textContent = " (" + count + ")";
        }
        else {
            template.countElement.textContent = '';
        }
    };
    TOCRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
    };
    return TOCRenderer;
}());
export { TOCRenderer };
var TOCTree = /** @class */ (function (_super) {
    __extends(TOCTree, _super);
    function TOCTree(container, viewState, configuration, contextKeyService, listService, themeService, instantiationService, configurationService) {
        var _this = this;
        var treeClass = 'settings-toc-tree';
        var filter = instantiationService.createInstance(SettingsTreeFilter, viewState);
        var fullConfiguration = __assign({ controller: instantiationService.createInstance(WorkbenchTreeController, {}), filter: filter, styler: new DefaultTreestyler(DOM.createStyleSheet(container), treeClass), dataSource: instantiationService.createInstance(TOCDataSource, filter), accessibilityProvider: instantiationService.createInstance(SettingsAccessibilityProvider) }, configuration);
        var options = {
            showLoading: false,
            twistiePixels: 15,
            horizontalScrollMode: ScrollbarVisibility.Hidden
        };
        _this = _super.call(this, container, fullConfiguration, options, contextKeyService, listService, themeService, instantiationService, configurationService) || this;
        _this.getHTMLElement().classList.add(treeClass);
        _this.disposables.push(attachStyler(themeService, {
            listActiveSelectionBackground: editorBackground,
            listActiveSelectionForeground: settingsHeaderForeground,
            listFocusAndSelectionBackground: editorBackground,
            listFocusAndSelectionForeground: settingsHeaderForeground,
            listFocusBackground: editorBackground,
            listFocusForeground: settingsHeaderForeground,
            listHoverForeground: settingsHeaderForeground,
            listHoverBackground: editorBackground,
            listInactiveSelectionBackground: editorBackground,
            listInactiveSelectionForeground: settingsHeaderForeground,
        }, function (colors) {
            _this.style(colors);
        }));
        return _this;
    }
    TOCTree = __decorate([
        __param(3, IContextKeyService),
        __param(4, IListService),
        __param(5, IThemeService),
        __param(6, IInstantiationService),
        __param(7, IConfigurationService)
    ], TOCTree);
    return TOCTree;
}(WorkbenchTree));
export { TOCTree };
