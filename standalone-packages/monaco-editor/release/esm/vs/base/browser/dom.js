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
import * as platform from '../common/platform.js';
import { TPromise } from '../common/winjs.base.js';
import { TimeoutTimer } from '../common/async.js';
import { onUnexpectedError } from '../common/errors.js';
import { Disposable, dispose } from '../common/lifecycle.js';
import * as browser from './browser.js';
import { StandardKeyboardEvent } from './keyboardEvent.js';
import { StandardMouseEvent } from './mouseEvent.js';
import { Emitter } from '../common/event.js';
import { domEvent } from './event.js';
export function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
export function isInDOM(node) {
    while (node) {
        if (node === document.body) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
var _manualClassList = new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype._findClassName = function (node, className) {
        var classes = node.className;
        if (!classes) {
            this._lastStart = -1;
            return;
        }
        className = className.trim();
        var classesLen = classes.length, classLen = className.length;
        if (classLen === 0) {
            this._lastStart = -1;
            return;
        }
        if (classesLen < classLen) {
            this._lastStart = -1;
            return;
        }
        if (classes === className) {
            this._lastStart = 0;
            this._lastEnd = classesLen;
            return;
        }
        var idx = -1, idxEnd;
        while ((idx = classes.indexOf(className, idx + 1)) >= 0) {
            idxEnd = idx + classLen;
            // a class that is followed by another class
            if ((idx === 0 || classes.charCodeAt(idx - 1) === 32 /* Space */) && classes.charCodeAt(idxEnd) === 32 /* Space */) {
                this._lastStart = idx;
                this._lastEnd = idxEnd + 1;
                return;
            }
            // last class
            if (idx > 0 && classes.charCodeAt(idx - 1) === 32 /* Space */ && idxEnd === classesLen) {
                this._lastStart = idx - 1;
                this._lastEnd = idxEnd;
                return;
            }
            // equal - duplicate of cmp above
            if (idx === 0 && idxEnd === classesLen) {
                this._lastStart = 0;
                this._lastEnd = idxEnd;
                return;
            }
        }
        this._lastStart = -1;
    };
    class_1.prototype.hasClass = function (node, className) {
        this._findClassName(node, className);
        return this._lastStart !== -1;
    };
    class_1.prototype.addClasses = function (node) {
        var _this = this;
        var classNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classNames[_i - 1] = arguments[_i];
        }
        classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.addClass(node, name); }); });
    };
    class_1.prototype.addClass = function (node, className) {
        if (!node.className) { // doesn't have it for sure
            node.className = className;
        }
        else {
            this._findClassName(node, className); // see if it's already there
            if (this._lastStart === -1) {
                node.className = node.className + ' ' + className;
            }
        }
    };
    class_1.prototype.removeClass = function (node, className) {
        this._findClassName(node, className);
        if (this._lastStart === -1) {
            return; // Prevent styles invalidation if not necessary
        }
        else {
            node.className = node.className.substring(0, this._lastStart) + node.className.substring(this._lastEnd);
        }
    };
    class_1.prototype.removeClasses = function (node) {
        var _this = this;
        var classNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classNames[_i - 1] = arguments[_i];
        }
        classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.removeClass(node, name); }); });
    };
    class_1.prototype.toggleClass = function (node, className, shouldHaveIt) {
        this._findClassName(node, className);
        if (this._lastStart !== -1 && (shouldHaveIt === void 0 || !shouldHaveIt)) {
            this.removeClass(node, className);
        }
        if (this._lastStart === -1 && (shouldHaveIt === void 0 || shouldHaveIt)) {
            this.addClass(node, className);
        }
    };
    return class_1;
}());
var _nativeClassList = new /** @class */ (function () {
    function class_2() {
    }
    class_2.prototype.hasClass = function (node, className) {
        return className && node.classList && node.classList.contains(className);
    };
    class_2.prototype.addClasses = function (node) {
        var _this = this;
        var classNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classNames[_i - 1] = arguments[_i];
        }
        classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.addClass(node, name); }); });
    };
    class_2.prototype.addClass = function (node, className) {
        if (className && node.classList) {
            node.classList.add(className);
        }
    };
    class_2.prototype.removeClass = function (node, className) {
        if (className && node.classList) {
            node.classList.remove(className);
        }
    };
    class_2.prototype.removeClasses = function (node) {
        var _this = this;
        var classNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classNames[_i - 1] = arguments[_i];
        }
        classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.removeClass(node, name); }); });
    };
    class_2.prototype.toggleClass = function (node, className, shouldHaveIt) {
        if (node.classList) {
            node.classList.toggle(className, shouldHaveIt);
        }
    };
    return class_2;
}());
// In IE11 there is only partial support for `classList` which makes us keep our
// custom implementation. Otherwise use the native implementation, see: http://caniuse.com/#search=classlist
var _classList = browser.isIE ? _manualClassList : _nativeClassList;
export var hasClass = _classList.hasClass.bind(_classList);
export var addClass = _classList.addClass.bind(_classList);
export var addClasses = _classList.addClasses.bind(_classList);
export var removeClass = _classList.removeClass.bind(_classList);
export var removeClasses = _classList.removeClasses.bind(_classList);
export var toggleClass = _classList.toggleClass.bind(_classList);
var DomListener = /** @class */ (function () {
    function DomListener(node, type, handler, useCapture) {
        this._node = node;
        this._type = type;
        this._handler = handler;
        this._useCapture = (useCapture || false);
        this._node.addEventListener(this._type, this._handler, this._useCapture);
    }
    DomListener.prototype.dispose = function () {
        if (!this._handler) {
            // Already disposed
            return;
        }
        this._node.removeEventListener(this._type, this._handler, this._useCapture);
        // Prevent leakers from holding on to the dom or handler func
        this._node = null;
        this._handler = null;
    };
    return DomListener;
}());
export function addDisposableListener(node, type, handler, useCapture) {
    return new DomListener(node, type, handler, useCapture);
}
function _wrapAsStandardMouseEvent(handler) {
    return function (e) {
        return handler(new StandardMouseEvent(e));
    };
}
function _wrapAsStandardKeyboardEvent(handler) {
    return function (e) {
        return handler(new StandardKeyboardEvent(e));
    };
}
export var addStandardDisposableListener = function addStandardDisposableListener(node, type, handler, useCapture) {
    var wrapHandler = handler;
    if (type === 'click' || type === 'mousedown') {
        wrapHandler = _wrapAsStandardMouseEvent(handler);
    }
    else if (type === 'keydown' || type === 'keypress' || type === 'keyup') {
        wrapHandler = _wrapAsStandardKeyboardEvent(handler);
    }
    return addDisposableListener(node, type, wrapHandler, useCapture);
};
export function addDisposableNonBubblingMouseOutListener(node, handler) {
    return addDisposableListener(node, 'mouseout', function (e) {
        // Mouse out bubbles, so this is an attempt to ignore faux mouse outs coming from children elements
        var toElement = (e.relatedTarget || e.toElement);
        while (toElement && toElement !== node) {
            toElement = toElement.parentNode;
        }
        if (toElement === node) {
            return;
        }
        handler(e);
    });
}
var _animationFrame = null;
function doRequestAnimationFrame(callback) {
    if (!_animationFrame) {
        var emulatedRequestAnimationFrame = function (callback) {
            return setTimeout(function () { return callback(new Date().getTime()); }, 0);
        };
        _animationFrame = (self.requestAnimationFrame
            || self.msRequestAnimationFrame
            || self.webkitRequestAnimationFrame
            || self.mozRequestAnimationFrame
            || self.oRequestAnimationFrame
            || emulatedRequestAnimationFrame);
    }
    return _animationFrame.call(self, callback);
}
/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed immediately.
 * @return token that can be used to cancel the scheduled runner (only if `runner` was not executed immediately).
 */
