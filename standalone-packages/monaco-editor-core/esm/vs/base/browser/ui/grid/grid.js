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
import './gridview.css';
import { dispose } from '../../../common/lifecycle';
import { tail2 as tail, equals } from '../../../common/arrays';
import { orthogonal, GridView, Sizing as GridViewSizing } from './gridview';
function oppositeDirection(direction) {
    switch (direction) {
        case 0 /* Up */: return 1 /* Down */;
        case 1 /* Down */: return 0 /* Up */;
        case 2 /* Left */: return 3 /* Right */;
        case 3 /* Right */: return 2 /* Left */;
    }
}
export function isGridBranchNode(node) {
    return !!node.children;
}
function getGridNode(node, location) {
    if (location.length === 0) {
        return node;
    }
    if (!isGridBranchNode(node)) {
        throw new Error('Invalid location');
    }
    var index = location[0], rest = location.slice(1);
    return getGridNode(node.children[index], rest);
}
function intersects(one, other) {
    return !(one.start >= other.end || other.start >= one.end);
}
function getBoxBoundary(box, direction) {
    var orientation = getDirectionOrientation(direction);
    var offset = direction === 0 /* Up */ ? box.top :
        direction === 3 /* Right */ ? box.left + box.width :
            direction === 1 /* Down */ ? box.top + box.height :
                box.left;
    var range = {
        start: orientation === 1 /* HORIZONTAL */ ? box.top : box.left,
        end: orientation === 1 /* HORIZONTAL */ ? box.top + box.height : box.left + box.width
    };
    return { offset: offset, range: range };
}
function findAdjacentBoxLeafNodes(boxNode, direction, boundary) {
    var result = [];
    function _(boxNode, direction, boundary) {
        if (isGridBranchNode(boxNode)) {
            for (var _i = 0, _a = boxNode.children; _i < _a.length; _i++) {
                var child = _a[_i];
                _(child, direction, boundary);
            }
        }
        else {
            var _b = getBoxBoundary(boxNode.box, direction), offset = _b.offset, range = _b.range;
            if (offset === boundary.offset && intersects(range, boundary.range)) {
                result.push(boxNode);
            }
        }
    }
    _(boxNode, direction, boundary);
    return result;
}
function getLocationOrientation(rootOrientation, location) {
    return location.length % 2 === 0 ? orthogonal(rootOrientation) : rootOrientation;
}
function getDirectionOrientation(direction) {
    return direction === 0 /* Up */ || direction === 1 /* Down */ ? 0 /* VERTICAL */ : 1 /* HORIZONTAL */;
}
function getSize(dimensions, orientation) {
    return orientation === 1 /* HORIZONTAL */ ? dimensions.width : dimensions.height;
}
export function getRelativeLocation(rootOrientation, location, direction) {
    var orientation = getLocationOrientation(rootOrientation, location);
    var directionOrientation = getDirectionOrientation(direction);
    if (orientation === directionOrientation) {
        var _a = tail(location), rest = _a[0], index = _a[1];
        if (direction === 3 /* Right */ || direction === 1 /* Down */) {
            index += 1;
        }
        return rest.concat([index]);
    }
    else {
        var index = (direction === 3 /* Right */ || direction === 1 /* Down */) ? 1 : 0;
        return location.concat([index]);
    }
}
function indexInParent(element) {
    var parentElement = element.parentElement;
    var el = parentElement.firstElementChild;
    var index = 0;
    while (el !== element && el !== parentElement.lastElementChild) {
        el = el.nextElementSibling;
        index++;
    }
    return index;
}
/**
 * Find the grid location of a specific DOM element by traversing the parent
 * chain and finding each child index on the way.
 *
 * This will break as soon as DOM structures of the Splitview or Gridview change.
 */
