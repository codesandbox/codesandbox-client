/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IndexTreeModel } from './indexTreeModel.js';
var ObjectTreeModel = /** @class */ (function () {
    function ObjectTreeModel(list, options) {
        if (options === void 0) { options = {}; }
        this.nodes = new Map();
        this.model = new IndexTreeModel(list, options);
        this.onDidChangeCollapseState = this.model.onDidChangeCollapseState;
        this.onDidChangeRenderNodeCount = this.model.onDidChangeRenderNodeCount;
    }
    Object.defineProperty(ObjectTreeModel.prototype, "size", {
        get: function () { return this.nodes.size; },
        enumerable: true,
        configurable: true
    });
    ObjectTreeModel.prototype.setChildren = function (element, children) {
        var _this = this;
        var location = this.getElementLocation(element);
        var insertedElements = new Set();
        var onDidCreateNode = function (node) {
            insertedElements.add(node.element);
            _this.nodes.set(node.element, node);
        };
        var onDidDeleteNode = function (node) {
            if (!insertedElements.has(node.element)) {
                _this.nodes.delete(node.element);
            }
        };
        return this.model.splice(location.concat([0]), Number.MAX_VALUE, children, onDidCreateNode, onDidDeleteNode);
    };
    ObjectTreeModel.prototype.getParentElement = function (ref) {
        if (ref === void 0) { ref = null; }
        var location = this.getElementLocation(ref);
        return this.model.getParentElement(location);
    };
    ObjectTreeModel.prototype.getFirstChildElement = function (ref) {
        if (ref === void 0) { ref = null; }
        var location = this.getElementLocation(ref);
        return this.model.getFirstChildElement(location);
    };
    ObjectTreeModel.prototype.getLastAncestorElement = function (ref) {
        if (ref === void 0) { ref = null; }
        var location = this.getElementLocation(ref);
        return this.model.getLastAncestorElement(location);
    };
    ObjectTreeModel.prototype.getListIndex = function (element) {
        var location = this.getElementLocation(element);
        return this.model.getListIndex(location);
    };
    ObjectTreeModel.prototype.setCollapsed = function (element, collapsed) {
        var location = this.getElementLocation(element);
        return this.model.setCollapsed(location, collapsed);
    };
    ObjectTreeModel.prototype.toggleCollapsed = function (element) {
        var location = this.getElementLocation(element);
        this.model.toggleCollapsed(location);
    };
    ObjectTreeModel.prototype.collapseAll = function () {
        this.model.collapseAll();
    };
    ObjectTreeModel.prototype.isCollapsed = function (element) {
        var location = this.getElementLocation(element);
        return this.model.isCollapsed(location);
    };
    ObjectTreeModel.prototype.refilter = function () {
        this.model.refilter();
    };
    ObjectTreeModel.prototype.getNode = function (element) {
        if (element === void 0) { element = null; }
        var location = this.getElementLocation(element);
        return this.model.getNode(location);
    };
    ObjectTreeModel.prototype.getNodeLocation = function (node) {
        return node.element;
    };
    ObjectTreeModel.prototype.getParentNodeLocation = function (element) {
        var node = this.nodes.get(element);
        if (!node) {
            throw new Error("Tree element not found: " + element);
        }
        return node.parent.element;
    };
    ObjectTreeModel.prototype.getElementLocation = function (element) {
        if (element === null) {
            return [];
        }
        var node = this.nodes.get(element);
        if (!node) {
            throw new Error("Tree element not found: " + element);
        }
        return this.model.getNodeLocation(node);
    };
    return ObjectTreeModel;
}());
export { ObjectTreeModel };
