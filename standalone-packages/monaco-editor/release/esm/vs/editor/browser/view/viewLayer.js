/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createFastDomNode } from '../../../base/browser/fastDomNode.js';
import { createStringBuilder } from '../../common/core/stringBuilder.js';
var RenderedLinesCollection = /** @class */ (function () {
    function RenderedLinesCollection(createLine) {
        this._createLine = createLine;
        this._set(1, []);
    }
    RenderedLinesCollection.prototype.flush = function () {
        this._set(1, []);
    };
    RenderedLinesCollection.prototype._set = function (rendLineNumberStart, lines) {
        this._lines = lines;
        this._rendLineNumberStart = rendLineNumberStart;
    };
    RenderedLinesCollection.prototype._get = function () {
        return {
            rendLineNumberStart: this._rendLineNumberStart,
            lines: this._lines
        };
    };
    /**
     * @returns Inclusive line number that is inside this collection
     */
    RenderedLinesCollection.prototype.getStartLineNumber = function () {
        return this._rendLineNumberStart;
    };
    /**
     * @returns Inclusive line number that is inside this collection
     */
    RenderedLinesCollection.prototype.getEndLineNumber = function () {
        return this._rendLineNumberStart + this._lines.length - 1;
    };
    RenderedLinesCollection.prototype.getCount = function () {
        return this._lines.length;
    };
    RenderedLinesCollection.prototype.getLine = function (lineNumber) {
        var lineIndex = lineNumber - this._rendLineNumberStart;
        if (lineIndex < 0 || lineIndex >= this._lines.length) {
            throw new Error('Illegal value for lineNumber');
        }
        return this._lines[lineIndex];
    };
    /**
     * @returns Lines that were removed from this collection
     */
    RenderedLinesCollection.prototype.onLinesDeleted = function (deleteFromLineNumber, deleteToLineNumber) {
        if (this.getCount() === 0) {
            // no lines
            return null;
        }
        var startLineNumber = this.getStartLineNumber();
        var endLineNumber = this.getEndLineNumber();
        if (deleteToLineNumber < startLineNumber) {
            // deleting above the viewport
            var deleteCnt = deleteToLineNumber - deleteFromLineNumber + 1;
            this._rendLineNumberStart -= deleteCnt;
            return null;
        }
        if (deleteFromLineNumber > endLineNumber) {
            // deleted below the viewport
            return null;
        }
        // Record what needs to be deleted
        var deleteStartIndex = 0;
        var deleteCount = 0;
        for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            var lineIndex = lineNumber - this._rendLineNumberStart;
            if (deleteFromLineNumber <= lineNumber && lineNumber <= deleteToLineNumber) {
                // this is a line to be deleted
                if (deleteCount === 0) {
                    // this is the first line to be deleted
                    deleteStartIndex = lineIndex;
                    deleteCount = 1;
                }
                else {
                    deleteCount++;
                }
            }
        }
        // Adjust this._rendLineNumberStart for lines deleted above
        if (deleteFromLineNumber < startLineNumber) {
            // Something was deleted above
            var deleteAboveCount = 0;
            if (deleteToLineNumber < startLineNumber) {
                // the entire deleted lines are above
                deleteAboveCount = deleteToLineNumber - deleteFromLineNumber + 1;
            }
            else {
                deleteAboveCount = startLineNumber - deleteFromLineNumber;
            }
            this._rendLineNumberStart -= deleteAboveCount;
        }
        var deleted = this._lines.splice(deleteStartIndex, deleteCount);
        return deleted;
    };
    RenderedLinesCollection.prototype.onLinesChanged = function (changeFromLineNumber, changeToLineNumber) {
        if (this.getCount() === 0) {
            // no lines
            return false;
        }
        var startLineNumber = this.getStartLineNumber();
        var endLineNumber = this.getEndLineNumber();
        var someoneNotified = false;
        for (var changedLineNumber = changeFromLineNumber; changedLineNumber <= changeToLineNumber; changedLineNumber++) {
            if (changedLineNumber >= startLineNumber && changedLineNumber <= endLineNumber) {
                // Notify the line
                this._lines[changedLineNumber - this._rendLineNumberStart].onContentChanged();
                someoneNotified = true;
            }
        }
        return someoneNotified;
    };
    RenderedLinesCollection.prototype.onLinesInserted = function (insertFromLineNumber, insertToLineNumber) {
        if (this.getCount() === 0) {
            // no lines
            return null;
        }
        var insertCnt = insertToLineNumber - insertFromLineNumber + 1;
        var startLineNumber = this.getStartLineNumber();
        var endLineNumber = this.getEndLineNumber();
        if (insertFromLineNumber <= startLineNumber) {
            // inserting above the viewport
            this._rendLineNumberStart += insertCnt;
            return null;
        }
        if (insertFromLineNumber > endLineNumber) {
            // inserting below the viewport
            return null;
        }
        if (insertCnt + insertFromLineNumber > endLineNumber) {
            // insert inside the viewport in such a way that all remaining lines are pushed outside
            var deleted = this._lines.splice(insertFromLineNumber - this._rendLineNumberStart, endLineNumber - insertFromLineNumber + 1);
            return deleted;
        }
        // insert inside the viewport, push out some lines, but not all remaining lines
        var newLines = [];
        for (var i = 0; i < insertCnt; i++) {
            newLines[i] = this._createLine();
        }
        var insertIndex = insertFromLineNumber - this._rendLineNumberStart;
        var beforeLines = this._lines.slice(0, insertIndex);
        var afterLines = this._lines.slice(insertIndex, this._lines.length - insertCnt);
        var deletedLines = this._lines.slice(this._lines.length - insertCnt, this._lines.length);
        this._lines = beforeLines.concat(newLines).concat(afterLines);
        return deletedLines;
    };
    RenderedLinesCollection.prototype.onTokensChanged = function (ranges) {
        if (this.getCount() === 0) {
            // no lines
            return false;
        }
        var startLineNumber = this.getStartLineNumber();
        var endLineNumber = this.getEndLineNumber();
        var notifiedSomeone = false;
        for (var i = 0, len = ranges.length; i < len; i++) {
            var rng = ranges[i];
            if (rng.toLineNumber < startLineNumber || rng.fromLineNumber > endLineNumber) {
                // range outside viewport
                continue;
            }
            var from = Math.max(startLineNumber, rng.fromLineNumber);
            var to = Math.min(endLineNumber, rng.toLineNumber);
            for (var lineNumber = from; lineNumber <= to; lineNumber++) {
                var lineIndex = lineNumber - this._rendLineNumberStart;
                this._lines[lineIndex].onTokensChanged();
                notifiedSomeone = true;
            }
        }
        return notifiedSomeone;
    };
    return RenderedLinesCollection;
}());
export { RenderedLinesCollection };
var VisibleLinesCollection = /** @class */ (function () {
    function VisibleLinesCollection(host) {
        var _this = this;
        this._host = host;
        this.domNode = this._createDomNode();
        this._linesCollection = new RenderedLinesCollection(function () { return _this._host.createVisibleLine(); });
    }
    VisibleLinesCollection.prototype._createDomNode = function () {
        var domNode = createFastDomNode(document.createElement('div'));
        domNode.setClassName('view-layer');
        domNode.setPosition('absolute');
        domNode.domNode.setAttribute('role', 'presentation');
        domNode.domNode.setAttribute('aria-hidden', 'true');
        return domNode;
    };
    // ---- begin view event handlers
    VisibleLinesCollection.prototype.onConfigurationChanged = function (e) {
        return e.layoutInfo;
    };
    VisibleLinesCollection.prototype.onFlushed = function (e) {
        this._linesCollection.flush();
        // No need to clear the dom node because a full .innerHTML will occur in ViewLayerRenderer._render
        return true;
    };
    VisibleLinesCollection.prototype.onLinesChanged = function (e) {
        return this._linesCollection.onLinesChanged(e.fromLineNumber, e.toLineNumber);
    };
    VisibleLinesCollection.prototype.onLinesDeleted = function (e) {
        var deleted = this._linesCollection.onLinesDeleted(e.fromLineNumber, e.toLineNumber);
        if (deleted) {
            // Remove from DOM
            for (var i = 0, len = deleted.length; i < len; i++) {
                var lineDomNode = deleted[i].getDomNode();
                if (lineDomNode) {
                    this.domNode.domNode.removeChild(lineDomNode);
                }
            }
        }
        return true;
    };
    VisibleLinesCollection.prototype.onLinesInserted = function (e) {
        var deleted = this._linesCollection.onLinesInserted(e.fromLineNumber, e.toLineNumber);
        if (deleted) {
            // Remove from DOM
            for (var i = 0, len = deleted.length; i < len; i++) {
                var lineDomNode = deleted[i].getDomNode();
                if (lineDomNode) {
                    this.domNode.domNode.removeChild(lineDomNode);
                }
            }
        }
        return true;
    };
    VisibleLinesCollection.prototype.onScrollChanged = function (e) {
        return e.scrollTopChanged;
    };
    VisibleLinesCollection.prototype.onTokensChanged = function (e) {
        return this._linesCollection.onTokensChanged(e.ranges);
    };
    VisibleLinesCollection.prototype.onZonesChanged = function (e) {
        return true;
    };
    // ---- end view event handlers
    VisibleLinesCollection.prototype.getStartLineNumber = function () {
        return this._linesCollection.getStartLineNumber();
    };
    VisibleLinesCollection.prototype.getEndLineNumber = function () {
        return this._linesCollection.getEndLineNumber();
    };
    VisibleLinesCollection.prototype.getVisibleLine = function (lineNumber) {
        return this._linesCollection.getLine(lineNumber);
    };
    VisibleLinesCollection.prototype.renderLines = function (viewportData) {
        var inp = this._linesCollection._get();
        var renderer = new ViewLayerRenderer(this.domNode.domNode, this._host, viewportData);
        var ctx = {
            rendLineNumberStart: inp.rendLineNumberStart,
            lines: inp.lines,
            linesLength: inp.lines.length
        };
        // Decide if this render will do a single update (single large .innerHTML) or many updates (inserting/removing dom nodes)
        var resCtx = renderer.render(ctx, viewportData.startLineNumber, viewportData.endLineNumber, viewportData.relativeVerticalOffset);
        this._linesCollection._set(resCtx.rendLineNumberStart, resCtx.lines);
    };
    return VisibleLinesCollection;
}());
export { VisibleLinesCollection };
var ViewLayerRenderer = /** @class */ (function () {
    function ViewLayerRenderer(domNode, host, viewportData) {
        this.domNode = domNode;
        this.host = host;
        this.viewportData = viewportData;
    }
    ViewLayerRenderer.prototype.render = function (inContext, startLineNumber, stopLineNumber, deltaTop) {
        var ctx = {
            rendLineNumberStart: inContext.rendLineNumberStart,
            lines: inContext.lines.slice(0),
            linesLength: inContext.linesLength
        };
        if ((ctx.rendLineNumberStart + ctx.linesLength - 1 < startLineNumber) || (stopLineNumber < ctx.rendLineNumberStart)) {
            // There is no overlap whatsoever
            ctx.rendLineNumberStart = startLineNumber;
            ctx.linesLength = stopLineNumber - startLineNumber + 1;
            ctx.lines = [];
            for (var x = startLineNumber; x <= stopLineNumber; x++) {
                ctx.lines[x - startLineNumber] = this.host.createVisibleLine();
            }
            this._finishRendering(ctx, true, deltaTop);
            return ctx;
        }
        // Update lines which will remain untouched
        this._renderUntouchedLines(ctx, Math.max(startLineNumber - ctx.rendLineNumberStart, 0), Math.min(stopLineNumber - ctx.rendLineNumberStart, ctx.linesLength - 1), deltaTop, startLineNumber);
        if (ctx.rendLineNumberStart > startLineNumber) {
            // Insert lines before
            var fromLineNumber = startLineNumber;
            var toLineNumber = Math.min(stopLineNumber, ctx.rendLineNumberStart - 1);
            if (fromLineNumber <= toLineNumber) {
                this._insertLinesBefore(ctx, fromLineNumber, toLineNumber, deltaTop, startLineNumber);
                ctx.linesLength += toLineNumber - fromLineNumber + 1;
            }
        }
        else if (ctx.rendLineNumberStart < startLineNumber) {
            // Remove lines before
            var removeCnt = Math.min(ctx.linesLength, startLineNumber - ctx.rendLineNumberStart);
            if (removeCnt > 0) {
                this._removeLinesBefore(ctx, removeCnt);
                ctx.linesLength -= removeCnt;
            }
        }
        ctx.rendLineNumberStart = startLineNumber;
        if (ctx.rendLineNumberStart + ctx.linesLength - 1 < stopLineNumber) {
            // Insert lines after
            var fromLineNumber = ctx.rendLineNumberStart + ctx.linesLength;
            var toLineNumber = stopLineNumber;
            if (fromLineNumber <= toLineNumber) {
                this._insertLinesAfter(ctx, fromLineNumber, toLineNumber, deltaTop, startLineNumber);
                ctx.linesLength += toLineNumber - fromLineNumber + 1;
            }
        }
        else if (ctx.rendLineNumberStart + ctx.linesLength - 1 > stopLineNumber) {
            // Remove lines after
            var fromLineNumber = Math.max(0, stopLineNumber - ctx.rendLineNumberStart + 1);
            var toLineNumber = ctx.linesLength - 1;
            var removeCnt = toLineNumber - fromLineNumber + 1;
            if (removeCnt > 0) {
                this._removeLinesAfter(ctx, removeCnt);
                ctx.linesLength -= removeCnt;
            }
        }
        this._finishRendering(ctx, false, deltaTop);
        return ctx;
    };
    ViewLayerRenderer.prototype._renderUntouchedLines = function (ctx, startIndex, endIndex, deltaTop, deltaLN) {
        var rendLineNumberStart = ctx.rendLineNumberStart;
        var lines = ctx.lines;
        for (var i = startIndex; i <= endIndex; i++) {
            var lineNumber = rendLineNumberStart + i;
            lines[i].layoutLine(lineNumber, deltaTop[lineNumber - deltaLN]);
        }
    };
    ViewLayerRenderer.prototype._insertLinesBefore = function (ctx, fromLineNumber, toLineNumber, deltaTop, deltaLN) {
        var newLines = [];
        var newLinesLen = 0;
        for (var lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
            newLines[newLinesLen++] = this.host.createVisibleLine();
        }
        ctx.lines = newLines.concat(ctx.lines);
    };
    ViewLayerRenderer.prototype._removeLinesBefore = function (ctx, removeCount) {
        for (var i = 0; i < removeCount; i++) {
            var lineDomNode = ctx.lines[i].getDomNode();
            if (lineDomNode) {
                this.domNode.removeChild(lineDomNode);
            }
        }
        ctx.lines.splice(0, removeCount);
    };
    ViewLayerRenderer.prototype._insertLinesAfter = function (ctx, fromLineNumber, toLineNumber, deltaTop, deltaLN) {
        var newLines = [];
        var newLinesLen = 0;
        for (var lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
            newLines[newLinesLen++] = this.host.createVisibleLine();
        }
        ctx.lines = ctx.lines.concat(newLines);
    };
    ViewLayerRenderer.prototype._removeLinesAfter = function (ctx, removeCount) {
        var removeIndex = ctx.linesLength - removeCount;
        for (var i = 0; i < removeCount; i++) {
            var lineDomNode = ctx.lines[removeIndex + i].getDomNode();
            if (lineDomNode) {
                this.domNode.removeChild(lineDomNode);
            }
        }
        ctx.lines.splice(removeIndex, removeCount);
    };
    ViewLayerRenderer.prototype._finishRenderingNewLines = function (ctx, domNodeIsEmpty, newLinesHTML, wasNew) {
        var lastChild = this.domNode.lastChild;
        if (domNodeIsEmpty || !lastChild) {
            this.domNode.innerHTML = newLinesHTML;
        }
        else {
            lastChild.insertAdjacentHTML('afterend', newLinesHTML);
        }
        var currChild = this.domNode.lastChild;
        for (var i = ctx.linesLength - 1; i >= 0; i--) {
            var line = ctx.lines[i];
            if (wasNew[i]) {
                line.setDomNode(currChild);
                currChild = currChild.previousSibling;
            }
        }
    };
    ViewLayerRenderer.prototype._finishRenderingInvalidLines = function (ctx, invalidLinesHTML, wasInvalid) {
        var hugeDomNode = document.createElement('div');
        hugeDomNode.innerHTML = invalidLinesHTML;
        for (var i = 0; i < ctx.linesLength; i++) {
            var line = ctx.lines[i];
            if (wasInvalid[i]) {
                var source = hugeDomNode.firstChild;
                var lineDomNode = line.getDomNode();
                lineDomNode.parentNode.replaceChild(source, lineDomNode);
                line.setDomNode(source);
            }
        }
    };
    ViewLayerRenderer.prototype._finishRendering = function (ctx, domNodeIsEmpty, deltaTop) {
        var sb = ViewLayerRenderer._sb;
        var linesLength = ctx.linesLength;
        var lines = ctx.lines;
        var rendLineNumberStart = ctx.rendLineNumberStart;
        var wasNew = [];
        {
            sb.reset();
            var hadNewLine = false;
            for (var i = 0; i < linesLength; i++) {
                var line = lines[i];
                wasNew[i] = false;
                var lineDomNode = line.getDomNode();
                if (lineDomNode) {
                    // line is not new
                    continue;
                }
                var renderResult = line.renderLine(i + rendLineNumberStart, deltaTop[i], this.viewportData, sb);
                if (!renderResult) {
                    // line does not need rendering
                    continue;
                }
                wasNew[i] = true;
                hadNewLine = true;
            }
            if (hadNewLine) {
                this._finishRenderingNewLines(ctx, domNodeIsEmpty, sb.build(), wasNew);
            }
        }
        {
            sb.reset();
            var hadInvalidLine = false;
            var wasInvalid = [];
            for (var i = 0; i < linesLength; i++) {
                var line = lines[i];
                wasInvalid[i] = false;
                if (wasNew[i]) {
                    // line was new
                    continue;
                }
                var renderResult = line.renderLine(i + rendLineNumberStart, deltaTop[i], this.viewportData, sb);
                if (!renderResult) {
                    // line does not need rendering
                    continue;
                }
                wasInvalid[i] = true;
                hadInvalidLine = true;
            }
            if (hadInvalidLine) {
                this._finishRenderingInvalidLines(ctx, sb.build(), wasInvalid);
            }
        }
    };
    ViewLayerRenderer._sb = createStringBuilder(100000);
    return ViewLayerRenderer;
}());
