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
import './builder.css';
import * as types from '../common/types';
import { dispose, toDisposable } from '../common/lifecycle';
import * as strings from '../common/strings';
import * as assert from '../common/assert';
import * as DOM from './dom';
// --- Implementation starts here
var MS_DATA_KEY = '_msDataKey';
var DATA_BINDING_ID = '__$binding';
var LISTENER_BINDING_ID = '__$listeners';
var VISIBILITY_BINDING_ID = '__$visibility';
function data(element) {
    if (!element[MS_DATA_KEY]) {
        element[MS_DATA_KEY] = {};
    }
    return element[MS_DATA_KEY];
}
function hasData(element) {
    return !!element[MS_DATA_KEY];
}
/**
 *  Wraps around the provided element to manipulate it and add more child elements.
 */
var Builder = /** @class */ (function () {
    function Builder(element, offdom) {
        this.offdom = offdom;
        this.container = element;
        this.currentElement = element;
        this.createdElements = [];
        this.toDispose = {};
        this.captureToDispose = {};
    }
    /**
     *  Returns a new builder that lets the current HTML Element of this builder be the container
     *  for future additions on the builder.
     */
    Builder.prototype.asContainer = function () {
        return withBuilder(this, this.offdom);
    };
    /**
     *  Clones the builder providing the same properties as this one.
     */
    Builder.prototype.clone = function () {
        var builder = new Builder(this.container, this.offdom);
        builder.currentElement = this.currentElement;
        builder.createdElements = this.createdElements;
        builder.captureToDispose = this.captureToDispose;
        builder.toDispose = this.toDispose;
        return builder;
    };
    Builder.prototype.build = function (container, index) {
        assert.ok(this.offdom, 'This builder was not created off-dom, so build() can not be called.');
        // Use builders own container if present
        if (!container) {
            container = this.container;
        }
        // Handle case of passed in Builder
        else if (container instanceof Builder) {
            container = container.getHTMLElement();
        }
        assert.ok(container, 'Builder can only be build() with a container provided.');
        assert.ok(DOM.isHTMLElement(container), 'The container must either be a HTMLElement or a Builder.');
        var htmlContainer = container;
        // Append
        var i, len;
        var childNodes = htmlContainer.childNodes;
        if (types.isNumber(index) && index < childNodes.length) {
            for (i = 0, len = this.createdElements.length; i < len; i++) {
                htmlContainer.insertBefore(this.createdElements[i], childNodes[index++]);
            }
        }
        else {
            for (i = 0, len = this.createdElements.length; i < len; i++) {
                htmlContainer.appendChild(this.createdElements[i]);
            }
        }
        return this;
    };
    Builder.prototype.appendTo = function (container, index) {
        // Use builders own container if present
        if (!container) {
            container = this.container;
        }
        // Handle case of passed in Builder
        else if (container instanceof Builder) {
            container = container.getHTMLElement();
        }
        assert.ok(container, 'Builder can only be build() with a container provided.');
        assert.ok(DOM.isHTMLElement(container), 'The container must either be a HTMLElement or a Builder.');
        var htmlContainer = container;
        // Remove node from parent, if needed
        if (this.currentElement.parentNode) {
            this.currentElement.parentNode.removeChild(this.currentElement);
        }
        var childNodes = htmlContainer.childNodes;
        if (types.isNumber(index) && index < childNodes.length) {
            htmlContainer.insertBefore(this.currentElement, childNodes[index]);
        }
        else {
            htmlContainer.appendChild(this.currentElement);
        }
        return this;
    };
    Builder.prototype.append = function (child, index) {
        assert.ok(child, 'Need a child to append');
        if (DOM.isHTMLElement(child)) {
            child = withElement(child);
        }
        assert.ok(child instanceof Builder || child instanceof MultiBuilder, 'Need a child to append');
        child.appendTo(this, index);
        return this;
    };
    /**
     *  Removes the current element of this builder from its parent node.
     */
    Builder.prototype.offDOM = function () {
        if (this.currentElement.parentNode) {
            this.currentElement.parentNode.removeChild(this.currentElement);
        }
        return this;
    };
    /**
     *  Returns the HTML Element the builder is currently active on.
     */
    Builder.prototype.getHTMLElement = function () {
        return this.currentElement;
    };
    /**
     *  Returns the HTML Element the builder is building in.
     */
    Builder.prototype.getContainer = function () {
        return this.container;
    };
    // HTML Elements
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.div = function (attributes, fn) {
        return this.doElement('div', attributes, fn);
    };
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.p = function (attributes, fn) {
        return this.doElement('p', attributes, fn);
    };
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.ul = function (attributes, fn) {
        return this.doElement('ul', attributes, fn);
    };
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.li = function (attributes, fn) {
        return this.doElement('li', attributes, fn);
    };
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.span = function (attributes, fn) {
        return this.doElement('span', attributes, fn);
    };
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.img = function (attributes, fn) {
        return this.doElement('img', attributes, fn);
    };
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.a = function (attributes, fn) {
        return this.doElement('a', attributes, fn);
    };
    /**
     *  Creates a new element of given tag name as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    Builder.prototype.element = function (name, attributes, fn) {
        return this.doElement(name, attributes, fn);
    };
    Builder.prototype.doElement = function (name, attributesOrFn, fn) {
        // Create Element
        var element = document.createElement(name);
        this.currentElement = element;
        // Off-DOM: Remember in array of created elements
        if (this.offdom) {
            this.createdElements.push(element);
        }
        // Object (apply properties as attributes to HTML element)
        if (types.isObject(attributesOrFn)) {
            this.attr(attributesOrFn);
        }
        // Support second argument being function
        if (types.isFunction(attributesOrFn)) {
            fn = attributesOrFn;
        }
        // Apply Functions (Elements created in Functions will be added as child to current element)
        if (types.isFunction(fn)) {
            var builder = new Builder(element);
            fn.call(builder, builder); // Set both 'this' and the first parameter to the new builder
        }
        // Add to parent
        if (!this.offdom) {
            this.container.appendChild(element);
        }
        return this;
    };
    /**
     *  Calls focus() on the current HTML element;
     */
    Builder.prototype.domFocus = function () {
        this.currentElement.focus();
        return this;
    };
    /**
     *  Calls blur() on the current HTML element;
     */
    Builder.prototype.domBlur = function () {
        this.currentElement.blur();
        return this;
    };
    Builder.prototype.on = function (arg1, fn, listenerToDisposeContainer, useCapture) {
        var _this = this;
        // Event Type Array
        if (types.isArray(arg1)) {
            arg1.forEach(function (type) {
                _this.on(type, fn, listenerToDisposeContainer, useCapture);
            });
        }
        // Single Event Type
        else {
            var type = arg1;
            // Add Listener
            var unbind_1 = DOM.addDisposableListener(this.currentElement, type, function (e) {
                fn(e, _this, unbind_1); // Pass in Builder as Second Argument
            }, useCapture || false);
            // Remember for off() use
            if (useCapture) {
                if (!this.captureToDispose[type]) {
                    this.captureToDispose[type] = [];
                }
                this.captureToDispose[type].push(unbind_1);
            }
            else {
                if (!this.toDispose[type]) {
                    this.toDispose[type] = [];
                }
                this.toDispose[type].push(unbind_1);
            }
            // Bind to Element
            var listenerBinding = this.getProperty(LISTENER_BINDING_ID, []);
            listenerBinding.push(unbind_1);
            this.setProperty(LISTENER_BINDING_ID, listenerBinding);
            // Add to Array if passed in
            if (listenerToDisposeContainer && types.isArray(listenerToDisposeContainer)) {
                listenerToDisposeContainer.push(unbind_1);
            }
        }
        return this;
    };
    Builder.prototype.off = function (arg1, useCapture) {
        var _this = this;
        // Event Type Array
        if (types.isArray(arg1)) {
            arg1.forEach(function (type) {
                _this.off(type);
            });
        }
        // Single Event Type
        else {
            var type = arg1;
            if (useCapture) {
                if (this.captureToDispose[type]) {
                    this.captureToDispose[type] = dispose(this.captureToDispose[type]);
                }
            }
            else {
                if (this.toDispose[type]) {
                    this.toDispose[type] = dispose(this.toDispose[type]);
                }
            }
        }
        return this;
    };
    Builder.prototype.once = function (arg1, fn, listenerToDisposeContainer, useCapture) {
        var _this = this;
        // Event Type Array
        if (types.isArray(arg1)) {
            arg1.forEach(function (type) {
                _this.once(type, fn);
            });
        }
        // Single Event Type
        else {
            var type = arg1;
            // Add Listener
            var unbind_2 = DOM.addDisposableListener(this.currentElement, type, function (e) {
                fn(e, _this, unbind_2); // Pass in Builder as Second Argument
                unbind_2.dispose();
            }, useCapture || false);
            // Add to Array if passed in
            if (listenerToDisposeContainer && types.isArray(listenerToDisposeContainer)) {
                listenerToDisposeContainer.push(unbind_2);
            }
        }
        return this;
    };
    Builder.prototype.attr = function (firstP, secondP) {
        // Apply Object Literal to Attributes of Element
        if (types.isObject(firstP)) {
            for (var prop in firstP) {
                if (firstP.hasOwnProperty(prop)) {
                    var value = firstP[prop];
                    this.doSetAttr(prop, value);
                }
            }
            return this;
        }
        // Get Attribute Value
        if (types.isString(firstP) && !types.isString(secondP)) {
            return this.currentElement.getAttribute(firstP);
        }
        // Set Attribute Value
        if (types.isString(firstP)) {
            if (!types.isString(secondP)) {
                secondP = String(secondP);
            }
            this.doSetAttr(firstP, secondP);
        }
        return this;
    };
    Builder.prototype.doSetAttr = function (prop, value) {
        if (prop === 'class') {
            prop = 'addClass'; // Workaround for the issue that a function name can not be 'class' in ES
        }
        if (this[prop]) {
            if (types.isArray(value)) {
                this[prop].apply(this, value);
            }
            else {
                this[prop].call(this, value);
            }
        }
        else {
            this.currentElement.setAttribute(prop, value);
        }
    };
    /**
     * Removes an attribute by the given name.
     */
    Builder.prototype.removeAttribute = function (prop) {
        this.currentElement.removeAttribute(prop);
    };
    /**
     *  Sets the id attribute to the value provided for the current HTML element of the builder.
     */
    Builder.prototype.id = function (id) {
        this.currentElement.setAttribute('id', id);
        return this;
    };
    /**
     *  Sets the title attribute to the value provided for the current HTML element of the builder.
     */
    Builder.prototype.title = function (title) {
        this.currentElement.setAttribute('title', title);
        return this;
    };
    /**
     *  Sets the type attribute to the value provided for the current HTML element of the builder.
     */
    Builder.prototype.type = function (type) {
        this.currentElement.setAttribute('type', type);
        return this;
    };
    /**
     *  Sets the value attribute to the value provided for the current HTML element of the builder.
     */
    Builder.prototype.value = function (value) {
        this.currentElement.setAttribute('value', value);
        return this;
    };
    /**
     *  Sets the tabindex attribute to the value provided for the current HTML element of the builder.
     */
    Builder.prototype.tabindex = function (index) {
        this.currentElement.setAttribute('tabindex', index.toString());
        return this;
    };
    Builder.prototype.style = function (firstP, secondP) {
        // Apply Object Literal to Styles of Element
        if (types.isObject(firstP)) {
            for (var prop in firstP) {
                if (firstP.hasOwnProperty(prop)) {
                    var value = firstP[prop];
                    this.doSetStyle(prop, value);
                }
            }
            return this;
        }
        var hasFirstP = types.isString(firstP);
        // Get Style Value
        if (hasFirstP && types.isUndefined(secondP)) {
            return this.currentElement.style[this.cssKeyToJavaScriptProperty(firstP)];
        }
        // Set Style Value
        else if (hasFirstP) {
            this.doSetStyle(firstP, secondP);
        }
        return this;
    };
    Builder.prototype.doSetStyle = function (key, value) {
        if (key.indexOf('-') >= 0) {
            var segments = key.split('-');
            key = segments[0];
            for (var i = 1; i < segments.length; i++) {
                var segment = segments[i];
                key = key + segment.charAt(0).toUpperCase() + segment.substr(1);
            }
        }
        this.currentElement.style[this.cssKeyToJavaScriptProperty(key)] = value;
    };
    Builder.prototype.cssKeyToJavaScriptProperty = function (key) {
        // Automagically convert dashes as they are not allowed when programmatically
        // setting a CSS style property
        if (key.indexOf('-') >= 0) {
            var segments = key.split('-');
            key = segments[0];
            for (var i = 1; i < segments.length; i++) {
                var segment = segments[i];
                key = key + segment.charAt(0).toUpperCase() + segment.substr(1);
            }
        }
        // Float is special too
        else if (key === 'float') {
            key = 'cssFloat';
        }
        return key;
    };
    /**
     *  Returns the computed CSS style for the current HTML element of the builder.
     */
    Builder.prototype.getComputedStyle = function () {
        return DOM.getComputedStyle(this.currentElement);
    };
    /**
     *  Adds the variable list of arguments as class names to the current HTML element of the builder.
     */
    Builder.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        classes.forEach(function (nameValue) {
            var names = nameValue.split(' ');
            names.forEach(function (name) {
                DOM.addClass(_this.currentElement, name);
            });
        });
        return this;
    };
    /**
     *  Sets the class name of the current HTML element of the builder to the provided className.
     *  If shouldAddClass is provided - for true class is added, for false class is removed.
     */
    Builder.prototype.setClass = function (className, shouldAddClass) {
        if (shouldAddClass === void 0) { shouldAddClass = null; }
        if (shouldAddClass === null) {
            this.currentElement.className = className;
        }
        else if (shouldAddClass) {
            this.addClass(className);
        }
        else {
            this.removeClass(className);
        }
        return this;
    };
    /**
     *  Returns whether the current HTML element of the builder has the provided class assigned.
     */
    Builder.prototype.hasClass = function (className) {
        return DOM.hasClass(this.currentElement, className);
    };
    /**
     *  Removes the variable list of arguments as class names from the current HTML element of the builder.
     */
    Builder.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        classes.forEach(function (nameValue) {
            var names = nameValue.split(' ');
            names.forEach(function (name) {
                DOM.removeClass(_this.currentElement, name);
            });
        });
        return this;
    };
    /**
     *  Adds or removes the provided className for the current HTML element of the builder.
     */
    Builder.prototype.toggleClass = function (className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        }
        else {
            this.addClass(className);
        }
        return this;
    };
    /**
     *  Sets the CSS property color.
     */
    Builder.prototype.color = function (color) {
        this.currentElement.style.color = color;
        return this;
    };
    Builder.prototype.padding = function (top, right, bottom, left) {
        if (types.isString(top) && top.indexOf(' ') >= 0) {
            return this.padding.apply(this, top.split(' '));
        }
        if (!types.isUndefinedOrNull(top)) {
            this.currentElement.style.paddingTop = this.toPixel(top);
        }
        if (!types.isUndefinedOrNull(right)) {
            this.currentElement.style.paddingRight = this.toPixel(right);
        }
        if (!types.isUndefinedOrNull(bottom)) {
            this.currentElement.style.paddingBottom = this.toPixel(bottom);
        }
        if (!types.isUndefinedOrNull(left)) {
            this.currentElement.style.paddingLeft = this.toPixel(left);
        }
        return this;
    };
    Builder.prototype.margin = function (top, right, bottom, left) {
        if (types.isString(top) && top.indexOf(' ') >= 0) {
            return this.margin.apply(this, top.split(' '));
        }
        if (!types.isUndefinedOrNull(top)) {
            this.currentElement.style.marginTop = this.toPixel(top);
        }
        if (!types.isUndefinedOrNull(right)) {
            this.currentElement.style.marginRight = this.toPixel(right);
        }
        if (!types.isUndefinedOrNull(bottom)) {
            this.currentElement.style.marginBottom = this.toPixel(bottom);
        }
        if (!types.isUndefinedOrNull(left)) {
            this.currentElement.style.marginLeft = this.toPixel(left);
        }
        return this;
    };
    Builder.prototype.position = function (top, right, bottom, left, position) {
        if (types.isString(top) && top.indexOf(' ') >= 0) {
            return this.position.apply(this, top.split(' '));
        }
        if (!types.isUndefinedOrNull(top)) {
            this.currentElement.style.top = this.toPixel(top);
        }
        if (!types.isUndefinedOrNull(right)) {
            this.currentElement.style.right = this.toPixel(right);
        }
        if (!types.isUndefinedOrNull(bottom)) {
            this.currentElement.style.bottom = this.toPixel(bottom);
        }
        if (!types.isUndefinedOrNull(left)) {
            this.currentElement.style.left = this.toPixel(left);
        }
        if (!position) {
            position = 'absolute';
        }
        this.currentElement.style.position = position;
        return this;
    };
    Builder.prototype.size = function (width, height) {
        if (types.isString(width) && width.indexOf(' ') >= 0) {
            return this.size.apply(this, width.split(' '));
        }
        if (!types.isUndefinedOrNull(width)) {
            this.currentElement.style.width = this.toPixel(width);
        }
        if (!types.isUndefinedOrNull(height)) {
            this.currentElement.style.height = this.toPixel(height);
        }
        return this;
    };
    /**
     *  Sets the CSS property display.
     */
    Builder.prototype.display = function (display) {
        this.currentElement.style.display = display;
        return this;
    };
    /**
     *  Shows the current element of the builder.
     */
    Builder.prototype.show = function () {
        if (this.hasClass('monaco-builder-hidden')) {
            this.removeClass('monaco-builder-hidden');
        }
        this.attr('aria-hidden', 'false');
        // Cancel any pending showDelayed() invocation
        this.cancelVisibilityTimeout();
        return this;
    };
    /**
     *  Shows the current builder element after the provided delay. If the builder
     *  was set to hidden using the hide() method before this method executed, the
     *  function will return without showing the current element. This is useful to
     *  only show the element when a specific delay is reached (e.g. for a long running
     *  operation.
     */
    Builder.prototype.showDelayed = function (delay) {
        var _this = this;
        // Cancel any pending showDelayed() invocation
        this.cancelVisibilityTimeout();
        // Install new delay for showing
        var handle = setTimeout(function () {
            _this.removeProperty(VISIBILITY_BINDING_ID);
            _this.show();
        }, delay);
        this.setProperty(VISIBILITY_BINDING_ID, toDisposable(function () { return clearTimeout(handle); }));
        return this;
    };
    /**
     *  Hides the current element of the builder.
     */
    Builder.prototype.hide = function () {
        if (!this.hasClass('monaco-builder-hidden')) {
            this.addClass('monaco-builder-hidden');
        }
        this.attr('aria-hidden', 'true');
        // Cancel any pending showDelayed() invocation
        this.cancelVisibilityTimeout();
        return this;
    };
    /**
     *  Returns true if the current element of the builder is hidden.
     */
    Builder.prototype.isHidden = function () {
        return this.hasClass('monaco-builder-hidden') || this.currentElement.style.display === 'none';
    };
    Builder.prototype.cancelVisibilityTimeout = function () {
        var visibilityDisposable = this.getProperty(VISIBILITY_BINDING_ID);
        if (visibilityDisposable) {
            visibilityDisposable.dispose();
            this.removeProperty(VISIBILITY_BINDING_ID);
        }
    };
    Builder.prototype.toPixel = function (obj) {
        if (obj.toString().indexOf('px') === -1) {
            return obj.toString() + 'px';
        }
        return obj;
    };
    /**
     *  Sets the innerHTML attribute.
     */
    Builder.prototype.innerHtml = function (html, append) {
        if (append) {
            this.currentElement.innerHTML += html;
        }
        else {
            this.currentElement.innerHTML = html;
        }
        return this;
    };
    /**
     *  Sets the textContent property of the element.
     *  All HTML special characters will be escaped.
     */
    Builder.prototype.text = function (text, append) {
        if (append) {
            // children is child Elements versus childNodes includes textNodes
            if (this.currentElement.children.length === 0) {
                this.currentElement.textContent += text;
            }
            else {
                // if there are elements inside this node, append the string as a new text node
                // to avoid wiping out the innerHTML and replacing it with only text content
                this.currentElement.appendChild(document.createTextNode(text));
            }
        }
        else {
            this.currentElement.textContent = text;
        }
        return this;
    };
    /**
     *  Sets the innerHTML attribute in escaped form.
     */
    Builder.prototype.safeInnerHtml = function (html, append) {
        return this.innerHtml(strings.escape(html), append);
    };
    /**
     *  Allows to store arbritary data into the current element.
     */
    Builder.prototype.setProperty = function (key, value) {
        setPropertyOnElement(this.currentElement, key, value);
        return this;
    };
    /**
     *  Allows to get arbritary data from the current element.
     */
    Builder.prototype.getProperty = function (key, fallback) {
        return getPropertyFromElement(this.currentElement, key, fallback);
    };
    /**
     *  Removes a property from the current element that is stored under the given key.
     */
    Builder.prototype.removeProperty = function (key) {
        if (hasData(this.currentElement)) {
            delete data(this.currentElement)[key];
        }
        return this;
    };
    /**
     * Returns a new builder with the child at the given index.
     */
    Builder.prototype.child = function (index) {
        if (index === void 0) { index = 0; }
        var children = this.currentElement.children;
        return withElement(children.item(index));
    };
    /**
     * Recurse through all descendant nodes and remove their data binding.
     */
    Builder.prototype.unbindDescendants = function (current) {
        if (current && current.children) {
            for (var i = 0, length_1 = current.children.length; i < length_1; i++) {
                var element = current.children.item(i);
                // Unbind
                if (hasData(element)) {
                    // Listeners
                    var listeners = data(element)[LISTENER_BINDING_ID];
                    if (types.isArray(listeners)) {
                        while (listeners.length) {
                            listeners.pop().dispose();
                        }
                    }
                    // Delete Data Slot
                    delete element[MS_DATA_KEY];
                }
                // Recurse
                this.unbindDescendants(element);
            }
        }
    };
    /**
     *  Removes all HTML elements from the current element of the builder. Will also clean up any
     *  event listners registered and also clear any data binding and properties stored
     *  to any child element.
     */
    Builder.prototype.empty = function () {
        this.unbindDescendants(this.currentElement);
        this.clearChildren();
        if (this.offdom) {
            this.createdElements = [];
        }
        return this;
    };
    /**
     *  Removes all HTML elements from the current element of the builder.
     */
    Builder.prototype.clearChildren = function () {
        // Remove Elements
        if (this.currentElement) {
            DOM.clearNode(this.currentElement);
        }
        return this;
    };
    /**
     *  Removes the current HTML element and all its children from its parent and unbinds
     *  all listeners and properties set to the data slots.
     */
    Builder.prototype.destroy = function () {
        if (this.currentElement) {
            // Remove from parent
            if (this.currentElement.parentNode) {
                this.currentElement.parentNode.removeChild(this.currentElement);
            }
            // Empty to clear listeners and bindings from children
            this.empty();
            // Unbind
            if (hasData(this.currentElement)) {
                // Listeners
                var listeners = data(this.currentElement)[LISTENER_BINDING_ID];
                if (types.isArray(listeners)) {
                    while (listeners.length) {
                        listeners.pop().dispose();
                    }
                }
                // Delete Data Slot
                delete this.currentElement[MS_DATA_KEY];
            }
        }
        var type;
        for (type in this.toDispose) {
            if (this.toDispose.hasOwnProperty(type) && types.isArray(this.toDispose[type])) {
                this.toDispose[type] = dispose(this.toDispose[type]);
            }
        }
        for (type in this.captureToDispose) {
            if (this.captureToDispose.hasOwnProperty(type) && types.isArray(this.captureToDispose[type])) {
                this.captureToDispose[type] = dispose(this.captureToDispose[type]);
            }
        }
        // Nullify fields
        this.currentElement = null;
        this.container = null;
        this.offdom = null;
        this.createdElements = null;
        this.captureToDispose = null;
        this.toDispose = null;
    };
    /**
     *  Removes the current HTML element and all its children from its parent and unbinds
     *  all listeners and properties set to the data slots.
     */
    Builder.prototype.dispose = function () {
        this.destroy();
    };
    /**
     *  Gets the size (in pixels) of an element, including the margin.
     */
    Builder.prototype.getTotalSize = function () {
        var totalWidth = DOM.getTotalWidth(this.currentElement);
        var totalHeight = DOM.getTotalHeight(this.currentElement);
        return new DOM.Dimension(totalWidth, totalHeight);
    };
    /**
     *  Another variant of getting the inner dimensions of an element.
     */
    Builder.prototype.getClientArea = function () {
        return DOM.getClientArea(this.currentElement);
    };
    return Builder;
}());
export { Builder };
/**
 *  The multi builder provides the same methods as the builder, but allows to call
 *  them on an array of builders.
 */
