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
var _a;
import * as dom from '../../../base/browser/dom';
import { HighlightedLabel } from '../../../base/browser/ui/highlightedlabel/highlightedLabel';
import { values } from '../../../base/common/collections';
import { createMatches } from '../../../base/common/filters';
import { TPromise } from '../../../base/common/winjs.base';
import './media/outlineTree.css';
import './media/symbol-icons.css';
import { Range } from '../../common/core/range';
import { SymbolKind, symbolKindToCssClass } from '../../common/modes';
import { OutlineElement, OutlineGroup, OutlineModel, TreeElement } from './outlineModel';
import { localize } from '../../../nls';
import { IConfigurationService } from '../../../platform/configuration/common/configuration';
import { WorkbenchTreeController } from '../../../platform/list/browser/listService';
import { MarkerSeverity } from '../../../platform/markers/common/markers';
import { listErrorForeground, listWarningForeground } from '../../../platform/theme/common/colorRegistry';
import { IThemeService } from '../../../platform/theme/common/themeService';
var OutlineItemComparator = /** @class */ (function () {
    function OutlineItemComparator(type) {
        if (type === void 0) { type = 0 /* ByPosition */; }
        this.type = type;
    }
    OutlineItemComparator.prototype.compare = function (tree, a, b) {
        if (a instanceof OutlineGroup && b instanceof OutlineGroup) {
            return a.providerIndex - b.providerIndex;
        }
        if (a instanceof OutlineElement && b instanceof OutlineElement) {
            switch (this.type) {
                case 2 /* ByKind */:
                    return a.symbol.kind - b.symbol.kind;
                case 1 /* ByName */:
                    return a.symbol.name.localeCompare(b.symbol.name);
                case 0 /* ByPosition */:
                default:
                    return Range.compareRangesUsingStarts(a.symbol.range, b.symbol.range);
            }
        }
        return 0;
    };
    return OutlineItemComparator;
}());
export { OutlineItemComparator };
var OutlineItemFilter = /** @class */ (function () {
    function OutlineItemFilter() {
        this.enabled = true;
    }
    OutlineItemFilter.prototype.isVisible = function (tree, element) {
        if (!this.enabled) {
            return true;
        }
        return !(element instanceof OutlineElement) || Boolean(element.score);
    };
    return OutlineItemFilter;
}());
export { OutlineItemFilter };
var OutlineDataSource = /** @class */ (function () {
    function OutlineDataSource() {
        // this is a workaround for the tree showing twisties for items
        // with only filtered children
        this.filterOnScore = true;
    }
    OutlineDataSource.prototype.getId = function (tree, element) {
        return element ? element.id : 'empty';
    };
    OutlineDataSource.prototype.hasChildren = function (tree, element) {
        if (!element) {
            return false;
        }
        if (element instanceof OutlineModel) {
            return true;
        }
        if (element instanceof OutlineElement && (this.filterOnScore && !element.score)) {
            return false;
        }
        for (var id in element.children) {
            if (!this.filterOnScore || element.children[id].score) {
                return true;
            }
        }
        return false;
    };
    OutlineDataSource.prototype.getChildren = function (tree, element) {
        var res = values(element.children);
        // console.log(element.id + ' with children ' + res.length);
        return TPromise.wrap(res);
    };
    OutlineDataSource.prototype.getParent = function (tree, element) {
        return TPromise.wrap(element && element.parent);
    };
    OutlineDataSource.prototype.shouldAutoexpand = function (tree, element) {
        return element && (element instanceof OutlineModel || element.parent instanceof OutlineModel || element instanceof OutlineGroup || element.parent instanceof OutlineGroup);
    };
    return OutlineDataSource;
}());
export { OutlineDataSource };
var OutlineRenderer = /** @class */ (function () {
    function OutlineRenderer(_themeService, _configurationService) {
        this._themeService = _themeService;
        this._configurationService = _configurationService;
        this.renderProblemColors = true;
        this.renderProblemBadges = true;
        //
    }
    OutlineRenderer.prototype.getHeight = function (tree, element) {
        return 22;
    };
    OutlineRenderer.prototype.getTemplateId = function (tree, element) {
        return element instanceof OutlineGroup ? 'outline-group' : 'outline-element';
    };
    OutlineRenderer.prototype.renderTemplate = function (tree, templateId, container) {
        if (templateId === 'outline-element') {
            var icon = dom.$('.outline-element-icon symbol-icon');
            var labelContainer = dom.$('.outline-element-label');
            var detail = dom.$('.outline-element-detail');
            var decoration = dom.$('.outline-element-decoration');
            dom.addClass(container, 'outline-element');
            dom.append(container, icon, labelContainer, detail, decoration);
            return { icon: icon, labelContainer: labelContainer, label: new HighlightedLabel(labelContainer), detail: detail, decoration: decoration };
        }
        if (templateId === 'outline-group') {
            var labelContainer = dom.$('.outline-element-label');
            dom.addClass(container, 'outline-element');
            dom.append(container, labelContainer);
            return { labelContainer: labelContainer, label: new HighlightedLabel(labelContainer) };
        }
        throw new Error(templateId);
    };
    OutlineRenderer.prototype.renderElement = function (tree, element, templateId, template) {
        if (element instanceof OutlineElement) {
            template.icon.className = "outline-element-icon " + symbolKindToCssClass(element.symbol.kind);
            template.label.set(element.symbol.name, element.score ? createMatches(element.score[1]) : undefined, localize('title.template', "{0} ({1})", element.symbol.name, OutlineRenderer._symbolKindNames[element.symbol.kind]));
            template.detail.innerText = element.symbol.detail || '';
            this._renderMarkerInfo(element, template);
        }
        if (element instanceof OutlineGroup) {
            template.label.set(element.provider.displayName || localize('provider', "Outline Provider"));
        }
    };
    OutlineRenderer.prototype._renderMarkerInfo = function (element, template) {
        if (!element.marker) {
            dom.hide(template.decoration);
            template.labelContainer.style.removeProperty('--outline-element-color');
            return;
        }
        var _a = element.marker, count = _a.count, topSev = _a.topSev;
        var color = this._themeService.getTheme().getColor(topSev === MarkerSeverity.Error ? listErrorForeground : listWarningForeground);
        var cssColor = color ? color.toString() : 'inherit';
        // color of the label
        if (this.renderProblemColors) {
            template.labelContainer.style.setProperty('--outline-element-color', cssColor);
        }
        else {
            template.labelContainer.style.removeProperty('--outline-element-color');
        }
        // badge with color/rollup
        if (!this.renderProblemBadges) {
            dom.hide(template.decoration);
        }
        else if (count > 0) {
            dom.show(template.decoration);
            dom.removeClass(template.decoration, 'bubble');
            template.decoration.innerText = count < 10 ? count.toString() : '+9';
            template.decoration.title = count === 1 ? localize('1.problem', "1 problem in this element") : localize('N.problem', "{0} problems in this element", count);
            template.decoration.style.setProperty('--outline-element-color', cssColor);
        }
        else {
            dom.show(template.decoration);
            dom.addClass(template.decoration, 'bubble');
            template.decoration.innerText = '\uf052';
            template.decoration.title = localize('deep.problem', "Contains elements with problems");
            template.decoration.style.setProperty('--outline-element-color', cssColor);
        }
    };
    OutlineRenderer.prototype.disposeTemplate = function (tree, templateId, template) {
        template.label.dispose();
    };
    OutlineRenderer._symbolKindNames = (_a = {},
        _a[SymbolKind.Array] = localize('Array', "array"),
        _a[SymbolKind.Boolean] = localize('Boolean', "boolean"),
        _a[SymbolKind.Class] = localize('Class', "class"),
        _a[SymbolKind.Constant] = localize('Constant', "constant"),
        _a[SymbolKind.Constructor] = localize('Constructor', "constructor"),
        _a[SymbolKind.Enum] = localize('Enum', "enumeration"),
        _a[SymbolKind.EnumMember] = localize('EnumMember', "enumeration member"),
        _a[SymbolKind.Event] = localize('Event', "event"),
        _a[SymbolKind.Field] = localize('Field', "field"),
        _a[SymbolKind.File] = localize('File', "file"),
        _a[SymbolKind.Function] = localize('Function', "function"),
        _a[SymbolKind.Interface] = localize('Interface', "interface"),
        _a[SymbolKind.Key] = localize('Key', "key"),
        _a[SymbolKind.Method] = localize('Method', "method"),
        _a[SymbolKind.Module] = localize('Module', "module"),
        _a[SymbolKind.Namespace] = localize('Namespace', "namespace"),
        _a[SymbolKind.Null] = localize('Null', "null"),
        _a[SymbolKind.Number] = localize('Number', "number"),
        _a[SymbolKind.Object] = localize('Object', "object"),
        _a[SymbolKind.Operator] = localize('Operator', "operator"),
        _a[SymbolKind.Package] = localize('Package', "package"),
        _a[SymbolKind.Property] = localize('Property', "property"),
        _a[SymbolKind.String] = localize('String', "string"),
        _a[SymbolKind.Struct] = localize('Struct', "struct"),
        _a[SymbolKind.TypeParameter] = localize('TypeParameter', "type parameter"),
        _a[SymbolKind.Variable] = localize('Variable', "variable"),
        _a);
    OutlineRenderer = __decorate([
        __param(0, IThemeService),
        __param(1, IConfigurationService)
    ], OutlineRenderer);
    return OutlineRenderer;
}());
export { OutlineRenderer };
var OutlineTreeState = /** @class */ (function () {
    function OutlineTreeState() {
    }
    OutlineTreeState.capture = function (tree) {
        // selection
        var selected;
        var element = tree.getSelection()[0];
        if (element instanceof TreeElement) {
            selected = element.id;
        }
        // focus
        var focused;
        element = tree.getFocus(true);
        if (element instanceof TreeElement) {
            focused = element.id;
        }
        // expansion
        var expanded = new Array();
        var nav = tree.getNavigator();
        while (nav.next()) {
            var element_1 = nav.current();
            if (element_1 instanceof TreeElement) {
                if (tree.isExpanded(element_1)) {
                    expanded.push(element_1.id);
                }
            }
        }
        return { selected: selected, focused: focused, expanded: expanded };
    };
    OutlineTreeState.restore = function (tree, state, eventPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var model, items, _i, _a, id, item, selected, focused;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        model = tree.getInput();
                        if (!state || !(model instanceof OutlineModel)) {
                            return [2 /*return*/, TPromise.as(undefined)];
                        }
                        items = [];
                        for (_i = 0, _a = state.expanded; _i < _a.length; _i++) {
                            id = _a[_i];
                            item = model.getItemById(id);
                            if (item) {
                                items.push(item);
                            }
                        }
                        return [4 /*yield*/, tree.collapseAll(undefined)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tree.expandAll(items)];
                    case 2:
                        _b.sent();
                        selected = model.getItemById(state.selected);
                        focused = model.getItemById(state.focused);
                        tree.setSelection([selected], eventPayload);
                        tree.setFocus(focused, eventPayload);
                        return [2 /*return*/];
                }
            });
        });
    };
    return OutlineTreeState;
}());
export { OutlineTreeState };
var OutlineController = /** @class */ (function (_super) {
    __extends(OutlineController, _super);
    function OutlineController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OutlineController.prototype.shouldToggleExpansion = function (element, event, origin) {
        if (element instanceof OutlineElement) {
            return this.isClickOnTwistie(event);
        }
        else {
            return _super.prototype.shouldToggleExpansion.call(this, element, event, origin);
        }
    };
    return OutlineController;
}(WorkbenchTreeController));
export { OutlineController };
