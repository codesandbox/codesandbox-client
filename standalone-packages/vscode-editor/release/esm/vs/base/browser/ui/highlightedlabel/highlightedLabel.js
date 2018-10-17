/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as dom from '../../dom.js';
import * as objects from '../../../common/objects.js';
import { renderOcticons } from '../octiconLabel/octiconLabel.js';
var HighlightedLabel = /** @class */ (function () {
    function HighlightedLabel(container) {
        this.domNode = document.createElement('span');
        this.domNode.className = 'monaco-highlighted-label';
        this.didEverRender = false;
        container.appendChild(this.domNode);
    }
    Object.defineProperty(HighlightedLabel.prototype, "element", {
        get: function () {
            return this.domNode;
        },
        enumerable: true,
        configurable: true
    });
    HighlightedLabel.prototype.set = function (text, highlights, title, escapeNewLines) {
        if (highlights === void 0) { highlights = []; }
        if (title === void 0) { title = ''; }
        if (!text) {
            text = '';
        }
        if (escapeNewLines) {
            // adjusts highlights inplace
            text = HighlightedLabel.escapeNewLines(text, highlights);
        }
        if (this.didEverRender && this.text === text && this.title === title && objects.equals(this.highlights, highlights)) {
            return;
        }
        if (!Array.isArray(highlights)) {
            highlights = [];
        }
        this.text = text;
        this.title = title;
        this.highlights = highlights;
        this.render();
    };
    HighlightedLabel.prototype.render = function () {
        dom.clearNode(this.domNode);
        var htmlContent = [], highlight, pos = 0;
        for (var i = 0; i < this.highlights.length; i++) {
            highlight = this.highlights[i];
            if (highlight.end === highlight.start) {
                continue;
            }
            if (pos < highlight.start) {
                htmlContent.push('<span>');
                htmlContent.push(renderOcticons(this.text.substring(pos, highlight.start)));
                htmlContent.push('</span>');
                pos = highlight.end;
            }
            htmlContent.push('<span class="highlight">');
            htmlContent.push(renderOcticons(this.text.substring(highlight.start, highlight.end)));
            htmlContent.push('</span>');
            pos = highlight.end;
        }
        if (pos < this.text.length) {
            htmlContent.push('<span>');
            htmlContent.push(renderOcticons(this.text.substring(pos)));
            htmlContent.push('</span>');
        }
        this.domNode.innerHTML = htmlContent.join('');
        this.domNode.title = this.title;
        this.didEverRender = true;
    };
    HighlightedLabel.prototype.dispose = function () {
        this.text = null;
        this.highlights = null;
    };
    HighlightedLabel.escapeNewLines = function (text, highlights) {
        var total = 0;
        var extra = 0;
        return text.replace(/\r\n|\r|\n/, function (match, offset) {
            extra = match === '\r\n' ? -1 : 0;
            offset += total;
            for (var _i = 0, highlights_1 = highlights; _i < highlights_1.length; _i++) {
                var highlight = highlights_1[_i];
                if (highlight.end <= offset) {
                    continue;
                }
                if (highlight.start >= offset) {
                    highlight.start += extra;
                }
                if (highlight.end >= offset) {
                    highlight.end += extra;
                }
            }
            total += extra;
            return '\u23CE';
        });
    };
    return HighlightedLabel;
}());
export { HighlightedLabel };