var MultiBuilder = /** @class */ (function (_super) {
    __extends(MultiBuilder, _super);
    function MultiBuilder(builders) {
        var _this = this;
        assert.ok(types.isArray(builders) || builders instanceof MultiBuilder, 'Expected Array or MultiBuilder as parameter');
        _this = _super.call(this) || this;
        _this.length = 0;
        _this.builders = [];
        // Add Builders to Array
        if (types.isArray(builders)) {
            for (var i = 0; i < builders.length; i++) {
                if (builders[i] instanceof HTMLElement) {
                    _this.push(withElement(builders[i]));
                }
                else {
                    _this.push(builders[i]);
                }
            }
        }
        else {
            for (var i = 0; i < builders.length; i++) {
                _this.push(builders.item(i));
            }
        }
        // Mixin Builder functions to operate on all builders
        var $outer = _this;
        var propertyFn = function (prop) {
            $outer[prop] = function () {
                var args = Array.prototype.slice.call(arguments);
                var returnValues;
                var mergeBuilders = false;
                for (var i = 0; i < $outer.length; i++) {
                    var res = $outer.item(i)[prop].apply($outer.item(i), args);
                    // Merge MultiBuilders into one
                    if (res instanceof MultiBuilder) {
                        if (!returnValues) {
                            returnValues = [];
                        }
                        mergeBuilders = true;
                        for (var j = 0; j < res.length; j++) {
                            returnValues.push(res.item(j));
                        }
                    }
                    // Any other Return Type (e.g. boolean, integer)
                    else if (!types.isUndefined(res) && !(res instanceof Builder)) {
                        if (!returnValues) {
                            returnValues = [];
                        }
                        returnValues.push(res);
                    }
                }
                if (returnValues && mergeBuilders) {
                    return new MultiBuilder(returnValues);
                }
                return returnValues || $outer;
            };
        };
        for (var prop in Builder.prototype) {
            if (prop !== 'clone' && prop !== 'and') { // Skip methods that are explicitly defined in MultiBuilder
                if (Builder.prototype.hasOwnProperty(prop) && types.isFunction(Builder.prototype[prop])) {
                    propertyFn(prop);
                }
            }
        }
        return _this;
    }
    MultiBuilder.prototype.item = function (i) {
        return this.builders[i];
    };
    MultiBuilder.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        for (var i = 0; i < items.length; i++) {
            this.builders.push(items[i]);
        }
        this.length = this.builders.length;
    };
    MultiBuilder.prototype.clone = function () {
        return new MultiBuilder(this);
    };
    return MultiBuilder;
}(Builder));
export { MultiBuilder };
function withBuilder(builder, offdom) {
    if (builder instanceof MultiBuilder) {
        return new MultiBuilder(builder);
    }
    return new Builder(builder.getHTMLElement(), offdom);
}
export function withElement(element, offdom) {
    return new Builder(element, offdom);
}
function offDOM() {
    return new Builder(null, true);
}
// Binding functions
/**
 *  Allows to store arbritary data into element.
 */
