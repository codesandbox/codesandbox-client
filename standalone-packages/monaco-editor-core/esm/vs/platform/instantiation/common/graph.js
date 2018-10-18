/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { isEmptyObject } from '../../../base/common/types';
import { forEach } from '../../../base/common/collections';
function newNode(data) {
    return {
        data: data,
        incoming: Object.create(null),
        outgoing: Object.create(null)
    };
}
var Graph = /** @class */ (function () {
    function Graph(_hashFn) {
        this._hashFn = _hashFn;
        this._nodes = Object.create(null);
        // empty
    }
    Graph.prototype.roots = function () {
        var ret = [];
        forEach(this._nodes, function (entry) {
            if (isEmptyObject(entry.value.outgoing)) {
                ret.push(entry.value);
            }
        });
        return ret;
    };
    Graph.prototype.insertEdge = function (from, to) {
        var fromNode = this.lookupOrInsertNode(from), toNode = this.lookupOrInsertNode(to);
        fromNode.outgoing[this._hashFn(to)] = toNode;
        toNode.incoming[this._hashFn(from)] = fromNode;
    };
    Graph.prototype.removeNode = function (data) {
        var key = this._hashFn(data);
        delete this._nodes[key];
        forEach(this._nodes, function (entry) {
            delete entry.value.outgoing[key];
            delete entry.value.incoming[key];
        });
    };
    Graph.prototype.lookupOrInsertNode = function (data) {
        var key = this._hashFn(data);
        var node = this._nodes[key];
        if (!node) {
            node = newNode(data);
            this._nodes[key] = node;
        }
        return node;
    };
    Graph.prototype.lookup = function (data) {
        return this._nodes[this._hashFn(data)];
    };
    Graph.prototype.isEmpty = function () {
        for (var _key in this._nodes) {
            return false;
        }
        return true;
    };
    Graph.prototype.toString = function () {
        var data = [];
        forEach(this._nodes, function (entry) {
            data.push(entry.key + ", (incoming)[" + Object.keys(entry.value.incoming).join(', ') + "], (outgoing)[" + Object.keys(entry.value.outgoing).join(',') + "]");
        });
        return data.join('\n');
    };
    return Graph;
}());
export { Graph };
