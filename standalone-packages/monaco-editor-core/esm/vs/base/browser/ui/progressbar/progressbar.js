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
import './progressbar.css';
import * as assert from '../../../common/assert';
import { Disposable } from '../../../common/lifecycle';
import { Color } from '../../../common/color';
import { mixin } from '../../../common/objects';
import { removeClasses, addClass, hasClass, addClasses, removeClass, hide, show } from '../../dom';
import { RunOnceScheduler } from '../../../common/async';
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
        _this._register(_this.showDelayedScheduler = new RunOnceScheduler(function () { return show(_this.element); }, 0));
        _this.create(container);
        return _this;
    }
    ProgressBar.prototype.create = function (container) {
        this.element = document.createElement('div');
        addClass(this.element, css_progress_container);
        container.appendChild(this.element);
        this.bit = document.createElement('div');
        addClass(this.bit, css_progress_bit);
        this.element.appendChild(this.bit);
        this.applyStyles();
    };
    ProgressBar.prototype.off = function () {
        this.bit.style.width = 'inherit';
        this.bit.style.opacity = '1';
        removeClasses(this.element, css_active, css_infinite, css_discrete);
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
        addClass(this.element, css_done);
        // let it grow to 100% width and hide afterwards
        if (!hasClass(this.element, css_infinite)) {
            this.bit.style.width = 'inherit';
            if (delayed) {
                setTimeout(function () { return _this.off(); }, 200);
            }
            else {
                this.off();
            }
        }
        // let it fade out and hide afterwards
        else {
            this.bit.style.opacity = '0';
            if (delayed) {
                setTimeout(function () { return _this.off(); }, 200);
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
        removeClasses(this.element, css_discrete, css_done);
        addClasses(this.element, css_active, css_infinite);
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
        if (hasClass(this.element, css_infinite)) {
            removeClass(this.element, css_infinite);
        }
        if (hasClass(this.element, css_done)) {
            removeClass(this.element, css_done);
        }
        if (!hasClass(this.element, css_active)) {
            addClass(this.element, css_active);
        }
        if (!hasClass(this.element, css_discrete)) {
            addClass(this.element, css_discrete);
        }
        this.bit.style.width = 100 * (this.workedVal / this.totalWork) + '%';
        return this;
    };
    ProgressBar.prototype.getContainer = function () {
        return this.element;
    };
    ProgressBar.prototype.show = function (delay) {
        this.showDelayedScheduler.cancel();
        if (typeof delay === 'number') {
            this.showDelayedScheduler.schedule(delay);
        }
        else {
            show(this.element);
        }
    };
    ProgressBar.prototype.hide = function () {
        hide(this.element);
        this.showDelayedScheduler.cancel();
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
