/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as dom from './dom.js';
var FastDomNode = /** @class */ (function () {
    function FastDomNode(domNode) {
        this.domNode = domNode;
        this._maxWidth = -1;
        this._width = -1;
        this._height = -1;
        this._top = -1;
        this._left = -1;
        this._bottom = -1;
        this._right = -1;
        this._fontFamily = '';
        this._fontWeight = '';
        this._fontSize = -1;
        this._lineHeight = -1;
        this._letterSpacing = -100;
        this._className = '';
        this._display = '';
        this._position = '';
        this._visibility = '';
        this._layerHint = false;
    }
    FastDomNode.prototype.setMaxWidth = function (maxWidth) {
        if (this._maxWidth === maxWidth) {
            return;
        }
        this._maxWidth = maxWidth;
        this.domNode.style.maxWidth = this._maxWidth + 'px';
    };
    FastDomNode.prototype.setWidth = function (width) {
        if (this._width === width) {
            return;
        }
        this._width = width;
        this.domNode.style.width = this._width + 'px';
    };
    FastDomNode.prototype.setHeight = function (height) {
        if (this._height === height) {
            return;
        }
        this._height = height;
        this.domNode.style.height = this._height + 'px';
    };
    FastDomNode.prototype.setTop = function (top) {
        if (this._top === top) {
            return;
        }
        this._top = top;
        this.domNode.style.top = this._top + 'px';
    };
    FastDomNode.prototype.unsetTop = function () {
        if (this._top === -1) {
            return;
        }
        this._top = -1;
        this.domNode.style.top = '';
    };
    FastDomNode.prototype.setLeft = function (left) {
        if (this._left === left) {
            return;
        }
        this._left = left;
        this.domNode.style.left = this._left + 'px';
    };
    FastDomNode.prototype.setBottom = function (bottom) {
        if (this._bottom === bottom) {
            return;
        }
        this._bottom = bottom;
        this.domNode.style.bottom = this._bottom + 'px';
    };
    FastDomNode.prototype.setRight = function (right) {
        if (this._right === right) {
            return;
        }
        this._right = right;
        this.domNode.style.right = this._right + 'px';
    };
    FastDomNode.prototype.setFontFamily = function (fontFamily) {
        if (this._fontFamily === fontFamily) {
            return;
        }
        this._fontFamily = fontFamily;
        this.domNode.style.fontFamily = this._fontFamily;
    };
    FastDomNode.prototype.setFontWeight = function (fontWeight) {
        if (this._fontWeight === fontWeight) {
            return;
        }
        this._fontWeight = fontWeight;
        this.domNode.style.fontWeight = this._fontWeight;
    };
    FastDomNode.prototype.setFontSize = function (fontSize) {
        if (this._fontSize === fontSize) {
            return;
        }
        this._fontSize = fontSize;
        this.domNode.style.fontSize = this._fontSize + 'px';
    };
    FastDomNode.prototype.setLineHeight = function (lineHeight) {
        if (this._lineHeight === lineHeight) {
            return;
        }
        this._lineHeight = lineHeight;
        this.domNode.style.lineHeight = this._lineHeight + 'px';
    };
    FastDomNode.prototype.setLetterSpacing = function (letterSpacing) {
        if (this._letterSpacing === letterSpacing) {
            return;
        }
        this._letterSpacing = letterSpacing;
        this.domNode.style.letterSpacing = this._letterSpacing + 'px';
    };
    FastDomNode.prototype.setClassName = function (className) {
        if (this._className === className) {
            return;
        }
        this._className = className;
        this.domNode.className = this._className;
    };
    FastDomNode.prototype.toggleClassName = function (className, shouldHaveIt) {
        dom.toggleClass(this.domNode, className, shouldHaveIt);
        this._className = this.domNode.className;
    };
    FastDomNode.prototype.setDisplay = function (display) {
        if (this._display === display) {
            return;
        }
        this._display = display;
        this.domNode.style.display = this._display;
    };
    FastDomNode.prototype.setPosition = function (position) {
        if (this._position === position) {
            return;
        }
        this._position = position;
        this.domNode.style.position = this._position;
    };
    FastDomNode.prototype.setVisibility = function (visibility) {
        if (this._visibility === visibility) {
            return;
        }
        this._visibility = visibility;
        this.domNode.style.visibility = this._visibility;
    };
    FastDomNode.prototype.setLayerHinting = function (layerHint) {
        if (this._layerHint === layerHint) {
            return;
        }
        this._layerHint = layerHint;
        this.domNode.style.willChange = this._layerHint ? 'transform' : 'auto';
    };
    FastDomNode.prototype.setAttribute = function (name, value) {
        this.domNode.setAttribute(name, value);
    };
    FastDomNode.prototype.removeAttribute = function (name) {
        this.domNode.removeAttribute(name);
    };
    FastDomNode.prototype.appendChild = function (child) {
        this.domNode.appendChild(child.domNode);
    };
    FastDomNode.prototype.removeChild = function (child) {
        this.domNode.removeChild(child.domNode);
    };
    return FastDomNode;
}());
export { FastDomNode };
export function createFastDomNode(domNode) {
    return new FastDomNode(domNode);
}
