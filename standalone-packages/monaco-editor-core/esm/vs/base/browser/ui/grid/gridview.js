/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import './gridview.css';
import { Event, anyEvent, Emitter, mapEvent, Relay } from '../../../common/event';
import { SplitView, Sizing } from '../splitview/splitview';
import { Disposable, toDisposable } from '../../../common/lifecycle';
import { $ } from '../../dom';
import { tail2 as tail } from '../../../common/arrays';
import { Color } from '../../../common/color';
export { Sizing } from '../splitview/splitview';
export function orthogonal(orientation) {
    return orientation === 0 /* VERTICAL */ ? 1 /* HORIZONTAL */ : 0 /* VERTICAL */;
}
export function isGridBranchNode(node) {
    return !!node.children;
}
var defaultStyles = {
    separatorBorder: Color.transparent
};
var BranchNode = /** @class */ (function () {
    function BranchNode(orientation, styles, size, orthogonalSize) {
        if (size === void 0) { size = 0; }
        if (orthogonalSize === void 0) { orthogonalSize = 0; }
        this.orientation = orientation;
        this.children = [];
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this.childrenChangeDisposable = Disposable.None;
        this._onDidSashReset = new Emitter();
        this.onDidSashReset = this._onDidSashReset.event;
        this.splitviewSashResetDisposable = Disposable.None;
        this.childrenSashResetDisposable = Disposable.None;
        this._styles = styles;
        this._size = size;
        this._orthogonalSize = orthogonalSize;
        this.element = $('.monaco-grid-branch-node');
        this.splitview = new SplitView(this.element, { orientation: orientation, styles: styles });
        this.splitview.layout(size);
        var onDidSashReset = mapEvent(this.splitview.onDidSashReset, function (i) { return [i]; });
        this.splitviewSashResetDisposable = onDidSashReset(this._onDidSashReset.fire, this._onDidSashReset);
    }
    Object.defineProperty(BranchNode.prototype, "size", {
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "orthogonalSize", {
        get: function () { return this._orthogonalSize; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "styles", {
        get: function () { return this._styles; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "width", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.size : this.orthogonalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "height", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.orthogonalSize : this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "minimumSize", {
        get: function () {
            return this.children.length === 0 ? 0 : Math.max.apply(Math, this.children.map(function (c) { return c.minimumOrthogonalSize; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "maximumSize", {
        get: function () {
            return Math.min.apply(Math, this.children.map(function (c) { return c.maximumOrthogonalSize; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "minimumOrthogonalSize", {
        get: function () {
            return this.splitview.minimumSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "maximumOrthogonalSize", {
        get: function () {
            return this.splitview.maximumSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "minimumWidth", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.minimumOrthogonalSize : this.minimumSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "minimumHeight", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.minimumSize : this.minimumOrthogonalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "maximumWidth", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.maximumOrthogonalSize : this.maximumSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "maximumHeight", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.maximumSize : this.maximumOrthogonalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "orthogonalStartSash", {
        get: function () { return this.splitview.orthogonalStartSash; },
        set: function (sash) { this.splitview.orthogonalStartSash = sash; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchNode.prototype, "orthogonalEndSash", {
        get: function () { return this.splitview.orthogonalEndSash; },
        set: function (sash) { this.splitview.orthogonalEndSash = sash; },
        enumerable: true,
        configurable: true
    });
    BranchNode.prototype.style = function (styles) {
        this._styles = styles;
        this.splitview.style(styles);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child instanceof BranchNode) {
                child.style(styles);
            }
        }
    };
    BranchNode.prototype.layout = function (size) {
        this._orthogonalSize = size;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.orthogonalLayout(size);
        }
    };
    BranchNode.prototype.orthogonalLayout = function (size) {
        this._size = size;
        this.splitview.layout(size);
    };
    BranchNode.prototype.addChild = function (node, size, index) {
        if (index < 0 || index > this.children.length) {
            throw new Error('Invalid index');
        }
        this.splitview.addView(node, size, index);
        this._addChild(node, index);
        this.onDidChildrenChange();
    };
    BranchNode.prototype._addChild = function (node, index) {
        var first = index === 0;
        var last = index === this.children.length;
        this.children.splice(index, 0, node);
        node.orthogonalStartSash = this.splitview.sashes[index - 1];
        node.orthogonalEndSash = this.splitview.sashes[index];
        if (!first) {
            this.children[index - 1].orthogonalEndSash = this.splitview.sashes[index - 1];
        }
        if (!last) {
            this.children[index + 1].orthogonalStartSash = this.splitview.sashes[index];
        }
    };
    BranchNode.prototype.removeChild = function (index, sizing) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('Invalid index');
        }
        this.splitview.removeView(index, sizing);
        this._removeChild(index);
        this.onDidChildrenChange();
    };
    BranchNode.prototype._removeChild = function (index) {
        var first = index === 0;
        var last = index === this.children.length - 1;
        var child = this.children.splice(index, 1)[0];
        if (!first) {
            this.children[index - 1].orthogonalEndSash = this.splitview.sashes[index - 1];
        }
        if (!last) { // [0,1,2,3] (2) => [0,1,3]
            this.children[index].orthogonalStartSash = this.splitview.sashes[Math.max(index - 1, 0)];
        }
        return child;
    };
    BranchNode.prototype.moveChild = function (from, to) {
        if (from === to) {
            return;
        }
        if (from < 0 || from >= this.children.length) {
            throw new Error('Invalid from index');
        }
        if (to < 0 || to > this.children.length) {
            throw new Error('Invalid to index');
        }
        if (from < to) {
            to--;
        }
        this.splitview.moveView(from, to);
        var child = this._removeChild(from);
        this._addChild(child, to);
    };
    BranchNode.prototype.swapChildren = function (from, to) {
        var _a, _b;
        if (from === to) {
            return;
        }
        if (from < 0 || from >= this.children.length) {
            throw new Error('Invalid from index');
        }
        if (to < 0 || to >= this.children.length) {
            throw new Error('Invalid to index');
        }
        this.splitview.swapViews(from, to);
        _a = [this.children[to].orthogonalStartSash, this.children[to].orthogonalEndSash, this.children[from].orthogonalStartSash, this.children[from].orthogonalEndSash], this.children[from].orthogonalStartSash = _a[0], this.children[from].orthogonalEndSash = _a[1], this.children[to].orthogonalStartSash = _a[2], this.children[to].orthogonalEndSash = _a[3];
        _b = [this.children[to], this.children[from]], this.children[from] = _b[0], this.children[to] = _b[1];
    };
    BranchNode.prototype.resizeChild = function (index, size) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('Invalid index');
        }
        this.splitview.resizeView(index, size);
    };
    BranchNode.prototype.distributeViewSizes = function (recursive) {
        if (recursive === void 0) { recursive = false; }
        this.splitview.distributeViewSizes();
        if (recursive) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child instanceof BranchNode) {
                    child.distributeViewSizes(true);
                }
            }
        }
    };
    BranchNode.prototype.getChildSize = function (index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('Invalid index');
        }
        return this.splitview.getViewSize(index);
    };
    BranchNode.prototype.onDidChildrenChange = function () {
        var onDidChildrenChange = anyEvent.apply(void 0, this.children.map(function (c) { return c.onDidChange; }));
        this.childrenChangeDisposable.dispose();
        this.childrenChangeDisposable = onDidChildrenChange(this._onDidChange.fire, this._onDidChange);
        var onDidChildrenSashReset = anyEvent.apply(void 0, this.children.map(function (c, i) { return mapEvent(c.onDidSashReset, function (location) { return [i].concat(location); }); }));
        this.childrenSashResetDisposable.dispose();
        this.childrenSashResetDisposable = onDidChildrenSashReset(this._onDidSashReset.fire, this._onDidSashReset);
        this._onDidChange.fire();
    };
    BranchNode.prototype.trySet2x2 = function (other) {
        if (this.children.length !== 2 || other.children.length !== 2) {
            return Disposable.None;
        }
        if (this.getChildSize(0) !== other.getChildSize(0)) {
            return Disposable.None;
        }
        var _a = this.children, firstChild = _a[0], secondChild = _a[1];
        var _b = other.children, otherFirstChild = _b[0], otherSecondChild = _b[1];
        if (!(firstChild instanceof LeafNode) || !(secondChild instanceof LeafNode)) {
            return Disposable.None;
        }
        if (!(otherFirstChild instanceof LeafNode) || !(otherSecondChild instanceof LeafNode)) {
            return Disposable.None;
        }
        if (this.orientation === 0 /* VERTICAL */) {
            secondChild.linkedWidthNode = otherFirstChild.linkedHeightNode = firstChild;
            firstChild.linkedWidthNode = otherSecondChild.linkedHeightNode = secondChild;
            otherSecondChild.linkedWidthNode = firstChild.linkedHeightNode = otherFirstChild;
            otherFirstChild.linkedWidthNode = secondChild.linkedHeightNode = otherSecondChild;
        }
        else {
            otherFirstChild.linkedWidthNode = secondChild.linkedHeightNode = firstChild;
            otherSecondChild.linkedWidthNode = firstChild.linkedHeightNode = secondChild;
            firstChild.linkedWidthNode = otherSecondChild.linkedHeightNode = otherFirstChild;
            secondChild.linkedWidthNode = otherFirstChild.linkedHeightNode = otherSecondChild;
        }
        var mySash = this.splitview.sashes[0];
        var otherSash = other.splitview.sashes[0];
        mySash.linkedSash = otherSash;
        otherSash.linkedSash = mySash;
        this._onDidChange.fire();
        other._onDidChange.fire();
        return toDisposable(function () {
            mySash.linkedSash = otherSash.linkedSash = undefined;
            firstChild.linkedHeightNode = firstChild.linkedWidthNode = undefined;
            secondChild.linkedHeightNode = secondChild.linkedWidthNode = undefined;
            otherFirstChild.linkedHeightNode = otherFirstChild.linkedWidthNode = undefined;
            otherSecondChild.linkedHeightNode = otherSecondChild.linkedWidthNode = undefined;
        });
    };
    BranchNode.prototype.dispose = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.dispose();
        }
        this._onDidChange.dispose();
        this._onDidSashReset.dispose();
        this.splitviewSashResetDisposable.dispose();
        this.childrenSashResetDisposable.dispose();
        this.childrenChangeDisposable.dispose();
        this.splitview.dispose();
    };
    return BranchNode;
}());
var LeafNode = /** @class */ (function () {
    function LeafNode(view, orientation, orthogonalSize) {
        if (orthogonalSize === void 0) { orthogonalSize = 0; }
        this.view = view;
        this.orientation = orientation;
        this._size = 0;
        this.onDidSashReset = Event.None;
        this._onDidLinkedWidthNodeChange = new Relay();
        this._linkedWidthNode = undefined;
        this._onDidLinkedHeightNodeChange = new Relay();
        this._linkedHeightNode = undefined;
        this._onDidSetLinkedNode = new Emitter();
        this._orthogonalSize = orthogonalSize;
        this._onDidViewChange = mapEvent(this.view.onDidChange, this.orientation === 1 /* HORIZONTAL */ ? function (e) { return e && e.width; } : function (e) { return e && e.height; });
        this.onDidChange = anyEvent(this._onDidViewChange, this._onDidSetLinkedNode.event, this._onDidLinkedWidthNodeChange.event, this._onDidLinkedHeightNodeChange.event);
    }
    Object.defineProperty(LeafNode.prototype, "size", {
        get: function () { return this._size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "orthogonalSize", {
        get: function () { return this._orthogonalSize; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "linkedWidthNode", {
        get: function () { return this._linkedWidthNode; },
        set: function (node) {
            this._onDidLinkedWidthNodeChange.input = node ? node._onDidViewChange : Event.None;
            this._linkedWidthNode = node;
            this._onDidSetLinkedNode.fire();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "linkedHeightNode", {
        get: function () { return this._linkedHeightNode; },
        set: function (node) {
            this._onDidLinkedHeightNodeChange.input = node ? node._onDidViewChange : Event.None;
            this._linkedHeightNode = node;
            this._onDidSetLinkedNode.fire();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "width", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.orthogonalSize : this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "height", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.size : this.orthogonalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "element", {
        get: function () {
            return this.view.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "minimumWidth", {
        get: function () {
            return this.linkedWidthNode ? Math.max(this.linkedWidthNode.view.minimumWidth, this.view.minimumWidth) : this.view.minimumWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "maximumWidth", {
        get: function () {
            return this.linkedWidthNode ? Math.min(this.linkedWidthNode.view.maximumWidth, this.view.maximumWidth) : this.view.maximumWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "minimumHeight", {
        get: function () {
            return this.linkedHeightNode ? Math.max(this.linkedHeightNode.view.minimumHeight, this.view.minimumHeight) : this.view.minimumHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "maximumHeight", {
        get: function () {
            return this.linkedHeightNode ? Math.min(this.linkedHeightNode.view.maximumHeight, this.view.maximumHeight) : this.view.maximumHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "minimumSize", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.minimumHeight : this.minimumWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "maximumSize", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.maximumHeight : this.maximumWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "minimumOrthogonalSize", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.minimumWidth : this.minimumHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "maximumOrthogonalSize", {
        get: function () {
            return this.orientation === 1 /* HORIZONTAL */ ? this.maximumWidth : this.maximumHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "orthogonalStartSash", {
        set: function (sash) {
            // noop
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "orthogonalEndSash", {
        set: function (sash) {
            // noop
        },
        enumerable: true,
        configurable: true
    });
    LeafNode.prototype.layout = function (size) {
        this._size = size;
        return this.view.layout(this.width, this.height);
    };
    LeafNode.prototype.orthogonalLayout = function (size) {
        this._orthogonalSize = size;
        return this.view.layout(this.width, this.height);
    };
    LeafNode.prototype.dispose = function () { };
    return LeafNode;
}());
function flipNode(node, size, orthogonalSize) {
    if (node instanceof BranchNode) {
        var result = new BranchNode(orthogonal(node.orientation), node.styles, size, orthogonalSize);
        var totalSize = 0;
        for (var i = node.children.length - 1; i >= 0; i--) {
            var child = node.children[i];
            var childSize = child instanceof BranchNode ? child.orthogonalSize : child.size;
            var newSize = node.size === 0 ? 0 : Math.round((size * childSize) / node.size);
            totalSize += newSize;
            // The last view to add should adjust to rounding errors
            if (i === 0) {
                newSize += size - totalSize;
            }
            result.addChild(flipNode(child, orthogonalSize, newSize), newSize, 0);
        }
        return result;
    }
    else {
        return new LeafNode(node.view, orthogonal(node.orientation), orthogonalSize);
    }
}
var GridView = /** @class */ (function () {
    function GridView(options) {
        if (options === void 0) { options = {}; }
        this.onDidSashResetRelay = new Relay();
        this.onDidSashReset = this.onDidSashResetRelay.event;
        this.disposable2x2 = Disposable.None;
        this._onDidChange = new Relay();
        this.onDidChange = this._onDidChange.event;
        this.element = $('.monaco-grid-view');
        this.styles = options.styles || defaultStyles;
        this.root = new BranchNode(0 /* VERTICAL */, this.styles);
    }
    Object.defineProperty(GridView.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (root) {
            var oldRoot = this._root;
            if (oldRoot) {
                this.element.removeChild(oldRoot.element);
                oldRoot.dispose();
            }
            this._root = root;
            this.element.appendChild(root.element);
            this.onDidSashResetRelay.input = root.onDidSashReset;
            this._onDidChange.input = mapEvent(root.onDidChange, function () { return undefined; }); // TODO
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridView.prototype, "orientation", {
        get: function () {
            return this._root.orientation;
        },
        set: function (orientation) {
            if (this._root.orientation === orientation) {
                return;
            }
            var _a = this._root, size = _a.size, orthogonalSize = _a.orthogonalSize;
            this.root = flipNode(this._root, orthogonalSize, size);
            this.root.layout(size);
            this.root.orthogonalLayout(orthogonalSize);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridView.prototype, "width", {
        get: function () { return this.root.width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridView.prototype, "height", {
        get: function () { return this.root.height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridView.prototype, "minimumWidth", {
        get: function () { return this.root.minimumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridView.prototype, "minimumHeight", {
        get: function () { return this.root.minimumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridView.prototype, "maximumWidth", {
        get: function () { return this.root.maximumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridView.prototype, "maximumHeight", {
        get: function () { return this.root.maximumHeight; },
        enumerable: true,
        configurable: true
    });
    GridView.prototype.style = function (styles) {
        this.styles = styles;
        this.root.style(styles);
    };
    GridView.prototype.layout = function (width, height) {
        var _a = this.root.orientation === 1 /* HORIZONTAL */ ? [height, width] : [width, height], size = _a[0], orthogonalSize = _a[1];
        this.root.layout(size);
        this.root.orthogonalLayout(orthogonalSize);
    };
    GridView.prototype.addView = function (view, size, location) {
        this.disposable2x2.dispose();
        this.disposable2x2 = Disposable.None;
        var _a = tail(location), rest = _a[0], index = _a[1];
        var _b = this.getNode(rest), pathToParent = _b[0], parent = _b[1];
        if (parent instanceof BranchNode) {
            var node = new LeafNode(view, orthogonal(parent.orientation), parent.orthogonalSize);
            parent.addChild(node, size, index);
        }
        else {
            var _c = tail(pathToParent), grandParent = _c[1];
            var _d = tail(rest), parentIndex = _d[1];
            grandParent.removeChild(parentIndex);
            var newParent = new BranchNode(parent.orientation, this.styles, parent.size, parent.orthogonalSize);
            grandParent.addChild(newParent, parent.size, parentIndex);
            newParent.orthogonalLayout(parent.orthogonalSize);
            var newSibling = new LeafNode(parent.view, grandParent.orientation, parent.size);
            newParent.addChild(newSibling, 0, 0);
            if (typeof size !== 'number' && size.type === 'split') {
                size = Sizing.Split(0);
            }
            var node = new LeafNode(view, grandParent.orientation, parent.size);
            newParent.addChild(node, size, index);
        }
    };
    GridView.prototype.removeView = function (location, sizing) {
        this.disposable2x2.dispose();
        this.disposable2x2 = Disposable.None;
        var _a = tail(location), rest = _a[0], index = _a[1];
        var _b = this.getNode(rest), pathToParent = _b[0], parent = _b[1];
        if (!(parent instanceof BranchNode)) {
            throw new Error('Invalid location');
        }
        var node = parent.children[index];
        if (!(node instanceof LeafNode)) {
            throw new Error('Invalid location');
        }
        parent.removeChild(index, sizing);
        if (parent.children.length === 0) {
            throw new Error('Invalid grid state');
        }
        if (parent.children.length > 1) {
            return node.view;
        }
        if (pathToParent.length === 0) { // parent is root
            var sibling_1 = parent.children[0];
            if (sibling_1 instanceof LeafNode) {
                return node.view;
            }
            // we must promote sibling to be the new root
            parent.removeChild(0);
            this.root = sibling_1;
            return node.view;
        }
        var _c = tail(pathToParent), grandParent = _c[1];
        var _d = tail(rest), parentIndex = _d[1];
        var sibling = parent.children[0];
        parent.removeChild(0);
        var sizes = grandParent.children.map(function (_, i) { return grandParent.getChildSize(i); });
        grandParent.removeChild(parentIndex, sizing);
        if (sibling instanceof BranchNode) {
            sizes.splice.apply(sizes, [parentIndex, 1].concat(sibling.children.map(function (c) { return c.size; })));
            for (var i = 0; i < sibling.children.length; i++) {
                var child = sibling.children[i];
                grandParent.addChild(child, child.size, parentIndex + i);
            }
        }
        else {
            var newSibling = new LeafNode(sibling.view, orthogonal(sibling.orientation), sibling.size);
            grandParent.addChild(newSibling, sibling.orthogonalSize, parentIndex);
        }
        for (var i = 0; i < sizes.length; i++) {
            grandParent.resizeChild(i, sizes[i]);
        }
        return node.view;
    };
    GridView.prototype.moveView = function (parentLocation, from, to) {
        var _a = this.getNode(parentLocation), parent = _a[1];
        if (!(parent instanceof BranchNode)) {
            throw new Error('Invalid location');
        }
        parent.moveChild(from, to);
    };
    GridView.prototype.swapViews = function (from, to) {
        var _a = tail(from), fromRest = _a[0], fromIndex = _a[1];
        var _b = this.getNode(fromRest), fromParent = _b[1];
        if (!(fromParent instanceof BranchNode)) {
            throw new Error('Invalid from location');
        }
        var fromSize = fromParent.getChildSize(fromIndex);
        var fromNode = fromParent.children[fromIndex];
        if (!(fromNode instanceof LeafNode)) {
            throw new Error('Invalid from location');
        }
        var _c = tail(to), toRest = _c[0], toIndex = _c[1];
        var _d = this.getNode(toRest), toParent = _d[1];
        if (!(toParent instanceof BranchNode)) {
            throw new Error('Invalid to location');
        }
        var toSize = toParent.getChildSize(toIndex);
        var toNode = toParent.children[toIndex];
        if (!(toNode instanceof LeafNode)) {
            throw new Error('Invalid to location');
        }
        if (fromParent === toParent) {
            fromParent.swapChildren(fromIndex, toIndex);
        }
        else {
            fromParent.removeChild(fromIndex);
            toParent.removeChild(toIndex);
            fromParent.addChild(toNode, fromSize, fromIndex);
            toParent.addChild(fromNode, toSize, toIndex);
            fromParent.layout(fromParent.orthogonalSize);
            toParent.layout(toParent.orthogonalSize);
        }
    };
    GridView.prototype.resizeView = function (location, size) {
        var _a = tail(location), rest = _a[0], index = _a[1];
        var _b = this.getNode(rest), parent = _b[1];
        if (!(parent instanceof BranchNode)) {
            throw new Error('Invalid location');
        }
        parent.resizeChild(index, size);
    };
    GridView.prototype.getViewSize = function (location) {
        var _a = this.getNode(location), node = _a[1];
        return { width: node.width, height: node.height };
    };
    GridView.prototype.maximizeViewSize = function (location) {
        var _a = this.getNode(location), ancestors = _a[0], node = _a[1];
        if (!(node instanceof LeafNode)) {
            throw new Error('Invalid location');
        }
        for (var i = 0; i < ancestors.length; i++) {
            ancestors[i].resizeChild(location[i], Number.POSITIVE_INFINITY);
        }
    };
    GridView.prototype.distributeViewSizes = function (location) {
        if (!location) {
            this.root.distributeViewSizes(true);
            return;
        }
        var _a = this.getNode(location), node = _a[1];
        if (!(node instanceof BranchNode)) {
            throw new Error('Invalid location');
        }
        node.distributeViewSizes();
    };
    GridView.prototype.getViews = function () {
        return this._getViews(this.root, this.orientation, { top: 0, left: 0, width: this.width, height: this.height });
    };
    GridView.prototype._getViews = function (node, orientation, box) {
        if (node instanceof LeafNode) {
            return { view: node.view, box: box };
        }
        var children = [];
        var offset = 0;
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];
            var childOrientation = orthogonal(orientation);
            var childBox = orientation === 1 /* HORIZONTAL */
                ? { top: box.top, left: box.left + offset, width: child.width, height: box.height }
                : { top: box.top + offset, left: box.left, width: box.width, height: child.height };
            children.push(this._getViews(child, childOrientation, childBox));
            offset += orientation === 1 /* HORIZONTAL */ ? child.width : child.height;
        }
        return { children: children, box: box };
    };
    GridView.prototype.getNode = function (location, node, path) {
        if (node === void 0) { node = this.root; }
        if (path === void 0) { path = []; }
        if (location.length === 0) {
            return [path, node];
        }
        if (!(node instanceof BranchNode)) {
            throw new Error('Invalid location');
        }
        var index = location[0], rest = location.slice(1);
        if (index < 0 || index >= node.children.length) {
            throw new Error('Invalid location');
        }
        var child = node.children[index];
        path.push(node);
        return this.getNode(rest, child, path);
    };
    GridView.prototype.trySet2x2 = function () {
        this.disposable2x2.dispose();
        this.disposable2x2 = Disposable.None;
        if (this.root.children.length !== 2) {
            return;
        }
        var _a = this.root.children, first = _a[0], second = _a[1];
        if (!(first instanceof BranchNode) || !(second instanceof BranchNode)) {
            return;
        }
        this.disposable2x2 = first.trySet2x2(second);
    };
    GridView.prototype.dispose = function () {
        this.onDidSashResetRelay.dispose();
        this.root.dispose();
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    };
    return GridView;
}());
export { GridView };
