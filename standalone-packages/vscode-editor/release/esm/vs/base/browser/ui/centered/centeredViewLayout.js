/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { SplitView } from '../splitview/splitview.js';
import { $ } from '../../dom.js';
import { Event, mapEvent } from '../../../common/event.js';
import { dispose } from '../../../common/lifecycle.js';
var GOLDEN_RATIO = {
    leftMarginRatio: 0.1909,
    rightMarginRatio: 0.1909
};
function createEmptyView(background) {
    var element = $('.centered-layout-margin');
    element.style.height = '100%';
    element.style.backgroundColor = background.toString();
    return {
        element: element,
        layout: function () { return undefined; },
        minimumSize: 60,
        maximumSize: Number.POSITIVE_INFINITY,
        onDidChange: Event.None
    };
}
function toSplitViewView(view, getHeight) {
    return {
        element: view.element,
        get maximumSize() { return view.maximumWidth; },
        get minimumSize() { return view.minimumWidth; },
        onDidChange: mapEvent(view.onDidChange, function (e) { return e && e.width; }),
        layout: function (size) { return view.layout(size, getHeight()); }
    };
}
var CenteredViewLayout = /** @class */ (function () {
    function CenteredViewLayout(container, view, state) {
        if (state === void 0) { state = GOLDEN_RATIO; }
        this.container = container;
        this.view = view;
        this.state = state;
        this.width = 0;
        this.height = 0;
        this.didLayout = false;
        this.splitViewDisposables = [];
        this.container.appendChild(this.view.element);
        // Make sure to hide the split view overflow like sashes #52892
        this.container.style.overflow = 'hidden';
    }
    Object.defineProperty(CenteredViewLayout.prototype, "minimumWidth", {
        get: function () { return this.splitView ? this.splitView.minimumSize : this.view.minimumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CenteredViewLayout.prototype, "maximumWidth", {
        get: function () { return this.splitView ? this.splitView.maximumSize : this.view.maximumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CenteredViewLayout.prototype, "minimumHeight", {
        get: function () { return this.view.minimumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CenteredViewLayout.prototype, "maximumHeight", {
        get: function () { return this.view.maximumHeight; },
        enumerable: true,
        configurable: true
    });
    CenteredViewLayout.prototype.layout = function (width, height) {
        this.width = width;
        this.height = height;
        if (this.splitView) {
            this.splitView.layout(width);
            if (!this.didLayout) {
                this.resizeMargins();
            }
        }
        else {
            this.view.layout(width, height);
        }
        this.didLayout = true;
    };
    CenteredViewLayout.prototype.resizeMargins = function () {
        this.splitView.resizeView(0, this.state.leftMarginRatio * this.width);
        this.splitView.resizeView(2, this.state.rightMarginRatio * this.width);
    };
    CenteredViewLayout.prototype.isActive = function () {
        return !!this.splitView;
    };
    CenteredViewLayout.prototype.styles = function (style) {
        this.style = style;
        if (this.splitView) {
            this.splitView.style(this.style);
            this.emptyViews[0].element.style.backgroundColor = this.style.background.toString();
            this.emptyViews[1].element.style.backgroundColor = this.style.background.toString();
        }
    };
    CenteredViewLayout.prototype.activate = function (active) {
        var _this = this;
        if (active === this.isActive()) {
            return;
        }
        if (active) {
            this.container.removeChild(this.view.element);
            this.splitView = new SplitView(this.container, {
                inverseAltBehavior: true,
                orientation: 1 /* HORIZONTAL */,
                styles: this.style
            });
            this.splitViewDisposables.push(this.splitView.onDidSashChange(function () {
                _this.state.leftMarginRatio = _this.splitView.getViewSize(0) / _this.width;
                _this.state.rightMarginRatio = _this.splitView.getViewSize(2) / _this.width;
            }));
            this.splitViewDisposables.push(this.splitView.onDidSashReset(function () {
                _this.state.leftMarginRatio = GOLDEN_RATIO.leftMarginRatio;
                _this.state.rightMarginRatio = GOLDEN_RATIO.rightMarginRatio;
                _this.resizeMargins();
            }));
            this.splitView.layout(this.width);
            this.splitView.addView(toSplitViewView(this.view, function () { return _this.height; }), 0);
            this.emptyViews = [createEmptyView(this.style.background), createEmptyView(this.style.background)];
            this.splitView.addView(this.emptyViews[0], this.state.leftMarginRatio * this.width, 0);
            this.splitView.addView(this.emptyViews[1], this.state.rightMarginRatio * this.width, 2);
        }
        else {
            this.container.removeChild(this.splitView.el);
            this.splitViewDisposables = dispose(this.splitViewDisposables);
            this.splitView.dispose();
            this.splitView = undefined;
            this.emptyViews = undefined;
            this.container.appendChild(this.view.element);
        }
    };
    CenteredViewLayout.prototype.dispose = function () {
        this.splitViewDisposables = dispose(this.splitViewDisposables);
        if (this.splitView) {
            this.splitView.dispose();
            this.splitView = undefined;
        }
    };
    return CenteredViewLayout;
}());
export { CenteredViewLayout };