function getGridLocation(element) {
    if (/\bmonaco-grid-view\b/.test(element.parentElement.className)) {
        return [];
    }
    var index = indexInParent(element.parentElement);
    var ancestor = element.parentElement.parentElement.parentElement.parentElement;
    return getGridLocation(ancestor).concat([index]);
}
var Grid = /** @class */ (function () {
    function Grid(view, options) {
        if (options === void 0) { options = {}; }
        this.views = new Map();
        this.disposables = [];
        this.sashResetSizing = "distribute" /* Distribute */;
        this.gridview = new GridView(options);
        this.disposables.push(this.gridview);
        this.gridview.onDidSashReset(this.doResetViewSize, this, this.disposables);
        this._addView(view, 0, [0]);
    }
    Object.defineProperty(Grid.prototype, "orientation", {
        get: function () { return this.gridview.orientation; },
        set: function (orientation) { this.gridview.orientation = orientation; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "width", {
        get: function () { return this.gridview.width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "height", {
        get: function () { return this.gridview.height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "minimumWidth", {
        get: function () { return this.gridview.minimumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "minimumHeight", {
        get: function () { return this.gridview.minimumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "maximumWidth", {
        get: function () { return this.gridview.maximumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "maximumHeight", {
        get: function () { return this.gridview.maximumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "onDidChange", {
        get: function () { return this.gridview.onDidChange; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "element", {
        get: function () { return this.gridview.element; },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.style = function (styles) {
        this.gridview.style(styles);
    };
    Grid.prototype.layout = function (width, height) {
        this.gridview.layout(width, height);
    };
    Grid.prototype.addView = function (newView, size, referenceView, direction) {
        if (this.views.has(newView)) {
            throw new Error('Can\'t add same view twice');
        }
        var orientation = getDirectionOrientation(direction);
        if (this.views.size === 1 && this.orientation !== orientation) {
            this.orientation = orientation;
        }
        var referenceLocation = this.getViewLocation(referenceView);
        var location = getRelativeLocation(this.gridview.orientation, referenceLocation, direction);
        var viewSize;
        if (size === "split" /* Split */) {
            var _a = tail(referenceLocation), index = _a[1];
            viewSize = GridViewSizing.Split(index);
        }
        else if (size === "distribute" /* Distribute */) {
            viewSize = GridViewSizing.Distribute;
        }
        else {
            viewSize = size;
        }
        this._addView(newView, viewSize, location);
    };
    Grid.prototype._addView = function (newView, size, location) {
        this.views.set(newView, newView.element);
        this.gridview.addView(newView, size, location);
    };
    Grid.prototype.removeView = function (view, sizing) {
        if (this.views.size === 1) {
            throw new Error('Can\'t remove last view');
        }
        var location = this.getViewLocation(view);
        this.gridview.removeView(location, sizing === "distribute" /* Distribute */ ? GridViewSizing.Distribute : undefined);
        this.views.delete(view);
    };
    Grid.prototype.moveView = function (view, sizing, referenceView, direction) {
        var sourceLocation = this.getViewLocation(view);
        var _a = tail(sourceLocation), sourceParentLocation = _a[0], from = _a[1];
        var referenceLocation = this.getViewLocation(referenceView);
        var targetLocation = getRelativeLocation(this.gridview.orientation, referenceLocation, direction);
        var _b = tail(targetLocation), targetParentLocation = _b[0], to = _b[1];
        if (equals(sourceParentLocation, targetParentLocation)) {
            this.gridview.moveView(sourceParentLocation, from, to);
        }
        else {
            this.removeView(view, typeof sizing === 'number' ? undefined : sizing);
            this.addView(view, sizing, referenceView, direction);
        }
    };
    Grid.prototype.swapViews = function (from, to) {
        var fromLocation = this.getViewLocation(from);
        var toLocation = this.getViewLocation(to);
        return this.gridview.swapViews(fromLocation, toLocation);
    };
    Grid.prototype.resizeView = function (view, size) {
        var location = this.getViewLocation(view);
        return this.gridview.resizeView(location, size);
    };
    Grid.prototype.getViewSize = function (view) {
        var location = this.getViewLocation(view);
        var viewSize = this.gridview.getViewSize(location);
        return getLocationOrientation(this.orientation, location) === 1 /* HORIZONTAL */ ? viewSize.width : viewSize.height;
    };
    // TODO@joao cleanup
    Grid.prototype.getViewSize2 = function (view) {
        var location = this.getViewLocation(view);
        return this.gridview.getViewSize(location);
    };
    Grid.prototype.maximizeViewSize = function (view) {
        var location = this.getViewLocation(view);
        this.gridview.maximizeViewSize(location);
    };
    Grid.prototype.distributeViewSizes = function () {
        this.gridview.distributeViewSizes();
    };
    Grid.prototype.getViews = function () {
        return this.gridview.getViews();
    };
    Grid.prototype.getNeighborViews = function (view, direction, wrap) {
        if (wrap === void 0) { wrap = false; }
        var location = this.getViewLocation(view);
        var root = this.getViews();
        var node = getGridNode(root, location);
        var boundary = getBoxBoundary(node.box, direction);
        if (wrap) {
            if (direction === 0 /* Up */ && node.box.top === 0) {
                boundary = { offset: root.box.top + root.box.height, range: boundary.range };
            }
            else if (direction === 3 /* Right */ && node.box.left + node.box.width === root.box.width) {
                boundary = { offset: 0, range: boundary.range };
            }
            else if (direction === 1 /* Down */ && node.box.top + node.box.height === root.box.height) {
                boundary = { offset: 0, range: boundary.range };
            }
            else if (direction === 2 /* Left */ && node.box.left === 0) {
                boundary = { offset: root.box.left + root.box.width, range: boundary.range };
            }
        }
        return findAdjacentBoxLeafNodes(root, oppositeDirection(direction), boundary)
            .map(function (node) { return node.view; });
    };
    Grid.prototype.getViewLocation = function (view) {
        var element = this.views.get(view);
        if (!element) {
            throw new Error('View not found');
        }
        return getGridLocation(element);
    };
    Grid.prototype.doResetViewSize = function (location) {
        if (this.sashResetSizing === "split" /* Split */) {
            var orientation_1 = getLocationOrientation(this.orientation, location);
            var firstViewSize = getSize(this.gridview.getViewSize(location), orientation_1);
            var _a = tail(location), parentLocation = _a[0], index = _a[1];
            var secondViewSize = getSize(this.gridview.getViewSize(parentLocation.concat([index + 1])), orientation_1);
            var totalSize = firstViewSize + secondViewSize;
            this.gridview.resizeView(location, Math.floor(totalSize / 2));
        }
        else {
            var parentLocation = tail(location)[0];
            this.gridview.distributeViewSizes(parentLocation);
        }
    };
    Grid.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    return Grid;
}());
export { Grid };
var SerializableGrid = /** @class */ (function (_super) {
    __extends(SerializableGrid, _super);
    function SerializableGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SerializableGrid.serializeNode = function (node, orientation) {
        var size = orientation === 0 /* VERTICAL */ ? node.box.width : node.box.height;
        if (!isGridBranchNode(node)) {
            return { type: 'leaf', data: node.view.toJSON(), size: size };
        }
        return { type: 'branch', data: node.children.map(function (c) { return SerializableGrid.serializeNode(c, orthogonal(orientation)); }), size: size };
    };
    SerializableGrid.deserializeNode = function (json, orientation, box, deserializer) {
        if (!json || typeof json !== 'object') {
            throw new Error('Invalid JSON');
        }
        var type = json.type;
        var data = json.data;
        if (type === 'branch') {
            if (!Array.isArray(data)) {
                throw new Error('Invalid JSON: \'data\' property of branch must be an array.');
            }
            var children = [];
            var offset = 0;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var child = data_1[_i];
                if (typeof child.size !== 'number') {
                    throw new Error('Invalid JSON: \'size\' property of node must be a number.');
                }
                var childBox = orientation === 1 /* HORIZONTAL */
                    ? { top: box.top, left: box.left + offset, width: child.size, height: box.height }
                    : { top: box.top + offset, left: box.left, width: box.width, height: child.size };
                children.push(SerializableGrid.deserializeNode(child, orthogonal(orientation), childBox, deserializer));
                offset += child.size;
            }
            return { children: children, box: box };
        }
        else if (type === 'leaf') {
            var view = deserializer.fromJSON(data);
            return { view: view, box: box };
        }
        throw new Error('Invalid JSON: \'type\' property must be either \'branch\' or \'leaf\'.');
    };
    SerializableGrid.getFirstLeaf = function (node) {
        if (!isGridBranchNode(node)) {
            return node;
        }
        return SerializableGrid.getFirstLeaf(node.children[0]);
    };
    SerializableGrid.deserialize = function (json, deserializer, options) {
        if (options === void 0) { options = {}; }
        if (typeof json.orientation !== 'number') {
            throw new Error('Invalid JSON: \'orientation\' property must be a number.');
        }
        else if (typeof json.width !== 'number') {
            throw new Error('Invalid JSON: \'width\' property must be a number.');
        }
        else if (typeof json.height !== 'number') {
            throw new Error('Invalid JSON: \'height\' property must be a number.');
        }
        var orientation = json.orientation;
        var width = json.width;
        var height = json.height;
        var box = { top: 0, left: 0, width: width, height: height };
        var root = SerializableGrid.deserializeNode(json.root, orientation, box, deserializer);
        var firstLeaf = SerializableGrid.getFirstLeaf(root);
        if (!firstLeaf) {
            throw new Error('Invalid serialized state, first leaf not found');
        }
        var result = new SerializableGrid(firstLeaf.view, options);
        result.orientation = orientation;
        result.restoreViews(firstLeaf.view, orientation, root);
        result.initialLayoutContext = { width: width, height: height, root: root };
        return result;
    };
    SerializableGrid.prototype.serialize = function () {
        return {
            root: SerializableGrid.serializeNode(this.getViews(), this.orientation),
            orientation: this.orientation,
            width: this.width,
            height: this.height
        };
    };
    SerializableGrid.prototype.layout = function (width, height) {
        _super.prototype.layout.call(this, width, height);
        if (this.initialLayoutContext) {
            var widthScale = width / this.initialLayoutContext.width;
            var heightScale = height / this.initialLayoutContext.height;
            this.restoreViewsSize([], this.initialLayoutContext.root, this.orientation, widthScale, heightScale);
            this.initialLayoutContext = undefined;
            this.gridview.trySet2x2();
        }
    };
    /**
     * Recursively restores views which were just deserialized.
     */
    SerializableGrid.prototype.restoreViews = function (referenceView, orientation, node) {
        if (!isGridBranchNode(node)) {
            return;
        }
        var direction = orientation === 0 /* VERTICAL */ ? 1 /* Down */ : 3 /* Right */;
        var firstLeaves = node.children.map(function (c) { return SerializableGrid.getFirstLeaf(c); });
        for (var i = 1; i < firstLeaves.length; i++) {
            var size = orientation === 0 /* VERTICAL */ ? firstLeaves[i].box.height : firstLeaves[i].box.width;
            this.addView(firstLeaves[i].view, size, referenceView, direction);
            referenceView = firstLeaves[i].view;
        }
        for (var i = 0; i < node.children.length; i++) {
            this.restoreViews(firstLeaves[i].view, orthogonal(orientation), node.children[i]);
        }
    };
    /**
     * Recursively restores view sizes.
     * This should be called only after the very first layout call.
     */
    SerializableGrid.prototype.restoreViewsSize = function (location, node, orientation, widthScale, heightScale) {
        if (!isGridBranchNode(node)) {
            return;
        }
        var scale = orientation === 0 /* VERTICAL */ ? heightScale : widthScale;
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];
            var childLocation = location.concat([i]);
            if (i < node.children.length - 1) {
                var size = orientation === 0 /* VERTICAL */ ? child.box.height : child.box.width;
                this.gridview.resizeView(childLocation, Math.floor(size * scale));
            }
            this.restoreViewsSize(childLocation, child, orthogonal(orientation), widthScale, heightScale);
        }
    };
    return SerializableGrid;
}(Grid));
export { SerializableGrid };
export function sanitizeGridNodeDescriptor(nodeDescriptor) {
    if (nodeDescriptor.groups && nodeDescriptor.groups.length === 0) {
        nodeDescriptor.groups = undefined;
    }
    if (!nodeDescriptor.groups) {
        return;
    }
    var totalDefinedSize = 0;
    var totalDefinedSizeCount = 0;
    for (var _i = 0, _a = nodeDescriptor.groups; _i < _a.length; _i++) {
        var child = _a[_i];
        sanitizeGridNodeDescriptor(child);
        if (child.size) {
            totalDefinedSize += child.size;
            totalDefinedSizeCount++;
        }
    }
    var totalUndefinedSize = totalDefinedSizeCount > 0 ? totalDefinedSize : 1;
    var totalUndefinedSizeCount = nodeDescriptor.groups.length - totalDefinedSizeCount;
    var eachUndefinedSize = totalUndefinedSize / totalUndefinedSizeCount;
    for (var _b = 0, _c = nodeDescriptor.groups; _b < _c.length; _b++) {
        var child = _c[_b];
        if (!child.size) {
            child.size = eachUndefinedSize;
        }
    }
}
function createSerializedNode(nodeDescriptor) {
    if (nodeDescriptor.groups) {
        return { type: 'branch', data: nodeDescriptor.groups.map(function (c) { return createSerializedNode(c); }), size: nodeDescriptor.size };
    }
    else {
        return { type: 'leaf', data: null, size: nodeDescriptor.size };
    }
}
function getDimensions(node, orientation) {
    if (node.type === 'branch') {
        var childrenDimensions = node.data.map(function (c) { return getDimensions(c, orthogonal(orientation)); });
        if (orientation === 0 /* VERTICAL */) {
            var width = node.size || (childrenDimensions.length === 0 ? undefined : Math.max.apply(Math, childrenDimensions.map(function (d) { return d.width || 0; })));
            var height = childrenDimensions.length === 0 ? undefined : childrenDimensions.reduce(function (r, d) { return r + d.height; }, 0);
            return { width: width, height: height };
        }
        else {
            var width = childrenDimensions.length === 0 ? undefined : childrenDimensions.reduce(function (r, d) { return r + d.width; }, 0);
            var height = node.size || (childrenDimensions.length === 0 ? undefined : Math.max.apply(Math, childrenDimensions.map(function (d) { return d.height || 0; })));
            return { width: width, height: height };
        }
    }
    else {
        var width = orientation === 0 /* VERTICAL */ ? node.size : undefined;
        var height = orientation === 0 /* VERTICAL */ ? undefined : node.size;
        return { width: width, height: height };
    }
}
export function createSerializedGrid(gridDescriptor) {
    sanitizeGridNodeDescriptor(gridDescriptor);
    var root = createSerializedNode(gridDescriptor);
    var _a = getDimensions(root, gridDescriptor.orientation), width = _a.width, height = _a.height;
    return {
        root: root,
        orientation: gridDescriptor.orientation,
        width: width || 1,
        height: height || 1
    };
}
