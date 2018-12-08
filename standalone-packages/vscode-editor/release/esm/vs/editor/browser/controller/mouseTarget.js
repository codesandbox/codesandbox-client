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
import * as browser from '../../../base/browser/browser.js';
import { PageCoordinates } from '../editorDom.js';
import { PartFingerprints } from '../view/viewPart.js';
import { ViewLine } from '../viewParts/lines/viewLine.js';
import { Position } from '../../common/core/position.js';
import { Range as EditorRange } from '../../common/core/range.js';
var MouseTarget = /** @class */ (function () {
    function MouseTarget(element, type, mouseColumn, position, range, detail) {
        if (mouseColumn === void 0) { mouseColumn = 0; }
        if (position === void 0) { position = null; }
        if (range === void 0) { range = null; }
        if (detail === void 0) { detail = null; }
        this.element = element;
        this.type = type;
        this.mouseColumn = mouseColumn;
        this.position = position;
        if (!range && position) {
            range = new EditorRange(position.lineNumber, position.column, position.lineNumber, position.column);
        }
        this.range = range;
        this.detail = detail;
    }
    MouseTarget._typeToString = function (type) {
        if (type === 1 /* TEXTAREA */) {
            return 'TEXTAREA';
        }
        if (type === 2 /* GUTTER_GLYPH_MARGIN */) {
            return 'GUTTER_GLYPH_MARGIN';
        }
        if (type === 3 /* GUTTER_LINE_NUMBERS */) {
            return 'GUTTER_LINE_NUMBERS';
        }
        if (type === 4 /* GUTTER_LINE_DECORATIONS */) {
            return 'GUTTER_LINE_DECORATIONS';
        }
        if (type === 5 /* GUTTER_VIEW_ZONE */) {
            return 'GUTTER_VIEW_ZONE';
        }
        if (type === 6 /* CONTENT_TEXT */) {
            return 'CONTENT_TEXT';
        }
        if (type === 7 /* CONTENT_EMPTY */) {
            return 'CONTENT_EMPTY';
        }
        if (type === 8 /* CONTENT_VIEW_ZONE */) {
            return 'CONTENT_VIEW_ZONE';
        }
        if (type === 9 /* CONTENT_WIDGET */) {
            return 'CONTENT_WIDGET';
        }
        if (type === 10 /* OVERVIEW_RULER */) {
            return 'OVERVIEW_RULER';
        }
        if (type === 11 /* SCROLLBAR */) {
            return 'SCROLLBAR';
        }
        if (type === 12 /* OVERLAY_WIDGET */) {
            return 'OVERLAY_WIDGET';
        }
        return 'UNKNOWN';
    };
    MouseTarget.toString = function (target) {
        return this._typeToString(target.type) + ': ' + target.position + ' - ' + target.range + ' - ' + target.detail;
    };
    MouseTarget.prototype.toString = function () {
        return MouseTarget.toString(this);
    };
    return MouseTarget;
}());
export { MouseTarget };
var ElementPath = /** @class */ (function () {
    function ElementPath() {
    }
    ElementPath.isTextArea = function (path) {
        return (path.length === 2
            && path[0] === 3 /* OverflowGuard */
            && path[1] === 6 /* TextArea */);
    };
    ElementPath.isChildOfViewLines = function (path) {
        return (path.length >= 4
            && path[0] === 3 /* OverflowGuard */
            && path[3] === 7 /* ViewLines */);
    };
    ElementPath.isStrictChildOfViewLines = function (path) {
        return (path.length > 4
            && path[0] === 3 /* OverflowGuard */
            && path[3] === 7 /* ViewLines */);
    };
    ElementPath.isChildOfScrollableElement = function (path) {
        return (path.length >= 2
            && path[0] === 3 /* OverflowGuard */
            && path[1] === 5 /* ScrollableElement */);
    };
    ElementPath.isChildOfMinimap = function (path) {
        return (path.length >= 2
            && path[0] === 3 /* OverflowGuard */
            && path[1] === 8 /* Minimap */);
    };
    ElementPath.isChildOfContentWidgets = function (path) {
        return (path.length >= 4
            && path[0] === 3 /* OverflowGuard */
            && path[3] === 1 /* ContentWidgets */);
    };
    ElementPath.isChildOfOverflowingContentWidgets = function (path) {
        return (path.length >= 1
            && path[0] === 2 /* OverflowingContentWidgets */);
    };
    ElementPath.isChildOfOverlayWidgets = function (path) {
        return (path.length >= 2
            && path[0] === 3 /* OverflowGuard */
            && path[1] === 4 /* OverlayWidgets */);
    };
    return ElementPath;
}());
var HitTestContext = /** @class */ (function () {
    function HitTestContext(context, viewHelper, lastViewCursorsRenderData) {
        this.model = context.model;
        this.layoutInfo = context.configuration.editor.layoutInfo;
        this.viewDomNode = viewHelper.viewDomNode;
        this.lineHeight = context.configuration.editor.lineHeight;
        this.typicalHalfwidthCharacterWidth = context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
        this.lastViewCursorsRenderData = lastViewCursorsRenderData;
        this._context = context;
        this._viewHelper = viewHelper;
    }
    HitTestContext.prototype.getZoneAtCoord = function (mouseVerticalOffset) {
        return HitTestContext.getZoneAtCoord(this._context, mouseVerticalOffset);
    };
    HitTestContext.getZoneAtCoord = function (context, mouseVerticalOffset) {
        // The target is either a view zone or the empty space after the last view-line
        var viewZoneWhitespace = context.viewLayout.getWhitespaceAtVerticalOffset(mouseVerticalOffset);
        if (viewZoneWhitespace) {
            var viewZoneMiddle = viewZoneWhitespace.verticalOffset + viewZoneWhitespace.height / 2, lineCount = context.model.getLineCount(), positionBefore = null, position = void 0, positionAfter = null;
            if (viewZoneWhitespace.afterLineNumber !== lineCount) {
                // There are more lines after this view zone
                positionAfter = new Position(viewZoneWhitespace.afterLineNumber + 1, 1);
            }
            if (viewZoneWhitespace.afterLineNumber > 0) {
                // There are more lines above this view zone
                positionBefore = new Position(viewZoneWhitespace.afterLineNumber, context.model.getLineMaxColumn(viewZoneWhitespace.afterLineNumber));
            }
            if (positionAfter === null) {
                position = positionBefore;
            }
            else if (positionBefore === null) {
                position = positionAfter;
            }
            else if (mouseVerticalOffset < viewZoneMiddle) {
                position = positionBefore;
            }
            else {
                position = positionAfter;
            }
            return {
                viewZoneId: viewZoneWhitespace.id,
                afterLineNumber: viewZoneWhitespace.afterLineNumber,
                positionBefore: positionBefore,
                positionAfter: positionAfter,
                position: position
            };
        }
        return null;
    };
    HitTestContext.prototype.getFullLineRangeAtCoord = function (mouseVerticalOffset) {
        if (this._context.viewLayout.isAfterLines(mouseVerticalOffset)) {
            // Below the last line
            var lineNumber_1 = this._context.model.getLineCount();
            var maxLineColumn_1 = this._context.model.getLineMaxColumn(lineNumber_1);
            return {
                range: new EditorRange(lineNumber_1, maxLineColumn_1, lineNumber_1, maxLineColumn_1),
                isAfterLines: true
            };
        }
        var lineNumber = this._context.viewLayout.getLineNumberAtVerticalOffset(mouseVerticalOffset);
        var maxLineColumn = this._context.model.getLineMaxColumn(lineNumber);
        return {
            range: new EditorRange(lineNumber, 1, lineNumber, maxLineColumn),
            isAfterLines: false
        };
    };
    HitTestContext.prototype.getLineNumberAtVerticalOffset = function (mouseVerticalOffset) {
        return this._context.viewLayout.getLineNumberAtVerticalOffset(mouseVerticalOffset);
    };
    HitTestContext.prototype.isAfterLines = function (mouseVerticalOffset) {
        return this._context.viewLayout.isAfterLines(mouseVerticalOffset);
    };
    HitTestContext.prototype.getVerticalOffsetForLineNumber = function (lineNumber) {
        return this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber);
    };
    HitTestContext.prototype.findAttribute = function (element, attr) {
        return HitTestContext._findAttribute(element, attr, this._viewHelper.viewDomNode);
    };
    HitTestContext._findAttribute = function (element, attr, stopAt) {
        while (element && element !== document.body) {
            if (element.hasAttribute && element.hasAttribute(attr)) {
                return element.getAttribute(attr);
            }
            if (element === stopAt) {
                return null;
            }
            element = element.parentNode;
        }
        return null;
    };
    HitTestContext.prototype.getLineWidth = function (lineNumber) {
        return this._viewHelper.getLineWidth(lineNumber);
    };
    HitTestContext.prototype.visibleRangeForPosition2 = function (lineNumber, column) {
        return this._viewHelper.visibleRangeForPosition2(lineNumber, column);
    };
    HitTestContext.prototype.getPositionFromDOMInfo = function (spanNode, offset) {
        return this._viewHelper.getPositionFromDOMInfo(spanNode, offset);
    };
    HitTestContext.prototype.getCurrentScrollTop = function () {
        return this._context.viewLayout.getCurrentScrollTop();
    };
    HitTestContext.prototype.getCurrentScrollLeft = function () {
        return this._context.viewLayout.getCurrentScrollLeft();
    };
    return HitTestContext;
}());
export { HitTestContext };
var BareHitTestRequest = /** @class */ (function () {
    function BareHitTestRequest(ctx, editorPos, pos) {
        this.editorPos = editorPos;
        this.pos = pos;
        this.mouseVerticalOffset = Math.max(0, ctx.getCurrentScrollTop() + pos.y - editorPos.y);
        this.mouseContentHorizontalOffset = ctx.getCurrentScrollLeft() + pos.x - editorPos.x - ctx.layoutInfo.contentLeft;
        this.isInMarginArea = (pos.x - editorPos.x < ctx.layoutInfo.contentLeft && pos.x - editorPos.x >= ctx.layoutInfo.glyphMarginLeft);
        this.isInContentArea = !this.isInMarginArea;
        this.mouseColumn = Math.max(0, MouseTargetFactory._getMouseColumn(this.mouseContentHorizontalOffset, ctx.typicalHalfwidthCharacterWidth));
    }
    return BareHitTestRequest;
}());
var HitTestRequest = /** @class */ (function (_super) {
    __extends(HitTestRequest, _super);
    function HitTestRequest(ctx, editorPos, pos, target) {
        var _this = _super.call(this, ctx, editorPos, pos) || this;
        _this._ctx = ctx;
        if (target) {
            _this.target = target;
            _this.targetPath = PartFingerprints.collect(target, ctx.viewDomNode);
        }
        else {
            _this.target = null;
            _this.targetPath = new Uint8Array(0);
        }
        return _this;
    }
    HitTestRequest.prototype.toString = function () {
        return "pos(" + this.pos.x + "," + this.pos.y + "), editorPos(" + this.editorPos.x + "," + this.editorPos.y + "), mouseVerticalOffset: " + this.mouseVerticalOffset + ", mouseContentHorizontalOffset: " + this.mouseContentHorizontalOffset + "\n\ttarget: " + (this.target ? this.target.outerHTML : null);
    };
    HitTestRequest.prototype.fulfill = function (type, position, range, detail) {
        if (position === void 0) { position = null; }
        if (range === void 0) { range = null; }
        if (detail === void 0) { detail = null; }
        return new MouseTarget(this.target, type, this.mouseColumn, position, range, detail);
    };
    HitTestRequest.prototype.withTarget = function (target) {
        return new HitTestRequest(this._ctx, this.editorPos, this.pos, target);
    };
    return HitTestRequest;
}(BareHitTestRequest));
var EMPTY_CONTENT_AFTER_LINES = { isAfterLines: true };
function createEmptyContentDataInLines(horizontalDistanceToText) {
    return {
        isAfterLines: false,
        horizontalDistanceToText: horizontalDistanceToText
    };
}
var MouseTargetFactory = /** @class */ (function () {
    function MouseTargetFactory(context, viewHelper) {
        this._context = context;
        this._viewHelper = viewHelper;
    }
    MouseTargetFactory.prototype.mouseTargetIsWidget = function (e) {
        var t = e.target;
        var path = PartFingerprints.collect(t, this._viewHelper.viewDomNode);
        // Is it a content widget?
        if (ElementPath.isChildOfContentWidgets(path) || ElementPath.isChildOfOverflowingContentWidgets(path)) {
            return true;
        }
        // Is it an overlay widget?
        if (ElementPath.isChildOfOverlayWidgets(path)) {
            return true;
        }
        return false;
    };
    MouseTargetFactory.prototype.createMouseTarget = function (lastViewCursorsRenderData, editorPos, pos, target) {
        var ctx = new HitTestContext(this._context, this._viewHelper, lastViewCursorsRenderData);
        var request = new HitTestRequest(ctx, editorPos, pos, target);
        try {
            var r = MouseTargetFactory._createMouseTarget(ctx, request, false);
            // console.log(r.toString());
            return r;
        }
        catch (err) {
            // console.log(err);
            return request.fulfill(0 /* UNKNOWN */);
        }
    };
    MouseTargetFactory._createMouseTarget = function (ctx, request, domHitTestExecuted) {
        // console.log(`${domHitTestExecuted ? '=>' : ''}CAME IN REQUEST: ${request}`);
        // First ensure the request has a target
        if (request.target === null) {
            if (domHitTestExecuted) {
                // Still no target... and we have already executed hit test...
                return request.fulfill(0 /* UNKNOWN */);
            }
            var hitTestResult = MouseTargetFactory._doHitTest(ctx, request);
            if (hitTestResult.position) {
                return MouseTargetFactory.createMouseTargetFromHitTestPosition(ctx, request, hitTestResult.position.lineNumber, hitTestResult.position.column);
            }
            return this._createMouseTarget(ctx, request.withTarget(hitTestResult.hitTarget), true);
        }
        // we know for a fact that request.target is not null
        var resolvedRequest = request;
        var result = null;
        result = result || MouseTargetFactory._hitTestContentWidget(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestOverlayWidget(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestMinimap(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestScrollbarSlider(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestViewZone(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestMargin(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestViewCursor(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestTextArea(ctx, resolvedRequest);
        result = result || MouseTargetFactory._hitTestViewLines(ctx, resolvedRequest, domHitTestExecuted);
        result = result || MouseTargetFactory._hitTestScrollbar(ctx, resolvedRequest);
        return (result || request.fulfill(0 /* UNKNOWN */));
    };
    MouseTargetFactory._hitTestContentWidget = function (ctx, request) {
        // Is it a content widget?
        if (ElementPath.isChildOfContentWidgets(request.targetPath) || ElementPath.isChildOfOverflowingContentWidgets(request.targetPath)) {
            var widgetId = ctx.findAttribute(request.target, 'widgetId');
            if (widgetId) {
                return request.fulfill(9 /* CONTENT_WIDGET */, null, null, widgetId);
            }
            else {
                return request.fulfill(0 /* UNKNOWN */);
            }
        }
        return null;
    };
    MouseTargetFactory._hitTestOverlayWidget = function (ctx, request) {
        // Is it an overlay widget?
        if (ElementPath.isChildOfOverlayWidgets(request.targetPath)) {
            var widgetId = ctx.findAttribute(request.target, 'widgetId');
            if (widgetId) {
                return request.fulfill(12 /* OVERLAY_WIDGET */, null, null, widgetId);
            }
            else {
                return request.fulfill(0 /* UNKNOWN */);
            }
        }
        return null;
    };
    MouseTargetFactory._hitTestViewCursor = function (ctx, request) {
        if (request.target) {
            // Check if we've hit a painted cursor
            var lastViewCursorsRenderData = ctx.lastViewCursorsRenderData;
            for (var i = 0, len = lastViewCursorsRenderData.length; i < len; i++) {
                var d = lastViewCursorsRenderData[i];
                if (request.target === d.domNode) {
                    return request.fulfill(6 /* CONTENT_TEXT */, d.position);
                }
            }
        }
        if (request.isInContentArea) {
            // Edge has a bug when hit-testing the exact position of a cursor,
            // instead of returning the correct dom node, it returns the
            // first or last rendered view line dom node, therefore help it out
            // and first check if we are on top of a cursor
            var lastViewCursorsRenderData = ctx.lastViewCursorsRenderData;
            var mouseContentHorizontalOffset = request.mouseContentHorizontalOffset;
            var mouseVerticalOffset = request.mouseVerticalOffset;
            for (var i = 0, len = lastViewCursorsRenderData.length; i < len; i++) {
                var d = lastViewCursorsRenderData[i];
                if (mouseContentHorizontalOffset < d.contentLeft) {
                    // mouse position is to the left of the cursor
                    continue;
                }
                if (mouseContentHorizontalOffset > d.contentLeft + d.width) {
                    // mouse position is to the right of the cursor
                    continue;
                }
                var cursorVerticalOffset = ctx.getVerticalOffsetForLineNumber(d.position.lineNumber);
                if (cursorVerticalOffset <= mouseVerticalOffset
                    && mouseVerticalOffset <= cursorVerticalOffset + d.height) {
                    return request.fulfill(6 /* CONTENT_TEXT */, d.position);
                }
            }
        }
        return null;
    };
    MouseTargetFactory._hitTestViewZone = function (ctx, request) {
        var viewZoneData = ctx.getZoneAtCoord(request.mouseVerticalOffset);
        if (viewZoneData) {
            var mouseTargetType = (request.isInContentArea ? 8 /* CONTENT_VIEW_ZONE */ : 5 /* GUTTER_VIEW_ZONE */);
            return request.fulfill(mouseTargetType, viewZoneData.position, null, viewZoneData);
        }
        return null;
    };
    MouseTargetFactory._hitTestTextArea = function (ctx, request) {
        // Is it the textarea?
        if (ElementPath.isTextArea(request.targetPath)) {
            return request.fulfill(1 /* TEXTAREA */);
        }
        return null;
    };
    MouseTargetFactory._hitTestMargin = function (ctx, request) {
        if (request.isInMarginArea) {
            var res = ctx.getFullLineRangeAtCoord(request.mouseVerticalOffset);
            var pos = res.range.getStartPosition();
            var offset = Math.abs(request.pos.x - request.editorPos.x);
            var detail = {
                isAfterLines: res.isAfterLines,
                glyphMarginLeft: ctx.layoutInfo.glyphMarginLeft,
                glyphMarginWidth: ctx.layoutInfo.glyphMarginWidth,
                lineNumbersWidth: ctx.layoutInfo.lineNumbersWidth,
                offsetX: offset
            };
            offset -= ctx.layoutInfo.glyphMarginLeft;
            if (offset <= ctx.layoutInfo.glyphMarginWidth) {
                // On the glyph margin
                return request.fulfill(2 /* GUTTER_GLYPH_MARGIN */, pos, res.range, detail);
            }
            offset -= ctx.layoutInfo.glyphMarginWidth;
            if (offset <= ctx.layoutInfo.lineNumbersWidth) {
                // On the line numbers
                return request.fulfill(3 /* GUTTER_LINE_NUMBERS */, pos, res.range, detail);
            }
            offset -= ctx.layoutInfo.lineNumbersWidth;
            // On the line decorations
            return request.fulfill(4 /* GUTTER_LINE_DECORATIONS */, pos, res.range, detail);
        }
        return null;
    };
    MouseTargetFactory._hitTestViewLines = function (ctx, request, domHitTestExecuted) {
        if (!ElementPath.isChildOfViewLines(request.targetPath)) {
            return null;
        }
        // Check if it is below any lines and any view zones
        if (ctx.isAfterLines(request.mouseVerticalOffset)) {
            // This most likely indicates it happened after the last view-line
            var lineCount = ctx.model.getLineCount();
            var maxLineColumn = ctx.model.getLineMaxColumn(lineCount);
            return request.fulfill(7 /* CONTENT_EMPTY */, new Position(lineCount, maxLineColumn), void 0, EMPTY_CONTENT_AFTER_LINES);
        }
        if (domHitTestExecuted) {
            // Check if we are hitting a view-line (can happen in the case of inline decorations on empty lines)
            // See https://github.com/Microsoft/vscode/issues/46942
            if (ElementPath.isStrictChildOfViewLines(request.targetPath)) {
                var lineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
                if (ctx.model.getLineLength(lineNumber) === 0) {
                    var lineWidth = ctx.getLineWidth(lineNumber);
                    var detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
                    return request.fulfill(7 /* CONTENT_EMPTY */, new Position(lineNumber, 1), void 0, detail);
                }
            }
            // We have already executed hit test...
            return request.fulfill(0 /* UNKNOWN */);
        }
        var hitTestResult = MouseTargetFactory._doHitTest(ctx, request);
        if (hitTestResult.position) {
            return MouseTargetFactory.createMouseTargetFromHitTestPosition(ctx, request, hitTestResult.position.lineNumber, hitTestResult.position.column);
        }
        return this._createMouseTarget(ctx, request.withTarget(hitTestResult.hitTarget), true);
    };
    MouseTargetFactory._hitTestMinimap = function (ctx, request) {
        if (ElementPath.isChildOfMinimap(request.targetPath)) {
            var possibleLineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
            var maxColumn = ctx.model.getLineMaxColumn(possibleLineNumber);
            return request.fulfill(11 /* SCROLLBAR */, new Position(possibleLineNumber, maxColumn));
        }
        return null;
    };
    MouseTargetFactory._hitTestScrollbarSlider = function (ctx, request) {
        if (ElementPath.isChildOfScrollableElement(request.targetPath)) {
            if (request.target && request.target.nodeType === 1) {
                var className = request.target.className;
                if (className && /\b(slider|scrollbar)\b/.test(className)) {
                    var possibleLineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
                    var maxColumn = ctx.model.getLineMaxColumn(possibleLineNumber);
                    return request.fulfill(11 /* SCROLLBAR */, new Position(possibleLineNumber, maxColumn));
                }
            }
        }
        return null;
    };
    MouseTargetFactory._hitTestScrollbar = function (ctx, request) {
        // Is it the overview ruler?
        // Is it a child of the scrollable element?
        if (ElementPath.isChildOfScrollableElement(request.targetPath)) {
            var possibleLineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
            var maxColumn = ctx.model.getLineMaxColumn(possibleLineNumber);
            return request.fulfill(11 /* SCROLLBAR */, new Position(possibleLineNumber, maxColumn));
        }
        return null;
    };
    MouseTargetFactory.prototype.getMouseColumn = function (editorPos, pos) {
        var layoutInfo = this._context.configuration.editor.layoutInfo;
        var mouseContentHorizontalOffset = this._context.viewLayout.getCurrentScrollLeft() + pos.x - editorPos.x - layoutInfo.contentLeft;
        return MouseTargetFactory._getMouseColumn(mouseContentHorizontalOffset, this._context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth);
    };
    MouseTargetFactory._getMouseColumn = function (mouseContentHorizontalOffset, typicalHalfwidthCharacterWidth) {
        if (mouseContentHorizontalOffset < 0) {
            return 1;
        }
        var chars = Math.round(mouseContentHorizontalOffset / typicalHalfwidthCharacterWidth);
        return (chars + 1);
    };
    MouseTargetFactory.createMouseTargetFromHitTestPosition = function (ctx, request, lineNumber, column) {
        var pos = new Position(lineNumber, column);
        var lineWidth = ctx.getLineWidth(lineNumber);
        if (request.mouseContentHorizontalOffset > lineWidth) {
            if (browser.isEdge && pos.column === 1) {
                // See https://github.com/Microsoft/vscode/issues/10875
                var detail_1 = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
                return request.fulfill(7 /* CONTENT_EMPTY */, new Position(lineNumber, ctx.model.getLineMaxColumn(lineNumber)), void 0, detail_1);
            }
            var detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
            return request.fulfill(7 /* CONTENT_EMPTY */, pos, void 0, detail);
        }
        var visibleRange = ctx.visibleRangeForPosition2(lineNumber, column);
        if (!visibleRange) {
            return request.fulfill(0 /* UNKNOWN */, pos);
        }
        var columnHorizontalOffset = visibleRange.left;
        if (request.mouseContentHorizontalOffset === columnHorizontalOffset) {
            return request.fulfill(6 /* CONTENT_TEXT */, pos);
        }
        var points = [];
        points.push({ offset: visibleRange.left, column: column });
        if (column > 1) {
            var visibleRange_1 = ctx.visibleRangeForPosition2(lineNumber, column - 1);
            if (visibleRange_1) {
                points.push({ offset: visibleRange_1.left, column: column - 1 });
            }
        }
        var lineMaxColumn = ctx.model.getLineMaxColumn(lineNumber);
        if (column < lineMaxColumn) {
            var visibleRange_2 = ctx.visibleRangeForPosition2(lineNumber, column + 1);
            if (visibleRange_2) {
                points.push({ offset: visibleRange_2.left, column: column + 1 });
            }
        }
        points.sort(function (a, b) { return a.offset - b.offset; });
        for (var i = 1; i < points.length; i++) {
            var prev = points[i - 1];
            var curr = points[i];
            if (prev.offset <= request.mouseContentHorizontalOffset && request.mouseContentHorizontalOffset <= curr.offset) {
                var rng = new EditorRange(lineNumber, prev.column, lineNumber, curr.column);
                return request.fulfill(6 /* CONTENT_TEXT */, pos, rng);
            }
        }
        return request.fulfill(6 /* CONTENT_TEXT */, pos);
    };
    /**
     * Most probably WebKit browsers and Edge
     */
    MouseTargetFactory._doHitTestWithCaretRangeFromPoint = function (ctx, request) {
        // In Chrome, especially on Linux it is possible to click between lines,
        // so try to adjust the `hity` below so that it lands in the center of a line
        var lineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
        var lineVerticalOffset = ctx.getVerticalOffsetForLineNumber(lineNumber);
        var lineCenteredVerticalOffset = lineVerticalOffset + Math.floor(ctx.lineHeight / 2);
        var adjustedPageY = request.pos.y + (lineCenteredVerticalOffset - request.mouseVerticalOffset);
        if (adjustedPageY <= request.editorPos.y) {
            adjustedPageY = request.editorPos.y + 1;
        }
        if (adjustedPageY >= request.editorPos.y + ctx.layoutInfo.height) {
            adjustedPageY = request.editorPos.y + ctx.layoutInfo.height - 1;
        }
        var adjustedPage = new PageCoordinates(request.pos.x, adjustedPageY);
        var r = this._actualDoHitTestWithCaretRangeFromPoint(ctx, adjustedPage.toClientCoordinates());
        if (r.position) {
            return r;
        }
        // Also try to hit test without the adjustment (for the edge cases that we are near the top or bottom)
        return this._actualDoHitTestWithCaretRangeFromPoint(ctx, request.pos.toClientCoordinates());
    };
    MouseTargetFactory._actualDoHitTestWithCaretRangeFromPoint = function (ctx, coords) {
        var range = document.caretRangeFromPoint(coords.clientX, coords.clientY);
        if (!range || !range.startContainer) {
            return {
                position: null,
                hitTarget: null
            };
        }
        // Chrome always hits a TEXT_NODE, while Edge sometimes hits a token span
        var startContainer = range.startContainer;
        var hitTarget = null;
        if (startContainer.nodeType === startContainer.TEXT_NODE) {
            // startContainer is expected to be the token text
            var parent1 = startContainer.parentNode; // expected to be the token span
            var parent2 = parent1 ? parent1.parentNode : null; // expected to be the view line container span
            var parent3 = parent2 ? parent2.parentNode : null; // expected to be the view line div
            var parent3ClassName = parent3 && parent3.nodeType === parent3.ELEMENT_NODE ? parent3.className : null;
            if (parent3ClassName === ViewLine.CLASS_NAME) {
                var p = ctx.getPositionFromDOMInfo(parent1, range.startOffset);
                return {
                    position: p,
                    hitTarget: null
                };
            }
            else {
                hitTarget = startContainer.parentNode;
            }
        }
        else if (startContainer.nodeType === startContainer.ELEMENT_NODE) {
            // startContainer is expected to be the token span
            var parent1 = startContainer.parentNode; // expected to be the view line container span
            var parent2 = parent1 ? parent1.parentNode : null; // expected to be the view line div
            var parent2ClassName = parent2 && parent2.nodeType === parent2.ELEMENT_NODE ? parent2.className : null;
            if (parent2ClassName === ViewLine.CLASS_NAME) {
                var p = ctx.getPositionFromDOMInfo(startContainer, startContainer.textContent.length);
                return {
                    position: p,
                    hitTarget: null
                };
            }
            else {
                hitTarget = startContainer;
            }
        }
        return {
            position: null,
            hitTarget: hitTarget
        };
    };
    /**
     * Most probably Gecko
     */
    MouseTargetFactory._doHitTestWithCaretPositionFromPoint = function (ctx, coords) {
        var hitResult = document.caretPositionFromPoint(coords.clientX, coords.clientY);
        if (hitResult.offsetNode.nodeType === hitResult.offsetNode.TEXT_NODE) {
            // offsetNode is expected to be the token text
            var parent1 = hitResult.offsetNode.parentNode; // expected to be the token span
            var parent2 = parent1 ? parent1.parentNode : null; // expected to be the view line container span
            var parent3 = parent2 ? parent2.parentNode : null; // expected to be the view line div
            var parent3ClassName = parent3 && parent3.nodeType === parent3.ELEMENT_NODE ? parent3.className : null;
            if (parent3ClassName === ViewLine.CLASS_NAME) {
                var p = ctx.getPositionFromDOMInfo(hitResult.offsetNode.parentNode, hitResult.offset);
                return {
                    position: p,
                    hitTarget: null
                };
            }
            else {
                return {
                    position: null,
                    hitTarget: hitResult.offsetNode.parentNode
                };
            }
        }
        return {
            position: null,
            hitTarget: hitResult.offsetNode
        };
    };
    /**
     * Most probably IE
     */
    MouseTargetFactory._doHitTestWithMoveToPoint = function (ctx, coords) {
        var resultPosition = null;
        var resultHitTarget = null;
        var textRange = document.body.createTextRange();
        try {
            textRange.moveToPoint(coords.clientX, coords.clientY);
        }
        catch (err) {
            return {
                position: null,
                hitTarget: null
            };
        }
        textRange.collapse(true);
        // Now, let's do our best to figure out what we hit :)
        var parentElement = textRange ? textRange.parentElement() : null;
        var parent1 = parentElement ? parentElement.parentNode : null;
        var parent2 = parent1 ? parent1.parentNode : null;
        var parent2ClassName = parent2 && parent2.nodeType === parent2.ELEMENT_NODE ? parent2.className : '';
        if (parent2ClassName === ViewLine.CLASS_NAME) {
            var rangeToContainEntireSpan = textRange.duplicate();
            rangeToContainEntireSpan.moveToElementText(parentElement);
            rangeToContainEntireSpan.setEndPoint('EndToStart', textRange);
            resultPosition = ctx.getPositionFromDOMInfo(parentElement, rangeToContainEntireSpan.text.length);
            // Move range out of the span node, IE doesn't like having many ranges in
            // the same spot and will act badly for lines containing dashes ('-')
            rangeToContainEntireSpan.moveToElementText(ctx.viewDomNode);
        }
        else {
            // Looks like we've hit the hover or something foreign
            resultHitTarget = parentElement;
        }
        // Move range out of the span node, IE doesn't like having many ranges in
        // the same spot and will act badly for lines containing dashes ('-')
        textRange.moveToElementText(ctx.viewDomNode);
        return {
            position: resultPosition,
            hitTarget: resultHitTarget
        };
    };
    MouseTargetFactory._doHitTest = function (ctx, request) {
        // State of the art (18.10.2012):
        // The spec says browsers should support document.caretPositionFromPoint, but nobody implemented it (http://dev.w3.org/csswg/cssom-view/)
        // Gecko:
        //    - they tried to implement it once, but failed: https://bugzilla.mozilla.org/show_bug.cgi?id=654352
        //    - however, they do give out rangeParent/rangeOffset properties on mouse events
        // Webkit:
        //    - they have implemented a previous version of the spec which was using document.caretRangeFromPoint
        // IE:
        //    - they have a proprietary method on ranges, moveToPoint: https://msdn.microsoft.com/en-us/library/ie/ms536632(v=vs.85).aspx
        // 24.08.2016: Edge has added WebKit's document.caretRangeFromPoint, but it is quite buggy
        //    - when hit testing the cursor it returns the first or the last line in the viewport
        //    - it inconsistently hits text nodes or span nodes, while WebKit only hits text nodes
        //    - when toggling render whitespace on, and hit testing in the empty content after a line, it always hits offset 0 of the first span of the line
        // Thank you browsers for making this so 'easy' :)
        if (document.caretRangeFromPoint) {
            return this._doHitTestWithCaretRangeFromPoint(ctx, request);
        }
        else if (document.caretPositionFromPoint) {
            return this._doHitTestWithCaretPositionFromPoint(ctx, request.pos.toClientCoordinates());
        }
        else if (document.body.createTextRange) {
            return this._doHitTestWithMoveToPoint(ctx, request.pos.toClientCoordinates());
        }
        return {
            position: null,
            hitTarget: null
        };
    };
    return MouseTargetFactory;
}());
export { MouseTargetFactory };
