/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var Node = /** @class */ (function () {
    function Node(element) {
        this.element = element;
    }
    return Node;
}());
var LinkedList = /** @class */ (function () {
    function LinkedList() {
    }
    LinkedList.prototype.isEmpty = function () {
        return !this._first;
    };
    LinkedList.prototype.clear = function () {
        this._first = undefined;
        this._last = undefined;
    };
    LinkedList.prototype.unshift = function (element) {
        return this.insert(element, false);
    };
    LinkedList.prototype.push = function (element) {
        return this.insert(element, true);
    };
    LinkedList.prototype.insert = function (element, atTheEnd) {
        var _this = this;
        var newNode = new Node(element);
        if (!this._first) {
            this._first = newNode;
            this._last = newNode;
        }
        else if (atTheEnd) {
            // push
            var oldLast = this._last;
            this._last = newNode;
            newNode.prev = oldLast;
            oldLast.next = newNode;
        }
        else {
            // unshift
            var oldFirst = this._first;
            this._first = newNode;
            newNode.next = oldFirst;
            oldFirst.prev = newNode;
        }
        return function () {
            for (var candidate = _this._first; candidate instanceof Node; candidate = candidate.next) {
                if (candidate !== newNode) {
                    continue;
                }
                if (candidate.prev && candidate.next) {
                    // middle
                    var anchor = candidate.prev;
                    anchor.next = candidate.next;
                    candidate.next.prev = anchor;
                }
                else if (!candidate.prev && !candidate.next) {
                    // only node
                    _this._first = undefined;
                    _this._last = undefined;
                }
                else if (!candidate.next) {
                    // last
                    _this._last = _this._last.prev;
                    _this._last.next = undefined;
                }
                else if (!candidate.prev) {
                    // first
                    _this._first = _this._first.next;
                    _this._first.prev = undefined;
                }
                // done
                break;
            }
        };
    };
    LinkedList.prototype.iterator = function () {
        var element = {
            done: undefined,
            value: undefined,
        };
        var node = this._first;
        return {
            next: function () {
                if (!node) {
                    element.done = true;
                    element.value = undefined;
                }
                else {
                    element.done = false;
                    element.value = node.element;
                    node = node.next;
                }
                return element;
            }
        };
    };
    LinkedList.prototype.toArray = function () {
        var result = [];
        for (var node = this._first; node instanceof Node; node = node.next) {
            result.push(node.element);
        }
        return result;
    };
    return LinkedList;
}());
export { LinkedList };
