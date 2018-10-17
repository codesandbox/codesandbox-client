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
import * as dom from '../../dom';
import { DomScrollableElement } from '../scrollbar/scrollableElement';
import { commonPrefixLength } from '../../../common/arrays';
import { Emitter } from '../../../common/event';
import { dispose } from '../../../common/lifecycle';
import { ScrollbarVisibility } from '../../../common/scrollable';
import './breadcrumbsWidget.css';
var BreadcrumbsItem = /** @class */ (function () {
    function BreadcrumbsItem() {
    }
    BreadcrumbsItem.prototype.dispose = function () { };
    return BreadcrumbsItem;
}());
export { BreadcrumbsItem };
var SimpleBreadcrumbsItem = /** @class */ (function (_super) {
    __extends(SimpleBreadcrumbsItem, _super);
    function SimpleBreadcrumbsItem(text, title) {
        if (title === void 0) { title = text; }
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.title = title;
        return _this;
    }
    SimpleBreadcrumbsItem.prototype.equals = function (other) {
        return other === this || other instanceof SimpleBreadcrumbsItem && other.text === this.text && other.title === this.title;
    };
    SimpleBreadcrumbsItem.prototype.render = function (container) {
        var node = document.createElement('div');
        node.title = this.title;
        node.innerText = this.text;
        container.appendChild(node);
    };
    return SimpleBreadcrumbsItem;
}(BreadcrumbsItem));
export { SimpleBreadcrumbsItem };
var BreadcrumbsWidget = /** @class */ (function () {
    function BreadcrumbsWidget(container) {
        var _this = this;
        this._disposables = new Array();
        this._onDidSelectItem = new Emitter();
        this._onDidFocusItem = new Emitter();
        this._onDidChangeFocus = new Emitter();
        this.onDidSelectItem = this._onDidSelectItem.event;
        this.onDidFocusItem = this._onDidFocusItem.event;
        this.onDidChangeFocus = this._onDidChangeFocus.event;
        this._items = new Array();
        this._nodes = new Array();
        this._freeNodes = new Array();
        this._focusedItemIdx = -1;
        this._selectedItemIdx = -1;
        this._domNode = document.createElement('div');
        this._domNode.className = 'monaco-breadcrumbs';
        this._domNode.tabIndex = 0;
        this._domNode.setAttribute('role', 'list');
        this._scrollable = new DomScrollableElement(this._domNode, {
            vertical: ScrollbarVisibility.Hidden,
            horizontal: ScrollbarVisibility.Auto,
            horizontalScrollbarSize: 3,
            useShadows: false,
            scrollYToX: true
        });
        this._disposables.push(this._scrollable);
        this._disposables.push(dom.addStandardDisposableListener(this._domNode, 'click', function (e) { return _this._onClick(e); }));
        container.appendChild(this._scrollable.getDomNode());
        this._styleElement = dom.createStyleSheet(this._domNode);
        var focusTracker = dom.trackFocus(this._domNode);
        this._disposables.push(focusTracker);
        this._disposables.push(focusTracker.onDidBlur(function (_) { return _this._onDidChangeFocus.fire(false); }));
        this._disposables.push(focusTracker.onDidFocus(function (_) { return _this._onDidChangeFocus.fire(true); }));
    }
    BreadcrumbsWidget.prototype.dispose = function () {
        dispose(this._disposables);
        this._onDidSelectItem.dispose();
        this._onDidFocusItem.dispose();
        this._onDidChangeFocus.dispose();
        this._domNode.remove();
        this._disposables.length = 0;
        this._nodes.length = 0;
        this._freeNodes.length = 0;
    };
    BreadcrumbsWidget.prototype.layout = function (dim) {
        if (dim) {
            this._domNode.style.width = dim.width + "px";
            this._domNode.style.height = dim.height + "px";
        }
        this._scrollable.setRevealOnScroll(false);
        this._scrollable.scanDomNode();
        this._scrollable.setRevealOnScroll(true);
    };
    BreadcrumbsWidget.prototype.style = function (style) {
        var content = '';
        if (style.breadcrumbsBackground) {
            content += ".monaco-breadcrumbs { background-color: " + style.breadcrumbsBackground + "}";
        }
        if (style.breadcrumbsForeground) {
            content += ".monaco-breadcrumbs .monaco-breadcrumb-item { color: " + style.breadcrumbsForeground + "}\n";
        }
        if (style.breadcrumbsFocusForeground) {
            content += ".monaco-breadcrumbs .monaco-breadcrumb-item.focused { color: " + style.breadcrumbsFocusForeground + "}\n";
        }
        if (style.breadcrumbsFocusAndSelectionForeground) {
            content += ".monaco-breadcrumbs .monaco-breadcrumb-item.focused.selected { color: " + style.breadcrumbsFocusAndSelectionForeground + "}\n";
        }
        if (style.breadcrumbsHoverForeground) {
            content += ".monaco-breadcrumbs .monaco-breadcrumb-item:hover:not(.focused):not(.selected) { color: " + style.breadcrumbsHoverForeground + "}\n";
        }
        if (this._styleElement.innerHTML !== content) {
            this._styleElement.innerHTML = content;
        }
    };
    BreadcrumbsWidget.prototype.domFocus = function () {
        var idx = this._focusedItemIdx >= 0 ? this._focusedItemIdx : this._items.length - 1;
        if (idx >= 0 && idx < this._items.length) {
            this._focus(idx, undefined);
        }
        else {
            this._domNode.focus();
        }
    };
    BreadcrumbsWidget.prototype.isDOMFocused = function () {
        var candidate = document.activeElement;
        while (candidate) {
            if (this._domNode === candidate) {
                return true;
            }
            candidate = candidate.parentElement;
        }
        return false;
    };
    BreadcrumbsWidget.prototype.getFocused = function () {
        return this._items[this._focusedItemIdx];
    };
    BreadcrumbsWidget.prototype.setFocused = function (item, payload) {
        this._focus(this._items.indexOf(item), payload);
    };
    BreadcrumbsWidget.prototype.focusPrev = function (payload) {
        if (this._focusedItemIdx > 0) {
            this._focus(this._focusedItemIdx - 1, payload);
        }
    };
    BreadcrumbsWidget.prototype.focusNext = function (payload) {
        if (this._focusedItemIdx + 1 < this._nodes.length) {
            this._focus(this._focusedItemIdx + 1, payload);
        }
    };
    BreadcrumbsWidget.prototype._focus = function (nth, payload) {
        this._focusedItemIdx = -1;
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            if (i !== nth) {
                dom.removeClass(node, 'focused');
            }
            else {
                this._focusedItemIdx = i;
                dom.addClass(node, 'focused');
                node.focus();
            }
        }
        this._reveal(this._focusedItemIdx, true);
        this._onDidFocusItem.fire({ type: 'focus', item: this._items[this._focusedItemIdx], node: this._nodes[this._focusedItemIdx], payload: payload });
    };
    BreadcrumbsWidget.prototype.reveal = function (item) {
        var idx = this._items.indexOf(item);
        if (idx >= 0) {
            this._reveal(idx, false);
        }
    };
    BreadcrumbsWidget.prototype._reveal = function (nth, minimal) {
        var node = this._nodes[nth];
        if (node) {
            var width = this._scrollable.getScrollDimensions().width;
            var scrollLeft = this._scrollable.getScrollPosition().scrollLeft;
            if (!minimal || node.offsetLeft > scrollLeft + width || node.offsetLeft < scrollLeft) {
                this._scrollable.setRevealOnScroll(false);
                this._scrollable.setScrollPosition({ scrollLeft: node.offsetLeft });
                this._scrollable.setRevealOnScroll(true);
            }
        }
    };
    BreadcrumbsWidget.prototype.getSelection = function () {
        return this._items[this._selectedItemIdx];
    };
    BreadcrumbsWidget.prototype.setSelection = function (item, payload) {
        this._select(this._items.indexOf(item), payload);
    };
    BreadcrumbsWidget.prototype._select = function (nth, payload) {
        this._selectedItemIdx = -1;
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            if (i !== nth) {
                dom.removeClass(node, 'selected');
            }
            else {
                this._selectedItemIdx = i;
                dom.addClass(node, 'selected');
            }
        }
        this._onDidSelectItem.fire({ type: 'select', item: this._items[this._selectedItemIdx], node: this._nodes[this._selectedItemIdx], payload: payload });
    };
    BreadcrumbsWidget.prototype.getItems = function () {
        return this._items;
    };
    BreadcrumbsWidget.prototype.setItems = function (items) {
        var _a;
        var prefix;
        var removed;
        try {
            prefix = commonPrefixLength(this._items, items, function (a, b) { return a.equals(b); });
            removed = (_a = this._items).splice.apply(_a, [prefix, this._items.length - prefix].concat(items.slice(prefix)));
            this._render(prefix);
            dispose(removed);
            this._focus(-1, undefined);
        }
        catch (e) {
            var newError = new Error("BreadcrumbsItem#setItems: newItems: " + items.length + ", prefix: " + prefix + ", removed: " + removed.length);
            newError.name = e.name;
            newError.stack = e.stack;
            throw newError;
        }
    };
    BreadcrumbsWidget.prototype._render = function (start) {
        for (; start < this._items.length && start < this._nodes.length; start++) {
            var item = this._items[start];
            var node = this._nodes[start];
            this._renderItem(item, node);
        }
        // case a: more nodes -> remove them
        while (start < this._nodes.length) {
            var free = this._nodes.pop();
            this._freeNodes.push(free);
            free.remove();
        }
        // case b: more items -> render them
        for (; start < this._items.length; start++) {
            var item = this._items[start];
            var node = this._freeNodes.length > 0 ? this._freeNodes.pop() : document.createElement('div');
            this._renderItem(item, node);
            this._domNode.appendChild(node);
            this._nodes.push(node);
        }
        this.layout(undefined);
    };
    BreadcrumbsWidget.prototype._renderItem = function (item, container) {
        dom.clearNode(container);
        container.className = '';
        item.render(container);
        container.tabIndex = -1;
        container.setAttribute('role', 'listitem');
        dom.addClass(container, 'monaco-breadcrumb-item');
    };
    BreadcrumbsWidget.prototype._onClick = function (event) {
        for (var el = event.target; el; el = el.parentElement) {
            var idx = this._nodes.indexOf(el);
            if (idx >= 0) {
                this._focus(idx, event);
                this._select(idx, event);
                break;
            }
        }
    };
    return BreadcrumbsWidget;
}());
export { BreadcrumbsWidget };