export function setPropertyOnElement(element, key, value) {
    data(element)[key] = value;
}
/**
 *  Allows to get arbritary data from element.
 */
export function getPropertyFromElement(element, key, fallback) {
    if (hasData(element)) {
        var value = data(element)[key];
        if (!types.isUndefined(value)) {
            return value;
        }
    }
    return fallback;
}
/**
 *  Adds the provided object as property to the given element. Call getBinding()
 *  to retrieve it again.
 */
export function bindElement(element, object) {
    setPropertyOnElement(element, DATA_BINDING_ID, object);
}
var SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
export var $ = function (arg) {
    // Off-DOM use
    if (types.isUndefined(arg)) {
        return offDOM();
    }
    // Falsified values cause error otherwise
    if (!arg) {
        throw new Error('Bad use of $');
    }
    // Wrap the given element
    if (DOM.isHTMLElement(arg) || arg === window) {
        return withElement(arg);
    }
    // Wrap the given builders
    if (types.isArray(arg)) {
        return new MultiBuilder(arg);
    }
    // Wrap the given builder
    if (arg instanceof Builder) {
        return withBuilder(arg);
    }
    if (types.isString(arg)) {
        // Use the argument as HTML code
        if (arg[0] === '<') {
            var element = void 0;
            var container = document.createElement('div');
            container.innerHTML = strings.format.apply(strings, arguments);
            if (container.children.length === 0) {
                throw new Error('Bad use of $');
            }
            if (container.children.length === 1) {
                element = container.firstChild;
                container.removeChild(element);
                return withElement(element);
            }
            var builders = [];
            while (container.firstChild) {
                element = container.firstChild;
                container.removeChild(element);
                builders.push(withElement(element));
            }
            return new MultiBuilder(builders);
        }
        // Use the argument as a selector constructor
        else if (arguments.length === 1) {
            var match = SELECTOR_REGEX.exec(arg);
            if (!match) {
                throw new Error('Bad use of $');
            }
            var tag = match[1] || 'div';
            var id = match[3] || undefined;
            var classes = (match[4] || '').replace(/\./g, ' ');
            var props = {};
            if (id) {
                props['id'] = id;
            }
            if (classes) {
                props['class'] = classes;
            }
            return offDOM().element(tag, props);
        }
        // Use the arguments as the arguments to Builder#element(...)
        else {
            var result = offDOM();
            result.element.apply(result, arguments);
            return result;
        }
    }
    else {
        throw new Error('Bad use of $');
    }
};
