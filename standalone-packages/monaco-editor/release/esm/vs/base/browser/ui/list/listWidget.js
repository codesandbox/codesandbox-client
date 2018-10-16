/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
import './list.css';
import { dispose } from '../../../common/lifecycle.js';
import { isNumber } from '../../../common/types.js';
import { range, firstIndex } from '../../../common/arrays.js';
import { memoize } from '../../../common/decorators.js';
import * as DOM from '../../dom.js';
import * as platform from '../../../common/platform.js';
import { Gesture } from '../../touch.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { Event, Emitter, EventBufferer, chain, mapEvent, anyEvent } from '../../../common/event.js';
import { domEvent } from '../../event.js';
import { ListView } from './listView.js';
import { Color } from '../../../common/color.js';
import { mixin } from '../../../common/objects.js';
import { CombinedSpliceable } from './splice.js';
import { clamp } from '../../../common/numbers.js';
var TraitRenderer = /** @class */ (function () {
    function TraitRenderer(trait) {
        this.trait = trait;
        this.renderedElements = [];
    }
    Object.defineProperty(TraitRenderer.prototype, "templateId", {
        get: function () {
            return "template:" + this.trait.trait;
        },
        enumerable: true,
        configurable: true
    });
    TraitRenderer.prototype.renderTemplate = function (container) {
        return container;
    };
    TraitRenderer.prototype.renderElement = function (element, index, templateData) {
        var renderedElementIndex = firstIndex(this.renderedElements, function (el) { return el.templateData === templateData; });
        if (renderedElementIndex >= 0) {
            var rendered = this.renderedElements[renderedElementIndex];
            this.trait.unrender(templateData);
            rendered.index = index;
        }
        else {
            var rendered = { index: index, templateData: templateData };
            this.renderedElements.push(rendered);
        }
        this.trait.renderIndex(index, templateData);
    };
    TraitRenderer.prototype.splice = function (start, deleteCount, insertCount) {
        var rendered = [];
        for (var i = 0; i < this.renderedElements.length; i++) {
            var renderedElement = this.renderedElements[i];
            if (renderedElement.index < start) {
                rendered.push(renderedElement);
            }
            else if (renderedElement.index >= start + deleteCount) {
                rendered.push({
                    index: renderedElement.index + insertCount - deleteCount,
                    templateData: renderedElement.templateData
                });
            }
        }
        this.renderedElements = rendered;
    };
    TraitRenderer.prototype.renderIndexes = function (indexes) {
        for (var _i = 0, _a = this.renderedElements; _i < _a.length; _i++) {
            var _b = _a[_i], index = _b.index, templateData = _b.templateData;
            if (indexes.indexOf(index) > -1) {
                this.trait.renderIndex(index, templateData);
            }
        }
    };
    TraitRenderer.prototype.disposeTemplate = function (templateData) {
        var index = firstIndex(this.renderedElements, function (el) { return el.templateData === templateData; });
        if (index < 0) {
            return;
        }
        this.renderedElements.splice(index, 1);
    };
    return TraitRenderer;
}());
var Trait = /** @class */ (function () {
    function Trait(_trait) {
        this._trait = _trait;
        this._onChange = new Emitter();
        this.indexes = [];
    }
    Object.defineProperty(Trait.prototype, "onChange", {
        get: function () { return this._onChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trait.prototype, "trait", {
        get: function () { return this._trait; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Trait.prototype, "renderer", {
        get: function () {
            return new TraitRenderer(this);
        },
        enumerable: true,
        configurable: true
    });
    Trait.prototype.splice = function (start, deleteCount, elements) {
        var diff = elements.length - deleteCount;
        var end = start + deleteCount;
        var indexes = this.indexes.filter(function (i) { return i < start; }).concat(elements.map(function (hasTrait, i) { return hasTrait ? i + start : -1; }).filter(function (i) { return i !== -1; }), this.indexes.filter(function (i) { return i >= end; }).map(function (i) { return i + diff; }));
        this.renderer.splice(start, deleteCount, elements.length);
        this.set(indexes);
    };
    Trait.prototype.renderIndex = function (index, container) {
        DOM.toggleClass(container, this._trait, this.contains(index));
    };
    Trait.prototype.unrender = function (container) {
        DOM.removeClass(container, this._trait);
    };
    /**
     * Sets the indexes which should have this trait.
     *
     * @param indexes Indexes which should have this trait.
     * @return The old indexes which had this trait.
     */
    Trait.prototype.set = function (indexes) {
        var result = this.indexes;
        this.indexes = indexes;
        var toRender = disjunction(result, indexes);
        this.renderer.renderIndexes(toRender);
        this._onChange.fire({ indexes: indexes });
        return result;
    };
    Trait.prototype.get = function () {
        return this.indexes;
    };
    Trait.prototype.contains = function (index) {
        return this.indexes.some(function (i) { return i === index; });
    };
    Trait.prototype.dispose = function () {
        this.indexes = null;
        this._onChange = dispose(this._onChange);
    };
    __decorate([
        memoize
    ], Trait.prototype, "renderer", null);
    return Trait;
}());
var FocusTrait = /** @class */ (function (_super) {
    __extends(FocusTrait, _super);
    function FocusTrait(getDomId) {
        var _this = _super.call(this, 'focused') || this;
        _this.getDomId = getDomId;
        return _this;
    }
    FocusTrait.prototype.renderIndex = function (index, container) {
        _super.prototype.renderIndex.call(this, index, container);
        container.setAttribute('role', 'treeitem');
        container.setAttribute('id', this.getDomId(index));
    };
    return FocusTrait;
}(Trait));
/**
 * The TraitSpliceable is used as a util class to be able
 * to preserve traits across splice calls, given an identity
 * provider.
 */
var TraitSpliceable = /** @class */ (function () {
    function TraitSpliceable(trait, view, getId) {
        this.trait = trait;
        this.view = view;
        this.getId = getId;
    }
    TraitSpliceable.prototype.splice = function (start, deleteCount, elements) {
        var _this = this;
        if (!this.getId) {
            return this.trait.splice(start, deleteCount, elements.map(function (e) { return false; }));
        }
        var pastElementsWithTrait = this.trait.get().map(function (i) { return _this.getId(_this.view.element(i)); });
        var elementsWithTrait = elements.map(function (e) { return pastElementsWithTrait.indexOf(_this.getId(e)) > -1; });
        this.trait.splice(start, deleteCount, elementsWithTrait);
    };
    return TraitSpliceable;
}());
function isInputElement(e) {
    return e.tagName === 'INPUT' || e.tagName === 'TEXTAREA';
}
var KeyboardController = /** @class */ (function () {
    function KeyboardController(list, view, options) {
        this.list = list;
        this.view = view;
        var multipleSelectionSupport = !(options.multipleSelectionSupport === false);
        this.disposables = [];
        this.openController = options.openController || DefaultOpenController;
        var onKeyDown = chain(domEvent(view.domNode, 'keydown'))
            .filter(function (e) { return !isInputElement(e.target); })
            .map(function (e) { return new StandardKeyboardEvent(e); });
        onKeyDown.filter(function (e) { return e.keyCode === 3 /* Enter */; }).on(this.onEnter, this, this.disposables);
        onKeyDown.filter(function (e) { return e.keyCode === 16 /* UpArrow */; }).on(this.onUpArrow, this, this.disposables);
        onKeyDown.filter(function (e) { return e.keyCode === 18 /* DownArrow */; }).on(this.onDownArrow, this, this.disposables);
        onKeyDown.filter(function (e) { return e.keyCode === 11 /* PageUp */; }).on(this.onPageUpArrow, this, this.disposables);
        onKeyDown.filter(function (e) { return e.keyCode === 12 /* PageDown */; }).on(this.onPageDownArrow, this, this.disposables);
        onKeyDown.filter(function (e) { return e.keyCode === 9 /* Escape */; }).on(this.onEscape, this, this.disposables);
        if (multipleSelectionSupport) {
            onKeyDown.filter(function (e) { return (platform.isMacintosh ? e.metaKey : e.ctrlKey) && e.keyCode === 31 /* KEY_A */; }).on(this.onCtrlA, this, this.disposables);
        }
    }
    KeyboardController.prototype.onEnter = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.list.setSelection(this.list.getFocus());
        if (this.openController.shouldOpen(e.browserEvent)) {
            this.list.open(this.list.getFocus(), e.browserEvent);
        }
    };
    KeyboardController.prototype.onUpArrow = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.list.focusPrevious();
        this.list.reveal(this.list.getFocus()[0]);
        this.view.domNode.focus();
    };
    KeyboardController.prototype.onDownArrow = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.list.focusNext();
        this.list.reveal(this.list.getFocus()[0]);
        this.view.domNode.focus();
    };
    KeyboardController.prototype.onPageUpArrow = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.list.focusPreviousPage();
        this.list.reveal(this.list.getFocus()[0]);
        this.view.domNode.focus();
    };
    KeyboardController.prototype.onPageDownArrow = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.list.focusNextPage();
        this.list.reveal(this.list.getFocus()[0]);
        this.view.domNode.focus();
    };
    KeyboardController.prototype.onCtrlA = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.list.setSelection(range(this.list.length));
        this.view.domNode.focus();
    };
    KeyboardController.prototype.onEscape = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.list.setSelection([]);
        this.view.domNode.focus();
    };
    KeyboardController.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    return KeyboardController;
}());
var DOMFocusController = /** @class */ (function () {
    function DOMFocusController(list, view) {
        this.list = list;
        this.view = view;
        this.disposables = [];
        this.disposables = [];
        var onKeyDown = chain(domEvent(view.domNode, 'keydown'))
            .filter(function (e) { return !isInputElement(e.target); })
            .map(function (e) { return new StandardKeyboardEvent(e); });
        onKeyDown.filter(function (e) { return e.keyCode === 2 /* Tab */ && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey; })
            .on(this.onTab, this, this.disposables);
    }
    DOMFocusController.prototype.onTab = function (e) {
        if (e.target !== this.view.domNode) {
            return;
        }
        var focus = this.list.getFocus();
        if (focus.length === 0) {
            return;
        }
        var focusedDomElement = this.view.domElement(focus[0]);
        var tabIndexElement = focusedDomElement.querySelector('[tabIndex]');
        if (!tabIndexElement || !(tabIndexElement instanceof HTMLElement)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        tabIndexElement.focus();
    };
    DOMFocusController.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    return DOMFocusController;
}());
export function isSelectionSingleChangeEvent(event) {
    return platform.isMacintosh ? event.browserEvent.metaKey : event.browserEvent.ctrlKey;
}
export function isSelectionRangeChangeEvent(event) {
    return event.browserEvent.shiftKey;
}
function isMouseRightClick(event) {
    return event instanceof MouseEvent && event.button === 2;
}
var DefaultMultipleSelectionContoller = {
    isSelectionSingleChangeEvent: isSelectionSingleChangeEvent,
    isSelectionRangeChangeEvent: isSelectionRangeChangeEvent
};
var DefaultOpenController = {
    shouldOpen: function (event) {
        if (event instanceof MouseEvent) {
            return !isMouseRightClick(event);
        }
        return true;
    }
};
var MouseController = /** @class */ (function () {
    function MouseController(list, view, options) {
        if (options === void 0) { options = {}; }
        this.list = list;
        this.view = view;
        this.options = options;
        this.didJustPressContextMenuKey = false;
        this.disposables = [];
        this.multipleSelectionSupport = !(options.multipleSelectionSupport === false);
        if (this.multipleSelectionSupport) {
            this.multipleSelectionController = options.multipleSelectionController || DefaultMultipleSelectionContoller;
        }
        this.openController = options.openController || DefaultOpenController;
        view.onMouseDown(this.onMouseDown, this, this.disposables);
        view.onMouseClick(this.onPointer, this, this.disposables);
        view.onMouseDblClick(this.onDoubleClick, this, this.disposables);
        view.onTouchStart(this.onMouseDown, this, this.disposables);
        view.onTap(this.onPointer, this, this.disposables);
        Gesture.addTarget(view.domNode);
    }
    Object.defineProperty(MouseController.prototype, "onContextMenu", {
        get: function () {
            var _this = this;
            var fromKeydown = chain(domEvent(this.view.domNode, 'keydown'))
                .map(function (e) { return new StandardKeyboardEvent(e); })
                .filter(function (e) { return _this.didJustPressContextMenuKey = e.keyCode === 58 /* ContextMenu */ || (e.shiftKey && e.keyCode === 68 /* F10 */); })
                .filter(function (e) { e.preventDefault(); e.stopPropagation(); return false; })
                .event;
            var fromKeyup = chain(domEvent(this.view.domNode, 'keyup'))
                .filter(function () {
                var didJustPressContextMenuKey = _this.didJustPressContextMenuKey;
                _this.didJustPressContextMenuKey = false;
                return didJustPressContextMenuKey;
            })
                .filter(function () { return _this.list.getFocus().length > 0; })
                .map(function () {
                var index = _this.list.getFocus()[0];
                var element = _this.view.element(index);
                var anchor = _this.view.domElement(index);
                return { index: index, element: element, anchor: anchor };
            })
                .filter(function (_a) {
                var anchor = _a.anchor;
                return !!anchor;
            })
                .event;
            var fromMouse = chain(this.view.onContextMenu)
                .filter(function () { return !_this.didJustPressContextMenuKey; })
                .map(function (_a) {
                var element = _a.element, index = _a.index, browserEvent = _a.browserEvent;
                return ({ element: element, index: index, anchor: { x: browserEvent.clientX + 1, y: browserEvent.clientY } });
            })
                .event;
            return anyEvent(fromKeydown, fromKeyup, fromMouse);
        },
        enumerable: true,
        configurable: true
    });
    MouseController.prototype.isSelectionSingleChangeEvent = function (event) {
        if (this.multipleSelectionController) {
            return this.multipleSelectionController.isSelectionSingleChangeEvent(event);
        }
        return platform.isMacintosh ? event.browserEvent.metaKey : event.browserEvent.ctrlKey;
    };
    MouseController.prototype.isSelectionRangeChangeEvent = function (event) {
        if (this.multipleSelectionController) {
            return this.multipleSelectionController.isSelectionRangeChangeEvent(event);
        }
        return event.browserEvent.shiftKey;
    };
    MouseController.prototype.isSelectionChangeEvent = function (event) {
        return this.isSelectionSingleChangeEvent(event) || this.isSelectionRangeChangeEvent(event);
    };
    MouseController.prototype.onMouseDown = function (e) {
        if (this.options.focusOnMouseDown === false) {
            e.browserEvent.preventDefault();
            e.browserEvent.stopPropagation();
        }
        else if (document.activeElement !== e.browserEvent.target) {
            this.view.domNode.focus();
        }
        var reference = this.list.getFocus()[0];
        var selection = this.list.getSelection();
        reference = reference === undefined ? selection[0] : reference;
        if (this.multipleSelectionSupport && this.isSelectionRangeChangeEvent(e)) {
            return this.changeSelection(e, reference);
        }
        var focus = e.index;
        if (selection.every(function (s) { return s !== focus; })) {
            this.list.setFocus([focus]);
        }
        if (this.multipleSelectionSupport && this.isSelectionChangeEvent(e)) {
            return this.changeSelection(e, reference);
        }
        if (this.options.selectOnMouseDown && !isMouseRightClick(e.browserEvent)) {
            this.list.setSelection([focus]);
            if (this.openController.shouldOpen(e.browserEvent)) {
                this.list.open([focus], e.browserEvent);
            }
        }
    };
    MouseController.prototype.onPointer = function (e) {
        if (this.multipleSelectionSupport && this.isSelectionChangeEvent(e)) {
            return;
        }
        if (!this.options.selectOnMouseDown) {
            var focus_1 = this.list.getFocus();
            this.list.setSelection(focus_1);
            if (this.openController.shouldOpen(e.browserEvent)) {
                this.list.open(focus_1, e.browserEvent);
            }
        }
    };
    MouseController.prototype.onDoubleClick = function (e) {
        if (this.multipleSelectionSupport && this.isSelectionChangeEvent(e)) {
            return;
        }
        var focus = this.list.getFocus();
        this.list.setSelection(focus);
        this.list.pin(focus);
    };
    MouseController.prototype.changeSelection = function (e, reference) {
        var focus = e.index;
        if (this.isSelectionRangeChangeEvent(e) && reference !== undefined) {
            var min = Math.min(reference, focus);
            var max = Math.max(reference, focus);
            var rangeSelection = range(min, max + 1);
            var selection = this.list.getSelection();
            var contiguousRange = getContiguousRangeContaining(disjunction(selection, [reference]), reference);
            if (contiguousRange.length === 0) {
                return;
            }
            var newSelection = disjunction(rangeSelection, relativeComplement(selection, contiguousRange));
            this.list.setSelection(newSelection);
        }
        else if (this.isSelectionSingleChangeEvent(e)) {
            var selection = this.list.getSelection();
            var newSelection = selection.filter(function (i) { return i !== focus; });
            if (selection.length === newSelection.length) {
                this.list.setSelection(newSelection.concat([focus]));
            }
            else {
                this.list.setSelection(newSelection);
            }
        }
    };
    MouseController.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    __decorate([
        memoize
    ], MouseController.prototype, "onContextMenu", null);
    return MouseController;
}());
var DefaultStyleController = /** @class */ (function () {
    function DefaultStyleController(styleElement, selectorSuffix) {
        this.styleElement = styleElement;
        this.selectorSuffix = selectorSuffix;
    }
    DefaultStyleController.prototype.style = function (styles) {
        var suffix = this.selectorSuffix ? "." + this.selectorSuffix : '';
        var content = [];
        if (styles.listFocusBackground) {
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.focused { background-color: " + styles.listFocusBackground + "; }");
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.focused:hover { background-color: " + styles.listFocusBackground + "; }"); // overwrite :hover style in this case!
        }
        if (styles.listFocusForeground) {
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.focused { color: " + styles.listFocusForeground + "; }");
        }
        if (styles.listActiveSelectionBackground) {
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.selected { background-color: " + styles.listActiveSelectionBackground + "; }");
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.selected:hover { background-color: " + styles.listActiveSelectionBackground + "; }"); // overwrite :hover style in this case!
        }
        if (styles.listActiveSelectionForeground) {
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.selected { color: " + styles.listActiveSelectionForeground + "; }");
        }
        if (styles.listFocusAndSelectionBackground) {
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.selected.focused { background-color: " + styles.listFocusAndSelectionBackground + "; }");
        }
        if (styles.listFocusAndSelectionForeground) {
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.selected.focused { color: " + styles.listFocusAndSelectionForeground + "; }");
        }
        if (styles.listInactiveFocusBackground) {
            content.push(".monaco-list" + suffix + " .monaco-list-row.focused { background-color:  " + styles.listInactiveFocusBackground + "; }");
            content.push(".monaco-list" + suffix + " .monaco-list-row.focused:hover { background-color:  " + styles.listInactiveFocusBackground + "; }"); // overwrite :hover style in this case!
        }
        if (styles.listInactiveSelectionBackground) {
            content.push(".monaco-list" + suffix + " .monaco-list-row.selected { background-color:  " + styles.listInactiveSelectionBackground + "; }");
            content.push(".monaco-list" + suffix + " .monaco-list-row.selected:hover { background-color:  " + styles.listInactiveSelectionBackground + "; }"); // overwrite :hover style in this case!
        }
        if (styles.listInactiveSelectionForeground) {
            content.push(".monaco-list" + suffix + " .monaco-list-row.selected { color: " + styles.listInactiveSelectionForeground + "; }");
        }
        if (styles.listHoverBackground) {
            content.push(".monaco-list" + suffix + " .monaco-list-row:hover { background-color:  " + styles.listHoverBackground + "; }");
        }
        if (styles.listHoverForeground) {
            content.push(".monaco-list" + suffix + " .monaco-list-row:hover { color:  " + styles.listHoverForeground + "; }");
        }
        if (styles.listSelectionOutline) {
            content.push(".monaco-list" + suffix + " .monaco-list-row.selected { outline: 1px dotted " + styles.listSelectionOutline + "; outline-offset: -1px; }");
        }
        if (styles.listFocusOutline) {
            content.push(".monaco-list" + suffix + ":focus .monaco-list-row.focused { outline: 1px solid " + styles.listFocusOutline + "; outline-offset: -1px; }");
        }
        if (styles.listInactiveFocusOutline) {
            content.push(".monaco-list" + suffix + " .monaco-list-row.focused { outline: 1px dotted " + styles.listInactiveFocusOutline + "; outline-offset: -1px; }");
        }
        if (styles.listHoverOutline) {
            content.push(".monaco-list" + suffix + " .monaco-list-row:hover { outline: 1px dashed " + styles.listHoverOutline + "; outline-offset: -1px; }");
        }
        var newStyles = content.join('\n');
        if (newStyles !== this.styleElement.innerHTML) {
            this.styleElement.innerHTML = newStyles;
        }
    };
    return DefaultStyleController;
}());
export { DefaultStyleController };
var defaultStyles = {
    listFocusBackground: Color.fromHex('#073655'),
    listActiveSelectionBackground: Color.fromHex('#0E639C'),
    listActiveSelectionForeground: Color.fromHex('#FFFFFF'),
    listFocusAndSelectionBackground: Color.fromHex('#094771'),
    listFocusAndSelectionForeground: Color.fromHex('#FFFFFF'),
    listInactiveSelectionBackground: Color.fromHex('#3F3F46'),
    listHoverBackground: Color.fromHex('#2A2D2E'),
    listDropBackground: Color.fromHex('#383B3D')
};
var DefaultOptions = {
    keyboardSupport: true,
    mouseSupport: true,
    multipleSelectionSupport: true
};
// TODO@Joao: move these utils into a SortedArray class
function getContiguousRangeContaining(range, value) {
    var index = range.indexOf(value);
    if (index === -1) {
        return [];
    }
    var result = [];
    var i = index - 1;
    while (i >= 0 && range[i] === value - (index - i)) {
        result.push(range[i--]);
    }
    result.reverse();
    i = index;
    while (i < range.length && range[i] === value + (i - index)) {
        result.push(range[i++]);
    }
    return result;
}
/**
 * Given two sorted collections of numbers, returns the intersection
 * betweem them (OR).
 */
function disjunction(one, other) {
    var result = [];
    var i = 0, j = 0;
    while (i < one.length || j < other.length) {
        if (i >= one.length) {
            result.push(other[j++]);
        }
        else if (j >= other.length) {
            result.push(one[i++]);
        }
        else if (one[i] === other[j]) {
            result.push(one[i]);
            i++;
            j++;
            continue;
        }
        else if (one[i] < other[j]) {
            result.push(one[i++]);
        }
        else {
            result.push(other[j++]);
        }
    }
    return result;
}
/**
 * Given two sorted collections of numbers, returns the relative
 * complement between them (XOR).
 */
function relativeComplement(one, other) {
    var result = [];
    var i = 0, j = 0;
    while (i < one.length || j < other.length) {
        if (i >= one.length) {
            result.push(other[j++]);
        }
        else if (j >= other.length) {
            result.push(one[i++]);
        }
        else if (one[i] === other[j]) {
            i++;
            j++;
            continue;
        }
        else if (one[i] < other[j]) {
            result.push(one[i++]);
        }
        else {
            j++;
        }
    }
    return result;
}
var numericSort = function (a, b) { return a - b; };
var PipelineRenderer = /** @class */ (function () {
    function PipelineRenderer(_templateId, renderers) {
        this._templateId = _templateId;
        this.renderers = renderers;
    }
    Object.defineProperty(PipelineRenderer.prototype, "templateId", {
        get: function () {
            return this._templateId;
        },
        enumerable: true,
        configurable: true
    });
    PipelineRenderer.prototype.renderTemplate = function (container) {
        return this.renderers.map(function (r) { return r.renderTemplate(container); });
    };
    PipelineRenderer.prototype.renderElement = function (element, index, templateData) {
        var i = 0;
        for (var _i = 0, _a = this.renderers; _i < _a.length; _i++) {
            var renderer = _a[_i];
            renderer.renderElement(element, index, templateData[i++]);
        }
    };
    PipelineRenderer.prototype.disposeTemplate = function (templateData) {
        var i = 0;
        for (var _i = 0, _a = this.renderers; _i < _a.length; _i++) {
            var renderer = _a[_i];
            renderer.disposeTemplate(templateData[i++]);
        }
    };
    return PipelineRenderer;
}());
var List = /** @class */ (function () {
    function List(container, delegate, renderers, options) {
        if (options === void 0) { options = DefaultOptions; }
        var _this = this;
        this.idPrefix = "list_id_" + ++List.InstanceCount;
        this.eventBufferer = new EventBufferer();
        this.onContextMenu = Event.None;
        this._onOpen = new Emitter();
        this.onOpen = this._onOpen.event;
        this._onPin = new Emitter();
        this._onDidDispose = new Emitter();
        this.focus = new FocusTrait(function (i) { return _this.getElementDomId(i); });
        this.selection = new Trait('selected');
        mixin(options, defaultStyles, false);
        renderers = renderers.map(function (r) { return new PipelineRenderer(r.templateId, [_this.focus.renderer, _this.selection.renderer, r]); });
        this.view = new ListView(container, delegate, renderers, options);
        this.view.domNode.setAttribute('role', 'tree');
        DOM.addClass(this.view.domNode, this.idPrefix);
        this.view.domNode.tabIndex = 0;
        this.styleElement = DOM.createStyleSheet(this.view.domNode);
        this.styleController = options.styleController;
        if (!this.styleController) {
            this.styleController = new DefaultStyleController(this.styleElement, this.idPrefix);
        }
        this.spliceable = new CombinedSpliceable([
            new TraitSpliceable(this.focus, this.view, options.identityProvider),
            new TraitSpliceable(this.selection, this.view, options.identityProvider),
            this.view
        ]);
        this.disposables = [this.focus, this.selection, this.view, this._onDidDispose];
        this.onDidFocus = mapEvent(domEvent(this.view.domNode, 'focus', true), function () { return null; });
        this.onDidBlur = mapEvent(domEvent(this.view.domNode, 'blur', true), function () { return null; });
        this.disposables.push(new DOMFocusController(this, this.view));
        if (typeof options.keyboardSupport !== 'boolean' || options.keyboardSupport) {
            var controller = new KeyboardController(this, this.view, options);
            this.disposables.push(controller);
        }
        if (typeof options.mouseSupport !== 'boolean' || options.mouseSupport) {
            this.mouseController = new MouseController(this, this.view, options);
            this.disposables.push(this.mouseController);
            this.onContextMenu = this.mouseController.onContextMenu;
        }
        this.onFocusChange(this._onFocusChange, this, this.disposables);
        this.onSelectionChange(this._onSelectionChange, this, this.disposables);
        if (options.ariaLabel) {
            this.view.domNode.setAttribute('aria-label', options.ariaLabel);
        }
        this.style(options);
    }
    Object.defineProperty(List.prototype, "onFocusChange", {
        get: function () {
            var _this = this;
            return mapEvent(this.eventBufferer.wrapEvent(this.focus.onChange), function (e) { return _this.toListEvent(e); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onSelectionChange", {
        get: function () {
            var _this = this;
            return mapEvent(this.eventBufferer.wrapEvent(this.selection.onChange), function (e) { return _this.toListEvent(e); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onPin", {
        get: function () {
            var _this = this;
            return mapEvent(this._onPin.event, function (indexes) { return _this.toListEvent({ indexes: indexes }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onMouseClick", {
        get: function () { return this.view.onMouseClick; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onMouseDblClick", {
        get: function () { return this.view.onMouseDblClick; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onMouseUp", {
        get: function () { return this.view.onMouseUp; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onMouseDown", {
        get: function () { return this.view.onMouseDown; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onMouseOver", {
        get: function () { return this.view.onMouseOver; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onMouseMove", {
        get: function () { return this.view.onMouseMove; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onMouseOut", {
        get: function () { return this.view.onMouseOut; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onTouchStart", {
        get: function () { return this.view.onTouchStart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onTap", {
        get: function () { return this.view.onTap; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onKeyDown", {
        get: function () { return domEvent(this.view.domNode, 'keydown'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onKeyUp", {
        get: function () { return domEvent(this.view.domNode, 'keyup'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onKeyPress", {
        get: function () { return domEvent(this.view.domNode, 'keypress'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "onDidDispose", {
        get: function () { return this._onDidDispose.event; },
        enumerable: true,
        configurable: true
    });
    List.prototype.splice = function (start, deleteCount, elements) {
        var _this = this;
        if (elements === void 0) { elements = []; }
        if (deleteCount === 0 && elements.length === 0) {
            return;
        }
        this.eventBufferer.bufferEvents(function () { return _this.spliceable.splice(start, deleteCount, elements); });
    };
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            return this.view.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "contentHeight", {
        get: function () {
            return this.view.getContentHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "scrollTop", {
        get: function () {
            return this.view.getScrollTop();
        },
        set: function (scrollTop) {
            this.view.setScrollTop(scrollTop);
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.domFocus = function () {
        this.view.domNode.focus();
    };
    List.prototype.layout = function (height) {
        this.view.layout(height);
    };
    List.prototype.setSelection = function (indexes) {
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var index = indexes_1[_i];
            if (index < 0 || index >= this.length) {
                throw new Error("Invalid index " + index);
            }
        }
        indexes = indexes.sort(numericSort);
        this.selection.set(indexes);
    };
    List.prototype.selectNext = function (n, loop) {
        if (n === void 0) { n = 1; }
        if (loop === void 0) { loop = false; }
        if (this.length === 0) {
            return;
        }
        var selection = this.selection.get();
        var index = selection.length > 0 ? selection[0] + n : 0;
        this.setSelection(loop ? [index % this.length] : [Math.min(index, this.length - 1)]);
    };
    List.prototype.selectPrevious = function (n, loop) {
        if (n === void 0) { n = 1; }
        if (loop === void 0) { loop = false; }
        if (this.length === 0) {
            return;
        }
        var selection = this.selection.get();
        var index = selection.length > 0 ? selection[0] - n : 0;
        if (loop && index < 0) {
            index = this.length + (index % this.length);
        }
        this.setSelection([Math.max(index, 0)]);
    };
    List.prototype.getSelection = function () {
        return this.selection.get();
    };
    List.prototype.getSelectedElements = function () {
        var _this = this;
        return this.getSelection().map(function (i) { return _this.view.element(i); });
    };
    List.prototype.setFocus = function (indexes) {
        for (var _i = 0, indexes_2 = indexes; _i < indexes_2.length; _i++) {
            var index = indexes_2[_i];
            if (index < 0 || index >= this.length) {
                throw new Error("Invalid index " + index);
            }
        }
        indexes = indexes.sort(numericSort);
        this.focus.set(indexes);
    };
    List.prototype.focusNext = function (n, loop) {
        if (n === void 0) { n = 1; }
        if (loop === void 0) { loop = false; }
        if (this.length === 0) {
            return;
        }
        var focus = this.focus.get();
        var index = focus.length > 0 ? focus[0] + n : 0;
        this.setFocus(loop ? [index % this.length] : [Math.min(index, this.length - 1)]);
    };
    List.prototype.focusPrevious = function (n, loop) {
        if (n === void 0) { n = 1; }
        if (loop === void 0) { loop = false; }
        if (this.length === 0) {
            return;
        }
        var focus = this.focus.get();
        var index = focus.length > 0 ? focus[0] - n : 0;
        if (loop && index < 0) {
            index = (this.length + (index % this.length)) % this.length;
        }
        this.setFocus([Math.max(index, 0)]);
    };
    List.prototype.focusNextPage = function () {
        var _this = this;
        var lastPageIndex = this.view.indexAt(this.view.getScrollTop() + this.view.renderHeight);
        lastPageIndex = lastPageIndex === 0 ? 0 : lastPageIndex - 1;
        var lastPageElement = this.view.element(lastPageIndex);
        var currentlyFocusedElement = this.getFocusedElements()[0];
        if (currentlyFocusedElement !== lastPageElement) {
            this.setFocus([lastPageIndex]);
        }
        else {
            var previousScrollTop = this.view.getScrollTop();
            this.view.setScrollTop(previousScrollTop + this.view.renderHeight - this.view.elementHeight(lastPageIndex));
            if (this.view.getScrollTop() !== previousScrollTop) {
                // Let the scroll event listener run
                setTimeout(function () { return _this.focusNextPage(); }, 0);
            }
        }
    };
    List.prototype.focusPreviousPage = function () {
        var _this = this;
        var firstPageIndex;
        var scrollTop = this.view.getScrollTop();
        if (scrollTop === 0) {
            firstPageIndex = this.view.indexAt(scrollTop);
        }
        else {
            firstPageIndex = this.view.indexAfter(scrollTop - 1);
        }
        var firstPageElement = this.view.element(firstPageIndex);
        var currentlyFocusedElement = this.getFocusedElements()[0];
        if (currentlyFocusedElement !== firstPageElement) {
            this.setFocus([firstPageIndex]);
        }
        else {
            var previousScrollTop = scrollTop;
            this.view.setScrollTop(scrollTop - this.view.renderHeight);
            if (this.view.getScrollTop() !== previousScrollTop) {
                // Let the scroll event listener run
                setTimeout(function () { return _this.focusPreviousPage(); }, 0);
            }
        }
    };
    List.prototype.focusLast = function () {
        if (this.length === 0) {
            return;
        }
        this.setFocus([this.length - 1]);
    };
    List.prototype.focusFirst = function () {
        if (this.length === 0) {
            return;
        }
        this.setFocus([0]);
    };
    List.prototype.getFocus = function () {
        return this.focus.get();
    };
    List.prototype.getFocusedElements = function () {
        var _this = this;
        return this.getFocus().map(function (i) { return _this.view.element(i); });
    };
    List.prototype.reveal = function (index, relativeTop) {
        if (index < 0 || index >= this.length) {
            throw new Error("Invalid index " + index);
        }
        var scrollTop = this.view.getScrollTop();
        var elementTop = this.view.elementTop(index);
        var elementHeight = this.view.elementHeight(index);
        if (isNumber(relativeTop)) {
            // y = mx + b
            var m = elementHeight - this.view.renderHeight;
            this.view.setScrollTop(m * clamp(relativeTop, 0, 1) + elementTop);
        }
        else {
            var viewItemBottom = elementTop + elementHeight;
            var wrapperBottom = scrollTop + this.view.renderHeight;
            if (elementTop < scrollTop) {
                this.view.setScrollTop(elementTop);
            }
            else if (viewItemBottom >= wrapperBottom) {
                this.view.setScrollTop(viewItemBottom - this.view.renderHeight);
            }
        }
    };
    /**
     * Returns the relative position of an element rendered in the list.
     * Returns `null` if the element isn't *entirely* in the visible viewport.
     */
    List.prototype.getRelativeTop = function (index) {
        if (index < 0 || index >= this.length) {
            throw new Error("Invalid index " + index);
        }
        var scrollTop = this.view.getScrollTop();
        var elementTop = this.view.elementTop(index);
        var elementHeight = this.view.elementHeight(index);
        if (elementTop < scrollTop || elementTop + elementHeight > scrollTop + this.view.renderHeight) {
            return null;
        }
        // y = mx + b
        var m = elementHeight - this.view.renderHeight;
        return Math.abs((scrollTop - elementTop) / m);
    };
    List.prototype.getElementDomId = function (index) {
        return this.idPrefix + "_" + index;
    };
    List.prototype.isDOMFocused = function () {
        return this.view.domNode === document.activeElement;
    };
    List.prototype.getHTMLElement = function () {
        return this.view.domNode;
    };
    List.prototype.open = function (indexes, browserEvent) {
        var _this = this;
        for (var _i = 0, indexes_3 = indexes; _i < indexes_3.length; _i++) {
            var index = indexes_3[_i];
            if (index < 0 || index >= this.length) {
                throw new Error("Invalid index " + index);
            }
        }
        this._onOpen.fire({ indexes: indexes, elements: indexes.map(function (i) { return _this.view.element(i); }), browserEvent: browserEvent });
    };
    List.prototype.pin = function (indexes) {
        for (var _i = 0, indexes_4 = indexes; _i < indexes_4.length; _i++) {
            var index = indexes_4[_i];
            if (index < 0 || index >= this.length) {
                throw new Error("Invalid index " + index);
            }
        }
        this._onPin.fire(indexes);
    };
    List.prototype.style = function (styles) {
        this.styleController.style(styles);
    };
    List.prototype.toListEvent = function (_a) {
        var _this = this;
        var indexes = _a.indexes;
        return { indexes: indexes, elements: indexes.map(function (i) { return _this.view.element(i); }) };
    };
    List.prototype._onFocusChange = function () {
        var focus = this.focus.get();
        if (focus.length > 0) {
            this.view.domNode.setAttribute('aria-activedescendant', this.getElementDomId(focus[0]));
        }
        else {
            this.view.domNode.removeAttribute('aria-activedescendant');
        }
        this.view.domNode.setAttribute('role', 'tree');
        DOM.toggleClass(this.view.domNode, 'element-focused', focus.length > 0);
    };
    List.prototype._onSelectionChange = function () {
        var selection = this.selection.get();
        DOM.toggleClass(this.view.domNode, 'selection-none', selection.length === 0);
        DOM.toggleClass(this.view.domNode, 'selection-single', selection.length === 1);
        DOM.toggleClass(this.view.domNode, 'selection-multiple', selection.length > 1);
    };
    List.prototype.dispose = function () {
        this._onDidDispose.fire();
        this.disposables = dispose(this.disposables);
    };
    List.InstanceCount = 0;
    __decorate([
        memoize
    ], List.prototype, "onFocusChange", null);
    __decorate([
        memoize
    ], List.prototype, "onSelectionChange", null);
    __decorate([
        memoize
    ], List.prototype, "onPin", null);
    return List;
}());
export { List };
