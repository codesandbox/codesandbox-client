/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import * as Platform from '../../../common/platform.js';
import * as Browser from '../../../browser/browser.js';
import * as WinJS from '../../../common/winjs.base.js';
import * as Lifecycle from '../../../common/lifecycle.js';
import * as DOM from '../../../browser/dom.js';
import * as Diff from '../../../common/diff/diff.js';
import * as Touch from '../../../browser/touch.js';
import * as strings from '../../../common/strings.js';
import * as Mouse from '../../../browser/mouseEvent.js';
import * as Keyboard from '../../../browser/keyboardEvent.js';
import * as dnd from './treeDnd.js';
import { ArrayIterator, MappedIterator } from '../../../common/iterator.js';
import { ScrollableElement } from '../../../browser/ui/scrollbar/scrollableElement.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import { HeightMap } from './treeViewModel.js';
import * as _ from './tree.js';
import { Emitter } from '../../../common/event.js';
import { DataTransfers } from '../../../browser/dnd.js';
import { DefaultTreestyler } from './treeDefaults.js';
import { Delayer } from '../../../common/async.js';
function removeFromParent(element) {
    try {
        element.parentElement.removeChild(element);
    }
    catch (e) {
        // this will throw if this happens due to a blur event, nasty business
    }
}
var RowCache = /** @class */ (function () {
    function RowCache(context) {
        this.context = context;
        this._cache = { '': [] };
    }
    RowCache.prototype.alloc = function (templateId) {
        var result = this.cache(templateId).pop();
        if (!result) {
            var content = document.createElement('div');
            content.className = 'content';
            var row = document.createElement('div');
            row.appendChild(content);
            result = {
                element: row,
                templateId: templateId,
                templateData: this.context.renderer.renderTemplate(this.context.tree, templateId, content)
            };
        }
        return result;
    };
    RowCache.prototype.release = function (templateId, row) {
        removeFromParent(row.element);
        this.cache(templateId).push(row);
    };
    RowCache.prototype.cache = function (templateId) {
        return this._cache[templateId] || (this._cache[templateId] = []);
    };
    RowCache.prototype.garbageCollect = function () {
        var _this = this;
        if (this._cache) {
            Object.keys(this._cache).forEach(function (templateId) {
                _this._cache[templateId].forEach(function (cachedRow) {
                    _this.context.renderer.disposeTemplate(_this.context.tree, templateId, cachedRow.templateData);
                    cachedRow.element = null;
                    cachedRow.templateData = null;
                });
                delete _this._cache[templateId];
            });
        }
    };
    RowCache.prototype.dispose = function () {
        this.garbageCollect();
        this._cache = null;
        this.context = null;
    };
    return RowCache;
}());
export { RowCache };
var ViewItem = /** @class */ (function () {
    function ViewItem(context, model) {
        var _this = this;
        this.width = 0;
        this.context = context;
        this.model = model;
        this.id = this.model.id;
        this.row = null;
        this.top = 0;
        this.height = model.getHeight();
        this._styles = {};
        model.getAllTraits().forEach(function (t) { return _this._styles[t] = true; });
        if (model.isExpanded()) {
            this.addClass('expanded');
        }
    }
    Object.defineProperty(ViewItem.prototype, "expanded", {
        set: function (value) {
            value ? this.addClass('expanded') : this.removeClass('expanded');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewItem.prototype, "loading", {
        set: function (value) {
            value ? this.addClass('loading') : this.removeClass('loading');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewItem.prototype, "draggable", {
        get: function () {
            return this._draggable;
        },
        set: function (value) {
            this._draggable = value;
            this.render(true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewItem.prototype, "dropTarget", {
        set: function (value) {
            value ? this.addClass('drop-target') : this.removeClass('drop-target');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewItem.prototype, "element", {
        get: function () {
            return this.row && this.row.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewItem.prototype, "templateId", {
        get: function () {
            return this._templateId || (this._templateId = (this.context.renderer.getTemplateId && this.context.renderer.getTemplateId(this.context.tree, this.model.getElement())));
        },
        enumerable: true,
        configurable: true
    });
    ViewItem.prototype.addClass = function (name) {
        this._styles[name] = true;
        this.render(true);
    };
    ViewItem.prototype.removeClass = function (name) {
        delete this._styles[name]; // is this slow?
        this.render(true);
    };
    ViewItem.prototype.render = function (skipUserRender) {
        var _this = this;
        if (skipUserRender === void 0) { skipUserRender = false; }
        if (!this.model || !this.element) {
            return;
        }
        var classes = ['monaco-tree-row'];
        classes.push.apply(classes, Object.keys(this._styles));
        if (this.model.hasChildren()) {
            classes.push('has-children');
        }
        this.element.className = classes.join(' ');
        this.element.draggable = this.draggable;
        this.element.style.height = this.height + 'px';
        // ARIA
        this.element.setAttribute('role', 'treeitem');
        var accessibility = this.context.accessibilityProvider;
        var ariaLabel = accessibility.getAriaLabel(this.context.tree, this.model.getElement());
        if (ariaLabel) {
            this.element.setAttribute('aria-label', ariaLabel);
        }
        if (accessibility.getPosInSet && accessibility.getSetSize) {
            this.element.setAttribute('aria-setsize', accessibility.getSetSize());
            this.element.setAttribute('aria-posinset', accessibility.getPosInSet(this.context.tree, this.model.getElement()));
        }
        if (this.model.hasTrait('focused')) {
            var base64Id = strings.safeBtoa(this.model.id);
            this.element.setAttribute('aria-selected', 'true');
            this.element.setAttribute('id', base64Id);
        }
        else {
            this.element.setAttribute('aria-selected', 'false');
            this.element.removeAttribute('id');
        }
        if (this.model.hasChildren()) {
            this.element.setAttribute('aria-expanded', String(!!this.model.isExpanded()));
        }
        else {
            this.element.removeAttribute('aria-expanded');
        }
        this.element.setAttribute('aria-level', String(this.model.getDepth()));
        if (this.context.options.paddingOnRow) {
            this.element.style.paddingLeft = this.context.options.twistiePixels + ((this.model.getDepth() - 1) * this.context.options.indentPixels) + 'px';
        }
        else {
            this.element.style.paddingLeft = ((this.model.getDepth() - 1) * this.context.options.indentPixels) + 'px';
            this.row.element.firstElementChild.style.paddingLeft = this.context.options.twistiePixels + 'px';
        }
        var uri = this.context.dnd.getDragURI(this.context.tree, this.model.getElement());
        if (uri !== this.uri) {
            if (this.unbindDragStart) {
                this.unbindDragStart.dispose();
                this.unbindDragStart = null;
            }
            if (uri) {
                this.uri = uri;
                this.draggable = true;
                this.unbindDragStart = DOM.addDisposableListener(this.element, 'dragstart', function (e) {
                    _this.onDragStart(e);
                });
            }
            else {
                this.uri = null;
            }
        }
        if (!skipUserRender && this.element) {
            var style = window.getComputedStyle(this.element);
            var paddingLeft = parseFloat(style.paddingLeft);
            if (this.context.horizontalScrolling) {
                this.element.style.width = 'fit-content';
            }
            this.context.renderer.renderElement(this.context.tree, this.model.getElement(), this.templateId, this.row.templateData);
            if (this.context.horizontalScrolling) {
                this.width = DOM.getContentWidth(this.element) + paddingLeft;
                this.element.style.width = '';
            }
        }
    };
    ViewItem.prototype.updateWidth = function () {
        if (!this.context.horizontalScrolling || !this.element) {
            return;
        }
        var style = window.getComputedStyle(this.element);
        var paddingLeft = parseFloat(style.paddingLeft);
        this.element.style.width = 'fit-content';
        this.width = DOM.getContentWidth(this.element) + paddingLeft;
        this.element.style.width = '';
    };
    ViewItem.prototype.insertInDOM = function (container, afterElement) {
        if (!this.row) {
            this.row = this.context.cache.alloc(this.templateId);
            // used in reverse lookup from HTMLElement to Item
            this.element[TreeView.BINDING] = this;
        }
        if (this.element.parentElement) {
            return;
        }
        if (afterElement === null) {
            container.appendChild(this.element);
        }
        else {
            try {
                container.insertBefore(this.element, afterElement);
            }
            catch (e) {
                console.warn('Failed to locate previous tree element');
                container.appendChild(this.element);
            }
        }
        this.render();
    };
    ViewItem.prototype.removeFromDOM = function () {
        if (!this.row) {
            return;
        }
        if (this.unbindDragStart) {
            this.unbindDragStart.dispose();
            this.unbindDragStart = null;
        }
        this.uri = null;
        this.element[TreeView.BINDING] = null;
        this.context.cache.release(this.templateId, this.row);
        this.row = null;
    };
    ViewItem.prototype.dispose = function () {
        this.row = null;
        this.model = null;
    };
    return ViewItem;
}());
export { ViewItem };
var RootViewItem = /** @class */ (function (_super) {
    __extends(RootViewItem, _super);
    function RootViewItem(context, model, wrapper) {
        var _this = _super.call(this, context, model) || this;
        _this.row = {
            element: wrapper,
            templateData: null,
            templateId: null
        };
        return _this;
    }
    RootViewItem.prototype.render = function () {
        if (!this.model || !this.element) {
            return;
        }
        var classes = ['monaco-tree-wrapper'];
        classes.push.apply(classes, Object.keys(this._styles));
        if (this.model.hasChildren()) {
            classes.push('has-children');
        }
        this.element.className = classes.join(' ');
    };
    RootViewItem.prototype.insertInDOM = function (container, afterElement) {
        // noop
    };
    RootViewItem.prototype.removeFromDOM = function () {
        // noop
    };
    return RootViewItem;
}(ViewItem));
function reactionEquals(one, other) {
    if (!one && !other) {
        return true;
    }
    else if (!one || !other) {
        return false;
    }
    else if (one.accept !== other.accept) {
        return false;
    }
    else if (one.bubble !== other.bubble) {
        return false;
    }
    else if (one.effect !== other.effect) {
        return false;
    }
    else {
        return true;
    }
}
var TreeView = /** @class */ (function (_super) {
    __extends(TreeView, _super);
    function TreeView(context, container) {
        var _this = _super.call(this) || this;
        _this.lastClickTimeStamp = 0;
        _this.contentWidthUpdateDelayer = new Delayer(50);
        _this.isRefreshing = false;
        _this.refreshingPreviousChildrenIds = {};
        _this._onDOMFocus = new Emitter();
        _this._onDOMBlur = new Emitter();
        _this._onDidScroll = new Emitter();
        TreeView.counter++;
        _this.instance = TreeView.counter;
        var horizontalScrollMode = typeof context.options.horizontalScrollMode === 'undefined' ? ScrollbarVisibility.Hidden : context.options.horizontalScrollMode;
        _this.horizontalScrolling = horizontalScrollMode !== ScrollbarVisibility.Hidden;
        _this.context = {
            dataSource: context.dataSource,
            renderer: context.renderer,
            controller: context.controller,
            dnd: context.dnd,
            filter: context.filter,
            sorter: context.sorter,
            tree: context.tree,
            accessibilityProvider: context.accessibilityProvider,
            options: context.options,
            cache: new RowCache(context),
            horizontalScrolling: _this.horizontalScrolling
        };
        _this.modelListeners = [];
        _this.viewListeners = [];
        _this.model = null;
        _this.items = {};
        _this.domNode = document.createElement('div');
        _this.domNode.className = "monaco-tree no-focused-item monaco-tree-instance-" + _this.instance;
        // to allow direct tabbing into the tree instead of first focusing the tree
        _this.domNode.tabIndex = context.options.preventRootFocus ? -1 : 0;
        _this.styleElement = DOM.createStyleSheet(_this.domNode);
        _this.treeStyler = context.styler;
        if (!_this.treeStyler) {
            _this.treeStyler = new DefaultTreestyler(_this.styleElement, "monaco-tree-instance-" + _this.instance);
        }
        // ARIA
        _this.domNode.setAttribute('role', 'tree');
        if (_this.context.options.ariaLabel) {
            _this.domNode.setAttribute('aria-label', _this.context.options.ariaLabel);
        }
        if (_this.context.options.alwaysFocused) {
            DOM.addClass(_this.domNode, 'focused');
        }
        if (!_this.context.options.paddingOnRow) {
            DOM.addClass(_this.domNode, 'no-row-padding');
        }
        _this.wrapper = document.createElement('div');
        _this.wrapper.className = 'monaco-tree-wrapper';
        _this.scrollableElement = new ScrollableElement(_this.wrapper, {
            alwaysConsumeMouseWheel: true,
            horizontal: horizontalScrollMode,
            vertical: (typeof context.options.verticalScrollMode !== 'undefined' ? context.options.verticalScrollMode : ScrollbarVisibility.Auto),
            useShadows: context.options.useShadows
        });
        _this.scrollableElement.onScroll(function (e) {
            _this.render(e.scrollTop, e.height, e.scrollLeft, e.width, e.scrollWidth);
            _this._onDidScroll.fire();
        });
        if (Browser.isIE) {
            _this.wrapper.style.msTouchAction = 'none';
            _this.wrapper.style.msContentZooming = 'none';
        }
        else {
            Touch.Gesture.addTarget(_this.wrapper);
        }
        _this.rowsContainer = document.createElement('div');
        _this.rowsContainer.className = 'monaco-tree-rows';
        if (context.options.showTwistie) {
            _this.rowsContainer.className += ' show-twisties';
        }
        var focusTracker = DOM.trackFocus(_this.domNode);
        _this.viewListeners.push(focusTracker.onDidFocus(function () { return _this.onFocus(); }));
        _this.viewListeners.push(focusTracker.onDidBlur(function () { return _this.onBlur(); }));
        _this.viewListeners.push(focusTracker);
        _this.viewListeners.push(DOM.addDisposableListener(_this.domNode, 'keydown', function (e) { return _this.onKeyDown(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.domNode, 'keyup', function (e) { return _this.onKeyUp(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.domNode, 'mousedown', function (e) { return _this.onMouseDown(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.domNode, 'mouseup', function (e) { return _this.onMouseUp(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.wrapper, 'click', function (e) { return _this.onClick(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.wrapper, 'auxclick', function (e) { return _this.onClick(e); })); // >= Chrome 56
        _this.viewListeners.push(DOM.addDisposableListener(_this.domNode, 'contextmenu', function (e) { return _this.onContextMenu(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.wrapper, Touch.EventType.Tap, function (e) { return _this.onTap(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.wrapper, Touch.EventType.Change, function (e) { return _this.onTouchChange(e); }));
        if (Browser.isIE) {
            _this.viewListeners.push(DOM.addDisposableListener(_this.wrapper, 'MSPointerDown', function (e) { return _this.onMsPointerDown(e); }));
            _this.viewListeners.push(DOM.addDisposableListener(_this.wrapper, 'MSGestureTap', function (e) { return _this.onMsGestureTap(e); }));
            // these events come too fast, we throttle them
            _this.viewListeners.push(DOM.addDisposableThrottledListener(_this.wrapper, 'MSGestureChange', function (e) { return _this.onThrottledMsGestureChange(e); }, function (lastEvent, event) {
                event.stopPropagation();
                event.preventDefault();
                var result = { translationY: event.translationY, translationX: event.translationX };
                if (lastEvent) {
                    result.translationY += lastEvent.translationY;
                    result.translationX += lastEvent.translationX;
                }
                return result;
            }));
        }
        _this.viewListeners.push(DOM.addDisposableListener(window, 'dragover', function (e) { return _this.onDragOver(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(_this.wrapper, 'drop', function (e) { return _this.onDrop(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(window, 'dragend', function (e) { return _this.onDragEnd(e); }));
        _this.viewListeners.push(DOM.addDisposableListener(window, 'dragleave', function (e) { return _this.onDragOver(e); }));
        _this.wrapper.appendChild(_this.rowsContainer);
        _this.domNode.appendChild(_this.scrollableElement.getDomNode());
        container.appendChild(_this.domNode);
        _this.lastRenderTop = 0;
        _this.lastRenderHeight = 0;
        _this.didJustPressContextMenuKey = false;
        _this.currentDropTarget = null;
        _this.currentDropTargets = [];
        _this.shouldInvalidateDropReaction = false;
        _this.dragAndDropScrollInterval = null;
        _this.dragAndDropScrollTimeout = null;
        _this.onHiddenScrollTop = null;
        _this.onRowsChanged();
        _this.layout();
        _this.setupMSGesture();
        _this.applyStyles(context.options);
        return _this;
    }
    Object.defineProperty(TreeView.prototype, "onDOMFocus", {
        get: function () { return this._onDOMFocus.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "onDOMBlur", {
        get: function () { return this._onDOMBlur.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "onDidScroll", {
        get: function () { return this._onDidScroll.event; },
        enumerable: true,
        configurable: true
    });
    TreeView.prototype.applyStyles = function (styles) {
        this.treeStyler.style(styles);
    };
    TreeView.prototype.createViewItem = function (item) {
        return new ViewItem(this.context, item);
    };
    TreeView.prototype.getHTMLElement = function () {
        return this.domNode;
    };
    TreeView.prototype.focus = function () {
        this.domNode.focus();
    };
    TreeView.prototype.isFocused = function () {
        return document.activeElement === this.domNode;
    };
    TreeView.prototype.blur = function () {
        this.domNode.blur();
    };
    TreeView.prototype.onVisible = function () {
        this.scrollTop = this.onHiddenScrollTop;
        this.onHiddenScrollTop = null;
        this.setupMSGesture();
    };
    TreeView.prototype.setupMSGesture = function () {
        var _this = this;
        if (window.MSGesture) {
            this.msGesture = new MSGesture();
            setTimeout(function () { return _this.msGesture.target = _this.wrapper; }, 100); // TODO@joh, TODO@IETeam
        }
    };
    TreeView.prototype.onHidden = function () {
        this.onHiddenScrollTop = this.scrollTop;
    };
    TreeView.prototype.isTreeVisible = function () {
        return this.onHiddenScrollTop === null;
    };
    TreeView.prototype.layout = function (height, width) {
        if (!this.isTreeVisible()) {
            return;
        }
        this.viewHeight = height || DOM.getContentHeight(this.wrapper); // render
        this.scrollHeight = this.getContentHeight();
        if (this.horizontalScrolling) {
            this.viewWidth = width || DOM.getContentWidth(this.wrapper);
        }
    };
    TreeView.prototype.getFirstVisibleElement = function () {
        var item = this.itemAtIndex(this.indexAt(this.lastRenderTop));
        return item && item.model.getElement();
    };
    TreeView.prototype.render = function (scrollTop, viewHeight, scrollLeft, viewWidth, scrollWidth) {
        var i;
        var stop;
        var renderTop = scrollTop;
        var renderBottom = scrollTop + viewHeight;
        var thisRenderBottom = this.lastRenderTop + this.lastRenderHeight;
        // when view scrolls down, start rendering from the renderBottom
        for (i = this.indexAfter(renderBottom) - 1, stop = this.indexAt(Math.max(thisRenderBottom, renderTop)); i >= stop; i--) {
            this.insertItemInDOM(this.itemAtIndex(i));
        }
        // when view scrolls up, start rendering from either this.renderTop or renderBottom
        for (i = Math.min(this.indexAt(this.lastRenderTop), this.indexAfter(renderBottom)) - 1, stop = this.indexAt(renderTop); i >= stop; i--) {
            this.insertItemInDOM(this.itemAtIndex(i));
        }
        // when view scrolls down, start unrendering from renderTop
        for (i = this.indexAt(this.lastRenderTop), stop = Math.min(this.indexAt(renderTop), this.indexAfter(thisRenderBottom)); i < stop; i++) {
            this.removeItemFromDOM(this.itemAtIndex(i));
        }
        // when view scrolls up, start unrendering from either renderBottom this.renderTop
        for (i = Math.max(this.indexAfter(renderBottom), this.indexAt(this.lastRenderTop)), stop = this.indexAfter(thisRenderBottom); i < stop; i++) {
            this.removeItemFromDOM(this.itemAtIndex(i));
        }
        var topItem = this.itemAtIndex(this.indexAt(renderTop));
        if (topItem) {
            this.rowsContainer.style.top = (topItem.top - renderTop) + 'px';
        }
        if (this.horizontalScrolling) {
            this.rowsContainer.style.left = -scrollLeft + 'px';
            this.rowsContainer.style.width = Math.max(scrollWidth, viewWidth) + "px";
        }
        this.lastRenderTop = renderTop;
        this.lastRenderHeight = renderBottom - renderTop;
    };
    TreeView.prototype.setModel = function (newModel) {
        this.releaseModel();
        this.model = newModel;
        this.model.onRefresh(this.onRefreshing, this, this.modelListeners);
        this.model.onDidRefresh(this.onRefreshed, this, this.modelListeners);
        this.model.onSetInput(this.onClearingInput, this, this.modelListeners);
        this.model.onDidSetInput(this.onSetInput, this, this.modelListeners);
        this.model.onDidFocus(this.onModelFocusChange, this, this.modelListeners);
        this.model.onRefreshItemChildren(this.onItemChildrenRefreshing, this, this.modelListeners);
        this.model.onDidRefreshItemChildren(this.onItemChildrenRefreshed, this, this.modelListeners);
        this.model.onDidRefreshItem(this.onItemRefresh, this, this.modelListeners);
        this.model.onExpandItem(this.onItemExpanding, this, this.modelListeners);
        this.model.onDidExpandItem(this.onItemExpanded, this, this.modelListeners);
        this.model.onCollapseItem(this.onItemCollapsing, this, this.modelListeners);
        this.model.onDidRevealItem(this.onItemReveal, this, this.modelListeners);
        this.model.onDidAddTraitItem(this.onItemAddTrait, this, this.modelListeners);
        this.model.onDidRemoveTraitItem(this.onItemRemoveTrait, this, this.modelListeners);
    };
    TreeView.prototype.onRefreshing = function () {
        this.isRefreshing = true;
    };
    TreeView.prototype.onRefreshed = function () {
        this.isRefreshing = false;
        this.onRowsChanged();
    };
    TreeView.prototype.onRowsChanged = function (scrollTop) {
        if (scrollTop === void 0) { scrollTop = this.scrollTop; }
        if (this.isRefreshing) {
            return;
        }
        this.scrollTop = scrollTop;
        this.updateScrollWidth();
    };
    TreeView.prototype.updateScrollWidth = function () {
        var _this = this;
        if (!this.horizontalScrolling) {
            return;
        }
        this.contentWidthUpdateDelayer.trigger(function () {
            var keys = Object.keys(_this.items);
            var scrollWidth = 0;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                scrollWidth = Math.max(scrollWidth, _this.items[key].width);
            }
            _this.scrollWidth = scrollWidth + 10 /* scrollbar */;
        });
    };
    TreeView.prototype.focusNextPage = function (eventPayload) {
        var _this = this;
        var lastPageIndex = this.indexAt(this.scrollTop + this.viewHeight);
        lastPageIndex = lastPageIndex === 0 ? 0 : lastPageIndex - 1;
        var lastPageElement = this.itemAtIndex(lastPageIndex).model.getElement();
        var currentlyFocusedElement = this.model.getFocus();
        if (currentlyFocusedElement !== lastPageElement) {
            this.model.setFocus(lastPageElement, eventPayload);
        }
        else {
            var previousScrollTop = this.scrollTop;
            this.scrollTop += this.viewHeight;
            if (this.scrollTop !== previousScrollTop) {
                // Let the scroll event listener run
                setTimeout(function () {
                    _this.focusNextPage(eventPayload);
                }, 0);
            }
        }
    };
    TreeView.prototype.focusPreviousPage = function (eventPayload) {
        var _this = this;
        var firstPageIndex;
        if (this.scrollTop === 0) {
            firstPageIndex = this.indexAt(this.scrollTop);
        }
        else {
            firstPageIndex = this.indexAfter(this.scrollTop - 1);
        }
        var firstPageElement = this.itemAtIndex(firstPageIndex).model.getElement();
        var currentlyFocusedElement = this.model.getFocus();
        if (currentlyFocusedElement !== firstPageElement) {
            this.model.setFocus(firstPageElement, eventPayload);
        }
        else {
            var previousScrollTop = this.scrollTop;
            this.scrollTop -= this.viewHeight;
            if (this.scrollTop !== previousScrollTop) {
                // Let the scroll event listener run
                setTimeout(function () {
                    _this.focusPreviousPage(eventPayload);
                }, 0);
            }
        }
    };
    Object.defineProperty(TreeView.prototype, "viewHeight", {
        get: function () {
            var scrollDimensions = this.scrollableElement.getScrollDimensions();
            return scrollDimensions.height;
        },
        set: function (height) {
            this.scrollableElement.setScrollDimensions({ height: height });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "scrollHeight", {
        set: function (scrollHeight) {
            this.scrollableElement.setScrollDimensions({ scrollHeight: scrollHeight });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "viewWidth", {
        get: function () {
            var scrollDimensions = this.scrollableElement.getScrollDimensions();
            return scrollDimensions.width;
        },
        set: function (viewWidth) {
            this.scrollableElement.setScrollDimensions({ width: viewWidth });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "scrollWidth", {
        set: function (scrollWidth) {
            this.scrollableElement.setScrollDimensions({ scrollWidth: scrollWidth });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "scrollTop", {
        get: function () {
            var scrollPosition = this.scrollableElement.getScrollPosition();
            return scrollPosition.scrollTop;
        },
        set: function (scrollTop) {
            this.scrollableElement.setScrollDimensions({
                scrollHeight: this.getContentHeight()
            });
            this.scrollableElement.setScrollPosition({
                scrollTop: scrollTop
            });
        },
        enumerable: true,
        configurable: true
    });
    TreeView.prototype.getScrollPosition = function () {
        var height = this.getContentHeight() - this.viewHeight;
        return height <= 0 ? 1 : this.scrollTop / height;
    };
    TreeView.prototype.setScrollPosition = function (pos) {
        var height = this.getContentHeight() - this.viewHeight;
        this.scrollTop = height * pos;
    };
    // Events
    TreeView.prototype.onClearingInput = function (e) {
        var item = e.item;
        if (item) {
            this.onRemoveItems(new MappedIterator(item.getNavigator(), function (item) { return item && item.id; }));
            this.onRowsChanged();
        }
    };
    TreeView.prototype.onSetInput = function (e) {
        this.context.cache.garbageCollect();
        this.inputItem = new RootViewItem(this.context, e.item, this.wrapper);
    };
    TreeView.prototype.onItemChildrenRefreshing = function (e) {
        var item = e.item;
        var viewItem = this.items[item.id];
        if (viewItem && this.context.options.showLoading) {
            viewItem.loadingTimer = setTimeout(function () {
                viewItem.loadingTimer = 0;
                viewItem.loading = true;
            }, TreeView.LOADING_DECORATION_DELAY);
        }
        if (!e.isNested) {
            var childrenIds = [];
            var navigator = item.getNavigator();
            var childItem;
            while (childItem = navigator.next()) {
                childrenIds.push(childItem.id);
            }
            this.refreshingPreviousChildrenIds[item.id] = childrenIds;
        }
    };
    TreeView.prototype.onItemChildrenRefreshed = function (e) {
        var _this = this;
        var item = e.item;
        var viewItem = this.items[item.id];
        if (viewItem) {
            if (viewItem.loadingTimer) {
                clearTimeout(viewItem.loadingTimer);
                viewItem.loadingTimer = 0;
            }
            viewItem.loading = false;
        }
        if (!e.isNested) {
            var previousChildrenIds = this.refreshingPreviousChildrenIds[item.id];
            var afterModelItems = [];
            var navigator = item.getNavigator();
            var childItem;
            while (childItem = navigator.next()) {
                afterModelItems.push(childItem);
            }
            var skipDiff = Math.abs(previousChildrenIds.length - afterModelItems.length) > 1000;
            var diff = void 0;
            var doToInsertItemsAlreadyExist = void 0;
            if (!skipDiff) {
                var lcs = new Diff.LcsDiff({
                    getLength: function () { return previousChildrenIds.length; },
                    getElementAtIndex: function (i) { return previousChildrenIds[i]; }
                }, {
                    getLength: function () { return afterModelItems.length; },
                    getElementAtIndex: function (i) { return afterModelItems[i].id; }
                }, null);
                diff = lcs.ComputeDiff(false);
                // this means that the result of the diff algorithm would result
                // in inserting items that were already registered. this can only
                // happen if the data provider returns bad ids OR if the sorting
                // of the elements has changed
                doToInsertItemsAlreadyExist = diff.some(function (d) {
                    if (d.modifiedLength > 0) {
                        for (var i = d.modifiedStart, len = d.modifiedStart + d.modifiedLength; i < len; i++) {
                            if (_this.items.hasOwnProperty(afterModelItems[i].id)) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
            }
            // 50 is an optimization number, at some point we're better off
            // just replacing everything
            if (!skipDiff && !doToInsertItemsAlreadyExist && diff.length < 50) {
                for (var i = 0, len = diff.length; i < len; i++) {
                    var diffChange = diff[i];
                    if (diffChange.originalLength > 0) {
                        this.onRemoveItems(new ArrayIterator(previousChildrenIds, diffChange.originalStart, diffChange.originalStart + diffChange.originalLength));
                    }
                    if (diffChange.modifiedLength > 0) {
                        var beforeItem = afterModelItems[diffChange.modifiedStart - 1] || item;
                        beforeItem = beforeItem.getDepth() > 0 ? beforeItem : null;
                        this.onInsertItems(new ArrayIterator(afterModelItems, diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength), beforeItem ? beforeItem.id : null);
                    }
                }
            }
            else if (skipDiff || diff.length) {
                this.onRemoveItems(new ArrayIterator(previousChildrenIds));
                this.onInsertItems(new ArrayIterator(afterModelItems), item.getDepth() > 0 ? item.id : null);
            }
            if (skipDiff || diff.length) {
                this.onRowsChanged();
            }
        }
    };
    TreeView.prototype.onItemRefresh = function (item) {
        this.onItemsRefresh([item]);
    };
    TreeView.prototype.onItemsRefresh = function (items) {
        var _this = this;
        this.onRefreshItemSet(items.filter(function (item) { return _this.items.hasOwnProperty(item.id); }));
        this.onRowsChanged();
    };
    TreeView.prototype.onItemExpanding = function (e) {
        var viewItem = this.items[e.item.id];
        if (viewItem) {
            viewItem.expanded = true;
        }
    };
    TreeView.prototype.onItemExpanded = function (e) {
        var item = e.item;
        var viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.expanded = true;
            var height = this.onInsertItems(item.getNavigator(), item.id);
            var scrollTop = this.scrollTop;
            if (viewItem.top + viewItem.height <= this.scrollTop) {
                scrollTop += height;
            }
            this.onRowsChanged(scrollTop);
        }
    };
    TreeView.prototype.onItemCollapsing = function (e) {
        var item = e.item;
        var viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.expanded = false;
            this.onRemoveItems(new MappedIterator(item.getNavigator(), function (item) { return item && item.id; }));
            this.onRowsChanged();
        }
    };
    TreeView.prototype.updateWidth = function (item) {
        if (!item || !item.isVisible()) {
            return;
        }
        var viewItem = this.items[item.id];
        if (!viewItem) {
            return;
        }
        viewItem.updateWidth();
        this.updateScrollWidth();
    };
    TreeView.prototype.getRelativeTop = function (item) {
        if (item && item.isVisible()) {
            var viewItem = this.items[item.id];
            if (viewItem) {
                return (viewItem.top - this.scrollTop) / (this.viewHeight - viewItem.height);
            }
        }
        return -1;
    };
    TreeView.prototype.onItemReveal = function (e) {
        var item = e.item;
        var relativeTop = e.relativeTop;
        var viewItem = this.items[item.id];
        if (viewItem) {
            if (relativeTop !== null) {
                relativeTop = relativeTop < 0 ? 0 : relativeTop;
                relativeTop = relativeTop > 1 ? 1 : relativeTop;
                // y = mx + b
                var m = viewItem.height - this.viewHeight;
                this.scrollTop = m * relativeTop + viewItem.top;
            }
            else {
                var viewItemBottom = viewItem.top + viewItem.height;
                var wrapperBottom = this.scrollTop + this.viewHeight;
                if (viewItem.top < this.scrollTop) {
                    this.scrollTop = viewItem.top;
                }
                else if (viewItemBottom >= wrapperBottom) {
                    this.scrollTop = viewItemBottom - this.viewHeight;
                }
            }
        }
    };
    TreeView.prototype.onItemAddTrait = function (e) {
        var item = e.item;
        var trait = e.trait;
        var viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.addClass(trait);
        }
        if (trait === 'highlighted') {
            DOM.addClass(this.domNode, trait);
            // Ugly Firefox fix: input fields can't be selected if parent nodes are draggable
            if (viewItem) {
                this.highlightedItemWasDraggable = !!viewItem.draggable;
                if (viewItem.draggable) {
                    viewItem.draggable = false;
                }
            }
        }
    };
    TreeView.prototype.onItemRemoveTrait = function (e) {
        var item = e.item;
        var trait = e.trait;
        var viewItem = this.items[item.id];
        if (viewItem) {
            viewItem.removeClass(trait);
        }
        if (trait === 'highlighted') {
            DOM.removeClass(this.domNode, trait);
            // Ugly Firefox fix: input fields can't be selected if parent nodes are draggable
            if (this.highlightedItemWasDraggable) {
                viewItem.draggable = true;
            }
            this.highlightedItemWasDraggable = false;
        }
    };
    TreeView.prototype.onModelFocusChange = function () {
        var focus = this.model && this.model.getFocus();
        DOM.toggleClass(this.domNode, 'no-focused-item', !focus);
        // ARIA
        if (focus) {
            this.domNode.setAttribute('aria-activedescendant', strings.safeBtoa(this.context.dataSource.getId(this.context.tree, focus)));
        }
        else {
            this.domNode.removeAttribute('aria-activedescendant');
        }
    };
    // HeightMap "events"
    TreeView.prototype.onInsertItem = function (item) {
        var _this = this;
        item.onDragStart = function (e) { _this.onDragStart(item, e); };
        item.needsRender = true;
        this.refreshViewItem(item);
        this.items[item.id] = item;
    };
    TreeView.prototype.onRefreshItem = function (item, needsRender) {
        if (needsRender === void 0) { needsRender = false; }
        item.needsRender = item.needsRender || needsRender;
        this.refreshViewItem(item);
    };
    TreeView.prototype.onRemoveItem = function (item) {
        this.removeItemFromDOM(item);
        item.dispose();
        delete this.items[item.id];
    };
    // ViewItem refresh
    TreeView.prototype.refreshViewItem = function (item) {
        item.render();
        if (this.shouldBeRendered(item)) {
            this.insertItemInDOM(item);
        }
        else {
            this.removeItemFromDOM(item);
        }
    };
    // DOM Events
    TreeView.prototype.onClick = function (e) {
        if (this.lastPointerType && this.lastPointerType !== 'mouse') {
            return;
        }
        var event = new Mouse.StandardMouseEvent(e);
        var item = this.getItemAround(event.target);
        if (!item) {
            return;
        }
        if (Browser.isIE && Date.now() - this.lastClickTimeStamp < 300) {
            // IE10+ doesn't set the detail property correctly. While IE10 simply
            // counts the number of clicks, IE11 reports always 1. To align with
            // other browser, we set the value to 2 if clicks events come in a 300ms
            // sequence.
            event.detail = 2;
        }
        this.lastClickTimeStamp = Date.now();
        this.context.controller.onClick(this.context.tree, item.model.getElement(), event);
    };
    TreeView.prototype.onMouseDown = function (e) {
        this.didJustPressContextMenuKey = false;
        if (!this.context.controller.onMouseDown) {
            return;
        }
        if (this.lastPointerType && this.lastPointerType !== 'mouse') {
            return;
        }
        var event = new Mouse.StandardMouseEvent(e);
        if (event.ctrlKey && Platform.isNative && Platform.isMacintosh) {
            return;
        }
        var item = this.getItemAround(event.target);
        if (!item) {
            return;
        }
        this.context.controller.onMouseDown(this.context.tree, item.model.getElement(), event);
    };
    TreeView.prototype.onMouseUp = function (e) {
        if (!this.context.controller.onMouseUp) {
            return;
        }
        if (this.lastPointerType && this.lastPointerType !== 'mouse') {
            return;
        }
        var event = new Mouse.StandardMouseEvent(e);
        if (event.ctrlKey && Platform.isNative && Platform.isMacintosh) {
            return;
        }
        var item = this.getItemAround(event.target);
        if (!item) {
            return;
        }
        this.context.controller.onMouseUp(this.context.tree, item.model.getElement(), event);
    };
    TreeView.prototype.onTap = function (e) {
        var item = this.getItemAround(e.initialTarget);
        if (!item) {
            return;
        }
        this.context.controller.onTap(this.context.tree, item.model.getElement(), e);
    };
    TreeView.prototype.onTouchChange = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.scrollTop -= event.translationY;
    };
    TreeView.prototype.onContextMenu = function (event) {
        var resultEvent;
        var element;
        if (event instanceof KeyboardEvent || this.didJustPressContextMenuKey) {
            this.didJustPressContextMenuKey = false;
            var keyboardEvent = new Keyboard.StandardKeyboardEvent(event);
            element = this.model.getFocus();
            var position;
            if (!element) {
                element = this.model.getInput();
                position = DOM.getDomNodePagePosition(this.inputItem.element);
            }
            else {
                var id = this.context.dataSource.getId(this.context.tree, element);
                var viewItem = this.items[id];
                position = DOM.getDomNodePagePosition(viewItem.element);
            }
            resultEvent = new _.KeyboardContextMenuEvent(position.left + position.width, position.top, keyboardEvent);
        }
        else {
            var mouseEvent = new Mouse.StandardMouseEvent(event);
            var item = this.getItemAround(mouseEvent.target);
            if (!item) {
                return;
            }
            element = item.model.getElement();
            resultEvent = new _.MouseContextMenuEvent(mouseEvent);
        }
        this.context.controller.onContextMenu(this.context.tree, element, resultEvent);
    };
    TreeView.prototype.onKeyDown = function (e) {
        var event = new Keyboard.StandardKeyboardEvent(e);
        this.didJustPressContextMenuKey = event.keyCode === 58 /* ContextMenu */ || (event.shiftKey && event.keyCode === 68 /* F10 */);
        if (this.didJustPressContextMenuKey) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
            return; // Ignore event if target is a form input field (avoids browser specific issues)
        }
        this.context.controller.onKeyDown(this.context.tree, event);
    };
    TreeView.prototype.onKeyUp = function (e) {
        if (this.didJustPressContextMenuKey) {
            this.onContextMenu(e);
        }
        this.didJustPressContextMenuKey = false;
        this.context.controller.onKeyUp(this.context.tree, new Keyboard.StandardKeyboardEvent(e));
    };
    TreeView.prototype.onDragStart = function (item, e) {
        if (this.model.getHighlight()) {
            return;
        }
        var element = item.model.getElement();
        var selection = this.model.getSelection();
        var elements;
        if (selection.indexOf(element) > -1) {
            elements = selection;
        }
        else {
            elements = [element];
        }
        e.dataTransfer.effectAllowed = 'copyMove';
        e.dataTransfer.setData(DataTransfers.RESOURCES, JSON.stringify([item.uri]));
        if (e.dataTransfer.setDragImage) {
            var label = void 0;
            if (this.context.dnd.getDragLabel) {
                label = this.context.dnd.getDragLabel(this.context.tree, elements);
            }
            else {
                label = String(elements.length);
            }
            var dragImage_1 = document.createElement('div');
            dragImage_1.className = 'monaco-tree-drag-image';
            dragImage_1.textContent = label;
            document.body.appendChild(dragImage_1);
            e.dataTransfer.setDragImage(dragImage_1, -10, -10);
            setTimeout(function () { return document.body.removeChild(dragImage_1); }, 0);
        }
        this.currentDragAndDropData = new dnd.ElementsDragAndDropData(elements);
        TreeView.currentExternalDragAndDropData = new dnd.ExternalElementsDragAndDropData(elements);
        this.context.dnd.onDragStart(this.context.tree, this.currentDragAndDropData, new Mouse.DragMouseEvent(e));
    };
    TreeView.prototype.setupDragAndDropScrollInterval = function () {
        var _this = this;
        var viewTop = DOM.getTopLeftOffset(this.wrapper).top;
        if (!this.dragAndDropScrollInterval) {
            this.dragAndDropScrollInterval = window.setInterval(function () {
                if (_this.dragAndDropMouseY === undefined) {
                    return;
                }
                var diff = _this.dragAndDropMouseY - viewTop;
                var scrollDiff = 0;
                var upperLimit = _this.viewHeight - 35;
                if (diff < 35) {
                    scrollDiff = Math.max(-14, 0.2 * (diff - 35));
                }
                else if (diff > upperLimit) {
                    scrollDiff = Math.min(14, 0.2 * (diff - upperLimit));
                }
                _this.scrollTop += scrollDiff;
            }, 10);
            this.cancelDragAndDropScrollTimeout();
            this.dragAndDropScrollTimeout = window.setTimeout(function () {
                _this.cancelDragAndDropScrollInterval();
                _this.dragAndDropScrollTimeout = null;
            }, 1000);
        }
    };
    TreeView.prototype.cancelDragAndDropScrollInterval = function () {
        if (this.dragAndDropScrollInterval) {
            window.clearInterval(this.dragAndDropScrollInterval);
            this.dragAndDropScrollInterval = null;
        }
        this.cancelDragAndDropScrollTimeout();
    };
    TreeView.prototype.cancelDragAndDropScrollTimeout = function () {
        if (this.dragAndDropScrollTimeout) {
            window.clearTimeout(this.dragAndDropScrollTimeout);
            this.dragAndDropScrollTimeout = null;
        }
    };
    TreeView.prototype.onDragOver = function (e) {
        var _this = this;
        var event = new Mouse.DragMouseEvent(e);
        var viewItem = this.getItemAround(event.target);
        if (!viewItem || (event.posx === 0 && event.posy === 0 && event.browserEvent.type === DOM.EventType.DRAG_LEAVE)) {
            // dragging outside of tree
            if (this.currentDropTarget) {
                // clear previously hovered element feedback
                this.currentDropTargets.forEach(function (i) { return i.dropTarget = false; });
                this.currentDropTargets = [];
                if (this.currentDropPromise) {
                    this.currentDropPromise.cancel();
                    this.currentDropPromise = null;
                }
            }
            this.cancelDragAndDropScrollInterval();
            this.currentDropTarget = null;
            this.currentDropElement = null;
            this.dragAndDropMouseY = null;
            return false;
        }
        // dragging inside the tree
        this.setupDragAndDropScrollInterval();
        this.dragAndDropMouseY = event.posy;
        if (!this.currentDragAndDropData) {
            // just started dragging
            if (TreeView.currentExternalDragAndDropData) {
                this.currentDragAndDropData = TreeView.currentExternalDragAndDropData;
            }
            else {
                if (!event.dataTransfer.types) {
                    return false;
                }
                this.currentDragAndDropData = new dnd.DesktopDragAndDropData();
            }
        }
        this.currentDragAndDropData.update(event);
        var element;
        var item = viewItem.model;
        var reaction;
        // check the bubble up behavior
        do {
            element = item ? item.getElement() : this.model.getInput();
            reaction = this.context.dnd.onDragOver(this.context.tree, this.currentDragAndDropData, element, event);
            if (!reaction || reaction.bubble !== _.DragOverBubble.BUBBLE_UP) {
                break;
            }
            item = item && item.parent;
        } while (item);
        if (!item) {
            this.currentDropElement = null;
            return false;
        }
        var canDrop = reaction && reaction.accept;
        if (canDrop) {
            this.currentDropElement = item.getElement();
            event.preventDefault();
            event.dataTransfer.dropEffect = reaction.effect === _.DragOverEffect.COPY ? 'copy' : 'move';
        }
        else {
            this.currentDropElement = null;
        }
        // item is the model item where drop() should be called
        // can be null
        var currentDropTarget = item.id === this.inputItem.id ? this.inputItem : this.items[item.id];
        if (this.shouldInvalidateDropReaction || this.currentDropTarget !== currentDropTarget || !reactionEquals(this.currentDropElementReaction, reaction)) {
            this.shouldInvalidateDropReaction = false;
            if (this.currentDropTarget) {
                this.currentDropTargets.forEach(function (i) { return i.dropTarget = false; });
                this.currentDropTargets = [];
                if (this.currentDropPromise) {
                    this.currentDropPromise.cancel();
                    this.currentDropPromise = null;
                }
            }
            this.currentDropTarget = currentDropTarget;
            this.currentDropElementReaction = reaction;
            if (canDrop) {
                // setup hover feedback for drop target
                if (this.currentDropTarget) {
                    this.currentDropTarget.dropTarget = true;
                    this.currentDropTargets.push(this.currentDropTarget);
                }
                if (reaction.bubble === _.DragOverBubble.BUBBLE_DOWN) {
                    var nav = item.getNavigator();
                    var child;
                    while (child = nav.next()) {
                        viewItem = this.items[child.id];
                        if (viewItem) {
                            viewItem.dropTarget = true;
                            this.currentDropTargets.push(viewItem);
                        }
                    }
                }
                if (reaction.autoExpand) {
                    this.currentDropPromise = WinJS.TPromise.timeout(500)
                        .then(function () { return _this.context.tree.expand(_this.currentDropElement); })
                        .then(function () { return _this.shouldInvalidateDropReaction = true; });
                }
            }
        }
        return true;
    };
    TreeView.prototype.onDrop = function (e) {
        if (this.currentDropElement) {
            var event = new Mouse.DragMouseEvent(e);
            event.preventDefault();
            this.currentDragAndDropData.update(event);
            this.context.dnd.drop(this.context.tree, this.currentDragAndDropData, this.currentDropElement, event);
            this.onDragEnd(e);
        }
        this.cancelDragAndDropScrollInterval();
    };
    TreeView.prototype.onDragEnd = function (e) {
        if (this.currentDropTarget) {
            this.currentDropTargets.forEach(function (i) { return i.dropTarget = false; });
            this.currentDropTargets = [];
        }
        if (this.currentDropPromise) {
            this.currentDropPromise.cancel();
            this.currentDropPromise = null;
        }
        this.cancelDragAndDropScrollInterval();
        this.currentDragAndDropData = null;
        TreeView.currentExternalDragAndDropData = null;
        this.currentDropElement = null;
        this.currentDropTarget = null;
        this.dragAndDropMouseY = null;
    };
    TreeView.prototype.onFocus = function () {
        if (!this.context.options.alwaysFocused) {
            DOM.addClass(this.domNode, 'focused');
        }
        this._onDOMFocus.fire();
    };
    TreeView.prototype.onBlur = function () {
        if (!this.context.options.alwaysFocused) {
            DOM.removeClass(this.domNode, 'focused');
        }
        this.domNode.removeAttribute('aria-activedescendant'); // ARIA
        this._onDOMBlur.fire();
    };
    // MS specific DOM Events
    TreeView.prototype.onMsPointerDown = function (event) {
        if (!this.msGesture) {
            return;
        }
        // Circumvent IE11 breaking change in e.pointerType & TypeScript's stale definitions
        var pointerType = event.pointerType;
        if (pointerType === (event.MSPOINTER_TYPE_MOUSE || 'mouse')) {
            this.lastPointerType = 'mouse';
            return;
        }
        else if (pointerType === (event.MSPOINTER_TYPE_TOUCH || 'touch')) {
            this.lastPointerType = 'touch';
        }
        else {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.msGesture.addPointer(event.pointerId);
    };
    TreeView.prototype.onThrottledMsGestureChange = function (event) {
        this.scrollTop -= event.translationY;
    };
    TreeView.prototype.onMsGestureTap = function (event) {
        event.initialTarget = document.elementFromPoint(event.clientX, event.clientY);
        this.onTap(event);
    };
    // DOM changes
    TreeView.prototype.insertItemInDOM = function (item) {
        var elementAfter = null;
        var itemAfter = this.itemAfter(item);
        if (itemAfter && itemAfter.element) {
            elementAfter = itemAfter.element;
        }
        item.insertInDOM(this.rowsContainer, elementAfter);
    };
    TreeView.prototype.removeItemFromDOM = function (item) {
        if (!item) {
            return;
        }
        item.removeFromDOM();
    };
    // Helpers
    TreeView.prototype.shouldBeRendered = function (item) {
        return item.top < this.lastRenderTop + this.lastRenderHeight && item.top + item.height > this.lastRenderTop;
    };
    TreeView.prototype.getItemAround = function (element) {
        var candidate = this.inputItem;
        do {
            if (element[TreeView.BINDING]) {
                candidate = element[TreeView.BINDING];
            }
            if (element === this.wrapper || element === this.domNode) {
                return candidate;
            }
            if (element === document.body) {
                return null;
            }
        } while (element = element.parentElement);
        return undefined;
    };
    // Cleanup
    TreeView.prototype.releaseModel = function () {
        if (this.model) {
            this.modelListeners = Lifecycle.dispose(this.modelListeners);
            this.model = null;
        }
    };
    TreeView.prototype.dispose = function () {
        var _this = this;
        // TODO@joao: improve
        this.scrollableElement.dispose();
        this.releaseModel();
        this.modelListeners = null;
        this.viewListeners = Lifecycle.dispose(this.viewListeners);
        this._onDOMFocus.dispose();
        this._onDOMBlur.dispose();
        if (this.domNode.parentNode) {
            this.domNode.parentNode.removeChild(this.domNode);
        }
        this.domNode = null;
        if (this.items) {
            Object.keys(this.items).forEach(function (key) { return _this.items[key].removeFromDOM(); });
            this.items = null;
        }
        if (this.context.cache) {
            this.context.cache.dispose();
            this.context.cache = null;
        }
        _super.prototype.dispose.call(this);
    };
    TreeView.BINDING = 'monaco-tree-row';
    TreeView.LOADING_DECORATION_DELAY = 800;
    TreeView.counter = 0;
    TreeView.currentExternalDragAndDropData = null;
    return TreeView;
}(HeightMap));
export { TreeView };