export var runAtThisOrScheduleAtNextAnimationFrame;
/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed at the next animation frame.
 * @return token that can be used to cancel the scheduled runner.
 */
export var scheduleAtNextAnimationFrame;
var AnimationFrameQueueItem = /** @class */ (function () {
    function AnimationFrameQueueItem(runner, priority) {
        this._runner = runner;
        this.priority = priority;
        this._canceled = false;
    }
    AnimationFrameQueueItem.prototype.dispose = function () {
        this._canceled = true;
    };
    AnimationFrameQueueItem.prototype.execute = function () {
        if (this._canceled) {
            return;
        }
        try {
            this._runner();
        }
        catch (e) {
            onUnexpectedError(e);
        }
    };
    // Sort by priority (largest to lowest)
    AnimationFrameQueueItem.sort = function (a, b) {
        return b.priority - a.priority;
    };
    return AnimationFrameQueueItem;
}());
(function () {
    /**
     * The runners scheduled at the next animation frame
     */
    var NEXT_QUEUE = [];
    /**
     * The runners scheduled at the current animation frame
     */
    var CURRENT_QUEUE = null;
    /**
     * A flag to keep track if the native requestAnimationFrame was already called
     */
    var animFrameRequested = false;
    /**
     * A flag to indicate if currently handling a native requestAnimationFrame callback
     */
    var inAnimationFrameRunner = false;
    var animationFrameRunner = function () {
        animFrameRequested = false;
        CURRENT_QUEUE = NEXT_QUEUE;
        NEXT_QUEUE = [];
        inAnimationFrameRunner = true;
        while (CURRENT_QUEUE.length > 0) {
            CURRENT_QUEUE.sort(AnimationFrameQueueItem.sort);
            var top_1 = CURRENT_QUEUE.shift();
            top_1.execute();
        }
        inAnimationFrameRunner = false;
    };
    scheduleAtNextAnimationFrame = function (runner, priority) {
        if (priority === void 0) { priority = 0; }
        var item = new AnimationFrameQueueItem(runner, priority);
        NEXT_QUEUE.push(item);
        if (!animFrameRequested) {
            animFrameRequested = true;
            doRequestAnimationFrame(animationFrameRunner);
        }
        return item;
    };
    runAtThisOrScheduleAtNextAnimationFrame = function (runner, priority) {
        if (inAnimationFrameRunner) {
            var item = new AnimationFrameQueueItem(runner, priority);
            CURRENT_QUEUE.push(item);
            return item;
        }
        else {
            return scheduleAtNextAnimationFrame(runner, priority);
        }
    };
})();
var MINIMUM_TIME_MS = 16;
var DEFAULT_EVENT_MERGER = function (lastEvent, currentEvent) {
    return currentEvent;
};
var TimeoutThrottledDomListener = /** @class */ (function (_super) {
    __extends(TimeoutThrottledDomListener, _super);
    function TimeoutThrottledDomListener(node, type, handler, eventMerger, minimumTimeMs) {
        if (eventMerger === void 0) { eventMerger = DEFAULT_EVENT_MERGER; }
        if (minimumTimeMs === void 0) { minimumTimeMs = MINIMUM_TIME_MS; }
        var _this = _super.call(this) || this;
        var lastEvent = null;
        var lastHandlerTime = 0;
        var timeout = _this._register(new TimeoutTimer());
        var invokeHandler = function () {
            lastHandlerTime = (new Date()).getTime();
            handler(lastEvent);
            lastEvent = null;
        };
        _this._register(addDisposableListener(node, type, function (e) {
            lastEvent = eventMerger(lastEvent, e);
            var elapsedTime = (new Date()).getTime() - lastHandlerTime;
            if (elapsedTime >= minimumTimeMs) {
                timeout.cancel();
                invokeHandler();
            }
            else {
                timeout.setIfNotSet(invokeHandler, minimumTimeMs - elapsedTime);
            }
        }));
        return _this;
    }
    return TimeoutThrottledDomListener;
}(Disposable));
export function addDisposableThrottledListener(node, type, handler, eventMerger, minimumTimeMs) {
    return new TimeoutThrottledDomListener(node, type, handler, eventMerger, minimumTimeMs);
}
export function getComputedStyle(el) {
    return document.defaultView.getComputedStyle(el, null);
}
// Adapted from WinJS
// Converts a CSS positioning string for the specified element to pixels.
var convertToPixels = (function () {
    return function (element, value) {
        return parseFloat(value) || 0;
    };
})();
function getDimension(element, cssPropertyName, jsPropertyName) {
    var computedStyle = getComputedStyle(element);
    var value = '0';
    if (computedStyle) {
        if (computedStyle.getPropertyValue) {
            value = computedStyle.getPropertyValue(cssPropertyName);
        }
        else {
            // IE8
            value = computedStyle.getAttribute(jsPropertyName);
        }
    }
    return convertToPixels(element, value);
}
export function getClientArea(element) {
    // Try with DOM clientWidth / clientHeight
    if (element !== document.body) {
        return new Dimension(element.clientWidth, element.clientHeight);
    }
    // Try innerWidth / innerHeight
    if (window.innerWidth && window.innerHeight) {
        return new Dimension(window.innerWidth, window.innerHeight);
    }
    // Try with document.body.clientWidth / document.body.clientHeigh
    if (document.body && document.body.clientWidth && document.body.clientWidth) {
        return new Dimension(document.body.clientWidth, document.body.clientHeight);
    }
    // Try with document.documentElement.clientWidth / document.documentElement.clientHeight
    if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight) {
        return new Dimension(document.documentElement.clientWidth, document.documentElement.clientHeight);
    }
    throw new Error('Unable to figure out browser width and height');
}
var sizeUtils = {
    getBorderLeftWidth: function (element) {
        return getDimension(element, 'border-left-width', 'borderLeftWidth');
    },
    getBorderRightWidth: function (element) {
        return getDimension(element, 'border-right-width', 'borderRightWidth');
    },
    getBorderTopWidth: function (element) {
        return getDimension(element, 'border-top-width', 'borderTopWidth');
    },
    getBorderBottomWidth: function (element) {
        return getDimension(element, 'border-bottom-width', 'borderBottomWidth');
    },
    getPaddingLeft: function (element) {
        return getDimension(element, 'padding-left', 'paddingLeft');
    },
    getPaddingRight: function (element) {
        return getDimension(element, 'padding-right', 'paddingRight');
    },
    getPaddingTop: function (element) {
        return getDimension(element, 'padding-top', 'paddingTop');
    },
    getPaddingBottom: function (element) {
        return getDimension(element, 'padding-bottom', 'paddingBottom');
    },
    getMarginLeft: function (element) {
        return getDimension(element, 'margin-left', 'marginLeft');
    },
    getMarginTop: function (element) {
        return getDimension(element, 'margin-top', 'marginTop');
    },
    getMarginRight: function (element) {
        return getDimension(element, 'margin-right', 'marginRight');
    },
    getMarginBottom: function (element) {
        return getDimension(element, 'margin-bottom', 'marginBottom');
    },
    __commaSentinel: false
};
// ----------------------------------------------------------------------------------------
// Position & Dimension
var Dimension = /** @class */ (function () {
    function Dimension(width, height) {
        this.width = width;
        this.height = height;
    }
    return Dimension;
}());
export { Dimension };
export function getTopLeftOffset(element) {
    // Adapted from WinJS.Utilities.getPosition
    // and added borders to the mix
    var offsetParent = element.offsetParent, top = element.offsetTop, left = element.offsetLeft;
    while ((element = element.parentNode) !== null && element !== document.body && element !== document.documentElement) {
        top -= element.scrollTop;
        var c = getComputedStyle(element);
        if (c) {
            left -= c.direction !== 'rtl' ? element.scrollLeft : -element.scrollLeft;
        }
        if (element === offsetParent) {
            left += sizeUtils.getBorderLeftWidth(element);
            top += sizeUtils.getBorderTopWidth(element);
            top += element.offsetTop;
            left += element.offsetLeft;
            offsetParent = element.offsetParent;
        }
    }
    return {
        left: left,
        top: top
    };
}
export function size(element, width, height) {
    if (typeof width === 'number') {
        element.style.width = width + "px";
    }
    if (typeof height === 'number') {
        element.style.height = height + "px";
    }
}
export function position(element, top, right, bottom, left, position) {
    if (position === void 0) { position = 'absolute'; }
    if (typeof top === 'number') {
        element.style.top = top + "px";
    }
    if (typeof right === 'number') {
        element.style.right = right + "px";
    }
    if (typeof bottom === 'number') {
        element.style.bottom = bottom + "px";
    }
    if (typeof left === 'number') {
        element.style.left = left + "px";
    }
    element.style.position = position;
}
/**
 * Returns the position of a dom node relative to the entire page.
 */
