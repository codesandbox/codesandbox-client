/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ArrayIterator } from '../../../common/iterator.js';
var HeightMap = /** @class */ (function () {
    function HeightMap() {
        this.heightMap = [];
        this.indexes = {};
    }
    HeightMap.prototype.getContentHeight = function () {
        var last = this.heightMap[this.heightMap.length - 1];
        return !last ? 0 : last.top + last.height;
    };
    HeightMap.prototype.onInsertItems = function (iterator, afterItemId) {
        if (afterItemId === void 0) { afterItemId = null; }
        var item;
        var viewItem;
        var i, j;
        var totalSize;
        var sizeDiff = 0;
        if (afterItemId === null) {
            i = 0;
            totalSize = 0;
        }
        else {
            i = this.indexes[afterItemId] + 1;
            viewItem = this.heightMap[i - 1];
            if (!viewItem) {
                console.error('view item doesnt exist');
                return undefined;
            }
            totalSize = viewItem.top + viewItem.height;
        }
        var boundSplice = this.heightMap.splice.bind(this.heightMap, i, 0);
        var itemsToInsert = [];
        while (item = iterator.next()) {
            viewItem = this.createViewItem(item);
            viewItem.top = totalSize + sizeDiff;
            this.indexes[item.id] = i++;
            itemsToInsert.push(viewItem);
            sizeDiff += viewItem.height;
        }
        boundSplice.apply(this.heightMap, itemsToInsert);
        for (j = i; j < this.heightMap.length; j++) {
            viewItem = this.heightMap[j];
            viewItem.top += sizeDiff;
            this.indexes[viewItem.model.id] = j;
        }
        for (j = itemsToInsert.length - 1; j >= 0; j--) {
            this.onInsertItem(itemsToInsert[j]);
        }
        for (j = this.heightMap.length - 1; j >= i; j--) {
            this.onRefreshItem(this.heightMap[j]);
        }
        return sizeDiff;
    };
    HeightMap.prototype.onInsertItem = function (item) {
        // noop
    };
    // Contiguous items
    HeightMap.prototype.onRemoveItems = function (iterator) {
        var itemId;
        var viewItem;
        var startIndex = null;
        var i;
        var sizeDiff = 0;
        while (itemId = iterator.next()) {
            i = this.indexes[itemId];
            viewItem = this.heightMap[i];
            if (!viewItem) {
                console.error('view item doesnt exist');
                return;
            }
            sizeDiff -= viewItem.height;
            delete this.indexes[itemId];
            this.onRemoveItem(viewItem);
            if (startIndex === null) {
                startIndex = i;
            }
        }
        if (sizeDiff === 0) {
            return;
        }
        this.heightMap.splice(startIndex, i - startIndex + 1);
        for (i = startIndex; i < this.heightMap.length; i++) {
            viewItem = this.heightMap[i];
            viewItem.top += sizeDiff;
            this.indexes[viewItem.model.id] = i;
            this.onRefreshItem(viewItem);
        }
    };
    HeightMap.prototype.onRemoveItem = function (item) {
        // noop
    };
    HeightMap.prototype.onRefreshItemSet = function (items) {
        var _this = this;
        var sortedItems = items.sort(function (a, b) { return _this.indexes[a.id] - _this.indexes[b.id]; });
        this.onRefreshItems(new ArrayIterator(sortedItems));
    };
    // Ordered, but not necessarily contiguous items
    HeightMap.prototype.onRefreshItems = function (iterator) {
        var item;
        var viewItem;
        var newHeight;
        var i, j = null;
        var cummDiff = 0;
        while (item = iterator.next()) {
            i = this.indexes[item.id];
            for (; cummDiff !== 0 && j !== null && j < i; j++) {
                viewItem = this.heightMap[j];
                viewItem.top += cummDiff;
                this.onRefreshItem(viewItem);
            }
            viewItem = this.heightMap[i];
            newHeight = item.getHeight();
            viewItem.top += cummDiff;
            cummDiff += newHeight - viewItem.height;
            viewItem.height = newHeight;
            this.onRefreshItem(viewItem, true);
            j = i + 1;
        }
        if (cummDiff !== 0 && j !== null) {
            for (; j < this.heightMap.length; j++) {
                viewItem = this.heightMap[j];
                viewItem.top += cummDiff;
                this.onRefreshItem(viewItem);
            }
        }
    };
    HeightMap.prototype.onRefreshItem = function (item, needsRender) {
        if (needsRender === void 0) { needsRender = false; }
        // noop
    };
    HeightMap.prototype.itemsCount = function () {
        return this.heightMap.length;
    };
    HeightMap.prototype.itemAt = function (position) {
        return this.heightMap[this.indexAt(position)].model.id;
    };
    HeightMap.prototype.withItemsInRange = function (start, end, fn) {
        start = this.indexAt(start);
        end = this.indexAt(end);
        for (var i = start; i <= end; i++) {
            fn(this.heightMap[i].model.id);
        }
    };
    HeightMap.prototype.indexAt = function (position) {
        var left = 0;
        var right = this.heightMap.length;
        var center;
        var item;
        // Binary search
        while (left < right) {
            center = Math.floor((left + right) / 2);
            item = this.heightMap[center];
            if (position < item.top) {
                right = center;
            }
            else if (position >= item.top + item.height) {
                if (left === center) {
                    break;
                }
                left = center;
            }
            else {
                return center;
            }
        }
        return this.heightMap.length;
    };
    HeightMap.prototype.indexAfter = function (position) {
        return Math.min(this.indexAt(position) + 1, this.heightMap.length);
    };
    HeightMap.prototype.itemAtIndex = function (index) {
        return this.heightMap[index];
    };
    HeightMap.prototype.itemAfter = function (item) {
        return this.heightMap[this.indexes[item.model.id] + 1] || null;
    };
    HeightMap.prototype.createViewItem = function (item) {
        throw new Error('not implemented');
    };
    HeightMap.prototype.dispose = function () {
        this.heightMap = null;
        this.indexes = null;
    };
    return HeightMap;
}());
export { HeightMap };
