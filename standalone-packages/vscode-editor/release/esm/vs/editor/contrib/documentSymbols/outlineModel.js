/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import { binarySearch, coalesce, isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { first, forEach, size } from '../../../base/common/collections.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { fuzzyScore } from '../../../base/common/filters.js';
import { LRUCache } from '../../../base/common/map.js';
import { commonPrefixLength } from '../../../base/common/strings.js';
import { Range } from '../../common/core/range.js';
import { DocumentSymbolProviderRegistry } from '../../common/modes.js';
var TreeElement = /** @class */ (function () {
    function TreeElement() {
    }
    TreeElement.prototype.remove = function () {
        delete this.parent.children[this.id];
    };
    TreeElement.findId = function (candidate, container) {
        // complex id-computation which contains the origin/extension,
        // the parent path, and some dedupe logic when names collide
        var candidateId;
        if (typeof candidate === 'string') {
            candidateId = container.id + "/" + candidate;
        }
        else {
            candidateId = container.id + "/" + candidate.name;
            if (container.children[candidateId] !== void 0) {
                candidateId = container.id + "/" + candidate.name + "_" + candidate.range.startLineNumber + "_" + candidate.range.startColumn;
            }
        }
        var id = candidateId;
        for (var i = 0; container.children[id] !== void 0; i++) {
            id = candidateId + "_" + i;
        }
        return id;
    };
    TreeElement.getElementById = function (id, element) {
        if (!id) {
            return undefined;
        }
        var len = commonPrefixLength(id, element.id);
        if (len === id.length) {
            return element;
        }
        if (len < element.id.length) {
            return undefined;
        }
        for (var key in element.children) {
            var candidate = TreeElement.getElementById(id, element.children[key]);
            if (candidate) {
                return candidate;
            }
        }
        return undefined;
    };
    TreeElement.size = function (element) {
        var res = 1;
        for (var key in element.children) {
            res += TreeElement.size(element.children[key]);
        }
        return res;
    };
    TreeElement.empty = function (element) {
        for (var _key in element.children) {
            return false;
        }
        return true;
    };
    return TreeElement;
}());
export { TreeElement };
var OutlineElement = /** @class */ (function (_super) {
    __extends(OutlineElement, _super);
    function OutlineElement(id, parent, symbol) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.parent = parent;
        _this.symbol = symbol;
        _this.children = Object.create(null);
        _this.score = [0, []];
        return _this;
    }
    OutlineElement.prototype.adopt = function (parent) {
        var res = new OutlineElement(this.id, parent, this.symbol);
        forEach(this.children, function (entry) { return res.children[entry.key] = entry.value.adopt(res); });
        return res;
    };
    return OutlineElement;
}(TreeElement));
export { OutlineElement };
var OutlineGroup = /** @class */ (function (_super) {
    __extends(OutlineGroup, _super);
    function OutlineGroup(id, parent, provider, providerIndex) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.parent = parent;
        _this.provider = provider;
        _this.providerIndex = providerIndex;
        _this.children = Object.create(null);
        return _this;
    }
    OutlineGroup.prototype.adopt = function (parent) {
        var res = new OutlineGroup(this.id, parent, this.provider, this.providerIndex);
        forEach(this.children, function (entry) { return res.children[entry.key] = entry.value.adopt(res); });
        return res;
    };
    OutlineGroup.prototype.updateMatches = function (pattern, topMatch) {
        for (var key in this.children) {
            topMatch = this._updateMatches(pattern, this.children[key], topMatch);
        }
        return topMatch;
    };
    OutlineGroup.prototype._updateMatches = function (pattern, item, topMatch) {
        item.score = fuzzyScore(pattern, item.symbol.name, undefined, true);
        if (item.score && (!topMatch || item.score[0] > topMatch.score[0])) {
            topMatch = item;
        }
        for (var key in item.children) {
            var child = item.children[key];
            topMatch = this._updateMatches(pattern, child, topMatch);
            if (!item.score && child.score) {
                // don't filter parents with unfiltered children
                item.score = [0, []];
            }
        }
        return topMatch;
    };
    OutlineGroup.prototype.getItemEnclosingPosition = function (position) {
        return position ? this._getItemEnclosingPosition(position, this.children) : undefined;
    };
    OutlineGroup.prototype._getItemEnclosingPosition = function (position, children) {
        for (var key in children) {
            var item = children[key];
            if (!item.symbol.range || !Range.containsPosition(item.symbol.range, position)) {
                continue;
            }
            return this._getItemEnclosingPosition(position, item.children) || item;
        }
        return undefined;
    };
    OutlineGroup.prototype.updateMarker = function (marker) {
        for (var key in this.children) {
            this._updateMarker(marker, this.children[key]);
        }
    };
    OutlineGroup.prototype._updateMarker = function (markers, item) {
        item.marker = undefined;
        // find the proper start index to check for item/marker overlap.
        var idx = binarySearch(markers, item.symbol.range, Range.compareRangesUsingStarts);
        var start;
        if (idx < 0) {
            start = ~idx;
            if (start > 0 && Range.areIntersecting(markers[start - 1], item.symbol.range)) {
                start -= 1;
            }
        }
        else {
            start = idx;
        }
        var myMarkers = [];
        var myTopSev;
        for (; start < markers.length && Range.areIntersecting(item.symbol.range, markers[start]); start++) {
            // remove markers intersecting with this outline element
            // and store them in a 'private' array.
            var marker = markers[start];
            myMarkers.push(marker);
            markers[start] = undefined;
            if (!myTopSev || marker.severity > myTopSev) {
                myTopSev = marker.severity;
            }
        }
        // Recurse into children and let them match markers that have matched
        // this outline element. This might remove markers from this element and
        // therefore we remember that we have had markers. That allows us to render
        // the dot, saying 'this element has children with markers'
        for (var key in item.children) {
            this._updateMarker(myMarkers, item.children[key]);
        }
        if (myTopSev) {
            item.marker = {
                count: myMarkers.length,
                topSev: myTopSev
            };
        }
        coalesce(markers, true);
    };
    return OutlineGroup;
}(TreeElement));
export { OutlineGroup };
var OutlineModel = /** @class */ (function (_super) {
    __extends(OutlineModel, _super);
    function OutlineModel(textModel) {
        var _this = _super.call(this) || this;
        _this.textModel = textModel;
        _this.id = 'root';
        _this.parent = undefined;
        _this._groups = Object.create(null);
        _this.children = Object.create(null);
        return _this;
    }
    OutlineModel.create = function (textModel, token) {
        var key = this._keys.for(textModel);
        var data = OutlineModel._requests.get(key);
        if (!data) {
            var source = new CancellationTokenSource();
            data = {
                promiseCnt: 0,
                source: source,
                promise: OutlineModel._create(textModel, source.token),
                model: undefined,
            };
            OutlineModel._requests.set(key, data);
        }
        if (data.model) {
            // resolved -> return data
            return Promise.resolve(data.model);
        }
        // increase usage counter
        data.promiseCnt += 1;
        token.onCancellationRequested(function () {
            // last -> cancel provider request, remove cached promise
            if (--data.promiseCnt === 0) {
                data.source.cancel();
                OutlineModel._requests.delete(key);
            }
        });
        return new Promise(function (resolve, reject) {
            data.promise.then(function (model) {
                data.model = model;
                resolve(model);
            }, function (err) {
                OutlineModel._requests.delete(key);
                reject(err);
            });
        });
    };
    OutlineModel._create = function (textModel, token) {
        var result = new OutlineModel(textModel);
        var promises = DocumentSymbolProviderRegistry.ordered(textModel).map(function (provider, index) {
            var id = TreeElement.findId("provider_" + index, result);
            var group = new OutlineGroup(id, result, provider, index);
            return Promise.resolve(provider.provideDocumentSymbols(result.textModel, token)).then(function (result) {
                if (!isFalsyOrEmpty(result)) {
                    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                        var info = result_1[_i];
                        OutlineModel._makeOutlineElement(info, group);
                    }
                }
                return group;
            }, function (err) {
                onUnexpectedExternalError(err);
                return group;
            }).then(function (group) {
                if (!TreeElement.empty(group)) {
                    result._groups[id] = group;
                }
                else {
                    group.remove();
                }
            });
        });
        return Promise.all(promises).then(function () { return result._compact(); });
    };
    OutlineModel._makeOutlineElement = function (info, container) {
        var id = TreeElement.findId(info, container);
        var res = new OutlineElement(id, container, info);
        if (info.children) {
            for (var _i = 0, _a = info.children; _i < _a.length; _i++) {
                var childInfo = _a[_i];
                OutlineModel._makeOutlineElement(childInfo, res);
            }
        }
        container.children[res.id] = res;
    };
    OutlineModel.get = function (element) {
        while (element) {
            if (element instanceof OutlineModel) {
                return element;
            }
            element = element.parent;
        }
        return undefined;
    };
    OutlineModel.prototype.adopt = function () {
        var res = new OutlineModel(this.textModel);
        forEach(this._groups, function (entry) { return res._groups[entry.key] = entry.value.adopt(res); });
        return res._compact();
    };
    OutlineModel.prototype._compact = function () {
        var count = 0;
        for (var key in this._groups) {
            var group = this._groups[key];
            if (first(group.children) === undefined) { // empty
                delete this._groups[key];
            }
            else {
                count += 1;
            }
        }
        if (count !== 1) {
            //
            this.children = this._groups;
        }
        else {
            // adopt all elements of the first group
            var group = first(this._groups);
            for (var key in group.children) {
                var child = group.children[key];
                child.parent = this;
                this.children[child.id] = child;
            }
        }
        return this;
    };
    OutlineModel.prototype.merge = function (other) {
        if (this.textModel.uri.toString() !== other.textModel.uri.toString()) {
            return false;
        }
        if (size(this._groups) !== size(other._groups)) {
            return false;
        }
        this._groups = other._groups;
        this.children = other.children;
        return true;
    };
    OutlineModel.prototype.updateMatches = function (pattern) {
        if (this._matches && this._matches[0] === pattern) {
            return this._matches[1];
        }
        var topMatch;
        for (var key in this._groups) {
            topMatch = this._groups[key].updateMatches(pattern, topMatch);
        }
        this._matches = [pattern, topMatch];
        return topMatch;
    };
    OutlineModel.prototype.getItemEnclosingPosition = function (position, context) {
        var preferredGroup;
        if (context) {
            var candidate = context.parent;
            while (candidate && !preferredGroup) {
                if (candidate instanceof OutlineGroup) {
                    preferredGroup = candidate;
                }
                candidate = candidate.parent;
            }
        }
        var result = undefined;
        for (var key in this._groups) {
            var group = this._groups[key];
            result = group.getItemEnclosingPosition(position);
            if (result && (!preferredGroup || preferredGroup === group)) {
                break;
            }
        }
        return result;
    };
    OutlineModel.prototype.getItemById = function (id) {
        return TreeElement.getElementById(id, this);
    };
    OutlineModel.prototype.updateMarker = function (marker) {
        // sort markers by start range so that we can use
        // outline element starts for quicker look up
        marker.sort(Range.compareRangesUsingStarts);
        for (var key in this._groups) {
            this._groups[key].updateMarker(marker.slice(0));
        }
    };
    OutlineModel._requests = new LRUCache(9, .75);
    OutlineModel._keys = new /** @class */ (function () {
        function class_1() {
            this._counter = 1;
            this._data = new WeakMap();
        }
        class_1.prototype.for = function (textModel) {
            return textModel.id + "/" + textModel.getVersionId() + "/" + this._hash(DocumentSymbolProviderRegistry.all(textModel));
        };
        class_1.prototype._hash = function (providers) {
            var result = '';
            for (var _i = 0, providers_1 = providers; _i < providers_1.length; _i++) {
                var provider = providers_1[_i];
                var n = this._data.get(provider);
                if (typeof n === 'undefined') {
                    n = this._counter++;
                    this._data.set(provider, n);
                }
                result += n;
            }
            return result;
        };
        return class_1;
    }());
    return OutlineModel;
}(TreeElement));
export { OutlineModel };