export function getDomNodePagePosition(domNode) {
    var bb = domNode.getBoundingClientRect();
    return {
        left: bb.left + StandardWindow.scrollX,
        top: bb.top + StandardWindow.scrollY,
        width: bb.width,
        height: bb.height
    };
}
export var StandardWindow = new /** @class */ (function () {
    function class_3() {
    }
    Object.defineProperty(class_3.prototype, "scrollX", {
        get: function () {
            if (typeof window.scrollX === 'number') {
                // modern browsers
                return window.scrollX;
            }
            else {
                return document.body.scrollLeft + document.documentElement.scrollLeft;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_3.prototype, "scrollY", {
        get: function () {
            if (typeof window.scrollY === 'number') {
                // modern browsers
                return window.scrollY;
            }
            else {
                return document.body.scrollTop + document.documentElement.scrollTop;
            }
        },
        enumerable: true,
        configurable: true
    });
    return class_3;
}());
// Adapted from WinJS
// Gets the width of the element, including margins.
export function getTotalWidth(element) {
    var margin = sizeUtils.getMarginLeft(element) + sizeUtils.getMarginRight(element);
    return element.offsetWidth + margin;
}
export function getContentWidth(element) {
    var border = sizeUtils.getBorderLeftWidth(element) + sizeUtils.getBorderRightWidth(element);
    var padding = sizeUtils.getPaddingLeft(element) + sizeUtils.getPaddingRight(element);
    return element.offsetWidth - border - padding;
}
export function getTotalScrollWidth(element) {
    var margin = sizeUtils.getMarginLeft(element) + sizeUtils.getMarginRight(element);
    return element.scrollWidth + margin;
}
// Adapted from WinJS
// Gets the height of the content of the specified element. The content height does not include borders or padding.
export function getContentHeight(element) {
    var border = sizeUtils.getBorderTopWidth(element) + sizeUtils.getBorderBottomWidth(element);
    var padding = sizeUtils.getPaddingTop(element) + sizeUtils.getPaddingBottom(element);
    return element.offsetHeight - border - padding;
}
// Adapted from WinJS
// Gets the height of the element, including its margins.
export function getTotalHeight(element) {
    var margin = sizeUtils.getMarginTop(element) + sizeUtils.getMarginBottom(element);
    return element.offsetHeight + margin;
}
// Gets the left coordinate of the specified element relative to the specified parent.
function getRelativeLeft(element, parent) {
    if (element === null) {
        return 0;
    }
    var elementPosition = getTopLeftOffset(element);
    var parentPosition = getTopLeftOffset(parent);
    return elementPosition.left - parentPosition.left;
}
export function getLargestChildWidth(parent, children) {
    var childWidths = children.map(function (child) {
        return Math.max(getTotalScrollWidth(child), getTotalWidth(child)) + getRelativeLeft(child, parent) || 0;
    });
    var maxWidth = Math.max.apply(Math, childWidths);
    return maxWidth;
}
// ----------------------------------------------------------------------------------------
export function isAncestor(testChild, testAncestor) {
    while (testChild) {
        if (testChild === testAncestor) {
            return true;
        }
        testChild = testChild.parentNode;
    }
    return false;
}
export function findParentWithClass(node, clazz, stopAtClazzOrNode) {
    while (node) {
        if (hasClass(node, clazz)) {
            return node;
        }
        if (stopAtClazzOrNode) {
            if (typeof stopAtClazzOrNode === 'string') {
                if (hasClass(node, stopAtClazzOrNode)) {
                    return null;
                }
            }
            else {
                if (node === stopAtClazzOrNode) {
                    return null;
                }
            }
        }
        node = node.parentNode;
    }
    return null;
}
export function createStyleSheet(container) {
    if (container === void 0) { container = document.getElementsByTagName('head')[0]; }
    var style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'screen';
    container.appendChild(style);
    return style;
}
var _sharedStyleSheet = null;
function getSharedStyleSheet() {
    if (!_sharedStyleSheet) {
        _sharedStyleSheet = createStyleSheet();
    }
    return _sharedStyleSheet;
}
function getDynamicStyleSheetRules(style) {
    if (style && style.sheet && style.sheet.rules) {
        // Chrome, IE
        return style.sheet.rules;
    }
    if (style && style.sheet && style.sheet.cssRules) {
        // FF
        return style.sheet.cssRules;
    }
    return [];
}
export function createCSSRule(selector, cssText, style) {
    if (style === void 0) { style = getSharedStyleSheet(); }
    if (!style || !cssText) {
        return;
    }
    style.sheet.insertRule(selector + '{' + cssText + '}', 0);
}
export function removeCSSRulesContainingSelector(ruleName, style) {
    if (style === void 0) { style = getSharedStyleSheet(); }
    if (!style) {
        return;
    }
    var rules = getDynamicStyleSheetRules(style);
    var toDelete = [];
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.selectorText.indexOf(ruleName) !== -1) {
            toDelete.push(i);
        }
    }
    for (var i = toDelete.length - 1; i >= 0; i--) {
        style.sheet.deleteRule(toDelete[i]);
    }
}
export function isHTMLElement(o) {
    if (typeof HTMLElement === 'object') {
        return o instanceof HTMLElement;
    }
    return o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string';
}
export var EventType = {
    // Mouse
    CLICK: 'click',
    AUXCLICK: 'auxclick',
    DBLCLICK: 'dblclick',
    MOUSE_UP: 'mouseup',
    MOUSE_DOWN: 'mousedown',
    MOUSE_OVER: 'mouseover',
    MOUSE_MOVE: 'mousemove',
    MOUSE_OUT: 'mouseout',
    MOUSE_ENTER: 'mouseenter',
    MOUSE_LEAVE: 'mouseleave',
    CONTEXT_MENU: 'contextmenu',
    WHEEL: 'wheel',
    // Keyboard
    KEY_DOWN: 'keydown',
    KEY_PRESS: 'keypress',
    KEY_UP: 'keyup',
    // HTML Document
    LOAD: 'load',
    UNLOAD: 'unload',
    ABORT: 'abort',
    ERROR: 'error',
    RESIZE: 'resize',
    SCROLL: 'scroll',
    // Form
    SELECT: 'select',
    CHANGE: 'change',
    SUBMIT: 'submit',
    RESET: 'reset',
    FOCUS: 'focus',
    BLUR: 'blur',
    INPUT: 'input',
    // Local Storage
    STORAGE: 'storage',
    // Drag
    DRAG_START: 'dragstart',
    DRAG: 'drag',
    DRAG_ENTER: 'dragenter',
    DRAG_LEAVE: 'dragleave',
    DRAG_OVER: 'dragover',
    DROP: 'drop',
    DRAG_END: 'dragend',
    // Animation
    ANIMATION_START: browser.isWebKit ? 'webkitAnimationStart' : 'animationstart',
    ANIMATION_END: browser.isWebKit ? 'webkitAnimationEnd' : 'animationend',
    ANIMATION_ITERATION: browser.isWebKit ? 'webkitAnimationIteration' : 'animationiteration'
};
export var EventHelper = {
    stop: function (e, cancelBubble) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        else {
            // IE8
            e.returnValue = false;
        }
        if (cancelBubble) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                // IE8
                e.cancelBubble = true;
            }
        }
    }
};
export function saveParentsScrollTop(node) {
    var r = [];
    for (var i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
        r[i] = node.scrollTop;
        node = node.parentNode;
    }
    return r;
}
export function restoreParentsScrollTop(node, state) {
    for (var i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
        if (node.scrollTop !== state[i]) {
            node.scrollTop = state[i];
        }
        node = node.parentNode;
    }
}
var FocusTracker = /** @class */ (function () {
    function FocusTracker(element) {
        var _this = this;
        this._onDidFocus = new Emitter();
        this.onDidFocus = this._onDidFocus.event;
        this._onDidBlur = new Emitter();
        this.onDidBlur = this._onDidBlur.event;
        this.disposables = [];
        var hasFocus = false;
        var loosingFocus = false;
        var onFocus = function () {
            loosingFocus = false;
            if (!hasFocus) {
                hasFocus = true;
                _this._onDidFocus.fire();
            }
        };
        var onBlur = function () {
            if (hasFocus) {
                loosingFocus = true;
                window.setTimeout(function () {
                    if (loosingFocus) {
                        loosingFocus = false;
                        hasFocus = false;
                        _this._onDidBlur.fire();
                    }
                }, 0);
            }
        };
        domEvent(element, EventType.FOCUS, true)(onFocus, null, this.disposables);
        domEvent(element, EventType.BLUR, true)(onBlur, null, this.disposables);
    }
    FocusTracker.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
        this._onDidFocus.dispose();
        this._onDidBlur.dispose();
    };
    return FocusTracker;
}());
export function trackFocus(element) {
    return new FocusTracker(element);
}
export function append(parent) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    children.forEach(function (child) { return parent.appendChild(child); });
    return children[children.length - 1];
}
export function prepend(parent, child) {
    parent.insertBefore(child, parent.firstChild);
    return child;
}
var SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
// Similar to builder, but much more lightweight
export function $(description, attrs) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var match = SELECTOR_REGEX.exec(description);
    if (!match) {
        throw new Error('Bad use of emmet');
    }
    var result = document.createElement(match[1] || 'div');
    if (match[3]) {
        result.id = match[3];
    }
    if (match[4]) {
        result.className = match[4].replace(/\./g, ' ').trim();
    }
    Object.keys(attrs || {}).forEach(function (name) {
        if (/^on\w+$/.test(name)) {
            result[name] = attrs[name];
        }
        else if (name === 'selected') {
            var value = attrs[name];
            if (value) {
                result.setAttribute(name, 'true');
            }
        }
        else {
            result.setAttribute(name, attrs[name]);
        }
    });
    children
        .filter(function (child) { return !!child; })
        .forEach(function (child) {
        if (child instanceof Node) {
            result.appendChild(child);
        }
        else {
            result.appendChild(document.createTextNode(child));
        }
    });
    return result;
}
export function join(nodes, separator) {
    var result = [];
    nodes.forEach(function (node, index) {
        if (index > 0) {
            if (separator instanceof Node) {
                result.push(separator.cloneNode());
            }
            else {
                result.push(document.createTextNode(separator));
            }
        }
        result.push(node);
    });
    return result;
}
export function show() {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
        var element = elements_1[_a];
        element.style.display = '';
        element.removeAttribute('aria-hidden');
    }
}
export function hide() {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    for (var _a = 0, elements_2 = elements; _a < elements_2.length; _a++) {
        var element = elements_2[_a];
        element.style.display = 'none';
        element.setAttribute('aria-hidden', 'true');
    }
}
function findParentWithAttribute(node, attribute) {
    while (node) {
        if (node instanceof HTMLElement && node.hasAttribute(attribute)) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}
export function removeTabIndexAndUpdateFocus(node) {
    if (!node || !node.hasAttribute('tabIndex')) {
        return;
    }
    // If we are the currently focused element and tabIndex is removed,
    // standard DOM behavior is to move focus to the <body> element. We
    // typically never want that, rather put focus to the closest element
    // in the hierarchy of the parent DOM nodes.
    if (document.activeElement === node) {
        var parentFocusable = findParentWithAttribute(node.parentElement, 'tabIndex');
        if (parentFocusable) {
            parentFocusable.focus();
        }
    }
    node.removeAttribute('tabindex');
}
export function getElementsByTagName(tag) {
    return Array.prototype.slice.call(document.getElementsByTagName(tag), 0);
}
export function finalHandler(fn) {
    return function (e) {
        e.preventDefault();
        e.stopPropagation();
        fn(e);
    };
}
export function domContentLoaded() {
    return new TPromise(function (c, e) {
        var readyState = document.readyState;
        if (readyState === 'complete' || (document && document.body !== null)) {
            platform.setImmediate(c);
        }
        else {
            window.addEventListener('DOMContentLoaded', c, false);
        }
    });
}
/**
 * Find a value usable for a dom node size such that the likelihood that it would be
 * displayed with constant screen pixels size is as high as possible.
 *
 * e.g. We would desire for the cursors to be 2px (CSS px) wide. Under a devicePixelRatio
 * of 1.25, the cursor will be 2.5 screen pixels wide. Depending on how the dom node aligns/"snaps"
 * with the screen pixels, it will sometimes be rendered with 2 screen pixels, and sometimes with 3 screen pixels.
 */
export function computeScreenAwareSize(cssPx) {
    var screenPx = window.devicePixelRatio * cssPx;
    return Math.max(1, Math.floor(screenPx)) / window.devicePixelRatio;
}
/**
 * See https://github.com/Microsoft/monaco-editor/issues/601
 * To protect against malicious code in the linked site, particularly phishing attempts,
 * the window.opener should be set to null to prevent the linked site from having access
 * to change the location of the current page.
 * See https://mathiasbynens.github.io/rel-noopener/
 */
export function windowOpenNoOpener(url) {
    if (platform.isNative || browser.isEdgeWebView) {
        // In VSCode, window.open() always returns null...
        // The same is true for a WebView (see https://github.com/Microsoft/monaco-editor/issues/628)
        window.open(url);
    }
    else {
        var newTab = window.open();
        if (newTab) {
            newTab.opener = null;
            newTab.location.href = url;
        }
    }
}
