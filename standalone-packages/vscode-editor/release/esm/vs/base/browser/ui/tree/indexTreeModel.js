/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Iterator } from '../../../common/iterator.js';
import { Emitter, EventBufferer } from '../../../common/event.js';
import { tail2 } from '../../../common/arrays.js';
function isFilterResult(obj) {
    return typeof obj === 'object' && 'visibility' in obj && 'data' in obj;
}
function treeNodeToElement(node) {
    var element = node.element, collapsed = node.collapsed;
    var children = Iterator.map(Iterator.fromArray(node.children), treeNodeToElement);
    return { element: element, children: children, collapsed: collapsed };
}
function getVisibleState(visibility) {
    switch (visibility) {
        case true: return 1 /* Visible */;
        case false: return 0 /* Hidden */;
        default: return visibility;
    }
}
var IndexTreeModel = /** @class */ (function () {
    function IndexTreeModel(list, options) {
        if (options === void 0) { options = {}; }
        this.list = list;
        this.root = {
            parent: undefined,
            element: undefined,
            children: [],
            depth: 0,
            collapsible: false,
            collapsed: false,
            renderNodeCount: 0,
            visible: true,
            filterData: undefined
        };
        this.eventBufferer = new EventBufferer();
        this._onDidChangeCollapseState = new Emitter();
        this.onDidChangeCollapseState = this.eventBufferer.wrapEvent(this._onDidChangeCollapseState.event);
        this._onDidChangeRenderNodeCount = new Emitter();
        this.onDidChangeRenderNodeCount = this.eventBufferer.wrapEvent(this._onDidChangeRenderNodeCount.event);
        this.filter = options.filter;
    }
    IndexTreeModel.prototype.splice = function (location, deleteCount, toInsert, onDidCreateNode, onDidDeleteNode) {
        var _this = this;
        var _a;
        if (location.length === 0) {
            throw new Error('Invalid tree location');
        }
        var _b = this.getParentNodeWithListIndex(location), parentNode = _b.parentNode, listIndex = _b.listIndex, revealed = _b.revealed;
        var treeListElementsToInsert = [];
        var nodesToInsertIterator = Iterator.map(Iterator.from(toInsert), function (el) { return _this.createTreeNode(el, parentNode, parentNode.visible ? 1 /* Visible */ : 0 /* Hidden */, revealed, treeListElementsToInsert, onDidCreateNode); });
        var nodesToInsert = [];
        var renderNodeCount = 0;
        Iterator.forEach(nodesToInsertIterator, function (node) {
            nodesToInsert.push(node);
            renderNodeCount += node.renderNodeCount;
        });
        var lastIndex = location[location.length - 1];
        var deletedNodes = (_a = parentNode.children).splice.apply(_a, [lastIndex, deleteCount].concat(nodesToInsert));
        if (revealed) {
            var visibleDeleteCount = deletedNodes.reduce(function (r, node) { return r + node.renderNodeCount; }, 0);
            this._updateAncestorsRenderNodeCount(parentNode, renderNodeCount - visibleDeleteCount);
            this.list.splice(listIndex, visibleDeleteCount, treeListElementsToInsert);
        }
        if (deletedNodes.length > 0 && onDidDeleteNode) {
            var visit_1 = function (node) {
                onDidDeleteNode(node);
                node.children.forEach(visit_1);
            };
            deletedNodes.forEach(visit_1);
        }
        return Iterator.map(Iterator.fromArray(deletedNodes), treeNodeToElement);
    };
    IndexTreeModel.prototype.getListIndex = function (location) {
        return this.getTreeNodeWithListIndex(location).listIndex;
    };
    IndexTreeModel.prototype.setCollapsed = function (location, collapsed) {
        var _this = this;
        var _a = this.getTreeNodeWithListIndex(location), node = _a.node, listIndex = _a.listIndex, revealed = _a.revealed;
        return this.eventBufferer.bufferEvents(function () { return _this._setCollapsed(node, listIndex, revealed, collapsed); });
    };
    IndexTreeModel.prototype.toggleCollapsed = function (location) {
        var _this = this;
        var _a = this.getTreeNodeWithListIndex(location), node = _a.node, listIndex = _a.listIndex, revealed = _a.revealed;
        this.eventBufferer.bufferEvents(function () { return _this._setCollapsed(node, listIndex, revealed); });
    };
    IndexTreeModel.prototype.collapseAll = function () {
        var _this = this;
        var queue = this.root.children.slice();
        var listIndex = 0;
        this.eventBufferer.bufferEvents(function () {
            while (queue.length > 0) {
                var node = queue.shift();
                var revealed = listIndex < _this.root.children.length;
                _this._setCollapsed(node, listIndex, revealed, true);
                queue.push.apply(queue, node.children);
                listIndex++;
            }
        });
    };
    IndexTreeModel.prototype.isCollapsed = function (location) {
        return this.getTreeNode(location).collapsed;
    };
    IndexTreeModel.prototype.refilter = function () {
        var previousRenderNodeCount = this.root.renderNodeCount;
        var toInsert = this.updateNodeAfterFilterChange(this.root);
        this.list.splice(0, previousRenderNodeCount, toInsert);
    };
    IndexTreeModel.prototype._setCollapsed = function (node, listIndex, revealed, collapsed) {
        if (!node.collapsible) {
            return false;
        }
        if (typeof collapsed === 'undefined') {
            collapsed = !node.collapsed;
        }
        if (node.collapsed === collapsed) {
            return false;
        }
        node.collapsed = collapsed;
        if (revealed) {
            var previousRenderNodeCount = node.renderNodeCount;
            var toInsert = this.updateNodeAfterCollapseChange(node);
            this.list.splice(listIndex + 1, previousRenderNodeCount - 1, toInsert.slice(1));
            this._onDidChangeCollapseState.fire(node);
        }
        return true;
    };
    IndexTreeModel.prototype.createTreeNode = function (treeElement, parent, parentVisibility, revealed, treeListElements, onDidCreateNode) {
        var _this = this;
        var node = {
            parent: parent,
            element: treeElement.element,
            children: [],
            depth: parent.depth + 1,
            collapsible: typeof treeElement.collapsible === 'boolean' ? treeElement.collapsible : (typeof treeElement.collapsed === 'boolean'),
            collapsed: !!treeElement.collapsed,
            renderNodeCount: 1,
            visible: true,
            filterData: undefined
        };
        var visibility = this._filterNode(node, parentVisibility);
        if (revealed) {
            treeListElements.push(node);
        }
        var childElements = Iterator.from(treeElement.children);
        var childRevealed = revealed && visibility !== 0 /* Hidden */ && !node.collapsed;
        var childNodes = Iterator.map(childElements, function (el) { return _this.createTreeNode(el, node, visibility, childRevealed, treeListElements, onDidCreateNode); });
        var hasVisibleDescendants = false;
        var renderNodeCount = 1;
        Iterator.forEach(childNodes, function (child) {
            node.children.push(child);
            hasVisibleDescendants = hasVisibleDescendants || child.visible;
            renderNodeCount += child.renderNodeCount;
        });
        node.collapsible = node.collapsible || node.children.length > 0;
        node.visible = visibility === 2 /* Recurse */ ? hasVisibleDescendants : (visibility === 1 /* Visible */);
        if (!node.visible) {
            node.renderNodeCount = 0;
            if (revealed) {
                treeListElements.pop();
            }
        }
        else if (!node.collapsed) {
            node.renderNodeCount = renderNodeCount;
        }
        if (onDidCreateNode) {
            onDidCreateNode(node);
        }
        return node;
    };
    IndexTreeModel.prototype.updateNodeAfterCollapseChange = function (node) {
        var previousRenderNodeCount = node.renderNodeCount;
        var result = [];
        this._updateNodeAfterCollapseChange(node, result);
        this._updateAncestorsRenderNodeCount(node.parent, result.length - previousRenderNodeCount);
        return result;
    };
    IndexTreeModel.prototype._updateNodeAfterCollapseChange = function (node, result) {
        if (node.visible === false) {
            return 0;
        }
        result.push(node);
        node.renderNodeCount = 1;
        if (!node.collapsed) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                node.renderNodeCount += this._updateNodeAfterCollapseChange(child, result);
            }
        }
        this._onDidChangeRenderNodeCount.fire(node);
        return node.renderNodeCount;
    };
    IndexTreeModel.prototype.updateNodeAfterFilterChange = function (node) {
        var previousRenderNodeCount = node.renderNodeCount;
        var result = [];
        this._updateNodeAfterFilterChange(node, node.visible ? 1 /* Visible */ : 0 /* Hidden */, result);
        this._updateAncestorsRenderNodeCount(node.parent, result.length - previousRenderNodeCount);
        return result;
    };
    IndexTreeModel.prototype._updateNodeAfterFilterChange = function (node, parentVisibility, result, revealed) {
        if (revealed === void 0) { revealed = true; }
        var visibility;
        if (node !== this.root) {
            visibility = this._filterNode(node, parentVisibility);
            if (visibility === 0 /* Hidden */) {
                node.visible = false;
                return false;
            }
            if (revealed) {
                result.push(node);
            }
        }
        var resultStartLength = result.length;
        node.renderNodeCount = node === this.root ? 0 : 1;
        var hasVisibleDescendants = false;
        if (!node.collapsed || visibility !== 0 /* Hidden */) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                hasVisibleDescendants = this._updateNodeAfterFilterChange(child, visibility, result, revealed && !node.collapsed) || hasVisibleDescendants;
            }
        }
        if (node !== this.root) {
            node.visible = visibility === 2 /* Recurse */ ? hasVisibleDescendants : (visibility === 1 /* Visible */);
        }
        if (!node.visible) {
            node.renderNodeCount = 0;
            if (revealed) {
                result.pop();
            }
        }
        else if (!node.collapsed) {
            node.renderNodeCount += result.length - resultStartLength;
        }
        this._onDidChangeRenderNodeCount.fire(node);
        return node.visible;
    };
    IndexTreeModel.prototype._updateAncestorsRenderNodeCount = function (node, diff) {
        if (diff === 0) {
            return;
        }
        while (node) {
            node.renderNodeCount += diff;
            this._onDidChangeRenderNodeCount.fire(node);
            node = node.parent;
        }
    };
    IndexTreeModel.prototype._filterNode = function (node, parentVisibility) {
        var result = this.filter ? this.filter.filter(node.element, parentVisibility) : 1 /* Visible */;
        if (typeof result === 'boolean') {
            node.filterData = undefined;
            return 1 /* Visible */;
        }
        else if (isFilterResult(result)) {
            node.filterData = result.data;
            return getVisibleState(result.visibility);
        }
        else {
            node.filterData = undefined;
            return getVisibleState(result);
        }
    };
    // cheap
    IndexTreeModel.prototype.getTreeNode = function (location, node) {
        if (node === void 0) { node = this.root; }
        if (!location || location.length === 0) {
            return node;
        }
        var index = location[0], rest = location.slice(1);
        if (index < 0 || index > node.children.length) {
            throw new Error('Invalid tree location');
        }
        return this.getTreeNode(rest, node.children[index]);
    };
    // expensive
    IndexTreeModel.prototype.getTreeNodeWithListIndex = function (location) {
        var _a = this.getParentNodeWithListIndex(location), parentNode = _a.parentNode, listIndex = _a.listIndex, revealed = _a.revealed;
        var index = location[location.length - 1];
        if (index < 0 || index > parentNode.children.length) {
            throw new Error('Invalid tree location');
        }
        var node = parentNode.children[index];
        return { node: node, listIndex: listIndex, revealed: revealed };
    };
    IndexTreeModel.prototype.getParentNodeWithListIndex = function (location, node, listIndex, revealed) {
        if (node === void 0) { node = this.root; }
        if (listIndex === void 0) { listIndex = 0; }
        if (revealed === void 0) { revealed = true; }
        var index = location[0], rest = location.slice(1);
        if (index < 0 || index > node.children.length) {
            throw new Error('Invalid tree location');
        }
        // TODO@joao perf!
        for (var i = 0; i < index; i++) {
            listIndex += node.children[i].renderNodeCount;
        }
        revealed = revealed && !node.collapsed;
        if (rest.length === 0) {
            return { parentNode: node, listIndex: listIndex, revealed: revealed };
        }
        return this.getParentNodeWithListIndex(rest, node.children[index], listIndex + 1, revealed);
    };
    IndexTreeModel.prototype.getNode = function (location) {
        if (location === void 0) { location = []; }
        return this.getTreeNode(location);
    };
    // TODO@joao perf!
    IndexTreeModel.prototype.getNodeLocation = function (node) {
        var location = [];
        while (node.parent) {
            location.push(node.parent.children.indexOf(node));
            node = node.parent;
        }
        return location.reverse();
    };
    IndexTreeModel.prototype.getParentNodeLocation = function (location) {
        if (location.length <= 1) {
            return [];
        }
        return tail2(location)[0];
    };
    IndexTreeModel.prototype.getParentElement = function (location) {
        var parentLocation = this.getParentNodeLocation(location);
        var node = this.getTreeNode(parentLocation);
        return node === this.root ? null : node.element;
    };
    IndexTreeModel.prototype.getFirstChildElement = function (location) {
        var node = this.getTreeNode(location);
        if (node.children.length === 0) {
            return null;
        }
        return node.children[0].element;
    };
    IndexTreeModel.prototype.getLastAncestorElement = function (location) {
        var node = this.getTreeNode(location);
        if (node.children.length === 0) {
            return null;
        }
        return this._getLastElementAncestor(node);
    };
    IndexTreeModel.prototype._getLastElementAncestor = function (node) {
        if (node.children.length === 0) {
            return node.element;
        }
        return this._getLastElementAncestor(node.children[node.children.length - 1]);
    };
    return IndexTreeModel;
}());
export { IndexTreeModel };
