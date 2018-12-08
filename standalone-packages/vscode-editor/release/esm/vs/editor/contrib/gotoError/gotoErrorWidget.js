/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import './gotoErrorWidget.css';
import * as nls from '../../../nls.js';
import * as dom from '../../../base/browser/dom.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { MarkerSeverity } from '../../../platform/markers/common/markers.js';
import { Range } from '../../common/core/range.js';
import { ZoneWidget } from '../zoneWidget/zoneWidget.js';
import { registerColor, oneOf } from '../../../platform/theme/common/colorRegistry.js';
import { Color } from '../../../base/common/color.js';
import { editorErrorForeground, editorErrorBorder, editorWarningForeground, editorWarningBorder, editorInfoForeground, editorInfoBorder } from '../../common/view/editorColorRegistry.js';
import { ScrollableElement } from '../../../base/browser/ui/scrollbar/scrollableElement.js';
import { getBaseLabel, getPathLabel } from '../../../base/common/labels.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { Emitter } from '../../../base/common/event.js';
var MessageWidget = /** @class */ (function () {
    function MessageWidget(parent, editor, onRelatedInformation) {
        var _this = this;
        this._lines = 0;
        this._longestLineLength = 0;
        this._relatedDiagnostics = new WeakMap();
        this._disposables = [];
        this._editor = editor;
        var domNode = document.createElement('div');
        domNode.className = 'descriptioncontainer';
        domNode.setAttribute('aria-live', 'assertive');
        domNode.setAttribute('role', 'alert');
        this._messageBlock = document.createElement('div');
        domNode.appendChild(this._messageBlock);
        this._relatedBlock = document.createElement('div');
        domNode.appendChild(this._relatedBlock);
        this._disposables.push(dom.addStandardDisposableListener(this._relatedBlock, 'click', function (event) {
            event.preventDefault();
            var related = _this._relatedDiagnostics.get(event.target);
            if (related) {
                onRelatedInformation(related);
            }
        }));
        this._scrollable = new ScrollableElement(domNode, {
            horizontal: 1 /* Auto */,
            vertical: 1 /* Auto */,
            useShadows: false,
            horizontalScrollbarSize: 3,
            verticalScrollbarSize: 3
        });
        dom.addClass(this._scrollable.getDomNode(), 'block');
        parent.appendChild(this._scrollable.getDomNode());
        this._disposables.push(this._scrollable.onScroll(function (e) {
            domNode.style.left = "-" + e.scrollLeft + "px";
            domNode.style.top = "-" + e.scrollTop + "px";
        }));
        this._disposables.push(this._scrollable);
    }
    MessageWidget.prototype.dispose = function () {
        dispose(this._disposables);
    };
    MessageWidget.prototype.update = function (_a) {
        var source = _a.source, message = _a.message, relatedInformation = _a.relatedInformation, code = _a.code;
        if (source) {
            this._lines = 0;
            this._longestLineLength = 0;
            var indent = new Array(source.length + 3 + 1).join(' ');
            var lines = message.split(/\r\n|\r|\n/g);
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                this._lines += 1;
                if (code && i === lines.length - 1) {
                    line += " [" + code + "]";
                }
                this._longestLineLength = Math.max(line.length, this._longestLineLength);
                if (i === 0) {
                    message = "[" + source + "] " + line;
                }
                else {
                    message += "\n" + indent + line;
                }
            }
        }
        else {
            this._lines = 1;
            if (code) {
                message += " [" + code + "]";
            }
            this._longestLineLength = message.length;
        }
        dom.clearNode(this._relatedBlock);
        if (!isFalsyOrEmpty(relatedInformation)) {
            this._relatedBlock.style.paddingTop = Math.floor(this._editor.getConfiguration().lineHeight * .66) + "px";
            this._lines += 1;
            for (var _i = 0, _b = relatedInformation || []; _i < _b.length; _i++) {
                var related = _b[_i];
                var container = document.createElement('div');
                var relatedResource = document.createElement('span');
                dom.addClass(relatedResource, 'filename');
                relatedResource.innerHTML = getBaseLabel(related.resource) + "(" + related.startLineNumber + ", " + related.startColumn + "): ";
                relatedResource.title = getPathLabel(related.resource, undefined);
                this._relatedDiagnostics.set(relatedResource, related);
                var relatedMessage = document.createElement('span');
                relatedMessage.innerText = related.message;
                this._editor.applyFontInfo(relatedMessage);
                container.appendChild(relatedResource);
                container.appendChild(relatedMessage);
                this._lines += 1;
                this._relatedBlock.appendChild(container);
            }
        }
        this._messageBlock.innerText = message;
        this._editor.applyFontInfo(this._messageBlock);
        var fontInfo = this._editor.getConfiguration().fontInfo;
        var scrollWidth = Math.ceil(fontInfo.typicalFullwidthCharacterWidth * this._longestLineLength * 0.75);
        var scrollHeight = fontInfo.lineHeight * this._lines;
        this._scrollable.setScrollDimensions({ scrollWidth: scrollWidth, scrollHeight: scrollHeight });
    };
    MessageWidget.prototype.layout = function (height, width) {
        this._scrollable.getDomNode().style.height = height + "px";
        this._scrollable.setScrollDimensions({ width: width, height: height });
    };
    MessageWidget.prototype.getHeightInLines = function () {
        return Math.min(17, this._lines);
    };
    return MessageWidget;
}());
var MarkerNavigationWidget = /** @class */ (function (_super) {
    __extends(MarkerNavigationWidget, _super);
    function MarkerNavigationWidget(editor, _themeService) {
        var _this = _super.call(this, editor, { showArrow: true, showFrame: true, isAccessible: true }) || this;
        _this._themeService = _themeService;
        _this._callOnDispose = [];
        _this._onDidSelectRelatedInformation = new Emitter();
        _this.onDidSelectRelatedInformation = _this._onDidSelectRelatedInformation.event;
        _this._severity = MarkerSeverity.Warning;
        _this._backgroundColor = Color.white;
        _this._applyTheme(_themeService.getTheme());
        _this._callOnDispose.push(_themeService.onThemeChange(_this._applyTheme.bind(_this)));
        _this.create();
        return _this;
    }
    MarkerNavigationWidget.prototype._applyTheme = function (theme) {
        this._backgroundColor = theme.getColor(editorMarkerNavigationBackground);
        var colorId = editorMarkerNavigationError;
        if (this._severity === MarkerSeverity.Warning) {
            colorId = editorMarkerNavigationWarning;
        }
        else if (this._severity === MarkerSeverity.Info) {
            colorId = editorMarkerNavigationInfo;
        }
        var frameColor = theme.getColor(colorId);
        this.style({
            arrowColor: frameColor,
            frameColor: frameColor
        }); // style() will trigger _applyStyles
    };
    MarkerNavigationWidget.prototype._applyStyles = function () {
        if (this._parentContainer) {
            this._parentContainer.style.backgroundColor = this._backgroundColor ? this._backgroundColor.toString() : '';
        }
        _super.prototype._applyStyles.call(this);
    };
    MarkerNavigationWidget.prototype.dispose = function () {
        this._callOnDispose = dispose(this._callOnDispose);
        _super.prototype.dispose.call(this);
    };
    MarkerNavigationWidget.prototype.focus = function () {
        this._parentContainer.focus();
    };
    MarkerNavigationWidget.prototype._fillContainer = function (container) {
        var _this = this;
        this._parentContainer = container;
        dom.addClass(container, 'marker-widget');
        this._parentContainer.tabIndex = 0;
        this._parentContainer.setAttribute('role', 'tooltip');
        this._container = document.createElement('div');
        container.appendChild(this._container);
        this._title = document.createElement('div');
        this._title.className = 'block title';
        this._container.appendChild(this._title);
        this._message = new MessageWidget(this._container, this.editor, function (related) { return _this._onDidSelectRelatedInformation.fire(related); });
        this._disposables.push(this._message);
    };
    MarkerNavigationWidget.prototype.show = function (where, heightInLines) {
        throw new Error('call showAtMarker');
    };
    MarkerNavigationWidget.prototype.showAtMarker = function (marker, markerIdx, markerCount) {
        // update:
        // * title
        // * message
        this._container.classList.remove('stale');
        this._title.innerHTML = nls.localize('title.wo_source', "({0}/{1})", markerIdx, markerCount);
        this._message.update(marker);
        // update frame color (only applied on 'show')
        this._severity = marker.severity;
        this._applyTheme(this._themeService.getTheme());
        // show
        var range = Range.lift(marker);
        var editorPosition = this.editor.getPosition();
        var position = editorPosition && range.containsPosition(editorPosition) ? editorPosition : range.getStartPosition();
        _super.prototype.show.call(this, position, this.computeRequiredHeight());
        this.editor.revealPositionInCenter(position, 0 /* Smooth */);
        if (this.editor.getConfiguration().accessibilitySupport !== 1 /* Disabled */) {
            this.focus();
        }
    };
    MarkerNavigationWidget.prototype.updateMarker = function (marker) {
        this._container.classList.remove('stale');
        this._message.update(marker);
    };
    MarkerNavigationWidget.prototype.showStale = function () {
        this._container.classList.add('stale');
        this._relayout();
    };
    MarkerNavigationWidget.prototype._doLayout = function (heightInPixel, widthInPixel) {
        this._message.layout(heightInPixel, widthInPixel);
        this._container.style.height = heightInPixel + "px";
    };
    MarkerNavigationWidget.prototype._relayout = function () {
        _super.prototype._relayout.call(this, this.computeRequiredHeight());
    };
    MarkerNavigationWidget.prototype.computeRequiredHeight = function () {
        return 1 + this._message.getHeightInLines();
    };
    return MarkerNavigationWidget;
}(ZoneWidget));
export { MarkerNavigationWidget };
// theming
var errorDefault = oneOf(editorErrorForeground, editorErrorBorder);
var warningDefault = oneOf(editorWarningForeground, editorWarningBorder);
var infoDefault = oneOf(editorInfoForeground, editorInfoBorder);
export var editorMarkerNavigationError = registerColor('editorMarkerNavigationError.background', { dark: errorDefault, light: errorDefault, hc: errorDefault }, nls.localize('editorMarkerNavigationError', 'Editor marker navigation widget error color.'));
export var editorMarkerNavigationWarning = registerColor('editorMarkerNavigationWarning.background', { dark: warningDefault, light: warningDefault, hc: warningDefault }, nls.localize('editorMarkerNavigationWarning', 'Editor marker navigation widget warning color.'));
export var editorMarkerNavigationInfo = registerColor('editorMarkerNavigationInfo.background', { dark: infoDefault, light: infoDefault, hc: infoDefault }, nls.localize('editorMarkerNavigationInfo', 'Editor marker navigation widget info color.'));
export var editorMarkerNavigationBackground = registerColor('editorMarkerNavigation.background', { dark: '#2D2D30', light: Color.white, hc: '#0C141F' }, nls.localize('editorMarkerNavigationBackground', 'Editor marker navigation widget background.'));
