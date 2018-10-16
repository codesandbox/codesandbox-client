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
import './splitview.css';
import { combinedDisposable, toDisposable, Disposable } from '../../../common/lifecycle';
import { mapEvent, Emitter } from '../../../common/event';
import * as types from '../../../common/types';
import * as dom from '../../dom';
import { clamp } from '../../../common/numbers';
import { range, firstIndex, pushToStart, pushToEnd } from '../../../common/arrays';
import { Sash } from '../sash/sash';
import { Color } from '../../../common/color';
import { domEvent } from '../../event';
var defaultStyles = {
    separatorBorder: Color.transparent
};
var State;
(function (State) {
    State[State["Idle"] = 0] = "Idle";
    State[State["Busy"] = 1] = "Busy";
})(State || (State = {}));
export var Sizing;
(function (Sizing) {
    Sizing.Distribute = { type: 'distribute' };
    function Split(index) { return { type: 'split', index: index }; }
    Sizing.Split = Split;
})(Sizing || (Sizing = {}));
var SplitView = /** @class */ (function (_super) {
    __extends(SplitView, _super);
    function SplitView(container, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.size = 0;
        _this.contentSize = 0;
        _this.proportions = undefined;
        _this.viewItems = [];
        _this.sashItems = [];
        _this.state = State.Idle;
        _this._onDidSashChange = _this._register(new Emitter());
        _this.onDidSashChange = _this._onDidSashChange.event;
        _this._onDidSashReset = _this._register(new Emitter());
        _this.onDidSashReset = _this._onDidSashReset.event;
        _this.orientation = types.isUndefined(options.orientation) ? 0 /* VERTICAL */ : options.orientation;
        _this.inverseAltBehavior = !!options.inverseAltBehavior;
        _this.el = document.createElement('div');
        dom.addClass(_this.el, 'monaco-split-view2');
        dom.addClass(_this.el, _this.orientation === 0 /* VERTICAL */ ? 'vertical' : 'horizontal');
        container.appendChild(_this.el);
        _this.sashContainer = dom.append(_this.el, dom.$('.sash-container'));
        _this.viewContainer = dom.append(_this.el, dom.$('.split-view-container'));
        _this.style(options.styles || defaultStyles);
        return _this;
    }
    Object.defineProperty(SplitView.prototype, "length", {
        get: function () {
            return this.viewItems.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitView.prototype, "minimumSize", {
        get: function () {
            return this.viewItems.reduce(function (r, item) { return r + item.view.minimumSize; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitView.prototype, "maximumSize", {
        get: function () {
            return this.length === 0 ? Number.POSITIVE_INFINITY : this.viewItems.reduce(function (r, item) { return r + item.view.maximumSize; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitView.prototype, "orthogonalStartSash", {
        get: function () { return this._orthogonalStartSash; },
        set: function (sash) {
            for (var _i = 0, _a = this.sashItems; _i < _a.length; _i++) {
                var sashItem = _a[_i];
                sashItem.sash.orthogonalStartSash = sash;
            }
            this._orthogonalStartSash = sash;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitView.prototype, "orthogonalEndSash", {
        get: function () { return this._orthogonalEndSash; },
        set: function (sash) {
            for (var _i = 0, _a = this.sashItems; _i < _a.length; _i++) {
                var sashItem = _a[_i];
                sashItem.sash.orthogonalEndSash = sash;
            }
            this._orthogonalEndSash = sash;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitView.prototype, "sashes", {
        get: function () {
            return this.sashItems.map(function (s) { return s.sash; });
        },
        enumerable: true,
        configurable: true
    });
    SplitView.prototype.style = function (styles) {
        if (styles.separatorBorder.isTransparent()) {
            dom.removeClass(this.el, 'separator-border');
            this.el.style.removeProperty('--separator-border');
        }
        else {
            dom.addClass(this.el, 'separator-border');
            this.el.style.setProperty('--separator-border', styles.separatorBorder.toString());
        }
    };
    SplitView.prototype.addView = function (view, size, index) {
        var _this = this;
        if (index === void 0) { index = this.viewItems.length; }
        if (this.state !== State.Idle) {
            throw new Error('Cant modify splitview');
        }
        this.state = State.Busy;
        // Add view
        var container = dom.$('.split-view-view');
        if (index === this.viewItems.length) {
            this.viewContainer.appendChild(container);
        }
        else {
            this.viewContainer.insertBefore(container, this.viewContainer.children.item(index));
        }
        var onChangeDisposable = view.onDidChange(function (size) { return _this.onViewChange(item, size); });
        var containerDisposable = toDisposable(function () { return _this.viewContainer.removeChild(container); });
        var disposable = combinedDisposable([onChangeDisposable, containerDisposable]);
        var layoutContainer = this.orientation === 0 /* VERTICAL */
            ? function () { return item.container.style.height = item.size + "px"; }
            : function () { return item.container.style.width = item.size + "px"; };
        var layout = function () {
            layoutContainer();
            item.view.layout(item.size, _this.orientation);
        };
        var viewSize;
        if (typeof size === 'number') {
            viewSize = size;
        }
        else if (size.type === 'split') {
            viewSize = this.getViewSize(size.index) / 2;
        }
        else {
            viewSize = view.minimumSize;
        }
        var item = { view: view, container: container, size: viewSize, layout: layout, disposable: disposable };
        this.viewItems.splice(index, 0, item);
        // Add sash
        if (this.viewItems.length > 1) {
            var orientation_1 = this.orientation === 0 /* VERTICAL */ ? 1 /* HORIZONTAL */ : 0 /* VERTICAL */;
            var layoutProvider = this.orientation === 0 /* VERTICAL */ ? { getHorizontalSashTop: function (sash) { return _this.getSashPosition(sash); } } : { getVerticalSashLeft: function (sash) { return _this.getSashPosition(sash); } };
            var sash_1 = new Sash(this.sashContainer, layoutProvider, {
                orientation: orientation_1,
                orthogonalStartSash: this.orthogonalStartSash,
                orthogonalEndSash: this.orthogonalEndSash
            });
            var sashEventMapper = this.orientation === 0 /* VERTICAL */
                ? function (e) { return ({ sash: sash_1, start: e.startY, current: e.currentY, alt: e.altKey }); }
                : function (e) { return ({ sash: sash_1, start: e.startX, current: e.currentX, alt: e.altKey }); };
            var onStart = mapEvent(sash_1.onDidStart, sashEventMapper);
            var onStartDisposable = onStart(this.onSashStart, this);
            var onChange = mapEvent(sash_1.onDidChange, sashEventMapper);
            var onChangeDisposable_1 = onChange(this.onSashChange, this);
            var onEnd = mapEvent(sash_1.onDidEnd, function () { return firstIndex(_this.sashItems, function (item) { return item.sash === sash_1; }); });
            var onEndDisposable = onEnd(this.onSashEnd, this);
            var onDidResetDisposable = sash_1.onDidReset(function () { return _this._onDidSashReset.fire(firstIndex(_this.sashItems, function (item) { return item.sash === sash_1; })); });
            var disposable_1 = combinedDisposable([onStartDisposable, onChangeDisposable_1, onEndDisposable, onDidResetDisposable, sash_1]);
            var sashItem = { sash: sash_1, disposable: disposable_1 };
            this.sashItems.splice(index - 1, 0, sashItem);
        }
        container.appendChild(view.element);
        var highPriorityIndex;
        if (typeof size !== 'number' && size.type === 'split') {
            highPriorityIndex = size.index;
        }
        this.relayout(index, highPriorityIndex);
        this.state = State.Idle;
        if (typeof size !== 'number' && size.type === 'distribute') {
            this.distributeViewSizes();
        }
    };
    SplitView.prototype.removeView = function (index, sizing) {
        if (this.state !== State.Idle) {
            throw new Error('Cant modify splitview');
        }
        this.state = State.Busy;
        if (index < 0 || index >= this.viewItems.length) {
            throw new Error('Index out of bounds');
        }
        // Remove view
        var viewItem = this.viewItems.splice(index, 1)[0];
        viewItem.disposable.dispose();
        // Remove sash
        if (this.viewItems.length >= 1) {
            var sashIndex = Math.max(index - 1, 0);
            var sashItem = this.sashItems.splice(sashIndex, 1)[0];
            sashItem.disposable.dispose();
        }
        this.relayout();
        this.state = State.Idle;
        if (sizing && sizing.type === 'distribute') {
            this.distributeViewSizes();
        }
        return viewItem.view;
    };
    SplitView.prototype.moveView = function (from, to) {
        if (this.state !== State.Idle) {
            throw new Error('Cant modify splitview');
        }
        var size = this.getViewSize(from);
        var view = this.removeView(from);
        this.addView(view, size, to);
    };
    SplitView.prototype.swapViews = function (from, to) {
        if (this.state !== State.Idle) {
            throw new Error('Cant modify splitview');
        }
        if (from > to) {
            return this.swapViews(to, from);
        }
        var fromSize = this.getViewSize(from);
        var toSize = this.getViewSize(to);
        var toView = this.removeView(to);
        var fromView = this.removeView(from);
        this.addView(toView, fromSize, from);
        this.addView(fromView, toSize, to);
    };
    SplitView.prototype.relayout = function (lowPriorityIndex, highPriorityIndex) {
        var contentSize = this.viewItems.reduce(function (r, i) { return r + i.size; }, 0);
        this.resize(this.viewItems.length - 1, this.size - contentSize, undefined, lowPriorityIndex, highPriorityIndex);
        this.distributeEmptySpace();
        this.layoutViews();
        this.saveProportions();
    };
    SplitView.prototype.layout = function (size) {
        var previousSize = Math.max(this.size, this.contentSize);
        this.size = size;
        if (!this.proportions) {
            this.resize(this.viewItems.length - 1, size - previousSize);
        }
        else {
            for (var i = 0; i < this.viewItems.length; i++) {
                var item = this.viewItems[i];
                item.size = clamp(Math.round(this.proportions[i] * size), item.view.minimumSize, item.view.maximumSize);
            }
        }
        this.distributeEmptySpace();
        this.layoutViews();
    };
    SplitView.prototype.saveProportions = function () {
        var _this = this;
        if (this.contentSize > 0) {
            this.proportions = this.viewItems.map(function (i) { return i.size / _this.contentSize; });
        }
    };
    SplitView.prototype.onSashStart = function (_a) {
        var _this = this;
        var sash = _a.sash, start = _a.start, alt = _a.alt;
        var index = firstIndex(this.sashItems, function (item) { return item.sash === sash; });
        // This way, we can press Alt while we resize a sash, macOS style!
        var disposable = combinedDisposable([
            domEvent(document.body, 'keydown')(function (e) { return resetSashDragState(_this.sashDragState.current, e.altKey); }),
            domEvent(document.body, 'keyup')(function () { return resetSashDragState(_this.sashDragState.current, false); })
        ]);
        var resetSashDragState = function (start, alt) {
            var sizes = _this.viewItems.map(function (i) { return i.size; });
            var minDelta = Number.NEGATIVE_INFINITY;
            var maxDelta = Number.POSITIVE_INFINITY;
            if (_this.inverseAltBehavior) {
                alt = !alt;
            }
            if (alt) {
                // When we're using the last sash with Alt, we're resizing
                // the view to the left/up, instead of right/down as usual
                // Thus, we must do the inverse of the usual
                var isLastSash = index === _this.sashItems.length - 1;
                if (isLastSash) {
                    var viewItem = _this.viewItems[index];
                    minDelta = (viewItem.view.minimumSize - viewItem.size) / 2;
                    maxDelta = (viewItem.view.maximumSize - viewItem.size) / 2;
                }
                else {
                    var viewItem = _this.viewItems[index + 1];
                    minDelta = (viewItem.size - viewItem.view.maximumSize) / 2;
                    maxDelta = (viewItem.size - viewItem.view.minimumSize) / 2;
                }
            }
            _this.sashDragState = { start: start, current: start, index: index, sizes: sizes, minDelta: minDelta, maxDelta: maxDelta, alt: alt, disposable: disposable };
        };
        resetSashDragState(start, alt);
    };
    SplitView.prototype.onSashChange = function (_a) {
        var current = _a.current;
        var _b = this.sashDragState, index = _b.index, start = _b.start, sizes = _b.sizes, alt = _b.alt, minDelta = _b.minDelta, maxDelta = _b.maxDelta;
        this.sashDragState.current = current;
        var delta = current - start;
        var newDelta = this.resize(index, delta, sizes, undefined, undefined, minDelta, maxDelta);
        if (alt) {
            var isLastSash = index === this.sashItems.length - 1;
            var newSizes = this.viewItems.map(function (i) { return i.size; });
            var viewItemIndex = isLastSash ? index : index + 1;
            var viewItem = this.viewItems[viewItemIndex];
            var newMinDelta = viewItem.size - viewItem.view.maximumSize;
            var newMaxDelta = viewItem.size - viewItem.view.minimumSize;
            var resizeIndex = isLastSash ? index - 1 : index + 1;
            this.resize(resizeIndex, -newDelta, newSizes, undefined, undefined, newMinDelta, newMaxDelta);
        }
        this.distributeEmptySpace();
        this.layoutViews();
    };
    SplitView.prototype.onSashEnd = function (index) {
        this._onDidSashChange.fire(index);
        this.sashDragState.disposable.dispose();
        this.saveProportions();
    };
    SplitView.prototype.onViewChange = function (item, size) {
        var index = this.viewItems.indexOf(item);
        if (index < 0 || index >= this.viewItems.length) {
            return;
        }
        size = typeof size === 'number' ? size : item.size;
        size = clamp(size, item.view.minimumSize, item.view.maximumSize);
        if (this.inverseAltBehavior && index > 0) {
            // In this case, we want the view to grow or shrink both sides equally
            // so we just resize the "left" side by half and let `resize` do the clamping magic
            this.resize(index - 1, Math.floor((item.size - size) / 2));
            this.distributeEmptySpace();
            this.layoutViews();
        }
        else {
            item.size = size;
            this.relayout(index, undefined);
        }
    };
    SplitView.prototype.resizeView = function (index, size) {
        var _this = this;
        if (this.state !== State.Idle) {
            throw new Error('Cant modify splitview');
        }
        this.state = State.Busy;
        if (index < 0 || index >= this.viewItems.length) {
            return;
        }
        var item = this.viewItems[index];
        size = Math.round(size);
        size = clamp(size, item.view.minimumSize, item.view.maximumSize);
        var delta = size - item.size;
        if (delta !== 0 && index < this.viewItems.length - 1) {
            var downIndexes = range(index + 1, this.viewItems.length);
            var collapseDown = downIndexes.reduce(function (r, i) { return r + (_this.viewItems[i].size - _this.viewItems[i].view.minimumSize); }, 0);
            var expandDown = downIndexes.reduce(function (r, i) { return r + (_this.viewItems[i].view.maximumSize - _this.viewItems[i].size); }, 0);
            var deltaDown = clamp(delta, -expandDown, collapseDown);
            this.resize(index, deltaDown);
            delta -= deltaDown;
        }
        if (delta !== 0 && index > 0) {
            var upIndexes = range(index - 1, -1);
            var collapseUp = upIndexes.reduce(function (r, i) { return r + (_this.viewItems[i].size - _this.viewItems[i].view.minimumSize); }, 0);
            var expandUp = upIndexes.reduce(function (r, i) { return r + (_this.viewItems[i].view.maximumSize - _this.viewItems[i].size); }, 0);
            var deltaUp = clamp(-delta, -collapseUp, expandUp);
            this.resize(index - 1, deltaUp);
        }
        this.distributeEmptySpace();
        this.layoutViews();
        this.saveProportions();
        this.state = State.Idle;
    };
    SplitView.prototype.distributeViewSizes = function () {
        var size = Math.floor(this.size / this.viewItems.length);
        for (var i = 0; i < this.viewItems.length - 1; i++) {
            this.resizeView(i, size);
        }
    };
    SplitView.prototype.getViewSize = function (index) {
        if (index < 0 || index >= this.viewItems.length) {
            return -1;
        }
        return this.viewItems[index].size;
    };
    SplitView.prototype.resize = function (index, delta, sizes, lowPriorityIndex, highPriorityIndex, overloadMinDelta, overloadMaxDelta) {
        var _this = this;
        if (sizes === void 0) { sizes = this.viewItems.map(function (i) { return i.size; }); }
        if (overloadMinDelta === void 0) { overloadMinDelta = Number.NEGATIVE_INFINITY; }
        if (overloadMaxDelta === void 0) { overloadMaxDelta = Number.POSITIVE_INFINITY; }
        if (index < 0 || index >= this.viewItems.length) {
            return 0;
        }
        var upIndexes = range(index, -1);
        var downIndexes = range(index + 1, this.viewItems.length);
        if (typeof highPriorityIndex === 'number') {
            pushToStart(upIndexes, highPriorityIndex);
            pushToStart(downIndexes, highPriorityIndex);
        }
        if (typeof lowPriorityIndex === 'number') {
            pushToEnd(upIndexes, lowPriorityIndex);
            pushToEnd(downIndexes, lowPriorityIndex);
        }
        var upItems = upIndexes.map(function (i) { return _this.viewItems[i]; });
        var upSizes = upIndexes.map(function (i) { return sizes[i]; });
        var downItems = downIndexes.map(function (i) { return _this.viewItems[i]; });
        var downSizes = downIndexes.map(function (i) { return sizes[i]; });
        var minDeltaUp = upIndexes.reduce(function (r, i) { return r + (_this.viewItems[i].view.minimumSize - sizes[i]); }, 0);
        var maxDeltaUp = upIndexes.reduce(function (r, i) { return r + (_this.viewItems[i].view.maximumSize - sizes[i]); }, 0);
        var maxDeltaDown = downIndexes.length === 0 ? Number.POSITIVE_INFINITY : downIndexes.reduce(function (r, i) { return r + (sizes[i] - _this.viewItems[i].view.minimumSize); }, 0);
        var minDeltaDown = downIndexes.length === 0 ? Number.NEGATIVE_INFINITY : downIndexes.reduce(function (r, i) { return r + (sizes[i] - _this.viewItems[i].view.maximumSize); }, 0);
        var minDelta = Math.max(minDeltaUp, minDeltaDown, overloadMinDelta);
        var maxDelta = Math.min(maxDeltaDown, maxDeltaUp, overloadMaxDelta);
        delta = clamp(delta, minDelta, maxDelta);
        for (var i = 0, deltaUp = delta; i < upItems.length; i++) {
            var item = upItems[i];
            var size = clamp(upSizes[i] + deltaUp, item.view.minimumSize, item.view.maximumSize);
            var viewDelta = size - upSizes[i];
            deltaUp -= viewDelta;
            item.size = size;
        }
        for (var i = 0, deltaDown = delta; i < downItems.length; i++) {
            var item = downItems[i];
            var size = clamp(downSizes[i] - deltaDown, item.view.minimumSize, item.view.maximumSize);
            var viewDelta = size - downSizes[i];
            deltaDown += viewDelta;
            item.size = size;
        }
        return delta;
    };
    SplitView.prototype.distributeEmptySpace = function () {
        var contentSize = this.viewItems.reduce(function (r, i) { return r + i.size; }, 0);
        var emptyDelta = this.size - contentSize;
        for (var i = this.viewItems.length - 1; emptyDelta !== 0 && i >= 0; i--) {
            var item = this.viewItems[i];
            var size = clamp(item.size + emptyDelta, item.view.minimumSize, item.view.maximumSize);
            var viewDelta = size - item.size;
            emptyDelta -= viewDelta;
            item.size = size;
        }
    };
    SplitView.prototype.layoutViews = function () {
        // Save new content size
        this.contentSize = this.viewItems.reduce(function (r, i) { return r + i.size; }, 0);
        // Layout views
        this.viewItems.forEach(function (item) { return item.layout(); });
        // Layout sashes
        this.sashItems.forEach(function (item) { return item.sash.layout(); });
        // Update sashes enablement
        var previous = false;
        var collapsesDown = this.viewItems.map(function (i) { return previous = (i.size - i.view.minimumSize > 0) || previous; });
        previous = false;
        var expandsDown = this.viewItems.map(function (i) { return previous = (i.view.maximumSize - i.size > 0) || previous; });
        var reverseViews = this.viewItems.slice().reverse();
        previous = false;
        var collapsesUp = reverseViews.map(function (i) { return previous = (i.size - i.view.minimumSize > 0) || previous; }).reverse();
        previous = false;
        var expandsUp = reverseViews.map(function (i) { return previous = (i.view.maximumSize - i.size > 0) || previous; }).reverse();
        this.sashItems.forEach(function (s, i) {
            var min = !(collapsesDown[i] && expandsUp[i + 1]);
            var max = !(expandsDown[i] && collapsesUp[i + 1]);
            if (min && max) {
                s.sash.state = 0 /* Disabled */;
            }
            else if (min && !max) {
                s.sash.state = 1 /* Minimum */;
            }
            else if (!min && max) {
                s.sash.state = 2 /* Maximum */;
            }
            else {
                s.sash.state = 3 /* Enabled */;
            }
        });
    };
    SplitView.prototype.getSashPosition = function (sash) {
        var position = 0;
        for (var i = 0; i < this.sashItems.length; i++) {
            position += this.viewItems[i].size;
            if (this.sashItems[i].sash === sash) {
                return position;
            }
        }
        return 0;
    };
    SplitView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.viewItems.forEach(function (i) { return i.disposable.dispose(); });
        this.viewItems = [];
        this.sashItems.forEach(function (i) { return i.disposable.dispose(); });
        this.sashItems = [];
    };
    return SplitView;
}(Disposable));
export { SplitView };
