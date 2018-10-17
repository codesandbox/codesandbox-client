/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './quickInput.css';
import * as dom from '../../../../base/browser/dom.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { matchesFuzzyOcticonAware, parseOcticons } from '../../../../base/common/octicon.js';
import { compareAnything } from '../../../../base/common/comparers.js';
import { Emitter, mapEvent } from '../../../../base/common/event.js';
import { assign } from '../../../../base/common/objects.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { HighlightedLabel } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { memoize } from '../../../../base/common/decorators.js';
import { range } from '../../../../base/common/arrays.js';
import * as platform from '../../../../base/common/platform.js';
import { listFocusBackground, pickerGroupBorder, pickerGroupForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../../base/common/actions.js';
import { getIconClass } from './quickInputUtils.js';
var $ = dom.$;
var ListElement = /** @class */ (function () {
    function ListElement(init) {
        this.hidden = false;
        this._onChecked = new Emitter();
        this.onChecked = this._onChecked.event;
        assign(this, init);
    }
    Object.defineProperty(ListElement.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (value) {
            if (value !== this._checked) {
                this._checked = value;
                this._onChecked.fire(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    return ListElement;
}());
var ListElementRenderer = /** @class */ (function () {
    function ListElementRenderer() {
    }
    Object.defineProperty(ListElementRenderer.prototype, "templateId", {
        get: function () {
            return ListElementRenderer.ID;
        },
        enumerable: true,
        configurable: true
    });
    ListElementRenderer.prototype.renderTemplate = function (container) {
        var data = Object.create(null);
        data.toDisposeElement = [];
        data.toDisposeTemplate = [];
        data.entry = dom.append(container, $('.quick-input-list-entry'));
        // Checkbox
        var label = dom.append(data.entry, $('label.quick-input-list-label'));
        data.checkbox = dom.append(label, $('input.quick-input-list-checkbox'));
        data.checkbox.type = 'checkbox';
        data.toDisposeTemplate.push(dom.addStandardDisposableListener(data.checkbox, dom.EventType.CHANGE, function (e) {
            data.element.checked = data.checkbox.checked;
        }));
        // Rows
        var rows = dom.append(label, $('.quick-input-list-rows'));
        var row1 = dom.append(rows, $('.quick-input-list-row'));
        var row2 = dom.append(rows, $('.quick-input-list-row'));
        // Label
        data.label = new IconLabel(row1, { supportHighlights: true, supportDescriptionHighlights: true });
        // Detail
        var detailContainer = dom.append(row2, $('.quick-input-list-label-meta'));
        data.detail = new HighlightedLabel(detailContainer);
        // Separator
        data.separator = dom.append(data.entry, $('.quick-input-list-separator'));
        // Actions
        data.actionBar = new ActionBar(data.entry);
        data.actionBar.domNode.classList.add('quick-input-list-entry-action-bar');
        data.toDisposeTemplate.push(data.actionBar);
        return data;
    };
    ListElementRenderer.prototype.renderElement = function (element, index, data) {
        data.toDisposeElement = dispose(data.toDisposeElement);
        data.element = element;
        data.checkbox.checked = element.checked;
        data.toDisposeElement.push(element.onChecked(function (checked) { return data.checkbox.checked = checked; }));
        var labelHighlights = element.labelHighlights, descriptionHighlights = element.descriptionHighlights, detailHighlights = element.detailHighlights;
        // Label
        var options = Object.create(null);
        options.matches = labelHighlights || [];
        options.descriptionTitle = element.saneDescription;
        options.descriptionMatches = descriptionHighlights || [];
        options.extraClasses = element.item.iconClasses;
        data.label.setValue(element.saneLabel, element.saneDescription, options);
        // Meta
        data.detail.set(element.saneDetail, detailHighlights);
        // ARIA label
        data.entry.setAttribute('aria-label', [element.saneLabel, element.saneDescription, element.saneDetail]
            .map(function (s) { return s && parseOcticons(s).text; })
            .filter(function (s) { return !!s; })
            .join(', '));
        // Separator
        if (element.separator && element.separator.label) {
            data.separator.textContent = element.separator.label;
            data.separator.style.display = null;
        }
        else {
            data.separator.style.display = 'none';
        }
        if (element.separator) {
            dom.addClass(data.entry, 'quick-input-list-separator-border');
        }
        else {
            dom.removeClass(data.entry, 'quick-input-list-separator-border');
        }
        // Actions
        data.actionBar.clear();
        var buttons = element.item.buttons;
        if (buttons && buttons.length) {
            data.actionBar.push(buttons.map(function (button, index) {
                var action = new Action("id-" + index, '', button.iconClass || getIconClass(button.iconPath), true, function () {
                    element.fireButtonTriggered({
                        button: button,
                        item: element.item
                    });
                    return null;
                });
                action.tooltip = button.tooltip;
                return action;
            }), { icon: true, label: false });
            dom.addClass(data.entry, 'has-actions');
        }
        else {
            dom.removeClass(data.entry, 'has-actions');
        }
    };
    ListElementRenderer.prototype.disposeElement = function (element, index, data) {
        data.toDisposeElement = dispose(data.toDisposeElement);
    };
    ListElementRenderer.prototype.disposeTemplate = function (data) {
        data.toDisposeElement = dispose(data.toDisposeElement);
        data.toDisposeTemplate = dispose(data.toDisposeTemplate);
    };
    ListElementRenderer.ID = 'listelement';
    return ListElementRenderer;
}());
var ListElementDelegate = /** @class */ (function () {
    function ListElementDelegate() {
    }
    ListElementDelegate.prototype.getHeight = function (element) {
        return element.saneDetail ? 44 : 22;
    };
    ListElementDelegate.prototype.getTemplateId = function (element) {
        return ListElementRenderer.ID;
    };
    return ListElementDelegate;
}());
var QuickInputList = /** @class */ (function () {
    function QuickInputList(parent, id, instantiationService) {
        var _this = this;
        this.parent = parent;
        this.instantiationService = instantiationService;
        this.elements = [];
        this.elementsToIndexes = new Map();
        this.matchOnDescription = false;
        this.matchOnDetail = false;
        this._onChangedAllVisibleChecked = new Emitter();
        this.onChangedAllVisibleChecked = this._onChangedAllVisibleChecked.event;
        this._onChangedCheckedCount = new Emitter();
        this.onChangedCheckedCount = this._onChangedCheckedCount.event;
        this._onChangedVisibleCount = new Emitter();
        this.onChangedVisibleCount = this._onChangedVisibleCount.event;
        this._onChangedCheckedElements = new Emitter();
        this.onChangedCheckedElements = this._onChangedCheckedElements.event;
        this._onButtonTriggered = new Emitter();
        this.onButtonTriggered = this._onButtonTriggered.event;
        this._onLeave = new Emitter();
        this.onLeave = this._onLeave.event;
        this._fireCheckedEvents = true;
        this.elementDisposables = [];
        this.disposables = [];
        this.id = id;
        this.container = dom.append(this.parent, $('.quick-input-list'));
        var delegate = new ListElementDelegate();
        this.list = this.instantiationService.createInstance(WorkbenchList, this.container, delegate, [new ListElementRenderer()], {
            identityProvider: function (element) { return element.label; },
            openController: { shouldOpen: function () { return false; } },
            multipleSelectionSupport: false
        });
        this.list.getHTMLElement().id = id;
        this.disposables.push(this.list);
        this.disposables.push(this.list.onKeyDown(function (e) {
            var event = new StandardKeyboardEvent(e);
            switch (event.keyCode) {
                case 10 /* Space */:
                    _this.toggleCheckbox();
                    break;
                case 31 /* KEY_A */:
                    if (platform.isMacintosh ? e.metaKey : e.ctrlKey) {
                        _this.list.setFocus(range(_this.list.length));
                    }
                    break;
                case 16 /* UpArrow */:
                case 11 /* PageUp */:
                    var focus1 = _this.list.getFocus();
                    if (focus1.length === 1 && focus1[0] === 0) {
                        _this._onLeave.fire();
                    }
                    break;
                case 18 /* DownArrow */:
                case 12 /* PageDown */:
                    var focus2 = _this.list.getFocus();
                    if (focus2.length === 1 && focus2[0] === _this.list.length - 1) {
                        _this._onLeave.fire();
                    }
                    break;
            }
        }));
        this.disposables.push(dom.addDisposableListener(this.container, dom.EventType.CLICK, function (e) {
            if (e.x || e.y) { // Avoid 'click' triggered by 'space' on checkbox.
                _this._onLeave.fire();
            }
        }));
        this.disposables.push(this.list.onSelectionChange(function (e) {
            if (e.elements.length) {
                _this.list.setSelection([]);
            }
        }));
    }
    Object.defineProperty(QuickInputList.prototype, "onDidChangeFocus", {
        get: function () {
            return mapEvent(this.list.onFocusChange, function (e) { return e.elements.map(function (e) { return e.item; }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInputList.prototype, "onDidChangeSelection", {
        get: function () {
            return mapEvent(this.list.onSelectionChange, function (e) { return e.elements.map(function (e) { return e.item; }); });
        },
        enumerable: true,
        configurable: true
    });
    QuickInputList.prototype.getAllVisibleChecked = function () {
        return this.allVisibleChecked(this.elements, false);
    };
    QuickInputList.prototype.allVisibleChecked = function (elements, whenNoneVisible) {
        if (whenNoneVisible === void 0) { whenNoneVisible = true; }
        for (var i = 0, n = elements.length; i < n; i++) {
            var element = elements[i];
            if (!element.hidden) {
                if (!element.checked) {
                    return false;
                }
                else {
                    whenNoneVisible = true;
                }
            }
        }
        return whenNoneVisible;
    };
    QuickInputList.prototype.getCheckedCount = function () {
        var count = 0;
        var elements = this.elements;
        for (var i = 0, n = elements.length; i < n; i++) {
            if (elements[i].checked) {
                count++;
            }
        }
        return count;
    };
    QuickInputList.prototype.getVisibleCount = function () {
        var count = 0;
        var elements = this.elements;
        for (var i = 0, n = elements.length; i < n; i++) {
            if (!elements[i].hidden) {
                count++;
            }
        }
        return count;
    };
    QuickInputList.prototype.setAllVisibleChecked = function (checked) {
        try {
            this._fireCheckedEvents = false;
            this.elements.forEach(function (element) {
                if (!element.hidden) {
                    element.checked = checked;
                }
            });
        }
        finally {
            this._fireCheckedEvents = true;
            this.fireCheckedEvents();
        }
    };
    QuickInputList.prototype.setElements = function (inputElements) {
        var _this = this;
        var _a;
        this.elementDisposables = dispose(this.elementDisposables);
        var fireButtonTriggered = function (event) { return _this.fireButtonTriggered(event); };
        this.inputElements = inputElements;
        this.elements = inputElements.reduce(function (result, item, index) {
            if (item.type !== 'separator') {
                var previous = index && inputElements[index - 1];
                result.push(new ListElement({
                    index: index,
                    item: item,
                    saneLabel: item.label && item.label.replace(/\r?\n/g, ' '),
                    saneDescription: item.description && item.description.replace(/\r?\n/g, ' '),
                    saneDetail: item.detail && item.detail.replace(/\r?\n/g, ' '),
                    checked: false,
                    separator: previous && previous.type === 'separator' ? previous : undefined,
                    fireButtonTriggered: fireButtonTriggered
                }));
            }
            return result;
        }, []);
        (_a = this.elementDisposables).push.apply(_a, this.elements.map(function (element) { return element.onChecked(function () { return _this.fireCheckedEvents(); }); }));
        this.elementsToIndexes = this.elements.reduce(function (map, element, index) {
            map.set(element.item, index);
            return map;
        }, new Map());
        this.list.splice(0, this.list.length, this.elements);
        this.list.setFocus([]);
        this._onChangedVisibleCount.fire(this.elements.length);
    };
    QuickInputList.prototype.getFocusedElements = function () {
        return this.list.getFocusedElements()
            .map(function (e) { return e.item; });
    };
    QuickInputList.prototype.setFocusedElements = function (items) {
        var _this = this;
        this.list.setFocus(items
            .filter(function (item) { return _this.elementsToIndexes.has(item); })
            .map(function (item) { return _this.elementsToIndexes.get(item); }));
    };
    QuickInputList.prototype.getActiveDescendant = function () {
        return this.list.getHTMLElement().getAttribute('aria-activedescendant');
    };
    QuickInputList.prototype.getSelectedElements = function () {
        return this.list.getSelectedElements()
            .map(function (e) { return e.item; });
    };
    QuickInputList.prototype.setSelectedElements = function (items) {
        var _this = this;
        this.list.setSelection(items
            .filter(function (item) { return _this.elementsToIndexes.has(item); })
            .map(function (item) { return _this.elementsToIndexes.get(item); }));
    };
    QuickInputList.prototype.getCheckedElements = function () {
        return this.elements.filter(function (e) { return e.checked; })
            .map(function (e) { return e.item; });
    };
    QuickInputList.prototype.setCheckedElements = function (items) {
        try {
            this._fireCheckedEvents = false;
            var checked = new Set();
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                checked.add(item);
            }
            for (var _a = 0, _b = this.elements; _a < _b.length; _a++) {
                var element = _b[_a];
                element.checked = checked.has(element.item);
            }
        }
        finally {
            this._fireCheckedEvents = true;
            this.fireCheckedEvents();
        }
    };
    Object.defineProperty(QuickInputList.prototype, "enabled", {
        set: function (value) {
            this.list.getHTMLElement().style.pointerEvents = value ? null : 'none';
        },
        enumerable: true,
        configurable: true
    });
    QuickInputList.prototype.focus = function (what) {
        if (!this.list.length) {
            return;
        }
        if ((what === 'Next' || what === 'NextPage') && this.list.getFocus()[0] === this.list.length - 1) {
            what = 'First';
        }
        if ((what === 'Previous' || what === 'PreviousPage') && this.list.getFocus()[0] === 0) {
            what = 'Last';
        }
        this.list['focus' + what]();
        this.list.reveal(this.list.getFocus()[0]);
    };
    QuickInputList.prototype.clearFocus = function () {
        this.list.setFocus([]);
    };
    QuickInputList.prototype.domFocus = function () {
        this.list.domFocus();
    };
    QuickInputList.prototype.layout = function () {
        this.list.layout();
    };
    QuickInputList.prototype.filter = function (query) {
        var _this = this;
        query = query.trim();
        // Reset filtering
        if (!query) {
            this.elements.forEach(function (element) {
                element.labelHighlights = undefined;
                element.descriptionHighlights = undefined;
                element.detailHighlights = undefined;
                element.hidden = false;
                var previous = element.index && _this.inputElements[element.index - 1];
                element.separator = previous && previous.type === 'separator' ? previous : undefined;
            });
        }
        // Filter by value (since we support octicons, use octicon aware fuzzy matching)
        else {
            this.elements.forEach(function (element) {
                var labelHighlights = matchesFuzzyOcticonAware(query, parseOcticons(element.saneLabel));
                var descriptionHighlights = _this.matchOnDescription ? matchesFuzzyOcticonAware(query, parseOcticons(element.saneDescription || '')) : undefined;
                var detailHighlights = _this.matchOnDetail ? matchesFuzzyOcticonAware(query, parseOcticons(element.saneDetail || '')) : undefined;
                if (labelHighlights || descriptionHighlights || detailHighlights) {
                    element.labelHighlights = labelHighlights;
                    element.descriptionHighlights = descriptionHighlights;
                    element.detailHighlights = detailHighlights;
                    element.hidden = false;
                }
                else {
                    element.labelHighlights = undefined;
                    element.descriptionHighlights = undefined;
                    element.detailHighlights = undefined;
                    element.hidden = !element.item.alwaysShow;
                }
                element.separator = undefined;
            });
        }
        var shownElements = this.elements.filter(function (element) { return !element.hidden; });
        // Sort by value
        if (query) {
            var normalizedSearchValue_1 = query.toLowerCase();
            shownElements.sort(function (a, b) {
                return compareEntries(a, b, normalizedSearchValue_1);
            });
        }
        this.elementsToIndexes = shownElements.reduce(function (map, element, index) {
            map.set(element.item, index);
            return map;
        }, new Map());
        this.list.splice(0, this.list.length, shownElements);
        this.list.setFocus([]);
        this.list.layout();
        this._onChangedAllVisibleChecked.fire(this.getAllVisibleChecked());
        this._onChangedVisibleCount.fire(shownElements.length);
    };
    QuickInputList.prototype.toggleCheckbox = function () {
        try {
            this._fireCheckedEvents = false;
            var elements = this.list.getFocusedElements();
            var allChecked = this.allVisibleChecked(elements);
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var element = elements_1[_i];
                element.checked = !allChecked;
            }
        }
        finally {
            this._fireCheckedEvents = true;
            this.fireCheckedEvents();
        }
    };
    QuickInputList.prototype.display = function (display) {
        this.container.style.display = display ? '' : 'none';
    };
    QuickInputList.prototype.isDisplayed = function () {
        return this.container.style.display !== 'none';
    };
    QuickInputList.prototype.dispose = function () {
        this.elementDisposables = dispose(this.elementDisposables);
        this.disposables = dispose(this.disposables);
    };
    QuickInputList.prototype.fireCheckedEvents = function () {
        if (this._fireCheckedEvents) {
            this._onChangedAllVisibleChecked.fire(this.getAllVisibleChecked());
            this._onChangedCheckedCount.fire(this.getCheckedCount());
            this._onChangedCheckedElements.fire(this.getCheckedElements());
        }
    };
    QuickInputList.prototype.fireButtonTriggered = function (event) {
        this._onButtonTriggered.fire(event);
    };
    __decorate([
        memoize
    ], QuickInputList.prototype, "onDidChangeFocus", null);
    __decorate([
        memoize
    ], QuickInputList.prototype, "onDidChangeSelection", null);
    QuickInputList = __decorate([
        __param(2, IInstantiationService)
    ], QuickInputList);
    return QuickInputList;
}());
export { QuickInputList };
function compareEntries(elementA, elementB, lookFor) {
    var labelHighlightsA = elementA.labelHighlights || [];
    var labelHighlightsB = elementB.labelHighlights || [];
    if (labelHighlightsA.length && !labelHighlightsB.length) {
        return -1;
    }
    if (!labelHighlightsA.length && labelHighlightsB.length) {
        return 1;
    }
    return compareAnything(elementA.saneLabel, elementB.saneLabel, lookFor);
}
registerThemingParticipant(function (theme, collector) {
    // Override inactive focus background with active focus background for single-pick case.
    var listInactiveFocusBackground = theme.getColor(listFocusBackground);
    if (listInactiveFocusBackground) {
        collector.addRule(".quick-input-list .monaco-list .monaco-list-row.focused { background-color:  " + listInactiveFocusBackground + "; }");
        collector.addRule(".quick-input-list .monaco-list .monaco-list-row.focused:hover { background-color:  " + listInactiveFocusBackground + "; }");
    }
    var pickerGroupBorderColor = theme.getColor(pickerGroupBorder);
    if (pickerGroupBorderColor) {
        collector.addRule(".quick-input-list .quick-input-list-entry { border-top-color:  " + pickerGroupBorderColor + "; }");
    }
    var pickerGroupForegroundColor = theme.getColor(pickerGroupForeground);
    if (pickerGroupForegroundColor) {
        collector.addRule(".quick-input-list .quick-input-list-separator { color:  " + pickerGroupForegroundColor + "; }");
    }
});
