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
import './overlayWidgets.css';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { OverlayWidgetPositionPreference } from '../../editorBrowser.js';
import { ViewPart, PartFingerprints } from '../../view/viewPart.js';
var ViewOverlayWidgets = /** @class */ (function (_super) {
    __extends(ViewOverlayWidgets, _super);
    function ViewOverlayWidgets(context) {
        var _this = _super.call(this, context) || this;
        _this._widgets = {};
        _this._verticalScrollbarWidth = _this._context.configuration.editor.layoutInfo.verticalScrollbarWidth;
        _this._minimapWidth = _this._context.configuration.editor.layoutInfo.minimapWidth;
        _this._horizontalScrollbarHeight = _this._context.configuration.editor.layoutInfo.horizontalScrollbarHeight;
        _this._editorHeight = _this._context.configuration.editor.layoutInfo.height;
        _this._editorWidth = _this._context.configuration.editor.layoutInfo.width;
        _this._domNode = createFastDomNode(document.createElement('div'));
        PartFingerprints.write(_this._domNode, 4 /* OverlayWidgets */);
        _this._domNode.setClassName('overlayWidgets');
        return _this;
    }
    ViewOverlayWidgets.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._widgets = null;
    };
    ViewOverlayWidgets.prototype.getDomNode = function () {
        return this._domNode;
    };
    // ---- begin view event handlers
    ViewOverlayWidgets.prototype.onConfigurationChanged = function (e) {
        if (e.layoutInfo) {
            this._verticalScrollbarWidth = this._context.configuration.editor.layoutInfo.verticalScrollbarWidth;
            this._minimapWidth = this._context.configuration.editor.layoutInfo.minimapWidth;
            this._horizontalScrollbarHeight = this._context.configuration.editor.layoutInfo.horizontalScrollbarHeight;
            this._editorHeight = this._context.configuration.editor.layoutInfo.height;
            this._editorWidth = this._context.configuration.editor.layoutInfo.width;
            return true;
        }
        return false;
    };
    // ---- end view event handlers
    ViewOverlayWidgets.prototype.addWidget = function (widget) {
        var domNode = createFastDomNode(widget.getDomNode());
        this._widgets[widget.getId()] = {
            widget: widget,
            preference: null,
            domNode: domNode
        };
        // This is sync because a widget wants to be in the dom
        domNode.setPosition('absolute');
        domNode.setAttribute('widgetId', widget.getId());
        this._domNode.appendChild(domNode);
        this.setShouldRender();
    };
    ViewOverlayWidgets.prototype.setWidgetPosition = function (widget, preference) {
        var widgetData = this._widgets[widget.getId()];
        if (widgetData.preference === preference) {
            return false;
        }
        widgetData.preference = preference;
        this.setShouldRender();
        return true;
    };
    ViewOverlayWidgets.prototype.removeWidget = function (widget) {
        var widgetId = widget.getId();
        if (this._widgets.hasOwnProperty(widgetId)) {
            var widgetData = this._widgets[widgetId];
            var domNode = widgetData.domNode.domNode;
            delete this._widgets[widgetId];
            domNode.parentNode.removeChild(domNode);
            this.setShouldRender();
        }
    };
    ViewOverlayWidgets.prototype._renderWidget = function (widgetData) {
        var domNode = widgetData.domNode;
        if (widgetData.preference === null) {
            domNode.unsetTop();
            return;
        }
        if (widgetData.preference === OverlayWidgetPositionPreference.TOP_RIGHT_CORNER) {
            domNode.setTop(0);
            domNode.setRight((2 * this._verticalScrollbarWidth) + this._minimapWidth);
        }
        else if (widgetData.preference === OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER) {
            var widgetHeight = domNode.domNode.clientHeight;
            domNode.setTop((this._editorHeight - widgetHeight - 2 * this._horizontalScrollbarHeight));
            domNode.setRight((2 * this._verticalScrollbarWidth) + this._minimapWidth);
        }
        else if (widgetData.preference === OverlayWidgetPositionPreference.TOP_CENTER) {
            domNode.setTop(0);
            domNode.domNode.style.right = '50%';
        }
    };
    ViewOverlayWidgets.prototype.prepareRender = function (ctx) {
        // Nothing to read
    };
    ViewOverlayWidgets.prototype.render = function (ctx) {
        this._domNode.setWidth(this._editorWidth);
        var keys = Object.keys(this._widgets);
        for (var i = 0, len = keys.length; i < len; i++) {
            var widgetId = keys[i];
            this._renderWidget(this._widgets[widgetId]);
        }
    };
    return ViewOverlayWidgets;
}(ViewPart));
export { ViewOverlayWidgets };
