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
import { localize } from '../../../nls.js';
import { basename } from '../../../base/common/paths.js';
import { URI } from '../../../base/common/uri.js';
import { debounceEvent, Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { asThenable } from '../../../base/common/async.js';
import { TreeItemCollapsibleState, ThemeIcon } from './extHostTypes.js';
import { isUndefinedOrNull, isString } from '../../../base/common/types.js';
import { equals } from '../../../base/common/arrays.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
function toTreeItemLabel(label, extension) {
    if (isString(label)) {
        return { label: label };
    }
    if (label
        && typeof label === 'object'
        && typeof label.label === 'string') {
        checkProposedApiEnabled(extension);
        var highlights = void 0;
        if (Array.isArray(label.highlights)) {
            highlights = label.highlights.filter((function (highlight) { return highlight.length === 2 && typeof highlight[0] === 'number' && typeof highlight[1] === 'number'; }));
            highlights = highlights.length ? highlights : void 0;
        }
        return { label: label.label, highlights: highlights };
    }
    return void 0;
}
var ExtHostTreeViews = /** @class */ (function () {
    function ExtHostTreeViews(_proxy, commands, logService) {
        var _this = this;
        this._proxy = _proxy;
        this.commands = commands;
        this.logService = logService;
        this.treeViews = new Map();
        commands.registerArgumentProcessor({
            processArgument: function (arg) {
                if (arg && arg.$treeViewId && arg.$treeItemHandle) {
                    return _this.convertArgument(arg);
                }
                return arg;
            }
        });
    }
    ExtHostTreeViews.prototype.registerTreeDataProvider = function (id, treeDataProvider, extension) {
        var treeView = this.createTreeView(id, { treeDataProvider: treeDataProvider }, extension);
        return { dispose: function () { return treeView.dispose(); } };
    };
    ExtHostTreeViews.prototype.createTreeView = function (viewId, options, extension) {
        var _this = this;
        if (!options || !options.treeDataProvider) {
            throw new Error('Options with treeDataProvider is mandatory');
        }
        if (options.showCollapseAll) {
            checkProposedApiEnabled(extension);
        }
        var treeView = this.createExtHostTreeViewer(viewId, options, extension);
        return {
            get onDidCollapseElement() { return treeView.onDidCollapseElement; },
            get onDidExpandElement() { return treeView.onDidExpandElement; },
            get selection() { return treeView.selectedElements; },
            get onDidChangeSelection() { return treeView.onDidChangeSelection; },
            get visible() { return treeView.visible; },
            get onDidChangeVisibility() { return treeView.onDidChangeVisibility; },
            reveal: function (element, options) {
                return treeView.reveal(element, options);
            },
            dispose: function () {
                _this.treeViews.delete(viewId);
                treeView.dispose();
            }
        };
    };
    ExtHostTreeViews.prototype.$getChildren = function (treeViewId, treeItemHandle) {
        var treeView = this.treeViews.get(treeViewId);
        if (!treeView) {
            return Promise.reject(new Error(localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId)));
        }
        return treeView.getChildren(treeItemHandle);
    };
    ExtHostTreeViews.prototype.$setExpanded = function (treeViewId, treeItemHandle, expanded) {
        var treeView = this.treeViews.get(treeViewId);
        if (!treeView) {
            throw new Error(localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId));
        }
        treeView.setExpanded(treeItemHandle, expanded);
    };
    ExtHostTreeViews.prototype.$setSelection = function (treeViewId, treeItemHandles) {
        var treeView = this.treeViews.get(treeViewId);
        if (!treeView) {
            throw new Error(localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId));
        }
        treeView.setSelection(treeItemHandles);
    };
    ExtHostTreeViews.prototype.$setVisible = function (treeViewId, isVisible) {
        var treeView = this.treeViews.get(treeViewId);
        if (!treeView) {
            throw new Error(localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId));
        }
        treeView.setVisible(isVisible);
    };
    ExtHostTreeViews.prototype.createExtHostTreeViewer = function (id, options, extension) {
        var treeView = new ExtHostTreeView(id, options, this._proxy, this.commands.converter, this.logService, extension);
        this.treeViews.set(id, treeView);
        return treeView;
    };
    ExtHostTreeViews.prototype.convertArgument = function (arg) {
        var treeView = this.treeViews.get(arg.$treeViewId);
        return treeView ? treeView.getExtensionElement(arg.$treeItemHandle) : null;
    };
    return ExtHostTreeViews;
}());
export { ExtHostTreeViews };
var ExtHostTreeView = /** @class */ (function (_super) {
    __extends(ExtHostTreeView, _super);
    function ExtHostTreeView(viewId, options, proxy, commands, logService, extension) {
        var _this = _super.call(this) || this;
        _this.viewId = viewId;
        _this.proxy = proxy;
        _this.commands = commands;
        _this.logService = logService;
        _this.extension = extension;
        _this.roots = null;
        _this.elements = new Map();
        _this.nodes = new Map();
        _this._visible = false;
        _this._selectedHandles = [];
        _this._onDidExpandElement = _this._register(new Emitter());
        _this.onDidExpandElement = _this._onDidExpandElement.event;
        _this._onDidCollapseElement = _this._register(new Emitter());
        _this.onDidCollapseElement = _this._onDidCollapseElement.event;
        _this._onDidChangeSelection = _this._register(new Emitter());
        _this.onDidChangeSelection = _this._onDidChangeSelection.event;
        _this._onDidChangeVisibility = _this._register(new Emitter());
        _this.onDidChangeVisibility = _this._onDidChangeVisibility.event;
        _this.refreshPromise = Promise.resolve(null);
        _this.dataProvider = options.treeDataProvider;
        _this.proxy.$registerTreeViewDataProvider(viewId, { showCollapseAll: !!options.showCollapseAll });
        if (_this.dataProvider.onDidChangeTreeData) {
            var refreshingPromise_1, promiseCallback_1;
            _this._register(debounceEvent(_this.dataProvider.onDidChangeTreeData, function (last, current) {
                if (!refreshingPromise_1) {
                    // New refresh has started
                    refreshingPromise_1 = new Promise(function (c) { return promiseCallback_1 = c; });
                    _this.refreshPromise = _this.refreshPromise.then(function () { return refreshingPromise_1; });
                }
                return last ? last.concat([current]) : [current];
            }, 200)(function (elements) {
                var _promiseCallback = promiseCallback_1;
                refreshingPromise_1 = null;
                _this.refresh(elements).then(function () { return _promiseCallback(); });
            }));
        }
        return _this;
    }
    Object.defineProperty(ExtHostTreeView.prototype, "visible", {
        get: function () { return this._visible; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTreeView.prototype, "selectedElements", {
        get: function () {
            var _this = this;
            return this._selectedHandles.map(function (handle) { return _this.getExtensionElement(handle); }).filter(function (element) { return !isUndefinedOrNull(element); });
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTreeView.prototype.getChildren = function (parentHandle) {
        var parentElement = parentHandle ? this.getExtensionElement(parentHandle) : void 0;
        if (parentHandle && !parentElement) {
            console.error("No tree item with id '" + parentHandle + "' found.");
            return Promise.resolve([]);
        }
        var childrenNodes = this.getChildrenNodes(parentHandle); // Get it from cache
        return (childrenNodes ? Promise.resolve(childrenNodes) : this.fetchChildrenNodes(parentElement))
            .then(function (nodes) { return nodes.map(function (n) { return n.item; }); });
    };
    ExtHostTreeView.prototype.getExtensionElement = function (treeItemHandle) {
        return this.elements.get(treeItemHandle);
    };
    ExtHostTreeView.prototype.reveal = function (element, options) {
        var _this = this;
        options = options ? options : { select: true, focus: false };
        var select = isUndefinedOrNull(options.select) ? true : options.select;
        var focus = isUndefinedOrNull(options.focus) ? false : options.focus;
        var expand = isUndefinedOrNull(options.expand) ? false : options.expand;
        if (typeof this.dataProvider.getParent !== 'function') {
            return Promise.reject(new Error("Required registered TreeDataProvider to implement 'getParent' method to access 'reveal' method"));
        }
        return this.refreshPromise
            .then(function () { return _this.resolveUnknownParentChain(element); })
            .then(function (parentChain) { return _this.resolveTreeNode(element, parentChain[parentChain.length - 1])
            .then(function (treeNode) { return _this.proxy.$reveal(_this.viewId, treeNode.item, parentChain.map(function (p) { return p.item; }), { select: select, focus: focus, expand: expand }); }); }, function (error) { return _this.logService.error(error); });
    };
    ExtHostTreeView.prototype.setExpanded = function (treeItemHandle, expanded) {
        var element = this.getExtensionElement(treeItemHandle);
        if (element) {
            if (expanded) {
                this._onDidExpandElement.fire(Object.freeze({ element: element }));
            }
            else {
                this._onDidCollapseElement.fire(Object.freeze({ element: element }));
            }
        }
    };
    ExtHostTreeView.prototype.setSelection = function (treeItemHandles) {
        if (!equals(this._selectedHandles, treeItemHandles)) {
            this._selectedHandles = treeItemHandles;
            this._onDidChangeSelection.fire(Object.freeze({ selection: this.selectedElements }));
        }
    };
    ExtHostTreeView.prototype.setVisible = function (visible) {
        if (visible !== this._visible) {
            this._visible = visible;
            this._onDidChangeVisibility.fire(Object.freeze({ visible: this._visible }));
        }
    };
    ExtHostTreeView.prototype.resolveUnknownParentChain = function (element) {
        var _this = this;
        return this.resolveParent(element)
            .then(function (parent) {
            if (!parent) {
                return Promise.resolve([]);
            }
            return _this.resolveUnknownParentChain(parent)
                .then(function (result) { return _this.resolveTreeNode(parent, result[result.length - 1])
                .then(function (parentNode) {
                result.push(parentNode);
                return result;
            }); });
        });
    };
    ExtHostTreeView.prototype.resolveParent = function (element) {
        var _this = this;
        var node = this.nodes.get(element);
        if (node) {
            return Promise.resolve(node.parent ? this.elements.get(node.parent.item.handle) : null);
        }
        return asThenable(function () { return _this.dataProvider.getParent(element); });
    };
    ExtHostTreeView.prototype.resolveTreeNode = function (element, parent) {
        var _this = this;
        var node = this.nodes.get(element);
        if (node) {
            return Promise.resolve(node);
        }
        return asThenable(function () { return _this.dataProvider.getTreeItem(element); })
            .then(function (extTreeItem) { return _this.createHandle(element, extTreeItem, parent, true); })
            .then(function (handle) { return _this.getChildren(parent ? parent.item.handle : null)
            .then(function () {
            var cachedElement = _this.getExtensionElement(handle);
            if (cachedElement) {
                var node_1 = _this.nodes.get(cachedElement);
                if (node_1) {
                    return Promise.resolve(node_1);
                }
            }
            throw new Error("Cannot resolve tree item for element " + handle);
        }); });
    };
    ExtHostTreeView.prototype.getChildrenNodes = function (parentNodeOrHandle) {
        if (parentNodeOrHandle) {
            var parentNode = void 0;
            if (typeof parentNodeOrHandle === 'string') {
                var parentElement = this.getExtensionElement(parentNodeOrHandle);
                parentNode = parentElement ? this.nodes.get(parentElement) : null;
            }
            else {
                parentNode = parentNodeOrHandle;
            }
            return parentNode ? parentNode.children : null;
        }
        return this.roots;
    };
    ExtHostTreeView.prototype.fetchChildrenNodes = function (parentElement) {
        var _this = this;
        // clear children cache
        this.clearChildren(parentElement);
        var parentNode = parentElement ? this.nodes.get(parentElement) : void 0;
        return asThenable(function () { return _this.dataProvider.getChildren(parentElement); })
            .then(function (elements) { return Promise.all((elements || [])
            .filter(function (element) { return !!element; })
            .map(function (element) { return asThenable(function () { return _this.dataProvider.getTreeItem(element); })
            .then(function (extTreeItem) { return extTreeItem ? _this.createAndRegisterTreeNode(element, extTreeItem, parentNode) : null; }); })); })
            .then(function (nodes) { return nodes.filter(function (n) { return !!n; }); });
    };
    ExtHostTreeView.prototype.refresh = function (elements) {
        var hasRoot = elements.some(function (element) { return !element; });
        if (hasRoot) {
            this.clearAll(); // clear cache
            return this.proxy.$refresh(this.viewId);
        }
        else {
            var handlesToRefresh = this.getHandlesToRefresh(elements);
            if (handlesToRefresh.length) {
                return this.refreshHandles(handlesToRefresh);
            }
        }
        return Promise.resolve(null);
    };
    ExtHostTreeView.prototype.getHandlesToRefresh = function (elements) {
        var _this = this;
        var elementsToUpdate = new Set();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var elementNode = this.nodes.get(element);
            if (elementNode && !elementsToUpdate.has(elementNode.item.handle)) {
                // check if an ancestor of extElement is already in the elements to update list
                var currentNode = elementNode;
                while (currentNode && currentNode.parent && !elementsToUpdate.has(currentNode.parent.item.handle)) {
                    var parentElement = this.elements.get(currentNode.parent.item.handle);
                    currentNode = this.nodes.get(parentElement);
                }
                if (!currentNode.parent) {
                    elementsToUpdate.add(elementNode.item.handle);
                }
            }
        }
        var handlesToUpdate = [];
        // Take only top level elements
        elementsToUpdate.forEach(function (handle) {
            var element = _this.elements.get(handle);
            var node = _this.nodes.get(element);
            if (node && (!node.parent || !elementsToUpdate.has(node.parent.item.handle))) {
                handlesToUpdate.push(handle);
            }
        });
        return handlesToUpdate;
    };
    ExtHostTreeView.prototype.refreshHandles = function (itemHandles) {
        var _this = this;
        var itemsToRefresh = {};
        return Promise.all(itemHandles.map(function (treeItemHandle) {
            return _this.refreshNode(treeItemHandle)
                .then(function (node) {
                if (node) {
                    itemsToRefresh[treeItemHandle] = node.item;
                }
            });
        }))
            .then(function () { return Object.keys(itemsToRefresh).length ? _this.proxy.$refresh(_this.viewId, itemsToRefresh) : null; });
    };
    ExtHostTreeView.prototype.refreshNode = function (treeItemHandle) {
        var _this = this;
        var extElement = this.getExtensionElement(treeItemHandle);
        var existing = this.nodes.get(extElement);
        this.clearChildren(extElement); // clear children cache
        return asThenable(function () { return _this.dataProvider.getTreeItem(extElement); })
            .then(function (extTreeItem) {
            if (extTreeItem) {
                var newNode = _this.createTreeNode(extElement, extTreeItem, existing.parent);
                _this.updateNodeCache(extElement, newNode, existing, existing.parent);
                return newNode;
            }
            return null;
        });
    };
    ExtHostTreeView.prototype.createAndRegisterTreeNode = function (element, extTreeItem, parentNode) {
        var node = this.createTreeNode(element, extTreeItem, parentNode);
        if (extTreeItem.id && this.elements.has(node.item.handle)) {
            throw new Error(localize('treeView.duplicateElement', 'Element with id {0} is already registered', extTreeItem.id));
        }
        this.addNodeToCache(element, node);
        this.addNodeToParentCache(node, parentNode);
        return node;
    };
    ExtHostTreeView.prototype.createTreeNode = function (element, extensionTreeItem, parent) {
        return {
            item: this.createTreeItem(element, extensionTreeItem, parent),
            parent: parent,
            children: void 0
        };
    };
    ExtHostTreeView.prototype.createTreeItem = function (element, extensionTreeItem, parent) {
        var handle = this.createHandle(element, extensionTreeItem, parent);
        var icon = this.getLightIconPath(extensionTreeItem);
        var item = {
            handle: handle,
            parentHandle: parent ? parent.item.handle : void 0,
            label: toTreeItemLabel(extensionTreeItem.label, this.extension),
            resourceUri: extensionTreeItem.resourceUri,
            tooltip: typeof extensionTreeItem.tooltip === 'string' ? extensionTreeItem.tooltip : void 0,
            command: extensionTreeItem.command ? this.commands.toInternal(extensionTreeItem.command) : void 0,
            contextValue: extensionTreeItem.contextValue,
            icon: icon,
            iconDark: this.getDarkIconPath(extensionTreeItem) || icon,
            themeIcon: extensionTreeItem.iconPath instanceof ThemeIcon ? { id: extensionTreeItem.iconPath.id } : void 0,
            collapsibleState: isUndefinedOrNull(extensionTreeItem.collapsibleState) ? TreeItemCollapsibleState.None : extensionTreeItem.collapsibleState
        };
        return item;
    };
    ExtHostTreeView.prototype.createHandle = function (element, _a, parent, returnFirst) {
        var id = _a.id, label = _a.label, resourceUri = _a.resourceUri;
        if (id) {
            return ExtHostTreeView.ID_HANDLE_PREFIX + "/" + id;
        }
        var treeItemLabel = toTreeItemLabel(label, this.extension);
        var prefix = parent ? parent.item.handle : ExtHostTreeView.LABEL_HANDLE_PREFIX;
        var elementId = treeItemLabel ? treeItemLabel.label : resourceUri ? basename(resourceUri.path) : '';
        elementId = elementId.indexOf('/') !== -1 ? elementId.replace('/', '//') : elementId;
        var existingHandle = this.nodes.has(element) ? this.nodes.get(element).item.handle : void 0;
        var childrenNodes = (this.getChildrenNodes(parent) || []);
        var handle;
        var counter = 0;
        do {
            handle = prefix + "/" + counter + ":" + elementId;
            if (returnFirst || !this.elements.has(handle) || existingHandle === handle) {
                // Return first if asked for or
                // Return if handle does not exist or
                // Return if handle is being reused
                break;
            }
            counter++;
        } while (counter <= childrenNodes.length);
        return handle;
    };
    ExtHostTreeView.prototype.getLightIconPath = function (extensionTreeItem) {
        if (extensionTreeItem.iconPath && !(extensionTreeItem.iconPath instanceof ThemeIcon)) {
            if (typeof extensionTreeItem.iconPath === 'string'
                || extensionTreeItem.iconPath instanceof URI) {
                return this.getIconPath(extensionTreeItem.iconPath);
            }
            return this.getIconPath(extensionTreeItem.iconPath['light']);
        }
        return void 0;
    };
    ExtHostTreeView.prototype.getDarkIconPath = function (extensionTreeItem) {
        if (extensionTreeItem.iconPath && !(extensionTreeItem.iconPath instanceof ThemeIcon) && extensionTreeItem.iconPath['dark']) {
            return this.getIconPath(extensionTreeItem.iconPath['dark']);
        }
        return void 0;
    };
    ExtHostTreeView.prototype.getIconPath = function (iconPath) {
        if (iconPath instanceof URI) {
            return iconPath;
        }
        return URI.file(iconPath);
    };
    ExtHostTreeView.prototype.addNodeToCache = function (element, node) {
        this.elements.set(node.item.handle, element);
        this.nodes.set(element, node);
    };
    ExtHostTreeView.prototype.updateNodeCache = function (element, newNode, existing, parentNode) {
        // Remove from the cache
        this.elements.delete(newNode.item.handle);
        this.nodes.delete(element);
        if (newNode.item.handle !== existing.item.handle) {
            this.elements.delete(existing.item.handle);
        }
        // Add the new node to the cache
        this.addNodeToCache(element, newNode);
        // Replace the node in parent's children nodes
        var childrenNodes = (this.getChildrenNodes(parentNode) || []);
        var childNode = childrenNodes.filter(function (c) { return c.item.handle === existing.item.handle; })[0];
        if (childNode) {
            childrenNodes.splice(childrenNodes.indexOf(childNode), 1, newNode);
        }
    };
    ExtHostTreeView.prototype.addNodeToParentCache = function (node, parentNode) {
        if (parentNode) {
            if (!parentNode.children) {
                parentNode.children = [];
            }
            parentNode.children.push(node);
        }
        else {
            if (!this.roots) {
                this.roots = [];
            }
            this.roots.push(node);
        }
    };
    ExtHostTreeView.prototype.clearChildren = function (parentElement) {
        if (parentElement) {
            var node = this.nodes.get(parentElement);
            if (node.children) {
                for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childEleement = this.elements.get(child.item.handle);
                    if (childEleement) {
                        this.clear(childEleement);
                    }
                }
            }
            node.children = void 0;
        }
        else {
            this.clearAll();
        }
    };
    ExtHostTreeView.prototype.clear = function (element) {
        var node = this.nodes.get(element);
        if (node.children) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var childEleement = this.elements.get(child.item.handle);
                if (childEleement) {
                    this.clear(childEleement);
                }
            }
        }
        this.nodes.delete(element);
        this.elements.delete(node.item.handle);
    };
    ExtHostTreeView.prototype.clearAll = function () {
        this.roots = null;
        this.elements.clear();
        this.nodes.clear();
    };
    ExtHostTreeView.prototype.dispose = function () {
        this.clearAll();
    };
    ExtHostTreeView.LABEL_HANDLE_PREFIX = '0';
    ExtHostTreeView.ID_HANDLE_PREFIX = '1';
    return ExtHostTreeView;
}(Disposable));
