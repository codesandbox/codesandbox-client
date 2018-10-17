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
import './currentLineMarginHighlight.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { editorLineHighlight, editorLineHighlightBorder } from '../../../common/view/editorColorRegistry.js';
var CurrentLineMarginHighlightOverlay = /** @class */ (function (_super) {
    __extends(CurrentLineMarginHighlightOverlay, _super);
    function CurrentLineMarginHighlightOverlay(context) {
        var _this = _super.call(this) || this;
        _this._context = context;
        _this._lineHeight = _this._context.configuration.editor.lineHeight;
        _this._renderLineHighlight = _this._context.configuration.editor.viewInfo.renderLineHighlight;
        _this._selectionIsEmpty = true;
        _this._primaryCursorLineNumber = 1;
        _this._contentLeft = _this._context.configuration.editor.layoutInfo.contentLeft;
        _this._context.addEventHandler(_this);
        return _this;
    }
    CurrentLineMarginHighlightOverlay.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        this._context = null;
        _super.prototype.dispose.call(this);
    };
    // --- begin event handlers
    CurrentLineMarginHighlightOverlay.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._lineHeight = this._context.configuration.editor.lineHeight;
        }
        if (e.viewInfo) {
            this._renderLineHighlight = this._context.configuration.editor.viewInfo.renderLineHighlight;
        }
        if (e.layoutInfo) {
            this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
        }
        return true;
    };
    CurrentLineMarginHighlightOverlay.prototype.onCursorStateChanged = function (e) {
        var hasChanged = false;
        var primaryCursorLineNumber = e.selections[0].positionLineNumber;
        if (this._primaryCursorLineNumber !== primaryCursorLineNumber) {
            this._primaryCursorLineNumber = primaryCursorLineNumber;
            hasChanged = true;
        }
        var selectionIsEmpty = e.selections[0].isEmpty();
        if (this._selectionIsEmpty !== selectionIsEmpty) {
            this._selectionIsEmpty = selectionIsEmpty;
            hasChanged = true;
            return true;
        }
        return hasChanged;
    };
    CurrentLineMarginHighlightOverlay.prototype.onFlushed = function (e) {
        return true;
    };
    CurrentLineMarginHighlightOverlay.prototype.onLinesDeleted = function (e) {
        return true;
    };
    CurrentLineMarginHighlightOverlay.prototype.onLinesInserted = function (e) {
        return true;
    };
    CurrentLineMarginHighlightOverlay.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    CurrentLineMarginHighlightOverlay.prototype.prepareRender = function (ctx) {
    };
    CurrentLineMarginHighlightOverlay.prototype.render = function (startLineNumber, lineNumber) {
        if (lineNumber === this._primaryCursorLineNumber) {
            var className = 'current-line';
            if (this._shouldShowCurrentLine()) {
                var paintedInContent = this._willRenderContentCurrentLine();
                className = 'current-line current-line-margin' + (paintedInContent ? ' current-line-margin-both' : '');
            }
            return ('<div class="'
                + className
                + '" style="width:'
                + String(this._contentLeft)
                + 'px; height:'
                + String(this._lineHeight)
                + 'px;"></div>');
        }
        return '';
    };
    CurrentLineMarginHighlightOverlay.prototype._shouldShowCurrentLine = function () {
        return ((this._renderLineHighlight === 'gutter' || this._renderLineHighlight === 'all'));
    };
    CurrentLineMarginHighlightOverlay.prototype._willRenderContentCurrentLine = function () {
        return ((this._renderLineHighlight === 'line' || this._renderLineHighlight === 'all')
            && this._selectionIsEmpty);
    };
    return CurrentLineMarginHighlightOverlay;
}(DynamicViewOverlay));
export { CurrentLineMarginHighlightOverlay };
registerThemingParticipant(function (theme, collector) {
    var lineHighlight = theme.getColor(editorLineHighlight);
    if (lineHighlight) {
        collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { background-color: " + lineHighlight + "; border: none; }");
    }
    else {
        var lineHighlightBorder = theme.getColor(editorLineHighlightBorder);
        if (lineHighlightBorder) {
            collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { border: 2px solid " + lineHighlightBorder + "; }");
        }
        if (theme.type === 'hc') {
            collector.addRule(".monaco-editor .margin-view-overlays .current-line-margin { border-width: 1px; }");
        }
    }
});
