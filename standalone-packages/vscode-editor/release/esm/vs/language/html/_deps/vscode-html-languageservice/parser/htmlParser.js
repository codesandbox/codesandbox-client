/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createScanner } from './htmlScanner.js';
import { findFirst } from '../utils/arrays.js';
import { isEmptyElement } from './htmlTags.js';
import { TokenType } from '../htmlLanguageTypes.js';
var Node = /** @class */ (function () {
    function Node(start, end, children, parent) {
        this.start = start;
        this.end = end;
        this.children = children;
        this.parent = parent;
        this.closed = false;
    }
    Object.defineProperty(Node.prototype, "attributeNames", {
        get: function () { return this.attributes ? Object.keys(this.attributes) : []; },
        enumerable: true,
        configurable: true
    });
    Node.prototype.isSameTag = function (tagInLowerCase) {
        return this.tag && tagInLowerCase && this.tag.length === tagInLowerCase.length && this.tag.toLowerCase() === tagInLowerCase;
    };
    Object.defineProperty(Node.prototype, "firstChild", {
        get: function () { return this.children[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "lastChild", {
        get: function () { return this.children.length ? this.children[this.children.length - 1] : void 0; },
        enumerable: true,
        configurable: true
    });
    Node.prototype.findNodeBefore = function (offset) {
        var idx = findFirst(this.children, function (c) { return offset <= c.start; }) - 1;
        if (idx >= 0) {
            var child = this.children[idx];
            if (offset > child.start) {
                if (offset < child.end) {
                    return child.findNodeBefore(offset);
                }
                var lastChild = child.lastChild;
                if (lastChild && lastChild.end === child.end) {
                    return child.findNodeBefore(offset);
                }
                return child;
            }
        }
        return this;
    };
    Node.prototype.findNodeAt = function (offset) {
        var idx = findFirst(this.children, function (c) { return offset <= c.start; }) - 1;
        if (idx >= 0) {
            var child = this.children[idx];
            if (offset > child.start && offset <= child.end) {
                return child.findNodeAt(offset);
            }
        }
        return this;
    };
    return Node;
}());
export { Node };
export function parse(text) {
    var scanner = createScanner(text);
    var htmlDocument = new Node(0, text.length, [], void 0);
    var curr = htmlDocument;
    var endTagStart = -1;
    var pendingAttribute = null;
    var token = scanner.scan();
    while (token !== TokenType.EOS) {
        switch (token) {
            case TokenType.StartTagOpen:
                var child = new Node(scanner.getTokenOffset(), text.length, [], curr);
                curr.children.push(child);
                curr = child;
                break;
            case TokenType.StartTag:
                curr.tag = scanner.getTokenText();
                break;
            case TokenType.StartTagClose:
                curr.end = scanner.getTokenEnd(); // might be later set to end tag position
                if (curr.tag && isEmptyElement(curr.tag) && curr.parent) {
                    curr.closed = true;
                    curr = curr.parent;
                }
                break;
            case TokenType.EndTagOpen:
                endTagStart = scanner.getTokenOffset();
                break;
            case TokenType.EndTag:
                var closeTag = scanner.getTokenText().toLowerCase();
                while (!curr.isSameTag(closeTag) && curr.parent) {
                    curr.end = endTagStart;
                    curr.closed = false;
                    curr = curr.parent;
                }
                if (curr !== htmlDocument) {
                    curr.closed = true;
                    curr.endTagStart = endTagStart;
                }
                break;
            case TokenType.StartTagSelfClose:
                if (curr.parent) {
                    curr.closed = true;
                    curr.end = scanner.getTokenEnd();
                    curr = curr.parent;
                }
                break;
            case TokenType.EndTagClose:
                if (curr.parent) {
                    curr.end = scanner.getTokenEnd();
                    curr = curr.parent;
                }
                break;
            case TokenType.AttributeName: {
                var attributeName = pendingAttribute = scanner.getTokenText();
                var attributes = curr.attributes;
                if (!attributes) {
                    curr.attributes = attributes = {};
                }
                attributes[pendingAttribute] = null; // Support valueless attributes such as 'checked'
                break;
            }
            case TokenType.AttributeValue: {
                var value = scanner.getTokenText();
                var attributes = curr.attributes;
                if (attributes && pendingAttribute) {
                    attributes[pendingAttribute] = value;
                    pendingAttribute = null;
                }
                break;
            }
        }
        token = scanner.scan();
    }
    while (curr.parent) {
        curr.end = text.length;
        curr.closed = false;
        curr = curr.parent;
    }
    return {
        roots: htmlDocument.children,
        findNodeBefore: htmlDocument.findNodeBefore.bind(htmlDocument),
        findNodeAt: htmlDocument.findNodeAt.bind(htmlDocument)
    };
}
//# sourceMappingURL=htmlParser.js.map