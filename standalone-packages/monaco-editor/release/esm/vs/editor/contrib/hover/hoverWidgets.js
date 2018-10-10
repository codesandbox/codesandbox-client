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
import { toggleClass } from '../../../base/browser/dom.js';
import { Position } from '../../common/core/position.js';
import * as editorBrowser from '../../browser/editorBrowser.js';
import { Widget } from '../../../base/browser/ui/widget.js';
import { DomScrollableElement } from '../../../base/browser/ui/scrollbar/scrollableElement.js';
import { dispose } from '../../../base/common/lifecycle.js';
var ContentHoverWidget = /** @class */ (function (_super) {
    __extends(ContentHoverWidget, _super);
    function ContentHoverWidget(id, editor) {
        var _this = _super.call(this) || this;
        _this.disposables = [];
        // Editor.IContentWidget.allowEditorOverflow
        _this.allowEditorOverflow = true;
        _this._id = id;
        _this._editor = editor;
        _this._isVisible = false;
        _this._containerDomNode = document.createElement('div');
        _this._containerDomNode.className = 'monaco-editor-hover hidden';
        _this._containerDomNode.tabIndex = 0;
        _this._domNode = document.createElement('div');
        _this._domNode.className = 'monaco-editor-hover-content';
        _this.scrollbar = new DomScrollableElement(_this._domNode, {});
        _this.disposables.push(_this.scrollbar);
        _this._containerDomNode.appendChild(_this.scrollbar.getDomNode());
        _this.onkeydown(_this._containerDomNode, function (e) {
            if (e.equals(9 /* Escape */)) {
                _this.hide();
            }
        });
        _this._register(_this._editor.onDidChangeConfiguration(function (e) {
            if (e.fontInfo) {
                _this.updateFont();
            }
        }));
        _this._editor.onDidLayoutChange(function (e) { return _this.updateMaxHeight(); });
        _this.updateMaxHeight();
        _this._editor.addContentWidget(_this);
        _this._showAtPosition = null;
        return _this;
    }
    Object.defineProperty(ContentHoverWidget.prototype, "isVisible", {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            this._isVisible = value;
            toggleClass(this._containerDomNode, 'hidden', !this._isVisible);
        },
        enumerable: true,
        configurable: true
    });
    ContentHoverWidget.prototype.getId = function () {
        return this._id;
    };
    ContentHoverWidget.prototype.getDomNode = function () {
        return this._containerDomNode;
    };
    ContentHoverWidget.prototype.showAt = function (position, focus) {
        // Position has changed
        this._showAtPosition = new Position(position.lineNumber, position.column);
        this.isVisible = true;
        this._editor.layoutContentWidget(this);
        // Simply force a synchronous render on the editor
        // such that the widget does not really render with left = '0px'
        this._editor.render();
        this._stoleFocus = focus;
        if (focus) {
            this._containerDomNode.focus();
        }
    };
    ContentHoverWidget.prototype.hide = function () {
        if (!this.isVisible) {
            return;
        }
        this.isVisible = false;
        this._editor.layoutContentWidget(this);
        if (this._stoleFocus) {
            this._editor.focus();
        }
    };
    ContentHoverWidget.prototype.getPosition = function () {
        if (this.isVisible) {
            return {
                position: this._showAtPosition,
                preference: [
                    editorBrowser.ContentWidgetPositionPreference.ABOVE,
                    editorBrowser.ContentWidgetPositionPreference.BELOW
                ]
            };
        }
        return null;
    };
    ContentHoverWidget.prototype.dispose = function () {
        this._editor.removeContentWidget(this);
        this.disposables = dispose(this.disposables);
        _super.prototype.dispose.call(this);
    };
    ContentHoverWidget.prototype.updateFont = function () {
        var _this = this;
        var codeClasses = Array.prototype.slice.call(this._domNode.getElementsByClassName('code'));
        codeClasses.forEach(function (node) { return _this._editor.applyFontInfo(node); });
    };
    ContentHoverWidget.prototype.updateContents = function (node) {
        this._domNode.textContent = '';
        this._domNode.appendChild(node);
        this.updateFont();
        this._editor.layoutContentWidget(this);
        this.onContentsChange();
    };
    ContentHoverWidget.prototype.onContentsChange = function () {
        this.scrollbar.scanDomNode();
    };
    ContentHoverWidget.prototype.updateMaxHeight = function () {
        var height = Math.max(this._editor.getLayoutInfo().height / 4, 250);
        var _a = this._editor.getConfiguration().fontInfo, fontSize = _a.fontSize, lineHeight = _a.lineHeight;
        this._domNode.style.fontSize = fontSize + "px";
        this._domNode.style.lineHeight = lineHeight + "px";
        this._domNode.style.maxHeight = height + "px";
    };
    return ContentHoverWidget;
}(Widget));
export { ContentHoverWidget };
var GlyphHoverWidget = /** @class */ (function (_super) {
    __extends(GlyphHoverWidget, _super);
    function GlyphHoverWidget(id, editor) {
        var _this = _super.call(this) || this;
        _this._id = id;
        _this._editor = editor;
        _this._isVisible = false;
        _this._domNode = document.createElement('div');
        _this._domNode.className = 'monaco-editor-hover hidden';
        _this._domNode.setAttribute('aria-hidden', 'true');
        _this._domNode.setAttribute('role', 'presentation');
        _this._showAtLineNumber = -1;
        _this._register(_this._editor.onDidChangeConfiguration(function (e) {
            if (e.fontInfo) {
                _this.updateFont();
            }
        }));
        _this._editor.addOverlayWidget(_this);
        return _this;
    }
    Object.defineProperty(GlyphHoverWidget.prototype, "isVisible", {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            this._isVisible = value;
            toggleClass(this._domNode, 'hidden', !this._isVisible);
        },
        enumerable: true,
        configurable: true
    });
    GlyphHoverWidget.prototype.getId = function () {
        return this._id;
    };
    GlyphHoverWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    GlyphHoverWidget.prototype.showAt = function (lineNumber) {
        this._showAtLineNumber = lineNumber;
        if (!this.isVisible) {
            this.isVisible = true;
        }
        var editorLayout = this._editor.getLayoutInfo();
        var topForLineNumber = this._editor.getTopForLineNumber(this._showAtLineNumber);
        var editorScrollTop = this._editor.getScrollTop();
        var lineHeight = this._editor.getConfiguration().lineHeight;
        var nodeHeight = this._domNode.clientHeight;
        var top = topForLineNumber - editorScrollTop - ((nodeHeight - lineHeight) / 2);
        this._domNode.style.left = editorLayout.glyphMarginLeft + editorLayout.glyphMarginWidth + "px";
        this._domNode.style.top = Math.max(Math.round(top), 0) + "px";
    };
    GlyphHoverWidget.prototype.hide = function () {
        if (!this.isVisible) {
            return;
        }
        this.isVisible = false;
    };
    GlyphHoverWidget.prototype.getPosition = function () {
        return null;
    };
    GlyphHoverWidget.prototype.dispose = function () {
        this._editor.removeOverlayWidget(this);
        _super.prototype.dispose.call(this);
    };
    GlyphHoverWidget.prototype.updateFont = function () {
        var _this = this;
        var codeTags = Array.prototype.slice.call(this._domNode.getElementsByTagName('code'));
        var codeClasses = Array.prototype.slice.call(this._domNode.getElementsByClassName('code'));
        codeTags.concat(codeClasses).forEach(function (node) { return _this._editor.applyFontInfo(node); });
    };
    GlyphHoverWidget.prototype.updateContents = function (node) {
        this._domNode.textContent = '';
        this._domNode.appendChild(node);
        this.updateFont();
    };
    return GlyphHoverWidget;
}(Widget));
export { GlyphHoverWidget };
