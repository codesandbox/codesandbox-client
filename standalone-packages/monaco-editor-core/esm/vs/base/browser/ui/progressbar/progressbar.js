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
import './progressbar.css';
import { TPromise } from '../../../common/winjs.base';
import * as assert from '../../../common/assert';
import { $ } from '../../builder';
import * as DOM from '../../dom';
import { Disposable } from '../../../common/lifecycle';
import { Color } from '../../../common/color';
import { mixin } from '../../../common/objects';
var css_done = 'done';
var css_active = 'active';
var css_infinite = 'infinite';
var css_discrete = 'discrete';
var css_progress_container = 'monaco-progress-container';
var css_progress_bit = 'progress-bit';
var defaultOpts = {
    progressBarBackground: Color.fromHex('#0E70C0')
};
/**
 * A progress bar with support for infinite or discrete progress.
 */
var ProgressBar = /** @class */ (function (_super) {
    __extends(ProgressBar, _super);
    function ProgressBar(container, options) {
        var _this = _super.call(this) || this;
        _this.options = options || Object.create(null);
        mixin(_this.options, defaultOpts, false);
        _this.workedVal = 0;
        _this.progressBarBackground = _this.options.progressBarBackground;
        _this.create(container);
        return _this;
    }
    ProgressBar.prototype.create = function (container) {
        var _this = this;
        $(container).div({ 'class': css_progress_container }, function (builder) {
            _this.element = builder.clone();
            builder.div({ 'class': css_progress_bit }).on([DOM.EventType.ANIMATION_START, DOM.EventType.ANIMATION_END, DOM.EventType.ANIMATION_ITERATION], function (e) {
                switch (e.type) {
                    case DOM.EventType.ANIMATION_ITERATION:
                        if (_this.animationStopToken) {
                            _this.animationStopToken(null);
                        }
                        break;
                }
            }, _this.toDispose);
            _this.bit = builder.getHTMLElement();
        });
        this.applyStyles();
    };
    ProgressBar.prototype.off = function () {
        this.bit.style.width = 'inherit';
        this.bit.style.opacity = '1';
        this.element.removeClass(css_active);
        this.element.removeClass(css_infinite);
        this.element.removeClass(css_discrete);
        this.workedVal = 0;
        this.totalWork = undefined;
    };
    /**
     * Indicates to the progress bar that all work is done.
     */
    ProgressBar.prototype.done = function () {
        return this.doDone(true);
    };
    /**
     * Stops the progressbar from showing any progress instantly without fading out.
     */
    ProgressBar.prototype.stop = function () {
        return this.doDone(false);
    };
    ProgressBar.prototype.doDone = function (delayed) {
        var _this = this;
        this.element.addClass(css_done);
        // let it grow to 100% width and hide afterwards
        if (!this.element.hasClass(css_infinite)) {
            this.bit.style.width = 'inherit';
            if (delayed) {
                TPromise.timeout(200).then(function () { return _this.off(); });
            }
            else {
                this.off();
            }
        }
        // let it fade out and hide afterwards
        else {
            this.bit.style.opacity = '0';
            if (delayed) {
                TPromise.timeout(200).then(function () { return _this.off(); });
            }
            else {
                this.off();
            }
        }
        return this;
    };
    /**
     * Use this mode to indicate progress that has no total number of work units.
     */
    ProgressBar.prototype.infinite = function () {
        this.bit.style.width = '2%';
        this.bit.style.opacity = '1';
        this.element.removeClass(css_discrete);
        this.element.removeClass(css_done);
        this.element.addClass(css_active);
        this.element.addClass(css_infinite);
        return this;
    };
    /**
     * Tells the progress bar the total number of work. Use in combination with workedVal() to let
     * the progress bar show the actual progress based on the work that is done.
     */
    ProgressBar.prototype.total = function (value) {
        this.workedVal = 0;
        this.totalWork = value;
        return this;
    };
    /**
     * Finds out if this progress bar is configured with total work
     */
    ProgressBar.prototype.hasTotal = function () {
        return !isNaN(this.totalWork);
    };
    /**
     * Tells the progress bar that an increment of work has been completed.
     */
    ProgressBar.prototype.worked = function (value) {
        value = Number(value);
        assert.ok(!isNaN(value), 'Value is not a number');
        value = Math.max(1, value);
        return this.doSetWorked(this.workedVal + value);
    };
    /**
     * Tells the progress bar the total amount of work that has been completed.
     */
    ProgressBar.prototype.setWorked = function (value) {
        value = Number(value);
        assert.ok(!isNaN(value), 'Value is not a number');
        value = Math.max(1, value);
        return this.doSetWorked(value);
    };
    ProgressBar.prototype.doSetWorked = function (value) {
        assert.ok(!isNaN(this.totalWork), 'Total work not set');
        this.workedVal = value;
        this.workedVal = Math.min(this.totalWork, this.workedVal);
        if (this.element.hasClass(css_infinite)) {
            this.element.removeClass(css_infinite);
        }
        if (this.element.hasClass(css_done)) {
            this.element.removeClass(css_done);
        }
        if (!this.element.hasClass(css_active)) {
            this.element.addClass(css_active);
        }
        if (!this.element.hasClass(css_discrete)) {
            this.element.addClass(css_discrete);
        }
        this.bit.style.width = 100 * (this.workedVal / this.totalWork) + '%';
        return this;
    };
    ProgressBar.prototype.getContainer = function () {
        return this.element.getHTMLElement();
    };
    ProgressBar.prototype.show = function (delay) {
        if (typeof delay === 'number') {
            this.element.showDelayed(delay);
        }
        else {
            this.element.show();
        }
    };
    ProgressBar.prototype.hide = function () {
        this.element.hide();
    };
    ProgressBar.prototype.style = function (styles) {
        this.progressBarBackground = styles.progressBarBackground;
        this.applyStyles();
    };
    ProgressBar.prototype.applyStyles = function () {
        if (this.bit) {
            var background = this.progressBarBackground ? this.progressBarBackground.toString() : null;
            this.bit.style.backgroundColor = background;
        }
    };
    return ProgressBar;
}(Disposable));
export { ProgressBar };
