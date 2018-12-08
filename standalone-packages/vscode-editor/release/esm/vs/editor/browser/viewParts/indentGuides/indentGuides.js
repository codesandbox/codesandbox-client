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
import './indentGuides.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { Position } from '../../../common/core/position.js';
import { editorActiveIndentGuides, editorIndentGuides } from '../../../common/view/editorColorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
var IndentGuidesOverlay = /** @class */ (function (_super) {
    __extends(IndentGuidesOverlay, _super);
    function IndentGuidesOverlay(context) {
        var _this = _super.call(this) || this;
        _this._context = context;
        _this._primaryLineNumber = 0;
        _this._lineHeight = _this._context.configuration.editor.lineHeight;
        _this._spaceWidth = _this._context.configuration.editor.fontInfo.spaceWidth;
        _this._enabled = _this._context.configuration.editor.viewInfo.renderIndentGuides;
        _this._activeIndentEnabled = _this._context.configuration.editor.viewInfo.highlightActiveIndentGuide;
        _this._renderResult = null;
        _this._context.addEventHandler(_this);
        return _this;
    }
    IndentGuidesOverlay.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        this._renderResult = null;
        _super.prototype.dispose.call(this);
    };
    // --- begin event handlers
    IndentGuidesOverlay.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._lineHeight = this._context.configuration.editor.lineHeight;
        }
        if (e.fontInfo) {
            this._spaceWidth = this._context.configuration.editor.fontInfo.spaceWidth;
        }
        if (e.viewInfo) {
            this._enabled = this._context.configuration.editor.viewInfo.renderIndentGuides;
            this._activeIndentEnabled = this._context.configuration.editor.viewInfo.highlightActiveIndentGuide;
        }
        return true;
    };
    IndentGuidesOverlay.prototype.onCursorStateChanged = function (e) {
        var selection = e.selections[0];
        var newPrimaryLineNumber = selection.isEmpty() ? selection.positionLineNumber : 0;
        if (this._primaryLineNumber !== newPrimaryLineNumber) {
            this._primaryLineNumber = newPrimaryLineNumber;
            return true;
        }
        return false;
    };
    IndentGuidesOverlay.prototype.onDecorationsChanged = function (e) {
        // true for inline decorations
        return true;
    };
    IndentGuidesOverlay.prototype.onFlushed = function (e) {
        return true;
    };
    IndentGuidesOverlay.prototype.onLinesChanged = function (e) {
        return true;
    };
    IndentGuidesOverlay.prototype.onLinesDeleted = function (e) {
        return true;
    };
    IndentGuidesOverlay.prototype.onLinesInserted = function (e) {
        return true;
    };
    IndentGuidesOverlay.prototype.onScrollChanged = function (e) {
        return e.scrollTopChanged; // || e.scrollWidthChanged;
    };
    IndentGuidesOverlay.prototype.onZonesChanged = function (e) {
        return true;
    };
    IndentGuidesOverlay.prototype.onLanguageConfigurationChanged = function (e) {
        return true;
    };
    // --- end event handlers
    IndentGuidesOverlay.prototype.prepareRender = function (ctx) {
        if (!this._enabled) {
            this._renderResult = null;
            return;
        }
        var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        var tabSize = this._context.model.getTabSize();
        var tabWidth = tabSize * this._spaceWidth;
        var scrollWidth = ctx.scrollWidth;
        var lineHeight = this._lineHeight;
        var indentGuideWidth = tabWidth;
        var indents = this._context.model.getLinesIndentGuides(visibleStartLineNumber, visibleEndLineNumber);
        var activeIndentStartLineNumber = 0;
        var activeIndentEndLineNumber = 0;
        var activeIndentLevel = 0;
        if (this._activeIndentEnabled && this._primaryLineNumber) {
            var activeIndentInfo = this._context.model.getActiveIndentGuide(this._primaryLineNumber, visibleStartLineNumber, visibleEndLineNumber);
            activeIndentStartLineNumber = activeIndentInfo.startLineNumber;
            activeIndentEndLineNumber = activeIndentInfo.endLineNumber;
            activeIndentLevel = activeIndentInfo.indent;
        }
        var output = [];
        for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            var containsActiveIndentGuide = (activeIndentStartLineNumber <= lineNumber && lineNumber <= activeIndentEndLineNumber);
            var lineIndex = lineNumber - visibleStartLineNumber;
            var indent = indents[lineIndex];
            var result = '';
            var leftMostVisiblePosition = ctx.visibleRangeForPosition(new Position(lineNumber, 1));
            var left = leftMostVisiblePosition ? leftMostVisiblePosition.left : 0;
            for (var i = 1; i <= indent; i++) {
                var className = (containsActiveIndentGuide && i === activeIndentLevel ? 'cigra' : 'cigr');
                result += "<div class=\"" + className + "\" style=\"left:" + left + "px;height:" + lineHeight + "px;width:" + indentGuideWidth + "px\"></div>";
                left += tabWidth;
                if (left > scrollWidth) {
                    break;
                }
            }
            output[lineIndex] = result;
        }
        this._renderResult = output;
    };
    IndentGuidesOverlay.prototype.render = function (startLineNumber, lineNumber) {
        if (!this._renderResult) {
            return '';
        }
        var lineIndex = lineNumber - startLineNumber;
        if (lineIndex < 0 || lineIndex >= this._renderResult.length) {
            return '';
        }
        return this._renderResult[lineIndex];
    };
    return IndentGuidesOverlay;
}(DynamicViewOverlay));
export { IndentGuidesOverlay };
registerThemingParticipant(function (theme, collector) {
    var editorIndentGuidesColor = theme.getColor(editorIndentGuides);
    if (editorIndentGuidesColor) {
        collector.addRule(".monaco-editor .lines-content .cigr { box-shadow: 1px 0 0 0 " + editorIndentGuidesColor + " inset; }");
    }
    var editorActiveIndentGuidesColor = theme.getColor(editorActiveIndentGuides) || editorIndentGuidesColor;
    if (editorActiveIndentGuidesColor) {
        collector.addRule(".monaco-editor .lines-content .cigra { box-shadow: 1px 0 0 0 " + editorActiveIndentGuidesColor + " inset; }");
    }
});
