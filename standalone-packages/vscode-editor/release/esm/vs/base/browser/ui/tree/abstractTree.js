/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import './media/tree.css';
import { dispose } from '../../../common/lifecycle.js';
import { List } from '../list/listWidget.js';
import { append, $, toggleClass } from '../../dom.js';
import { Relay, chain } from '../../../common/event.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
export function createComposedTreeListOptions(options) {
    if (!options) {
        return undefined;
    }
    var identityProvider = undefined;
    if (options.identityProvider) {
        var ip_1 = options.identityProvider;
        identityProvider = function (el) { return ip_1(el.element); };
    }
    var multipleSelectionController = undefined;
    if (options.multipleSelectionController) {
        var msc_1 = options.multipleSelectionController;
        multipleSelectionController = {
            isSelectionSingleChangeEvent: function (e) {
                return msc_1.isSelectionSingleChangeEvent(__assign({}, e, { element: e.element }));
            },
            isSelectionRangeChangeEvent: function (e) {
                return msc_1.isSelectionRangeChangeEvent(__assign({}, e, { element: e.element }));
            }
        };
    }
    var accessibilityProvider = undefined;
    if (options.accessibilityProvider) {
        var ap_1 = options.accessibilityProvider;
        accessibilityProvider = {
            getAriaLabel: function (e) {
                return ap_1.getAriaLabel(e.element);
            }
        };
    }
    return __assign({}, options, { identityProvider: identityProvider,
        multipleSelectionController: multipleSelectionController,
        accessibilityProvider: accessibilityProvider });
}
var ComposedTreeDelegate = /** @class */ (function () {
    function ComposedTreeDelegate(delegate) {
        this.delegate = delegate;
    }
    ComposedTreeDelegate.prototype.getHeight = function (element) {
        return this.delegate.getHeight(element.element);
    };
    ComposedTreeDelegate.prototype.getTemplateId = function (element) {
        return this.delegate.getTemplateId(element.element);
    };
    return ComposedTreeDelegate;
}());
export { ComposedTreeDelegate };
var TreeRenderer = /** @class */ (function () {
    function TreeRenderer(renderer, onDidChangeCollapseState) {
        this.renderer = renderer;
        this.renderedElements = new Map();
        this.renderedNodes = new Map();
        this.disposables = [];
        this.templateId = renderer.templateId;
        onDidChangeCollapseState(this.onDidChangeNodeTwistieState, this, this.disposables);
        if (renderer.onDidChangeTwistieState) {
            renderer.onDidChangeTwistieState(this.onDidChangeTwistieState, this, this.disposables);
        }
    }
    TreeRenderer.prototype.renderTemplate = function (container) {
        var el = append(container, $('.monaco-tl-row'));
        var twistie = append(el, $('.monaco-tl-twistie'));
        var contents = append(el, $('.monaco-tl-contents'));
        var templateData = this.renderer.renderTemplate(contents);
        return { twistie: twistie, templateData: templateData };
    };
    TreeRenderer.prototype.renderElement = function (node, index, templateData) {
        this.renderedNodes.set(node, templateData);
        this.renderedElements.set(node.element, node);
        templateData.twistie.style.width = 10 + node.depth * 10 + "px";
        this.renderTwistie(node, templateData.twistie);
        this.renderer.renderElement(node, index, templateData.templateData);
    };
    TreeRenderer.prototype.disposeElement = function (node, index, templateData) {
        this.renderer.disposeElement(node, index, templateData.templateData);
        this.renderedNodes.delete(node);
        this.renderedElements.set(node.element);
    };
    TreeRenderer.prototype.disposeTemplate = function (templateData) {
        this.renderer.disposeTemplate(templateData.templateData);
    };
    TreeRenderer.prototype.onDidChangeTwistieState = function (element) {
        var node = this.renderedElements.get(element);
        if (!node) {
            return;
        }
        this.onDidChangeNodeTwistieState(node);
    };
    TreeRenderer.prototype.onDidChangeNodeTwistieState = function (node) {
        var templateData = this.renderedNodes.get(node);
        if (!templateData) {
            return;
        }
        this.renderTwistie(node, templateData.twistie);
    };
    TreeRenderer.prototype.renderTwistie = function (node, twistieElement) {
        if (this.renderer.renderTwistie && this.renderer.renderTwistie(node.element, twistieElement)) {
            return;
        }
        TreeRenderer.renderDefaultTwistie(node, twistieElement);
    };
    TreeRenderer.renderDefaultTwistie = function (node, twistie) {
        toggleClass(twistie, 'collapsible', node.collapsible);
        toggleClass(twistie, 'collapsed', node.collapsed);
    };
    TreeRenderer.prototype.dispose = function () {
        this.renderedNodes.clear();
        this.renderedElements.clear();
        this.disposables = dispose(this.disposables);
    };
    return TreeRenderer;
}());
function isInputElement(e) {
    return e.tagName === 'INPUT' || e.tagName === 'TEXTAREA';
}
var AbstractTree = /** @class */ (function () {
    function AbstractTree(container, delegate, renderers, options) {
        var _a;
        if (options === void 0) { options = {}; }
        this.disposables = [];
        var treeDelegate = new ComposedTreeDelegate(delegate);
        var onDidChangeCollapseStateRelay = new Relay();
        var treeRenderers = renderers.map(function (r) { return new TreeRenderer(r, onDidChangeCollapseStateRelay.event); });
        (_a = this.disposables).push.apply(_a, treeRenderers);
        this.view = new List(container, treeDelegate, treeRenderers, createComposedTreeListOptions(options));
        this.onDidChangeFocus = this.view.onFocusChange;
        this.onDidChangeSelection = this.view.onSelectionChange;
        this.onContextMenu = this.view.onContextMenu;
        this.model = this.createModel(this.view, options);
        onDidChangeCollapseStateRelay.input = this.model.onDidChangeCollapseState;
        this.onDidChangeCollapseState = this.model.onDidChangeCollapseState;
        this.onDidChangeRenderNodeCount = this.model.onDidChangeRenderNodeCount;
        if (options.mouseSupport !== false) {
            this.view.onMouseClick(this.onMouseClick, this, this.disposables);
        }
        if (options.keyboardSupport !== false) {
            var onKeyDown = chain(this.view.onKeyDown)
                .filter(function (e) { return !isInputElement(e.target); })
                .map(function (e) { return new StandardKeyboardEvent(e); });
            onKeyDown.filter(function (e) { return e.keyCode === 15 /* LeftArrow */; }).on(this.onLeftArrow, this, this.disposables);
            onKeyDown.filter(function (e) { return e.keyCode === 17 /* RightArrow */; }).on(this.onRightArrow, this, this.disposables);
            onKeyDown.filter(function (e) { return e.keyCode === 10 /* Space */; }).on(this.onSpace, this, this.disposables);
        }
    }
    Object.defineProperty(AbstractTree.prototype, "onDidFocus", {
        get: function () { return this.view.onDidFocus; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractTree.prototype, "onDidBlur", {
        get: function () { return this.view.onDidBlur; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractTree.prototype, "onDidDispose", {
        get: function () { return this.view.onDidDispose; },
        enumerable: true,
        configurable: true
    });
    // Widget
    AbstractTree.prototype.getHTMLElement = function () {
        return this.view.getHTMLElement();
    };
    AbstractTree.prototype.domFocus = function () {
        this.view.domFocus();
    };
    AbstractTree.prototype.layout = function (height) {
        this.view.layout(height);
    };
    AbstractTree.prototype.style = function (styles) {
        this.view.style(styles);
    };
    // Tree navigation
    AbstractTree.prototype.getParentElement = function (location) {
        if (location === void 0) { location = null; }
        return this.model.getParentElement(location);
    };
    AbstractTree.prototype.getFirstElementChild = function (location) {
        if (location === void 0) { location = null; }
        return this.model.getFirstChildElement(location);
    };
    AbstractTree.prototype.getLastElementAncestor = function (location) {
        if (location === void 0) { location = null; }
        return this.model.getLastAncestorElement(location);
    };
    // Tree
    AbstractTree.prototype.getNode = function (location) {
        return this.model.getNode(location);
    };
    AbstractTree.prototype.collapse = function (location) {
        return this.model.setCollapsed(location, true);
    };
    AbstractTree.prototype.expand = function (location) {
        return this.model.setCollapsed(location, false);
    };
    AbstractTree.prototype.toggleCollapsed = function (location) {
        this.model.toggleCollapsed(location);
    };
    AbstractTree.prototype.collapseAll = function () {
        this.model.collapseAll();
    };
    AbstractTree.prototype.isCollapsed = function (location) {
        return this.model.isCollapsed(location);
    };
    AbstractTree.prototype.isExpanded = function (location) {
        return !this.isCollapsed(location);
    };
    AbstractTree.prototype.refilter = function () {
        this.model.refilter();
    };
    AbstractTree.prototype.setSelection = function (elements, browserEvent) {
        var _this = this;
        var indexes = elements.map(function (e) { return _this.model.getListIndex(e); });
        this.view.setSelection(indexes, browserEvent);
    };
    AbstractTree.prototype.getSelection = function () {
        var nodes = this.view.getSelectedElements();
        return nodes.map(function (n) { return n.element; });
    };
    AbstractTree.prototype.setFocus = function (elements, browserEvent) {
        var _this = this;
        var indexes = elements.map(function (e) { return _this.model.getListIndex(e); });
        this.view.setFocus(indexes, browserEvent);
    };
    AbstractTree.prototype.focusNext = function (n, loop, browserEvent) {
        if (n === void 0) { n = 1; }
        if (loop === void 0) { loop = false; }
        this.view.focusNext(n, loop, browserEvent);
    };
    AbstractTree.prototype.focusPrevious = function (n, loop, browserEvent) {
        if (n === void 0) { n = 1; }
        if (loop === void 0) { loop = false; }
        this.view.focusPrevious(n, loop, browserEvent);
    };
    AbstractTree.prototype.focusNextPage = function (browserEvent) {
        this.view.focusNextPage(browserEvent);
    };
    AbstractTree.prototype.focusPreviousPage = function (browserEvent) {
        this.view.focusPreviousPage(browserEvent);
    };
    AbstractTree.prototype.focusLast = function (browserEvent) {
        this.view.focusLast(browserEvent);
    };
    AbstractTree.prototype.focusFirst = function (browserEvent) {
        this.view.focusFirst(browserEvent);
    };
    AbstractTree.prototype.getFocus = function () {
        var nodes = this.view.getFocusedElements();
        return nodes.map(function (n) { return n.element; });
    };
    AbstractTree.prototype.open = function (elements) {
        var _this = this;
        var indexes = elements.map(function (e) { return _this.model.getListIndex(e); });
        this.view.open(indexes);
    };
    AbstractTree.prototype.reveal = function (location, relativeTop) {
        var index = this.model.getListIndex(location);
        this.view.reveal(index, relativeTop);
    };
    /**
     * Returns the relative position of an element rendered in the list.
     * Returns `null` if the element isn't *entirely* in the visible viewport.
     */
    AbstractTree.prototype.getRelativeTop = function (location) {
        var index = this.model.getListIndex(location);
        return this.view.getRelativeTop(index);
    };
    AbstractTree.prototype.onMouseClick = function (e) {
        var node = e.element;
        if (!node) {
            return;
        }
        var location = this.model.getNodeLocation(node);
        this.model.toggleCollapsed(location);
    };
    AbstractTree.prototype.onLeftArrow = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var nodes = this.view.getFocusedElements();
        if (nodes.length === 0) {
            return;
        }
        var node = nodes[0];
        var location = this.model.getNodeLocation(node);
        var didChange = this.model.setCollapsed(location, true);
        if (!didChange) {
            var parentLocation = this.model.getParentNodeLocation(location);
            if (parentLocation === null) {
                return;
            }
            var parentListIndex = this.model.getListIndex(parentLocation);
            this.view.reveal(parentListIndex);
            this.view.setFocus([parentListIndex]);
        }
    };
    AbstractTree.prototype.onRightArrow = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var nodes = this.view.getFocusedElements();
        if (nodes.length === 0) {
            return;
        }
        var node = nodes[0];
        var location = this.model.getNodeLocation(node);
        var didChange = this.model.setCollapsed(location, false);
        if (!didChange) {
            if (node.children.length === 0) {
                return;
            }
            var focusedIndex = this.view.getFocus()[0];
            var firstChildIndex = focusedIndex + 1;
            this.view.reveal(firstChildIndex);
            this.view.setFocus([firstChildIndex]);
        }
    };
    AbstractTree.prototype.onSpace = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var nodes = this.view.getFocusedElements();
        if (nodes.length === 0) {
            return;
        }
        var node = nodes[0];
        var location = this.model.getNodeLocation(node);
        this.model.toggleCollapsed(location);
    };
    AbstractTree.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
        this.view.dispose();
    };
    return AbstractTree;
}());
export { AbstractTree };
